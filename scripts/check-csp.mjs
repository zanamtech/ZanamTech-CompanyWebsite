#!/usr/bin/env node
// CSP drift gate (Constitution V / VII). Run after `npm run build`.
// Fails if any inline <script> in dist/ lacks a matching hash in nginx/security-headers.conf,
// or if the form endpoint / analytics origins are missing from the policy.
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const conf = await readFile(join(ROOT, 'nginx/security-headers.conf'), 'utf8');
const csp = conf.match(/Content-Security-Policy "([^"]+)"/)?.[1];
if (!csp) {
  console.error('check:csp — no Content-Security-Policy found in nginx/security-headers.conf');
  process.exit(1);
}
const directive = (name) => (csp.match(new RegExp(`(?:^|;)\\s*${name} ([^;]+)`))?.[1] ?? '').split(/\s+/);

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

const errors = [];
const scriptSrc = directive('script-src');
const inlineScript = /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

for await (const file of htmlFiles(join(ROOT, 'dist'))) {
  const html = await readFile(file, 'utf8');
  for (const [, body] of html.matchAll(inlineScript)) {
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    if (!scriptSrc.includes(hash)) errors.push(`${file}: inline script hash ${hash} missing from script-src`);
  }
  if (/\sstyle="/.test(html)) errors.push(`${file}: inline style attribute conflicts with style-src 'self'`);
  if (/<style[\s>]/.test(html)) errors.push(`${file}: inline <style> conflicts with style-src 'self'`);
}

// Inlined data: fonts would be blocked by font-src 'self'.
if (!directive('font-src').includes('data:')) {
  for (const entry of await readdir(join(ROOT, 'dist/_astro'))) {
    if (!entry.endsWith('.css')) continue;
    const css = await readFile(join(ROOT, 'dist/_astro', entry), 'utf8');
    if (/url\(\s*["']?data:font/.test(css)) errors.push(`dist/_astro/${entry}: inlined data: font violates font-src`);
  }
}

const origin = (url) => new URL(url).origin;
const formOrigin = origin(process.env.PUBLIC_FORM_ENDPOINT || 'https://api.web3forms.com/submit');
if (!directive('connect-src').includes(formOrigin)) errors.push(`connect-src is missing form origin ${formOrigin}`);
if (!directive('form-action').includes(formOrigin)) errors.push(`form-action is missing form origin ${formOrigin}`);

if (process.env.PUBLIC_ANALYTICS_SRC && process.env.PUBLIC_ANALYTICS_DOMAIN) {
  const a = origin(process.env.PUBLIC_ANALYTICS_SRC);
  if (!scriptSrc.includes(a)) errors.push(`script-src is missing analytics origin ${a}`);
  if (!directive('connect-src').includes(a)) errors.push(`connect-src is missing analytics origin ${a}`);
}

if (errors.length) {
  console.error(`CSP check failed (${errors.length}):\n  ${[...new Set(errors)].join('\n  ')}`);
  process.exit(1);
}
console.log('CSP check passed: inline scripts hashed, no inline styles, required origins allow-listed.');

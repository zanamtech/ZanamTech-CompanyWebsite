#!/usr/bin/env node
// Content lint gate (Constitution III / VII).
// Fails when site source contains years-of-experience claims, pricing, or competitor names.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SCAN_DIRS = ['src', 'public'];
const EXTENSIONS = new Set(['.astro', '.md', '.mdx', '.ts', '.tsx', '.js', '.json', '.txt', '.html']);

const RULES = [
  { name: 'years-of-experience claim', re: /\b\d+\s*\+?\s*(?:years?|yrs)\b/i },
  { name: 'years-of-experience claim', re: /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty)\s*\+?\s*years?\b/i },
  { name: 'years-of-experience claim', re: /\byears?\s+of\s+(?:combined\s+)?(?:industry\s+|engineering\s+)?experience\b/i },
  { name: 'pricing (currency amount)', re: /(?:[$€£]\s?\d|\b(?:USD|PKR|EUR|GBP)\s?\d|\d\s?(?:USD|PKR|EUR|GBP)\b)/ },
  { name: 'pricing (rate)', re: /\b(?:per\s+(?:hour|month)|\/\s?(?:hr|hour|mo|month))\b/i },
  { name: 'competitor name', re: /\b(?:10\s?Pearls|Sherdil|LoomaDev|CloudTech\s+Int|RevolveAI|OctaveBytes)\b/i },
];

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf('.')))) yield full;
  }
}

const violations = [];
for (const dir of SCAN_DIRS) {
  for await (const file of walk(join(ROOT, dir))) {
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const rule of RULES) {
        const match = line.match(rule.re);
        if (match) violations.push(`${relative(ROOT, file)}:${i + 1}  ${rule.name}: "${match[0]}"`);
      }
    });
  }
}

if (violations.length) {
  console.error(`Content lint failed (${violations.length}):\n  ${violations.join('\n  ')}`);
  process.exit(1);
}
console.log('Content lint passed: no prohibited phrases, pricing, or competitor names.');

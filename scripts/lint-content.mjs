#!/usr/bin/env node
// Content lint gate (Constitution v2.0.3, Principles III and VII).
// Pass 1 scans site source line by line for prohibited claims, pricing, competitor names, team-structure claims,
// time figures and unearned status. Pass 2 checks that proof data (clients, testimonials, case studies) carries its
// verification fields and that third-party statistics in Insights cite a source.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SCAN_DIRS = ['src', 'public'];
const EXTENSIONS = new Set(['.astro', '.md', '.mdx', '.ts', '.tsx', '.js', '.json', '.txt', '.html']);

/**
 * Approved phrases (Constitution III). Removed from a line before the rules run, so they never trip a rule but any
 * other wording on the same line is still checked.
 */
const ALLOW = [
  'Written proposal within 2 business days',
  'We reply within 1 business day',
  'time-zone overlap',
  'hourly encrypted backups',
  'no uptime guarantee',
];

const COMPETITORS =
  /\b(?:10\s?Pearls|Sherdil|LoomaDev|CloudTech\s+Int|RevolveAI|OctaveBytes|Folio3|Systems\s+Limited|Arbisoft|Tkxel|Devsinc|Simform|ScienceSoft|Accenture)\b/i;

const RULES = [
  // Years, pricing, competitors (v1 rules, kept).
  { name: 'years-of-experience claim', re: /\b\d+\s*\+?\s*(?:years?|yrs)\b/i },
  { name: 'years-of-experience claim', re: /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty)\s*\+?\s*years?\b/i },
  { name: 'years-of-experience claim', re: /\byears?\s+of\s+(?:combined\s+)?(?:industry\s+|engineering\s+)?experience\b/i },
  { name: 'pricing (currency amount)', re: /(?:[$€£]\s?\d|\b(?:USD|PKR|EUR|GBP|AED|SAR)\s?\d|\d\s?(?:USD|PKR|EUR|GBP|AED|SAR)\b)/ },
  { name: 'pricing (rate)', re: /\b(?:per\s+(?:hour|month)|\/\s?(?:hr|hour|mo|month))\b/i },
  { name: 'pricing (rate)', re: /\b(?:hourly|gigs?|packages\s+from)\b/i },
  { name: 'competitor name', re: COMPETITORS },

  // Team structure and headcount.
  { name: 'team-structure claim', re: /\bdirect\s+access\s+to\s+(?:our\s+)?senior\b/i },
  { name: 'team-structure claim', re: /\b(?:our\s+)?senior\s+(?:cloud\s+)?engineering\s+team\b/i },
  { name: 'team-structure claim', re: /\bon-call\s+engineers?\b/i },
  { name: 'team-structure claim', re: /\b(?:PM-led|project[-\s]manager[-\s]led|one\s+accountable\s+lead)\b/i },
  { name: 'team-structure claim', re: /\bour\s+team\b/i },
  { name: 'headcount claim', re: /\b\d+\s*\+?\s*(?:engineers|developers|experts|specialists|consultants|architects)\b/i },
  { name: 'first-person claim', re: /(?<![\w'.])I\s+(?:am|have|will|work|deliver|build|lead|run|help|offer|manage)\b/ },

  // Over-promising.
  { name: 'guarantee wording', re: /\bguarantee(?:d|s)?\b/i },
  { name: 'guarantee wording', re: /\bzero[-\s]downtime\b/i },
  { name: 'guarantee wording', re: /\bzero[-\s]data[-\s]loss\b/i },
  // Not inside code such as calc(100%-2rem) or w-[100%].
  { name: 'guarantee wording', re: /(?<![\d.([-])100\s?%/ },
  { name: 'unqualified 24/7', re: /\b24\s?\/\s?7\b|round-the-clock/i },

  // Unearned status and location.
  { name: 'certification claim', re: /\bcertified\b/i },
  { name: 'legal suffix', re: /\b(?:Ltd|Inc|LLC)\b\.?/ },
  { name: 'offices claim', re: /\bour\s+offices?\b/i },

  // AI hosting.
  { name: 'self-hosted LLM claim', re: /\b(?:local|on-?premise|self-hosted|private)\s+LLMs?\b/i },
  { name: 'self-hosted LLM claim', re: /\bfine-tuned\s+(?:model|LLM)s?\b/i },

  // Platforms: general copy names AWS, Azure and Google Cloud together.
  { name: 'two-cloud phrasing', re: /\b(?:Azure\s+(?:and|or)\s+AWS|AWS\s+(?:and|or)\s+Azure)\b/ },

  // Time figures (clock times, zone labels, minute/hour durations). Weeks and the business-day commitments are allowed.
  { name: 'clock time', re: /\b\d{1,2}:\d{2}\b/, exemptPaths: [`public${sep}.well-known${sep}security.txt`] },
  { name: 'time-zone label', re: /\b(?:PKT|GST|GMT|BST|UTC|EST|EDT|CST|CDT|MST|MDT|PST|PDT|CET|CEST)\b/ },
  { name: 'time-zone label', re: /\b(?:UTC|GMT)\s?[+±-]\s?\d/ },
  // "(?![\w-])" keeps Tailwind classes such as "size-11 min-h-11" from matching.
  { name: 'minute/hour figure', re: /\b\d+\s*[-–]?\s*(?:minutes?|mins?|hours?|hrs?)(?![\w-])/i },
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

const stripAllowed = (line) => ALLOW.reduce((acc, phrase) => acc.split(phrase).join(' '), line);

const violations = [];

// ---- Pass 1: line rules --------------------------------------------------------------------------------------
for (const dir of SCAN_DIRS) {
  for await (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
    lines.forEach((raw, i) => {
      const line = stripAllowed(raw);
      for (const rule of RULES) {
        if (rule.exemptPaths?.includes(rel)) continue;
        const match = line.match(rule.re);
        if (match) violations.push(`${rel}:${i + 1}  ${rule.name}: "${match[0]}"`);
      }
    });
  }
}

// ---- Pass 2: verified proof data and cited statistics ---------------------------------------------------------
const read = (path) => readFile(join(ROOT, path), 'utf8').catch(() => '');
const count = (text, re) => (text.match(re) ?? []).length;

// Client logos and testimonials: every entry needs verified, permissionDate and evidence (ADR-003).
// Only value lines are counted (e.g. name: 'Acme'), never the interface declarations (name: string;).
const FIELD_VALUES = { verified: '(?:true|false)', permissionDate: `['"]`, evidence: `['"]` };
for (const [path, entryKey] of [
  ['src/data/clients.ts', /^\s*name:\s*['"]/gm],
  ['src/data/testimonials.ts', /^\s*quote:\s*['"]/gm],
]) {
  const text = await read(path);
  const entries = count(text, entryKey);
  for (const [field, value] of Object.entries(FIELD_VALUES)) {
    const found = count(text, new RegExp(`^\\s*${field}:\\s*${value}`, 'gm'));
    if (found < entries) violations.push(`${path}  proof entry missing "${field}" (${found} of ${entries} entries)`);
  }
}

// Case studies: front matter must carry verified, permissionDate and evidence.
for await (const file of walk(join(ROOT, 'src', 'content', 'case-studies'))) {
  if (!file.endsWith('.md')) continue;
  const front = (await readFile(file, 'utf8')).split(/^---\s*$/m)[1] ?? '';
  for (const field of ['verified', 'permissionDate', 'evidence']) {
    if (!new RegExp(`^${field}:`, 'm').test(front)) violations.push(`${relative(ROOT, file)}  case study missing "${field}"`);
  }
}

// Insights: a percentage in an article must sit on a line with a link, or the article must list its sources.
for await (const file of walk(join(ROOT, 'src', 'content', 'insights'))) {
  if (!file.endsWith('.md')) continue;
  const text = await readFile(file, 'utf8');
  const [, front = '', body = ''] = text.split(/^---\s*$/m);
  const hasSources = /^sources:\s*\n\s+-/m.test(front);
  body.split(/\r?\n/).forEach((line, i) => {
    if (/\d\s?%/.test(line) && !/\]\(https?:\/\//.test(line) && !hasSources) {
      violations.push(`${relative(ROOT, file)}:body ${i + 1}  third-party statistic without a source link`);
    }
  });
}

if (violations.length) {
  console.error(`Content lint failed (${violations.length}):\n  ${violations.join('\n  ')}`);
  process.exit(1);
}
console.log('Content lint passed: no prohibited claims, pricing, competitor names, time figures or unverified proof.');

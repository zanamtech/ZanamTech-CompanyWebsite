import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import jsonld from 'jsonld';
import { test, expect } from './fixtures';

// One URL per page (audit F-01, F-43, F-44, F-66 a–c). Parses the production build in dist/: canonicals, the sitemap
// and every internal link must use the same slash-less form, robots.txt must point at the sitemap, and the 404 page
// must be noindexed without a canonical.

const DIST = join(process.cwd(), 'dist');
const read = (file: string) => readFileSync(join(DIST, file), 'utf8');

/** Every built page as [public path, html], e.g. ['/about', '<!doctype html>…'] for dist/about.html. */
function builtPages(dir = DIST): [string, string][] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry): [string, string][] => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '_astro' ? [] : builtPages(full);
    if (!entry.name.endsWith('.html')) return [];
    const path = `/${relative(DIST, full).split(sep).join('/')}`.replace(/(?:\/index)?\.html$/, '') || '/';
    return [[path, readFileSync(full, 'utf8')]];
  });
}

const attr = (html: string, pattern: RegExp) => html.match(pattern)?.[1] ?? null;
const canonicalOf = (html: string) => attr(html, /<link rel="canonical" href="([^"]+)"/);

/** Read lazily: test files are collected before the web server has built dist/. */
let cache: ReturnType<typeof load> | undefined;
function load() {
  const pages = builtPages();
  const sitemap = read('sitemap-0.xml').matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g);
  return {
    pages,
    indexable: pages.filter(([path]) => path !== '/404'),
    SITE: new URL(canonicalOf(read('index.html'))!).origin,
    sitemapLocs: [...sitemap].map((m) => ({ loc: m[1], lastmod: m[2] })),
  };
}
const build = () => (cache ??= load());

test.describe('One URL per page', { tag: '@desktop' }, () => {
  test('every page is built as a file (no directory-format output)', () => {
    const { pages } = build();
    expect(pages.length).toBeGreaterThan(20);
    expect(existsSync(join(DIST, 'about.html'))).toBe(true);
    expect(existsSync(join(DIST, 'about', 'index.html'))).toBe(false);
  });

  test('canonical and og:url are the slash-less page URL', () => {
    const { indexable, SITE } = build();
    for (const [path, html] of indexable) {
      const canonical = canonicalOf(html);
      expect(canonical, path).toBe(`${SITE}${path}`);
      expect(attr(html, /<meta property="og:url" content="([^"]+)"/), path).toBe(canonical);
      expect(canonical!.endsWith('/') && path !== '/', `${path} canonical ends with a slash`).toBe(false);
    }
  });

  test('the sitemap lists exactly the canonical URLs, each with a lastmod', () => {
    const { indexable, sitemapLocs } = build();
    const canonicals = indexable.map(([, html]) => canonicalOf(html)).sort();
    expect(sitemapLocs.map((u) => u.loc).sort()).toEqual(canonicals);
    for (const { loc, lastmod } of sitemapLocs) {
      expect(lastmod, `${loc} has no lastmod`).toBeTruthy();
      expect(Number.isNaN(Date.parse(lastmod!)), `${loc} lastmod ${lastmod}`).toBe(false);
    }
  });

  test('Insights and Resources lastmod is the entry date', () => {
    const { SITE, sitemapLocs } = build();
    for (const dir of ['insights', 'resources']) {
      for (const file of readdirSync(join(process.cwd(), 'src', 'content', dir)).filter((f) => f.endsWith('.md'))) {
        const source = readFileSync(join(process.cwd(), 'src', 'content', dir, file), 'utf8');
        if (/^draft:\s*true/m.test(source)) continue;
        const date = source.match(/^date:\s*(\S+)/m)![1];
        const entry = sitemapLocs.find((u) => u.loc === `${SITE}/${dir}/${file.slice(0, -3)}`);
        expect(entry, `${dir}/${file} missing from the sitemap`).toBeTruthy();
        expect(entry!.lastmod!.slice(0, 10)).toBe(date);
      }
    }
  });

  test('every internal link uses the slash-less form and points at a built page', () => {
    const { pages } = build();
    const known = new Set(pages.map(([path]) => path));
    const bad: string[] = [];
    for (const [path, html] of pages) {
      for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)) {
        const target = href.replace(/[?#].*$/, '');
        if (target !== '/' && target.endsWith('/')) bad.push(`${path}: ${href} (trailing slash)`);
        else if (target.endsWith('.html')) bad.push(`${path}: ${href} (.html)`);
        else if (!known.has(target) && !existsSync(join(DIST, target))) bad.push(`${path}: ${href} (no such page)`);
      }
    }
    expect(bad).toEqual([]);
  });
});

test.describe('robots.txt and the sitemap index', { tag: '@desktop' }, () => {
  test('robots.txt allows crawling and points at the sitemap index', () => {
    const { SITE } = build();
    const robots = read('robots.txt');
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).not.toMatch(/^Disallow: \/\s*$/m);
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
  });

  test('the sitemap index lists the sitemap; no 404 or draft URLs', () => {
    const { SITE, sitemapLocs } = build();
    expect(read('sitemap-index.xml')).toContain(`<loc>${SITE}/sitemap-0.xml</loc>`);
    expect(sitemapLocs.some((u) => u.loc.includes('404'))).toBe(false);
  });
});

test.describe('404 page', () => {
  test('is noindexed and has no canonical', { tag: '@desktop' }, ({}) => {
    const html = read('404.html');
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(canonicalOf(html)).toBeNull();
  });

  test('an unknown URL answers 404 with the site 404 page', async ({ page }) => {
    const response = await page.goto('/no-such-page');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page not found/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
});

// Audit F-09, F-20, F-42, F-66 (d): search-result lengths, share tags and structured data, read from the build.
const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const jsonLdBlocks = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

/** Expands JSON-LD offline: schema.org is served as a plain @vocab context instead of being fetched. */
const SCHEMA = 'https://schema.org/';
const documentLoader = async (url: string) => {
  if (!url.startsWith('https://schema.org')) throw new Error(`Unexpected remote context ${url}`);
  return { contextUrl: undefined, documentUrl: url, document: { '@context': { '@vocab': SCHEMA } } };
};
type Expanded = Record<string, unknown[]>;
const ofType = (nodes: Expanded[], type: string) =>
  nodes.filter((n) => (n['@type'] as string[] | undefined)?.includes(SCHEMA + type));
const value = (node: Expanded, key: string) =>
  (node[SCHEMA + key]?.[0] as { '@value'?: unknown; '@id'?: string }) ?? {};

async function expandPage(file: string): Promise<Expanded[]> {
  const blocks = jsonLdBlocks(read(file));
  expect(blocks, `${file}: one JSON-LD block`).toHaveLength(1);
  return (await jsonld.expand(JSON.parse(blocks[0]), { documentLoader })) as Expanded[];
}

test.describe('Metadata and structured data', { tag: '@desktop' }, () => {
  test('every title is at most 60 characters and every description at most 155', () => {
    for (const [path, html] of build().pages) {
      const title = decode(attr(html, /<title>([^<]*)<\/title>/) ?? '');
      const description = decode(attr(html, /<meta name="description" content="([^"]*)"/) ?? '');
      expect(title.length, `${path} title "${title}"`).toBeLessThanOrEqual(60);
      expect(description.length, `${path} description`).toBeLessThanOrEqual(155);
      expect(description.length, `${path} description`).toBeGreaterThan(0);
    }
  });

  test('every page has share-image size and alt, British English and one valid JSON-LD graph', () => {
    for (const [path, html] of build().pages) {
      expect(html, path).toContain('<html lang="en-GB"');
      for (const tag of ['og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'og:locale']) {
        expect(attr(html, new RegExp(`<meta property="${tag}" content="([^"]+)"`)), `${path} ${tag}`).toBeTruthy();
      }
      const blocks = jsonLdBlocks(html);
      expect(blocks, `${path}: one JSON-LD block`).toHaveLength(1);
      const data = JSON.parse(blocks[0]);
      const ids = (data['@graph'] as { '@id'?: string }[]).map((n) => n['@id']).filter(Boolean);
      expect(new Set(ids).size, `${path}: duplicate @id`).toBe(ids.length);
    }
  });

  test('a service page expands to Organization, WebSite, BreadcrumbList and Service', async () => {
    const nodes = await expandPage('services/managed-cloud-devops.html');
    const [org] = ofType(nodes, 'Organization');
    expect(ofType(nodes, 'WebSite')).toHaveLength(1);
    const [crumbs] = ofType(nodes, 'BreadcrumbList');
    expect(crumbs[SCHEMA + 'itemListElement']).toHaveLength(3);
    const [service] = ofType(nodes, 'Service');
    expect(value(service, 'name')['@value']).toBe('Managed Cloud & DevOps');
    expect(value(service, 'provider')['@id']).toBe(org['@id']);
    expect(value(service, 'url')['@id'] ?? value(service, 'url')['@value']).toMatch(
      /\/services\/managed-cloud-devops$/,
    );
  });

  test('an article is og:type article and its Article node has image, dates and publisher logo', async () => {
    const html = read('insights/azure-environment-strategy.html');
    expect(attr(html, /<meta property="og:type" content="([^"]+)"/)).toBe('article');
    expect(attr(html, /<meta property="article:published_time" content="([^"]+)"/)).toMatch(/^2026-10-12T/);
    const [articleNode] = ofType(await expandPage('insights/azure-environment-strategy.html'), 'Article');
    expect(articleNode[SCHEMA + 'image']).toHaveLength(1);
    expect(value(articleNode, 'datePublished')['@value']).toMatch(/^2026-10-12T/);
    expect(value(articleNode, 'dateModified')['@value']).toBeTruthy();
    const publisher = articleNode[SCHEMA + 'publisher'][0] as Expanded;
    expect(value(publisher, 'logo')).toBeTruthy();
    expect((publisher[SCHEMA + 'logo'][0] as Expanded)[SCHEMA + 'url']).toBeTruthy();
  });
});

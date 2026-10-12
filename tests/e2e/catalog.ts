import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Service catalogue read straight from src/content/services (ADR-004: tests derive names and counts from the
 * collection instead of hard-coding them).
 */
export interface CatalogService {
  slug: string;
  name: string;
  order: number;
  pillar: string;
  flagship: boolean;
  published: boolean;
  scenarios: { kind: 'real' | 'illustrative' }[];
}

const DIR = join(process.cwd(), 'src', 'content', 'services');

const field = (frontMatter: string, key: string) =>
  frontMatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '');

export const catalog: CatalogService[] = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const fm = readFileSync(join(DIR, file), 'utf8').split(/^---\s*$/m)[1] ?? '';
    return {
      slug: file.replace(/\.md$/, ''),
      name: field(fm, 'name') ?? '',
      order: Number(field(fm, 'order')),
      pillar: field(fm, 'pillar') ?? '',
      flagship: field(fm, 'flagship') === 'true',
      published: field(fm, 'published') !== 'false',
      scenarios: [...fm.matchAll(/^\s+- kind:\s*(real|illustrative)\s*$/gm)].map((m) => ({ kind: m[1] as 'real' | 'illustrative' })),
    };
  })
  .sort((a, b) => a.order - b.order);

/** Published services in canonical (global order) sequence. */
export const published = catalog.filter((s) => s.published);
export const publishedNames = published.map((s) => s.name);
export const bySlug = (slug: string) => {
  const s = catalog.find((c) => c.slug === slug);
  if (!s) throw new Error(`Unknown service slug: ${slug}`);
  return s;
};

export const RESULTS_FOOTNOTE =
  'Results from past engagements; outcomes vary by environment. Commitments are defined per Statement of Work.';

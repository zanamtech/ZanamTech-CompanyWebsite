import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../data/site';

/** The share image every page uses, with its real pixel size (read from the PNG header at build time). */
export interface OgImage {
  path: string;
  width: number;
  height: number;
  alt: string;
  /** A 1200×630 card: Twitter/X `summary_large_image`. The square icon fallback stays `summary`. */
  large: boolean;
}

/**
 * The 1200×630 share image at public/og/default.png (audit F-20). Until that file is added, the 180×180 Apple touch
 * icon is the fallback. Builds run from the project root (npm scripts, Docker WORKDIR), so public/ is resolved from it.
 */
const DEFAULT = '/og/default.png';
const FALLBACK = '/apple-touch-icon.png';

/** Width and height from a PNG's IHDR chunk (bytes 16–23). */
function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(0, 24);
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

function resolve(): OgImage {
  const file = join(process.cwd(), 'public', DEFAULT);
  if (existsSync(file)) {
    return { path: DEFAULT, ...pngSize(file), alt: `${site.name}: ${site.tagline}`, large: true };
  }
  return {
    path: FALLBACK,
    ...pngSize(join(process.cwd(), 'public', FALLBACK)),
    alt: `${site.name} logo`,
    large: false,
  };
}

export const ogImage: OgImage = resolve();

/** The logo used in structured data (Organization `logo`, Article `publisher.logo`). */
export const logoImage = { path: FALLBACK, ...pngSize(join(process.cwd(), 'public', FALLBACK)) };

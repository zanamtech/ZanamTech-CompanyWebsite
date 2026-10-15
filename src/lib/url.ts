/**
 * The page's public path, the one URL form used by links, canonicals and the sitemap: no trailing slash, no `.html`.
 * With `build.format: 'file'`, Astro.url.pathname is `/about.html` (and `/index.html`) during the build but `/about` in
 * dev, so both forms are normalised here.
 */
export const pagePath = (url: URL): string => url.pathname.replace(/(?:\/index)?\.html$/, '').replace(/\/$/, '') || '/';

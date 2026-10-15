// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinks } from './plugins/markdown-external-links.mjs';
import { readdirSync, readFileSync } from 'node:fs';

// Sitemap <lastmod>: an Insights or Resources entry's frontmatter `date`, the build date for every other page.
const buildDate = new Date();
const contentDates = new Map();
for (const dir of ['insights', 'resources']) {
  const folder = new URL(`./src/content/${dir}/`, import.meta.url);
  for (const file of readdirSync(folder).filter((f) => f.endsWith('.md'))) {
    const date = readFileSync(new URL(file, folder), 'utf8').match(/^date:\s*(\S+)/m)?.[1];
    if (date) contentDates.set(`/${dir}/${file.slice(0, -3)}`, new Date(date));
  }
}

const site = process.env.PUBLIC_SITE_URL || 'https://www.zanamtech.com';

// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  // Typed PUBLIC_* variables (.env.example). All optional: Docker passes unset build args as empty strings, so the
  // fallbacks live where the values are used (src/lib/form-config.ts) and PUBLIC_SITE_URL is read above.
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      PUBLIC_FORM_ENDPOINT: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_FORM_ACCESS_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_ANALYTICS_DOMAIN: envField.string({ context: 'server', access: 'public', optional: true }),
      PUBLIC_ANALYTICS_SRC: envField.string({ context: 'server', access: 'public', optional: true }),
    },
  },
  // One URL per page, without a trailing slash (matches every internal link): dist/about.html is served at /about, and
  // canonicals, the sitemap and Astro.url use that form. nginx 301s the slash form (nginx/nginx.conf).
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Emit all CSS as files so the CSP can use style-src 'self' without 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  // Sätteri is Astro's default Markdown processor; configured here only to add the external-links plugin.
  markdown: { processor: satteri({ hastPlugins: [externalLinks(site)] }) },
  integrations: [
    alpinejs({ entrypoint: '/src/scripts/alpine' }),
    sitemap({
      serialize(item) {
        item.lastmod = (contentDates.get(new URL(item.url).pathname) ?? buildDate).toISOString();
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Never inline assets as data: URIs (fonts would violate font-src 'self').
    build: { assetsInlineLimit: 0 },
    resolve: {
      // Alpine's CSP build evaluates expressions without eval/new Function, so the CSP needs no 'unsafe-eval'.
      alias: { alpinejs: '@alpinejs/csp' },
    },
  },
});

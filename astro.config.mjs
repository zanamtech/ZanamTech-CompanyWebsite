// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://www.zanamtech.com',
  output: 'static',
  trailingSlash: 'ignore',
  // Emit all CSS as files so the CSP can use style-src 'self' without 'unsafe-inline'.
  build: { inlineStylesheets: 'never' },
  integrations: [react(), alpinejs({ entrypoint: '/src/scripts/alpine' }), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // Never inline assets as data: URIs (fonts would violate font-src 'self').
    build: { assetsInlineLimit: 0 },
    resolve: {
      // Alpine's CSP build evaluates expressions without eval/new Function, so the CSP needs no 'unsafe-eval'.
      alias: { alpinejs: '@alpinejs/csp' }
    }
  }
});

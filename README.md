# ZanamTech Enterprise Website

The corporate website for ZanamTech: enterprise cloud architecture, zero-trust security, DevSecOps automation,
full-stack engineering and private enterprise AI.

- **Spec, plan and tasks:** `specs/001-enterprise-website-baseline/`
- **Project principles:** `.specify/memory/constitution.md`

## Stack

| Concern | Technology |
| --- | --- |
| Framework | Astro (static output), TypeScript strict |
| Styling | Tailwind CSS v4 with semantic design tokens (`src/styles/global.css`), light default and dark toggle |
| Interactivity | Alpine.js (CSP build): theme, navigation, services menu, contact dialog, lead form |
| Motion | Framer Motion DOM engine (`framer-motion/dom`): metric counters and scroll reveal, lazy-loaded |
| Icons | Lucide, rendered at build time as static SVG (via `@astrojs/react`; no React runtime is shipped) |
| Font | Plus Jakarta Sans Variable, self-hosted |
| Hosting | Docker multi-stage build, served by `nginx:stable-alpine-slim` as a non-root user |

## Getting started

Requires Node.js 22.12 or later.

```bash
npm install
cp .env.example .env      # fill in the form endpoint and access key
npm run dev               # http://localhost:4321
```

## Environment variables

All values are public and are baked into the static build. Never commit `.env`.

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Canonical origin for canonical URLs, sitemap and robots.txt |
| `PUBLIC_FORM_ENDPOINT` | Hosted form endpoint (Web3Forms-compatible JSON API). Default: `https://api.web3forms.com/submit` |
| `PUBLIC_FORM_ACCESS_KEY` | Public, domain-restricted access key issued by the form provider |
| `PUBLIC_ANALYTICS_DOMAIN`, `PUBLIC_ANALYTICS_SRC` | Optional cookieless analytics (Plausible-compatible). The script loads only when both are set |

If you change the form endpoint or enable analytics, add the new origins to the CSP in
`nginx/security-headers.conf`. `npm run check:csp` enforces this.

## Quality gates (Constitution VII)

| Command | Checks |
| --- | --- |
| `npm run check` | `astro check`: types and templates |
| `npm run lint:content` | No years-of-experience claims, pricing or competitor names in `src/` or `public/` |
| `npm run build` | Production build to `dist/` |
| `npm run check:csp` | Inline-script hashes and required origins match the CSP; no inline styles or data: fonts |
| `npm run test:e2e` | Playwright end-to-end tests with axe WCAG 2.1 AA scans in light and dark themes, plus CSP enforcement (desktop and mobile) |
| `npm run lhci` | Lighthouse CI budgets: performance ≥ 95; accessibility, best practices and SEO = 100; LCP < 2.5 s; CLS < 0.1 |

On first run, install the test browser with `npx playwright install chromium`.

## Content

| What | Where |
| --- | --- |
| Services (9 core + roadmap) | `src/content/services/*.md`, validated by the schema in `src/content.config.ts` |
| Target metrics | `src/data/metrics.ts`. Always framed as targets, with the SOW footnote |
| Engagement phases and models | `src/data/engagement.ts` |
| Target segments | `src/data/segments.ts` |
| Navigation, CTAs, pillars | `src/data/site.ts` |

Brand rules (Constitution III):

- Strictly corporate tone.
- No years-of-experience claims, public pricing or competitor names.
- Worked examples are labelled "Representative Engagement Scenarios".
- Roadmap items are labelled "In Development".

## Docker

```bash
docker build -t zanamtech-web \
  --build-arg PUBLIC_SITE_URL=https://www.zanamtech.com \
  --build-arg PUBLIC_FORM_ACCESS_KEY=<key> .
docker image ls zanamtech-web          # target: < 25 MB
docker run --rm -p 8080:8080 zanamtech-web
```

The build stage runs the content lint, the build and the CSP check. The runtime image contains only `dist/` and the
Nginx configuration:

- Security headers (CSP, HSTS, framing and MIME protections)
- gzip compression
- Long-lived caching for fingerprinted assets
- A branded 404 page

## Project structure

```text
src/
  components/{layout,sections,ui}/   Header, footer, page sections, primitives
  components/ContactForm.astro       Lead form (dialog and /contact)
  components/ContactModal.astro      Native <dialog> contact modal
  content/services/                  Service content collection
  data/                              Typed site data
  layouts/BaseLayout.astro           SEO, no-flash theme script, JSON-LD
  lib/                               Lead validation/submission, service helpers
  pages/                             Home, services, approach, industries, about, contact, privacy, 404
  scripts/                           Alpine setup, metric counters, reveal
nginx/                               nginx.conf and security headers
scripts/                             Content lint and CSP check
tests/e2e/                           Playwright suites
```

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
| `npm run lint:content` | Constitution III/VII content rules in `src/` and `public/`: years, pricing, competitors, team-structure, guarantee and time-figure wording, unearned status, self-hosted LLM claims, two-cloud phrasing, and verified-proof fields |
| `npm run build` | Production build to `dist/` |
| `npm run check:csp` | Inline-script hashes and required origins match the CSP; no inline styles or data: fonts |
| `npm run test:e2e` | Playwright end-to-end tests with axe WCAG 2.1 AA scans in light and dark themes, plus CSP enforcement (desktop and mobile) |
| `npm run lhci` | Lighthouse CI budgets: performance ≥ 95; accessibility, best practices and SEO = 100; LCP < 2.5 s; CLS < 0.1 |

On first run, install the test browser with `npx playwright install chromium`.

The tests always build and serve a fresh production preview on a free port, never a running dev server. Set `PLAYWRIGHT_PORT` to pin the port (for example `PLAYWRIGHT_PORT=4330 npm run test:e2e`); the run fails if that port is already in use.

## Content

| What | Where |
| --- | --- |
| Services: flagship + 12 in 4 pillars | `src/content/services/*.md` (schema in `src/content.config.ts`). Set `published: false` to hide a service everywhere |
| Pillars, published-services lookup | `src/lib/services.ts` |
| Results from past engagements | `src/data/results.ts`. Achieved results with context, plus the past-engagements footnote |
| Retainer tiers, severity levels | `src/data/managed-tiers.ts`. Coverage wording only; response targets live in each SOW |
| Entry offers, commitments, Home FAQ | `src/data/offers.ts`, `src/data/commitments.ts`, `src/data/faq.ts` |
| Engagement phases, models, cadence, access, AI-tool policy | `src/data/engagement.ts` |
| Target segments | `src/data/segments.ts` |
| Leadership profile | `src/data/leadership.ts`. Empty LinkedIn/photo values stay hidden |
| Client logos, testimonials, case studies | `src/data/clients.ts`, `src/data/testimonials.ts`, `src/content/case-studies/`. Render only with `verified: true`, `permissionDate` and `evidence` |
| Insights articles, sample artefacts | `src/content/insights/`, `src/content/resources/`. `draft: true` shows only in `npm run dev` |
| Navigation, CTA, pillars, contact emails | `src/data/site.ts` |
| Retired service URLs (301) | `nginx/nginx.conf` |

Brand, content and proof rules (Constitution III, v2.0.4):

- Strictly corporate tone. No years-of-experience claims, public pricing or competitor names.
- Testimonials, client logos, case studies and badges render only from verified, permissioned data.
  Fabricated or placeholder proof is never allowed.
- Past-project % are worded as achieved results, with the past-engagements footnote.
- No team-structure claims, clock times, time zones, minute/hour figures, address, or "guarantee" wording.
- AWS, Azure and Google Cloud are named together wherever a cloud is named.
- The visual design and animations are frozen (Constitution IV).

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

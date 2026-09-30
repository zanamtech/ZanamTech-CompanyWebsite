# Implementation Plan: ZanamTech Enterprise Website (Baseline)

**Branch**: `001-enterprise-website-baseline` | **Date**: 2026-09-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-enterprise-website-baseline/spec.md`

## Summary

A static, multi-page corporate website (~16 pages) positioning ZanamTech as an enterprise-grade,
high-availability, zero-trust-security engineering partner. The approach: Astro static output, Tailwind v4
design tokens with glassmorphism and a light-default/dark-toggle theme, Alpine.js for global UI state
(theme, navigation, contact dialog, form), Framer Motion's DOM engine for metric counters and
reveal-on-scroll (lazy-loaded, no client React — ADR-001), a hosted form endpoint for leads, and a multi-stage Docker build served by Nginx
with strict security headers.

## Technical Context

**Language/Version**: TypeScript (strict), Node.js ≥ 22.12
**Primary Dependencies**: Astro ^7.3 (satisfies the "Astro 4.0+" mandate), Tailwind CSS ^4.3 via `@tailwindcss/vite`,
`@astrojs/alpinejs` + `alpinejs` ^3 (CSP build), `@astrojs/react` + React ^19 (build-time Lucide rendering only),
`framer-motion` ^13, `lucide-react` (rendered server-side to static SVG), `@fontsource-variable/plus-jakarta-sans`, `@astrojs/sitemap`
**Storage**: N/A — content in Astro content collections (`src/content/services/*.md`) and typed data modules
**Testing**: `astro check`; Playwright + `@axe-core/playwright` (light and dark); Lighthouse CI; content lint script
**Target Platform**: Evergreen browsers (last 2 versions), mobile-first; Nginx (`stable-alpine-slim`, non-root) container
**Project Type**: Static web site (single project)
**Performance Goals**: Lighthouse perf ≥ 95; LCP < 2.5 s; CLS < 0.1; INP < 200 ms
**Constraints**: < 100 KB gzipped JS per page; image < 25 MB; WCAG 2.1 AA in both themes; no secrets in repo
**Scale/Scope**: ~16 pages, 9 service entries + 1 roadmap entry, 1 form

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Static-First Performance | `output: 'static'`; JS limited to Alpine (~15 KB gz) + islands on pages that use them | PASS (React runtime tracked below) |
| II. Accessibility & HCI | Palette contrast measured (see Design System); focus rings, 44 px targets, reduced-motion reset in tokens | PASS |
| III. Brand & Content Integrity | Content lint in CI; copy rewritten from docs without years claims; targets + footnote | PASS |
| IV. Design-System Discipline | Semantic CSS variables in `global.css`; glass has `@supports` fallback; gradient accent-only | PASS |
| V. Zero-Trust Security & Privacy | Nginx CSP/HSTS/etc.; `.env` for form key; cookieless analytics; honeypot | PASS |
| VI. Mandated Stack | Astro, Tailwind, Framer Motion, Alpine, Lucide, Docker/Nginx all used | PASS |
| VII. Verification Gates | `check`, `lint:content`, `test:e2e`, `lhci` scripts wired | PASS |

Post-design re-check: PASS.

## Design System (UI-UX-Pro-Max: "Trust & Authority + Conversion", "Accessible & Ethical")

Typeface: Plus Jakarta Sans Variable (self-hosted). Density 3 (spacious), motion 4 (subtle), variance 4.
Anti-pattern avoided: saturated "AI" purple/pink gradients behind content.

| Token | Light | Dark | Measured contrast |
|---|---|---|---|
| `--bg` / `--fg` | `#F8FAFC` / `#0F172A` | `#0B1120` / `#F8FAFC` | 17.9 / 18.8 |
| `--muted` (secondary text) | `#475569` | `#94A3B8` | 7.2 / 7.4 |
| `--brand-cyan` (fills/icons only) | `#21A0FF` | `#21A0FF` | never text on light (2.79) |
| `--link` | `#0A66B8` | `#5FB8FF` | 5.82 / 8.78 |
| `--accent` (purple text) | `#7A2BFF` | `#A78BFA` | 5.81 / 6.92 |
| `--cta` / `--cta-fg` | `#6A1FE0` / `#FFFFFF` | same | 7.28 |
| `--glass` | `rgba(255,255,255,.65)` + blur 14px | `rgba(15,23,42,.55)` + blur 14px | opaque fallback `--surface` |

Layout benchmark (enterprise consultancy convention): sticky glass header with Services mega-menu → hero with
pillar chips and dual CTA → capability proof strip → services grid → metrics → process timeline →
industries → CTA band → rich footer.

## Project Structure

### Documentation (this feature)

```text
specs/001-enterprise-website-baseline/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── lead-submission.md
│   └── service-content.schema.json
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/        # Header, Footer, ThemeToggle, Logo
│   ├── sections/      # Hero, ProofStrip, ServicesGrid, ServiceCard, Metrics, Process, Industries, CtaBand, RoadmapCard
│   ├── ui/            # Button, GlassCard, Badge, Icon
│   ├── ContactForm.astro
│   └── ContactModal.astro
├── content/services/  # 9 service markdown entries + 1 roadmap entry
├── content.config.ts
├── data/              # metrics.ts, engagement.ts, segments.ts, site.ts
├── layouts/BaseLayout.astro
├── lib/lead.ts
├── pages/             # index, about, approach, industries, contact, privacy, 404, services/{index,[slug]}
├── scripts/           # alpine.ts, metric-counters.ts, reveal.ts (Framer Motion DOM engine — ADR-001)
└── styles/global.css
public/assets/         # ZanamTechLogo.png, icon.png
scripts/lint-content.mjs
tests/e2e/
nginx/{nginx.conf,security-headers.conf}   # hardened runtime + strict CSP (ADR-002)
scripts/check-csp.mjs                       # CSP drift gate
Dockerfile, .dockerignore, .env.example, lighthouserc.json, playwright.config.ts
```

**Structure Decision**: Single static Astro project; starter files (`Welcome.astro`, `Layout.astro`, `src/assets/*.svg`) removed.

## Key Decisions

1. **Hybrid interactivity** — Alpine.js owns global UI state; Framer Motion runs via its DOM engine
   (`framer-motion/dom`), lazy-loaded from plain modules; React is build-time only (Lucide SVG).
   *Superseded original choice (React islands) — see [ADR-001](../../history/adr/001-client-interactivity-and-motion-runtime.md).*
2. **Static site + hosted form endpoint** — no server runtime; form posts JSON to a Web3Forms-class endpoint
   configured by `PUBLIC_FORM_ENDPOINT`/`PUBLIC_FORM_ACCESS_KEY` (a public, domain-restricted key).
3. **No-flash theme** — inline head script applies `.dark` from `localStorage` before paint; default light
   (allowed by CSP hash).
4. **Edge security posture** — strict hash-based CSP without `unsafe-inline`/`unsafe-eval`, Alpine CSP build,
   CSP-clean build output, hardened non-root Nginx slim runtime, `check:csp` + CSP e2e guardrails.
   See [ADR-002](../../history/adr/002-edge-security-posture-strict-csp.md).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| ~~React runtime (~45 KB gz) on pages with counters/reveal~~ — **resolved** | Premise was false: `framer-motion/dom` needs no React. Measured React-island build was 110 KB gz (over budget) | See [ADR-001](../../history/adr/001-client-interactivity-and-motion-runtime.md); no client React ships |

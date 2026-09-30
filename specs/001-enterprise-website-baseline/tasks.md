---
description: "Task list for ZanamTech Enterprise Website (Baseline)"
---

# Tasks: ZanamTech Enterprise Website (Baseline)

**Input**: Design documents from `/specs/001-enterprise-website-baseline/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included — Constitution Principle VII mandates e2e + accessibility + Lighthouse gates.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Add dependencies to `package.json`: `@astrojs/react`, `react`, `react-dom`, `@astrojs/alpinejs`, `alpinejs`, `@types/alpinejs`, `framer-motion`, `lucide-react`, `@fontsource-variable/plus-jakarta-sans`, `@astrojs/sitemap`; dev: `@astrojs/check`, `typescript`, `@types/react`, `@types/react-dom`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`
- [X] T002 Update `astro.config.mjs`: `output: 'static'`, `site`, `react()`, `alpinejs({ entrypoint: '/src/scripts/alpine' })`, keep Tailwind vite plugin
- [X] T003 [P] Create `.env.example` (`PUBLIC_FORM_ENDPOINT`, `PUBLIC_FORM_ACCESS_KEY`, `PUBLIC_ANALYTICS_DOMAIN`, `PUBLIC_ANALYTICS_SRC`, `PUBLIC_SITE_URL`) and ensure `.env*` (except `.env.example`) is git-ignored in `.gitignore`
- [X] T004 [P] Remove starter files `src/components/Welcome.astro`, `src/assets/astro.svg`, `src/assets/background.svg`, `src/layouts/Layout.astro`
- [X] T005 [P] Add scripts to `package.json`: `check`, `lint:content`, `test:e2e`, `lhci`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T006 Define design tokens in `src/styles/global.css`: light/dark CSS variables, `@custom-variant dark`, `@theme` mapping, `.glass` with `@supports` fallback, focus ring, reduced-motion reset
- [X] T007 [P] Self-host Plus Jakarta Sans Variable via fontsource import in `src/styles/global.css`
- [X] T008 Create `src/layouts/BaseLayout.astro`: SEO props (title, description, canonical, OG), skip link, inline no-flash theme script (default light), global CSS, Header, slot, Footer
- [X] T009 [P] Create `src/components/ui/Button.astro` (primary/secondary variants, ≥ 44 px, focus ring, `href` fallback)
- [X] T010 [P] Create `src/components/ui/GlassCard.astro` and `src/components/ui/Badge.astro`
- [X] T011 [P] Create `src/components/layout/Footer.astro` (logo, services list, company links, privacy, ©)
- [X] T012 Create `src/components/layout/Header.astro`: sticky glass nav, logo `public/assets/ZanamTechLogo.png`, primary links, Alpine mobile menu, CTA, theme toggle slot
- [X] T013 [P] Create `src/scripts/alpine.ts` (Alpine entrypoint; `theme` store)
- [X] T014 [P] Create `scripts/lint-content.mjs` (fails on years-of-experience phrasing, currency/price patterns, competitor names in `src/`)
- [X] T015 [P] Create `playwright.config.ts` and `tests/e2e/fixtures.ts` (axe helper for light and dark)
- [X] T016 [P] Create `lighthouserc.json` with constitution budgets
- [X] T016a [P] Create `src/data/site.ts` (site name, nav links, CTA labels, pillars, footnote text)

**Checkpoint**: `npm run build && npm run check` pass; an empty page renders with the layout.

---

## Phase 3: User Story 1 - Hero & Brand (Priority: P1) 🎯 MVP

**Goal**: Home page communicates enterprise-grade / high-availability / zero-trust positioning with both CTAs.
**Independent Test**: `/` shows Option A headline, three pillars, both CTAs above the fold at 1440 px; axe clean.

- [X] T017 [P] [US1] E2E test `tests/e2e/home.spec.ts`: h1 text, both CTAs, three pillars, no pricing, axe light+dark
- [X] T018 [P] [US1] Create `src/components/sections/Hero.astro` (headline, subheadline, pillar chips, CTAs, mesh background)
- [X] T019 [P] [US1] Create `src/components/sections/ProofStrip.astro` (capability platforms as text badges)
- [X] T020 [P] [US1] Create `src/components/sections/CtaBand.astro`
- [X] T021 [US1] Compose `src/pages/index.astro`: Hero → ProofStrip → (Services) → (Metrics) → (Process) → CtaBand; CTAs link to `/contact`
- [X] T021a [P] [US1] Create `src/components/sections/Pillars.astro` (three positioning pillars expanded) and insert after ProofStrip; brand assets trimmed into `src/assets/brand/`, favicons generated in `public/`

**Checkpoint**: US1 independently testable.

---

## Phase 4: User Story 2 - Services (Priority: P1)

- [X] T022 [P] [US2] E2E test `tests/e2e/services.spec.ts`
- [X] T023 [US2] Collection schema in `src/content.config.ts` per `contracts/service-content.schema.json`
- [X] T024 [P] [US2] Content: `cloud-migration-containerization.md`, `enterprise-security-waf-hardening.md`, `high-availability-disaster-recovery.md` in `src/content/services/`
- [X] T025 [P] [US2] Content: `cicd-pipeline-workflow-automation.md`, `observability-monitoring.md`, `cloud-cost-optimization.md`
- [X] T026 [P] [US2] Content: `full-stack-web-app-development.md`, `enterprise-ai-integration.md`, `managed-infrastructure-24-7.md`
- [X] T027 [P] [US2] `src/components/sections/ServiceCard.astro`
- [X] T028 [US2] `src/components/sections/ServicesGrid.astro` + insert into `src/pages/index.astro`
- [X] T029 [US2] `src/pages/services/index.astro` (grouped grid)
- [X] T030 [US2] `src/pages/services/[slug].astro` (detail with scenarios, footnote, CTA, related)
- [X] T031 [US2] Services mega-menu in `src/components/layout/Header.astro`

---

## Phase 5: User Story 3 - Contact Modal & Lead Submission (Priority: P2)

- [X] T032 [P] [US3] E2E test `tests/e2e/contact.spec.ts` (mocked endpoint)
- [X] T033 [P] [US3] `src/lib/lead.ts` (validation + `submitLead()` per contract)
- [X] T034 [US3] `src/components/ContactForm.astro`
- [X] T035 [US3] `src/components/ContactModal.astro` + mount in `BaseLayout.astro`
- [X] T036 [US3] Wire CTAs (`data-contact-cta`) across Button/Hero/CtaBand/Header/[slug]
- [X] T037 [P] [US3] `src/pages/contact.astro` and `src/pages/privacy.astro`

---

## Phase 6: User Story 4 - Metric Counters (Priority: P2)

- [X] T038 [P] [US4] E2E test `tests/e2e/metrics.spec.ts`
- [X] T039 [P] [US4] `src/data/metrics.ts`
- [X] T040 [US4] Count-up via Framer Motion DOM engine in `src/scripts/metric-counters.ts` (lazy-loaded; replaces the planned React island `MetricCounter.tsx` to meet the Constitution I JS budget — see ADR suggestion)
- [X] T041 [US4] `src/components/sections/Metrics.astro` + insert into `src/pages/index.astro`

---

## Phase 7: User Story 5 - Approach, Industries & About (Priority: P3)

- [X] T042 [P] [US5] `src/data/engagement.ts` and `src/data/segments.ts`
- [X] T043 [P] [US5] `src/components/sections/Process.astro` + insert into `src/pages/index.astro`
- [X] T044 [P] [US5] `src/pages/approach.astro`
- [X] T045 [P] [US5] `src/components/sections/Industries.astro` and `src/pages/industries.astro`
- [X] T046 [P] [US5] `src/pages/about.astro`
- [X] T047 [P] [US5] E2E test `tests/e2e/approach-industries.spec.ts`

---

## Phase 8: User Story 6 - Roadmap (Priority: P3)

- [X] T048 [US6] `src/content/services/agentic-ai-llmops.md` (`status: roadmap`)
- [X] T049 [US6] `src/components/sections/RoadmapCard.astro` rendered in `src/pages/services/index.astro`
- [X] T050 [P] [US6] Extend `tests/e2e/services.spec.ts` with roadmap assertions

---

## Phase 9: User Story 7 - Theme Toggle & Accessible Browsing (Priority: P3)

- [X] T051 [US7] `src/components/layout/ThemeToggle.astro` (Alpine `theme` store, `aria-pressed`, persistence, reduced-motion aware)
- [X] T052 [P] [US7] E2E test `tests/e2e/theme-a11y.spec.ts`
- [X] T053 [US7] Contrast audit of glass surfaces in dark tokens in `src/styles/global.css`

---

## Phase 10: Polish & Cross-Cutting Concerns

- [X] T054 [P] `src/pages/404.astro`
- [X] T055 [P] Cookieless analytics in `BaseLayout.astro` (env-gated)
- [X] T056 [P] `@astrojs/sitemap`, `src/pages/robots.txt.ts` (generated from `site`), Organization JSON-LD
- [X] T057 [P] Scroll reveal via Framer Motion DOM engine in `src/scripts/reveal.ts` (replaces planned `Reveal.tsx`; no React runtime) applied to pillars/services/process/industries groups
- [X] T058 `nginx/nginx.conf` + `nginx/security-headers.conf` (gzip, caching, 404, non-root, strict CSP without `unsafe-inline`/`unsafe-eval` via Alpine CSP build); `scripts/check-csp.mjs` + `tests/e2e/security.spec.ts` guard drift
- [X] T059 Multi-stage `Dockerfile` (`node:22-alpine` → `nginx:stable-alpine-slim`) + `.dockerignore`
- [ ] T060 Verify image < 25 MB — BLOCKED: Docker is not installed on this workstation; run `docker build -t zanamtech-web . && docker image ls zanamtech-web`
- [ ] T061 Run all gates and fix failures
- [X] T062 [P] Update `README.md`

---

## Dependencies & Execution Order

- Setup → Foundational → user stories. US1 + US2 = MVP. US3–US7 independent after Foundational, except T036 (touches US1/US2 CTAs) and US6 (reuses T023 schema).
- Within a phase, [P] tasks touch different files.

## Implementation Strategy

MVP = Phases 1–4. Then US3 → US4 → US5–US7 → Polish.

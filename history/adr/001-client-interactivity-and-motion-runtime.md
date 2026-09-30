# ADR-001: Client Interactivity & Motion Runtime (Framer Motion DOM Engine Without React)

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-09-29
- **Feature:** 001-enterprise-website-baseline
- **Context:** The site is static and multi-page (Astro, `output: 'static'`). The constitution mandates Framer Motion (Principle VI) and caps JavaScript below 100 KB gzipped per page (Principle I). The approved plan (plan.md, Key Decision 1 and Complexity Tracking) assumed that Framer Motion requires React. It therefore specified two React islands, `MetricCounter.tsx` and `Reveal.tsx`, hydrated with `client:visible`, and accepted about 45 KB of React runtime as a justified complexity. When US4 was implemented, the Home page measured **110,087 B gzipped**, breaching the budget:
  - React client (`react-dom`): 65.8 KB
  - `MetricCounter` island (Framer Motion React API): 19.8 KB
  - Alpine and site logic: 21.0 KB
  - React shim: 3.0 KB

  The premise was wrong: Framer Motion publishes a framework-agnostic entry point, `framer-motion/dom` (`animate`, `inView`), that runs on plain DOM elements.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?  YES — defines the client runtime for every page and how all future interactive/animated features are written.
     2) Alternatives: Multiple viable options considered with tradeoffs?   YES — see Alternatives Considered.
     3) Scope: Cross-cutting concern (not an isolated detail)?             YES — affects metrics, reveal, layout, bundling, CSP and the plan's complexity tracking.
-->

## Decision

The client-side runtime is a single integrated cluster:

- **Global UI state and interaction: Alpine.js (CSP build).** It owns the theme store, the header and services menu, the contact `<dialog>` store and the lead-form component (`src/scripts/alpine.ts`). It stays the only eagerly loaded framework script.
- **Motion: Framer Motion DOM engine** (`import('framer-motion/dom')`: `animate` and `inView`), used from plain TypeScript modules:
  - `src/scripts/metric-counters.ts`: count-up for `[data-counter]`
  - `src/scripts/reveal.ts`: staggered fade and rise for `[data-reveal-group]`
- **Loading strategy:** Framer Motion is **dynamically imported** and shared as one chunk:
  - The counter loader downloads it only when a counter comes within 300 px of the viewport.
  - Reveal loads it after the page loads.
- **Progressive enhancement rules:**
  - Server HTML always contains final values and visible content.
  - Nothing is hidden until the motion chunk has loaded.
  - Only groups that start below the fold are animated.
  - Animation is limited to opacity and transform, so there is no layout shift.
  - All motion is skipped under `prefers-reduced-motion`.
- **React: build-time only.** `@astrojs/react` is kept solely so Lucide icons (`lucide-react`) render to static SVG during the build. There are **no `client:*` React islands**, so no React runtime reaches the browser.
- **Guardrails:** e2e tests assert:
  - final values appear without JavaScript
  - no animation runs under reduced motion
  - counters complete once scrolled into view
  - the production CSP produces zero violations (`tests/e2e/security.spec.ts`)

## Consequences

### Positive

- **Budget restored with wide margin.** The Home page now loads about 22.4 KB of JavaScript initially, plus 19.0 KB lazily when motion is needed: about 41.5 KB total, against a 110 KB React-island build and a 100 KB cap.
- **Mandate kept.** Framer Motion remains the animation engine, satisfying Principle VI without an exception.
- **One interaction model.** Alpine plus plain modules avoids two component systems (Alpine and React) coexisting on one page, and removes hydration timing issues such as the SSR-final-value to zero reset flash the React island needed workarounds for.
- **Stronger CSP posture.** No React hydration scripts or `astro-island` inline props, so the strict CSP (`script-src 'self'` plus one hash) holds.
- **Resilience.** If the motion chunk fails to load, content stays fully visible and correct.

### Negative

- **No declarative motion components.** Features such as `motion.div`, `AnimatePresence`, layout animations and shared-layout transitions are unavailable. Complex choreography must be written imperatively against the DOM API.
- **Imperative code needs discipline.** Motion scripts select elements by `data-*` hooks. Renaming markup without updating the hooks silently disables the animation; e2e tests only partially cover this.
- **A build-time React dependency remains** (for Lucide icons). It adds install weight and a React peer dependency, even though nothing ships to the client. Replacing it would require an Astro-native icon approach, such as inline SVG components.
- **Deviation from the approved plan.** The plan's Key Decision 1 and Complexity Tracking row are superseded, and tasks T040 and T057 were re-described. Readers of older artifacts must follow this ADR.

## Alternatives Considered

**Alternative A: React islands with the Framer Motion React API (original plan)**
- `@astrojs/react` with `client:visible` islands (`MetricCounter.tsx`, `Reveal.tsx`) using `useInView`, `animate` and `useReducedMotion`.
- Pros: declarative components; the full Framer Motion feature set for future rich interactions.
- Cons: measured 110 KB gzipped on Home, which violates Principle I. Also a second component model beside Alpine, hydration-flash workarounds, and larger CSP surface.
- **Rejected:** constitution budget failure.

**Alternative B: React islands with only the tween engine imported from `framer-motion/dom`**
- Measured at 109.7 KB gzipped. The React runtime (65.8 KB) dominates, so it gives no meaningful saving.
- **Rejected:** still over budget.

**Alternative C: Preact (`@astrojs/preact` with `preact/compat`) hosting Framer Motion React components**
- Pros: keeps declarative components at about 4 KB runtime.
- Cons: a framework substitution needing its own ADR under Principle VI, and compat edge cases with Framer Motion hooks.
- **Rejected:** higher risk for no requirement that needs components.

**Alternative D: The standalone `motion` package or CSS-only animation**
- Pros: smallest possible footprint.
- Cons: `motion` (vanilla) is a different mandated-stack item. CSS-only cannot tween numeric counters and would drop Framer Motion entirely, which violates Principle VI.
- **Rejected:** mandate conflict.

## References

- Feature Spec: specs/001-enterprise-website-baseline/spec.md (US4, FR-015, FR-030)
- Implementation Plan: specs/001-enterprise-website-baseline/plan.md (Key Decisions §1, Complexity Tracking — superseded by this ADR)
- Research: specs/001-enterprise-website-baseline/research.md (R2 — superseded by this ADR)
- Tasks: specs/001-enterprise-website-baseline/tasks.md (T040, T057)
- Constitution: .specify/memory/constitution.md (Principles I, VI)
- Related ADRs: [ADR-002](./002-edge-security-posture-strict-csp.md) (edge security posture; justifies the Alpine CSP build)
- Evaluator Evidence: history/prompts/001-enterprise-website-baseline/5-implement-phases-4-to-10.green.prompt.md (bundle measurements, 103 e2e passing incl. tests/e2e/metrics.spec.ts and tests/e2e/security.spec.ts)

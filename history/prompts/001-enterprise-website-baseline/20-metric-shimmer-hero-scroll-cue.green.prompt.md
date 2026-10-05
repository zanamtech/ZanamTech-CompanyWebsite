---
id: 20
title: Metric shimmer and hero scroll cue
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["metrics", "hover", "shimmer", "hero", "scroll-cue"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/Metrics.astro
 - src/components/sections/Hero.astro
 - src/components/sections/ProofStrip.astro
 - src/scripts/alpine.ts
 - src/styles/global.css
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request
---

## Prompt

Add interactive shimmer effects to the Target Outcomes grid cards and implement a smooth Hero scroll-down indicator:

1. Target Outcomes Grid Visual Polish (`src/components/sections/TargetOutcomes.astro` or Metrics section):
   - Enhance the 8 metric cards without changing their neutral glass card base:
     - Add a subtle purple/cyan glass border glow on hover (`hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`).
     - Add a subtle shine/shimmer sweep animation across the card surface on hover (similar to the primary CTA button's shimmer sweep using a relative `overflow-hidden` overlay).
     - Make the big percentage/metric numbers (`99.9%`, `80%`, etc.) subtly scale up or light up with brand purple/cyan glow on hover (`group-hover:text-purple-600 dark:group-hover:text-accent transition-colors duration-300`).

2. Professional Hero Scroll-Down Button (`src/components/sections/Hero.astro`):
   - Add a sleek, floating scroll-down indicator centered at the bottom of the Hero section.
   - Design: A subtle circular glass button with a downward chevron icon (`Lucide ChevronDown`), styled with `border border-border/60 bg-secondary/30 backdrop-blur-sm p-2.5 rounded-full hover:border-purple-500/60 hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-300`.
   - Motion: Apply a gentle micro-bounce or pulsing animation (`animate-bounce` or CSS smooth floating animation).
   - Functionality: On click, trigger smooth scrolling to the immediate next section (`document.querySelector('#proof-strip')?.scrollIntoView({ behavior: 'smooth' })`). Include proper ARIA label (`aria-label="Scroll to next section"`).

3. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Metric cards** (the glass base is unchanged):
  - Hover: `border-accent/50 shadow-lg shadow-purple-500/10` at 300ms.
  - A CTA-style shine overlay (`-translate-x-full` → `group-hover:translate-x-full`, 700ms): a purple sheen in light and a white sheen in dark, hidden under reduced motion.
  - Numerals: these are gradient-clipped text (transparent colour), so `group-hover:text-*` would not show. They instead scale to 1.04 from the left and gain a purple drop-shadow glow.
- **Hero scroll cue:**
  - A 44px round glass link (`border-border/60 bg-surface-2/30 backdrop-blur-sm`, purple hover) at bottom-centre, with a ChevronDown and a gentle 4px float animation (`animate-float-y`).
  - `aria-label="Scroll to next section"`. Its `href="#proof-strip"` is the no-JS fallback.
  - The `Alpine.data('scrollCue')` component's `go($event)` scrolls smoothly (instantly under reduced motion) and prevents the ClientRouter from handling the hash link.
  - ProofStrip gained `id="proof-strip"` and `scroll-mt-16 lg:scroll-mt-18`, so it isn't hidden under the sticky header.

## Outcome

- ✅ Impact: polished metric hover interactions and an accessible scroll cue.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: Metrics.astro, Hero.astro, ProofStrip.astro, alpine.ts, global.css.
- 🔁 Next prompts: a visual review, then commit.
- 🧠 Reflection: colour transitions don't work on gradient-clipped text, so scale plus glow achieves the "light up".

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

---
id: 21
title: Scroll target, spacing and section reveals
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["hero", "spacing", "reveal", "process", "industries", "hover"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/Hero.astro
 - src/components/sections/PageHero.astro
 - src/components/sections/ServicesGrid.astro
 - src/components/sections/Process.astro
 - src/components/sections/Industries.astro
 - src/scripts/reveal.ts
 - src/scripts/alpine.ts
 - tests/e2e/services.spec.ts
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request (services.spec selectors updated for the new id)
---

## Prompt

Implement the following 4 UI/UX and animation updates across the site:

1. Hero Scroll Down Button Target Update (`src/components/sections/Hero.astro`):
   - Update the click handler on the Hero scroll-down chevron button to target the Core Services section specifically (`#core-services`).
   - Use smooth scrolling: `document.querySelector('#core-services')?.scrollIntoView({ behavior: 'smooth' })`.
   - Ensure the main container in `src/components/sections/CoreServices.astro` has `id="core-services"` set correctly.

2. Global Header-to-Content Spacing Optimization:
   - Reduce excessive top padding/margin above page hero banners and headings (adjust `pt-28`/`pt-32` down to a balanced `pt-20`/`pt-24` or clean enterprise gap) across all page layouts (`BaseLayout.astro` and individual page headers).
   - Ensure the gap between the sticky header and top eyebrow tags (`CLOUD · DEVSECOPS · SECURITY...`) looks visually tight, balanced, and consistent across all pages.

3. Staggered Process Animation for "How We Engage" Section (`src/components/sections/Approach.astro` or process component):
   - Implement a sequential process entrance animation for the 4 engagement cards using scroll-driven / `x-intersect` triggers.
   - Cards should enter sequentially from right to left with staggered delays (`delay-100`, `delay-200`, `delay-300`, `delay-400`).
   - Keep the motion velocity smooth and moderately paced (`duration-700 ease-out`) so it feels premium and clearly readable.

4. Distinct Interactive Animation for "Who We Serve" Section (`src/components/sections/Industries.astro` or target section):
   - Apply a unique entrance and hover effect distinct from other card sections:
     - Entrance: Smooth fade-in with micro 3D scale-up (`scale-95` to `scale-100`).
     - Hover effect: Elegant subtle card elevation (`hover:-translate-y-2 transition-all duration-300`), paired with a multi-layered ambient purple glass border glow (`hover:shadow-xl hover:shadow-purple-500/15 hover:border-purple-500/50`).

5. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Scroll target:** the Core Services section (`ServicesGrid.astro`) is now `id="core-services"`, with a header-height `scroll-mt`. The hero cue's href/target is `#core-services` and it still scrolls smoothly via `scrollCue`. The `services.spec.ts` selectors were updated.
- **Spacing:**
  - There were no `pt-28`/`pt-32` values; the inconsistency was the home hero at pt-14, 20 and 24 versus inner pages at pt-10 and 14.
  - Both now use `pt-10 sm:pt-12 lg:pt-14`, a 40/48/56px gap below the sticky header on every page.
  - BaseLayout adds no top padding, so it was unchanged.
- **`reveal.ts` generalised:** new data attributes `x`, `scale`, `duration` and `order="reverse"`. Reverse order applies only while all cards sit on one row, so mobile still reads top to bottom.
- **Process ("How we engage"):** the cards slide in from the right (32px) and fade, from right to left (04 → 01) at 0.1s steps, 0.7s each, ease-out. Also used on /approach.
- **Industries ("Who we serve"):**
  - Entrance: a fade and `scale(0.95)` → 1 at 0.12s steps.
  - Hover: `-translate-y-2`, `border-accent/50`, `shadow-xl shadow-purple-500/15`, at 300ms. Transitions are limited to translate, shadow and border so they don't fight the entrance. The lift is disabled under reduced motion.
- I reused the existing Framer Motion reveal engine instead of adding Alpine's intersect plugin. Its safety rules still apply: below-the-fold only, nothing hidden before load, skipped under reduced motion.

## Outcome

- ✅ Impact: the cue goes to Core Services, the header gap is consistent, and Process and Industries each have their own motion.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: see the list above.
- 🔁 Next prompts: a visual review, then commit.
- 🧠 Reflection: the stated pt-28/pt-32 values didn't exist; the real problem was the mismatch between the home and inner page heroes.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run services.spec to confirm the renamed anchor.

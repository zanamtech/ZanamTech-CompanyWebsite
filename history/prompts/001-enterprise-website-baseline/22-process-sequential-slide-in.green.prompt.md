---
id: 22
title: Process sequential slide-in
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["process", "alpine", "reveal", "animation"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/Process.astro
 - src/scripts/alpine.ts
 - src/scripts/reveal.ts
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request
---

## Prompt

Refine the "How We Engage" process cards animation in `src/components/sections/Approach.astro` (or the corresponding process component) to create a true sequential right-to-left slide-in sequence:

1. Sequential Reveal Logic (Alpine.js):
   - Set up an Alpine component state for the container: `x-data="{ visibleCards: 0 }"`.
   - On scroll intersection (`x-intersect.once="setTimeout(() => visibleCards = 1, 100); setTimeout(() => visibleCards = 2, 700); setTimeout(() => visibleCards = 3, 1300); setTimeout(() => visibleCards = 4, 1900)"`).
   - This ensures Card 02 starts sliding only after Card 01 finishes settling into position.

2. Card Slide-In Transition Styling:
   - Initial State (`visibleCards < index + 1`):
     - `translate-x-16 opacity-0 pointer-events-none` (positioned slightly to the right and invisible).
   - Revealed State (`visibleCards >= index + 1`):
     - `translate-x-0 opacity-100` (slides smoothly into place and attaches to the row).
   - Duration & Ease:
     - Use a smooth, deliberate pace: `transition-all duration-700 ease-out`.

3. Visual Attachment Polish:
   - Ensure cards align cleanly in their grid/flex row without layout jitter while off-screen.
   - Maintain the subtle glass border and hover effects once revealed.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Component:** `Alpine.data('processReveal', count)`. The CSP build can't run inline statements and the intersect plugin isn't installed, so it uses an IntersectionObserver with `once` semantics at threshold 0.2.
  - `visibleCards` goes from 1 to 4 at 100, 700, 1300 and 1900ms.
  - `destroy()` clears the timers and the observer.
- **Cards:** `data-shown` drives the states.
  - `false`: `translate-x-16 opacity-0 pointer-events-none`.
  - Revealed: the natural position, with `transition-all duration-700 ease-out`. Grid cells keep their size, so there is no layout jitter.
  - The section has `overflow-x-clip`, so the off-canvas start position never adds horizontal scroll.
- **Visible by default:** the cards stay visible without JS (no attribute is rendered on the server), under reduced motion, and when the section is already on screen at load.
- **Cleanup:** the previous Framer `data-reveal-group` on Process was removed, along with the now-unused reverse-order option in `reveal.ts`.

## Outcome

- ✅ Impact: a true one-by-one slide-in (01 → 04) on Home and /approach.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: Process.astro, alpine.ts, reveal.ts.
- 🔁 Next prompts: a visual review, then commit.
- 🧠 Reflection: the process cards had no hover effect before, so there was nothing to preserve; the glass border is unchanged.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

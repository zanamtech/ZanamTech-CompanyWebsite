---
id: 16
title: Stepper tick logic and purple accent
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["hero", "alpine", "stepper", "animation"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/Hero.astro
 - src/scripts/alpine.ts
 - src/styles/global.css
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request
---

## Prompt

Refine the sequential stepper animation in `src/components/sections/Hero.astro` with exact tick visibility logic, smoother transitions, and updated accent colors:

1. Left Indicator Line Color Update:
   - Change the left accent indicator line color on the active step from blue to the brand purple shade (matching the "Request a Custom Proposal" button's purple tint/border e.g., `border-purple-600` / `bg-purple-600` / `border-accent`).

2. Sequential Tick Mark Visibility Logic (Alpine.js):
   - At the start of the loop (Step 1 start), no tick marks should be visible (`opacity-0` for all ticks).
   - When a step is CURRENTLY ACTIVE (`step === activeStep`):
     - Highlight the item with purple gradient badge and purple accent line.
     - Reveal its checkmark icon in purple color (`opacity-100 text-purple-600 scale-105`).
   - When a step is COMPLETED (`step < activeStep`):
     - Keep its checkmark visible, but change its color to muted gray (`opacity-70 text-gray-400 scale-100`).
   - At the End of the Sequence (After Step 4):
     - Unset `activeStep` (set to `0` or resting state) for 2 seconds.
     - During this 2-second sleep phase, remove all active purple highlights so all 4 points look neutral with their tick marks shown in gray.
     - After the 2-second sleep phase ends, fade out all tick marks back to `opacity-0` and restart the animation loop smoothly from Step 1.

3. Silky Smooth Transitions:
   - Apply `transition-all duration-700 ease-in-out` across container backgrounds, borders, badge scale/color, and checkmark opacity/colors to make step shifts feel exceptionally smooth.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Phase machine** in `blueprintStepper`, with phases `off`, `reset`, `play` and `rest`:
  - `reset` (0.7s): ticks fade out.
  - `play` (1.8s per step): the active step is purple; earlier steps are ticked in gray.
  - `rest` (2s): `activeStep = 0`, every step neutral with a gray tick.
  - Then back to `reset` and step 1.
  - Hover pauses any phase. Reduced motion stays `off` (the static card).
- **Step states:**
  - `active`: purple accent left border, purple glow, a purple→CTA gradient badge with white text (on an overlay, so it fades), and a purple tick at `scale-105`.
  - `done`: a gray (`text-muted`) tick at 70% opacity and `scale-100`.
  - `idle`: an upcoming step; dimmed badge and hidden tick.
  - `clear`: neutral with a hidden tick.
- All transitions are `duration-700 ease-in-out`. The `brand-blue` token added in PHR 15 was removed, since nothing uses it now.

## Outcome

- ✅ Impact: the tick progression and the purple active styling work as specified.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: Hero.astro, alpine.ts, global.css.
- 🔁 Next prompts: a visual review, then commit.
- 🧠 Reflection: a gradient background can't transition, so an opacity overlay gives a smooth badge fade.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

---
id: 15
title: Hero blueprint auto stepper
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["hero", "alpine", "stepper", "animation", "a11y"]
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

Animate the "Engagement blueprint" card steps in `src/components/sections/Hero.astro` into an interactive, auto-playing sequential stepper using Alpine.js:

1. Interactive Stepper State (Alpine.js):
   - Wrap the Engagement blueprint steps container in an Alpine component (`x-data="{ activeStep: 1, timer: null, isHovered: false }"`)
   - Implement an auto-play timer that cycles `activeStep` from 1 to 4 every 1.8 seconds.
   - After Step 4 is highlighted, pause for 2.5 seconds with Step 4 active (or all steps active), then reset back to Step 1 in an infinite smooth loop.
   - Pause the timer when the user hovers over the card (`@mouseenter="isHovered = true"`), and resume on mouse leave (`@mouseleave="isHovered = false"`).

2. Step Highlight Styling & Transitions:
   - For the Active Step (`activeStep === index + 1`):
     - Number Badge (01, 02, 03, 04): Transition to the brand gradient background (`bg-gradient-to-r from-[#21A0FF] to-purple-600 text-white shadow-md shadow-primary/20 scale-105`).
     - Title Text: Highlight with primary brand color/gradient (`text-primary font-bold` or `text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent`).
     - Checkmark Icon: Scale up slightly and light up with brand cyan color (`scale-110 text-[#21A0FF] opacity-100`).
     - Card Item Container: Add subtle left-border or card glow highlight.
   - For Inactive Steps:
     - Keep them subtly muted (`opacity-65 transition-all duration-500`) so focus remains on the active step.

3. Smooth Transitions:
   - Ensure all color, scale, and opacity shifts use smooth Tailwind transition classes (`transition-all duration-500 ease-in-out`).

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **State:** `Alpine.data('blueprintStepper', steps)`, a registered component, since the CSP build cannot evaluate inline object `x-data`. It holds `activeStep`, `timer` and `isHovered`.
  - Each step lasts 1.8s; step 4 holds for 2.5s, then the loop returns to step 1.
  - `mouseenter` / `mouseleave` call `pause` / `resume`.
  - The loop skips advancing while the tab is hidden, and `destroy()` clears the timer on navigation.
  - Under reduced motion it never starts.
- **Styling:** driven by `data-step="active|idle"` with Tailwind `data-*` and `group-data-*` variants, all `transition-all duration-500 ease-in-out`.
  - Badge: a gradient fill, white text, `scale-105` and a cyan shadow.
  - Title: a link→accent gradient text fade-in.
  - Check icon: `scale-110`, cyan, full opacity.
  - Item: a cyan left border, surface tint and soft glow.
  - Inactive steps: `opacity-65` on the badge and icon, with the title at `fg/80`.
- **Accessibility deviations:**
  - The badge gradient is the new `brand-blue` token (#0A66B8) → `cta` (#6A1FE0), because white text on #21A0FF is only 2.8:1.
  - Text is not faded to 65% opacity, because that would fail 4.5:1.
  - `font-bold` was dropped on the active title to avoid reflow jitter.
  - Before Alpine starts (no JS), all steps render at full emphasis.

## Outcome

- ✅ Impact: an auto-playing, hover-pausable blueprint stepper.
- 🧪 Tests: astro check 0 errors; E2E skipped by request (not verified in a browser).
- 📁 Files: Hero.astro, alpine.ts, global.css (brand-blue token).
- 🔁 Next prompts: a visual review, then commit.
- 🧠 Reflection: the requested colour and opacity values conflicted with the AA contrast constitution, so accessible equivalents were used.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run the theme-a11y axe suite to confirm there are no contrast regressions while the stepper is mid-animation.

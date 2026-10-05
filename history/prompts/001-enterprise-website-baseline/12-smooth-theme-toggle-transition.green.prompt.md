---
id: 12
title: Smooth theme toggle transition
stage: green
date: 2026-10-01
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["theme", "view-transitions", "performance", "reduced-motion", "css"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/scripts/alpine.ts
 - src/styles/global.css
 - tests/e2e/theme-motion.spec.ts
tests:
 - tests/e2e/theme-motion.spec.ts (VT path, CSS fallback, reduced motion, latency)
 - "Theme/a11y/navigation suites x10 repeats: 310/310 passed"
 - "Full suite: 152 passed, 34 skipped (device-specific)"
 - astro check 0 errors; check:csp PASS
---

## Prompt

Improve the light/dark theme toggle transition to make it smooth, fast, and visually polished without adding any lag:

1. Global CSS Theme Smoothness:
   - Add a global CSS transition rule in `src/styles/global.css` for background colors, text colors, borders, and glass surfaces:
     `transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;`
   - Ensure the duration is kept short (150ms–200ms) so there is zero perceptible UI delay or lag.

2. Modern View Transitions API Support (Optional Enhance):
   - In `src/scripts/alpine.ts` (or the Theme Toggle component), check if `document.startViewTransition` is available when toggling the theme.
   - Wrap the theme class update (`document.documentElement.classList.toggle('dark')`) in `document.startViewTransition()` if supported by the browser, with fallback to instant class switching.

3. Performance & Non-Blocking Execution:
   - Ensure `prefers-reduced-motion` media query disables or shortens transitions for users who prefer reduced motion.
   - Test theme switching on both mobile and desktop to verify that colors morph smoothly within 200ms with zero frame drops.

## Response snapshot

- **Primary path:** `document.startViewTransition` wraps the class toggle and awaits `Alpine.nextTick()`, so the new snapshot includes the re-rendered toggle icon. It produces a single 200ms ease-in-out crossfade, scoped by `html.theme-vt` so Astro's navigation transitions keep their timing.
- **Fallback path** (no View Transitions API): the requested transitions (background, colour, border, box-shadow, plus outline/fill/stroke, 0.2s ease-in-out) are applied only while `html.theme-transition` is present, about 250ms. A permanent rule on every element was deliberately avoided, because it would animate hover states, navigation and first paint and add constant style cost.
- **Reduced motion:** instant switch, using neither path; the view-transition animations are also disabled in the reduced-motion media block.
- **Performance:**
  - Headless (software rendering) showed slowdowns caused by the blur, mesh and shadow paint cost, not by the toggle logic.
  - GPU-backed headed Chromium: the VT path has median 16.7ms frames on desktop and mobile, with one 33–50ms snapshot-capture frame; the CSS fallback has one ~83ms frame when the transitions start.
  - Click-to-theme latency is about 14–29ms.

## Outcome

- ✅ Impact: a smooth 200ms crossfade on modern browsers, a scoped fallback elsewhere, and an instant switch for reduced motion.
- 🧪 Tests: 152 passed; 310/310 repeated.
- 📁 Files: 2 source files, 1 new test file.
- 🔁 Next prompts: commit and push to `dev`.
- 🧠 Reflection: the headless frame timings misled; GPU-backed measurement was needed before considering design changes to the glass, mesh or shadows.

## Evaluation notes (flywheel)

- Failure modes observed: a race in polling a short-lived class (fixed with a MutationObserver); a strict frame threshold was invalid in headless software rendering.
- Graders run and results (PASS/FAIL): Playwright + axe PASS; CSP PASS; astro check PASS.
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): verify on a real iPhone Safari 18+ and on Firefox (VT support differs).

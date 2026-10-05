---
id: 27
title: Header overlay with hero underlay
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["header", "glass", "hero", "layout"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/layout/Header.astro
 - src/components/sections/Hero.astro
 - src/components/sections/PageHero.astro
 - src/pages/404.astro
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request
---

## Prompt

Fix the header background bleed issue in `src/components/layout/Header.astro` and `src/layouts/BaseLayout.astro`:

1. Remove Header Outer Wrapper Background:
   - Ensure the outer `<header>` and its parent wrapper have ZERO background color (`bg-transparent` only). Completely remove any `bg-background`, `bg-white`, or `bg-black` classes on the outer header wrapper.
   - Set the header wrapper to `fixed top-0 left-0 right-0 z-50 bg-transparent` (or `sticky top-0 bg-transparent`) so it overlays seamlessly over the top of the first section.

2. Ensure Hero Section Extends Underneath Header:
   - Ensure the first page section (Hero) starts directly at the top of the viewport (`top: 0`) so its gradient background and grid pattern seamlessly flow behind the floating header.
   - Use inner padding (`pt-28` or `pt-32`) on the Hero content container to prevent text overlap, rather than adding outer top margin to the section.

3. Floating Navigation Pill Surface:
   - Only apply glassmorphism on the inner rounded navbar container itself (`bg-background/20 backdrop-blur-md border border-border/40 shadow-sm`), keeping the area around and behind it 100% transparent.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this change. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Cause of the bleed:** the sticky header took up layout space, so the strip around the pill showed the page background instead of the hero.
- **Header wrapper:** `pointer-events-none fixed inset-x-0 top-0 z-40 bg-transparent`, out of the layout flow and click-through. The bar and mobile drawer are `pointer-events-auto`. It stays at `z-40` so it remains below the contact dialog.
- **Pill bar:** `bg-bg/20 backdrop-blur-md border border-border/40 shadow-sm`. Glass is applied only on the bar.
- **First sections now start at y=0** with inner padding that clears the header:
  - Hero: `pt-28 sm:pt-32 lg:pt-34`, keeping the previous 40/48/56px gap below the bar.
  - PageHero: the same, so every subpage's mesh and grid flows behind the header.
  - 404: `pt-32`.
- **Unchanged:** BaseLayout needed no change (`main` has no top padding). Scroll-cue offsets are unchanged, because the bar's viewport position is the same.

## Outcome

- ✅ Impact: the hero and page-hero backgrounds flow seamlessly behind a floating glass bar on every page.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: Header.astro, Hero.astro, PageHero.astro, 404.astro.
- 🔁 Next prompts: run the header and a11y e2e suites before pushing (header geometry changed); commit.
- 🧠 Reflection: a fixed overlay needs a click-through wrapper, or the transparent strip blocks clicks.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): consider `scroll-padding-top` so keyboard-focused elements are never hidden under the fixed bar (WCAG 2.4.11).

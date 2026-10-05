---
id: 19
title: Why cards reveal and service number hover
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["reveal", "hover", "pillars", "service-card", "motion"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/scripts/reveal.ts
 - src/components/sections/Pillars.astro
 - src/components/sections/ServiceCard.astro
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request
---

## Prompt

Add scroll-triggered staggered reveal animations to the "Why ZanamTech" cards and enable synchronized hover color transitions on Core Services card numbers:

1. Scroll Entrance & Hover Animations for "Why ZanamTech" Cards:
   - In the section component containing "Pragmatic engineering for systems that cannot fail" (`src/components/sections/WhyZanamTech.astro` or `Hero.astro`):
     - Add scroll-triggered entrance animations so the 3 cards reveal sequentially from left to right as the user scrolls down into view (using CSS scroll-driven animations or Alpine `x-intersect` with staggered delays: `delay-100`, `delay-200`, `delay-300`).
     - Card Entrance Transition: smooth slide-up and fade-in (`opacity-0 translate-y-6` to `opacity-100 translate-y-0`).
     - Card Hover Effect: add smooth micro-lift on hover (`hover:-translate-y-1.5 transition-all duration-300 ease-out`), subtle brand purple/cyan border glow (`hover:border-purple-500/60`), and ambient glass shadow (`hover:shadow-xl hover:shadow-purple-500/10`).

2. Core Services Card Number Hover Sync:
   - In `src/components/sections/CoreServices.astro` (or the card sub-component):
     - Ensure the parent card container has the `group` class.
     - Update the card step number element (`01`, `02`, `03`...):
       - Transition text color smoothly on hover to match the active border color (`text-muted-foreground/60 group-hover:text-purple-600 dark:group-hover:text-accent transition-colors duration-300`).

3. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Section:** the cards are in `Pillars.astro`, which already used the site's `data-reveal-group` reveal (Framer Motion `inView`). I reused that instead of adding Alpine `x-intersect`, which would mean a new plugin.
  - `reveal.ts` gains optional `data-reveal-stagger` and `data-reveal-distance` attributes.
  - Pillars uses 0.1s and 24px: a left-to-right 100/200ms stagger with a `translate-y-6`-equivalent rise and fade.
  - Existing safety rules still apply: only groups below the fold, nothing hidden before Framer loads, skipped under reduced motion.
- **Pillar card hover:** `-translate-y-1.5`, `border-accent/60`, `shadow-xl shadow-purple-500/10`, at 300ms ease-out. The transition is limited to translate, box-shadow and border-color so it doesn't fight the Framer opacity/transform entrance. The lift is disabled under reduced motion.
- **Service card number:** `text-muted/60` → `group-hover:text-accent` over 300ms. The `accent` token is purple #7A2BFF in light and #A78BFA in dark, matching the card's `hover:border-accent` in both themes. The card already had `group`.

## Outcome

- ✅ Impact: a staggered entrance for the Why cards, a brand hover lift, and service numbers that sync with the card hover.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: reveal.ts, Pillars.astro, ServiceCard.astro.
- 🔁 Next prompts: a visual review, then commit.
- 🧠 Reflection: extending the existing reveal engine avoids a second animation system.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

---
id: 23
title: Standardize spacing, hover and full QA
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["spacing", "design-system", "hover", "hero", "scroll", "qa", "a11y"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/styles/global.css
 - src/components/sections/Hero.astro
 - src/components/sections/PageHero.astro
 - src/components/sections/ServicesGrid.astro
 - src/components/sections/ServiceCard.astro
 - src/components/sections/Process.astro
 - src/components/sections/Pillars.astro
 - src/components/sections/Metrics.astro
 - src/components/sections/Industries.astro
 - src/components/sections/CtaBand.astro
 - src/pages/index.astro
 - src/pages/approach.astro
 - src/pages/about.astro
 - src/pages/industries.astro
 - src/pages/contact.astro
 - src/pages/privacy.astro
 - src/pages/services/index.astro
 - src/pages/services/[slug].astro
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - "Full Playwright suite on a fresh build (port 4333): 152 passed, 34 skipped (device-specific), 0 failed"
 - "Scroll-cue diagnostic (1440 / 768 / Pixel 7): cue centred on the hero boundary; Core Services eyebrow lands 23px below the header"
---

## Prompt

Standardize section spacing, enforce design/animation consistency across all pages, fix the scroll-down arrow position and scroll offset, and execute full QA:

1. Standardize Global Section Spacing Across All Pages:
   - Audit section margins/paddings across Home (`/`), Services (`/services`), Approach (`/approach`), Industries (`/industries`), and About (`/about`).
   - Standardize vertical padding across sections using a balanced spacing token (e.g. `py-12 sm:py-16 lg:py-20` instead of excessive `py-24`/`py-32`).
   - Fix hero banner top padding on subpages so content sits at a clean, professional offset under the sticky header.

2. Enforce Design & Animation System Consistency Across Subpages:
   - Ensure all cards, buttons, badges, and process steps on dedicated pages (`/approach`, `/industries`, `/services`) match the exact hover styles, glass borders (`hover:border-purple-500/50 hover:shadow-purple-500/10`), and transition effects used on the Home page.
   - Synchronize the process cards on `/approach` with the refined "How We Engage" card animation logic.

3. Position Scroll-Down Arrow on Divider Line & Fix Blank Scroll Offset (`Hero.astro`):
   - Centrally align the scroll-down button directly on the section boundary line (`absolute -bottom-5 left-1/2 -translate-x-1/2 z-10`).
   - Add `scroll-mt-24` (or `scroll-margin-top: 6rem`) to the target `#core-services` container in `CoreServices.astro`.
   - Ensure clicking the arrow smoothly scrolls directly to the "Core Services" title and cards without leaving any blank viewport area under the sticky header.

4. Run Full QA Suite & Verify Fixes:
   - Run the complete test and linting suite:
     - `npm run check` (TypeScript type check)
     - `npm run lint:content` (Content policy verification)
     - `npm run test:e2e` (Playwright E2E and accessibility test suite)
   - If any test fails or issues are found, automatically fix them and re-run until all checks pass cleanly.

## Response snapshot

- **Spacing:**
  - A new `.section-y` utility (`py-12 sm:py-16 lg:py-20`) replaces the `py-20 sm:py-24`, `py-20` and `py-16 lg:py-20` section paddings on Home, /services, /services/[slug], /approach, /industries, /about, /contact and /privacy.
  - PageHero bottom padding is now 12/16/20, with the top at 10/12/14, matching the home hero.
  - The CtaBand bottom and its leading wrappers follow the same rhythm.
  - 404 keeps its centred layout.
- **Hover system:**
  - `.card-hover` (lift −1, `border-accent/50`, `shadow-xl shadow-purple-500/10`, 300ms; lift off under reduced motion) is used by service cards (home and /services), process cards, the /approach model cards, the /about principle and capability cards, and the service scenario cards.
  - `.panel-hover` (border and glow, no lift) is used for the large /industries panels.
  - Subpage card grids gained `data-reveal-group` entrances. Buttons and badges already use the shared components.
- **Process:** /approach reuses the same `processReveal` sequence. The reveal sits on the outer `li` and the glass hover on an inner card, so the hover isn't slowed to 700ms.
- **Hero arrow:**
  - Sits at `-bottom-5.5 left-1/2 -translate-x-1/2 z-10`, centred exactly on the boundary.
  - The hero's `overflow-hidden` moved to an inner decorative-background wrapper, so the arrow isn't clipped.
  - It got a more solid surface so it reads over the boundary line.
  - Hero bottom padding was reduced, since the arrow no longer sits inside it.
- **Scroll offset:** the `scroll-mt-24` suggestion would have added blank space, because the section's own top padding sits above the title. Instead, `scroll-mt-10 sm:scroll-mt-6 lg:scroll-mt-4` was calculated (header + 24px − section padding). Measured result: the eyebrow lands 23px below the header at every size.
- **QA fixes:**
  1. The process cards faded out while axe was scanning, which failed contrast. `duration-700` alone still transitioned all properties, because transition-property defaults to all. The transition is now scoped to `data-[shown=true]`, so the hide is instant and only the reveal animates.
  2. The service-card numbers at `text-muted/60` failed contrast. They are back to `text-muted`, with the purple hover kept.
- **Result:** 152 passed, 34 skipped, 0 failed.

## Outcome

- ✅ Impact: consistent spacing and hover language site-wide; the arrow sits on the divider and lands precisely.
- 🧪 Tests: check, content lint and CSP pass; full E2E 152/152.
- 📁 Files: see the list above.
- 🔁 Next prompts: commit and push to dev.
- 🧠 Reflection: the full axe run caught two regressions from earlier fast-mode tweaks; skipping E2E on UI changes hid them.

## Evaluation notes (flywheel)

- Failure modes observed: a transition on the initial hide state, captured mid-fade by axe; low-contrast decorative text.
- Graders run and results (PASS/FAIL): astro check PASS; lint:content PASS; check:csp PASS; Playwright + axe PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): add a small e2e test for the scroll-cue landing offset.

---
id: 29
title: Privacy layout width and TOC grid
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["privacy", "layout", "toc"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/privacy.astro
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request
---

## Prompt

Fix the layout alignment, container max-width, and "ON THIS PAGE" index grid on `src/pages/privacy.astro`:

1. Align Container & Content Width with Site Standard:
   - Remove narrow centering wrapper (`max-w-2xl` or `max-w-3xl mx-auto`) from the privacy page container.
   - Update the outer wrapper to match the site's standard content container width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
   - Align all section headers, introductory text, and privacy sections cleanly to the left matching the layout rhythm of `/services`, `/approach`, and `/industries`.

2. Expand "ON THIS PAGE" Index Box:
   - Make the "ON THIS PAGE" navigation card full-width (`w-full max-w-full`).
   - Reformat its link grid layout into 3 columns on medium/large screens: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4`.
   - Ensure all 9 index links fit comfortably across 3 clean rows with hover states (`hover:text-purple-600 dark:hover:text-accent transition-colors`).

3. Re-arrange Content & Section Cards:
   - Expand the main text/sections width (`max-w-5xl` or full container grid) so lists, bullet points, and callout boxes ("Explicitly Excluded", "Our Commitment", "Data Privacy Team") spread out cleanly across the page without awkward line breaks.
   - Maintain the glassmorphic card styling, purple section numbers (`01.`, `02.`), and subtle borders across all 9 privacy sections.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Outer container:** the centred `mx-auto max-w-4xl` wrapper is removed. The page uses the site's standard `container-page` (`mx-auto max-w-7xl px-5 sm:px-8`, the same container as /services, /approach and /industries), so the content aligns left with the other pages.
- **"On this page" card:** full width (`w-full max-w-full`), with links in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4`, giving 3 rows of 3 on large screens. The hover uses the `accent` token, which is purple in light and violet in dark.
- **Sections:** widened to `max-w-5xl`, left-aligned, so lists and callouts spread out. Glass callouts, purple numbering and borders are unchanged.

## Outcome

- ✅ Impact: the privacy page matches the site container rhythm, and the index fits in 3 clean rows.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: src/pages/privacy.astro
- 🔁 Next prompts: commit.
- 🧠 Reflection: reusing `container-page` keeps the exact gutters of the other pages, rather than a near-identical px-4/6/8.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

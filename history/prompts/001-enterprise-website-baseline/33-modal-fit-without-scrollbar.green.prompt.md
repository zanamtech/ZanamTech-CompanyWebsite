---
id: 33
title: Modal fit without scrollbar
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["contact-form", "modal", "layout", "density"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/ContactModal.astro
 - src/components/ContactForm.astro
 - src/styles/global.css
tests:
 - npm run check (0 errors, 0 warnings)
 - "Dialog fit measurement on a production build: 1280×720, 1366×768, 1440×900, 1920×1080 and iPad all fit (673px content, no scroll); Pixel 7 scrolls (allowed on mobile)"
 - E2E suite intentionally skipped per request
---

## Prompt

Fix the modal layout and eliminate the vertical scrollbar on laptop/desktop screens in `src/components/ui/ConsultationModal.astro`:

1. Modal Container Width & Overflow Adjustments:
   - Increase the modal container width on laptop/desktop viewports: change `max-w-xl` or `max-w-lg` to `max-w-2xl lg:max-w-3xl`.
   - Update scrollbar behavior: allow vertical scrolling on mobile/tablet (`max-h-[90vh] overflow-y-auto lg:overflow-y-hidden lg:max-h-none`) while ensuring laptop/desktop screens (`lg:` and `xl:`) render the full modal height without any vertical scrollbar.

2. Compact Vertical Spacing & Input Densities:
   - Header & Subtitle: Reduce header margin (`mb-3 sm:mb-4`) and subtitle paragraph spacing.
   - Form Field Grid: Reduce row gaps (`gap-3` on desktop).
   - Input Fields & Dropdowns: Use compact input padding (`py-2 px-3 sm:py-2.5`).
   - Helper Text: Reduce `mt-1` margins under phone number and project description to `mt-0.5` with concise text styling (`text-xs`).
   - Project Overview Textarea: Set `rows="2"` (or dynamic auto-expanding max 2-3 rows) to save vertical real estate.

3. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Width:** `max-w-2xl lg:max-w-3xl`, giving 768px on laptops.
- **Overflow:** `max-h-[90vh]` with `overflow-y-auto`, and `lg:max-h-[96vh]`. `lg:overflow-y-hidden` was deliberately not used: on a short laptop or at browser zoom it would make the Send button unreachable. Because the form now fits, no scrollbar renders on lg and above.
- **Density:**
  - Title `text-xl sm:text-2xl` with `mt-1.5`; subtitle `mt-1 text-sm`; header-to-form gap `mt-3 sm:mt-4`.
  - Form `space-y-3`, grids `gap-3`, label-to-input `mt-1.5`.
  - Dialog inputs `px-3 py-2 sm:py-2.5`, scoped via `.contact-dialog .field-input`. The existing 44px min-height keeps tap targets compliant.
  - Phone and message hints `mt-0.5 text-xs`.
  - Textarea `rows=2` in the dialog, `rows=4` on the /contact page.
- **Measured:** 673px of content fits fully at 1280×720, 1366×768, 1440×900, 1920×1080 and iPad. Pixel 7 scrolls, which is allowed on mobile.

## Outcome

- ✅ Impact: no internal scrollbar on laptop and desktop screens; the form fits even at 720px height.
- 🧪 Tests: astro check 0 errors; fit measured; E2E skipped by request.
- 📁 Files: ContactModal.astro, ContactForm.astro, global.css.
- 🔁 Next prompts: run contact/security/home e2e; commit.
- 🧠 Reflection: making the content fit is safer than hiding overflow.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

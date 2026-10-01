---
id: 10
title: Mega-menu card and tablet breakpoint
stage: green
date: 2026-10-01
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["header", "mega-menu", "responsive", "tablet", "accessibility"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/layout/Header.astro
 - tests/e2e/responsive-header.spec.ts
tests:
 - tests/e2e/responsive-header.spec.ts (768, 834, 1023, 1024 and 1440 px)
 - "Full suite: 132 passed, 22 skipped (device-specific)"
 - astro check 0 errors; check:csp PASS
---

## Prompt

Fix the Header mega-menu width and tablet (iPad) responsiveness in `src/components/layout/Header.astro`:

1. Compact & Contained Desktop Mega-Menu:
   - Change the Services mega-menu container from full-screen width to a contained floating glass card (e.g., `max-w-4xl` or `max-w-5xl` centered under the Header container).
   - Reduce internal padding (`p-5` instead of heavy padding) and gap spacing between columns/links so it feels compact and enterprise-grade without removing any icons, badges, or content.
   - Position the dropdown neatly relative to the Header container (`absolute left-1/2 -translate-x-1/2 top-full mt-2`).

2. Tablet/iPad Breakpoint Fix (768px to 1024px):
   - Adjust the mobile menu / desktop navigation breakpoint so tablets (iPads, Surface, etc.) use the mobile drawer navigation instead of squeezing desktop links.
   - Ensure desktop nav (`<nav>`) and desktop CTA are visible ONLY on `lg:` screens (1024px and above) using `hidden lg:flex`.
   - Ensure the hamburger button is visible on all screens smaller than `lg` (`block lg:hidden`).
   - Test that on iPad Mini (768px) and iPad Pro (1024px), the header elements do not overlap, text does not wrap awkwardly, and the mobile drawer functions cleanly.

## Response snapshot

- **Mega-menu:** now a contained card, `w-[min(64rem,calc(100vw-4rem))]` (max-w-5xl), positioned `absolute top-full left-1/2 -translate-x-1/2 mt-2`, centred under the header. Compact layout: `p-5`, `gap-6`, a 12rem intro column with a divider, uppercase group labels, 32px icon tiles and tighter rows. All 9 icons and all content are retained; the 44px row targets are kept. The hover bridge was extended to 28px to cover the header gap plus mt-2.
- **Glass:** a translucent card was tried and rejected. The header's own `backdrop-filter` makes it the backdrop root, so the card's blur cannot work and the hero text bled through. The card uses an opaque surface with a border, ring, shadow and the brand hairline.
- **Breakpoints:** desktop nav `hidden lg:flex`; header CTA changed from `hidden sm:block` to `hidden lg:block` (the actual tablet squeeze); hamburger `lg:hidden` (`inline-flex` below lg).
- **Tests:** new `responsive-header.spec.ts` checks no overlap, single-line labels, the drawer opening, navigating and closing on Escape, and accessibility at 768, 834 and 1023 px; the desktop layout without wrapping at 1024 px; and the card being contained and centred at 1024 and 1440 px.

## Outcome

- ✅ Impact: compact, centred menu card; tablets get the drawer; no overlaps at the tested widths.
- 🧪 Tests: 132 passed / 22 skipped.
- 📁 Files: 1 source file, 1 new test file.
- 🔁 Next prompts: commit and push to `dev`.
- 🧠 Reflection: a nested backdrop-filter is a browser limitation; verifying the computed styles avoided shipping a low-contrast translucent menu.

## Evaluation notes (flywheel)

- Failure modes observed: the translucent card bled hero text through (fixed with an opaque surface).
- Graders run and results (PASS/FAIL): Playwright + axe PASS; CSP PASS; astro check PASS.
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): render the menu outside the header (portal) if a true frosted-glass card is required.

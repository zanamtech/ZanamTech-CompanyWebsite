---
id: 15
title: Header menu and footer UI fixes
stage: green
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: direct request
labels: ["ui", "header", "mega-menu", "mobile-menu", "footer", "focus-visible", "a11y"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/scripts/input-modality.ts (new)
 - src/styles/global.css
 - src/layouts/BaseLayout.astro
 - src/components/layout/Header.astro
 - src/components/layout/MenuServiceLink.astro (new)
 - src/components/layout/Footer.astro
 - src/scripts/alpine.ts
 - src/data/site.ts
 - tests/e2e/header-footer-ui.spec.ts (new)
 - tests/e2e/responsive-header.spec.ts, navigation.spec.ts, trust-legal.spec.ts, drafts.spec.ts
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - "Full Playwright + axe: 224 passed, 48 skipped (device-specific), 0 failed"
 - "Measured: mega-menu height 280 px at 1440/1280 (31–35% of viewport), 323 px at 1024 (42%), no internal scroll needed; CTA right edge 952 px at 1024; footer 457 px at 1440x900"
 - "Screenshots: header closed/open and footer at 1440, 1280, 1024, 768, 390 in light and dark (30 images)"
---

## Prompt

UI fixes on dev. Keep the existing design system (colours, fonts, radius, shadows, icons, animations). Do not remove or rename any service. First show me the proposed layout for items 2 and 3 (a short ASCII sketch per breakpoint), then implement after my OK.

1. Focus rings after mouse clicks: the logo, header links and buttons show a focus border after clicking until I click elsewhere. Keep focus rings for keyboard users only: switch :focus styles to :focus-visible site-wide, so mouse clicks show no ring and Tab navigation still does. Keep the accessibility tests passing.

2. Services mega-menu (desktop): the "Managed Cloud & DevOps" column has one item and a large empty space, and the menu covers almost the whole page. Rebalance it:
   - Column A: "Managed Cloud & DevOps" (flagship, keep it first and visually highlighted), with "Practical AI & Automation" stacked below it in the same column.
   - Columns B–C: "Cloud & DevOps Engineering" split across two sub-columns (4 + 3 items) under one heading.
   - Column D: "Web & SaaS Engineering".
   - Keep the left intro panel with "View all services" and "Start here", but narrower if needed.
   - Tighten item vertical spacing so the menu is much shorter (target: no column taller than about 4 items) and never taller than ~70% of the viewport; scroll inside the menu if a small laptop screen still needs it.
   - Check 1440, 1280 and 1024 widths, light and dark.
   Tablet and phone: in the mobile menu, make "Services" an expandable item that opens the 4 pillars as collapsible groups listing their services (collapsed by default), using the existing mobile-menu styles and animations. It must work by touch and keyboard, with correct aria-expanded.

3. Footer: it is now taller than the screen. Use the same grouping as the mega-menu (Managed + Practical AI together, Cloud & DevOps Engineering split into two sub-columns, Web & SaaS) and tighten link spacing, so the whole footer fits within one screen at 1440×900. Keep every service name, the brand block, Company links and the Privacy · Terms · Trust row. On phones, show the four pillar groups as collapsible sections (or a compact stacked list) so the footer stays short.

4. Footer copyright line: change "© 2026 ZanamTech · Remote-first Cloud, DevOps & AI engineering" to "© 2026 ZanamTech · Cloud, DevOps & AI engineering". Update any test or lint rule that expects the old text.

5. Header: remove the separate "Managed Services" nav item; the flagship stays first in the Services menu. With the freed space, show "Insights" in the header from 1024px up, and confirm the CTA no longer overflows at 1024px.

Then: update the affected tests (header, mega-menu, mobile menu, footer, responsive header), run npm run check, lint:content, check:csp and the full Playwright + axe suite, take screenshots of header open/closed and footer at 1440, 1280, 1024, 768 and 390 in light and dark, record a prompt history entry, commit on dev, and show me the results. Don't push.

(Follow-up: "OK, implement as sketched.")

## Response snapshot

1. **Focus rings:**
   - The CSS was already :focus-visible-only, and the issue did not reproduce in Chromium, Firefox or WebKit (all three were checked by script).
   - To make the behaviour deterministic everywhere, a small input-modality script sets `html[data-modality]` on pointerdown/keydown, and global.css hides the ring for links and controls after pointer input only. Any navigation key restores it, and text fields keep their focus style.
2. **Mega-menu:**
   - Five-column layout (72rem): intro | Managed (flagship tile with a "Flagship" badge) + Practical AI | Cloud & DevOps in 4 + 3 sub-columns | Web & SaaS. The 44 px rows are kept (Constitution II).
   - At lg the intro blurb is hidden. The inner wrapper is capped at 70vh with internal scroll, so the hover bridge is preserved.
   - Height went from 566 to 280 px.
   - **Mobile drawer:** Services is an aria-expanded button that reveals View all / Start here plus the four pillars as native details, collapsed by default.
3. **Footer:** the same grouping on a 12-column grid (brand 3 / services 7 / company 2 at xl; brand row at lg; 2 columns at md); 32 px link rows from lg and 44 px on touch sizes. On phones there is a tagline, the email, four collapsible pillar groups and a 2-column Company list. Measured at 457 px at 1440x900.
4. **Copyright line** changed, and the test updated. No lint rule referenced it.
5. **Header nav:** Services · How We Work · Insights · About from 1024 px; the CTA ends at 952 px at 1024. Services is now also active on the flagship page.

Tests: a new header-footer-ui spec covers keyboard-only rings, menu height and balance at 3 widths, the CTA fit, the mobile Services expander (touch and keyboard, aria-expanded), and the footer fit plus collapsible phone groups. Existing specs were updated.

## Outcome

- ✅ Impact: a compact, balanced services menu and footer; keyboard-only focus rings; Insights back in the header at lg.
- 🧪 Tests: see the list above.
- 📁 Files: see the list above.
- 🔁 Next prompts: owner review of the screenshots; push when instructed.
- 🧠 Reflection: when a reported focus ring cannot be reproduced, an input-modality guard fixes it across browsers without weakening keyboard accessibility.

## Evaluation notes (flywheel)

- Failure modes observed: duplicate h2 names (footer pillar headings vs /services) made a strict locator ambiguous, fixed with h3 under an sr-only h2; a grep pattern starting with "-" was parsed as an option.
- Graders run and results (PASS/FAIL): check PASS; lint PASS; CSP PASS; E2E PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

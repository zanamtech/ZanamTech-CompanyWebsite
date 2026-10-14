---
id: 19
title: UI polish and full QA pass
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: ui polish + full QA on dev
labels: ["ui", "footer", "spacing", "reveal", "bugfix", "qa", "cross-browser", "a11y", "lighthouse"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/layout/Footer.astro
 - src/styles/global.css
 - src/components/sections/Process.astro
 - src/scripts/alpine.ts
 - src/scripts/reveal.ts
 - src/components/sections/CtaBand.astro
 - src/components/sections/EntryOffers.astro
 - src/components/sections/PageHero.astro
 - src/components/sections/ProofStrip.astro
 - src/components/sections/ResultsBand.astro
 - src/components/sections/FlagshipSpotlight.astro
 - src/components/sections/PillarGrid.astro
 - src/components/sections/ArticleBody.astro
 - src/components/sections/ArtefactCard.astro
 - src/components/sections/Industries.astro
 - src/components/sections/Pillars.astro
 - src/pages/index.astro
 - src/pages/approach.astro
 - src/pages/about.astro
 - src/pages/privacy.astro
 - src/pages/services/[slug].astro
 - src/pages/resources/[...slug].astro
 - tests/e2e/reveal.spec.ts
 - tests/e2e/home-v3.spec.ts
 - tests/e2e/header-footer-ui.spec.ts
 - docs/PROGRESS.md
 - docs/internal/qa-2026-10-14.md (gitignored)
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - Playwright + axe full suite x3 (747 passed, 0 failed, 0 flaky)
 - Full suite in Chromium, Firefox and WebKit (Chromium and Firefox green; 7 WebKit failures triaged as platform or harness, listed in the QA report)
 - QA sweep: 1,176 page loads (28 routes x 7 widths x 2 themes x 3 engines) plus 210 dev-mode loads
 - Lighthouse on 12 pages (98-99 / 100 / 100 / 100, LCP <= 2.21 s, CLS 0.001)
---

## Prompt

UI polish + full QA on dev. Keep the design system (colours, fonts, radius, shadows, animations) unchanged unless a fix needs it.

A. FOOTER (desktop/tablet; phone layout unchanged)
1. Column gaps: make the horizontal gaps between all service columns and the two Cloud sub-columns equal, and balance column widths so the left side doesn't feel crowded.
2. Second Cloud sub-column: make each sub-column an independent list with the same vertical gap between items as every other column (today "Observability & Monitoring" and "Cloud Cost Optimisation" have an uneven gap because items follow the rows of the first sub-column). The first link under every heading must start at the same height.
3. Company row: keep it on the same line as contact@zanamtech.com. Add a clear gap after the "Company" label, then spread the links evenly so the row reaches the right edge of the "Web & SaaS Engineering" column (no empty space on the right). Keep the dot separators or replace them with even spacing, whichever looks cleaner.
4. Vertical balance: there is a large empty band between the service lists and the divider above the Company row. Increase the vertical gap between service links slightly (consistently in every column) so the lists fill more of the height, and reduce the space above the divider. The footer must still fit within one screen at 1440x900.

B. SECTION SPACING (whole site)
5. Many sections have too much empty space between them, e.g. between the sample cards and "How we engage", between the Trust/"Security & trust" block and the FAQ, and between the final CTA card and the footer. Reduce vertical section padding by roughly 25–30% using the existing spacing tokens, so every section has the same rhythm on every page. Check desktop, tablet and phone; on phones keep enough space that sections don't feel cramped. Don't change spacing inside cards.

C. BUG: "How we engage" cards disappearing
6. On the home page, in the "How we engage" section, one or more of the 4 step cards (often 03, sometimes 02 or 04) sometimes render invisible/blank after page load and only appear on hover. Likely cause: the reveal/stagger animation leaves opacity at 0 (IntersectionObserver not firing, animation race, or a hover style that resets opacity). Find the root cause and fix it so every card always becomes visible: on load, on fast scroll, on scroll up, on reload mid-page, with back/forward cache, and with reduced motion. Check every other section that uses the same reveal engine for the same bug. Add a regression test that loads the page several times and asserts all 4 cards end fully visible (opacity 1) without hovering.

D. FULL QA PASS (act as a senior QA engineer)
7. Test every page and route (home, services index + all 13 service pages, start-here, how-we-work, industries, about, trust, terms, privacy, insights + 3 articles, resources + samples in dev, 404, redirects) at 1920, 1440, 1280, 1024, 768, 390 and 360 widths, light and dark, in Chromium, Firefox and WebKit. Check for:
   - layout: overlaps, clipping, overflow/horizontal scroll, misaligned grids, uneven gaps, text wrapping badly, z-index issues (header, mega-menu, scroll cue)
   - animations: reveal, counters, marquee, menu, FAQ, theme toggle; nothing stuck invisible; reduced motion respected
   - interactions: header mega-menu (hover, click, keyboard, Esc, click outside), mobile menu and its accordions, contact popup (open/close, every field, validation, agency prefill, submit states), FAQ, scroll cue, all links and CTAs (no broken or wrong links), theme persistence
   - accessibility: keyboard order, visible focus with Tab, aria states, headings order, alt text, contrast in both themes (axe)
   - content: banned wording (run lint), typos, inconsistent names or capitalisation, all three clouds named consistently
   - console errors/warnings, failed network requests, CLS/layout shift on load and font load
8. Run all existing checks: npm run check, lint:content, check:csp, the full Playwright + axe suite (all projects, 3 repeat runs to catch flaky tests) and Lighthouse on the main pages.
9. Fix every bug you find that is clearly a bug. For anything that is a design or content decision, don't change it: list it for me.

OUTPUT
- A QA report in docs/internal/qa-2026-10-14.md: what was tested, every issue found (page, width, theme, browser, severity, screenshot path, fixed or open).
- Before/after screenshots for the footer, section spacing and the "How we engage" fix at 1440, 1024 and 390, light and dark.
- Update docs/PROGRESS.md, record a prompt history entry, commit on dev and push.
- Show me a short summary: what you fixed, what needs my decision, final test and Lighthouse results.

## Response snapshot

- **Footer:**
  - Explicit brand | services grid at xl (17rem + 64px gap); 32px gaps between every column and sub-column.
  - Independent lists with an even 16px text gap; equal first-link heights.
  - Company row baseline-aligned with the email and spread evenly with justify-between, no dots; 42px above the divider; footer 457px at 1440x900.
- **Spacing:** section-y / section-t / section-b scale at 36/48/56px (was 48/64/80). Applied to every page, PageHero, CtaBand and the footer margin; the home/approach CTA wrappers were removed.
- **"How we engage":**
  - Root cause: html scroll-behavior: smooth animated the browser's scroll restoration, which started the 3.25s sequence off-screen. Measured on the before build: cards 03/04 at opacity 0.35–0.52 and 0, 250ms after scrolling back.
  - Fixes: html:focus-within smooth scrolling; finish-if-scrolled-past; a scroll/pageshow/visibility watchdog; the fade moved to the glass card (an ancestor below opacity 1 is the backdrop root); a done state.
  - reveal.ts got the same treatment plus a viewport-aware threshold.
  - Regression tests added in reveal.spec.ts.
- **QA:**
  - 1,176-load sweep with detectors validated by injected faults: no layout or console issues in the built site.
  - Dev sweep found table overflow on phones and an h1->h3 skip on /resources: both fixed.
  - A spacing regression in the scroll-cue offsets was caught by the test and fixed; 4 US spellings fixed.
  - Cross-browser suite: the FAQ test was made frame-independent; WebKit skip-link, theme-latency and an intermittent contact-click stall are listed as open for real-Safari verification.
- **Results:** Lighthouse on 12 pages 98–99/100/100/100. Full suite x3: 747 passed, 0 flaky.

## Outcome

- ✅ Impact: Footer and spacing polish shipped; the step-card bug's real cause fixed in both reveal engines; nine QA bugs fixed.
- 🧪 Tests: all gates green; new reveal regression suite and footer geometry tests.
- 📁 Files: 22 source/test files, PROGRESS.md, QA report (internal).
- 🔁 Next prompts: Owner decisions in QA report §6; verify WebKit items on real Safari; approve the samples.
- 🧠 Reflection: Two "reproductions" were test artefacts (mouse move cancelling restoration, reading too early). The real cause only appeared once a test reused a page and hit the browser's animated scroll restoration.

## Evaluation notes (flywheel)

- Failure modes observed: interim type-check runs piped through tail -3 hid the error-count line, so a type error in the new reveal test went unnoticed until the pre-commit check (fixed). Git Bash path conversion mangled route lists (fixed with MSYS_NO_PATHCONV=1, which in turn broke curl -o /dev/null); astro preview allows only one instance.
- Graders run and results (PASS/FAIL): check PASS; lint:content PASS; check:csp PASS; Playwright+axe x3 PASS; Lighthouse PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add Firefox/WebKit projects to CI once real-Safari behaviour is confirmed.

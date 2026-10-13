---
id: 17
title: Scroll cue, illustrations, FAQ and footer UI
stage: green
date: 2026-10-13
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: ui fixes round 2 (approved after sketch)
labels: ["ui", "hero", "mega-menu", "illustrations", "faq", "footer", "a11y", "reduced-motion"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/Hero.astro
 - src/components/sections/FlagshipSpotlight.astro
 - src/components/layout/Header.astro
 - src/components/layout/Footer.astro
 - src/components/sections/Faq.astro
 - src/scripts/faq-accordion.ts
 - src/layouts/BaseLayout.astro
 - src/styles/global.css
 - src/components/ui/Illustration.astro
 - src/components/sections/ArtefactCard.astro
 - src/pages/insights/[...slug].astro
 - src/pages/resources/[...slug].astro
 - tests/e2e/header-footer-ui.spec.ts
 - tests/e2e/home-v3.spec.ts
 - tests/e2e/drafts.spec.ts
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - Playwright + axe full suite (235 passed, 51 skipped by project)
 - New/changed tests x3 repeat (39 passed, 21 skipped by project)
 - Lighthouse local on /, /insights, /insights/cloud-cost-checklist (98-99/100/100/100, CLS 0.001)
---

## Prompt

Original request (the sketch and style description were shown first, then approved):

UI fixes on dev. Keep the existing design system (colours, fonts, radius, shadows, animations). First show me a short ASCII sketch for item 5 and a description of the illustration style for item 3, then implement after my OK.

1. Hero scroll-down button: it currently sits half hidden behind the next section ("Selected results from past engagements"). Bring it fully in front (correct z-index/position) so it is completely visible at all widths and in both themes. On click, smooth-scroll to the "Flagship service — Managed Cloud & DevOps" section, offset so the sticky header doesn't cover the heading. Respect prefers-reduced-motion (jump instead of smooth scroll) and keep it keyboard accessible with an aria-label.

2. Services mega-menu: remove the "Flagship" badge and the highlighted tile around "Managed Cloud & DevOps". Show it exactly like every other service item (same icon style, spacing and hover). Keep it first in its column. Remove the badge from the mobile menu too if present.

3. Card images: the "How we document work / See the standard before you sign" sample cards and the Insights article cards need an image at the top of each card. Use custom inline SVG illustrations (no stock photos, no external image hosts): simple, abstract technical visuals that match each card's topic (e.g. environment pipeline for the reference architecture, branch/merge flow for the SOP, report/chart for the monthly report, and matching ones for the 3 articles). Use only existing colour tokens so they work in light and dark mode, keep a consistent aspect ratio across cards, add empty alt or aria-hidden since they're decorative, and keep the page weight and Lighthouse scores unchanged. Use the same illustration on the article/sample page header.

4. FAQ accordion: opening and closing is instant. Animate the height smoothly (about 250–300ms ease, plus the chevron rotation) for both open and close, using CSS only if possible. Keep it accessible (native details/summary or correct aria-expanded), keyboard-operable, and instant when prefers-reduced-motion is on.

5. Footer layout (desktop/tablet): remove the separate "Company" column on the right so the service groups spread across the full width up to the right edge. Move the Company links into a single horizontal row placed under the service groups, aligned on the same line as the contact@zanamtech.com email in the brand column: a small "Company" label followed by About · How We Work · Start here · Industries · Insights · Contact. Keep the bottom bar (© line + Privacy · Terms · Trust) as is. Phone layout stays as it is now. Make sure it doesn't feel crowded: balanced column widths and consistent spacing.

Then update the affected tests, run npm run check, lint:content, check:csp and the full Playwright + axe suite, take screenshots (hero scroll button, menu open, sample cards, Insights cards, FAQ open, footer) at 1440, 1024, 768 and 390 in light and dark, update docs/PROGRESS.md, record a prompt history entry, commit on dev and show me the results. Don't push.

Approval:

OK, with three changes:
1. Footer: label the first group "Managed Cloud & DevOps" (same as the menu), not "Managed Services".
2. FAQ: yes, add the small script fallback so the open/close animation works in every browser (Safari and Firefox included); still instant with reduced motion.
3. Illustrations: use a slightly shorter frame on the cards (2:1) so the cards don't get too tall; keep 16:9 for the larger version on the article/sample page header.
Everything else as proposed. Implement, then run the checks and screenshots as listed, update docs/PROGRESS.md, commit on dev, don't push.

## Response snapshot

- Hero now stacks above the results band (z-10), so the cue is fully visible at every width, in both themes and in Chromium, Firefox and WebKit. The cue targets #flagship, and scroll margins on that section put the eyebrow 24 px below the floating header. It jumps under reduced motion.
- Mega-menu: the flagship badge and tile are removed; the item renders like the others and stays first.
- Illustration.astro adds six token-coloured inline SVG motifs (2:1 cards, 16:9 page headers), all aria-hidden, about 1.2 KB gzipped per /insights page.
- FAQ: the CSS ::details-content + interpolate-size path, plus a WAAPI fallback (faq-accordion.ts) for Firefox and Safari. The chevron rotates in step; instant under reduced motion. Animation verified mid-transition in all three engines.
- Footer: the services area spans xl:col-span-9. The Company row is labelled, with dot separators, and sits level with the email at 1440. The phone layout is unchanged. The first group label was already "Managed Cloud & DevOps".
- Tests updated and added; all gates green. 64 screenshots are in docs/internal/screenshots/2026-10-13-ui-fixes/. PROGRESS.md is updated.

## Outcome

- ✅ Impact: Five UI fixes shipped on dev with no design-token changes and no CSP changes.
- 🧪 Tests: check, lint:content, check:csp, full Playwright + axe green; new tests stable over 3 repeats; Lighthouse unchanged range.
- 📁 Files: 12 source files, 3 test files, PROGRESS.md.
- 🔁 Next prompts: Review the screenshots, then push dev. Optionally fix the sample-card title casing ("monthly service report").
- 🧠 Reflection: Port 4321 was held by a stale dev server, so Playwright's reuseExistingServer would have tested dev mode; the suite was run against a fresh preview on another port.

## Evaluation notes (flywheel)

- Failure modes observed: The ASCII sketch labelled the first footer group "Managed Services" while the code already used the pillar title, and the owner had to correct it.
- Graders run and results (PASS/FAIL): check PASS; lint:content PASS; check:csp PASS; Playwright+axe PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Make the Playwright port configurable through an env var to avoid stale-server reuse.

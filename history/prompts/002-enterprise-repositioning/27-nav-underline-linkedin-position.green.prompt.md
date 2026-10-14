---
id: 27
title: Nav underline and LinkedIn position
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: two UI tweaks — active nav underline, founder LinkedIn button position
labels: ["header", "about", "ui"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/styles/global.css
 - src/pages/about.astro
 - tests/e2e/review3.spec.ts
 - tests/e2e/header-footer-ui.spec.ts
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors, 0 warnings)
 - Playwright review3, review-fixes, approach-industries, trust-legal, header-footer-ui, navigation (desktop + mobile): all pass
 - header-footer-ui "mouse click leaves no ring" repeated 10x: 10 passed
---

## Prompt

Two small UI tweaks, nothing else:
1. Header nav: remove the underline under the active page link. The active page keeps only the purple text colour (as now). Hover stays colour-only.
2. About → founder card: keep the outlined "LinkedIn" button exactly as it is now (icon + "LinkedIn" text, opens in new tab), but move it back to the top-right corner of the card, aligned with the name row, where the icon-only version used to be. On mobile (<768px) place it under "Founder & Lead Architect" so it doesn't overlap the name.
Core capabilities on About: keep the current two lists of four as they are.
Run only affected tests + npm run check. Commit on dev, push, update PROGRESS.md.

## Response snapshot

Removed the active-link underline rule (colour only). Founder card: name/role and the LinkedIn button share a row from md (button top-right, level with the name); below md the row stacks, so the button sits under the role. Tests updated; the focus-ring test was made to wait for focus on <main> (a race with the 3g focus move, 1 in 5 failures before).

## Outcome

- ✅ Impact: both tweaks done; capabilities untouched.
- 🧪 Tests: check pass; affected specs pass; flaky test stabilised.
- 📁 Files: see list.
- 🔁 Next prompts: none.
- 🧠 Reflection: focus-moving behaviour after navigation needs tests to wait for it before sending keys.

## Evaluation notes (flywheel)

- Failure modes observed: intermittent focus-ring test (timing), fixed in the test.
- Graders run and results (PASS/FAIL): check PASS, Playwright PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

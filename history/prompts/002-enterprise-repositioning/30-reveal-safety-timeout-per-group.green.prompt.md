---
id: 30
title: Reveal safety timeout per group
stage: green
date: 2026-10-15
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: reveal timeout per group on viewport entry
labels: ["reveal", "safety-timeout", "intersection-observer"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/scripts/reveal.ts
 - tests/e2e/reveal-sitewide.spec.ts
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors)
 - Playwright reveal-sitewide + reveal (desktop + mobile): 38 passed; --repeat-each 2: 76 passed
---

## Prompt

Reveal timeout: start the 4-second safety timeout per group only when that group enters the viewport (not on page load), so lower sections still fade in. Keep all other fail-safe rules. Run the reveal tests + npm run check, commit on dev, push, update PROGRESS.md.

## Response snapshot

Replaced the page-wide 4s timer with per-group timers armed by a second IntersectionObserver (any visible pixel) and by the scroll watchdog. On fire: reveal without animation if not yet revealed, else strip reveal styles. Timers and observers cleared on astro:before-swap. Added a test proving a below-fold group stays hidden past 5s unscrolled, then fades in on scroll and ends clean.

## Outcome

- ✅ Impact: lower sections fade in again; fail-safe preserved.
- 🧪 Tests: 38 passed, 76/76 on repeat; check 0 errors.
- 📁 Files: see list.
- 🔁 Next prompts: next page in the page-by-page review.
- 🧠 Reflection: a safety net should be scoped to the moment the user can see the content.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): check PASS, Playwright PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

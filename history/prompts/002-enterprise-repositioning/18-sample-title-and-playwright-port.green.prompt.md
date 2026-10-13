---
id: 18
title: Sample title and Playwright port
stage: green
date: 2026-10-13
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: follow-ups after UI fixes round 2
labels: ["content", "testing", "playwright", "ci-hygiene", "push"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/content/resources/sample-monthly-service-report.md
 - playwright.config.ts
 - README.md
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - Playwright + axe full suite on an auto-picked free port (235 passed, 51 skipped by project)
 - npm run check:csp (pass)
 - Pinned PLAYWRIGHT_PORT=4330 smoke run (1 passed)
---

## Prompt

1. Fix the sample title casing: "Monthly service report" (capital M), and check the other two titles too.
2. Make the Playwright test port configurable (env var, default to a free port) so a running dev server is never reused by accident.
Then stop the stale dev server on port 4321, run the checks, commit on dev, and push dev to origin.

## Response snapshot

- The sample title is now "Sample: Monthly service report". The other two titles ("Azure Dev/QA/UAT/Prod reference architecture", "Bitbucket branch-governance SOP template") already start with a capital.
- playwright.config.ts uses PLAYWRIGHT_PORT when set; otherwise it asks the OS for a free port and stores it in the environment, so the workers that reload the config use the same one. reuseExistingServer is now always false. The README documents this.
- Port 4321 was already free when checked; the stale dev server had stopped.
- All checks are green, the change is committed on dev and dev is pushed to origin.

## Outcome

- ✅ Impact: Correct sample title casing; the test runs can no longer hit a dev server by accident.
- 🧪 Tests: check, lint:content, check:csp, full Playwright + axe green; pinned-port run green.
- 📁 Files: 1 content file, playwright.config.ts, README.md, PROGRESS.md.
- 🔁 Next prompts: Close the launch items in PROGRESS section 5 (legal review, Trust practices, form key, domain and email).
- 🧠 Reflection: A random port must be shared with Playwright workers through the environment, or each worker would pick a different one.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): check PASS; lint:content PASS; check:csp PASS; Playwright+axe PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

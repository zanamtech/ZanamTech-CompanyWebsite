---
id: 5
title: Repositioning task breakdown
stage: tasks
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.tasks
labels: ["tasks", "repositioning", "phased-delivery", "design-freeze"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: history/adr/003-verified-only-proof-content-model.md, history/adr/004-pillar-service-taxonomy-with-readiness-gating.md
  pr: null
files:
 - specs/002-enterprise-repositioning/tasks.md
tests:
 - "Format validation: 119/119 tasks match '- [ ] T### [P?] [US#?] description + path'"
---

## Prompt

Yes, write both ADRs first (/sp.adr verified-only-proof-model and /sp.adr pillar-service-taxonomy), then run /sp.tasks.

## Response snapshot

- **Output:** `specs/002-enterprise-repositioning/tasks.md` with 119 tasks, organised by the 6 delivery phases (as the user asked) rather than one phase per story. Tasks carry story labels US1–US8.
- **Tasks per phase:**

  | Phase | Tasks | Scope |
  |---|---|---|
  | 0 | 6 | governance docs |
  | 1 | 14 | additive content model; UI unchanged |
  | 2 | 38 | copy, 13 services, results, drafts |
  | 3 | 37 | sections and pages from existing primitives |
  | 4 | 16 | lint rules, mutation check, new E2E |
  | 5 | 8 | verification, SC-001 design-freeze screenshots, README |

- **Every phase ends with** gates (check, lint, CSP, Playwright + axe), one commit, a PHR, and a STOP for review.
- **Tasks per story:** US1 12, US2 23, US3 6, US4 11, US5 5, US6 9, US7 5, US8 4.
- **Also included:** dependencies, parallel examples and the MVP strategy.

## Outcome

- ✅ Impact: an executable, phase-gated task list ready for /sp.analyze.
- 🧪 Tests: format validation PASS.
- 📁 Files: tasks.md
- 🔁 Next prompts: /sp.analyze (on user approval).
- 🧠 Reflection: making Phase 1 additive (old fields kept until T060) keeps the suite green and the UI identical at that checkpoint.

## Evaluation notes (flywheel)

- Failure modes observed: the per-story counts in the totals line were initially miscounted; fixed after grep verification.
- Graders run and results (PASS/FAIL): checklist format PASS; phase counts verified
- Prompt variant (if applicable): phases organised by delivery plan (user instruction) instead of the template's per-story phases
- Next experiment (smallest change to try): none

---
id: 47
title: Managed onboarding wording, 2–4 weeks
stage: general
date: 2026-10-16
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: Managed Cloud & DevOps onboarding wording change
labels: ["content","copy","managed-cloud-devops","onboarding"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/services/[slug].astro
 - src/content/services/managed-cloud-devops.md
 - tests/e2e/services-v3.spec.ts
 - docs/review/SITE_COPY.md
tests:
 - npm run lint:content (pass)
 - npm run check (0 errors, 0 warnings)
 - tests/e2e/services-v3.spec.ts (85 passed)
---

## Prompt

Managed Cloud & DevOps page: onboarding wording.
- Card title "4-week onboarding" → "Onboarding in 2–4 weeks".
- Card text: "Depending on platform size. Least-privilege access and monitoring and backup checks start in the first week, followed by a platform review, runbook and diagram baselines, and an agreed reporting format before steady-state operations begin."
- FAQ "What does onboarding involve?": "Onboarding takes 2–4 weeks, depending on platform size. Least-privilege access and monitoring and backup checks start in the first week, followed by a platform review, runbook and diagram baselines, and an agreed reporting format before steady-state operations begin."
- Update any other place that says "4-week onboarding" (search all content, data and docs/review/SITE_COPY.md).
Run only lint:content + npm run check + any spec that asserts this text. Commit on dev, push.

## Response snapshot

Updated the onboarding card title and text on the flagship branch of src/pages/services/[slug].astro, the FAQ answer in managed-cloud-devops.md, the heading assertion in services-v3.spec.ts, and both spots in SITE_COPY.md. No other content or data file had "4-week onboarding". Planning docs and specs (02_Services_Catalog, 03_Master_Plan_v3, 002 spec/tasks) left unchanged as history. lint:content, check and services-v3 spec all pass.

## Outcome

- ✅ Impact: Onboarding is now shown as 2–4 weeks depending on platform size, in both the card and the FAQ
- 🧪 Tests: lint:content pass; astro check 0 errors; services-v3 85 passed
- 📁 Files: 4 modified
- 🔁 Next prompts: optionally align 02_Services_Catalog.md / 03_Master_Plan_v3.md wording
- 🧠 Reflection: the heading text is asserted by an e2e spec, so the spec changed along with the copy

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

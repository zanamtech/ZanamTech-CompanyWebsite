---
id: 8
title: Implement phase 0 governance
stage: misc
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.implement (Phase 0)
labels: ["implement", "phase-0", "governance", "docs"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: history/adr/003-verified-only-proof-content-model.md, history/adr/004-pillar-service-taxonomy-with-readiness-gating.md
  pr: null
files:
 - docs/01_Brand_Positioning.md
 - docs/02_Services_Catalog.md
 - docs/internal/sow-defaults.md
 - specs/002-enterprise-repositioning/plan.md
 - specs/002-enterprise-repositioning/tasks.md
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - "Full Playwright + axe: 152 passed, 34 skipped (device-specific), 0 failed"
---

## Prompt

Yes, start /sp.implement Phase 0 and include the L1 fix.

## Response snapshot

- **Checklist gate:** requirements.md 16/16 PASS. The ignore files were verified (`docs/` is excluded from the Docker image).
- **T001:** `docs/01_Brand_Positioning.md` rewritten from v3:
  - positioning, category, the 5 ICPs, pillars, hero
  - the process-based engagement description, the AI-tool policy, and approved and banned wording
  - proof rules, the remote-first location rule, and the "Never sell" list
  - Removed: years claims, senior-access wording, the competitor matrix, local LLM, GCP.
- **T002:** `docs/02_Services_Catalog.md` rewritten:
  - the flagship's 7 modules, 3 tiers (coverage wording only) and P1–P4 severity
  - onboarding and exit terms
  - 12 services in 4 pillars with slugs, and the retired entries with their redirects
  - 5 entry offers, 5 engagement models, and the achieved-results table plus footnote
  - The name "Managed Cloud & DevOps" is used consistently (T1).
- **T003:** `docs/internal/sow-defaults.md`, the internal-only response defaults and coverage.
- **L1:** the plan.md Constraints line now reads "no clock times, time zones, or minute/hour figures".
- **T004 gates:** all green. **T005:** one Phase 0 commit on dev.

## Outcome

- ✅ Impact: the governance and source documents match v3. No `src/` change; the site is unchanged.
- 🧪 Tests: see the list above.
- 📁 Files: see the list above, plus the constitution, README, specs/002, the ADRs and the PHRs in the commit.
- 🔁 Next prompts: /sp.implement Phase 1 (content model), after user review.
- 🧠 Reflection: none.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): check PASS; lint PASS; CSP PASS; E2E PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

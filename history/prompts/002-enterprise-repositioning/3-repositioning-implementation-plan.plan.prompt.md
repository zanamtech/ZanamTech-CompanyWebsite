---
id: 3
title: Repositioning implementation plan
stage: plan
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.plan
labels: ["plan", "repositioning", "content-model", "redirects", "design-freeze"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-enterprise-repositioning/plan.md
 - specs/002-enterprise-repositioning/research.md
 - specs/002-enterprise-repositioning/data-model.md
 - specs/002-enterprise-repositioning/quickstart.md
 - specs/002-enterprise-repositioning/contracts/service-content.schema.json
 - specs/002-enterprise-repositioning/contracts/lead-submission.md
 - specs/002-enterprise-repositioning/contracts/routes-and-redirects.md
 - CLAUDE.md
tests:
 - Constitution Check (pre- and post-design) PASS
---

## Prompt

Go ahead with /sp.plan. For the 3 open details use: Company size options 1–10, 11–50, 51–200, 201–1,000, 1,000+; results grid 2 columns on tablet; old service URLs as permanent 301 redirects in nginx.

## Response snapshot

- **Setup:** ran setup-plan with SPECIFY_FEATURE (the branch stays dev).
- **Constitution Check:** I–VII pass both before and after design; there are no violations.
- **plan.md:** contains the Technical Context, the gate table, the source tree and 6 delivery phases.
- **research.md (R1–R11):**
  - nginx 301s with an optional trailing slash, tested via a static config spec plus a check that each target exists
  - a single `getPublishedServices` gateway, with the flagship as a collection entry
  - ResultsBand is the renamed Metrics markup, with grid sm:2 / lg:4
  - verified-only proof gating
  - draft gating via `import.meta.env.DEV`
  - 3 extra optional dropdowns built on the existing combobox, including the Company size bands
  - the lint extension with an allow-list and a `.well-known` exemption
  - the navigation changes
  - security.txt plus the Terms and Trust pages
  - the scenario `kind`, with no "%" allowed in illustrative scenarios
  - a native-details FAQ
- **data-model.md:** all entities, with validation rules.
- **contracts/:** service schema v2, lead payload v2, and the route map plus 301 table.
- **Also:** quickstart.md, the agent context updated, and two ADR suggestions surfaced.

## Outcome

- ✅ Impact: a design is ready for /sp.tasks, with every decision traceable to the spec, constitution and user choices.
- 🧪 Tests: constitution gates PASS.
- 📁 Files: see the list above.
- 🔁 Next prompts: /sp.tasks (on user approval); optionally /sp.adr for the two suggested decisions.
- 🧠 Reflection: nginx-only redirects can't be exercised by preview-based E2E, so a config-level test fills the gap.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

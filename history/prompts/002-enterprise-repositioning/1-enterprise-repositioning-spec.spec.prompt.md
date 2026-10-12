---
id: 1
title: Enterprise repositioning spec
stage: spec
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.specify
labels: ["spec", "repositioning", "services", "proof-integrity", "design-freeze"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-enterprise-repositioning/spec.md
 - specs/002-enterprise-repositioning/checklists/requirements.md
tests:
 - Spec quality checklist (pass 1, all items pass)
---

## Prompt

Next: run /sp.specify for specs/002-enterprise-repositioning. Source of truth: docs/03_Master_Plan_v3.md. Visual design, animations and transitions must not change.

/sp.specify arguments: specs/002-enterprise-repositioning — Enterprise repositioning of the ZanamTech website per docs/03_Master_Plan_v3.md (source of truth; overrides docs 01/02 and the old plan). Constitution v2.0.0 applies. Visual design, animations and transitions must not change. User decisions: all existing scenario numbers are real past projects (keep a real/illustrative record); keep the 2 commitments ("Written proposal within 2 business days", "We reply within 1 business day"); results section "Selected results from past engagements" with no per-card credit line; reuse counters/shimmer in the results strip and brand-pillar cards in the Trust band; keep "Custom Full-Stack Web App Development" name and slug. Work stays on the dev branch.

## Response snapshot

- **Where it was written:** `specs/002-enterprise-repositioning/spec.md`. The folder was created directly, without the create-new-feature script, so no branch was created and work stays on `dev`.
- **Clarifications:** a session dated 2026-10-12 records the user's 5 decisions.
- **User stories (8):**
  - **P1:** Home offer and results; services by pillar.
  - **P2:** entry offers and agency model; trust/about/privacy/terms; contact form with qualifying fields.
  - **P3:** Insights and artefact drafts; verified-only proof gating; content guardrails.
- **Requirements:** 39 functional requirements, grouped as design preservation, messaging, catalogue, results and proof, offers, trust and legal, navigation, contact, insights, and guardrails and docs. They supersede 001 FR-009, FR-013 and FR-018.
- **Also in the spec:** edge cases, key entities, 10 measurable success criteria (including SC-001, no visual difference except text), assumptions and dependencies.
- **Checklist:** all items pass, with zero clarification markers.

## Outcome

- ✅ Impact: a stakeholder-level spec ready for /sp.clarify or /sp.plan.
- 🧪 Tests: spec quality checklist PASS.
- 📁 Files: spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.clarify (optional) or /sp.plan, on user approval.
- 🧠 Reflection: creating the folder without a branch respects "stay on dev". Later scripts need SPECIFY_FEATURE set.

## Evaluation notes (flywheel)

- Failure modes observed: the create-new-feature script always checks out a new branch, which conflicts with the user's dev-only rule, so the folder was created agent-natively.
- Graders run and results (PASS/FAIL): requirements checklist PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

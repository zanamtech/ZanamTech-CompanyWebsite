---
id: 4
title: ADRs proof model and taxonomy
stage: misc
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.adr
labels: ["adr", "architecture", "proof-model", "taxonomy"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: history/adr/003-verified-only-proof-content-model.md, history/adr/004-pillar-service-taxonomy-with-readiness-gating.md
  pr: null
files:
 - history/adr/003-verified-only-proof-content-model.md
 - history/adr/004-pillar-service-taxonomy-with-readiness-gating.md
tests:
 - "ADR grader: clustered decision, ≥1 alternative with rationale, pros and cons, concise (both PASS)"
---

## Prompt

Yes, write both ADRs first (/sp.adr verified-only-proof-model and /sp.adr pillar-service-taxonomy), then run /sp.tasks.

## Response snapshot

- **ADRs created:** ADR-003 "Verified-Only Proof Content Model" and ADR-004 "Pillar-Based Service Taxonomy with Readiness Gating", both Accepted.
- **ADR-003 decision cluster:** data, rendering, results/scenario kind, and lint enforcement. Alternatives considered: placeholders, an env flag, a CMS, target framing.
- **ADR-004 decision cluster:** schema, the single published gateway, the flagship as a collection entry, stable slugs plus nginx 301s, and data-derived tests. Alternatives considered: a flat list plus a featured flag, per-pillar collections, a status enum, Astro redirects.
- **Existing ADRs:** ADR-001 and ADR-002 are referenced. There are no conflicts.
- **Mechanics:** the `create-adr` script isn't present (`.specify/scripts/bash` is missing), so both ADRs were written agent-natively from the template.

## Outcome

- ✅ Impact: the two cross-cutting decisions are recorded before tasks are generated.
- 🧪 Tests: both pass the ADR grader.
- 📁 Files: the 2 ADRs.
- 🔁 Next prompts: /sp.tasks (requested in the same message).
- 🧠 Reflection: both ADRs were done in one /sp.adr pass to avoid a duplicate artifact scan.

## Evaluation notes (flywheel)

- Failure modes observed: the create-adr script is missing.
- Graders run and results (PASS/FAIL): ADR checklist PASS ×2
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

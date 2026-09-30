---
id: 6
title: ADR Framer Motion DOM engine
stage: misc
date: 2026-09-29
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: 001-enterprise-website-baseline
user: mubashirahmed324
command: /sp.adr
labels: ["adr", "architecture", "performance", "framer-motion"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: history/adr/001-client-interactivity-and-motion-runtime.md
  pr: null
files:
 - history/adr/001-client-interactivity-and-motion-runtime.md
 - specs/001-enterprise-website-baseline/plan.md
 - specs/001-enterprise-website-baseline/research.md
tests:
 - none
---

## Prompt

/sp.adr framer-motion-dom-engine-without-react

## Response snapshot

Created ADR-001, "Client Interactivity & Motion Runtime (Framer Motion DOM Engine Without React)" (Accepted). It is a clustered decision:

- Alpine CSP build for UI state.
- Lazy-loaded `framer-motion/dom` for counters and reveal.
- React at build time only, for Lucide.
- Progressive-enhancement guardrails.

It records the measured evidence: 110 KB gzipped with React islands versus about 41.5 KB with the DOM engine. Four alternatives are listed with pros and cons: React islands, React plus the DOM tween, Preact compat, and vanilla motion or CSS. The conflicting plan.md sections (Summary, Technical Context, Key Decision 1, Complexity Tracking, Structure) and research R2 were updated to reference ADR-001.

No create-adr script exists in `.specify/scripts`, so the ADR was written manually from `.specify/templates/adr-template.md`.

## Outcome

- ✅ Impact: planning artifacts are consistent with the implementation; the decision is traceable.
- 🧪 Tests: none (documentation only).
- 📁 Files: 1 ADR created; plan.md and research.md updated.
- 🔁 Next prompts: `/sp.adr strict-csp-alpine-csp-build`; resolve T060/T061; commit.
- 🧠 Reflection: the ADR corrects a false premise in the plan, so updating the superseded plan text was necessary to avoid contradictory artifacts.

## Evaluation notes (flywheel)

- Failure modes observed: create-adr.sh missing; shell tool temporarily unavailable (permission classifier errors).
- Graders run and results (PASS/FAIL): clustered decision PASS; explicit alternatives PASS; pros and cons PASS; concise and detailed PASS.
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): add a PowerShell create-adr script to `.specify/scripts/powershell`.

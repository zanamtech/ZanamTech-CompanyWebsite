---
id: 7
title: ADR strict CSP Alpine build
stage: misc
date: 2026-09-29
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: 001-enterprise-website-baseline
user: mubashirahmed324
command: /sp.adr
labels: ["adr", "security", "csp", "alpine", "nginx", "docker"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: history/adr/002-edge-security-posture-strict-csp.md
  pr: null
files:
 - history/adr/002-edge-security-posture-strict-csp.md
 - history/adr/001-client-interactivity-and-motion-runtime.md
 - specs/001-enterprise-website-baseline/plan.md
 - specs/001-enterprise-website-baseline/research.md
tests:
 - none
---

## Prompt

/sp.adr strict-csp-alpine-csp-build

## Response snapshot

Created ADR-002, "Edge Security Posture (Strict Hash-Based CSP, Alpine CSP Build, Hardened Nginx Runtime)" (Accepted). It is clustered because the parts only stay strict together:

- A CSP with `default-src 'none'`, no unsafe-inline or unsafe-eval, and a hashed theme script.
- The Alpine CSP build, with statement logic moved into registered components.
- CSP-clean build output (no inlined stylesheets or data: assets).
- The full security header set, with HSTS but no preload.
- A non-root `nginx:stable-alpine-slim` runtime.
- The `check:csp` and CSP e2e guardrails.

Six alternatives are listed with pros and cons: unsafe-eval Alpine, nonce CSP, an externalized theme script, permissive build output, a meta CSP, and larger nginx images.

Conflicts resolved: research R3 and R9 revised; plan.md Target Platform, structure and Key Decision 4 updated; ADR-001 cross-linked. The prerequisites script ran successfully. No create-adr script exists, so the ADR was written from `.specify/templates/adr-template.md`.

## Outcome

- ✅ Impact: the security architecture is documented with rationale, constraints on future authoring, and the drift guardrails.
- 🧪 Tests: none (documentation only).
- 📁 Files: 1 ADR created; 1 ADR, plan.md and research.md updated.
- 🔁 Next prompts: resolve T060 (image size with Docker) and T061 (Lighthouse on Linux CI); owner decisions on HSTS preload, contact email and form key; commit.
- 🧠 Reflection: recording the Alpine CSP authoring constraints is the most valuable part for future contributors, because violations fail only at runtime.

## Evaluation notes (flywheel)

- Failure modes observed: create-adr.sh missing (manual template fill).
- Graders run and results (PASS/FAIL): clustered decision PASS; explicit alternatives PASS; pros and cons PASS; concise and detailed PASS.
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): add a lint that rejects statement syntax in `x-*` attributes to catch Alpine CSP violations before runtime.

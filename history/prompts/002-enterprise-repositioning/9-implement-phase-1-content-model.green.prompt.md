---
id: 9
title: Implement phase 1 content model
stage: green
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.implement (Phase 1)
labels: ["implement", "phase-1", "content-model", "schema", "governance-fixes"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: history/adr/003-verified-only-proof-content-model.md, history/adr/004-pillar-service-taxonomy-with-readiness-gating.md
  pr: null
files:
 - .gitignore
 - .specify/memory/constitution.md
 - docs/01_Brand_Positioning.md
 - specs/002-enterprise-repositioning/spec.md
 - specs/002-enterprise-repositioning/research.md
 - specs/002-enterprise-repositioning/tasks.md
 - src/content.config.ts
 - src/content/services/*.md (10 files, front matter only)
 - src/content/insights/.gitkeep
 - src/content/resources/.gitkeep
 - src/content/case-studies/.gitkeep
 - src/data/results.ts
 - src/data/managed-tiers.ts
 - src/data/offers.ts
 - src/data/commitments.ts
 - src/data/faq.ts
 - src/data/leadership.ts
 - src/data/clients.ts
 - src/data/testimonials.ts
 - src/data/engagement.ts
 - src/lib/services.ts
 - src/lib/content.ts
 - src/components/layout/Header.astro
 - src/pages/services/index.astro
 - src/pages/services/[slug].astro
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - "Built-HTML comparison with the pre-Phase-1 code: every HTML page byte-identical"
 - "Full Playwright + axe: 152 passed, 34 skipped (device-specific), 0 failed; no test edits"
---

## Prompt

Phase 0 reviewed. Before Phase 1, three small fixes:
1. Keep docs/internal/sow-defaults.md out of git: add docs/internal/ to .gitignore and remove it from the commit history of this branch (git rm --cached). Keep the local file.
2. In the banned-wording rules, ban clock times and zone labels (PKT, GMT, EST etc.) and minute/hour figures, but allow the phrase "time-zone overlap".
3. Use "NDA available before discovery" consistently in docs/01.
Then run /sp.implement Phase 1 only and stop for my review.

## Response snapshot

- **Fixes:**
  1. Added `docs/internal/` to `.gitignore`, ran `git rm --cached`, and amended the unpushed Phase 0 commit (9292adc → a6a14c2), so the file is absent from branch history. The local file is kept.
  2. Constitution PATCH 2.0.1 now names time-zone labels and minute/hour figures, and allows "time-zone overlap" and week durations. Aligned spec FR-038 and its acceptance scenario, research R7 (case-sensitive zone-label regex), tasks T096/T097 (allow-list) and docs/01.
  3. docs/01 and the T013 FAQ topic now say "NDA available before discovery".
  
  Committed as 9f5298d.
- **Phase 1 (T007–T020):**
  - Services schema v2: pillar, flagship, published, seoTitle, deliverables, engagementTypes, faq, relatedOffer, and scenario `kind` with a no-digits refinement for illustrative scenarios. `group` and `status` are kept as optional legacy fields.
  - New collections: insights, resources (`sample: true`) and caseStudies (verified, permissionDate, evidence).
  - All 10 service files migrated in front matter only. The flagship is managed-infrastructure-24-7; agentic is unpublished, with illustrative scenarios.
  - New data modules:
    - results (8 figures, achieved labels, context from the matching real scenarios, internal attribution)
    - managed tiers and severity
    - 5 offers, commitments, Home FAQ
    - leadership (empty links and photo, no certifications)
    - empty clients and testimonials
    - engagement extended with engagementModelCatalog, cadence, accessModel, aiToolPolicy
  - `lib/services`: pillars, getPublishedServices, getServicesByPillar, getFlagship, plus legacy displayGroup and getActiveServices (no filtering, per I1). `lib/content`: isVisible, verifiedOnly, hasVerifiedCaseStudies, hasPublishedInsights.
  - Three callers switched to displayGroup.
  - **Gates:** all green; the built site is byte-identical to before.

## Outcome

- ✅ Impact: the content model and data foundation are in place, with zero visible change.
- 🧪 Tests: see the list above.
- 📁 Files: see the list above.
- 🔁 Next prompts: /sp.implement Phase 2 (content), after user review.
- 🧠 Reflection: `@deprecated` JSDoc tags add astro-check warnings, so they were replaced with "Legacy (removed in T0xx)" comments to keep 0 warnings. Empty collections log expected glob-loader warnings at build time.

## Evaluation notes (flywheel)

- Failure modes observed: deprecation warnings from JSDoc and `z.string().url()` (Zod 4), both fixed.
- Graders run and results (PASS/FAIL): check PASS; lint PASS; CSP PASS; HTML parity PASS; E2E PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

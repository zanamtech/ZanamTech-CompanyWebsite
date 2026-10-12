---
id: 12
title: Review fixes and phase 4 guardrails
stage: green
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.implement (Phase 4)
labels: ["implement", "phase-4", "lint", "e2e", "multi-cloud", "insights"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: history/adr/003-verified-only-proof-content-model.md, history/adr/004-pillar-service-taxonomy-with-readiness-gating.md
  pr: null
files:
 - scripts/lint-content.mjs
 - tests/e2e/home-v3.spec.ts, services-v3.spec.ts, redirects-config.spec.ts, offers-approach.spec.ts, trust-legal.spec.ts, drafts.spec.ts, proof-gating.spec.ts (new)
 - tests/e2e/contact.spec.ts, theme-a11y.spec.ts (extended)
 - src/data/segments.ts (comment), README.md
 - "(review commit f77a540) src/content/services/*, src/content/insights/*, src/pages/resources/[...slug].astro, src/pages/insights/[...slug].astro, src/components/layout/Header.astro, src/lib/lead.ts, src/data/*, .specify/memory/constitution.md, docs/01, docs/02, specs/002/*"
 - docs/internal/incident-response-runbook.md, docs/internal/sub-processor-list.md (gitignored)
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - "Full Playwright + axe: 215 passed, 41 skipped (device-specific + 1 fixme), 0 failed"
 - "Lint mutation check: 17 rule families caught with file:line; 5 allow-listed phrases not flagged; proof-data and cited-statistic checks fire on planted entries"
---

## Prompt

Phase 3 reviewed. Changes before Phase 4:
1. Cloud platforms: treat AWS, Azure and Google Cloud equally across the whole site (hero, services, stacks, flagship modules, FAQ, Trust, metadata). Wherever a cloud is named, name all three. Contact form "Cloud platform" options: AWS, Azure, Google Cloud, Multi-cloud, Other. Update the spec, docs/01, docs/02, constitution note and lint to match.
2. Add a /resources index page listing the samples (drafts visible only in npm run dev), using existing card styles, and link it from Insights.
3. Trust page: keep the practices as stated; I will have them in place before launch. Draft an incident-response runbook and a sub-processor list in docs/internal/ (gitignored).
4. Header spacing fix and both wording changes: approved. Mobile menu: keep as it is today.
5. Insights articles: approved.
Run the checks, commit, then start /sp.implement Phase 4 only and stop for my review.

## Response snapshot

### Review changes (commit f77a540)
- **Equal multi-cloud wording:** "AWS, Azure and Google Cloud" in all general copy; each cloud-specific tool has its counterpart on the other two clouds. Real past scenarios keep the cloud they ran on, and the founder bio says "production cloud estates".
- **Docs and form:** constitution 2.0.3, FR-006a, docs/01, docs/02, the lead contract and the lint plan updated. The contact form cloud options are now AWS, Azure, Google Cloud, Multi-cloud, Other.
- **/resources index:** a [...slug] route with an index page, linked from Insights only when samples are visible.
- **Insights:** the 3 articles are published, and the cost checklist names all three clouds.
- **Header:** the Insights link is shown from xl only, because at 1024 px the CTA overflowed to 1071 px.
- **Internal drafts (gitignored):** an incident-response runbook and a sub-processor list.
- The temporary QA config was removed from the commit by amending it.

### Phase 4 (T096–T111)
- **Lint rewrite:**
  - Rules: competitors, team-structure and headcount, first-person, guarantee/zero-downtime/zero-data-loss/100%/24/7, certified, legal suffix, offices, self-hosted LLM, two-cloud phrasing, clock times, zone labels, minute/hour figures (excluding Tailwind classes), pricing including "hourly" and "gig".
  - An allow-list of five approved phrases.
  - A verified-proof pass that counts only value lines, and a check that Insights statistics cite a source.
- **Mutation check:** passed.
- **New specs:** home-v3, services-v3, redirects-config, offers-approach, trust-legal, drafts, proof-gating. contact and theme-a11y extended.
- **Known gap:** SC-006 measured about 1.9 viewport heights on Pixel 7, because the hero is tall on phones. The test is marked fixme pending an owner decision.

## Outcome

- ✅ Impact: the content rules are enforced automatically, and the new structure is covered by tests.
- 🧪 Tests: see the list above.
- 📁 Files: see the list above.
- 🔁 Next prompts: owner decision on SC-006 (hero on phones); then /sp.implement Phase 5 (verification and release).
- 🧠 Reflection: the regex rules must be anchored against code (Tailwind classes, calc(), interface declarations); the mutation probes caught a counting bug before it could mask a missing permission field.

## Evaluation notes (flywheel)

- Failure modes observed: the header overflowing at 1024 px once Insights appeared; the proof counter including interface lines; Python string escapes (moved to direct edits and script files).
- Graders run and results (PASS/FAIL): check PASS; lint PASS; CSP PASS; E2E PASS (1 fixme); mutation check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): decide on SC-006.

---
id: 2
title: Amend constitution v2 repositioning
stage: constitution
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: mubashirahmed324
command: /sp.constitution
labels: ["constitution", "governance", "repositioning", "proof-integrity", "design-freeze"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - README.md
tests:
 - none (governance-only change; no website code touched)
---

## Prompt

Don't start coding. Keep this plan as the reference, but run the work through Spec Kit Plus, one command at a time, and stop after each so I can review:

1. /sp.constitution: amend to v2.0.0 per Phase 0 of docs/03_Master_Plan_v3.md, including my 4 decisions (scenario real/illustrative table, keep the 2 commitments, "Selected results from past engagements" with no credit line, reuse counters/shimmer in the results strip and brand pillars in the Trust band). Add a rule that visual design, animations and transitions must not change.
2. /sp.specify: specs/002-enterprise-repositioning/spec.md. Source of truth: docs/03_Master_Plan_v3.md.
3. /sp.clarify if anything is unclear
4. /sp.plan
5. /sp.tasks
6. /sp.analyze
7. /sp.implement phase by phase

Start with step 1 only.

/sp.constitution arguments: Amend the constitution to v2.0.0 (MAJOR) per Phase 0 of docs/03_Master_Plan_v3.md (approved master plan; overrides docs/01_Brand_Positioning.md, docs/02_Services_Catalog.md and the old Master Execution Plan). Redefine Principle III (Brand & Content Integrity): (a) remove the Roadmap "In Development" rule; (b) allow testimonials, client logos, named case studies and partner/certification badges ONLY from verified data with documented written permission (verified: true + permissionDate + evidence note), shipped empty and hidden until real; (c) explicitly ban fabricated or placeholder social proof; (d) past-project % results stay and are worded as achieved results, never promises, with the footnote "Results from past engagements; outcomes vary by environment. Commitments are defined per Statement of Work."; the words "guarantee", "zero downtime", "zero data loss", "100%" are banned; (e) scenarios: maintain a real/illustrative record per scenario — real anonymised past projects may carry their real numbers; illustrative examples carry no numbers; (f) no team-structure claims ("PM-led", "direct access to senior engineers", headcounts, "our senior engineering team", "one accountable lead"); (g) no clock hours, time zones or support response times on the site — the only allowed time commitments are "Written proposal within 2 business days" and "We reply within 1 business day"; (h) no address, city or offices on the site (remote-first; no Ltd/Inc/LLC until registered; no "certified" until held); (i) results section is titled "Selected results from past engagements" with no per-card credit line, so it neither claims the clients were ZanamTech's nor describes a team; (j) keep bans on public pricing, competitor names, years-of-experience claims; keep the single CTA "Book a Strategy Consultation"; (k) no self-hosted/local LLM claims. Update Principle IV (Design-System Discipline) with a new non-negotiable rule: the existing visual design, animations, transitions, reveal engine, hover system and micro-interactions MUST NOT change; new sections MUST reuse existing primitives (GlassCard, Badge, Button, PageHero, CtaBand) and motion patterns — specifically, the existing metric counters and shimmer are reused in the results strip and the three brand-pillar cards are reused in the Trust band; no new UI libraries, fonts or colour tokens. Update the Content & Brand Standards preferred/avoided terms accordingly (drop "senior engineering expertise", "Representative Engagement Scenario" as mandatory label, "target outcome"). Update Principle VII content-lint gate to cover the new banned phrases, clock-hour patterns and verified-data checks. Do not touch website code.

## Response snapshot

- **Version:** constitution amended 1.0.0 → 2.0.0 (MAJOR), last amended 2026-10-12. `docs/03_Master_Plan_v3.md` is named as the source of truth.
- **Principle III, renamed "Brand, Content & Proof Integrity" and redefined:**
  - Prohibited list: years claims, prices, competitor names, team-structure claims, clock hours, time zones and response times (except the two commitments), address/offices/legal suffixes, "certified"/badges until held, guarantee/zero-downtime/zero-data-loss/100%/unqualified 24/7, and local LLM claims.
  - Proof rules: verified-only proof with permission; fabricated proof banned everywhere; achieved-results wording with the new footnote; the results-section title with no credit line; a real/illustrative record for every scenario; source links on third-party statistics; the single CTA.
- **Principle IV:** a non-negotiable design freeze, with the reuse mandate (counters and shimmer in the results strip, brand pillars in the Trust band) and no new libraries, fonts or tokens.
- **Principle VII:** the content-lint scope is expanded.
- **Content & Brand Standards:** preferred and avoided terms rewritten. **Workflow:** `/sp.analyze` added.
- **Propagation:** the Sync Impact Report lists the templates (no edits needed), the updated README brand rules, and pending items (README content table, docs 01/02, lint and tests, spec 001 FRs superseded).

## Outcome

- ✅ Impact: governance now permits the v3 repositioning and forbids fabricated proof and design drift.
- 🧪 Tests: none (no code change).
- 📁 Files: .specify/memory/constitution.md, README.md
- 🔁 Next prompts: /sp.specify for specs/002-enterprise-repositioning (on user approval).
- 🧠 Reflection: the user's decision 1 ("All are real projects") is encoded as a per-scenario real/illustrative record rather than a blanket assumption, so the rule stays auditable.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): placeholder scan PASS; version/date consistency PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

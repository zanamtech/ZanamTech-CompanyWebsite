# Implementation Plan: Enterprise Repositioning (Master Plan v3)

**Branch**: `dev` (spec folder `002-enterprise-repositioning`; no feature branch, per the user) | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-enterprise-repositioning/spec.md`. Source of truth: `docs/03_Master_Plan_v3.md`.

## Summary

Reposition the existing ZanamTech site as a remote-first Managed Cloud & DevOps partner with Web/SaaS
and practical AI services, without changing its visual design.

**Content and catalogue:**
- The 9-service, two-group catalogue becomes a flagship retainer plus 12 services in 4 pillars.
- Every "% target" becomes an achieved result in a Home results band (reusing the existing metric
  markup, counters and shimmer).
- Added: entry offers, How We Work engagement models, Trust/Terms/Insights pages, and verified-only
  proof components that ship empty.
- Removed: the roadmap, team-structure claims, time figures, GCP and guarantee wording.

**Contact, redirects and guardrails:**
- The contact form gains Region, Company size and Cloud platform.
- Retired URLs 301-redirect in nginx.
- The content lint enforces Constitution v2.0.0.

**Delivery:** the work ships in reviewed phases, one commit per phase.

## Technical Context

**Language/Version**: TypeScript 5 / Astro 7 (static output), Node ≥ 22.12
**Primary Dependencies**: Astro content collections (glob loader + Zod), Tailwind CSS v4, Alpine.js (CSP build), `framer-motion/dom` (reveal + counters), Lucide icons. **No new dependencies.**
**Storage**: N/A (markdown collections + typed data modules)
**Testing**: `astro check`, `scripts/lint-content.mjs`, `scripts/check-csp.mjs`, Playwright + `@axe-core/playwright` (desktop 1440 + Pixel 7, light + dark)
**Target Platform**: static files served by nginx (Docker, non-root, port 8080)
**Project Type**: single static web project
**Performance Goals**: Lighthouse Performance ≥ 95; A11y / Best Practices / SEO = 100; LCP < 2.5 s; CLS < 0.1; JS < 100 KB gz per page
**Constraints**:
- Design freeze (Constitution IV).
- Strict CSP: no inline styles or scripts beyond hashed ones.
- Drafts only in `astro dev`.
- No clock times, time zones, or minute/hour figures on the site (weeks and the two business-day commitments allowed).
- 301 redirects in nginx only.

**Scale/Scope**: about 13 service pages + about 12 other routes; 3 draft articles and 3 draft artefacts; about 15 E2E spec files

All earlier unknowns are resolved in [research.md](./research.md) (R1–R11).

## Constitution Check

*GATE: must pass before Phase 0 research; re-checked after Phase 1 design.*

| Principle | Gate | Pre-design | Post-design |
|---|---|---|---|
| I. Static-First Performance | Pages stay pre-rendered; no new JS bundles beyond the existing reveal/counter/Alpine code; FAQ uses native `<details>` | ✅ | ✅ |
| II. Accessibility (NON-NEGOTIABLE) | New sections use existing accessible patterns (APG combobox, native details, headings, focus styles); axe scans run on every new route in both themes | ✅ | ✅ |
| III. Brand, Content & Proof Integrity | Achieved-result wording plus footnote; real/illustrative scenario `kind` enforced by schema; proof gated on verified data and shipped empty; only the 2 allowed commitments; no team, location, GCP or LLM-hosting claims; lint enforces all of this | ✅ | ✅ |
| IV. Design-System Discipline (design freeze) | ResultsBand is the renamed Metrics markup; Trust band reuses the pillar cards; all new sections compose `GlassCard`/`Badge`/`Button`/`PageHero`/`CtaBand`, `.card-hover`, reveal groups, marquee utilities; no new tokens, fonts or libraries; SC-001 visual comparison in Phase 5. **Approved exception D1** (owner, 2026-10-12): the services mega-menu panel may widen to 4 pillar columns using only the existing header classes, panel transition, item styles and container utilities, and must work on tablet and mobile | ✅ | ✅ |
| V. Zero-Trust Security & Privacy | CSP unchanged (no new origins); security.txt added; privacy notice extended; redirects include the security headers | ✅ | ✅ |
| VI. Mandated Stack | No stack change | ✅ | ✅ |
| VII. Verification Gates | Lint extended (banned phrases, clock times, time zones, minute/hour figures, verified-data checks); E2E extended; gates run at the end of every phase; **`npm run lhci` runs locally against the production build at the end of Phases 3 and 5** (Linux CI is a later follow-up to spec 001 T061) | ✅ | ✅ |

There are no violations, so Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-enterprise-repositioning/
├── spec.md
├── plan.md                 # this file
├── research.md             # R1–R11 decisions
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── service-content.schema.json   # service front-matter v2
│   ├── lead-submission.md            # lead payload v2
│   └── routes-and-redirects.md       # route map + nginx 301s
├── checklists/requirements.md
└── tasks.md                # /sp.tasks output (not created here)
```

### Source Code (repository root)

```text
docs/
├── 01_Brand_Positioning.md        # rewritten from v3
├── 02_Services_Catalog.md         # rewritten from v3
└── internal/sow-defaults.md       # new: internal SOW response defaults (never rendered)

nginx/nginx.conf                   # + 3 permanent 301 locations
public/.well-known/security.txt    # new (RFC 9116)

src/
├── content.config.ts              # services v2 schema; new collections insights, resources, caseStudies
├── content/
│   ├── services/                  # 13 files (flagship + 12); agentic-ai-llmops.md and enterprise-ai-integration.md removed
│   ├── insights/                  # 3 drafts
│   ├── resources/                 # 3 sample artefacts (drafts)
│   └── case-studies/              # empty
├── data/
│   ├── results.ts                 # replaces metrics.ts (same 8 figures, achieved wording + context)
│   ├── managed-tiers.ts           # new: 3 tiers (coverage wording) + P1–P4 severity
│   ├── offers.ts                  # new: 5 entry offers
│   ├── commitments.ts, faq.ts, leadership.ts   # new
│   ├── clients.ts, testimonials.ts             # new, empty arrays
│   ├── engagement.ts, segments.ts, site.ts, platforms.ts  # updated (no GCP, new copy)
├── lib/
│   ├── services.ts                # pillars, getPublishedServices, getServicesByPillar, getFlagship
│   ├── content.ts                 # new: isVisible (draft gating), verified-proof helpers
│   └── lead.ts                    # region, companySize, cloudPlatform; service options
├── components/
│   ├── sections/
│   │   ├── ResultsBand.astro      # renamed from Metrics.astro (markup and motion unchanged)
│   │   ├── FlagshipSpotlight, PillarGrid, EntryOffers, OfferCard, TierTable, SeverityMatrix,
│   │   │   ArtefactCard, TrustBand, Faq, AgencyPartners, CaseStudyCard, LogoMarquee, Testimonials (.astro)
│   │   ├── Hero, ServicesGrid, ServiceCard, Process, Industries, Pillars, ProofStrip, CtaBand  # copy/data only
│   │   └── RoadmapCard.astro      # deleted
│   ├── layout/Header.astro, Footer.astro   # 4-pillar mega-menu, conditional links, remote-first footer
│   ├── ContactForm.astro                 # new optional dropdowns, copy (ContactModal removed 2026-10-14)
├── pages/
│   ├── index.astro, about.astro, approach.astro, industries.astro, contact.astro, privacy.astro  # updated
│   ├── start-here.astro, trust.astro, terms.astro   # new
│   ├── services/index.astro, services/[slug].astro  # pillars + flagship branch
│   ├── insights/index.astro, insights/[slug].astro  # new
│   ├── resources/[slug].astro                       # new
│   └── case-studies/index.astro, case-studies/[slug].astro  # new, gated
├── layouts/BaseLayout.astro       # JSON-LD description, no address, no "Private LLM"
└── scripts/alpine.ts              # leadForm: 3 more menus (existing machinery)

scripts/lint-content.mjs           # extended rules + allow-list + verified-data pass
tests/e2e/                         # updated specs + new: pages-v3, proof-gating, redirects-config, drafts
```

**Structure Decision**: keep the existing single Astro project. Every new section lives in
`src/components/sections/` next to the existing ones and composes the existing UI primitives in
`src/components/ui/`.

## Delivery Phases (one commit each on `dev`; gates and a user review at the end of each)

| Phase | Scope | Gate notes |
|---|---|---|
| 0 Governance | Rewrite docs 01/02 from v3; add `docs/internal/sow-defaults.md` | No `src/` change; the suite should be unchanged |
| 1 Content model | Schema v2 (pillar, flagship, published, deliverables, engagementTypes, faq, scenario `kind`); new collections; data modules; `lib/services.ts` + `lib/content.ts`; minimal call-site adaptation so the UI is unchanged | Suite green, with the old content migrated in place |
| 2 Content | 13 service files; remove the roadmap and old AI entry; results wording + context; all copy rewrites; remove GCP; segments; site/JSON-LD; nginx 301s for retired slugs (same commit); **3 draft articles + 3 draft artefacts**; update the affected test assertions | Owner reviews results context and drafts |
| 3 Components & pages | New sections and pages; Home order; flagship layout; 4-pillar mega-menu (approved exception D1); footer; form fields; security.txt; privacy/terms/trust | Dialog fit re-measured; visual spot-check; Lighthouse (local, production build) |
| 4 Guardrails & tests | Lint extension; new E2E (routes, proof gating, drafts absent, tiers have no time figures, FAQ keyboard, nginx-config test, axe on new routes) | Lint mutation check (inject a banned phrase → fail) |
| 5 Verification | Full gates; grep audit; SC-001 screenshot comparison at 1440/390 × light/dark plus menu at 1440/1024; dialog fit; Lighthouse (local, production build, blocking); PHRs | Release summary |

## Risks
1. **Lint false positives** (clock regex vs ISO timestamps or code; `Inc` inside words). Mitigation:
   word boundaries, text-only file scope, and a path exemption for `.well-known`.
2. **Dialog overflow** with 3 extra fields. Mitigation: re-measure; fallback compaction with existing
   utilities only (R6).
3. **Redirects untested in preview.** Mitigation: the static nginx-config test plus target-existence
   check; `nginx -t` once Docker CI exists.

📋 **Architectural decisions detected:**
- "Verified-only proof content model": proof renders only from permissioned data, enforced by schema and lint. Document reasoning and trade-offs? Run `/sp.adr verified-only-proof-model`.
- "Pillar-based service taxonomy with readiness gating": run `/sp.adr pillar-service-taxonomy`.

## Complexity Tracking

No constitution violations; nothing to justify.

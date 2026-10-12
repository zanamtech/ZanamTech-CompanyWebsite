# ADR-003: Verified-Only Proof Content Model

> **Scope**: how every form of social proof and results evidence is stored, gated, rendered and
> enforced across the site.

- **Status:** Accepted
- **Date:** 2026-10-12
- **Feature:** 002-enterprise-repositioning
- **Context:**
  - ZanamTech is an early-stage, founder-led firm selling to US/UK/EU/GCC enterprise buyers who run
    procurement reference checks.
  - The founder initially wanted placeholder client logos and self-written testimonials. Research
    found a high legal exposure for fabricated or unpermitted proof:
    - US: FTC 16 CFR 465 (up to $53,088 per violation), the Endorsement Guides, Lanham §43(a)
    - UK: DMCC Act 2024 and CAP 3.7/3.45/3.50
    - EU: UCPD Annex I
    - UAE/KSA consumer and trademark law
  - The founder does have real past-project % results and wants proof sections to appear as soon as
    real permissions arrive.
  - Constitution v2.0.0 Principle III makes this binding.
  - The site is fully static (Astro), so gating has to happen at build time.

## Decision

A single, schema-enforced proof model, made of four parts that change together:

- **Data:**
  - `src/data/clients.ts` and `src/data/testimonials.ts` (typed arrays) and a `caseStudies` content
    collection.
  - Every entry requires `verified: boolean`, `permissionDate` (ISO) and `evidence` (a note on where
    the written consent and records live).
  - All three ship as empty data sets.
- **Rendering:**
  - The `LogoMarquee`, `Testimonials` and `CaseStudyCard` sections and the `/case-studies` routes are
    built from `verified === true` entries only, and render nothing (no heading, no empty shell)
    otherwise.
  - Nav links to Case Studies are computed at build time from the same filter.
  - Certification and partner badges follow the same rule, through `leadership.ts`
    (`certifications: []`).
- **Results and scenarios:**
  - Past-project figures live in `src/data/results.ts`, worded as achieved results, with
    industry/challenge context, an internal-only `attribution`, and an optional `evidenceId` for
    records added later.
  - They render under "Selected results from past engagements", with no per-card credit line and the
    fixed past-engagements footnote.
  - Service scenarios carry `kind: 'real' | 'illustrative'`. A schema refinement forbids "%" figures
    in illustrative scenarios, which are labelled "Example engagement".
- **Enforcement:**
  - `scripts/lint-content.mjs` fails the build gate when any proof entry is missing its verification
    fields, or when third-party statistics have no source link.
  - Placeholder, sample or self-written proof is prohibited in every environment, drafts included.

## Consequences

### Positive

- **Legal:** removes the fabricated-proof exposure, and every visible claim can be traced to a
  record when a buyer asks "which client was that?".
- **No code change to add proof:** proof grows with the business. Adding one verified entry switches
  the matching section on automatically.
- **Mistakes are caught early:** schema plus lint enforcement catches errors at build time rather
  than in review.
- **No cost when empty:** empty data sets add no runtime cost and no visual gaps, because hidden
  sections leave no empty shell.

### Negative

- **Thinner launch page:** at launch the site has fewer trust elements (no logos or testimonials)
  than competitors. This is mitigated by the results band, proof-by-artefact, the Trust page and the
  Insights articles.
- **Owner overhead:** evidence and permission records have to be kept outside the repo.
- **Proof needs a rebuild and deploy:** proof can't be switched on from a CMS.
- **Accepted evidence gap:** results keep their numbers before `evidenceId` records exist, by the
  owner's decision. This is a known risk, mitigated by the owner being ready to describe each
  project on calls.

## Alternatives Considered

- **A. Placeholder logos and testimonials now, replaced later:** rejected. It is illegal or
  high-risk in every target market, and fails reference checks.
- **B. Environment flag to show or hide proof sections** (`SHOW_PROOF=true`): rejected. It isn't
  tied to evidence, it's easy to flip by mistake, and it doesn't prevent fake entries from being
  stored.
- **C. Headless CMS with a moderation workflow:** rejected for now. It conflicts with the static-first
  stack (Constitution I/VI), adds cost and needs CSP origins, and the volume (a handful of entries)
  doesn't justify it. It can be revisited if proof volume grows.
- **D. Keep v1 "target outcome" framing with no results claims:** rejected. The owner has real
  results, and achieved results are the strongest available proof.

## References

- Feature Spec: specs/002-enterprise-repositioning/spec.md (FR-016 to FR-021, User Story 7, SC-005)
- Implementation Plan: specs/002-enterprise-repositioning/plan.md
- Research: specs/002-enterprise-repositioning/research.md (R3, R4, R10)
- Data Model: specs/002-enterprise-repositioning/data-model.md (Result, Scenario, Proof Entry)
- Constitution: .specify/memory/constitution.md v2.0.0, Principle III
- Related ADRs: ADR-001 (client interactivity and motion runtime; counters reused), ADR-002 (strict CSP; no new origins)
- Evaluator Evidence: history/prompts/002-enterprise-repositioning/4-adrs-proof-model-and-taxonomy.misc.prompt.md

# ADR-004: Pillar-Based Service Taxonomy with Readiness Gating

> **Scope**: how services are modelled, grouped, published and addressed, and every consumer of
> that model: menus, grids, pages, the lead form, the sitemap and redirects.

- **Status:** Accepted
- **Date:** 2026-10-12
- **Feature:** 002-enterprise-repositioning
- **Context:**
  - **v1 catalogue:** 9 equal-weight services in two loose groups, plus an "In Development"
    roadmap entry.
  - **v3 change:** the master plan repositions ZanamTech around a flagship Managed Cloud & DevOps
    retainer plus 12 services in four pillars, with a rule that a service goes live only when the
    founder can deliver it today, and with no "coming soon".
  - **Hard-coded counts:** about 15 E2E tests, the mega-menu, the form options, metrics and segments
    hard-code the 9-service list and the two group names.
  - **Renames:** some services are renamed or retired, and their old URLs may already be shared.

## Decision

A single collection-driven taxonomy, made of these components:

- **Schema** (`src/content.config.ts`, contract `contracts/service-content.schema.json`):
  - `pillar: 'managed' | 'cloud-devops' | 'web-saas' | 'ai'` replaces `group`.
  - `flagship: boolean` (exactly one entry), `published: boolean` (readiness gate), plus
    `deliverables`, `engagementTypes`, `faq`, `relatedOffer`, `seoTitle`.
  - The `status: active | roadmap` field is removed.
- **Single gateway** (`src/lib/services.ts`):
  - `getPublishedServices()` feeds every consumer: Header mega-menu (4 pillar columns), Home
    PillarGrid, `/services`, `getStaticPaths` in `[slug].astro`, the lead-form service options and
    therefore the sitemap.
  - `getServicesByPillar()` and `getFlagship()` are thin views over the same set.
- **Flagship as a collection entry:** `managed-cloud-devops.md` with `flagship: true`, rendered by a
  flagship branch of `[slug].astro` (modules, tiers, severity, onboarding, exit terms). It is not a
  separate page file.
- **Stable addresses:**
  - Existing slugs are kept where the service survives, including `full-stack-web-app-development`.
  - Retired slugs get permanent nginx 301s:
    - `managed-infrastructure-24-7` → `managed-cloud-devops`
    - `enterprise-ai-integration` → `ai-assistants-company-data`
    - `agentic-ai-llmops` → `/services#ai`
- **Tests derive from data:** E2E service counts and names are read from the collection instead of
  being hard-coded.

## Consequences

### Positive

- **Unpublishing is one edit:** setting `published: false` removes a service from menus, grids,
  pages, form options and the sitemap at once, which satisfies the "ready today" rule.
- **The flagship gets the existing plumbing for free:** URL, SEO, the `?service=` form prefill and
  the related-services logic all work without new wiring.
- **No breakage from catalogue changes:** pillars and counts can change without touching tests or
  navigation code.
- **Link equity kept:** the 301s preserve it for retired URLs.

### Negative

- **More schema surface:** the flagship branch in `[slug].astro` adds conditional layout logic to one
  template.
- **The mega-menu widens:** going from 2 to 4 columns must be checked against the design freeze
  across breakpoints.
- **Redirect coverage is indirect:** the 301s exist only in nginx, so `astro preview` and E2E can't
  follow them, and coverage relies on a static config test until Docker CI exists.
- **No staged visibility:** an unpublished service has no page, so there is no private preview of
  unready services on a built site. That is acceptable: they can be previewed in local dev.

## Alternatives Considered

- **A. Keep the flat list with a `featured` flag:** rejected. It doesn't express the four-pillar
  positioning or the flagship hierarchy, and every consumer would keep its own grouping logic.
- **B. One collection per pillar, plus a dedicated flagship page:** rejected. It means four loaders,
  duplicated SEO and form wiring, and a second source of truth for the flagship.
- **C. Status enum `draft | ready | retired` instead of a boolean:** rejected for now. Retired
  services are removed and redirected rather than kept, so a boolean is enough. It can be revisited
  if archival pages are ever needed.
- **D. Astro `redirects` (meta-refresh pages) instead of nginx 301s:** rejected by the owner. These
  aren't true 301s on a static host and are weaker for SEO. They would only make the redirects
  testable in preview.

## References

- Feature Spec: specs/002-enterprise-repositioning/spec.md (FR-008 to FR-015, FR-030, FR-032, User Story 2, SC-003, SC-004)
- Implementation Plan: specs/002-enterprise-repositioning/plan.md
- Research: specs/002-enterprise-repositioning/research.md (R1, R2, R8)
- Contracts: specs/002-enterprise-repositioning/contracts/service-content.schema.json, routes-and-redirects.md
- Related ADRs: ADR-002 (redirects carry the security headers), ADR-003 (scenario kind lives in the service schema)
- Evaluator Evidence: history/prompts/002-enterprise-repositioning/4-adrs-proof-model-and-taxonomy.misc.prompt.md

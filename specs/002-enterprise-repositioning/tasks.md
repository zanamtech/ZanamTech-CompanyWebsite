# Tasks: Enterprise Repositioning (Master Plan v3)

**Input**: `specs/002-enterprise-repositioning/` (plan.md, spec.md, research.md, data-model.md,
contracts/, quickstart.md); `docs/03_Master_Plan_v3.md` is the content source of truth.
**Branch**: `dev` (set `SPECIFY_FEATURE=002-enterprise-repositioning` for Spec Kit scripts).
**Design freeze**: Constitution v2.0.0 Principle IV. No change to colours, tokens, fonts,
spacing, themes, animations, transitions, reveal engine, hover or marquee utilities. New sections
compose `GlassCard`, `Badge`, `Button`, `PageHero`, `CtaBand`, `ServiceCard`, `.card-hover`,
`.panel-hover`, `.section-y`, `.eyebrow`, `.tech-pill`, `.marquee*`, `data-reveal-group` and
`metric-counters.ts`.
**Tests**: included. Constitution VII mandates lint and E2E gates, and the spec defines testable
acceptance scenarios.

**Organisation**: by the 6 delivery phases in plan.md (user's instruction). Story labels map
tasks to spec user stories:
- US1 Home offer & results
- US2 Services by pillar
- US3 Entry offers & engagement models
- US4 Trust & credibility
- US5 Consultation form
- US6 Insights & artefacts
- US7 Verified-only proof
- US8 Content guardrails

**Phase rules**:
- Each phase ends with a gate task, a commit task and a **STOP for user review**. Do not begin the
  next phase until the user approves.
- E2E runs through a temporary `playwright.qa.config.ts` (port 4333, `reuseExistingServer: false`),
  deleted afterwards.
- The suite must be green at every phase end. Assertions broken by intended copy or structure changes
  are updated in the same phase.

---

## Phase 0: Governance (docs only, no `src/` changes)

**Purpose**: align the source documents with v3 so the content work has a canonical reference.

- [X] T001 [P] Rewrite `docs/01_Brand_Positioning.md` from `docs/03_Master_Plan_v3.md`:
  - **Content:** positioning statement, category, flagship, 5 ICPs with timing, brand pillars, hero
    copy, "Never sell" list, approved and banned wording.
  - **Remove:** "8+ years", "direct access to senior architects", "guarantee" wording,
    local/private LLM claims and the competitor matrix.
- [X] T002 [P] Rewrite `docs/02_Services_Catalog.md` from v3 section B:
  - **Content:**
    - the flagship with its 7 modules
    - 3 tiers (scope and coverage wording only)
    - P1–P4 severity definitions
    - 12 services in 4 pillars, with canonical names and slugs per data-model.md
    - 5 entry offers and 5 engagement models
  - **Remove:** "[cite: 2]", years claims, senior-team wording, GCP and local-LLM claims.
  - Use the flagship name "Managed Cloud & DevOps" consistently (not "… Operations").
- [X] T003 [P] Create `docs/internal/sow-defaults.md` with the internal SOW response defaults (P1/P2
  per tier) and coverage notes from v3 section B, headed "INTERNAL — never rendered on the website".
- [X] T004 Run the gates: `npm run check`, `npm run lint:content`, `npm run check:csp`, full
  Playwright + axe via the temporary QA config. Expected: unchanged and green (docs only).
- [X] T005 Commit on `dev`: `docs(governance): v3 positioning and catalogue, constitution v2.0.0,
  spec 002, ADR-003/004`. Include the constitution, README, specs/002, the ADRs and the PHRs.
- [X] T006 Write a PHR (stage misc) in `history/prompts/002-enterprise-repositioning/`. **STOP**:
  summarise Phase 0 for the user and wait for approval.

**Checkpoint**: the docs match v3; no site change.

---

## Phase 1: Content model (foundational, additive; rendered UI unchanged)

**Purpose**: introduce the v2 schema and data modules alongside the old fields, so every later phase
builds on them. The site must look and behave exactly as before at the end of this phase.

- [X] T007 Extend the `services` schema in `src/content.config.ts` per
  `contracts/service-content.schema.json`:
  - **Add:** `pillar`, `flagship`, `published`, `seoTitle?`, `deliverables`, `engagementTypes`,
    `faq?`, `relatedOffer?`.
  - **Scenarios:** add `kind` with a Zod refinement that rejects any digit (`\d`) in the
    problem, solution and outcome of illustrative scenarios. Relax to 1–2 scenarios and capabilities to 3–7.
  - **Temporary:** keep `group` and `status` as optional deprecated fields (removed in T060).
- [X] T008 Add the `insights`, `resources` and `caseStudies` collections to
  `src/content.config.ts`, with schemas from data-model.md:
  - `draft` boolean on insights and resources; `sample: true` on resources.
  - `verified`, `permissionDate` and `evidence` required on case studies.
  - Create empty directories `src/content/insights/`, `src/content/resources/` and
    `src/content/case-studies/`, each with a `.gitkeep`.
- [X] T009 Migrate the front matter of all 10 existing files in `src/content/services/`. Copy and
  rendering stay unchanged.
  - Pillars:
    - cloud-devops: migration, security, HA/DR, CI/CD, observability, cost
    - web-saas: full-stack
    - ai: enterprise-ai-integration, agentic
    - managed: managed-infrastructure-24-7
  - Flags: `flagship: false` everywhere except managed-infrastructure-24-7 (`true`).
    `published: true` everywhere except `agentic-ai-llmops` (`false`).
  - Fields: `deliverables` (3 items from the existing capabilities), `engagementTypes`, and
    `kind: real` on every existing scenario (user decision).
- [X] T010 [P] Create `src/data/results.ts`:
  - `Result` type per data-model.md.
  - The 8 existing figures with achieved-result `label`.
  - `context` derived from the matching real scenario in `src/content/services/`:
    - uptime ← migration s1
    - attack-surface ← security s2
    - cost ← cost s1
    - deploy and release-errors ← CI/CD s1
    - detection ← observability s1
    - mttr ← observability s2
    - hardware ← migration s2
  - Internal `attribution`, and `evidenceId` unset.
  - Export `resultsFootnote = 'Results from past engagements; outcomes vary by environment.
    Commitments are defined per Statement of Work.'`.
  - Not yet rendered.
- [X] T011 [P] Create `src/data/managed-tiers.ts`:
  - `tiers`: Essentials, Professional (featured) and Enterprise, each with `coverage` wording and
    `includes`, with no digits in `coverage`.
  - `severityLevels`: P1–P4 definitions from v3 section B.
- [X] T012 [P] Create `src/data/offers.ts` with the 5 entry offers. Each has id, name, duration in
  weeks, inputs, deliverables, nextStep and creditsToFollowOn, from v3 section B.
- [X] T013 [P] Create `src/data/commitments.ts`: "Written proposal within 2 business days", "We
  reply within 1 business day", "Weekly status reports", "Monthly service review", "No lock-in
  handover". Create `src/data/faq.ts` with 6 Home FAQ entries (contracts and SOW, IP ownership,
  data residency, NDA available before discovery, how engagements start, working in client accounts).
- [X] T014 [P] Create the proof data files, all shipped empty:
  - `src/data/leadership.ts`: name "Mubashir Ahmed", role "Founder & Lead Architect", capability
    bio with no years, `linkedin: ''`, `companyLinkedin: ''`, `photo: ''`, `certifications: []`.
  - `src/data/clients.ts` and `src/data/testimonials.ts`: typed `ProofEntry` arrays exported as
    `[]`.
- [X] T015 Extend `src/data/engagement.ts`, keeping the existing exports:
  - `engagementModels`: 5 models, including the agency partnership and the retainer exit terms.
  - `cadence`, `accessModel` and `aiToolPolicy` arrays from v3 section C.
- [X] T016 Add pillars to `src/lib/services.ts`:
  - `servicePillars` with titles and descriptions per data-model.md (no GCP).
  - `getPublishedServices()` (filters `published`, sorted by pillar order then `order`).
  - `getServicesByPillar()` and `getFlagship()`.
  - Keep `getActiveServices` as a temporary alias that returns every `getPublishedServices()`
    entry, with a display group derived from `pillar` (cloud-devops → Cloud & Infrastructure;
    managed, web-saas and ai → Engineering & AI). It does not filter, so the existing two-column UI
    shows every published service, including the ones created in Phase 2.
  - Remove `getRoadmapServices` only once its only caller (T055) is gone. Mark it `@deprecated`
    for now.
- [X] T017 [P] Create `src/lib/content.ts`:
  - `isVisible(entry)`: `!entry.data.draft || import.meta.env.DEV`.
  - `verifiedOnly<T extends { verified: boolean }>(list)`.
  - `hasVerifiedCaseStudies()` and `hasPublishedInsights()`.
- [X] T018 Run the gates (check, lint:content, check:csp, full Playwright + axe). Expected: green
  with no test edits, since the UI is unchanged.
- [X] T019 Commit `feat(content): v3 content model (additive)`.
- [X] T020 Write the PHR. **STOP**: summarise Phase 1 and wait for approval.

**Checkpoint**: the new model and data exist; the site is visually and behaviourally identical.

---

## Phase 2: Content (copy and data only; existing components)

**Purpose**: all wording, catalogue entries and drafts per v3, rendered through the existing
components wherever possible.

### Services catalogue (US2)
- [X] T021 [US2] Rename `src/content/services/managed-infrastructure-24-7.md` to
  `managed-cloud-devops.md`:
  - Name "Managed Cloud & DevOps", `pillar: managed`, `flagship: true`.
  - The 7 modules as capabilities; deliverables, engagementTypes `[retainer]`, FAQ, and
    `relatedOffer: governance-quick-start`.
  - No 24/7, "on-call engineers", "senior" or SLA-guarantee wording. Scenarios stay `kind: real`,
    reworded as achieved results.
- [X] T022 [P] [US2] Rewrite `src/content/services/cloud-migration-containerization.md`:
  - Name "Cloud Migration & Modernisation", Azure/AWS only.
  - Remove "zero-downtime" (use "staged, validated cutover").
  - Outcome and scenarios worded as achieved results (99.9% availability achieved; up to 60%
    hardware maintenance cost reduction).
  - Add deliverables, FAQ and `relatedOffer: health-check`.
- [X] T023 [P] [US2] Rewrite `src/content/services/enterprise-security-waf-hardening.md`: name
  "Security Hardening & WAF", achieved-result wording (80% attack-surface reduction), deliverables,
  FAQ, `relatedOffer: health-check`.
- [X] T024 [P] [US2] Rewrite `src/content/services/high-availability-disaster-recovery.md`:
  - Remove "near-zero data loss" and "no loss of committed transactions"; use documented RPO/RTO
    wording.
  - Add deliverables, FAQ and `relatedOffer: health-check`.
- [X] T025 [P] [US2] Rewrite `src/content/services/cicd-pipeline-workflow-automation.md`: name "CI/CD
  & DevOps Transformation", achieved results (50% faster deployments, 35% fewer release errors),
  deliverables, FAQ, `relatedOffer: governance-quick-start`.
- [X] T026 [P] [US2] Rewrite `src/content/services/observability-monitoring.md`: name "Observability
  & Monitoring", achieved results (45% faster detection, 30% MTTR improvement), deliverables, FAQ,
  `relatedOffer: health-check`.
- [X] T027 [P] [US2] Rewrite `src/content/services/cloud-cost-optimization.md`: name "Cloud Cost
  Optimisation", achieved result (up to 40% savings), Azure/AWS billing only (no GCP), deliverables,
  FAQ, `relatedOffer: cost-review`.
- [X] T028 [P] [US2] Rewrite `src/content/services/full-stack-web-app-development.md`:
  - Keep the name "Custom Full-Stack Web App Development" and the slug; set
    `seoTitle: Custom Web Application Development`.
  - Content covers web apps and multi-tenant SaaS (auth, billing, admin dashboards, RBAC,
    REST/GraphQL APIs, cloud-native CI/CD).
  - Existing scenarios stay `kind: real`. Add deliverables and FAQ.
- [X] T029 [P] [US2] Create `src/content/services/infrastructure-as-code-landing-zones.md`:
  `pillar: cloud-devops`, Terraform/Bicep, network, identity and policy foundations, and 1–2
  `kind: illustrative` scenarios with no digits.
- [X] T030 [P] [US2] Create `src/content/services/enterprise-portals-internal-tools.md`:
  `pillar: web-saas`, with 1–2 illustrative scenarios with no digits.
- [X] T031 [P] [US2] Create `src/content/services/application-modernisation-integration.md`:
  `pillar: web-saas`, with 1–2 illustrative scenarios with no digits.
- [X] T032 [P] [US2] Create `src/content/services/ai-workflow-document-automation.md`:
  - `pillar: ai`.
  - Covers one process automated end to end (reports or document intake), with human approval
    points and audit logs.
  - `relatedOffer: ai-opportunity-sprint` and 1–2 illustrative scenarios with no digits.
- [X] T033 [US2] Replace `src/content/services/enterprise-ai-integration.md` with
  `ai-assistants-company-data.md`:
  - `pillar: ai`, "AI Assistants on Company Data".
  - RAG on managed AI services inside the client's own cloud tenant, with citations, permissions
    and evaluation. No private, local or self-hosted LLM wording.
  - Keep the existing scenarios as `kind: real` with LLM-hosting claims removed.
  - `relatedOffer: ai-automation-pilot`.
- [X] T034 [US2] Delete `src/content/services/agentic-ai-llmops.md`.
- [X] T072 [US2] Add the 3 permanent redirects to `nginx/nginx.conf` before `location /`, per
  `contracts/routes-and-redirects.md`. Each uses `location ~ ^/services/<old>/?$ { include
  /etc/nginx/security-headers.conf; return 301 <target>; }`. This task was moved into Phase 2 so
  the retired slugs and their redirects land in the same commit.
- [X] T035 [US2] Set the `order` values per pillar so they follow spec User Story 2, Scenario 1. Every
  service gets `published: true`.
  - **Readiness list for the owner:** put all 13 services in the Phase 2 STOP summary for
    confirmation.

### Results and site copy (US1)
- [X] T036 [US1] Switch `src/components/sections/Metrics.astro` to read `src/data/results.ts`:
  - Eyebrow becomes "Selected results from past engagements".
  - Title and lead copy are rewritten as achieved results.
  - Add the context line under each label, using the existing `text-sm text-muted` paragraph
    style.
  - Footnote becomes `resultsFootnote`.
  - Markup, grid (`sm:grid-cols-2 lg:grid-cols-4`), shimmer and counters are untouched.
- [X] T037 [US1] Update `src/components/sections/Hero.astro`:
  - H1 and sub-line from v3 A.
  - Eyebrow without "Private AI".
  - Rename the stepper steps without "Zero-downtime" and "24/7", e.g. "Staged, validated cutover"
    and "Continuous managed operations".
  - Remove "delivered by senior … engineers".
  - Markup, classes and stepper logic unchanged.
- [X] T038 [US1] Update `src/data/site.ts`:
  - `description` becomes the v3 positioning statement; `tagline`; `email: contact@zanamtech.com`.
  - Footer line "Remote-first Cloud, DevOps & AI engineering".
  - Replace `metricsFootnote` usages with `resultsFootnote`, then remove it.
  - Update `src/layouts/BaseLayout.astro` JSON-LD: description, `knowsAbout` without "Private
    LLM" or GCP, no address.
- [X] T039 [P] [US1] Update `src/components/sections/Pillars.astro`: remove "with direct access to
  senior engineers". `src/components/sections/ServicesGrid.astro`: remove "Nine disciplines" and
  "round-the-clock operations", and use pillar-neutral wording.
- [X] T040 [P] [US1] Update `src/data/platforms.ts`: remove Google Cloud. Check that no other
  marquee item implies a partnership.

### Engagement, trust and company copy (US3, US4)
- [X] T041 [P] [US3] Update `src/data/engagement.ts`:
  - Phase names and summaries without "Senior architects", "Senior … engineers", "Zero-Downtime"
    or "24/7" (e.g. "Onboarding & Staged Implementation", "Continuous Managed Operations").
  - Rewrite `suitedFor` without "24/7" or "standing engineering partner".
- [X] T042 [P] [US4] Update `src/pages/about.astro`:
  - Remove "Direct senior access" and the "senior architects" copy; replace the value with
    "Documented, accountable delivery" (process wording, no team claim).
  - Remove "Private LLM" and "24/7 managed infrastructure retainers" from the capabilities, and
    "zero-downtime reliability" from the copy.
- [X] T043 [P] [US4] Update `src/pages/approach.astro` metadata: no "zero-downtime" or "24/7",
  title "How We Work".
- [X] T044 [P] [US4] Update `src/pages/privacy.astro`:
  - Replace "our team" / "data privacy team" with "privacy contact" (privacy@zanamtech.com).
  - Replace "zero data exploitation".
  - Add GDPR/UK GDPR processor language and UAE/KSA PDPL references in the existing section
    structure.
- [X] T045 [P] [US4] Update `src/data/segments.ts`:
  - Re-map the slugs to the new services.
  - Add `software-agencies` and `gcc` (UAE/KSA cloud regions, data-residency awareness).
  - Remove the data-sensitive AI segment and the "Zero-downtime" and "target" wording.

### Contact copy (US5)
- [X] T046 [P] [US5] Update the contact copy:
  - `src/pages/contact.astro`: the next steps use "We reply within 1 business day", a
    consultation call, and "Written proposal within 2 business days". Metadata has no "senior …
    engineers".
  - `src/components/ContactForm.astro` success copy: "Thank you. We reply within 1 business day
    to arrange your consultation."
  - `src/components/ContactModal.astro` subtitle: no "our team".

### Drafts (US6), clearly marked for owner review
- [X] T047 [P] [US6] Draft `src/content/insights/azure-environment-strategy.md`: "Dev, QA, UAT, Prod
  on Azure: an environment strategy that survives real releases". Set `draft: true`, add a
  "DRAFT — owner fact-check required" note at the top of the body, and include no client details.
  This applies to all of T047–T049: no clock times, no minute or hour figures, and no time zones.
  Describe schedules qualitatively (e.g. "an off-peak backup window").
- [X] T048 [P] [US6] Draft `src/content/insights/bitbucket-branch-governance.md`: "Bitbucket branch
  governance: the restrictions and SOPs every team should have". Set `draft: true` and add the DRAFT
  note.
- [X] T049 [P] [US6] Draft `src/content/insights/cloud-cost-checklist.md`: "A 15-point cloud cost
  checklist". Cite Flexera 2026 (29% estimated waste) with a source link in `sources`. Set
  `draft: true` and add the DRAFT note.
- [X] T050 [P] [US6] Draft `src/content/resources/azure-reference-architecture.md`: an Azure
  Dev/QA/UAT/Prod reference architecture. Set `draft: true` and `sample: true`, label it "Sample",
  and write it fresh.
- [X] T051 [P] [US6] Draft `src/content/resources/branch-governance-sop-template.md`: a Bitbucket
  branch-governance SOP template. Set `draft: true` and `sample: true`, and label it "Sample".
- [X] T052 [P] [US6] Draft `src/content/resources/sample-monthly-service-report.md`: a sample monthly
  service report (health, cost, risk, changes) with no client data or response times. Set
  `draft: true` and `sample: true`, and label it "Sample".

### Tests touched by copy changes
- [X] T053 Update the assertions in `tests/e2e/home.spec.ts` (HEADLINE) and
  `tests/e2e/metrics.spec.ts`:
  - results wording and footnote
  - the `uptime` and `cost` values are still 99.9% and 40%
  - the sr-only text uses achieved wording
- [X] T054 Update the assertions in the following specs:
  - `tests/e2e/services.spec.ts`: derive `SERVICES` from the built `/services` page or the
    collection order, not a hard-coded list. Use the new FOOTNOTE. The scenario label is no longer
    mandatory. The roadmap suite becomes "old roadmap path is not a page" (404).
  - `tests/e2e/approach-industries.spec.ts`: PHASES and SEGMENTS.
  - `tests/e2e/contact.spec.ts`: prefill slugs `cloud-cost-optimization` and
    `ai-assistants-company-data`, success text.
  - `tests/e2e/navigation.spec.ts`: H1 and service names.
  - `tests/e2e/theme-a11y.spec.ts`: the route list uses `managed-cloud-devops`.
  - `tests/e2e/touch-menu.spec.ts`: service names.
  - `tests/e2e/security.spec.ts`: routes and service options.
- [X] T055 Remove the roadmap section and its imports from `src/pages/services/index.astro`, and
  delete `src/components/sections/RoadmapCard.astro`. Remove `getRoadmapServices` from
  `src/lib/services.ts`. Update the `/services` metadata and lead to remove "Nine".
- [X] T056 Run the gates (check, lint:content, check:csp, full Playwright + axe) and confirm all green.
- [X] T057 Commit `feat(content): v3 services, achieved results, copy rewrites and drafts`.
- [X] T058 Write the PHR. **STOP**: present to the owner the readiness list of 13 services, the 8
  results with their derived context lines, and the 3 article drafts and 3 artefact drafts. Wait
  for approval.

**Checkpoint**: all copy is v3-compliant, rendered through the existing components; drafts exist but
are dev-only.

---

## Phase 3: Components and pages (US1–US7)

**Purpose**: new sections and pages, composed only from existing primitives and motion.

### Foundation for this phase
- [X] T059 Rename `src/components/sections/Metrics.astro` to `ResultsBand.astro`. Keep `id`,
  markup, classes, shimmer and `data-counter` attributes. Update imports in `src/pages/index.astro`.
- [X] T060 Remove the deprecated `group` and `status` fields from `src/content.config.ts` and all
  service files. Delete the legacy `getActiveServices` alias and point every caller
  (`Header.astro`, `Footer.astro`, `ServicesGrid.astro`, `ContactForm.astro`, `industries.astro`,
  `services/index.astro`, `[slug].astro`) at `getPublishedServices` / `getServicesByPillar`.

### US1: Home
- [X] T061 [P] [US1] Create `src/components/sections/FlagshipSpotlight.astro`. It uses `GlassCard`,
  the module list from `getFlagship()`, a 3-tier teaser from `managed-tiers.ts` (names plus coverage
  wording), `Button` to `/services/managed-cloud-devops`, and `data-reveal-group`.
- [X] T062 [P] [US1] Create `src/components/sections/PillarGrid.astro`: 4 cards (`GlassCard` +
  `.card-hover` + `Icon`) linking to `/services#<pillar>`, each listing its published services.
  Same grid and gap utilities as `ServicesGrid`.
- [X] T063 [P] [US1] Create `src/components/sections/ArtefactCard.astro` and an artefact band on Home
  that lists visible `resources` entries (via `isVisible`) with a `Badge` "Sample". It renders
  nothing when none are visible.
- [X] T064 [P] [US1] Create `src/components/sections/TrustBand.astro`:
  - Reuse the three brand-pillar cards: extract the card markup from `Pillars.astro` into a shared
    loop over the same data, so the classes are identical.
  - Add the access-model points and `commitments.ts` as `Badge`s.
  - Link to `/trust`.
- [X] T065 [P] [US1] Create `src/components/sections/Faq.astro`:
  - Native `<details>/<summary>` inside `GlassCard`.
  - Chevron uses `group-open:rotate-180 transition-transform duration-200` (the same pattern as the
    dropdown chevron).
  - Data from `faq.ts`, or a `faq` prop for service pages.
- [X] T066 [US1] Recompose `src/pages/index.astro` in this order:
  1. Hero
  2. ResultsBand
  3. ProofStrip (heading "Technologies we work with")
  4. FlagshipSpotlight
  5. PillarGrid
  6. EntryOffers
  7. artefact band
  8. Process ("How we work")
  9. Industries
  10. TrustBand
  11. Faq
  12. CtaBand

  Remove the standalone `Pillars` and `ServicesGrid` sections from Home (they are reused inside
  TrustBand and PillarGrid). Update `src/components/sections/ProofStrip.astro` heading copy only.

### US2: Services and flagship
- [X] T067 [P] [US2] Create `src/components/sections/TierTable.astro`: 3 `GlassCard` columns, with
  the Professional card featured using the existing accent border. Shows scope and coverage
  wording only.
- [X] T068 [P] [US2] Create `src/components/sections/SeverityMatrix.astro`: P1–P4 definitions in a
  list of `GlassCard`s or a table, using the existing table/list typography.
- [X] T069 [US2] Extend `src/pages/services/[slug].astro`:
  - Generate paths from `getPublishedServices()`. Use `seoTitle` for `<title>` when present.
  - Add "What you get" (deliverables), engagement types (`Badge`s), the FAQ (`Faq` component) and
    the related offer card.
  - Scenario cards label `kind: illustrative` as "Example engagement" and show no label for real
    scenarios.
  - A flagship branch renders modules, TierTable, SeverityMatrix, cadence, the 4-week onboarding,
    exit terms and the FAQ.
- [X] T070 [US2] Rework `src/pages/services/index.astro`: 4 pillar sections with `id` anchors
  (`#managed`, `#cloud-devops`, `#web-saas`, `#ai`), the flagship first, then an EntryOffers teaser.
  Uses existing `ServiceCard`.
- [X] T071 [US2] Rework the mega-menu and mobile drawer in `src/components/layout/Header.astro`:
  - 4 pillar columns (`lg:grid-cols-4`; the panel widens with the existing container utilities)
    with the same item markup and icons, plus a "Start here" link.
  - Primary nav: Services, Managed Services (`/services/managed-cloud-devops`), How We Work
    (`/approach`), Insights (only if `hasPublishedInsights()`), About.
  - Case Studies appears only if `hasVerifiedCaseStudies()`.
  - Mobile drawer: grouped by pillar.
  - The Alpine `siteHeader` behaviour is unchanged.
  - Design-freeze exception (D1, approved): the panel may widen only by reusing the existing header
    classes, panel open/close transition, item hover styles and container utilities. No new
    styles.
  - Verify on desktop, at touch-tablet widths (the drawer below `lg` and the existing touch-tablet
    behaviour) and on mobile.

### US3: Entry offers and How We Work
- [X] T073 [P] [US3] Create `src/components/sections/OfferCard.astro` and `EntryOffers.astro`: cards
  from `offers.ts` showing duration, inputs, deliverables and next step, with no fees.
- [X] T074 [P] [US3] Create `src/components/sections/AgencyPartners.astro`: the "For software
  agencies" section (white-label or co-branded, NDA, mutual non-solicitation) with a CTA that
  prefills "Agency partnership".
- [X] T075 [US3] Create `src/pages/start-here.astro`: `PageHero` + EntryOffers (full detail) +
  `CtaBand`.
- [X] T076 [US3] Rework `src/pages/approach.astro` (How We Work): Process (phases; the connector
  animation is unchanged), engagement models, cadence, access model, AI-tool policy summary,
  AgencyPartners, CtaBand.

### US4: Trust, About, Terms, footer, security.txt
- [X] T077 [P] [US4] Create `src/pages/trust.astro`, reusing the `privacy.astro` long-form layout
  (TOC grid and sections):
  - security practices, access model, AI-tool policy
  - NDA/MSA/DPA on request, sub-processor list, data-residency options
  - security contact (security@zanamtech.com)
  - no continuity claim
- [X] T078 [P] [US4] Create `src/pages/terms.astro` in the same layout: acceptable use, no warranty,
  IP, governing law.
- [X] T079 [P] [US4] Rework the Leadership section of `src/pages/about.astro` from `leadership.ts`:
  name, role, capability bio, LinkedIn and photo (each hidden when empty), and a "Remote-first"
  statement. No years, badges or city.
- [X] T080 [P] [US4] Update `src/components/layout/Footer.astro`:
  - The "ZanamTech · Remote-first Cloud, DevOps & AI engineering" line, contact@zanamtech.com, and
    the company LinkedIn (hidden when empty).
  - Links to Privacy, Terms and Trust. Industries stays in the footer.
  - Services listed by pillar. No address.
- [X] T081 [P] [US4] Create `public/.well-known/security.txt` (RFC 9116):
  `Contact: mailto:security@zanamtech.com`, `Expires:` 2027-10-12 in ISO format,
  `Preferred-Languages: en`, `Canonical: https://www.zanamtech.com/.well-known/security.txt`.
- [X] T082 [P] [US4] Update `src/pages/industries.astro` to render the new segments with links to
  published services.

### US5: Consultation form
- [X] T083 [US5] Extend `src/lib/lead.ts` per `contracts/lead-submission.md`:
  - `region`, `companySize` and `cloudPlatform` with option constants (Company size `1–10`,
    `11–50`, `51–200`, `201–1,000`, `1,000+`).
  - `AGENCY_PARTNERSHIP` constant; validation; `FIELD_ORDER`; payload with `"Not specified"`
    defaults.
- [X] T084 [US5] Add 3 optional menus to the `menus` array in `src/components/ContactForm.astro`,
  each with a hidden native select fallback. Service options are the published names, then "Agency
  partnership", then "Other / Not sure yet". Extend the `leadForm` state in
  `src/scripts/alpine.ts` only where needed: the existing dropdown machinery is generic over
  `menus`.
- [X] T085 [US5] Re-measure the desktop dialog fit at 1366×768 and 1280×720 against a production
  build. If a scrollbar appears, compact the layout using existing spacing utilities only. Record the
  measurements in the PHR.

### US6: Insights and resources
- [X] T086 [P] [US6] Create `src/pages/insights/index.astro` and `src/pages/insights/[slug].astro`:
  - Built from `isVisible` entries, using the `PageHero` and long-form article typography already
    used on the privacy page.
  - Draft pages show a `Badge` "DRAFT". Sources are rendered as links.
- [X] T087 [P] [US6] Create `src/pages/resources/[slug].astro` for visible resources, with a `Badge`
  "Sample" (and "DRAFT" in dev).

### US7: Gated proof
- [X] T088 [P] [US7] Create `src/components/sections/LogoMarquee.astro`, reusing `.marquee*` and
  `.tech-pill` styling. It renders only `verifiedOnly(clients)` and returns nothing when the list is
  empty.
- [X] T089 [P] [US7] Create `src/components/sections/Testimonials.astro` (`GlassCard` grid). It renders
  only verified entries and nothing when there are none.
- [X] T090 [P] [US7] Create `src/components/sections/CaseStudyCard.astro`, plus
  `src/pages/case-studies/index.astro` and `[slug].astro`. `getStaticPaths` uses verified entries
  only, so no pages are generated when there are none.
- [X] T091 [US7] Mount LogoMarquee and Testimonials on Home (after ResultsBand and before Faq
  respectively). They render nothing at launch.

### Phase end
- [X] T092 Update the structure assertions in the following specs:
  - `tests/e2e/responsive-header.spec.ts`: mega-menu icon count derived from published services.
  - `tests/e2e/services.spec.ts`: pillar headings and the "Start here" link.
  - `tests/e2e/navigation.spec.ts`: nav items.
  - `tests/e2e/home.spec.ts`: section order and the single CTA.
  - `tests/e2e/touch-menu.spec.ts`: the 4-pillar menu on touch tablets.
- [X] T093 Run the gates (check, lint:content, check:csp, full Playwright + axe) and confirm all
  green. Run `npm run lhci` locally against the production build and record the scores against the
  Principle I budgets; any miss blocks the phase. Take a visual spot-check screenshot of Home and the
  flagship page at 1440 and 390 in both themes.
- [X] T094 Commit `feat(ui): v3 pages and sections composed from existing primitives`.
- [X] T095 Write the PHR. **STOP**: summarise Phase 3, including the screenshots and dialog
  measurements, and wait for approval.

**Checkpoint**: every page and section from the spec exists; proof stays hidden; the design is unchanged.

---

## Phase 4: Guardrails and tests (US8 + coverage for US1–US7)

### US8: Content lint
- [ ] T096 [US8] Extend `RULES` in `scripts/lint-content.mjs` per research R7:
  - competitors (Folio3, Systems Limited, Arbisoft, Tkxel, Devsinc, Simform, ScienceSoft,
    Accenture, 10Pearls)
  - team-structure phrases
  - guarantee, zero downtime/data loss, `100%`, unqualified 24/7
  - `certified`, `\b(?:Ltd|Inc|LLC)\b`, "our offices"
  - local/on-premise/self-hosted LLM, fine-tuned model
  - first-person "I + verb"
  - gig, hourly (rate sense), packages from; allow "hourly encrypted backups" (technical frequency)
  - clock times `\b\d{1,2}:\d{2}\b`
  - time-zone labels, case-sensitive:
    `\b(?:PKT|GST|GMT|BST|UTC|EST|EDT|CST|CDT|MST|MDT|PST|PDT|CET|CEST)\b` and
    `\b(?:UTC|GMT)\s?[+±-]\s?\d`
  - minute and hour figures in any form, site-wide including insights and resources
    (`\b\d+\s*[-–]?\s*(?:min(?:ute)?s?|hours?|hrs?)\b`, e.g. "30-minute", "2 hours")
  - weeks and business days stay allowed (offer durations, the 4-week onboarding, the two
    commitments)
- [ ] T097 [US8] Add an `ALLOW` list to `scripts/lint-content.mjs` (exactly the two commitment
  phrases plus "time-zone overlap" and "hourly encrypted backups") and a path exemption for `public/.well-known/security.txt` from
  the clock rule only.
- [ ] T098 [US8] Add a verified-data pass to `scripts/lint-content.mjs`:
  - every entry in `src/data/clients.ts`, `src/data/testimonials.ts` and
    `src/content/case-studies/*.md` has `verified` and `permissionDate`
  - every `%` statistic in `src/content/insights/*.md` sits in a paragraph or list item with a link,
    or the article lists `sources`
- [ ] T099 [US8] Run a lint mutation check:
  1. Temporarily insert one banned phrase per rule family into a scratch copy under `src/` and
     confirm `npm run lint:content` fails, naming the file and line.
  2. Remove the scratch copy and confirm it passes.
  3. Record the results in the PHR.

### E2E coverage
- [ ] T100 [P] [US1] Create `tests/e2e/home-v3.spec.ts`:
  - the results band title, 8 cards, context lines and footnote
  - the Home section order
  - TrustBand reuses the 3 pillar headings
  - FAQ toggles with Enter and Space
  - on Pixel 7, the top of the first result card is within 1.5 viewport heights (SC-006)
- [ ] T101 [P] [US2] Create `tests/e2e/services-v3.spec.ts`:
  - 4 pillars, flagship first
  - every published service is reachable in 2 clicks or fewer
  - flagship shows modules, 3 tiers and P1–P4, and its tier text matches no time or response pattern
  - each service page shows deliverables and FAQ
  - illustrative scenarios show "Example engagement" and no "%"
  - old slugs return 404 in preview
- [ ] T102 [P] [US2] Create `tests/e2e/redirects-config.spec.ts`: parse `nginx/nginx.conf` and
  assert the 3 `return 301` rules (pattern and target) sit before `location /`, and that each target
  page exists in `dist/` (no browser needed).
- [ ] T103 [P] [US3] Create `tests/e2e/offers-approach.spec.ts`: `/start-here` lists 5 offers with
  durations and no fees; How We Work shows 5 engagement models and the agency section; the agency
  CTA prefills "Agency partnership".
- [ ] T104 [P] [US4] Create `tests/e2e/trust-legal.spec.ts`:
  - `/trust` and `/terms` return 200 with their key headings
  - `/.well-known/security.txt` contains `Contact: mailto:security@zanamtech.com`
  - footer has the Remote-first line and the Privacy, Terms and Trust links
  - no address
  - About has no years text
- [ ] T105 [P] [US5] Extend `tests/e2e/contact.spec.ts`:
  - Region, Company size and Cloud platform comboboxes with keyboard selection
  - payload includes `region`, `companySize`, `cloudPlatform` (and `"Not specified"` when empty)
  - "Agency partnership" option
  - success copy
  - desktop dialog has no vertical scrollbar
- [ ] T106 [P] [US6] Create `tests/e2e/drafts.spec.ts` against the production preview:
  `/insights/*` and `/resources/*` draft slugs return 404, and no Insights nav link appears while all
  articles are drafts.
- [ ] T107 [P] [US7] Create `tests/e2e/proof-gating.spec.ts`: no testimonial, logo-marquee,
  case-study or badge elements and no Case Studies nav link with empty data. `/case-studies` returns
  404.
- [ ] T108 Extend `tests/e2e/theme-a11y.spec.ts` routes with `/start-here`, `/trust`, `/terms`,
  `/services/managed-cloud-devops` and one new service page, so axe runs in light and dark.
- [ ] T109 Run the gates (check, lint:content, check:csp, full Playwright + axe) and confirm all green.
- [ ] T110 Commit `test: v3 guardrails, lint rules and coverage`.
- [ ] T111 Write the PHR. **STOP**: summarise Phase 4 (rules added, mutation-check results, test
  counts) and wait for approval.

---

## Phase 5: Verification and release

- [ ] T112 Run the full gates on a fresh build: `npm run check`, `npm run lint:content`,
  `npm run check:csp`, and the full `npm run test:e2e` (desktop and mobile, light and dark) via the
  temporary QA config. Then run the `contact` and `security` specs ×3 to check for flakiness. Run
  `npm run lhci` locally on the production build and record the scores.
- [ ] T113 Grep audit of `dist/`. Expect zero hits for:
  - "senior engineer", "24/7", "Nine", "guarantee", "local LLM", "PM-led"
  - "target" in results
  - Google Cloud presented as primary or headline (it may appear only as also supported)
  - clock times
  - draft slugs
- [ ] T114 SC-001 design-freeze check: screenshot the unchanged components (header, hero frame,
  service card, button, footer, Process connector) at 1440 and 390 in both themes, plus the open
  services menu at 1440 and 1024. Compare against baseline screenshots from a worktree checkout of
  commit `e2e656c` (pre-repositioning) and confirm only the text differs, apart from the approved
  4-column menu width. Report any visual delta.
- [ ] T115 Re-measure the dialog fit and confirm reduced-motion behaviour (results show final values;
  no slide-ins) on a production build.
- [ ] T116 Run `npm run lhci` locally against the production build. `lighthouserc.json` budgets:
  Performance ≥ 95; Accessibility, Best Practices and SEO = 100; LCP < 2.5 s; CLS < 0.1. Any miss
  blocks the release. Record Linux CI as a follow-up to spec 001 T061.
- [ ] T117 Update `README.md` (Content table: pillars, results.ts, proof data, drafts) and mark spec
  001 FR-009, FR-013 and FR-018 as superseded with a note at the top of
  `specs/001-enterprise-website-baseline/spec.md`.
- [ ] T118 Commit `chore: v3 release verification`. Push to `origin/dev` only when the user says so.
- [ ] T119 Write the PHR. **STOP**: present the release summary.

---

## Dependencies and execution order

- **Phases run strictly in order**: 0 → 1 → 2 → 3 → 4 → 5, each gated by user approval.
- **Phase 1** (T007–T017): T007 before T009; T016 depends on T007; T010–T015 and T017 are
  independent ([P]).
- **Phase 2**: T021–T035 depend on T007/T009 (schema). T036 depends on T010. T053 and T054 follow the
  copy tasks they assert on. T055 must run after T034. T072 (redirects) runs right after T034.
- **Phase 3**: T059 and T060 first. Home recomposition T066 depends on T061–T065 and T073. T069
  depends on T067, T068 and T065. T071 depends on T016 and T017. T084 depends on T083. T091 depends
  on T088 and T089.
- **Phase 4**: the lint tasks T096–T098 run in order, then T099. The E2E files T100–T107 are
  independent ([P]).
- **Story independence**: US1 (Home) relies on the US2 catalogue data for PillarGrid and
  FlagshipSpotlight. US3–US7 are independently testable once Phase 1 is done.

## Parallel examples

- **Phase 2:** T022–T032 (one service file each) can be written in parallel, and so can T047–T052
  (drafts).
- **Phase 3:** T061–T065 (Home sections), T067/T068 (tier and severity), T077–T082 (trust, legal,
  footer) and T088–T090 (gated proof) can run in parallel.
- **Phase 4:** T100–T107 (new spec files) can run in parallel.

## Implementation strategy

- **MVP**: Phases 0–2 already deliver the core repositioning message (v3 copy, catalogue, achieved
  results) through the existing UI. Phase 3 adds the new structure, and Phases 4–5 harden and verify.
- **Each phase is a safe stopping point**: green gates, one commit, owner review.
- **Totals**: 119 tasks.
  - Phase 0: 6 tasks.
  - Phase 1: 14 tasks.
  - Phase 2: 39 tasks.
  - Phase 3: 36 tasks.
  - Phase 4: 16 tasks.
  - Phase 5: 8 tasks.
  - By story: US1 12, US2 23, US3 6, US4 11, US5 5, US6 9, US7 5, US8 4. The rest are unlabelled
    governance, foundation, gate, commit and PHR tasks.

# Research: Enterprise Repositioning (002)

All Technical Context unknowns are resolved below. Format: Decision / Rationale / Alternatives.

## R1. Retired service URLs
- **Decision**: permanent `301` redirects in `nginx/nginx.conf` (user decision). Each one is an exact-match
  regex location that accepts an optional trailing slash, placed before `location /`:
  - `^/services/managed-infrastructure-24-7/?$` → `/services/managed-cloud-devops`
  - `^/services/enterprise-ai-integration/?$` → `/services/ai-assistants-company-data`
  - `^/services/agentic-ai-llmops/?$` → `/services#ai`

  Each location includes `security-headers.conf` so redirects carry the same headers.
  `absolute_redirect off` (already set) keeps Location headers relative.
- **Rationale**: true 301s pass link equity, and the site is served only by nginx.
- **Alternatives**: Astro `redirects` (meta-refresh pages, which are not real 301s on a static host;
  rejected per the user's decision); keeping the old slugs (would contradict the v3 naming).
- **Testing consequence**: `astro preview` does not run nginx, so E2E cannot follow these redirects.
  Coverage comes in two parts:
  - a static Playwright spec parses `nginx/nginx.conf` and asserts all three rules (pattern, `301`,
    target) and that each target is a built page in `dist/`
  - E2E asserts that the old paths are no longer service pages (404)

  Running `nginx -t` in the Docker build is recommended once Docker CI exists (open item T060).

## R2. Service taxonomy and readiness
- **Decision**:
  - `group` becomes `pillar: 'managed' | 'cloud-devops' | 'web-saas' | 'ai'`, plus `flagship: boolean` and
    `published: boolean`.
  - `getPublishedServices()` is the single gateway used by menus, grids, pages (`getStaticPaths`), the form
    options and the sitemap.
  - The flagship is a normal collection entry (`managed-cloud-devops.md`) with `flagship: true`.
    `[slug].astro` branches to a flagship layout.
- **Rationale**: one source of truth. Unpublishing removes a service everywhere (FR-014). Keeping the
  flagship in the collection preserves URL, sitemap and form wiring for free.
- **Alternatives**: a separate flagship page file (duplicates SEO and form wiring); per-pillar
  collections (more loaders, no benefit).

## R3. Results band (reusing the counters and shimmer)
- **Decision**:
  - Rename `Metrics.astro` to `ResultsBand.astro`, keeping its markup, classes, shimmer span and
    `data-counter` attributes.
  - Change the copy only: eyebrow "Selected results from past engagements", title and footnote.
  - Add a context line (industry · challenge) under each label.
  - Grid stays `sm:grid-cols-2 lg:grid-cols-4`: stacked on mobile, 2 columns on tablet, 4×2 on
    desktop (user decision). `src/scripts/metric-counters.ts` is untouched.
- **Rationale**: Constitution IV design freeze; identical motion and layout.
- **Alternatives**: a new card component (risks visual drift).

## R4. Proof gating
- **Decision**:
  - `src/data/clients.ts` and `src/data/testimonials.ts` are typed arrays of `ProofEntry`; the
    `caseStudies` collection uses a Zod schema that requires `verified`, `permissionDate` and `evidence`.
  - Components filter on `verified === true` and render nothing when the result is empty.
  - Nav links to Case Studies are computed at build time.
  - The content lint fails if any entry lacks the fields.
- **Rationale**: FR-019 to FR-021; zero runtime cost.
- **Alternatives**: environment flags (easy to flip by mistake; not tied to evidence).

## R5. Drafts visible only in local dev
- **Decision**:
  - The `insights` and `resources` collections have `draft: boolean`.
  - A helper `isVisible(entry) = !entry.data.draft || import.meta.env.DEV` is applied in
    `getStaticPaths`, listings and nav.
  - Draft pages render a DRAFT/Sample badge using the existing `Badge`.
  - Production and preview builds (`astro build`) exclude drafts.
- **Rationale**: user decision (local dev only); no staging infrastructure; drafts can't leak.
- **Alternatives**: a `SHOW_DRAFTS` build flag (rejected by the user); markdown-only review.

## R6. Contact form extension
- **Decision**: add optional fields `region`, `companySize` and `cloudPlatform`, using the existing custom
  dropdown machinery (`menus` array in `ContactForm.astro`, `leadForm` in `alpine.ts`) with
  hidden native selects as the no-JS fallback.
  - Company size: `1–10`, `11–50`, `51–200`, `201–1,000`, `1,000+` (user decision).
  - Region: `US / Canada`, `UK / Europe`, `GCC`, `Other`.
  - Cloud platform: `Azure`, `AWS`, `Both`, `Other`.
  - Service options: published service names, then `Agency partnership`, then `Other / Not sure yet`.

  Dialog grid stays `md:grid-cols-2 lg:grid-cols-3`. The 9 inputs fill 3 rows plus the textarea and
  footer. The fit is re-measured at 1366×768 and 1280×720; if it overflows, the textarea drops to its
  `rows=2` minimum and the vertical gaps tighten using existing spacing utilities.
- **Rationale**: reuses the accessible combobox (APG pattern) already tested; there's no new UI.
- **Alternatives**: native selects (visual drift); a multi-step form (out of scope).

## R7. Content-lint extension
- **Decision**: extend `scripts/lint-content.mjs` RULES with:
  - competitors (Folio3, Systems Limited, Arbisoft, Tkxel, Devsinc, Simform, ScienceSoft, Accenture,
    10Pearls)
  - team-structure phrases
  - guarantee, zero downtime/data loss, `100%`, unqualified `24/7`
  - `certified`, legal suffixes `\b(?:Ltd|Inc|LLC)\b`, "our offices"
  - local/on-premise/self-hosted LLM, fine-tuned model, GCP/Google Cloud
  - clock times `\b\d{1,2}:\d{2}\b`
  - time-zone labels, matched case-sensitively:
    `\b(?:PKT|GST|GMT|BST|UTC|EST|EDT|CST|CDT|MST|MDT|PST|PDT|CET|CEST)\b` and `\b(?:UTC|GMT)\s?[+±-]\s?\d`.
    The phrase "time-zone overlap" is allow-listed.
  - minute and hour figures in any form, site-wide including insights and resources
    (`\b\d+\s*[-–]?\s*(?:min(?:ute)?s?|hours?|hrs?)\b`, e.g. "30-minute", "2 hours"). The
    consultation has no stated length (owner decision U1). Weeks and business days stay allowed.
  - "I + verb" first-person pattern
  - "gig", "hourly", "packages from"

  An `ALLOW` list exempts exactly "Written proposal within 2 business days" and "We reply within 1
  business day". The `.well-known/security.txt` `Expires:` ISO timestamp is exempt from the clock
  rule (path-scoped). A second pass imports the proof data and checks the verified fields. Third-party
  % in `src/content/insights/**` must sit on a line or in a block that contains a link.
- **Rationale**: Constitution VII. Line-based scanning keeps it simple.
- **Alternatives**: an AST-based linter (heavier, no benefit for prose).
- **Watch-outs**:
  - `\b(?:Ltd|Inc|LLC)\b` and the clock rule must not hit code (scanning stays limited to text
    files, as today).
  - The "Hours saved × volume" offer copy contains no digits, so it passes.

## R8. Navigation
- **Decision**:
  - Primary nav: Services (mega-menu, 4 pillar columns plus a "Start here" link), Managed Services
    (`/services/managed-cloud-devops`), How We Work (`/approach`), Insights (conditional), About.
  - The mega-menu panel widens from 2 to 4 columns with the same item markup.
  - The mobile drawer lists pillars as grouped sections.
  - Industries moves to the footer.
- **Rationale**: FR-030. Layout widths reuse existing container utilities.

## R9. Security contact and legal pages
- **Decision**:
  - `public/.well-known/security.txt` (RFC 9116: `Contact: mailto:security@zanamtech.com`,
    `Expires:` one year ahead, `Preferred-Languages: en`, `Canonical:`).
  - New pages `/terms` and `/trust` reuse the `privacy.astro` long-form layout (TOC grid + sections).
- **Rationale**: FR-024, FR-026, FR-027; consistent typography.

## R10. Results context and scenario records
- **Decision**:
  - Each scenario gets `kind: 'real' | 'illustrative'` (required).
  - `real` may include figures; `illustrative` must contain no digits at all (enforced by a
    Zod refinement).
  - The new services get 1–2 `illustrative` scenarios labelled "Example engagement".
  - `results.ts` entries carry `context` derived from the matching real scenario (owner-verified
    before publication), an internal `attribution`, and an optional `evidenceId`.
- **Rationale**: FR-016 and FR-018; the schema enforces the constitution.

## R11. FAQ component
- **Decision**:
  - Native `<details>/<summary>` inside existing `GlassCard` surfaces.
  - The chevron rotation reuses the dropdown chevron classes (`transition-transform duration-200`
    via `group-open:rotate-180`).
  - No JavaScript.
- **Rationale**: keyboard accessible without JS (spec edge case); no new motion.

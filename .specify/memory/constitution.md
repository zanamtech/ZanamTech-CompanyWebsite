<!--
Sync Impact Report (2.0.4)
- Version change: 2.0.3 → 2.0.4 (PATCH: "remote-first" moved from preferred terms to prohibited wording; the
  statement that the site describes ZanamTech as remote-first is removed.) No template changes; content lint
  already bans it.

Sync Impact Report (2.0.3)
- Version change: 2.0.2 → 2.0.3 (PATCH: platform note. AWS, Azure and Google Cloud treated equally.) No template
  changes; spec 002 FR-006a, research R6/R7, the lead contract and tasks T096/T113 aligned.

Sync Impact Report (2.0.2)
- Version change: 2.0.1 → 2.0.2 (PATCH: Content & Brand Standards platform note. Azure and AWS primary, Google
  Cloud also supported.) No template changes; spec 002 FR-006a, research R7 and tasks T096/T113 aligned.

Sync Impact Report (2.0.1)
- Version change: 2.0.0 → 2.0.1 (PATCH: clarifies the Principle III time rule. Time-zone labels and
  minute/hour figures are named explicitly; "time-zone overlap" and week durations are permitted.)
- Templates requiring updates: none. spec 002 FR-038, research R7, tasks T096/T097 and docs/01
  were aligned in the same change.

Sync Impact Report (2.0.0)
- Version change: 1.0.0 → 2.0.0 (MAJOR: Principle III redefined, Roadmap rule removed)
- Source of truth: docs/03_Master_Plan_v3.md (approved; overrides docs/01_Brand_Positioning.md,
  docs/02_Services_Catalog.md and the original Master Execution Plan where they differ)
- Modified principles:
  - III. Brand & Content Integrity → III. Brand, Content & Proof Integrity (redefined)
    - Removed: metrics as "target outcomes", mandatory "Representative Engagement Scenarios" label,
      Roadmap "In Development" rule
    - Added: verified-only social proof; ban on fabricated proof; achieved-results wording and new
      footnote; real/illustrative scenario record; no team-structure claims; no clock hours, time
      zones or response times (two approved commitments excepted); no address/offices/legal suffix;
      "certified" only when held; no self-hosted LLM claims; results-section title rule
  - IV. Design-System Discipline: added the non-negotiable design-freeze rule and reuse mandate
  - VII. Verification Gates: content-lint scope expanded (banned phrases, clock-hour patterns,
    verified-data checks)
- Added sections: none (Content & Brand Standards rewritten)
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates derive from this file; no edit)
  - ✅ .specify/templates/spec-template.md (no mandatory-section change)
  - ✅ .specify/templates/tasks-template.md (lint/test gate tasks generated per feature; no edit)
  - ✅ .specify/templates/commands/ (directory not present; nothing to sync)
  - ✅ README.md brand-rules block updated to v2.0.0
  - ⚠ README.md "Content" table (9 core + roadmap, target metrics): update during implementation
    of specs/002-enterprise-repositioning
  - ⚠ docs/01_Brand_Positioning.md, docs/02_Services_Catalog.md: rewrite from v3 (Phase 0 task)
  - ⚠ scripts/lint-content.mjs and tests/e2e/*: bring in line with v2.0.0 during implementation
  - ⚠ specs/001-enterprise-website-baseline/spec.md FR-009, FR-013, FR-018: superseded by spec 002
- Follow-up TODOs: none
-->

# ZanamTech Enterprise Website Constitution

## Core Principles

### I. Static-First Performance

Every page MUST be pre-rendered to static HTML at build time. Client-side JavaScript is permitted
only for discrete interactive islands and global UI state. Budgets (per page, mobile, simulated 4G):

- Lighthouse Performance ≥ 95; Accessibility, Best Practices and SEO = 100.
- LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- Total JavaScript < 100 KB gzipped.
- Production container image < 25 MB.

Rationale: enterprise buyers judge engineering quality by the speed and stability of the site itself.

### II. Accessibility & HCI Compliance (NON-NEGOTIABLE)

The site MUST meet WCAG 2.1 AA in **both** light and dark themes:

- Body text contrast ≥ 4.5:1; large text and UI components ≥ 3:1.
- Visible focus indicators; every interactive element reachable and operable by keyboard.
- Touch targets ≥ 44 × 44 px.
- All non-essential motion disabled under `prefers-reduced-motion: reduce`.
- Meaning is never conveyed by colour alone; decorative icons are `aria-hidden`.

Rationale: accessibility is a quality and compliance signal for regulated enterprise buyers.

### III. Brand, Content & Proof Integrity

Copy MUST maintain a strictly corporate tone. Canonical positioning, service names and offers come
from `docs/03_Master_Plan_v3.md` (and the catalogue docs once rewritten from it).

**Prohibited on the site:**

- Any years-of-experience claim, in any numeric or worded form.
- Public pricing, rates, or currency figures.
- Competitor names.
- Team-structure claims: "PM-led", "project-manager-led", "direct access to senior engineers",
  "our senior engineering team", "one accountable lead", headcount figures, or "our team" pages.
- Clock hours, time-zone labels (e.g. PKT, GMT, EST, UTC±n), minute or hour figures, and support
  response or resolution times. The generic phrase "time-zone overlap" is permitted. Durations in
  weeks are permitted. The ONLY permitted business-day commitments are "Written proposal within 2
  business days" and "We reply within 1 business day".
- A street address, city, or "our offices"; legal suffixes (Ltd, Inc, LLC) until a company is
  registered.
- "Remote-first" (or "remote first") in any form.
- "Certified", certification badges, or partner badges/tiers until actually held.
- "Guarantee", "guaranteed uptime", "zero downtime", "zero data loss", "100%", and unqualified "24/7".
- Claims of self-hosted, local, on-premise, or fine-tuned LLMs.

**Proof rules:**

- Testimonials, client logos, named case studies, project counts and certification/partner badges
  MUST render only from verified data: `verified: true`, a `permissionDate`, and an evidence note.
  A real result is not permission to use a client's name or logo; that requires written consent.
  These components ship empty and hidden until real entries exist.
- Fabricated, placeholder, sample or self-written testimonials, logos, case studies or counts are
  prohibited in every environment, including drafts.
- Past-project percentage results MUST be worded as achieved results, never as promises or targets
  (e.g. "cut deployment time by 50% for a B2B SaaS platform"), and carry the footnote:
  "Results from past engagements; outcomes vary by environment. Commitments are defined per
  Statement of Work."
- The results section is titled "Selected results from past engagements" and carries no per-card
  credit line, so it neither claims the clients were ZanamTech's nor describes a team.
- A real/illustrative record MUST be kept for every scenario. Real, anonymised past projects MAY
  carry their real numbers; illustrative examples MUST carry no numbers.
- Third-party statistics MUST cite a linked source.
- The single primary CTA is "Book a Strategy Consultation".

Rationale: enterprise procurement verifies claims; only real, permissioned, evidence-backed proof
survives a reference check and complies with FTC, UK CAP/DMCC, EU and GCC advertising rules.

### IV. Design-System Discipline

- **Design freeze (NON-NEGOTIABLE):** the existing visual design, colours, typography, spacing,
  radii, light/dark themes, layout style, animations, transitions, the reveal engine, the hover
  system (`.card-hover`, `.panel-hover`), marquees and micro-interactions MUST NOT change.
- New sections MUST be composed from existing primitives (`GlassCard`, `Badge`, `Button`,
  `PageHero`, `CtaBand`) and existing motion patterns, so they read as original parts of the site.
  The existing metric counters and shimmer are reused in the results strip; the three brand-pillar
  cards are reused in the Trust band.
- No new UI libraries, fonts, or colour tokens.
- Colours, spacing, radii, and shadows MUST come from semantic design tokens; no raw hex values in
  components.
- Light is the default theme; dark is available via a persistent toggle with no flash of the wrong theme.
- Glass (translucent, blurred) surfaces MUST have an opaque fallback and pass contrast checks.
- The brand gradient (`#21A0FF` → `#7A2BFF`) is reserved for accents: logo, hairlines, CTA sheen,
  and display-size numerals. It MUST NOT be used behind body text.

Rationale: a disciplined, frozen design system keeps the premium corporate look consistent while
content and structure evolve.

### V. Zero-Trust Web Security & Privacy

- Responses MUST carry a strict Content-Security-Policy, HSTS, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`.
- Secrets MUST NOT be committed; configuration lives in `.env` with a committed `.env.example`.
- Analytics MUST be cookieless; lead data is collected only with explicit consent.
- Forms MUST include spam protection (honeypot plus provider-side filtering).
- Third-party origins MUST be explicitly allow-listed in the CSP.

Rationale: the site must demonstrate the zero-trust posture the company sells.

### VI. Mandated Technology Stack

The site MUST be built with Astro (4.0 or later), Tailwind CSS, Framer Motion, Alpine.js, Lucide
icons, and Docker with an Nginx runtime image. Any substitution or addition of a framework-level
dependency MUST be justified in an Architecture Decision Record (ADR) before adoption.

Rationale: a fixed stack keeps delivery predictable and aligned with the approved technical plan.

### VII. Verification Gates & Smallest Viable Change

Every change MUST pass, before merge:

- `astro check` and a production build.
- Content lint: years claims, pricing patterns, competitor names, every Principle III banned phrase,
  clock-hour and time-zone patterns, response-time figures, and verified-data checks (every client,
  testimonial and case-study entry has `verified` and `permissionDate`; third-party % cite a source).
- End-to-end smoke tests with automated accessibility scans in light and dark themes.
- Lighthouse CI against the budgets in Principle I.

Changes MUST be the smallest viable diff; unrelated refactors are prohibited. Every user prompt is
recorded as a Prompt History Record (PHR).

Rationale: automated gates make the principles above enforceable rather than aspirational.

## Content & Brand Standards

- Voice: authoritative, precise, outcome-focused; no hype, slang, or emoji. "We" is used for the
  company.
- Positioning pillars, used verbatim: **Enterprise-grade**, **High-availability**, **Zero-trust security**.
- Platforms: AWS, Microsoft Azure and Google Cloud are treated equally. General copy names all three (in that
  order); real past scenarios keep the cloud they actually ran on.
- Describe the process a client gets (SOW, kickoff, weekly status, monthly service review,
  runbooks, handover), never who sits behind it.
- Preferred terms: "Statement of Work (SOW)", "achieved result", "documented
  runbooks", "no lock-in", "least-privilege access".
- Avoided terms: "senior engineering expertise", "target outcome", "Representative Engagement
  Scenario" as a mandatory label, and every term prohibited in Principle III.

## Development Workflow

1. `/sp.specify` → `/sp.clarify` → `/sp.plan` → `/sp.tasks` → `/sp.analyze` → `/sp.implement`.
2. A PHR is created under `history/prompts/` for every user prompt.
3. Architecturally significant decisions are proposed as ADRs and created only with user consent.
4. Work is delivered in independently testable increments, one reviewed phase at a time.

## Governance

This constitution supersedes all other project practices. Amendments require a pull request that
states the rationale, updates dependent templates, and bumps the version using semantic versioning:
MAJOR for removing or redefining a principle, MINOR for adding a principle or materially expanding
guidance, PATCH for clarifications and wording. Every implementation plan MUST include a
Constitution Check; violations MUST be justified in its Complexity Tracking table. Reviewers verify
compliance on every pull request.

**Version**: 2.0.4 | **Ratified**: 2026-09-29 | **Last Amended**: 2026-10-14

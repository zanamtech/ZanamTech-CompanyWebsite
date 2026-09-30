<!--
Sync Impact Report
- Version change: template (unversioned) → 1.0.0
- Modified principles: all placeholders replaced (initial ratification)
  - [PRINCIPLE_1_NAME] → I. Static-First Performance
  - [PRINCIPLE_2_NAME] → II. Accessibility & HCI Compliance (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. Brand & Content Integrity
  - [PRINCIPLE_4_NAME] → IV. Design-System Discipline
  - [PRINCIPLE_5_NAME] → V. Zero-Trust Web Security & Privacy
  - [PRINCIPLE_6_NAME] → VI. Mandated Technology Stack
  - Added → VII. Verification Gates & Smallest Viable Change
- Added sections: Content & Brand Standards; Development Workflow; Governance
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check is filled per plan; no edit needed)
  - ✅ .specify/templates/spec-template.md (no mandatory-section change)
  - ✅ .specify/templates/tasks-template.md (verification-gate tasks are generated per feature; no edit needed)
  - ✅ .specify/templates/commands/ (directory not present; nothing to sync)
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

### III. Brand & Content Integrity

Copy MUST maintain a strictly corporate tone and MUST NOT contain:

- Any years-of-experience claim (in any numeric or worded form).
- Public pricing, rates, or currency figures.
- Competitor names.

Metrics MUST be presented as target outcomes with the footnote "Outcomes vary by environment; SLA
commitments are defined per Statement of Work." Worked examples MUST be labelled
"Representative Engagement Scenarios". Roadmap offerings MUST be labelled "In Development".
Canonical service names come from `docs/02_Services_Catalog.md`.

Rationale: credibility with enterprise buyers depends on precise, verifiable, non-inflated claims.

### IV. Design-System Discipline

- Colours, spacing, radii, and shadows MUST come from semantic design tokens; no raw hex values in
  components.
- Light is the default theme; dark is available via a persistent toggle with no flash of the wrong theme.
- Glass (translucent, blurred) surfaces MUST have an opaque fallback and pass contrast checks.
- The brand gradient (`#21A0FF` → `#7A2BFF`) is reserved for accents: logo, hairlines, CTA sheen,
  and display-size numerals. It MUST NOT be used behind body text.

Rationale: a disciplined token system keeps the premium corporate look consistent and auditable.

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
- Content lint (prohibited phrases, pricing patterns, competitor names).
- End-to-end smoke tests with automated accessibility scans in light and dark themes.
- Lighthouse CI against the budgets in Principle I.

Changes MUST be the smallest viable diff; unrelated refactors are prohibited. Every user prompt is
recorded as a Prompt History Record (PHR).

Rationale: automated gates make the principles above enforceable rather than aspirational.

## Content & Brand Standards

- Voice: authoritative, precise, outcome-focused; no hype, slang, or emoji.
- Positioning pillars, used verbatim: **Enterprise-grade**, **High-availability**, **Zero-trust security**.
- Preferred terms: "senior engineering expertise", "target outcome", "Statement of Work (SOW)",
  "Representative Engagement Scenario".
- Avoided terms: "guarantee" and "zero-loss" without SOW qualification; years-of-experience phrasing.

## Development Workflow

1. `/sp.specify` → `/sp.clarify` → `/sp.plan` → `/sp.tasks` → `/sp.implement`.
2. A PHR is created under `history/prompts/` for every user prompt.
3. Architecturally significant decisions are proposed as ADRs and created only with user consent.
4. Work is delivered in independently testable user-story increments.

## Governance

This constitution supersedes all other project practices. Amendments require a pull request that
states the rationale, updates dependent templates, and bumps the version using semantic versioning:
MAJOR for removing or redefining a principle, MINOR for adding a principle or materially expanding
guidance, PATCH for clarifications and wording. Every implementation plan MUST include a
Constitution Check; violations MUST be justified in its Complexity Tracking table. Reviewers verify
compliance on every pull request.

**Version**: 1.0.0 | **Ratified**: 2026-09-29 | **Last Amended**: 2026-09-29

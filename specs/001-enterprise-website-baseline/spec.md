# Feature Specification: ZanamTech Enterprise Website (Baseline)

**Feature Branch**: `001-enterprise-website-baseline`
**Created**: 2026-09-29
**Status**: Draft
**Input**: User description: "Create a comprehensive baseline specification for the ZanamTech Enterprise Website from the `docs/` folder, including the 9 core services, the brand positioning (Enterprise-grade, high-availability, zero-trust security), and the exact tech stack (Astro 4.0, Tailwind CSS, Framer Motion, Alpine.js, Docker). Strictly corporate tone; no years-of-experience claims."

## Clarifications

### Session 2026-09-29

- Q: Single-page or multi-page site? → A: Multi-page (~16 pages): Home, Services index, 9 service detail pages, Approach, Industries, About, Contact, Privacy, 404.
- Q: How are the catalog's worked examples presented? → A: As "Representative Engagement Scenarios" (problem → solution → outcome) with a disclaimer; never as named client case studies.
- Q: Analytics and consent model? → A: Cookieless, privacy-first analytics; no consent banner; the privacy notice covers the form and analytics.
- Q: Which hero option? → A: Option A "Enterprise & Authority" with any years-of-experience claim removed; CTAs "Book a Strategy Consultation" (primary) and "Request a Custom Proposal" (secondary).
- Q: How are performance metrics framed? → A: As target outcomes with the footnote "Outcomes vary by environment; SLA commitments are defined per Statement of Work." "Guarantee" and "Zero-Loss" never appear unqualified.
- Q (plan): Where do leads go? → A: A hosted form endpoint; the site stays fully static.
- Q (plan): Default theme? → A: Light by default, with a smooth, persistent toggle to dark.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand ZanamTech's value proposition (Priority: P1)

An enterprise decision-maker (CTO, CIO, VP Engineering, CISO) lands on the Home page and within seconds
understands that ZanamTech delivers enterprise-grade, high-availability, zero-trust-secured cloud,
DevSecOps, application, and private AI engineering, and sees a clear next step.

**Why this priority**: The Home page is the primary entry point; without a clear proposition no lead is generated.

**Independent Test**: Open the Home page at desktop (1440 px) and mobile (375 px) widths; the headline, the three
positioning pillars, and both CTAs are visible without scrolling on desktop and within the first viewport-and-a-half on mobile.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** the Home page loads, **Then** the headline "Enterprise Cloud Resilience, Ironclad Cyber Security & Intelligent AI Automation." and the pillars Enterprise-grade, High-availability and Zero-trust security are displayed.
2. **Given** the Home page, **When** the visitor activates "Book a Strategy Consultation" or "Request a Custom Proposal", **Then** they reach the consultation request flow.
3. **Given** any page, **When** its text is inspected, **Then** no pricing and no years-of-experience claim is present.

---

### User Story 2 - Explore the 9 core services (Priority: P1)

A visitor browses the nine core services, compares them, and opens a detail page describing capabilities,
technology stack, target outcome, and two Representative Engagement Scenarios.

**Why this priority**: Services are the product; buyers qualify the firm by the depth of each offering.

**Independent Test**: From the Home page, reach every service detail page in two clicks or fewer; each detail page shows
capabilities, stack, target outcome with footnote, and two labelled scenarios.

**Acceptance Scenarios**:

1. **Given** the Services index, **When** it loads, **Then** exactly nine services are listed in canonical order.
2. **Given** a service card, **When** it is activated, **Then** the detail page opens with capabilities, stack, target outcome, two scenarios, and a consultation CTA.

---

### User Story 3 - Request a consultation (Priority: P2)

A qualified visitor submits a consultation request from any CTA without leaving the current page.

**Why this priority**: Lead capture is the site's business outcome, but it depends on US1/US2 content to motivate it.

**Independent Test**: Activate any CTA, complete the form, submit; a confirmation is shown. Simulated provider failure keeps the entered data and offers retry.

**Acceptance Scenarios**:

1. **Given** any CTA, **When** activated, **Then** a dialog opens with focus on its first field; Escape closes it and returns focus to the CTA.
2. **Given** invalid input, **When** submitted, **Then** inline errors appear next to the affected fields.
3. **Given** valid input and consent, **When** submitted, **Then** a success state is shown within 10 seconds or an error with retry.
4. **Given** JavaScript is unavailable, **When** a CTA is activated, **Then** the visitor reaches the standalone Contact page.

---

### User Story 4 - See quantified target outcomes (Priority: P2)

A visitor sees animated metric counters (e.g., 99.9% uptime SLA target, up to 40% cloud savings) with a qualifying footnote.

**Why this priority**: Quantified outcomes build credibility but are supporting content.

**Independent Test**: Scroll to the metrics section; values animate to their final figures, or show immediately when reduced motion is preferred; the footnote is visible.

**Acceptance Scenarios**:

1. **Given** reduced-motion preference, **When** the metrics section is shown, **Then** final values are displayed with no animation.
2. **Given** JavaScript is unavailable, **When** the page renders, **Then** final values are present in the page content.

---

### User Story 5 - Understand the engagement approach and industries (Priority: P3)

A visitor reviews the four-phase engagement process, the industries/segments served, and the company profile.

**Independent Test**: The Approach page lists the four phases in order; the Industries page lists the three segments; About describes the mission without years-of-experience claims.

**Acceptance Scenarios**:

1. **Given** the Approach page, **When** loaded, **Then** Technical Audit, Custom Proposal & SOW, Onboarding & Zero-Downtime Implementation, and Continuous 24/7 Support appear in order, and engagement models are described without prices.

---

### User Story 6 - See the roadmap offering (Priority: P3)

A visitor sees Advanced Agentic AI Workflows & Dedicated LLMOps clearly marked "In Development".

**Independent Test**: The roadmap item carries an "In Development" badge, is excluded from the nine-service grid and from lead-form service options.

**Acceptance Scenarios**:

1. **Given** the Services index, **When** loaded, **Then** the roadmap item appears below the nine services with an "In Development" label and no purchase CTA.

---

### User Story 7 - Browse comfortably in light or dark theme (Priority: P3)

A visitor uses the site in the default light theme, switches to dark, and the choice persists across pages and visits; the site is fully keyboard- and screen-reader-operable.

**Independent Test**: First visit renders light with no flash; toggling switches within 300 ms and persists after reload; automated accessibility scans report zero violations in both themes.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** a page loads, **Then** the light theme is shown with no flash of dark content.
2. **Given** dark theme selected, **When** another page is opened or the site revisited, **Then** dark theme is applied before first paint.

---

### Edge Cases

- JavaScript disabled: all content readable; CTAs fall back to the Contact page; counters show final values.
- Reduced-motion preference: no counter animation, no reveal animation, theme switch without transition.
- Form endpoint failure or timeout (> 10 s): inline error, entered data preserved, retry offered.
- Spam submissions: hidden honeypot field filled → submission silently discarded client-side and rejected provider-side.
- Browser without translucent-blur support: glass surfaces render as opaque panels with equal contrast.
- Unknown URL: branded 404 page with links to Home and Services.
- Stored theme value invalid or storage unavailable: fall back to light.

## Requirements *(mandatory)*

### Functional Requirements

**Information architecture**
- **FR-001**: The site MUST provide these pages: Home, Services index, one detail page per core service (9), Approach, Industries, About, Contact, Privacy, and a 404 page.
- **FR-002**: Every page MUST share a header (logo, primary navigation, theme toggle, primary CTA) and footer (services list, company links, privacy link, copyright).
- **FR-003**: Every service detail page MUST be reachable from the Home page in two clicks or fewer.

**Brand positioning & copy**
- **FR-004**: The Home hero MUST use headline "Enterprise Cloud Resilience, Ironclad Cyber Security & Intelligent AI Automation." and a subheadline describing high-availability cloud environments, zero-trust security perimeters and secure private LLM workflows, with no years-of-experience claim.
- **FR-005**: The three positioning pillars — Enterprise-grade, High-availability, Zero-trust security — MUST appear on the Home page.
- **FR-006**: Primary CTA text MUST be "Book a Strategy Consultation"; secondary CTA text MUST be "Request a Custom Proposal".
- **FR-007**: No page MUST display prices, rates, currency amounts, competitor names, or years-of-experience claims.
- **FR-008**: The tone MUST be strictly corporate (no slang, emoji, or hype superlatives).

**Services**
- **FR-009**: The site MUST present exactly these nine core services, in this order:
  1. Cloud Migration & Containerization
  2. Enterprise Security & WAF Hardening
  3. High Availability & Disaster Recovery
  4. CI/CD Pipeline & Workflow Automation
  5. Active System Observability & Monitoring
  6. Cloud Infrastructure Cost Optimization
  7. Custom Full-Stack Web App Development
  8. Intelligent Enterprise AI Integration & Automation
  9. 24/7 Managed Infrastructure & Incident Resolution
- **FR-010**: Each service MUST include a summary, capability list, technology stack, target outcome, and exactly two Representative Engagement Scenarios (problem → solution → outcome).
- **FR-011**: Scenarios MUST be labelled "Representative Engagement Scenario" and accompanied by a disclaimer that they illustrate typical engagements.
- **FR-012**: Services MUST be grouped as "Cloud & Infrastructure" and "Engineering & AI" on the Services index.
- **FR-013**: Advanced Agentic AI Workflows & Dedicated LLMOps MUST appear only as a roadmap item labelled "In Development", excluded from the nine-service grid and lead options.

**Metrics**
- **FR-014**: The Home page MUST display target-outcome metrics: 99.9% uptime SLA target, 80% attack-surface reduction, up to 40% cloud cost savings, 50% faster deployments, 45% faster incident detection, 30% MTTR improvement (additional targets may appear on detail pages).
- **FR-015**: Metrics MUST animate from zero to their value when scrolled into view, and MUST show final values immediately under reduced motion or without JavaScript.
- **FR-016**: Every metric group MUST carry the footnote "Outcomes vary by environment; SLA commitments are defined per Statement of Work."

**Lead capture**
- **FR-017**: Every CTA MUST open a consultation dialog when scripting is available, and link to the Contact page otherwise.
- **FR-018**: The form MUST collect: full name (required, 2–100 chars), work email (required, valid format), company (required), role (optional), service interest (optional; the nine services plus "Not sure yet"), message (required, 20–2000 chars), and consent to the privacy notice (required).
- **FR-019**: Validation errors MUST appear inline next to the affected field and be announced to assistive technology.
- **FR-020**: Submissions MUST be sent to a hosted form endpoint; on success a confirmation is shown; on failure or 10-second timeout the entered data is kept and retry offered.
- **FR-021**: The form MUST include a hidden honeypot field; submissions with it filled MUST NOT be sent.
- **FR-022**: The dialog MUST trap focus, close on Escape and backdrop click, return focus to the invoking control, and lock background scroll.
- **FR-023**: A service detail page's CTA MUST pre-select that service in the form.

**Engagement, industries, company**
- **FR-024**: The Approach page MUST describe the four engagement phases in order and the two engagement models (Fixed-Scope Setup, Monthly Retainer) without prices.
- **FR-025**: The Industries page MUST describe the three target segments (High-Growth B2B SaaS & Tech Scale-Ups; Mid-Market Enterprises & Digital Transformation Leaders; Data-Sensitive Organizations Seeking Enterprise AI) with challenges and value.
- **FR-026**: The About page MUST present the mission, the "Pragmatic Enterprise First" philosophy, core capabilities, and the consultative engagement model.

**Theme & accessibility**
- **FR-027**: The light theme MUST be the default; a toggle MUST switch to dark and persist the choice across pages and visits with no flash of the wrong theme.
- **FR-028**: Both themes MUST meet WCAG 2.1 AA contrast; all interactive elements MUST be keyboard operable with visible focus and ≥ 44 × 44 px targets.
- **FR-029**: A "Skip to content" link MUST be the first focusable element on each page.
- **FR-030**: Non-essential motion MUST be disabled when the visitor prefers reduced motion.

**SEO, privacy, security**
- **FR-031**: Each page MUST have a unique title, meta description, canonical URL, and social-sharing metadata; the site MUST publish a sitemap and robots file and Organization structured data.
- **FR-032**: Analytics MUST be cookieless; no consent banner is shown.
- **FR-033**: The Privacy page MUST describe data collected via the form, the form processor, analytics, retention, and contact route.
- **FR-034**: The site MUST be served with strict security headers (content security policy, transport security, framing denial, content-type sniffing protection, referrer and permissions policies).
- **FR-035**: The site MUST be deliverable as a self-contained container image under 25 MB.

### Mandated Technology Constraints

The following stack is a stakeholder mandate (recorded here by explicit request; details belong to the plan):
Astro 4.0 or later, Tailwind CSS, Framer Motion, Alpine.js, Lucide icons, Docker with an Nginx runtime.

### Key Entities

- **Service**: order (1–9), slug, name, group, summary, capabilities, stack, target outcome, two scenarios, status (active/roadmap).
- **Engagement Scenario**: problem, solution, outcome; belongs to one Service.
- **Metric Target**: value, prefix/suffix, label, related service.
- **Lead Request**: name, work email, company, role, service interest, message, consent, honeypot; transient (not stored by the site).
- **Engagement Phase**: order (1–4), name, description.
- **Target Segment**: name, decision makers, challenges, value.
- **Roadmap Service**: a Service with status "roadmap" and an "In Development" label.

### Assumptions

- Content is authored in the repository (no CMS) and sourced from `docs/01_Brand_Positioning.md` and `docs/02_Services_Catalog.md`, rewritten to remove years-of-experience claims and to frame outcomes as targets.
- The hosted form provider supplies email delivery and server-side spam filtering.
- English only.

### Out of Scope

- CMS, blog, or news section; client portal or login; internationalisation; public pricing; e-commerce.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every page scores ≥ 95 for performance and 100 for accessibility, best practices, and SEO in automated audits on mobile.
- **SC-002**: Largest content renders in under 2.5 s and layout shift stays below 0.1 on a simulated mid-range mobile connection.
- **SC-003**: Any service detail page is reachable from Home in two clicks or fewer.
- **SC-004**: A visitor can complete and submit a consultation request in under 90 seconds.
- **SC-005**: Zero prices, zero competitor names, and zero years-of-experience claims appear across all pages (verified by automated content scan).
- **SC-006**: Zero critical or serious accessibility violations in both themes across all pages.
- **SC-007**: The theme preference persists across 100% of page navigations and return visits in the same browser.

# Feature Specification: Enterprise Repositioning (Master Plan v3)

**Feature Branch**: `002-enterprise-repositioning` (spec folder only; work stays on `dev`)
**Created**: 2026-10-12
**Status**: Draft
**Supersedes**: FR-009, FR-013 and FR-018 of `specs/001-enterprise-website-baseline/spec.md`, and any
001 requirement that frames metrics as targets or labels examples as "Representative Engagement
Scenarios".
**Input**: User description: "specs/002-enterprise-repositioning — Enterprise repositioning of the
ZanamTech website per docs/03_Master_Plan_v3.md (source of truth; overrides docs 01/02 and the old
plan). Constitution v2.0.0 applies. Visual design, animations and transitions must not change. User
decisions: all existing scenario numbers are real past projects (keep a real/illustrative record);
keep the 2 commitments ("Written proposal within 2 business days", "We reply within 1 business
day"); results section "Selected results from past engagements" with no per-card credit line; reuse
counters/shimmer in the results strip and brand-pillar cards in the Trust band; keep "Custom
Full-Stack Web App Development" name and slug. Work stays on the dev branch."

## Clarifications

### Session 2026-10-12

- Q: Which service-page scenarios describe real projects? → A: All existing scenario numbers come
  from real past projects. They keep their numbers, anonymised and worded as achieved results. A
  real/illustrative record is kept for every scenario; any future illustrative example carries no numbers.
- Q: May the site show any time commitments? → A: Only "Written proposal within 2 business days" and
  "We reply within 1 business day". No clock hours, time zones or support response times.
- Q: How are past-project results attributed? → A: The section is titled "Selected results from past
  engagements", with no per-card credit line. It does not claim the clients were ZanamTech's and
  does not describe a team.
- Q: What happens to the existing "Why ZanamTech" pillar cards and the metric counters? → A: The
  counters and their shimmer are reused in the new results strip. The three brand-pillar cards are
  reused in the Trust band. No section is orphaned and no animation is lost.
- Q: The web service name? → A: "Custom Full-Stack Web App Development" and its address stay; the
  content is upgraded to cover SaaS platforms.
- Q (clarify): How do the five new services (IaC & Landing Zones, Enterprise Portals, App
  Modernisation, AI Workflow & Document Automation, AI Assistants) show scenarios without real past
  projects? → A: Each gets 1–2 illustrative scenarios with no numbers, labelled "Example engagement"
  and recorded as illustrative.
- Q (clarify): Where does each results card's industry and challenge context come from? → A: It is
  derived from the existing real scenario that carries the same number. The owner verifies it in the
  content review.
- Q (clarify): Does Google Cloud (GCP) stay on the site? → A: No. There is no real GCP work to show,
  so GCP is removed everywhere: headline copy, service text, stacks and the technology marquee.
- Q (clarify): How many results does the Home results strip show? → A: All 8, in a 4×2 grid on
  desktop (stacked on mobile), the same count as today's metrics section.
- Q (clarify): Where are draft articles and artefacts reviewed? → A: Only on the local development
  site, with a DRAFT/Sample marker. Every built site (production and any preview) excludes them.
- Q (analysis remediation): May the site state any duration? → A: No minute or hour figures
  anywhere, including the consultation length. Weeks (offers, onboarding) and the two business-day
  commitments are allowed.
- Q (analysis remediation): Is the wider 4-pillar services menu allowed under the design freeze?
  → A: Yes, only if it reuses the existing header styles and animations and works on tablet and
  mobile.
- Q (analysis remediation): How is performance verified? → A: Lighthouse runs locally against the
  production build at the end of the components phase and at release. Linux CI is a later follow-up.

## Scope

**In scope:**
- **Messaging and positioning** across the whole site, per `docs/03_Master_Plan_v3.md`.
- **Services:** a pillar-based catalogue (a flagship retainer plus 12 services in 4 pillars), 5 entry
  offers and the engagement models.
- **New pages:** Start Here, Managed Services (flagship), Trust, Insights, Terms, and Case Studies
  (built but hidden).
- **Reworked pages:** Home, Services, How We Work, About, Industries, Contact and Privacy.
- **Gated proof:** testimonial, logo and case-study sections that appear only from verified data.
- **Drafts:** 3 Insights articles and 3 proof artefacts, held back until the owner approves them.
- **Housekeeping:**
  - redirects from retired service addresses
  - a security contact file
  - content guardrails (automated checks)
  - rewriting the internal brand and catalogue docs from v3

**Out of scope:**
- Any change to visual design, colours, typography, spacing, theme behaviour, animations,
  transitions or micro-interactions.
- Business setup in v3 sections F–H (registration, email, certifications, sales kit). The site
  shows none of these until they are achieved.
- A CMS, a client portal, localisation, public pricing.
- Publishing the drafts without the owner's approval.
- Analytics goal events (consultation bookings, form submits). This is a post-launch follow-up,
  because it needs code changes and a CSP review.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand the offer and see real results (Priority: P1)

A CTO or IT director lands on the Home page. Within one screen they understand that ZanamTech runs,
secures and modernises Azure and AWS platforms, builds cloud-native web applications and automates
manual work with practical AI. They immediately see results achieved on past engagements.

**Why this priority**: the Home page is the main entry point, and real results are the strongest proof available today.

**Independent Test**: open Home at desktop and mobile widths. Check the hero headline and sub-line,
the results strip directly below the hero, and that the page carries no prohibited claim.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** Home loads, **Then** the headline reads "Managed Cloud,
   DevOps & AI Engineering for Businesses That Can't Afford Downtime." with the v3 sub-line, the
   three brand pillars, and the single CTA "Book a Strategy Consultation".
2. **Given** Home, **When** the visitor scrolls past the hero, **Then** a section titled "Selected
   results from past engagements" shows all 8 existing percentage results. Each is worded as an
   achieved result with industry and challenge context, has no credit line, and the section ends
   with the footnote "Results from past engagements; outcomes vary by environment. Commitments are
   defined per Statement of Work."
3. **Given** the results strip, **When** it enters the viewport, **Then** the figures animate with the
   same counter and shimmer behaviour as today. Under reduced motion they show their final values
   immediately.
4. **Given** Home, **When** it is read top to bottom, **Then** the sections appear in this order:
   - hero
   - results
   - technology marquee ("Technologies we work with")
   - flagship spotlight
   - four service pillars
   - Start Here offers
   - proof-by-artefact band
   - How we work
   - industries
   - Trust band (which reuses the three brand-pillar cards)
   - FAQ
   - closing CTA

---

### User Story 2 - Explore services by pillar (Priority: P1)

A buyer explores the flagship Managed Cloud & DevOps service and the 12 services across four pillars,
and reaches any service within two clicks from Home.

**Why this priority**: the catalogue defines what ZanamTech sells. The old 9-item list under-sells the flagship work.

**Independent Test**: from Home, open the Services menu and the Services page. Confirm four pillars,
the flagship first, each service page's content blocks, and redirects from retired addresses.

**Acceptance Scenarios**:

1. **Given** the Services menu or page, **When** it opens, **Then** services are grouped under four
   pillars:
   - **Managed Cloud & DevOps:** the flagship.
   - **Cloud & DevOps Engineering:** Cloud Migration & Modernisation; Infrastructure as Code &
     Landing Zones; CI/CD & DevOps Transformation; Security Hardening & WAF; High Availability &
     Disaster Recovery; Observability & Monitoring; Cloud Cost Optimisation.
   - **Web & SaaS Engineering:** Custom Full-Stack Web App Development; Enterprise Portals &
     Internal Tools; Application Modernisation & Integration.
   - **Practical AI & Automation:** AI Workflow & Document Automation; AI Assistants on Company Data.
2. **Given** the flagship page, **When** it loads, **Then** it shows:
   - the seven modules
   - the three tiers (Essentials, Professional, Enterprise), described by scope and coverage
     wording only
   - the P1–P4 severity definitions
   - the reporting cadence, the 4-week onboarding, the exit terms and an FAQ
   - no response times and no clock hours
3. **Given** any service page, **When** it loads, **Then** it shows its overview, "What you get"
   deliverables, engagement types, capabilities, technology stack, an FAQ, a related entry offer, and
   its anonymised past-project scenarios worded as achieved results.
4. **Given** a retired address (the old 24/7 managed infrastructure page, the old enterprise AI
   integration page, the old agentic AI roadmap page), **When** it is requested, **Then** the visitor
   is redirected to the flagship page, the AI Assistants page and the AI section of Services
   respectively.
5. **Given** the Services page, **When** it is inspected, **Then** no roadmap or "What we are building
   next" section exists and no service is labelled "In Development" or "coming soon".

---

### User Story 3 - Choose a low-risk way to start (Priority: P2)

A buyer who isn't ready for a large contract finds a fixed-scope entry offer, or, as a software agency,
finds a white-label partnership model.

**Why this priority**: entry offers turn interest into paid first engagements without public prices.

**Independent Test**: open Start Here and How We Work. Check the five offers, five engagement models
and the "For software agencies" section.

**Acceptance Scenarios**:

1. **Given** Start Here, **When** it loads, **Then** five offers are listed: Cloud & DevOps Health Check,
   Cloud Cost Review, DevOps Governance Quick-Start, AI Opportunity Sprint, AI Automation Pilot. Each
   shows a duration in weeks, the inputs needed from the client, deliverables and the next step, and
   none shows a fee.
2. **Given** How We Work, **When** it loads, **Then** it shows:
   - the engagement phases
   - the engagement models (Assessment, Fixed-scope project, Managed retainer, Agency partnership,
     Extended engineering capacity)
   - the cadence (SOW, kickoff, weekly status, monthly service review, runbooks and handover)
   - the access model and an AI-tool policy summary
   - a "For software agencies" section
3. **Given** the engagement phase cards, **When** they reveal, **Then** the existing sequential card
   and connector-line animation is unchanged.

---

### User Story 4 - Assess trust and credibility (Priority: P2)

A procurement or security reviewer checks how ZanamTech handles access, data, AI tools and
confidentiality, and who runs the company.

**Why this priority**: enterprise deals fail at due diligence without a clear trust posture.

**Independent Test**: open Trust, About, Privacy and Terms, and request the security contact file.
Check the content and the absence of unearned claims.

**Acceptance Scenarios**:

1. **Given** Trust, **When** it loads, **Then** it describes:
   - security practices and the least-privilege access model
   - the AI-tool policy (no training on customer data; no client secrets in AI tools; every
     AI-assisted change reviewed; per-SOW opt-out)
   - NDA/MSA/DPA availability on request
   - the sub-processor list, data-residency options and the security contact
   - no continuity-cover claim until a backup engineer is contracted
2. **Given** About, **When** it loads, **Then** it shows:
   - the mission and the "Pragmatic Enterprise First" values
   - a Leadership section with the founder's name, a capability bio and a LinkedIn link, with no
     years, no badges and no city
   - a "remote-first" statement
3. **Given** the site's standard security-contact location, **When** it is requested, **Then** it
   returns a valid security contact file naming the security contact address.
4. **Given** the footer on any page, **When** it is inspected, **Then** it shows "Remote-first Cloud,
   DevOps & AI engineering", the contact email, links to Privacy, Terms and Trust, and no street
   address, city or legal suffix.
5. **Given** Privacy, **When** it is read, **Then** it refers to a "privacy contact" (not a team) and
   covers GDPR/UK GDPR processor obligations and UAE/KSA personal-data laws.

---

### User Story 5 - Request a consultation with qualifying details (Priority: P2)

A buyer books a strategy consultation and gives the details ZanamTech needs to qualify the lead.

**Why this priority**: the form is the conversion point, and the new fields cut wasted discovery calls.

**Independent Test**: submit the form from the dialog and from the Contact page against a stubbed
endpoint. Check the options, the optional fields, the payload and the next-step copy.

**Acceptance Scenarios**:

1. **Given** the service selector, **When** it opens, **Then** it lists every published service plus
   "Agency partnership" and "Other / Not sure yet".
2. **Given** the form, **When** it renders, **Then** it offers optional Region (US/Canada, UK/Europe,
   GCC, Other), Company size and Cloud platform (Azure, AWS, Both, Other) fields in addition to the
   existing fields, and the existing dropdown styling and keyboard behaviour apply to them.
3. **Given** a valid submission, **When** it succeeds, **Then** the confirmation and the Contact page's
   next steps describe the process: "We reply within 1 business day", a consultation call, and
   "Written proposal within 2 business days". No engineer or team is mentioned.
4. **Given** a desktop screen, **When** the consultation dialog opens, **Then** it still fits without a
   vertical scrollbar.

---

### User Story 6 - Read insights and sample artefacts (Priority: P3)

A technical buyer reads practical articles and sample deliverables that show how ZanamTech thinks and works.

**Why this priority**: content builds credibility and search visibility, but only after the owner approves it.

**Independent Test**: in a production build, confirm drafts are absent. On the local development
site, confirm the drafts render with a clear DRAFT marker. Once an article is approved, confirm the
Insights link appears.

**Acceptance Scenarios**:

1. **Given** the three draft articles, **When** they are reviewed in the local development site, **Then** they cover:
   - an environment strategy for Dev, QA, UAT and Prod on Azure
   - Bitbucket branch governance and SOPs
   - a 15-point cloud cost checklist (citing its third-party statistic with a source link)
   
   Each is clearly marked DRAFT.
2. **Given** the three draft artefacts, **When** they are reviewed, **Then** they cover:
   - an Azure Dev/QA/UAT/Prod reference architecture
   - a Bitbucket branch-governance SOP template
   - a sample monthly service report
   
   Each is labelled "Sample" and written fresh, not taken from any client.
3. **Given** no approved article, **When** the production site is browsed, **Then** no Insights link
   or page lists unpublished drafts. Once at least one article is approved, the Insights link appears
   in the navigation.

---

### User Story 7 - Proof sections appear only when real (Priority: P3)

The owner adds a real testimonial, client logo or named case study only after written permission, and
the matching section appears automatically. Without verified data, nothing appears.

**Why this priority**: it protects the company from fabricated-proof liability while letting proof grow over time.

**Independent Test**: build with the empty proof data, then with one verified entry, and compare which
sections and navigation links appear.

**Acceptance Scenarios**:

1. **Given** no verified entries, **When** any page renders, **Then** no testimonial, client-logo,
   named case-study, project-count, certification-badge or partner-badge section appears, and there
   is no Case Studies navigation link.
2. **Given** an entry without verification status or a permission date, **When** content checks run,
   **Then** the check fails.
3. **Given** one verified, permissioned entry, **When** the site is built, **Then** the corresponding
   section appears using the existing card and marquee styling.

---

### User Story 8 - Content guardrails catch prohibited claims (Priority: P3)

The owner and any contributor are stopped automatically before prohibited wording reaches the site.

**Why this priority**: the rules are only reliable if they are enforced on every change.

**Independent Test**: add a prohibited phrase to site content and run the content checks; they fail.
Remove it; they pass.

**Acceptance Scenarios**:

1. **Given** site content containing any of these, **When** content checks run, **Then** they fail and
   name the file and line:
   - a years claim, a price, or a competitor name
   - "PM-led", "direct access to senior engineers" or a headcount
   - "guarantee", "zero downtime", "zero data loss" or "100%"
   - "certified", or a legal suffix
   - "local LLM"
   - a clock time or time zone, or a response-time figure
2. **Given** the two approved commitment phrases, **When** content checks run, **Then** they pass.

### Edge Cases

- **JavaScript disabled:** results show final values; the FAQ opens and closes natively; the
  consultation CTA falls back to the Contact page; the menus stay usable.
- **Reduced motion:** all new sections follow the existing reduced-motion behaviour (no counting, no
  shimmer, no slide-ins).
- **Retired addresses** bookmarked or indexed elsewhere redirect permanently; the address list in the
  site map contains only live pages.
- **A service marked not ready to deliver** is unpublished. It disappears from menus, the grid, the
  form options and the site map, with no "coming soon".
- **Empty LinkedIn or photo values:** the link or photo is hidden, never shown broken or as a placeholder.
- **Long service names in the 4-pillar menu** wrap without breaking the panel at tablet and desktop widths.
- **Third-party statistics in articles without a source link** fail the content checks.

## Requirements *(mandatory)*

### Functional Requirements

**Design preservation**

- **FR-001**: The site MUST keep its existing visual design unchanged: colours, typography, spacing,
  radii, light/dark themes, layout style, animations, transitions, scroll reveals, hover and focus
  effects, marquees and micro-interactions.
- **FR-002**: Every new section MUST be built from the site's existing card, badge, button, page-hero
  and CTA-band building blocks and existing motion patterns. No new fonts, colour tokens or UI
  libraries are introduced.
- **FR-003**: The results strip MUST reuse the existing metric counter and shimmer behaviour. The Trust
  band MUST reuse the three existing brand-pillar cards.

**Positioning and messaging**

- **FR-004**: The Home hero MUST use the v3 headline and sub-line, the brand pillars Enterprise-grade,
  High-availability and Zero-trust security, and the single CTA "Book a Strategy Consultation".
- **FR-005**: Site copy MUST describe the process a client receives (SOW, kickoff, weekly status,
  monthly service review, runbooks, handover, least-privilege access, no lock-in) and MUST NOT describe
  internal team structure.
- **FR-006**: Every occurrence of the following MUST be removed or rewritten:
  - "senior engineers deliver", "direct access to senior engineers", "our team", "privacy team"
  - unqualified 24/7 and round-the-clock claims
  - zero-downtime, near-zero data loss and "guarantee" wording
  - private, local or self-hosted LLM claims
  - "Nine disciplines" or nine-service wording
  
  This covers every page, menu, form message, page metadata and structured data.
- **FR-006a**: Google Cloud (GCP) MUST NOT appear anywhere on the site (copy, stacks, technology
  marquee, metadata). The platforms presented are Azure and AWS.
- **FR-007**: Site-wide descriptive text (page metadata, social previews, structured data, footer) MUST
  use the v3 positioning statement. Structured data MUST contain no address.

**Service catalogue**

- **FR-008** (supersedes 001 FR-009): The catalogue MUST consist of one flagship service and 12
  services in four pillars, named and ordered as in User Story 2, Scenario 1.
- **FR-009**: The flagship page MUST present the seven modules, the three tiers by scope and coverage
  wording only, the P1–P4 severity definitions, the reporting cadence, the 4-week onboarding, the exit
  terms (3-month minimum then rolling, one month's notice, documented handover, no lock-in) and an FAQ.
- **FR-010**: Each service page MUST present an overview, "What you get" deliverables, engagement
  types, capabilities, technology stack, an FAQ, a related entry offer, and its scenarios
  (challenge → approach → result).
- **FR-011**: "Custom Full-Stack Web App Development" MUST keep its name and address. Its content MUST
  cover web apps and multi-tenant SaaS platforms, and its search title MUST be "Custom Web Application
  Development".
- **FR-012**: The AI assistants service MUST describe assistants running on managed AI services inside
  the client's own cloud tenant, with citations, permissions and evaluation, and MUST NOT claim
  self-hosted models.
- **FR-013** (supersedes 001 FR-013): The roadmap section and roadmap service MUST be removed. No
  service is labelled "In Development" or "coming soon".
- **FR-014**: Each service MUST carry a "ready to deliver" status. Services not ready are unpublished
  everywhere (menus, grids, pages, form options, site map).
- **FR-015**: Requests for retired service addresses MUST redirect permanently:
  - old managed-infrastructure → flagship
  - old enterprise-AI-integration → AI Assistants on Company Data
  - old agentic-AI roadmap → the AI pillar on the Services page

**Results and proof**

- **FR-016**: The existing percentage results (99.9%, 80%, up to 40%, 50%, 45%, 30%, up to 60%, 35%)
  MUST be kept and worded as achieved results with industry and challenge context. The context is
  derived from the matching real scenario and verified by the owner before publication. The word
  "target" is not used for them.
- **FR-017**: The results section MUST be titled "Selected results from past engagements", carry no
  per-card credit line, and end with the footnote "Results from past engagements; outcomes vary by
  environment. Commitments are defined per Statement of Work."
- **FR-018**: Every scenario MUST be recorded as real or illustrative. Real scenarios keep their
  numbers in achieved-result wording. Illustrative scenarios carry no numbers and are labelled
  "Example engagement". Each new service without a real past project has 1–2 illustrative
  scenarios. The label "Representative Engagement Scenario" is no longer mandatory.
- **FR-019**: Testimonials, client logos, named case studies, project counts and certification or
  partner badges MUST render only from entries marked verified, with a permission date and an
  evidence note. At launch these data sets are empty and the sections are hidden.
- **FR-020**: The Case Studies page and navigation link MUST appear only when at least one verified
  case study exists.
- **FR-021**: No fabricated, placeholder, sample or self-written testimonial, logo, case study or
  count may exist anywhere in the site content, including drafts.

**Entry offers and engagement models**

- **FR-022**: A Start Here page MUST list the five entry offers with duration, client inputs,
  deliverables and next step, and no fees.
- **FR-023**: How We Work (the existing Approach page, relabelled) MUST present the engagement
  phases, the five engagement models, the cadence, the access model, an AI-tool policy summary and a
  "For software agencies" section describing white-label or co-branded partnership under NDA.

**Trust, company and legal pages**

- **FR-024**: A Trust page MUST present security practices, the access model, the AI-tool policy,
  NDA/MSA/DPA on request, the sub-processor list, data-residency options and the security contact.
  Continuity cover is mentioned only once a backup engineer is contracted.
- **FR-025**: The About page MUST present the mission, the values, and a Leadership section with the
  founder's name, a capability bio and LinkedIn link (hidden while unset), a photo (hidden while
  unset), and a remote-first statement. No years, badges or city.
- **FR-026**: A security contact file MUST be published at the standard well-known location, naming
  security@zanamtech.com.
- **FR-027**: A Terms page MUST cover acceptable use, no warranty on site content, intellectual
  property and governing law. It is linked in the footer.
- **FR-028**: The Privacy notice MUST name a privacy contact (privacy@zanamtech.com) and add GDPR/UK
  GDPR processor language and UAE/KSA personal-data law references.
- **FR-029**: The footer MUST show "ZanamTech · Remote-first Cloud, DevOps & AI engineering", the
  contact email (contact@zanamtech.com), the LinkedIn company page (hidden while unset), and links to
  Privacy, Terms and Trust. No address, city or legal suffix.

**Navigation**

- **FR-030**: The main navigation MUST read Services · Managed Services · How We Work · Insights ·
  About:
  - The Services menu shows four pillar columns plus a Start Here link.
  - Insights appears only when at least one article is published.
  - Industries remains reachable from the footer and the Home industries section.
- **FR-031**: The Industries page MUST map segments to the new services and add the GCC segment
  (UAE/KSA cloud regions and data-residency awareness) and the software-agency segment. The
  data-sensitive AI segment is not presented as a current focus.

**Contact and lead capture**

- **FR-032** (supersedes 001 FR-018): Service options MUST be generated from the published services,
  plus "Agency partnership" and "Other / Not sure yet".
- **FR-033**: The form MUST add optional Region, Company size and Cloud platform fields. They are
  included in the submitted lead. Existing validation, consent, spam protection and dropdown
  behaviour are preserved.
- **FR-034**: Confirmation and next-step copy MUST use only the approved commitments: "We reply within
  1 business day" and "Written proposal within 2 business days". The consultation is described as "a
  strategy consultation" with no stated length, because its duration depends on the client.
- **FR-035**: The desktop consultation dialog MUST continue to fit without a vertical scrollbar.

**Insights and artefacts**

- **FR-036**: Three Insights articles and three proof artefacts MUST be drafted (topics as in User
  Story 6) and marked as drafts. Drafts are visible only when the site runs locally for
  development, with a DRAFT or Sample marker. Every built site excludes them until the owner
  approves them.
- **FR-037**: Third-party statistics in any article MUST link to their source.

**Guardrails and source documents**

- **FR-038**: Automated content checks MUST fail on every term prohibited by Constitution III, on clock
  times and time zones, on minute and hour figures in any form (site-wide, articles included), and on
  proof entries missing verification fields. Weeks and business days are allowed; the only
  business-day phrases are the two approved commitments.
- **FR-039**: The internal brand-positioning and services-catalogue documents MUST be rewritten from v3,
  with years claims, citation artefacts, senior-team wording, guarantee wording, local-LLM claims and
  the competitor matrix removed. Internal SOW response defaults are kept out of the public site.

### Key Entities

- **Service**: name, address, pillar, flagship flag, ready-to-deliver status, summary, overview,
  deliverables, engagement types, capabilities, technology stack, FAQ, related offer, scenarios.
- **Pillar**: one of four groups (Managed Cloud & DevOps; Cloud & DevOps Engineering; Web & SaaS
  Engineering; Practical AI & Automation), with title, description and order.
- **Scenario**: challenge, approach, result; real/illustrative status; optional evidence reference.
- **Result**: figure, qualifier, achieved-result label, industry/challenge context, related service,
  internal attribution (never shown), optional evidence reference.
- **Retainer Tier**: name, scope, coverage wording (no hours, no response times), inclusions.
- **Severity Level**: P1–P4 with plain-language definitions.
- **Entry Offer**: name, duration in weeks, client inputs, deliverables, next step, credit-to-follow-on
  note.
- **Engagement Model**: name, description, when it fits.
- **Proof Entry** (testimonial, client logo, case study, badge): content, verified flag, permission
  date, evidence note.
- **Insight Article / Artefact**: title, summary, body, date, draft/sample status, sources.
- **Lead Request** (extended): adds region, company size and cloud platform; service options include
  "Agency partnership".
- **Leadership Profile**: name, role "Founder & Lead Architect", capability bio, LinkedIn link, photo,
  certifications (empty until earned).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Comparing pages before and after on unchanged components (header, hero frame, cards,
  buttons, footer) at 1440 px and 390 px, in both themes, shows no visual difference other than text.
  The one approved exception is the services menu widening to four pillar columns using existing
  header styles. Every existing animation still plays with the same timing.
- **SC-002**: Zero occurrences on the live site of any Constitution III prohibited term, clock time,
  time zone, response-time figure, address or fee, confirmed by the automated content checks and a
  manual search of the production build.
- **SC-003**: A visitor reaches any of the 13 service pages in two clicks or fewer from Home.
- **SC-004**: 100% of retired service addresses resolve to their replacement pages.
- **SC-005**: With empty proof data, zero testimonial, logo, case-study, count or badge elements
  appear on any page. With one verified entry, its section appears.
- **SC-006**: A first-time visitor sees achieved results within one scroll of landing on Home, on both
  desktop and mobile.
- **SC-007**: Zero critical or serious accessibility violations on every page, new pages included,
  in both themes.
- **SC-008**: The site keeps the existing performance budgets (Performance ≥ 95; Accessibility, Best
  Practices and SEO = 100; LCP < 2.5 s; CLS < 0.1) on Home and every new page.
- **SC-009**: The consultation form keeps at most 6 required inputs, all new qualifying fields are
  optional, and the desktop dialog shows no vertical scrollbar.
- **SC-010**: No unapproved draft article or artefact is reachable or listed on the production site.

## Assumptions

- `docs/03_Master_Plan_v3.md` is authoritative wherever it differs from older documents. Constitution
  v2.0.0 governs content and design.
- All 12 services and the flagship are ready to deliver today. The owner confirms readiness before
  publication, and any service marked not ready is unpublished.
- The existing eight percentage results come from real past projects. Evidence records are added
  later and are not required at launch.
- The founder's LinkedIn URLs and photo are supplied later. Until then those elements stay hidden.
- Cookieless analytics stays as it is today (enabled only when configured).
- The How We Work page keeps its current address. Only its label and content change.
- Contact addresses (contact@, security@, privacy@zanamtech.com) are the planned aliases. The site uses
  them before the mailbox is live.
- Work happens on the `dev` branch, delivered in reviewed phases with one commit per phase.

## Dependencies

- Owner fact-check and approval of the 3 articles and 3 artefacts before publication.
- Owner confirmation of each service's ready-to-deliver status.
- Owner-supplied LinkedIn URLs and photo (optional for launch).
- Hosting configuration for permanent redirects in the production web server.

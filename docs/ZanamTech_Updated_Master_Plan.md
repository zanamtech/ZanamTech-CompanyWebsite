# ZanamTech Updated Master Execution Plan (v2: repositioning)

> Status: **draft for founder review** (2026-10-11). Nothing in this document has been implemented in the website codebase yet.

## Context
- **Problem:** the founder has never personally reviewed the site's content.
- **What the audit and research found:**
  - **Service catalogue:** the 9 services are small, fragmented line items. The founder's real, highest-value work is end-to-end managed Cloud & DevOps for a client's Azure estate: environments, pipelines, backups, Bitbucket governance and SOPs. It appears nowhere as a flagship offer.
  - **Delivery promise:** copy promises "direct access to senior engineers" and "24/7 on-call engineers". A founder-led firm can't honour that today.
  - **Roadmap card:** it's non-standard for a services firm.
  - **Missing trust elements:** case studies, an engagement-model page, entry offers, a security/trust page and an FAQ. Every credible competitor has these.
- **Goal:** reposition ZanamTech as a PM-led enterprise Cloud, DevOps & AI engineering firm for **US/Canada, UK/Europe and GCC** buyers. It targets high-ticket projects and monthly retainers, never low-ticket gigs.

**Research inputs:** a full audit of the site and the `docs/` folder, a review of 20+ agencies, and a trust, compliance and legal review.
- **Agencies reviewed:** 10Pearls, Folio3, Systems, Arbisoft, Tkxel, Devsinc, Simform, ScienceSoft, Mission Cloud, ClearScale, Rackspace, N-iX, Ciklum, Cloudreach, UK Azure MSPs, founder-led DevOps boutiques, and AI-automation agencies.
- **Trust and legal review covered:** FTC, UK DMCC/ASA, EU UCPD, UAE/KSA rules, SOC 2, ISO 27001, Cyber Essentials and partner programmes.

---

## ⚠️ Decision that changes the brief: no fabricated logos, testimonials or project counts
The founder suggested placeholder ("fake") client logos and testimonials. The research is unambiguous, so the plan **does not include them**:

| Jurisdiction | Rule | Exposure |
|---|---|---|
| US | FTC Rule 16 CFR 465 (Oct 2024) bans fake testimonials. The Endorsement Guides treat a client logo as an implied endorsement. Lanham Act §43(a) applies. | Up to **$53,088 per violation**. The FTC sent warning letters in Dec 2025. |
| UK | DMCC Act 2024 (in force Apr 2025), B2B Misleading Marketing Regs 2008, CAP Code 3.45/3.50. The ASA ruled against "partner" logos used without a real relationship (U4jobs, Global Barcodes). | CMA fines up to **10% of global turnover**, plus the ASA naming the company publicly. |
| EU | UCPD Annex I 23b/23c and Directive 2006/114 (B2B) | Fines at the level of turnover. |
| UAE/KSA | UAE Consumer Law 15/2020, Trademark Decree-Law 36/2021, KSA Anti-Commercial Fraud Law | Fines and trademark claims. |

**The practical killer** is that enterprise procurement runs reference checks. One email to a "logo client" who has never heard of ZanamTech ends the deal and the reputation. It also hands a counter-party a misrepresentation claim in any MSA dispute.

**What the plan does instead** (section E):
- Build the logo, testimonial and case-study components now, data-driven and gated on `verified: true`. They render only when real, permissioned entries exist, so the site is ready to fill in as clients come.
- Launch with honest proof:
  - a real anonymised case study from the founder's current Azure engagement (with that client's permission)
  - founder certifications that can be verified
  - redacted sample deliverables
  - clearly labelled representative scenarios
  - fixed-scope entry offers that lower the buyer's risk

---

## A. Executive summary and brand positioning

**Positioning statement:** "ZanamTech is an enterprise Cloud, DevOps & AI engineering firm. We run, secure and modernise the cloud platforms growing businesses depend on, and automate the work that slows them down, under one accountable engagement lead."

- **Category:** Managed Cloud & DevOps partner plus an engineering studio for SaaS and practical AI. It is not a dev shop, staff-aug marketplace or design agency.
- **Flagship:** the **Managed Cloud & DevOps** retainer, which brings recurring revenue and is closest to the founder's proven work.
- **Growth engines:**
  - fixed-scope entry offers (assessments and pilots), which convert to projects and then to retainers
  - SaaS builds and AI automation, which land new logos fast
- **Target segments (ICPs), updated:**
  1. High-growth B2B SaaS, roughly 10–200 staff, with no in-house DevOps.
  2. Mid-market enterprises (logistics, healthcare, professional services, e-commerce) modernising on Azure or AWS.
  3. Data-sensitive organisations (finance, legal, health) that want private AI.
  4. **New: GCC enterprises and scale-ups** that need UAE/KSA-region hosting and data-residency awareness.
- **Kept from v1:**
  - the pillars Enterprise-grade, High-availability and Zero-trust security
  - the light/dark design system
  - the single CTA "Book a Strategy Consultation"
  - no public prices or competitor names on the site
  - metrics framed as target outcomes with the SOW footnote
- **Removed:**
  - every "8+ years" or years-of-experience claim (still in `docs/`)
  - "direct senior access" and "senior engineers deliver"
  - unqualified 24/7 promises
  - the Roadmap section and the Agentic AI roadmap entry
  - the "Nine disciplines" copy
- **Never sell:**
  - logo, branding or WordPress/Shopify work
  - $50-type gigs, hourly staff augmentation
  - 24/7 SOC/MDR, ERP implementations, mobile games, AR/VR or blockchain
  - SOC 2/ISO certification projects (readiness support only)
  - custom ML model training

## B. Service offerings and scope (4 pillars, 15 services)

### Pillar 1: Managed Cloud & DevOps (flagship retainer, 1 flagship page with modules)
**Managed Cloud & DevOps Operations** covers Azure and AWS. Modules on the page:
- **Cloud operations:** App Services, VMs/containers, load balancers/Front Door, managed databases, monitoring and alerting, patching, capacity and scaling.
- **Environment lifecycle:** Dev, QA, UAT and Prod parity, release scheduling, rollbacks.
- **CI/CD operations:** pipeline ownership, build health, secrets, approval gates.
- **Backup, DR & resilience:** daily/weekly backups, scheduled restore tests, documented RPO/RTO.
- **Repository & delivery governance:** Bitbucket/GitHub branch restrictions, access reviews, SOPs, change control, audit trail. This differentiator comes directly from the founder's current work.
- **Cost governance (FinOps-lite):** monthly spend review, rightsizing, budgets and alerts.
- **Reporting:** weekly status and a monthly service report covering health, cost, risk and changes.

**Retainer tiers** (scope and SLA only, no prices):

| Tier | Coverage | P1 response | P2 response | Includes |
|---|---|---|---|---|
| Essentials | Business hours (client time zone) | 4 business hours | Next business day | Monitoring, monthly patching, backup checks, monthly report, small improvement block |
| **Professional** (flagship) | Extended hours | 1 hour | 4 business hours | Everything in Essentials, plus environments, releases, CI/CD, governance/SOPs, quarterly restore test, monthly cost review, quarterly architecture review |
| Enterprise | Extended hours, plus P1 after-hours on-call by agreement | 30 minutes in the coverage window | 2 business hours | Everything in Professional, plus a named engineer pool, quarterly business review, and monitoring for AI automations |

**Rules for the tiers:**
- No uptime guarantee for infrastructure ZanamTech doesn't own. The site points to the cloud provider's SLA, and response and restore objectives are defined in the SOW.
- "24/7" appears only once there are at least 2 engineers on rotation.

### Pillar 2: Cloud & DevOps engineering (fixed-scope projects; existing slugs reused)
1. **Cloud Migration & Modernisation** (`cloud-migration-containerization`, renamed)
2. **Infrastructure as Code & Landing Zones** (new): Terraform/Bicep, network, identity, policy
3. **CI/CD & DevOps Transformation** (`cicd-pipeline-workflow-automation`, renamed): greenfield pipelines and environment strategy
4. **Security Hardening & WAF** (`enterprise-security-waf-hardening`)
5. **High Availability & Disaster Recovery** (`high-availability-disaster-recovery`)
6. **Observability & Monitoring** (`observability-monitoring`)
7. **Cloud Cost Optimisation** (`cloud-cost-optimization`)

### Pillar 3: Web & SaaS engineering
8. **SaaS Product Engineering** (replaces `full-stack-web-app-development`): multi-tenant products from MVP to scale, covering auth, billing, admin and cloud-native delivery.
9. **Enterprise Portals & Internal Tools** (new): customer/partner portals, operations dashboards, workflow apps built on company data.
10. **Application Modernisation & Integration** (new): refactoring legacy apps, APIs, moving to managed PaaS, third-party and ERP/CRM integrations.

### Pillar 4: Practical AI & automation
11. **AI Workflow & Task Automation** (new): one recurring manual process automated end to end, with human approval points and audit logs. Agents are introduced only within bounded permissions.
12. **Intelligent Document Processing** (new): invoices, contracts, forms, with extraction, classification and routing, and human review when the model is unsure.
13. **Automated Reporting & Insights** (new): scheduled reports from databases/CRM/ERP, with AI-written narrative.
14. **Private AI Assistants on Company Data** (replaces `enterprise-ai-integration`): RAG assistants with citations, permissions and evaluation, for staff or customer support.

The Agentic AI/LLMOps roadmap page is deleted. Agent capability is folded into service 11, so nothing is labelled "In Development".

### Entry offers ("Start here", fixed scope and fixed fee, no public prices)
| Offer | Duration | Output | Leads to |
|---|---|---|---|
| Cloud & DevOps Health Check (Well-Architected-style) | 2–3 weeks | Scorecard, findings, prioritised backlog with cost and risk, capped remediation sprint | Projects / retainer |
| Cloud Cost Review | 1–2 weeks | Spend analysis, quick wins implemented, 90-day savings roadmap | FinOps in the retainer |
| DevOps Governance Quick-Start | 2 weeks | Branch policies, pipeline gates, SOPs, access review | Retainer |
| AI Opportunity Sprint | 1–2 weeks | Processes ranked by hours saved × volume, pilot spec; fee credited toward the pilot | AI pilot |
| AI Automation Pilot | about 4 weeks | One workflow on real data, run in parallel with the current process, outcome report, go/no-go | AI build / managed AI |

### Engagement models
1. **Assessment** (fixed fee)
2. **Fixed-scope project** under a SOW with milestones and acceptance criteria
3. **Managed retainer** (tiers above), with a 3-month minimum then rolling. Exit terms: documented handover, no lock-in, one month's notice.
4. **Extended engineering capacity:** a vetted engineer pool under ZanamTech governance. Offered only once that pool exists.

## C. Communication and delivery model (PM-led)
**Structure:**
- A named **Lead Architect & Engagement Manager** (the founder) is the client's single accountable point of contact. They own scope, architecture, delivery and reporting.
- Delivery uses AI-assisted engineering, plus a **vetted bench of senior cloud and software engineers** added as scope grows. They work under ZanamTech's SOPs, access controls and code review. This is worded as a capability, not a headcount claim.

**Cadence:**
- kickoff and RACI
- weekly status
- monthly service report (retainers)
- quarterly architecture or business review
- documented runbooks and handover

**Access model:** least privilege, read-only first, MFA, client-owned accounts and repositories, NDA before discovery, and DPA on request.

**Approved wording:**
- "Every engagement is architected and governed by a named Lead Architect, your single accountable point of contact."
- "As scope grows, delivery scales with vetted senior engineers working under our standards, SOPs and access controls."
- "Named people, documented runbooks, weekly status, monthly service reports, and full handover with no lock-in."

**Banned wording** (also added to the content lint):
- "direct access to senior engineers", "our senior engineering team", "on-call engineers 24/7"
- "I", "gig", "hourly", "packages from"
- any headcount figure

**Copy to rewrite** (from the audit):
- `Hero.astro:33-35`
- `Pillars.astro:9`
- `about.astro:40-41, 152-153`
- `engagement.ts:14, 28, 57`
- `contact.astro:10, 19`
- `ContactForm.astro:283`
- `managed-infrastructure-24-7.md:6, 9, 17, 20, 24-25`
- `privacy.astro:163, 168, 208, 223`: "data privacy team" becomes "privacy contact"

## D. Website architecture and page-by-page blueprint

**Navigation:** Services (mega-menu with 4 pillar columns plus a "Start here" offers link) · Managed Services · Case Studies · How We Work · About. The single CTA stays.

| Route | Status | Content blueprint |
|---|---|---|
| `/` | Rework | Sections in order: Hero (new headline and subhead, PM-led line, pillars, CTA, blueprint stepper) → tech marquee (labelled "Technologies we work with") → **Flagship spotlight** (Managed Cloud & DevOps modules and tiers teaser) → **4 service pillars** → **Start here offers** → **Case studies & scenarios** → target-outcome metrics → How we work (process plus delivery model) → Industries → **Trust & security band** → **FAQ** → CTA band. Logo and testimonial sections render only when verified data exists. |
| `/services` | Rework | Overview grouped by the 4 pillars, flagship card first, then offers. The Roadmap section is deleted. |
| `/services/managed-cloud-devops` | New flagship layout | Modules, tier table, P1–P4 severity matrix, reporting cadence, onboarding (4 weeks), exit terms, FAQ |
| `/services/[slug]` | Template extended | Adds "What you get" deliverables, engagement types, an optional FAQ and related offers. Scenarios are kept and labelled. |
| `/start-here` (or `/offers`) | New | The 5 entry offers with duration, inputs, deliverables and next step |
| `/case-studies` and `/case-studies/[slug]` | New | Laid out as challenge → approach → architecture → result → stack → timeline. Launches with 1 real anonymised case (the current Azure engagement, with permission) plus clearly labelled representative scenarios. |
| `/approach` → "How We Work" | Rework | Phases, engagement models, delivery model and cadence, access model |
| `/industries` | Update | Segments are re-mapped to new slugs. A GCC segment is added (data residency in UAE/KSA cloud regions). |
| `/about` | Rework | Mission, "Pragmatic Enterprise First" (with "Direct senior access" replaced by "One accountable lead"), a **Leadership** section (founder photo, bio framed as prior experience, Credly-verified certifications, LinkedIn), how ZanamTech scales |
| `/trust` | New | Security practices, access model, NDA/MSA/DPA available, sub-processor list, data-residency options, security.txt. Compliance roadmap wording only ("Cyber Essentials: in progress"), never a claim not yet held. |
| `/contact` | Update | Service options regenerated from the 15 services plus "Other / Not sure yet". Optional **Region** field (US/CA, UK/EU, GCC, Other). Budget bands kept. Next-step copy rewritten for the PM-led model. |
| `/privacy` | Update | Adds GDPR/UK GDPR processor language and UAE/KSA PDPL references. Removes "privacy team". |
| `/insights` | Phase 2 (deferred) | A blog collection for SEO and credibility |
| `/.well-known/security.txt` | New | RFC 9116 |
| Redirects (nginx) | New | `managed-infrastructure-24-7` → `managed-cloud-devops`, `full-stack-web-app-development` → `saas-product-engineering`, `enterprise-ai-integration` → `private-ai-assistants`, `agentic-ai-llmops` → `/services#ai` |

**Home hero (draft):**
- **H1:** "Managed Cloud, DevOps & AI Engineering for Businesses That Can't Afford Downtime."
- **Sub:** "We run, secure and modernise your Azure and AWS platforms, build cloud-native SaaS, and automate manual work with practical AI. Everything is delivered under one accountable engagement lead."

The tests' `HEADLINE` constant gets updated to match.

## E. Trust markers and social-proof strategy

**Show at launch (all honest):**
1. Tech marquee, labelled "Technologies we work with", never "Partners" or "Clients".
2. **One real anonymised case study:** "Managed Azure estate for a [sector] company". It covers environments, pipelines, backups, branch governance and SOPs, with before/after facts. Written client sign-off is required.
3. Representative scenarios, labelled as now.
4. Founder certifications as verified badges, if held.
5. **Proof by artefact:** a redacted Health Check report excerpt, an SOP/branch-policy template and a pipeline reference architecture.
6. Delivery commitments ZanamTech controls: "Written proposal within 2 business days", "Weekly status reports", "Monthly service report", "No lock-in handover".
7. A Trust page plus security.txt.
8. Target-outcome metrics with the SOW footnote (as now).

**Ready but hidden until real** (data files with `verified: true`, `permissionDate` and an evidence note):
- client logo marquee (`src/data/clients.ts`)
- testimonials (`src/data/testimonials.ts`)
- project counts (only real numbers)
- partner badges: "Microsoft Partner" or "AWS Partner" member wording only, never "Solutions Partner" or "Select" until earned

**How to fill them, business-side:**
- The first 2–3 clients get pilot terms in exchange for written case-study/logo permission and a Clutch review.
- Clutch profile.
- Join Microsoft AI Cloud Partner Program and AWS Partner Network (free).

**Compliance roadmap** (business actions; the site shows only achieved items):
- **0–3 months:**
  - Cyber Essentials (about £320, days to weeks)
  - PI and cyber insurance
  - NDA/MSA/SOW/DPA/SLA templates and sub-processor list
  - CAIQ-Lite
  - MFA and least privilege on the company's own tenant
- **3–6 months:**
  - 3+ Clutch reviews
  - 2–3 real case studies
  - AWS Select (3 launches, ≥$1.5k MRR) if AWS clients exist
  - Vanta/Drata readiness
- **6–12 months:**
  - ISO 27001 (best fit for UK/EU/GCC) or SOC 2 Type 1 (US)
  - Microsoft Solutions Partner designation once Azure-attributed customers exist

## F. Step-by-step execution plan (after this plan is approved)

**Phase 0: governance (Spec Kit)**
1. Update the source docs:
   - `docs/02_Services_Catalog.md`: new 15-service catalogue, offers, tiers; remove "8+ years", "[cite: 2]" and senior-team wording
   - `docs/01_Brand_Positioning.md`: new positioning, ICPs, delivery model; remove "direct senior access"
2. `/sp.constitution` amendment to **v2.0.0** (MAJOR, because Principle III is redefined):
   - drop the "Roadmap labelled In Development" rule
   - allow **verified case studies, testimonials and client logos with documented permission**
   - add an explicit ban on fabricated social proof
   - replace the preferred term "senior engineering expertise" with PM-led terms
   - keep the bans on prices, competitor names and years claims
3. `/sp.specify` → `specs/002-enterprise-repositioning/spec.md` (updating FR-009, FR-013, FR-018), then `/sp.plan` and `/sp.tasks`.
4. 📋 ADR suggestion: "Verified-only social proof content model" and "Pillar-based service taxonomy".

**Phase 1: content model**
- `src/content.config.ts`:
  - `group` becomes `pillar` (`managed` | `cloud-devops` | `web-saas` | `ai`)
  - add `flagship`, `deliverables[]`, `engagementTypes[]`, optional `faq[]`
  - scenarios become 1–2
  - remove `status: roadmap`
- New collections and data:
  - `caseStudies` (with `verified`, `anonymised` and `permission` fields)
  - `src/data/offers.ts`, `managed-tiers.ts` (tiers and severity matrix), `clients.ts`, `testimonials.ts`, `faq.ts`
- `src/lib/services.ts`: pillar titles and order; replace `getRoadmapServices` with `getServicesByPillar`.

**Phase 2: content**
- Write and rename the 15 service files in `src/content/services/`. Delete `agentic-ai-llmops.md` and `RoadmapCard.astro`.
- Re-map `metrics.ts` and `segments.ts` slugs. Drop the "60% hardware" metric. Add the GCC segment.
- Apply the delivery-model rewrites (section C list). Update `site.ts` description, footer tagline and JSON-LD.

**Phase 3: components and pages**
- Reuse existing primitives: `GlassCard`, `Badge`, `Button`, `PageHero`, `CtaBand`, `.card-hover`, the reveal engine, `.tech-pill`/marquee utilities (for the client logo marquee).
- New components:
  - `FlagshipSpotlight`, `PillarGrid`, `OfferCard`/`EntryOffers`, `TierTable` + `SeverityMatrix`
  - `CaseStudyCard`, `TrustBand`
  - `Faq` (native `details/summary`, accessible)
  - `LogoMarquee` and `Testimonials`, which render nothing without verified entries
- `Header.astro`: 4-column mega-menu, no "Nine". Remove "Nine" from `ServicesGrid.astro` and `services/index.astro:20,25`.
- New pages: `/start-here`, `/case-studies` and `[slug]`, `/trust`, the managed flagship layout. Rework `/about`, `/approach` and Home.
- `ContactForm.astro` and `lead.ts`: regenerated service options and the optional region field. Update `specs/.../contracts/lead-submission.md`.
- `public/.well-known/security.txt`. Add the redirects to `nginx.conf`. Update the privacy notice.

**Phase 4: guardrails and tests**
- `scripts/lint-content.mjs`:
  - extend the competitor list (Folio3, Systems Limited, Arbisoft, Tkxel, Devsinc, Simform, ScienceSoft, Accenture)
  - add banned phrases ("direct access to senior", "senior engineering team", unqualified "24/7", "Solutions Partner", "SOC 2 compliant", "ISO 27001 certified")
  - add a check that every `clients.ts`/`testimonials.ts` entry has `verified` and `permissionDate`
- Tests:
  - Derive service counts and names from the collection instead of the hard-coded 9.
  - Replace the Roadmap suite with redirect tests.
  - Update the `HEADLINE`, PHASES, SEGMENTS and contact prefill slugs.
  - Add tests for `/start-here`, `/case-studies`, `/trust`, the FAQ keyboard behaviour, and logo/testimonial sections being absent when there's no verified data.
  - Add axe scans on the new routes in both themes.
- Affected specs: `services`, `home`, `metrics`, `approach-industries`, `contact`, `navigation`, `responsive-header`, `touch-menu`, `theme-a11y`, `security`.

**Phase 5: verification**
- `npm run check`, `npm run lint:content`, `npm run check:csp`, then the full `npm run test:e2e` (Playwright + axe, light and dark, desktop and mobile).
- Manual QA on a production build: every old slug redirects; the mega-menu has 4 pillars; no "senior engineers", "24/7" or "Nine" copy remains (grep); logo and testimonial sections stay hidden.
- Lighthouse on Linux CI (T061 is still open).
- PHR for each step; commit per phase on `dev`.

## Open decisions for the founder's review
1. **Certifications:** which do you hold (AZ-104/AZ-400/AWS/CKA/Terraform)? This decides the Leadership badges.
2. **Current client:** can we ask them for written permission for an anonymised case study, and later a testimonial?
3. **Price signalling:** keep zero prices (current constitution), or allow phrasing like "engagements typically start in the mid five figures"? Research shows ranges help conversion; this needs an amendment and a lint change.
4. **Coverage hours:** which time zone and hours for the SLA tiers (for example 9:00–18:00 GST plus UK overlap)?
5. **Legal entity:** registered name, country and address to show in the footer and on the Trust page (buyers check this).
6. **Insights blog:** launch it in this update, or defer to Phase 2?

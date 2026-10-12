---
id: 11
title: Implement phase 3 components and pages
stage: green
date: 2026-10-12
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: mubashirahmed324
command: /sp.implement (Phase 3)
labels: ["implement", "phase-3", "components", "pages", "navigation", "contact-form", "lighthouse"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: history/adr/003-verified-only-proof-content-model.md, history/adr/004-pillar-service-taxonomy-with-readiness-gating.md
  pr: null
files:
 - src/components/sections/ResultsBand.astro (renamed from Metrics.astro), PillarGrid, FlagshipSpotlight, OfferCard, EntryOffers, ArtefactCard, ArtefactBand, TrustBand, Faq, TierTable, SeverityMatrix, AgencyPartners, LogoMarquee, Testimonials, CaseStudyCard, LongFormDoc, ArticleBody (new); Pillars (props + slot); ServicesGrid (deleted); ServiceCard, ProofStrip, Process, Hero (copy/anchor)
 - src/components/layout/Header.astro, Footer.astro
 - src/components/ContactForm.astro, src/lib/lead.ts, src/scripts/alpine.ts
 - src/lib/services.ts, src/lib/content.ts, src/content.config.ts, src/data/site.ts, src/data/engagement.ts
 - src/pages/index.astro, about.astro, approach.astro, industries.astro, start-here.astro, trust.astro, terms.astro, services/index.astro, services/[slug].astro, insights/[...slug].astro, resources/[slug].astro, case-studies/[...slug].astro
 - public/.well-known/security.txt
 - lighthouserc.json
 - tests/e2e/services, navigation, responsive-header and approach-industries specs
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - "Full Playwright + axe: 156 passed, 34 skipped (device-specific), 0 failed"
 - "Lighthouse (local, production build, Playwright Chromium): 8 pages, Performance 96–99, Accessibility/Best Practices/SEO 100, LCP 1553–2260 ms, CLS ≤ 0.041"
 - "Contact dialog fit: 600 px, no scroll at 1920×1080, 1440×900, 1366×768 and 1280×720"
 - "Drafts: rendered with Draft badges in astro dev; absent from the production build"
---

## Prompt

Answers:
1. All 13 services: publish. In the AI services, list managed AI services per cloud instead of Azure only: Azure OpenAI / Amazon Bedrock / Google Vertex AI, and Azure AI Document Intelligence / Amazon Textract / Google Document AI. Keep Microsoft Entra ID and Azure API Management. Remove Power Automate.
2. Reverse FR-006a: Google Cloud is supported. Azure and AWS stay the primary platforms; GCP appears in the tech marquee and in relevant service stacks as also supported. Update the spec, constitution note and lint accordingly.
3. Scenarios: keep the flagship and AI assistant rewording. Restore "hourly encrypted backups" (a backup frequency, not a response time; add a lint exception for this technical use) and "no loss of committed transactions" (a past result that happened, not a guarantee).
4. Marquee: keep Ollama and OpenClaw (I have hands-on experience with both). Remove Hermes.
5. Industries 4-column layout is fine. Privacy wording: lawyer review before launch.
Start /sp.implement Phase 3 only and stop for my review.

## Response snapshot

- **Review fixes (commit c6efbd3):**
  - GCP supported again: FR-006a revised, constitution 2.0.2 platform note, research and tasks updated, GCP added to the marquee and to the migration, IaC, cost and AI stacks.
  - AI stacks now list the managed AI service on each cloud; Power Automate removed.
  - HA scenarios restored ("hourly encrypted backups", "no loss of committed transactions"); the lint plan allow-lists the technical "hourly".
  - Hermes removed from the marquee.
- **Phase 3 (T059–T095):**
  - Metrics renamed to ResultsBand; the hero scroll cue now targets the results band. The legacy group/status fields and helpers are removed, and every consumer uses the pillar API.
  - **Home order:** Hero → Results → (LogoMarquee, hidden) → marquee "Technologies we work with" → FlagshipSpotlight → PillarGrid → EntryOffers → ArtefactBand (dev only while drafts) → Process → Industries → TrustBand (reuses the three pillar cards) → (Testimonials, hidden) → FAQ → CTA.
  - **Service template:** pillar eyebrow, "What you get", engagement-type badges, related offer card, service FAQ. The flagship branch adds the tier table, severity matrix, cadence, onboarding and exit terms.
  - **/services:** grouped by pillar with anchors (#ai and so on), plus an entry-offers section.
  - **Header:** 4-pillar mega-menu (78rem panel, approved exception D1) with a "Start here" link. Nav: Services · Managed Services · How We Work · About; Insights and Case Studies appear only when content exists. At lg the link padding is tightened (px-2.5, back to px-3.5 at xl) and the CTA is nowrap, which fixes a two-line CTA at 1024 px.
  - **Footer:** services by pillar, email, LinkedIn (hidden while empty), Privacy · Terms · Trust.
  - **New pages:**
    - /start-here, /trust and /terms (Trust and Terms use the same long-form layout as Privacy)
    - /insights and /resources (built only for visible entries)
    - /case-studies (built only for verified entries; none at launch)
  - **Other pages:** /approach becomes How We Work (5 engagement models, cadence, access, AI policy, agency section); /about gets a Leadership section.
  - **Contact form:** Region, Company size and Cloud platform dropdowns, plus an "Agency partnership" option prefillable via ?service=agency-partnership; lead payload v2.
  - security.txt added.
- **Fixes during QA:**
  - "Most chosen" badge → "Recommended" (avoids an unverifiable proof claim).
  - The /start-here heading order is fixed (offer cards use h2 when no intro).
  - Case-study queries skip the empty collection (removes a warning per page).
- **Lighthouse:** run locally against the production build. The lhci chrome-launcher hits EPERM on Windows, so the Lighthouse CLI was run against the preview server with Playwright's Chromium instead.

## Outcome

- ✅ Impact: every v3 page and section exists, built from the existing primitives; proof and drafts stay hidden; the budgets are met.
- 🧪 Tests: see the list above.
- 📁 Files: see the list above.
- 🔁 Next prompts: owner review (Trust-page practices to confirm, mega-menu, header spacing at lg); then /sp.implement Phase 4 (lint guardrails and new tests).
- 🧠 Reflection: the slow first E2E run (12 min, many timeouts) came from machine load, not the site. Pages loaded in under 200 ms when probed directly, and the rerun took 1.4 min.

## Evaluation notes (flywheel)

- Failure modes observed: a two-line CTA at 1024 px caught by the existing header test; an axe heading-order issue caught by Lighthouse; lhci EPERM on Windows.
- Graders run and results (PASS/FAIL): check PASS; lint PASS; CSP PASS; E2E PASS; Lighthouse PASS (all 8 pages)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): make `npm run lhci` work on Windows (set CHROME_PATH, and handle the chrome-launcher cleanup EPERM) or move it to Linux CI.

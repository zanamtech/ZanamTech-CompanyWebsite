---
id: 31
title: Single CTA and enterprise lead form
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["cta", "contact-form", "lead", "validation", "alpine"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/data/site.ts
 - src/components/sections/Hero.astro
 - src/components/sections/CtaBand.astro
 - src/components/ui/Button.astro
 - src/components/ContactModal.astro
 - src/components/ContactForm.astro
 - src/lib/lead.ts
 - src/scripts/alpine.ts
 - src/pages/privacy.astro
 - specs/001-enterprise-website-baseline/contracts/lead-submission.md
 - tests/e2e/home.spec.ts
 - tests/e2e/contact.spec.ts
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - E2E suite intentionally skipped per request (home/contact specs updated for the new fields, not executed)
---

## Prompt

Streamline the primary Call-To-Action (CTA) site-wide by removing duplicate buttons and upgrading the consultation modal form fields:

1. Remove Secondary CTA Button Site-Wide:
   - Search the entire repository for secondary CTA buttons ("Request a Custom Proposal") in components such as `Hero.astro`, `Header.astro`, `CTA.astro`, `ProofStrip.astro`, and all page layouts.
   - Completely remove the "Request a Custom Proposal" button elements so only ONE primary CTA button remains in each section.
   - Standardize the single remaining primary button text to: "Book a Strategy Consultation" (with primary purple gradient styling and hover shimmer).

2. Upgrade Consultation Modal / Contact Form Fields:
   - Update the contact modal form component (`src/components/ui/ConsultationModal.astro` or `ContactForm.astro`) to include industry-standard B2B enterprise fields:
     1. Full Name (Input text, required)
     2. Work Email Address (Input email, required)
     3. Company Name (Input text, required)
     4. Phone Number (Input tel, optional with country code hint)
     5. Service Needed (Select dropdown, required: "Cloud Migration & Containerization", "Enterprise Security & WAF", "High Availability & Disaster Recovery", "CI/CD Pipeline & Workflow Automation", "Active System Observability", "Cloud Infrastructure Cost Optimization", "Custom Full-Stack Web App", "Intelligent Enterprise AI Integration", "24/7 Managed Infrastructure")
     6. Estimated Budget Range (Select dropdown, optional: "Under $10k", "$10k - $25k", "$25k - $50k", "$50k+")
     7. Project Overview & Requirements (Textarea, required)
     8. Privacy Consent (Checkbox: "I agree to ZanamTech processing my details to schedule the consultation.")
   - Ensure clean grid layout (2-column layout on desktop for Name/Email, Company/Phone, Service/Budget, and full-width for Message).

3. Form Submit Action & Validation:
   - Apply clean client-side validation using Alpine.js / HTML5.
   - Maintain the modal backdrop blur and smooth exit/entry transitions.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Clarification

Budget field: the user chose "Ranges without dollar amounts". Currency values would breach Constitution III (no public pricing) and fail the content lint.

## Response snapshot

- **Single CTA:** the secondary buttons were removed from the Hero and CtaBand, which were the only instances. `cta.secondary` and the dialog's proposal `intent` (store field, URL parsing and dynamic title) were removed; the dialog title is now always "Book a Strategy Consultation". The primary Button now uses a purple gradient (`from-cta to-brand-purple`) with a soft shadow, and the existing shimmer is kept. White text contrast is at least 5.8:1.
- **Form:**
  - Name/Email, Company/Phone, Service/Budget in 2-column rows, then a full-width message and consent.
  - Phone is optional `type=tel`, with a country-code hint and validation (`+` and digits, 7–20 characters).
  - Service is required and lists the 9 active services by their canonical catalog names, which also drive pre-selection. "Not sure yet" was removed.
  - Budget is optional, with scope-based bands: Focused engagement, Mid-size project, Large-scale program, Not sure yet.
  - The message is labelled "Project overview & requirements"; the consent text is as specified, with the Privacy Notice link.
- **Validation:** Alpine + `validateLead` (phone format, required service, allowed budget values), plus HTML5 `required`, `type` and `maxlength`. The honeypot, error focus and live announcements are preserved. The payload is now phone/service/budget instead of role, and the contract doc was updated.
- **Unchanged:** the modal's backdrop blur and transitions. The privacy notice field list was updated.
- **Tests:** the home spec now asserts a single CTA. The contact spec fills the new fields and checks the required-service error. These were not run, by request.

## Outcome

- ✅ Impact: one clear CTA per section, and a B2B-grade qualification form.
- 🧪 Tests: astro check 0 errors; content lint pass; E2E skipped by request.
- 📁 Files: see the list above.
- 🔁 Next prompts: run contact/home e2e; commit.
- 🧠 Reflection: the budget question was rephrased as engagement size to keep the no-pricing promise.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS; lint:content PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run contact.spec and home.spec to confirm the updated selectors.

---
id: 28
title: Privacy notice enterprise rewrite
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["privacy", "content", "legal", "typography"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/privacy.astro
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - E2E suite intentionally skipped per request
---

## Prompt

Rewrite and expand the Privacy Notice content in `src/pages/privacy.astro` (or the Privacy Notice section component) into a comprehensive, enterprise-ready document:

1. Header & Removal Request:
   - Remove the "Last updated 29 September 2026." text completely.
   - Keep a clean, standard page hero: Title "Privacy Notice", Subtitle "How ZanamTech collects, processes, and safeguards information submitted through this platform."

2. Comprehensive Content Restructuring (Enterprise Sections):
   - Section 1: Overview & Scope
     - State clearly that ZanamTech is committed to data privacy, transparency, and zero data exploitation.
   - Section 2: Information We Collect
     - Voluntarily Provided Data: Name, work email, company name, role, service interest, and message content submitted via consultation or custom proposal forms.
     - Technical & Telemetry Data: Non-identifying, aggregated usage statistics (cookieless analytics) such as browser type, page views, and referrer headers.
     - Explicit Exclusion: Note that ZanamTech explicitly prohibits submitting sensitive personal data, payment card data, or confidential infrastructure credentials via public web forms.
   - Section 3: Legal Basis for Processing
     - Specify processing under legitimate business interests (responding to corporate inquiries) and explicit consent given upon form submission.
   - Section 4: How We Use Information
     - Sole purpose: Evaluating inquiries, scheduling consultations, drafting Statement of Work (SOW) proposals, and platform defense against abuse.
     - Explicit Guarantee: Zero selling, renting, or monetization of personal data, and zero automated profiling or third-party marketing list additions.
   - Section 5: Data Processors & Infrastructure
     - Detail encrypted transit (TLS 1.3), secure third-party form delivery providers acting strictly under instructions, and automated spam/malware filtering.
   - Section 6: Local Storage & Cookies
     - Clarify zero tracking cookies. State that local browser storage (`localStorage`) is exclusively used for storing client-side UI state (light/dark theme preference).
   - Section 7: Retention & Security Controls
     - Data retained strictly for the duration necessary to fulfill consultation inquiries and active client onboarding, followed by permanent deletion.
   - Section 8: Your Data Rights
     - Rights to request access, correction, data portability, or complete deletion ("Right to be Forgotten") by reaching out to our data privacy team.
   - Section 9: Contact & Data Inquiries
     - Provide dedicated contact email: `contact@zanamtech.com` with clean visual layout and prompt response guarantee.

3. Typography & UI Alignment:
   - Structure content using elegant typography (`prose prose-slate dark:prose-invert max-w-4xl`), clear subheadings (`h2`, `h3`), subtle bulleted lists, and translucent glass cards for key callouts/contact boxes.
   - Ensure seamless alignment with the site's standard page top spacing and glassmorphism design tokens.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this content update. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Hero:** "Privacy Notice", with the requested subtitle as the lead and meta description. The "Last updated" date is removed.
- **Document:** a `max-w-4xl` layout with:
  - an "On this page" glass contents card (9 numbered anchors, with section `scroll-mt` that clears the fixed header);
  - numbered h2 sections and h3 subsections, with accent-coloured bullet markers;
  - glass callouts for "Explicitly excluded" (danger tone) and "Our commitment" (accent);
  - a contact glass card with the hairline gradient and a mailto button.
- **Content:** all nine sections as specified. Facts were checked against the code: `localStorage` holds only the theme key, no cookies are set, CSP and HTTPS are enforced by the security headers, and the form goes to a third-party delivery provider.
- **Wording adjustments:**
  - TLS is described as "TLS 1.3 where supported by your browser"; TLS termination happens at the hosting edge, outside this repo.
  - Filtering is described as "spam and abuse"; the forms accept no files, so "malware" doesn't apply.
  - The response commitment is worded without "guarantee" (Constitution III): "promptly, and always within the timeframe required by applicable law".
- **Styling:** Tailwind Typography isn't installed, so the same prose look is achieved with scoped arbitrary variants using the site's tokens. No new dependency was added.

## Outcome

- ✅ Impact: a comprehensive, scannable, enterprise-style privacy notice.
- 🧪 Tests: astro check 0 errors; content lint pass; E2E skipped by request.
- 📁 Files: src/pages/privacy.astro
- 🔁 Next prompts: legal review; confirm the edge TLS policy and the contact mailbox; commit.
- 🧠 Reflection: a legal page must not promise more than the infrastructure actually enforces.

## Evaluation notes (flywheel)

- Failure modes observed: Tailwind v4 important-modifier syntax (`x!`) needed a fix-up pass.
- Graders run and results (PASS/FAIL): astro check PASS; lint:content PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

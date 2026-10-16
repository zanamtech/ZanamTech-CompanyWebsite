---
id: 46
title: Content review round, American English
stage: general
date: 2026-10-16
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: content review round from docs/review/SITE_COPY.md
labels: ["content","copy","american-english","privacy","accuracy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - src/content/services/*.md, src/content/insights/*.md, src/content/resources/branch-governance-sop-template.md
 - src/data/{commitments,engagement,faq,managed-tiers,offers,pillars,platforms,results,segments,site}.ts
 - src/pages/{about,privacy,terms,trust,industries}.astro, src/pages/services/[slug].astro, src/pages/services/index.astro, src/pages/insights/[...slug].astro, src/pages/resources/[...slug].astro
 - src/layouts/BaseLayout.astro, src/lib/schema.ts, plus comment-only spelling changes in components, lib, scripts and styles
 - tests/e2e/{catalog,contact,navigation,review-fixes,review3,home,home-v3,services,services-v3,seo}.ts
 - docs/review/SITE_COPY.md (re-exported), docs/PROGRESS.md
tests:
 - npm run check (0 errors), lint, lint:content, format:check, build, check:csp (pass)
 - seo + updated specs: 225 passed after one date-format assertion fix
 - scan of built HTML: no British spellings left (only the unchanged slug in URLs)
---

## Prompt

Content review round (from docs/review/SITE_COPY.md). Read docs/PROGRESS.md first. Work on dev. Copy and data changes only, no layout/design changes.

=== 1. AMERICAN ENGLISH SITEWIDE ===
- Convert all visible copy, meta titles/descriptions, JSON-LD text, alt text, form text and articles from British to American spelling (optimise→optimize, modernise→modernize, organisation→organization, artefact→artifact, programme→program, catalogue→catalog, licence→license, utilisation→utilization, prioritised→prioritized, anonymised→anonymized, behaviour→behavior, colour→color, centre→center, etc.).
- This includes service and section names, e.g. "Cloud Cost Optimization", "Cloud Migration & Modernization", "Application Modernization & Integration".
- Keep ALL URLs/slugs unchanged (no redirects needed).
- Do not change quoted titles of external sources or official product names.
- Set <html lang="en-US"> and og:locale en_US.
- Dates in American format: "October 15, 2026" (articles, cards, "Last updated").
- If lint:content or any test enforces British spelling, update the rule.

=== 2. ACCURACY FIXES ===
a) "Included in every retainer" (/services Managed card and Home Managed pillar card): replace "Cost and security reviews" with "Security patching" (Essentials has no cost review).
b) Privacy Notice:
   - "Information we collect" must list every form field: full name, email, company name, phone (optional), service needed, estimated engagement size (optional), region (optional), company size (optional), cloud platform (optional), message, consent.
   - Replace "consultation and custom proposal forms" / "consultation or custom proposal request" with the single "consultation form".
   - Replace "this platform" with "this website" (intro + meta description).
   - Retention: "Inquiries that do not lead to an engagement are deleted within 12 months of receipt."
   - Update "Last updated" to today.
c) About "Privacy by design" card: "AI and data workflows run inside your own cloud tenant, on managed AI services under business terms that exclude training on your data."
d) UAE/Saudi regions (Home FAQ, /trust Data residency, /industries GCC "How we help", anywhere else): "including UAE and Saudi Arabia regions where your chosen provider offers them".
e) CI/CD page FAQ "Which clouds and tools do you support?": "AWS, Azure and Google Cloud equally, with GitHub Actions, Azure DevOps, Bitbucket Pipelines, AWS CodePipeline, Google Cloud Build or Jenkins." (remove GitLab).
f) /resources/branch-governance-sop-template, Review and merge: "approvals reset on new commits (Bitbucket Premium)".
g) Home "What we commit to": "Written proposal within 2 business days of the consultation" (match /contact).
h) /start-here AI Opportunity Sprint "Next step": "The AI Automation Pilot." (remove "The sprint fee is credited towards it."). Remove the same promise anywhere else it appears.

=== 3. CONSISTENCY ===
- "MS SQL" → "SQL Server" everywhere (Home marquee, HA/DR stack).
- "Flexential Cloud" → "Flexential" (Home marquee). Add "Liquid Web" to the Home technologies marquee next to Flexential.
- "High-availability" → "High availability" (hero chip, trust card); keep hyphen only where it is an adjective before a noun.
- AI Automation Pilot description (everywhere it appears): "One automation or assistant built on real data, run alongside the current process before any larger commitment."

=== 4. WORDING ===
a) Retainer tier coverage lines (Home flagship + Managed page):
   - Essentials: "Business-hours coverage"
   - Professional: "Extended-hours coverage"
   - Enterprise: "Extended hours with after-hours escalation"
   No times or response targets.
b) About "Our mission": replace both paragraphs with:
   "We help growing businesses run cloud platforms that stay up, stay secure and cost what they should, and we automate the manual work that slows their teams down, with AI that keeps their data inside their own cloud."
c) Technology stack chips, replace vague names:
   - Full-Stack + Portals: "Modern Full-Stack Frameworks (React/Next.js, Node.js, Astro, Python)".
   - Cost page: "Architecture Auditing Tools" → "AWS Compute Optimizer", "Azure Advisor", "Google Cloud Recommender".
   - Security page: remove "Security Audit Tooling".
   - HA/DR: "Linux Shell Automation" → "Bash".
   - Portals: "SQL Databases" → "PostgreSQL", "SQL Server".
   - Modernization page: "Message Queues" → "Amazon SQS", "Azure Service Bus", "Google Cloud Pub/Sub".
d) Results footnote on service pages: show it only once per page (after "Engagements in practice") and only on pages that show figures. On "Engagements in practice", show the sentence "Entries marked 'Example engagement' are illustrative and carry no figures." only when the page has example entries.

=== CHECKS (minimal) ===
- Run only: npm run check, lint:content, build, seo.spec.ts, plus any existing spec that fails because it asserts old text (update those assertions; no new tests).
- Re-export docs/review/SITE_COPY.md from the new build.
- Commit on dev, push, update PROGRESS.md + PHR.
- Reply with a short list of what changed and any place you were unsure about.

## Response snapshot

- American English across content, data, pages, meta and JSON-LD by a scripted word mapping that skips slugs, URLs and identifiers, plus two hyphenated words fixed by hand; lang/og:locale/inLanguage en-US; US dates via a universal-time-safe helper. Built HTML scanned clean.
- Accuracy, consistency and wording edits applied as listed; footnote rule rewritten (once, only with figures; example sentence only with examples).
- Old-text assertions updated in 9 specs plus the test catalog; SITE_COPY.md re-exported.

## Outcome

- ✅ Impact: site copy now in American English with the owner's accuracy and wording fixes.
- 🧪 Tests: gates pass; seo + updated specs pass.
- 📁 Files: see list above.
- 🔁 Next prompts: owner re-review of docs/review/SITE_COPY.md; decide "Security patching" vs "Patching and backups" overlap and "on-premise" wording.
- 🧠 Reflection: scanning the built HTML catches what source-level replacement misses (hyphenated compounds).

## Evaluation notes (flywheel)

- Failure modes observed: hyphen-joined words skipped by the slug guard; a UTC literal in code tripped the time-zone lint; one date regex assertion missed on the first pass.
- Graders run and results (PASS/FAIL): built-HTML British scan PASS; lint:content PASS; specs PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): add a lint:content rule for common British spellings so they cannot creep back in.

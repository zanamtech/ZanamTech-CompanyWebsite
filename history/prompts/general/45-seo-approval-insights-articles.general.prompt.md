---
id: 45
title: SEO copy approval and Insights articles
stage: general
date: 2026-10-15
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: content round - SEO copy approval and Insights articles
labels: ["content","seo","insights","fact-check"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - docs/audit/SEO_COPY_CHANGES.md (owner-approved, 3 owner edits)
 - src/data/site.ts, src/content/services/cicd-pipeline-workflow-automation.md
 - src/content/insights/azure-environment-strategy.md, bitbucket-branch-governance.md, cloud-cost-checklist.md
 - src/content.config.ts (updated, relatedService)
 - src/pages/insights/[...slug].astro (related service, related articles, short breadcrumb, /insights description)
 - src/components/content/ArticleBody.astro (key-takeaways callout reuses the blockquote classes)
 - tests/e2e/drafts.spec.ts (Flexera link text)
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors), lint, format:check, lint:content, build, check:csp (pass)
 - seo, drafts, review-fixes, review3, publish, theme-a11y specs (pass after the Flexera assertion update)
 - all 41 article source URLs return 200
---

## Prompt

Content round: SEO copy approval + Insights articles. Read docs/PROGRESS.md first. Work on dev. No design changes except the small article-page additions listed below, which must reuse existing components and styles.

1. SEO COPY (docs/audit/SEO_COPY_CHANGES.md): approved, with 3 edits. Then mark the file "owner-approved".
   - Home (site.metaDescription): "ZanamTech runs, secures and modernises AWS, Azure and Google Cloud platforms and automates manual work with practical AI. Documented runbooks, no lock-in."
   - /services/cicd-pipeline-workflow-automation (seoDescription): "Automated build, test, security-scan and deploy pipelines on GitHub Actions, Azure DevOps, Bitbucket, AWS CodePipeline, Google Cloud Build or Jenkins."
   - /insights description: "Practical writing on cloud operations, DevOps governance, cost control and AI automation across AWS, Azure and Google Cloud, from the ZanamTech team."

2. ARTICLE DATES: publish all three now. Keep the isPublished() mechanism for future articles.
   - azure-environment-strategy: 12 Oct 2026
   - bitbucket-branch-governance: 14 Oct 2026
   - cloud-cost-checklist: 15 Oct 2026

   Remove the "rebuild on 26 Oct / 9 Nov" note from PROGRESS.md. The /insights grid should now show all three, newest first.

3. ARTICLE CONTENT. Review and improve all three articles:
   - Length: expand each to roughly 1,000–1,400 words with genuinely practical detail (steps, examples, common mistakes). No filler.
     - No invented statistics.
     - No client claims or case details.
     - No prices or response times.
     - British English.
     - "We" statements only about how ZanamTech works.
   - Add a "Key takeaways" box (3–4 bullets) right after the intro, using an existing callout/card style.
   - Multi-cloud: the Azure article gets a short closing section "On AWS or Google Cloud?" that maps the same ideas to their equivalents (e.g. AWS Organizations/accounts, Google Cloud projects/folders, their IaC and secrets services). Keep the title. In the other two, make sure AWS, Azure and Google Cloud are treated equally where relevant.
   - Internal links: 2–3 inline links per article to the most relevant service pages, plus a "Related service" card at the end (reuse the existing service card) above the generic CTA band.
   - "Related articles" at the bottom of each article, listing the other two (reuse the Insights card).
   - Breadcrumb: the last crumb shows the short seoTitle (or truncates with an ellipsis), not the full long title.
   - Fact check every claim. Verify the Flexera 2026 State of the Cloud figure ("29% of IaaS and PaaS spend is wasted") against the actual Flexera source: if the exact figure and wording can't be confirmed, rephrase it to match the source or remove the number. In the Bitbucket article, state clearly which controls need Bitbucket Cloud Premium (e.g. enforced merge checks) and which work on Standard. Every external fact has a source link in a "Sources" list.
   - Keep seoTitle ≤60 and seoDescription ≤155 for each article. dateModified = today in JSON-LD. Reading time recalculates automatically.

Tests (light): lint:content, seo.spec.ts, the Insights/article specs, npm run check, build. One commit per section (1, 2, 3), push, update PROGRESS.md + PHR. Reply with a word count per article and a list of every fact you changed or removed.

## Response snapshot

- Section 1 (b5bca31): three owner edits applied; SEO_COPY_CHANGES.md marked owner-approved.
- Section 2 (ee37797): dates 12, 14, 15 Oct; all three live, newest first; rebuild note removed.
- Section 3 (5e34f8f + docs commit): articles at 1,360 / 1,173 / 1,069 words with takeaways box, multi-cloud mapping, inline service links, Related service and Related articles, short breadcrumb, dateModified 15 Oct. Flexera figure reworded to the primary source; Bitbucket Standard vs Premium controls from Atlassian docs; reset-approvals and deployment permissions marked Premium; public IP billing stated per provider; unsourced generalisations softened.

## Outcome

- ✅ Impact: SEO copy approved and live; three substantial, sourced articles published.
- 🧪 Tests: gates and article specs pass; all source links return 200.
- 📁 Files: see list above.
- 🔁 Next prompts: optional new articles via the dated publishing mechanism; the 1200×630 share image.
- 🧠 Reflection: a secondary source (IT Brief) had dropped the IaaS/PaaS qualifier; Flexera's own blog was needed to confirm the wording.

## Evaluation notes (flywheel)

- Failure modes observed: a fenced code block produced Shiki inline styles that broke the CSP; content lint caught "zero-downtime" and "guarantee"; the first-draft cost article was under the word floor.
- Graders run and results (PASS/FAIL): lint:content PASS; check:csp PASS (after the code block fix); specs PASS; link check PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): add a content lint rule that rejects fenced code blocks in Insights, so the CSP issue is caught before build.

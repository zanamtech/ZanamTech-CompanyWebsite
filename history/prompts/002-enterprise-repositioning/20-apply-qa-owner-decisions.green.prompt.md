---
id: 20
title: Apply QA owner decisions
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: apply owner decisions from the QA report
labels: ["content", "naming", "azure", "samples", "footer"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/Process.astro
 - src/pages/approach.astro
 - src/data/platforms.ts
 - src/layouts/BaseLayout.astro
 - src/content/services/cloud-migration-containerization.md
 - src/content/services/enterprise-portals-internal-tools.md
 - src/content/services/full-stack-web-app-development.md
 - src/content/services/infrastructure-as-code-landing-zones.md
 - src/content/services/managed-cloud-devops.md
 - src/content/resources/azure-reference-architecture.md
 - src/content/resources/branch-governance-sop-template.md
 - src/content/resources/sample-monthly-service-report.md
 - src/data/site.ts
 - src/components/layout/Footer.astro
 - docs/PROGRESS.md
tests:
 - Affected Playwright specs (approach-industries, contact, drafts, header-footer-ui, navigation, offers-approach, proof-gating, responsive-header, security, theme-a11y, trust-legal, home-v3, services, reveal): 192 passed, 40 skipped, 0 failed
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
---

## Prompt

Decisions:
1. Use "How We Work" (title case) everywhere, including the home link.
2. Use "Azure" everywhere, including technology lists (not "Microsoft Azure").
3. Keep the Company row with even spacing, no dots.
4. Publish the 3 samples: set draft: false so the sample band and /resources go live.
5. Shorten the footer brand description to about 3–4 lines on desktop, e.g. "Cloud, DevOps & AI engineering for growing businesses. We run, secure and modernise cloud platforms on AWS, Azure and Google Cloud, with documented runbooks and no lock-in." Keep it within the content rules and lint.
Run only the affected tests plus lint:content and check:csp (no full cross-browser sweep), commit on dev and push. Keep the summary short.

## Response snapshot

- "How We Work" in the home Process link and the /approach eyebrow.
- "Microsoft Azure" changed to "Azure" in 5 service stacks, the platform marquee and the JSON-LD; "Amazon Web Services" changed to "AWS" in the JSON-LD and the migration copy, so the clouds are named consistently.
- The samples are published, and their DRAFT notes are replaced by a plain SAMPLE note.
- The footer description uses the suggested text. To get it to 4 lines on desktop, the xl brand column went from 17rem to 20rem and its gap from 64 to 48px. The service link wrapping is unchanged (9 two-line names before and after). The email is pinned to the column bottom so it stays level with the Company row.
- Affected tests, check, lint:content and check:csp are green.

## Outcome

- ✅ Impact: all five owner decisions applied; samples are live.
- 🧪 Tests: affected specs green; the footer row test caught the email/Company misalignment from the shorter copy (fixed).
- 📁 Files: 14 source/content files, PROGRESS.md.
- 🔁 Next prompts: real-phone spacing check; real-Safari WebKit items; launch items.
- 🧠 Reflection: shorter copy changes the brand-column height, so layout alignment that relied on it needed an explicit anchor.

## Evaluation notes (flywheel)

- Failure modes observed: `npx astro preview` started in the background survives `kill` of the npx PID on Windows; the server had to be stopped by its listening PID.
- Graders run and results (PASS/FAIL): affected Playwright PASS; check PASS; lint:content PASS; check:csp PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

---
id: 25
title: About at-a-glance and company LinkedIn
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: follow-up on the review round — About card, company LinkedIn
labels: ["about", "footer", "seo", "linkedin"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/about.astro
 - src/components/layout/Footer.astro
 - src/components/ui/LinkedInIcon.astro (new)
 - src/layouts/BaseLayout.astro
 - src/data/leadership.ts
 - tests/e2e/review-fixes.spec.ts
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - Playwright review-fixes, header-footer-ui, trust-legal, approach-industries, security, theme-a11y, navigation (desktop + mobile): 95 passed, 21 skipped, 0 failed
---

## Prompt

Small follow-up on the review round:
1. Engagement chips you added (Managed: Assessment + Agency partnership; Portals/Full-stack: Extended engineering capacity) are approved, keep them.
2. /about: remove the "What we stand for" card (it duplicates the Philosophy cards). Replace it with an "At a glance" card listing: Clouds: AWS, Azure, Google Cloud · Regions served: North America, UK & Europe, GCC · Engagement: Assessment, Fixed-scope project, Managed retainer. No years of experience, no response times.
3. Company LinkedIn: https://www.linkedin.com/company/zanamtech/
   - Add a LinkedIn icon link in the footer (next to the contact email), target="_blank", rel="noopener noreferrer", aria-label="ZanamTech on LinkedIn".
   - Add it to the Organization JSON-LD "sameAs" array.
   - Keep the founder's personal LinkedIn on the About card as it is.
   - Remove the company-LinkedIn TODO from PROGRESS.md.
   - If the CSP or the link checker flags the external URL, allow it for links only (no scripts or embeds).
Run only affected tests + npm run check + lint:content + check:csp. Commit on dev, push, update PROGRESS.md.

## Response snapshot

"What we stand for" replaced by an "At a glance" definition list (Clouds, Regions served, Engagement). Company LinkedIn set in leadership.ts, shown as an icon beside the footer email (new tab, noopener noreferrer, aria-label) and added to Organization sameAs. LinkedIn SVG extracted to a shared LinkedInIcon component, reused on the About card. CSP needed no change. PROGRESS 3f added, TODO removed.

## Outcome

- ✅ Impact: About no longer repeats the values; company LinkedIn live in footer and structured data.
- 🧪 Tests: gates pass; affected specs 95 passed, 0 failed.
- 📁 Files: see list.
- 🔁 Next prompts: images round.
- 🧠 Reflection: the content lint scans comments too; a comment naming the banned phrase tripped it.

## Evaluation notes (flywheel)

- Failure modes observed: lint flagged a code comment; reworded.
- Graders run and results (PASS/FAIL): check PASS, lint:content PASS, check:csp PASS, Playwright PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

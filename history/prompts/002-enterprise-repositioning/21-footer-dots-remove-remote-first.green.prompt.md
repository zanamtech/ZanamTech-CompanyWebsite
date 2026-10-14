---
id: 21
title: Footer dots and remove remote-first
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: quick footer fixes and remove "remote-first" site-wide
labels: ["footer", "content", "seo", "lint"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/layout/Footer.astro
 - src/data/site.ts
 - src/pages/about.astro
 - scripts/lint-content.mjs
 - tests/e2e/trust-legal.spec.ts
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run build (32 pages)
 - grep -riE "remote[- ]first" over src, public and dist: 0 matches
 - One footer geometry check at 1440 (email and Company row centres equal; dots centred to 0px; last link at services right edge)
---

## Prompt

Quick fixes, keep it fast: no Playwright suite, no cross-browser sweep, no screenshots.

1. Footer service lists: reduce the vertical gap between service links back to what it was before the last QA change (the earlier, tighter spacing). Same gap in every column and sub-column.
2. Footer Company row: put the small dot separators back between every link (About · How We Work · Start here · Industries · Insights · Contact). Keep the row spread to the right edge, with each dot centred in the gap between two links.
3. With the tighter service lists, move the divider, the Company row and the contact@zanamtech.com email up so they still sit on the same line just below the service lists, and the footer gets shorter. No large empty band.
4. Remove "Remote-first" everywhere on the website, not just the footer. The browser tab title currently reads "ZanamTech | Remote-first Cloud, DevOps & AI engineering"; it should be "ZanamTech | Cloud, DevOps & AI Engineering". Also check and fix: every page <title>, meta description, Open Graph/Twitter tags, JSON-LD, site.ts, About page and any other visible copy. Then add "remote-first" to the content lint's banned list so it can't come back. (Internal docs in docs/ can stay as they are.)
5. Fast scan: grep the source and the built dist/ for "remote-first" / "Remote-first" (case-insensitive) and confirm zero matches on the site.

Then run only npm run check, lint:content and npm run build, and one quick visual check of the footer at 1440 to confirm the Company row and email line up. Commit on dev, push, and give me a 5-line summary.

## Response snapshot

Service lists back to a 32px row pitch (space-y-1 + py-1, matching the old lg:min-h-8 rows) in every column. Company row dots restored as aria-hidden flex items, so justify-between centres each dot. Footer area shortens with the lists; Company row and email stay level. site.tagline is now "Cloud, DevOps & AI Engineering" (title, OG/Twitter, JSON-LD derive from site.ts); description and About copy no longer say remote-first. Lint bans /remote[-\s]first/i.

## Outcome

- ✅ Impact: footer tighter, dots back; "remote-first" gone from the built site and blocked by lint.
- 🧪 Tests: check, lint:content, build pass; grep zero matches.
- 📁 Files: 5 source/test files.
- 🔁 Next prompts: constitution still lists "remote-first" as a preferred term.
- 🧠 Reflection: making separators flex items is the simplest way to centre them under justify-between.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): check PASS, lint:content PASS, build PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

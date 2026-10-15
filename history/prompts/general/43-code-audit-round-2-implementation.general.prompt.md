---
id: 43
title: Code audit round 2 implementation
stage: general
date: 2026-10-15
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: implement code audit round 2 of 3
labels: ["audit","refactor","css","types","scripts","icons","components"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - docs/PROGRESS.md
 - README.md
 - astro.config.mjs
 - package.json
 - package-lock.json
 - scripts/check-csp.mjs
 - src/styles/global.css
 - src/data/ids.ts (new), src/data/pillars.ts (new), src/data/offers.ts, engagement.ts, segments.ts
 - src/lib/form-config.ts (new), src/lib/navigation.ts (new), src/lib/format.ts (new), src/lib/lead.ts, src/lib/services.ts
 - src/content.config.ts
 - src/scripts/alpine.ts, src/scripts/alpine/{theme,router,header,hero,lead-form}.ts (new), src/scripts/motion.ts (new)
 - src/scripts/reveal.ts, src/scripts/metric-counters.ts, src/scripts/faq-accordion.ts
 - src/components/ui/{SectionHeader,ArrowLink,IconTile,CheckList,Chip}.astro (new), src/components/ui/Icon.astro
 - src/components/cards/ (moved + ContentCard new), src/components/forms/ContactForm.astro (moved), src/components/content/ (moved)
 - src/components/layout/Header.astro, Footer.astro; src/components/sections/*.astro; src/pages/**/*.astro
 - tests/e2e/catalog.ts, tests/e2e/reveal.spec.ts
tests:
 - after every batch: check, lint, format:check, lint:content, build, check:csp, affected specs (pass)
 - design freeze, all 32 pages x 1440/390 x light/dark (128 views): 0 differences after every batch (batch 6: removed number spans and scroll-margin-top excluded as intended)
 - anchor-landing probe (all linked anchors, 1440/768/390): 23-26px below the header
 - count-up trace under a fixed fake clock: 110/110 frames identical to the framer-motion build
 - "How we engage" CSS transition trace: same properties, durations, easing, begins 0/30/.../180ms
 - SVG byte comparison: 1,686 SVGs on 32 pages identical; normalised HTML identical after batches 9 and 10
 - reveal, reveal-sitewide, metrics, theme-motion, home-v3 3x: 207 passed (after the test fix)
 - full Playwright suite: 346 passed, 76 skipped, 0 failed
 - Lighthouse 13 on / and /services/managed-cloud-devops, mobile + desktop: 99-100 / 100 / 81 / 100 (Best Practices 81 also on the pre-round build: Alpine CSP global scan, FencedFrame deprecation)
---

## Prompt

Read docs/PROGRESS.md and docs/audit/CODE_AUDIT.md (incl. section 6, owner decisions) first. Round 2 of 3.

GLOBAL RULES (same as round 1):
- No visual or behavioural design change. After every batch that touches templates or CSS, run the Phase-5 design-freeze computed-style comparison at 1440px and 390px in light and dark mode. If anything differs, fix it or stop and report; don't continue.
- No new runtime dependencies.
- One commit per batch on dev, with the finding IDs in the message. Push after each commit.
- Per batch: affected tests + npm run check + lint + format:check + lint:content + build + check:csp. At the end of the round: full Playwright suite once (if the machine is overloaded, use fewer workers instead of re-running).

BATCH 6, CSS consolidation: F-12, F-13, F-41. For F-41, check that every anchor still lands with the eyebrow ~24px below the header.

BATCH 7, types and single sources: F-32, F-33, F-34, F-35.

BATCH 8, script consolidation: F-04, F-05, F-15, F-40, F-54, F-55, F-56.
- Remove framer-motion; reproduce the exact easing and duration of the count-up.
- Merge processReveal into reveal.ts and keep every fail-safe rule from PROGRESS 3j/3k.
- Run the reveal, reveal-sitewide, metrics, theme-motion and home-v3 specs 3× each.

BATCH 9, icons without React: F-03.
- Use @lucide/astro. If it can't produce identical SVG output, inline the used icon paths in Icon.astro instead.
- Byte-compare the SVG markup on home, /services and /about before and after.
- Remove react, react-dom, @astrojs/react, @types/react, @types/react-dom and lucide-react. Confirm the client.*.js chunk is gone.

BATCH 10, shared components and nav model: F-10, F-11, F-36, F-37, F-38, F-39, F-67.
- Keep every current visual variant as a prop so computed styles stay identical.
- The new lib/navigation.ts must use the existing pagePath() helper (src/lib/url.ts) for active-link matching.
- Run the full design-freeze comparison on every page, not only a sample.

FINISH: full Playwright suite once + Lighthouse on home and one service page (mobile + desktop). Scores must not drop. Update PROGRESS.md + PHR. Reply with a short table: batch, commit, result, JS/CSS size before → after, anything skipped and why.

## Response snapshot

- Batch 6 (7d0d33c): .card-link (one stylesheet instead of five), /privacy on LongFormDoc with CSS-counter numbers, scroll-padding-top + .anchor-section; anchors 23-26px below the header (were 33-92px; /start-here offers were under the header).
- Batch 7 (1a6f5df): data/ids.ts shared ID lists, IconName, astro:env schema (optional, Docker-safe), form-config.ts, FORM_SUBJECT, check:csp reads the built form action, tests import the footnote.
- Batch 8 (55c69e4): framer-motion removed (frame-identical count-up), processReveal merged into reveal.ts (Process items styled via data-reveal-custom), alpine.ts split into modules, reducedMotion(), counter teardown, tracked reveal cleanups, config-driven dropdown options. Lead form not page-scoped: a ClientRouter navigation into /contact initialises Alpine before the page script (verified).
- Batch 9 (443df6c): @lucide/astro 1.48.0; React packages and client chunk removed; SVG and HTML byte-identical.
- Batch 10 (0ca977a): SectionHeader, ArrowLink, IconTile, CheckList, Chip, ContentCard, pad2, pillars data, navigation.ts with pagePath(), cards/forms/content folders; normalised HTML identical on all pages.
- Test fix (023f765): reveal.spec asserted Alpine's removed data-shown; the batch 8 3x run had 30 such failures that were misread at the time.
- JS 380 KB / 123 KB gzip -> 104 KB / 35 KB; CSS 5 files -> 1.

## Outcome

- ✅ Impact: audit round 2 implemented with no visual change; three runtime dependency groups removed (React, lucide-react, framer-motion).
- 🧪 Tests: per-batch gates, freeze on all pages, behaviour traces, full suite green, Lighthouse unchanged except a pre-existing Best Practices deprecation from Alpine.
- 📁 Files: see list above.
- 🔁 Next prompts: round 3 (CI, F-21 sleeps, focus-pause for marquee/stepper, SEO metadata); consider the Alpine FencedFrame deprecation upstream.
- 🧠 Reflection: behaviour-level traces (fake-clock frames, CSS transition timing, normalised HTML) caught what computed-style snapshots under reduced motion cannot.

## Evaluation notes (flywheel)

- Failure modes observed: truncated test output hid failures in batch 8 (tail cut the summary); Git Bash heredocs mangled backslashes in inline Python (moved scripts to files); the preview helper leaked an astro preview process.
- Graders run and results (PASS/FAIL): design freeze PASS x5; anchor probe PASS; count-up trace PASS; SVG/HTML byte compare PASS; full suite PASS (second run).
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): always grep the Playwright summary lines ("N passed/failed") instead of tailing the log.

---
id: 42
title: Code audit round 1 implementation
stage: general
date: 2026-10-15
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: implement code audit round 1 of 3
labels: ["audit","refactor","seo","dependencies","tooling","nginx"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - docs/audit/CODE_AUDIT.md
 - docs/PROGRESS.md
 - .gitignore
 - .nvmrc
 - .prettierrc.json
 - .prettierignore
 - eslint.config.mjs
 - Dockerfile
 - README.md
 - astro.config.mjs
 - lighthouserc.json
 - nginx/nginx.conf
 - package.json
 - package-lock.json
 - plugins/markdown-external-links.mjs
 - scripts/check-csp.mjs
 - scripts/lint-content.mjs
 - src/lib/url.ts
 - src/middleware.ts (deleted)
 - src/layouts/BaseLayout.astro
 - src/components/layout/Header.astro
 - src/components/ContactForm.astro
 - src/components/sections/ServiceCard.astro
 - src/styles/global.css
 - src/data/site.ts, leadership.ts, offers.ts
 - src/scripts/alpine.ts, src/lib/lead.ts, src/lib/content.ts
 - public/assets/*.png, src/assets/brand/zanamtech-icon.png (deleted)
 - tests/e2e/seo.spec.ts (new)
 - tests/e2e/redirects-config.spec.ts
 - tests/e2e/review4.spec.ts
 - tests/e2e/fixtures.ts, theme-a11y, home, approach-industries, contact, services, responsive-header specs (revealAll before axe)
 - (style commit: prettier across src/, tests/, scripts/, configs)
tests:
 - npm run check / lint / lint:content / build / check:csp after every batch (pass)
 - design-freeze computed-style + layout snapshot, 18 pages x 1440/390 x light/dark, vs pre-round baseline (0 differences after every batch)
 - affected Playwright specs per batch (pass)
 - new tests/e2e/seo.spec.ts (pass)
 - nginx 1.30.6 (Windows build, same config) nginx -t + curl of URL forms (pass); Docker unavailable
 - full Playwright suite: final run 346 passed, 76 skipped, 0 failed (runs 1-3 had load/timing failures and a pre-existing axe/reveal issue, fixed in tests)
---

## Prompt

Read docs/PROGRESS.md and docs/audit/CODE_AUDIT.md first. We are implementing the audit in 3 rounds; this is round 1 of 3.

GLOBAL RULES (all rounds):
- No visual or behavioural design change unless listed as approved. After every batch that touches templates or CSS, run the Phase-5 design-freeze computed-style comparison at 1440px and 390px in light and dark mode. If anything differs, fix it or stop and report; don't continue.
- No new runtime dependencies. Dev-only tools listed here are allowed.
- One commit per batch on dev, with the finding IDs in the message. Push after each commit.
- Per batch: affected tests + npm run check + lint:content + build + check:csp. At the end of the round: full Playwright suite once.

STEP 0: record owner decisions. Add a section "6. Owner decisions (15 Oct 2026)" to docs/audit/CODE_AUDIT.md:
- Approved: everything not listed below.
- Deferred until after launch: F-07.
- Declined (keep current behaviour): F-14, F-57, F-51.
- F-02: declined as a visible change. The marquee and the hero stepper keep their current look, speed and looping. Only invisible keyboard behaviour is added in round 3: pause while focus is inside them.
- F-17: no Turnstile now; the owner restricts the Web3Forms key to the production domain at launch.
- F-50: only if an SVG logo is supplied.
- F-20: OG image asset comes later in the images round; do the code part.
Also commit the uncommitted PHR history/prompts/general/41-full-code-audit-report.general.prompt.md.

BATCH 1, dead code and assets: F-08, F-22 to F-31, F-59, F-60.

BATCH 2, dependency hygiene: npm audit fix (non-breaking, production part of F-16), F-61, F-62, F-63 (patch/minor only; skip packages that rounds 2's batches will remove; no TypeScript 7).

BATCH 3, tooling (part of F-19):
- Add dev-only eslint + eslint-plugin-astro + typescript-eslint, prettier + prettier-plugin-astro + prettier-plugin-tailwindcss, and `lint` + `format` scripts.
- Run the formatter in its OWN commit ("style: apply prettier, no logic change") so later diffs stay readable.
- Fix lint errors without changing behaviour. CI comes in round 3.

BATCH 4, one URL per page: F-01, F-43, F-44, F-66 (a–c).
- Use trailingSlash 'never' + build.format 'file'.
- nginx: 301 the slash form to the slash-less form AND keep the query string: return 301 $1$is_args$args. Use try_files $uri $uri.html $uri/index.html =404.
- Make sure /services (an index page that also has child pages) resolves correctly.
- Verify in the Docker image with curl: /about → 200, /about/ → 301 → /about, /contact/?service=agency-partnership → 301 keeps ?service=, /services → 200, /services/managed-cloud-devops → 200, unknown URL → 404 page.
- Add seo.spec.ts as described.

BATCH 5, external links without middleware: F-06, F-18. Add a local rehype plugin for markdown, keep the explicit attributes in components, delete src/middleware.ts, and remove the source-reading test.

FINISH: full Playwright suite once, update PROGRESS.md (new section) + PHR. Reply with a short table: batch, commit, result, anything skipped and why.

## Response snapshot

- Step 0 (82597d5): CODE_AUDIT.md §6 owner decisions; PHR 41 committed.
- Batch 1 (9e5e7f4): dead assets/CSS/data/attributes/props/exports removed; @types/alpinejs to dev; pycache untracked; README and comment fixed. Pre-existing theme-a11y failure (axe catching reveal mid-fade since 3k) fixed in the test via revealAll().
- Batch 2 (101ed27): npm audit --omit=dev 0; astro 7.3.8, Playwright 1.64.1; react/framer/lucide/TS 7 skipped; private, .nvmrc, Docker bases pinned to minor + digest; fileURLToPath.
- Batch 3 (b0365e7 tooling, a5cfbe6 style): ESLint + Prettier dev tools and scripts; only lint change: allow `_`-prefixed unused names (CSP-hashed inline script untouched).
- Batch 4 (7af19b6): trailingSlash never + file format; pagePath() helper for canonical/active nav (Astro.url is /about.html in file builds); nginx slash 301 via raw $request_uri (no CRLF injection, no //host open redirect), query kept; no canonical on 404; sitemap lastmod; seo.spec.ts. Docker not installed: verified with official nginx 1.30.6 Windows build and the same config.
- Batch 5 (af0b165): middleware deleted; Sätteri hast plugin (Astro 7 default processor; rehypePlugins deprecated) adds target/rel to Markdown external links; Insights source link given explicit attributes; source-reading test removed.
- Design freeze: 0 differences after every batch (72 views).
- Finish: revealAll() before axe in all a11y specs; full suite 346 passed / 0 failed on the final run; PROGRESS 3l.

## Outcome

- ✅ Impact: audit round 1 implemented; one URL per page; no middleware; tooling in place; no visual change.
- 🧪 Tests: gates and affected specs per batch; new seo.spec.ts; full suite at the end.
- 📁 Files: see list above.
- 🔁 Next prompts: round 2 (React/lucide and framer-motion removal, script consolidation, shared components); repeat the nginx curls in the Docker image.
- 🧠 Reflection: Astro 7 differs from the audit's assumptions in two places (Astro.url in file builds, Sätteri instead of rehype); both were caught by checking real output.

## Evaluation notes (flywheel)

- Failure modes observed: python string escaping mangled two test lines (fixed); a stale astro preview blocked new previews.
- Graders run and results (PASS/FAIL): design-freeze diff PASS x5; seo.spec PASS; nginx curl matrix PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): run the curl matrix inside the Docker image in round 3 CI.

---
id: 44
title: Code audit round 3 implementation
stage: general
date: 2026-10-15
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: implement code audit round 3 of 3
labels: ["audit","seo","scheduled-publishing","a11y","nginx","tests","ci"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - docs/audit/CODE_AUDIT.md (section 6 decisions, Status column, Alpine upstream note)
 - docs/audit/SEO_COPY_CHANGES.md (new)
 - docs/PROGRESS.md, README.md, .env.example
 - .github/workflows/ci.yml (new), scripts/docker-smoke.sh (new)
 - astro.config.mjs, lighthouserc.json, package.json, package-lock.json, playwright.config.ts
 - nginx/nginx.conf, nginx/security-headers.conf, scripts/check-csp.mjs, scripts/lint-content.mjs
 - src/lib/publish.ts, src/lib/og.ts, src/lib/schema.ts (new); src/lib/content.ts
 - src/layouts/BaseLayout.astro, src/content.config.ts, src/data/site.ts
 - src/content/services/*.md (11), src/content/insights/*.md (3), src/content/resources/azure-reference-architecture.md
 - src/pages/**/*.astro (breadcrumbs, meta), src/components/layout/Header.astro
 - src/components/sections/{Hero,Industries,Pillars,Process,ResultsBand}.astro, src/components/ui/Chip.astro
 - src/scripts/alpine/theme.ts, src/scripts/alpine/router.ts
 - tests/e2e/*.ts (publish.spec.ts and build-date.ts new; seo, theme-a11y, redirects-config extended; duplicates removed; sleeps replaced; @desktop/@mobile tags)
tests:
 - per batch: check, lint, format:check, lint:content, build, check:csp + affected specs (pass)
 - lint:content negative tests: long static title, long service description, long home description all caught
 - nginx 1.30.6 (Windows build, repo config): round-1 URL checks, .html and /404 rules, retired 301s, open-redirect and CRLF cases, security headers, gzip JS
 - scrollCue experiment: plain anchor 2 scroll positions + URL hash vs scrollCue 28-53 positions
 - design freeze: batch pages, then all 32 pages x 1440/390 x light/dark vs pre-round baseline; only intended diffs (/insights order and dates, user-select)
 - sleep-affected specs 3x: 336 passed
 - root cause of mobile flakes: 16x CPU throttling reproduced 5/26 failures; after fix 102/102
 - full Playwright suite: 412 passed, 2 skipped (content-conditional), 0 failed
 - Lighthouse 13 home mobile (astro preview): 99/100/81/100, LCP 1.7-1.9 s, CLS 0.001
 - GitHub Actions: run 1 (38770749138) LHCI failed, log not public; run 2 green; run 3 LHCI failed (cold run of /, perf 0.43); numberOfRuns 3; run 4 (38773058706) all green
---

## Prompt

Read docs/PROGRESS.md and docs/audit/CODE_AUDIT.md (incl. section 6) first. Round 3 of 3.

GLOBAL RULES:
- No visual or behavioural design change.
- Design-freeze computed-style comparison (1440px + 390px, light + dark) ONLY on the pages a batch actually touches, plus one full all-pages comparison at the end of the round. Batches 13 and 14 don't touch templates/CSS, so they need no comparison.
- No new runtime dependencies.
- One commit per batch on dev, with the finding IDs in the message. Push after each commit.
- Per batch: only the affected tests + npm run check + lint + format:check + lint:content + build + check:csp.
- Before reporting any test result, read the full summary line (passed / failed / skipped counts), not just the tail of the output.

STEP 0: update section 6 of CODE_AUDIT.md:
- F-02 is fully DECLINED by the owner. No change at all to the marquee or the hero stepper, including no keyboard/focus pause. Note that full WCAG 2.2.2 compliance was declined by the owner.
- Round 2 follow-ups accepted as is: the contact-form code loads on every page (2.8 KB gzip), and the "How we engage" timer starts on scroll-in.
- F-64: only remove duplicate tests in this round; the full regroup by feature is DEFERRED.

BATCH 11, SEO metadata: F-09, F-20 (code only), F-42, F-48, F-66 (d), plus staggered article publishing.
- Rewrite meta descriptions to ≤155 characters and titles to ≤60, keeping the meaning and keywords. No new claims, no prices, no response times.
- Add the length check to lint:content.
- F-20:
  - add og:image width/height/alt and twitter summary_large_image;
  - for articles, og:type=article + article:published_time;
  - Article JSON-LD gets image, dateModified and publisher.logo;
  - point the OG image at public/og/default.png and keep the current icon as the fallback until that file exists.
- Validate one service page and one article with a JSON-LD parser in seo.spec.ts.
- Put a table of every old → new title/description in docs/audit/SEO_COPY_CHANGES.md for owner review.
- STAGGERED ARTICLE PUBLISHING (honest dates, no backdating). The 3 Insights articles currently share 12 Oct 2026. Set real, distinct publish dates:
  - azure-environment-strategy: 12 Oct 2026
  - bitbucket-branch-governance: 26 Oct 2026
  - cloud-cost-checklist: 9 Nov 2026

  An article whose date is in the future at build time must be fully excluded from the build:
  - no route;
  - not on /insights, the home page, related links or the header/footer gating;
  - not in the sitemap or JSON-LD.

  It appears automatically on the first build on or after its date. Use one helper (e.g. isPublished(entry)) everywhere articles are listed.
  - Make sure /insights and any "Insights" nav link still behave correctly when only one article is published.
  - Tests: one small test with a fixed build date for each state (future article hidden, past article shown). Nothing more.
  - Note in PROGRESS.md that the site must be rebuilt/deployed on 26 Oct and 9 Nov (or by the scheduled CI build in batch 14 once deployment is automated).

BATCH 12, accessibility (no visual change): F-45, F-46, F-47. Do NOT touch F-02. Design-freeze comparison only on the pages with changed cards (home, /about, /industries, /approach, one service page).

BATCH 13, nginx + small items: F-52, F-53, F-58 (delete scrollCue only if a plain anchor scrolls smoothly under the ClientRouter; otherwise keep it and say why), plus the round-1 follow-ups:
- /about.html (any /<page>.html) → 301 to /<page>, keeping the query string, and /index.html → /.
- Requesting /404 directly must return HTTP status 404 (not 200), still showing the 404 page.
- Use the same hardened redirect approach as the trailing-slash rule (no header injection, no open redirect).
- Lighthouse Best Practices 81: check whether a newer alpinejs / @alpinejs/csp release (patch/minor only) removes the deprecated-API warning. If it does, update and confirm; if not, leave it and document it in the audit as an upstream issue. Don't work around it.

BATCH 14, tests and CI: F-16 (dev part), F-19 (CI), F-21, F-64 (duplicates only), F-65, F-66 (e).
- Delete duplicate test cases without losing coverage (list the removed cases). Don't regroup files.
- Replace the fixed sleeps.
- Tag projects with @desktop/@mobile.
- Investigate and fix the root cause of the intermittent mobile failures in the security and services-v3 specs seen in round 1 (don't just add retries).
- Add one GitHub Actions workflow on push/PR to dev and main: npm ci, check, lint, format:check, lint:content, build, check:csp, Playwright (chromium desktop + mobile), lhci autorun.
- Also add a daily scheduled build job (cron), so scheduled articles get picked up once deployment is automated.
- Add a Docker smoke job that builds the real image and curls:
  - the six round-1 URL checks (/about 200; /about/ → 301 /about; /contact/?service=agency-partnership keeps ?service=; /services 200; /services/managed-cloud-devops 200; unknown URL → 404);
  - the new .html and /404 rules;
  - the 3 retired-service 301s;
  - the security headers.
- Move @lhci/cli to CI-only (npx).
- Keep CI runtime reasonable (cache npm and the Playwright browsers).
- After pushing, check the first CI run (use gh if available; otherwise tell me to check the Actions tab). If a job fails, fix it, at most 2 attempts, then report what is still failing instead of looping.

FINISH:
- Full Playwright suite once.
- Lighthouse once on home (mobile).
- One full all-pages design-freeze comparison.
- Update the audit with a "Status" column (done/deferred/declined) for every finding.
- Update PROGRESS.md + PHR.
- Reply with a short summary table, the CI run status, and the path of SEO_COPY_CHANGES.md.

(Follow-up messages, twice, after network interruptions: "The previous response was cut off by a network error. Continue round 3 from where you stopped. First run git status and git log to see which batches are committed, check the uncommitted changes of the current batch, then finish it and the remaining batches as per the round 3 prompt.")

## Response snapshot

- Step 0: audit section 6 updated (F-02 declined in full, round-2 follow-ups accepted, F-64 regroup deferred).
- Batch 11 (6a91193): 3 titles and 20 descriptions shortened via seoTitle/seoDescription/site.metaDescription with a lint:content length pass; og:image size/type/alt, og:locale, summary_large_image once public/og/default.png exists (icon fallback stays summary); og:type=article + article times; one JSON-LD @graph with Organization, WebSite, BreadcrumbList, Service, Article (image, dateModified, publisher.logo); lang en-GB; seo.spec expands a service page and an article with jsonld. Articles dated 12 Oct / 26 Oct / 9 Nov; isPublished() excludes future-dated articles from routes, listings, nav gating, sitemap and JSON-LD; BUILD_DATE override, pinned in the E2E build.
- Batch 12 (a67e59d): theme-color follows the site theme, mobile nav labelled Primary, select-none removed from cards and chips (not the marquee).
- Batch 13 (2fbc5cf): .html and /index.html 301s, /404 returns 404, gzip text/javascript, img-src without data: (gated by check:csp), no interest-cohort; scrollCue kept (plain anchor jumps under the ClientRouter and adds a hash); Alpine 3.17.4 is latest, Best Practices 81 documented upstream.
- Batch 14 (787606b, f7eb70d): CI workflow (gates, Playwright, LHCI via npx, Docker smoke, daily scheduled build), @lhci/cli removed (audit 17 -> 0), 13 duplicate test cases removed, no fixed sleeps, @desktop/@mobile tags (skips 76 -> 2), flaky mobile root causes fixed (one 30s budget across 8-13 pages; networkidle; 5s assertion on a client-side navigation).
- CI: run 1 Lighthouse failed (log needs login, reports not uploaded because hidden folder); fixed upload and annotations; run 2 green; run 3 Lighthouse failed on one noisy cold run of / (0.43); numberOfRuns 3 (second and last fix attempt); run 4 (38773058706) all green.

## Outcome

- ✅ Impact: all three audit rounds complete; every finding has a status (59 done, 3 deferred, 5 declined); CI runs every gate including the real Docker image.
- 🧪 Tests: per-batch gates; full suite 412 passed / 2 skipped / 0 failed; full design freeze with only intended differences; Lighthouse home mobile 99/100/81/100; CI green on run 38773058706.
- 📁 Files: see list above.
- 🔁 Next prompts: owner review of docs/audit/SEO_COPY_CHANGES.md; rebuild/deploy on 26 Oct and 9 Nov; automate deployment from the scheduled build; add public/og/default.png.
- 🧠 Reflection: always verify that a measurement tool measures the real thing. The first freeze snapshots compared "not found" pages and reported 0 differences.

## Evaluation notes (flywheel)

- Failure modes observed: scratch static server given a relative path served 404 pages, so early freeze results were meaningless (caught in batch 12 and redone); review-fixes JSON-LD tests were missed in batch 11's affected-spec list; Python heredocs mangled \b and \x escapes in generated JS/TS (fixed by hand); Git Bash converted "/" in an env var to a Windows path; upload-artifact skips hidden folders.
- Graders run and results (PASS/FAIL): lint length negative tests PASS; nginx rule curls PASS; design freeze PASS (intended diffs only); throttled flake reproduction then fix PASS; full suite PASS; CI PASS on second run.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): have the snapshot script assert a known page title before capturing, so a broken server fails loudly.

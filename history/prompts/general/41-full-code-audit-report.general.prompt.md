---
id: 41
title: Full code audit report
stage: general
date: 2026-10-15
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: full code audit (report only)
labels: ["audit","seo","performance","accessibility","refactor-plan"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - docs/audit/CODE_AUDIT.md
tests:
 - npm run build (pass, 32 pages)
 - npx astro check (0 errors, 0 warnings, 2 hints)
 - npm audit / npm outdated / npx knip@5 (read-only)
 - Lighthouse 13 on / and /services/managed-cloud-devops (mobile + desktop)
---

## Prompt

Read docs/PROGRESS.md first for project context.

FULL CODE AUDIT — REPORT ONLY. Do NOT change any code, config, content or design. Do NOT install any dependency. One-off read-only CLI checks via npx (e.g. knip, depcheck, npm outdated, npm audit, astro check, tsc --noEmit) are allowed only if they don't modify package.json or the lockfile; delete any temp output afterwards.

Goal: verify every file in the codebase and list everything that should change so the code follows best practices, uses what Astro/Tailwind/the platform already provide instead of custom code, has no duplication, and stays fast with perfect SEO. Write everything to docs/audit/CODE_AUDIT.md and commit only that file on dev.

Check EVERY file (src/, public/, scripts/, tests/, config files, nginx config, package.json) for:

A. Framework-native vs custom code. For each custom implementation, say whether Astro/Tailwind/the browser already provides it and whether switching would be shorter and safer. At minimum review:
   - reveal/scroll animations, page transitions (ClientRouter/view transitions), scroll restoration/smooth scroll
   - external-link handling (middleware vs rehype-external-links vs component), mega-menu, FAQ accordion JS fallback (native <details>)
   - theme toggle, focus handling, image handling (astro:assets <Image>/<Picture>), fonts, sitemap/robots, redirects (Astro config vs nginx), JSON-LD builders, form handling, content storage (content collections vs hand-written data files)

B. Duplication and reusability:
   - the same markup, logic, styles or data written in more than one place (cards, chips, section headers, CTA bands, region/service/offer lists, icons, scripts)
   - propose the single shared component or data source for each

C. Code quality:
   - unused files, components, exports, imports, CSS, assets and dependencies
   - circular imports, naming consistency, folder structure
   - TypeScript strictness and any `any`, prop typing, magic numbers, dead branches, overly long files/functions, comments that are out of date

D. Client JS and runtime: per-page JS size; scripts that run twice or leak listeners/observers after ClientRouter navigation; is:inline usage; work done on the client that could be done at build time.

E. Routing:
   - every route listed, 404 page
   - trailing-slash consistency, redirects, broken internal links and #anchors
   - canonical URLs; pages missing from or wrongly included in the sitemap

F. SEO:
   - unique title/meta description per page with length check, one H1 per page and heading order
   - canonical, OG/Twitter tags
   - JSON-LD validity and duplicates, alt text, robots.txt, sitemap
   - anything that could hurt indexing or Core Web Vitals

G. Performance:
   - image formats and sizes, font loading (preload, subset, font-display)
   - CSS size and unused CSS, CLS/LCP risks, caching headers in nginx
   - Lighthouse numbers for home and one service page

H. Accessibility: landmarks, ARIA misuse, keyboard support (mega-menu, theme toggle, mobile menu), focus-visible, contrast in both themes, reduced motion.

I. Security: CSP and other headers, form spam protection, secrets in repo, `npm audit` results, outdated packages (`npm outdated`).

J. Tests:
   - brittle tests (e.g. tests that read component source text instead of checking rendered DOM)
   - duplicated or slow tests, coverage gaps for real user flows

K. Config/tooling: astro.config, tsconfig, Tailwind config, package.json scripts, lint/format setup, engines/Node version.

REPORT FORMAT (docs/audit/CODE_AUDIT.md):
1. Summary: counts by severity, top 10 issues, overall verdict.
2. Findings table. Columns:
   - ID
   - Severity (Critical/High/Medium/Low)
   - Category (A–K)
   - File:line
   - Problem
   - Why it matters
   - Recommended fix (prefer framework-native, no new runtime deps)
   - Effort (S/M/L)
   - Design impact (must be "none", or explain)
3. Detailed notes for every High/Critical item, with code excerpts.
4. "Keep as is": custom code that is justified, and why.
5. Proposed fix order in small batches, each batch independently testable.

Rules: report only, no fixes. Be specific (file paths and line numbers). Don't pad: if something is fine, say so in one line.

## Response snapshot

Wrote docs/audit/CODE_AUDIT.md (commit 2639b62 on dev): 67 findings, 0 critical, 2 high (trailing-slash/canonical vs internal-link mismatch with duplicate 200 URLs; marquee and hero stepper without a pause mechanism, WCAG 2.2.2), 19 medium, 46 low. Covers React/lucide-react used only for static icons, framer-motion only for counters, processReveal duplicating reveal.ts, the regex middleware, ClientRouter glue, 1.6 MB of unused PNGs, long meta descriptions, duplicated markup, no lint or CI. Includes per-page JS, Lighthouse (99–100 / 100 / 100 / 100), a keep-as-is list and 13 fix batches.

## Outcome

- ✅ Impact: Audit report committed; no code, config, content or design changed.
- 🧪 Tests: build, astro check, npm audit/outdated, knip, Lighthouse (read-only).
- 📁 Files: docs/audit/CODE_AUDIT.md
- 🔁 Next prompts: approve batch 1 (dead code and assets) and batch 3 (one URL per page).
- 🧠 Reflection: knip false positives (Alpine entrypoint via config string) needed manual verification.

## Evaluation notes (flywheel)

- Failure modes observed: none blocking; Lighthouse CLI exits with a Windows temp-cleanup error after writing results.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a

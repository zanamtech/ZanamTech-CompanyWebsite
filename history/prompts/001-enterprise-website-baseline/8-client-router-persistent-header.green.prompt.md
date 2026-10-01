---
id: 8
title: Client router with persistent header
stage: green
date: 2026-09-30
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["view-transitions", "client-router", "alpine", "layout-shift", "navigation"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: history/adr/001-client-interactivity-and-motion-runtime.md
  pr: null
files:
 - src/layouts/BaseLayout.astro
 - src/components/layout/Header.astro
 - src/components/ContactModal.astro
 - src/scripts/alpine.ts
 - src/scripts/metric-counters.ts
 - src/scripts/reveal.ts
 - src/styles/global.css
 - tests/e2e/navigation.spec.ts
tests:
 - tests/e2e/navigation.spec.ts (8 tests; client navigation, persistence, theme, menus, dialog, counters, stable width)
 - "Full suite: 114 passed, 6 skipped (device-specific)"
 - astro check 0 errors; check:csp PASS
---

## Prompt

Fix the full-page reload and layout shift/glitch on page navigation across all header links:

1. Enable Astro View Transitions by adding `<ClientRouter />` (from `astro:transitions`) inside `<head>` in `src/layouts/BaseLayout.astro`.
2. Add `transition:persist` to the `<Header />` component (or its interactive containers) so the header stays static without re-rendering or jumping during navigation.
3. Ensure Alpine.js theme store and scripts persist correctly across Astro client router transitions without breaking dark/light mode toggles.
4. Add `scrollbar-gutter: stable;` or `html { overflow-y: scroll; }` to `src/styles/global.css` to eliminate layout shift caused by varying page scrollbar widths.

## Response snapshot

Changes:

- Added `<ClientRouter />` in the head.
- Applied `transition:persist` on the `<header>` element (`site-header`) and on the contact `<dialog>` (`contact-dialog`).
- Added `html { scrollbar-gutter: stable; }`.

Router side-effects handled in `alpine.ts`:

- **Theme:** carried into the incoming document on `astro:before-swap`. The router replaces `<html>` attributes and does not re-run the inline theme script.
- **Header:** active nav re-synced on `astro:page-load` (the persisted header keeps server-rendered `aria-current`); menus closed on `astro:after-swap`.
- **Dialog:** listeners bound idempotently.
- **CTA click handler:** moved to the capture phase so it prevents the router's link interception.

Counters and reveal were made re-runnable on `astro:page-load` with per-element guards. Verified from source that Alpine's `initTree` skips initialized nodes, so the persisted header does not double-bind. The CSP is unchanged and passing.

## Outcome

- ✅ Impact: no full reloads between pages; the header stays fixed; no light-theme flash in dark mode; page width stable across short and long pages.
- 🧪 Tests: 114 passed / 6 skipped; the new navigation suite passes.
- 📁 Files: 7 modified, 1 test file added.
- 🔁 Next prompts: commit and push to `dev`.
- 🧠 Reflection: the router's document-level click handler silently broke the CTA-to-dialog behaviour; e2e caught it.

## Evaluation notes (flywheel)

- Failure modes observed: a Python block-replace matched an inner `});`, corrupting alpine.ts (caught by build and fixed); the dialog broke under the router (fixed via capture phase).
- Graders run and results (PASS/FAIL): Playwright + axe PASS; CSP e2e PASS; astro check PASS; check:csp PASS.
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): add `transition:name` on the main content for a subtler crossfade if desired.

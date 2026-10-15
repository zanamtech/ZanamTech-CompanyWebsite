---
id: 29
title: Reveal fail-safe, eyebrow alignment, header opacity
stage: green
date: 2026-10-15
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: About page + sitewide reveal bug (3 sections)
labels: ["reveal", "blank-card", "backdrop-filter", "about", "header", "playwright"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/scripts/reveal.ts
 - src/scripts/alpine.ts
 - src/styles/global.css
 - src/pages/about.astro
 - tests/e2e/reveal-sitewide.spec.ts (new)
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors)
 - npm run lint:content (pass)
 - Playwright reveal-sitewide, reveal, review4, review3, review-fixes, header-footer-ui, theme-motion, home-v3 (desktop + mobile): 129 passed, 25 skipped, 0 failed
 - Playwright reveal-sitewide + reveal, --repeat-each 3: 108 passed
 - Manual: cap-top measurement and screenshots of the founder card at 1440px and 1024px (0px difference)
---

## Prompt

About page + sitewide reveal bug. Work on dev. No design changes beyond what is listed.

1. LEADERSHIP CARD: the "LEADERSHIP" eyebrow sits visibly lower than "Mubashir Ahmed". Top-align them: the top of the eyebrow text must line up with the top of the name text (cap-height tops on one line). Don't move anything else. Check it visually with a screenshot at 1440px and 1024px.

2. BLANK CARD BUG (sitewide, high priority): on /about the middle "Philosophy" card ("Documented, accountable delivery") rendered completely blank (no background, no text) while the other two showed. Same class of bug as the earlier "How we engage" issue. It must never happen anywhere on the site.
   - Find the ROOT CAUSE. Suspects: the reveal script re-running after ClientRouter navigation or theme toggle and leaving elements in the hidden state; IntersectionObserver not re-initialised on astro:page-load or observing stale nodes; duplicate listeners/observers after navigation; a conflict between .card-hover transitions and the reveal opacity/transform transition; elements already in view at load never getting the "visible" class.
   - Make the reveal system fail-safe:
     - content is visible by default in CSS and only hidden when JS has initialised (e.g. a class on <html>);
     - once revealed, an element is never hidden again;
     - anything in or above the viewport at init is revealed immediately;
     - a safety timeout reveals everything still hidden;
     - observers are disconnected and re-created cleanly on each astro:page-load, with no duplicate listeners;
     - theme toggle never touches reveal state;
     - prefers-reduced-motion means no hiding at all.
   - Add a Playwright test that on every main page (home, /services, one service page, /approach, /about, /industries, /start-here, /insights, one article, /contact): scrolls top→bottom fast, toggles the theme, navigates away and back (ClientRouter), then asserts every [data-reveal] (or equivalent) element has computed opacity 1.

3. HEADER: card top gradient lines show through the 88% header as a purple "underline" under the nav while scrolling. Raise the header and its top backdrop to ~96% opacity (same blur) in light and dark mode.

Run only affected tests + the new reveal test + npm run check. Commit on dev, push, update PROGRESS.md + PHR. Reply with the root cause in 2–3 lines.

## Response snapshot

Root cause: reveal.ts hid cards with inline opacity 0 / transform and only cleared them when a Framer Motion WAAPI animation's finish event fired. Nothing verified the end state, and the animation ran on the backdrop-filtered glass card, leaving it on a permanent compositor layer: the Chromium unpainted-backdrop-filter bug found on "How we engage". Could not reproduce headless (software compositing). Rewrote reveal.ts as attribute-driven CSS transitions (visible by default, below-fold-only hiding, never re-hidden, 4s safety timeout, teardown on before-swap / init on page-load, no theme coupling, reduced motion hides nothing, attribute removed when done). Added a safety timeout to processReveal. Eyebrow/name top-aligned (self-start + 3px nudge, measured 0px cap-top difference). Header 96% opacity.

## Outcome

- ✅ Impact: all three sections done.
- 🧪 Tests: 129 passed + 108/108 on 3x repeat; check and lint:content pass.
- 📁 Files: see list.
- 🔁 Next prompts: next page in the page-by-page review.
- 🧠 Reflection: reveal end states should be declarative (attribute/class) and fully removed afterwards; never depend on an animation's finish callback to make content visible.

## Evaluation notes (flywheel)

- Failure modes observed: GPU-only paint bug invisible to headless Chromium, so the regression test asserts state (opacity, no leftover reveal attributes), not pixels.
- Graders run and results (PASS/FAIL): check PASS, lint:content PASS, Playwright PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

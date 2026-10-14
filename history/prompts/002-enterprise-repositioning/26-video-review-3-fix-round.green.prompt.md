---
id: 26
title: Video review 3 fix round
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: fix round from video review #3 (6 sections)
labels: ["links", "transitions", "focus", "header", "offers", "about", "insights"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/middleware.ts (new)
 - src/scripts/article-toc.ts (new)
 - src/scripts/alpine.ts
 - src/styles/global.css
 - src/components/layout/Header.astro
 - src/components/layout/Footer.astro
 - src/components/sections/EntryOffers.astro
 - src/data/offers.ts
 - src/pages/about.astro
 - src/pages/insights/[...slug].astro
 - tests/e2e/review3.spec.ts (new)
 - tests/e2e/review-fixes.spec.ts
 - specs/002-enterprise-repositioning/tasks.md
 - docs/PROGRESS.md
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - Playwright review3, review-fixes, header-footer-ui, services, touch-menu, responsive-header, navigation, home-v3, offers-approach, theme-a11y, theme-motion, trust-legal, approach-industries, drafts, security, contact, reveal (desktop + mobile): 252 passed, 62 skipped, 0 failed
---

## Prompt

Read docs/PROGRESS.md first. Fix round from video review #3. Work on dev. Keep the existing design language.

TESTING (save usage): only affected tests + npm run check + lint:content + check:csp. No full cross-browser sweep.

=== 1. EXTERNAL LINKS (sitewide) ===
- Bug: both the About founder LinkedIn button AND the footer company LinkedIn icon open in the SAME tab. Likely the page-transition/router click handler intercepts every <a>.
- Fix globally: any link to a different origin gets target="_blank" rel="noopener noreferrer" (do it in a shared Link/ExternalLink helper or a small post-build/render rule, not by hand). The transition/router script must ignore: external origins, target="_blank", download, mailto:/tel:, and clicks with Ctrl/Cmd/Shift/middle button.
- Add a test: clicking each LinkedIn link opens a new page (popup) and the site tab stays on the same URL.

=== 2. PAGE TRANSITIONS ===
- Bug: during navigation the old and new pages are visible at the same time (article text over /insights cards; About CTA band over /contact hero). Replace the cross-fade with a sequential transition: old content fades out fully (~120ms), then the new page fades in (~180ms). No overlap at any frame. Respect prefers-reduced-motion (no animation).
- After navigation, move focus to <main> (tabindex="-1", no visible outline) for screen readers; do NOT leave focus on the clicked link. Focus rings must appear only on :focus-visible (keyboard). Bug seen: purple outline box on the logo and on "About" after mouse clicks.

=== 3. HEADER / NAV ===
- Floating header: when scrolled, page text shows in the strip ABOVE the floating header. Add a backdrop layer from top:0 to the header's bottom edge (same opaque background + blur as the header) so no content is visible above or around it.
- Nav indicator bug (still present, reproduced in video): on /contact a purple bar appears above "Insights" (not the active page), and near the footer a lavender bar spans "How We Work / Insights / About". Remove any sliding/animated indicator element entirely. Active page = text colour + small static underline on that one link only; hover = text colour only.
- Mega-menu must close on ANY link click inside it, including a link to the current page (same-URL click: close menu, smooth-scroll to top, no reload/transition).

=== 4. HOME: "Low-risk ways to start" redesign ===
- Replace the plain text row with 5 compact cards:
  - icon (one per offer, from the existing icon set), offer name, duration pill (existing badge style), one-line output (e.g. Health Check → "Scorecard and prioritised backlog"; Cost Review → "Savings plan with quick wins"; Governance Quick-Start → "Branch rules, pipeline gates and SOPs"; AI Opportunity Sprint → "Ranked automation candidates and pilot spec"; AI Automation Pilot → "One working automation with approval points").
  - Whole card is a link to /start-here#<offer-slug>; hover = lift + gradient border + arrow, same as other cards.
- Header row: eyebrow "START HERE", title "Low-risk ways to start", subline "Fixed scope, a clear written output, no long-term commitment.", and "See all entry offers →" on the right.
- Layout: ≥1280px 5 columns in one row; 768–1279px 3 + 2 centred; <768px horizontal scroll-snap row with visible partial next card.
- Use the same strip on /services. Content must pass lint:content (no prices, no response times).

=== 5. ABOUT ===
- Move the founder LinkedIn button from the far top-right corner to directly under "Founder & Lead Architect": an outlined small button with the LinkedIn icon + text "LinkedIn" (opens in new tab per section 1).
- "Core capabilities": shorten to a 2-column list of max 4 items each and add a "View all services →" link.

=== 6. ARTICLES ===
- "On this page" sticky list: increase size (14px) and contrast (muted text token, not the faint grey), and highlight the current section while scrolling (IntersectionObserver), with aria-current on the active item.

=== FINISH ===
- Run the light tests; fix failures.
- Update docs/PROGRESS.md (section 3g), add a PHR, commit on dev, push.
- Reply with a short list of what changed and anything you could not reproduce. For the nav-indicator bug, if you can't reproduce it, remove the indicator anyway as instructed.

## Response snapshot

Render-time middleware marks every other-origin link target="_blank" rel="noopener noreferrer" (the founder link lacked target; Astro's router already ignores external/target/download/mailto/modifier clicks). Sequential view transition (old out 120ms, new in 180ms delayed 120ms), header in its own group; reduced motion none. Focus moves to <main> after navigation; data-modality carried across swaps (the cause of the rings after mouse clicks). Header backdrop when scrolled; static active underline; mega-menu closes instantly, same-URL link scrolls to top. No indicator element existed; likely the menu's fade-out caught in the transition. Five compact offer cards with responsive layout. About LinkedIn button under the role; capabilities 2 × 4 + link. Article TOC 14px muted with aria-current active section.

## Outcome

- ✅ Impact: all six sections done.
- 🧪 Tests: gates pass; 252 passed, 0 failed.
- 📁 Files: see list.
- 🔁 Next prompts: images round.
- 🧠 Reflection: Astro's router copies <html> attributes from the new page, so any client-side state on <html> (theme, modality) must be carried over in astro:before-swap.

## Evaluation notes (flywheel)

- Failure modes observed: new header backdrop broke `header > div` / `.header-bar` selectors in older tests (backdrop changed to a span with its own class); test expectations for scrollbar width and rel updated.
- Graders run and results (PASS/FAIL): check PASS, lint:content PASS, check:csp PASS, Playwright PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

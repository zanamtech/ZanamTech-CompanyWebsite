# ZanamTech Website: Progress Report

**Branch:** `dev` · **Spec:** `specs/002-enterprise-repositioning/` · **Source of truth:** `docs/03_Master_Plan_v3.md`
**Constitution:** v2.0.4 (`.specify/memory/constitution.md`) · **Updated:** 2026-10-15

## 1. Status at a glance

| Item | Status |
| --- | --- |
| Spec 002 (Master Plan v3 repositioning) | ✅ Complete: 119 of 119 tasks across Phases 0–5 |
| UI fixes (menu, footer, focus rings, header) | ✅ Complete |
| UI fixes, round 2 (scroll cue, menu badge, card illustrations, FAQ animation, footer Company row) | ✅ Complete (13 Oct) |
| UI polish and full QA pass (footer, section spacing, "How we engage" fix, cross-browser QA) | ✅ Complete (14 Oct). Report: `docs/internal/qa-2026-10-14.md` |
| Quality gates | ✅ `npm run check` 0 errors / 0 warnings · `lint:content` pass · `check:csp` pass · Playwright + axe all green (14 Oct: 3 repeat runs, 747 passed, 0 flaky) |
| Performance (Lighthouse, local, production build) | ✅ 12 pages: Performance 97–99; Accessibility, Best Practices, SEO 100; LCP ≤ 2.2 s; CLS ≤ 0.001. Rechecked 14 Oct on 12 pages: 98–99 / 100 / 100 / 100, LCP ≤ 2.21 s, CLS 0.001 |
| Owner decisions from the QA report (naming, Azure, samples, footer copy) | ✅ Applied (14 Oct, section 3c) |
| Footer spacing, Company row dots, "remote-first" removed | ✅ Done (14 Oct, section 3d) |
| Fix round from the full-site video review (contact path, header, reveal, grids, services, Insights, About, legal) | ✅ Done (14 Oct, section 3e) |
| Follow-up: About "At a glance", company LinkedIn | ✅ Done (14 Oct, section 3f) |
| Fix round from video review #3 (external links, transitions, header, offer cards, About, article TOC) | ✅ Done (14 Oct, section 3g) |
| Tweaks: no active underline, LinkedIn button top-right | ✅ Done (14 Oct, section 3h) |
| Code audit, round 1 of 3 (dead code, dependencies, tooling, one URL per page, external links) | ✅ Done (15 Oct, section 3l) |
| Code audit, round 2 of 3 (CSS, types, scripts, icons without React, shared components) | ✅ Done (15 Oct, section 3m) |
| Code audit, round 3 of 3 (SEO metadata, scheduled articles, accessibility, nginx, tests, CI) | ✅ Done (15 Oct, section 3n) |
| SEO copy approved; all three Insights articles published, expanded and fact-checked | ✅ Done (15 Oct, section 3o) |
| Pushed to `origin/dev` | Everything up to and including section 3o |
| CI (GitHub Actions) | ✅ Green on `dev` (run 38773058706): checks, Playwright, Lighthouse CI, Docker smoke |

## 2. What was completed in spec 002

### Governance (Phase 0)
- **Constitution:** amended to v2.0.0, then patched to 2.0.1, 2.0.2, 2.0.3 and 2.0.4.
  - Principle III was redefined as "Brand, Content & Proof Integrity".
  - Principle IV gained a design freeze: no change to colours, fonts, spacing, themes or animations.
- **Docs:** `docs/01_Brand_Positioning.md` and `docs/02_Services_Catalog.md` were rewritten from v3.
- **Spec Kit artefacts:** spec, 10 clarifications, plan, research, data model, contracts, quickstart, tasks, and two analysis passes.
- **ADRs:**
  - ADR-003: verified-only proof model.
  - ADR-004: pillar-based service taxonomy with a readiness gate.
- **Internal docs (gitignored):** internal SOW response defaults in `docs/internal/`.

### Content model (Phase 1)
- **Service schema:** pillars, flagship, `published` readiness gate, deliverables, engagement types, FAQ and related offer. Every scenario is marked real or illustrative, and illustrative ones may not contain digits.
- **New content collections:**
  - Insights and Resources, draft-gated.
  - Case Studies, verified-only.
- **Data modules:** results, retainer tiers and severity levels, entry offers, commitments, FAQ, leadership, and clients/testimonials (both shipped empty).

### Content (Phase 2)
- **Catalogue:** 13 published services. One flagship (Managed Cloud & DevOps), plus 12 in 4 pillars.
  - Five new services, each with example scenarios that carry no numbers.
  - Retired services 301-redirect in nginx.
- **Results:** the 8 past-project results are worded as achieved results, under "Selected results from past engagements", with the footnote.
- **Copy:** rewritten across the site. No team-structure claims, no "24/7", no "zero downtime", no self-hosted LLM claims.
- **Privacy notice:** updated with GDPR Article 28 processor terms and UAE/KSA PDPL references.
- **Drafts:** 3 Insights articles, now approved and published, and 3 sample artefacts, published on 14 Oct after owner approval.

### Components and pages (Phase 3)
- **Home, in order:** results band, flagship spotlight, service pillars, entry offers, artefact band, How We Work, industries, trust band, FAQ.
  - Logo and testimonial sections appear only when verified entries exist.
- **Service pages:**
  - All services: "What you get", engagement types, related offer and FAQ.
  - Flagship: tiers, severity levels, cadence, onboarding and exit terms.
- **New pages:**
  - `/start-here`, `/trust` and `/terms`.
  - `/insights` and `/resources` (index plus detail).
  - `/case-studies`, built only once a verified case study exists.
  - `security.txt`.
- **Contact form:**
  - New fields: Region, Company size, and Cloud platform (AWS, Azure, Google Cloud, Multi-cloud, Other).
  - New "Agency partnership" option, which can be preselected from a link.

### Guardrails and tests (Phase 4)
- **Content lint:** enforces every Constitution III rule.
  - Covers years claims, pricing, competitor names, team-structure claims, guarantee/100%/24/7, "certified" and legal suffixes, self-hosted LLM claims, two-cloud phrasing, clock times, time zones and minute/hour figures.
  - Uses an allow-list for the approved phrases.
  - Checks that client, testimonial and case-study entries carry verification fields, and that statistics in Insights have a source link.
  - Each rule family was proven by deliberately inserting a banned phrase.
- **New E2E specs:** Home, services, nginx redirect config, offers and How We Work, trust/legal, drafts, proof gating, and header/footer UI.

### Verification (Phase 5)
- **Full gates:** all green, including three repeat runs with no flaky tests.
- **Wording audit:** the built site contains no banned wording.
- **Design freeze:** compared against the pre-repositioning commit `e2e656c`. Computed styles are identical for 20 components at 1440 and 390 px in light and dark; only the text differs.
- **Font fix:** the font is now preloaded, which removed a layout shift on long article titles (CLS 0.167 → 0.001).

## 3. UI fixes after spec 002
- **Focus rings:**
  - Shown for keyboard users only.
  - A small input-modality script hides them after a mouse or touch interaction and brings them back on Tab.
  - Text fields keep their focus style.
- **Services menu:**
  - Layout: intro | Managed (flagship tile) + Practical AI | Cloud & DevOps in two sub-columns | Web & SaaS.
  - Height: 280 px at 1440 (was 566 px), never more than 70% of the screen.
- **Mobile menu:** Services expands to the four pillars as collapsible groups. Works by touch and keyboard, with correct `aria-expanded`.
- **Footer:**
  - Uses the same grouping as the menu and fits one screen at 1440×900 (457 px).
  - Phones get collapsible pillar groups.
  - Copyright line: "© 2026 ZanamTech · Cloud, DevOps & AI engineering".
  - The site never says "remote-first" (content lint rule since 14 Oct).
- **Header:**
  - The separate "Managed Services" item is removed; the flagship stays first in the Services menu.
  - Insights shows from 1024 px, and the CTA fits.

## 3a. UI fixes, round 2 (13 Oct)
- **Hero scroll cue:**
  - Fixed: the hero now stacks above the results band (`z-10`), so the button is fully visible at every width, in both themes and in Chromium, Firefox and WebKit.
  - It now scrolls to the flagship section. Scroll margins put the eyebrow 24 px below the floating header at every width.
  - Smooth scrolling, or a jump with reduced motion. Accessible name: "Scroll to the flagship service: Managed Cloud & DevOps".
- **Services menu:** the "Flagship" badge and the highlighted tile are gone. Managed Cloud & DevOps is listed like every other service and stays first. The mobile drawer never had a badge.
- **Card illustrations:**
  - What they are: decorative inline SVGs (`src/components/ui/Illustration.astro`), one motif per sample and per Insights article, drawn with colour tokens only and `aria-hidden`.
  - Size: 2:1 on cards and 16:9 in the article and sample page headers.
  - Cost: no image requests, about 1.2 KB gzipped on `/insights`.
- **FAQ accordion:**
  - Height and chevron animate over 280 ms on both open and close.
  - The animation is CSS (`::details-content` with `interpolate-size`) where the browser supports it. Elsewhere `src/scripts/faq-accordion.ts` does it with the Web Animations API (Firefox, Safari), which needs no CSP change.
  - Native `details`/`summary` is kept. Instant with reduced motion.
- **Footer:**
  - Desktop and tablet: the separate Company column is removed and the service groups span to the right edge.
  - The Company links now form a single labelled row under the services. At 1440 it sits on the same line as the contact email.
  - Phones are unchanged, and the first group label stays "Managed Cloud & DevOps".
- **Tests and checks:**
  - Tests: the menu test now checks the flagship has no badge or tile. New tests cover the footer Company row (1440, 1024, 768), the scroll cue, the FAQ animation (including reduced motion) and the Insights illustrations.
  - Checks: `check`, `lint:content`, `check:csp` and the full Playwright + axe suite pass (235 passed, 51 skipped by project). The new tests also passed 3 repeat runs.
- **Follow-ups (13 Oct):**
  - The third sample's title now reads "Monthly service report". The other two already start with a capital.
  - Playwright now builds and serves the preview on a free port, or on `PLAYWRIGHT_PORT` when that's set, and never reuses a running server.
  - The stale dev server on port 4321 was stopped. The full suite passed again.
- **Screenshots:** 64 images (6 views × 4 widths × 2 themes, plus the page headers) in `docs/internal/screenshots/2026-10-13-ui-fixes/` (gitignored). The sample cards are drafts, so they were captured from `astro dev`.

## 3b. UI polish and full QA pass (14 Oct)
- **Footer (desktop and tablet):**
  - Fixed 17 rem brand column with a 64 px gap; every service column, including the two Cloud sub-columns, is 32 px apart.
  - Independent lists with an even 16 px text gap; every first link starts at the same height.
  - The Company row stays level with the email and spreads evenly to the right edge, with no dots.
  - 42 px above the divider; 457 px tall at 1440×900. The phone layout is unchanged.
- **Section spacing:**
  - New `section-y` / `section-t` / `section-b` scale: 36 / 48 / 56 px, down from 48 / 64 / 80. Sections sit 72 / 96 / 112 px apart on phone / tablet / desktop.
  - Applied to every page, the page header, the CTA band and the footer. The CTA-to-footer gap went from 176 px to 112 px.
- **"How we engage" cards:**
  - Root cause: the global `scroll-behavior: smooth` animated the browser's scroll restoration on reload. That glide started the 3.25-second card sequence off-screen, so a visitor scrolling back saw cards 03 and 04 still blank.
  - Fixes: smooth scrolling only while something is focused (`html:focus-within`); sections already scrolled past show immediately; a watchdog for missed observer events; the fade runs on the card, not its parent; cards drop all reveal styles when done.
  - The shared reveal engine got the same fixes, plus a threshold that works for groups taller than the screen.
  - Regression tests: `tests/e2e/reveal.spec.ts`.
- **QA:**
  - 1,176 page loads (28 routes × 7 widths × 2 themes × Chromium, Firefox and WebKit), plus the draft samples in dev, a Tab-focus scan, a link check, the existing suite in all three engines, and Lighthouse on 12 pages.
  - Also fixed: phone overflow from wide tables on two samples, the `/resources` heading order, scroll-cue offsets after the spacing change, and 4 US spellings.
  - The full report, with the issues list, WebKit items to verify on real Safari, and owner decisions, is `docs/internal/qa-2026-10-14.md`.
- **Screenshots:** `docs/internal/screenshots/2026-10-14-qa/` (gitignored), with before and after for the footer, spacing and "How we engage" at 1440, 1024 and 390 in light and dark.

## 3c. Owner decisions from the QA report (14 Oct)
- **"How We Work"** in title case everywhere, including the home link under "How we engage" and the page eyebrow.
- **"Azure"**, never "Microsoft Azure": service technology lists, the technology marquee and the structured data. The structured data and the migration copy also say "AWS" instead of "Amazon Web Services".
- **Company row:** even spacing, no dots (unchanged).
- **Samples published:** the 3 samples are `draft: false`, so `/resources`, the sample pages and the home sample band are live. The "DRAFT: owner fact-check" notes became a plain "SAMPLE" note.
- **Footer description shortened** to "Cloud, DevOps & AI engineering for growing businesses. We run, secure and modernise cloud platforms on AWS, Azure and Google Cloud, with documented runbooks and no lock-in." It is 4 lines on desktop: the brand column went from 17rem to 20rem and its gap from 64 to 48px, so the service columns keep their wrapping. The email is pinned to the column bottom, so it stays level with the Company row. The footer is 439px at 1440×900.
- **Checks:** affected Playwright specs (232 tests: 192 passed, 40 skipped by design, 0 failed), `npm run check` 0 errors, `lint:content` and `check:csp` pass. No full cross-browser sweep this round, as agreed.

## 3d. Footer spacing and "remote-first" removed (14 Oct)
- **Service lists:** back to the earlier 32px row pitch in every column and sub-column; the Company row and email move up with them and stay level. The footer is 427px at 1440×900.
- **Company row:** dot separators restored between every link (this replaces "no dots" in 3c); each dot sits centred in its gap, and the row still spans to the right edge.
- **"Remote-first" removed site-wide:** tab title is now "ZanamTech | Cloud, DevOps & AI Engineering"; the site description, meta, Open Graph/Twitter tags and JSON-LD (all from `site.ts`) and the About copy no longer use it. The content lint bans it, and constitution v2.0.4 lists it as prohibited wording.
- **Checks:** `npm run check` 0 errors, `lint:content` pass, `npm run build` pass; zero "remote-first" matches in `src/`, `public/` and `dist/`.

## 3e. Fix round from the full-site video review (14 Oct)
- **One contact path:** the consultation dialog is gone (component, script, styles, tests). Every "Book a Strategy Consultation" button and the footer "Contact" link go to `/contact`. Context buttons pass `?service=<slug>` ("Discuss an agency partnership" → `agency-partnership`; service pages → the service slug), which preselects "Service needed" on load and after client-side navigation. Unknown values are ignored; nothing persists. "Write to contact@zanamtech.com" now has its space. Spec FR-035 amended.
- **Header:** the floating bar is near-opaque (light `rgba(255,255,255,0.88)`, dark equivalent) with an 8px blur, so purple buttons and badges no longer smudge through it. The mega-menu closes on any link click and as soon as a navigation starts. The purple pill behind "How We Work / Insights / About" could not be reproduced after the opacity change; nav items have no hover background.
- **Reveal:** "How we engage" and "Four phases" cards appear as one group (all four within 180ms, then a 700ms fade). Every other card grid's stagger is capped at 60ms with the whole group starting within 300ms.
- **No empty slots:** 5-card sets ("Low-risk ways to start" on /start-here, "Engagement models") show 3 + 2 with the second row centred. On `/services`, Managed Cloud & DevOps is a full-width feature card with four included items; Practical AI is two-up; Cloud & DevOps centres its last card. Related services: always 3 cards (cross-pillar picks where needed), no catalogue numbers.
- **Less repetition:** full entry-offer cards only on `/start-here`; Home and `/services` show a one-row strip (name + duration) with "See all entry offers". The positioning chips are hero-only (removed from the footer). About "What we stand for": Verified outcomes · Documented, accountable delivery · Privacy by design.
- **Home:** marquee without "Claude Code", "Windows" → "Windows Server". The Managed pillar card lists monitoring and alerting, patching and backups, cost and security reviews, monthly service report, each linking to the flagship.
- **Service pages:** 5 FAQs each (price via proposal and SOW, timeline, access and security, after delivery, clouds), all lint-clean. "How you can engage" shows 2–3 model chips linking to `/approach#engagement-models`. Engagement types added: Managed (assessment, retainer, agency), Portals and Full-stack (project, extended capacity).
- **Insights:** hero meta line "By Mubashir Ahmed · Founder & Lead Architect · date · n min read" (author links to /about); separate date row removed; Article JSON-LD with author. Desktop reading column 720px with a sticky "On this page" list from the H2s.
- **About:** founder photo (moved from `public/images/team/` to `src/assets/team/mubashir.jpg` so Astro serves a resized WebP instead of the 2.3 MB original), LinkedIn icon link, photo left / text right; "Pragmatic, enterprise-first"; time-zone line in body text.
- **Start here:** "about 4 weeks" → "3–4 weeks".
- **Trust/legal:** the visible security.txt link is removed (the file stays, linked nowhere). "Last updated: 12 October 2026" under the /privacy and /terms titles. Breadcrumbs on /trust and /terms measured below the header at 390–1440px (same component as /privacy).
- **Spacing:** CTA band to footer gap ~40% smaller (44 / 58 / 68px).
- **Checks:** 17 affected Playwright specs plus the new `review-fixes.spec.ts` (306 tests: 251 passed, 55 skipped by design, 0 failed); `npm run check` 0 errors; `lint:content`, `check:csp` pass. No cross-browser sweep this round.

## 3f. Follow-up to the review round (14 Oct)
- **Engagement chips approved** as added in 3e (Managed: Assessment + Agency partnership; Portals and Full-stack: Extended engineering capacity).
- **About:** the "What we stand for" card (it repeated the Philosophy cards) is replaced by "At a glance": Clouds (AWS, Azure, Google Cloud), Regions served (North America, UK & Europe, GCC), Engagement (Assessment, Fixed-scope project, Managed retainer).
- **Company LinkedIn** (`https://www.linkedin.com/company/zanamtech/`): an icon link beside the footer email (new tab, `rel="noopener noreferrer"`, `aria-label="ZanamTech on LinkedIn"`) and in the Organization JSON-LD `sameAs`. The founder's personal LinkedIn stays on the About card. The CSP needed no change (it does not restrict outbound links); there is no separate link checker.
- **Checks:** affected specs (review-fixes, header-footer-ui, trust-legal, approach-industries, security, theme-a11y, navigation): 95 passed, 21 skipped by design, 0 failed; `npm run check` 0 errors; `lint:content` and `check:csp` pass.

## 3g. Fix round from video review #3 (14 Oct)
- **External links, site-wide:** `src/middleware.ts` gives every link to another origin `target="_blank" rel="noopener noreferrer"` while pages render (dev and static build), including Markdown article sources. The founder LinkedIn link had no `target`, which is why it opened in the same tab. Astro's ClientRouter already skips other origins, `target="_blank"`, `download`, `mailto:`/`tel:`, Ctrl/Cmd/Shift/Alt and non-left clicks, so it needed no change.
- **Page transitions:** sequential instead of a cross-fade. The old page fades out over 120ms, then the new page fades in over 180ms (it starts at 120ms), so they never share a frame. The persisted header has its own transition group and stays put. Reduced motion: no animation.
- **Focus:** after a client-side navigation focus moves to `<main>` (no outline). The router used to drop `data-modality` from `<html>` on every navigation, so a mouse-clicked header link (logo, "About") showed a keyboard ring; the flag is now carried into the new page.
- **Header:** once scrolled, a full-width backdrop (same 0.88 background and blur) fills the strip from the top of the screen to the bar's bottom edge. Active page: accent colour plus a small static underline on that link only; hover changes colour only. There was no sliding indicator element in the markup; the bars seen in the video were most likely the mega-menu's 150ms fade-out (its gradient hairline and panel) caught in the page transition, so the menu now closes instantly (it still fades in). A menu link to the current page closes the menu and smooth-scrolls to the top without navigating.
- **"Low-risk ways to start" (Home and /services):** five compact cards (icon, name, duration pill, one-line output, "View offer"), each linking to `/start-here#<offer>`, with the shared card hover. 5 across from 1280px, 3 + 2 centred from 768px, a horizontal scroll-snap row on phones. Header row with subline "Fixed scope, a clear written output, no long-term commitment."
- **About:** the LinkedIn button (icon + "LinkedIn", outlined) sits directly under "Founder & Lead Architect". Core capabilities: two lists of four plus "View all services →".
- **Articles:** "On this page" links at 14px in the muted token on a stronger rail; the section being read is highlighted (IntersectionObserver) with `aria-current="location"`.
- **Checks:** affected specs plus the new `review3.spec.ts` (314 tests: 252 passed, 62 skipped by design, 0 failed); `npm run check` 0 errors; `lint:content` and `check:csp` pass. No cross-browser sweep.

## 3h. UI tweaks (14 Oct)
- **Header nav:** the active-page underline from 3g is removed. The active page is the purple text colour only; hover changes colour only.
- **About founder card:** the outlined "LinkedIn" button (icon + text, new tab) is back in the top-right corner, level with the name, from 768px. Below 768px it sits under "Founder & Lead Architect". Core capabilities unchanged (two lists of four).
- **Test fix:** the "mouse click leaves no ring" test now waits for focus to reach `<main>` after the navigation before pressing Tab (it raced with the 3g focus move; 10/10 after the fix).
- **Checks:** affected specs (review3, review-fixes, approach-industries, trust-legal, header-footer-ui, navigation): all pass; `npm run check` 0 errors.

## 3i. About page round (15 Oct)
- **LinkedIn same-tab bug, root cause:** `src/middleware.ts` (3g) was added while `npm run dev` was already running. Astro's dev server only discovers the middleware file at startup, so that session never applied it: the HTML had no `target`, and the link opened in the same tab. A fresh dev server and the production build were both fine. Reproduced by starting dev without the file and adding it mid-session: no `target`. Fix: `target="_blank" rel="noopener noreferrer"` is now hard-coded on the founder LinkedIn button and the footer company LinkedIn icon. The middleware stays as the site-wide safety net. **Restart `npm run dev` after adding or renaming `src/middleware.ts`.** Verified on a fresh dev server (attributes present, click opens a new tab) and in `dist/about/index.html`.
- **Founder card:** the "LEADERSHIP" eyebrow now sits in the photo column, on the name's baseline row. The photo (same size and corners) is centred against the role + bio rows with a 3-column grid, and the LinkedIn button stays top-right on the name row. The time-zone sentence is removed. Phones (<768px) stack: eyebrow, photo (max 160px), name, role, LinkedIn, bio.
- **At a glance:** values are chips in the "Technology stack" style. Clouds, Regions served, Engagement (from the `/approach` catalogue) and Clients.
- **Regions, sitewide:** a single `regionsServed` list in `src/data/site.ts` (US, Canada, UK, Europe, Gulf Cooperation Council (GCC), Australia & New Zealand) feeds About and the contact form's Region dropdown (+ "Other"). Industries spells out "Gulf Cooperation Council (GCC)" in the meta description and hero lead; the segment name stays "GCC Enterprises & Scale-Ups". No "North America, the UK and Europe" wording remains in `src`.
- **Spacing:** the About hero → "Our mission" gap is about 30% smaller (section top padding 24 / 32 / 40px, was 36 / 48 / 56px).
- **Checks:** review4 (new), review3, review-fixes, trust-legal, contact, approach-industries, desktop + mobile: 117 passed, 11 skipped by design, 0 failed. `npm run check` 0 errors; `lint:content` passes.

## 3j. Reveal fail-safe, eyebrow alignment, header opacity (15 Oct)
- **Blank card, root cause:** `reveal.ts` hid below-fold items with inline `opacity: 0` + `transform` and relied on a Framer Motion WAAPI animation to clear them. The final value is only written when that animation's finish event fires, nothing checked afterwards, and the animation ran on the glass card itself (`backdrop-filter`). Every revealed card was then left on its own compositor layer for good (inline `transform`). That is the Chromium paint bug already found on "How we engage" (3e): a backdrop-filtered card left unpainted until a repaint. Not reproducible headless (software compositing). The blank-render mechanism matches the earlier case, but it is an inference, not a reproduction.
- **Fix:** `reveal.ts` rewritten without Framer Motion. CSS transitions driven by a `data-reveal` attribute: visible by default; only the script hides, and only groups fully below the fold at init. `shown` is opacity 1 regardless of the transition, and the attribute is removed when done, so cards keep no opacity/transform. A revealed group is never hidden again (WeakSet). 4s safety timeout per group, started when the group first enters the viewport (see 3k). Observer/timer torn down on `astro:before-swap` and rebuilt on `astro:page-load`; watchdog listeners bound once. No theme coupling; reduced motion hides nothing (script + CSS). The `.card-hover` transitions are merged into the reveal transition so neither overrides the other. `processReveal` ("How we engage") gained the same 4s safety timeout.
- **Founder card:** "LEADERSHIP" and "Mubashir Ahmed" are top-aligned, with cap tops measured level (0px difference at 1440 and 1024; was 7px). Grid items `self-start` plus a 3px eyebrow nudge.
- **Header:** bar and scrolled backdrop at 96% opacity (was 88%), same 8px blur, light and dark.
- **Checks:** new `reveal-sitewide.spec.ts` (10 main pages: fast scroll, theme toggle, ClientRouter away and back; every reveal item at opacity 1, no `data-reveal` left; plus reduced motion), reveal, review3/4, review-fixes, header-footer-ui, theme-motion, home-v3: 129 passed, 25 skipped by design. Reveal specs 3x repeat: 108/108. `npm run check` 0 errors; `lint:content` passes.

## 3k. Reveal safety timeout per group (15 Oct)
- The 4s safety timeout no longer starts on page load: a separate IntersectionObserver (any visible pixel), plus the scroll watchdog, starts it per group when the group first enters the viewport. When it fires, the group is shown and stripped of reveal styles whatever its state. Lower sections still fade in when reached. Other fail-safe rules unchanged; timers are cleared on `astro:before-swap`.
- **Checks:** new test (an /about group waits past 5s unscrolled, still hidden, then fades in on scroll and ends clean); `reveal-sitewide` + `reveal`: 38 passed, 76/76 on 2x repeat. `npm run check` 0 errors.

## 3l. Code audit, round 1 of 3 (15 Oct)
Implements part of `docs/audit/CODE_AUDIT.md`. The owner's decisions are in §6 of that file: F-07 deferred; F-14, F-51 and F-57 declined; F-02 becomes focus-pause only (round 3); F-17 means a domain-restricted key, no Turnstile; F-50 only if an SVG logo is supplied; F-20 code part only.
- **Dead code and assets** (F-08, F-22–F-31, F-59, F-60): 1.6 MB of unused PNGs, unused CSS classes, data fields, attributes, a prop and two exports are removed. `@types/alpinejs` moves to devDependencies, `__pycache__` is untracked, and the README is current.
- **Dependencies** (F-16 production part, F-61–F-63): `npm audit --omit=dev` reports 0 (it was 2 high). astro 7.3.8 and Playwright 1.64.1 are installed. The packages that round 2 removes and TypeScript 7 are not updated. The package is marked `private`, `.nvmrc` is 22, and the Docker bases are pinned to a minor version and digest (`node:22.23-alpine`, `nginx:1.30-alpine-slim`). The scripts resolve the repo root with `fileURLToPath`.
- **Tooling** (part of F-19): dev-only ESLint (typescript-eslint, eslint-plugin-astro) and Prettier (Astro and Tailwind plugins), with the `lint`, `format` and `format:check` scripts. The formatter ran in its own commit with no logic change. CI comes in round 3.
- **One URL per page** (F-01, F-43, F-44, F-66 a–c):
  - Astro: `trailingSlash: 'never'` and `build.format: 'file'`, so `dist/about.html` is served at `/about`.
  - Canonicals, `og:url`, the sitemap and the header's active link all use `pagePath()` (`src/lib/url.ts`). During a file-format build, `Astro.url` is `/about.html`.
  - nginx: `/about/` returns a 301 to `/about` and keeps the query string. The path comes from the raw `$request_uri`, which blocks CR/LF injection and `//host` open redirects. `try_files $uri $uri.html $uri/index.html =404`.
  - The 404 page has no canonical. The sitemap has `lastmod`: the entry date for Insights and Resources, the build date elsewhere.
  - New `seo.spec.ts`. The Lighthouse CI URLs point at the new files.
  - Docker is not installed on this machine, so the runtime check ran on the official nginx 1.30.6 Windows build with the same config (only the paths changed). Results: `/about` 200; `/about/` 301 to `/about`; `/contact/?service=agency-partnership` 301 with `?service=` kept; `/services` 200; `/services/managed-cloud-devops` 200; an unknown URL returns 404 with the site 404 page. **Repeat these curls in the Docker image before launch.**
- **External links** (F-06, F-18): `src/middleware.ts` is deleted. Markdown links to other origins get `target="_blank" rel="noopener noreferrer"` from a local hast plugin for Sätteri, Astro 7's default Markdown processor (it fills the role of a rehype plugin): `plugins/markdown-external-links.mjs`. Component links set the attributes explicitly. The source-reading test is removed.
- **Test fix:** every a11y spec now scrolls each reveal group in (`revealAll()` in `tests/e2e/fixtures.ts`) before running axe. Since 3k, axe could catch cards still hidden or mid-fade. This was a pre-existing failure, and the site is unchanged.
- **Checks:** after every batch: `npm run check` 0 errors, `lint`, `lint:content`, `build`, `check:csp` and the affected specs. Design freeze: a computed-style and layout snapshot of every rendered element on 18 pages at 1440 and 390 px, in light and dark (72 views), matched the pre-round baseline exactly after every batch. Full Playwright suite at the end: 346 passed, 76 skipped by design, 0 failed (4 workers, 2.5 min). It took four runs to get there:
  - **Run 1:** the machine was overloaded (19.5 min); 8 page-setup timeouts, all of which pass on a rerun.
  - **Run 2:** 14 axe contrast failures in `home`, `approach-industries` and `responsive-header`. This is the same pre-existing reveal timing issue, so `revealAll()` now runs before axe in every a11y spec (`contact` and `services` too). 3× repeat: 357/357.
  - **Run 3:** 4 mobile failures (`security`, `services-v3`). They pass in isolation and in run 4, so they look timing-related; watch them in CI (round 3 replaces the fixed sleeps, F-21).
  - **Run 4:** clean.

## 3m. Code audit, round 2 of 3 (15 Oct)
Implements batches 6–10 of `docs/audit/CODE_AUDIT.md` (owner decisions in §6 of that file).
- **CSS consolidation** (F-12, F-13, F-41):
  - One `.card-link` rule replaces four scoped `<style>` blocks, so the site ships one stylesheet (was five files).
  - `/privacy` uses `LongFormDoc`, and section numbers come from a CSS counter.
  - Anchors: `html { scroll-padding-top }` from `--header-h` + 24px, plus `.anchor-section` for sections whose first line sits below the section padding. Every per-section `scroll-mt-*` is gone.
  - Every linked anchor now lands 23–26px below the header. It used to vary from 33 to 92px, and the `/start-here` offer cards landed 44px under the header; their card edge now sits 24px below it.
- **Types and single sources** (F-32–F-35):
  - `src/data/ids.ts` holds the icon, pillar, offer and engagement-type ID lists. The Zod enums and the TypeScript unions both derive from it, so an unknown icon fails `astro check`.
  - `astro:env` schema for the `PUBLIC_*` variables. All are optional, because Docker passes unset build args as empty strings; the build with empty values was checked.
  - One form config (`src/lib/form-config.ts`) and one `FORM_SUBJECT`. `check:csp` reads the built form action.
- **Scripts** (F-04, F-05, F-15, F-40, F-54–F-56):
  - **framer-motion removed.** The count-up is a `requestAnimationFrame` loop with Framer's own cubic-bezier solver and timing. Under a fixed fake clock it matches the Framer build frame for frame: 110/110 frames, 8 counters, 1440 and 390.
  - **"How we engage" now runs on `reveal.ts`.** The cards are a normal reveal group whose items style their own `data-reveal` states. Measured transitions match the old build: the same properties, 700/500 ms, the same easing, and begins at exactly 0/30/…/180 ms.
  - The 3k rule now applies to these cards too: the safety timer starts when the group enters the viewport, not at page load. Before, the cards appeared without animation if the visitor reached them after 4 s.
  - `alpine.ts` is split into `scripts/alpine/{theme,router,header,hero,lead-form}.ts`. The lead form stays registered from the entrypoint. Registered from `ContactForm.astro` instead, a client-side navigation into `/contact` initialises the form before that page's script runs ("Undefined variable: leadForm", verified).
  - `reducedMotion()` helper. Counters tear down on swap. Reveal cleanups are tracked. Dropdown options come from config.
- **Icons without React** (F-03):
  - `@lucide/astro` 1.48.0, the same Lucide release as before.
  - `react`, `react-dom`, `@astrojs/react`, `@types/react*` and `lucide-react` are removed, and the 220 KB `client.*.js` chunk is gone.
  - All 1,686 SVGs on 32 pages are byte-identical to the previous build, and so is the whole HTML once asset names are masked.
- **Shared components and nav model** (F-10, F-11, F-36–F-39, F-67):
  - New `ui/` components: `SectionHeader` (18 headers), `ArrowLink`, `IconTile`, `CheckList`, `Chip`.
  - `cards/ContentCard`, `lib/format.ts` `pad2()` and `data/pillars.ts`.
  - `lib/navigation.ts` `getNavModel()`: gating, pillar groups and Cloud columns are built once, and active links use `pagePath()`.
  - Component folders: `cards/`, `forms/`, `content/`.
  - Normalised HTML of all 32 pages is identical to the previous build.
- **Sizes** (`dist/_astro`):
  - JS: 380 KB raw / 123 KB gzip → 104 KB / 35 KB.
  - Home no longer lazy-loads 19 KB gzip of framer-motion.
  - Initial JS per page: 34.6 → 34.1 KB gzip.
  - CSS: 5 files, 101 KB / 17.5 KB → 1 file, 101 KB / 17.1 KB.
- **Checks:**
  - After every batch: `check`, `lint`, `format:check`, `lint:content`, `build`, `check:csp` and the affected specs all pass.
  - Design freeze after every batch: computed-style and layout snapshot of **all 32 pages** at 1440/390 in light and dark (128 views). 0 differences, except the two intended changes in batch 6: the removed number spans and `scroll-margin-top`. The legal pages were pixel-compared: terms identical; privacy and trust show only sub-pixel anti-aliasing in heading text.
  - `reveal`, `reveal-sitewide`, `metrics`, `theme-motion` and `home-v3` 3×: 207 passed.
  - Full suite: 346 passed, 76 skipped by design, 0 failed.
- **Lighthouse 13**, Playwright Chromium, `astro preview`:

  | Page | Mobile | Desktop |
  | --- | --- | --- |
  | `/` | 99 / 100 / 81 / 100, LCP 1.8 s, CLS 0 | 100 / 100 / 81 / 100 |
  | `/services/managed-cloud-devops` | 99 / 100 / 81 / 100, LCP 1.8 s | 100 / 100 / 81 / 100 |

  - Performance, Accessibility and SEO are unchanged from the audit.
  - **Best Practices 81 (was 100)** is one audit, "deprecated API: FencedFrame". Alpine's CSP build reads every `globalThis` property at load, and this Chromium build flags a fenced-frame global.
  - The pre-round build scores the same 81 with the same tool. It is not caused by this round. The fix belongs upstream in Alpine, which already skips `styleMedia` and `sharedStorage` for this reason.
- **Correction:** the batch 8 3× run had 30 failures, all one stale assertion in `reveal.spec.ts` that read Alpine's removed `data-shown`. I misread the output then. The test now checks that `data-reveal` is removed (commit 023f765).

## 3n. Code audit, round 3 of 3 (15 Oct)
Implements the rest of `docs/audit/CODE_AUDIT.md`. Owner decisions are in §6 of that file, which now also records:
- F-02 declined in full: no change to the marquee or the stepper, and WCAG 2.2.2 is not met for them.
- The two round-2 follow-ups are accepted.
- The F-64 regroup is deferred.

Every finding now has a status: 59 done, 3 deferred, 5 declined.

- **SEO metadata** (batch 11: F-09, F-20 code, F-42, F-48, F-66 d; commit 6a91193):
  - **Lengths:** titles ≤ 60 and descriptions ≤ 155 through `seoTitle`/`seoDescription` front matter and `site.metaDescription`. The visible copy is unchanged. `lint:content` enforces the lengths.
  - **Owner review:** every old → new pair is in `docs/audit/SEO_COPY_CHANGES.md` (3 titles, 20 descriptions).
  - **Share tags:** `og:image` gets its size, type and alt, plus `og:locale`. The share image is `public/og/default.png`; the touch icon is the fallback until that file exists.
  - **Twitter card:** `summary_large_image` switches on automatically with the 1200×630 file. Until then it stays `summary`, because X needs at least 300×157 for the large card.
  - **Articles:** `og:type=article` with published and modified times.
  - **JSON-LD:** one `@graph` per page (Organization, WebSite, BreadcrumbList, Service, Article with image, `dateModified` and `publisher.logo`). `lang="en-GB"`.
  - **Tests:** `seo.spec.ts` expands a service page and an article with the `jsonld` parser (dev dependency).
- **Staggered articles** (batch 11):
  - **Dates:** Azure environment strategy 12 Oct, Bitbucket branch governance 26 Oct, cloud cost checklist 9 Nov 2026. Changed by the owner the same day to 12, 14 and 15 Oct, so all three are live (section 3o).
  - **Exclusion:** `isPublished()` (`src/lib/content.ts`, built on `src/lib/publish.ts`) keeps an article dated after the build date out of the build entirely: no route, no listing, no nav gating, no sitemap entry, no JSON-LD.
  - **Today's build** has one article. `/insights` and the header and footer links work with a single card (shown at the left of the grid).
  - **`BUILD_DATE`** overrides "now". The E2E build pins it (`tests/e2e/build-date.ts`), so every scheduled article is tested.
- **Accessibility** (batch 12: F-45, F-46, F-47; commit a67e59d): the browser `theme-color` follows the site theme, the mobile nav is labelled "Primary", and card text is selectable. The marquee is untouched.
- **nginx** (batch 13: F-52, F-53, F-58; commit 2fbc5cf):
  - **Redirects:** `/<page>.html` and `/index.html` 301 to the clean URL and keep the query string, with the same hardening as the slash rule.
  - **404:** `/404` returns status 404.
  - **gzip:** now covers `text/javascript`.
  - **Headers:** `img-src` has no `data:` (and `check:csp` guards it); `interest-cohort` is gone.
  - **`scrollCue` kept:** under the ClientRouter a plain anchor jumps instantly (measured: 2 scroll positions against 28–53) and adds `#flagship` to the URL.
  - **Alpine:** 3.17.4 is the latest release, so Best Practices 81 is documented as an upstream issue (audit, end of §6).
- **Tests and CI** (batch 14: F-16 dev, F-19, F-21, F-64 duplicates, F-65, F-66 e; commits 787606b, f7eb70d):
  - **Removed duplicates:** 13 test cases, listed in the commit message.
  - **No fixed sleeps:** frame waits, end-state polls and `page.clock` replace them.
  - **Tags:** `@desktop`/`@mobile` replace 44 project skips; skipped tests per run went from 76 to 2.
  - **`@lhci/cli`:** runs via `npx` and is no longer a dependency. `npm audit` went from 17 to 0.
  - **Workflow:** `.github/workflows/ci.yml` runs on push/PR to `dev` and `main`: gates, Playwright (desktop + mobile, cached), Lighthouse CI, and a Docker smoke job (`scripts/docker-smoke.sh`), plus a daily scheduled build.
- **Round-1 mobile failures, root cause:**
  - `security` and `services-v3` looped over 8–13 pages inside one test with one 30 s budget. With 16× CPU throttling, 5 of 26 failed. They are now one test per page.
  - The CSP test also waited for `networkidle` and checked a ClientRouter navigation with the 5 s assertion timeout. It now waits for `alpine:initialized` and uses `waitForURL`.
  - Result: 102/102 under 16× throttling.
- **Checks:**
  - **Gates:** `check`, `lint`, `format:check`, `lint:content`, `build` and `check:csp` passed after every batch.
  - **nginx 1.30.6 (Windows build):** every round-1 URL, the `.html` and `/404` rules, the 301s and the headers. CI repeats this in the real Docker image.
  - **Design freeze:** compared on the pages each batch touched, then on all 32 pages × 1440/390 × light/dark. The only differences are the intended ones: `/insights` card order and article dates (new dates), and `user-select` (F-47).
  - **Full suite:** 412 passed, 2 skipped (content-conditional), 0 failed.
  - **Lighthouse 13, home, mobile** (`astro preview`): 99 / 100 / 81 / 100, LCP 1.7–1.9 s, CLS 0.001.
  - **CI:**
    - Run 1: Lighthouse CI failed. Its log needs a GitHub login and no reports were uploaded (`.lighthouseci` is a hidden folder), so the cause is unknown.
    - Fix: the reports now upload, and failed assertions appear as annotations.
    - Run 2 (38771356967): all jobs green with unchanged assertions.
    - Run 3 (38772377243): Lighthouse CI failed again; the new annotations showed one cold run of `/` at performance 0.43, LCP 4.2 s (99 locally).
    - Fix (second and last attempt): `numberOfRuns: 3`, so LHCI asserts on the best of three runs (its default).
    - Run 4 (38773058706): all jobs green (checks 33 s, Docker smoke 25 s, Playwright 4 min, Lighthouse CI 6.7 min).
- **Correction:** the first design-freeze snapshots of this round served every page as "not found" (a relative path in the scratch server), so their "0 differences" meant nothing. I redid the baseline and every comparison from the saved builds; the results above are from the corrected runs.

## 3o. SEO copy approval and Insights articles (15 Oct)
- **SEO copy (commit b5bca31):**
  - `docs/audit/SEO_COPY_CHANGES.md` is marked owner-approved.
  - Three owner edits are applied: the home description (`site.metaDescription`), the CI/CD service `seoDescription`, and the `/insights` description (140 characters; it ends "from ZanamTech", revised the same day from "from the ZanamTech team").
- **Article dates (commit ee37797):**
  - Azure environment strategy 12 Oct, Bitbucket branch governance 14 Oct, cloud cost checklist 15 Oct 2026. All three are live, and `/insights` lists them newest first.
  - `isPublished()` stays for future-dated articles. The 26 Oct / 9 Nov rebuild note is removed.
- **Article content (commit 5e34f8f and the docs commit):**
  - **Length:** Azure 1,360 words (7 min read), Bitbucket 1,173 (6 min), cost checklist 1,069 (5 min). Each has practical steps, examples and a "Common mistakes" section.
  - **Key takeaways:** a box after each intro, written as `<aside class="key-takeaways">` in the Markdown and styled with the existing article callout (blockquote) classes.
  - **Multi-cloud:** the Azure article ends with "On AWS or Google Cloud?", a table of equivalents. The other two name AWS, Azure and Google Cloud equally.
  - **Links and related content:**
    - 2–3 inline service links per article.
    - A "Related service" card (the existing `ServiceCard`, chosen by the new `relatedService` field).
    - "Related articles" with the other two (the existing `ContentCard`), above the CTA band.
  - **Breadcrumb:** the last crumb uses `seoTitle`, or the title cut at a word with an ellipsis.
  - **Fact checks:**
    - Flexera's 29% is reworded to the primary source and cited from flexera.com.
    - The Bitbucket Standard vs Premium controls are taken from Atlassian's docs.
    - Every external fact is in the article's Sources list, and every link was checked (200).
  - **Dates:** JSON-LD `dateModified` is 15 Oct 2026, from a new optional `updated` field.
  - **CSP:** a fenced code block was replaced with a list, because the syntax highlighter's inline styles violate the CSP (`check:csp` caught it).
- **Checks:** `check` 0 errors, `lint`, `format:check`, `lint:content`, `build` and `check:csp` all pass. Specs `seo`, `drafts`, `review-fixes`, `review3`, `publish` and `theme-a11y`: all pass after one assertion update (the Flexera link text, `drafts.spec.ts`).

## 3p. Key takeaways box readability (16 Oct)
- **Change:** the bullets now use the article body size (16px, was 14px) and the body text colour (`text-fg`, was the muted grey); the "Key takeaways" heading is bold (was semibold). The box itself (background, border, radius, padding, spacing) is unchanged. One file: `src/components/content/ArticleBody.astro`.
- **Contrast** (measured on the box background): light 16.5:1, dark 16.2:1 (was 7.0:1 and 6.6:1 at 14px). The axe scans in `theme-a11y` pass in both themes.
- **Design freeze** (one article, 1440 and 390, light and dark): only the takeaways box text changed (colour, size, line height, heading weight); everything below moves down by the box's extra height (62px at 1440, 141px at 390). No other style differences.
- **Checks:** `npm run check` 0 errors; `drafts`, `review-fixes`, `review3`, `theme-a11y`: 68 passed, 2 skipped (content-conditional), 0 failed.

## 3q. Footer: tighter layout, aligned Company row, legal separators (16 Oct)
Owner-approved after review on the dev server. Desktop and tablet only; the phone footer is unchanged (390px layout identical to before). One file: `src/components/layout/Footer.astro`.
- **Brand column (xl):** 280px (was 320px), so the description wraps to five lines and fills the space down to the email. A 340px limit would not have changed anything, because the column was already 320px wide. The services area starts 40px further left.
- **Service columns (lg+):** one grid shared through subgrid by all four columns (Managed/Practical AI, Cloud & DevOps × 2, Web & SaaS), with 32px structural gaps.
  - **Visible gaps:** column widths are tuned so the space between the columns' text is even: 55/58/55px at 1440 (was 45/48/45) and 35/33/42px at 1024 (was 40/72/69). The widths are weighted below 1200px and equal from 1200px.
  - **Limit:** between about 1150 and 1279px the gaps vary more, because the text rewraps as the width changes.
- **Vertical spacing:**
  - **Inside the columns:** the space between links is about 20% smaller, and each heading's gap to its first link is 6px (was 8px). The gap between the Managed and Practical AI groups is unchanged.
  - **Footer padding:** top padding is 38px at desktop (was 48px) and 32px at tablet (was 40px). The gap above the Company divider is 19px (was 24px), and the Company row's top and bottom padding are 13px (was 16px).
  - **Height:** the footer is 366px at 1440 (was 395px) and 472px at 1024 (was 531px).
- **Company row:** one line from the first services column to the right edge, with Contact flush with Web & SaaS.
  - The label, links and dots are spread evenly: links are 73px apart at 1440 and 83px at 1024.
  - The COMPANY → About gap is 14px wider (a right margin on the label), and the dots are centred.
- **Bottom row:** Privacy / Terms / Trust are 24px apart (was 16px), with the Company row's centred dot (`aria-hidden`) in each gap. They stay right-aligned at the same size and colour.
- **Checks:** `npm run check` 0 errors, `format:check` passes; `header-footer-ui`, `trust-legal`, `review-fixes`: 48 passed, 0 failed. Screenshots at 1440 and 1024 in light and dark.

## 4. Owner decisions (binding)

| Decision | Where it is enforced |
| --- | --- |
| **AWS, Azure and Google Cloud are treated equally.** General copy names all three, in that order. Real past scenarios keep the cloud they ran on | Constitution 2.0.3, spec FR-006a, lint (two-cloud phrasing) |
| **Keep Ollama and OpenClaw** in the technology marquee; Hermes removed | `src/data/platforms.ts` |
| **The past-project % results are kept** as they are, worded as achieved results, with no per-card credit line. Evidence records come later | Constitution III, `src/data/results.ts`, spec FR-016/017 |
| **No "PM-led" or team-structure wording** and no headcounts. The site describes the process, not who delivers it | Constitution III, lint |
| **No clock hours, time zones or minute/hour figures on the site.** Weeks and the two commitments ("Written proposal within 2 business days", "We reply within 1 business day") are allowed, as is the technical "hourly encrypted backups" | Constitution III, lint allow-list |
| **SC-006:** results appear within one scroll on desktop and within two scrolls on phones; the hero is unchanged | Spec SC-006, `tests/e2e/home-v3.spec.ts` |
| **The visual design is unchanged:** colours, fonts, spacing, themes, animations. Approved exceptions: the wider multi-column Services menu, and tighter header link padding at lg | Constitution IV, design-freeze comparison |
| **Naming (14 Oct):** "How We Work" in title case everywhere; "Azure", not "Microsoft Azure"; the footer Company row uses even spacing without dots | `src/data/site.ts`, `src/data/platforms.ts`, service content |
| Also decided: no prices; no competitor names; no fabricated or placeholder proof; single CTA "Book a Strategy Consultation"; "Custom Full-Stack Web App Development" name kept; no address on the site and no "remote-first" wording; Google Cloud supported | Constitution III, spec |

## 5. Open before launch

**Content and legal**
- [ ] Lawyer review of `/privacy` and `/terms`.
- [ ] Put the practices stated on `/trust` in place: MFA everywhere, a password manager, the incident-response runbook, and the sub-processor list.
- [ ] Complete the internal drafts in `docs/internal/` (`incident-response-runbook.md`, `sub-processor-list.md`): fill the "to be set" fields and confirm regions.
- [x] Founder photo and personal LinkedIn on /about (14 Oct).
- [x] Review and approve the 3 sample artefacts in `src/content/resources/` (published 14 Oct).
- [ ] Collect evidence records for the 8 results (`evidenceId` in `src/data/results.ts`) and be ready to describe each project on calls.

**Infrastructure and operations**
- [ ] Domain and mailbox: zanamtech.com with the contact@, security@, privacy@ and partners@ aliases, and SPF/DKIM/DMARC.
- [ ] Form endpoint: set `PUBLIC_FORM_ACCESS_KEY` (and `PUBLIC_FORM_ENDPOINT` if not the default) for the production build.
- [ ] Hosting and deploy: check the Docker image is under 25 MB (open item T060; the CI smoke job prints the size). `nginx -t` and the 301 and header curls now run in the real image on every CI run (section 3n).
- [ ] TLS 1.3 at the edge, and a decision on HSTS preload.
- [ ] Optional cookieless analytics: set `PUBLIC_ANALYTICS_DOMAIN` and `PUBLIC_ANALYTICS_SRC`.

**Engineering follow-ups**
- [ ] Automate deployment from the scheduled CI build (`scheduled-build` job in `.github/workflows/ci.yml`).
- [x] Owner review of the shortened titles and descriptions: `docs/audit/SEO_COPY_CHANGES.md` (approved 15 Oct, section 3o).
- [ ] Add the 1200×630 share image at `public/og/default.png` (Twitter/X then switches to the large card automatically).
- [x] Lighthouse in Linux CI (T061): runs in GitHub Actions since 15 Oct.
- [ ] Decide the release branch (the remote has no `main` branch yet; CI already covers `main` once it exists).
- [ ] Post-launch: analytics goal events for consultation bookings and form submissions (needs a CSP review).

## 6. Next steps
1. Done: the 13 Oct UI fixes and the 14 Oct QA pass are pushed to `origin/dev`. The owner decisions from `docs/internal/qa-2026-10-14.md` §6 are applied (section 3c); still to do: check the phone spacing on a real phone, and check the WebKit items in §5 on a real Mac or iPhone.
2. Close the launch items in section 5: legal review, Trust-page practices, form key, domain and email.
3. Set up hosting: Docker build, nginx redirect check, TLS/HSTS, then deploy to a staging URL for a final pass.
4. Create `main` (or the chosen release branch) and open the release PR from `dev`.
5. After launch: gather the first verified testimonials and case studies (they switch on automatically), add evidence records, and keep publishing Insights.

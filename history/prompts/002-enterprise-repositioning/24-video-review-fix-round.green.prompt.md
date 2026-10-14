---
id: 24
title: Video review fix round
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: fix round from the full-site video review (12 sections)
labels: ["contact", "header", "reveal", "layout", "services", "insights", "about", "legal", "spacing"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/ContactModal.astro (deleted)
 - src/components/ContactForm.astro
 - src/scripts/alpine.ts
 - src/scripts/reveal.ts
 - src/styles/global.css
 - src/layouts/BaseLayout.astro
 - src/components/layout/Header.astro
 - src/components/layout/Footer.astro
 - src/components/ui/Button.astro
 - src/components/sections/AgencyPartners.astro, ArticleBody.astro, CtaBand.astro, EntryOffers.astro, Hero.astro, PageHero.astro, PillarGrid.astro, ServiceCard.astro
 - src/content/services/*.md (13 files)
 - src/data/leadership.ts, managed-tiers.ts, offers.ts, platforms.ts, site.ts
 - src/assets/team/mubashir.jpg (moved from public/images/team/)
 - src/pages/about.astro, approach.astro, contact.astro, index.astro, privacy.astro, terms.astro, trust.astro
 - src/pages/insights/[...slug].astro
 - src/pages/services/index.astro, [slug].astro
 - tests/e2e/approach-industries, contact, navigation, offers-approach, security, services-v3, services specs
 - tests/e2e/review-fixes.spec.ts (new)
 - specs/002-enterprise-repositioning/spec.md, plan.md, tasks.md
 - docs/PROGRESS.md
 - README.md
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - npm run check:csp (pass)
 - Affected Playwright specs (contact, navigation, offers-approach, security, approach-industries, trust-legal, services-v3, services, home-v3, home, reveal, header-footer-ui, drafts, review-fixes, responsive-header, touch-menu, theme-a11y), desktop + mobile projects: 251 passed, 55 skipped by design, 0 failed
---

## Prompt

Read docs/PROGRESS.md first. This is a fix round from a full-site video review. Work on the dev branch. Keep design, colours and animations style unchanged unless stated. Do NOT add new images/illustrations except the founder photo (images come in the next round).

TESTING (save usage): run only tests affected by your changes + npm run check + npm run lint:content + npm run check:csp. No full cross-browser sweep.

=== 1. CONTACT: one path everywhere ===
- Remove the consultation modal completely (component, open/close script, triggers, related tests).
- Every "Book a Strategy Consultation" button (header, CTA bands, service pages, articles) and footer "Contact" → link to /contact.
- Context buttons pass a query param that preselects "Service needed", e.g. "Discuss an agency partnership" → /contact?service=agency-partnership; service-page CTAs → /contact?service=<service-slug>. On /contact read the param on load and preselect the matching option; unknown values are ignored. No state persists between visits.
- Contact page bug: "Write tocontact@zanamtech.com" → missing space; render "Write to contact@zanamtech.com".
- Update the spec/tasks + tests that referenced the modal.

=== 2. HEADER / NAV ===
- Glass header: purple elements (CTA buttons, step badges) bleed through as purple smudges when scrolled under it. Make the header background more opaque (light ≈ rgba(255,255,255,0.88), dark equivalent) while keeping a subtle blur. Verify on /approach, /about, /industries, /trust.
- When the mega-menu opens, a purple hover/glow pill smears behind "How We Work / Insights / About". Remove that glow; the hover state applies only to the hovered item.
- Mega-menu must close immediately on link click and on page navigation (astro:before-preparation / before-swap), so it never overlaps the page transition.

=== 3. REVEAL ANIMATION ===
- "How we engage" (home) and "Four phases" (/approach): cards still appear one by one while scrolling (03 faded, 04 invisible). Change to group reveal: observe the grid container; when it enters, reveal all cards with max 60ms stagger (total < 300ms). Apply the same to every card grid that uses the stagger.

=== 4. GRIDS WITH EMPTY SLOTS ===
- 5-card sets ("Low-risk ways to start", "Engagement models"): desktop = 3 on first row + 2 centred on second row (no empty left-aligned slot).
- /services "Managed Cloud & DevOps": single card → full-width horizontal flagship card (short description + 3–4 included items + link).
- /services "Practical AI & Automation": 2 cards → 2-column grid filling the row.
- Related services on every service page: always exactly 3 cards (add cross-pillar picks where a pillar has fewer). Remove the catalogue numbers (09/10/11) from related cards.

=== 5. REPETITION ===
- "Low-risk ways to start": keep the full section only on /start-here. On home and /services replace it with a compact one-row strip (offer names + durations) and a "See all entry offers" link.
- "Enterprise-grade · High-availability · Zero-trust security" chips: keep in the hero only. Remove from the footer. On /about replace "What we stand for" with 3 real values: "Verified outcomes", "Documented, accountable delivery", "Privacy by design".

=== 6. HOME ===
- Tech marquee: remove "Claude Code"; rename "Windows" → "Windows Server". Keep the rest.
- Managed Cloud & DevOps pillar card: instead of one link with the same name, list 3–4 included items (monitoring & alerting, patching & backups, cost & security reviews, monthly service report) linking to the flagship page. No response times anywhere.

=== 7. SERVICE PAGES (all 13) ===
- FAQ: 4–5 questions each (currently 2). Add relevant questions such as: how pricing/scope is set (proposal + SOW, no public prices), typical timeline, what access you need and how it is secured, what happens after delivery, which clouds (AWS, Azure, Google Cloud equally). Keep the FAQ animation. Must pass lint:content (no banned phrases, no response times, no "remote-first", no "PM-led"/"direct senior access").
- "How you can engage" box: show the 2–3 applicable engagement models as chips, each linking to /approach#engagement-models.

=== 8. INSIGHTS ARTICLES ===
- Move the date into a hero meta line: "By Mubashir Ahmed · Founder & Lead Architect · <date> · <n> min read" (author links to /about). Remove the separate date row and its gap. Add author to Article JSON-LD.
- Desktop reading layout: body column max ~720px, centred, or a sticky "On this page" TOC on the right built from H2s. No empty right half.

=== 9. ABOUT ===
- Founder card: add photo from public/images/team/mubashir.jpg (if missing, a styled initials avatar "MA" and a TODO in PROGRESS.md) and a LinkedIn icon link to "https://www.linkedin.com/in/mubashir-ahmed-088800174" (rel="noopener", aria-label). Use the card width properly (photo left, text right).
- Heading "Pragmatic Enterprise First" → "Pragmatic, enterprise-first".
- Move the time-zone line ("time-zone overlap across North America, the UK and Europe, and the GCC") out of the tiny caption into normal body text.

=== 10. START HERE ===
- Normalise duration badges to one format: "1–2 weeks", "2–3 weeks", "2 weeks", "3–4 weeks" (replace "about 4 weeks").

=== 11. TRUST / LEGAL / security.txt ===
- /trust section 07: remove the visible "security.txt" link/sentence; keep only the security@zanamtech.com email. Keep the file /.well-known/security.txt itself (do not delete it), and make sure it is not linked anywhere in the visible site.
- Ensure /trust and /terms show the breadcrumb like /privacy (not hidden under the header).
- Ensure /privacy and /terms show a "Last updated: <date>" line under the title.

=== 12. SPACING ===
- Reduce the gap between the final CTA band and the footer by ~40%.

=== FINISH ===
- Run the light tests listed above; fix failures.
- Update docs/PROGRESS.md (what changed, open TODOs incl. founder photo if missing), add a PHR, commit on dev with a clear message, push.
- Reply with a short list: what changed, anything skipped and why.

## Response snapshot

All 12 sections implemented. Dialog removed; CTAs link to /contact with ?service= preselection (also after client-side navigation). Header bar 0.88 opacity with an 8px blur; mega-menu closes on link click and when a navigation starts. Step cards reveal as one group; stagger capped at 60ms everywhere. `.cards-centred` for 5-card sets and the 7-card Cloud pillar; Managed feature card; AI two-up; related services always 3 without numbers. Compact offers strip on Home and /services. Footer chips removed; About values, photo (optimised via astro:assets), LinkedIn icon, heading and time-zone line. 5 FAQs per service; engagement chips. Insights meta line, Article JSON-LD, 720px column + sticky TOC. Legal "Last updated", security.txt link removed. CTA-footer gap −40%. The purple nav glow could not be reproduced after the header opacity change.

## Outcome

- ✅ Impact: every review item addressed in one commit.
- 🧪 Tests: check, lint:content, check:csp pass; 17 affected specs + new review-fixes spec: 251 passed, 0 failed.
- 📁 Files: see list above.
- 🔁 Next prompts: images round; company LinkedIn URL.
- 🧠 Reflection: the form must re-read ?service= on astro:page-load, since Alpine can initialise before the router updates the URL.

## Evaluation notes (flywheel)

- Failure modes observed: preselect failed after client-side navigation (fixed); a test selector counted connector divs (fixed).
- Graders run and results (PASS/FAIL): check PASS, lint:content PASS, check:csp PASS, Playwright PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

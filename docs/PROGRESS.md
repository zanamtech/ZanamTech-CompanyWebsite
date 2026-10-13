# ZanamTech Website: Progress Report

**Branch:** `dev` · **Spec:** `specs/002-enterprise-repositioning/` · **Source of truth:** `docs/03_Master_Plan_v3.md`
**Constitution:** v2.0.3 (`.specify/memory/constitution.md`) · **Updated:** 2026-10-13

## 1. Status at a glance

| Item | Status |
| --- | --- |
| Spec 002 (Master Plan v3 repositioning) | ✅ Complete: 119 of 119 tasks across Phases 0–5 |
| UI fixes (menu, footer, focus rings, header) | ✅ Complete |
| UI fixes, round 2 (scroll cue, menu badge, card illustrations, FAQ animation, footer Company row) | ✅ Complete (13 Oct) |
| Quality gates | ✅ `npm run check` 0 errors / 0 warnings · `lint:content` pass · `check:csp` pass · Playwright + axe all green |
| Performance (Lighthouse, local, production build) | ✅ 12 pages: Performance 97–99; Accessibility, Best Practices, SEO 100; LCP ≤ 2.2 s; CLS ≤ 0.001. Rechecked 13 Oct on `/`, `/insights` and one article: 98–99 / 100 / 100 / 100, CLS 0.001 |
| Pushed to `origin/dev` | All of spec 002 and both rounds of UI fixes, including the 13 Oct follow-ups (section 3a) |

## 2. What was completed in spec 002

### Governance (Phase 0)
- **Constitution:** amended to v2.0.0, then patched to 2.0.1, 2.0.2 and 2.0.3.
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
- **Drafts:** 3 Insights articles, now approved and published, and 3 sample artefacts, still drafts.

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
  - The footer never says "remote-first".
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
| Also decided: no prices; no competitor names; no fabricated or placeholder proof; single CTA "Book a Strategy Consultation"; "Custom Full-Stack Web App Development" name kept; remote-first with no address on the site; Google Cloud supported | Constitution III, spec |

## 5. Open before launch

**Content and legal**
- [ ] Lawyer review of `/privacy` and `/terms`.
- [ ] Put the practices stated on `/trust` in place: MFA everywhere, a password manager, the incident-response runbook, and the sub-processor list.
- [ ] Complete the internal drafts in `docs/internal/` (`incident-response-runbook.md`, `sub-processor-list.md`): fill the "to be set" fields and confirm regions.
- [ ] Add LinkedIn URLs (personal and company) and a photo in `src/data/leadership.ts`. They stay hidden while empty.
- [ ] Review and approve the 3 sample artefacts in `src/content/resources/` (set `draft: false`).
- [ ] Collect evidence records for the 8 results (`evidenceId` in `src/data/results.ts`) and be ready to describe each project on calls.

**Infrastructure and operations**
- [ ] Domain and mailbox: zanamtech.com with the contact@, security@, privacy@ and partners@ aliases, and SPF/DKIM/DMARC.
- [ ] Form endpoint: set `PUBLIC_FORM_ACCESS_KEY` (and `PUBLIC_FORM_ENDPOINT` if not the default) for the production build.
- [ ] Hosting and deploy: build the Docker image (check it is under 25 MB; open item T060 from spec 001) and run `nginx -t` to validate the 301 redirects.
- [ ] TLS 1.3 at the edge, and a decision on HSTS preload.
- [ ] Optional cookieless analytics: set `PUBLIC_ANALYTICS_DOMAIN` and `PUBLIC_ANALYTICS_SRC`.

**Engineering follow-ups**
- [ ] Run Lighthouse in Linux CI (`npm run lhci` cannot start Chrome on Windows; it is currently run locally with Playwright's Chromium). Open item T061 from spec 001.
- [ ] Push the latest `dev` commits, and decide the release branch (the remote has no `main` branch yet, so no PR can be opened).
- [ ] Post-launch: analytics goal events for consultation bookings and form submissions (needs a CSP review).

## 6. Next steps
1. Done: the 13 Oct UI fixes are pushed to `origin/dev`.
2. Close the launch items in section 5: legal review, Trust-page practices, LinkedIn and photo, form key, domain and email.
3. Set up hosting: Docker build, nginx redirect check, TLS/HSTS, then deploy to a staging URL for a final pass.
4. Create `main` (or the chosen release branch) and open the release PR from `dev`.
5. After launch: gather the first verified testimonials and case studies (they switch on automatically), add evidence records, approve the samples, and keep publishing Insights.

# ZanamTech Website: Full Code Audit

**Date:** 2026-10-15 · **Branch:** `dev` (HEAD `a9c640b`) · **Scope:** `src/`, `public/`, `scripts/`, `tests/`, `nginx/`, config files, `package.json`
**Mode:** report only. No code, config, content or design was changed. No dependency was installed.

**How this was checked**
- Every tracked file outside `history/`, `specs/`, `.specify/` and `.agents/` was read.
- `npm run build`: passes, 32 pages, 1 warning (empty `case-studies` glob).
- `npx astro check`: 0 errors, 0 warnings, 2 hints (unused `page` parameters in tests).
- `npm audit` and `npm outdated` were run.
- `npx knip@5` was run. It gives false positives for `alpine.ts` and `@alpinejs/csp`, which are wired through `astro.config.mjs`. Each result was checked by hand.
- A script parsed every built HTML page: title and description length, H1 count, heading order, canonical, OG tags, JSON-LD, duplicate IDs, and every internal link and `#anchor`.
- Lighthouse 13 ran on `astro preview` with Playwright's Chromium.
- Temporary output went to the session scratchpad, not the repo. `package.json` and `package-lock.json` are unchanged.

---

## 1. Summary

### Counts by severity

| Severity | Count |
| --- | --- |
| Critical | 0 |
| High | 2 |
| Medium | 19 |
| Low | 46 |
| **Total** | **67** |

### Top 10 issues

1. **F-01 (High):** URL form is inconsistent.
   - Canonicals and the sitemap use a trailing slash (`/about/`), but all 2,590 internal links use none (`/about`).
   - nginx and `astro preview` answer both forms with 200, so every page has two live URLs.
2. **F-02 (High):** the technology marquee and the hero "Engagement blueprint" stepper move on their own forever.
   - Only a mouse hover pauses them. Keyboard and touch users cannot (WCAG 2.2.2, level A).
3. **F-03:** React, `react-dom`, `@astrojs/react` and `lucide-react` exist only to print static SVG icons at build time.
   - The build also writes an unused 220 KB React client chunk.
4. **F-04:** `framer-motion` (19 KB gzip, home only) now does a single job: the results count-up.
5. **F-05:** `processReveal` in `alpine.ts` is a second copy of the reveal engine (`reveal.ts`), with its own observer, watchdog and safety timer.
6. **F-06:** `src/middleware.ts` rewrites the whole HTML of every page with regular expressions to add `target="_blank"`.
   - It is fragile, and it only takes effect after a dev-server restart.
7. **F-08:** six unused PNGs (1.6 MB) in `public/assets/` ship in `dist/` and in the Docker image.
8. **F-09:** meta descriptions run over about 160 characters on 17 of 31 indexable pages (home: 242), and titles run over 60 on 4 pages.
9. **F-10 / F-11 / F-12:** markup is duplicated heavily.
   - Section header: about 20 copies.
   - Header and Footer service grouping: 2 copies.
   - Stretched-link cards: 4 copies, each with its own scoped `<style>`, which becomes a separate CSS request.
10. **F-19:** there is no linter, no formatter and no CI pipeline. All the gates (`check`, `lint:content`, `check:csp`, Playwright, Lighthouse) run only by hand.

### Overall verdict

The codebase is in good shape.
- **Strict and clean:** strict TypeScript with no `any`, a strict CSP enforced by a build gate, and a non-root nginx image.
- **Fast, measured on 15 Oct:** Lighthouse 99–100 for Performance and 100 for Accessibility, Best Practices and SEO on both tested pages; LCP ≤ 1.8 s on mobile; CLS 0.001.
- **Clean output:** no broken internal links or anchors, no duplicate IDs, no duplicate titles or descriptions, and exactly one H1 per page with no skipped heading levels.

Nothing is critical. The two High items are the URL inconsistency and the auto-moving content. Most of the remaining work is consolidation:
- Remove three single-purpose dependencies.
- Merge two duplicate scripts.
- Extract about six small shared components.
- Add tooling and CI.

None of that needs a design change. Where a recommendation would change how something looks or moves, the "Design impact" column says so.

---

## 2. Findings

Columns: **Sev** = Critical/High/Medium/Low · **Cat** = A–K from the brief · **Effort** = S (< 1 h) / M (half a day) / L (a day or more) · **Status** after the three implementation rounds (15 Oct 2026): done, deferred or declined.

**Status totals:** 59 done, 3 deferred (F-07, F-49, F-50) and 5 declined (F-02, F-14, F-17, F-51, F-57). Two done items have a deferred part: the F-20 share-image asset and the F-64 regroup by feature.

### High

| ID | Sev | Cat | File:line | Problem | Why it matters | Recommended fix | Effort | Design impact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-01 | High | E, F | `astro.config.mjs:12`, `src/layouts/BaseLayout.astro:24`, `nginx/nginx.conf:82` | `trailingSlash: 'ignore'` with the default `build.format: 'directory'`. Canonicals and sitemap entries end in `/` (`https://www.zanamtech.com/about/`). Every internal link (2,590) has no slash. nginx `try_files $uri $uri/index.html …` serves `/about` and `/about/` both with 200, with no redirect. | Two live URLs per page. Internal links all point at the non-canonical form, which sends mixed signals and wastes crawl budget. This is the main thing between the site and "perfect SEO". | Pick the slash-less form, which matches every link and the nginx redirect targets. Set `trailingSlash: 'never'` and `build: { format: 'file' }`; canonical, sitemap and `Astro.url` then become `/about`. In nginx, add `rewrite ^/(.+)/$ /$1 permanent;` before `location /` and use `try_files $uri $uri.html $uri/index.html =404;`. Add a test that canonical, sitemap `<loc>` and internal links agree. See §3. | M | none | Done (round 1) |
| F-02 | High | H | `src/components/sections/ProofStrip.astro:17-37`, `src/styles/global.css:90-91, 385-388`; `src/components/sections/Hero.astro:58-63`, `src/scripts/alpine.ts:284-341` | Two rows of the technology marquee loop forever (45 s). The hero stepper advances every 1.8 s, forever. Both pause only on mouse hover. Reduced motion stops them, but keyboard, touch and screen-magnifier users have no way to pause. | WCAG 2.2.2 "Pause, Stop, Hide" (level A): content that moves automatically for more than 5 s needs a mechanism to pause it. The axe and Lighthouse automated checks cannot detect this. | Add one visible pause/play toggle (`<button aria-pressed>`) per moving block, or one toggle for both. As a minimum, also pause on `:focus-within`. The CSS `animation-play-state` and `pause()` already exist, so wiring them to a button is a few lines. See §3. | S | **Yes:** a small pause control becomes visible (owner sign-off, Constitution IV). Pausing on focus alone has no visual impact but does not fully meet 2.2.2. | Declined (owner): no change, WCAG 2.2.2 not met for these two elements |

### Medium

| ID | Sev | Cat | File:line | Problem | Why it matters | Recommended fix | Effort | Design impact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-03 | Medium | A, C | `package.json:22,30-32,43-44`, `astro.config.mjs:4,15`, `src/components/ui/Icon.astro:3-23`, 30+ `.astro` files importing `lucide-react` | React is installed only to render Lucide icons to static SVG at build time. `@astrojs/react` still bundles the React client (`dist/_astro/client.*.js`, 220 KB raw), but no page references it. | Five packages, and a React SSR pass, for static SVG. It slows builds and `npm ci`, and it widens the audit surface. Someone could add `client:*` by mistake and ship React. | Replace `lucide-react` with `@lucide/astro`, the official Lucide package for Astro: same icon names, a build-time `.astro` component and no runtime. Or, with zero dependencies, inline the ~30 used icon paths into `Icon.astro` (Lucide is ISC-licensed). Then remove `react`, `react-dom`, `@astrojs/react`, `@types/react`, `@types/react-dom` and the `react()` integration. Props change from `className` to `class`. | M | none (identical SVG output) | Done (round 2) |
| F-04 | Medium | A, D | `src/scripts/metric-counters.ts:15-33`, `package.json:29` | `framer-motion` is now used only for the results count-up (`animate` + `inView`), after `reveal.ts` dropped it (PROGRESS §3j). The chunk is 53 KB raw / 19 KB gzip, lazy, on home. | A 19 KB library for about 15 lines of work. The README still says it powers the scroll reveal. | Rewrite with one `IntersectionObserver` (threshold 0.6, as now) and a `requestAnimationFrame` loop that applies the same easing (`cubic-bezier(0.16,1,0.3,1)`, 1.4 s). Remove `framer-motion`. | S | none, if the easing curve is reproduced | Done (round 2) |
| F-05 | Medium | A, B, D | `src/scripts/alpine.ts:343-435` vs `src/scripts/reveal.ts:1-164` | `processReveal`, the "How we engage" cards, re-implements the reveal engine: its own `IntersectionObserver`, scroll/pageshow/visibility watchdog, 4 s safety timer and finish-if-scrolled-past logic. Both copies have already needed the same bug fixes twice (3b, 3j). | Two fail-safe engines to keep in sync. The blank-card class of bug was fixed in both places separately. | Extend `reveal.ts` with an opt-in group mode (for example `data-reveal-x="64"` plus a per-item delay attribute for the connectors). Delete `processReveal` and its Alpine bindings in `Process.astro:37-75`. Keep the "done drops all styles" rule. | M | none, if the 30 ms step and the 700 ms slide are kept as attributes | Done (round 2) |
| F-06 | Medium | A | `src/middleware.ts:9-41` | Runs on every page, buffers the whole HTML response and rewrites `<a …>` with regular expressions. It only handles double-quoted `href`. It would also rewrite an `<a` inside a `<script>` or a JSON-LD string. Per PROGRESS §3i it only works after a dev-server restart, and two links already hard-code the attributes because of that. | Fragile string surgery on rendered HTML, and a hidden dev gotcha. In this site only Markdown content can introduce new external links, plus the 3 hard-coded component links. | Handle Markdown in `astro.config.mjs` → `markdown.rehypePlugins` with a ~15-line local rehype plugin (no dependency) that sets `target`/`rel` on absolute links to other origins. Keep the explicit attributes in components (one `ExternalLink.astro` if more appear). Delete the middleware. Keep the existing `review3` test that checks every external link. | S | none | Done (round 1) |
| F-07 | Medium | A | `src/layouts/BaseLayout.astro:84`, `src/scripts/alpine.ts:108-146,161-180`, `src/scripts/reveal.ts:157-161`, `src/scripts/article-toc.ts:37`, `src/scripts/metric-counters.ts:56`, `src/components/layout/Header.astro:35` | The ClientRouter (5.6 KB gzip on every page) only adds the 300 ms fade between pages. To support it, the site carries about 80 lines of glue: carry `.dark` and `data-modality` into the new document, move focus to `<main>`, re-sync the active nav (header is persisted), close menus on 3 events, tear down observers, re-read `?service=` after the swap, and re-run 4 scripts on `astro:page-load`. | Most of the client-side bugs fixed in 3e–3k were in this glue. A static site with full page loads needs none of it. | **Owner decision.** Remove `<ClientRouter />` and use native cross-document view transitions in CSS: `@view-transition { navigation: auto; }` plus the existing `zt-page-out`/`zt-page-in` keyframes and `view-transition-name: site-header`. Then delete the glue, `syncActiveNav`, and the `transition:persist` header. The no-flash theme script already runs on every full load. | M | **Yes:** Firefox does not yet support cross-document view transitions, so Firefox users would see instant navigation instead of the fade. Chromium and Safari keep the same fade. | Deferred until after launch |
| F-08 | Medium | C, G | `public/assets/ZanamTechLogo.png`, `ZanamTechTestLogo{,2,3,4}L.png`, `icon.png` (1.6 MB total); `src/assets/brand/zanamtech-icon.png` (62 KB) | No file in `src/`, `public/` or `dist/*.html` references these. `public/` is copied into `dist/` and into the Docker image. | 1.6 MB of dead weight in every image. The open launch item T060 targets an image under 25 MB. The files are also publicly fetchable test logos. | Delete the six `public/assets/*.png` and `src/assets/brand/zanamtech-icon.png`. Keep originals outside the repo if they are needed for brand work. | S | none | Done (round 1) |
| F-09 | Medium | F | `src/data/site.ts:5-6` (home), `src/content/services/*.md` (`summary` = description), `src/pages/industries.astro:16`, `src/pages/about.astro:65`, `src/pages/approach.astro:15`; insight titles in `src/content/insights/*.md` | Descriptions above ~160 characters: home 242; Industries, Observability and WAF 203–204; Managed 200; 12 more between 162 and 188. Titles over 60 characters: two Insights articles (92 and 89), two samples (64 and 60). Short descriptions: `/terms` (58) and `/insights` (89). Service pages reuse the 220-character card `summary` as the meta description. | Google truncates at about 155–160 characters or 600 px, so the key message gets cut, and long titles lose the brand suffix. | Add an optional `seoDescription` (≤ 155) to the services schema, as `seoTitle` already exists. Shorten the static page descriptions and the site description. For articles, add `seoTitle` to the insights schema, or drop the `| ZanamTech` suffix when the title is over 50 characters. Add a build-time length check in `lint:content`. The wording itself is an owner decision. | S | none (meta only) | Done (round 3) |
| F-10 | Medium | B | Eyebrow + H2 + lead + "View all →" block: `EntryOffers.astro:23-33,71-88`, `PillarGrid.astro:12-27`, `Process.astro:18-33`, `Industries.astro:9-20`, `ResultsBand.astro:9-15`, `Pillars.astro:40-44`, `ArtefactBand.astro:14-21`, `Testimonials.astro:13-16`, `Faq.astro:20-25`, `FlagshipSpotlight.astro:20-22`, `AgencyPartners.astro:21-22`, `about.astro:76-77,159-165,184-191`, `approach.astro:25-28,34-40,57-60`, `services/[slug].astro:176-179,186-190,231-239` | The same markup with the same classes (`<p class="eyebrow">` + `mt-3 text-3xl font-bold text-fg sm:text-4xl` + `mt-4 text-lg text-muted` + an arrow link) is written about 20 times. 26 `class="eyebrow"` occurrences. | A spacing or type change means about 20 edits, and several already drifted (`text-3xl` with or without `sm:text-4xl`, `mt-10` vs `mt-12`). | Add `components/ui/SectionHeader.astro` (props: `eyebrow`, `title`, `lead`, `id`, `link?: {href,label}`, `size?: 'lg' \| 'md'`) and `components/ui/ArrowLink.astro` (the "View all … →" link, about 10 copies). Keep each current visual variant as a prop so computed styles stay identical. | M | none, if each variant is kept as a prop | Done (round 2) |
| F-11 | Medium | B | `src/components/layout/Header.astro:15-26` vs `src/components/layout/Footer.astro:10-20` | Both build the same pillar map (`Object.fromEntries` + cast), the same Cloud & DevOps two-column split, and the same Insights / Case Studies gating against two different lists (`navLinks` + an injected link vs a filtered `companyLinks`). The service list is rendered 4 times per page (mega-menu, mobile drawer, footer desktop, footer phone). | Menu and footer must "use the same grouping" (PROGRESS §3), but nothing enforces it. Gating logic exists twice. | Add `src/lib/navigation.ts` with `getNavModel()`, returning `{ primary, company, legal, pillars, cloudColumns }`. It computes the gating once (`hasPublishedInsights` / `hasVerifiedCaseStudies`). Header and Footer only render. | S | none | Done (round 2) |
| F-12 | Medium | B, G | `ServiceCard.astro:79-85`, `ArtefactCard.astro:38-43`, `CaseStudyCard.astro:32-37`, `pages/insights/[...slug].astro:181-186` | The stretched-link card (`after:absolute after:inset-0` link + `li:has(a:focus-visible)` ring) is repeated, and each copy has its own scoped `<style>`. Astro emits each as a separate 99-byte CSS file: `ArtefactCard.*.css`, `ServiceCard.*.css`, `_..*.css` ×2. Each one is an extra render-blocking request on the pages that use them (Lighthouse lists it under "render-blocking"). | Four copies of one rule, and one extra blocking request on home, `/services` and every service page. | Add one `.card-link` rule (stretched link + `:has(:focus-visible)` ring) to `global.css` `@layer components` and delete the four `<style>` blocks. | S | none | Done (round 2) |
| F-13 | Medium | B, A | `src/pages/privacy.astro:39-64` vs `src/components/sections/LongFormDoc.astro:12-41`; `num()` in `privacy.astro:21`, `terms.astro:17`, `trust.astro:20`, used in every H2 | `/privacy` pastes LongFormDoc's whole wrapper and TOC inline instead of using the component. All three legal pages repeat a `num()` helper and a hand-written `<span>01.</span>` in every heading. | Three copies of the long-form layout. Section numbers are maintained by hand. | Use `<LongFormDoc>` in `privacy.astro`. Number the headings with CSS counters in LongFormDoc (`counter-reset` on the wrapper, `h2::before { content: counter(sec, decimal-leading-zero) ". " }` in the accent colour). Delete `num()` and the spans. | S | none | Done (round 2) |
| F-14 | Medium | A | `src/components/ContactForm.astro:46-83,144-232`, `src/scripts/alpine.ts:451-578` | The five dropdowns are a custom select-only combobox: about 90 lines of markup and about 130 lines of JavaScript (keyboard model, positioning, `aria-activedescendant`), with a hidden native `<select>` as a no-JS fallback. | It is the largest custom widget on the site and a hand-built copy of a native control. It is correct today (APG pattern, tested), but costly to maintain. | **Owner decision.** Use native `<select class="field-input">`. Style the closed control with CSS (`appearance: none` and a chevron background). Where supported, opt into the customizable select (`appearance: base-select`, Chromium) for the open list. Delete the combobox code. | M | **Yes:** the open option list uses the browser's native popup on Firefox and Safari, and a styled one on Chromium. The closed field looks the same. | Declined (owner) |
| F-15 | Medium | C | `src/scripts/alpine.ts` (623 lines) | One module holds the theme store, router glue, header and mega-menu, hero stepper, process reveal, scroll cue and lead form. | It is hard to review, and every page pays for form code that is used only on `/contact`. Tree-shaking cannot split Alpine registrations. | Split into `scripts/alpine/{theme,router,header,stepper,lead-form}.ts`. Keep `alpine.ts` as the entrypoint that registers them. Register `leadForm` from a `<script>` in `ContactForm.astro` (Alpine starts after module scripts) so the form code only loads on `/contact`. Verify the start order before moving. | M | none | Done (round 2) |
| F-16 | Medium | I | `package-lock.json` (via `astro`/Vite and `@lhci/cli`) | `npm audit`: 19 vulnerabilities (13 high, 4 moderate, 2 low). 17 are in the dev-only `@lhci/cli` chain (`tmp`, `extract-zip`, `basic-ftp`, `puppeteer-core`, `uuid`, …). The production tree has 2 high: `http-cache-semantics` and `source-map-js`, both build-time only, and `npm audit fix` resolves them without breaking changes. | Nothing vulnerable reaches the browser, because the output is static. But the build image runs this code, and the noise hides real alerts. | Run `npm audit fix` (non-breaking) for the 2 production issues. For `@lhci/cli`, the only "fix" is a downgrade to 0.1.0. Instead, run Lighthouse CI in CI only (`npx @lhci/cli@latest autorun`) and drop it from `devDependencies`. | S | none | Done (production part round 1, dev part round 3) |
| F-17 | Medium | I | `src/components/ContactForm.astro:256-260`, `src/lib/lead.ts:112` | The only spam protection is the honeypot. The Web3Forms access key is public by design. | Once launched, the form endpoint can be scripted directly with the public key, so the honeypot does not help. That means junk leads in the inbox. | In the Web3Forms dashboard, restrict the key to the production domain. If spam appears, add Cloudflare Turnstile (or Web3Forms' hCaptcha), which needs CSP additions to `script-src`, `frame-src` and `connect-src`, and a `check:csp` update. Keep the honeypot. | S | Turnstile can run invisible; a visible challenge would be a design change | Declined (no Turnstile); the owner restricts the form key to the domain at launch |
| F-18 | Medium | J | `tests/e2e/review4.spec.ts:6-16` | This test reads `about.astro` and `Footer.astro` source text and regex-matches the `<a>` tag. | It breaks on any harmless refactor (moving the link into a component, changing attribute order, or F-03's prop rename), and it proves nothing about the rendered page. `review3.spec.ts:27` already checks the rendered DOM for every external link. | Delete the source-reading block. If the dev-server case still needs a guard, assert on `dist/about/index.html` or the rendered DOM. | S | none | Done (round 1) |
| F-19 | Medium | K | `package.json:8-18`, repo root (no `.github/`, no ESLint or Prettier config) | No linter, no formatter config (Prettier is only a transitive dependency of `@astrojs/check`), and no CI. The quality gates exist but run only when someone remembers. PROGRESS lists LHCI on Linux CI as an open item (T061). | Regressions can be pushed without anyone noticing. Formatting already varies (for example `Process.astro:37-81` and `ServiceCard.astro:30-45` have mis-indented blocks). | Add `eslint` + `eslint-plugin-astro` + `typescript-eslint` and a `.prettierrc` with `prettier-plugin-astro` and `prettier-plugin-tailwindcss` (all dev-only), plus `lint` and `format` scripts. Add one GitHub Actions workflow: `npm ci`, `check`, `lint`, `lint:content`, `build`, `check:csp`, Playwright, then `lhci autorun` on Ubuntu. | M | none | Done (tooling round 1, CI round 3) |
| F-20 | Medium | F | `src/layouts/BaseLayout.astro:21,70-76`; `src/pages/insights/[...slug].astro:43-54` | The default OG image is the 180×180 `apple-touch-icon.png`. `twitter:card` is `summary`. There is no `og:image:width`, `og:image:alt` or `og:locale`. Articles are tagged `og:type=website`, with no `article:published_time`. The Article JSON-LD has no `image` or `dateModified`, and no `publisher.logo`. | Shared links show a tiny icon instead of a branded card. Article rich results ask for `image`. | Add one 1200×630 OG image, built with `astro:assets` or a static PNG. Use `summary_large_image`, and add width, height and alt. Give BaseLayout `type` and `publishedTime` props so articles emit `og:type=article`. Complete the Article JSON-LD (`image`, `dateModified`, `publisher.logo`). | S | none on the site (new share image only) | Done (code, round 3). The 1200×630 image asset is deferred to the images round |
| F-21 | Medium | J | `tests/e2e/reveal.spec.ts:46-92`, `reveal-sitewide.spec.ts:42,85`, `home-v3.spec.ts:73`, `review-fixes.spec.ts:37`, `touch-menu.spec.ts:19`, `metrics.spec.ts:35` | 11 fixed `waitForTimeout` sleeps. One is 5 s, one is 1.2 s, and several are timing windows of 16–400 ms. | Fixed sleeps make tests slow, and flaky on slower CI runners. The reveal specs already needed 3× repeat runs to trust. | Replace them with `expect.poll` / `toHaveCSS` / `waitForFunction` on the end state (opacity 1, no `data-reveal`). For "must not happen within N ms" checks, use `page.clock` to advance timers deterministically. | M | none | Done (round 3) |

### Low

| ID | Sev | Cat | File:line | Problem | Why it matters | Recommended fix | Effort | Design impact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-22 | Low | C | `src/styles/global.css:353-358` (`.glass-bar`), `:398-403` (`.text-gradient`) | Two component classes are never used in markup. | Dead CSS. | Delete. | S | none | Done (round 1) |
| F-23 | Low | C | `src/styles/global.css:442-451` | `.field-input` is declared twice in a row. | Split rule, easy to miss. | Merge into one block. | S | none | Done (round 1) |
| F-24 | Low | C | `src/data/site.ts:3` (`legalName`), `src/data/leadership.ts:11-12,26-27` (`photo`, `certifications`), `src/data/offers.ts:14` (`creditsToFollowOn`) | These data fields are never read. The `photo` string is misleading: the real photo is imported in `about.astro:12`. | Dead data that suggests behaviour that does not exist. | Delete them. Keep the certifications idea in the spec, not in the data. | S | none | Done (round 1) |
| F-25 | Low | C | `src/components/sections/AgencyPartners.astro:28`, `src/pages/services/[slug].astro:57` | `data-service` attributes are left over from the removed consultation dialog (3e). Nothing reads them, including the tests. | Dead hooks. | Delete them. | S | none | Done (round 1) |
| F-26 | Low | C | `src/components/sections/FlagshipSpotlight.astro:23,41`, `Pillars.astro:46`, `Industries.astro:22` | `data-reveal-stagger` and `data-reveal-duration` are set, but `reveal.ts` only reads `distance`, `x` and `scale`. Stagger is computed. | Readers believe they tune the animation. They do nothing. | Delete them. If per-group stagger is wanted, support it in `reveal.ts` (see F-05). | S | none | Done (round 1) |
| F-27 | Low | C | `src/components/sections/ServiceCard.astro:8` (`headingLevel` prop never read), `:67` (outcome block rendered then `hidden` on the feature layout) | An unused prop, and markup that ships but is hidden. | Dead API and HTML. | Remove the prop. Render the outcome block only when `!feature`. | S | none | Done (round 1) |
| F-28 | Low | C | `src/components/ContactForm.astro:29,104` | `fieldGrid` is a one-use constant, and `(field, i)` has an unused `i`. | Noise. | Inline them. | S | none | Done (round 1) |
| F-29 | Low | C | `src/scripts/alpine.ts:4` (`export const THEME_KEY`), `src/lib/lead.ts:30` (`export const TIMEOUT_MS`) | Exported but not imported anywhere. The `'zt-theme'` key is also repeated in `BaseLayout.astro:89` (inline, so it cannot import) and in `tests/e2e/fixtures.ts:10`. | Unnecessary public surface. The key is duplicated. | Un-export. Add a comment that names the 3 places the key must match. | S | none | Done (round 1) |
| F-30 | Low | C | `package.json:26` | `@types/alpinejs` is under `dependencies`. | Types are dev-only. | Move it to `devDependencies`. | S | none | Done (round 1) |
| F-31 | Low | C | `.agents/skills/ui-ux-pro-max/scripts/__pycache__/*.pyc` (3 tracked files) | Compiled Python is committed. | Binary noise in diffs. | Add `__pycache__/` to `.gitignore` and `git rm --cached` the files. | S | none | Done (round 1) |
| F-32 | Low | C | `src/components/ui/Icon.astro:47-55`, `src/content.config.ts:36`, `src/data/offers.ts:6` | Icon names are typed as `string`. An unknown name throws only during the build. | The compiler cannot catch typos. | Export `type IconName = keyof typeof icons`. Type `Offer.icon` with it and use `z.enum(iconNames)` in the services schema. | S | none | Done (round 2) |
| F-33 | Low | B, C | `src/data/offers.ts:3` vs `src/content.config.ts:24`; `src/data/engagement.ts:44` vs `src/content.config.ts:39`; `src/lib/services.ts:7` vs `src/content.config.ts:23` | The offer IDs, engagement-model IDs and pillar IDs are each written twice: once as a TypeScript union and once as a Zod enum. | Adding an offer or model in one place silently breaks the other. | Export `offerIds` and `engagementTypeIds` from one module and derive the unions with `(typeof offerIds)[number]`. | S | none | Done (round 2) |
| F-34 | Low | B, A | `src/components/ContactForm.astro:25-26,100`, `src/scripts/alpine.ts:21-22`, `src/lib/lead.ts:124`, `scripts/check-csp.mjs:205` | The form endpoint default and the email subject are each defined 2–3 times. Env variables are read untyped through `import.meta.env`. | The values can drift apart. | Declare `env.schema` in `astro.config.mjs` (`astro:env`: `PUBLIC_FORM_ENDPOINT` as a URL with a default, `PUBLIC_FORM_ACCESS_KEY`, `PUBLIC_SITE_URL`, analytics) for typed, validated access. Export `FORM_SUBJECT` from `lead.ts`. | S | none | Done (round 2) |
| F-35 | Low | B | `tests/e2e/catalog.ts:72-73` vs `src/data/results.ts:27-28` | The results footnote string is copied into the tests. | Two copies of the same text. | Import it from `src/data/results.ts`, which is plain TypeScript with no `astro:` imports. | S | none | Done (round 2) |
| F-36 | Low | B | `src/components/sections/Hero.astro:6-10` vs `Pillars.astro:19-35` | The three brand pillars (label + icon) are defined in two components. | Rename drift. | Move them to `src/data/pillars.ts` (`label`, `icon`, `body`) and use it in both. | S | none | Done (round 2) |
| F-37 | Low | B | `src/pages/about.astro:100` and `src/pages/services/[slug].astro:142` (same 300-character chip class); `.tech-pill` in `global.css:362-374` is nearly the same | The "technology chip" style exists 3 times. | Style drift. | Use one `Chip.astro`, or extend `.tech-pill` with a size variant. | S | none (same computed styles) | Done (round 2) |
| F-38 | Low | B | Icon tile `flex size-12 … bg-brand-cyan/12 text-brand-cyan` (11×); check-list item with `CircleCheck` (16×); `String(n).padStart(2,'0')` (10×) | Small repeated patterns. | Each style change needs many edits. | Add `IconTile.astro` and `CheckList.astro` (`items`, `size`, `tone`), plus a `pad2()` helper or `tabular-nums` with `decimal-leading-zero` counters where the numbers are lists. | M | none | Done (round 2) |
| F-39 | Low | B | `src/pages/insights/[...slug].astro:141-159` vs `ArtefactCard.astro:18-36` | The Insights index card is the ArtefactCard markup with a date instead of badges. | Two copies of the same card. | Use one `ContentCard.astro` (illustration, meta slot, title link, summary, CTA label). | S | none | Done (round 2) |
| F-40 | Low | B | `prefers-reduced-motion` media query in 8 places: `alpine.ts:65,195,291,361,445`, `reveal.ts:112`, `metric-counters.ts:38`, `faq-accordion.ts:11` | The same media query is repeated in each file. | Repetition. | Add `src/scripts/motion.ts` exporting `reducedMotion()`. | S | none | Done (round 2) |
| F-41 | Low | A | `scroll-mt-*` values in `FlagshipSpotlight.astro:17`, `PillarGrid.astro:11`, `ResultsBand.astro:6`, `ProofStrip.astro:9`, `approach.astro:32`, `services/index.astro:27`, `LongFormDoc.astro:14`, `ArticleBody.astro:8`, `insights/[...slug].astro:109` | Eight different header offsets are hand-tuned per section (15.5, 13.5, 11.5, 21, 23, 25, 28, 32). | Magic numbers that must change whenever the header height changes. | Use the platform's `scroll-padding-top` on `html` (one value per breakpoint, or a `--header-h` variable). Delete the per-section `scroll-mt-*`. | S | Minor: anchor landing positions may move by a few px; check against the "eyebrow 24 px below the header" rule | Done (round 2) |
| F-42 | Low | F | `src/layouts/BaseLayout.astro:31-56,92` | The Organization JSON-LD is built inline on every page, with no `@id`. There is no `WebSite` node and no `BreadcrumbList`, although every sub-page has visible breadcrumbs. Service pages have no `Service` schema. | Rich-result and entity signals that would cost little to add. | Add `src/lib/schema.ts` builders (`organization()`, `website()`, `breadcrumbs(crumbs)`, `service(entry)`, `article(entry)`), emitted as one `@graph`. PageHero already has the crumbs, so pass them to BaseLayout. | M | none | Done (round 3) |
| F-43 | Low | F | `src/pages/404.astro` (via `BaseLayout.astro:67`) | The 404 page emits `<link rel="canonical" href="…/404/">`. | A canonical on an error page is meaningless (it is noindexed). | Skip the canonical when `noindex` is set. | S | none | Done (round 1) |
| F-44 | Low | E, F | `astro.config.mjs:15` | The sitemap has no `<lastmod>`. | Crawlers can't prioritise changed content. | Use the `serialize` option to add `lastmod` from the Insights and Resources `date`, and the build date elsewhere. | S | none | Done (round 1) |
| F-45 | Low | H | `src/layouts/BaseLayout.astro:81-82` | `theme-color` follows the OS scheme, not the site toggle. | The mobile browser bar mismatches when the user picks the other theme. | Update the `meta[name=theme-color]` content in the theme store's `apply()`. | S | none (browser chrome only) | Done (round 3) |
| F-46 | Low | H | `src/components/layout/Header.astro:197` | The mobile `<nav aria-label="Mobile">` describes the device, not the purpose. | Screen-reader users hear "Mobile navigation". | Label it "Primary". The desktop nav with the same label is `display:none` at that width. | S | none | Done (round 3) |
| F-47 | Low | H | `select-none cursor-default` on result cards, pillar cards, segment cards, process cards, stack chips and At-a-glance chips (`ResultsBand.astro:23`, `Pillars.astro:51`, `Industries.astro:25`, `Process.astro:49`, `about.astro:100`, `services/[slug].astro:142`, `Hero.astro:41`) | Visitors can't select or copy content text. | It frustrates users who copy facts (procurement teams). | Remove `select-none`. Keep `cursor-default`. | S | none visible (text becomes selectable) | Done (round 3) |
| F-48 | Low | H, F | `src/layouts/BaseLayout.astro:60` | `lang="en"`, while all copy is British English. | Screen-reader pronunciation and spell-check. | `lang="en-GB"`. | S | none | Done (round 3) |
| F-49 | Low | G | `src/components/sections/LogoMarquee.astro:21` | Client logos (currently none) would use a plain `<img>` from `public/` with no width or height. | A future CLS risk and unoptimised images, once logos exist. | Import the logos as assets and use `<Image>` from `astro:assets`, with explicit dimensions. | S | none | Deferred until client logos exist |
| F-50 | Low | G | `src/components/layout/Logo.astro:17-26`; `dist/_astro/zanamtech-logo.CV3wX854.png` | The 800×112 source PNG is copied to `dist` unused (58 KB). Lighthouse reports a 7.5 KB saving on the 2× WebP shown at 171×24. | Small waste. | Use an SVG logo if one exists (sharp at every density, about 2 KB). Otherwise accept it. | S | none, if the SVG is the same artwork | Deferred until an SVG logo is supplied |
| F-51 | Low | G | `src/components/layout/Header.astro`, `Footer.astro` | Home has 1,327 DOM nodes (Lighthouse "avoid excessive DOM", threshold about 800). Every page carries the service list 4 times plus inline SVG icons. | Style and layout cost on low-end phones. It is not hurting the scores today. | After F-11, consider rendering the footer phone list and desktop list from one markup with responsive CSS. Keep the mega-menu as is. | M | none, if the layouts are reproduced | Declined (owner) |
| F-52 | Low | G | `nginx/nginx.conf:28-32` | `gzip_types` lacks `text/javascript`, which recent nginx `mime.types` use for `.js`, plus `application/manifest+json` and `image/x-icon`. There is no pre-compression (`gzip_static`) or Brotli. | JS may go out uncompressed, depending on the nginx version. Compression happens on every request. | Add `text/javascript`. Optionally pre-compress `dist` at build (`gzip -k`) and enable `gzip_static on;`, with no new packages. | S | none | Done (round 3) |
| F-53 | Low | I | `nginx/security-headers.conf:10,15` | `img-src` allows `data:`, and nothing needs it (the build never inlines assets). `Permissions-Policy` lists `interest-cohort`, which browsers have dropped. | A slightly wider policy than needed, and a header that logs warnings. | Drop `data:` from `img-src` and verify with `security.spec.ts`. Remove `interest-cohort=()`. | S | none | Done (round 3) |
| F-54 | Low | D | `src/scripts/metric-counters.ts:43-52` | If the visitor navigates away before the counters approach the viewport, the loader observer is never disconnected and keeps detached nodes alive. | A small leak per home visit (ClientRouter). | Disconnect the loader on `astro:before-swap`, or remove this with F-04 and F-07. | S | none | Done (round 2) |
| F-55 | Low | D | `src/scripts/reveal.ts:60` | The per-group `clean` timeout is not tracked, so it fires on detached nodes after navigation. | Harmless today; a pattern to avoid. | Track it in `safetyTimers` (or a second map) and clear it in `teardown()`. | S | none | Done (round 2) |
| F-56 | Low | D | `src/scripts/alpine.ts:481-488` | `optionValues()` queries the DOM on every key press, although the options are already known on the server. | Unneeded work, and the code depends on the markup. | Pass the option arrays in `config`. Moot if F-14 is applied. | S | none | Done (round 2) |
| F-57 | Low | A | `src/scripts/faq-accordion.ts` (50 lines) | This is a JavaScript fallback that animates `<details>` height in browsers without `interpolate-size` (Firefox, Safari). | A custom script for an enhancement that the CSS already does where supported. | **Optional.** Delete it and let Firefox and Safari open the FAQ instantly until they ship `::details-content` transitions. | S | **Yes:** no FAQ animation in Firefox and Safari | Declined (owner) |
| F-58 | Low | A | `src/scripts/alpine.ts:437-448`, `Hero.astro:102-110` | The `scrollCue` Alpine component only smooth-scrolls to `#flagship`. | The browser already does this: `html:focus-within { scroll-behavior: smooth }` applies when the clicked link takes focus, and the reduced-motion override exists. | Verify that a plain anchor scrolls smoothly under the ClientRouter (Astro handles same-page hash links). If it does, delete `scrollCue`. | S | none, if verified | Done (round 3): verified, `scrollCue` kept (a plain anchor jumps under the ClientRouter) |
| F-59 | Low | C | `README.md:3-16` | The README cites spec 001, "private enterprise AI" and "Framer Motion: … scroll reveal". | Out of date and contradicts the current scope (Constitution III bans self-hosted-LLM claims in site copy). | Update the stack table and the spec link. | S | none | Done (round 1) |
| F-60 | Low | C | `src/lib/content.ts:12` | The comment says the guard "avoids a warning per page". The build still logs one `[glob-loader] No files found` warning. | A slightly misleading comment. | Reword it ("…avoids a warning per page; the loader still warns once at build"). | S | none | Done (round 1) |
| F-61 | Low | K | `scripts/lint-content.mjs:9`, `scripts/check-csp.mjs:164` | `new URL('..', import.meta.url).pathname` plus a drive-letter regex is used to find the root. It breaks on paths with spaces or `%` characters. | A tooling bug waiting for a different checkout path. | Use `fileURLToPath(new URL('..', import.meta.url))` from `node:url`. | S | none | Done (round 1) |
| F-62 | Low | K | `package.json` | No `"private": true`. No `.nvmrc` or `packageManager` field. Engines say `>=22.12`, the Docker image uses `node:22-alpine`, and local development runs Node 24. | Risk of an accidental `npm publish`, and version drift between local, Docker and CI. | Add `"private": true` and an `.nvmrc` (22), and pin Docker to a minor and digest (`node:22.x-alpine@sha256:…`, `nginx:stable-alpine-slim@sha256:…`). | S | none | Done (round 1) |
| F-63 | Low | K | `npm outdated` | Patch and minor updates are available: `astro` 7.3.5 → 7.3.8, `@astrojs/react` 7.0.1, `lucide-react` 1.57.0, `react`/`react-dom` 19.3.1, `@playwright/test` 1.64.1, `framer-motion` 13.5.1 (14.2.0 major). TypeScript 7.0 is a major release. | Bug and security fixes. | Apply the patch and minor updates after F-03 and F-04, since several of these packages disappear then. Leave TypeScript 7 for a separate change. | S | none | Done (round 1) |
| F-64 | Low | J | `tests/e2e/home.spec.ts` + `home-v3.spec.ts`; `services.spec.ts` + `services-v3.spec.ts`; `review-fixes.spec.ts`, `review3.spec.ts`, `review4.spec.ts` | Tests are grouped by review round, not by feature. Some cases overlap: "every service reachable from home in two clicks" is in `services.spec.ts:52` and `services-v3.spec.ts:16`. The home hero is covered in both home files. | Hard to find the test for a feature, and duplicate runtime. | Regroup by feature (`home`, `services`, `header`, `footer`, `about`, `insights`, `legal`, `reveal`, `security`) and delete the overlaps. | M | none | Done (round 3, duplicates removed). Regroup by feature deferred |
| F-65 | Low | J | `playwright.config.ts:33-36` and 29 `test.skip(testInfo.project.name !== …)` calls | Device-specific tests are scheduled in both projects and then skipped (51–62 "skipped by design" per run). | Noisy reports and wasted worker start-up. | Tag the tests (`@desktop`, `@mobile`) and set `grep`/`grepInvert` per project. | S | none | Done (round 3) |
| F-66 | Low | J | `tests/e2e/` | Gaps for real user flows:<br>(a) The canonical, sitemap and internal-link URL forms are not checked against each other (F-01).<br>(b) `robots.txt` and the sitemap contents are not tested.<br>(c) The 404 page is not tested.<br>(d) JSON-LD is not checked for JSON validity or duplicates.<br>(e) nginx runtime behaviour is only checked by regex on the config (`redirects-config.spec.ts`), never against real 301s or headers. | Those regressions would not be caught. | Add a small `seo.spec.ts` that parses `dist`. In CI, add a job that runs the Docker image and curls the 301s and the security headers. | M | none | Done (a–c round 1, d–e round 3) |
| F-67 | Low | C | `src/components/` | `ContactForm.astro` sits at the components root. `sections/` mixes full sections with cards (`ServiceCard`, `OfferCard`, `ArtefactCard`, `CaseStudyCard`) and content wrappers (`ArticleBody`, `LongFormDoc`, `SeverityMatrix`, `TierTable`). | The folder names don't predict where a component lives. | Move the cards to `components/cards/`, `ContactForm` to `components/forms/`, and the doc wrappers to `components/content/`. Do it in the same batch as F-10 and F-39 to avoid two rounds of import churn. | S | none | Done (round 2) |

**Items checked and found fine (one line each):**
- **Titles and descriptions:** unique on every page.
- **Headings:** exactly one H1 per page, and no skipped heading levels on any of the 32 pages.
- **IDs and links:** no duplicate IDs, and no broken internal links or `#anchors` across 2,590 links.
- **Images:** every `<img>` has `alt`.
- **Sitemap:** excludes the 404 page and every draft. `robots.txt` points at it.
- **TypeScript:** `tsconfig` extends `astro/tsconfigs/strict`. No `any`, `@ts-ignore` or `@ts-expect-error` anywhere.
- **Secrets:** none in the repo. Only `.env.example` is tracked. The public form key comes from the environment.
- **Font loading:** self-hosted variable font, `font-display: swap`, Latin subset preloaded. Other subsets load only by `unicode-range`. No layout shift (CLS 0.001).
- **Images:** the founder photo and logo go through `astro:assets` as WebP with `densities`. The logo has explicit width and height, and `fetchpriority=high` above the fold.
- **Caching:** fingerprinted `/_astro/` is immutable for 1 year. HTML is `no-cache`. Brand images are cached for 1 day.
- **Security headers:** strict CSP with no `unsafe-inline` or `unsafe-eval`, `frame-ancestors 'none'`, HSTS, COOP, CORP, `nosniff`. `check:csp` verifies the inline script hash on every build.
- **Docker:** multi-stage, runs as the non-root `nginx` user, allows only GET and HEAD, `client_max_body_size 1k`.
- **Reduced motion:** honoured everywhere, in CSS and in every script.
- **Accessibility basics:** skip link, `<main tabindex=-1>`, labelled landmarks, `aria-expanded` on every disclosure, Escape closes menus and returns focus. Focus rings are keyboard-only with a documented reason.
- **Contrast:** Lighthouse Accessibility is 100 (light). The axe tests cover both themes.

---

## 2a. Supporting data

### Routes (E)

The build has 32 pages:
- **Core (10):** `/`, `/about`, `/approach`, `/contact`, `/industries`, `/start-here`, `/privacy`, `/terms`, `/trust`, `/404` (noindex).
- **Services (14):** `/services` plus 13 `/services/<slug>`.
- **Insights (4):** `/insights` plus 3 articles.
- **Resources (4):** `/resources` plus 3 samples.

`/case-studies` is not built until a verified entry exists, which is correct. `/robots.txt`, `/sitemap-index.xml` and `/sitemap-0.xml` (31 URLs, no 404) are generated. Three nginx 301s cover the retired services. Their targets exist, and the anchor `#ai` exists on `/services`.

### Client JavaScript per page (D), gzip

| Page | Scripts loaded | Initial JS (gzip) |
| --- | --- | --- |
| Every page | Alpine CSP + `alpine.ts` (`page.*.js` 27.2 KB), ClientRouter (5.6 KB), BaseLayout scripts: input-modality, reveal, faq-accordion (1.6 KB) | **≈ 34.4 KB** |
| Home | + ResultsBand counters loader (1.2 KB), lazy `framer-motion/dom` (19.0 KB) when the results approach the viewport | 35.6 KB + 19.0 KB lazy |
| Insights and Resources pages | + article TOC (0.5 KB) | 34.9 KB |

- **Built but unused:** `client.*.js` (React client, 68 KB gzip) is never referenced (F-03).
- **`is:inline` usage:** the no-flash theme script (justified: it must run before first paint, and its CSP hash is gated), JSON-LD (correct: it is data), and the optional analytics tag (correct: third-party `src`).
- **Listener audit after ClientRouter navigation:**
  - No duplicate bindings: module-level listeners bind once, and Alpine components clean up in `destroy()`.
  - The header is persisted, so `siteHeader.init()` runs once.
  - Minor leaks: F-54 and F-55.

### Lighthouse (G), local `astro preview`, 15 Oct 2026

| Page | Form factor | Perf | A11y | Best Pr. | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Mobile | 99 | 100 | 100 | 100 | 1.6 s | 1.8 s | 30 ms | 0.001 | 116 KiB |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.4 s | 0.5 s | 0 ms | 0.001 | 129 KiB |
| `/services/managed-cloud-devops` | Mobile | 99 | 100 | 100 | 100 | 1.5 s | 1.8 s | 0 ms | 0.001 | 108 KiB |
| `/services/managed-cloud-devops` | Desktop | 100 | 100 | 100 | 100 | 0.4 s | 0.5 s | 0 ms | 0.001 | 102 KiB |

- **LCP element:** the hero H1 (home) and the PageHero lead paragraph (service page). Both are text, so they do not wait on an image.
- **Remaining diagnostics:**
  - Render-blocking CSS: the main 17 KB gzip file, plus the 99-byte scoped file from F-12.
  - DOM size: home 1,327 nodes (F-51).
  - Logo image: 7.5 KB could be saved (F-50).
- **No issues reported:** unused CSS, unused JS and legacy JS.
- **CSS:** one 101 KB raw / 17 KB gzip stylesheet, shared by every page.

**Other asset sizes**
- **HTML:** home 150 KB raw / 22 KB gzip; about 74 KB raw / 12.6 KB gzip. Long Tailwind class strings plus the 4× service lists account for most of it.
- **Fonts:**

  | Subset | Size |
  | --- | --- |
  | Latin (preloaded) | 27 KB |
  | Latin-ext | 22 KB |
  | Vietnamese | 8 KB |
  | Cyrillic-ext | 2 KB |

  Non-Latin subsets load only when such characters appear.

---

## 3. Detailed notes: High items

### F-01: one URL per page

**Current state**

```js
// astro.config.mjs:12
trailingSlash: 'ignore',
// no build.format → 'directory' (dist/about/index.html)
```

```astro
// BaseLayout.astro:24, Astro.url.pathname is "/about/" in a directory-format build
const canonical = new URL(Astro.url.pathname, Astro.site);
```

```nginx
# nginx.conf:79-83: both /about and /about/ return 200
location / {
    include /etc/nginx/security-headers.conf;
    add_header Cache-Control "no-cache" always;
    try_files $uri $uri/index.html $uri.html =404;
}
```

**What the build produced**
- Canonical: `https://www.zanamtech.com/about/`.
- Sitemap: `https://www.zanamtech.com/about/`.
- Internal links: 2,590 with no trailing slash and 0 with one.
- nginx redirect targets have no slash (`/services/managed-cloud-devops`).
- The header's active-state code strips a trailing slash (`Header.astro:11`, `alpine.ts:134`). In other words, the code base already treats the slash-less form as primary.

**Recommended change.** All three parts go in one batch:
1. `astro.config.mjs`: `trailingSlash: 'never'` and `build: { format: 'file' }`. This gives `dist/about.html`, `Astro.url.pathname === '/about'`, and a slash-less sitemap.
2. `nginx.conf`: before `location /`, add:

   ```nginx
   # Canonical form has no trailing slash (except "/").
   location ~ ^(.+)/$ { include /etc/nginx/security-headers.conf; return 301 $1; }
   ```

   and change the catch-all to `try_files $uri $uri.html $uri/index.html =404;`.
3. Add a test (in `seo.spec.ts`, F-66) that, for every page in `dist`, the canonical equals the sitemap `<loc>` equals the form used by internal links.

**Watch for**
- `astro preview` with `trailingSlash: 'never'` returns 404 for `/about/`. No test currently navigates to a trailing-slash path (checked), but re-check before the change.
- The `security.txt` `Policy:` URL `/trust#reporting-issues` is already slash-less.

### F-02: a pause mechanism for auto-moving content

**Current state**

```css
/* global.css:385-388: the only pause control is a mouse hover */
.marquee:hover .marquee-track { animation-play-state: paused; }
```

```astro
<!-- Hero.astro:58-63: the stepper loops for as long as the page is open; pauses only on mouseenter -->
<div class="glass relative rounded-3xl p-6 sm:p-8"
     x-data={`blueprintStepper(${blueprint.length})`}
     x-on:mouseenter="pause" x-on:mouseleave="resume">
```

WCAG 2.2.2 (level A) requires a way to pause, stop or hide any moving or auto-updating content that starts automatically, lasts more than 5 seconds and is shown alongside other content. `prefers-reduced-motion` helps users who set it, but it does not count as the required mechanism.

**Recommended change.** This is small, but it changes what the page shows, so it needs owner sign-off under Constitution IV:
- **Marquee:** one `<button type="button" aria-pressed="false">` ("Pause animation") inside `#proof-strip`. It toggles a `data-paused` attribute on the section, and CSS maps that to `animation-play-state: paused`. Also add `.marquee:focus-within .marquee-track { animation-play-state: paused; }`, which has no visual impact.
- **Stepper:** add `x-on:focusin="pause" x-on:focusout="resume"`, and let the same (or a second) toggle call `pause()` and `resume()`.
- **Tests:** extend `theme-motion.spec.ts` so that pressing the toggle stops the transform and the step changes.

---

## 4. Keep as is (justified custom code)

| Item | Why it stays |
| --- | --- |
| Alpine.js **CSP build** aliased in `astro.config.mjs:22` | It lets the strict CSP run with no `unsafe-eval`. The standard Alpine build would need it. |
| Inline no-flash theme script, `is:inline` (`BaseLayout.astro:87-91`) | It has to run before first paint. Its hash is pinned in the CSP and checked by `check:csp` on every build. |
| `input-modality.ts` + `html[data-modality=pointer]` rule | Native `:focus-visible` shows rings after script-moved focus in some engines (documented in 3/3g and tested). The behaviour is tiny and deliberate. |
| `reveal.ts` fail-safe design | Visible by default, the end state set by an attribute, and a per-group safety timer. This is the correct defensive design after the blank-card bugs. Keep it and absorb `processReveal` into it (F-05). CSS scroll-driven animations (`animation-timeline: view()`) could replace it later, but they are not in Firefox and are scroll-linked rather than time-based, which is a design change. |
| Retired-URL 301s in **nginx**, not in Astro `redirects` | In a static build, Astro `redirects` emit meta-refresh HTML pages, not real 301s. nginx is the correct place. |
| `@astrojs/sitemap` + `robots.txt.ts` endpoint | Framework-native. The endpoint is needed so the sitemap URL follows `PUBLIC_SITE_URL`. |
| `astro:assets` `<Image>` for the logo and founder photo | Already framework-native. The 2.3 MB original is only in the repo; only resized WebP ships. |
| Fontsource + manual preload of the Latin subset | Self-hosting is required by `font-src 'self'`, and the preload fixed a measured CLS. Astro's built-in Fonts API (generated preloads and fallback metrics) is worth evaluating in a later version bump, but it is not needed now. |
| Content collections with Zod, including the "illustrative scenarios have no digits" refinement | Framework-native, and it enforces Constitution III at build time. |
| Small typed data modules in `src/data/*.ts` (offers, tiers, segments, results, FAQ) | Short, typed, imported at build time. Moving them to `file()` loader collections would add ceremony with no gain. Only the duplicated ID unions need fixing (F-33). |
| `src/lib/lead.ts` validation separate from the form | One validation contract with clear tests. Native constraint validation alone cannot give the accessible, field-specific error summary the form needs. |
| `scripts/lint-content.mjs` and `scripts/check-csp.mjs` | Project-specific gates (Constitution III and V) that no off-the-shelf tool provides. |
| Native `<details>` for FAQ, mobile pillars and footer pillars | Already platform-native. The `::details-content` CSS animation is progressive enhancement. |
| `html:focus-within { scroll-behavior: smooth }` | A deliberate fix for animated scroll restoration on reload (3b). A global `smooth` rule would bring that bug back. |
| Persisted header + `syncActiveNav` | Required while the ClientRouter stays. It goes away only with F-07. |
| `Illustration.astro` inline SVG | No image requests, theme-aware through tokens, `aria-hidden`. About 1.2 KB gzip. |
| `playwright.config.ts` free-port logic and `reuseExistingServer: false` | Prevents testing a stale dev server by accident (it happened before, 13 Oct). |
| Mega-menu hover/focus/touch logic in `siteHeader` | No native primitive yet covers hover intent with touch toggle and focus-open. `popover="hint"` and `interestfor` are not baseline. The logic is tested in `touch-menu`, `services` and `navigation`. It moves to its own module in F-15. |

---

## 5. Proposed fix order

Each batch is independent. Each ends with `npm run check`, `npm run lint:content`, `npm run build`, `npm run check:csp` and the Playwright specs listed for it, run 3× for reveal and menu specs. Batches marked **design** need owner sign-off under Constitution IV before work starts.

| # | Batch | Findings | Verify with |
| --- | --- | --- | --- |
| 1 | **Dead code and assets.** Remove unused PNGs, CSS classes, data fields, attributes, props and exports; merge `.field-input`; move `@types/alpinejs`; untrack `.pyc`; fix the README and the `content.ts` comment. | F-08, F-22–F-31, F-59, F-60 | Full suite. `dist` size drops by about 1.6 MB. Computed styles unchanged. |
| 2 | **Dependency hygiene.** `npm audit fix` (non-breaking), patch and minor updates, `private: true`, `.nvmrc`, pinned Docker bases, `fileURLToPath` in scripts. | F-16 (production part), F-61–F-63 | Full suite. `npm audit --omit=dev` shows 0 high. |
| 3 | **One URL per page.** `trailingSlash: 'never'`, `format: 'file'`, nginx slash redirect, no canonical on 404, sitemap `lastmod`. New `seo.spec.ts`. | F-01, F-43, F-44, F-66 (a–c) | New `seo.spec.ts`, `navigation`, `redirects-config`, then `nginx -t` and curl in Docker. |
| 4 | **CSS consolidation.** `.card-link` utility (removes 4 CSS files), CSS-counter numbering in LongFormDoc, `/privacy` on LongFormDoc, `scroll-padding-top`. | F-12, F-13, F-41 | `trust-legal`, `home-v3` (scroll cue offset), `services`, the design-freeze computed-style comparison. |
| 5 | **Shared components and nav model.** `SectionHeader`, `ArrowLink`, `IconTile`, `CheckList`, `Chip`, `ContentCard`; `lib/navigation.ts`; pillars data; component folders. | F-10, F-11, F-36–F-39, F-67 | Design-freeze computed-style comparison at 1440 and 390 in both themes; `header-footer-ui`, `responsive-header`, `review*`. |
| 6 | **Types and single sources.** `IconName`, shared ID enums, `astro:env` schema, `FORM_SUBJECT`, test imports of shared strings. | F-32–F-35 | `astro check`, `contact.spec`. |
| 7 | **Script consolidation.** Merge `processReveal` into `reveal.ts`, add the `reducedMotion()` helper, split `alpine.ts`, counters without framer-motion (remove the package), fix the small leaks. | F-04, F-05, F-15, F-40, F-54–F-56 | `reveal`, `reveal-sitewide`, `metrics`, `theme-motion`, `home-v3`, 3× repeat. Home lazy JS drops by 19 KB gzip. |
| 8 | **Icons without React.** `@lucide/astro` (or inlined paths); remove `react`, `react-dom`, `@astrojs/react`, `@types/react*`, `lucide-react`. | F-03 | Byte-compare the SVG markup of a few pages before and after. Full suite. The `client.*.js` chunk disappears. |
| 9 | **External links without middleware.** Local rehype plugin; delete `src/middleware.ts`; drop the source-reading test. | F-06, F-18 | `review3` external-link tests, an Insights article with a source link. |
| 10 | **SEO metadata** (wording needs owner approval). Shorter descriptions and titles with length lint, OG image and `summary_large_image`, article OG/JSON-LD, schema builders with BreadcrumbList/Service/WebSite, `lang="en-GB"`. | F-09, F-20, F-42, F-48, F-66 (d) | `seo.spec.ts`, Rich Results Test on one service and one article page. |
| 11 | **Tooling and tests.** ESLint + Prettier (dev-only), GitHub Actions running all gates plus LHCI on Ubuntu, move `@lhci/cli` to CI-only, tests regrouped by feature, sleeps replaced, project tags, Docker smoke job. | F-16 (dev part), F-19, F-21, F-64, F-65, F-66 (e) | A green CI run. Suite time before and after. |
| 12 | **Accessibility, design.** Pause control for the marquee and stepper; theme-color sync; nav label; selectable text. | F-02, F-45–F-47 | `theme-a11y`, `theme-motion`, a manual check with keyboard and touch. |
| 13 | **Optional owner decisions, design.** Native cross-document view transitions instead of the ClientRouter; native select; drop the FAQ JS fallback; drop `scrollCue`; spam protection; footer markup merge; SVG logo; nginx pre-compression; CSP tidy-up. | F-07, F-14, F-17, F-50–F-53, F-57, F-58 | Per item. Each can ship or be declined on its own. |

**Follow-ups and risks**
- Batches 4, 5 and 8 touch most templates. Run the existing design-freeze computed-style comparison (the method from Phase 5) on each, not only Playwright.
- Batch 3 changes every URL's canonical form at once. Ship it before launch, so search engines never index the slash form.
- F-07 and F-14 remove the most code, but each trades away a small visual behaviour in some browsers. Treat them as product decisions, not clean-ups.

---

## 6. Owner decisions (15 Oct 2026)

Implementation runs in three rounds. These decisions override the recommendations above where they differ.

| Finding | Decision |
| --- | --- |
| Everything not listed below | **Approved** as recommended. |
| F-07 (native view transitions instead of the ClientRouter) | **Deferred** until after launch. |
| F-14 (native select instead of the custom combobox) | **Declined.** Keep the current behaviour. |
| F-51 (merge the footer phone and desktop lists) | **Declined.** Keep the current behaviour. |
| F-57 (drop the FAQ animation fallback) | **Declined.** Keep the current behaviour. |
| F-02 (pause mechanism for the marquee and hero stepper) | **Declined in full** (updated before round 3). No change at all to the marquee or the hero stepper, not even a keyboard/focus pause. The owner has declined full WCAG 2.2.2 (Pause, Stop, Hide) compliance for these two elements. |
| F-17 (spam protection) | **No Turnstile now.** The owner restricts the Web3Forms key to the production domain at launch. |
| F-50 (SVG logo) | **Only if an SVG logo is supplied.** |
| F-20 (OG image and article metadata) | **Do the code part.** The 1200×630 OG image asset comes later, in the images round. |
| Contact-form code on every page (round 2, F-15) | **Accepted as is.** The lead-form code stays in the shared Alpine bundle (2.8 KB gzip on every page), because a ClientRouter navigation into `/contact` starts Alpine before a page-scoped script could register it. |
| "How we engage" timer (round 2, F-05) | **Accepted as is.** The 4 s safety timer starts when the cards scroll into view, not at page load. |
| F-64 (tests grouped by review round) | **Partly deferred.** Round 3 only removes duplicate test cases. The full regroup by feature is deferred. |

### Upstream issue: Lighthouse Best Practices 81 (round 3)

Lighthouse reports one failing Best Practices audit, "Uses deprecated APIs" (FencedFrame), which caps the category at 81. Alpine's CSP build reads every `globalThis` property when it starts, and Chromium flags the fenced-frame global as deprecated. The pre-round-2 build scores the same.
- `alpinejs` and `@alpinejs/csp` 3.17.4 are the latest releases (checked 15 Oct 2026), so no patch or minor update removes it. Alpine already skips `styleMedia` and `sharedStorage` for the same reason; the fix belongs upstream.
- Not worked around. Lighthouse CI keeps Performance, Accessibility, SEO, LCP and CLS as errors, and reports Best Practices as a warning until Alpine ships a fix.


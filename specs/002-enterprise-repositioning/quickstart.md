# Quickstart: Enterprise Repositioning (002)

Work happens on the `dev` branch. For Spec Kit scripts, set `SPECIFY_FEATURE=002-enterprise-repositioning`.

## Run locally
```bash
npm install
npm run dev            # drafts (insights/resources) render here with a DRAFT/Sample badge
npm run build && npm run preview   # production view: drafts and unpublished services excluded
```

## Gates (after every phase)
```bash
npm run check          # astro check: 0 errors
npm run lint:content   # Constitution III/VII content rules, clock-hour and verified-data checks
npm run check:csp      # CSP hashes and origins
npm run test:e2e       # Playwright + axe, desktop + mobile, light + dark
```
To avoid clashing with a running dev server, run E2E through a temporary config on port 4333 with
`reuseExistingServer: false`, and delete it afterwards.

## Common content tasks
- **Unpublish a service**: set `published: false` in its markdown. It disappears from menus, grids,
  pages, form options and the sitemap.
- **Approve a draft**: set `draft: false` in `src/content/insights/*.md` or
  `src/content/resources/*.md`. The Insights nav link appears once at least one article is published.
- **Add real proof**: add an entry to `src/data/testimonials.ts` / `clients.ts` or a `caseStudies`
  markdown file with `verified: true`, `permissionDate` and `evidence`. The section appears
  automatically. Never add unverified or placeholder entries; the lint rejects them.
- **Add a result's evidence**: set `evidenceId` on the entry in `src/data/results.ts` (optional at launch).
- **Set LinkedIn or photo**: fill `linkedin`, `companyLinkedin` and `photo` in `src/data/leadership.ts`.
  Empty values stay hidden.

## Redirects
The retired service URLs return 301 from nginx only (`nginx/nginx.conf`). `npm run preview` does not
run nginx; check them with the static nginx test or a Docker build.

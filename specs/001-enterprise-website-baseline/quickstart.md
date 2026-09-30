# Quickstart: ZanamTech Enterprise Website

## Prerequisites
- Node.js ≥ 22.12, npm ≥ 10
- Docker (for container build only)

## Setup
```bash
npm install
cp .env.example .env   # fill PUBLIC_FORM_ENDPOINT / PUBLIC_FORM_ACCESS_KEY
npm run dev            # http://localhost:4321
```

## Quality gates
```bash
npm run check          # astro check (types + templates)
npm run lint:content   # prohibited phrases / pricing / competitor names
npm run build
npx playwright install chromium   # first run only
npm run test:e2e       # Playwright + axe, light & dark
npm run lhci           # Lighthouse CI budgets
```

## Container
```bash
docker build -t zanamtech-web .
docker image ls zanamtech-web     # expect < 25 MB
docker run --rm -p 8080:8080 zanamtech-web
```

## Validation scenarios
1. `/` shows hero headline, three pillars, both CTAs; light theme on first visit.
2. Toggle theme → dark; reload → still dark, no flash.
3. `/services` lists 9 services; each `/services/<slug>` shows 2 Representative Engagement Scenarios.
4. Any CTA opens the dialog; Esc closes and restores focus.

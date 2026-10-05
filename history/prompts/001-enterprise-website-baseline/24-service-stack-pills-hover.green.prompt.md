---
id: 24
title: Service stack pills hover
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["services", "pills", "hover", "consistency"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/pages/services/[slug].astro
tests:
 - npm run check (0 errors, 0 warnings)
 - E2E suite intentionally skipped per request
---

## Prompt

Apply the Hero pillar badge hover animations and glass styling to the Technology Stack pills on all individual Service pages (`src/pages/services/[slug].astro`):

1. Service Detail Technology Stack Styling Update:
   - Locate the Technology Stack section/component rendered on individual service pages (`src/pages/services/[slug].astro` or relevant sub-component).
   - Update the tech stack item pills/badges so their base styling, borders, glass effects, and hover animations match the Hero pillar badges (`Enterprise-grade`, `High-availability`, `Zero-trust security`) from `Hero.astro`:
     - Base styling: `transition-all duration-300 ease-in-out border border-border/60 bg-secondary/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-sm font-medium text-foreground/80`
     - Hover state: `hover:border-purple-500/60 hover:shadow-md hover:shadow-purple-500/10 hover:scale-[1.02] hover:bg-secondary/70 hover:text-foreground`

2. Cross-Page Consistency:
   - Verify that all 9 individual service pages apply this updated hover animation uniformly across both light and dark themes.

3. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this change. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Stack pills:** the Technology stack `li` in `[slug].astro` now uses:
  - Rest: `rounded-full border border-border/60 bg-surface-2/40 px-3.5 py-1.5 text-sm font-medium text-fg/80 backdrop-blur-sm transition-all duration-300 ease-in-out`.
  - Hover: `scale-[1.02] border-accent/60 bg-surface-2/70 text-fg shadow-md shadow-purple-500/10`.
  - The scale is disabled under reduced motion.
- **Token mapping:** "secondary" → `surface-2` and "foreground" → `fg`, the site's theme tokens, so the pills work in both themes. `border-accent` is the same purple used by the hero badges.
- **Consistency:** all 9 service pages render from this single template, so the change applies uniformly.

## Outcome

- ✅ Impact: the stack pills share the hero badge interaction on every service page.
- 🧪 Tests: astro check 0 errors; E2E skipped by request.
- 📁 Files: src/pages/services/[slug].astro
- 🔁 Next prompts: commit and push.
- 🧠 Reflection: one template meant one edit.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run the services axe test before pushing (text-fg/80 contrast is ~10:1, expected to pass).

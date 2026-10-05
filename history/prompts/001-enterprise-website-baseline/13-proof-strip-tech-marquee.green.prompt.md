---
id: 13
title: Proof strip tech marquee
stage: green
date: 2026-10-05
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["proof-strip", "marquee", "glassmorphism", "reduced-motion", "a11y"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/ProofStrip.astro
 - src/data/platforms.ts
 - src/styles/global.css
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - E2E suite intentionally skipped per request
---

## Prompt

Redesign `src/components/sections/ProofStrip.astro` into a modern 2-row infinite scrolling tech ticker/marquee with enhanced glassmorphic pill designs:

1. Heading & Layout Structure:
   - Add a fixed, centered section header/badge above the ticker: "Engineered Across Modern Ecosystems" (or keep a sleek subtle label).
   - Create 2 bi-directional infinite moving rows:
     - Row 1: Scrolling continuously from Right to Left.
     - Row 2: Scrolling continuously from Left to Right.
   - Use CSS keyframe marquee animation (`animate-marquee` and `animate-marquee-reverse`) with `linear` infinite timing so the movement is butter-smooth (zero stutter/glitch).
   - Add subtle gradient fade masks on the left and right edges (`mask-image: linear-gradient(...)`) so items fade in and out cleanly at screen edges.

2. Comprehensive Tech & Tools List:
   - Expand the tools data array in `src/data/platforms.ts` (or directly in the component) to include all provided items grouped logically across Row 1 and Row 2:
     - Row 1 (Cloud, DevOps, Infra & AI): AWS, Microsoft Azure, Google Cloud, Flexential Cloud, Kubernetes, Docker, Cloudflare, Linux, Windows, Terraform, NGINX, Claude, ClaudeCode, Ollama, OpenClaw, Hermes.
     - Row 2 (CI/CD, Monitoring, DBs & Security): Jenkins, Bitbucket, GitHub Actions, Git, GitHub, Prometheus, Grafana, Zabbix, MySQL, MS SQL, MongoDB, PostgreSQL, SSL / TLS, Acronis.

3. Visual Design & Glassmorphism:
   - Upgrade basic text into sleek, modern tech badges/pills:
     - Compact padding (`px-4 py-2`), subtle rounded borders (`rounded-full` or `rounded-xl`), soft glass background (`bg-white/5` or `glass`), and subtle cyan glow/border on hover.
     - Ensure readable text contrast in both Light and Dark themes.
   - Duplicate the list items for each row seamlessly so the infinite loop has no gap/break.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI update. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Data:** `src/data/platforms.ts` holds two typed rows (16 and 14 items). "ClaudeCode" is shown as "Claude Code".
- **Component:** a centred badge heading, and two masked rows each containing the list twice. The second copy is `aria-hidden`; row 1 uses `animate-marquee` (right to left), row 2 uses `animate-marquee-reverse`.
- **CSS:**
  - `@theme` defines the `animate-marquee` and `animate-marquee-reverse` utilities: 45s linear infinite `translate3d(-50%)` loops.
  - `.tech-pill`: a translucent surface with a token border and a cyan glow on hover. It has no backdrop-filter, because blur on moving elements is costly.
  - `.marquee-mask` fades the edges.
- **Accessibility:**
  - Hovering a row pauses it, and a no-JS "Pause animation" checkbox pauses both rows using `:has()` (WCAG 2.2.2).
  - Under reduced motion the rows become static, centred, wrapped badges, and the duplicate copy, mask and pause control are hidden.

## Outcome

- ✅ Impact: a two-row bi-directional ticker with all 30 items, readable in both themes.
- 🧪 Tests: astro check 0 errors; content lint pass; E2E skipped by request.
- 📁 Files: 1 new data file, 1 component rewritten, global.css extended.
- 🔁 Next prompts: a visual review in the browser, then commit.
- 🧠 Reflection: the per-pill backdrop blur was dropped to keep the animation compositor-only.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS; lint:content PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): tune the 45s speed after the visual review.

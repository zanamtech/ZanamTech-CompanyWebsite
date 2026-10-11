---
id: 38
title: Cursors and process connector
stage: green
date: 2026-10-11
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["cursor", "ux", "process", "animation", "alpine"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/styles/global.css
 - src/components/layout/ThemeToggle.astro
 - src/components/ContactModal.astro
 - src/components/sections/Hero.astro
 - src/components/sections/Metrics.astro
 - src/components/sections/Industries.astro
 - src/components/sections/Pillars.astro
 - src/components/sections/Process.astro
 - src/pages/services/[slug].astro
 - src/scripts/alpine.ts
tests:
 - npm run check (0 errors, 0 warnings)
 - "Connector smoke check on a production build (1440×900): step order card1 → seg1 → card2 → seg2 → card3 → seg3 → card4; each segment spans from a badge's right edge to the next badge's left edge, at badge-centre height"
 - E2E suite intentionally skipped per request
---

## Prompt

Fix site-wide text selection cursors, theme toggle pointer, and refine the "How We Engage" dynamic connecting line animation sequence:

1. Site-Wide Cursor & Pointer Standardization:
   - Prevent non-interactive text elements, badges, and cards (`Enterprise-grade`, `High-availability`, `Zero-trust security`, marquee pills, process cards, metric blocks) from triggering the text selection cursor (`cursor-text` / I-beam) on hover. Apply `cursor-default select-none` where appropriate.
   - Ensure ALL clickable elements across the site explicitly display the hand pointer icon (`cursor-pointer`):
     - Theme toggle button in `src/components/layout/Header.astro`
     - Modal backdrop and close buttons
     - Interactive cards, links, and drop-down triggers

2. "How We Engage" Sequential Connecting Line Animation (`src/components/sections/Approach.astro`):
   - Remove the permanent full-width background purple line that shows behind unrevealed cards.
   - Replace it with a dynamic segment-by-segment animated connector line driven by Alpine.js step progression:
     - Step 1 appears -> Connector line segment 1 smoothly draws left-to-right (`w-0` to `w-full transition-all duration-500 ease-out`).
     - Line segment reaches Step 2 position -> Step 2 card slides in and attaches.
     - Repeat sequentially for line segment 2->3 and segment 3->4.
   - Line styling: brand purple accent gradient (`bg-purple-500/80 dark:bg-purple-400/80 h-[2px] shadow-[0_0_8px_rgba(168,85,247,0.5)]`).

3. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Pointer cursor everywhere it's clickable:**
  - A base rule in `global.css` gives the pointer to enabled buttons, `[role=button]`, combobox, option, summary, `label[for]`, select, checkbox and radio. Tailwind v4 preflight resets buttons to the default arrow, so this was needed.
  - Explicit `cursor-pointer` on the theme toggle and the dialog close buttons.
  - Pointer on `.contact-dialog::backdrop`.
- **No I-beam on decorative content:** `cursor-default select-none` on the hero pillar badges, marquee pills (`.tech-pill`), service stack pills, Process cards, metric tiles, Industries cards and Pillars cards. Links inside them keep the pointer.
- **Connector:** the section lives in `Process.astro`; there is no `Approach.astro` component. The static hairline was removed and replaced by 3 lg-only segments, one per gap. Each runs from a step badge to the next badge, uses the requested purple and glow, and animates from `w-0` to full width over 500ms with ease-out.
- **Sequencing:** `processReveal` now uses a single `step` counter. Odd steps reveal cards and even steps draw segments, at 100, 650, 1150, 1700, 2200, 2750 and 3250ms. Without JS, under reduced motion, or when the section is already on screen at load, everything renders complete.

## Outcome

- ✅ Impact: consistent cursors, and a "draw then attach" process sequence.
- 🧪 Tests: astro check 0 errors; connector timing and geometry smoke-checked; E2E skipped by request.
- 📁 Files: see the list above.
- 🔁 Next prompts: commit/push.
- 🧠 Reflection: putting the overlay segments in a grid that mirrors the cards' grid keeps the geometry exact without measuring in JS.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS; manual smoke PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

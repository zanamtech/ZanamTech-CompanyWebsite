---
id: 39
title: Process connector gap only
stage: green
date: 2026-10-11
surface: agent
model: claude-opus-5-5
feature: 001-enterprise-website-baseline
branch: dev
user: mubashirahmed324
command: direct request
labels: ["process", "animation", "layout", "connector"]
links:
  spec: specs/001-enterprise-website-baseline/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/sections/Process.astro
tests:
 - npm run check (0 errors, 0 warnings)
 - "Production build at 1440×900: the lines sit at [379–419], [693–733] and [1007–1047], exactly between the card borders; the sequence goes card → line → card"
 - E2E suite intentionally skipped per request
---

## Prompt

Fix the connecting line alignment in the "How We Engage" section (`src/components/sections/Approach.astro` or process card component):

1. Correct the Connecting Line Position:
   - Ensure the purple connecting lines do NOT run across the entire width of the section or overlap behind the cards.
   - The line should strictly span only the gap between the cards.
   - It should start exactly from the right border of Card 1 and end exactly at the left border of Card 2 (not connecting the small 01/02 number badges).

2. Structural Implementation (CSS / Flexbox Layout):
   - Wrap the cards in a flex/grid layout where the gaps between cards contain the connecting lines.
   - Instead of absolute positioning a single line behind everything, place individual connecting line elements (e.g., `<div class="h-[2px] bg-purple-500/80 grow mx-2 ..."></div>`) between each card in the loop.
   - This ensures the line only exists in the empty space between the main white card containers and dynamically adjusts its length based on the gap size.

3. Sync Animation Sequence:
   - Keep the sequential reveal animation: The first card appears, then the line in the gap grows (`w-0` to `w-full`), then the second card slides in and attaches, and so on.

4. Fast Execution Note:
   - Skip running the full Playwright/E2E test suite for this UI tweak. Only run `npm run check` for type checking to keep execution fast.

## Response snapshot

- **Overlay removed:** the overlay segment grid is gone. Each card's `<li>` except the last now renders its own connector at `left-full`, with width `var(--process-gap)`.
- **Gap variable:** the same `--process-gap` variable drives the grid gap (24px, or 40px on lg so the line is visible), so the line's length always equals the gap. It runs from one card's right border to the next card's left border, never behind a card.
- **No standalone `<div>`:** a `<div>` placed directly between cards would be invalid inside `<ol>` and would break the grid, so the connector lives inside each loop item instead.
- **Ends:** square ends, so the line meets both borders cleanly.
- **Sequence unchanged:** card → line grows from `w-0` to full over 500ms → next card slides in.
- **Desktop only:** the lines show only in the 4-across desktop row, as before.

## Outcome

- ✅ Impact: the connectors fill only the gaps between cards.
- 🧪 Tests: astro check 0 errors; geometry and sequence verified; E2E skipped by request.
- 📁 Files: Process.astro
- 🔁 Next prompts: commit/push.
- 🧠 Reflection: one shared CSS variable for the gap and the line width keeps them in sync without JS.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): astro check PASS; manual geometry PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none

---
id: 23
title: Footer Company row equal gaps
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: footer fix — equal gaps across the Company row, dot between every link pair
labels: ["footer", "spacing"]
links:
  spec: specs/002-enterprise-repositioning/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - src/components/layout/Footer.astro
tests:
 - npm run check (0 errors, 0 warnings)
 - npm run lint:content (pass)
 - Geometry check at 1440/1280/1024/768: six equal gaps (68.9/66.4/85.1/42.4 px), 5 dots each 0px off centre, one line, row ends at the right edge; email level with the row at 1440 and 1280
---

## Prompt

Footer Company row, one fix only (keep everything else exactly as it is):
1. The gap between the "COMPANY" label and "About" is smaller than the gaps between the links. Make every gap in the row equal: COMPANY → About → How We Work → Start here → Industries → Insights → Contact, with the row still spanning to the right edge (e.g. treat the label and all six links as equal flex items with space-between).
2. The dot separator is missing between "About" and "How We Work". Put a dot between every pair of links (not between COMPANY and About), each dot exactly centred in its gap.
Check at 1440, 1280 and 1024. Run only npm run check and lint:content, one quick visual check at 1440, commit on dev and push. 3-line summary.

## Response snapshot

Label, links and spacers now share one flex row (the list is display: contents from md, with role="list"). Each gap is an equal-growth spacer (24px minimum); the five spacers between links carry an absolutely centred dot. Measured equal gaps and 0px dot offsets at 1440, 1280, 1024 and 768; the row no longer wraps at 768. Phones unchanged.

## Outcome

- ✅ Impact: all six gaps equal, five centred dots.
- 🧪 Tests: check and lint:content pass; geometry check.
- 📁 Files: Footer.astro.
- 🔁 Next prompts: none.
- 🧠 Reflection: a nested flex list with grow ratios did not give equal gaps (label gap 48px short); one flex row did.

## Evaluation notes (flywheel)

- Failure modes observed: first attempt (nested grow ratios) measured unequal; replaced before commit.
- Graders run and results (PASS/FAIL): check PASS, lint:content PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

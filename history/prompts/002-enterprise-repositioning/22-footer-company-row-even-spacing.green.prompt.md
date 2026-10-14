---
id: 22
title: Footer Company row even spacing
stage: green
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: 002-enterprise-repositioning
branch: dev
user: Mubashir Ahmed
command: footer fix — equal space above and below the Company row
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
 - Geometry check at 1440/1024/768 (text-to-line space above vs below the Company row: 24/23, 24/23, 30/29 px; email level with the row at 1440)
---

## Prompt

Footer, one fix only (keep everything else exactly as it is):
The space below the Company row (between the Company links and the bottom bar's top border, above the "© 2026 ZanamTech" line) is much larger than the space above it (between the thin divider line and the Company links). Make the space below the Company row equal to the space between that divider and the Company row, so the row sits evenly between the two lines and the footer gets shorter. The email line must stay aligned with the Company row. Apply the same at 1024 and 768; phone layout unchanged.
Run only npm run check and lint:content, do one quick visual check at 1440, commit on dev and push. 3-line summary.

## Response snapshot

Footer grid bottom padding from md is now 16px (md:pb-4), matching the Company row's pt-4; phones keep pb-10, top padding unchanged. Footer at 1440 went from 427px to 395px; email stays level with the Company row.

## Outcome

- ✅ Impact: Company row sits evenly between the divider and the bottom bar at 768, 1024 and 1440.
- 🧪 Tests: check and lint:content pass; one geometry check.
- 📁 Files: Footer.astro.
- 🔁 Next prompts: at 768 the Company row wraps "Contact" to a second line (unchanged by this fix).
- 🧠 Reflection: none.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): check PASS, lint:content PASS.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

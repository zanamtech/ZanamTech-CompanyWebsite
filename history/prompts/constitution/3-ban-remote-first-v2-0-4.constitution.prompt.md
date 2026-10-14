---
id: 3
title: Ban remote-first, constitution 2.0.4
stage: constitution
date: 2026-10-14
surface: agent
model: claude-opus-5-5
feature: none
branch: dev
user: Mubashir Ahmed
command: constitution patch — remove "remote-first"
labels: ["constitution", "content", "docs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - docs/01_Brand_Positioning.md
 - docs/PROGRESS.md
 - README.md
tests:
 - none (docs only, as requested)
---

## Prompt

Update .specify/memory/constitution.md: remove "remote-first" from the preferred terms and any statement that the site uses it, add it to the banned wording, and bump the patch version. Also update docs/01_Brand_Positioning.md and docs/PROGRESS.md to match. No tests needed. Commit on dev and push.

## Response snapshot

Constitution 2.0.3 → 2.0.4: "remote-first" removed from preferred terms and from the Principle III location bullet, added to "Prohibited on the site", Sync Impact Report entry added, Last Amended 2026-10-14. Brand positioning statement and location section no longer use it. PROGRESS: version bumped, new section 3d, decisions table and footer note updated. README's constitution version reference bumped to v2.0.4.

## Outcome

- ✅ Impact: governance docs match the content lint ban.
- 🧪 Tests: none, as requested.
- 📁 Files: 4 docs.
- 🔁 Next prompts: none.
- 🧠 Reflection: README carried a stale version reference; bumped it for consistency.

## Evaluation notes (flywheel)

- Failure modes observed: none.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null

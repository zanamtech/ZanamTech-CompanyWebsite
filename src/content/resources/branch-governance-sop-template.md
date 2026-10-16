---
title: "Sample: Bitbucket branch-governance SOP template"
summary: A sample standard operating procedure for branch naming, pull requests, reviews, releases, hotfixes and access changes in Bitbucket.
date: 2026-10-12
draft: false
sample: true
---

> **SAMPLE.** A generic template written for illustration. It is not copied from any client's SOPs.

## SOP: Source control and branch governance

**Owner:** Engineering lead · **Applies to:** all repositories in the workspace · **Review:** whenever the process changes

### 1. Branches

| Branch | Purpose | Rules |
| --- | --- | --- |
| `main` | Production-ready code | No direct pushes, no force pushes, no deletion |
| `develop` (optional) | Next release integration | Same restrictions as `main` |
| `feature/<ticket>-<short-name>` | New work | Short-lived; deleted after merge |
| `bugfix/<ticket>-<short-name>` | Non-urgent fixes | Short-lived; deleted after merge |
| `hotfix/<ticket>-<short-name>` | Urgent production fixes | Follows section 5 |

### 2. Starting work

1. Create a branch from the correct base using the naming convention above.
2. Reference the ticket in the branch name and in commit messages.
3. Keep the branch focused on one change and merge it as soon as it is ready.

### 3. Pull requests

1. Open a pull request into the target branch using the PR description template.
2. Include what changed, why, how it was tested, and any deployment notes.
3. The pipeline must pass on the latest commit before review is requested.

### 4. Review and merge

- **Approvals required:** at least one, or two for repositories marked critical.
- **Merge checks:** no unresolved tasks, a passing build, approvals reset on new commits (Bitbucket Premium).
- **Reviewers check:** correctness, tests, security impact, configuration changes and documentation.
- **Merge strategy:** squash merge for feature branches, unless the repository specifies otherwise.

### 5. Hotfixes

1. Branch `hotfix/...` from `main`.
2. Open a pull request with the incident reference.
3. The pipeline must pass; one approval from a release owner is required.
4. After release, merge the fix back into `develop` if it is in use.

### 6. Releases

1. A merge to `main` triggers the release pipeline.
2. Production deployment requires approval from a named release owner.
3. Release notes are generated from merged pull requests.

### 7. Access management

- Access is granted to groups, not individuals.
- Write access requests are approved by the engineering lead and recorded.
- Admin rights are limited to a small named group.
- Access is reviewed regularly; leavers are removed on their last day.

### 8. Exceptions

Any exception to this SOP is approved by the engineering lead, recorded with a reason, and reviewed afterwards.

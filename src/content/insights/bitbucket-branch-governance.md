---
title: "Bitbucket branch governance: the restrictions and SOPs every team should have"
summary: A practical baseline for Bitbucket branch permissions, merge checks and written SOPs that keeps main deployable without slowing developers down.
seoTitle: "Bitbucket branch governance: restrictions & SOPs"
date: 2026-10-26
draft: false
sources: []
---

A repository without branch governance relies on everyone remembering the rules. That works until a busy week, a new
team member or a late-night fix. Bitbucket Cloud has the controls to make the rules automatic. Here is the baseline
we recommend.

## Pick a branching model and write it down

Keep it simple. For most product teams:

- `main` is always deployable and reflects production.
- `develop` (optional) collects work for the next release if you need a staging line.
- Short-lived `feature/`, `bugfix/` and `hotfix/` branches carry individual changes.
- `release/` branches are used only if you ship versioned releases.

Whatever you choose, the branch naming convention belongs in the repository's README or SOP document, and the branching
model in Bitbucket's repository settings should match it.

## Branch restrictions on main

Configure branch permissions so that, on `main`:

- **Nobody pushes directly.** All changes arrive through pull requests.
- **No force pushes and no branch deletion.** History stays intact.
- **Merges are limited** to the people or groups responsible for releases, if your process needs that.

Apply the same restrictions to `develop` and `release/*` if you use them.

## Merge checks that enforce quality

Merge checks turn review rules into requirements. A good baseline:

- At least one approval, or two for high-risk repositories.
- No unresolved tasks on the pull request.
- A successful build from the pipeline on the latest commit.
- Approvals reset when new commits are pushed, so reviewers always approve what is actually merged.
- Default reviewers added automatically for critical paths, using code owners where it helps.

## Pipelines as the gatekeeper

Bitbucket Pipelines (or your CI tool) should run tests, linting and security scans on every pull request, and the
merge check should require that build to pass. Deployment steps to production should use deployment environments
with their own permissions, so only approved people can trigger them.

## Access reviews

Repository permissions accumulate over time. Review workspace and repository access on a regular schedule: remove
leavers, downgrade people who no longer need write access, and keep admin rights to a small group. Use groups rather
than individual permissions, so access follows roles.

## The SOPs that make it stick

Settings enforce rules; SOPs explain them. Every team should have short written procedures for:

1. **Starting work:** branch naming, linking to the ticket, keeping branches short-lived.
2. **Opening a pull request:** description template, screenshots or test evidence, and who should review.
3. **Reviewing:** what reviewers check, and when to request changes rather than approve.
4. **Releasing:** how a merge to `main` reaches production, and who approves it.
5. **Hotfixes:** the expedited path, which still goes through a pull request and a passing build.
6. **Access changes:** who can grant repository access, and how requests are recorded.

Keep SOPs in the repository or a shared wiki, version them, and update them when the process changes.

## Where to start

Turn on "no direct pushes" and "require a passing build" on `main` first. Those two settings prevent most incidents.
Add approvals, task checks and access reviews next, then write the SOPs that describe how your team works today.

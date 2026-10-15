---
title: "Bitbucket branch governance: the restrictions and SOPs every team should have"
summary: A practical baseline for Bitbucket branch permissions, merge checks and written SOPs that keeps main deployable without slowing developers down.
seoTitle: "Bitbucket branch governance: restrictions & SOPs"
date: 2026-10-14
updated: 2026-10-15
draft: false
relatedService: cicd-pipeline-workflow-automation
sources:
  - label: "Atlassian: Bitbucket pricing and plans"
    url: https://www.atlassian.com/software/bitbucket/pricing
  - label: "Atlassian Support: Use branch permissions"
    url: https://support.atlassian.com/bitbucket-cloud/docs/use-branch-permissions/
  - label: "Atlassian Support: Suggest or require checks before a merge"
    url: https://support.atlassian.com/bitbucket-cloud/docs/suggest-or-require-checks-before-a-merge/
  - label: "Atlassian Support: Set up and use code owners"
    url: https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-use-code-owners/
  - label: "Atlassian Support: Set up and monitor deployments"
    url: https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-monitor-deployments/
  - label: "Atlassian Support: Integrate Pipelines with resource servers using OIDC"
    url: https://support.atlassian.com/bitbucket-cloud/docs/integrate-pipelines-with-resource-servers-using-oidc/
  - label: "Microsoft Learn: Workload identity federation"
    url: https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation
---

A repository without branch governance relies on everyone remembering the rules. That works until a busy week, a new
team member or a late-night fix. Bitbucket Cloud has the controls to make most of the rules automatic, but some of
them only warn rather than block unless you are on the Premium plan, and that difference is easy to miss.

This is the baseline we recommend and set up when we take on repository governance, with a clear note of which
controls work on Standard and which need Premium.

<aside class="key-takeaways" aria-labelledby="key-takeaways">
<p id="key-takeaways"><strong>Key takeaways</strong></p>

- Start with branch permissions on `main`: changes only through pull requests, no deletion, no history rewrites.
- Merge checks only warn on Standard. Blocking a merge until they pass needs Bitbucket Cloud Premium.
- Make the pipeline the gatekeeper, and deploy to AWS, Azure or Google Cloud with short-lived OIDC credentials.
- Write short SOPs for the human steps, and review access on a schedule.

</aside>

## Standard or Premium: what each control needs

Atlassian lists four controls that the Premium plan adds to Standard: enforced merge checks, deployment permissions,
IP allowlisting and required two-step verification. In practice:

| Control | Standard | Premium |
| --- | --- | --- |
| Branch permissions (who can write or merge, no deletion or history rewrite) | Yes | Yes |
| Merge checks: approvals, passing builds, resolved tasks, no requested changes | Shown as warnings; users can still merge | Can block the merge ("Prevent a merge with unresolved merge checks") |
| Reset approvals when the source branch changes | No | Yes |
| Deployment permissions (which branches can deploy to an environment) | No | Yes |
| IP allowlisting and required two-step verification | No | Yes |

Plans and features change, so confirm against Atlassian's pricing page before you rely on a specific control.

## Pick a branching model and write it down

Keep it simple. For most product teams:

- `main` is always deployable and reflects production.
- `develop` (optional) collects work for the next release if you need a staging line.
- Short-lived `feature/`, `bugfix/` and `hotfix/` branches carry individual changes.
- `release/` branches are used only if you ship versioned releases.

Turn on the branching model in the repository settings so the branch prefixes are suggested when people create
branches, and so you can apply permissions by branch type. Write the naming convention in the repository README or SOP
document as well; settings show what is allowed, but not why.

## Branch permissions on main

Configure branch permissions so that, on `main`:

- **Nobody pushes directly.** Give write access to no one, and merge access through pull requests to the people or
  groups who are allowed to release.
- **No deletion and no history rewrites.** History stays intact and the branch cannot disappear by mistake.
- **Groups, not individuals.** Grant access to workspace groups, so permissions follow roles when people join or leave.

Apply the same permissions to `develop` and `release/*` if you use them. These settings work on Standard and are the
single most effective step you can take.

## Merge checks that enforce quality

Merge checks turn review rules into requirements. A good baseline:

- At least one approval, or two for high-risk repositories.
- No unresolved pull request tasks and no outstanding "changes requested".
- At least one successful build on the last commit, with no failed or in-progress builds.
- On Premium, reset approvals when new commits are pushed, so reviewers always approve what is actually merged.

On Standard, these checks appear as warnings and a developer can still merge. That is still useful, because it makes
skipping a check a visible, deliberate act, but it is not a control. If your process requires that nothing reaches
`main` without review and a passing build, you need Premium's "Prevent a merge with unresolved merge checks".

## Code owners and default reviewers

A `.bitbucket/CODEOWNERS` file adds the right reviewers to a pull request automatically, based on the files it
changes: the platform group for pipeline and infrastructure files, the payments group for billing code, and so on.
Default reviewers, set in the repository settings, are added to every pull request.

Code owners suggest reviewers; they do not force an approval from them. Combine them with a minimum-approvals merge
check, and keep the file short enough that people actually maintain it.

## Pipelines as the gatekeeper

Bitbucket Pipelines (or your CI tool) should run tests, linting and security scans on every pull request, and the merge
check should require that build to pass. We design these pipelines as part of our
[CI/CD & DevOps Transformation](/services/cicd-pipeline-workflow-automation) work.

For deployments, use Bitbucket deployment environments (Test, Staging and Production) so every release is recorded
against an environment. On Premium, deployment permissions restrict which branches can deploy to Production; on
Standard, protect production with branch permissions and a manual trigger step instead.

Avoid long-lived cloud keys in repository variables. Bitbucket Pipelines can issue OpenID Connect (OIDC) tokens, and
Atlassian documents the setup for AWS and Google Cloud. Azure accepts the same kind of token through Microsoft Entra
workload identity federation. Each deployment then receives short-lived credentials scoped to one environment.

## Access reviews

Repository permissions accumulate over time. Review workspace and repository access on a regular schedule:

1. Remove leavers and accounts that have not been used.
2. Downgrade people who no longer need write access.
3. Keep admin rights to a small group, and record why each admin has them.
4. Check that API tokens, access tokens and SSH or deployment keys still have an owner and a purpose.

On Premium, IP allowlisting and required two-step verification tighten access further.

## The SOPs that make it stick

Settings enforce rules; SOPs explain them. Every team should have short written procedures for:

1. **Starting work:** branch naming, linking to the ticket, keeping branches short-lived.
2. **Opening a pull request:** description template, screenshots or test evidence, and who should review.
3. **Reviewing:** what reviewers check, and when to request changes rather than approve.
4. **Releasing:** how a merge to `main` reaches production, and who approves it.
5. **Hotfixes:** the expedited path, which still goes through a pull request and a passing build.
6. **Access changes:** who can grant repository access, and how requests are recorded.

Keep SOPs in the repository or a shared wiki, version them, and update them when the process changes. Repository
governance with written SOPs is part of what we run day to day in
[Managed Cloud & DevOps](/services/managed-cloud-devops).

## Common mistakes

- **Assuming merge checks block on Standard.** They warn. Check your plan before you write "enforced" in a policy.
- **Permissions granted to individuals.** They outlive role changes. Grant access to groups and review the groups.
- **Approvals that survive new commits.** Without the Premium reset, re-request review when a pull request changes
  substantially.
- **Cloud keys in repository variables.** Prefer OIDC, and rotate anything that must remain a static secret.
- **SOPs nobody reads.** Link them from the pull request template, where people actually look.

## Where to start

Turn on "no direct pushes" on `main` and add the passing-build and approval merge checks first. Those settings prevent
most incidents, even as warnings. Add code owners, deployment environments and access reviews next, decide whether
your process needs Premium's enforcement, then write the SOPs that describe how your team works today.

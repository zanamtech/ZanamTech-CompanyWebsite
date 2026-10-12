---
title: "Dev, QA, UAT, Prod on Azure: an environment strategy that survives real releases"
summary: How to structure Azure environments so code moves predictably from a developer's branch to production, with parity, isolation and controlled promotion at every step.
date: 2026-10-12
draft: false
sources: []
---

Most release problems are not code problems. They are environment problems: a setting that exists in QA but not in
production, a database that drifted, a hotfix that skipped testing because UAT was "busy". A clear environment
strategy fixes this. Here is the approach we use on Azure.

## Four environments, four jobs

Each environment should exist for one reason, and everyone should know what that reason is.

- **Dev** is where integrated work lands first. It changes constantly and is allowed to break.
- **QA** is where automated and manual tests run against a known build. Nothing is deployed to QA by hand.
- **UAT** is where business users confirm that the release does what they asked for. It should look and behave like
  production, with realistic (masked) data.
- **Prod** serves customers. Changes reach it only by promoting a build that has already passed QA and UAT.

If two environments do the same job, merge them. If one environment is doing two jobs, split it.

## Isolation: separate subscriptions or resource groups

At minimum, give each environment its own resource group. For anything handling sensitive data, give production its
own subscription. Separate subscriptions make it much harder for a mistaken command or a broad role assignment in Dev
to touch production, and they make cost reporting per environment straightforward.

Name everything consistently, for example `rg-<app>-<env>-<region>`, and tag every resource with environment, owner
and cost centre. Tags pay for themselves the first time someone asks what a resource is for.

## Parity through Infrastructure as Code

Environments drift when they are built by hand. Define every environment with the same Terraform or Bicep modules,
with only the differences (size, scale limits, network ranges) passed in as parameters. If a resource exists in
production, the code that created it should also be able to create it in Dev.

App Service deployment slots help here. Deploying to a staging slot, warming it up, then swapping it into production
gives you a quick rollback path: swap back.

## Configuration and secrets per environment

Keep configuration out of the code. Store environment-specific settings in App Service configuration or Azure App
Configuration, and store secrets in a separate Key Vault per environment. Applications should read secrets through
managed identities, so no connection strings live in pipelines or repositories.

A useful rule: if copying a production setting into Dev would be dangerous, it belongs in Key Vault.

## Promotion, not redeployment

Build once and promote the same artefact through every environment. The pipeline should:

1. Build and test on every pull request.
2. Deploy the merged build automatically to Dev.
3. Promote that same build to QA when Dev checks pass.
4. Promote to UAT after QA sign-off.
5. Promote to production through an approval gate, ideally via a slot swap.

Rebuilding for each environment means production runs code that was never tested. Promoting one artefact removes
that risk.

## Data: realistic, but never real

UAT is only useful if its data looks real. Refresh it from production on a schedule, with personal data masked or
replaced during the copy. Never point lower environments at production databases, even read-only.

## Hotfixes without shortcuts

Hotfixes are where strategies usually break. Give them a defined path: a hotfix branch, the same pipeline, a short
QA check and an expedited approval. The process can be faster than a normal release, but it should never skip
environments entirely.

## Where to start

If your environments have grown organically, start by writing down what each one is for, then bring the most
critical one (usually production) under Infrastructure as Code. Parity follows naturally once every environment is
built from the same modules.

---
title: "Dev, QA, UAT, Prod on Azure: an environment strategy that survives real releases"
summary: How to structure Azure environments so code moves predictably from a developer's branch to production, with parity, isolation and controlled promotion at every step.
seoTitle: "Azure Dev, QA, UAT and Prod environment strategy"
seoDescription: "How to structure Azure environments so code moves predictably from a developer's branch to production, with parity, isolation and controlled promotion."
date: 2026-10-12
updated: 2026-10-15
draft: false
relatedService: infrastructure-as-code-landing-zones
sources:
  - label: "Microsoft Learn: Set up staging environments in Azure App Service"
    url: https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots
  - label: "Microsoft Learn: Secure your Azure Key Vault"
    url: https://learn.microsoft.com/en-us/azure/key-vault/general/secure-key-vault
  - label: "Microsoft Learn: Assign policy definitions for tag compliance"
    url: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies
  - label: "Microsoft Learn: Define approvals and checks (Azure Pipelines)"
    url: https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals
  - label: "Microsoft Learn: What are Azure management groups?"
    url: https://learn.microsoft.com/en-us/azure/governance/management-groups/overview
  - label: "GitHub Docs: Managing environments for deployment"
    url: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
  - label: "Amazon ECS: Blue/green deployments with CodeDeploy"
    url: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-bluegreen.html
  - label: "Google Cloud: Infrastructure Manager overview"
    url: https://docs.cloud.google.com/infrastructure-manager/docs/overview
  - label: "Google Cloud: Rollbacks, gradual rollouts and traffic migration (Cloud Run)"
    url: https://docs.cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration
  - label: "AWS whitepaper: Organizing your AWS environment using multiple accounts"
    url: https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html
  - label: "Google Cloud: Resource hierarchy"
    url: https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy
---

Most release problems are not code problems. They are environment problems: a setting that exists in QA but not in
production, a database that drifted, a hotfix that skipped testing because UAT was "busy". None of these is solved by
writing better code. They are solved by deciding what each environment is for, building every environment the same
way, and moving one tested build through them in a fixed order.

This article sets out the approach we use on Azure, the mistakes we see most often, and how the same ideas carry over
to AWS and Google Cloud.

<aside class="key-takeaways" aria-labelledby="key-takeaways">
<p id="key-takeaways"><strong>Key takeaways</strong></p>

- Give each environment one job, and isolate production in its own subscription.
- Build every environment from the same Infrastructure as Code modules, with only parameters changing.
- Build once and promote the same artefact from Dev to production, ending with a slot swap behind an approval.
- Keep secrets in one Key Vault per application and environment, read through managed identities.

</aside>

## Four environments, four jobs

Each environment should exist for one reason, and everyone should know what that reason is.

- **Dev** is where integrated work lands first. It changes constantly and is allowed to break.
- **QA** is where automated and manual tests run against a known build. Nothing is deployed to QA by hand.
- **UAT** is where business users confirm that the release does what they asked for. It should look and behave like
  production, with realistic (masked) data.
- **Prod** serves customers. Changes reach it only by promoting a build that has already passed QA and UAT.

If two environments do the same job, merge them. If one environment is doing two jobs, split it. A common example is a
"staging" environment used both for testing and for sales demonstrations: testers need to break it, and the demo needs
it stable. Those are two jobs.

## Isolation: subscriptions first, resource groups second

At minimum, give each environment its own resource group. For anything handling sensitive or customer data, give
production its own subscription, and put the non-production environments in a second one. A subscription is a much
stronger boundary than a resource group: role assignments, policies, quotas and budgets can all be scoped to a
subscription, so a broad role granted in Dev cannot reach production by accident, and cost reporting per environment becomes
straightforward.

Group the subscriptions under management groups (for example one for production and one for non-production) so that
policies are assigned once and inherited, rather than repeated on every subscription.

## Naming and tagging

Name everything consistently, for example `rg-<app>-<env>-<region>` for resource groups and `kv-<app>-<env>` for vaults,
and tag every resource with environment, owner, application and cost centre. Do not rely on people remembering:
Azure Policy can require a tag, add a missing tag, or inherit it from the resource group, so untagged resources never
appear in the first place.

Tags pay for themselves the first time someone asks what a resource is for, or why a bill went up.

## Parity through Infrastructure as Code

Environments drift when they are built by hand. Define every environment with the same Terraform or Bicep modules, and
pass in only the differences (SKU sizes, instance counts, network ranges, alert thresholds) as parameters, one file per
environment:

- `infra/modules/`: the App Service, database, Key Vault and monitoring modules, shared by every environment.
- `infra/env/dev.bicepparam`, `qa.bicepparam`, `uat.bicepparam` and `prod.bicepparam`: one parameter file per
  environment, holding only the differences.

If a resource exists in production, the same code should be able to create it in Dev. Run the plan or what-if step in
the pipeline on every change, and treat a manual change in the portal as an incident to be written back into code. Our
[Infrastructure as Code & Landing Zones](/services/infrastructure-as-code-landing-zones) work starts exactly here.

## Configuration and secrets per environment

Keep configuration out of the code and out of the build. Store non-secret settings in App Service configuration or
Azure App Configuration, and store secrets in Key Vault. Microsoft's own guidance is to use one Key Vault per
application, region and environment, so that a leaked Dev credential can never open the production vault.

Applications should read secrets through managed identities, so no connection strings live in pipelines, repositories
or developers' machines. In App Service, mark environment-specific settings as deployment slot settings, so they stay
with the slot and do not travel during a swap.

A useful rule: if copying a production setting into Dev would be dangerous, it belongs in Key Vault.

## Promotion, not redeployment

Build once and promote the same artefact through every environment. The pipeline should:

1. Build and test on every pull request.
2. Deploy the merged build automatically to Dev.
3. Promote that same build to QA when Dev checks pass.
4. Promote to UAT after QA sign-off.
5. Promote to production through an approval gate, ideally via a slot swap.

Rebuilding for each environment means production runs code that was never tested. Promoting one artefact, identified
by its version or commit, removes that risk. In Azure Pipelines, model each stage as an environment with approvals and
checks; GitHub Actions environments with protection rules do the same job. We design and build these pipelines in our
[CI/CD & DevOps Transformation](/services/cicd-pipeline-workflow-automation) service.

## Slot swaps for production releases

App Service deployment slots (Standard, Premium and Isolated tiers) let you deploy the release to a staging slot,
check it, and swap it into production. App Service warms up the instances in the staging slot before the swap, so
users do not hit a cold start, and if something goes wrong you swap the same two slots again to get the previous
version back.

Two details matter. Database changes must be backwards compatible, because after a swap back the old code runs
against the new schema. And anything slot-specific, such as a connection string to a staging dependency, must be
marked as a slot setting.

## Data: realistic, but never real

UAT is only useful if its data looks real. Refresh it from production on a schedule, with personal data masked or
replaced during the copy, and make the masking step part of the refresh pipeline rather than a manual task. Never point
lower environments at production databases, even read-only.

## Hotfixes without shortcuts

Hotfixes are where strategies usually break. Give them a defined path: a hotfix branch, the same pipeline, a short QA
check and an expedited approval. The process can be faster than a normal release, but it should never skip
environments entirely, and the fix must be merged back to the main branch so the next release does not undo it.

## Common mistakes

- **One subscription for everything.** It works until someone with Contributor rights in Dev runs a script against
  the wrong resource group.
- **A shared Key Vault.** One vault for all environments means every environment can read production secrets.
- **Rebuilding per environment.** Different builds in QA and production make QA results meaningless.
- **UAT that nobody refreshes.** Stale data hides bugs until production.
- **Portal fixes that never reach code.** The next deployment silently reverts them.

## Where to start

If your environments have grown organically, start by writing down what each one is for, then bring the most critical
one (usually production) under Infrastructure as Code. Parity follows once every environment is built from the same
modules. If you would rather have the platform run for you day to day, that is what
[Managed Cloud & DevOps](/services/managed-cloud-devops) covers.

## On AWS or Google Cloud?

The same ideas apply on the other two clouds; only the names change.

| Idea | Azure | AWS | Google Cloud |
| --- | --- | --- | --- |
| Environment boundary | Subscription | Account | Project |
| Grouping and policy | Management groups, Azure Policy | AWS Organizations, organizational units, service control policies | Folders, Organization Policy |
| Infrastructure as Code | Bicep or Terraform | CloudFormation, AWS CDK or Terraform | Terraform (also through Infrastructure Manager) |
| Secrets | Key Vault | AWS Secrets Manager | Secret Manager |
| Workload identity | Managed identities | IAM roles | Service accounts |
| Staged release with quick rollback | App Service slot swap | Blue/green deployment (for example Amazon ECS with CodeDeploy) | Cloud Run revisions with traffic splitting |

On AWS, use separate accounts for production and non-production, grouped into organizational units. On Google Cloud,
use a project per environment, grouped under folders. The rules stay the same everywhere: one job per environment,
one set of modules, one promoted artefact.

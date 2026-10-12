---
title: "Sample: Azure Dev/QA/UAT/Prod reference architecture"
summary: A sample reference architecture for a web application on Azure with four isolated environments, Infrastructure as Code, Key Vault per environment and slot-based releases.
date: 2026-10-12
draft: true
sample: true
---

> **SAMPLE · DRAFT: owner fact-check required.** A generic reference written for illustration. It is not taken from
> any client engagement. Review it before setting `draft: false`.

## Purpose

This reference describes how a typical web application and API can be hosted on Azure across four environments (Dev,
QA, UAT and Prod), so that every environment is built from the same code and releases move predictably to production.

## Environment layout

| Environment | Isolation | Purpose |
| --- | --- | --- |
| Dev | Shared non-production subscription, own resource group | Integration of merged work |
| QA | Shared non-production subscription, own resource group | Automated and manual testing of a known build |
| UAT | Shared non-production subscription, own resource group | Business acceptance with masked, production-like data |
| Prod | Dedicated production subscription | Customer traffic |

## Core components (per environment)

- **Front door and protection:** Azure Front Door with Web Application Firewall policies in front of the application.
- **Application hosting:** Azure App Service plan with a web app and an API app. Production uses a staging slot for
  releases.
- **Data:** Azure SQL Database or Azure Database for PostgreSQL, sized per environment, with automated backups and
  point-in-time restore.
- **Secrets and configuration:** one Key Vault per environment; applications read secrets through managed identities.
- **Storage:** a storage account for files and static assets, with lifecycle rules.
- **Monitoring:** Application Insights and a Log Analytics workspace per environment, with alerts routed by severity.

## Networking

- A virtual network per environment, with private endpoints for the database, Key Vault and storage in production.
- App Service VNet integration so applications reach private resources without public exposure.
- Network security groups that allow only required traffic.

## Identity and access

- Microsoft Entra ID groups mapped to roles per environment.
- Least-privilege role assignments; production write access limited to the release pipeline and a small admin group.
- MFA enforced for every human account.

## Infrastructure as Code

- Terraform or Bicep modules define every resource. Environment differences (sizes, scale limits, address ranges)
  are parameters only.
- Infrastructure changes run through a pipeline with plan review and approval before apply.

## Release flow

1. Pull request: build, test and security scan.
2. Merge: build once and deploy automatically to Dev.
3. Promote the same build to QA, then UAT after sign-off.
4. Promote to the production staging slot, run smoke tests, then swap into production through an approval gate.
5. Roll back by swapping the slots back.

## Backup and recovery

- Automated database backups with point-in-time restore; long-term retention where required.
- Scheduled restore tests into a non-production environment, with results recorded.
- Recovery objectives (RPO and RTO) agreed and documented for production.

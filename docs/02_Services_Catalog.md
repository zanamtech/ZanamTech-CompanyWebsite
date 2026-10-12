# ZanamTech Services Catalogue

> **Source of truth:** `docs/03_Master_Plan_v3.md`, section B. This catalogue is the canonical list
> of service names, slugs, offers and engagement models for the website (Constitution v2.0.0,
> Principle III). No prices appear here or on the site.

The catalogue is one flagship retainer plus 12 services in 4 pillars, 5 entry offers and 5 engagement
models. A service is published only when it can be delivered today. Anything not ready stays
unpublished, with no "coming soon".

## Pillar 1: Managed Cloud & DevOps (flagship)

**Managed Cloud & DevOps** · slug `managed-cloud-devops` · one page with modules.

| Module | Scope |
| --- | --- |
| Cloud operations | App Services, VMs/containers, load balancers/Front Door, managed databases, monitoring and alerting, patching, scaling |
| Environment lifecycle | Dev, QA, UAT and Prod parity, release scheduling, rollbacks |
| CI/CD operations | Pipeline ownership, build health, secrets, approval gates |
| Backup, DR & resilience | Daily/weekly backups, scheduled restore tests, documented RPO/RTO |
| Repository & delivery governance | Bitbucket/GitHub branch restrictions, access reviews, SOPs, change control, audit trail |
| Cost governance | Monthly spend review, rightsizing, budgets and alerts |
| Reporting | Weekly status and a monthly service report (health, cost, risk, changes) |

### Retainer tiers (described on the site by scope and coverage wording only)

| Tier | Coverage wording on the site | Includes |
| --- | --- | --- |
| Essentials | Coverage during your business hours | Monitoring, monthly patching, backup checks, monthly report, small improvement block |
| **Professional** (flagship) | Coverage across your full business day | Essentials plus environments, releases, CI/CD, governance/SOPs, quarterly restore test, monthly cost review, quarterly architecture review |
| Enterprise | Extended coverage with after-hours escalation | Professional plus after-hours P1 escalation, a named backup engineer, quarterly business review, monitoring for AI automations |

**Tier rules:**
- Response targets and coverage hours are fixed in each SOW. They are never shown on the site; see
  `docs/internal/sow-defaults.md`.
- There is no uptime guarantee for infrastructure ZanamTech doesn't own; the cloud provider's SLA
  applies.
- An Enterprise SLA starts only after the backup engineer is contracted under NDA.

### Severity definitions (shown on the flagship page)

| Level | Definition |
| --- | --- |
| P1 | Production down or data at risk |
| P2 | Major function degraded |
| P3 | Minor issue with a workaround |
| P4 | Request or question |

**Onboarding and exit:**
- 4-week onboarding.
- 3-month minimum, then rolling.
- One month's notice.
- Documented handover, with no lock-in.

## Pillar 2: Cloud & DevOps Engineering (fixed-scope projects)

| # | Service | Slug |
| --- | --- | --- |
| 1 | Cloud Migration & Modernisation | `cloud-migration-containerization` |
| 2 | Infrastructure as Code & Landing Zones | `infrastructure-as-code-landing-zones` |
| 3 | CI/CD & DevOps Transformation | `cicd-pipeline-workflow-automation` |
| 4 | Security Hardening & WAF | `enterprise-security-waf-hardening` |
| 5 | High Availability & Disaster Recovery | `high-availability-disaster-recovery` |
| 6 | Observability & Monitoring | `observability-monitoring` |
| 7 | Cloud Cost Optimisation | `cloud-cost-optimization` |

- **Infrastructure as Code & Landing Zones:** Terraform/Bicep, network, identity and policy
  foundations.
- **Migration:** staged, validated cutovers. Never described as "zero downtime".
- **HA/DR:** documented RPO/RTO. Never "zero data loss".

## Pillar 3: Web & SaaS Engineering

| # | Service | Slug |
| --- | --- | --- |
| 8 | Custom Full-Stack Web App Development | `full-stack-web-app-development` |
| 9 | Enterprise Portals & Internal Tools | `enterprise-portals-internal-tools` |
| 10 | Application Modernisation & Integration | `application-modernisation-integration` |

- **Custom Full-Stack Web App Development:** the name and slug are kept; the page SEO title is
  "Custom Web Application Development". It covers web apps and multi-tenant SaaS platforms from MVP
  to scale: auth, billing, admin dashboards, role-based access, REST/GraphQL APIs, and cloud-native
  delivery through CI/CD.
- **Enterprise Portals & Internal Tools:** customer and partner portals, operations dashboards,
  workflow apps.
- **Application Modernisation & Integration:** legacy refactors, APIs, moving to managed PaaS, ERP/CRM
  integrations.

## Pillar 4: Practical AI & Automation

| # | Service | Slug |
| --- | --- | --- |
| 11 | AI Workflow & Document Automation | `ai-workflow-document-automation` |
| 12 | AI Assistants on Company Data | `ai-assistants-company-data` |

- **AI Workflow & Document Automation:** one manual process automated end to end, such as a
  recurring report or document intake (invoices, contracts, forms), with extraction, routing, human
  approval points and audit logs. Bounded agent work lives here.
- **AI Assistants on Company Data:** RAG on managed AI services inside the client's own cloud tenant,
  with citations, permissions and evaluation. No self-hosted LLMs.

AI work enters through the AI Opportunity Sprint or the AI Automation Pilot, so every build starts
small, on real data, with a go/no-go decision before the larger contract.

**Retired:**
- **24/7 Managed Infrastructure** → replaced by the flagship (301 redirect).
- **Intelligent Enterprise AI Integration** → replaced by AI Assistants on Company Data (301 redirect).
- **Agentic AI & LLMOps roadmap entry** → removed (301 to the AI pillar).

## Entry offers ("Start here"; fixed scope and fee, fee never shown)

| Offer | Duration | Output | Leads to |
| --- | --- | --- | --- |
| Cloud & DevOps Health Check | 2–3 weeks | Scorecard, findings, prioritised backlog with cost and risk | Project or retainer |
| Cloud Cost Review | 1–2 weeks | Spend analysis, quick wins applied, 90-day savings roadmap | Cost governance in the retainer |
| DevOps Governance Quick-Start | 2 weeks | Branch policies, pipeline gates, SOPs, access review | Retainer |
| AI Opportunity Sprint | 1–2 weeks | Processes ranked by hours saved × volume, pilot spec; fee credited to the pilot | AI pilot |
| AI Automation Pilot | about 4 weeks | One workflow on real data, run beside the current process, go/no-go report | AI build or managed AI |

The primary CTA is a strategy consultation, with no stated length. There is no "free audit".

## Engagement models

1. **Assessment:** fixed fee.
2. **Fixed-scope project:** under an SOW with milestones and acceptance criteria.
3. **Managed retainer:** 3-month minimum, then rolling; one month's notice; documented handover, no
   lock-in.
4. **Agency partnership:** ZanamTech runs cloud and DevOps for an agency's client projects,
   white-label or co-branded, under NDA with mutual non-solicitation.
5. **Extended engineering capacity:** offered only once a vetted engineer pool exists.

## Results from past engagements (worded as achieved)

| Result | Related service |
| --- | --- |
| 99.9% availability achieved | Cloud Migration & Modernisation |
| 80% attack-surface reduction | Security Hardening & WAF |
| Up to 40% monthly cloud savings | Cloud Cost Optimisation |
| 50% faster deployments | CI/CD & DevOps Transformation |
| 35% fewer release errors | CI/CD & DevOps Transformation |
| 45% faster incident detection | Observability & Monitoring |
| 30% MTTR improvement | Observability & Monitoring |
| Up to 60% hardware maintenance cost reduction | Cloud Migration & Modernisation |

Footnote, required wherever results appear: "Results from past engagements; outcomes vary by
environment. Commitments are defined per Statement of Work."

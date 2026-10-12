# Data Model: Enterprise Repositioning (002)

Everything is static content (Astro content collections and typed data modules), validated at build
time. There is no database.

## Service (collection `services`, `src/content/services/*.md`)
| Field | Type | Rules |
|---|---|---|
| id | slug (filename) | Unique. Kept: `full-stack-web-app-development`, the 7 cloud-devops slugs. New: `managed-cloud-devops`, `infrastructure-as-code-landing-zones`, `enterprise-portals-internal-tools`, `application-modernisation-integration`, `ai-workflow-document-automation`, `ai-assistants-company-data` |
| order | int ≥ 1 | Unique; order within a pillar |
| name | string ≥ 3 | Canonical name from v3 |
| seoTitle | string? | e.g. "Custom Web Application Development" |
| pillar | enum `managed \| cloud-devops \| web-saas \| ai` | Exactly 1 `managed` entry |
| flagship | boolean | `true` only for `managed-cloud-devops` |
| published | boolean | Readiness gate (FR-014) |
| icon | string | An existing Lucide name in `Icon.astro` |
| summary | string ≤ 220 | Passes the Constitution III lint |
| deliverables | string[] (3–8) | "What you get" |
| engagementTypes | enum[] of `assessment \| project \| retainer \| agency \| capacity` | ≥ 1 |
| capabilities | string[] (3–7) | For the flagship, these are the 7 modules |
| stack | string[] ≥ 1 | No GCP |
| outcome | string | Achieved-result wording or a qualitative outcome; never "target" or "guarantee" |
| scenarios | Scenario[] (1–2) | See below |
| faq | {q, a}[] (0–6) | Optional |
| relatedOffer | Offer id? | References `offers.ts` |

**Scenario**: `{ kind: 'real' | 'illustrative', problem, solution, outcome, evidenceId? }`.
Refinement: if `kind === 'illustrative'`, none of the three fields may contain any digit
(Constitution III: illustrative examples carry no numbers). Rendered label: "Example engagement" for illustrative scenarios; real ones have no label.

## Pillar (`src/lib/services.ts`)
`{ id, title, description, order }`:
- `managed`: Managed Cloud & DevOps
- `cloud-devops`: Cloud & DevOps Engineering
- `web-saas`: Web & SaaS Engineering
- `ai`: Practical AI & Automation (anchor `#ai` on `/services`)

## Result (`src/data/results.ts`, replaces `metrics.ts`)
`{ id, value, decimals, suffix, qualifier?, label, context, service, attribution, evidenceId? }`:
- `label` uses achieved wording (e.g. "faster deployments for a B2B SaaS platform").
- `context` is "Industry · challenge", derived from the matching real scenario.
- `attribution` is `'zanamtech' | 'pre-zanamtech'` and is internal only (never rendered).

The 8 ids are kept: `uptime, attack-surface, cost, deploy, detection, mttr, hardware, release-errors`.

## Retainer Tier (`src/data/managed-tiers.ts`)
`{ id: 'essentials' | 'professional' | 'enterprise', name, coverage, includes[], featured? }`:
- `coverage` is wording only, for example "Coverage during your business hours", "Coverage across your full
  business day", "Extended coverage with after-hours escalation". No digits are allowed in `coverage`.
- **SeverityLevel**: `{ level: 'P1' | 'P2' | 'P3' | 'P4', definition }`.
- Internal SOW response defaults live in `docs/internal/sow-defaults.md` only.

## Entry Offer (`src/data/offers.ts`)
`{ id, name, duration ('2–3 weeks'), inputs[], deliverables[], nextStep, creditsToFollowOn: boolean }`.
There are 5 entries: `health-check, cost-review, governance-quick-start, ai-opportunity-sprint, ai-automation-pilot`.

## Engagement Model (`src/data/engagement.ts`, extended)
- `engagementPhases`: the existing 4, renamed without "Zero-Downtime" or "24/7".
- `engagementModels`: assessment, project, retainer (exit terms), agency partnership, extended capacity.
- `cadence[]`, `accessModel[]`, `aiToolPolicy[]`.

## Commitment (`src/data/commitments.ts`)
`['Written proposal within 2 business days', 'We reply within 1 business day', 'Weekly status reports', 'Monthly service review', 'No lock-in handover']`.
These are the only lint-allowed time phrases.

## FAQ (`src/data/faq.ts`)
`{ q, a }[]` for the Home FAQ (contracts, IP ownership, data residency, NDA, how engagements start).

## Proof Entry (`src/data/clients.ts`, `src/data/testimonials.ts`, collection `caseStudies`)
- **Common fields**: `verified: boolean`, `permissionDate: ISO date`, `evidence: string`.
- **Client**: `{ name, logo (local asset path), url? }`.
- **Testimonial**: `{ quote, attribution (role, company type) }`.
- **CaseStudy** (markdown): `{ title, industry, challenge, approach, result, stack[], timeline }`.

Rendered only when `verified === true`. **All three ship empty.**

## Insight Article (collection `insights`) / Artefact (collection `resources`)
`{ title, summary, date, draft: boolean, sources?: {label, url}[] }`, and for artefacts `sample: true`.
They are visible when `!draft || import.meta.env.DEV`.

## Leadership Profile (`src/data/leadership.ts`)
`{ name: 'Mubashir Ahmed', role: 'Founder & Lead Architect', bio[], linkedin: '', companyLinkedin: '', photo: '', certifications: [] }`.
Empty strings hide the related element.

## Lead Request (extended; see `contracts/lead-submission.md`)
New optional fields: `region`, `companySize`, `cloudPlatform`. The `service` options are the published
names, then `Agency partnership`, then `Other / Not sure yet`.

## Segment (`src/data/segments.ts`)
- The existing SaaS and mid-market segments, re-mapped to the new slugs.
- New: `software-agencies`, `gcc`.
- Data-sensitive AI is removed from the current segments.

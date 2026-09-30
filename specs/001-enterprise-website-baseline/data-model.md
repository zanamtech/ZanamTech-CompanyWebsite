# Data Model: ZanamTech Enterprise Website (Baseline)

All data is build-time content; no runtime persistence.

## Service (content collection `services`)
| Field | Type | Rules |
|---|---|---|
| order | integer | 1–9 for active; 100+ for roadmap; unique |
| name | string | Canonical name from `docs/02_Services_Catalog.md` |
| group | enum | `cloud-infrastructure` \| `engineering-ai` |
| icon | string | Lucide icon name |
| summary | string | ≤ 220 chars |
| capabilities | string[] | 3–6 items |
| stack | string[] | ≥ 1 |
| outcome | string | Worded as a target |
| scenarios | Scenario[] | exactly 2 |
| status | enum | `active` \| `roadmap` |
Slug = file id (e.g. `cloud-migration-containerization`).

## Scenario (embedded)
`{ problem: string, solution: string, outcome: string }`

## MetricTarget (`src/data/metrics.ts`)
`{ value: number, decimals: number, prefix?: string, suffix: string, label: string, service: slug }`

## EngagementPhase (`src/data/engagement.ts`)
`{ order: 1..4, name: string, description: string }`

## TargetSegment (`src/data/segments.ts`)
`{ name, decisionMakers: string[], challenges: string[], value: string }`

## LeadRequest (transient, `src/lib/lead.ts`)
| Field | Rule |
|---|---|
| name | required, 2–100 |
| email | required, valid email |
| company | required, 1–120 |
| role | optional, ≤ 100 |
| service | optional, one of active service names or "Not sure yet" |
| message | required, 20–2000 |
| consent | must be `true` |
| botcheck | must be empty |

State machine (form): `idle → submitting → success | error`; `error → submitting` (retry keeps data).

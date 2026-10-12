# Contract: Routes and Redirects (002)

## Public routes after this feature
| Route | Status | Source |
|---|---|---|
| `/` | reworked | `src/pages/index.astro` |
| `/services` | reworked (grouped by pillar; `#ai` anchor on the AI pillar) | `src/pages/services/index.astro` |
| `/services/managed-cloud-devops` | new (flagship layout) | `[slug].astro` (flagship branch) |
| `/services/<slug>` × 12 | extended template | `[slug].astro` |
| `/start-here` | new | `src/pages/start-here.astro` |
| `/approach` | reworked, labelled "How We Work" | `src/pages/approach.astro` |
| `/industries` | updated | `src/pages/industries.astro` |
| `/about` | reworked | `src/pages/about.astro` |
| `/trust` | new | `src/pages/trust.astro` |
| `/insights`, `/insights/<slug>` | new; only non-draft entries in builds | `src/pages/insights/` |
| `/resources/<slug>` | new; artefacts; only non-draft entries in builds | `src/pages/resources/[slug].astro` |
| `/case-studies`, `/case-studies/<slug>` | new; built only when there is at least 1 verified entry | `src/pages/case-studies/` |
| `/contact`, `/privacy`, `/terms` | updated / updated / new | `src/pages/` |
| `/.well-known/security.txt` | new | `public/.well-known/security.txt` |

All published routes appear in the sitemap. Draft and unpublished routes are never generated in builds.

## Permanent redirects (nginx, HTTP 301)
| From (optional trailing slash) | To |
|---|---|
| `/services/managed-infrastructure-24-7` | `/services/managed-cloud-devops` |
| `/services/enterprise-ai-integration` | `/services/ai-assistants-company-data` |
| `/services/agentic-ai-llmops` | `/services#ai` |

Implemented as `location ~ ^/services/<old>/?$ { include /etc/nginx/security-headers.conf; return 301 <to>; }`
in `nginx/nginx.conf`, placed before `location /`.

**Verification:**
- A static test parses `nginx/nginx.conf` and checks each rule and its status code.
- Each target must exist in `dist/`.
- E2E checks that the old paths are not generated as pages.

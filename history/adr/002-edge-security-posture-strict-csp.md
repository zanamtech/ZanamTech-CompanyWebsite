# ADR-002: Edge Security Posture (Strict Hash-Based CSP, Alpine CSP Build, Hardened Nginx Runtime)

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-09-29
- **Feature:** 001-enterprise-website-baseline
- **Context:**
  - **The mandate.** ZanamTech sells zero-trust security, so the website must demonstrate that posture. Constitution Principle V mandates strict CSP and security headers, no secrets, and allow-listed third-party origins. Principle VI mandates Docker with an Nginx runtime and an image under 25 MB. The plan only said "Nginx CSP/HSTS/etc.", so the concrete policy was decided during T058.
  - **Two obstacles to a strict policy surfaced during implementation.**
  - **Obstacle 1: Alpine needs eval.** Standard Alpine.js evaluates every `x-*` expression with `new AsyncFunction(...)`. A CSP would therefore need `script-src 'unsafe-eval'`, which lets any injected string become executable code.
  - **Obstacle 2: the build inlines content.** Astro and Vite inline small stylesheets and small assets by default. `tests/e2e/security.spec.ts` caught a Plus Jakarta Sans subset inlined as a `data:font/woff2` URI, which a strict `font-src 'self'` blocks.
  - **The runtime image.** The originally researched `nginx:alpine` is about 48 MB uncompressed, well above the 25 MB target (research R9).

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?  YES — governs how every future script, style, asset and third-party integration is authored and deployed.
     2) Alternatives: Multiple viable options considered with tradeoffs?   YES — see Alternatives Considered.
     3) Scope: Cross-cutting concern (not an isolated detail)?             YES — spans Alpine runtime, Astro/Vite build config, Nginx config, Docker image, CI gates and tests.
-->

## Decision

The security posture is one integrated cluster; each part exists so the others can stay strict.

- **Content-Security-Policy** (`nginx/security-headers.conf`):
  `default-src 'none'; script-src 'self' 'sha256-<theme script>'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.web3forms.com; form-action 'self' https://api.web3forms.com; manifest-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests`
  - It contains **no `'unsafe-inline'` and no `'unsafe-eval'`**.
  - The only inline script is the no-flash theme loader in `BaseLayout.astro`. It is allowed by its **SHA-256 hash**, not a nonce, because the site is static and nothing rewrites HTML per request.
  - The JSON-LD `<script type="application/ld+json">` is a non-executable data block and needs no allowance.
- **Alpine CSP build** (`@alpinejs/csp`, aliased as `alpinejs` in `astro.config.mjs`). Expressions are parsed by Alpine's own interpreter, not `eval`. Authoring rules follow from the parser:
  - Markup expressions are limited to property access, calls, assignments, ternaries and operators.
  - Statement logic (`if`/`else` blocks), arrow functions, template literals and global or `document` access move into **registered components**: `Alpine.data('siteHeader')`, `Alpine.data('leadForm')` and `Alpine.store('theme' | 'contact')` in `src/scripts/alpine.ts`.
- **Build configuration** that keeps output CSP-clean:
  - `build.inlineStylesheets: 'never'`: all CSS ships as files.
  - `vite.build.assetsInlineLimit: 0`: no `data:` fonts or assets.
  - No `style="..."` attributes in markup. Runtime styling uses classes, or CSSOM changes by Alpine and Framer Motion, which CSP permits.
- **Other response headers:**
  - HSTS `max-age=31536000; includeSubDomains`, with **no `preload`**. Enrolling in the browser preload list is hard to reverse and is left as an explicit owner decision.
  - `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
  - A restrictive `Permissions-Policy`.
  - `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin`.
- **Hardened Nginx runtime** (`nginx/nginx.conf`, `Dockerfile`):
  - `nginx:stable-alpine-slim`, running as the unprivileged `nginx` user on port 8080, with pid and temp paths under `/tmp`.
  - `server_tokens off`, GET/HEAD only (otherwise 405), and `client_max_body_size 1k`.
  - The headers are included in **every** location, because nginx drops inherited `add_header` in locations that declare their own.
  - `^~ /_astro/` for immutable caching.
  - A multi-stage build (`node:22-alpine` → slim runtime) that ships only `dist/` and the config.
- **Drift guardrails:**
  - `npm run check:csp` (`scripts/check-csp.mjs`, also run inside the Docker build) fails when:
    - an inline script hash is missing
    - an inline `<style>` or `style=""` appears
    - a `data:` font is inlined
    - the form or analytics origin is absent from `connect-src`, `form-action` or `script-src`
  - `tests/e2e/security.spec.ts` serves every page with the production CSP and asserts zero violations while the theme toggle, services menu, dialog, form submission, counters and reveal are exercised.

## Consequences

### Positive

- **Credible zero-trust posture.** Injected markup cannot execute script, because there is no inline or eval allowance and default-src is `'none'`. The site is not framable, and outbound connections and form posts are limited to one allow-listed provider. The site demonstrates the positioning it sells.
- **No runtime infrastructure for nonces.** Hashes suit a static site; there is no per-request HTML rewriting, njs or Lua.
- **Regressions are caught automatically.** The CSP test already found a real production break, the inlined font, that type checks, axe and unit gates all missed.
- **Better component discipline.** Moving logic into named Alpine components makes behaviour type-checked (`astro check`) and testable, not hidden in attribute strings.
- **Smaller attack surface and footprint.** The non-root slim runtime has no build tooling in the image.

### Negative

- **Authoring constraints.** Developers must learn the Alpine CSP subset. Any statement-style logic needs a registered component, and a violation fails only at runtime in the browser. The e2e suite mitigates this, but it doesn't catch new, untested expressions.
- **Hash maintenance.** Any edit to the inline theme script changes its hash, so `security-headers.conf` must be updated. `check:csp` enforces this, but it is a manual step.
- **Manual origin management.** Enabling analytics or changing the form provider requires a CSP edit. This is deliberate friction; `check:csp` flags omissions.
- **Headers depend on Nginx.** If the site is later fronted by a CDN or moved to another static host, the headers must be reproduced there. A `<meta>` CSP fallback cannot express `frame-ancestors`.
- **HSTS `includeSubDomains`** forces HTTPS on all subdomains of the served host for a year. Any HTTP-only subdomain must be migrated first.
- **The image size is still unverified.** The 25 MB target depends on the `alpine-slim` base and can't be confirmed until T060 runs on a machine with Docker.
- **`img-src data:`** is kept for flexibility; it can be tightened later if nothing requires it.

## Alternatives Considered

**Alternative A: standard Alpine with `'unsafe-eval'` (and `'unsafe-inline'` for convenience)**
- Pros: unrestricted inline expressions; no build configuration changes.
- Cons: any HTML injection becomes code execution. It contradicts Principle V and the company's zero-trust positioning, and security scanners flag it.
- **Rejected.**

**Alternative B: nonce-based CSP**
- A per-request nonce injected by Nginx via `sub_filter` plus njs or Lua, or an SSR adapter.
- Pros: no hash upkeep; allows many inline scripts.
- Cons: needs per-request HTML rewriting, which breaks static caching and adds njs or Lua modules to the image. It is overkill for a single static inline script.
- **Rejected.**

**Alternative C: externalize the theme script, with no inline script and no hash**
- Pros: no hash to maintain.
- Cons: to prevent a flash of the wrong theme, it must be render-blocking in `<head>`, which adds a critical-path request and hurts LCP (Principle I).
- **Rejected** in favour of a hashed inline script of about 100 bytes.

**Alternative D: permissive build output (inline styles and data: fonts allowed via `'unsafe-inline'` / `font-src data:`)**
- Pros: default Astro and Vite behaviour; slightly fewer requests.
- Cons: `'unsafe-inline'` styles enable CSS-based data exfiltration and UI redress. Allowing data: fonts widens the policy for a trivial gain.
- **Rejected.**

**Alternative E: CSP delivered as a `<meta http-equiv>` tag**
- Pros: host-agnostic.
- Cons: cannot express `frame-ancestors`, reporting or HSTS, and is applied only after parsing starts. Nginx is mandated anyway.
- **Rejected** as primary. It remains a fallback option if hosting changes.

**Alternative F: runtime image `nginx:alpine` or `nginxinc/nginx-unprivileged:alpine`**
- Pros: familiar, with built-in non-root (unprivileged).
- Cons: about 48 MB uncompressed, which exceeds the 25 MB target.
- **Rejected** for `nginx:stable-alpine-slim`, with a custom non-root `nginx.conf`.

## References

- Feature Spec: specs/001-enterprise-website-baseline/spec.md (FR-020, FR-021, FR-032, FR-034, FR-035)
- Implementation Plan: specs/001-enterprise-website-baseline/plan.md (Constitution Check V/VI, Key Decisions)
- Research: specs/001-enterprise-website-baseline/research.md (R3 Alpine, R6 form endpoint, R9 container image — revised by this ADR, R10 analytics)
- Contract: specs/001-enterprise-website-baseline/contracts/lead-submission.md (endpoint origin must be allow-listed)
- Tasks: specs/001-enterprise-website-baseline/tasks.md (T058, T059, T060, T061)
- Constitution: .specify/memory/constitution.md (Principles I, V, VI, VII)
- Implementation: nginx/security-headers.conf, nginx/nginx.conf, Dockerfile, astro.config.mjs, src/scripts/alpine.ts, scripts/check-csp.mjs, tests/e2e/security.spec.ts
- Related ADRs: [ADR-001](./001-client-interactivity-and-motion-runtime.md) (client runtime; the Alpine CSP build is shared by both)
- Evaluator Evidence: history/prompts/001-enterprise-website-baseline/5-implement-phases-4-to-10.green.prompt.md (CSP e2e caught inlined data: font; 103 e2e passing; check:csp PASS)

# Research: ZanamTech Enterprise Website (Baseline)

## R1. Astro version
- **Decision**: Keep installed Astro ^7.3.5.
- **Rationale**: The mandate is "Astro 4.0"; the stakeholder approved "4.0 or later". Current integrations (`@astrojs/react` 7, `@astrojs/alpinejs` 1, `@astrojs/sitemap` 3) target it.
- **Alternatives**: Pin 4.x — rejected (EOL, integration drift).

## R2. Framer Motion hosting
- **Decision (revised)**: Framer Motion DOM engine (`framer-motion/dom`: `animate`, `inView`) from plain modules, lazy-loaded; no client React. See [ADR-001](../../history/adr/001-client-interactivity-and-motion-runtime.md).
- **Rationale**: The original premise ("Framer Motion is React-bound") was false. React islands measured 110 KB gz on Home (budget 100 KB); DOM engine build is ~41.5 KB total.
- **Alternatives**: React islands (original; over budget), Preact compat (framework change), vanilla `motion` (mandate conflict).

## R3. Alpine.js integration
- **Decision**: `@astrojs/alpinejs` with `entrypoint: '/src/scripts/alpine.ts'` registering `theme`/`contact` stores and `siteHeader`/`leadForm` components; `alpinejs` aliased to the CSP build (`@alpinejs/csp`) so no `'unsafe-eval'` is needed — see [ADR-002](../../history/adr/002-edge-security-posture-strict-csp.md).
- **Rationale**: Single global script (~21 KB gz incl. site logic); declarative markup in `.astro` files; statement logic lives in registered components.

## R4. Tailwind v4 dark mode
- **Decision**: `@custom-variant dark (&:where(.dark, .dark *));` with semantic CSS variables in `@theme`.
- **Rationale**: Class-based dark mode enables a user toggle; variables let tokens swap per theme.

## R5. Theme without flash
- **Decision**: Inline `<script is:inline>` in `<head>` reads `localStorage['zt-theme']`, adds `.dark` only when value is `dark`; default light.

## R6. Hosted form endpoint
- **Decision**: Web3Forms-compatible JSON POST (`access_key`, fields, `botcheck`), 10 s `AbortController` timeout.
- **Rationale**: No server runtime, provider-side spam filtering, email delivery. Key is public and domain-restricted by design; still kept in `.env`.
- **Alternatives**: Own API container — more ops surface; Formspree — equivalent, swappable via env vars.

## R7. Glassmorphism and contrast
- **Decision**: Glass only over `--bg` or low-contrast mesh; 65% (light) / 55% (dark) opacity with 14 px blur; `@supports not (backdrop-filter: blur(1px))` → opaque `--surface`.

## R8. Fonts
- **Decision**: `@fontsource-variable/plus-jakarta-sans` self-hosted (no third-party font origin in CSP), `font-display: swap`.

## R9. Container image
- **Decision (revised)**: `node:22-alpine` builder → `nginx:stable-alpine-slim` runtime as non-root `nginx` user on :8080; static `dist/` + config only. `nginx:alpine` / `nginx-unprivileged:alpine` (~48 MB uncompressed) exceed the 25 MB target. See [ADR-002](../../history/adr/002-edge-security-posture-strict-csp.md). Size to be verified in T060.

## R10. Analytics
- **Decision**: Cookieless Plausible/Umami-compatible script loaded only when `PUBLIC_ANALYTICS_DOMAIN` and `PUBLIC_ANALYTICS_SRC` are set; origin added to CSP.

## R11. Icons
- **Decision**: `lucide-react` icons rendered inside `.astro` files without a client directive → static SVG, zero JS.

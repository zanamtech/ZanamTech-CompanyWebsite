# syntax=docker/dockerfile:1

# ---- Build stage ----------------------------------------------------------------------------
# Pinned to a minor version and digest (multi-arch index) for reproducible builds. Bump both together.
FROM node:22.23-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# PUBLIC_* values are baked into the static build. Pass them as build args (never commit .env).
ARG PUBLIC_SITE_URL
ARG PUBLIC_FORM_ENDPOINT
ARG PUBLIC_FORM_ACCESS_KEY
ARG PUBLIC_ANALYTICS_DOMAIN
ARG PUBLIC_ANALYTICS_SRC
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL \
    PUBLIC_FORM_ENDPOINT=$PUBLIC_FORM_ENDPOINT \
    PUBLIC_FORM_ACCESS_KEY=$PUBLIC_FORM_ACCESS_KEY \
    PUBLIC_ANALYTICS_DOMAIN=$PUBLIC_ANALYTICS_DOMAIN \
    PUBLIC_ANALYTICS_SRC=$PUBLIC_ANALYTICS_SRC
RUN npm run lint:content && npm run build && npm run check:csp

# ---- Runtime stage --------------------------------------------------------------------------
# alpine-slim keeps the runtime image small (target < 25 MB). Pinned to the stable minor and digest, like the build stage.
FROM nginx:1.30-alpine-slim@sha256:3028fc1419f99b95c1c69f844bbaf49dc1b881750c51b497fc721ac4f02a14e6 AS runtime

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Run as the unprivileged nginx user; nginx.conf keeps pid and temp files under /tmp.
USER nginx

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

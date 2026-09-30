# syntax=docker/dockerfile:1

# ---- Build stage ----------------------------------------------------------------------------
FROM node:22-alpine AS build
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
# alpine-slim keeps the runtime image small (target < 25 MB).
FROM nginx:stable-alpine-slim AS runtime

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Run as the unprivileged nginx user; nginx.conf keeps pid and temp files under /tmp.
USER nginx

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

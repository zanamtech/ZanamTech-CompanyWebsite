#!/usr/bin/env bash
# Smoke test for the production image (audit F-66 e): real nginx 301s, status codes and security headers.
# Usage: scripts/docker-smoke.sh [base-url]   (default http://localhost:8080, e.g. `docker run -p 8080:8080 <image>`)
set -u
BASE="${1:-http://localhost:8080}"
fail=0

# status <path> <code> [location]: the response status and, for redirects, the exact Location header.
status() {
  local path="$1" want="$2" want_location="${3:-}"
  local headers code location
  headers="$(curl -s -o /dev/null -D - "$BASE$path")"
  code="$(printf '%s' "$headers" | head -n1 | awk '{print $2}')"
  location="$(printf '%s' "$headers" | tr -d '\r' | awk 'tolower($1)=="location:" {print $2}')"
  if [ "$code" != "$want" ] || { [ -n "$want_location" ] && [ "$location" != "$want_location" ]; }; then
    echo "FAIL $path: got $code ${location:-}, want $want $want_location"
    fail=1
  else
    echo "ok   $path -> $code ${location:-}"
  fi
}

# Round 1: one URL per page.
status /about 200
status /about/ 301 /about
status '/contact/?service=agency-partnership' 301 '/contact?service=agency-partnership'
status /services 200
status /services/managed-cloud-devops 200
status /no-such-page 404

# Round 3: .html URLs and the 404 page.
status /about.html 301 /about
status '/about.html?x=1' 301 '/about?x=1'
status /services/managed-cloud-devops.html 301 /services/managed-cloud-devops
status /index.html 301 /
status /404 404
if ! curl -s "$BASE/404" | grep -q '<title>Page not found'; then
  echo "FAIL /404: the body is not the site 404 page"
  fail=1
fi
# No open redirect from a protocol-relative path.
status '//evil.example/' 301 /

# Retired services.
status /services/managed-infrastructure-24-7 301 /services/managed-cloud-devops
status /services/enterprise-ai-integration 301 /services/ai-assistants-company-data
status /services/agentic-ai-llmops 301 '/services#ai'

# Security headers on a page and on a redirect.
header_fail=0
for path in /about /about/; do
  headers="$(curl -s -o /dev/null -D - "$BASE$path" | tr -d '\r')"
  for name in Content-Security-Policy Strict-Transport-Security X-Frame-Options X-Content-Type-Options \
    Referrer-Policy Permissions-Policy Cross-Origin-Opener-Policy Cross-Origin-Resource-Policy; do
    if ! printf '%s' "$headers" | grep -qi "^$name:"; then
      echo "FAIL $path: missing $name"
      header_fail=1
    fi
  done
done
if [ "$header_fail" = 0 ]; then echo "ok   security headers present"; else fail=1; fi

exit "$fail"

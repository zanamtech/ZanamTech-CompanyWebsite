# Contract: Lead Submission (client → hosted form endpoint)

**Endpoint**: `POST ${PUBLIC_FORM_ENDPOINT}` (e.g. `https://api.web3forms.com/submit`)
**Headers**: `Content-Type: application/json`, `Accept: application/json`
**Timeout**: 10 s (client `AbortController`); no automatic retry — user-initiated retry only.

## Request body
```json
{
  "access_key": "${PUBLIC_FORM_ACCESS_KEY}",
  "subject": "New consultation request — ZanamTech website",
  "from_name": "ZanamTech Website",
  "name": "string",
  "email": "string",
  "company": "string",
  "role": "string",
  "service": "string",
  "message": "string",
  "consent": true,
  "botcheck": ""
}
```

## Responses
| Status | Body | Client result |
|---|---|---|
| 200 | `{ "success": true }` | `{ ok: true }` → success state |
| 4xx | `{ "success": false, "message": "..." }` | `{ ok: false, reason: 'rejected' }` |
| 5xx | any | `{ ok: false, reason: 'server' }` |
| — | network error | `{ ok: false, reason: 'network' }` |
| — | > 10 s | `{ ok: false, reason: 'timeout' }` |

## Client guarantees
- Not sent if client validation fails or `botcheck` is non-empty (honeypot → silently reported as success).
- Entered data preserved on any failure.
- Endpoint origin must be allow-listed in CSP `connect-src`.

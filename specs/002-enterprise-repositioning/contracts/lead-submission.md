# Contract: Lead Submission v2 (client → hosted form endpoint)

This supersedes `specs/001-enterprise-website-baseline/contracts/lead-submission.md`. Transport,
timeout, responses and client guarantees are unchanged; only the request body grows.

**Endpoint**: `POST ${PUBLIC_FORM_ENDPOINT}` · **Headers**: `Content-Type: application/json`,
`Accept: application/json` · **Timeout**: 10 s, user-initiated retry only.

## Request body
```json
{
  "access_key": "${PUBLIC_FORM_ACCESS_KEY}",
  "subject": "New consultation request — ZanamTech website",
  "from_name": "ZanamTech Website",
  "name": "string (2–100)",
  "email": "string (valid email)",
  "company": "string (1–120)",
  "phone": "string (optional, may be empty)",
  "service": "string (required; a published service name | \"Agency partnership\" | \"Other / Not sure yet\")",
  "region": "string (optional; \"US / Canada\" | \"UK / Europe\" | \"GCC\" | \"Other\" | \"Not specified\")",
  "companySize": "string (optional; \"1–10\" | \"11–50\" | \"51–200\" | \"201–1,000\" | \"1,000+\" | \"Not specified\")",
  "cloudPlatform": "string (optional; \"Azure\" | \"AWS\" | \"Both\" | \"Other\" | \"Not specified\")",
  "budget": "string (optional engagement-size band, or \"Not specified\")",
  "message": "string (20–2000)",
  "consent": true,
  "botcheck": ""
}
```

## Validation (client)
- `service` must be one of the generated options. Optional selects, if set, must be one of their
  listed values; otherwise "Please choose an option from the list."
- Empty optional selects are sent as `"Not specified"`.
- Field order for focusing the first error: name, email, company, phone, service, region, companySize,
  cloudPlatform, budget, message, consent.

## Responses (unchanged)
| Status | Client result |
|---|---|
| 200 `{ success: true }` | `{ ok: true }` → success state |
| 4xx | `{ ok: false, reason: 'rejected' }` |
| 5xx | `{ ok: false, reason: 'server' }` |
| network error | `{ ok: false, reason: 'network' }` |
| > 10 s | `{ ok: false, reason: 'timeout' }` |

## Success copy (FR-034)
"Thank you. We reply within 1 business day to arrange your consultation." No engineer or team is
mentioned.

## Client guarantees (unchanged)
- The form is not sent if validation fails or the honeypot is filled (silently reported as success).
- Entered data is kept on failure.
- The endpoint origin is allow-listed in the CSP `connect-src`.

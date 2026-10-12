/**
 * Client logos (ADR-003, Constitution III). Render ONLY entries with `verified: true`, a `permissionDate` and an
 * evidence note recording where the written consent is kept. Never add placeholder or unpermitted logos.
 */
export interface ClientLogo {
  name: string;
  /** Local asset path under public/ (no third-party origins; see the CSP). */
  logo: string;
  url?: string;
  verified: boolean;
  /** ISO date of the client's written permission. */
  permissionDate: string;
  evidence: string;
}

export const clients: ClientLogo[] = [];

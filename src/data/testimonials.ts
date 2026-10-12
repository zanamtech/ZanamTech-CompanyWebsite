/**
 * Testimonials (ADR-003, Constitution III). Real, permissioned quotes only: `verified: true`, a `permissionDate` and
 * an evidence note recording where the original and the giver's contact details are kept. Never self-written.
 */
export interface Testimonial {
  quote: string;
  /** Role and company type, e.g. "Engineering Manager, software company". */
  attribution: string;
  verified: boolean;
  /** ISO date of the giver's written permission. */
  permissionDate: string;
  evidence: string;
}

export const testimonials: Testimonial[] = [];

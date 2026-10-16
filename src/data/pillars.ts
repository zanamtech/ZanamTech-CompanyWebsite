import type { IconName } from './ids';

/** The three brand pillars: hero chips (label + icon) and the "Why ZanamTech" / trust cards (with body). */
export interface BrandPillar {
  label: string;
  icon: IconName;
  body: string;
}

export const brandPillars: BrandPillar[] = [
  {
    label: 'Enterprise-grade',
    icon: 'Building2',
    body: 'Architecture, delivery and governance built to the standards of regulated, high-scale organizations, with documented runbooks, transparent reporting and no lock-in.',
  },
  {
    label: 'High availability',
    icon: 'Activity',
    body: 'Multi-zone orchestration, cross-region replication and automated failover engineered to keep critical workloads online.',
  },
  {
    label: 'Zero-trust security',
    icon: 'ShieldCheck',
    body: 'Every request verified. WAF hardening, rate limiting, geo-fencing and encrypted transport across all public endpoints.',
  },
];

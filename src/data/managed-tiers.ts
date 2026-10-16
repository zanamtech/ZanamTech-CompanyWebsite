/**
 * Managed Cloud & DevOps retainer tiers (docs/02_Services_Catalog.md). Scope and coverage wording only:
 * Constitution III forbids clock hours and response times on the site. SOW response defaults live in
 * docs/internal/sow-defaults.md (never committed, never rendered).
 */
export interface RetainerTier {
  id: 'essentials' | 'professional' | 'enterprise';
  name: string;
  /** Coverage wording only. Must not contain digits. */
  coverage: string;
  includes: string[];
  featured?: boolean;
}

export const tiers: RetainerTier[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    coverage: 'Business-hours coverage',
    includes: [
      'Monitoring and alerting',
      'Monthly patching',
      'Backup checks',
      'Monthly service report',
      'A small block of improvements',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    coverage: 'Extended-hours coverage',
    featured: true,
    includes: [
      'Everything in Essentials',
      'Environment and release management',
      'CI/CD pipeline ownership',
      'Repository governance and SOP upkeep',
      'Quarterly restore test',
      'Monthly cost review',
      'Quarterly architecture review',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    coverage: 'Extended hours with after-hours escalation',
    includes: [
      'Everything in Professional',
      'After-hours escalation for production incidents',
      'A named backup engineer',
      'Quarterly business review',
      'Monitoring for AI automations',
    ],
  },
];

export interface SeverityLevel {
  level: 'P1' | 'P2' | 'P3' | 'P4';
  definition: string;
}

export const severityLevels: SeverityLevel[] = [
  { level: 'P1', definition: 'Production down or data at risk' },
  { level: 'P2', definition: 'Major function degraded' },
  { level: 'P3', definition: 'Minor issue with a workaround' },
  { level: 'P4', definition: 'Request or question' },
];

/** What every Managed Cloud & DevOps retainer includes: the short list on the home pillar card and the /services
 * flagship card. Scope wording only, never response times. */
export const flagshipIncluded = [
  'Monitoring and alerting',
  'Patching and backups',
  'Security patching',
  'Monthly service report',
];

/** Engagement process (docs/02_Services_Catalog.md). Process wording only: no team structure or time figures. */
export interface EngagementPhase {
  order: number;
  name: string;
  summary: string;
  details: string[];
}

export const engagementPhases: EngagementPhase[] = [
  {
    order: 1,
    name: 'Technical Audit & Infrastructure Discovery',
    summary:
      'A structured assessment of cloud configuration, database replication, security perimeters, CI/CD pipelines and monthly resource spend.',
    details: [
      'Bottleneck and single-point-of-failure analysis',
      'Vulnerability and attack surface review',
      'Cost-reduction opportunities',
    ],
  },
  {
    order: 2,
    name: 'Custom Proposal & Statement of Work',
    summary:
      'A detailed technical Statement of Work defines architecture, deliverables, milestones and service level commitments.',
    details: [
      'Architectural specifications and deliverables',
      'Deployment milestones and schedule',
      'Service levels and security benchmarks',
    ],
  },
  {
    order: 3,
    name: 'Onboarding & Staged Implementation',
    summary:
      'Delivery through Infrastructure as Code, staging validation and staged cutovers, with weekly status reports throughout.',
    details: [
      'IaC-driven, repeatable environments',
      'Staged validation before every cutover',
      'Operational continuity throughout',
    ],
  },
  {
    order: 4,
    name: 'Continuous Managed Operations',
    summary:
      'For ongoing operations, ZanamTech assumes accountability for stability, monitoring, security updates and incident resolution.',
    details: ['Proactive monitoring and alert routing', 'Continuous security patching', 'Monthly service reviews'],
  },
];

/**
 * v3 engagement models (docs/02_Services_Catalog.md).
 */
export interface EngagementModelEntry {
  id: 'assessment' | 'project' | 'retainer' | 'agency' | 'capacity';
  name: string;
  description: string;
  fits: string;
}

export const engagementModelCatalog: EngagementModelEntry[] = [
  {
    id: 'assessment',
    name: 'Assessment',
    description: 'A fixed-fee review with a written scorecard, findings and a prioritised backlog.',
    fits: 'Understanding where your platform stands before committing to larger work.',
  },
  {
    id: 'project',
    name: 'Fixed-scope project',
    description: 'Delivery under a Statement of Work with milestones and acceptance criteria.',
    fits: 'Migrations, landing zones, pipelines, applications and AI builds with a defined outcome.',
  },
  {
    id: 'retainer',
    name: 'Managed retainer',
    description:
      'Ongoing operation of your cloud and delivery platform. A three-month minimum, then rolling, with one month’s notice, a documented handover and no lock-in.',
    fits: 'Platforms that need continuous operations, governance and reporting.',
  },
  {
    id: 'agency',
    name: 'Agency partnership',
    description:
      'We run cloud and DevOps for an agency’s client projects, white-label or co-branded, under NDA with mutual non-solicitation.',
    fits: 'Software agencies that win application work but lack in-house DevOps.',
  },
  {
    id: 'capacity',
    name: 'Extended engineering capacity',
    description: 'Vetted engineers working to the same standards and access controls, added as your scope grows.',
    fits: 'Clients whose scope outgrows a single engagement stream.',
  },
];

/** Engagement cadence every client receives. */
export const cadence = [
  'Kickoff and RACI',
  'Weekly status reports',
  'Monthly service report for retainers',
  'Quarterly architecture review',
  'Documented runbooks and full handover',
] as const;

/** How we access client environments. */
export const accessModel = [
  'Least-privilege access, read-only first',
  'MFA on every account',
  'Client-owned accounts and repositories',
  'NDA available before discovery',
  'DPA on request',
] as const;

/** AI-tool policy, published on the Trust page and in every SOW. */
export const aiToolPolicy = [
  'AI tools are used only under business terms that exclude training on customer data.',
  'No client secrets, credentials or personal data are entered into AI tools.',
  'Every AI-assisted change is reviewed before it reaches a client environment.',
  'A client can opt out of AI-assisted work in its SOW.',
] as const;

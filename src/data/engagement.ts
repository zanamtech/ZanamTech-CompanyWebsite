/** Engagement process (docs/02_Services_Catalog.md §4). */
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
      'Senior architects assess cloud configuration, database replication, security perimeters, CI/CD pipelines and monthly resource expenditure.',
    details: ['Bottleneck and single-point-of-failure analysis', 'Vulnerability and attack surface review', 'Cost-reduction opportunities'],
  },
  {
    order: 2,
    name: 'Custom Proposal & Statement of Work',
    summary:
      'A detailed technical Statement of Work defines architecture, deliverables, milestones and service level commitments.',
    details: ['Architectural specifications and deliverables', 'Deployment milestones and schedule', 'SLA, uptime and security benchmarks'],
  },
  {
    order: 3,
    name: 'Onboarding & Zero-Downtime Implementation',
    summary:
      'Senior cloud and DevSecOps engineers deliver through Infrastructure as Code, staging validation and zero-downtime cutovers.',
    details: ['IaC-driven, repeatable environments', 'Staged validation before every cutover', 'Operational continuity throughout'],
  },
  {
    order: 4,
    name: 'Continuous 24/7 Support & Managed Retainer',
    summary:
      'For ongoing operations, ZanamTech assumes accountability for stability, monitoring, security updates and incident resolution.',
    details: ['Proactive monitoring and alert routing', 'Continuous security patching', 'Monthly performance and SLA reviews'],
  },
];

export interface EngagementModel {
  name: string;
  description: string;
  suitedFor: string[];
}

export const engagementModels: EngagementModel[] = [
  {
    name: 'Fixed-Scope Setup',
    description:
      'A one-time engineering deployment with defined deliverables, milestones and acceptance criteria, scoped in the Statement of Work.',
    suitedFor: ['Cloud migrations and containerization', 'WAF and zero-trust perimeter hardening', 'CI/CD pipeline and observability rollouts'],
  },
  {
    name: 'Monthly Retainer',
    description:
      'Ongoing managed operations with continuous monitoring, patching, incident response and monthly SLA reporting.',
    suitedFor: ['24/7 managed infrastructure', 'Continuous cost governance', 'Evolving platforms that need a standing engineering partner'],
  },
];

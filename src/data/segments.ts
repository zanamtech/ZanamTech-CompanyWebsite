/**
 * Target segments (docs/01_Brand_Positioning.md §3). Current focus only: the data-sensitive AI segment is a later
 * focus and is not presented. Wording follows Constitution III.
 */
export interface TargetSegment {
  id: string;
  icon: 'Rocket' | 'Building2' | 'Handshake' | 'Globe';
  name: string;
  profile: string;
  decisionMakers: string[];
  challenges: string[];
  value: string[];
  services: string[];
}

export const segments: TargetSegment[] = [
  {
    id: 'saas',
    icon: 'Rocket',
    name: 'B2B SaaS Companies',
    profile: 'SaaS companies of roughly 10 to 200 people with no in-house DevOps, where releases, environments and cloud bills are nobody’s full-time job.',
    decisionMakers: ['CTOs', 'Technical co-founders', 'VPs of Engineering'],
    challenges: [
      'Unpredictable cloud bill growth',
      'Brittle, manual deployment pipelines',
      'Limited visibility into production',
      'Environments that drift apart',
    ],
    value: ['Managed Cloud & DevOps operations', 'Automated CI/CD pipelines', 'Cloud cost governance'],
    services: ['managed-cloud-devops', 'cicd-pipeline-workflow-automation', 'cloud-cost-optimization'],
  },
  {
    id: 'mid-market',
    icon: 'Building2',
    name: 'Mid-Market Firms on AWS, Azure and Google Cloud',
    profile:
      'Established firms in logistics, professional services and e-commerce modernising their platforms without hiring a full platform team.',
    decisionMakers: ['CIOs', 'IT directors', 'Heads of infrastructure'],
    challenges: [
      'Legacy hosting and high maintenance overhead',
      'Security exposure on public endpoints',
      'Manual processes that slow operations',
    ],
    value: ['Staged cloud migration', 'WAF and zero-trust perimeter hardening', 'Practical AI workflow automation'],
    services: ['cloud-migration-containerization', 'enterprise-security-waf-hardening', 'ai-workflow-document-automation'],
  },
  {
    id: 'software-agencies',
    icon: 'Handshake',
    name: 'Software Agencies & Software Houses',
    profile:
      'Agencies that win application projects but lack DevOps capacity, and need a partner to run cloud and delivery for their clients, white-label or co-branded.',
    decisionMakers: ['Agency owners', 'Delivery heads', 'Technical directors'],
    challenges: [
      'Client projects without reliable environments and pipelines',
      'No dedicated DevOps capacity',
      'Hosting and support handed back to developers',
    ],
    value: ['White-label or co-branded DevOps', 'Environment and pipeline setup per client project', 'Managed operations after launch'],
    services: ['managed-cloud-devops', 'cicd-pipeline-workflow-automation', 'infrastructure-as-code-landing-zones'],
  },
  {
    id: 'gcc',
    icon: 'Globe',
    name: 'GCC Enterprises & Scale-Ups',
    profile:
      'Organisations in the UAE, Saudi Arabia and the wider GCC that need cloud platforms in regional data centres, with data-residency awareness and same-day time-zone overlap.',
    decisionMakers: ['IT leads', 'Digital transformation leads', 'Heads of engineering'],
    challenges: [
      'Data-residency requirements for regional cloud hosting',
      'Modernising legacy applications',
      'Limited in-house cloud operations capacity',
    ],
    value: ['Platforms in UAE and Saudi Arabia cloud regions', 'Infrastructure as Code foundations', 'Managed operations and reporting'],
    services: ['infrastructure-as-code-landing-zones', 'managed-cloud-devops', 'application-modernisation-integration'],
  },
];

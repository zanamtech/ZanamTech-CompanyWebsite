/** Target segments (docs/01_Brand_Positioning.md §4), rewritten without revenue figures or unqualified guarantees. */
export interface TargetSegment {
  id: string;
  icon: 'Rocket' | 'Building2' | 'LockKeyhole';
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
    name: 'High-Growth B2B SaaS & Tech Scale-Ups',
    profile: 'SaaS companies experiencing rapid growth in users, traffic and infrastructure complexity.',
    decisionMakers: ['CTOs', 'VPs of Engineering', 'Lead DevOps Architects'],
    challenges: [
      'Unpredictable cloud bill escalation',
      'Brittle, manual deployment pipelines',
      'Limited observability into production',
      'Need for Kubernetes auto-scaling',
    ],
    value: ['Up to 40% cloud cost reduction target', 'Automated CI/CD pipelines', '99.9% uptime SLA target'],
    services: ['cloud-cost-optimization', 'cicd-pipeline-workflow-automation', 'observability-monitoring'],
  },
  {
    id: 'enterprise',
    icon: 'Building2',
    name: 'Mid-Market Enterprises & Digital Transformation Leaders',
    profile:
      'Established organizations in healthcare, logistics, e-commerce and professional services moving from legacy hardware to modern cloud.',
    decisionMakers: ['CIOs', 'VPs of IT', 'Directors of Infrastructure'],
    challenges: [
      'Cyber security threats and DDoS exposure',
      'Complex data migrations',
      'High hardware maintenance overhead',
    ],
    value: ['Zero-downtime cloud migration', 'WAF and zero-trust perimeter setup', '80% attack surface reduction target'],
    services: ['cloud-migration-containerization', 'enterprise-security-waf-hardening', 'high-availability-disaster-recovery'],
  },
  {
    id: 'data-sensitive',
    icon: 'LockKeyhole',
    name: 'Data-Sensitive Organizations Seeking Enterprise AI',
    profile:
      'Financial, legal, medical and corporate organizations that need AI automation without exposing proprietary records to public AI services.',
    decisionMakers: ['Enterprise Operations Directors', 'Chief Risk Officers', 'Innovation Leads'],
    challenges: [
      'Inefficient manual document processing',
      'Strict data privacy and compliance requirements',
      'Risk of data leakage through third-party AI APIs',
    ],
    value: ['Private, isolated LLM deployments', 'Secure document retrieval (RAG)', 'Compliance-aligned local AI workflows'],
    services: ['enterprise-ai-integration', 'full-stack-web-app-development', 'managed-infrastructure-24-7'],
  },
];

/** Entry offers ("Start here"): fixed scope and fee; the fee is never shown (docs/02_Services_Catalog.md). */
export interface Offer {
  id: 'health-check' | 'cost-review' | 'governance-quick-start' | 'ai-opportunity-sprint' | 'ai-automation-pilot';
  name: string;
  duration: string;
  summary: string;
  inputs: string[];
  deliverables: string[];
  nextStep: string;
  creditsToFollowOn: boolean;
}

export const offers: Offer[] = [
  {
    id: 'health-check',
    name: 'Cloud & DevOps Health Check',
    duration: '2–3 weeks',
    summary: 'An independent review of one cloud environment against reliability, security, cost and delivery practices.',
    inputs: ['Read-only access to the cloud account', 'Read access to repositories and pipelines', 'A named technical owner'],
    deliverables: ['Scorecard across reliability, security, cost and delivery', 'Findings with evidence', 'Prioritised backlog with cost and risk'],
    nextStep: 'A fixed-scope project or a managed retainer.',
    creditsToFollowOn: false,
  },
  {
    id: 'cost-review',
    name: 'Cloud Cost Review',
    duration: '1–2 weeks',
    summary: 'A focused analysis of cloud spend that applies quick wins and plans the rest.',
    inputs: ['Billing and cost-management read access', 'Current architecture overview'],
    deliverables: ['Spend analysis by service and environment', 'Quick wins applied', '90-day savings roadmap'],
    nextStep: 'Ongoing cost governance inside the managed retainer.',
    creditsToFollowOn: false,
  },
  {
    id: 'governance-quick-start',
    name: 'DevOps Governance Quick-Start',
    duration: '2 weeks',
    summary: 'Branch protection, pipeline gates and written SOPs for a delivery process your team can rely on.',
    inputs: ['Admin access to the repository workspace', 'Current release process walkthrough'],
    deliverables: ['Branch restrictions and merge policies', 'Pipeline approval gates', 'Written SOPs', 'Access review'],
    nextStep: 'A managed retainer that keeps governance current.',
    creditsToFollowOn: false,
  },
  {
    id: 'ai-opportunity-sprint',
    name: 'AI Opportunity Sprint',
    duration: '1–2 weeks',
    summary: 'Find the manual processes where automation pays back, and specify the first pilot.',
    inputs: ['Process owners for a short interview each', 'Sample documents or reports'],
    deliverables: ['Processes ranked by hours saved × volume', 'Data and risk assessment', 'Pilot specification'],
    nextStep: 'The AI Automation Pilot. The sprint fee is credited towards it.',
    creditsToFollowOn: true,
  },
  {
    id: 'ai-automation-pilot',
    name: 'AI Automation Pilot',
    duration: 'about 4 weeks',
    summary: 'One workflow automated on real data, run alongside the current process before any larger commitment.',
    inputs: ['A named process owner', 'Representative real data', 'Access to the target systems'],
    deliverables: ['Working automation with human approval points', 'Audit log', 'Go/no-go report'],
    nextStep: 'A full AI build or managed AI operations.',
    creditsToFollowOn: false,
  },
];

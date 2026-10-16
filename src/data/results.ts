/**
 * Selected results from past engagements (spec 002 FR-016/FR-017, Constitution III).
 * Figures are achieved results, never promises. `context` is derived from the matching real scenario in
 * src/content/services and is verified by the owner before publication. `attribution` is internal only and is
 * never rendered. Evidence records are added over time via `evidenceId`.
 */
export interface Result {
  id: string;
  value: number;
  decimals: number;
  suffix: string;
  /** Optional qualifier shown above the figure, e.g. "Up to". */
  qualifier?: string;
  /** Achieved-result label shown under the figure. */
  label: string;
  /** "Industry · challenge" line, from the matching real scenario. */
  context: string;
  /** Related service slug (src/content/services). */
  service: string;
  /** Internal only: never rendered. */
  attribution: 'zanamtech' | 'pre-zanamtech';
  evidenceId?: string;
}

export const resultsTitle = 'Selected results from past engagements';

export const resultsFootnote =
  'Results from past engagements; outcomes vary by environment. Commitments are defined per Statement of Work.';

export const results: Result[] = [
  {
    id: 'uptime',
    value: 99.9,
    decimals: 1,
    suffix: '%',
    label: 'availability achieved through promotional traffic peaks',
    context: 'E-commerce · outages during high-traffic events',
    service: 'cloud-migration-containerization',
    attribution: 'pre-zanamtech',
  },
  {
    id: 'attack-surface',
    value: 80,
    decimals: 0,
    suffix: '%',
    label: 'reduction in malicious attack surface',
    context: 'B2B platform · aggressive automated bot traffic',
    service: 'enterprise-security-waf-hardening',
    attribution: 'pre-zanamtech',
  },
  {
    id: 'cost',
    value: 40,
    decimals: 0,
    suffix: '%',
    qualifier: 'Up to',
    label: 'lower recurring cloud spend',
    context: 'Scale-up · under-utilized compute fleet',
    service: 'cloud-cost-optimization',
    attribution: 'pre-zanamtech',
  },
  {
    id: 'deploy',
    value: 50,
    decimals: 0,
    suffix: '%',
    label: 'faster deployments',
    context: 'Software team · error-prone manual releases',
    service: 'cicd-pipeline-workflow-automation',
    attribution: 'pre-zanamtech',
  },
  {
    id: 'detection',
    value: 45,
    decimals: 0,
    suffix: '%',
    label: 'faster incident detection and resolution',
    context: 'B2B SaaS · undetected memory leaks',
    service: 'observability-monitoring',
    attribution: 'pre-zanamtech',
  },
  {
    id: 'mttr',
    value: 30,
    decimals: 0,
    suffix: '%',
    label: 'improvement in mean time to recovery',
    context: 'Enterprise portal · slowdowns at peak activity',
    service: 'observability-monitoring',
    attribution: 'pre-zanamtech',
  },
  {
    id: 'hardware',
    value: 60,
    decimals: 0,
    suffix: '%',
    qualifier: 'Up to',
    label: 'lower hardware maintenance costs',
    context: 'SaaS provider · fragile on-premise servers',
    service: 'cloud-migration-containerization',
    attribution: 'pre-zanamtech',
  },
  {
    id: 'release-errors',
    value: 35,
    decimals: 0,
    suffix: '%',
    label: 'fewer production release errors',
    context: 'Software team · error-prone manual releases',
    service: 'cicd-pipeline-workflow-automation',
    attribution: 'pre-zanamtech',
  },
];

export const formatResult = (r: Pick<Result, 'value' | 'decimals' | 'suffix'>, value = r.value) =>
  `${value.toFixed(r.decimals)}${r.suffix}`;

/** Target outcomes (docs/01_Brand_Positioning.md §5), framed as targets per Constitution III. */
export interface MetricTarget {
  id: string;
  value: number;
  decimals: number;
  suffix: string;
  /** Optional qualifier shown above the figure, e.g. "Up to". */
  qualifier?: string;
  /** Short label displayed under the figure. */
  label: string;
  /** Related service slug (src/content/services). */
  service: string;
}

export const metricTargets: MetricTarget[] = [
  { id: 'uptime', value: 99.9, decimals: 1, suffix: '%', label: 'uptime SLA target', service: 'cloud-migration-containerization' },
  { id: 'attack-surface', value: 80, decimals: 0, suffix: '%', label: 'attack surface reduction target', service: 'enterprise-security-waf-hardening' },
  { id: 'cost', value: 40, decimals: 0, suffix: '%', qualifier: 'Up to', label: 'monthly cloud savings target', service: 'cloud-cost-optimization' },
  { id: 'deploy', value: 50, decimals: 0, suffix: '%', label: 'faster deployments target', service: 'cicd-pipeline-workflow-automation' },
  { id: 'detection', value: 45, decimals: 0, suffix: '%', label: 'faster incident detection target', service: 'observability-monitoring' },
  { id: 'mttr', value: 30, decimals: 0, suffix: '%', label: 'MTTR improvement target', service: 'observability-monitoring' },
  { id: 'hardware', value: 60, decimals: 0, suffix: '%', qualifier: 'Up to', label: 'hardware maintenance cost reduction target', service: 'cloud-migration-containerization' },
  { id: 'release-errors', value: 35, decimals: 0, suffix: '%', label: 'fewer release errors target', service: 'cicd-pipeline-workflow-automation' },
];

export const formatMetric = (m: Pick<MetricTarget, 'value' | 'decimals' | 'suffix'>, value = m.value) =>
  `${value.toFixed(m.decimals)}${m.suffix}`;

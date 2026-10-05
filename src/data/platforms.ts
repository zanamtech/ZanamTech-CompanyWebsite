/** Technology ecosystems shown in the home-page proof ticker (text badges only, no third-party logos). */
export interface PlatformRow {
  id: string;
  /** Accessible name for the row's list. */
  label: string;
  items: string[];
}

export const platformRows: PlatformRow[] = [
  {
    id: 'cloud-infra-ai',
    label: 'Cloud, DevOps, infrastructure and AI',
    items: [
      'AWS',
      'Microsoft Azure',
      'Google Cloud',
      'Flexential Cloud',
      'Kubernetes',
      'Docker',
      'Cloudflare',
      'Linux',
      'Windows',
      'Terraform',
      'NGINX',
      'Claude',
      'Claude Code',
      'Ollama',
      'OpenClaw',
      'Hermes',
    ],
  },
  {
    id: 'cicd-monitoring-data-security',
    label: 'CI/CD, monitoring, databases and security',
    items: [
      'Jenkins',
      'Bitbucket',
      'GitHub Actions',
      'Git',
      'GitHub',
      'Prometheus',
      'Grafana',
      'Zabbix',
      'MySQL',
      'MS SQL',
      'MongoDB',
      'PostgreSQL',
      'SSL / TLS',
      'Acronis',
    ],
  },
];

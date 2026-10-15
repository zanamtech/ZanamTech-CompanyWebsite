/**
 * Single source for the ID lists that are both validated at build time (Zod enums in src/content.config.ts) and used
 * as TypeScript unions in the data modules. Plain TypeScript with no astro: imports, so tests can import it too.
 */

/** Icons that content and data may name. src/components/ui/Icon.astro maps each one to its SVG. */
export const iconNames = [
  'Activity',
  'Globe',
  'Handshake',
  'Layers',
  'LayoutDashboard',
  'RefreshCw',
  'ServerCog',
  'Bot',
  'BrainCircuit',
  'Building2',
  'CodeXml',
  'Container',
  'DatabaseBackup',
  'Headset',
  'LockKeyhole',
  'Rocket',
  'ShieldCheck',
  'TrendingDown',
  'Workflow',
] as const;
export type IconName = (typeof iconNames)[number];

/** Service pillars (ADR-004). */
export const pillarIds = ['managed', 'cloud-devops', 'web-saas', 'ai'] as const;
export type PillarId = (typeof pillarIds)[number];

/** Entry offers ("Start here"). */
export const offerIds = [
  'health-check',
  'cost-review',
  'governance-quick-start',
  'ai-opportunity-sprint',
  'ai-automation-pilot',
] as const;
export type OfferId = (typeof offerIds)[number];

/** Engagement models (docs/02_Services_Catalog.md). */
export const engagementTypeIds = ['assessment', 'project', 'retainer', 'agency', 'capacity'] as const;
export type EngagementTypeId = (typeof engagementTypeIds)[number];

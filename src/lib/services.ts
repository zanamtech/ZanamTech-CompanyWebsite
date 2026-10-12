import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type Pillar = Service['data']['pillar'];

/** v3 pillars, in display order (docs/02_Services_Catalog.md, ADR-004). */
export const servicePillars: Record<Pillar, { title: string; description: string; order: number }> = {
  managed: {
    title: 'Managed Cloud & DevOps',
    description: 'We run your cloud and delivery platform: operations, environments, pipelines, backups and governance.',
    order: 1,
  },
  'cloud-devops': {
    title: 'Cloud & DevOps Engineering',
    description: 'Fixed-scope projects that modernise, secure and automate your Azure and AWS foundations.',
    order: 2,
  },
  'web-saas': {
    title: 'Web & SaaS Engineering',
    description: 'Cloud-native web applications, SaaS platforms, portals and integrations.',
    order: 3,
  },
  ai: {
    title: 'Practical AI & Automation',
    description: 'Automate manual work and put company knowledge to use, inside your own cloud tenant.',
    order: 4,
  },
};

/** Legacy (removed in T060): v1 two-column grouping used by the current UI. */
export type ServiceGroup = 'cloud-infrastructure' | 'engineering-ai';

/** Legacy (removed in T060): titles for {@link ServiceGroup}. */
export const serviceGroups: Record<ServiceGroup, { title: string; description: string }> = {
  'cloud-infrastructure': {
    title: 'Cloud & Infrastructure',
    description: 'Resilient, secure and cost-efficient foundations across AWS, Azure and GCP.',
  },
  'engineering-ai': {
    title: 'Engineering & AI',
    description: 'Delivery automation, cloud-native applications, private AI and managed operations.',
  },
};

/**
   * Legacy (removed in T060): display group for the v1 UI: the legacy `group` when present, otherwise derived from the pillar
 * (cloud-devops → Cloud & Infrastructure; everything else → Engineering & AI), so new services always appear.
 */
export const displayGroup = (s: Service): ServiceGroup =>
  s.data.group ?? (s.data.pillar === 'cloud-devops' ? 'cloud-infrastructure' : 'engineering-ai');

const byOrder = (a: Service, b: Service) => a.data.order - b.data.order;
const byPillarThenOrder = (a: Service, b: Service) =>
  servicePillars[a.data.pillar].order - servicePillars[b.data.pillar].order || byOrder(a, b);

/** Single gateway for every consumer (menus, grids, pages, form options, sitemap): published services only. */
export async function getPublishedServices(): Promise<Service[]> {
  return (await getCollection('services', (s: Service) => s.data.published)).sort(byPillarThenOrder);
}

/** Published services grouped by pillar, in pillar order. */
export async function getServicesByPillar(): Promise<{ pillar: Pillar; title: string; description: string; services: Service[] }[]> {
  const services = await getPublishedServices();
  return (Object.keys(servicePillars) as Pillar[])
    .sort((a, b) => servicePillars[a].order - servicePillars[b].order)
    .map((pillar) => ({ pillar, ...servicePillars[pillar], services: services.filter((s) => s.data.pillar === pillar) }));
}

/** The single flagship service. Throws if the catalogue does not have exactly one published flagship. */
export async function getFlagship(): Promise<Service> {
  const flagships = (await getPublishedServices()).filter((s) => s.data.flagship);
  if (flagships.length !== 1) throw new Error(`Expected exactly one published flagship service, found ${flagships.length}.`);
  return flagships[0];
}

/**
   * Legacy (removed in T060): temporary alias for the v1 UI; every published service, in the v1 global order.
 * It does not filter by group, so services added before the pillar UI ships still appear.
 */
export async function getActiveServices(): Promise<Service[]> {
  return (await getCollection('services', (s: Service) => s.data.published)).sort(byOrder);
}

/** Legacy (removed in T055): roadmap offerings. */
export async function getRoadmapServices(): Promise<Service[]> {
  return (await getCollection('services', (s: Service) => s.data.status === 'roadmap')).sort(byOrder);
}

export const serviceHref = (service: Service) => `/services/${service.id}`;

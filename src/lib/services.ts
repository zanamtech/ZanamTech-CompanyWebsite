import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type Pillar = Service['data']['pillar'];

/** v3 pillars, in display order (docs/02_Services_Catalog.md, ADR-004). */
export const servicePillars: Record<Pillar, { title: string; description: string; order: number; icon: string }> = {
  managed: {
    title: 'Managed Cloud & DevOps',
    description: 'We run your cloud and delivery platform: operations, environments, pipelines, backups and governance.',
    order: 1,
    icon: 'ServerCog',
  },
  'cloud-devops': {
    title: 'Cloud & DevOps Engineering',
    description: 'Fixed-scope projects that modernise, secure and automate your Azure and AWS foundations.',
    order: 2,
    icon: 'Layers',
  },
  'web-saas': {
    title: 'Web & SaaS Engineering',
    description: 'Cloud-native web applications, SaaS platforms, portals and integrations.',
    order: 3,
    icon: 'CodeXml',
  },
  ai: {
    title: 'Practical AI & Automation',
    description: 'Automate manual work and put company knowledge to use, inside your own cloud tenant.',
    order: 4,
    icon: 'BrainCircuit',
  },
};

const byOrder = (a: Service, b: Service) => a.data.order - b.data.order;
const byPillarThenOrder = (a: Service, b: Service) =>
  servicePillars[a.data.pillar].order - servicePillars[b.data.pillar].order || byOrder(a, b);

/** Single gateway for every consumer (menus, grids, pages, form options, sitemap): published services only. */
export async function getPublishedServices(): Promise<Service[]> {
  return (await getCollection('services', (s: Service) => s.data.published)).sort(byPillarThenOrder);
}

/** Published services grouped by pillar, in pillar order. */
export async function getServicesByPillar(): Promise<
  { pillar: Pillar; title: string; description: string; icon: string; order: number; services: Service[] }[]
> {
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

export const serviceHref = (service: Service) => `/services/${service.id}`;

/** Anchor of a pillar section on /services (e.g. /services#ai). */
export const pillarHref = (pillar: Pillar) => `/services#${pillar}`;

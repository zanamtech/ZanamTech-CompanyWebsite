import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type ServiceGroup = Service['data']['group'];

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

const byOrder = (a: Service, b: Service) => a.data.order - b.data.order;

/** The nine core services, in canonical order. */
export async function getActiveServices(): Promise<Service[]> {
  return (await getCollection('services', (s: Service) => s.data.status === 'active')).sort(byOrder);
}

/** Roadmap offerings ("In Development"), excluded from the core grid and lead options. */
export async function getRoadmapServices(): Promise<Service[]> {
  return (await getCollection('services', (s: Service) => s.data.status === 'roadmap')).sort(byOrder);
}

export const serviceHref = (service: Service) => `/services/${service.id}`;

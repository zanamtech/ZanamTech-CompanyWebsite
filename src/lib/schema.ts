import { site } from '../data/site';
import { leadership } from '../data/leadership';
import { logoImage } from './og';

/**
 * Schema.org builders (audit F-42). BaseLayout emits one JSON-LD `@graph` per page: Organization and WebSite on
 * every page, a BreadcrumbList where the page shows breadcrumbs, and the page's own node (Service or Article).
 */
export type SchemaNode = Record<string, unknown>;

export interface Crumb {
  label: string;
  href?: string;
}

const abs = (path: string, base: URL) => new URL(path, base).href;
const orgId = (base: URL) => abs('/#organization', base);

const logo = (base: URL) => ({
  '@type': 'ImageObject',
  url: abs(logoImage.path, base),
  width: logoImage.width,
  height: logoImage.height,
});

export function organization(base: URL): SchemaNode {
  return {
    '@type': 'Organization',
    '@id': orgId(base),
    name: site.name,
    url: base.href,
    logo: logo(base),
    description: site.description,
    email: site.email,
    sameAs: [leadership.companyLinkedin].filter(Boolean),
    knowsAbout: [
      'Managed Cloud Operations',
      'DevOps',
      'AWS',
      'Azure',
      'Google Cloud',
      'CI/CD',
      'Infrastructure as Code',
      'Cloud Migration',
      'Web Application Firewall',
      'Disaster Recovery',
      'Observability',
      'Cloud Cost Optimization',
      'Web Application Development',
      'AI Workflow Automation',
    ],
  };
}

export function website(base: URL): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website', base),
    name: site.name,
    url: base.href,
    inLanguage: 'en-US',
    publisher: { '@id': orgId(base) },
  };
}

/** The visible breadcrumb trail; the last crumb (the current page, no href) points at the canonical URL. */
export function breadcrumbs(crumbs: Crumb[], canonical: URL, base: URL): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: crumb.href ? abs(crumb.href, base) : canonical.href,
    })),
  };
}

export function service(
  entry: { name: string; description: string; category: string; path: string },
  base: URL,
): SchemaNode {
  return {
    '@type': 'Service',
    name: entry.name,
    description: entry.description,
    serviceType: entry.category,
    url: abs(entry.path, base),
    provider: { '@id': orgId(base) },
  };
}

export function article(
  entry: {
    headline: string;
    description: string;
    published: Date;
    modified: Date;
    path: string;
    image: { path: string; width: number; height: number };
  },
  base: URL,
): SchemaNode {
  return {
    '@type': 'Article',
    headline: entry.headline,
    description: entry.description,
    datePublished: entry.published.toISOString(),
    dateModified: entry.modified.toISOString(),
    image: {
      '@type': 'ImageObject',
      url: abs(entry.image.path, base),
      width: entry.image.width,
      height: entry.image.height,
    },
    author: {
      '@type': 'Person',
      name: leadership.name,
      jobTitle: leadership.role,
      url: abs('/about', base),
    },
    publisher: { '@type': 'Organization', '@id': orgId(base), name: site.name, url: base.href, logo: logo(base) },
    mainEntityOfPage: abs(entry.path, base),
    inLanguage: 'en-US',
  };
}

export const graph = (nodes: SchemaNode[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

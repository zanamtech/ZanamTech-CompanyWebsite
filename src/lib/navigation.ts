import { companyLinks, legalLinks, navLinks, type NavLink } from '../data/site';
import type { PillarId } from '../data/ids';
import { hasPublishedInsights, hasVerifiedCaseStudies } from './content';
import { getServicesByPillar, type Service } from './services';
import { pagePath } from './url';

export type PillarGroup = Awaited<ReturnType<typeof getServicesByPillar>>[number];

/** Everything the header and footer render, built once so both use the same gating and the same service grouping. */
export interface NavModel {
  /** Header links. Insights appears only with a published article, Case Studies only with a verified entry. */
  primary: NavLink[];
  /** Footer Company row, gated the same way. */
  company: NavLink[];
  legal: NavLink[];
  /** Service pillars in display order, each with its published services. */
  pillars: PillarGroup[];
  /** The same groups by id, for layouts that place pillars individually (mega-menu, footer columns). */
  pillar: Record<PillarId, PillarGroup>;
  /** Cloud & DevOps Engineering split into two balanced sub-columns (mega-menu and footer). */
  cloudColumns: [Service[], Service[]];
  /** The current page is `href` or below it. Uses pagePath(), so `/about.html` in a file-format build is `/about`. */
  isActive: (href: string) => boolean;
}

export async function getNavModel(url: URL): Promise<NavModel> {
  const [showInsights, showCaseStudies, pillars] = await Promise.all([
    hasPublishedInsights(),
    hasVerifiedCaseStudies(),
    getServicesByPillar(),
  ]);
  const gated = (l: NavLink) =>
    (l.href !== '/insights' || showInsights) && (l.href !== '/case-studies' || showCaseStudies);

  const pillar = Object.fromEntries(pillars.map((g) => [g.pillar, g])) as Record<PillarId, PillarGroup>;
  const cloud = pillar['cloud-devops'].services;
  const split = Math.ceil(cloud.length / 2);

  const currentPath = pagePath(url);
  return {
    primary: [
      ...navLinks.filter(gated),
      ...(showCaseStudies ? [{ label: 'Case Studies', href: '/case-studies' }] : []),
    ],
    company: companyLinks.filter(gated),
    legal: legalLinks,
    pillars,
    pillar,
    cloudColumns: [cloud.slice(0, split), cloud.slice(split)],
    isActive: (href) => currentPath === href || currentPath.startsWith(`${href}/`),
  };
}

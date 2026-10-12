import { getCollection } from 'astro:content';

/**
 * Draft gating (spec 002 FR-036): drafts render only in `astro dev`. Every build, production or preview, excludes
 * them.
 */
export const isVisible = (entry: { data: { draft?: boolean } }) => !entry.data.draft || import.meta.env.DEV;

/** Verified-only proof (ADR-003, Constitution III): drop anything that is not verified. */
export const verifiedOnly = <T extends { verified: boolean }>(list: readonly T[]): T[] => list.filter((item) => item.verified);

/** True when at least one verified case study exists; gates /case-studies and its nav link (FR-020). */
export async function hasVerifiedCaseStudies(): Promise<boolean> {
  return (await getCollection('caseStudies', (e) => e.data.verified)).length > 0;
}

/** True when at least one Insights article is visible; gates the Insights nav link (FR-030). */
export async function hasPublishedInsights(): Promise<boolean> {
  return (await getCollection('insights', isVisible)).length > 0;
}

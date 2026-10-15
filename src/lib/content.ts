import { getCollection } from 'astro:content';

/**
 * Draft gating (spec 002 FR-036): drafts render only in `astro dev`. Every build, production or preview, excludes
 * them.
 */
export const isVisible = (entry: { data: { draft?: boolean } }) => !entry.data.draft || import.meta.env.DEV;

/** Verified-only proof (ADR-003, Constitution III): drop anything that is not verified. */
export const verifiedOnly = <T extends { verified: boolean }>(list: readonly T[]): T[] => list.filter((item) => item.verified);

/**
 * Case-study source files. Checked first so an empty collection is never queried (avoids a warning per page; the
 * glob loader still warns once at build).
 */
const caseStudyFiles = Object.keys(import.meta.glob('../content/case-studies/*.md'));

/** Verified case studies only (ADR-003); empty until the first permissioned case study exists. */
export async function getVerifiedCaseStudies() {
  if (caseStudyFiles.length === 0) return [];
  return getCollection('caseStudies', (e) => e.data.verified);
}

/** True when at least one verified case study exists; gates /case-studies and its nav link (FR-020). */
export async function hasVerifiedCaseStudies(): Promise<boolean> {
  return (await getVerifiedCaseStudies()).length > 0;
}

/** True when at least one Insights article is visible; gates the Insights nav link (FR-030). */
export async function hasPublishedInsights(): Promise<boolean> {
  return (await getCollection('insights', isVisible)).length > 0;
}

import { getCollection } from 'astro:content';
import { BUILD_DATE } from 'astro:env/server';
import { buildDateFrom, isPublishedAt } from './publish';

/**
 * Draft gating (spec 002 FR-036): drafts render only in `astro dev`. Every build, production or preview, excludes
 * them.
 */
export const isVisible = (entry: { data: { draft?: boolean } }) => !entry.data.draft || import.meta.env.DEV;

const buildDate = buildDateFrom(BUILD_DATE);

/**
 * Insights articles that are live in this build: visible (see isVisible) and dated on or before the build date
 * (src/lib/publish.ts). Use this everywhere articles are listed, routed or counted.
 */
export const isPublished = (entry: { data: { draft?: boolean; date: Date } }) =>
  isVisible(entry) && isPublishedAt(entry, buildDate);

/** Verified-only proof (ADR-003, Constitution III): drop anything that is not verified. */
export const verifiedOnly = <T extends { verified: boolean }>(list: readonly T[]): T[] =>
  list.filter((item) => item.verified);

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

/** True when at least one Insights article is published; gates the Insights nav link (FR-030). */
export async function hasPublishedInsights(): Promise<boolean> {
  return (await getCollection('insights', isPublished)).length > 0;
}

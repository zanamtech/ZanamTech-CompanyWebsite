/**
 * Scheduled publishing for Insights articles. Kept free of `astro:` imports so tests can import it.
 *
 * An article dated after the build date is left out of the build entirely: no route, no listing, no nav gating, no
 * sitemap entry and no JSON-LD. It appears on the first build on or after its date, so the site must be rebuilt on
 * each publish date (the daily scheduled CI build does this once deployment is automated). A front-matter date is the
 * start of that day in universal time, so `date: 2026-10-26` is live in any build made on or after that day.
 */
export const isPublishedAt = (entry: { data: { date: Date } }, buildDate: Date): boolean =>
  entry.data.date.valueOf() <= buildDate.valueOf();

/**
 * The build date: now, or `BUILD_DATE` (YYYY-MM-DD or an ISO timestamp) to preview a later publish date. Playwright
 * pins it so the E2E build includes every scheduled article (tests/e2e/build-date.ts).
 */
export function buildDateFrom(value: string | undefined): Date {
  if (!value) return new Date();
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) throw new Error(`BUILD_DATE "${value}" is not a date (use YYYY-MM-DD).`);
  return date;
}

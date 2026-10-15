/**
 * The E2E build runs with BUILD_DATE pinned (playwright.config.ts), so every scheduled Insights article is built and
 * tested before its publish date, and results don't change on the day an article goes live. Production builds use
 * the real date (src/lib/publish.ts).
 */
export const E2E_BUILD_DATE = '2099-12-31';

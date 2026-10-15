import { test as base, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export type Theme = 'light' | 'dark';

/** Load a page with the given theme pre-seeded, exactly as a returning visitor would see it. */
export async function gotoWithTheme(page: Page, path: string, theme: Theme) {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('zt-theme', t);
    } catch {}
  }, theme);
  await page.goto(path);
}

/**
 * Scroll through the page and wait until every reveal group has finished. Groups below the fold stay hidden until they
 * enter the viewport; axe scrolls elements into view while checking contrast and would otherwise measure them mid-fade.
 */
export async function revealAll(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(16);
  }
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          [
            ...document.querySelectorAll<HTMLElement>(
              '[data-reveal-group] > *, [data-reveal], #process [data-phase] > :first-child',
            ),
          ].filter((el) => {
            if (el.hasAttribute('data-reveal')) return true;
            let opacity = 1;
            for (let n: Element | null = el; n && n !== document.body; n = n.parentElement)
              opacity *= Number(getComputedStyle(n).opacity);
            return opacity < 0.999;
          }).length,
      ),
    )
    .toBe(0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}

/** Run axe (WCAG 2.1 A/AA) and fail on any violation. */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
  expect(summary, summary.join('\n')).toEqual([]);
}

export const test = base;
export { expect };

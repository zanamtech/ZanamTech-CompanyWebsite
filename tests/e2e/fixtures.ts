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

/** Run axe (WCAG 2.1 A/AA) and fail on any violation. */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  expect(summary, summary.join('\n')).toEqual([]);
}

export const test = base;
export { expect };

import { test, expect, gotoWithTheme, expectNoA11yViolations } from './fixtures';

const PHASES = [
  'Technical Audit & Infrastructure Discovery',
  'Custom Proposal & Statement of Work',
  'Onboarding & Zero-Downtime Implementation',
  'Continuous 24/7 Support & Managed Retainer',
];

const SEGMENTS = [
  'High-Growth B2B SaaS & Tech Scale-Ups',
  'Mid-Market Enterprises & Digital Transformation Leaders',
  'Data-Sensitive Organizations Seeking Enterprise AI',
];

test.describe('US5 — Approach, Industries & About', () => {
  test('approach page lists the four phases in order and both engagement models without prices', async ({ page }) => {
    await page.goto('/approach');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const phases = await page.locator('[data-phase] h3').allInnerTexts();
    expect(phases.map((p) => p.trim())).toEqual(PHASES);
    await expect(page.getByRole('heading', { name: 'Fixed-Scope Setup' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Monthly Retainer' })).toBeVisible();
    expect(await page.locator('main').innerText()).not.toMatch(/[$€£]\s?\d|per (?:hour|month)/i);
  });

  test('home page shows the engagement process timeline', async ({ page }) => {
    await page.goto('/');
    const phases = await page.locator('#process [data-phase] h3').allInnerTexts();
    expect(phases.map((p) => p.trim())).toEqual(PHASES);
  });

  test('industries page lists the three target segments', async ({ page }) => {
    await page.goto('/industries');
    const names = await page.locator('[data-segment] h2').allInnerTexts();
    expect(names.map((n) => n.trim())).toEqual(SEGMENTS);
  });

  test('about page presents mission and philosophy with no years-of-experience claims', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /Pragmatic Enterprise First/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Our mission' })).toBeVisible();
    expect(await page.locator('body').innerText()).not.toMatch(/\b\d+\s*\+?\s*years?\b|years? of experience/i);
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const path of ['/approach', '/industries', '/about']) {
      test(`${path} has no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
        await gotoWithTheme(page, path, theme);
        await expectNoA11yViolations(page);
      });
    }
  }
});

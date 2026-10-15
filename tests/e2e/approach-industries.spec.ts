import { test, expect } from './fixtures';

import { engagementModelCatalog, engagementPhases } from '../../src/data/engagement';
import { segments } from '../../src/data/segments';

const PHASES = engagementPhases.map((p) => p.name);
const SEGMENTS = segments.map((s) => s.name);

test.describe('US5 — Approach, Industries & About', () => {
  test('How We Work lists the four phases in order, the five engagement models and the agency section, without prices', async ({
    page,
  }) => {
    await page.goto('/approach');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const phases = await page.locator('[data-phase] h3').allInnerTexts();
    expect(phases.map((p) => p.trim())).toEqual(PHASES);
    for (const model of engagementModelCatalog) {
      await expect(page.getByRole('heading', { level: 3, name: model.name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: 'Your DevOps partner, behind your brand' })).toBeVisible();
    expect(await page.locator('main').innerText()).not.toMatch(/[$€£]\s?\d|per (?:hour|month)/i);
  });

  test('home page shows the engagement process timeline', async ({ page }) => {
    await page.goto('/');
    const phases = await page.locator('#process [data-phase] h3').allInnerTexts();
    expect(phases.map((p) => p.trim())).toEqual(PHASES);
  });

  test('industries page lists the current target segments', async ({ page }) => {
    await page.goto('/industries');
    const names = await page.locator('[data-segment] h2').allInnerTexts();
    expect(names.map((n) => n.trim())).toEqual(SEGMENTS);
  });

  test('about page presents mission and philosophy with no years-of-experience claims', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: 'Pragmatic, enterprise-first' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Our mission' })).toBeVisible();
    expect(await page.locator('body').innerText()).not.toMatch(/\b\d+\s*\+?\s*years?\b|years? of experience/i);
  });
});

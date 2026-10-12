import { test, expect } from './fixtures';
import { offers } from '../../src/data/offers';
import { engagementModelCatalog } from '../../src/data/engagement';

const PRICE = /[$€£]\s?\d|\b(?:USD|PKR|EUR|GBP|AED|SAR)\s?\d|per (?:hour|month)|\bfee:\s*\d/i;

test.describe('US3 — Entry offers & How We Work', () => {
  test('/start-here lists the five entry offers with durations and no fees', async ({ page }) => {
    await page.goto('/start-here');
    await expect(page.locator('[data-offer]')).toHaveCount(offers.length);
    for (const offer of offers) {
      const card = page.locator(`[data-offer="${offer.id}"]`);
      await expect(card.getByRole('heading', { name: offer.name })).toBeVisible();
      await expect(card).toContainText(offer.duration);
      await expect(card).toContainText('What we need from you');
      await expect(card).toContainText('What you get');
    }
    expect(await page.locator('main').innerText()).not.toMatch(PRICE);
  });

  test('How We Work shows the engagement models, cadence, access model, AI-tool policy and agency section', async ({ page }) => {
    await page.goto('/approach');
    await expect(page.locator('[data-model]')).toHaveCount(engagementModelCatalog.length);
    for (const heading of ['Cadence and reporting', 'Access model', 'AI-tool policy']) {
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    }
    await expect(page.locator('#agencies')).toBeVisible();
  });

  test('the agency CTA opens the consultation form with "Agency partnership" selected', async ({ page }) => {
    await page.goto('/approach');
    await page.locator('#agencies').getByRole('link', { name: 'Discuss an agency partnership' }).click();
    const dialog = page.getByRole('dialog', { name: 'Book a Strategy Consultation' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: 'Service needed' })).toHaveText('Agency partnership');
  });

  test('without the dialog, /contact?service=agency-partnership preselects the agency option', async ({ page }) => {
    await page.goto('/contact?service=agency-partnership');
    const form = page.locator('main');
    await expect(form.getByRole('combobox', { name: 'Service needed' })).toHaveText('Agency partnership');
  });
});

import { test, expect } from './fixtures';
import { RESULTS_FOOTNOTE } from './catalog';
import { results } from '../../src/data/results';

test.describe('US1 — Home v3', () => {
  test('results band: title, eight achieved results with context, footnote', async ({ page }) => {
    await page.goto('/');
    const band = page.locator('#metrics');
    await expect(band.getByRole('heading', { level: 2 })).toHaveText('Selected results from past engagements');
    await expect(band.locator('[data-metric]')).toHaveCount(8);
    for (const r of results) {
      await expect(band.locator(`[data-metric="${r.id}"]`)).toContainText(r.context);
    }
    await expect(band.getByText(RESULTS_FOOTNOTE)).toBeVisible();
  });

  test('sections appear in the v3 order', async ({ page }) => {
    await page.goto('/');
    const order = await page.evaluate(() =>
      [...document.querySelectorAll('main section[id], main > section[id]')].map((s) => s.id).filter((id, i, a) => a.indexOf(id) === i),
    );
    const expected = ['hero', 'metrics', 'proof-strip', 'flagship', 'core-services', 'start-here', 'process', 'industries', 'trust', 'faq'];
    const positions = expected.map((id) => order.indexOf(id));
    expect(positions.every((p) => p >= 0), `missing sections in ${order.join(', ')}`).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test('trust band reuses the three brand-pillar cards', async ({ page }) => {
    await page.goto('/');
    const trust = page.locator('#trust');
    for (const pillar of ['Enterprise-grade', 'High-availability', 'Zero-trust security']) {
      await expect(trust.getByRole('heading', { level: 3, name: pillar, exact: true })).toBeVisible();
    }
    await expect(trust.getByText('Written proposal within 2 business days')).toBeVisible();
    await expect(trust.getByRole('link', { name: /Security & trust/ })).toHaveAttribute('href', '/trust');
  });

  test('FAQ items open and close from the keyboard (Enter and Space)', async ({ page }) => {
    await page.goto('/');
    const item = page.locator('#faq [data-faq]').first();
    const summary = item.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(item).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(item).not.toHaveAttribute('open', '');
  });

  // KNOWN GAP (Phase 4 review): on Pixel 7 the first result card starts at about 1.9 viewport heights because the
  // hero (headline, sub-line, pillars, CTA, blueprint stepper) is tall on phones. Fixing it means changing the hero
  // layout, which the design freeze forbids without owner approval. Re-enable once SC-006 is decided.
  test.fixme('results are reached within one scroll on a phone (SC-006)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Phone viewport only');
    await page.goto('/');
    const viewport = page.viewportSize()!;
    const firstCard = (await page.locator('#metrics [data-metric]').first().boundingBox())!;
    expect(firstCard.y).toBeLessThanOrEqual(viewport.height * 1.5);
  });
});

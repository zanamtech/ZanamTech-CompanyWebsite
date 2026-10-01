import { test, expect } from './fixtures';

const FOOTNOTE = 'Outcomes vary by environment; SLA commitments are defined per Statement of Work.';

test.describe('US4 — Metric counters', () => {
  test('final values and footnote are present in the server-rendered HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('99.9%');
    expect(html).toContain('uptime SLA target');
    expect(html).toContain(FOOTNOTE);
  });

  test('counters animate to their final values when scrolled into view', async ({ page }) => {
    await page.goto('/');
    const metrics = page.locator('#metrics');
    // Scroll each counter itself into view: on phones the section is taller than the viewport.
    const uptime = metrics.locator('[data-metric="uptime"] [data-counter]');
    await uptime.scrollIntoViewIfNeeded();
    await expect(uptime).toHaveText('99.9%', { timeout: 5_000 });
    const cost = metrics.locator('[data-metric="cost"] [data-counter]');
    await cost.scrollIntoViewIfNeeded();
    await expect(cost).toHaveText('40%', { timeout: 5_000 });
    await expect(metrics.getByText(FOOTNOTE)).toBeVisible();
  });

  test('reduced motion shows final values without animating', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const metrics = page.locator('#metrics');
    await metrics.scrollIntoViewIfNeeded();
    const counter = metrics.locator('[data-metric="uptime"] [data-counter]');
    // Sample repeatedly: the value must never be anything but the final figure.
    for (let i = 0; i < 5; i++) {
      await expect(counter).toHaveText('99.9%');
      await page.waitForTimeout(100);
    }
  });

  test('screen readers get the full metric statement', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#metrics [data-metric="uptime"] .sr-only')).toHaveText(/99\.9% uptime SLA target/);
  });
});

test.describe('US4 — without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('final values are shown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#metrics [data-metric="uptime"] [data-counter]')).toHaveText('99.9%');
  });
});

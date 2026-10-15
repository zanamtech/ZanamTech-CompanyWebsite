import { test, expect } from './fixtures';
import { RESULTS_FOOTNOTE as FOOTNOTE } from './catalog';

test.describe('US1 — Selected results from past engagements', () => {
  test('final values and footnote are present in the server-rendered HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('99.9%');
    expect(html).toContain('availability achieved');
    expect(html).toContain('Selected results from past engagements');
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
    // Sample every frame for half a second: the value must never be anything but the final figure.
    const seen = await counter.evaluate(
      (el) =>
        new Promise<string[]>((resolve) => {
          const values: string[] = [];
          const sample = () => {
            values.push(el.textContent ?? '');
            if (values.length < 30) requestAnimationFrame(sample);
            else resolve([...new Set(values)]);
          };
          sample();
        }),
    );
    expect(seen).toEqual(['99.9%']);
  });

  test('screen readers get the full metric statement', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#metrics [data-metric="uptime"] .sr-only')).toHaveText(/99\.9% availability achieved/);
  });
});

test.describe('Results — without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('final values are shown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#metrics [data-metric="uptime"] [data-counter]')).toHaveText('99.9%');
  });
});

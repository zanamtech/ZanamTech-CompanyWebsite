import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

// About page review round (2026-10-15).

test.describe('LinkedIn links carry target="_blank" in the component source', () => {
  // Not left to src/middleware.ts alone: a dev server started before the middleware existed never loads it.
  for (const file of ['src/pages/about.astro', 'src/components/layout/Footer.astro']) {
    test(file, () => {
      const source = readFileSync(file, 'utf8');
      const anchor = source.match(/<a\b[^>]*data-(?:founder|footer)-linkedin[^>]*>/)?.[0] ?? '';
      expect(anchor).toContain('target="_blank"');
      expect(anchor).toContain('rel="noopener noreferrer"');
    });
  }
});

test.describe('About founder card', () => {
  test('eyebrow on the name row, photo centred against role + bio from 768px; stacked on phones', async ({
    page,
  }, testInfo) => {
    await page.goto('/about');
    const card = page.locator('[data-founder-card]');
    const eyebrow = (await card.getByText('Leadership', { exact: true }).boundingBox())!;
    const name = (await card.getByRole('heading', { name: 'Mubashir Ahmed' }).boundingBox())!;
    const photo = (await card.locator('[data-founder-photo]').boundingBox())!;
    const role = (await card.getByText('Founder & Lead Architect').boundingBox())!;
    const linkedin = (await card.locator('[data-founder-linkedin]').boundingBox())!;
    const bio = (await card.locator('p').last().boundingBox())!;
    if (testInfo.project.name === 'desktop') {
      // Same row: the eyebrow's text bottom sits on the name's baseline row, the eyebrow left of the name.
      expect(eyebrow.y).toBeGreaterThan(name.y - 1);
      expect(eyebrow.y + eyebrow.height).toBeLessThan(name.y + name.height + 1);
      expect(eyebrow.x + eyebrow.width).toBeLessThan(name.x);
      expect(Math.abs(photo.x - eyebrow.x)).toBeLessThanOrEqual(1);
      // Photo centred in the span from the end of the name row to the bottom of the bio.
      const spanTop = Math.max(eyebrow.y + eyebrow.height, name.y + name.height);
      const spanBottom = bio.y + bio.height;
      expect(Math.abs(photo.y + photo.height / 2 - (spanTop + spanBottom) / 2)).toBeLessThanOrEqual(12);
      expect(linkedin.y).toBeLessThan(name.y + name.height);
    } else {
      const order = [eyebrow, photo, name, role, linkedin, bio].map((b) => b.y);
      expect(order).toEqual([...order].sort((a, b) => a - b));
      expect(photo.width).toBeLessThanOrEqual(160);
    }
  });

  test('gap between the hero and "Our mission" is reduced', async ({ page }, testInfo) => {
    await page.goto('/about');
    const section = page.locator('section[aria-labelledby="mission-title"]');
    const paddingTop = await section.evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
    expect(paddingTop).toBe(testInfo.project.name === 'desktop' ? 40 : 24);
  });
});

test.describe('Regions', () => {
  test('contact form Region dropdown uses the regions-served list plus Other', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form').first();
    await form.getByRole('combobox', { name: 'Region (optional)' }).click();
    await expect(form.getByRole('listbox', { name: 'Region (optional)' }).getByRole('option')).toHaveText([
      'United States',
      'Canada',
      'United Kingdom',
      'Europe',
      'Gulf Cooperation Council (GCC)',
      'Australia & New Zealand',
      'Other',
    ]);
  });

  test('Industries spells out GCC on first mention and keeps the segment name', async ({ page }) => {
    await page.goto('/industries');
    const text = await page.locator('main').innerText();
    expect(text.indexOf('Gulf Cooperation Council (GCC)')).toBeGreaterThan(-1);
    expect(text.indexOf('Gulf Cooperation Council (GCC)')).toBeLessThan(text.indexOf('GCC Enterprises & Scale-Ups'));
    await expect(page.getByRole('heading', { name: 'GCC Enterprises & Scale-Ups' })).toBeVisible();
  });

  test('no page still says "North America, the UK and Europe"', async ({ page }) => {
    for (const path of ['/', '/about', '/industries', '/contact']) {
      await page.goto(path);
      expect(await page.locator('body').innerText()).not.toMatch(/North America/);
    }
  });
});

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
      [...document.querySelectorAll('main section[id], main > section[id]')]
        .map((s) => s.id)
        .filter((id, i, a) => a.indexOf(id) === i),
    );
    const expected = [
      'hero',
      'metrics',
      'proof-strip',
      'flagship',
      'core-services',
      'start-here',
      'process',
      'industries',
      'trust',
      'faq',
    ];
    const positions = expected.map((id) => order.indexOf(id));
    expect(
      positions.every((p) => p >= 0),
      `missing sections in ${order.join(', ')}`,
    ).toBe(true);
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

  test('FAQ height animates on open and close, and is instant under reduced motion', async ({ page, browser }) => {
    await page.goto('/');
    const item = page.locator('#faq [data-faq]').first();
    await item.scrollIntoViewIfNeeded();

    // Click, then read the animations the click started on this item (CSS transition on ::details-content in
    // Chromium, Web Animations fallback elsewhere). Checking the started animation rather than sampling one frame
    // keeps the test stable in engines that paint few frames while headless.
    const toggle = () =>
      item.evaluate((details) => {
        (details.querySelector('summary') as HTMLElement).click();
        return document
          .getAnimations()
          .filter((a) => {
            const effect = a.effect as KeyframeEffect | null;
            return (
              !!effect?.target &&
              details.contains(effect.target) &&
              !(effect.target as Element).matches('[data-faq-chevron]')
            );
          })
          .map((a) => Number((a.effect as KeyframeEffect).getComputedTiming().duration));
      });

    const closed = Math.round((await item.boundingBox())!.height);
    const opening = await toggle();
    expect(
      opening.some((d) => d >= 250 && d <= 300),
      `height animation on open: ${opening.join(',')}ms`,
    ).toBe(true);
    await expect.poll(async () => Math.round((await item.boundingBox())!.height)).toBeGreaterThan(closed);
    await page.waitForTimeout(400);
    const open = Math.round((await item.boundingBox())!.height);
    await expect(item.locator('[data-faq-chevron]')).toHaveCSS('rotate', '180deg');

    const closing = await toggle();
    expect(
      closing.some((d) => d >= 250 && d <= 300),
      `height animation on close: ${closing.join(',')}ms`,
    ).toBe(true);
    await expect(item).not.toHaveAttribute('open', '');
    await expect.poll(async () => Math.round((await item.boundingBox())!.height)).toBe(closed);

    const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: page.viewportSize()! });
    const still = await reduced.newPage();
    await still.goto('/');
    const first = still.locator('#faq [data-faq]').first();
    await first.scrollIntoViewIfNeeded();
    await first.locator('summary').click();
    expect(Math.round((await first.boundingBox())!.height)).toBe(open);
    await reduced.close();
  });

  test('hero scroll cue is fully in front of the results band and lands on the flagship heading below the header', async ({
    page,
  }) => {
    await page.goto('/');
    const cue = page.getByRole('link', { name: 'Scroll to the flagship service: Managed Cloud & DevOps' });
    await expect(cue).toHaveAttribute('href', '#flagship');
    const unobscured = await cue.evaluate((a) => {
      a.scrollIntoView({ block: 'center', behavior: 'instant' });
      const b = a.getBoundingClientRect();
      const points = [
        [b.left + 3, b.top + b.height / 2],
        [b.right - 3, b.top + b.height / 2],
        [b.left + b.width / 2, b.top + 2],
        [b.left + b.width / 2, b.bottom - 2],
      ];
      return points.every(([x, y]) => document.elementFromPoint(x, y)?.closest('a') === a);
    });
    expect(unobscured).toBe(true);

    await cue.click();
    const eyebrow = page.locator('#flagship .eyebrow');
    await expect.poll(async () => (await eyebrow.boundingBox())!.y, { timeout: 3_000 }).toBeLessThan(200);
    const headerBottom = await page
      .locator('header > div')
      .first()
      .evaluate((el) => el.getBoundingClientRect().bottom);
    await expect.poll(async () => (await eyebrow.boundingBox())!.y).toBeGreaterThanOrEqual(headerBottom + 8);
    await expect(page.locator('#flagship-title')).toBeInViewport();
  });

  // SC-006 (revised at owner review): within two scrolls on phones; the hero stays unchanged.
  test('results are reached within two scrolls on a phone (SC-006)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Phone viewport only');
    await page.goto('/');
    const viewport = page.viewportSize()!;
    const firstCard = (await page.locator('#metrics [data-metric]').first().boundingBox())!;
    expect(firstCard.y).toBeLessThanOrEqual(viewport.height * 2);
  });
});

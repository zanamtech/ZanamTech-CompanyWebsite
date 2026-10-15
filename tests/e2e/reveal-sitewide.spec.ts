import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

// Regression (About review, 2026-10-15): a Philosophy card on /about rendered blank. On every main page, after a fast
// scroll, a theme toggle and a client-side navigation away and back, every reveal item must end fully visible.

const PAGES = [
  '/',
  '/services',
  '/services/managed-cloud-devops',
  '/approach',
  '/about',
  '/industries',
  '/start-here',
  '/insights',
  '/insights/cloud-cost-checklist',
  '/contact',
];

/** Reveal items whose effective opacity (through their ancestors) is below 1, or still marked hidden. */
function invisibleItems(page: Page) {
  return page.evaluate(() => {
    const items = [
      ...document.querySelectorAll<HTMLElement>('[data-reveal-group] > *, [data-reveal]'),
      ...document.querySelectorAll<HTMLElement>('#process [data-phase] > :first-child'),
    ];
    return items
      .filter((el) => {
        if (el.dataset.reveal === 'hidden') return true;
        let opacity = 1;
        for (let n: Element | null = el; n && n !== document.body; n = n.parentElement)
          opacity *= Number(getComputedStyle(n).opacity);
        return opacity < 0.999;
      })
      .map((el) => (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 50));
  });
}

async function fastScroll(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(16);
  }
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
}

async function expectAllVisible(page: Page, step: string) {
  await expect.poll(() => invisibleItems(page), { timeout: 6_000, message: `${page.url()} after ${step}` }).toEqual([]);
}

test.describe('Reveal never leaves content hidden', () => {
  test.use({ hasTouch: false });

  for (const path of PAGES) {
    test(path, async ({ page }) => {
      await page.goto(path);
      await fastScroll(page);
      await expectAllVisible(page, 'fast scroll');

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.locator('[data-theme-toggle]:visible').first().click();
      await fastScroll(page);
      await expectAllVisible(page, 'theme toggle');

      // Away and back through the ClientRouter (no full reload: the marker survives).
      await page.evaluate(() => ((window as unknown as { __ztMarker: boolean }).__ztMarker = true));
      await page.locator('footer a[href="/privacy"]').first().click();
      await expect(page).toHaveURL(/\/privacy$/);
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      expect(await page.evaluate(() => (window as unknown as { __ztMarker?: boolean }).__ztMarker)).toBe(true);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await fastScroll(page);
      await expectAllVisible(page, 'navigating away and back');

      // Revealed cards keep no reveal styles of their own.
      await expect.poll(() => page.locator('[data-reveal]').count()).toBe(0);
    });
  }

  test('the safety timeout starts per group on entering the viewport: lower sections still fade in', async ({
    page,
  }) => {
    await page.goto('/about');
    const group = page.locator('section[aria-labelledby="capabilities-title"] [data-reveal-group]');
    // Well past the 4s timeout, never scrolled to: still waiting to fade in.
    await page.waitForTimeout(5_000);
    await expect(group.locator('> [data-reveal="hidden"]')).toHaveCount(2);
    await group.scrollIntoViewIfNeeded();
    await expect(group.locator('> [data-reveal="shown"]').first()).toBeAttached();
    await expect.poll(() => invisibleItems(page), { timeout: 6_000 }).toEqual([]);
    await expect.poll(() => group.locator('> [data-reveal]').count()).toBe(0);
  });

  test('reduced motion: nothing is ever hidden', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const path of ['/', '/about']) {
      await page.goto(path);
      expect(await page.locator('[data-reveal="hidden"]').count()).toBe(0);
      expect(await invisibleItems(page)).toEqual([]);
    }
    await context.close();
  });
});

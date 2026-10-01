import type { Page } from '@playwright/test';
import { test, expect, gotoWithTheme } from './fixtures';

/** Marks the current JS realm; a full page reload would wipe it. */
async function markRealm(page: Page) {
  await page.evaluate(() => ((window as unknown as { __realm: string }).__realm = 'spa'));
}
async function expectSameRealm(page: Page) {
  expect(await page.evaluate(() => (window as unknown as { __realm?: string }).__realm)).toBe('spa');
}

test.describe('Client-side navigation (Astro ClientRouter)', () => {
  test('header links navigate without a full reload and the header element persists', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Primary nav links are desktop-only');
    await page.goto('/');
    await markRealm(page);
    await page.locator('header').evaluate((el) => (el.dataset.probe = 'persisted'));

    await page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Approach' }).click();
    await expect(page).toHaveURL(/\/approach\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Consultative engagement');
    await expectSameRealm(page);
    await expect(page.locator('header')).toHaveAttribute('data-probe', 'persisted');
    await expect(page.locator('header')).toHaveCount(1);

    await page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Industries' }).click();
    await expect(page).toHaveURL(/\/industries\/?$/);
    await expectSameRealm(page);
  });

  test('active navigation state follows the current page', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Primary nav links are desktop-only');
    await page.goto('/');
    const nav = page.locator('header nav[aria-label="Primary"]');
    await nav.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Approach' })).not.toHaveAttribute('aria-current', 'page');

    await nav.getByRole('link', { name: 'Approach' }).click();
    await expect(page).toHaveURL(/\/approach\/?$/);
    await expect(nav.getByRole('link', { name: 'Approach' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current', 'page');
  });

  test('dark theme survives navigation and the toggle still flips exactly once', async ({ page }) => {
    await gotoWithTheme(page, '/', 'dark');
    const html = page.locator('html');
    await expect(html).toHaveClass(/\bdark\b/);

    // Sample the <html> class throughout the swap: it must never lose `.dark` (no light flash).
    await page.evaluate(() => {
      const w = window as unknown as { __lostDark: boolean };
      w.__lostDark = false;
      new MutationObserver(() => {
        if (!document.documentElement.classList.contains('dark')) w.__lostDark = true;
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    });

    await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);
    await expect(html).toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => (window as unknown as { __lostDark: boolean }).__lostDark)).toBe(false);

    const toggle = page.getByRole('button', { name: 'Dark theme' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(html).not.toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('desktop services menu closes after choosing a service', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Mega-menu is desktop-only');
    await page.goto('/');
    await page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Services', exact: true }).hover();
    const menu = page.locator('#services-menu');
    await menu.getByRole('link', { name: 'Cloud Infrastructure Cost Optimization' }).click();
    await expect(page).toHaveURL(/\/services\/cloud-cost-optimization\/?$/);
    await expect(menu).toBeHidden();
  });

  test('mobile menu closes after navigating', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile menu only');
    await page.goto('/');
    await markRealm(page);
    await page.getByRole('button', { name: 'Open menu' }).click();
    const mobileNav = page.locator('#mobile-nav');
    await mobileNav.getByRole('link', { name: 'Industries' }).click();
    await expect(page).toHaveURL(/\/industries\/?$/);
    await expect(mobileNav).toBeHidden();
    await expectSameRealm(page);
  });

  test('contact dialog still works after navigating', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
    const cta = page.locator('main').getByRole('link', { name: 'Book a Strategy Consultation' }).first();
    await cta.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(cta).toBeFocused();
  });

  test('metric counters animate again after returning to the home page', async ({ page }) => {
    await page.goto('/about');
    await page.locator('footer').getByRole('link', { name: 'ZanamTech home' }).click();
    await expect(page).toHaveURL(/\/$/);
    const metrics = page.locator('#metrics');
    await metrics.locator('[data-metric="uptime"] [data-counter]').scrollIntoViewIfNeeded();
    await expect(metrics.locator('[data-metric="uptime"] [data-counter]')).toHaveText('99.9%', { timeout: 5_000 });
  });

  test('page width is stable between short and long pages (scrollbar gutter reserved)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Scrollbar width applies to desktop');
    await page.goto('/');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarGutter)).toBe('stable');
    const homeLogo = await page.locator('header a[aria-label="ZanamTech home"]').boundingBox();
    await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);
    const privacyLogo = await page.locator('header a[aria-label="ZanamTech home"]').boundingBox();
    expect(privacyLogo?.x).toBe(homeLogo?.x);
  });
});

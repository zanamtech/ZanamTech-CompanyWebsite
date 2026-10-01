import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

/**
 * Services mega-menu on touch devices at desktop-nav widths (>= 1024px; below that the drawer is used).
 * A first tap must toggle the menu without navigating, reloading or starting a client-side transition.
 */

async function instrument(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __realm: string; __navStarts: number };
    w.__realm = 'same';
    w.__navStarts = 0;
    document.addEventListener('astro:before-preparation', () => (w.__navStarts += 1));
  });
}

async function expectNoNavigation(page: Page, path = '/') {
  await page.waitForTimeout(400); // allow any (unwanted) navigation to start
  expect(new URL(page.url()).pathname).toBe(path);
  const state = await page.evaluate(() => {
    const w = window as unknown as { __realm?: string; __navStarts?: number };
    return { realm: w.__realm, navStarts: w.__navStarts };
  });
  expect(state).toEqual({ realm: 'same', navStarts: 0 }); // no reload, no ClientRouter transition
}

const servicesTrigger = (page: Page) =>
  page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Services', exact: true });

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Device-specific suite runs once, in the desktop project');
});

for (const device of [
  { name: 'iPad Mini (landscape)', width: 1024, height: 768 },
  { name: 'iPad Pro 12.9 (portrait)', width: 1024, height: 1366 },
  { name: 'iPad Pro 11 (landscape)', width: 1194, height: 834 },
]) {
  test.describe(`Touch tablet — ${device.name}`, () => {
    test.use({ viewport: { width: device.width, height: device.height }, hasTouch: true, isMobile: true });

    test('first tap opens the menu without navigating; second tap closes it', async ({ page }) => {
      await page.goto('/');
      await instrument(page);
      const trigger = servicesTrigger(page);
      const menu = page.locator('#services-menu');

      await trigger.tap();
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expectNoNavigation(page);

      await trigger.tap();
      await expect(menu).toBeHidden();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expectNoNavigation(page);
    });

    test('services remain reachable: "View all services" and service links navigate from the open menu', async ({ page }) => {
      await page.goto('/');
      const menu = page.locator('#services-menu');
      await servicesTrigger(page).tap();
      await menu.getByRole('link', { name: 'View all services' }).tap();
      await expect(page).toHaveURL(/\/services\/?$/);
      await expect(menu).toBeHidden();

      await servicesTrigger(page).tap();
      await menu.getByRole('link', { name: 'High Availability & Disaster Recovery' }).tap();
      await expect(page).toHaveURL(/\/services\/high-availability-disaster-recovery\/?$/);
      await expect(menu).toBeHidden();
    });

    test('tapping outside closes the open menu without navigating', async ({ page }) => {
      await page.goto('/');
      await instrument(page);
      const menu = page.locator('#services-menu');
      await servicesTrigger(page).tap();
      await expect(menu).toBeVisible();
      // Tap an empty spot below the menu card (the card itself covers part of the hero).
      const card = (await menu.boundingBox())!;
      await page.touchscreen.tap(card.x + 20, Math.min(card.y + card.height + 60, device.height - 20));
      await expect(menu).toBeHidden();
      await expectNoNavigation(page);
    });
  });
}

test.describe('Hybrid touchscreen laptop (fine pointer + touch, 1440px)', () => {
  test.use({ viewport: { width: 1440, height: 900 }, hasTouch: true });

  test('a touch tap toggles the menu even though the device can hover', async ({ page }) => {
    await page.goto('/');
    await instrument(page);
    await servicesTrigger(page).tap();
    await expect(page.locator('#services-menu')).toBeVisible();
    await expectNoNavigation(page);
  });

  test('a mouse click on the same device still navigates to /services', async ({ page }) => {
    await page.goto('/');
    await servicesTrigger(page).click();
    await expect(page).toHaveURL(/\/services\/?$/);
  });
});

test.describe('Desktop mouse (1440px)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('hover opens the menu and a click navigates directly to /services', async ({ page }) => {
    await page.goto('/');
    await servicesTrigger(page).hover();
    await expect(page.locator('#services-menu')).toBeVisible();
    await servicesTrigger(page).click();
    await expect(page).toHaveURL(/\/services\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Enterprise engineering services');
  });
});

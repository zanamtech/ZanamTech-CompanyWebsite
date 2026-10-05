import type { Locator, Page } from '@playwright/test';
import { test, expect, expectNoA11yViolations, gotoWithTheme } from './fixtures';

type Box = { x: number; y: number; width: number; height: number };

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

async function visibleBoxes(page: Page, locators: Record<string, Locator>) {
  const boxes: Record<string, Box> = {};
  for (const [name, loc] of Object.entries(locators)) {
    if (await loc.isVisible()) boxes[name] = (await loc.boundingBox())!;
  }
  return boxes;
}

function expectNoOverlaps(boxes: Record<string, Box>) {
  const names = Object.keys(boxes);
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      expect(overlaps(boxes[names[i]], boxes[names[j]]), `${names[i]} overlaps ${names[j]}`).toBe(false);
    }
  }
}

const headerParts = (page: Page) => ({
  logo: page.locator('header a[aria-label="ZanamTech home"]'),
  nav: page.locator('header nav[aria-label="Primary"]'),
  toggle: page.locator('header [data-theme-toggle]'),
  cta: page.locator('header').getByRole('link', { name: 'Book a Strategy Consultation' }).first(),
  hamburger: page.locator('header button[aria-controls="mobile-nav"]'),
});

// Run once (desktop project) at explicit tablet/desktop widths; the mobile project already covers phones.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Viewport-specific suite runs in the desktop project');
});

for (const device of [
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro 11', width: 834, height: 1194 },
  { name: 'Surface / small laptop', width: 1023, height: 768 },
]) {
  test.describe(`Tablet header — ${device.name} (${device.width}px)`, () => {
    test.use({ viewport: { width: device.width, height: device.height } });

    test('uses the drawer: desktop nav and header CTA hidden, hamburger visible, nothing overlaps', async ({ page }) => {
      await page.goto('/');
      const parts = headerParts(page);
      await expect(parts.nav).toBeHidden();
      await expect(parts.cta).toBeHidden();
      await expect(parts.hamburger).toBeVisible();
      await expect(parts.toggle).toBeVisible();
      expectNoOverlaps(await visibleBoxes(page, parts));
      const bar = (await page.locator('header > div').boundingBox())!;
      expect(bar.height).toBeLessThanOrEqual(66); // floating bar stays a single row, no wrapping
    });

    test('drawer opens, navigates, and closes cleanly', async ({ page }) => {
      await page.goto('/');
      const hamburger = headerParts(page).hamburger;
      const drawer = page.locator('#mobile-nav');
      await hamburger.click();
      await expect(drawer).toBeVisible();
      await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
      await expect(drawer.getByRole('link', { name: 'Book a Strategy Consultation' })).toBeVisible();
      for (const label of ['Services', 'Approach', 'Industries', 'About']) {
        const link = drawer.getByRole('link', { name: label, exact: true });
        await expect(link).toBeVisible();
        expect((await link.boundingBox())!.height).toBeLessThanOrEqual(52); // no awkward wrapping
      }
      await page.keyboard.press('Escape');
      await expect(drawer).toBeHidden();
      await expect(hamburger).toBeFocused();

      await hamburger.click();
      await drawer.getByRole('link', { name: 'Approach', exact: true }).click();
      await expect(page).toHaveURL(/\/approach\/?$/);
      await expect(drawer).toBeHidden();
    });

    test('has no WCAG 2.1 AA violations with the drawer open (light and dark)', async ({ page }) => {
      for (const theme of ['light', 'dark'] as const) {
        await gotoWithTheme(page, '/', theme);
        await headerParts(page).hamburger.click();
        await expect(page.locator('#mobile-nav')).toBeVisible();
        await expectNoA11yViolations(page);
      }
    });
  });
}

test.describe('Desktop header at the lg breakpoint — iPad Pro 12.9 (1024px)', () => {
  test.use({ viewport: { width: 1024, height: 1366 } });

  test('shows desktop nav and CTA without overlap or wrapping; hamburger hidden', async ({ page }) => {
    await page.goto('/');
    const parts = headerParts(page);
    await expect(parts.nav).toBeVisible();
    await expect(parts.cta).toBeVisible();
    await expect(parts.hamburger).toBeHidden();
    const { nav, ...others } = await visibleBoxes(page, parts);
    expectNoOverlaps({ nav, ...others });
    for (const label of ['Services', 'Approach', 'Industries', 'About']) {
      const link = parts.nav.getByRole('link', { name: label, exact: true });
      expect(await link.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      expect((await link.boundingBox())!.height).toBeLessThanOrEqual(44);
    }
    expect((await parts.cta.boundingBox())!.height).toBeLessThanOrEqual(44); // CTA label on one line
  });

  test('mega-menu card fits inside the viewport', async ({ page }) => {
    await page.goto('/');
    await page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Services', exact: true }).hover();
    const menu = (await page.locator('#services-menu').boundingBox())!;
    expect(menu.x).toBeGreaterThanOrEqual(0);
    expect(menu.x + menu.width).toBeLessThanOrEqual(1024);
  });
});

test.describe('Desktop mega-menu card (1440px)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('is a contained, centred floating card below the header', async ({ page }) => {
    await page.goto('/');
    await page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Services', exact: true }).hover();
    const menu = page.locator('#services-menu');
    await expect(menu).toBeVisible();
    const box = (await menu.boundingBox())!;
    const header = (await page.locator('header').boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(1024); // max-w-5xl
    expect(Math.abs(box.x + box.width / 2 - (header.x + header.width / 2))).toBeLessThanOrEqual(2); // centred under header
    expect(box.y).toBeGreaterThan(header.y + header.height); // floats below the bar (mt-2)
    await expect(menu.locator('a[href^="/services/"] svg')).toHaveCount(9); // icons retained
  });
});

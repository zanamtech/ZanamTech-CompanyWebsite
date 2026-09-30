import { test, expect, gotoWithTheme, expectNoA11yViolations } from './fixtures';

const ROUTES = [
  '/',
  '/services',
  '/services/cloud-migration-containerization',
  '/services/managed-infrastructure-24-7',
  '/approach',
  '/industries',
  '/about',
  '/contact',
  '/privacy',
];

test.describe('US7 — Theme toggle & accessible browsing', () => {
  test('toggle switches to dark, persists across reload and navigation, and switches back', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: 'Dark theme' });

    await expect(html).not.toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(html).toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(html).toHaveClass(/\bdark\b/);
    await page.goto('/about');
    await expect(html).toHaveClass(/\bdark\b/);
    await expect(page.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(html).not.toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(html).not.toHaveClass(/\bdark\b/);
  });

  test('toggle is keyboard operable', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Dark theme' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await page.keyboard.press('Space');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('falls back to light when the stored value is invalid', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('zt-theme', 'purple'));
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`all routes have no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
      test.setTimeout(90_000);
      for (const route of ROUTES) {
        await gotoWithTheme(page, route, theme);
        await test.step(route, async () => expectNoA11yViolations(page));
      }
    });
  }
});

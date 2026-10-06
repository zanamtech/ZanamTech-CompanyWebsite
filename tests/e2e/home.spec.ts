import { test, expect, gotoWithTheme, expectNoA11yViolations } from './fixtures';

const HEADLINE = 'Enterprise Cloud Resilience, Ironclad Cyber Security & Intelligent AI Automation.';

test.describe('US1 — Home hero & brand', () => {
  test('shows headline, pillars and both CTAs', async ({ page }, testInfo) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(HEADLINE);

    const hero = page.locator('#hero');
    for (const pillar of ['Enterprise-grade', 'High-availability', 'Zero-trust security']) {
      await expect(hero.getByText(pillar, { exact: true })).toBeVisible();
    }

    const primary = hero.getByRole('link', { name: 'Book a Strategy Consultation' });
    await expect(primary).toBeVisible();
    // A single primary CTA per section: the secondary "custom proposal" button was retired.
    await expect(page.getByRole('link', { name: 'Request a Custom Proposal' })).toHaveCount(0);

    if (testInfo.project.name === 'desktop') {
      await expect(primary).toBeInViewport();
    }
  });

  test('contains no pricing, competitor names or years-of-experience claims', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/[$€£]\s?\d|\b(?:USD|PKR)\s?\d|per (?:hour|month)/i);
    expect(text).not.toMatch(/\b\d+\s*\+?\s*years?\b|years? of experience/i);
    expect(text).not.toMatch(/10\s?Pearls|Sherdil|LoomaDev|RevolveAI|OctaveBytes/i);
  });

  test('defaults to the light theme on first visit', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('applies a stored dark theme before first paint', async ({ page }) => {
    await gotoWithTheme(page, '/', 'dark');
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  });

  test('skip link is the first focusable element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`has no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, '/', theme);
      await expectNoA11yViolations(page);
    });
  }
});

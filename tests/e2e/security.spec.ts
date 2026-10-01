import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

// Serve pages with the production CSP from nginx/security-headers.conf (the preview server sends no headers).
// upgrade-insecure-requests is dropped because the test server is plain-http localhost.
const conf = readFileSync(new URL('../../nginx/security-headers.conf', import.meta.url), 'utf8');
const CSP = conf
  .match(/Content-Security-Policy "([^"]+)"/)![1]
  .split(';')
  .map((d) => d.trim())
  .filter((d) => d && d !== 'upgrade-insecure-requests')
  .join('; ');

async function enforceCsp(page: Page) {
  const violations: string[] = [];
  page.on('console', (msg) => {
    if (/Content Security Policy|Refused to/i.test(msg.text())) violations.push(msg.text());
  });
  page.on('pageerror', (err) => violations.push(`pageerror: ${err.message}`));
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.fallback();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': CSP } });
  });
  return violations;
}

const ROUTES = ['/', '/services', '/services/observability-monitoring', '/approach', '/industries', '/about', '/contact', '/privacy'];

test.describe('Security — CSP compliance', () => {
  test('all pages load under the production CSP with no violations', async ({ page }) => {
    const violations = await enforceCsp(page);
    for (const route of ROUTES) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
    }
    expect(violations).toEqual([]);
  });

  test('interactive features work under the CSP (theme, menu, dialog, form, counters, reveal)', async ({ page }, testInfo) => {
    const violations = await enforceCsp(page);
    await page.route('**/submit', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
    );
    await page.goto('/');

    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    if (testInfo.project.name === 'desktop') {
      await page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Services', exact: true }).hover();
      await expect(page.locator('#services-menu')).toBeVisible();
      await page.keyboard.press('Escape');
    }

    await page.locator('#metrics [data-metric="uptime"] [data-counter]').scrollIntoViewIfNeeded();
    await expect(page.locator('#metrics [data-metric="uptime"] [data-counter]')).toHaveText('99.9%', { timeout: 5_000 });
    await page.locator('#process').scrollIntoViewIfNeeded();
    await expect(page.locator('#process [data-phase]').first()).toHaveCSS('opacity', '1', { timeout: 5_000 });

    await page.locator('#hero').getByRole('link', { name: 'Book a Strategy Consultation' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Full name').fill('Alex Morgan');
    await dialog.getByLabel('Work email').fill('alex@example.com');
    await dialog.getByLabel('Company').fill('Example Corp');
    await dialog.getByLabel('How can we help?').fill('Requesting an assessment of our Kubernetes platform.');
    await dialog.getByLabel(/I agree to the processing/).check();
    await dialog.getByRole('button', { name: 'Send request' }).click();
    await expect(dialog.getByRole('heading', { name: 'Request received' })).toBeVisible();

    expect(violations).toEqual([]);
  });
});

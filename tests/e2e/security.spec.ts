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
  // Ready signal: Alpine has started, so every module script on the page has run under the CSP.
  await page.addInitScript(() =>
    document.addEventListener('alpine:initialized', () => {
      (window as unknown as { __alpineReady: boolean }).__alpineReady = true;
    }),
  );
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.fallback();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': CSP } });
  });
  return violations;
}

const ROUTES = [
  '/',
  '/services',
  '/services/observability-monitoring',
  '/approach',
  '/industries',
  '/about',
  '/contact',
  '/privacy',
];

test.describe('Security — CSP compliance', () => {
  // One test per page: a single test looping over every page shared one 30s budget and timed out on a loaded machine.
  for (const route of ROUTES) {
    test(`${route} loads under the production CSP with no violations`, async ({ page }) => {
      const violations = await enforceCsp(page);
      await page.goto(route);
      // Not 'networkidle' (it needs 500ms of network silence and timed out on a slow machine).
      await page.waitForFunction(() => (window as unknown as { __alpineReady?: boolean }).__alpineReady === true);
      expect(violations).toEqual([]);
    });
  }

  test('interactive features work under the CSP (theme, menu, contact form, counters, reveal)', async ({
    page,
  }, testInfo) => {
    const violations = await enforceCsp(page);
    await page.route('**/submit', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
    );
    await page.goto('/');

    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);

    if (testInfo.project.name === 'desktop') {
      await page
        .locator('header nav[aria-label="Primary"]:not(#mobile-nav)')
        .getByRole('link', { name: 'Services', exact: true })
        .hover();
      await expect(page.locator('#services-menu')).toBeVisible();
      await page.keyboard.press('Escape');
    }

    await page.locator('#metrics [data-metric="uptime"] [data-counter]').scrollIntoViewIfNeeded();
    await expect(page.locator('#metrics [data-metric="uptime"] [data-counter]')).toHaveText('99.9%', {
      timeout: 5_000,
    });
    await page.locator('#process').scrollIntoViewIfNeeded();
    await expect(page.locator('#process [data-phase]').first()).toHaveCSS('opacity', '1', { timeout: 5_000 });

    // A client-side navigation (fetch, fade, swap): wait for it like a navigation, not with the 5s assertion timeout,
    // which a slow machine can exceed.
    await page.locator('#hero').getByRole('link', { name: 'Book a Strategy Consultation' }).click();
    await page.waitForURL(/\/contact$/);
    const dialog = page.getByRole('main');
    await dialog.getByLabel('Full name').fill('Alex Morgan');
    await dialog.getByLabel('Email address').fill('alex@example.com');
    await dialog.getByLabel('Company name').fill('Example Corp');
    await dialog.getByRole('combobox', { name: 'Service needed' }).click();
    await dialog.getByRole('option', { name: 'Other / Not sure yet' }).click();
    await dialog
      .getByLabel('Project overview & requirements')
      .fill('Requesting an assessment of our Kubernetes platform.');
    await dialog.getByLabel(/I agree to ZanamTech processing my details/).check();
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByRole('heading', { name: 'Request received' })).toBeVisible();

    expect(violations).toEqual([]);
  });
});

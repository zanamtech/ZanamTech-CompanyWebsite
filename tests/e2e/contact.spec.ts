import type { Page, Route } from '@playwright/test';
import { test, expect, gotoWithTheme, expectNoA11yViolations } from './fixtures';

const ENDPOINT = '**/submit';

async function mockEndpoint(page: Page, status: number, calls: unknown[] = []) {
  await page.unroute(ENDPOINT);
  await page.route(ENDPOINT, async (route: Route) => {
    calls.push(route.request().postDataJSON());
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ success: status < 300, message: status < 300 ? 'ok' : 'error' }),
    });
  });
  return calls;
}

async function openDialogFromHero(page: Page) {
  await page.goto('/');
  const trigger = page.locator('#hero').getByRole('link', { name: 'Book a Strategy Consultation' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Book a Strategy Consultation' });
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

async function fillValid(scope: ReturnType<Page['getByRole']>) {
  await scope.getByLabel('Full name').fill('Alex Morgan');
  await scope.getByLabel('Email address').fill('alex.morgan@example.com');
  await scope.getByLabel('Company name').fill('Example Corp');
  await scope.getByLabel('Phone number (optional)').fill('+1 555 010 0000');
  await scope.getByLabel('Service needed').selectOption('Cloud Migration & Containerization');
  await scope.getByLabel('Estimated engagement size (optional)').selectOption({ index: 2 });
  await scope.getByLabel('Project overview & requirements').fill('We need a zero-downtime migration of our production workloads to Kubernetes.');
  await scope.getByLabel(/I agree to ZanamTech processing my details/).check();
}

test.describe('US3 — Contact dialog & lead submission', () => {
  test('CTA opens the dialog with focus on the first field; Escape closes and restores focus', async ({ page }) => {
    const { trigger, dialog } = await openDialogFromHero(page);
    await expect(dialog.getByLabel('Full name')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('shows inline errors for invalid input and focuses the first invalid field', async ({ page }) => {
    const calls = await mockEndpoint(page, 200);
    const { dialog } = await openDialogFromHero(page);
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByText('Please enter your full name.')).toBeVisible();
    await expect(dialog.getByText('Please enter a valid email address.')).toBeVisible();
    await expect(dialog.getByText('Please enter your company name.')).toBeVisible();
    await expect(dialog.getByText('Please select the service you need.')).toBeVisible();
    await expect(dialog.getByText('Please describe your requirements (at least 20 characters).')).toBeVisible();
    await expect(dialog.getByText('Please accept the privacy notice to continue.')).toBeVisible();
    await expect(dialog.getByLabel('Full name')).toBeFocused();
    await expect(dialog.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true');
    expect(calls).toHaveLength(0);
  });

  test('submits a valid request and shows confirmation', async ({ page }) => {
    const calls = await mockEndpoint(page, 200);
    const { dialog } = await openDialogFromHero(page);
    await fillValid(dialog);
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByRole('heading', { name: 'Request received' })).toBeVisible();
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      company: 'Example Corp',
      consent: true,
      botcheck: '',
    });
  });

  test('keeps entered data on failure and succeeds on retry', async ({ page }) => {
    await mockEndpoint(page, 500);
    const { dialog } = await openDialogFromHero(page);
    await fillValid(dialog);
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByRole('alert')).toContainText('could not be sent');
    await expect(dialog.getByLabel('Full name')).toHaveValue('Alex Morgan');

    await mockEndpoint(page, 200);
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByRole('heading', { name: 'Request received' })).toBeVisible();
  });

  test('honeypot submissions are not sent', async ({ page }) => {
    const calls = await mockEndpoint(page, 200);
    const { dialog } = await openDialogFromHero(page);
    await fillValid(dialog);
    await dialog.locator('input[name="botcheck"]').evaluate((el) => ((el as HTMLInputElement).value = 'spam'));
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByRole('heading', { name: 'Request received' })).toBeVisible();
    expect(calls).toHaveLength(0);
  });

  test('service detail CTA pre-selects that service', async ({ page }) => {
    await page.goto('/services/cloud-cost-optimization');
    await page.locator('section').first().getByRole('link', { name: 'Book a Strategy Consultation' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel('Service needed')).toHaveValue('Cloud Infrastructure Cost Optimization');
  });

  test('contact page form works standalone and honours ?service=', async ({ page }) => {
    await page.goto('/contact?service=enterprise-ai-integration');
    const form = page.getByRole('main');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(form.getByLabel('Service needed')).toHaveValue('Intelligent Enterprise AI Integration & Automation');
  });

  test('privacy page is published', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy Notice' })).toBeVisible();
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`open dialog and contact page have no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, '/', theme);
      await page.locator('#hero').getByRole('link', { name: 'Book a Strategy Consultation' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expectNoA11yViolations(page);
      await gotoWithTheme(page, '/contact', theme);
      await expectNoA11yViolations(page);
    });
  }
});

test.describe('US3 — without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('CTAs link to the contact page, whose form posts to the endpoint', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('#hero').getByRole('link', { name: 'Book a Strategy Consultation' });
    await expect(cta).toHaveAttribute('href', '/contact');
    await page.goto('/contact');
    await expect(page.locator('main form')).toHaveAttribute('action', /\/submit$/);
    await expect(page.locator('main form')).toHaveAttribute('method', /post/i);
  });
});

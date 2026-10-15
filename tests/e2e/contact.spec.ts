import type { Page, Route } from '@playwright/test';
import { test, expect } from './fixtures';
import { published } from './catalog';

// Menu order follows the pillar order used by getPublishedServices() (managed, cloud-devops, web-saas, ai).
const PILLAR_ORDER = ['managed', 'cloud-devops', 'web-saas', 'ai'];
const publishedNamesInPillarOrder = [...published]
  .sort((a, b) => PILLAR_ORDER.indexOf(a.pillar) - PILLAR_ORDER.indexOf(b.pillar) || a.order - b.order)
  .map((s) => s.name);

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

/** Every consultation CTA is a plain link to /contact (no dialog); the hero CTA takes the visitor there. */
async function openContactFromHero(page: Page) {
  await page.goto('/');
  await page.locator('#hero').getByRole('link', { name: 'Book a Strategy Consultation' }).click();
  await expect(page).toHaveURL(/\/contact\/?$/);
  const form = page.getByRole('main');
  await expect(form.getByLabel('Full name')).toBeVisible();
  return { form };
}

async function fillValid(scope: ReturnType<Page['getByRole']>) {
  await scope.getByLabel('Full name').fill('Alex Morgan');
  await scope.getByLabel('Email address').fill('alex.morgan@example.com');
  await scope.getByLabel('Company name').fill('Example Corp');
  await scope.getByLabel('Phone number (optional)').fill('+1 555 010 0000');
  await scope.getByRole('combobox', { name: 'Service needed' }).click();
  await scope.getByRole('option', { name: 'Cloud Migration & Modernisation' }).click();
  await scope.getByRole('combobox', { name: 'Estimated engagement size (optional)' }).click();
  await scope.getByRole('listbox', { name: 'Estimated engagement size (optional)' }).getByRole('option').nth(2).click();
  await scope
    .getByLabel('Project overview & requirements')
    .fill('We need a zero-downtime migration of our production workloads to Kubernetes.');
  await scope.getByLabel(/I agree to ZanamTech processing my details/).check();
}

test.describe('US3 — Contact page & lead submission', () => {
  test('consultation CTAs are links to /contact and no dialog exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero').getByRole('link', { name: 'Book a Strategy Consultation' })).toHaveAttribute(
      'href',
      '/contact',
    );
    // Desktop bar and mobile drawer CTAs (one of them is hidden at any width).
    const headerCtas = await page
      .locator('header a', { hasText: 'Book a Strategy Consultation' })
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(headerCtas).toEqual(['/contact', '/contact']);
    await expect(page.locator('footer').getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute(
      'href',
      '/contact',
    );
    await expect(page.locator('dialog')).toHaveCount(0);
  });

  test('"Write to" email line has a space before the address', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('main')).toContainText('Write to contact@zanamtech.com');
  });

  test('shows inline errors for invalid input and focuses the first invalid field', async ({ page }) => {
    const calls = await mockEndpoint(page, 200);
    const { form: dialog } = await openContactFromHero(page);
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
    const { form: dialog } = await openContactFromHero(page);
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
    const { form: dialog } = await openContactFromHero(page);
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
    const { form: dialog } = await openContactFromHero(page);
    await fillValid(dialog);
    await dialog.locator('input[name="botcheck"]').evaluate((el) => ((el as HTMLInputElement).value = 'spam'));
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByRole('heading', { name: 'Request received' })).toBeVisible();
    expect(calls).toHaveLength(0);
  });

  test('service detail CTAs link to /contact?service=<slug> and preselect that service', async ({ page }) => {
    await page.goto('/services/cloud-cost-optimization');
    const heroCta = page.locator('section').first().getByRole('link', { name: 'Book a Strategy Consultation' });
    await expect(heroCta).toHaveAttribute('href', '/contact?service=cloud-cost-optimization');
    await expect(page.locator('#cta-band-title').locator('..').getByRole('link')).toHaveAttribute(
      'href',
      '/contact?service=cloud-cost-optimization',
    );
    await heroCta.click();
    await expect(page.getByRole('main').getByRole('combobox', { name: 'Service needed' })).toHaveText(
      'Cloud Cost Optimisation',
    );
  });

  test('unknown ?service= values are ignored and nothing persists to the next visit', async ({ page }) => {
    await page.goto('/contact?service=not-a-service');
    await expect(page.getByRole('main').getByRole('combobox', { name: 'Service needed' })).toHaveText(
      'Select a service',
    );
    await page.goto('/contact?service=ai-assistants-company-data');
    await page.goto('/contact');
    await expect(page.getByRole('main').getByRole('combobox', { name: 'Service needed' })).toHaveText(
      'Select a service',
    );
  });

  test('contact page form works standalone and honours ?service=', async ({ page }) => {
    await page.goto('/contact?service=ai-assistants-company-data');
    const form = page.getByRole('main');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(form.getByRole('combobox', { name: 'Service needed' })).toHaveText('AI Assistants on Company Data');
  });

  test('qualifying fields: keyboard selection, payload values and "Not specified" defaults', async ({ page }) => {
    const calls = await mockEndpoint(page, 200);
    const { form: dialog } = await openContactFromHero(page);
    await fillValid(dialog);

    // Keyboard only: open with ArrowDown, move, choose with Enter (APG select-only combobox).
    const region = dialog.getByRole('combobox', { name: 'Region (optional)' });
    await region.focus();
    await page.keyboard.press('ArrowDown');
    await expect(dialog.getByRole('listbox', { name: 'Region (optional)' })).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(region).toHaveText('United Kingdom');

    await dialog.getByRole('combobox', { name: 'Cloud platform (optional)' }).click();
    for (const option of ['AWS', 'Azure', 'Google Cloud', 'Multi-cloud', 'Other']) {
      await expect(
        dialog
          .getByRole('listbox', { name: 'Cloud platform (optional)' })
          .getByRole('option', { name: option, exact: true }),
      ).toBeVisible();
    }
    await dialog
      .getByRole('listbox', { name: 'Cloud platform (optional)' })
      .getByRole('option', { name: 'Multi-cloud', exact: true })
      .click();

    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(dialog.getByRole('heading', { name: 'Request received' })).toBeVisible();
    expect(calls[0]).toMatchObject({
      region: 'United Kingdom',
      cloudPlatform: 'Multi-cloud',
      companySize: 'Not specified',
    });
  });

  test('service options include every published service, Agency partnership and Other', async ({ page }) => {
    const { form: dialog } = await openContactFromHero(page);
    await dialog.getByRole('combobox', { name: 'Service needed' }).click();
    const options = await dialog
      .locator('#page-service-listbox [role="option"]')
      .evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.value));
    expect(options).toEqual([...publishedNamesInPillarOrder, 'Agency partnership', 'Other / Not sure yet']);
  });

  test('privacy page is published', async ({ page }) => {
    const response = await page.goto('/privacy');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy Notice' })).toBeVisible();
  });
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

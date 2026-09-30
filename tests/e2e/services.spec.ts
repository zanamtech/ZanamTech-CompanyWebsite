import { test, expect, gotoWithTheme, expectNoA11yViolations } from './fixtures';

const SERVICES = [
  'Cloud Migration & Containerization',
  'Enterprise Security & WAF Hardening',
  'High Availability & Disaster Recovery',
  'CI/CD Pipeline & Workflow Automation',
  'Active System Observability & Monitoring',
  'Cloud Infrastructure Cost Optimization',
  'Custom Full-Stack Web App Development',
  'Intelligent Enterprise AI Integration & Automation',
  '24/7 Managed Infrastructure & Incident Resolution',
];

const FOOTNOTE = 'Outcomes vary by environment; SLA commitments are defined per Statement of Work.';

test.describe('US2 — Services', () => {
  test('services index lists all nine services, grouped', async ({ page }) => {
    await page.goto('/services');
    const names = await page.locator('[data-service-card] h3').allInnerTexts();
    expect(names.map((n) => n.trim()).sort()).toEqual([...SERVICES].sort());
    await expect(page.getByRole('heading', { level: 2, name: 'Cloud & Infrastructure' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Engineering & AI' })).toBeVisible();
  });

  test('home page shows the nine services in canonical order', async ({ page }) => {
    await page.goto('/');
    const names = await page.locator('#services [data-service-card] h3').allInnerTexts();
    expect(names.map((n) => n.trim())).toEqual(SERVICES);
  });

  test('every service detail page renders capabilities, outcome, footnote and two scenarios', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('#services [data-service-card] h3 a').evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).getAttribute('href')),
    );
    expect(hrefs).toHaveLength(9);

    for (const [i, href] of hrefs.entries()) {
      const response = await page.goto(href!);
      expect(response?.status(), href!).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(SERVICES[i]);
      await expect(page.getByRole('heading', { name: 'Core capabilities' })).toBeVisible();
      await expect(page.getByText('Target outcome', { exact: true })).toBeVisible();
      await expect(page.getByText(FOOTNOTE).first()).toBeVisible();
      await expect(page.locator('[data-scenario]')).toHaveCount(2);
      await expect(page.getByText(/Representative Engagement Scenario/).first()).toBeVisible();
    }
  });

  test('any service is reachable from home in two clicks', async ({ page }) => {
    await page.goto('/');
    await page.locator('#services [data-service-card] h3 a').nth(4).click();
    await expect(page).toHaveURL(/\/services\/observability-monitoring\/?$/);
  });

  test('desktop services menu opens, lists nine services and closes on Escape', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Mega-menu is desktop-only');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Show services menu' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const menu = page.locator('#services-menu');
    await expect(menu).toBeVisible();
    await expect(menu.locator('a[href^="/services/"]')).toHaveCount(9);
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const path of ['/services', '/services/enterprise-security-waf-hardening']) {
      test(`${path} has no WCAG 2.1 AA violations (${theme})`, async ({ page }) => {
        await gotoWithTheme(page, path, theme);
        await expectNoA11yViolations(page);
      });
    }
  }
});

test.describe('US6 — Roadmap', () => {
  const ROADMAP = 'Advanced Agentic AI Workflows & Dedicated LLMOps';

  test('roadmap item is shown below the grid, labelled In Development, with no purchase CTA', async ({ page }) => {
    await page.goto('/services');
    const card = page.locator('[data-roadmap]');
    await expect(card).toHaveCount(1);
    await expect(card.getByRole('heading', { name: ROADMAP })).toBeVisible();
    await expect(card.getByText('In Development', { exact: true })).toBeVisible();
    await expect(card.getByRole('link', { name: /consultation|proposal/i })).toHaveCount(0);
    await expect(card.locator('[data-contact-cta]')).toHaveCount(0);
  });

  test('roadmap item is excluded from the core grid, menus and lead options', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('[data-service-card]')).toHaveCount(9);
    await expect(page.locator('#services-menu')).not.toContainText(ROADMAP);
    await expect(page.locator('footer')).not.toContainText(ROADMAP);
    const options = await page.locator('#contact-dialog select[name="service"] option').allInnerTexts();
    expect(options).not.toContain(ROADMAP);
    const response = await page.request.get('/services/agentic-ai-llmops');
    expect(response.status()).toBe(404);
  });
});

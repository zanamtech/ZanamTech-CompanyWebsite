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
    const names = await page.locator('#core-services [data-service-card] h3').allInnerTexts();
    expect(names.map((n) => n.trim())).toEqual(SERVICES);
  });

  test('every service detail page renders capabilities, outcome, footnote and two scenarios', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('#core-services [data-service-card] h3 a').evaluateAll((els) =>
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
    await page.locator('#core-services [data-service-card] h3 a').nth(4).click();
    await expect(page).toHaveURL(/\/services\/observability-monitoring\/?$/);
  });

  test.describe('desktop services menu', () => {
    test.beforeEach(({}, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Mega-menu is desktop-only');
    });

    const servicesLink = (page: import('@playwright/test').Page) =>
      page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Services', exact: true });

    test('opens on hover, lists nine services, and closes when the pointer leaves', async ({ page }) => {
      await page.goto('/');
      const menu = page.locator('#services-menu');
      await servicesLink(page).hover();
      await expect(menu).toBeVisible();
      await expect(menu.locator('a[href^="/services/"]')).toHaveCount(9);
      await page.mouse.move(700, 600); // well below the header and panel
      await expect(menu).toBeHidden();
    });

    test('stays open while the pointer crosses the gap from the trigger to the panel', async ({ page }) => {
      await page.goto('/');
      const link = servicesLink(page);
      const menu = page.locator('#services-menu');
      await link.hover();
      await expect(menu).toBeVisible();
      const linkBox = (await link.boundingBox())!;
      const panelBox = (await menu.boundingBox())!;
      // Move straight down from the trigger, through the header gap, into the panel in small steps.
      const x = linkBox.x + linkBox.width / 2;
      await page.mouse.move(x, panelBox.y + 40, { steps: 12 });
      await expect(menu).toBeVisible();
      await menu.getByRole('link', { name: 'Cloud Infrastructure Cost Optimization' }).click();
      await expect(page).toHaveURL(/\/services\/cloud-cost-optimization\/?$/);
    });

    test('clicking "Services" navigates to the services page', async ({ page }) => {
      await page.goto('/');
      await servicesLink(page).click();
      await expect(page).toHaveURL(/\/services\/?$/);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Enterprise engineering services');
    });

    test('is keyboard accessible: focus opens, Tab enters the panel, Escape closes and restores focus', async ({ page }) => {
      await page.goto('/');
      const link = servicesLink(page);
      const menu = page.locator('#services-menu');
      await link.focus();
      await expect(menu).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(menu.getByRole('link', { name: 'View all services' })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(link).toBeFocused();
    });

    test('Services text and chevron form one control with tight spacing', async ({ page }) => {
      await page.goto('/');
      const link = servicesLink(page);
      await expect(link.locator('svg')).toHaveCount(1);
      expect(await link.evaluate((el) => getComputedStyle(el).columnGap)).toBe('6px');
      await expect(page.locator('header button[aria-controls="services-menu"]')).toHaveCount(0);
    });
  });

  test('floating header bar is centred and the logo sits inside its padding', async ({ page }) => {
    await page.goto('/services');
    const header = (await page.locator('header').boundingBox())!; // full-width fixed wrapper (excludes any scrollbar gutter)
    const bar = (await page.locator('header > div').boundingBox())!;
    const logo = (await page.locator('header a[aria-label="ZanamTech home"] img').boundingBox())!;
    expect(Math.abs(bar.x - header.x - (header.x + header.width - bar.x - bar.width))).toBeLessThanOrEqual(1);
    const inset = logo.x - bar.x;
    expect(inset).toBeGreaterThanOrEqual(15);
    expect(inset).toBeLessThanOrEqual(26);
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

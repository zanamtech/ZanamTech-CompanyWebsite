import { test, expect, gotoWithTheme, expectNoA11yViolations, revealAll } from './fixtures';

import { bySlug, published, publishedNames, RESULTS_FOOTNOTE } from './catalog';

test.describe('US2 — Services', () => {
  test('services index lists every published service, grouped', async ({ page }) => {
    await page.goto('/services');
    const names = await page.locator('[data-service-card] h3').allInnerTexts();
    expect(names.map((n) => n.trim()).sort()).toEqual([...publishedNames].sort());
    for (const pillar of [
      'Managed Cloud & DevOps',
      'Cloud & DevOps Engineering',
      'Web & SaaS Engineering',
      'Practical AI & Automation',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name: pillar, exact: true })).toBeVisible();
    }
    await expect(page.locator('#ai')).toBeAttached(); // /services#ai is the redirect target for the retired roadmap URL
  });

  test('home pillar grid lists every published service in canonical order', async ({ page }) => {
    await page.goto('/');
    // Each service once, in canonical order (the Managed card's included items all link to the flagship).
    const hrefs = await page
      .locator('#core-services [data-pillar] a[href^="/services/"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect([...new Set(hrefs)]).toEqual(published.map((s) => `/services/${s.slug}`));
  });

  test('every service detail page renders capabilities, outcome, footnote and its scenarios', async ({ page }) => {
    await page.goto('/');
    const hrefs = [
      ...new Set(
        await page
          .locator('#core-services [data-pillar] a[href^="/services/"]')
          .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).getAttribute('href'))),
      ),
    ];
    expect(hrefs).toHaveLength(published.length);

    for (const [i, href] of hrefs.entries()) {
      const service = published[i];
      const response = await page.goto(href!);
      expect(response?.status(), href!).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(service.name);
      await expect(
        page.getByRole('heading', { name: service.flagship ? 'What the service covers' : 'Core capabilities' }),
      ).toBeVisible();
      await expect(page.getByRole('heading', { name: 'What you get' })).toBeVisible();
      await expect(page.getByText('Outcome', { exact: true }).first()).toBeVisible();
      const hasReal = service.scenarios.some((s) => s.kind === 'real');
      // The past-engagements footnote appears only where a real result is shown.
      await expect(page.getByText(RESULTS_FOOTNOTE)).toHaveCount(hasReal ? 2 : 0);
      await expect(page.locator('[data-scenario]')).toHaveCount(service.scenarios.length);
      const examples = service.scenarios.filter((s) => s.kind === 'illustrative').length;
      await expect(page.locator('[data-scenario]').getByText('Example engagement', { exact: true })).toHaveCount(
        examples,
      );
      await expect(page.getByText(/Representative Engagement Scenario/)).toHaveCount(0);
    }
  });

  test('any service is reachable from home in two clicks', async ({ page }) => {
    await page.goto('/');
    await page.locator(`#core-services [data-pillar] a[href="/services/${published[4].slug}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/services/${published[4].slug}/?$`));
  });

  test.describe('desktop services menu', () => {
    test.beforeEach(({}, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Mega-menu is desktop-only');
    });

    const servicesLink = (page: import('@playwright/test').Page) =>
      page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Services', exact: true });

    test('opens on hover, lists every published service, and closes when the pointer leaves', async ({ page }) => {
      await page.goto('/');
      const menu = page.locator('#services-menu');
      await servicesLink(page).hover();
      await expect(menu).toBeVisible();
      await expect(menu.locator('a[href^="/services/"]')).toHaveCount(published.length);
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
      await menu.getByRole('link', { name: bySlug('cloud-cost-optimization').name }).click();
      await expect(page).toHaveURL(/\/services\/cloud-cost-optimization\/?$/);
    });

    test('clicking "Services" navigates to the services page', async ({ page }) => {
      await page.goto('/');
      await servicesLink(page).click();
      await expect(page).toHaveURL(/\/services\/?$/);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Enterprise engineering services');
    });

    test('is keyboard accessible: focus opens, Tab enters the panel, Escape closes and restores focus', async ({
      page,
    }) => {
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
        await revealAll(page);
        await expectNoA11yViolations(page);
      });
    }
  }
});

test.describe('Retired services', () => {
  const RETIRED = ['agentic-ai-llmops', 'managed-infrastructure-24-7', 'enterprise-ai-integration'];

  test('no roadmap section and no "In Development" label on /services', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('[data-roadmap]')).toHaveCount(0);
    await expect(page.getByText('In Development')).toHaveCount(0);
    await expect(page.getByText('What we are building next')).toHaveCount(0);
  });

  for (const slug of RETIRED) {
    test(`/services/${slug} is no longer a page (nginx redirects it in production)`, async ({ page }) => {
      const response = await page.request.get(`/services/${slug}`);
      expect(response.status()).toBe(404);
    });
  }
});

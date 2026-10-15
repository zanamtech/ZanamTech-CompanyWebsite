import { test, expect } from './fixtures';
import { published } from './catalog';

test.describe('Focus rings: keyboard only', () => {
  test('a mouse click leaves no ring; Tab brings it back', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop pointer + keyboard');
    await page.goto('/');
    const logo = page.locator('header a[aria-label="ZanamTech home"]');
    await logo.click();
    await page.waitForLoadState('load');
    // The client-side navigation then moves focus to <main>; wait for it so Tab starts from there.
    await expect(page.locator('main#main')).toBeFocused();
    const outlineAfterClick = await page.evaluate(
      () => getComputedStyle(document.activeElement as Element).outlineStyle,
    );
    expect(outlineAfterClick).toBe('none');

    await page.keyboard.press('Tab');
    const outlineAfterTab = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle);
    expect(outlineAfterTab).toBe('solid');
  });
});

test.describe('Services mega-menu (desktop)', () => {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [1024, 768],
  ] as const) {
    test(`balanced and short at ${width}px`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Desktop menu');
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page
        .locator('header nav[aria-label="Primary"]')
        .getByRole('link', { name: 'Services', exact: true })
        .hover();
      const menu = page.locator('#services-menu');
      await expect(menu).toBeVisible();
      const box = (await menu.boundingBox())!;
      expect(box.height, 'menu height').toBeLessThanOrEqual(height * 0.7);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      // Flagship first, shown like every other service (no badge, no highlighted tile); no list taller than four items.
      await expect(menu.locator('[data-menu-pillar]').first()).toHaveAttribute('data-menu-pillar', 'managed');
      await expect(menu.locator('a[href^="/services/"]').first()).toHaveAttribute(
        'href',
        '/services/managed-cloud-devops',
      );
      await expect(menu.getByText('Flagship', { exact: true })).toHaveCount(0);
      const [flagshipLink, otherLink] = await Promise.all(
        ['/services/managed-cloud-devops', '/services/observability-monitoring'].map((href) =>
          menu
            .locator(`a[href="${href}"]`)
            .evaluate((a) => `${a.className}|${getComputedStyle(a.parentElement!.parentElement!).borderTopWidth}`),
        ),
      );
      expect(flagshipLink).toBe(otherLink);
      for (const count of await menu
        .locator('ul')
        .evaluateAll((uls) => uls.map((u) => u.querySelectorAll('a[href^="/services/"]').length))) {
        expect(count).toBeLessThanOrEqual(4);
      }
      await expect(menu.locator('a[href^="/services/"]')).toHaveCount(published.length);
    });
  }

  test('the header CTA fits at 1024px with Insights shown', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop header');
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    const nav = page.locator('header nav[aria-label="Primary"]');
    await expect(nav.getByRole('link', { name: 'Insights', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Managed Services' })).toHaveCount(0);
    const cta = (await page
      .locator('header')
      .getByRole('link', { name: 'Book a Strategy Consultation' })
      .first()
      .boundingBox())!;
    expect(cta.x + cta.width).toBeLessThanOrEqual(1024 - 16);
    expect(cta.height).toBeLessThanOrEqual(44);
  });
});

test.describe('Mobile menu: expandable Services', () => {
  test('Services expands to four collapsed pillar groups; works by touch and keyboard', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Phone drawer');
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const drawer = page.locator('#mobile-nav');
    const toggle = drawer.getByRole('button', { name: 'Services', exact: true });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer.locator('#mobile-services')).toBeHidden();

    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const groups = drawer.locator('[data-mobile-pillar]');
    await expect(groups).toHaveCount(4);
    for (const open of await groups.evaluateAll((els) => els.map((e) => (e as HTMLDetailsElement).open)))
      expect(open).toBe(false);

    // Keyboard: Enter on a pillar summary opens it and reveals its services.
    const cloud = drawer.locator('[data-mobile-pillar="cloud-devops"]');
    await cloud.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(cloud).toHaveAttribute('open', '');
    await expect(cloud.getByRole('link').first()).toBeVisible();

    // The flagship is listed like any other service in the drawer too.
    await expect(drawer.getByText('Flagship', { exact: true })).toHaveCount(0);

    // Keyboard on the Services toggle collapses it again.
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Footer', () => {
  test('never says "remote-first" at any width', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('footer').evaluate((el) => el.textContent ?? '')).not.toMatch(/remote-first/i);
  });

  test('fits within one screen at 1440x900 with every service listed', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop footer');
    await page.goto('/');
    const footer = page.locator('footer');
    const box = (await footer.boundingBox())!;
    expect(box.height).toBeLessThanOrEqual(900);
    const services = footer.locator('[data-footer-services] a[href^="/services/"]');
    await expect(services).toHaveCount(published.length);
    await expect(footer.locator('[data-footer-pillar]').first()).toHaveAttribute('data-footer-pillar', 'managed');
  });

  for (const width of [1440, 1024, 768]) {
    test(`Company links form one row under the services, which span to the right edge, at ${width}px`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Desktop and tablet footer');
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const footer = page.locator('footer');
      const company = footer.locator('[data-footer-company]');
      await expect(company.getByRole('heading', { name: 'Company' })).toBeVisible();
      const tops = await company
        .getByRole('link')
        .evaluateAll((links) => links.map((a) => Math.round(a.getBoundingClientRect().top)));
      expect(new Set(tops).size, 'single row').toBe(1);
      const services = (await footer.locator('[data-footer-services]').boundingBox())!;
      const container = (await footer.locator('.container-page').first().boundingBox())!;
      // No separate Company column: the service groups reach the container's right padding edge.
      expect(container.x + container.width - (services.x + services.width)).toBeLessThanOrEqual(40);
      const companyBox = (await company.boundingBox())!;
      expect(companyBox.y).toBeGreaterThan(services.y + services.height);
      if (width >= 1280) {
        // At xl the row sits on the same line as the email in the brand column.
        const email = (await footer.locator('a[href^="mailto:"]').boundingBox())!;
        expect(Math.abs(companyBox.y + companyBox.height - (email.y + email.height))).toBeLessThanOrEqual(2);
      }
    });
  }

  for (const width of [1440, 1024]) {
    test(`service columns: equal gaps, same first-link height, even item spacing at ${width}px`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Desktop and tablet footer');
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const lists = await page.locator('footer [data-footer-services] ul').evaluateAll((uls) =>
        uls.map((ul) => {
          const r = ul.getBoundingClientRect();
          const links = [...ul.querySelectorAll('a')].map((a) => a.getBoundingClientRect());
          return {
            left: Math.round(r.left),
            right: Math.round(r.right),
            firstTop: Math.round(links[0].top),
            gaps: links.slice(1).map((b, i) => Math.round(b.top - links[i].bottom)),
            group: ul.closest('[data-footer-pillar]')!.getAttribute('data-footer-pillar'),
          };
        }),
      );
      // One list per column, first rows level: the first list of each column (the AI list sits under Managed).
      const columns = lists.filter((l) => l.group !== 'ai');
      expect(new Set(columns.map((c) => c.firstTop)).size, 'first links start at the same height').toBe(1);
      const gaps = columns.slice(1).map((c, i) => c.left - columns[i].right);
      expect(new Set(gaps).size, `equal column gaps: ${gaps.join(',')}`).toBe(1);
      expect(new Set(lists.flatMap((l) => l.gaps)).size, 'even spacing between items').toBe(1);
    });
  }

  test('on phones the pillar groups are collapsed and expand on tap', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Phone footer');
    await page.goto('/');
    const groups = page.locator('footer [data-footer-pillar-mobile]');
    await expect(groups).toHaveCount(4);
    for (const open of await groups.evaluateAll((els) => els.map((e) => (e as HTMLDetailsElement).open)))
      expect(open).toBe(false);
    await groups.first().locator('summary').scrollIntoViewIfNeeded();
    await groups.first().locator('summary').tap();
    await expect(groups.first()).toHaveAttribute('open', '');
    await expect(page.locator('footer').getByText('ZanamTech · Cloud, DevOps & AI engineering')).toBeVisible();
    await expect(page.locator('footer').getByText('Cloud, DevOps & AI engineering', { exact: true })).toBeVisible();
  });
});

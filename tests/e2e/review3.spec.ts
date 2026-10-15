import { test, expect } from './fixtures';

// Fix round from video review #3 (2026-10-14).

test.describe('External links', () => {
  test.beforeEach(async ({ context }) => {
    // Never reach the real network: answer LinkedIn with an empty page.
    await context.route('https://www.linkedin.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>LinkedIn</title>' }),
    );
  });

  for (const [path, selector] of [
    ['/about', '[data-founder-linkedin]'],
    ['/', 'footer [data-footer-linkedin]'],
  ] as const) {
    test(`${selector} on ${path} opens a new page; the site tab stays put`, async ({ page }) => {
      await page.goto(path);
      const link = page.locator(selector);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      const before = page.url();
      const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
      await expect(popup).toHaveURL(/linkedin\.com/);
      expect(page.url()).toBe(before);
    });
  }

  test('every link to another origin opens in a new tab with noopener noreferrer', async ({ page }) => {
    for (const path of ['/', '/about', '/insights/cloud-cost-checklist']) {
      await page.goto(path);
      const external = await page
        .locator('a[href^="http"]')
        .evaluateAll((els) =>
          els
            .filter((a) => new URL((a as HTMLAnchorElement).href).origin !== location.origin)
            .map((a) => ({ target: a.getAttribute('target'), rel: a.getAttribute('rel') })),
        );
      expect(external.length, path).toBeGreaterThan(0);
      for (const a of external) {
        expect(a.target, path).toBe('_blank');
        expect(a.rel, path).toContain('noopener');
        expect(a.rel, path).toContain('noreferrer');
      }
    }
  });
});

test.describe('Page transitions and focus', () => {
  test('old page fades out fully before the new one fades in (no overlap)', { tag: '@desktop' }, async ({ page }) => {
    await page.goto('/about');
    // Record the animations of the page's view transition once it is ready.
    await page.evaluate(() => {
      const w = window as unknown as { __vt: { pseudo: string; delay: number; duration: number }[] };
      w.__vt = [];
      const start = document.startViewTransition.bind(document);
      document.startViewTransition = ((...args: Parameters<typeof start>) => {
        const t = start(...args);
        void t.ready.then(() => {
          for (const anim of document.getAnimations()) {
            const effect = anim.effect as KeyframeEffect | null;
            if (!effect?.pseudoElement) continue;
            const timing = effect.getTiming();
            w.__vt.push({
              pseudo: effect.pseudoElement,
              delay: Number(timing.delay),
              duration: Number(timing.duration),
            });
          }
        });
        return t;
      }) as typeof document.startViewTransition;
    });
    await page
      .locator('header nav[aria-label="Primary"]:not(#mobile-nav)')
      .getByRole('link', { name: 'How We Work' })
      .click();
    await expect(page).toHaveURL(/\/approach\/?$/);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __vt: unknown[] }).__vt.length))
      .toBeGreaterThan(0);
    const seen = await page.evaluate(
      () => (window as unknown as { __vt: { pseudo: string; delay: number; duration: number }[] }).__vt,
    );
    const old = seen.find((s) => s.pseudo === '::view-transition-old(root)');
    const next = seen.find((s) => s.pseudo === '::view-transition-new(root)');
    expect(old, 'old-page animation').toBeTruthy();
    expect(next, 'new-page animation').toBeTruthy();
    expect(old!.duration).toBe(120);
    expect(next!.delay).toBeGreaterThanOrEqual(old!.duration);
    expect(next!.duration).toBe(180);
  });

  test(
    'after a client-side navigation focus is on <main>, with no ring on the clicked link',
    { tag: '@desktop' },
    async ({ page }) => {
      await page.goto('/');
      const about = page
        .locator('header nav[aria-label="Primary"]:not(#mobile-nav)')
        .getByRole('link', { name: 'About' });
      await about.click();
      await expect(page).toHaveURL(/\/about\/?$/);
      await expect(page.locator('main#main')).toBeFocused();
      await expect(page.locator('html')).toHaveAttribute('data-modality', 'pointer');
      await expect(about).toHaveCSS('outline-style', 'none');
    },
  );
});

test.describe('Header', () => {
  test('a full-width backdrop covers the strip above and around the bar once scrolled', async ({ page }) => {
    await page.goto('/approach');
    const backdrop = page.locator('[data-header-backdrop]');
    await expect(backdrop).toHaveCSS('opacity', '0');
    await page.mouse.wheel(0, 800);
    await expect(backdrop).toHaveCSS('opacity', '1');
    const box = (await backdrop.boundingBox())!;
    const bar = (await page.locator('header .header-bar').boundingBox())!;
    expect(box.y).toBe(0);
    expect(Math.round(box.y + box.height)).toBe(Math.round(bar.y + bar.height));
    // Full width of the fixed header layer (the viewport minus any classic scrollbar).
    expect(Math.round(box.x)).toBe(0);
    expect(Math.round(box.width)).toBe(
      await page.evaluate(() => Math.round(document.querySelector('header')!.getBoundingClientRect().width)),
    );
    expect(box.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 20);
  });

  test('active page: accent colour only, no underline or indicator', { tag: '@desktop' }, async ({ page }) => {
    await page.goto('/approach');
    const links = page.locator('[data-nav-link="desktop"]');
    for (const deco of await links.evaluateAll((els) => els.map((e) => getComputedStyle(e).textDecorationLine)))
      expect(deco).toBe('none');
    const accent = await links.evaluateAll((els) =>
      els.filter((e) => e.classList.contains('text-accent')).map((e) => e.textContent?.trim()),
    );
    expect(accent).toEqual(['How We Work']);
  });

  test(
    'a mega-menu link to the current page closes the menu and scrolls to the top without navigating',
    { tag: '@desktop' },
    async ({ page }) => {
      await page.goto('/services/cloud-cost-optimization');
      await page.evaluate(() => window.scrollTo(0, 900));
      await page.evaluate(() => ((window as unknown as { __marker: boolean }).__marker = true));
      await page
        .locator('header nav[aria-label="Primary"]:not(#mobile-nav)')
        .getByRole('link', { name: 'Services', exact: true })
        .hover();
      const menu = page.locator('#services-menu');
      await expect(menu).toBeVisible();
      await menu.getByRole('link', { name: 'Cloud Cost Optimisation' }).click();
      await expect(menu).toBeHidden();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      expect(await page.evaluate(() => (window as unknown as { __marker?: boolean }).__marker)).toBe(true);
    },
  );
});

test.describe('Home: "Low-risk ways to start" cards', () => {
  test('five compact cards with icon, name, duration and output, each linking to its offer', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-offer-card]');
    await expect(cards).toHaveCount(5);
    await expect(page.locator('#start-here')).toContainText(
      'Fixed scope, a clear written output, no long-term commitment.',
    );
    await expect(cards.first()).toContainText('Scorecard and prioritised backlog');
    for (const id of await cards.evaluateAll((els) => els.map((e) => e.getAttribute('data-offer-card')))) {
      await expect(page.locator(`[data-offer-card="${id}"]`)).toHaveAttribute('href', `/start-here#${id}`);
    }
  });

  for (const [width, rows] of [
    [1440, [5]],
    [1024, [3, 2]],
  ] as const) {
    test(
      `layout at ${width}px: rows of ${rows.join(' + ')}, second row centred`,
      { tag: '@desktop' },
      async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/');
        const boxes = await page
          .locator('[data-offer-card]')
          .evaluateAll((els) =>
            els
              .map((e) => e.getBoundingClientRect())
              .map((r) => ({ top: Math.round(r.top), left: r.left, right: r.right })),
          );
        const tops = [...new Set(boxes.map((b) => b.top))];
        expect(tops.map((t) => boxes.filter((b) => b.top === t).length)).toEqual([...rows]);
        if (tops.length === 2) {
          const centre = (t: number) => {
            const row = boxes.filter((b) => b.top === t);
            return (row[0].left + row.at(-1)!.right) / 2;
          };
          expect(Math.abs(centre(tops[0]) - centre(tops[1]))).toBeLessThanOrEqual(1);
        }
      },
    );
  }

  test(
    'phones: a horizontal scroll-snap row with part of the next card visible',
    { tag: '@mobile' },
    async ({ page }) => {
      await page.goto('/');
      const strip = page.locator('[data-offer-strip]');
      await expect(strip).toHaveCSS('scroll-snap-type', /x mandatory/);
      const { scrollWidth, clientWidth } = await strip.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
      expect(scrollWidth).toBeGreaterThan(clientWidth);
      const second = (await page.locator('[data-offer-card]').nth(1).boundingBox())!;
      expect(second.x).toBeLessThan(page.viewportSize()!.width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    },
  );
});

test.describe('About', () => {
  test('LinkedIn button: top-right level with the name from 768px, under the role on phones; capabilities 2 × 4 with "View all services"', async ({
    page,
  }, testInfo) => {
    await page.goto('/about');
    const card = page.locator('section[aria-labelledby="leadership-title"]');
    const name = (await card.getByRole('heading', { name: 'Mubashir Ahmed' }).boundingBox())!;
    const role = (await card.getByText('Founder & Lead Architect').boundingBox())!;
    const linkedin = page.locator('[data-founder-linkedin]');
    await expect(linkedin).toHaveText('LinkedIn');
    const box = (await linkedin.boundingBox())!;
    if (testInfo.project.name === 'desktop') {
      expect(box.y).toBeLessThan(name.y + name.height);
      expect(box.x).toBeGreaterThan(name.x + name.width);
      const text = (await card.locator('p', { hasText: 'Leads every ZanamTech engagement' }).boundingBox())!;
      expect(Math.round(box.x + box.width)).toBe(Math.round(text.x + text.width));
    } else {
      expect(box.y).toBeGreaterThan(role.y + role.height - 1);
      expect(Math.abs(box.x - role.x)).toBeLessThanOrEqual(1);
    }
    const lists = page.locator('section[aria-labelledby="capabilities-title"] ul');
    await expect(lists).toHaveCount(2);
    for (const n of await lists.evaluateAll((uls) => uls.map((ul) => ul.children.length)))
      expect(n).toBeLessThanOrEqual(4);
    await expect(page.locator('[data-view-all-services]')).toHaveAttribute('href', '/services');
  });
});

test.describe('Article "On this page"', () => {
  test(
    '14px muted links; the section being read is highlighted with aria-current',
    { tag: '@desktop' },
    async ({ page }) => {
      await page.goto('/insights/azure-environment-strategy');
      const links = page.locator('[data-article-toc] a');
      await expect(links.first()).toHaveCSS('font-size', '14px');
      await expect(links.first()).toHaveAttribute('aria-current', 'location');
      const third = await links.nth(2).getAttribute('href');
      await page
        .locator(third!)
        .evaluate((h) => window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - 120));
      await expect(links.nth(2)).toHaveAttribute('aria-current', 'location');
      await expect(page.locator('[data-article-toc] a[aria-current]')).toHaveCount(1);
    },
  );
});

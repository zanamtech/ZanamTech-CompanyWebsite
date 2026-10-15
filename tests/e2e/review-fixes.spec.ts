import { test, expect } from './fixtures';

// Fix round from the full-site video review (2026-10-14).

test.describe('Header and mega-menu', () => {
  test('the header bar is near-opaque in both themes', async ({ page }) => {
    await page.goto('/approach');
    const alpha = () =>
      page.locator('header .header-bar').evaluate((el) => {
        const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/)!;
        const parts = m[1].split(/[\s,/]+/).filter(Boolean);
        return parts.length > 3 ? Number(parts[3]) : 1;
      });
    expect(await alpha()).toBeGreaterThanOrEqual(0.85);
    await page.getByRole('button', { name: 'Dark theme' }).click();
    expect(await alpha()).toBeGreaterThanOrEqual(0.85);
  });

  test('the mega-menu closes as soon as a link inside it is chosen', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Mega-menu is desktop-only');
    await page.goto('/');
    await page
      .locator('header nav[aria-label="Primary"]:not(#mobile-nav)')
      .getByRole('link', { name: 'Services', exact: true })
      .hover();
    const menu = page.locator('#services-menu');
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Cloud Cost Optimisation' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/\/services\/cloud-cost-optimization\/?$/);
  });
});

test.describe('Reveal: grids appear as one group', () => {
  test.use({ hasTouch: false });

  test('all four "How we engage" cards are visible within a second of the grid entering', async ({ page }) => {
    await page.goto('/');
    await page.locator('#process ol').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1_200);
    const opacities = await page
      .locator('#process [data-phase] > .glass')
      .evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));
    expect(opacities).toEqual([1, 1, 1, 1]);
  });
});

test.describe('Home', () => {
  test('entry offers are a compact strip linking to /start-here; full cards live only there', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#start-here [data-offer]')).toHaveCount(0);
    await expect(page.locator('[data-offer-strip] a')).toHaveCount(5);
    await expect(page.locator('#start-here').getByRole('link', { name: 'See all entry offers' })).toHaveAttribute(
      'href',
      '/start-here',
    );
    await page.goto('/services');
    await expect(page.locator('[data-offer-strip] a')).toHaveCount(5);
  });

  test('marquee: no "Claude Code"; "Windows Server" instead of "Windows"', async ({ page }) => {
    await page.goto('/');
    const marquee = await page.locator('main').innerText();
    expect(marquee).not.toContain('Claude Code');
    expect(marquee).toContain('Windows Server');
  });

  test('positioning chips only in the hero, never in the footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).not.toContainText('Zero-trust security');
  });

  test('footer: company LinkedIn icon beside the email, opening in a new tab; listed in Organization sameAs', async ({
    page,
  }) => {
    await page.goto('/');
    const link = page.locator('footer [data-footer-linkedin]');
    await expect(link).toHaveAttribute('href', 'https://www.linkedin.com/company/zanamtech/');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(link).toHaveAttribute('aria-label', 'ZanamTech on LinkedIn');
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap(
      (t) => JSON.parse(t)['@graph'],
    );
    expect(ld.find((j) => j['@type'] === 'Organization')?.sameAs).toEqual([
      'https://www.linkedin.com/company/zanamtech/',
    ]);
  });
});

test.describe('5-card sets centre the second row on desktop', () => {
  for (const [path, item] of [
    ['/start-here', '[data-offer]'],
    ['/approach', '[data-model]'],
  ] as const) {
    test(`${path}: 3 + 2 with the second row centred`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'Desktop layout');
      await page.goto(path);
      const boxes = await page
        .locator(item)
        .evaluateAll((els) =>
          els
            .map((e) => e.getBoundingClientRect())
            .map((r) => ({ top: Math.round(r.top), left: r.left, right: r.right })),
        );
      const rows = [...new Set(boxes.map((b) => b.top))];
      expect(rows).toHaveLength(2);
      const first = boxes.filter((b) => b.top === rows[0]);
      const second = boxes.filter((b) => b.top === rows[1]);
      expect(first).toHaveLength(3);
      expect(second).toHaveLength(2);
      const centre = (bs: typeof boxes) => (bs[0].left + bs.at(-1)!.right) / 2;
      expect(Math.abs(centre(first) - centre(second))).toBeLessThanOrEqual(1);
    });
  }
});

test.describe('About', () => {
  test('founder card: photo, LinkedIn link in a new tab, no time-zone line; "At a glance" chips', async ({ page }) => {
    await page.goto('/about');
    const card = page.locator('section[aria-labelledby="leadership-title"]');
    await expect(card.locator('img[data-founder-photo]')).toBeVisible();
    const linkedin = card.locator('[data-founder-linkedin]');
    await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/mubashir-ahmed-088800174');
    await expect(linkedin).toHaveAttribute('target', '_blank');
    await expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(linkedin).toHaveAttribute('aria-label', 'Mubashir Ahmed on LinkedIn');
    const line = card.getByText(/^As your scope grows, delivery scales with vetted engineers/);
    await expect(line).toHaveCSS('font-size', '16px');
    await expect(card).not.toContainText('time-zone');
    await expect(page.getByText('What we stand for')).toHaveCount(0);
    const glance = page.locator('[data-at-a-glance]');
    await expect(glance.locator('dt')).toHaveText(['Clouds', 'Regions served', 'Engagement', 'Clients']);
    const chips = (n: number) => glance.locator('dd').nth(n).locator('li');
    await expect(chips(0)).toHaveText(['AWS', 'Azure', 'Google Cloud', 'Flexential', 'Liquid Web']);
    await expect(chips(1)).toHaveText([
      'United States',
      'Canada',
      'United Kingdom',
      'Europe',
      'Gulf Cooperation Council (GCC)',
      'Australia & New Zealand',
    ]);
    await expect(chips(2)).toHaveText([
      'Assessment',
      'Fixed-scope project',
      'Managed retainer',
      'Agency partnership',
      'Extended engineering capacity',
    ]);
    await expect(chips(3)).toHaveText([
      'B2B SaaS companies',
      'Software agencies',
      'Mid-market firms',
      'Enterprise teams',
    ]);
    await expect(page.getByRole('heading', { name: 'Pragmatic, enterprise-first' })).toBeVisible();
  });
});

test.describe('Insights article', () => {
  test('hero meta line, author JSON-LD and a reading layout without an empty right half', async ({
    page,
  }, testInfo) => {
    await page.goto('/insights');
    const href = await page.locator('[data-insight] a').first().getAttribute('href');
    await page.goto(href!);
    const meta = page.locator('[data-article-meta]');
    await expect(meta).toContainText(
      /By Mubashir Ahmed\s*·\s*Founder & Lead Architect\s*·\s*\d{1,2} \w+ \d{4}\s*·\s*\d+ min read/,
    );
    await expect(meta.getByRole('link', { name: 'Mubashir Ahmed' })).toHaveAttribute('href', '/about');
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const article = ld.flatMap((t) => JSON.parse(t)['@graph']).find((j) => j['@type'] === 'Article');
    expect(article?.author?.name).toBe('Mubashir Ahmed');
    if (testInfo.project.name === 'desktop') {
      await expect(page.locator('[data-article-toc]')).toBeVisible();
      const body = (await page.locator('main article').boundingBox())!;
      expect(body.width).toBeLessThanOrEqual(721);
    }
  });
});

test.describe('Trust and legal', () => {
  test('security.txt is never linked from the visible site; the security email stays', async ({ page }) => {
    for (const path of ['/', '/trust', '/privacy', '/terms', '/contact']) {
      await page.goto(path);
      await expect(page.locator('a[href*="security.txt"]'), path).toHaveCount(0);
    }
    await page.goto('/trust');
    await expect(page.locator('#reporting-issues').getByRole('link', { name: 'security@zanamtech.com' })).toBeVisible();
  });

  test('/privacy and /terms show "Last updated" under the title; /trust and /terms show the breadcrumb below the header', async ({
    page,
  }) => {
    for (const path of ['/privacy', '/terms']) {
      await page.goto(path);
      await expect(page.locator('[data-last-updated]')).toContainText(/^Last updated: \d{1,2} \w+ \d{4}$/);
    }
    for (const path of ['/trust', '/terms']) {
      await page.goto(path);
      const header = (await page.locator('header > div').boundingBox())!;
      const crumb = page.getByRole('navigation', { name: 'Breadcrumb' });
      await expect(crumb).toBeVisible();
      expect((await crumb.boundingBox())!.y).toBeGreaterThan(header.y + header.height);
    }
  });
});

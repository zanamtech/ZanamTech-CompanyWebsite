import { test, expect } from './fixtures';
import { catalog, published } from './catalog';

// Constitution III: no clock times, time-zone labels or minute/hour figures on the site.
const TIME_FIGURES = /\b\d{1,2}:\d{2}\b|\b(?:PKT|GST|GMT|UTC|EST|PST)\b|\b\d+\s*[-–]?\s*(?:minutes?|mins?|hours?|hrs?)\b/i;

test.describe('US2 — Services v3', () => {
  test('/services is grouped into four pillars, flagship first, with anchors', async ({ page }) => {
    await page.goto('/services');
    const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
    expect(ids.slice(0, 4)).toEqual(['managed', 'cloud-devops', 'web-saas', 'ai']);
    const firstCard = page.locator('#managed [data-service-card] h3');
    await expect(firstCard).toHaveText(published.find((s) => s.flagship)!.name);
  });

  test('every published service is linked from the Home pillar grid (two clicks or fewer)', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('#core-services [data-pillar] a[href^="/services/"]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')),
    );
    expect(hrefs.sort()).toEqual(published.map((s) => `/services/${s.slug}`).sort());
  });

  test('flagship page shows modules, three tiers by scope and the P1–P4 definitions, with no time figures', async ({ page }) => {
    const flagship = published.find((s) => s.flagship)!;
    await page.goto(`/services/${flagship.slug}`);
    await expect(page.getByRole('heading', { name: 'What the service covers' })).toBeVisible();
    await expect(page.locator('[data-tier]')).toHaveCount(3);
    await expect(page.locator('[data-severity]')).toHaveCount(4);
    for (const level of ['P1', 'P2', 'P3', 'P4']) await expect(page.locator(`[data-severity="${level}"]`)).toBeVisible();
    const tierText = (await page.locator('[data-tier]').allInnerTexts()).join('\n');
    expect(tierText).not.toMatch(TIME_FIGURES);
    await expect(page.getByRole('heading', { name: '4-week onboarding' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Exit terms' })).toBeVisible();
  });

  test('service pages show "What you get", a FAQ and illustrative scenarios without figures', async ({ page }) => {
    for (const service of published) {
      await page.goto(`/services/${service.slug}`);
      await expect(page.getByRole('heading', { name: 'What you get' })).toBeVisible();
      await expect(page.locator('#service-faq [data-faq]').first()).toBeAttached();
      const examples = page.locator('[data-scenario]').filter({ hasText: 'Example engagement' });
      for (const text of await examples.allInnerTexts()) {
        expect(text.replace('Example engagement', ''), `${service.slug} illustrative scenario`).not.toMatch(/\d/);
      }
    }
  });

  test('no service page states clock times, time zones or minute/hour figures', async ({ page }) => {
    for (const service of catalog.filter((s) => s.published)) {
      await page.goto(`/services/${service.slug}`);
      const text = await page.locator('main').innerText();
      expect(text.replace(/hourly encrypted backups/gi, ''), service.slug).not.toMatch(TIME_FIGURES);
    }
  });
});

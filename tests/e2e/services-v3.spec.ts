import { test, expect } from './fixtures';
import { published } from './catalog';

// Constitution III: no clock times, time-zone labels or minute/hour figures on the site.
const TIME_FIGURES =
  /\b\d{1,2}:\d{2}\b|\b(?:PKT|GST|GMT|UTC|EST|PST)\b|\b\d+\s*[-–]?\s*(?:minutes?|mins?|hours?|hrs?)\b/i;

test.describe('US2 — Services v3', () => {
  test('/services is grouped into four pillars, flagship first, with anchors', async ({ page }) => {
    await page.goto('/services');
    const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
    expect(ids.slice(0, 4)).toEqual(['managed', 'cloud-devops', 'web-saas', 'ai']);
    const firstCard = page.locator('#managed [data-service-card] h3');
    await expect(firstCard).toHaveText(published.find((s) => s.flagship)!.name);
  });

  test('the Managed pillar card lists what the retainer includes, each linking to the flagship', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('#core-services [data-pillar="managed"] ul a');
    await expect(links).toHaveText([
      'Monitoring and alerting',
      'Monthly patching',
      'Backup checks',
      'Monthly service report',
    ]);
    for (const href of await links.evaluateAll((els) => els.map((e) => e.getAttribute('href'))))
      expect(href).toBe('/services/managed-cloud-devops');
  });

  test(
    '/services has no empty slots: Managed is one full-width feature card, Practical AI fills a two-column row',
    { tag: '@desktop' },
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/services');
      const list = (await page.locator('#managed ul').first().boundingBox())!;
      const flagship = (await page.locator('#managed [data-service-card]').boundingBox())!;
      expect(Math.round(flagship.width)).toBe(Math.round(list.width));
      await expect(page.locator('#managed [data-service-card]')).toHaveAttribute('data-layout', 'feature');
      const ai = await page
        .locator('#ai [data-service-card]')
        .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
      expect(ai).toHaveLength(2);
      expect(new Set(ai).size, 'both AI cards on one row').toBe(1);
    },
  );

  // One test per service page (each loop used to share one 30s budget and timed out on a loaded machine).
  for (const service of published) {
    test(`${service.slug}: 4–5 FAQs, 3 related cards without numbers, engagement chips linking to How We Work`, async ({
      page,
    }) => {
      await page.goto(`/services/${service.slug}`);
      const faqs = await page.locator('#service-faq [data-faq]').count();
      expect(faqs, `${service.slug} FAQ count`).toBeGreaterThanOrEqual(4);
      expect(faqs, `${service.slug} FAQ count`).toBeLessThanOrEqual(5);
      const related = page.locator('section[aria-labelledby="related-title"] [data-service-card]');
      await expect(related, `${service.slug} related`).toHaveCount(3);
      expect(await related.locator('.tabular-nums').count(), `${service.slug} related numbers`).toBe(0);
      const chips = page.locator('[data-engagement-chip]');
      const count = await chips.count();
      expect(count, `${service.slug} engagement chips`).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(3);
      for (const href of await chips.evaluateAll((els) => els.map((e) => e.getAttribute('href'))))
        expect(href).toBe('/approach#engagement-models');
    });
  }

  test('flagship page shows modules, three tiers by scope and the P1–P4 definitions, with no time figures', async ({
    page,
  }) => {
    const flagship = published.find((s) => s.flagship)!;
    await page.goto(`/services/${flagship.slug}`);
    await expect(page.getByRole('heading', { name: 'What the service covers' })).toBeVisible();
    await expect(page.locator('[data-tier]')).toHaveCount(3);
    await expect(page.locator('[data-severity]')).toHaveCount(4);
    for (const level of ['P1', 'P2', 'P3', 'P4'])
      await expect(page.locator(`[data-severity="${level}"]`)).toBeVisible();
    const tierText = (await page.locator('[data-tier]').allInnerTexts()).join('\n');
    expect(tierText).not.toMatch(TIME_FIGURES);
    await expect(page.getByRole('heading', { name: 'Onboarding in 2–4 weeks' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Exit terms' })).toBeVisible();
  });

  for (const service of published) {
    test(`${service.slug}: "What you get", a FAQ and illustrative scenarios without figures`, async ({ page }) => {
      await page.goto(`/services/${service.slug}`);
      await expect(page.getByRole('heading', { name: 'What you get' })).toBeVisible();
      await expect(page.locator('#service-faq [data-faq]').first()).toBeAttached();
      const examples = page.locator('[data-scenario]').filter({ hasText: 'Example engagement' });
      for (const text of await examples.allInnerTexts()) {
        expect(text.replace('Example engagement', ''), `${service.slug} illustrative scenario`).not.toMatch(/\d/);
      }
    });
  }

  for (const service of published) {
    test(`${service.slug}: no clock times, time zones or minute/hour figures`, async ({ page }) => {
      await page.goto(`/services/${service.slug}`);
      const text = await page.locator('main').innerText();
      expect(text.replace(/hourly encrypted backups/gi, ''), service.slug).not.toMatch(TIME_FIGURES);
    });
  }
});

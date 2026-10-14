import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

// Regression (QA 2026-10-14): "How we engage" step cards could stay blank after load until hovered. Every card must
// end fully visible without any pointer interaction, however the visitor reaches the section.

/** Opacity of each step card multiplied through its ancestors, plus its reveal state. */
async function stepCards(page: Page) {
  return page.locator('#process [data-phase]').evaluateAll((items) =>
    items.map((li) => {
      let opacity = 1;
      for (let n: Element | null = li.firstElementChild; n && n !== document.body; n = n.parentElement) {
        opacity *= Number(getComputedStyle(n).opacity);
      }
      return { opacity: Math.round(opacity * 100) / 100, state: (li as HTMLElement).dataset.shown ?? 'static' };
    }),
  );
}

async function expectAllStepsVisible(page: Page) {
  const where = () =>
    page.evaluate(() => {
      const r = document.querySelector('#process ol')!.getBoundingClientRect();
      return `scrollY=${Math.round(scrollY)} steps top=${Math.round(r.top)} bottom=${Math.round(r.bottom)} viewport=${innerHeight}`;
    });
  await expect
    .poll(async () => (await stepCards(page)).map((c) => c.opacity), {
      timeout: 8_000,
      message: `all four step cards fully visible (${await where()})`,
    })
    .toEqual([1, 1, 1, 1]);
}

test.describe('How we engage: step cards always end visible', () => {
  test.use({ hasTouch: false });

  const arrivals: Record<string, (page: Page) => Promise<void>> = {
    'jump straight to the section': async (page) => {
      await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'instant' }));
    },
    'smooth scroll to the section': async (page) => {
      await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'smooth' }));
    },
    'fast scroll past it, then back up': async (page) => {
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await page.waitForTimeout(150);
      await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'instant', block: 'center' }));
    },
    'reload mid-page': async (page) => {
      await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'instant' }));
      await page.waitForTimeout(400);
      await page.reload();
      await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'instant' }));
    },
    'back from another page': async (page) => {
      await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'instant' }));
      await page.waitForTimeout(400);
      await page.goto('/about');
      await page.goBack();
      await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'instant' }));
    },
  };

  for (const [name, arrive] of Object.entries(arrivals)) {
    test(`${name} (three loads)`, async ({ page }) => {
      for (let run = 0; run < 3; run++) {
        await page.goto('/');
        await page.waitForTimeout(100 + run * 150);
        await arrive(page);
        await expectAllStepsVisible(page);
        // After the sequence the cards carry no reveal styles at all.
        await expect.poll(async () => (await stepCards(page)).map((c) => c.state)).toEqual(['done', 'done', 'done', 'done']);
      }
    });
  }

  test('reduced motion shows every card immediately', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await page.evaluate(() => document.querySelector('#process')!.scrollIntoView({ behavior: 'instant' }));
    expect((await stepCards(page)).map((c) => c.opacity)).toEqual([1, 1, 1, 1]);
    await context.close();
  });
});

test('every reveal group on the home page ends fully visible', async ({ page }) => {
  await page.goto('/');
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 300) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(40);
  }
  await expect
    .poll(
      () =>
        page.locator('[data-reveal-group] > *').evaluateAll((items) =>
          items
            .filter((el) => Number(getComputedStyle(el).opacity) < 1)
            .map((el) => el.textContent?.trim().slice(0, 40)),
        ),
      { timeout: 6_000 },
    )
    .toEqual([]);
});

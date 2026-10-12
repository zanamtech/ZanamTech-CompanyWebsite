import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from './fixtures';

// Drafts render only in `astro dev` (FR-036, SC-010). These tests run against the production preview build.
const entries = (dir: string) =>
  readdirSync(join(process.cwd(), 'src', 'content', dir))
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace(/\.md$/, ''), draft: /^draft:\s*true\s*$/m.test(readFileSync(join(process.cwd(), 'src', 'content', dir, f), 'utf8')) }));

const insights = entries('insights');
const resources = entries('resources');

test.describe('US6 — Drafts and published content', () => {
  test('draft articles and samples are not built; published ones are', async ({ request }) => {
    for (const a of insights) {
      expect((await request.get(`/insights/${a.slug}`)).status(), a.slug).toBe(a.draft ? 404 : 200);
    }
    for (const r of resources) {
      expect((await request.get(`/resources/${r.slug}`)).status(), r.slug).toBe(r.draft ? 404 : 200);
    }
    const anySample = resources.some((r) => !r.draft);
    expect((await request.get('/resources')).status()).toBe(anySample ? 200 : 404);
  });

  test('no Draft badge appears on any built page', async ({ page }) => {
    for (const path of ['/', '/insights', ...insights.filter((a) => !a.draft).map((a) => `/insights/${a.slug}`)]) {
      await page.goto(path);
      await expect(page.getByText(/^Draft$/)).toHaveCount(0);
      await expect(page.getByText(/DRAFT: owner fact-check/)).toHaveCount(0);
    }
  });

  test('the Insights link is in the desktop nav and the footer when articles are published', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop nav (1440px)');
    test.skip(!insights.some((a) => !a.draft), 'No published articles');
    await page.goto('/');
    await expect(page.locator('header nav[aria-label="Primary"]').getByRole('link', { name: 'Insights', exact: true })).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: 'Insights', exact: true })).toBeVisible();
  });

  test('the artefact band is absent while every sample is a draft', async ({ page }) => {
    test.skip(resources.some((r) => !r.draft), 'At least one sample is published');
    await page.goto('/');
    await expect(page.locator('#artefacts')).toHaveCount(0);
  });

  test('published articles cite third-party statistics with a source link', async ({ page }) => {
    await page.goto('/insights/cloud-cost-checklist');
    await expect(page.getByRole('heading', { name: 'Sources', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /29% of their IaaS and PaaS spend is wasted/ })).toHaveAttribute('href', /^https:\/\//);
  });
});

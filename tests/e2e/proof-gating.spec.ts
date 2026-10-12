import { test, expect } from './fixtures';
import { clients } from '../../src/data/clients';
import { testimonials } from '../../src/data/testimonials';

// ADR-003: logos, testimonials, named case studies and badges render only from verified, permissioned data.
const noVerifiedProof = !clients.some((c) => c.verified) && !testimonials.some((t) => t.verified);

test.describe('US7 — Verified-only proof', () => {
  test('with no verified entries, no proof sections or links render anywhere', async ({ page }) => {
    test.skip(!noVerifiedProof, 'Verified proof exists');
    for (const path of ['/', '/services', '/about', '/approach']) {
      await page.goto(path);
      await expect(page.locator('#clients')).toHaveCount(0);
      await expect(page.locator('#testimonials, [data-testimonial]')).toHaveCount(0);
      await expect(page.locator('[data-case-study]')).toHaveCount(0);
      await expect(page.getByRole('link', { name: 'Case Studies', exact: true })).toHaveCount(0);
      await expect(page.getByText(/Trusted by|Our clients|What clients say/i)).toHaveCount(0);
    }
  });

  test('/case-studies is not built until a verified case study exists', async ({ request }) => {
    expect((await request.get('/case-studies')).status()).toBe(404);
  });

  test('no certification or partner badges are claimed', async ({ page }) => {
    for (const path of ['/', '/about', '/trust']) {
      await page.goto(path);
      expect(await page.locator('main').innerText(), path).not.toMatch(/\bcertified\b|Solutions Partner|Select Tier|Advanced Tier|Premier Partner/i);
    }
  });
});

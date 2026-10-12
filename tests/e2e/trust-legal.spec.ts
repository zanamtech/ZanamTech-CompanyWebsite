import { test, expect } from './fixtures';

test.describe('US4 — Trust, legal and company', () => {
  test('/trust and /terms render their key sections', async ({ page }) => {
    const trust = await page.goto('/trust');
    expect(trust?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Security & Trust');
    for (const heading of ['How we access your environment', 'AI-tool policy', 'Sub-processors', 'Data residency', 'Reporting a security issue']) {
      await expect(page.getByRole('heading', { level: 2, name: new RegExp(heading) })).toBeVisible();
    }
    await expect(page.getByRole('link', { name: 'security@zanamtech.com' })).toHaveAttribute('href', 'mailto:security@zanamtech.com');

    const terms = await page.goto('/terms');
    expect(terms?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of Use');
    await expect(page.getByRole('heading', { level: 2, name: /Governing law/ })).toBeVisible();
  });

  test('security.txt is published with the security contact', async ({ request }) => {
    const res = await request.get('/.well-known/security.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Contact: mailto:security@zanamtech.com');
    expect(body).toMatch(/^Expires: \d{4}-\d{2}-\d{2}T/m);
  });

  test('footer: remote-first line, contact email, Privacy / Terms / Trust, and no address', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toContainText('ZanamTech · Remote-first Cloud, DevOps & AI engineering');
    await expect(footer.getByRole('link', { name: 'contact@zanamtech.com' })).toBeVisible();
    for (const label of ['Privacy', 'Terms', 'Trust']) {
      await expect(footer.getByRole('navigation', { name: 'Legal' }).getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    expect(await footer.innerText()).not.toMatch(/\b(?:Street|Road|Avenue|Suite|Floor|Karachi|Pakistan|London|Dubai)\b|\b(?:Ltd|Inc|LLC)\b/);
  });

  test('About has a Leadership section without years, badges or a city', async ({ page }) => {
    await page.goto('/about');
    const leadership = page.locator('section[aria-labelledby="leadership-title"]');
    await expect(leadership.getByRole('heading', { level: 2 })).toHaveText('Mubashir Ahmed');
    await expect(leadership).toContainText('Founder & Lead Architect');
    await expect(leadership).toContainText('remote-first');
    expect(await leadership.innerText()).not.toMatch(/\b\d+\s*\+?\s*years?\b|certified|Karachi|Pakistan/i);
  });

  test('privacy notice names a privacy contact, not a team', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByText('Privacy contact', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'privacy@zanamtech.com' })).toBeVisible();
    expect(await page.locator('main').innerText()).not.toMatch(/privacy team|our team/i);
  });
});

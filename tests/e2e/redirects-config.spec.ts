import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from './fixtures';

// The retired-service 301s live only in nginx (research R1), which `astro preview` does not run. This spec checks the
// configuration itself and that every redirect target exists in the production build.
const CONF = readFileSync(join(process.cwd(), 'nginx', 'nginx.conf'), 'utf8');
const DIST = join(process.cwd(), 'dist');

const REDIRECTS = [
  { from: 'managed-infrastructure-24-7', to: '/services/managed-cloud-devops', page: 'services/managed-cloud-devops/index.html' },
  { from: 'enterprise-ai-integration', to: '/services/ai-assistants-company-data', page: 'services/ai-assistants-company-data/index.html' },
  { from: 'agentic-ai-llmops', to: '/services#ai', page: 'services/index.html', anchor: 'id="ai"' },
];

test.describe('Retired service URLs (nginx 301)', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Configuration check; runs once');
  });

  for (const r of REDIRECTS) {
    test(`/services/${r.from} → ${r.to}`, () => {
      const block = CONF.match(new RegExp(`location ~ \\^/services/${r.from}/\\?\\$ \\{([^}]*)\\}`));
      expect(block, `missing location for ${r.from}`).not.toBeNull();
      expect(block![1]).toContain(`return 301 ${r.to};`);
      expect(block![1]).toContain('include /etc/nginx/security-headers.conf;');
      // Must be matched before the catch-all location.
      expect(CONF.indexOf(block![0])).toBeLessThan(CONF.indexOf('location / {'));
      const target = join(DIST, r.page);
      expect(existsSync(target), `${r.page} must exist in dist`).toBe(true);
      if (r.anchor) expect(readFileSync(target, 'utf8')).toContain(r.anchor);
    });
  }
});

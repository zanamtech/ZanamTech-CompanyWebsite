import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from './fixtures';

// The retired-service 301s live only in nginx (research R1), which `astro preview` does not run. This spec checks the
// configuration itself and that every redirect target exists in the production build.
const CONF = readFileSync(join(process.cwd(), 'nginx', 'nginx.conf'), 'utf8');
const DIST = join(process.cwd(), 'dist');
const SLASH_RULE = 'location ~ ^/.+/$ {';

const REDIRECTS = [
  {
    from: 'managed-infrastructure-24-7',
    to: '/services/managed-cloud-devops',
    page: 'services/managed-cloud-devops.html',
  },
  {
    from: 'enterprise-ai-integration',
    to: '/services/ai-assistants-company-data',
    page: 'services/ai-assistants-company-data.html',
  },
  { from: 'agentic-ai-llmops', to: '/services#ai', page: 'services.html', anchor: 'id="ai"' },
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
      // Must be matched before the trailing-slash rule (one hop, not two) and the catch-all location.
      expect(CONF.indexOf(block![0])).toBeLessThan(CONF.indexOf(SLASH_RULE));
      expect(CONF.indexOf(block![0])).toBeLessThan(CONF.indexOf('location / {'));
      const target = join(DIST, r.page);
      expect(existsSync(target), `${r.page} must exist in dist`).toBe(true);
      if (r.anchor) expect(readFileSync(target, 'utf8')).toContain(r.anchor);
    });
  }
});

// One URL per page (audit F-01). The 301s themselves were checked against a running nginx; this guards the config.
test.describe('Trailing-slash URLs (nginx 301)', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Configuration check; runs once');
  });

  test('the slash form 301s to the slash-less form, keeping the query string', () => {
    const start = CONF.indexOf(SLASH_RULE);
    expect(start, 'missing trailing-slash location').toBeGreaterThan(-1);
    const block = CONF.slice(start, CONF.indexOf('\n        }', start));
    expect(block).toContain('include /etc/nginx/security-headers.conf;');
    // Raw $request_uri (never the decoded $uri), and the path must not start with "//" or "/\" (no open redirect).
    expect(block).toContain('$request_uri ~ "^(/[^/\\x5c?]');
    expect(block).toContain('return 301 $1$is_args$args;');
    expect(start).toBeLessThan(CONF.indexOf('location / {'));
  });

  test('pages are served from file-format output', () => {
    expect(CONF).toContain('try_files $uri $uri.html $uri/index.html =404;');
    expect(existsSync(join(DIST, 'about.html'))).toBe(true);
    // /services is a page with child pages: services.html sits beside the services/ folder.
    expect(existsSync(join(DIST, 'services.html'))).toBe(true);
    expect(existsSync(join(DIST, 'services', 'managed-cloud-devops.html'))).toBe(true);
  });
});

// .html URLs and /404 (round 3). Checked against a running nginx; this guards the config.
test.describe('.html URLs and the 404 page (nginx)', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Configuration check; runs once');
  });

  test('/<page>.html 301s to /<page> and /index.html to /, keeping the query string', () => {
    const start = CONF.indexOf(String.raw`location ~ \.html$ {`);
    expect(start, 'missing .html location').toBeGreaterThan(-1);
    const block = CONF.slice(start, CONF.indexOf('\n        }', start));
    expect(block).toContain('include /etc/nginx/security-headers.conf;');
    expect(block).toContain('return 301 /$is_args$args;');
    // Raw $request_uri, and no "//" or "/\" at the start (no open redirect), as in the trailing-slash rule.
    expect(block).toContain('$request_uri ~ "^(/[^/\\x5c?]');
    expect(block).toContain('return 301 $1$is_args$args;');
    expect(start).toBeLessThan(CONF.indexOf('location / {'));
  });

  test('/404 answers with status 404 and the 404 page', () => {
    expect(CONF).toMatch(/location = \/404 \{\s*return 404;\s*\}/);
    expect(CONF).toContain('error_page 404 /404.html;');
  });
});

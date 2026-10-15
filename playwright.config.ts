import { createServer } from 'node:net';
import { defineConfig, devices } from '@playwright/test';
import { E2E_BUILD_DATE } from './tests/e2e/build-date';

/** Ask the OS for an unused port. */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, 'localhost', () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });
}

// The suite always tests a fresh production build. Set PLAYWRIGHT_PORT to pin the port; otherwise a free one is picked,
// so a running `astro dev` (4321) is never tested by accident. The chosen port is stored in the environment so worker
// processes, which load this config again, use the same one.
const PORT = Number(process.env.PLAYWRIGHT_PORT) || (await freePort());
process.env.PLAYWRIGHT_PORT = String(PORT);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    // Device-specific tests are tagged @desktop or @mobile and run only in that project (untagged tests run in both).
    {
      name: 'desktop',
      grepInvert: /@mobile/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'mobile', grepInvert: /@desktop/, use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    // Every scheduled Insights article is built (tests/e2e/build-date.ts).
    env: { BUILD_DATE: E2E_BUILD_DATE },
    url: `http://localhost:${PORT}`,
    // Never reuse a server that happens to be listening: if the port is taken, the run fails instead.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});

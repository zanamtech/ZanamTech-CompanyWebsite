import { createServer } from 'node:net';
import { defineConfig, devices } from '@playwright/test';

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
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Never reuse a server that happens to be listening: if the port is taken, the run fails instead.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});

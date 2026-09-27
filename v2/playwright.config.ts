import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, PORT } from './tests/e2e/support/config';

/**
 * Playwright config for the v2 portfolio. Targets a production build served
 * by `astro preview` (not `astro dev`), so routing matches what GitHub Pages
 * actually serves: static files under the `/v2` base, `format: 'file'` output
 * (e.g. `/v2/work/kvit` resolves straight to `work/kvit.html`, no redirect).
 *
 * `npm test` builds and starts that server itself via `webServer` below, so
 * no one has to start a dev server by hand first.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  // WebKit is Playwright's Safari-engine emulation, not a real device: it
  // catches engine-level rendering/CSS bugs (e.g. the -webkit- prefixed
  // box-decoration-break the underline reveal depends on) but is not a
  // substitute for an actual iPhone/Mac test pass.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

// Calder Wheels — Mobile & Tablet Pre-Event QA harness
// Playwright 1.48.2 pinned: last line supporting macOS 12 (Monterey) browser builds.
// Chromium 130 + WebKit 18 (mac12 builds). See DEVICE_TEST_MATRIX.md for caveats.
import { defineConfig } from 'playwright/test';

const BASE = process.env.QA_BASE_URL || 'https://wvpnpr-t7.myshopify.com';

export default defineConfig({
  testDir: './tests',
  outputDir: './artifacts/test-results',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1, // store aggressively rate-limits bursts (literal "local_rate_limited" responses)
  retries: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: './artifacts/results.json' }],
  ],
  use: {
    baseURL: BASE,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    { name: 'chromium-mobile', use: { browserName: 'chromium' } },
    { name: 'webkit-mobile', use: { browserName: 'webkit' } },
  ],
});

// Phase 4 visual baselines (WebKit subset) — cross-engine layout verification.
// WebKit renders closer to iOS Safari; run representative viewports/routes.
import { test, webkit } from 'playwright/test';
import { DEVICES, ROUTES } from '../lib/devices.mjs';
import { gotoPaced, makeContext, scrollThrough, AUDIT_SCRIPT, saveJson, ensureDir } from '../lib/helpers.mjs';

const WEBKIT_DEVICES = ['m-320-narrow', 'm-375-iphone', 'm-393-iphone', 't-768-small-tablet', 't-1180-tablet-landscape'];
const WEBKIT_ROUTES = ['home', 'pdp-clm-01', 'fitment', 'wheel-gallery'];

test.skip(({ browserName }) => browserName !== 'webkit', 'webkit-only spec (own browser launch)');

test.describe('visual baselines (webkit)', () => {
  let browser;
  const auditResults = {};

  test.beforeAll(async () => { browser = await webkit.launch(); });
  test.afterAll(async () => {
    await browser?.close();
    saveJson('artifacts/visual-audit-webkit.json', auditResults);
  });

  for (const key of WEBKIT_DEVICES) {
    const device = DEVICES.find((d) => d.key === key);
    for (const rKey of WEBKIT_ROUTES) {
      const route = ROUTES.find((r) => r.key === rKey);
      test(`webkit baseline ${device.key} / ${route.key}`, async () => {
        const ctx = await makeContext(browser, device);
        const page = await ctx.newPage();
        await gotoPaced(page, route.path);
        await scrollThrough(page);
        const audit = await page.evaluate(AUDIT_SCRIPT);
        auditResults[`${device.key}:${route.key}`] = audit;

        const dir = ensureDir(`screenshots/webkit/${device.key}`);
        await page.screenshot({ path: `${dir}/${route.key}--full.png`, fullPage: true, animations: 'disabled', timeout: 45_000 });
        await page.screenshot({ path: `${dir}/${route.key}--fold.png`, animations: 'disabled' });
        await ctx.close();
      });
    }
  }
});

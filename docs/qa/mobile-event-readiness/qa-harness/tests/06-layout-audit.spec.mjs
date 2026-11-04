// Phase 4 layout audits — RE-DONE with incremental save (afterAll overwrite bug lost the first pass).
// Representative routes x all 9 viewports: overflow, broken/aspect-distorted images,
// touch-target sizes, sticky inventory. Also re-captures the 2 screenshot cells the
// first pass lost to rate-limit exhaustion (t-1180 build-your-wheel + cart).
import { test, chromium } from 'playwright/test';
import fs from 'node:fs';
import { DEVICES, ROUTES } from '../lib/devices.mjs';
import { gotoPaced, makeContext, scrollThrough, AUDIT_SCRIPT, saveJson, sleep, ensureDir } from '../lib/helpers.mjs';

const AUDIT_ROUTES = ['home', 'pdp-clm-01', 'fitment', 'wheel-gallery', 'build-your-wheel', 'cart'];
const AUDIT_FILE = 'artifacts/layout-audit.json';

function readAudit() {
  try { return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8')); } catch { return {}; }
}

test.describe('layout audit (chromium, incremental save)', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'chromium-only spec');

  let browser;
  test.beforeAll(async () => { browser = await chromium.launch(); });
  test.afterAll(async () => { await browser?.close(); });

  for (const device of DEVICES) {
    for (const rKey of AUDIT_ROUTES) {
      const route = ROUTES.find((r) => r.key === rKey);
      test(`layout-audit ${device.key} / ${route.key}`, async () => {
        const ctx = await makeContext(browser, device);
        const page = await ctx.newPage();
        await gotoPaced(page, route.path);
        await scrollThrough(page);
        const audit = await page.evaluate(AUDIT_SCRIPT);
        // incremental merge-save
        const all = readAudit();
        all[`${device.key}:${route.key}`] = audit;
        saveJson(AUDIT_FILE, all);

        // fill missing screenshot cells (rate-limit victims of the first pass)
        if ((device.key === 't-1180-tablet-landscape') && (route.key === 'build-your-wheel' || route.key === 'cart')) {
          const dir = ensureDir(`screenshots/chromium/${device.key}`);
          await page.screenshot({ path: `${dir}/${route.key}--full.png`, fullPage: true, animations: 'disabled', timeout: 45_000 });
          await page.screenshot({ path: `${dir}/${route.key}--fold.png`, animations: 'disabled' });
        }
        await sleep(2000); // pacing between loads
        await ctx.close();
      });
    }
  }
});

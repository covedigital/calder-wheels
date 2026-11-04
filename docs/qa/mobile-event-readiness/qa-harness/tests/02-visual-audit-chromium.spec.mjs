// Phase 4 visual baselines + layout audits (Chromium, full 9-viewport matrix).
// Captures full-page screenshots per device/route AND collects layout audit data:
// horizontal overflow, broken/aspect-distorted images, tiny touch targets, sticky inventory.
// This run ESTABLISHES the baselines; later runs diff against screenshots/ and artifacts/.
import { test, chromium } from 'playwright/test';
import { DEVICES, ROUTES } from '../lib/devices.mjs';
import { gotoPaced, makeContext, scrollThrough, AUDIT_SCRIPT, saveJson, ensureDir } from '../lib/helpers.mjs';

const auditedRoutes = ROUTES;

test.skip(({ browserName }) => browserName !== 'chromium', 'chromium-only spec (own browser launch)');

test.describe('visual baselines + layout audit (chromium)', () => {
  let browser;
  const auditResults = {};

  test.beforeAll(async () => { browser = await chromium.launch(); });
  test.afterAll(async () => {
    await browser?.close();
    saveJson('artifacts/visual-audit-chromium.json', auditResults);
  });

  for (const device of DEVICES) {
    for (const route of auditedRoutes) {
      test(`baseline ${device.key} / ${route.key}`, async () => {
        const ctx = await makeContext(browser, device);
        const page = await ctx.newPage();
        await gotoPaced(page, route.path);
        await scrollThrough(page);
        const audit = await page.evaluate(AUDIT_SCRIPT);
        auditResults[`${device.key}:${route.key}`] = audit;

        const dir = ensureDir(`screenshots/chromium/${device.key}`);
        await page.screenshot({
          path: `${dir}/${route.key}--full.png`,
          fullPage: true,
          animations: 'disabled',
          timeout: 45_000,
        });
        await page.screenshot({
          path: `${dir}/${route.key}--fold.png`,
          animations: 'disabled',
        });

        // Hard gates only: overflow on a mobile/tablet width is a defect signal, but
        // 1px rounding is noise. Threshold: >4px horizontal overflow.
        const overflowPx = audit.docWidth - audit.viewport.width;
        if (overflowPx > 4) {
          test.info().annotations.push({ type: 'overflow', description: `${overflowPx}px on ${route.key}` });
        }
        await ctx.close();
      });
    }
  }
});

// Phase 1 smoke: every critical route loads with a real page (status + title).
// Console/network/image findings are RECORDED and classified (theme vs third-party),
// not hard-failed — this is an audit; findings feed FUNCTIONAL/PERFORMANCE reports.
// Runs once, on Chromium @375px compact iPhone.
import { test, chromium } from 'playwright/test';
import { DEVICES, ROUTES } from '../lib/devices.mjs';
import { gotoPaced, makeContext, attachDiagnostics, newSink, saveJson, classifyError } from '../lib/helpers.mjs';

const device = DEVICES.find((d) => d.key === 'm-375-iphone');

test.describe('smoke: critical routes', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'chromium-only spec (own browser launch)');

  let browser;
  const allResults = [];

  test.beforeAll(async () => { browser = await chromium.launch(); });
  test.afterAll(async () => {
    await browser?.close();
    saveJson('artifacts/smoke-375.json', allResults);
  });

  for (const route of ROUTES) {
    test(`smoke ${route.key} (${route.path})`, async () => {
      const ctx = await makeContext(browser, device);
      const page = await ctx.newPage();
      const sink = attachDiagnostics(page, newSink());
      const resp = await gotoPaced(page, route.path);
      const status = resp ? resp.status() : 0;
      test.expect(status, `HTTP status for ${route.path}`).toBeLessThan(400);
      const title = await page.title();
      test.expect(title.length, 'page title present (real page served)').toBeGreaterThan(0);

      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((i) => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:'))
          .map((i) => ({ src: i.currentSrc.slice(0, 200), cls: String(i.className).slice(0, 60) }))
      );
      const themeConsole = sink.consoleErrors.filter((e) => classifyError(e.text + ' ' + (e.location || '')) === 'theme');
      const thirdConsole = sink.consoleErrors.filter((e) => classifyError(e.text + ' ' + (e.location || '')) === 'third-party');
      const themeNetwork = sink.failedRequests.filter((e) => classifyError(e.url) === 'theme');
      const httpErr = sink.httpErrors.filter((e) => !/\/cart\/(add|change)|predictive|\.well-known|big-skins/.test(e.url));

      allResults.push({
        route: route.key,
        path: route.path,
        status,
        title,
        checks: {
          brokenImages: { count: broken.length, detail: broken, status: broken.length ? 'FAIL' : 'PASS' },
          pageErrors: { count: sink.pageErrors.length, detail: sink.pageErrors, status: sink.pageErrors.length ? 'FAIL' : 'PASS' },
          themeConsoleErrors: { count: themeConsole.length, detail: themeConsole, status: themeConsole.length ? 'WARN' : 'PASS' },
          thirdPartyConsoleErrors: { count: thirdConsole.length, detail: thirdConsole, status: 'INFO' },
          themeFailedRequests: { count: themeNetwork.length, detail: themeNetwork, status: themeNetwork.length ? 'WARN' : 'PASS' },
          httpErrors: { count: httpErr.length, detail: httpErr, status: httpErr.length ? 'WARN' : 'PASS' },
        },
      });
      saveJson('artifacts/smoke-375.json', allResults);
      await ctx.close();
    });
  }
});

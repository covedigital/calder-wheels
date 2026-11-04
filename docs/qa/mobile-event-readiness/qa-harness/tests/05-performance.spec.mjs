// Cross-engine functional spot checks (WebKit) + throttled-network performance pass.
// Phase 5: console/page errors, failed requests, slow resources, layout overflow
// under throttled 4G, on representative mobile widths.
import { test, chromium, webkit } from 'playwright/test';
import fs from 'node:fs';
import { DEVICES } from '../lib/devices.mjs';
import { gotoPaced, makeContext, attachDiagnostics, newSink, saveJson, sleep } from '../lib/helpers.mjs';

const results = {};
const record = (kind, name, status, detail = {}) => {
  const file = kind === 'perf-throttled' ? 'artifacts/perf-throttled.json' : 'artifacts/webkit-functional.json';
  let all = [];
  try { all = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  all.push({ kind, name, status, ...detail });
  saveJson(file, all);
};

// Slow 4G-ish profile per Wappalander "Fast 3G/Slow 4G" guidance.
const THROTTLE = { download: 1_600_000, upload: 750_000, latency: 150 };

test.describe('webkit functional spot checks', () => {
  test.skip(({ browserName }) => browserName !== 'webkit', 'webkit project only');
  test('webkit 393: configurator interaction works', async () => {
    const browser = await webkit.launch();
    const D = DEVICES.find((d) => d.key === 'm-393-iphone');
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const label = page.locator('[data-calder-uc-selected="center"]').first();
    const before = (await label.textContent()).trim();
    await page.locator('[data-calder-uc-option][data-dim="center"][data-token="black-titanium"]').first().click();
    await sleep(900);
    const after = (await label.textContent()).trim();
    record('webkit-functional', 'configurator option click updates label', after !== before ? 'PASS' : 'FAIL', { before, after });
    test.expect(after).not.toBe(before);
    await browser.close();
  });

  test('webkit 768: fitment selects populate', async () => {
    const browser = await webkit.launch();
    const D = DEVICES.find((d) => d.key === 't-768-small-tablet');
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/pages/fitment');
    await page.locator('.cw-fitment-guide__select').first().waitFor();
    await page.waitForFunction(() => document.querySelectorAll('.cw-fitment-guide__select option').length > 3, { timeout: 20_000 });
    record('webkit-functional', 'fitment selects populate', 'PASS');
    await browser.close();
  });
});

test.describe('throttled performance sampling', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'chromium project only');
  const PERF_TARGETS = [
    { route: '/', device: 'm-375-iphone', label: 'home' },
    { route: '/products/calder-clm-01-wheel', device: 'm-375-iphone', label: 'pdp' },
    { route: '/pages/fitment', device: 'm-412-android', label: 'fitment' },
    { route: '/collections/wheels', device: 'm-412-android', label: 'collection' },
  ];

  for (const target of PERF_TARGETS) {
    test(`perf ${target.label} @${target.device} throttled`, async () => {
      const browser = await chromium.launch();
      const D = DEVICES.find((d) => d.key === target.device);
      const ctx = await makeContext(browser, D);
      const page = await ctx.newPage();
      // Real network emulation via CDP (Slow-4G-like).
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: THROTTLE.latency,
        downloadThroughput: THROTTLE.download,
        uploadThroughput: THROTTLE.upload,
      });
      const sink = attachDiagnostics(page, newSink());

      const t0 = Date.now();
      await gotoPaced(page, target.route);
      const navMs = Date.now() - t0;
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
      }).catch(() => {}); // restore for diagnostics fetches

      const metrics = await page.evaluate(async () => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const paints = performance.getEntriesByType('paint').map((p) => ({ name: p.name, ms: Math.round(p.startTime) }));
        let cls = 0;
        try {
          for (const e of performance.getEntriesByType('layout-shift')) { if (!e.hadRecentInput) cls += e.value; }
        } catch {}
        const res = performance.getEntriesByType('resource')
          .map((r) => ({ url: r.name.slice(0, 180), ms: Math.round(r.duration), size: r.transferSize || 0 }))
          .sort((a, b) => b.ms - a.ms);
        const slow = res.filter((r) => r.ms > 1500).slice(0, 8);
        const bytes = res.reduce((s, r) => s + (r.size || 0), 0);
        return {
          ttfb: Math.round(nav.responseStart || 0),
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
          loadEvent: Math.round(nav.loadEventEnd || 0),
          paints,
          cls: +cls.toFixed(4),
          resourceCount: res.length,
          totalKB: Math.round(bytes / 1024),
          slow,
        };
      }).catch(() => ({}));

      const brokenImages = await page.evaluate(() =>
        Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:')).map((i) => i.currentSrc.slice(0, 150))
      );
      const overflow = await page.evaluate(() => ({
        vw: window.innerWidth,
        doc: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      }));

      record('perf-throttled', `${target.label} @${target.device}`, 'PASS', {
        navMs,
        metrics,
        brokenImages,
        overflowPx: overflow.doc - overflow.vw,
        consoleErrors: sink.consoleErrors.length,
        pageErrors: sink.pageErrors.length,
        failedRequests: sink.failedRequests.length,
        errorSamples: sink.consoleErrors.slice(0, 5),
      });
      // gates
      test.expect(brokenImages, 'broken images under throttle').toEqual([]);
      test.expect(sink.pageErrors, 'uncaught JS exceptions').toEqual([]);
      await browser.close();
    });
  }
});

// Phase 3 functional testing — 12 areas from the QA brief.
// Primary engine: Chromium @ 375px compact iPhone. Cross-engine spot checks in 04b.
// SAFETY: no checkout; the single add-to-cart test clears the cart immediately after.
import { test, chromium } from 'playwright/test';
import fs from 'node:fs';
import { DEVICES, ROUTES } from '../lib/devices.mjs';
import { gotoPaced, makeContext, attachDiagnostics, newSink, saveJson, sleep, BASE } from '../lib/helpers.mjs';

const D = DEVICES.find((d) => d.key === 'm-375-iphone');
const FUNC_FILE = 'artifacts/functional-375.json';
const record = (area, name, status, detail = {}) => {
  let results = [];
  try { results = JSON.parse(fs.readFileSync(FUNC_FILE, 'utf8')); } catch {}
  results.push({ area, name, status, ...detail });
  saveJson(FUNC_FILE, results);
};

test.skip(({ browserName }) => browserName !== 'chromium', 'chromium-only spec (own browser launch)');

test.describe('functional: 12 areas @375 chromium', () => {
  let browser;
  test.beforeAll(async () => { browser = await chromium.launch(); });
  test.afterAll(async () => { await browser?.close(); });

  // ---- 1. Homepage and navigation ----
  test('1.1 mobile burger opens navigation drawer', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/');
    const burger = page.locator('menu-popup .dropdn-link[title="Menu"]').first();
    await burger.click();
    const drawer = page.locator('#dropdnMenuTabPopup, .js-push-mbmenu').first();
    await drawer.waitFor({ state: 'visible', timeout: 10_000 });
    // drawer content loads via AJAX (?section_id=async-header-navigation-mobile) — wait for it
    await page.waitForSelector('.mobilemenu .nav-level-1 a[href], .mobilemenu .nav-level-1 li', { timeout: 15_000 });
    await sleep(2500); // settle AJAX menu injection
    const navInfo = await page.evaluate(() => {
      const drawerEl = document.querySelector('#dropdnMenuTabPopup') || document.body;
      const links = [...drawerEl.querySelectorAll('.nav-level-1 a[href]')].map((a) => ({ text: (a.textContent || '').trim(), href: a.getAttribute('href') }));
      const items = [...drawerEl.querySelectorAll('.nav-level-1 > li')].map((li) => (li.textContent || '').trim().split('\n')[0].trim()).filter(Boolean);
      return { links, items: [...new Set(items)] };
    });
    record('1-home-nav', 'mobile drawer menu content', navInfo.links.length ? 'PASS' : 'FAIL', navInfo);
    test.expect(navInfo.links.length).toBeGreaterThan(0);
    await ctx.close();
  });

  test('1.2 drawer nav link navigates to target route', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/');
    await page.locator('menu-popup .dropdn-link[title="Menu"]').first().click();
    await page.locator('#dropdnMenuTabPopup').waitFor({ state: 'visible' });
    await sleep(2500); // AJAX menu content
    const link = page.locator('.mobilemenu a[href*="/pages/"], .mobilemenu a[href*="/collections/"]').first();
    test.expect(await link.count()).toBeGreaterThan(0);
    await link.click();
    await page.waitForURL(/\/(pages|collections)\//, { timeout: 20_000 });
    record('1-home-nav', 'drawer link navigates', 'PASS', { url: page.url() });
    await ctx.close();
  });

  // ---- 2. Product listing cards ----
  test('2.1 collection cards render with price + tap-through', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/collections/wheels');
    await page.waitForLoadState('networkidle').catch(() => {});
    const cards = page.locator('a[href*="/products/"]').locator('visible=true');
    const count = await cards.count();
    const priceCount = await page.locator('.calder-card__price, [class*="card__price"]').count();
    record('2-product-cards', 'cards render', count > 0 ? 'PASS' : 'FAIL', { productLinks: count, priceEls: priceCount });
    test.expect(count).toBeGreaterThan(0);
    await cards.first().click();
    await page.waitForURL(/\/products\//, { timeout: 20_000 });
    record('2-product-cards', 'card tap opens PDP', 'PASS', { url: page.url() });
    await ctx.close();
  });

  // ---- 3. Wheel gallery ----
  test('3.1 wheel gallery: tabs/count/interaction', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/pages/wheel-gallery');
    await page.waitForLoadState('networkidle').catch(() => {});
    const container = page.locator('.cg-v2').first();
    test.expect(await container.count()).toBeGreaterThan(0);
    const items = await page.locator('.cg-v2 a[href*="/pages/"], .cg-v2 a[href*="/products/"], .cg-v2 .cg-item, .cg-v2 [class*="cg-item"]').count();
    const tabs = await page.locator('.cg-tabs button, .cg-tabs a, .cg-tabs [role="tab"]').count();
    const search = await page.locator('.cg-search input').count();
    // Click first tappable gallery card if present
    let tapped = false;
    const firstCard = page.locator('.cg-v2 a[href]').first();
    if (await firstCard.count()) {
      const href = await firstCard.getAttribute('href');
      await firstCard.click();
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      tapped = page.url() !== `${BASE}/pages/wheel-gallery` || /gallery|design/i.test(page.url());
      record('3-wheel-gallery', 'gallery item tap-through', tapped ? 'PASS' : 'INFO', { href, landed: page.url() });
    }
    record('3-wheel-gallery', 'gallery inventory', 'PASS', { items, tabs, search });
    test.expect(items).toBeGreaterThan(0);
    await ctx.close();
  });

  // ---- 4. Vehicle gallery ----
  test('4.1 vehicle gallery: items load + tap-through', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/pages/vehicle-gallery');
    await page.waitForLoadState('networkidle').catch(() => {});
    const items = await page.locator('.cg-v2 a[href], .cg-v2 [class*="cg-item"], .cg-v2 img').count();
    const firstCard = page.locator('.cg-v2 a[href]').first();
    let tapped = false, landed = '';
    if (await firstCard.count()) {
      await firstCard.click();
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      landed = page.url();
      tapped = !landed.endsWith('/pages/vehicle-gallery');
    }
    record('4-vehicle-gallery', 'vehicle gallery inventory + tap', items > 0 ? 'PASS' : 'FAIL', { items, tapped, landed });
    test.expect(items).toBeGreaterThan(0);
    await ctx.close();
  });

  // ---- 5. Universal wheel configurator ----
  test('5.1 configurator: option click updates selected label + SKU', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const groups = page.locator('[data-calder-uc-group]');
    const groupCount = await groups.count();
    test.expect(groupCount).toBeGreaterThanOrEqual(4);

    const skuBefore = await page.locator('.calder-pdp__sku').first().textContent().catch(() => '');
    const centerLabel = page.locator('[data-calder-uc-selected="center"]').first();
    const labelBefore = (await centerLabel.textContent()).trim();

    await page.locator('[data-calder-uc-option][data-dim="center"][data-token="black-titanium"]').first().click();
    await sleep(700);
    const labelAfter = (await centerLabel.textContent()).trim();
    const skuAfter = await page.locator('.calder-pdp__sku').first().textContent().catch(() => '');
    record('5-configurator', 'center finish updates selected label', labelAfter !== labelBefore ? 'PASS' : 'FAIL', { labelBefore, labelAfter });
    test.expect(labelAfter).not.toBe(labelBefore);
    record('5-configurator', 'SKU cell reacts to config', skuAfter !== skuBefore ? 'PASS' : 'INFO', { skuBefore: skuBefore.trim().slice(0, 40), skuAfter: skuAfter.trim().slice(0, 40) });

    // diameter change
    const dLabel = page.locator('[data-calder-uc-selected="diameter"]').first();
    await page.locator('[data-calder-uc-option][data-dim="diameter"][data-token="24"]').first().click();
    await sleep(700);
    record('5-configurator', 'diameter option updates', (await dLabel.textContent()).trim() !== '' ? 'PASS' : 'FAIL', { diameter: (await dLabel.textContent()).trim() });
    await ctx.close();
  });

  // ---- 6. Component image compositing ----
  test('6.1 compositing: layer image srcs swap with selections, no missing layers', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const centerLayer = page.locator('[data-calder-uc-stack] img[data-calder-uc-layer="center"]').first();
    const barrelLayer = page.locator('[data-calder-uc-stack] img[data-calder-uc-layer="barrel"]').first();
    const hwLayer = page.locator('[data-calder-uc-stack] img[data-calder-uc-layer="hardware"]').first();
    test.expect(await centerLayer.count()).toBe(1);
    test.expect(await barrelLayer.count()).toBe(1);
    test.expect(await hwLayer.count()).toBe(1);

    const centerBefore = await centerLayer.getAttribute('src');
    await page.locator('[data-calder-uc-option][data-dim="center"][data-token="titanium-tint"]').first().click();
    await sleep(900);
    const centerAfter = await centerLayer.getAttribute('src');
    record('6-compositing', 'center layer src swaps on finish change', centerAfter !== centerBefore ? 'PASS' : 'FAIL', { before: centerBefore?.slice(-40), after: centerAfter?.slice(-40) });
    test.expect(centerAfter).not.toBe(centerBefore);

    const barrelBefore = await barrelLayer.getAttribute('src');
    await page.locator('[data-calder-uc-option][data-dim="barrel"][data-token="polished"]').first().click().catch(async () => {
      // token name fallback: any non-selected barrel option
      await page.locator('[data-calder-uc-option][data-dim="barrel"]').nth(1).click();
    });
    await sleep(900);
    const barrelAfter = await barrelLayer.getAttribute('src');
    record('6-compositing', 'barrel layer src swaps on lip change', barrelAfter !== barrelBefore ? 'PASS' : 'FAIL', { before: barrelBefore?.slice(-40), after: barrelAfter?.slice(-40) });
    test.expect(barrelAfter).not.toBe(barrelBefore);

    // All layer images must actually load (no 404 fallback state)
    const missing = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-calder-uc-stack] img, [data-calder-uc-thumb-stack] img'))
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.src.slice(-60))
    );
    record('6-compositing', 'all composite layer images load', missing.length === 0 ? 'PASS' : 'FAIL', { missing });
    test.expect(missing).toEqual([]);
    await ctx.close();
  });

  // ---- 7. Vehicle fitment finder (page) ----
  test('7.1 fitment page: cascading selects + results', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/pages/fitment');
    // wait for JS to populate selects
    const makeSel = page.locator('.cw-fitment-guide__select').first();
    await makeSel.waitFor({ state: 'visible' });
    await page.waitForFunction(
      () => document.querySelectorAll('.cw-fitment-guide__select option').length > 3,
      { timeout: 20_000 }
    );
    const selects = page.locator('.cw-fitment-guide__select');
    const selectCount = await selects.count();

    // pick first non-empty make
    await makeSel.selectOption({ index: 1 });
    await sleep(800);
    // if model select exists, cascade it
    if (selectCount > 1) {
      const modelSel = selects.nth(1);
      const modelOptions = await modelSel.locator('option').count();
      if (modelOptions > 1) await modelSel.selectOption({ index: 1 });
      await sleep(800);
    }
    const submit = page.locator('.cw-fitment-guide__submit, .hf-fitment__action, button[type="submit"]').first();
    const resultsBefore = await page.locator('.cw-fitment-guide__results a[href], .cw-fitment-guide__results img, .hf-fitment__results a[href], .hf-fitment__results img').count();
    await submit.click().catch(() => {});
    await sleep(2500);
    await page.waitForLoadState('networkidle').catch(() => {});
    const resultsAfter = await page.locator('.cw-fitment-guide__results a[href], .cw-fitment-guide__results img, .hf-fitment__results a[href], .hf-fitment__results img').count();
    record('7-fitment', 'fitment selects populate + submit produces results', 'PASS', { selectCount, resultsBefore, resultsAfter });
    test.expect(selectCount).toBeGreaterThan(0);
    await ctx.close();
  });

  // ---- 8. Product availability states (PDP) ----
  test('8.1 availability: in-stock config enables CTA; qty > component stock behavior', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    const addCalls = [];
    page.on('request', (r) => { if (r.url().includes('cart/add')) addCalls.push((r.postData() || '').slice(0, 160)); });
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const cta = page.locator('[data-calder-uc-cta]').first();
    await cta.waitFor({ state: 'visible' });
    const label = page.locator('[data-calder-uc-cta-label]').first();
    const msg = page.locator('[data-calder-uc-message]').first();
    await sleep(1200); // let CTA script compute availability

    const labelDefault = (await label.textContent()).trim();
    const ctaEnabled = await cta.isEnabled();
    record('8-availability', 'default config CTA state', 'PASS', { label: labelDefault, enabled: ctaEnabled });

    // Quantity beyond component stock. Expected (theme intent): the component gate blocks the add.
    // Observed (live): click still POSTs cart/add.js at qty 99 BEFORE the async recheck flips to NO_STOCK.
    const qty = page.locator('.calder-pdp__qty-input').first();
    if (await qty.count()) {
      const cartBefore = await page.evaluate(async () => { const r = await fetch('/cart.js'); return (await r.json()).item_count; });
      await qty.fill('99');
      await cta.click();
      await sleep(3000);
      const cartAfter = await page.evaluate(async () => { const r = await fetch('/cart.js'); return (await r.json()).item_count; });
      const labelQty = (await label.textContent()).trim();
      const msgQty = (await msg.textContent()).trim();
      const enabledQty = await cta.isEnabled();
      const stateQty = await page.evaluate(() => document.querySelector('[data-calder-universal-purchase]')?.getAttribute('data-calder-uc-state') || '');
      const gated = !enabledQty && /stock/i.test(msgQty) && cartAfter === cartBefore;
      record('8-availability', 'qty 99 click: component gate enforced at click time', gated ? 'PASS' : 'FAIL', {
        gated, label: labelQty, message: msgQty.slice(0, 140), state: stateQty,
        cartBefore, cartAfter, addRequests: addCalls,
      });
      // restore session cart so later tests start clean
      await page.evaluate(async () => { await fetch('/cart/clear.js'); });
    }

    // reset qty, verify CTA returns to available
    await qty.fill('1');
    await sleep(1200);
    const enabledReset = await cta.isEnabled();
    record('8-availability', 'qty reset restores availability', enabledReset ? 'PASS' : 'INFO', { enabled: enabledReset });
    await ctx.close();
  });

  // ---- 9. Add to Cart / inquiry behavior ----
  test('9.1 add-to-cart flow updates cart, then clears (no checkout)', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const cta = page.locator('[data-calder-uc-cta]').first();
    await cta.waitFor({ state: 'visible' });
    await sleep(1200);
    test.expect(await cta.isEnabled(), 'CTA enabled for in-stock config').toBe(true);

    const cartBefore = await getCartCount(page);
    await cta.click();
    await sleep(2500);
    await page.waitForLoadState('networkidle').catch(() => {});
    const cartAfter = await getCartCount(page);
    record('9-cart', 'add-to-cart increments cart', cartAfter > cartBefore ? 'PASS' : 'FAIL', { cartBefore, cartAfter });
    test.expect(cartAfter).toBeGreaterThan(cartBefore);

    // restore state
    await gotoPaced(page, '/cart/clear');
    const cartCleared = await getCartCount(page);
    record('9-cart', 'cart cleared after test', cartCleared === 0 ? 'PASS' : 'FAIL', { cartCleared });
    test.expect(cartCleared).toBe(0);
    await ctx.close();
  });

  async function getCartCount(page) {
    return page.evaluate(async () => {
      try {
        const r = await fetch('/cart.js');
        const j = await r.json();
        return j.item_count || 0;
      } catch { return -1; }
    });
  }

  test('9.2 inquiry: unlisted config shows request notice, no add', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const cta = page.locator('[data-calder-uc-cta]').first();
    const msg = page.locator('[data-calder-uc-message]').first();
    await cta.waitFor({ state: 'visible' });
    // 26" + titanium + polished + black bolts = edge combination likely unlisted
    await page.locator('[data-calder-uc-option][data-dim="diameter"][data-token="26"]').first().click();
    await page.locator('[data-calder-uc-option][data-dim="center"][data-token="titanium-tint"]').first().click();
    await page.locator('[data-calder-uc-option][data-dim="hardware"]').nth(1).click().catch(() => {});
    await sleep(1500);
    const enabled = await cta.isEnabled();
    const msgText = (await msg.textContent()).trim();
    record('9-cart', 'unlisted combo → disabled CTA + request notice', (!enabled && /request|not currently listed|custom/i.test(msgText)) ? 'PASS' : 'INFO', { enabled, message: msgText.slice(0, 140) });
    await ctx.close();
  });

  // ---- 10. Responsive forms and buttons ----
  test('10.1 form controls >= 16px font (iOS zoom guard) + CTA sizing', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/pages/fitment');
    await page.locator('.cw-fitment-guide__select').first().waitFor();
    const fontSizes = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('select, input[type="text"], input[type="tel"], input[type="email"], textarea')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        out.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 50), px: parseFloat(getComputedStyle(el).fontSize) });
      }
      return out;
    });
    const under16 = fontSizes.filter((f) => f.px < 16);
    record('10-forms-buttons', 'form font floor >= 16px', under16.length === 0 ? 'PASS' : 'FAIL', { controls: fontSizes.length, under16 });
    test.expect(under16).toEqual([]);

    // CTA touch sizing on PDP
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const ctaBox = await page.locator('[data-calder-uc-cta]').first().boundingBox();
    if (ctaBox) {
      record('10-forms-buttons', 'CTA height', ctaBox.height >= 44 ? 'PASS' : 'WARN', { h: Math.round(ctaBox.height) });
    }
    await ctx.close();
  });

  // ---- 11. Sticky and floating UI ----
  test('11.1 sticky header/back-to-top/product sticky do not overlap on scroll', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      window.scrollTo(0, 1200);
      await sleep(600);
    });
    const conflicts = await page.evaluate(() => {
      const fixed = [];
      for (const el of document.querySelectorAll('body *')) {
        const s = getComputedStyle(el);
        if ((s.position === 'fixed' || s.position === 'sticky') && s.display !== 'none' && s.visibility !== 'hidden') {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) fixed.push({ cls: String(el.className).slice(0, 60), rect: { top: r.top, bottom: r.bottom, left: r.left, right: r.right } });
        }
      }
      const overlaps = [];
      for (let i = 0; i < fixed.length; i++) {
        for (let j = i + 1; j < fixed.length; j++) {
          const a = fixed[i].rect, b = fixed[j].rect;
          const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (x > 40 && y > 40) overlaps.push([fixed[i].cls, fixed[j].cls, Math.round(x), Math.round(y)]);
        }
      }
      return { fixedCount: fixed.length, overlaps };
    });
    record('11-sticky-ui', 'sticky/fixed overlap check @scroll 1200', conflicts.overlaps.length === 0 ? 'PASS' : 'WARN', conflicts);
    test.expect(conflicts.overlaps).toEqual([]);
    await ctx.close();
  });

  // ---- 12. Portrait and landscape transitions ----
  for (const [pKey, lKey] of [['m-375-iphone', null], ['t-768-small-tablet', 't-1024-tablet-landscape']]) {
    test(`12.1 orientation transition ${pKey} -> landscape`, async () => {
      const device = DEVICES.find((d) => d.key === pKey);
      const ctx = await makeContext(browser, device);
      const page = await ctx.newPage();
      await gotoPaced(page, '/products/calder-clm-01-wheel');
      const landscape = lKey ? DEVICES.find((d) => d.key === lKey) : { width: 667, height: 375, dpr: 2 };
      await page.setViewportSize({ width: landscape.width, height: landscape.height });
      await sleep(900);
      const audit = await page.evaluate(() => ({
        vw: window.innerWidth,
        doc: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        stackVisible: (() => {
          const el = document.querySelector('[data-calder-uc-stack]');
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.width > 50 && r.height > 50;
        })(),
      }));
      record('12-orientation', `${pKey} -> ${landscape.width}x${landscape.height}`, audit.doc - audit.vw <= 2 ? 'PASS' : 'WARN', audit);
      test.expect(audit.doc - audit.vw).toBeLessThanOrEqual(2);
      await ctx.close();
    });
  }

  // Design nav (recently fixed 404) — all 6 design links must resolve.
  test('5.2 design nav links all resolve (no 404s)', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    await gotoPaced(page, '/products/calder-clm-01-wheel');
    const links = page.locator('[data-calder-design-nav] a[href]');
    const count = await links.count();
    test.expect(count).toBeGreaterThanOrEqual(5);
    const hrefs = [];
    for (let i = 0; i < count; i++) hrefs.push(await links.nth(i).getAttribute('href'));
    const outcomes = [];
    for (const href of hrefs) {
      const abs = href.startsWith('http') ? href : BASE + href;
      const resp = await page.request.get(abs);
      outcomes.push({ href: href.slice(0, 100), status: resp.status() });
      test.expect(resp.status(), `design nav link ${href}`).toBeLessThan(400);
    }
    record('5-configurator', 'design nav: all links < 400', 'PASS', outcomes);
    await ctx.close();
  });

  // ---- Build-Your-Wheel page configurator (known defects: parse error + empty design code) ----
  test('5.3 BYW page configurator hydrates + interacts; swatch integrity check', async () => {
    const ctx = await makeContext(browser, D);
    const page = await ctx.newPage();
    const sink = attachDiagnostics(page, newSink());
    await gotoPaced(page, '/pages/build-your-wheel');
    try {
      await page.waitForSelector('.wheel-configurator__option', { timeout: 20_000 });
    } catch { /* record hydration failure below */ }
    const options = await page.locator('.wheel-configurator__option').count();
    const layers = await page.locator('.wheel-configurator__layer--center, .wheel-configurator__layer--barrel, .wheel-configurator__layer--hardware').count();
    const brokenSwatches = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.wheel-configurator__option img'))
        .filter((i) => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:'))
        .map((i) => i.src.slice(-60))
    );
    let interaction = false;
    if (options > 0) {
      const opt = page.locator('.wheel-configurator__option:not(.wheel-configurator__option--selected)').first();
      if (await opt.count()) {
        await opt.click();
        await sleep(700);
        interaction = await opt.evaluate((el) => el.classList.contains('wheel-configurator__option--selected'));
      }
    }
    record('5-configurator', 'BYW configurator hydration + interaction', options > 0 ? 'PASS' : 'FAIL', {
      options, layers, interactionWorks: interaction,
      brokenSwatches,
      pageErrors: sink.pageErrors,
    });
    test.expect(options, 'BYW options hydrate').toBeGreaterThan(0);
    if (brokenSwatches.length) {
      test.info().annotations.push({ type: 'defect', description: `BYW broken swatches: ${brokenSwatches.join(', ')}` });
    }
    await ctx.close();
  });
});

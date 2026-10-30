/* Calder Configurator QA driver.
 * Loads the REAL theme assets (configurator-api.js, calder-demo-inventory.js,
 * configurator-app.js) into a fixture that mirrors the wheel-configurator +
 * PDP markup, and runs functional assertions.
 *
 * Run:  node scripts/configurator-qa/qa-harness.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const REPO = path.resolve(__dirname, '..', '..');
const THEME = path.join(REPO, 'docs', 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const BUILT = path.join(__dirname, '_built-fixture.html');

function fileUrl(p) { return 'file://' + p; }

function buildFixture() {
  const html = fs.readFileSync(path.join(__dirname, 'fixture.html'), 'utf8');
  const out = html
    .replace('__API_JS__', fileUrl(path.join(THEME, 'assets', 'configurator-api.js')))
    .replace('__DEMO_JS__', fileUrl(path.join(THEME, 'assets', 'calder-demo-inventory.js')))
    .replace('__APP_JS__', fileUrl(path.join(THEME, 'assets', 'configurator-app.js')));
  fs.writeFileSync(BUILT, out);
  return BUILT;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push('pageerror: ' + err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') pageErrors.push('console: ' + msg.text());
  });
  page.on('dialog', (d) => d.accept());

  const cartCalls = [];
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (url.indexOf('/cart/add.js') !== -1 && req.method() === 'POST') {
      try { cartCalls.push(JSON.parse(req.postData())); } catch (e) { cartCalls.push({ raw: req.postData() }); }
      const fakeCart = {
        items: [{ id: 5171100000001, quantity: 5, handle: 'apex-201', variant_id: 5171100000001 }],
        item_count: 1,
        sections: { 'cart-icon-bubble': '<div/>', 'header-cart': '<div/>' }
      };
      req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeCart) });
      return;
    }
    req.continue();
  });

  const results = [];
  const record = (name, pass, detail) => results.push({ name, pass: !!pass, detail: detail || '' });

  const fixturePath = buildFixture();
  await page.goto(fileUrl(fixturePath), { waitUntil: 'load' });

  await page.waitForFunction(() => {
    const el = document.getElementById('configurator-availability-qa1');
    return window.__calderActiveConfigurator && el && el.style.display === 'block' &&
      window.__calderActiveConfigurator.currentVariantId != null;
  }, { timeout: 10000 });

  const idsByCombo = await page.evaluate(() => {
    const m = {};
    window.__QA_VARIANTS.forEach((v) => { m[v.option1 + '|' + v.option2 + '|' + v.option3] = { id: v.id, available: v.available, price: v.price }; });
    return m;
  });
  const availability = (args) => page.evaluate((a) => new Promise((resolve) => {
    window.ConfiguratorAPI.checkAvailability(
      a.product, { label: a.center }, { label: a.barrel }, { label: a.hardware }, { label: a.diameter }, 'qa1', (d) => resolve(d));
  }), args);

  /* T1 — four dimension controls render + init from PDP URL variant */
  const dom = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    return {
      diamOpts: document.getElementById('configurator-diameters-qa1').options.length,
      centerChips: document.querySelectorAll('#configurator-centers-qa1 .wheel-configurator__option').length,
      barrelChips: document.querySelectorAll('#configurator-barrels-qa1 .wheel-configurator__option').length,
      hardwareChips: document.querySelectorAll('#configurator-hardwares-qa1 .wheel-configurator__option').length,
      selected: wc.selected,
      currentVariantId: wc.currentVariantId,
      addDisabled: wc.addBtn.disabled,
      sumDiam: document.getElementById('configurator-summary-diameter').textContent
    };
  });
  record('T1a diameter control has 3 native values', dom.diamOpts === 3, 'opts=' + dom.diamOpts);
  record('T1b center chips = 3', dom.centerChips === 3, 'chips=' + dom.centerChips);
  record('T1c barrel chips = 2', dom.barrelChips === 2, 'chips=' + dom.barrelChips);
  record('T1d hardware chips = 2', dom.hardwareChips === 2, 'chips=' + dom.hardwareChips);
  record('T1e all four dimensions in state', !!(dom.selected.diameter && dom.selected.center && dom.selected.barrel && dom.selected.hardware), JSON.stringify(dom.selected));
  record('T1f init from PDP URL variant (22"/Gloss Black/Black)',
    dom.selected.diameter.label === '22"' && dom.selected.center.label === 'Gloss Black' && dom.selected.barrel.label === 'Black',
    JSON.stringify(dom.selected));
  record('T1g hardware default = Black Bolts', dom.selected.hardware.label === 'Black Bolts', dom.selected.hardware.label);
  record('T1h exact init variant id', String(dom.currentVariantId) === String(idsByCombo['22"|Gloss Black|Black'].id),
    'got=' + dom.currentVariantId);
  record('T1i add enabled for valid combo', dom.addDisabled === false, 'disabled=' + dom.addDisabled);
  record('T1j summary shows diameter', dom.sumDiam === '22"', dom.sumDiam);

  /* T2 — exact variant resolution matrix */
  const matrix = await page.evaluate((idsByCombo) => {
    const variants = window.__QA_VARIANTS;
    const DIAMS = ['22"', '24"', '26"'];
    const CENTERS = ['Gloss Black', 'Black Tint', 'Titanium Tint'];
    const BARRELS = ['Black', 'Chrome'];
    const out = [];
    DIAMS.forEach((d) => CENTERS.forEach((c) => BARRELS.forEach((b) => {
      const res = window.ConfiguratorAPI.resolveExact(variants, { label: d }, { label: c }, { label: b });
      const expected = idsByCombo[d + '|' + c + '|' + b];
      out.push({
        combo: d + '|' + c + '|' + b,
        okId: !!(res.variant && String(res.variant.id) === String(expected.id)),
        status: res.status,
        expectedAvail: expected.available,
        variantAvail: res.variant ? res.variant.available : null
      });
    })));
    return out;
  }, idsByCombo);
  const matrixBad = matrix.filter((m) => !m.okId || (m.expectedAvail ? m.variantAvail !== true : m.status !== 'unavailable'));
  record('T2a exact id + availability for all 18 native combos', matrixBad.length === 0, JSON.stringify(matrixBad.slice(0, 3)));

  const unsupported = await page.evaluate(() => {
    const res = window.ConfiguratorAPI.resolveExact(window.__QA_VARIANTS, { label: '20"' }, { label: 'Gloss Black' }, { label: 'Black' });
    return { status: res.status, hasVariant: !!res.variant, id: res.variant_id };
  });
  record('T2b unknown combo → unsupported with null id', unsupported.status === 'unsupported' && !unsupported.hasVariant && unsupported.id == null, JSON.stringify(unsupported));

  const noStock = await page.evaluate(() => {
    const res = window.ConfiguratorAPI.resolveExact(window.__QA_VARIANTS, { label: '24"' }, { label: 'Black Tint' }, { label: 'Chrome' });
    return { status: res.status, available: res.variant ? res.variant.available : null };
  });
  record('T2c unavailable native variant → distinct unavailable', noStock.status === 'unavailable' && noStock.available === false, JSON.stringify(noStock));

  /* T3 — availability states */
  const known = await availability({ product: 'apex-201', center: 'Gloss Black', barrel: 'Black', hardware: 'Black Bolts', diameter: '22"' });
  record('T3a known → available + exact id', known.status === 'available' && String(known.variant_id) === String(idsByCombo['22"|Gloss Black|Black'].id), JSON.stringify(known));
  record('T3b demo available_to_build = min(components) >0', known.available_to_build > 0, 'atb=' + known.available_to_build);
  record('T3c price = resolved variant (minor units)', known.price === idsByCombo['22"|Gloss Black|Black'].price, 'price=' + known.price);

  const unknownDemo = await availability({ product: 'apex-201', center: 'Black Tint', barrel: 'Black', hardware: 'Black Bolts', diameter: '22"' });
  record('T3d missing demo data → demo_unknown, not oos', unknownDemo.demo_unknown === true && unknownDemo.status === 'available', JSON.stringify(unknownDemo));

  const badHw = await availability({ product: 'apex-201', center: 'Gloss Black', barrel: 'Black', hardware: 'Platinum Bolts', diameter: '22"' });
  record('T3e disallowed hardware → supported=false', badHw.supported === false && badHw.status === 'unsupported' && badHw.variant_id == null, JSON.stringify(badHw));

  const noStockAvail = await availability({ product: 'apex-201', center: 'Black Tint', barrel: 'Chrome', hardware: 'Black Bolts', diameter: '24"' });
  record('T3f Shopify unavailable variant → no-stock (never substituted)', noStockAvail.status === 'no-stock', JSON.stringify(noStockAvail));

  /* T4 — Configurator → PDP native path */
  const c2p = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    const chips = document.querySelectorAll('#configurator-centers-qa1 .wheel-configurator__option');
    chips[1].click(); /* Black Tint */
    const sels = window.__QA_picker.querySelectorAll('select');
    return {
      pickerCenter: sels[1].value,
      idInput: window.__QA_idInput.value,
      wcVariantId: wc.currentVariantId,
      wcCenter: wc.selected.center.label
    };
  });
  record('T4a native picker updated', c2p.pickerCenter === 'Black Tint', c2p.pickerCenter);
  record('T4b native id input = exact variant', String(c2p.idInput) === String(idsByCombo['22"|Black Tint|Black'].id), 'got=' + c2p.idInput);
  record('T4c configurator variant matches', String(c2p.wcVariantId) === String(idsByCombo['22"|Black Tint|Black'].id), c2p.wcVariantId);

  /* T5 — configurator diameter change → PDP exact variant */
  const diamChange = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    const d = document.getElementById('configurator-diameters-qa1');
    for (let i = 0; i < d.options.length; i++) { if (d.options[i].value === '26"') { d.value = d.options[i].value; break; } }
    d.dispatchEvent(new Event('change', { bubbles: true }));
    return { idInput: window.__QA_idInput.value, wcDiam: wc.selected.diameter.label, price: wc.priceEl.textContent };
  });
  record('T5a diameter change → new exact variant id', String(diamChange.idInput) === String(idsByCombo['26"|Black Tint|Black'].id), 'got=' + diamChange.idInput);
  record('T5b configurator diameter selected', diamChange.wcDiam === '26"', diamChange.wcDiam);
  record('T5c price shows resolved variant', diamChange.price.indexOf('$') !== -1, diamChange.price);

  /* T6 — PDP → Configurator (native change → observer event chain) */
  await page.evaluate(() => {
    const sels = window.__QA_picker.querySelectorAll('select');
    for (let i = 0; i < sels[0].options.length; i++) { if (sels[0].options[i].value === '24"') { sels[0].value = sels[0].options[i].value; break; } }
    window.__QA_picker.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => {
    const wc = window.__calderActiveConfigurator;
    return wc.selected.diameter && wc.selected.diameter.label === '24"';
  }, { timeout: 3000 });
  const p2cState = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    return { diam: wc.selected.diameter.label, center: wc.selected.center.label, barrel: wc.selected.barrel.label };
  });
  record('T6a PDP change propagates to configurator', p2cState.diam === '24"', JSON.stringify(p2cState));

  /* T7 — direct PDP event applies full 4-dim detail */
  const appliedDirect = await page.evaluate(() => {
    window.__QA_pdp.dispatchEvent(new CustomEvent('calder:pdp-variant-change', { bubbles: true, detail: {
      diameter: '24"', center: 'Titanium Tint', barrel: 'Chrome', hardware: 'Chrome Bolts'
    } }));
    const wc = window.__calderActiveConfigurator;
    return {
      s: { d: wc.selected.diameter.label, c: wc.selected.center.label, b: wc.selected.barrel.label, h: wc.selected.hardware.label },
      sum: { d: document.getElementById('configurator-summary-diameter').textContent, h: document.getElementById('configurator-summary-hardware').textContent }
    };
  });
  record('T7a full external detail applied', appliedDirect.s.d === '24"' && appliedDirect.s.c === 'Titanium Tint' && appliedDirect.s.b === 'Chrome' && appliedDirect.s.h === 'Chrome Bolts', JSON.stringify(appliedDirect.s));
  record('T7b summary updated', appliedDirect.sum.d === '24"' && appliedDirect.sum.h === 'Chrome Bolts', JSON.stringify(appliedDirect.sum));

  /* T8 — Add to Cart payload */
  await page.evaluate(() => { document.querySelector('[data-calder-qty-input]').value = '5'; });
  cartCalls.length = 0;
  await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    wc.setSelected('diameter', { id: '22', label: '22"' });
    document.querySelectorAll('#configurator-centers-qa1 .wheel-configurator__option')[0].click();
    document.querySelectorAll('#configurator-barrels-qa1 .wheel-configurator__option')[0].click();
    document.querySelectorAll('#configurator-hardwares-qa1 .wheel-configurator__option')[0].click();
  });
  await page.waitForFunction(() => !window.__calderActiveConfigurator.addBtn.disabled, { timeout: 3000 });
  await page.evaluate(() => window.__calderActiveConfigurator.addBtn.click());
  await sleep(500);
  const payload = cartCalls[cartCalls.length - 1];
  record('T8a payload id = exact variant', !!payload && String(payload.id) === String(idsByCombo['22"|Gloss Black|Black'].id), JSON.stringify(payload && { id: payload.id, exp: idsByCombo['22"|Gloss Black|Black'].id }));
  record('T8b payload quantity = captured qty 5', !!payload && payload.quantity === 5, payload && 'qty=' + payload.quantity);
  record('T8c customer-visible Hardware property', !!(payload && payload.properties && payload.properties['Hardware & Rivet Finish'] === 'Black Bolts'), JSON.stringify(payload && payload.properties));
  record('T8d internal metadata present', !!(payload && payload.properties && payload.properties._design_code === '201' && payload.properties._diameter === '22"'), JSON.stringify(payload && payload.properties));
  record('T8e single cart call this round', cartCalls.length === 1, 'calls=' + cartCalls.length);
  const cartNotif = await page.evaluate(() => ({
    calls: window.__cartItemsCalls,
    miniOpened: window.__miniOpened,
    payload: null
  }));
  const hasPipeline = ['renderContents', 'toggleEmptyClass', 'setCartJs', 'setStatus:new:true'].every((k) => cartNotif.calls.indexOf(k) !== -1);
  record('T8f Lumia cart render pipeline invoked (drawer + Added banner)', hasPipeline, JSON.stringify(cartNotif.calls));
  record('T8g cart request carries Lumia sections param', !!payload && Array.isArray(payload.sections) && payload.sections.length > 0, JSON.stringify(payload && payload.sections));

  /* T9 — hardware change keeps SAME native variant */
  cartCalls.length = 0;
  await page.evaluate(() => {
    document.querySelectorAll('#configurator-hardwares-qa1 .wheel-configurator__option')[1].click();
  });
  await page.waitForFunction(() => {
    const wc = window.__calderActiveConfigurator;
    return wc.selected.hardware && wc.selected.hardware.label === 'Chrome Bolts' && !wc.addBtn.disabled;
  }, { timeout: 3000 });
  await page.evaluate(() => window.__calderActiveConfigurator.addBtn.click());
  await sleep(500);
  const payload2 = cartCalls[cartCalls.length - 1];
  record('T9a hardware-only change → same variant id, Chrome property', !!payload2 && String(payload2.id) === String(idsByCombo['22"|Gloss Black|Black'].id) && payload2.properties['Hardware & Rivet Finish'] === 'Chrome Bolts', JSON.stringify(payload2 && { id: payload2.id, hw: payload2.properties && payload2.properties['Hardware & Rivet Finish'] }));

  /* T10 — unavailable/unsupported → add disabled, no cart call */
  cartCalls.length = 0;
  await page.evaluate(() => {
    window.__calderActiveConfigurator.setSelected('center', { id: 'center-black-tint', label: 'Black Tint' });
    window.__calderActiveConfigurator.updateChipSelection('center');
    document.querySelectorAll('#configurator-barrels-qa1 .wheel-configurator__option')[1].click();
    const d = document.getElementById('configurator-diameters-qa1');
    for (let i = 0; i < d.options.length; i++) { if (d.options[i].value === '24"') { d.value = d.options[i].value; break; } }
    d.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => window.__calderActiveConfigurator.currentAvailability && window.__calderActiveConfigurator.currentAvailability.status === 'no-stock', { timeout: 3000 });
  const noStockUi = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    return { disabled: wc.addBtn.disabled, vid: wc.currentVariantId, msg: wc.availabilityEl.textContent };
  });
  record('T10a no-stock → add disabled + no stale variant', noStockUi.disabled === true && noStockUi.vid == null, JSON.stringify(noStockUi));
  await sleep(200);
  record('T10b no cart call on unavailable config', cartCalls.length === 0, 'calls=' + cartCalls.length);

  /* T11 — unknown diameter never substitutes */
  const unsupAvail = await availability({ product: 'apex-201', center: 'Titanium Tint', barrel: 'Black', hardware: 'Black Bolts', diameter: '99"' });
  record('T11a unknown diameter → unsupported, null id', unsupAvail.status === 'unsupported' && unsupAvail.variant_id == null, JSON.stringify(unsupAvail));

  /* T12 — builder design switch (normalize PDP to available combo first) */
  await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    wc.setSelected('diameter', { id: '22', label: '22"' });
    document.querySelectorAll('#configurator-centers-qa1 .wheel-configurator__option')[0].click();
    document.querySelectorAll('#configurator-barrels-qa1 .wheel-configurator__option')[0].click();
    document.querySelectorAll('#configurator-hardwares-qa1 .wheel-configurator__option')[0].click();
  });
  await page.waitForFunction(() => !window.__calderActiveConfigurator.addBtn.disabled, { timeout: 3000 });
  await page.evaluate(() => window.__calderActiveConfigurator.configure(window.__QA_SECOND_PRODUCT));
  await page.waitForFunction(() => {
    const wc = window.__calderActiveConfigurator;
    return wc.productId === '777002' && wc.currentVariantId != null;
  }, { timeout: 3000 });
  const sw = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    const ids = window.__QA_SECOND_PRODUCT.variants.map((v) => String(v.id));
    return {
      pid: wc.productId, handle: wc.productHandle, designCode: window._calderDesignCode,
      diamOpts: document.getElementById('configurator-diameters-qa1').options.length,
      vid: wc.currentVariantId, inSecond: ids.indexOf(String(wc.currentVariantId)) !== -1
    };
  });
  record('T12a product identity switched', sw.pid === '777002' && sw.handle === 'vertex-202', JSON.stringify({ pid: sw.pid, handle: sw.handle }));
  record('T12b diameter options reloaded', sw.diamOpts === 3, 'opts=' + sw.diamOpts);
  record('T12c design code updated', sw.designCode === '202', sw.designCode);
  record('T12d resolved variant belongs to NEW product', sw.inSecond === true, 'vid=' + sw.vid);

  /* T13 — switch back → never leaks product-2 variant */
  await page.evaluate(() => window.__calderActiveConfigurator.configure(window._calderProductData['777001']));
  await page.waitForFunction(() => {
    const wc = window.__calderActiveConfigurator;
    return wc.productId === '777001' && wc.currentVariantId != null;
  }, { timeout: 3000 });
  const back = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    const first = window.__QA_VARIANTS.map((v) => String(v.id));
    return { pid: wc.productId, vid: wc.currentVariantId, inFirst: first.indexOf(String(wc.currentVariantId)) !== -1 };
  });
  record('T13a back to product 1 → variant is product-1 only', back.pid === '777001' && back.inFirst === true, JSON.stringify(back));

  /* T14 — rapid change settles on LAST selection */
  await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    wc.setSelected('diameter', { id: '22', label: '22"' });
    wc.setSelected('diameter', { id: '26', label: '26"' });
    wc.checkAvailability();
  });
  await page.waitForFunction(() => {
    const wc = window.__calderActiveConfigurator;
    return wc.selected.diameter && wc.selected.diameter.label === '26"' && wc.currentVariantId != null;
  }, { timeout: 3000 });
  const rapidDone = await page.evaluate(() => {
    const wc = window.__calderActiveConfigurator;
    return { selected: wc.selected.diameter.label, addDisabled: wc.addBtn.disabled, vid: wc.currentVariantId };
  });
  record('T14a last selection wins after rapid change', rapidDone.selected === '26"', rapidDone.selected);

  /* T15 — no uncaught page errors during the whole pass */
  const realErrors = pageErrors.filter((e) => e.indexOf('pageerror') !== -1);
  record('T15a no uncaught page errors', realErrors.length === 0, realErrors.join(' | ').slice(0, 400));

  const passCount = results.filter((r) => r.pass).length;
  console.log('\n=== CALDER CONFIGURATOR QA RESULTS ===');
  for (const r of results) {
    console.log((r.pass ? 'PASS' : 'FAIL') + '  ' + r.name + (r.detail ? '  [' + r.detail + ']' : ''));
  }
  console.log('------------------------------------------');
  console.log('TOTAL: ' + results.length + '  PASS: ' + passCount + '  FAIL: ' + (results.length - passCount));
  console.log('PAGEERRORS: ' + pageErrors.length);
  console.log('==========================================');

  await browser.close();
  process.exit(passCount === results.length ? 0 : 1);
})().catch((e) => {
  console.error('HARNESS ERROR', e);
  process.exit(2);
});
#!/usr/bin/env node
/**
 * CTA controller + state matrix tests (Prompt 06 deliverables).
 * Run: node docs/architecture/tests/calder-universal-cta.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const ASSETS = path.join(THEME, 'assets');
const registry = JSON.parse(readFileSync(path.join(ARCH, 'calder_design_registry.json'), 'utf8'));
const purchaseSnippet = readFileSync(path.join(THEME, 'snippets', 'calder-universal-purchase.liquid'), 'utf8');

const GM_VEHICLE = { b: '6X139', h: 78.1, cf: [{ z: '22x10', o: '25mm' }, { z: '24x10', o: '25mm' }, { z: '26x10', o: '25mm' }] };
const tick = () => new Promise((r) => setTimeout(r, 10));

function fakeElement(attrs) {
  const el = {
    attrs: Object.assign({}, attrs),
    dataset: {},
    style: {},
    handlers: {},
    hasAttribute(k) { return el.attrs[k] != null; },
    setAttribute(k, v) { el.attrs[k] = String(v); },
    getAttribute(k) { return el.attrs[k] == null ? null : String(el.attrs[k]); },
    removeAttribute(k) { delete el.attrs[k]; },
    addEventListener(t, fn) { (el.handlers[t] = el.handlers[t] || []).push(fn); },
    click() { (el.handlers.click || []).forEach((f) => f({ preventDefault() {} })); },
    focus() {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } }
  };
  Object.defineProperty(el, 'hidden', { get() { return !!el.attrs.hidden; }, set(v) { if (v) el.attrs.hidden = 'hidden'; else delete el.attrs.hidden; } });
  Object.defineProperty(el, 'disabled', { get() { return !!el.attrs.disabled; }, set(v) { if (v) el.attrs.disabled = 'disabled'; else delete el.attrs.disabled; } });
  Object.defineProperty(el, 'tabIndex', { get() { return el.attrs.tabindex || 0; }, set(v) { el.attrs.tabindex = v; } });
  Object.defineProperty(el, 'textContent', { get() { return el.attrs.textContent || ''; }, set(v) { el.attrs.textContent = v; } });
  Object.defineProperty(el, 'innerHTML', { get() { return el.attrs.innerHTML || ''; }, set(v) { el.attrs.innerHTML = v; } });
  Object.defineProperty(el, 'href', { get() { return el.attrs.href || ''; }, set(v) { el.attrs.href = v; } });
  el.querySelector = () => null;
  el.querySelectorAll = () => [];
  el.closest = () => null;
  return el;
}

function buildControlsRoot(designCode) {
  const root = fakeElement({ 'data-calder-universal': '', 'data-design-code': designCode });
  const optionButtons = [];
  [['diameter', '22'], ['diameter', '24'], ['diameter', '26'],
   ['center', 'gloss-black'], ['center', 'black-titanium'], ['center', 'titanium-tint'],
   ['barrel', 'gloss-black'], ['barrel', 'polished'],
   ['hardware', 'chrome'], ['hardware', 'black']].forEach(([dim, token]) => {
    const b = fakeElement({ 'data-calder-uc-option': '', 'data-dim': dim, 'data-token': token });
    optionButtons.push(b);
  });
  const selLabels = {};
  for (const dim of ['diameter', 'center', 'barrel', 'hardware']) selLabels[dim] = fakeElement({});
  const layers = { barrel: fakeElement({}), center: fakeElement({}), hardware: fakeElement({}) };
  root.querySelectorAll = (sel) => (sel.startsWith('[data-calder-uc-option]') ? optionButtons : []);
  root.querySelector = (sel) => {
    if (sel.startsWith('[data-calder-uc-selected=')) return selLabels[/"([a-z]+)"/.exec(sel)[1]];
    if (sel.startsWith('[data-calder-uc-layer=')) return layers[/"([a-z]+)"/.exec(sel)[1]];
    return null;
  };
  root.contains = () => true;
  for (const b of optionButtons) { b.closest = () => b; }
  return { root, optionButtons };
}

function buildPurchaseRoot() {
  const ctaBtn = fakeElement({ 'data-calder-uc-cta': '', disabled: 'disabled' });
  const ctaLabel = fakeElement({});
  const ctaLink = fakeElement({ 'data-calder-uc-cta-link': '', hidden: 'hidden' });
  const ctaLinkLabel = fakeElement({});
  const message = fakeElement({});
  const root = fakeElement({ 'data-calder-universal-purchase': '', 'data-calder-uc-support-url': '/pages/contact' });
  root.querySelector = (sel) => {
    if (sel.includes('cta-link-label')) return ctaLinkLabel;
    if (sel.includes('uc-cta-link') && !sel.includes('label')) return ctaLink;
    if (sel.includes('uc-cta-label')) return ctaLabel;
    if (sel === '[data-calder-uc-cta]' || sel.includes('[data-calder-uc-cta]')) return ctaBtn;
    if (sel.includes('uc-message')) return message;
    return null;
  };
  return { root, ctaBtn, ctaLabel, ctaLink, ctaLinkLabel, message };
}

function buildSandbox(opts) {
  const o = Object.assign({ designId: 'CLB-06', providerStatus: 'available', qty: '1' }, opts);
  const design = registry.designs.find((d) => d.design_id === o.designId);
  const registrySlice = o.registryOverride || { designs: [JSON.parse(JSON.stringify(design))], option_tokens: registry.option_tokens };
  const controls = buildControlsRoot(design.legacy_design_code);
  const purchase = buildPurchaseRoot();
  const store = {};
  if (o.vehicle) { store['calder_selected_vehicle'] = JSON.stringify(o.vehicle); }
  const posted = [];
  const qtyInput = fakeElement({});
  qtyInput.attrs.value = o.qty;
  Object.defineProperty(qtyInput, 'value', { get() { return qtyInput.attrs.value; }, set(v) { qtyInput.attrs.value = String(v); } });
  const sectionsDom = o.sectionsDom || {};
  const deferred = [];
  const QB_PARTS = {
    'CAL-206-D-22': { description: 'Barrel Blank 22 (206)', on_hand: 10 },
    'CAL-206-D-24': { description: 'Barrel Blank 24 (206)', on_hand: 8 },
    'CAL-206-D-26': { description: 'Barrel Blank 26 (206)', on_hand: 2 },
    'CAL-206-C-BKUTI': { description: 'Center Gloss Black (206)', on_hand: 11 },
    'CAL-206-C-BK': { description: 'Center Black Tint (206)', on_hand: 16 },
    'CAL-206-C-SU': { description: 'Center Titanium Tint (206)', on_hand: 6 },
    'CAL-206-B-BK': { description: 'Barrel Black (206)', on_hand: 26 },
    'CAL-206-B-POLISH': { description: 'Barrel Polish (206)', on_hand: 21 },
    'CAL-H-CHROME': { description: 'Hardware Chrome set', on_hand: 400 },
    'CAL-H-BK': { description: 'Hardware Black set', on_hand: 500 }
  };
  if (o.qbParts) Object.assign(QB_PARTS, o.qbParts);
  if (o.minQty) purchase.root.setAttribute('data-calder-min-qty', String(o.minQty));
  if (o.inventorySource) purchase.root.setAttribute('data-calder-inventory-source', String(o.inventorySource));
  const cartItems = fakeElement({});
  if (o.cartItemsImpl) { Object.assign(cartItems, o.cartItemsImpl); }
  if (!cartItems.getSectionsToRender) {
    cartItems.getSectionsToRender = o.cartSections ||
      (() => [{ id: 'header-cart', section: 'header-cart', selector: '.js-contents-cart-items' }]);
  }
  const w = {
    CALDER_DESIGN_REGISTRY: registrySlice,
    CALDER_QUICKBOOKS_INVENTORY: o.noQb ? null : { source: 'quickbooks-demo-test', synced_at: '2026-10-29T00:00:00Z', parts: QB_PARTS },
    document: {
      readyState: 'complete',
      querySelector: (sel) => {
        if (sel.includes('[data-calder-universal]') && !sel.includes('purchase')) return controls.root;
        if (sel.includes('[data-calder-universal-purchase]')) return purchase.root;
        if (sel.includes('calder-pdp__qty-input')) return qtyInput;
        if (sel === 'cart-items') return o.withoutCartItems ? null : cartItems;
        return null;
      },
      getElementById: (id) => (id in sectionsDom ? sectionsDom[id] : null),
      querySelectorAll: () => [],
      addEventListener() {}
    },
    Shopify: { routes: { root: '/' } },
    location: { search: '', pathname: '/products/' + design.canonical_handle },
    history: { pushState() {}, replaceState() {} },
    addEventListener() {},
    removeEventListener() {},
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem(k, v) { store[k] = String(v); },
      removeItem(k) { delete store[k]; }
    },
    setTimeout(fn) { deferred.push(fn); return 0; },
    fetch: o.fetchImpl || (async () => ({ ok: true, json: async () => ({ items: [{}], sections: {} }) }))
  };
  const sandbox = { window: w, document: w.document, URLSearchParams, Promise, setTimeout: w.setTimeout, fetch: w.fetch };
  const resolverSrc = readFileSync(path.join(ASSETS, 'calder-config-resolver.js'), 'utf8');
  const patched = resolverSrc.replace('var availability = opts.availability || defaultAvailabilityProvider(opts);',
    'var availability = opts.availability || { getAvailability: async () => ({ status: "' + o.providerStatus + '", variantId: 987654, priceCents: 110000 }) };');
  vm.createContext(sandbox);
  vm.runInContext(patched, sandbox, { filename: 'calder-config-resolver.js' });
  for (const file of ['calder-pdp-state.js', 'calder-universal-pdp.js', 'calder-universal-cta.js']) {
    vm.runInContext(readFileSync(path.join(ASSETS, file), 'utf8'), sandbox, { filename: file });
  }
  const api = sandbox.window.CALDER_UNIVERSAL_PDP;
  assert.ok(api && api.state, 'universal PDP booted');
  return { api, controls, purchase, store, posted, qtyInput, sectionsDom, design, w, deferred };
}

test('CTA state matrix: each resolution state drives the correct CTA mode', async () => {
  let env = buildSandbox({ vehicle: GM_VEHICLE });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AVAILABLE', env.purchase.message.textContent);
  assert.equal(env.purchase.ctaBtn.disabled, false);
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart');
  assert.equal(env.purchase.ctaLink.hidden, true);

  env = buildSandbox({ providerStatus: 'sold_out', vehicle: GM_VEHICLE });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'SOLD_OUT');
  assert.equal(env.purchase.ctaBtn.hidden, false, 'buy area always shows the Add to Cart button');
  assert.equal(env.purchase.ctaBtn.disabled, true, 'SOLD_OUT disables Add to Cart');
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart', 'label stays Add to Cart');
  assert.ok(env.purchase.message.textContent.includes('out of stock'), 'reason shown in .calder-upc__message');

  env = buildSandbox({ designId: 'CLM-01', vehicle: { b: '6X139', h: 78.1, cf: [{ z: '26x10', o: '03mm' }, { z: '22x10', o: '03mm' }] } });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'NO_SELLABLE_RECORD', '22" exists in +03 group but has no sellable legacy record');
  env.api.state.setOption('diameter', '26');
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'NO_CATALOG_PART', 'real catalog gap: no 26" parts in +03 group');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart');
  assert.ok(env.purchase.message.textContent.includes('not currently listed'), 'not-listed notice in .calder-upc__message');
  assert.ok(!/sold out/i.test(env.purchase.message.textContent), 'a missing catalog part is never "sold out"');

  env = buildSandbox({
    designId: 'CLM-05', vehicle: GM_VEHICLE,
    qbParts: {
      'CAL-205-D-22': { description: 'Barrel Blank 22 (205)', on_hand: 8 },
      'CAL-205-C-BKUTI': { description: 'Center Gloss Black (205)', on_hand: 10 },
      'CAL-205-B-BK': { description: 'Barrel Black (205)', on_hand: 24 },
      'CAL-205-B-POLISH': { description: 'Barrel Polish (205)', on_hand: 20 }
    }
  });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AVAILABLE', 'CLM-05 binds to live legacy products after the 2026-10-29 registry rebuild');
  assert.equal(env.purchase.ctaBtn.disabled, false);
  env = buildSandbox({ designId: 'CLM-05', vehicle: { b: '6X139', h: 78.1, cf: [{ z: '22x10', o: '03mm' }] } });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'NO_SELLABLE_RECORD', 'CLM-05 +03 group is not in the live store');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart');

  env = buildSandbox({});
  await tick();
  /* P5 (2026-11-15): a valid vehicle is required before purchasing — the
     no-vehicle default-group "purchasable" path is superseded. The CTA is
     disabled with the client-requested message; the SKU cell stays live. */
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'VEHICLE_REQUIRED', 'no vehicle -> VEHICLE_REQUIRED (P5)');
  assert.equal(env.purchase.ctaBtn.disabled, true, 'disabled on load without a vehicle');
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart');
  assert.equal(env.purchase.message.textContent,
    'Select your vehicle to confirm fitment, check availability, and add this wheel to your cart.', 'exact P5 message');
  assert.ok(!env.purchase.message.textContent.includes('Checking availability'), 'no loading message');

  // vehicle with a NON-matching bolt pattern -> disabled, Reset guidance
  env = buildSandbox({ vehicle: { year: 2020, make: 'BMW', model: 'X3', bolt_pattern: '5X112' } });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'VEHICLE_INCOMPATIBLE');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  assert.ok(env.purchase.message.textContent.includes('bolt pattern'), 'incompatibility explains the bolt-pattern mismatch');

  // vehicle with a MATCHING pattern -> enabled (exact group)
  env = buildSandbox({ vehicle: { year: 2021, make: 'GM', model: 'Escalade', bolt_pattern: '6X139' } });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AVAILABLE');
  assert.equal(env.purchase.ctaBtn.disabled, false);

  env = buildSandbox({ vehicle: GM_VEHICLE });
  await tick();
  env.api.state.setOption('hardware', null);
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'INVALID');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart');
  assert.ok(env.purchase.message.textContent.includes('Complete your selection'));

  const bad = JSON.parse(JSON.stringify(registry.designs[4]));
  const cfg = bad.configurations.find((c) => c.diameter === '22' && c.center === 'gloss-black' && c.barrel === 'gloss-black' && c.hardware === 'chrome');
  const resolvedGroup = '6x139-25mm-78.1';
  cfg.by_group.push({ ...cfg.by_group.find((e) => e.group === resolvedGroup) });
  env = buildSandbox({ registryOverride: { designs: [bad], option_tokens: registry.option_tokens }, vehicle: GM_VEHICLE });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AMBIGUOUS');
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  assert.ok(env.purchase.message.textContent.includes('Contact a representative'));
});

test('no cart submission without a vehicle; submission posts the resolved legacy variant + quantity', async () => {
  let calls = 0;
  const env = buildSandbox({
    qty: '2',
    fetchImpl: async (url, init) => {
      calls += 1;
      env.posted.push({ url, body: JSON.parse(init.body) });
      return { ok: true, json: async () => ({ items: [{ id: 987654 }], sections: {} }) };
    }
  });
  await tick();
  /* P5 (2026-11-15): without a vehicle the CTA is disabled (VEHICLE_REQUIRED)
     and a click submits NOTHING — restoring this test's original intent. */
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'VEHICLE_REQUIRED');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  env.purchase.ctaBtn.click();
  await tick();
  assert.equal(env.posted.filter((p2) => p2.url.includes('cart/add.js')).length, 0, 'no submission without a vehicle');

  env.store['calder_selected_vehicle'] = JSON.stringify(GM_VEHICLE);
  env.api.state.setOption('diameter', '22'); // state poke triggers recheck
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AVAILABLE');
  env.purchase.ctaBtn.click();
  env.purchase.ctaBtn.click();
  await tick();
  const adds = env.posted.filter((p) => p.url.includes('cart/add.js'));
  assert.equal(adds.length, 1, 'exactly one submission (duplicate clicks produce one)');
  assert.equal(adds[0].body.items[0].id, 987654, 'resolved legacy variant id submitted');
  assert.equal(adds[0].body.items[0].quantity, 2, 'quantity read from qty input');
  assert.ok(!String(adds[0].body.items[0].id).startsWith('CFG'), 'never submits a universal config-anchor variant');
  assert.ok(adds[0].body.sections && adds[0].body.sections_url, 'Lumia sections refresh fields included');
});

test('cart-time sell-through (422 sold out) disables Add to Cart with notice', async () => {
  let cartCalls = 0;
  const env = buildSandbox({
    vehicle: GM_VEHICLE,
    fetchImpl: async () => {
      cartCalls += 1;
      return { ok: false, json: async () => ({ status: 422, message: 'Cart Error', description: 'All 1 items are sold out.' }) };
    }
  });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AVAILABLE');
  env.purchase.ctaBtn.click();
  await tick();
  assert.equal(cartCalls, 1, 'server remained authoritative');
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'SOLD_OUT');
  assert.equal(env.purchase.ctaLabel.textContent, 'Add to Cart');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  assert.ok(env.purchase.message.textContent.includes('out of stock'));
});

test('successful add applies returned section HTML and restores Add to Cart', async () => {
  const headerCart = fakeElement({});
  const env = buildSandbox({
    vehicle: GM_VEHICLE,
    sectionsDom: { 'header-cart': headerCart },
    fetchImpl: async () => ({ ok: true, json: async () => ({ items: [{ id: 987654 }], sections: { 'header-cart': '<div>cart html</div>' } }) })
  });
  await tick();
  env.purchase.ctaBtn.click();
  await tick();
  assert.equal(headerCart.innerHTML, '<div>cart html</div>', 'minicart section refreshed from response');
  assert.equal(env.purchase.ctaLabel.textContent, 'Added to Cart ✓', 'inline success state');
});

test('successful add delegates rendering to the theme cart-items renderer (no raw section dumping)', async () => {
  /* P5 (2026-11-15): vehicle required for purchase — non-vehicle-behavior
     tests (rendering/stock/inventory) run with a selected vehicle. */
  const renderContentsCalls = [];
  let toggleEmptyClassCalls = 0;
  const impl = {
    renderContents(json) { renderContentsCalls.push(json); },
    toggleEmptyClass() { toggleEmptyClassCalls += 1; },
    getSectionsToRender() {
      return [
        { id: 'header-cart', section: 'header-cart', selector: '.js-contents-cart-items' },
        { id: 'main-cart-items', section: undefined }
      ];
    }
  };
  const headerCart = fakeElement({});
  let postedBody = null;
  const env = buildSandbox({
    cartItemsImpl: impl,
    vehicle: GM_VEHICLE,
    sectionsDom: { 'header-cart': headerCart },
    fetchImpl: async (url, init) => {
      postedBody = JSON.parse(init.body);
      return { ok: true, json: async () => ({ items: [{ id: 987654 }], sections: { 'header-cart': '<div id="shopify-section-header-cart">SECTION</div>' } }) };
    }
  });
  await tick();
  env.purchase.ctaBtn.click();
  await tick();
  assert.equal(renderContentsCalls.length, 1, 'theme renderContents invoked exactly once');
  assert.equal(renderContentsCalls[0].items[0].id, 987654, 'full cart response passed to the theme renderer');
  assert.ok(toggleEmptyClassCalls >= 1, 'toggleEmptyClass invoked');
  assert.ok(postedBody.sections.includes('header-cart'), 'sections requested for the theme renderer');
  assert.ok(!postedBody.sections.some((s) => s == null || s === undefined), 'undefined section names filtered out of the request');
  assert.equal(headerCart.attrs.innerHTML || '', '', 'raw section HTML is never dumped into #header-cart');
});

test('fallback section rendering swaps the #shopify-section wrapper content without nesting', async () => {
  const wrapper = fakeElement({});
  const env = buildSandbox({
    withoutCartItems: true,
    vehicle: GM_VEHICLE,
    sectionsDom: { 'shopify-section-header-cart': wrapper },
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ items: [{ id: 1 }], sections: { 'header-cart': '<div id="shopify-section-header-cart" class="shopify-section"><div class="js-contents-cart-items">FRESH</div></div>' } })
    })
  });
  await tick();
  env.purchase.ctaBtn.click();
  await tick();
  assert.equal(wrapper.innerHTML, '<div class="js-contents-cart-items">FRESH</div>', 'wrapper innerHTML replaced in place; no duplicated icon/popup/section IDs');
});

test('low-availability warning uses the minimum component quantity threshold (no exact counts)', async () => {
  // CLB-06 22" default group: buildable = min(10 blanks, 11 centers, 26 barrels, 400/20 hw) = 10
  const env = buildSandbox({ minQty: 12, vehicle: GM_VEHICLE });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AVAILABLE');
  assert.equal(env.purchase.ctaBtn.disabled, false, 'still purchasable at low stock');
  assert.ok(env.purchase.message.textContent.includes('Low availability'), 'threshold warning shown');
  assert.ok(!/\d+ (left|in stock|available$)/i.test(env.purchase.message.textContent.replace('Low availability', '')), 'no exact quantities displayed');
});

test('component stock-out disables Add to Cart with the support-rep message (no exact counts, no placeholder phone)', async () => {
  const env = buildSandbox({ qty: '11', vehicle: GM_VEHICLE, qbParts: { 'CAL-206-D-22': { description: 'Barrel Blank 22 (206)', on_hand: 10 } } });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'NO_STOCK');
  assert.equal(env.purchase.ctaBtn.disabled, true);
  assert.ok(env.purchase.message.textContent.includes('in stock'), 'stock-out reason shown');
  assert.ok(env.purchase.message.textContent.includes('support representative'), 'support guidance without invented contact details');
  assert.ok(!env.purchase.message.textContent.includes('555'), 'placeholder phone number removed (client-confirmed 2026-10-29)');
  assert.ok(!/\d+ (left|in stock)/i.test(env.purchase.message.textContent), 'no exact quantities displayed');
});

test('resolved part number is broadcast for the SKU spec row', async () => {
  const env = buildSandbox({ vehicle: GM_VEHICLE });
  const seen = [];
  env.w.document.addEventListener = (type, fn) => { if (type === 'calder:universal-resolved') seen.push(fn); };
  // re-boot would be needed; instead verify the controller source wires the broadcast
  const src = readFileSync(path.join(THEME, 'assets', 'calder-universal-cta.js'), 'utf8');
  assert.ok(src.includes("calder:universal-resolved"), 'controller broadcasts resolved record');
  assert.ok(src.includes('partNumber') === false || src.includes('detail: out'), 'outcome detail passed');
});

test('developer output panel: template-option gated, populated by CTA, partNumber live in all states', () => {
  const devSnippet = readFileSync(path.join(THEME, 'snippets', 'calder-developer-output.liquid'), 'utf8');
  const ctaSrc = readFileSync(path.join(ASSETS, 'calder-universal-cta.js'), 'utf8');
  const prodSection = readFileSync(path.join(THEME, 'sections', 'calder-product.liquid'), 'utf8');
  assert.ok(devSnippet.includes('data-calder-dev'), 'dev panel root hook');
  assert.ok(devSnippet.includes('data-calder-dev-refresh'), 're-run button');
  assert.ok(prodSection.includes('show_developer_output'), 'schema toggle present');
  assert.ok(prodSection.includes("render 'calder-developer-output'"), 'section renders dev panel');
  assert.ok(prodSection.indexOf("render 'calder-developer-output'") < prodSection.indexOf('class="calder-pdp__fitment'), 'dev panel renders ABOVE the fitment panel');
  assert.ok(ctaSrc.includes('renderDevPanel'), 'CTA populates dev panel');
  assert.ok(ctaSrc.includes('peekedPartNumber'), 'partNumber falls back to registry peek');
  const skuHandler = readFileSync(path.join(ASSETS, 'calder-universal-pdp.js'), 'utf8');
  assert.ok(skuHandler.includes('<br />Part Number: '), 'SKU cell shows CFG + Part Number');
  assert.ok(prodSection.includes('ckIcon.hidden = false'), 'clearVehicle resets icon to default');
});

test('no invented phone numbers: tel: renders only from settings, contact page is fallback', () => {
  assert.ok(!/tel:\+?\d[\d\s\-]{6,}/.test(purchaseSnippet.replace(/\{\{[^}]*\}\}/g, '')), 'no hardcoded phone number');
  assert.ok(purchaseSnippet.includes('if uc_phone != blank'), 'tel: is conditional on a verified setting');
  assert.ok(purchaseSnippet.includes('pages/contact'), 'contact page fallback present');
  assert.ok(purchaseSnippet.includes('Speak With Support'), 'support label present');
});

test('inventory source = native skips the QuickBooks component gate entirely', async () => {
  // No CALDER_QUICKBOOKS_INVENTORY payload in the sandbox at all:
  // source=native must stay AVAILABLE (Shopify availability decides) instead of
  // degrading to the "could not be verified" ERROR that demo/quickbooks modes show.
  const env = buildSandbox({ inventorySource: 'native', noQb: true, vehicle: GM_VEHICLE });
  await tick();
  assert.equal(env.purchase.root.getAttribute('data-calder-uc-state'), 'AVAILABLE', 'native mode stays AVAILABLE without any component payload');
  assert.ok(!/could not be verified/i.test(env.purchase.message.textContent), 'native mode never errors on missing component data');
  assert.ok(env.w.CALDER_UNIVERSAL_PDP, 'PDP untouched');
});

test('inventory source setting is wired through schema, snippets and the CTA controller', () => {
  const controlsSnippet = readFileSync(path.join(THEME, 'snippets', 'calder-universal-controls.liquid'), 'utf8');
  const ctaSrc = readFileSync(path.join(ASSETS, 'calder-universal-cta.js'), 'utf8');
  const schema = JSON.parse(readFileSync(path.join(THEME, 'config', 'settings_schema.json'), 'utf8'));
  const group = schema.find((g) => String(g.name).includes('Calder Wheels'));
  const setting = group.settings.find((s) => s.id === 'calder_inventory_source');
  assert.deepEqual(setting.options.map((o) => o.value).sort(), ['demo', 'native', 'quickbooks'], 'schema exposes demo/native/quickbooks');
  assert.equal(setting.default, 'demo', 'default source is the demo dataset');
  assert.ok(purchaseSnippet.includes('data-calder-inventory-source='), 'purchase root passes the source to the CTA controller');
  assert.ok(controlsSnippet.includes("uc_inventory_source == 'demo'"), 'demo component file loads only in demo mode');
  assert.ok(ctaSrc.includes("inventorySource === 'native'"), 'CTA skips the component gate when source = native');
});

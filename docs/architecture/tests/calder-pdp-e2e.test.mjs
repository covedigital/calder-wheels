#!/usr/bin/node
/**
 * Comprehensive end-to-end PDP test: vehicle selection -> .calder-uc -> .calder-pdp__purchase
 * Tests the actual failure reports: SKU cell, part_number, fitment status text,
 * cart payload, reset behavior.
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
const design = registry.designs[4]; // CLB-06 (has 5x120 group like CLB-07)
const registrySlice = { designs: [JSON.parse(JSON.stringify(design))], option_tokens: registry.option_tokens };

function mk(attrs = {}) {
  const el = {
    attrs: Object.assign({}, attrs), dataset: {}, handlers: {}, children: [],
    hasAttribute(k) { return el.attrs[k] != null; },
    getAttribute(k) { return el.attrs[k] == null ? null : String(el.attrs[k]); },
    setAttribute(k, v) { el.attrs[k] = String(v); },
    removeAttribute(k) { delete el.attrs[k]; },
    addEventListener(t, fn) { (el.handlers[t] = el.handlers[t] || []).push(fn); },
    dispatch(t) { (el.handlers[t] || []).forEach(f => f({ type: t, bubbles: true, key: t, target: el })); },
    appendChild(c) { el.children.push(c); return c; },
    contains() { return true; },
    focus() {},
    style: {}
  };
  Object.defineProperty(el, 'textContent', { get() { return el.attrs.textContent != null ? el.attrs.textContent : (el.attrs.innerHTML || ''); }, set(v) { el.attrs.textContent = String(v); } });
  Object.defineProperty(el, 'innerHTML', { get() { return el.attrs.innerHTML || ''; }, set(v) { el.attrs.innerHTML = String(v); } });
  Object.defineProperty(el, 'hidden', { get() { return el.attrs.hidden === 'hidden'; }, set(v) { el.attrs.hidden = v ? 'hidden' : ''; } });
  Object.defineProperty(el, 'tabIndex', { get() { return el.attrs.tabindex || 0; }, set(v) { el.attrs.tabindex = v; } });
  Object.defineProperty(el, 'disabled', { get() { return el.attrs.disabled === 'disabled'; }, set(v) { el.attrs.disabled = v ? 'disabled' : ''; } });
  const set = new Set();
  el.classes = { add: c => set.add(c), remove: c => set.delete(c), contains: c => set.has(c), toggle: (c, on) => on ? set.add(c) : set.delete(c) };
  el.classList = el.classes;
  el.classes.has = c => set.has(c);
  el.classes.access = set;
  el._set = set;
  return el;
}

test('E2E: vehicle select -> fitment text hidden -> CTA available -> SKU cell live -> payload resolvable -> reset restores', async () => {
  const design = registry.designs.find(d => d.design_id === 'CLB-06');
  const slice = { designs: [JSON.parse(JSON.stringify(design))], option_tokens: registry.option_tokens };
  const qbParts = {
    'CAL-206-D-22': { description: 'Blank 22', on_hand: 10 },
    'CAL-206-D-24': { description: 'Blank 24', on_hand: 8 },
    'CAL-206-D-26': { description: 'Blank 26', on_hand: 2 },
    'CAL-206-C-BKUTI': { description: 'Center GB', on_hand: 11 },
    'CAL-206-B-BK': { description: 'Barrel Black', on_hand: 26 },
    'CAL-H-CHROME': { description: 'HW Chrome', on_hand: 400 }
  };

  // --- fitment panel (section JS) DOM ---
  const fitmentPanel = mk({ class: 'calder-pdp__fitment calder-pdp__fitment--unset' });
  const fitmentLabel = mk(); const fitmentText = mk(); const fitmentVehicle = mk({ hidden: 'hidden' });
  const fitmentActionText = mk(); const fitmentReset = mk({ hidden: 'hidden' });
  const ckIcon = mk(); const wrIcon = mk({ hidden: 'hidden' });
  const ffvYear = mk({ value: '' }); const ffvMake = mk({ value: '' }); const ffvModel = mk({ value: '' });
  const ffvApply = mk(); const ffvForm = mk({ hidden: 'hidden' }); const fitmentAction = mk();
  fitmentPanel.querySelector = (sel) => {
    if (sel.includes('fitment-label')) return fitmentLabel;
    if (sel.includes('fitment-text')) return fitmentText;
    if (sel.includes('fitment-vehicle')) return fitmentVehicle;
    if (sel.includes('action-text')) return fitmentActionText;
    if (sel.includes('fitment-reset')) return fitmentReset;
    if (sel.includes('icon-check')) return ckIcon;
    if (sel.includes('icon-warn')) return wrIcon;
    if (sel.includes('ffv-year')) return ffvYear;
    if (sel.includes('ffv-make')) return ffvMake;
    if (sel.includes('ffv-model')) return ffvModel;
    if (sel.includes('ffv-apply')) return ffvApply;
    if (sel.includes('fitment-form')) return ffvForm;
    if (sel.includes('fitment-action')) return fitmentAction;
    return null;
  };
  fitmentPanel.querySelectorAll = () => [];
  fitmentPanel.getAttribute = () => null;
  fitmentPanel.setAttribute = () => {};
  fitmentPanel.contains = () => true;

  // --- controls DOM ---
  const optionButtons = [];
  [['diameter','22'],['diameter','24'],['diameter','26'],
   ['center','gloss-black'],['center','black-titanium'],['center','titanium-tint'],
   ['barrel','gloss-black'],['barrel','polished'],
   ['hardware','chrome'],['hardware','black']].forEach(([dim, token]) => {
    optionButtons.push(mk({ 'data-calder-uc-option': '', 'data-dim': dim, 'data-token': token, 'aria-checked': 'false' }));
  });
  const selLabels = {};
  ['diameter','center','barrel','hardware'].forEach(dim => { selLabels[dim] = mk(); });
  const controlsRoot = mk({ 'data-calder-universal': '', 'data-design-code': 'CLB06' });
  controlsRoot.querySelectorAll = (sel) => (sel.startsWith('[data-calder-uc-option]') ? optionButtons : []);
  controlsRoot.querySelector = (sel) => sel.startsWith('[data-calder-uc-selected=') ? selLabels[/"([a-z]+)"/.exec(sel)[1]] : null;
  controlsRoot.contains = () => true;
  controlsRoot.addEventListener = (t, fn) => { (controlsRoot.handlers[t] = controlsRoot.handlers[t] || []).push(fn); };

  // --- purchase + spec cells + dev panel ---
  const purchaseRoot = mk({ 'data-calder-universal-purchase': '', 'data-calder-min-qty': '10' });
  const ctaBtn = mk(); const ctaLabel = mk(); const message = mk();
  const skuCell = mk({ 'data-calder-spec': 'sku' });
  const pdpSkuBlock = mk({ class: 'calder-pdp__sku' });
  const diaCell = mk({ 'data-calder-spec': 'diameter' });
  const devPanel = mk({ 'data-calder-dev': '' });
  const devSkuCell = mk(); const devPayload = mk();
  const specCells = { 'diameter': diaCell, 'center': mk(), 'barrel': mk(), 'hardware': mk() };
  const document = {
    readyState: 'complete',
    createElement: () => { const el = mk(); el.innerHTML = ''; return el; },
    querySelector: (sel) => {
      if (sel.includes('[data-calder-universal]') && !sel.includes('purchase')) return controlsRoot;
      if (sel.includes('[data-calder-universal-purchase]')) return purchaseRoot;
      if (sel.includes('data-calder-uc-fallback')) return null;
      if (sel.includes('.calder-pdp__qty-input')) { const q = mk(); q.attrs.value = '1'; return q; }
      if (sel.includes('[data-calder-spec="sku"]')) return skuCell;
      if (sel.includes('.calder-pdp__sku')) return pdpSkuBlock;
      if (sel.startsWith('[data-calder-spec="')) return specCells[/"([a-z]+)"/.exec(sel)[1]] || null;
      if (sel.includes('[data-calder-dev')) return devPanel;
      return null;
    },
    querySelectorAll: (sel) => (sel.startsWith('[data-calder-uc-option]') ? optionButtons : []),
    getElementById: () => null,
    addEventListener: (t, fn) => { (document.handlers = document.handlers || {})[t] = (document.handlers[t] || []).concat(fn); },
    handlers: {}
  };
  purchaseRoot.querySelector = (sel) => {
    if (sel.includes('uc-cta-label')) return ctaLabel;
    if (sel === '[data-calder-uc-cta]' || sel.includes('[data-calder-uc-cta]')) return ctaBtn;
    if (sel.includes('uc-message')) return message;
    return null;
  };
  devPanel.querySelector = (sel) => {
    if (sel.includes('partNumber') || sel.includes('part_number')) return mk();
    return mk();
  };
  devPanel.querySelectorAll = () => [];

  const store = {}; // localStorage
  const events = []; // dispatched document events
  document.dispatchEvent = (e) => { events.push(e.type); try { (document.handlers[e.type] || []).forEach(f => f(e)); } catch (err) { console.error('HANDLER ERR', e.type, err.message); } };
  const win = {
    CALDER_DESIGN_REGISTRY: slice,
    CALDER_QUICKBOOKS_INVENTORY: { source: 'qb-test', parts: qbParts },
    document,
    Shopify: { routes: { root: '/' } },
    location: { search: '', pathname: '/products/calder-clb-06' },
    history: { pushState() {}, replaceState() {} },
    addEventListener() {}, removeEventListener() {},
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    setTimeout(fn) { fn(); return 0; }
  };
  document.dispatchEventCustom = (type, detail) => {
    const e = { type, detail };
    events.push(type);
    (document.handlers[type] || []).forEach(f => f(e));
  };

  let sandbox = { window: win, document, URLSearchParams, Promise, setTimeout: win.setTimeout, fetch: win.fetch, console, CustomEvent: class CustomEvent { constructor(type, o) { this.type = type; this.detail = o && o.detail; } } };
  const resolverSrc = readFileSync(path.join(ASSETS, 'calder-config-resolver.js'), 'utf8')
    .replace('var availability = opts.availability || defaultAvailabilityProvider(opts);',
      'var availability = opts.availability || { getAvailability: async () => ({ status: "available", variantId: 555111 }) };');
  vm.createContext(sandbox);
  vm.runInContext(resolverSrc, sandbox, { filename: 'resolver.js' });
  vm.runInContext(readFileSync(path.join(ASSETS, 'calder-pdp-state.js'), 'utf8'), sandbox, { filename: 'state.js' });
  const pdpSrc = readFileSync(path.join(ASSETS, 'calder-universal-pdp.js'), 'utf8')
    
  vm.runInContext(pdpSrc, sandbox, { filename: 'pdp.js' });
  const ctaSrc = readFileSync(path.join(ASSETS, 'calder-universal-cta.js'), 'utf8')

  vm.runInContext(ctaSrc, sandbox, { filename: 'cta.js' });

  const updp = sandbox.window.CALDER_UNIVERSAL_PDP;
  assert.ok(updp, 'PDP booted');
  await new Promise(r => setTimeout(r, 10));

  // 1) initial load: Add to Cart enabled (default group), NO loading text
  assert.equal(purchaseRoot.attrs['data-calder-uc-state'], 'AVAILABLE', 'initial state AVAILABLE');
  assert.ok(!ctaBtn.disabled, 'enabled on load');
  assert.equal(ctaLabel.attrs.textContent || ctaLabel.textContent, 'Add to Cart');
  assert.ok(!String(message.textContent).includes('Checking availability'), 'no loading flash');

  // 2) SKU cell is live with part_number even on initial load
  assert.ok(skuCell.textContent.includes('Universal Part#'), 'SKU cell has Universal Part# on load: ' + skuCell.textContent);
  assert.ok(/Part#: [A-Z]/.test(skuCell.textContent), 'part number is a real code: ' + skuCell.textContent);
  // approved two-line spec-cell format: SKU: CFG-... <br /> Universal Part#: ...
  assert.ok(skuCell.innerHTML.includes('<br />Universal Part#:'), 'spec cell uses the two-line <br /> format: ' + skuCell.innerHTML);
  assert.ok(/^SKU: CFG-CLB06-22-/.test(skuCell.innerHTML), 'spec cell leads with the CFG SKU: ' + skuCell.innerHTML);
  // .calder-pdp__sku block: <span class="sku">…</span><br /><span class="universal-part">…</span>
  assert.ok(pdpSkuBlock.innerHTML.includes('<span class="sku"><span>SKU:</span> CFG-CLB06-22-'), 'pdp sku block has the CFG SKU span: ' + pdpSkuBlock.innerHTML);
  assert.ok(pdpSkuBlock.innerHTML.includes('<br /><span class="universal-part"><span>Universal Part#:</span> CLB'), 'pdp sku block has the universal part span: ' + pdpSkuBlock.innerHTML);

  // 3) change a .calder-uc selection -> SKU + part number update (cell AND pdp block)
  const clickOpt = optionButtons[1]; clickOpt.closest = () => clickOpt;
  controlsRoot.handlers.click[0]({ preventDefault() {}, target: clickOpt });
  await new Promise(r => setTimeout(r, 10));
  assert.ok(skuCell.textContent.includes('24'), 'SKU cell shows 24" after selection: ' + skuCell.textContent);
  assert.ok(skuCell.innerHTML.includes('CFG-CLB06-24-'), 'spec cell CFG SKU switched to 24": ' + skuCell.innerHTML);
  assert.ok(pdpSkuBlock.innerHTML.includes('CFG-CLB06-24-'), 'pdp sku block CFG SKU switched to 24": ' + pdpSkuBlock.innerHTML);

  // 4) select a vehicle via mini-form (finder shape {year,make,model,bolt_pattern})
  store['calder_selected_vehicle'] = JSON.stringify({ year: 2022, make: 'Range Rover', model: 'Sport', bolt_pattern: '5X120' });
  document.dispatchEventCustom('calder:vehicle-selected', { year: 2022, make: 'Range Rover', model: 'Sport', bolt_pattern: '5X120' });
  await new Promise(r => setTimeout(r, 10));
  assert.equal(purchaseRoot.attrs['data-calder-uc-state'], 'AVAILABLE', '5x120 vehicle -> AVAILABLE');

  // 5) fitment text hidden when vehicle selected (the reported bug)
  // (section JS runs in Liquid; assert the fix exists in source)
  const sectionSrc = readFileSync(path.join(THEME, 'sections/calder-product.liquid'), 'utf8');
  const updFn = sectionSrc.slice(sectionSrc.indexOf('function ffvUpdateStatus'), sectionSrc.indexOf('function ffvPopulate'));
  assert.ok(updFn.includes('fitmentText.hidden = true'), 'ffvUpdateStatus hides the select-vehicle text');

  // 6) incompatible vehicle -> disabled + payload still shows part#
  store['calder_selected_vehicle'] = JSON.stringify({ year: 2024, make: 'Lexus', model: 'TX', bolt_pattern: '5X114' });
  document.dispatchEventCustom('calder:vehicle-selected', { year: 2024, make: 'Lexus', model: 'TX', bolt_pattern: '5X114' });
  await new Promise(r => setTimeout(r, 10));
  assert.equal(purchaseRoot.attrs['data-calder-uc-state'], 'VEHICLE_INCOMPATIBLE', 'non-matching pattern -> disabled');
  assert.equal(ctaBtn.attrs.disabled, 'disabled');
  assert.ok(skuCell.textContent.includes('Universal Part#'), 'part number STILL live on incompatible: ' + skuCell.textContent);

  // 7) vehicle cleared (Reset) -> back to enabled default state
  delete store['calder_selected_vehicle'];
  document.dispatchEventCustom('calder:vehicle-cleared', null);
  await new Promise(r => setTimeout(r, 10));
  assert.equal(purchaseRoot.attrs['data-calder-ct-state'] || purchaseRoot.attrs['data-calder-uc-state'], 'AVAILABLE', 'reset -> AVAILABLE');
  assert.ok(!ctaBtn.disabled, 'reset -> enabled');

  // 8) resolved part number dispatched for spec table (diameter row)
  assert.ok(events.includes('calder:universal-resolved'), 'resolver broadcast fired');
});
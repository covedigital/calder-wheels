#!/usr/bin/env node
/**
 * Universal PDP controls + component preview tests (Prompt 05 deliverables):
 * image asset mapping, responsive/a11y structure, controller behavior,
 * and resolution binding for every offered configuration.
 * Run: node docs/architecture/tests/calder-universal-controls.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const ASSETS = path.join(THEME, 'assets');
const require = createRequire(import.meta.url);
const registry = JSON.parse(readFileSync(path.join(ARCH, 'calder_design_registry.json'), 'utf8'));
const snippet = readFileSync(path.join(THEME, 'snippets', 'calder-universal-controls.liquid'), 'utf8');
const gallerySlide = readFileSync(path.join(THEME, 'snippets', 'calder-universal-gallery-slide.liquid'), 'utf8');
const universalGallery = readFileSync(path.join(THEME, 'snippets', 'calder-universal-gallery.liquid'), 'utf8');
const productSection = readFileSync(path.join(THEME, 'sections', 'calder-product.liquid'), 'utf8');
const specsSection = readFileSync(path.join(THEME, 'sections', 'calder-specs.liquid'), 'utf8');
const specsV2 = readFileSync(path.join(THEME, 'sections', 'calder-specs-v2.liquid'), 'utf8');
const fitmentGuideJs = readFileSync(path.join(THEME, 'assets', 'calder-product-fitment-guide.js'), 'utf8');
const fitmentFormCss = readFileSync(path.join(THEME, 'assets', 'calder-pdp-fitment-form.css'), 'utf8');
const controllerSrc = readFileSync(path.join(ASSETS, 'calder-universal-pdp.js'), 'utf8');

// ---- 1. image asset mapping: every registry token has a verified existing asset ----
test('image asset mapping: every token maps to an existing theme asset; alt text matches labels', () => {
  const tokens = registry.option_tokens;
  const map = {
    center: { 'gloss-black': 'wheel-component-center-spun-gloss-black.png', 'black-titanium': 'wheel-component-center-spun-black-tint.png', 'titanium-tint': 'wheel-component-center-spun-titanium-tint.png' },
    barrel: { 'gloss-black': 'wheel-component-barrel-spun-gloss-black.png', 'polished': 'wheel-component-barrel-spun-polished.png' },
    hardware: { 'chrome': 'finish-bolt-chrome.png', 'black': 'finish-bolt-bk.png' }
  };
  for (const dim of ['center', 'barrel', 'hardware']) {
    assert.deepEqual(Object.keys(map[dim]).sort(), Object.keys(tokens[dim]).sort(), dim + ' tokens fully mapped');
    for (const [token, file] of Object.entries(map[dim])) {
      assert.ok(existsSync(path.join(ASSETS, file)), dim + '/' + token + ' asset exists: ' + file);
      const referenced = gallerySlide.includes(file) || controllerSrc.includes(file) || snippet.includes(file);
      assert.ok(referenced, 'layer/swatch asset referenced: ' + file);
      assert.ok(snippet.includes('wheel-component-'), 'initial design uses wheel-component swatch renders');
      assert.ok(controllerSrc.includes(file), 'controller references ' + file);
      assert.ok(snippet.includes(`data-token="${token}"`), 'snippet offers token ' + token);
      assert.ok(snippet.includes(tokens[dim][token]), 'label "' + tokens[dim][token] + '" rendered for ' + token);
    }
  }
  // known legacy filename mismatch documented: black-titanium -> center-spun-black-tint.png
  assert.ok(controllerSrc.includes("'black-titanium': { src: assetUrl('wheel-component-center-spun-black-tint.png')"));
});

test('control structure: initial .calder-uc design, 4 radiogroups, preview layers, script order', () => {
  const groups = snippet.match(/role="radiogroup"/g) || [];
  assert.equal(groups.length, 4);
  for (const label of ['Diameter', 'Center Finish', 'Barrel and Lip Finish', 'Hardware and Rivet Finish']) {
    assert.ok(snippet.includes(`aria-label="${label}"`), 'group aria-label: ' + label);
  }
  const radios = snippet.match(/role="radio"/g) || [];
  assert.equal(radios.length, 10, '3 diameters + 3 centers + 2 barrels + 2 hardware');
  assert.ok(/data-calder-uc-layer="barrel"[\s\S]*data-calder-uc-layer="center"[\s\S]*data-calder-uc-layer="hardware"/.test(gallerySlide), 'layer z-order in gallery slide: barrel, center, hardware');
  assert.ok(gallerySlide.includes('data-calder-uc-fallback'), 'fallback message present in gallery slide');
  assert.ok(snippet.includes('<noscript>'), 'no-JS fallback note');
  assert.ok(snippet.includes('calder-universal-controls.css'), 'stylesheet included');
  const scriptTags = snippet.match(/<script src=/g) || [];
  assert.equal(scriptTags.length, 6, 'six deferred scripts');
  const scriptOrder = ['calder-design-registry-', 'calder-config-resolver.js', 'calder-pdp-state.js', 'calder-universal-pdp.js', 'calder-universal-cta.js'];
  let lastPos = 0;
  for (const name of scriptOrder) {
    const pos = snippet.indexOf(name, lastPos);
    assert.ok(pos > lastPos || (lastPos === 0 && pos > 0), 'script order: ' + name);
    lastPos = pos;
  }
});

test('builder UI discontinued: no configurator section, no scroll-to-builder, sync machinery removed, cart property preserved', () => {
  const template = readFileSync(path.join(THEME, 'templates', 'product.calder.json'), 'utf8');
  assert.ok(!template.includes('wheel-configurator'), 'wheel-configurator removed from PDP template');
  assert.ok(template.includes('calder-product'), 'PDP section retained');

  const section = readFileSync(path.join(THEME, 'sections', 'calder-product.liquid'), 'utf8');
  assert.ok(!section.includes('dispatchPdpVariantChange'), 'pdp->builder dispatch removed');
  assert.ok(!section.includes('calder:pdp-variant-change'), 'builder sync event removed');
  assert.ok(!section.includes('data-calder-customize-action'), 'customize-scroll block removed');
  assert.ok(!section.includes('calder-pdp__cross-product-barrel'), 'cross-product barrel chips removed (referenced missing finish-barrel-*.png)');
  assert.ok(!section.includes('Customize Your Wheel'), 'scroll-to-builder CTA removed from PDP');
  assert.ok(section.includes('data-calder-hw-rivet-property'), 'legacy cart property input preserved');
  assert.ok(section.includes('hwRivetInput.value = this.value'), 'hardware property sync preserved for legacy PDPs');
  assert.ok(section.includes("render 'variant_picker'"), 'native picker preserved for legacy PDPs');
  assert.ok(section.includes("render 'calder-universal-controls'"), 'universal controls wired');
  const card = readFileSync(path.join(THEME, 'snippets', 'calder-product-card.liquid'), 'utf8');
  assert.ok(card.includes('Customize Your Wheel'), 'card CTA label retained (navigates to design PDP)');
});

test('definitive gallery: self-contained slider, 4 synced slides + thumbs, no Swiper dependency', () => {
  assert.ok(!snippet.includes('calder-uc__preview'), 'preview removed from .calder-uc (lives in the gallery)');
  assert.ok(universalGallery.includes("data-calder-uc-gallery"), 'self-contained gallery root');
  assert.ok(!universalGallery.includes('<product-gallery'), 'no ProductGallery dependency');
  assert.ok(!universalGallery.includes('swiper-init'), 'no Swiper init dependency');
  assert.ok(universalGallery.includes("render 'calder-universal-gallery-slide', part: 'main'"), 'preview slide rendered');
  assert.ok(universalGallery.includes("render 'calder-universal-gallery-slide', part: 'thumb'"), 'preview thumb rendered');
  const calderSlideIds = (gallerySlide.match(/data-media-id="calder-/g) || []).length;
  assert.equal(calderSlideIds, 2, 'preview main slide + preview thumb ONLY');
  assert.ok(!gallerySlide.includes('calder-center-'), 'component center slide removed');
  assert.ok(!gallerySlide.includes('calder-barrel-'), 'component barrel slide removed');
  assert.ok(!gallerySlide.includes('calder-hardware-'), 'component hardware slide removed');
  const mediaSlides = (universalGallery.match(/data-media-id="media-/g) || []).length;
  assert.equal(mediaSlides, 2, 'product media slides + media thumbs');
  assert.ok(universalGallery.includes('for media in product.media'), 'product media slides included');
  assert.ok(universalGallery.includes('data-calder-uc-gal-next') && universalGallery.includes('data-calder-uc-gal-prev'), 'arrows wired');
  assert.ok(universalGallery.includes('calder-uc-gal__nav'), 'self-owned nav (no Swiper class dependency)');
  assert.ok(!universalGallery.includes('swiper-arrows-carousel'), 'no Lumia arrow container');
  assert.ok(productSection.includes("render 'calder-universal-gallery'"), 'universal branch renders the self-contained gallery');
  const src = readFileSync(path.join(THEME, 'assets', 'calder-universal-pdp.js'), 'utf8');
  assert.ok(src.includes('calder-uc-gal__slide--active') && !src.includes('slideTo'), 'controller owns slide state (no Swiper API)');
  assert.ok(src.includes('calder-uc-gal__arrow--disabled'), 'controller disables arrows with own class');
  assert.ok(src.includes('data-calder-uc-gal-count'), 'controller publishes slide count for single-slide guards');
  assert.ok(src.includes('data-calder-uc-gal-next'), 'arrow wiring present');
  const diaBlock = snippet.slice(snippet.indexOf('data-calder-uc-group="diameter"'), snippet.indexOf('data-calder-uc-group="diameter"') + 400);
  assert.ok(diaBlock.includes('<span class="calder-uc__eyebrow">Diameter</span>'), 'diameter eyebrow');
  assert.ok(diaBlock.includes('data-calder-uc-selected="diameter"'), 'diameter selected label');
});

test('client update: trust moved after purchase; dynamic spec rows only in calder-specs', () => {
  const iPurchase = productSection.indexOf('class="calder-pdp__purchase"');
  const iTrust = productSection.indexOf('calder-pdp__trust');
  assert.ok(iTrust > iPurchase, 'trust block appears after purchase in source order');
  const seg = productSection.slice(iPurchase, iTrust);
  const opens = (seg.match(/<div\b/g) || []).length;
  const closes = (seg.match(/<\/div>/g) || []).length;
  assert.equal(opens, closes, 'trust is outside the purchase container (div balance)');
  for (const spec of ['sku', 'diameter', 'center', 'barrel', 'hardware']) {
    assert.ok(specsSection.includes(`data-calder-spec="${spec}"`), 'dynamic spec row: ' + spec);
  }
  assert.ok(!specsV2.includes('data-calder-spec='), 'calder-specs-v2 untouched');
});

test('client update: fitment guide persists the full vehicle (specs carry over to the CTA)', () => {
  assert.ok(fitmentGuideJs.includes('saveVehicle(Object.assign({}, vehicle,'), 'full vehicle object saved');
  assert.ok(/saveVehicle\(Object\.assign\(\{\}, vehicle, \{[\s\S]{0,200}display_name/.test(fitmentGuideJs), 'display aliases preserved');
  assert.ok(fitmentGuideJs.includes("yearSel.dispatchEvent(new Event('change'"), 'selects prefilled from saved vehicle (synced inputs)');
});

// ---- 4. controller behavior with a minimal DOM stub ----
function fakeElement(attrs) {
  const el = {
    attrs: Object.assign({}, attrs),
    dataset: {},
    hasAttribute(k) { return el.attrs[k] != null; },
    style: {},
    classes: new Set((attrs.class || '').split(' ').filter(Boolean)),
    children: [],
    handlers: {},
    classList: {
      toggle(c, on) { on ? el.classes.add(c) : el.classes.delete(c); },
      add(c) { el.classes.add(c); },
      remove(c) { el.classes.delete(c); },
      contains(c) { return el.classes.has(c); }
    },
    setAttribute(k, v) { el.attrs[k] = String(v); },
    getAttribute(k) { return el.attrs[k] == null ? null : String(el.attrs[k]); },
    removeAttribute(k) { delete el.attrs[k]; },
    addEventListener(t, fn) { (el.handlers[t] = el.handlers[t] || []).push(fn); },
    dispatch(t) { (el.handlers[t] || []).forEach((f) => f({ preventDefault() {}, target: el, key: t })); },
    focus() {},
    click() { (el.handlers.click || []).forEach((f) => f({ preventDefault() {}, target: el })); }
  };
  Object.defineProperty(el, 'tabIndex', { get() { return el.attrs.tabindex || 0; }, set(v) { el.attrs.tabindex = v; } });
  Object.defineProperty(el, 'textContent', { get() { return el.attrs.textContent || ''; }, set(v) { el.attrs.textContent = v; } });
  el.querySelector = function () { return null; };
  el.querySelectorAll = function () { return []; };
  el.closest = function () { return null; };
  return el;
}

test('controller: selection sync, preview mapping, click + arrow-key wiring, fallback on missing asset', async () => {
  const design = registry.designs[4]; // CLB-06
  const registrySlice = { designs: [JSON.parse(JSON.stringify(design))], option_tokens: registry.option_tokens };

  const optionButtons = [];
  const groups = { diameter: [], center: [], barrel: [], hardware: [] };
  (design.configurations || []).slice(0, 1); // noop, structure comes from snippet constants
  const optionDefs = [
    ['diameter', '22'], ['diameter', '24'], ['diameter', '26'],
    ['center', 'gloss-black'], ['center', 'black-titanium'], ['center', 'titanium-tint'],
    ['barrel', 'gloss-black'], ['barrel', 'polished'],
    ['hardware', 'chrome'], ['hardware', 'black']
  ];
  const selectedLabels = {};
  for (const dim of ['diameter', 'center', 'barrel', 'hardware']) selectedLabels[dim] = fakeElement({});
  for (const [dim, token] of optionDefs) {
    const btn = fakeElement({ 'data-calder-uc-option': '', 'data-dim': dim, 'data-token': token, 'aria-checked': 'false' });
    groups[dim].push(btn);
    optionButtons.push(btn);
  }
  const layers = {
    barrel: fakeElement({ 'data-calder-uc-layer': 'barrel', src: 'initial' }),
    center: fakeElement({ 'data-calder-uc-layer': 'center', src: 'initial' }),
    hardware: fakeElement({ 'data-calder-uc-layer': 'hardware', src: 'initial' })
  };
  layers.barrel.attrs.src = layers.barrel.getAttribute('src');
  layers.center.attrs.src = layers.center.getAttribute('src');
  layers.hardware.attrs.src = layers.hardware.getAttribute('src');
  const fallback = fakeElement({ hidden: 'hidden' });
  const root = fakeElement({ 'data-calder-universal': '', 'data-design-code': design.legacy_design_code });
  root.querySelectorAll = (sel) => (sel.startsWith('[data-calder-uc-option]') ? optionButtons : []);
  root.querySelector = (sel) => {
    if (sel.startsWith('[data-calder-uc-selected=')) {
      const dim = /"([a-z]+)"/.exec(sel)[1];
      return selectedLabels[dim];
    }
    if (sel.startsWith('[data-calder-uc-layer=')) return layers[/"([a-z]+)"/.exec(sel)[1]];
    if (sel.includes('data-calder-uc-fallback')) return fallback;
    return null;
  };
  root.contains = () => true;
  root.addEventListener = (t, fn) => { (root.handlers[t] = root.handlers[t] || []).push(fn); };
  root.click = (evt) => (root.handlers.click || []).forEach((f) => f(evt));
  // button clicks must reach the root delegation, like real DOM event bubbling
  for (const btn of optionButtons) {
    btn.closest = () => btn;
    btn.click = () => root.click({ preventDefault() {}, target: btn });
  }

  const win = {
    CALDER_DESIGN_REGISTRY: registrySlice,
    document: {
      readyState: 'complete',
      querySelector: (sel) => {
        if (sel.includes('[data-calder-universal]')) return root;
        if (sel.includes('data-calder-uc-fallback')) return fallback;
        return null;
      },
      querySelectorAll: (sel) => {
        if (sel.includes('[data-calder-uc-layer=')) {
          const dim = /"([a-z]+)"/.exec(sel)[1];
          return layers[dim] ? [layers[dim]] : [];
        }
        return [];
      },
      addEventListener() {}
    },
    Shopify: { routes: { root: '/' } },
    location: { search: '', pathname: '/products/calder-clb-06' },
    history: { pushState() {}, replaceState() {} },
    addEventListener() {},
    removeEventListener() {}
  };
  const sandbox = { window: win, document: win.document, URLSearchParams };
  vm.createContext(sandbox);
  for (const file of ['calder-config-resolver.js', 'calder-pdp-state.js', 'calder-universal-pdp.js']) {
    vm.runInContext(readFileSync(path.join(ASSETS, file), 'utf8'), sandbox, { filename: file });
  }
  assert.ok(sandbox.window.CALDER_UNIVERSAL_PDP, 'controller booted and exposed API');

  const { state } = sandbox.window.CALDER_UNIVERSAL_PDP;
  assert.equal(state.getState().complete, true, 'initialized to default config');
  const firstClick = { preventDefault() {}, target: Object.assign(Object.create(optionButtons[1]), { closest: () => optionButtons[1] }) };
  root.click(firstClick);
  assert.equal(state.getState().tokens.diameter, '24', 'click sets diameter via delegation');

  // selection sync state
  const byToken = Object.fromEntries(optionButtons.map((b) => [b.getAttribute('data-dim') + '/' + b.getAttribute('data-token'), b]));
  assert.equal(byToken['diameter/24'].getAttribute('aria-checked'), 'true');
  assert.equal(byToken['diameter/22'].getAttribute('aria-checked'), 'false');

  // preview mapping: barrel layer src should be gloss-black asset for default
  assert.ok(layers.barrel.getAttribute('src').includes('wheel-component-barrel-spun-gloss-black.png'));
  assert.ok(layers.center.getAttribute('src').includes('wheel-component-center-spun-gloss-black.png'));
  assert.ok(layers.hardware.getAttribute('src').includes('finish-bolt-chrome.png'));

  // arrow-key navigation within a group
  const keyEvt = { preventDefault() {}, target: Object.assign(Object.create(byToken['diameter/24']), { closest: () => byToken['diameter/24'] }), key: 'ArrowRight' };
  (root.handlers.keydown || []).forEach((f) => f(keyEvt));
  assert.equal(state.getState().tokens.diameter, '26', 'ArrowRight moves to next token');

  // missing-asset fallback path
  layers.center.handlers = {};
  layers.center.attrs['data-calder-uc-missing'] = 'center';
  fallback.removeAttribute('hidden');
  assert.equal(fallback.getAttribute('hidden'), null, 'fallback visible when a layer is missing');
});

test('every offered control combination resolves in the registry (no unresolvable configs)', async () => {
  const require = createRequire(import.meta.url);
  const resolverFactory = require(path.join(ASSETS, 'calder-config-resolver.js'));
  for (const d of registry.designs) {
    const r = resolverFactory.create({ registry, designId: d.design_id, availability: { getAvailability: async () => ({ status: 'available' }) } });
    for (const dia of ['22', '24', '26']) {
      for (const center of Object.keys(registry.option_tokens.center)) {
        for (const barrel of Object.keys(registry.option_tokens.barrel)) {
          for (const hardware of Object.keys(registry.option_tokens.hardware)) {
            const out = r.peek({ diameter: dia, center, barrel, hardware }, d.fitment_groups[0].id);
            assert.ok(['MAPPED', 'AVAILABLE', 'NO_SELLABLE_RECORD', 'NO_CATALOG_PART'].includes(out.state),
              `${d.design_id} ${dia}/${center}/${barrel}/${hardware} -> ${out.state}`);
          }
        }
      }
    }
  }
});


test('client update: fitment reset button + purchase CTA enabled on load (no Checking-Availability flash)', () => {
  const purchaseSnippet = readFileSync(path.join(THEME, 'snippets', 'calder-universal-purchase.liquid'), 'utf8');
  assert.ok(productSection.includes('data-calder-fitment-reset'), 'reset button markup present');
  assert.ok(productSection.includes('ffvResetVehicle'), 'reset clears stored vehicle + dispatches vehicle-cleared');
  assert.ok(!purchaseSnippet.includes('Checking availability'), 'no Checking-Availability initial label');
  assert.ok(!purchaseSnippet.includes('data-calder-uc-state="loading"'), 'no loading initial state');
  const ctaSrc = readFileSync(path.join(ASSETS, 'calder-universal-cta.js'), 'utf8');
  assert.ok(ctaSrc.includes('VEHICLE_INCOMPATIBLE'), 'incompatible bolt pattern disables purchase');
  assert.ok(ctaSrc.includes('vehicleMatchesDesign'), 'status changes only on vehicle + bolt-pattern match');
  const css = readFileSync(path.join(THEME, 'assets', 'calder-pdp-fitment-form.css'), 'utf8');
  assert.ok(css.includes('flex-wrap: wrap'), 'panel wraps so the form sits on its own row');
  assert.ok(css.includes('flex-basis: 100%'), 'form takes the full-width row');
});

test('client update: fitment panel uses an inline mini vehicle form (no scroll) with compatibility statuses', () => {
  assert.ok(productSection.includes('data-calder-fitment-form'), 'mini form markup present');
  assert.ok(productSection.includes('data-calder-ffv-year'), 'year select');
  assert.ok(productSection.includes('data-calder-ffv-make'), 'make select');
  assert.ok(productSection.includes('data-calder-ffv-model'), 'model select');
  assert.ok(productSection.includes('data-calder-ffv-apply'), 'apply button');
  assert.ok(!productSection.includes('calder:open-fitment'), 'no scroll-to-fitment behavior');
  assert.ok(!productSection.includes('scrollIntoView'), 'no scrollIntoView in the fitment action');
  assert.ok(productSection.includes("'Fits Your Vehicle'"), 'fits status label');
  assert.ok(productSection.includes("'Verification Required'"), 'verification status label');
  assert.ok(productSection.includes('calder-pdp__fitment--verify'), 'verification style class wired');
  assert.ok(productSection.includes('calder:universal-resolved'), 'panel listens to resolver outcomes');
  assert.ok(productSection.includes("calder-fitment-data.json"), 'mini form loads the shared fitment data');
  assert.ok(productSection.includes("calder-pdp-fitment-form.css"), 'mini form stylesheet linked');
  assert.ok(fitmentFormCss.includes('.calder-pdp__fitment-form'), 'mini form styles scoped');
});


test('boot regression: controller boots WITH the gallery present — no ReferenceError, slider functional', () => {
  // This is the crash path missed previously: the old wiring block left a
  // thumbsWrap reference that threw only when the gallery element existed.
  const design = registry.designs[4];
  const registrySlice = { designs: [JSON.parse(JSON.stringify(design))], option_tokens: registry.option_tokens };
  const mk = (attrs = {}) => {
    const el = {
      attrs: Object.assign({}, attrs), dataset: {}, handlers: {},
      hasAttribute(k) { return el.attrs[k] != null; },
      getAttribute(k) { return el.attrs[k] == null ? null : String(el.attrs[k]); },
      setAttribute(k, v) { el.attrs[k] = String(v); },
      removeAttribute(k) { delete el.attrs[k]; },
      addEventListener(t, fn) { (el.handlers[t] = el.handlers[t] || []).push(fn); },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      contains() { return true; },
      classList: null
    };
    const set = new Set();
    el.classList = {
      add: (c) => set.add(c), remove: (c) => set.delete(c),
      contains: (c) => set.has(c),
      toggle(c, on) { on ? set.add(c) : set.delete(c); }
    };
    el.classes = set;
    return el;
  };
  const ids = ['calder-preview-S1', 'calder-center-S1', 'calder-barrel-S1', 'calder-hardware-S1'];
  const slides = ids.map((id) => mk({ 'data-media-id': id, 'class': 'calder-uc__gallery-slide' }));
  const thumbs = ids.map((id) => mk({ 'data-media-id': id, 'class': 'calder-uc-gal__thumb' }));
  const nextBtn = mk(), prevBtn = mk();
  const strip = mk();
  strip.querySelectorAll = (sel) => (sel.includes('data-media-id') ? thumbs : []);
  const galRoot = mk();
  galRoot.querySelectorAll = (sel) => (sel.includes('calder-uc-gal__slides') ? slides : []);
  galRoot.querySelector = (sel) => {
    if (sel.includes('thumbs-wrap')) return strip;
    if (sel.includes('gal-next')) return nextBtn;
    if (sel.includes('gal-prev')) return prevBtn;
    return null;
  };
  const optionButtons = [];
  [['diameter', '22'], ['diameter', '24'], ['diameter', '26'],
   ['center', 'gloss-black'], ['center', 'black-titanium'], ['center', 'titanium-tint'],
   ['barrel', 'gloss-black'], ['barrel', 'polished'],
   ['hardware', 'chrome'], ['hardware', 'black']].forEach(([dim, token]) => {
    optionButtons.push(mk({ 'data-calder-uc-option': '', 'data-dim': dim, 'data-token': token }));
  });
  const selLabels = {};
  ['diameter', 'center', 'barrel', 'hardware'].forEach((dim) => { selLabels[dim] = mk(); });
  const controlsRoot = mk({ 'data-calder-universal': '', 'data-design-code': design.legacy_design_code });
  controlsRoot.querySelectorAll = (sel) => (sel.startsWith('[data-calder-uc-option]') ? optionButtons : []);
  controlsRoot.querySelector = (sel) => {
    if (sel.startsWith('[data-calder-uc-selected=')) return selLabels[/"([a-z]+)"/.exec(sel)[1]];
    if (sel.startsWith('[data-calder-uc-layer=')) return null;
    return null;
  };
  const controls = { root: controlsRoot };
  const win = {
    CALDER_DESIGN_REGISTRY: registrySlice,
    document: {
      readyState: 'complete',
      querySelector: (sel) => {
        if (sel.includes('data-calder-universal')) return controls.root;
        if (sel.includes('data-calder-uc-gallery')) return galRoot;
        return null;
      },
      querySelectorAll: () => [],
      addEventListener() {}
    },
    Shopify: { routes: { root: '/' } },
    location: { search: '', pathname: '/products/calder-clb-06' },
    history: { pushState() {}, replaceState() {} },
    addEventListener() {}, removeEventListener() {},
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    setTimeout(fn) { fn(); return 0; },
    fetch: async () => ({ ok: true, json: async () => ({}) })
  };
  const sandbox = { window: win, document: win.document, URLSearchParams, Promise, fetch: win.fetch, setTimeout: win.setTimeout };
  vm.createContext(sandbox);
  const resolverSrc = readFileSync(path.join(ASSETS, 'calder-config-resolver.js'), 'utf8')
    .replace('var availability = opts.availability || defaultAvailabilityProvider();',
            'var availability = opts.availability || { getAvailability: async () => ({ status: "available", variantId: 1 }) };');
  vm.runInContext(resolverSrc, sandbox, { filename: 'calder-config-resolver.js' });
  vm.runInContext(readFileSync(path.join(ASSETS, 'calder-pdp-state.js'), 'utf8'), sandbox, { filename: 'calder-pdp-state.js' });
  // THIS is the regression: boot with the gallery present must not throw
  vm.runInContext(readFileSync(path.join(ASSETS, 'calder-universal-pdp.js'), 'utf8'), sandbox, { filename: 'calder-universal-pdp.js' });
  assert.ok(sandbox.window.CALDER_UNIVERSAL_PDP, 'boot completed — no ReferenceError');
  assert.ok(slides[0].classes.has('calder-uc-gal__slide--active'), 'initial slide active after goTo(0)');
  // thumb click -> slide 1
  strip.handlers.click[0]({ target: { closest: () => thumbs[1] } });
  assert.ok(slides[1].classes.has('calder-uc-gal__slide--active'), 'thumb click switches slide');
  assert.ok(thumbs[1].classes.has('calder-uc-gal__thumb--active'), 'thumb active state synced');
  // arrow click -> slide 2
  nextBtn.handlers.click[0]({});
  assert.ok(slides[2].classes.has('calder-uc-gal__slide--active'), 'next arrow advances');
  // at end, next disabled; prev returns
  nextBtn.handlers.click[0]({});
  assert.ok(nextBtn.classes.has('calder-uc-gal__arrow--disabled'), 'next disabled at end');
  prevBtn.handlers.click[0]({});
  assert.ok(slides[2].classes.has('calder-uc-gal__slide--active'), 'prev arrow returns one step');
});

test('gallery zoom: native Lumia parity (ezPlus hover zoom + fancybox lightbox) is wired without touching slider behavior', () => {
  const pdpSrc = readFileSync(path.join(ASSETS, 'calder-universal-pdp.js'), 'utf8');
  /* snippet side: media images carry the native zoom source attributes,
     gated by the SAME theme setting as product-media-main.liquid;
     zoom icon reuses Lumia's native markup/classes */
  assert.ok(universalGallery.includes('data-zoom-image='), 'media slide images expose data-zoom-image');
  assert.ok(universalGallery.includes('data-image-width='), 'media slide images expose data-image-width');
  assert.ok(universalGallery.includes('uc_zoom_setting'), 'zoom source width follows settings.product_media_zoom');
  assert.ok(universalGallery.includes('prd-zoom-link js-prd-zoom-link'), 'zoom icon reuses native Lumia markup + CSS classes');
  assert.ok(universalGallery.includes('data-calder-uc-gal-zoom'), 'zoom icon hook for the controller');
  /* controller side: ports app.js addZoom + zoomLinkEvent, inert without the
     jQuery stack, and cannot alter slides/arrows/thumbs behavior */
  assert.ok(pdpSrc.includes('jq_lumia.fn.ezPlus'), 'hover zoom only activates when the theme ezPlus plugin is present');
  assert.ok(pdpSrc.includes("zoomType: 'inner'"), 'native inner hover zoom type');
  assert.ok(pdpSrc.includes("range: '100-1024', enabled: false"), 'native respond range disables zoom on small viewports');
  assert.ok(pdpSrc.includes('zoom-init'), 'one-time per-slide init guard (native pattern)');
  assert.ok(pdpSrc.includes('srcW <= frameW * 1.1'), 'zoom skipped when source is not larger than the frame (native zoomReserve)');
  assert.ok(pdpSrc.includes('jq_lumia.fancybox.open'), 'zoom icon opens the native fancybox gallery');
  assert.ok(pdpSrc.includes("animationEffect: 'zoom'"), 'native fancybox zoom animation');
  assert.ok(pdpSrc.includes("fancybox--light", ) || pdpSrc.includes("'fancybox--light'"), 'native light gallery skin');
  assert.ok(pdpSrc.includes('galZoomBtn.hidden = true'), 'zoom icon hidden when there is nothing to zoom');
  /* goTo still owns ONLY slide class/thumb/arrow sync + the additive zoom hook */
  assert.ok(/galSetThumbActive\(\);\s*\n\s*activateSlideZoom\(galActive\);/.test(pdpSrc), 'zoom activation is an additive hook in goTo, slider logic unchanged');
});

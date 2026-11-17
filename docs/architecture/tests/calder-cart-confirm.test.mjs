#!/usr/bin/env node
/**
 * Batch 7 (2026-11-15) regression tests — cart line properties (K1),
 * per-line confirmation checkboxes + checkout gate (K2), bypass honesty
 * (K3), summary integrity (K4).
 * Run: node --test docs/architecture/tests/calder-cart-confirm.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const REPO = path.resolve(ARCH, '..');
const THEME = path.join(REPO, 'design', 'Shopify Themes', 'Working Theme-via-CLI');

const cta = readFileSync(path.join(THEME, 'assets', 'calder-universal-cta.js'), 'utf8');
const confirmJs = readFileSync(path.join(THEME, 'assets', 'calder-cart-confirm.js'), 'utf8');
const cartItems = readFileSync(path.join(THEME, 'sections', 'main-cart-items.liquid'), 'utf8');
const drawerLine = readFileSync(path.join(THEME, 'snippets', 'header-cart-line-item.liquid'), 'utf8');
const drawer = readFileSync(path.join(THEME, 'snippets', 'header-cart.liquid'), 'utf8');
const baseCss = readFileSync(path.join(THEME, 'assets', 'calder-base.css.liquid'), 'utf8');

// ---- K1: the cart-add payload carries its own configuration ----
test('K1: universal CTA sends line-item properties (configuration snapshot at add time)', () => {
  const block = cta.slice(cta.indexOf('Line-item properties (K1, 2026-11-15)'));
  assert.ok(block.includes("'Wheel Design'"), 'design property');
  assert.ok(block.includes("'Diameter': snap.tokens.diameter ? snap.tokens.diameter + '\"' : ''"), 'diameter property');
  assert.ok(block.includes("'Width': addWidth()"), 'width from the vehicle fitment record');
  assert.ok(block.includes("'Center Finish'"), 'center finish property');
  assert.ok(block.includes("'Barrel & Lip Finish'"), 'barrel/lip property');
  assert.ok(block.includes("'Hardware & Rivet Finish'"), 'hardware property (matches the legacy form key)');
  assert.ok(block.includes("'Vehicle'"), 'vehicle display name property');
  assert.ok(block.includes("'Bolt Pattern': addGroup ? String(addGroup).split('-')[0]"), 'bolt pattern from the resolved group');
  assert.ok(/addProperties\[key\] === '' \|\| addProperties\[key\] == null[\s\S]*?delete addProperties\[key\]/.test(cta), 'blank values omitted, never invented');
  assert.ok(cta.includes("items: [{ id: legacy.variantId, quantity: qty, properties: addProperties }]"), 'properties ride the cart/add.js payload');
});

test('K1: internals are underscore-prefixed and hidden from display (privacy contract)', () => {
  for (const key of ['_configurator', '_source', '_design_code', '_fitment_group', '_config_tokens', '_variant_id', '_product_handle']) {
    assert.ok(cta.includes("'" + key + "'"), key + ' internal property');
  }
  // both cart surfaces skip underscore properties in the display loop (pre-existing rule, must remain)
  for (const src of [cartItems, drawerLine]) {
    assert.ok(/property_first_char = property\.first \| slice: 0/.test(src), 'underscore test present');
    assert.ok(/property_first_char != '_'/.test(src), 'underscore properties skipped in display');
  }
});

test('K1: FITMENT CONFIRMED badge is now live (Vehicle property reaches the cart line)', () => {
  assert.ok(cartItems.includes("item.properties['Vehicle'] | default: item.properties['Fitment Vehicle']"), 'badge consumes the Vehicle property');
  assert.ok(cartItems.includes('calder-cart-fitment'), 'badge markup preserved');
});

test('K1: quantities, prices, SKU and preview untouched by the payload change', () => {
  assert.ok(cta.includes('quantity: qty'), 'quantity preserved');
  assert.ok(cta.includes('id: legacy.variantId'), 'variant id (price/SKU authority) preserved');
  // no image/sections behavior changed
  assert.ok(cta.includes('sections: sections'), 'Lumia sections refresh preserved');
});

// ---- K2: per-line confirmation blocks on both surfaces ----
test('K2: cart page renders per-line confirmations keyed by the _configurator marker', () => {
  assert.ok(cartItems.includes("{%- if item.properties['_configurator'] != blank -%}"), 'gated on the internal calder marker (legacy lines unaffected)');
  assert.ok(cartItems.includes('data-calder-line-confirm data-line="{{ item.key | escape }}"'), 'checkbox per displayed property, keyed by item.key (identical SKUs confirm independently)');
  assert.ok(cartItems.includes('calder-line-confirm__heading'), 'heading markup present');
  assert.ok(cartItems.includes('Confirm Wheel Specs'), 'heading text updated (2026-11-16)');
  assert.ok(cartItems.includes('calder-option-confirm'), 'inline checkbox rows retained in the legacy (non-configurator) branch');
  assert.ok(cartItems.includes('data-calder-line-complete'), 'green FITMENT CONFIRMED badge gated on all-confirmed');
  assert.ok(cartItems.includes('calder-all-confirmed'), 'completion badge class present');
  // checkboxes only for non-underscore, non-blank properties (same guard as the display loop)
  assert.ok(cartItems.includes("property.last != blank and property_first_char != '_'"), 'checkboxes skip internals + blanks (mirrors display loop)');
});

// ---- Phase 3 (2026-11-17): approved specification checklist ----
test('Phase 3: cart page renders the approved spec grid for configurator lines', () => {
  assert.ok(cartItems.includes('calder-cart-item__spec-grid'), 'spec grid container');
  // Size = Diameter × Width combined ("22x10"); BYW lines fall back to _diameter
  assert.ok(cartItems.includes("item.properties['Diameter'] | default: item.properties['_diameter']"), 'Size diameter source with BYW fallback');
  assert.ok(cartItems.includes("item.properties['Width'] | remove: '\"'"), 'Size width source');
  assert.ok(cartItems.includes("append: 'x'"), 'combined 22x10 form');
  assert.ok(cartItems.includes('>Size</span>'), 'Size display label');
  // Lip / Bolts source cascade: visible key → BYW internal → _config_tokens token map → key-scan → variant option
  assert.ok(cartItems.includes("item.properties['Barrel & Lip Finish'] | default: item.properties['_barrel_finish']"), 'Lip Finish source levels 1-2');
  assert.ok(cartItems.includes(`split: '"barrel":"'`), 'Lip Finish _config_tokens parse');
  assert.ok(cartItems.includes("{%- assign lip_value = 'Gloss Black Lip' -%}") && cartItems.includes("{%- assign lip_value = 'Polished Lip' -%}"), 'token → registry label mapping');
  assert.ok(cartItems.includes("item.properties['Hardware & Rivet Finish'] | default: item.properties['_hardware_finish']"), 'Bolts source levels 1-2');
  assert.ok(cartItems.includes(`split: '"hardware":"'`), 'Bolts _config_tokens parse');
  assert.ok(cartItems.includes("{%- assign bolts_value = 'Chrome Bolts' -%}") && cartItems.includes("{%- assign bolts_value = 'Black Bolts' -%}"), 'Bolts token → label mapping');
  assert.ok(cartItems.includes("prop_key contains 'Lip'"), 'key-scan fallback (catches key drift)');
  assert.ok(cartItems.includes("prop_key contains 'Rivet' or prop_key == 'Bolts' or prop_key == 'Bolt Finish'"), 'Bolts key-scan (never Bolt Pattern)');
  assert.ok(cartItems.includes("option.name == 'Barrel & Lip Finish' or option.name == 'Barrel & Lip - Hardware'"), 'Bolts variant-option last resort');
  assert.ok(cartItems.includes('>Lip Finish</span>') && cartItems.includes('>Bolts</span>'), 'Lip Finish + Bolts display labels');
  assert.ok(cartItems.includes("item.properties['Bolt Pattern']"), 'Bolt Pattern source');
  assert.ok(cartItems.includes("item.properties['_fitment_group']"), 'Bolt Pattern _fitment_group fallback');
  assert.ok(cartItems.includes('>Center Finish</span>') && cartItems.includes('>Vehicle</span>') && cartItems.includes('>Bolt Pattern</span>'), 'remaining cells');
  assert.ok(cartItems.includes('calder-cart-item__spec-cell'), 'label-wrapped cells (clicking text toggles the checkbox)');
  // Vehicle + Bolt Pattern get full-width rows (vehicle name lengths vary)
  assert.ok(/calder-cart-item__spec calder-cart-item__spec--wide">\s*<label class="calder-cart-item__spec-cell">\s*<input[^>]*>\s*<span class="calder-cart-item__spec-text">\s*<span class="calder-cart-item__spec-label">Vehicle<\/span>/.test(cartItems), 'Vehicle cell is full-width');
  assert.ok(/calder-cart-item__spec--wide">\s*<label class="calder-cart-item__spec-cell">\s*<input[^>]*>\s*<span class="calder-cart-item__spec-text">\s*<span class="calder-cart-item__spec-label">Bolt Pattern<\/span>/.test(cartItems), 'Bolt Pattern cell is full-width');
  assert.ok(cartItems.includes('calder-cart-item__spec--lead') && cartItems.includes('calder-cart-item__spec--trail'), 'paired-cell divider modifiers');
  // fixed order; design-code property excluded; no duplicated variant options in the CELLS
  const g0 = cartItems.indexOf('calder-cart-item__spec-grid');
  const grid = cartItems.slice(g0, cartItems.indexOf('</ul>', g0));
  const order = ['>Size</span>', '>Center Finish</span>', '>Lip Finish</span>', '>Bolts</span>', '>Vehicle</span>', '>Bolt Pattern</span>'];
  let last = -1;
  for (const label of order) {
    const at = grid.indexOf(label);
    assert.ok(at > last, 'fixed display order at: ' + label);
    last = at;
  }
  assert.ok(!grid.includes('Wheel Design'), 'Wheel Design is NOT a required spec (excluded from display)');
});

test('Phase 3: drawer dedup — the legacy K2 block is gone, inline confirmations stay', () => {
  assert.ok(!drawerLine.includes('data-calder-line-confirm-block'), 'legacy separate block removed');
  assert.ok(!drawerLine.includes('Confirm this configuration'), 'legacy block heading removed');
  assert.ok(drawerLine.includes('data-calder-line-confirm'), 'inline checkboxes retained');
  assert.ok(drawerLine.includes('data-calder-line-complete'), 'per-line completion badge retained');
});

test('Phase 3 module: the drawer line root resolves for the per-line badge', () => {
  assert.ok(confirmJs.includes('.minicart-prd'), 'drawer line root in the closest() chain (badge was dead before)');
});

test('K2: drawer renders the same per-line confirmations', () => {
  assert.ok(drawerLine.includes('data-calder-line-confirm'), 'drawer inline checkboxes');
  assert.ok(drawerLine.includes("item.properties['_configurator'] != blank"), 'drawer gated on the marker');
  assert.ok(drawerLine.includes('data-calder-line-confirm data-line="{{ item.key | escape }}"'), 'drawer checkboxes keyed by item.key');
  assert.ok(drawerLine.includes('Confirm Wheel Specs'), 'drawer heading');
  assert.ok(drawerLine.includes('calder-option-confirm'), 'drawer inline checkbox rows');
  assert.ok(drawerLine.includes('data-calder-line-complete'), 'drawer completion badge');
});

test('K2 module: gate logic — all checked opens, any unchecked gates, no calder lines no gate', () => {
  assert.ok(/gate = boxes\.length > 0 && gate;/.test(confirmJs), 'gate applies only when Calder lines exist');
  assert.ok(/el\.classList\.toggle\('calder-line-confirm-gate', gate\);/.test(confirmJs), 'class gate (same technique as .shopify-payment-agree)');
  assert.ok(/el\.disabled = gate;/.test(confirmJs), 'buttons additionally disabled at the attribute level');
  const targets = confirmJs.slice(confirmJs.indexOf('function gateTargets'));
  assert.ok(targets.includes('button[name="checkout"]'), 'cart page + drawer checkout buttons targeted');
  assert.ok(targets.includes('.additional-checkout-buttons, .cart__dynamic-checkout-buttons, [data-shopify="payment-button"]'), 'express/dynamic checkout wrappers targeted');
});

test('K2 module: invalidation by design — cart re-renders reset confirmations and re-apply the gate', () => {
  assert.ok(/document\.addEventListener\('change'/.test(confirmJs), 'checkbox changes re-scan');
  assert.ok(/\.js-contents-cart-items, \.js-contents-buttons, \.js-contents-subtotal/.test(confirmJs), 'observes the theme cart.js swap containers');
  assert.ok(/MutationObserver/.test(confirmJs), 'mutation observer re-applies the gate after AJAX re-renders');
});

test('K2 module: loads on both surfaces with a double-include guard', () => {
  assert.ok(cartItems.includes("calder-cart-confirm.js' | asset_url"), 'cart page include');
  assert.ok(drawer.includes("calder-cart-confirm.js' | asset_url"), 'drawer include (all pages)');
  assert.ok(/window\.__calderCartConfirmBooted/.test(confirmJs), 'booted guard');
});

// ---- Phase 4 (2026-11-17): single fitment confirmation banner ----
test('Phase 4: the [data-calder-line-complete] badge is the SINGLE fitment surface (no duplicates)', () => {
  assert.ok(cartItems.includes('data-calder-line-complete'), 'badge markup present');
  // the badge now carries the vehicle as its detail text (source unchanged)
  assert.ok(cartItems.includes("item.properties['Vehicle'] | default: item.properties['Fitment Vehicle']"), 'vehicle detail source');
  // the separate unconditional vehicle badge was REMOVED: exactly one calder-cart-fitment element per line
  const badgeOpens = cartItems.match(/<p class="calder-cart-fitment[^>]*>/g) || [];
  assert.equal(badgeOpens.length, 1, 'exactly one fitment element in the cart section (got: ' + badgeOpens.length + ')');
  assert.ok(badgeOpens[0].includes('data-calder-line-complete'), 'the one element is the JS-driven completion badge');
  assert.ok(!/<p class="calder-cart-fitment">/.test(cartItems), 'no standalone unconditional badge remains');
  assert.ok(cartItems.includes('Fitment Confirmed</strong>'), 'banner heading text');
  assert.ok(cartItems.includes('calder-cart-fitment__icon'), 'circular check icon span');
});

test('Phase 4 CSS: banner styling (green #15803D on #EDF9EE) scoped to the cart page', () => {
  const cartCss = readFileSync(path.join(THEME, 'assets', 'cart-page.css'), 'utf8');
  const layer = cartCss.slice(cartCss.indexOf('FITMENT CONFIRMATION BANNER (2026-11-17)'));
  assert.ok(layer.includes('var(--cwci-fitment-bg)'), 'fitment background token (#EDF9EE)');
  assert.ok(layer.includes('var(--cwci-fitment)'), 'fitment green token (#15803D)');
  assert.ok(layer.includes('border-radius: 5px'), 'banner radius (developer-adjusted 2026-11-17, preserved)');
  assert.ok(layer.includes('width: 20px') && layer.includes('height: 20px'), 'circular icon 20px (developer-adjusted 2026-11-17, preserved)');
  assert.ok(layer.includes('.calder-cart-item .calder-cart-fitment'), 'scoped to the cart item card (drawer untouched)');
  // drawer keeps its compact badge: no __icon markup in the drawer snippet
  assert.ok(!drawerLine.includes('calder-cart-fitment__icon'), 'drawer badge stays compact');
});

// ---- Phase 5 (2026-11-17): bottom action row ----
test('Phase 5: Edit Specs deep-links to the product page with the line config as URL params', () => {
  assert.ok(cartItems.includes('calder-cart-item__edit-link'), 'edit link class');
  assert.ok(cartItems.includes('>Edit Specs</span>'), 'Edit Specs label');
  assert.ok(cartItems.includes("item.properties['_config_tokens']"), 'tokens from the K1 snapshot');
  for (const k of ['diameter', 'center', 'barrel', 'hardware', 'pcd']) {
    assert.ok(cartItems.includes("'" + k + "='"), k + ' param constructed');
  }
  // pcd falls back through _fitment group → Bolt Pattern property
  assert.ok(cartItems.includes("item.properties['_fitment_group'] | split: '-' | first | downcase"), 'pcd from the fitment group');
  assert.ok(cartItems.includes("item.properties['Bolt Pattern'] | downcase"), 'pcd fallback to the Bolt Pattern property');
  // separator-safe href (item.url may already carry a query string)
  assert.ok(cartItems.includes("{% if item.url contains '?' %}&{% else %}?{% endif %}"), 'href separator guard');
  // gated to configurator lines only
  const g0 = cartItems.indexOf('calder-cart-item__actions-left');
  const leftBlock = cartItems.slice(g0, cartItems.indexOf('</div>', g0));
  assert.ok(leftBlock.includes('{%- if is_calder_line -%}'), 'edit link rendered only on configurator lines');
  // BYW-era fallback: underscore internals with label→token mapping
  assert.ok(cartItems.includes("item.properties['_diameter'] | remove: '\"'"), 'diameter token from BYW internal');
  assert.ok(cartItems.includes("cfb == 'black-tint'"), 'center token alias mapping (black-tint → black-titanium)');
  assert.ok(cartItems.includes("bfb contains 'Polished'") && cartItems.includes("hfb contains 'Chrome'"), 'barrel/hardware label→token mapping');
});

test('Phase 5: Remove keeps the cart-remove-button contract + gains a text label', () => {
  assert.ok(cartItems.includes('>Remove</span>'), 'Remove text label');
  assert.ok(cartItems.includes('calder-cart-item__action-label'), 'label class');
  assert.ok(cartItems.includes('item.url_to_remove'), 'theme remove URL preserved');
  assert.ok(/<cart-remove-button data-index="\{\{ item\.index \| plus: 1 \}\}">/.test(cartItems), 'cart-remove-button element + data-index preserved');
});

test('Phase 5: Item Total wrapper + reskinned quantity selector (CSS-only, Lumia DOM preserved)', () => {
  assert.ok(cartItems.includes('calder-cart-item__total'), 'total wrapper');
  assert.ok(cartItems.includes('>Item Total</span>'), 'Item Total label');
  assert.ok(cartItems.includes("{% render 'main-cart-item-component-final-price', item: item %}"), 'Shopify final line price snippet preserved');
  const cartCss = readFileSync(path.join(THEME, 'assets', 'cart-page.css'), 'utf8');
  // 2026-11-17 consolidation: qty geometry lives ONCE in the 'final integration'
  // block (scoped .calder-cart-item .cart-table-prd-qty) — not in the actions layer.
  const integ = cartCss.slice(cartCss.indexOf('Calder final integration'));
  assert.ok(integ.includes('width: 140px') && integ.includes('height: 44px'), 'quantity selector 140×44 (single geometry authority)');
  assert.ok(integ.includes('flex: 0 0 36px'), 'fixed-basis qty buttons (stretch, no min-height guessing)');
  assert.ok(integ.includes('position: static') && integ.includes('align-self: stretch'), 'nav is a static stretched flex item (no absolute overlay)');
  assert.ok(integ.includes('border-radius: 0 11px 11px 0'), 'DOM-first (+, visual right) carries the container radius');
  assert.ok(integ.includes('var(--cwci-qty-border)'), '#D6DCE4 border token');
  assert.ok(integ.includes("font: 600 15px/1 var(--calder-ui-font)"), 'compact qty input type');
  // no absolute-nav overlay remains anywhere in the file
  assert.ok(!/prd-quantity-nav \{[^}]*position:\s*absolute/.test(cartCss), 'zero absolute-nav overlay rules (source-order contest eliminated)');
  assert.ok(!/prd-quantity-btn svg \{[^}]*14px/.test(cartCss), 'no duplicate svg sizing rules');
  assert.ok(cartCss.includes('font: 700 clamp(18px, 1.4vw, 22px)/1.15'), 'item total amount scale (reduced 2026-11-17)');
  assert.ok(cartCss.includes('.calder-cart-item__header .calder-cart-item__unit-price'), 'unit-price specificity fix ((0,6,0) beats the fidelity layer)');
});

test('K2: existing prd-block-agreement preserved as an ADDITIONAL requirement (not replaced)', () => {
  assert.ok(cartItems.includes('id="prd-block-agreement"'), 'agreement block intact in the cart section');
  assert.ok(cartItems.includes('agreementCheckboxMaincart'), 'agreement checkbox intact');
  assert.ok(drawer.includes('agreementCheckboxMinicart'), 'drawer agreement checkbox intact');
  const appJs = readFileSync(path.join(THEME, 'assets', 'app.js'), 'utf8');
  assert.ok(appJs.includes('class AgreementCheckbox'), 'AgreementCheckbox engine untouched');
  const styleCss = readFileSync(path.join(THEME, 'assets', 'style.css'), 'utf8');
  assert.ok(/\.shopify-payment-agree\.disabled \{[\s\S]*?cursor: not-allowed;[\s\S]*?pointer-events: none;[\s\S]*?opacity: \.5/.test(styleCss), 'theme agreement CSS gate untouched');
});

test('K2 CSS: gate class present globally (drawer renders on all pages)', () => {
  // 2026-11-17 Phase 3: the legacy K2 drawer block styles are REMOVED with the markup
  assert.ok(!/\.calder-line-confirm \{/.test(baseCss), 'legacy block container styles removed (block markup deleted)');
  assert.ok(!/\.calder-line-confirm__item \{/.test(baseCss), 'legacy block item styles removed');
  assert.ok(/\.calder-line-confirm__heading \{/.test(baseCss), 'heading styles kept (drawer + cart page)');
  assert.ok(/\.cart-table-product-option\.calder-option-confirm \{/.test(baseCss), 'drawer inline option styles kept');
  assert.ok(/\.calder-line-confirm-gate \{/.test(baseCss), 'gate class');
  assert.ok(baseCss.includes('pointer-events: none !important'), 'gate uses the theme-approved pointer-events technique');
});

test('Phase 3 CSS: spec grid styles on the cart page (cart-page.css layer)', () => {
  const cartCss = readFileSync(path.join(THEME, 'assets', 'cart-page.css'), 'utf8');
  const layer = cartCss.slice(cartCss.indexOf('SPECIFICATION CHECKLIST (2026-11-17)'));
  assert.ok(layer.includes('.calder-cart-item__spec-grid'), 'grid container');
  assert.ok(layer.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'two equal columns (clamped tracks)');
  assert.ok(layer.includes('var(--cwci-checkbox)'), 'checkbox consumes the spec-blue token (#0869DF)');
  assert.ok(layer.includes('border-right: 1px solid var(--cwci-divider)'), 'vertical divider between columns');
  assert.ok(layer.includes('border-bottom: 1px solid var(--cwci-divider)'), 'row dividers');
  assert.ok(layer.includes('width: 20px') && layer.includes('height: 20px') && layer.includes('border-radius: 4px'), 'checkbox 20px / 4px radius (developer-adjusted 2026-11-17, preserved)');
  assert.ok(layer.includes("stroke='%23ffffff'"), 'white checkmark');
  assert.ok(layer.includes('.calder-cart-item__spec-label') && layer.includes('.calder-cart-item__spec-value'), 'label/value typography');
});

// ---- K3: honest bypass disclosure baked into the module docs ----
test('K3: module documents its limits (no false enforcement claims)', () => {
  assert.ok(confirmJs.includes('devtools or navigate directly'), 'bypass disclosure present');
  assert.ok(confirmJs.includes('checkout extensibility'), 'the supported path forward is named');
});

// ---- K4: the summary block is untouched ----
test('K4: .card-total.bg-alt.calder-cart-summary — zero diff hunks touch the summary structure', () => {
  const head = execFileSync('git', ['-C', REPO, 'show',
    'HEAD:docs/design/Shopify Themes/Working Theme-via-CLI/sections/main-cart-items.liquid'], { encoding: 'utf8' });
  // the summary block itself (opening through the trust row) must be byte-identical
  const extract = (src) => {
    const start = src.indexOf('<div class="card-total bg-alt calder-cart-summary">');
    assert.ok(start !== -1, 'summary block present');
    const end = src.indexOf('calder-cart-trust', start);
    return src.slice(start, end);
  };
  assert.equal(extract(head), extract(cartItems), 'summary opening structure byte-identical to HEAD');
  // and no diff hunk anywhere in the file touches summary/agreement internals
  const diff = execFileSync('git', ['-C', REPO, 'diff', '-U0', '--',
    'docs/design/Shopify Themes/Working Theme-via-CLI/sections/main-cart-items.liquid'], { encoding: 'utf8' });
  const changedLines = diff.split('\n').filter((l) => /^[+-]/.test(l) && !/^[+-][+-]/.test(l));
  const protectedMarkers = ['card-total', 'calder-cart-summary', 'prd-block-agreement', 'agreementCheckbox',
    'shopify-payment-agree', 'calder-cart-trust', 'cart-errors', 'name="checkout"'];
  const offending = changedLines.filter((l) => protectedMarkers.some((m) => l.includes(m)));
  assert.deepEqual(offending, [], 'no changed line touches the protected summary/agreement markers: ' + JSON.stringify(offending));
});

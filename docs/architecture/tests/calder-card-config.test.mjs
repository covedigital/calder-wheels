#!/usr/bin/env node
/**
 * Batch 3 (2026-11-15) regression tests — product-card Shown Configuration (C7).
 * Run: node --test docs/architecture/tests/calder-card-config.test.mjs
 *
 * Developer-approved source (b): the card resolves to the registry design
 * default_configuration ("design showcase") — all six designs default to
 * 22" / gloss-black center / gloss-black lip / chrome bolts
 * (docs/architecture/calder_design_registry.json).
 *
 * Live catalog shape (products_export_1.csv, verified here):
 *  - 96 variant products: 9 variants = 3 diameters (22/24/26") x 3 centers
 *    (Black Tint / Gloss Black / Titanium Tint); Option3 "Barrel & Lip Finish"
 *    carries the product's FIXED HARDWARE value (Chrome/Black); the lip finish
 *    lives in the SKU tail digit (…BT11: 1=Polished lip, 1=Chrome bolts).
 *  - 6 design products: 36 variants; first variant IS the registry default
 *    (22" / Gloss Black / "Gloss Black Lip - Chrome Bolts") — already correct.
 *  - Cards show the showcased center's alt-coded render ("Gloss Black center").
 *
 * Guards: showcase only engages when the matching image exists (never a
 * panel/image mismatch); price tier preserved; bolts from actual option data;
 * lip from the documented SKU digit; unresolvable fields omitted, not invented.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const EXPORT = path.resolve(ARCH, '..', 'design', 'site-updates_11-15-2026', 'products_export_1.csv');

const card = readFileSync(path.join(THEME, 'snippets', 'calder-product-card.liquid'), 'utf8');
const registry = JSON.parse(readFileSync(path.join(ARCH, 'calder_design_registry.json'), 'utf8'));

// ---- registry contract ----
function findDesigns(o) {
  if (Array.isArray(o) && o.length && typeof o[0] === 'object' && 'design_id' in o[0]) return o;
  if (o && typeof o === 'object') {
    for (const v of Object.values(o)) { const r = findDesigns(v); if (r) return r; }
  }
  return null;
}
const designs = findDesigns(registry);

test('registry: all six designs default to the same showcase configuration', () => {
  assert.equal(designs.length, 6);
  for (const d of designs) {
    assert.deepEqual(d.default_configuration,
      { diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome' },
      d.design_id + ' default_configuration');
  }
});

test('registry: showcase labels used by the snippet match the registry tokens', () => {
  const centerLabels = registry.option_tokens.center;
  const barrelLabels = registry.option_tokens.barrel;
  const hwLabels = registry.option_tokens.hardware;
  assert.equal(centerLabels['gloss-black'], 'Gloss Black');
  assert.equal(hwLabels['chrome'], 'Chrome Bolts');
  assert.equal(hwLabels['black'], 'Black Bolts');
  assert.equal(barrelLabels['gloss-black'], 'Gloss Black Lip');
  assert.equal(barrelLabels['polished'], 'Polished Lip');
  assert.ok(card.includes("cc_v.options[cc_center_index] == 'Gloss Black'"), 'center label matches registry');
  assert.ok(card.includes("cc_v.options[cc_diameter_index] == '22\"'"), 'diameter label matches registry');
  assert.ok(card.includes("cc_media.alt contains 'Gloss Black center'"), 'alt-match keyed to the showcase center');
});

// ---- export data (quoted CSV with embedded newlines) ----
function parseCsv(text) {
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}
const raw = parseCsv(readFileSync(EXPORT, 'utf8'));
const H = Object.fromEntries(raw[0].map((h, i) => [h.trim(), i]));
const products = new Map();
for (const r of raw.slice(1)) {
  const handle = r[H['Handle']];
  if (!handle || !handle.startsWith('calder-')) continue;
  const p = products.get(handle) || { variants: [], images: [] };
  if (r[H['Variant SKU']]) {
    p.variants.push({
      o1: r[H['Option1 Value']], o2: r[H['Option2 Value']], o3: r[H['Option3 Value']],
      sku: r[H['Variant SKU']], price: r[H['Variant Price']], qty: Number(r[H['Variant Inventory Qty']] || 0),
      policy: r[H['Variant Inventory Policy']],
    });
  }
  if (r[H['Image Src']]) {
    p.images.push({ pos: Number(r[H['Image Position']] || 0), alt: r[H['Image Alt Text']] || '' });
  }
  products.set(handle, p);
}

const variantHandles = [...products.keys()].filter((h) => {
  const p = products.get(h);
  return p.variants.length === 9 && p.variants[0].o3 && ['Chrome', 'Black'].includes(p.variants[0].o3);
});
const designHandles = [...products.keys()].filter((h) => h.startsWith('calder-') && h.endsWith('-wheel'));

test('export: 96 variant products + 6 design products found', () => {
  assert.equal(variantHandles.length, 96);
  assert.equal(designHandles.length, 6);
});

test('C7: every variant product has an available 22" + Gloss Black showcase variant at the same price tier', () => {
  for (const h of variantHandles) {
    const p = products.get(h);
    const first = p.variants[0];
    const showcase = p.variants.find((v) => v.o1 === '22"' && v.o2 === 'Gloss Black' && v.qty > 0);
    assert.ok(showcase, 'showcase variant exists: ' + h);
    assert.equal(showcase.price, first.price, 'price tier preserved (same 22" tier): ' + h);
  }
});

test('C7: every variant product carries an alt-coded "Gloss Black center" render (showcase engages, image/panel stay coherent)', () => {
  for (const h of variantHandles) {
    const p = products.get(h);
    const media = p.images.find((im) => im.alt.includes('Gloss Black center'));
    assert.ok(media, 'alt-matched showcase image: ' + h + ' alts=' + JSON.stringify(p.images.map((i) => i.alt.slice(0, 40))));
    assert.ok(media.pos >= 1 && media.pos <= 3, 'render position (not the placeholder): ' + h);
  }
});

test('C7: SKU tail digits decode lip + bolt and agree with the handles (documented mapping)', () => {
  let n = 0;
  for (const h of variantHandles) {
    for (const v of products.get(h).variants) {
      n++;
      const lip = v.sku.slice(-2, -1), bolt = v.sku.slice(-1);
      const expLip = lip === '1' ? 'polished' : lip === '2' ? 'gloss-black' : null;
      const expBolt = bolt === '1' ? 'chrome' : bolt === '2' ? 'black' : null;
      assert.ok(expLip && expBolt, 'SKU tail decodes: ' + v.sku);
      assert.ok(h.includes('-' + expLip + '-lip-'), 'lip digit matches handle: ' + h + ' ' + v.sku);
      assert.ok(h.includes('-' + expBolt + '-bolts-'), 'bolt digit matches handle: ' + h + ' ' + v.sku);
      assert.ok(['Chrome', 'Black'].includes(v.o3), 'Option3 carries the fixed hardware value: ' + h);
    }
  }
  assert.equal(n, 864, 'all live variant rows verified');
});

test('C7: design products already list the registry default as their first variant (untouched by the showcase)', () => {
  for (const h of designHandles) {
    const first = products.get(h).variants[0];
    assert.equal(first.o1, '22"', h);
    assert.equal(first.o2, 'Gloss Black', h);
    assert.equal(first.o3, 'Gloss Black Lip - Chrome Bolts', h);
    assert.match(first.sku, /-22-GB-GBL-CH$/, h + ' first SKU is the default config');
  }
  // design products have no alt-coded media -> the card's showcase guard skips them
  for (const h of designHandles) {
    const alts = products.get(h).images.map((i) => i.alt);
    assert.ok(!alts.some((a) => a.includes('Gloss Black center')), 'no alt match on design product (guard keeps them unchanged): ' + h);
  }
});

// ---- snippet structure: the implementation matches the contract ----
test('C7 snippet: showcase resolves only when the alt-matched image exists', () => {
  const showcase = card.slice(card.indexOf('C7 (2026-11-15): showcase variant'), card.indexOf("if cc_center_index >= 0\n      assign selected_finish"));
  assert.ok(showcase.includes("cc_v.available"), 'showcase variant must be available');
  assert.ok(showcase.includes("== 'Gloss Black'"), 'center match');
  assert.ok(showcase.includes("== '22\"'"), 'diameter match (registry default)');
  assert.ok(showcase.includes("if cc_showcase_media"), 'image guard: overrides only with a matching render');
  assert.ok(showcase.indexOf('assign current_variant = cc_showcase_variant') > showcase.indexOf('if cc_showcase_media'), 'variant override inside the image guard');
  assert.ok(/render 'calder-design-url'[\s\S]*current_variant: current_variant/.test(showcase), 'deep link recomputed for the showcased config');
});

test('C7 snippet: bolt-vocabulary Option3 routing in BOTH the shown panel and the variant map', () => {
  const panel = card.slice(card.indexOf('assign cc_shown_d'), card.indexOf('assign cc_has_config'));
  const map = card.slice(card.indexOf('data-calder-card-variants'), card.indexOf('</script>'));
  for (const [name, block] of [['panel', panel], ['map', map]]) {
    assert.ok(/elsif cc_b_raw == 'Chrome' or cc_b_raw == 'Black'/.test(block), name + ': bolt-vocabulary branch');
    assert.ok(block.includes("assign cc_lip_digit = current_variant.sku | slice: -2 | slice: 0") ||
      block.includes("assign cc_lip_digit = cc_v.sku | slice: -2 | slice: 0"), name + ': lip digit from the SKU tail');
    assert.ok(/if cc_lip_digit == '1'/.test(block) && /'Polished'/.test(block), name + ': 1 -> Polished');
    assert.ok(/elsif cc_lip_digit == '2'/.test(block) && /'Gloss Black'/.test(block), name + ': 2 -> Gloss Black');
    assert.ok(/if cc_combined_hw and cc_b_raw contains ' Bolts'/.test(block), name + ': combined option path preserved');
  }
  // bolts fall back to the documented SKU bolt digit when Option3 has no value (existing behavior preserved)
  assert.ok(/if cc_shown_h == blank[\s\S]*?cc_bolt_digit = current_variant\.sku \| slice: -1/.test(panel), 'panel: SKU bolt fallback preserved');
  assert.ok(/if cc_h == blank[\s\S]*?cc_bolt_digit = cc_v\.sku \| slice: -1/.test(map), 'map: SKU bolt fallback preserved');
});

test('C7 snippet: unrelated card systems untouched', () => {
  assert.ok(card.includes('assign cc_sizes_line'), 'Available Sizes preserved');
  assert.ok(card.includes('card_option_filter: ' + "'Center Finish'"), 'hidden finishes picker preserved');
  assert.ok(card.includes('card_price_markup'), 'price markup flow preserved');
  assert.ok(card.includes("render 'product-card-media'"), 'media snippet flow preserved');
  assert.ok(card.includes('assign current_variant = product.selected_or_first_available_variant'), 'baseline variant assignment still present (showcase overrides it only when safe)');
});

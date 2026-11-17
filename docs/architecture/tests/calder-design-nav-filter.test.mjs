#!/usr/bin/env node
/**
 * Batch 4 (2026-11-15) regression tests — design-nav vehicle filtering (P1)
 * + verify icon alignment (P2).
 * Run: node --test docs/architecture/tests/calder-design-nav-filter.test.mjs
 *
 * P1: while a vehicle is selected, snippets/calder-design-nav.liquid +
 * calder-universal-pdp.js show only the other designs whose bolt_pattern
 * metafield includes the vehicle's pattern (data-pcds stamped server-side
 * from the catalog lookup — developer-endorsed source). calder:vehicle-
 * cleared (fitment panel Reset) restores all designs. Missing data-pcds =
 * fail-open (never drops possibly-compatible designs); the destination PDP
 * still fail-closes purchases via the CTA resolver checks.
 *
 * P2: the verify-state icon container and its inner svg match in color and
 * geometry (gold circular badge; svg currentColor = container color).
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

const nav = readFileSync(path.join(THEME, 'snippets', 'calder-design-nav.liquid'), 'utf8');
const pdp = readFileSync(path.join(THEME, 'assets', 'calder-universal-pdp.js'), 'utf8');
const cta = readFileSync(path.join(THEME, 'assets', 'calder-universal-cta.js'), 'utf8');
const fitCss = readFileSync(path.join(THEME, 'assets', 'calder-pdp-fitment-form.css'), 'utf8');
const productCss = readFileSync(path.join(THEME, 'assets', 'calder-product.css'), 'utf8');
const controlsCss = readFileSync(path.join(THEME, 'assets', 'calder-universal-controls.css'), 'utf8');
const fitment = JSON.parse(readFileSync(path.join(THEME, 'assets', 'calder-fitment-data.json'), 'utf8')).vehicles;

// ---- export: per-design bolt_pattern metafield vocabulary ----
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
const designPcds = new Map();
for (const r of raw.slice(1)) {
  const handle = r[H['Handle']];
  const bp = (r[H['bolt_pattern (product.metafields.custom.bolt_pattern)']] || '').trim();
  if (handle && handle.startsWith('calder-') && handle.endsWith('-wheel') && handle.split('-').length === 4 && bp) {
    designPcds.set(handle, bp.split(',').map((p) => p.trim()));
  }
}
const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '').replace(/\.\d+$/, '');

test('export: all six design products carry bolt_pattern metafields', () => {
  assert.equal(designPcds.size, 6);
  const vehiclePcds = new Set(fitment.map((v) => norm(v.b)));
  for (const [handle, list] of designPcds) {
    assert.ok(list.length >= 1, handle);
    for (const p of list) {
      assert.match(p, /^[56]x\d+$/, 'PCD vocabulary: ' + handle + ' ' + p);
      assert.ok(vehiclePcds.has(norm(p)), 'PCD appears in the fitment dataset: ' + p);
    }
  }
});

test('P1 behavior matrix: expected visible design counts per vehicle pattern (data-driven)', () => {
  // for each design: which OTHER designs remain visible for a vehicle pattern
  const designs = [...designPcds.entries()]; // [handle, patterns][]
  const matches = (patterns, vehiclePattern) => patterns.some((p) => norm(p) === norm(vehiclePattern));
  // 6x139 (Escalade): every design lists it -> all 5 others visible
  for (const [handle, patterns] of designs) {
    const others = designs.filter(([h2]) => h2 !== handle).filter(([, p2]) => matches(p2, '6X139'));
    assert.equal(others.length, 5, handle + ' sees all other designs for a 6x139 vehicle');
  }
  // 5x112 (BMW X5): no design lists it -> zero visible for every design
  for (const [handle] of designs) {
    const others = designs.filter(([h2]) => h2 !== handle).filter(([, p2]) => matches(p2, '5x112'));
    assert.equal(others.length, 0, handle + ' sees no designs for a 5x112 vehicle (empty state)');
  }
  // 5x120 (Range Rover Sport / Lexus TX): only the four-pattern designs match
  for (const [handle, patterns] of designs) {
    const others = designs.filter(([h2]) => h2 !== handle).filter(([, p2]) => matches(p2, '5x120'));
    if (patterns.length === 2) { assert.equal(others.length, 3, handle + ' (two-pattern design) sees the three four-pattern designs'); }
    else { assert.equal(others.length, 2, handle + ' (four-pattern design) sees the other two four-pattern designs'); }
  }
});

// ---- snippet structure ----
test('P1 snippet: pcds collected in the catalog loop and stamped on links', () => {
  assert.ok(nav.includes('assign cdn_pcds = '), 'pcds accumulator');
  assert.ok(/echo cdn_p\.metafields\.custom\.bolt_pattern\.value \| default: cdn_p\.metafields\.custom\.bolt_pattern/.test(nav), 'bolt_pattern metafield read (list- and string-safe via capture)');
  assert.ok(nav.includes("append: cdn_bp | append: ';'"), "';' pair separator (values contain commas)");
  assert.ok(/data-pcds=\"\{\{ cdn_pcd \| escape \}\}\"/.test(nav) || nav.includes('data-pcds="{{ cdn_pcd | escape }}"'), 'data-pcds stamped + escaped');
  assert.ok(nav.includes('{% if cdn_pcd != blank %} data-pcds='), 'stamp is conditional (missing data -> no attribute)');
  assert.ok(/assign cdn_pcd_pairs = cdn_pcds \| split: ';'/.test(nav), 'per-key resolution uses the same separator');
  assert.ok(nav.includes('data-design-nav-empty'), 'empty-state element present');
  assert.ok(/<li class="calder-design-nav__empty" data-design-nav-empty hidden>/.test(nav), 'empty state starts hidden');
  assert.ok(nav.includes("{%- if cdn_key != cdn_current_key -%}"), 'current design still excluded');
});

// ---- JS structure ----
test('P1 JS: filter mirrors the CTA normalization and wires the shared vehicle state', () => {
  const block = pdp.slice(pdp.indexOf('Design-nav vehicle filtering (P1'));
  assert.ok(block, 'filter module present');
  assert.ok(pdp.includes("localStorage.getItem('calder_selected_vehicle')"), 'shared saved-vehicle reader reads the same store');
  assert.ok(/document\.addEventListener\('calder:vehicle-selected'/.test(block), 'vehicle-selected listener');
  assert.ok(/document\.addEventListener\('calder:vehicle-cleared'/.test(block), 'vehicle-cleared listener (Reset restores all)');
  assert.ok(/window\.addEventListener\('storage'/.test(block), 'cross-tab storage sync');
  // normalization must equal the CTA's contract
  const ctaNorm = /var v = String\(raw\)\.trim\(\)\.toLowerCase\(\)\.replace\(\/\\s\+\/g, ''\)\.replace\(\/\\\.\\d\+\$\/, ''\);/.exec(cta);
  assert.ok(ctaNorm, 'CTA normalization located');
  assert.ok(/dnNormalizePattern[\s\S]*?String\(raw \|\| ''\)\.trim\(\)\.toLowerCase\(\)\.replace\(\/\\s\+\/g, ''\)\.replace\(\/\\\.\\d\+\$\/, ''\)/.test(block),
    'nav normalization mirrors the CTA rules');
  assert.ok(/\[vehicle\.b, vehicle\.bolt_pattern\]/.test(block), 'both saved-vehicle shapes supported (compact + finder)');
  assert.ok(/li\.hidden = !show/.test(block), 'accessible hiding via the hidden attribute');
  assert.ok(/var pcds = link\.getAttribute\('data-pcds'\);\s*\n?\s*if \(pcds\)/.test(block), 'fail-open: links without data-pcds stay visible');
  assert.ok(/dnEmpty\.hidden = visible !== 0;/.test(block), 'empty state keyed to visible count');
  // click-time pcd/config passthrough preserved
  assert.ok(/var pcd = new URLSearchParams\(window\.location\.search\)\.get\('pcd'\);/.test(pdp), 'click-time pcd passthrough preserved');
});

// ---- CHANGES (2026-11-15): reset returns the fitment panel to the unset navy state ----
const productLiquid = readFileSync(path.join(THEME, 'sections', 'calder-product.liquid'), 'utf8');

test('CHANGES: clearVehicle removes the lingering --verify class (gold label/icon after Reset)', () => {
  const block = productLiquid.slice(productLiquid.indexOf('function clearVehicle()'), productLiquid.indexOf("document.addEventListener(\n        'calder:vehicle-selected'"));
  assert.ok(block, 'clearVehicle located');
  assert.ok(block.includes("classList.add(\n          'calder-pdp__fitment--unset'\n        )"), 'unset re-applied');
  assert.ok(/classList\.remove\(\s*'calder-pdp__fitment--confirmed'\s*\)/.test(block), 'confirmed removed');
  assert.ok(/classList\.remove\(\s*'calder-pdp__fitment--verify'\s*\)/.test(block), 'verify removed — gold rules stop winning, icon + label return to unset navy');
  assert.ok(/ckIcon\) \{ ckIcon\.hidden = false; \}/.test(block), 'check icon restored (navy in unset state)');
  assert.ok(/wrIcon\) \{ wrIcon\.hidden = true; \}/.test(block), 'warn icon hidden');
});

test('CHANGES: match/no-match handlers still manage --verify explicitly (no regression)', () => {
  const start = productLiquid.indexOf('if (matches) {');
  const region = productLiquid.slice(start, productLiquid.indexOf('if (fitmentVehicle) {', start));
  assert.ok(region.includes("classList.remove('calder-pdp__fitment--verify')"), 'match path clears verify');
  assert.ok(region.includes("'calder-pdp__fitment--verify'"), 'no-match path applies verify');
});

// ---- CHANGES (2026-11-15): vehicle-gated Diameter group (P4 part 1) ----
test('CHANGES: Diameter group gated by vehicle presence (hidden without, revealed with, hidden on reset)', () => {
  const block = pdp.slice(pdp.indexOf('Vehicle-gated Diameter group (P4, 2026-11-15)'));
  assert.ok(block, 'diameter gating module present');
  assert.ok(/root\.querySelector\('\[data-calder-uc-group="diameter"\]'\)/.test(pdp), 'targets the Diameter .calder-uc__group');
  assert.ok(/diaGroup\.hidden = !info\.valid;/.test(block), 'visibility toggled via the hidden attribute');
  assert.ok(/vehicle\.b \|\| vehicle\.bolt_pattern/.test(block), 'valid-vehicle = carries a bolt pattern (both shapes)');
  assert.ok(/document\.addEventListener\('calder:vehicle-selected'/.test(block), 'reveal on vehicle-selected');
  assert.ok(/document\.addEventListener\('calder:vehicle-cleared'/.test(block), 'hide on vehicle-cleared (Reset)');
  assert.ok(/window\.addEventListener\('storage'/.test(block), 'cross-tab storage sync');
  assert.ok(/diaApply\(readSavedVehicle\(\)\);/.test(block), 'initial state applied on load (hidden when no vehicle was ever selected)');
  // runtime-only gating: the group is still server-rendered unconditionally
  const controls = readFileSync(path.join(THEME, 'snippets', 'calder-universal-controls.liquid'), 'utf8');
  assert.ok(controls.includes('data-calder-uc-group="diameter"'), 'diameter group still rendered server-side (no Liquid conditional removal)');
});

test('CHANGES CSS: .calder-uc__group[hidden] guard defeats the explicit display:flex', () => {
  assert.ok(/\.calder-uc__group \{\s*display: flex;/.test(controlsCss), 'base group rule has explicit display:flex (why the guard is required)');
  assert.ok(/\.calder-uc__group\[hidden\] \{\s*display: none !important;/.test(controlsCss), 'explicit [hidden] guard present');
});

// ---- P2: verify icon alignment ----
test('P2 CSS: verify icon container matches the inner svg (color + circular geometry)', () => {
  const m = fitCss.match(/\.calder-pdp__fitment--verify \.calder-pdp__fitment-icon \{[\s\S]*?\}/);
  assert.ok(m, 'verify icon rule present');
  const rule = m[0];
  assert.ok(/background:\s*var\(--calder-gold[^)]*\)/.test(rule), 'gold background preserved');
  assert.ok(/border-radius:\s*50%/.test(rule), 'container is circular (matches the svg circle geometry)');
  assert.ok(/color:\s*var\(--calder-gold[^)]*\)/.test(rule), 'svg currentColor matches the container color');
  // same gold for background and color
  const bg = /background:\s*var\((--calder-gold[^)]*)\)/.exec(rule)[1];
  const col = /color:\s*var\((--calder-gold[^)]*)\)/.exec(rule)[1];
  assert.equal(bg, col, 'identical gold token for background and color');
});

test('P2 CSS: only the verify state touched — success/unset icon rules unchanged', () => {
  assert.ok(/\.calder-pdp__fitment-icon \{[\s\S]*?color: var\(--calder-success\);[\s\S]*?\}/.test(productCss), 'base icon color (green success) intact');
  assert.ok(/\.calder-pdp__fitment--unset\s*\.calder-pdp__fitment-icon \{\s*color: var\(--calder-navy\);/.test(productCss.replace(/\n\s*/g, '\n')), 'unset (navy) state intact');
  assert.ok(/\.calder-pdp__fitment--verify \.calder-pdp__fitment-label \{\s*color: var\(--calder-gold[^)]*\);/.test(fitCss), 'verify label gold rule preserved');
  assert.ok(/\.calder-pdp__fitment-icon svg \{[\s\S]*?width: 42px;[\s\S]*?height: 42px;/.test(productCss), 'svg sizing intact');
});

test('P1 CSS: empty-state style spans the nav grid and starts hidden', () => {
  assert.ok(/\.calder-design-nav__empty \{[\s\S]*?grid-column: 1 \/ -1;/.test(controlsCss), 'spans the grid row');
  assert.ok(/\.calder-design-nav__empty\[hidden\] \{\s*display: none;/.test(controlsCss), 'explicit hidden guard (grid display rule beats the UA default)');
  assert.ok(/min-height: 44px/.test(controlsCss.slice(controlsCss.indexOf('.calder-design-nav__empty'))), '44px touch/readability floor');
});

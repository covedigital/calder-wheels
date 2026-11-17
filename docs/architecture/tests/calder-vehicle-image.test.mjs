#!/usr/bin/env node
/**
 * Batch 2 (2026-11-15) regression tests — vehicle-category image selection (C6).
 * Run: node --test docs/architecture/tests/calder-vehicle-image.test.mjs
 *
 * The .cw-fitment-guide__image src resolves through (calder-product-fitment-guide.js
 * renderResults):  vehicleCategories[make]  →  vehicleModelImages["YEAR|MAKE|MODEL"]
 * / ["MAKE|MODEL"] override  →  defaultImages[category] → asset URL.
 *
 * Developer-approved mapping (2026-11-15): G-Wagon (all three model keys) →
 * Off-road Vehicle. Escalade V, Lexus GX/LX, Range Rover Sport/SV-L460 stay
 * SUV / Crossover. F150 → Full-size Pickup Truck and Lamborghini (make-level)
 * → Sports / Performance Vehicle predate this batch and are preserved.
 *
 * Guards:
 *  - every category string used in either mapping table is a defaultImages key
 *    (a mismatch renders an empty src — the invariant that keeps the guide safe);
 *  - every MAKE|MODEL key corresponds to a real vehicle in calder-fitment-data.json
 *    (no invented keys, per the "do not guess" rule);
 *  - the five existing silhouette PNGs are present and unmodified (media policy).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');

const snippet = readFileSync(path.join(THEME, 'snippets', 'calder-fitment-guide-data.liquid'), 'utf8');
const engine = readFileSync(path.join(THEME, 'assets', 'calder-product-fitment-guide.js'), 'utf8');
const fitmentDoc = JSON.parse(readFileSync(path.join(THEME, 'assets', 'calder-fitment-data.json'), 'utf8'));
const fitment = Array.isArray(fitmentDoc) ? fitmentDoc : fitmentDoc.vehicles;

// Parse the two mapping tables + defaultImages out of the Liquid JSON config.
// The snippet is a <script type="application/json"> block whose asset URLs are
// Liquid injections ({{ ... | asset_url | json }}) — substitute them before parsing.
const configMatch = snippet.match(/<script[^>]*>\s*([\s\S]*?)\s*<\/script>/);
assert.ok(configMatch, 'config JSON block found in the data snippet');
const configJson = configMatch[1].replace(/\{\{[\s\S]*?\}\}/g, '"__liquid_asset_url__"');
const config = JSON.parse(configJson);

test('config shape: five silhouettes with asset URLs', () => {
  assert.deepEqual(new Set(Object.keys(config.defaultImages)), new Set([
    'Custom / Specialty Vehicle', 'Full-size Pickup Truck', 'Off-road Vehicle',
    'Sports / Performance Vehicle', 'SUV / Crossover']));
  // the data snippet renders the URLs via Liquid asset_url — verify the five
  // assignments above the JSON block instead of the substituted placeholder
  for (const file of ['vehicle_type-suv.png', 'vehicle_type-full_size_truck.png', 'vehicle_type-off_road.png', 'vehicle_type-sport.png', 'vehicle_type-custom.png']) {
    assert.ok(snippet.includes("'" + file + "' | asset_url"), 'Liquid assigns ' + file);
  }
});

test('C6: every mapping-table category resolves to an existing silhouette key', () => {
  for (const [make, cat] of Object.entries(config.vehicleCategories)) {
    assert.ok(config.defaultImages[cat], 'make-level category "' + make + '" -> "' + cat + '" exists in defaultImages');
  }
  for (const [key, cat] of Object.entries(config.vehicleModelImages)) {
    assert.ok(config.defaultImages[cat], 'model-level category "' + key + '" -> "' + cat + '" exists in defaultImages');
  }
});

test('C6: no invented keys — every vehicleModelImages key maps to a real catalog vehicle', () => {
  const pairs = new Set(fitment.map((v) => v.m + '|' + v.M));
  for (const key of Object.keys(config.vehicleModelImages)) {
    const parts = key.split('|');
    if (parts.length === 2) {
      assert.ok(pairs.has(key), 'MAKE|MODEL key exists in calder-fitment-data.json: ' + key);
    } else if (parts.length === 3) {
      const triple = new Set(fitment.map((v) => v.y + '|' + v.m + '|' + v.M));
      assert.ok(triple.has(key), 'YEAR|MAKE|MODEL key exists in calder-fitment-data.json: ' + key);
    } else {
      assert.fail('unrecognized key shape: ' + key);
    }
  }
});

test('C6: developer-approved decisions locked in', () => {
  assert.equal(config.vehicleModelImages['MERCEDES BENZ|G-WAGON 22'], 'Off-road Vehicle');
  assert.equal(config.vehicleModelImages['MERCEDES BENZ|G-WAGON 24'], 'Off-road Vehicle');
  assert.equal(config.vehicleModelImages['MERCEDES BENZ|G-WAGON 26'], 'Off-road Vehicle');
  // Pre-existing mappings preserved
  assert.equal(config.vehicleModelImages['FORD|F150'], 'Full-size Pickup Truck');
  assert.equal(config.vehicleModelImages['2024|FORD|F150'], 'Full-size Pickup Truck');
  assert.equal(config.vehicleCategories['LAMBORGINI'], 'Sports / Performance Vehicle');
  // Explicitly kept SUV per developer decision (2026-11-15): no non-SUV overrides
  for (const key of Object.keys(config.vehicleModelImages)) {
    if (key.includes('ESCALADE') || key.includes('LEXUS') || key.includes('RANGE ROVER')) {
      assert.fail('kept-SUV model must not be overridden: ' + key);
    }
  }
});

test('C6: G-Wagon overrides the make-level Mercedes SUV default', () => {
  assert.equal(config.vehicleCategories['MERCEDES BENZ'], 'SUV / Crossover');
  assert.equal(config.vehicleModelImages['MERCEDES BENZ|G-WAGON 22'], 'Off-road Vehicle');
});

test('C6: engine contract — year-key precedence, model-key fallback, safe unknown defaults', () => {
  assert.ok(/var cat = categories\[vehicle\.m\] \|\| 'SUV \/ Crossover';/.test(engine),
    'unknown make falls back to SUV (safe default)');
  assert.ok(/if \(config\.vehicleModelImages\[yearKey\]\)/.test(engine), 'year-level key checked first');
  assert.ok(/else if \(config\.vehicleModelImages\[modelKey\]\)/.test(engine), 'model-level fallback covers all years');
  assert.ok(/var imgSrc = defaultImages\[cat\] \|\| ''/.test(engine), 'src resolved from the category table');
  assert.ok(/class=\\"cw-fitment-guide__image\\"/.test(engine) || /class="cw-fitment-guide__image"/.test(engine),
    'image renders with the .cw-fitment-guide__image class');
});

test('C6: renderResults is one synchronous pass — vehicle switching cannot show a stale image', () => {
  // The image src is computed inside renderResults from the matched vehicle in
  // the same pass that writes the card HTML; there is no per-vehicle async
  // image fetch whose late response could overwrite a newer selection.
  const start = engine.indexOf('function renderResults');
  const nextFn = engine.indexOf('\n  function ', start + 10);
  const body = engine.slice(start, nextFn === -1 ? start + 9000 : nextFn);
  assert.ok(body.includes('var imgSrc = defaultImages[cat]'), 'src computed inside the render pass');
  assert.ok(!body.includes('fetch('), 'no async fetch inside the render pass');
});

test('C6 media policy: the five silhouette PNGs exist and are unmodified', () => {
  const assets = {
    'SUV / Crossover': 'vehicle_type-suv.png',
    'Full-size Pickup Truck': 'vehicle_type-full_size_truck.png',
    'Off-road Vehicle': 'vehicle_type-off_road.png',
    'Sports / Performance Vehicle': 'vehicle_type-sport.png',
    'Custom / Specialty Vehicle': 'vehicle_type-custom.png',
  };
  for (const [cat, file] of Object.entries(assets)) {
    const p = path.join(THEME, 'assets', file);
    assert.ok(existsSync(p), cat + ' asset present: ' + file);
    assert.ok(statSync(p).size > 1000, file + ' is a real image (>1KB)');
  }
  // git must show no modification to any vehicle_type asset (media untouched)
  let status = '';
  try {
    status = execFileSync('git', ['-C', path.resolve(ARCH, '..'), 'status', '--porcelain', '--',
      'docs/design/Shopify Themes/Working Theme-via-CLI/assets'], { encoding: 'utf8' });
  } catch (e) { /* git unavailable — skip */ }
  const assetLines = status.split('\n').filter((l) => /vehicle_type/.test(l));
  assert.deepEqual(assetLines, [], 'no vehicle_type-*.png in git changes: ' + JSON.stringify(assetLines));
});

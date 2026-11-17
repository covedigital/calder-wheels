#!/usr/bin/env node
/**
 * Batch 1 (2026-11-15) regression tests — collection filter presentation & resets.
 * Run: node --test docs/architecture/tests/calder-collection-reset.test.mjs
 *
 * C1  applied-filter chips (.filter-row-selected) hidden only while a vehicle
 *     is selected AND the filtered listing has results; chips render inside
 *     #product-grid (facets-active), so the old sidebar-scoped selector never
 *     matched anything.
 * C2  Clear Filters button under div.ProductCountDesktop (desktop sidebar +
 *     mobile popup) runs the same complete reset as the guide's RESET action
 *     (performCollectionReset) — facets, vehicle, chips, URL params, results.
 * C3  sidebar filter-heading underline removed (developer CSS, verified here
 *     so no stylesheet edit reintroduces it).
 * C4  hardware_rivet_finish_options metafield carries real values on every
 *     calder product (Search & Discovery storefront-filter enablement will
 *     yield a working facet once the admin flips it on).
 * C5  vehicle bolt-pattern constraint preserved (regression: Bolt Pattern
 *     facet block hides while a vehicle is active).
 * Also guards the developer's uncommitted CSS baseline (finish-filter row
 * display:none) so agent patches never silently revert client edits.
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

const glue = readFileSync(path.join(THEME, 'assets', 'calder-fitment-finder-guide.js'), 'utf8');
const facets = readFileSync(path.join(THEME, 'snippets', 'facets.liquid'), 'utf8');
const popup = readFileSync(path.join(THEME, 'snippets', 'facets-mobile-popup-container.liquid'), 'utf8');
const grid = readFileSync(path.join(THEME, 'sections', 'main-collection-product-grid.liquid'), 'utf8');
const guideCss = readFileSync(path.join(THEME, 'assets', 'calder-fitment-finder-guide.css'), 'utf8');
const catCss = readFileSync(path.join(THEME, 'assets', 'category-page.css'), 'utf8');

// ---- C1: chips lock engages on the real render location + results gate ----
test('C1: chips selector targets the real render location (#product-grid)', () => {
  const m = glue.match(/function setAppliedFilterChipsVisibility[\s\S]*?querySelectorAll\(([\s\S]*?)\);/);
  assert.ok(m, 'chips query located');
  const selector = m[1].replace(/['"+\s]/g, ''); // join concatenated string parts
  assert.ok(selector.startsWith('#product-grid.filter-row-selected'),
    'grid render location is the primary selector (old sidebar-scoped form matched nothing)');
  assert.ok(selector.includes('facet-filters-form.filter-row-selected'), 'legacy scopes retained defensively');
  assert.ok(selector.includes('filter-popup.filter-row-selected'), 'popup scope retained defensively');
});

test('C1: hiding is gated on the filtered listing actually having results', () => {
  assert.ok(/function collectionGridHasResults\(\)/.test(glue), 'results gate function exists');
  assert.ok(glue.includes("if (hidden && !collectionGridHasResults()) hidden = false;"), 'hide request downgraded when zero results');
  assert.ok(glue.includes("grid.querySelector('.prd')"), 'result presence detected via product item class');
});

test('C1: chip lock re-applies after AJAX grid swaps (chips are recreated inside the grid)', () => {
  assert.ok(/getElementById\('ProductGridContainer'\)/.test(glue), 'grid container observed');
  const watch = glue.slice(glue.indexOf('function watchFacetRerenders'), glue.indexOf('/* ── Reset (start over) ──'));
  assert.ok(watch.includes("targets.push(gridContainer)"), 'grid container added to re-render watcher targets');
});

// ---- C2: Clear Filters button — markup placement ----
test('C2: desktop facets render the button gated on calder_clear_filters, inside .category-page-title after ProductCountDesktop', () => {
  const titleStart = facets.indexOf('category-page-title hide-filter-mobile');
  const titleEnd = facets.indexOf('<!-- /Page Title -->');
  const titleBlock = facets.slice(titleStart, titleEnd);
  assert.ok(titleStart !== -1 && titleEnd > titleStart, 'title block located');
  assert.ok(titleBlock.includes('{%- if calder_clear_filters -%}'), 'button gated on calder_clear_filters');
  assert.ok(titleBlock.includes('data-calder-clear-filters'), 'button carries the delegated handler hook');
  assert.ok(titleBlock.includes(
">Clear Vehicle<"), 'button label (2026-11-16 update: Clear Vehicle)');
  const countIdx = titleBlock.indexOf('ProductCountDesktop');
  const btnIdx = titleBlock.indexOf('data-calder-clear-filters');
  const subtitleIdx = titleBlock.indexOf("render 'collection-subtitle'");
  assert.ok(countIdx !== -1 && btnIdx > countIdx, 'button sits after the product count');
  assert.ok(subtitleIdx === -1 || btnIdx < subtitleIdx, 'button sits before the subtitle render');
  assert.ok(titleBlock.indexOf('<button') < titleBlock.indexOf('data-calder-clear-filters') + 200, 'button is a real button element');
});

test('C2: mobile popup container mirrors the button in its own title block', () => {
  const titleStart = popup.indexOf('data-render-facets="mobile-popup-title"');
  const titleEnd = popup.indexOf('<div class="mt-2"></div>');
  const titleBlock = popup.slice(titleStart, titleEnd);
  assert.ok(titleStart !== -1, 'popup title block located');
  assert.ok(titleBlock.includes('{%- if calder_clear_filters -%}'), 'popup button gated the same way');
  assert.ok(titleBlock.includes('data-calder-clear-filters'), 'popup button hook');
  assert.ok(titleBlock.indexOf('data-calder-clear-filters') > titleBlock.indexOf('ProductCountDesktop'), 'popup button after its product count');
});

test('C2: only the collection grid section opts in (search facets untouched)', () => {
  assert.ok(/render 'facets',[\s\S]{0,400}?calder_clear_filters:\s*true/.test(grid), 'facets render passes the flag');
  assert.ok(grid.includes("render 'facets-mobile-popup-container' results: collection, sort_by: sort_by, calder_clear_filters: true"), 'popup render passes the flag');
  const search = readFileSync(path.join(THEME, 'sections', 'main-search.liquid'), 'utf8');
  assert.ok(!search.includes('calder_clear_filters'), 'search page does not opt in');
});

// ---- C2: one shared complete-reset for both entry points ----
test('C2: guide RESET and Clear Filters share one complete-reset implementation', () => {
  assert.ok(/function performCollectionReset\(/.test(glue), 'shared reset core exists');
  assert.ok(/function resetFitment\(section\) \{\s*\n\s*performCollectionReset\(section\);/.test(glue), 'guide RESET delegates to the shared core');
  const delegated = glue.slice(glue.indexOf('C2 (2026-11-15): Clear Filters in the facets title'));
  assert.ok(delegated.includes("closest('[data-calder-clear-filters]')"), 'delegated click handler targets the button');
  assert.ok(delegated.includes('performCollectionReset(guideSection())'), 'click runs the shared complete reset');
});

test('C2: complete reset clears vehicle + presentation state + URL (reset semantics preserved)', () => {
  const reset = glue.slice(glue.indexOf('function performCollectionReset'), glue.indexOf('function resetFitment'));
  assert.ok(reset.includes("localStorage.removeItem(STORAGE_KEY)"), 'persistent vehicle cleared');
  assert.ok(reset.includes('resetCard(section)'), 'card reset through the guide cascade');
  assert.ok(reset.includes('setBoltPatternFilterVisibility(false)'), 'manual Bolt Pattern filter restored');
  assert.ok(reset.includes('setAppliedFilterChipsVisibility(false)'), 'chips restored');
  assert.ok(reset.includes('restoreCollectionTitle()'), 'collection title restored');
  assert.ok(reset.includes("window.location.href = window.location.pathname"), 'bare-URL reload drops every query param');
});

test('C2: delegated handler survives AJAX re-renders (document-level, not per-element)', () => {
  assert.ok(/document\.addEventListener\('click',[\s\S]*data-calder-clear-filters/.test(glue), 'click listener attached at document level');
});

// ---- C3: heading underline stays removed; new button adds no underline ----
test('C3: sidebar filter-heading underline removed and not reintroduced', () => {
  assert.ok(/\.sidebar-block div\.sidebar-block_title[\s\S]{0,160}?border-bottom:\s*0/.test(catCss), 'developer underline removal intact');
});
test('C3: new Clear Filters button is deliberately not underlined', () => {
  const block = guideCss.slice(guideCss.indexOf('.category-page-title .calder-clear-filters'));
  assert.ok(block.includes('calder-clear-filters'), 'button styles exist');
  assert.ok(!block.slice(0, block.indexOf('/*') > 0 ? block.indexOf('/*') : undefined).includes('text-decoration: underline'), 'no underline on the button');
});

// ---- C4: bolts metafield data is real and filter-ready ----
test('C4: every calder product carries hardware_rivet_finish_options values (S&D-ready)', () => {
  // RFC-4180-style parse (quoted fields, embedded commas/newlines/"" escapes)
  const text = readFileSync(EXPORT, 'utf8');
  const rows = [];
  let row = [], field = '', inQ = false;
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
  const header = rows[0].map((h) => h.trim());
  const hwCol = header.findIndex((h) => h.startsWith('hardware_rivet_finish_options'));
  const handleCol = header.indexOf('Handle');
  assert.ok(hwCol !== -1, 'export has the hardware metafield column');
  let calderRows = 0, withHw = 0;
  const seen = new Set();
  for (const cells of rows.slice(1)) {
    const handle = cells[handleCol];
    if (!handle || !/^calder-/.test(handle) || seen.has(handle)) continue;
    seen.add(handle);
    calderRows += 1;
    const hw = (cells[hwCol] || '').trim();
    if (hw) withHw += 1;
    assert.ok(hw === '' || /^(Black Bolts|Chrome Bolts|Chrome|Black)(, (Black Bolts|Chrome Bolts|Chrome|Black))*$/.test(hw),
      'known bolts vocabulary only: ' + handle + ' -> "' + hw + '"');
  }
  assert.ok(calderRows >= 100, 'all calder products scanned: ' + calderRows);
  assert.equal(withHw, calderRows, 'every calder product has bolts metafield values');
});

// ---- C5: bolt-pattern constraint regressions ----
test('C5: vehicle bolt-pattern facet constraint + manual-filter hiding preserved', () => {
  assert.ok(glue.includes("var BOLT_PARAM = 'filter.p.m.custom.bolt_pattern'"), 'bolt-pattern URL param constant');
  assert.ok(glue.includes('params.set(BOLT_PARAM, bolt)'), 'vehicle fitment still applied as the bolt-pattern facet');
  assert.ok(/function setBoltPatternFilterVisibility\(hidden\)/.test(glue), 'manual Bolt Pattern block visibility toggle');
  assert.ok(glue.includes("if (boltFilterHidden) setBoltPatternFilterVisibility(true);"), 're-applied after facet re-renders');
});

// ---- developer baseline guard: uncommitted client CSS edits stay intact ----
test('baseline: developer finish-filter display:none edit preserved', () => {
  const m = guideCss.match(/\.cw-fitment-guide__finish-filters \{[\s\S]*?\}/);
  assert.ok(m, 'finish-filters rule present');
  assert.ok(/display:\s*none/.test(m[0]), 'developer display:none override still in the rule');
});

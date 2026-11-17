#!/usr/bin/env node
/**
 * Batch 6 (2026-11-15) regression tests — P7 exact vehicle specs + P8 audit.
 * Run: node --test docs/architecture/tests/calder-specs-exact.test.mjs
 *
 * P7: .calder-specs__table Width / Bolt Pattern / Center Bore / Offset show
 * the GENERAL specification (labeled) until a vehicle + configuration are
 * selected; calder-universal-pdp.js then writes the EXACT assigned values
 * from the vehicle's own fitment records + the resolved registry fitment
 * group — never derived from ranges. Unresolvable -> general cells restored.
 *
 * P8 (audit lock-in): Lexus GX year-range bores, LX 2022-26 6x139 switch,
 * RX/TX retained (developer decision 2026-11-15), 26" per-vehicle rules,
 * NO suspension data exists anywhere (blocked — no invented lifted specs).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');

const specs = readFileSync(path.join(THEME, 'sections', 'calder-specs.liquid'), 'utf8');
const pdp = readFileSync(path.join(THEME, 'assets', 'calder-universal-pdp.js'), 'utf8');
const fitment = JSON.parse(readFileSync(path.join(THEME, 'assets', 'calder-fitment-data.json'), 'utf8')).vehicles;
const productCss = readFileSync(path.join(THEME, 'assets', 'calder-product.css'), 'utf8');

// ---- P7: Liquid structure ----
test('P7 liquid: the four resolvable spec rows carry data-calder-spec hooks', () => {
  for (const dim of ['width', 'bolt', 'offset', 'bore']) {
    assert.ok(specs.includes('data-calder-spec="' + dim + '"'), dim + ' hook present');
  }
});

test('P7 liquid: general values are clearly labeled as general on universal PDPs only', () => {
  const generalTags = specs.split('calder-specs__general-tag').length - 1;
  assert.ok(generalTags >= 3, 'general tags on width/bolt/offset (' + generalTags + ')');
  // tags gated to universal designs (non-universal products keep clean values — no resolver runs there)
  const widthRow = specs.slice(specs.indexOf('data-calder-spec="width"'), specs.indexOf('data-calder-spec="width"') + 400);
  assert.ok(widthRow.includes('{%- if is_universal_design -%}'), 'tag gated by is_universal_design');
  // bore: no general value exists for universal designs — truthful "—", no tag
  const boreRow = specs.slice(specs.indexOf('data-calder-spec="bore"'), specs.indexOf('data-calder-spec="bore"') + 200);
  assert.ok(boreRow.includes('>—</td>'), 'bore pre-selection state is a truthful dash, not an invented value');
});

test('P7 css: general tag styles present (muted badge, disappears when exact values land)', () => {
  assert.ok(/\.calder-specs__table \.calder-specs__general-tag \{/.test(productCss));
});

// ---- P7: the runtime rules, replicated and verified against real data ----
function diaWidthFrom(size) {
  const m = /^\d{2}\s*[x×]\s*([\d.]+)/i.exec(String(size || ''));
  return m ? m[1] : '';
}
function specWidthFromCfg(cfg) {
  const front = diaWidthFrom(cfg.z || cfg.fz);
  const rear = diaWidthFrom(cfg.rz || cfg.z);
  if (!front) return '';
  if (cfg.rz && rear && front !== rear) { return 'Front ' + front + '" / Rear ' + rear + '"'; }
  return front + '"';
}
function specOffsetFromCfg(cfg) {
  const m = /^\+?0*(\d+(?:\.\d+)?)\s*mm$/i.exec(String(cfg.o || ''));
  return m ? '+' + m[1] + 'mm' : '';
}
const byModel = (M, y) => fitment.find((v) => v.M === M && (y === undefined || String(v.y) === String(y)));

test('P7 data: exact width/offset values per vehicle configuration', () => {
  // Escalade 22": width 10, offset +25mm (sheet: 22x10 +25mm)
  const esc22 = byModel('Escalade').cf[0];
  assert.equal(specWidthFromCfg(esc22), '10"');
  assert.equal(specOffsetFromCfg(esc22), '+25mm');
  // Staggered X5 22" Base: front 9 / rear 10 widths, +32mm front offset (sheet)
  const x5 = byModel('X5 22 Base').cf[0];
  assert.equal(specWidthFromCfg(x5), 'Front 9" / Rear 10"');
  assert.equal(specOffsetFromCfg(x5), '+32mm', 'X5 22" Base front offset 32mm per the SUV Fitment Guide');
  // Sheet-style offsets parse cleanly at every value used by the catalog
  for (const o of ['25mm', '30mm', '32mm', '35mm', '56mm', '53mm', '40mm', '38mm', '27mm']) {
    assert.ok(specOffsetFromCfg({ o }).startsWith('+'), o + ' renders with an explicit sign');
  }
});

test('P7 js: exact values land only when BOTH the fitment group and the cf record resolve', () => {
  const block = pdp.slice(pdp.indexOf('Exact vehicle specs (P7, 2026-11-15)'));
  assert.ok(/resolver\.groupFromVehicle\(vehicle, tokens\.diameter\)/.test(block), 'group resolved through the existing engine (no new fitment engine)');
  assert.ok(/return \(group && cfg\) \? \{ group: group, cfg: cfg \} : null;/.test(block), 'both required or nothing — no partial guessing');
  assert.ok(/setSpecCell\('width', specWidthFromCfg\(data\.cfg\)\)/.test(block), 'width from the vehicle cf record');
  assert.ok(/setSpecCell\('bolt', parts\[0\] \|\| ''\)/.test(block), 'bolt from the registry group id');
  assert.ok(/setSpecCell\('bore', parts\[2\] \? parts\[2\] \+ 'mm' : ''\)/.test(block), 'wheel center bore from the registry group id (hub bore stays distinct)');
  assert.ok(/SPEC_PRISTINE\[dim\] = cell\.innerHTML;/.test(block), 'pristine general cells captured for restore');
  assert.ok(/cell\.innerHTML = pristine;/.test(block), 'general cells restored on clear');
  assert.ok(pdp.slice(pdp.indexOf('function updateSpecCells')).indexOf('applyVehicleSpecs(tokens);') !== -1, 're-applied on every configuration change (diameter drives width/offset/bore)');
  assert.ok(/document\.addEventListener\('calder:vehicle-selected'[\s\S]*?applyVehicleSpecs\(state\.getState\(\)\.tokens\)/.test(pdp), 'vehicle events re-apply');
});

test('P7 js: staggered front/rear width shown truthfully; single widths quoted', () => {
  const block = pdp.slice(pdp.indexOf('Exact vehicle specs (P7, 2026-11-15)'));
  assert.ok(/Front ' \+ front \+ '" \/ Rear ' \+ rear \+ '"'/.test(block), 'staggered pair display');
});

// ---- P8: audit lock-in (verified against the authoritative sheets) ----
test('P8: Lexus GX bore change at the 2024 model-year boundary matches the fitment guide', () => {
  const gx = fitment.filter((v) => v.M === 'GX');
  assert.equal(gx.filter((v) => v.y <= 2023 && v.h === 106.1).length, gx.filter((v) => v.y <= 2023).length, 'GX 2010-2023 hub bore 106.1 (sheet: 2010-23)');
  assert.equal(gx.filter((v) => v.y >= 2024 && v.h === 95.1).length, gx.filter((v) => v.y >= 2024).length, 'GX 2024-26 hub bore 95.1 (sheet: 2024-26)');
});

test('P8: Lexus LX 2022-2026 switches to 6x139 / 95.1; 2008-2021 stays 5x150 / 110.1', () => {
  const lx = fitment.filter((v) => v.M === 'LX');
  assert.equal(lx.filter((v) => v.y >= 2022 && v.b === '6X139' && v.h === 95.1).length, lx.filter((v) => v.y >= 2022).length);
  assert.equal(lx.filter((v) => v.y <= 2021 && v.b === '5X150' && v.h === 110.1).length, lx.filter((v) => v.y <= 2021).length);
});

test('P8: RX/TX retained (developer decision 2026-11-15) with their real patterns', () => {
  const rx = fitment.filter((v) => v.M === 'RX');
  assert.ok(rx.length >= 11, 'RX 2016-2026 present');
  assert.ok(rx.every((v) => v.b === '5X114'), 'RX 5x114');
  const tx = fitment.filter((v) => v.M === 'TX');
  assert.ok(tx.length === 3 && tx.every((v) => v.b === '5X120'), 'TX 2024-2026 5x120');
});

test('P8: 26-inch support is per-vehicle fitment data, never a blanket rule', () => {
  const with26 = fitment.filter((v) => v.cf.some((c) => String(c.z).toLowerCase().startsWith('26')));
  const without26 = fitment.filter((v) => !v.cf.some((c) => String(c.z).toLowerCase().startsWith('26')));
  assert.ok(with26.length > 0, '26" exists for supported vehicles (Escalade/Expedition/F150/G-Wagon/SV/LX22+/Cullinan)');
  assert.ok(without26.length > 0, 'other vehicles genuinely lack 26" (e.g. Durango/Grand Cherokee)');
  // the code carries no blanket 26" restriction (C5 decision): no single line
  // of the collection glue keys hiding on the 26 diameter
  const glue = readFileSync(path.join(THEME, 'assets', 'calder-fitment-finder-guide.js'), 'utf8');
  const offending = glue.split('\n').filter((l) => /26/.test(l) && /hidden|display:\s*none|display = 'none'|\.hidden =/.test(l));
  assert.deepEqual(offending, [], 'no hardcoded 26" hiding anywhere in the collection glue');
});

test('P8: no suspension/lifted data anywhere — Standard/Lifted remains blocked (nothing invented)', () => {
  const surfaces = [pdp, readFileSync(path.join(THEME, 'sections', 'calder-specs.liquid'), 'utf8')];
  for (const src of surfaces) {
    assert.ok(!/lifted/i.test(src), 'no invented lifted offset logic');
  }
  assert.ok(fitment.every((v) => v.s === undefined || ['american', 'asian', 'european'].includes(v.s)), 'vehicle s field is origin, not suspension');
});

test('P8: CLM/legacy identifiers preserved (no blind renames in this batch)', () => {
  const nav = readFileSync(path.join(THEME, 'snippets', 'calder-design-nav.liquid'), 'utf8');
  assert.ok(nav.includes("cdn_fallback_handles = 'calder-clm-01-wheel,calder-clm-02-wheel,calder-clm-03-wheel,calder-clm-05-wheel,calder-clb-06-wheel,calder-clb-07-wheel'"), 'legacy CLB fallback handles preserved');
  assert.ok(nav.includes("if cdn_current_key == 'CLB06'"), 'CLB06->CLM06 alias preserved');
});

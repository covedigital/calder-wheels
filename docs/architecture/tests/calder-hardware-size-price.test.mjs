#!/usr/bin/env node
/**
 * Batch 5 (2026-11-15) regression tests — P3 hardware order, P4 combined
 * Size labels + unsupported-size prevention (+ mobile parity), P5
 * vehicle-required purchase gate, P6 size-dependent price.
 * Run: node --test docs/architecture/tests/calder-hardware-size-price.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');

const controls = readFileSync(path.join(THEME, 'snippets', 'calder-universal-controls.liquid'), 'utf8');
const pdp = readFileSync(path.join(THEME, 'assets', 'calder-universal-pdp.js'), 'utf8');
const cta = readFileSync(path.join(THEME, 'assets', 'calder-universal-cta.js'), 'utf8');
const mobile = readFileSync(path.join(THEME, 'assets', 'calder-mobile-sticky-configurator.js'), 'utf8');
const registry = JSON.parse(readFileSync(path.join(ARCH, 'calder_design_registry.json'), 'utf8'));
const fitment = JSON.parse(readFileSync(path.join(THEME, 'assets', 'calder-fitment-data.json'), 'utf8')).vehicles;

function findDesigns(o) {
  if (Array.isArray(o) && o.length && typeof o[0] === 'object' && 'design_id' in o[0]) return o;
  if (o && typeof o === 'object') { for (const v of Object.values(o)) { const r = findDesigns(v); if (r) return r; } }
  return null;
}
const designs = findDesigns(registry);

// ---- P3: hardware order ----
test('P3: desktop Liquid renders Black Bolts first; Chrome keeps the default selection', () => {
  const group = controls.slice(controls.indexOf('data-calder-uc-group="hardware"'));
  const blackIdx = group.indexOf('data-token="black"');
  const chromeIdx = group.indexOf('data-token="chrome"');
  assert.ok(blackIdx !== -1 && chromeIdx !== -1, 'both hardware options present');
  assert.ok(blackIdx < chromeIdx, 'Black Bolts renders before Chrome Bolts');
  // the chrome button's own tag carries is-selected (class precedes data-token)
  assert.ok(/is-selected[^>]*data-token="chrome"/.test(group), 'chrome remains the selected default (registry default_configuration)');
  assert.ok(/aria-checked="true"[^>]*data-token="chrome"/.test(group), 'chrome keeps aria-checked=true');
  assert.ok(/aria-checked="false"[^>]*data-token="black"/.test(group), 'black stays unselected');
});

test('P3: registry lists black first (mobile sticky + any registry-driven surface follow it)', () => {
  assert.equal(designs.length, 6, 'all six designs located');
  for (const d of designs) {
    assert.deepEqual(d.hardware_finishes, ['black', 'chrome'], d.design_id + ' hardware order');
  }
});

test('P3: tokens, values and SKU mappings untouched by the reorder', () => {
  const group = controls.slice(controls.indexOf('data-calder-uc-group="hardware"'));
  for (const t of ['data-token="black"', 'data-token="chrome"']) assert.ok(group.includes(t), t + ' retained');
  for (const l of ['aria-label="Black Bolts"', 'aria-label="Chrome Bolts"']) assert.ok(group.includes(l), l + ' retained');
  assert.ok(group.includes('>Black Bolts</span>') && group.includes('>Chrome Bolts</span>'), 'labels stable');
});

// ---- P4: the size logic, replicated from calder-universal-pdp.js and verified
// against the real fitment dataset (the same rules the runtime applies) ----
function diaWidthFrom(size) {
  const m = /^\d{2}\s*[x×]\s*([\d.]+)/i.exec(String(size || ''));
  return m ? m[1] : '';
}
function diaVehicleInfo(vehicle) {
  const out = { valid: false, supported: {}, labels: {} };
  if (!vehicle || !(vehicle.b || vehicle.bolt_pattern)) return out;
  out.valid = true;
  (vehicle.cf || []).forEach((cfg) => {
    const m = /^(\d{2})\s*[x×]/i.exec(String((cfg && cfg.z) || ''));
    if (!m) return;
    out.supported[m[1]] = true;
    const front = diaWidthFrom(cfg.z || cfg.fz);
    const rear = diaWidthFrom(cfg.rz || cfg.z);
    if (front && front === rear) { out.labels[m[1]] = m[1] + ' × ' + front; }
  });
  return out;
}
const byModel = (M) => fitment.find((v) => v.M === M);

test('P4 data matrix: combined Size labels + supported diameters per vehicle shape', () => {
  // Escalade: square setup — every diameter gets a combined label, all supported
  const esc = diaVehicleInfo(byModel('Escalade'));
  assert.deepEqual(esc.labels, { 22: '22 × 10', 24: '24 × 10', 26: '26 × 10' });
  assert.deepEqual(esc.supported, { 22: true, 24: true, 26: true });
  // Durango: only 22/24 offered -> 26 disabled, labels for the offered sizes
  const dur = diaVehicleInfo(byModel('DURANGO'));
  assert.deepEqual(dur.supported, { 22: true, 24: true });
  assert.ok(!dur.supported[26], '26 unsupported for Durango (sheet: 22/24 only)');
  assert.deepEqual(dur.labels, { 22: '22 × 10', 24: '24 × 10' });
  // Staggered BMW X5 22" Base: front 22x9 / rear 22x10 -> no combined label (ambiguous)
  const x5 = diaVehicleInfo(fitment.find((v) => v.M === 'X5 22 Base'));
  assert.ok(x5.supported[22], '22 supported');
  assert.ok(!x5.labels[22], 'differing front/rear widths keep the plain label');
  // Lexus LX 2022-26 uses uppercase "22X10" size strings — must parse
  const lx = diaVehicleInfo(fitment.find((v) => v.M === 'LX' && String(v.cf[0].z).indexOf('X') !== -1));
  assert.ok(lx, 'uppercase-size LX record found');
  assert.deepEqual(lx.labels, { 22: '22 × 10', 24: '24 × 10' }, 'case-insensitive size parsing');
  // No vehicle: nothing enriched, everything enabled
  const none = diaVehicleInfo(null);
  assert.equal(none.valid, false);
  assert.deepEqual(none.labels, {});
});

test('P4 desktop: module enriches labels, disables unsupported sizes, restores on clear', () => {
  const block = pdp.slice(pdp.indexOf('Vehicle-gated Diameter group (P4, 2026-11-15)'));
  assert.ok(/data-calder-dia-plain/.test(block), 'pristine labels captured for restore');
  assert.ok(/btn\.disabled = !!unsupported/.test(block), 'unsupported diameters disabled');
  assert.ok(/aria-disabled/.test(block), 'aria state mirrors disabled');
  assert.ok(/nameEl\.textContent = \(info\.valid && info\.labels\[token\]\) \? info\.labels\[token\] : plain;/.test(block),
    'combined label applied only when the vehicle is valid AND unambiguous');
  assert.ok(/diaGroup\.hidden = !info\.valid;/.test(block), 'group still gated on vehicle presence');
  assert.ok(/vehicle\.cf && vehicle\.cf\.length/.test(block), 'disable logic only when the vehicle carries fitment records');
  assert.ok(/document\.addEventListener\('calder:vehicle-cleared'[\s\S]*?diaApply\(null\)/.test(pdp), 'clear restores plain labels + enabled state');
});

test('P5: CTA requires a vehicle — exact message, gate before compatibility checks', () => {
  const recheckStart = cta.indexOf('function recheck()');
  const recheckBlock = cta.slice(recheckStart, cta.indexOf('buildOutcome(null);', recheckStart));
  const gateIdx = recheckBlock.indexOf("state: 'VEHICLE_REQUIRED'");
  const incompatIdx = recheckBlock.indexOf("state: 'VEHICLE_INCOMPATIBLE'");
  const sizeIdx = recheckBlock.indexOf('groupFromVehicle(vehicle, snap.tokens.diameter)');
  assert.ok(gateIdx !== -1, 'vehicle-required outcome emitted in recheck');
  assert.ok(incompatIdx > gateIdx, 'gate runs before the incompatibility check');
  assert.ok(sizeIdx > incompatIdx, 'size backstop runs after pattern compatibility');
  assert.ok(cta.includes('Select your vehicle to confirm fitment, check availability, and add this wheel to your cart.'),
    'exact client-requested message wording');
  assert.ok(recheckBlock.includes('if (!vehicle) {'), 'no-vehicle branch');
  assert.ok(/vehicle\.cf && vehicle\.cf\.length &&[\s\S]*?!resolver\.groupFromVehicle\(vehicle, snap\.tokens\.diameter\)/.test(recheckBlock),
    'size backstop fail-closes (only when the vehicle carries cf records)');
  assert.ok(recheckBlock.includes("isn\\u2019t offered for your vehicle"), 'truthful size message');
  // the disabled CTA must never fall back to the default group for purchase
  assert.ok(!/No vehicle -> default group, enabled immediately/.test(cta), 'outdated no-vehicle comment removed');
});

test('P6: resolved price updates the PDP display; formatting mirrors the captured pattern', () => {
  const block = pdp.slice(pdp.indexOf('Size-dependent price (P6, 2026-11-15)'));
  assert.ok(block.includes(".calder-pdp__price .prd-price-regular"), 'targets the theme price node');
  assert.ok(/typeof out\.price !== 'number'/.test(block), 'updates only on numeric resolved prices (no flash on INVALID/VEHICLE_REQUIRED)');
  assert.ok(/pricePattern\.prefix \+ text \+ pricePattern\.suffix/.test(block), 'prefix/suffix from the original Liquid rendering preserved');
  assert.ok(/toLocaleString\('en-US'/.test(block), 'thousands separator preserved when the original had one');
  assert.ok(pdp.slice(pdp.indexOf("document.addEventListener('calder:universal-resolved'")).indexOf('updatePriceDisplay(out);') !== -1,
    'price update wired into the resolved listener');
});

test('P4 mobile parity: Diameter tab gated, Size labels, disabled options, protected tab naming', () => {
  const block = mobile.slice(mobile.indexOf('Vehicle-aware Diameter (P4, 2026-11-15)'));
  assert.ok(/diaTab\.hidden = !diaVehicle;/.test(block), 'Diameter tab hidden without a vehicle');
  assert.ok(/setActiveTab\('center'\)/.test(block), 'active tab moves off Diameter when gated');
  assert.ok(/diaLabels && diaLabels\[token\]/.test(mobile), 'combined Size labels in labelFor');
  assert.ok(/btn\.disabled = true;/.test(mobile.slice(mobile.indexOf('buildOptions'))), 'unsupported diameters disabled in buildOptions');
  assert.ok(mobile.includes("TAB_LABELS = { diameter: 'Diameter'"), 'protected tab naming unchanged');
  assert.ok(mobile.indexOf("diaApplyVehicle(JSON.parse(localStorage.getItem('calder_selected_vehicle')))") !== -1,
    'initial saved-vehicle state applied at init');
  assert.ok(/document\.addEventListener\('calder:vehicle-cleared'[\s\S]*?diaApplyVehicle\(null\)/.test(mobile), 'reset restores the tab');
});

test('P4 CSS: [hidden] guards and disabled affordances on both surfaces', () => {
  const desktopCss = readFileSync(path.join(THEME, 'assets', 'calder-universal-controls.css'), 'utf8');
  const mobileCss = readFileSync(path.join(THEME, 'assets', 'calder-mobile-sticky-configurator.css'), 'utf8');
  assert.ok(/\.calder-uc__option:disabled \{\s*opacity: 0\.45;/.test(desktopCss), 'desktop disabled style');
  assert.ok(/\.calder-mobile-uc__tab\[hidden\] \{\s*display: none !important;/.test(mobileCss), 'mobile tab hidden guard (tab has display:flex)');
  assert.ok(/\.calder-mobile-uc__option:disabled \{\s*opacity: 0\.45;/.test(mobileCss), 'mobile disabled style');
});

test('P5/P6 preserve: quantity, support link, dealer flows, cart add contract intact', () => {
  assert.ok(cta.includes('body: JSON.stringify({'), 'cart add contract intact');
  /* K1 (Batch 7) extended the payload with line-item properties — the
     core contract (variant id authority + quantity + sections) is unchanged. */
  assert.ok(/items: \[\{ id: legacy\.variantId, quantity: qty, properties: addProperties \}\]/.test(cta), 'variantId + quantity payload with K1 properties');
  assert.ok(cta.includes('readQuantity()'), 'quantity read preserved');
});

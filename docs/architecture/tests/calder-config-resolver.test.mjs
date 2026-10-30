#!/usr/bin/env node
/**
 * Automated tests for the Calder configuration resolver (Prompt 02 deliverable).
 * Run: node docs/architecture/tests/calder-config-resolver.test.mjs
 * Sources of truth: docs/architecture/calder_design_registry.json + calder_part_catalog_912.csv
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME_ASSETS = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI', 'assets');

const require = createRequire(import.meta.url);
const resolverFactory = require(path.join(THEME_ASSETS, 'calder-config-resolver.js'));
const registry = JSON.parse(readFileSync(path.join(ARCH, 'calder_design_registry.json'), 'utf8'));

function loadRegistryAsset(name) {
  const code = readFileSync(path.join(THEME_ASSETS, name), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window.CALDER_DESIGN_REGISTRY;
}

const STATES = resolverFactory.STATE;
const byDesign = Object.fromEntries(registry.designs.map((d) => [d.design_id, d]));
function makeR(designId, opts) {
  return resolverFactory.create({ registry, designId, availability: opts && opts.availability, strict: opts && opts.strict, storefrontToken: opts && opts.storefrontToken });
}
const okAvailability = { getAvailability: async () => ({ status: 'available', variantId: 1, priceCents: 110000 }) };

test('registry integrity: 6 designs, 912 parts, expected cell states, no duplicates', () => {
  assert.equal(registry.designs.length, 6);
  for (const d of registry.designs) {
    const r = resolverFactory.create({ registry, designId: d.design_id, availability: okAvailability });
    const diag = r.validate();
    assert.deepEqual(diag.errors, [], d.design_id + ' errors: ' + diag.errors.join('; '));
  }
  const totals = {};
  let parts = 0;
  for (const d of registry.designs) {
    for (const c of d.configurations) {
      for (const e of c.by_group) {
        totals[e.state] = (totals[e.state] || 0) + 1;
        if (e.part_number) parts += 1;
      }
    }
  }
  assert.equal(parts, 912);
  assert.equal(totals.mapped, 864, 'every live-store part binds to a sellable record');
  assert.equal(totals.no_legacy_product, 48, 'CLM-01/CLM-05 6x139-03mm-78.1 22"/24" not imported into the live store');
  assert.equal(totals.no_catalog_part, 24, 'known data-sheet gaps (CLM-01/CLM-05 26" in +03 group)');
  assert.equal(totals.ambiguous || 0, 0);
  assert.equal(totals.mapped + totals.no_legacy_product + totals.no_catalog_part, 936);
});

test('live-store integrity: every mapped cell binds to a real products_import_10-27-2026.csv variant', () => {
  const liveCsv = readFileSync(path.join(ARCH, '..', 'design', 'mockups', 'product imports', 'products_import_10-27-2026.csv'), 'utf8');
  // minimal quoted-field CSV parser (Tags/Body columns contain commas and quotes)
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < liveCsv.length; i++) {
    const c = liveCsv[i];
    if (inQ) {
      if (c === '"' && liveCsv[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  const hIdx = rows[0].indexOf('Handle');
  const sIdx = rows[0].indexOf('Variant SKU');
  // Shopify normalizes handles at import (dots -> hyphens; verified live
  // 2026-10-29: '...-p32-72.6mm-...' serves as '...-p32-72-6mm-...')
  const shopifyHandleize = (h) => String(h).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const liveBySku = new Map();
  for (const r of rows.slice(1)) {
    const handle = r[hIdx], sku = (r[sIdx] || '').trim();
    if (handle && sku && /^CL[BML]\d{2}/.test(sku)) liveBySku.set(sku, shopifyHandleize(handle));
  }
  assert.equal(liveBySku.size, 864, 'live catalog parsed: 864 unique variant SKUs');
  let bound = 0;
  for (const d of registry.designs) {
    for (const c of d.configurations) {
      for (const e of c.by_group) {
        if (e.state !== 'mapped') continue;
        const refs = e.legacy_refs || [];
        assert.equal(refs.length, 1, 'exactly one canonical live ref: ' + e.part_number);
        const ref = refs[0];
        assert.equal(ref.sku, e.part_number, 'live variant SKU equals the part number');
        assert.equal(ref.canonical, true);
        assert.equal(ref.canonical_source, 'verified');
        assert.ok(!/\./.test(ref.handle), 'ref handle is Shopify-normalized (no dots): ' + ref.handle);
        assert.equal(liveBySku.get(ref.sku), ref.handle, 'ref exists on the live product: ' + ref.sku);
        bound += 1;
      }
    }
  }
  assert.equal(bound, 864);
});

test('SKU-first provider: Storefront GraphQL productVariants by SKU, no handle involved', async () => {
  const calls = [];
  const provider = resolverFactory.storefrontSkuProvider('tok-123', {
    fetch: async (url, init) => {
      calls.push({ url: String(url), headers: init.headers, body: JSON.parse(init.body) });
      const node = {
        id: 'gid://shopify/ProductVariant/456789',
        availableForSale: true,
        quantityAvailable: 42,
        price: { amount: '1100.00' },
        product: { handle: 'calder-clb-06-6x139-p25-78.1mm-gloss-black-lip-chrome-bolts-wheels' }
      };
      return { ok: true, json: async () => ({ data: { productVariants: { nodes: [node] } } }) };
    },
    Shopify: { routes: { root: '/' } }
  });
  const av = await provider.getAvailability({ handle: 'irrelevant-renamed-handle', sku: 'CLB0622106397825GB21' });
  assert.equal(calls.length, 1, 'one request');
  assert.ok(calls[0].url.endsWith('/api/2024-10/graphql.json'), 'Storefront GraphQL endpoint: ' + calls[0].url);
  assert.equal(calls[0].headers['X-Shopify-Storefront-Access-Token'], 'tok-123');
  assert.ok(calls[0].body.query.includes('sku:CLB0622106397825GB21'), 'query filters by SKU only');
  assert.equal(av.status, 'available');
  assert.equal(av.variantId, 456789, 'gid parsed to numeric variant id for /cart/add.js');
  assert.equal(av.priceCents, 110000);
  assert.equal(av.inventoryQuantity, 42);
  assert.equal(av.handle, 'calder-clb-06-6x139-p25-78.1mm-gloss-black-lip-chrome-bolts-wheels');
});

test('SKU-first provider: sold-out, missing, failing and unsafe lookups never fail open', async () => {
  const ok = (nodes) => ({ ok: true, json: async () => ({ data: { productVariants: { nodes } } }) });
  const soldOut = resolverFactory.storefrontSkuProvider('t', { fetch: async () => ok([{ id: 'gid://shopify/ProductVariant/1', availableForSale: false, price: { amount: '100' } }]) });
  assert.equal((await soldOut.getAvailability({ sku: 'CLB0622106397825GB21' })).status, 'sold_out');
  const missing = resolverFactory.storefrontSkuProvider('t', { fetch: async () => ok([]) });
  assert.equal((await missing.getAvailability({ sku: 'CLB0622106397825GB21' })).status, 'unknown');
  const gqlError = resolverFactory.storefrontSkuProvider('t', { fetch: async () => ({ ok: true, json: async () => ({ errors: [{ message: 'access denied' }] }) }) });
  assert.equal((await gqlError.getAvailability({ sku: 'CLB0622106397825GB21' })).status, 'unknown');
  const httpError = resolverFactory.storefrontSkuProvider('t', { fetch: async () => ({ ok: false, json: async () => ({}) }) });
  assert.equal((await httpError.getAvailability({ sku: 'CLB0622106397825GB21' })).status, 'unknown');
  const badSku = resolverFactory.storefrontSkuProvider('t', { fetch: async () => { throw new Error('must not fetch for unsafe SKU'); } });
  assert.equal((await badSku.getAvailability({ sku: 'CLB06 22 BAD SKU' })).status, 'unknown');
  const noFetch = resolverFactory.storefrontSkuProvider('t', {});
  assert.equal((await noFetch.getAvailability({ sku: 'CLB0622106397825GB21' })).status, 'unknown');
});

test('create({storefrontToken}) chains SKU-first lookup with handle+SKU fallback', async () => {
  const urls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    urls.push(String(url));
    if (String(url).includes('/api/2024-10/graphql.json')) {
      return { ok: true, json: async () => ({ data: { productVariants: { nodes: [] } } }) };
    }
    return { ok: true, json: async () => ({ variants: [{ id: 777, sku: 'CLB0622106397825GB21', available: true, price: 110000 }] }) };
  };
  try {
    const r = makeR('CLB-06', { storefrontToken: 'tok' });
    const out = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
    assert.equal(out.state, STATES.AVAILABLE, 'fallback resolved the variant');
    assert.equal(out.legacy.variantId, 777);
    assert.ok(urls.some((u) => u.includes('graphql.json')), 'SKU-first Storefront lookup attempted');
    assert.ok(urls.some((u) => u.includes('/products/')), 'handle+SKU fallback used when the SKU query returns nothing');
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('resolver resolves every registry cell; part numbers match the 912-row catalog', async () => {
  const catalog = readFileSync(path.join(ARCH, 'calder_part_catalog_912.csv'), 'utf8').trim().split('\n');
  const header = catalog[0].split(',');
  const cat = new Map(catalog.slice(1).map((line) => {
    const row = {};
    line.split(',').forEach((v, i) => (row[header[i]] = v));
    return [row.part_number, row];
  }));
  assert.equal(cat.size, 912);
  let checked = 0;
  for (const d of registry.designs) {
    const r = makeR(d.design_id, { availability: okAvailability });
    for (const c of d.configurations) {
      for (const e of c.by_group) {
        const out = await r.resolve({
          diameter: c.diameter, center: c.center, barrel: c.barrel, hardware: c.hardware, group: e.group
        });
        if (e.state === 'mapped') {
          assert.equal(out.state, STATES.AVAILABLE, out.config && JSON.stringify(out));
          assert.equal(out.partNumber, e.part_number);
          assert.ok(out.legacy && out.legacy.sku === e.part_number, 'legacy SKU is the exact part number');
          const row = cat.get(e.part_number);
          assert.ok(row, 'part in catalog: ' + e.part_number);
          assert.equal(row.design, d.design_id);
          assert.equal(row.group, e.group);
          /* target handle scheme is DERIVED from the part_number (2026-10-29):
             {design-lower}-{pcd}-cb{bore*10}-et{offset:02d}-{lip gb|pl}-{bolt ch|bk}
             recomputed independently here so builder drift is caught */
          const expectedHandle = [
            row.design.replace('-', '').toLowerCase(),
            row.bolt_pattern,
            'cb' + Math.round(parseFloat(row.center_bore) * 10),
            'et' + row.offset.replace('+', '').replace('mm', '').padStart(2, '0'),
            c.barrel === 'gloss-black' ? 'gb' : 'pl',
            c.hardware === 'chrome' ? 'ch' : 'bk'
          ].join('-');
          assert.equal(e.legacy_refs[0].expected_handle, expectedHandle, 'expected_handle is PN-derived: ' + e.part_number);
          assert.match(e.legacy_refs[0].expected_handle, /^[a-z0-9-]+$/, 'Shopify-verbatim handle charset: ' + e.legacy_refs[0].expected_handle);
        } else if (e.state === 'no_catalog_part') {
          assert.equal(out.state, STATES.NO_CATALOG_PART, JSON.stringify(out.message || out));
        } else {
          assert.equal(out.state, STATES.NO_SELLABLE_RECORD, JSON.stringify({ s: out.state, m: out.message }));
        }
        checked += 1;
      }
    }
  }
  assert.equal(checked, 936);
});

test('canonical legacy binding: live SKU equals the part number (verified 2026-10-29)', async () => {
  const r = makeR('CLB-06', { availability: okAvailability });
  const gloss = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
  assert.ok(/^CLB06\d+GB21$/.test(gloss.legacy.sku), gloss.legacy.sku);
  assert.ok(gloss.legacy.handle.startsWith('calder-clb-06-6x139-p25-78-1mm-gloss-black-lip-chrome-bolts'), 'Shopify-normalized live handle: ' + gloss.legacy.handle);
  const pol = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'polished', hardware: 'chrome', group: '6x139-25mm-78.1' });
  assert.ok(/^CLB06\d+GB11$/.test(pol.legacy.sku), pol.legacy.sku);
  const e = gloss.cell;
  assert.equal(e.legacy_refs.filter((x) => x.canonical).length, 1);
  assert.equal(e.legacy_refs[0].canonical_source, 'verified');
});

test('strict mode passes verified mappings and still blocks unverified ones', async () => {
  const r = makeR('CLB-06', { availability: okAvailability, strict: true });
  const out = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
  assert.equal(out.state, STATES.AVAILABLE, 'live-store-verified mapping clears strict mode');
  const reg = JSON.parse(JSON.stringify(registry));
  const design = reg.designs.find((d) => d.design_id === 'CLB-06');
  const cfg = design.configurations.find((c) => c.diameter === '22' && c.center === 'gloss-black' && c.barrel === 'gloss-black' && c.hardware === 'chrome');
  cfg.by_group.find((g) => g.group === '6x139-25mm-78.1').legacy_refs[0].canonical_source = 'inferred-rule';
  const r2 = resolverFactory.create({ registry: reg, designId: 'CLB-06', availability: okAvailability, strict: true });
  const out2 = await r2.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
  assert.equal(out2.state, STATES.LEGACY_UNVERIFIED);
});

test('sold out and unknown availability states', async () => {
  const soldOut = makeR('CLB-06', { availability: { getAvailability: async () => ({ status: 'sold_out' }) } });
  const out = await soldOut.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
  assert.equal(out.state, STATES.SOLD_OUT);
  const unknown = makeR('CLB-06', { availability: { getAvailability: async () => ({ status: 'unknown' }) } });
  const out2 = await unknown.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
  assert.equal(out2.state, STATES.ERROR);
});

test('known catalog gap: M01/M05 have no 26-inch parts in 6x139-03mm-78.1', async () => {
  for (const id of ['CLM-01', 'CLM-05']) {
    const r = makeR(id, { availability: okAvailability });
    const out = await r.resolve({ diameter: '26', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-03mm-78.1' });
    assert.equal(out.state, STATES.NO_CATALOG_PART);
  }
});

test('CLM-05 binds to live legacy products (previously no_legacy_product)', async () => {
  const r = makeR('CLM-05', { availability: okAvailability });
  const out = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x135-30mm-87.1' });
  assert.equal(out.state, STATES.AVAILABLE);
  assert.ok(out.legacy.handle.startsWith('calder-clm-05-6x135-p30-87-1mm-'), 'Shopify-normalized live handle: ' + out.legacy.handle);
  const gap = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-03mm-78.1' });
  assert.equal(gap.state, STATES.NO_SELLABLE_RECORD, '+03 group is not in the live store');
});

test('incomplete selections never resolve to a variant', async () => {
  const r = makeR('CLB-06', { availability: okAvailability });
  for (const partial of [
    { diameter: '22' },
    { diameter: '22', center: 'gloss-black' },
    { diameter: '22', center: 'gloss-black', barrel: 'gloss-black' },
    { diameter: '23', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome' },
    { diameter: '22', center: 'matte-white', barrel: 'gloss-black', hardware: 'chrome' }
  ]) {
    const out = await r.resolve(partial);
    assert.equal(out.state, STATES.INVALID, JSON.stringify(partial) + ' -> ' + out.state);
  }
});

test('unknown group is INVALID; missing group/vehicle is VEHICLE_REQUIRED', async () => {
  const r = makeR('CLB-06', { availability: okAvailability });
  const bad = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '4x100-0mm-0' });
  assert.equal(bad.state, STATES.INVALID);
  const noVeh = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome' });
  assert.equal(noVeh.state, STATES.VEHICLE_REQUIRED);
});

test('vehicle -> group derivation from fitment-finder vehicle shape (read-only contract)', async () => {
  const r = makeR('CLB-06', { availability: okAvailability });
  const escalade = { y: 2021, m: 'GM', M: 'Escalade', b: '6X139', h: 78.1, cf: [{ z: '22x10', o: '25mm', t: '305/40/22' }, { z: '24x10', o: '25mm', t: '305/35/24' }, { z: '26x10', o: '25mm', t: '305/30/26' }] };
  assert.equal(r.groupFromVehicle(escalade, '22"'), '6x139-25mm-78.1');
  assert.equal(r.groupFromVehicle(escalade, 24), '6x139-25mm-78.1');
  const gx = { b: '6X139', h: 106.1, cf: [{ z: '22x10', o: '30mm' }] };
  assert.equal(r.groupFromVehicle(gx, '22'), '6x139-30mm-106.1');
  const rover = { b: '5X120', h: 72.6, cf: [{ z: '22x10', o: '32mm' }] };
  assert.equal(r.groupFromVehicle(rover, '22'), '5x120-32mm-72.6');
  assert.equal(r.groupFromVehicle(null, '22'), null);
  assert.equal(r.groupFromVehicle({ b: '6X139', h: 78.1, cf: [] }, '22'), null);
  const resolved = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', vehicle: escalade });
  assert.equal(resolved.state, STATES.AVAILABLE);
  assert.equal(resolved.group, '6x139-25mm-78.1');
});

test('stale async responses never overwrite newer selections', async () => {
  let release;
  const gate = new Promise((res) => (release = res));
  let calls = 0;
  const slow = makeR('CLB-06', {
    availability: {
      getAvailability: async () => {
        calls += 1;
        if (calls === 1) { await gate; return { status: 'available', variantId: 111 }; }
        return { status: 'sold_out', variantId: 222 };
      }
    }
  });
  const p1 = slow.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
  const p2 = slow.resolve({ diameter: '24', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: '6x139-25mm-78.1' });
  release();
  const [o1, o2] = await Promise.all([p1, p2]);
  assert.ok(slow.isStale(o1), 'first response is stale');
  assert.ok(!slow.isStale(o2), 'second response is current');
  assert.equal(o2.state, STATES.SOLD_OUT);
});

test('ambiguous synthetic registry blocks purchase', async () => {
  const bad = JSON.parse(JSON.stringify(registry));
  const design = bad.designs[4];
  const cfg = design.configurations.find((c) => c.diameter === '22' && c.center === 'gloss-black' && c.barrel === 'gloss-black' && c.hardware === 'chrome');
  cfg.by_group.push({ ...cfg.by_group[0] });
  const r = resolverFactory.create({ registry: bad, designId: 'CLB-06', availability: okAvailability });
  const diag = r.validate();
  const out = await r.resolve({ diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome', group: cfg.by_group[0].group });
  assert.equal(out.state, STATES.AMBIGUOUS);
  assert.ok(diag.errors.some((e) => /duplicate registry cell/.test(e)));
});

test('theme registry assets evaluate and match the source JSON', () => {
  for (const d of registry.designs) {
    const slice = loadRegistryAsset(`calder-design-registry-${d.legacy_design_code.toLowerCase()}.js`);
    assert.equal(slice.designs.length, 1);
    assert.equal(JSON.stringify(slice.designs[0]), JSON.stringify(d));
  }
  const full = loadRegistryAsset('calder-design-registry.js');
  assert.equal(JSON.stringify(full), JSON.stringify(registry));
});

test('token normalization', () => {
  assert.equal(resolverFactory.normalizeToken('diameter', ' 22" '), '22');
  assert.equal(resolverFactory.normalizeToken('center', 'Black Tint'), 'black-titanium');
  assert.equal(resolverFactory.normalizeToken('center', 'GLOSS BLACK'), 'gloss-black');
  assert.equal(resolverFactory.normalizeToken('barrel', 'Polished Lip'), 'polished');
  assert.equal(resolverFactory.normalizeToken('hardware', 'chrome bolts'), 'chrome');
  assert.equal(resolverFactory.normalizeToken('center', 'matte white'), 'matte-white');
});

test('unknown design throws safely', () => {
  assert.throws(() => makeR('XXX-99'));
});

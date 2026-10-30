#!/usr/bin/env node
/**
 * Cross-card regression tests for collection-card -> universal PDP deep links (Prompt 03).
 * Run: node docs/architecture/tests/calder-card-links.test.mjs
 * Sources: products_import_10-27-2026.csv (LIVE legacy catalog, client-confirmed
 *          2026-10-29: 96 products / 864 variants),
 *          calder_universal_products_import_10-29-2026.csv (six universal
 *          calder-*-wheel design products), calder_design_registry.json,
 *          theme snippets (structural checks of the Liquid URL contract).
 *
 * URL contract (2026-10-29): cards deep-link to the six canonical universal
 * design PDPs (/products/calder-clb-06-wheel?diameter=...&center=...&barrel=...&hardware=...).
 * The universal PDP state manager (calder-pdp-state.js) parses those params and
 * preloads the exact clicked configuration; purchase resolution is SKU-first
 * (Storefront API) and binds to the live legacy variant part_numbers.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const IMPORTS = path.resolve(ARCH, '..', 'design', 'mockups', 'product imports');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');

const registry = JSON.parse(readFileSync(path.join(ARCH, 'calder_design_registry.json'), 'utf8'));
const VALID_CENTERS = new Set(Object.keys(registry.option_tokens.center));
const VALID_BARRELS = new Set(Object.keys(registry.option_tokens.barrel));
const VALID_HARDWARE = new Set(Object.keys(registry.option_tokens.hardware));

// ---- the URL contract, replicated from snippets/calder-design-url.liquid ----
const DESIGN_CODES = ['CLM01', 'CLM02', 'CLM03', 'CLM05', 'CLB06', 'CLB07'];
function designKey(raw) {
  const k = String(raw || '').trim().toUpperCase().replace(/-/g, '');
  return DESIGN_CODES.includes(k) ? k : null;
}
function canonicalHandleOf(raw) {
  const k = designKey(raw);
  return k ? 'calder-' + k.toLowerCase().replace('clm', 'clm-').replace('clb', 'clb-') + '-wheel' : null;
}
function centerToken(raw) {
  const t = String(raw || '').trim().toLowerCase().replace(/\s+/g, '-');
  if (t === 'black-tint') return 'black-titanium';
  return VALID_CENTERS.has(t) ? t : null;
}
function lipBoltTokens(skuBase) {
  if (!skuBase || skuBase.length < 2) return null;
  const lip = skuBase.slice(-2, -1);
  const bolt = skuBase.slice(-1);
  const barrel = lip === '2' ? 'gloss-black' : lip === '1' ? 'polished' : null;
  const hardware = bolt === '1' ? 'chrome' : bolt === '2' ? 'black' : null;
  return { barrel, hardware };
}
function diameterToken(raw) {
  const t = String(raw || '').replace(/"/g, '').trim();
  return /^\d{2}$/.test(t) ? t : null;
}
function cardDesignUrl(product, variant) {
  const handle = canonicalHandleOf(product.designCode);
  const diameter = variant ? diameterToken(variant.diameter) : null;
  const center = variant ? centerToken(variant.center) : null;
  const lb = variant ? lipBoltTokens(variant.skuBase) : null;
  if (!handle || !diameter || !center || !lb || !lb.barrel || !lb.hardware) return null;
  return `/products/${handle}?diameter=${diameter}&center=${center}&barrel=${lb.barrel}&hardware=${lb.hardware}`;
}

// ---- minimal CSV parser (quoted fields) ----
function parseCsv(text) {
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
  return rows;
}

// LIVE store catalog — what collection cards actually render
const liveCsv = readFileSync(path.join(IMPORTS, 'products_import_10-27-2026.csv'), 'utf8');
const liveRows = parseCsv(liveCsv);
const header = liveRows[0];
const col = (name) => header.indexOf(name);
const products = new Map(); // handle -> {designCode, options, variants[]}
for (const r of liveRows.slice(1)) {
  const h = r[col('Handle')];
  if (!h) continue;
  if (!products.has(h)) {
    products.set(h, {
      handle: h,
      title: r[col('Title')],
      designCode: (r[col('design_code (product.metafields.custom.design_code)')] || '').trim(),
      templateSuffix: (r[col('Template suffix')] || '').trim(),
      options: {},
      variants: []
    });
  }
  const p = products.get(h);
  for (const k of [1, 2, 3]) {
    const name = r[col(`Option${k} Name`)];
    if (name) p.options[name] = k - 1;
  }
  p.variants.push({
    diameter: r[col('Option1 Value')],
    center: r[col('Option2 Value')],
    barrel: r[col('Option3 Value')],
    sku: r[col('Variant SKU')]
  });
}

// Shopify import handle normalization (verified live 2026-10-29:
// CSV '...-p32-72.6mm-...' serves as '...-p32-72-6mm-...')
function shopifyHandleize(h) {
  return String(h || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ---- group derivation from variant SKU (verified PN scheme) ----
const BORE = { '78': '78.1', '84': '84.1', '87': '87.1', '72': '72.6', '06': '106.1' };
function skuGroup(skuBase) {
  const tail = skuBase.slice(12, -4);
  if (tail.length !== 4 && tail.length !== 5) return null;
  const bore = BORE[tail.slice(0, -2)];
  if (!bore) return null;
  const off = tail.slice(-2);
  return `${skuBase[9]}x${100 + Number(skuBase.slice(10, 12))}-${Number(off) < 10 ? '0' + Number(off) : off}mm-${bore}`;
}

test('live catalog shape: 96 calder-template products, 864 unique variant SKUs, dashed design codes', () => {
  assert.equal(products.size, 96);
  const skus = new Set();
  for (const p of products.values()) {
    assert.equal(p.templateSuffix, 'calder', 'every live product renders the universal PDP template: ' + p.handle);
    assert.match(p.designCode, /^CL[BML]-\d{2}$/, 'dashed design_code metafield');
    for (const v of p.variants) skus.add(v.sku);
  }
  assert.equal(skus.size, 864);
});

test('universal import provides the six canonical calder-*-wheel design PDPs', () => {
  const uniCsv = readFileSync(path.join(IMPORTS, 'calder_universal_products_import_10-29-2026.csv'), 'utf8');
  const uniRows = parseCsv(uniCsv);
  const uCol = (name) => uniRows[0].indexOf(name);
  const handles = new Set(uniRows.slice(1).map((r) => r[uCol('Handle')]));
  assert.equal(handles.size, 6, 'six universal design products');
  for (const p of products.values()) {
    const canonical = canonicalHandleOf(p.designCode);
    assert.ok(canonical, 'canonical handle derivable: ' + p.designCode);
    assert.ok(handles.has(canonical), 'canonical handle exists in the universal import: ' + canonical);
  }
  for (const r of uniRows.slice(1)) {
    assert.equal(r[uCol('Template suffix')], 'calder', 'universal product renders the universal PDP template');
    assert.equal(r[uCol('Status')], 'active');
    assert.match(r[uCol('design_code (product.metafields.custom.design_code)')], /^CL[BML]-\d{2}$/, 'dashed design_code');
  }
});

test('snippet + card hunk structurally implement the URL contract', () => {
  const snippet = readFileSync(path.join(THEME, 'snippets', 'calder-design-url.liquid'), 'utf8');
  assert.ok(snippet.includes("assign design_key = design_code | remove: '-'"), 'dashed live design codes normalized');
  for (const code of DESIGN_CODES) assert.ok(snippet.includes(`'${code}'`), `design code ${code} in snippet`);
  assert.ok(snippet.includes('black-tint'), 'legacy center alias mapped');
  assert.ok(snippet.includes("'black-titanium'"), 'registry token used');
  for (const token of ['gloss-black', 'polished', 'chrome', 'black']) assert.ok(snippet.includes(`'${token}'`), `token ${token}`);
  assert.ok(snippet.includes("append: '-wheel'"), 'canonical -wheel handle suffix');
  assert.ok(/assign design_url = '\/products\/calder-' \| append: design_slug/.test(snippet), 'deep link targets the canonical universal design PDP');
  const card = readFileSync(path.join(THEME, 'snippets', 'calder-product-card.liquid'), 'utf8');
  assert.ok(card.includes("render 'calder-design-url'"), 'card renders the URL snippet');
  const hunkStart = card.indexOf("assign product_url_collection = product.url");
  const hunk = card.slice(hunkStart, card.indexOf('assign picker_type'));
  assert.ok(/calder_design_pdp_url != blank/.test(hunk), 'fallback preserved: rewrite only when URL resolvable');
  assert.ok(/assign product_url_collection = product\.url/.test(hunk), 'legacy URL assignment preserved');
});

test('every live card variant produces a URL whose tokens are valid registry tokens', () => {
  let rewritten = 0;
  for (const p of products.values()) {
    for (const v of p.variants) {
      const skuBase = (v.sku || '').split('-')[0];
      const url = cardDesignUrl({ designCode: p.designCode, handle: p.handle }, { ...v, skuBase });
      assert.notEqual(url, null, 'live variant produces a card URL: ' + p.handle + ' / ' + v.sku);
      rewritten += 1;
      const m = /^\/products\/(.+)\?diameter=(\d{2})&center=([a-z-]+)&barrel=([a-z-]+)&hardware=([a-z-]+)$/.exec(url);
      assert.ok(m, 'URL shape: ' + url);
      assert.equal(m[1], canonicalHandleOf(p.designCode), 'URL targets the canonical universal design PDP: ' + url);
      assert.ok(VALID_CENTERS.has(m[3]), 'center token valid: ' + url);
      assert.ok(VALID_BARRELS.has(m[4]), 'barrel token valid: ' + url);
      assert.ok(VALID_HARDWARE.has(m[5]), 'hardware token valid: ' + url);
    }
  }
  assert.equal(rewritten, 864, 'all live variants rewritten');
});

test('every card URL resolves through the registry back to the same live product and SKU', async () => {
  const resolverFactory = (await import('node:module')).createRequire(import.meta.url)(
    path.join(THEME, 'assets', 'calder-config-resolver.js'));
  const resolvers = new Map();
  for (const code of DESIGN_CODES) {
    resolvers.set(code, resolverFactory.create({ registry, designCode: code, availability: { getAvailability: async () => ({ status: 'available' }) } }));
  }
  let bound = 0;
  for (const p of products.values()) {
    const key = designKey(p.designCode);
    const resolver = resolvers.get(key);
    assert.ok(resolver, 'resolver for ' + p.designCode);
    for (const v of p.variants) {
      const skuBase = (v.sku || '').split('-')[0];
      const url = cardDesignUrl({ designCode: p.designCode, handle: p.handle }, { ...v, skuBase });
      assert.ok(url, 'URL for ' + p.handle);
      const q = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
      const group = skuGroup(skuBase);
      assert.ok(group, 'group derivable from SKU: ' + skuBase);
      const out = await resolver.resolve({ diameter: q.diameter, center: q.center, barrel: q.barrel, hardware: q.hardware, group });
      assert.ok(out.state === 'MAPPED' || out.state === 'AVAILABLE', `${p.handle} ${v.sku} -> ${out.state}`);
      assert.equal(out.legacy.handle, shopifyHandleize(p.handle), `URL resolves back to the same card product (${p.handle})`);
      assert.equal(out.legacy.sku, v.sku, `URL resolves back to the same variant SKU (${v.sku})`);
      bound += 1;
    }
  }
  assert.equal(bound, 864, 'all live variants bound');
});

test('unknown design codes and undecodable SKUs fall back to the legacy URL (never rewritten)', () => {
  assert.equal(cardDesignUrl({ designCode: 'APX-201', handle: 'apex-201' }, { diameter: '22"', center: 'Gloss Black', skuBase: 'APX-201-18GBL' }), null, 'unknown design code');
  assert.equal(cardDesignUrl({ designCode: 'CLB-06', handle: 'x' }, { diameter: '22"', center: 'Gloss Black', skuBase: 'CLB06SHORT' }), null, 'undecodable SKU tail');
  assert.equal(cardDesignUrl({ designCode: 'CLB-06', handle: 'x' }, { diameter: 'Custom', center: 'Gloss Black', skuBase: 'CLB0622105207232GB22' }), null, 'non-numeric diameter');
  assert.equal(cardDesignUrl({ designCode: 'CLB-06', handle: 'x' }, { diameter: '22"', center: 'Matte White', skuBase: 'CLB0622105207232GB22' }), null, 'invalid center');
});

test('multiple cards of one design produce design-consistent URLs; full 36-config space reachable', () => {
  const urls = new Set();
  const paramTuples = new Set();
  for (const p of products.values()) {
    if (!p.handle.startsWith('calder-clb-06-')) continue;
    for (const v of p.variants) {
      const skuBase = (v.sku || '').split('-')[0];
      const url = cardDesignUrl({ designCode: p.designCode, handle: p.handle }, { ...v, skuBase });
      if (url) {
        urls.add(url);
        paramTuples.add(url.split('?')[1]);
      }
    }
  }
  for (const url of urls) assert.ok(url.startsWith('/products/calder-clb-06-wheel?'), url);
  assert.equal(paramTuples.size, 36, 'distinct config tuples across clb06 cards (3 dia x 3 center x 4 barrel/hardware)');
});

'use strict';
const { Liquid } = require('liquidjs');
const fs = require('fs');
const path = require('path');
const THEME = path.resolve(__dirname, '..', '..', 'docs', 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const engine = new Liquid({ root: path.join(THEME, 'snippets'), extname: '.liquid' });
engine.registerFilter('json', (v) => typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v));
engine.registerFilter('image_url', v => 'https://cdn.example.com/img/' + (v || ''));

function variant(option1, option2) {
  return { option1: option1 || '22"', option2: option2 || 'Gloss Black', option3: 'Black' };
}
const products = [
  {
    handle: 'apex-201', title: 'Apex 201', url: '/products/apex-201', price: 320000, featured_image: {} ,
    metafields: { custom: { design_code: { value: '201' }, bolt_pattern: {}, load_rating: {} } },
    variants: [variant('22"'), variant('24"', 'Black Tint'), variant('26 x 9.5"', 'Titanium Tint')]
  },
  {
    handle: 'vertex-202', title: 'Vertex 202', url: '/products/vertex-202', price: 340000, featured_image: {},
    metafields: { custom: { design_code: { value: '202' }, bolt_pattern: { value: '5x120' }, load_rating: {} } },
    variants: [variant('22", 9'), variant('24"')]
  },
  {
    handle: 'no-design', title: 'Generic Wheel', url: '/products/no-design', price: 1, featured_image: {},
    metafields: { custom: { design_code: {}, bolt_pattern: {} } },
    variants: [variant('22in'), variant('23', 'Gloss Black')]
  }
];
const ctx = {
  collections: {
    'all-calder-wheels': { products: products },
    all: { products: products }
  }
};
let ok = true;
function assert(name, cond, extra) { if (!cond) { ok = false; console.error('FAIL ' + name + ' ' + (extra || '')); } else console.log('OK   ' + name + (extra ? ' ' + extra : '')); }

engine.renderFile('fitment-catalog', ctx).then((out) => {
  let parsed;
  try { parsed = new Function('window', 'return ' + out.replace(/^<script>[\s\S]*?window\.__fitmentCatalog = /, '') + ';')({}); }
  catch (e) {
    // fallback: extract between = and ;
    const m = out.match(/window\.__fitmentCatalog = (\[[\s\S]*?\]);/);
    if (!m) { console.error('PARSE FAIL', out.slice(0, 400)); process.exit(1); }
    try { parsed = JSON.parse(m[1]); } catch (e2) { console.error('JSON FAIL', e2.message); console.error(m[1]); process.exit(1); }
  }
  const p201 = parsed.find(p => p.handle === 'apex-201');
  assert('js parseable + 3 products', parsed.length === 3, 'len=' + parsed.length);
  assert('201 diameters parsed from 22"/24"/26 x 9.5"', JSON.stringify(p201.diameters) === JSON.stringify([22, 24, 26]), JSON.stringify(p201.diameters));
  assert('201 diameter_labels raw (incl inch marks)', JSON.stringify(p201.diameter_labels) === JSON.stringify(['22"', '24"', '26 x 9.5"']), JSON.stringify(p201.diameter_labels));
  assert('201 22x9.5 width parsed', JSON.stringify(p201.widths) === JSON.stringify([9.5]), JSON.stringify(p201.widths));
  assert('201 curated bolt_patterns (no metafield)', JSON.stringify(p201.bolt_patterns) === JSON.stringify(['6x139.7', '6x135']), JSON.stringify(p201.bolt_patterns));
  assert('201 bolt_pattern primary = first curated', p201.bolt_pattern === '6x139.7', p201.bolt_pattern);
  const p202 = parsed.find(p => p.handle === 'vertex-202');
  assert('202 metafield bolt merged into patterns', p202.bolt_pattern === '5x120' && p202.bolt_patterns.indexOf('5x120') !== -1 && p202.bolt_patterns.indexOf('6x139.7') !== -1, JSON.stringify(p202.bolt_patterns));
  const pG = parsed.find(p => p.handle === 'no-design');
  assert('22in + 23 style options parsed', JSON.stringify(pG.diameters) === JSON.stringify([22, 23]), JSON.stringify(pG.diameters));
  assert('finishes raw from option2', JSON.stringify(pG.finishes) === JSON.stringify(['Gloss Black']), JSON.stringify(pG.finishes));
  console.log(ok ? 'FITMENT CATALOG RENDER: PASS' : 'FITMENT CATALOG RENDER: FAIL');
  process.exit(ok ? 0 : 1);
}).catch((e) => { console.error('RENDER ERROR', e.message); process.exit(1); });

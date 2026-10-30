'use strict';
const { Liquid } = require('liquidjs');
const fs = require('fs');
const path = require('path');
const THEME = path.resolve(__dirname, '..', '..', 'docs', 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const engine = new Liquid({
  root: path.join(THEME, 'snippets'),
  extname: '.liquid'
});
engine.registerFilter('asset_url', (v) => 'https://cdn.example.com/assets/' + String(v));
engine.registerFilter('json', (v) => (typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v)));

const mockProduct = {
  id: 777001, handle: 'apex-201', price: 320000,
  metafields: {
    custom: {
      bom: { value: { components: [
        { id: 'BK', name: 'Gloss Black', client_code: 'bk', type: 'center', category: 'standard', unit_cost: 150, retail_price: 400, image: 'design-201-center-bk.png' },
        { id: 'BKUTI', name: 'Black Titanium', client_code: 'bkuti', type: 'center', category: 'premium', unit_cost: 180, retail_price: 480, image: 'design-201-center-bkuti.png' },
        { id: 'SU', name: 'Satin Silver', client_code: 'su', type: 'center', category: 'standard', unit_cost: 160, retail_price: 420, image: 'design-201-center-su.png' },
        { id: 'BK', name: 'Black', client_code: 'bk', type: 'barrel', category: 'standard', unit_cost: 120, retail_price: 300, image: 'finish-barrel-bk.png' },
        { id: 'POLISH', name: 'Polished', client_code: 'polish', type: 'barrel', category: 'premium', unit_cost: 140, retail_price: 360, image: 'finish-barrel-polish.png' },
        { id: 'BK', name: 'Black Bolts', client_code: 'bk', type: 'hardware', category: 'standard', unit_cost: 12, retail_price: 25, image: 'finish-bolt-bk.png' },
        { id: 'CHROME', name: 'Chrome Bolts', client_code: 'chrome', type: 'hardware', category: 'premium', unit_cost: 15, retail_price: 35, image: 'finish-bolt-chrome.png' }
      ] } },
      design_code: { value: '201' },
      lead_time_days: { value: 10 },
      hardware_rivet_finish_options: { value: 'Black Bolts, Chrome Bolts' }
    }
  },
  variants: [
    { id: 1, option1: '22"', option2: 'Gloss Black', option3: 'Black', price: 320000, available: true },
    { id: 2, option1: '22"', option2: 'Gloss Black', option3: 'Chrome', price: 340000, available: true },
    { id: 3, option1: '22"', option2: 'Black Tint', option3: 'Black', price: 330000, available: true },
    { id: 4, option1: '22"', option2: 'Black Tint', option3: 'Chrome', price: 350000, available: true },
    { id: 5, option1: '22"', option2: 'Titanium Tint', option3: 'Black', price: 340000, available: true },
    { id: 6, option1: '22"', option2: 'Titanium Tint', option3: 'Chrome', price: 360000, available: true },
    { id: 7, option1: '24"', option2: 'Gloss Black', option3: 'Black', price: 340000, available: true },
    { id: 8, option1: '24"', option2: 'Gloss Black', option3: 'Chrome', price: 360000, available: true },
    { id: 9, option1: '24"', option2: 'Black Tint', option3: 'Black', price: 350000, available: true },
    { id: 10, option1: '24"', option2: 'Black Tint', option3: 'Chrome', price: 370000, available: false },
    { id: 11, option1: '24"', option2: 'Titanium Tint', option3: 'Black', price: 360000, available: true },
    { id: 12, option1: '24"', option2: 'Titanium Tint', option3: 'Chrome', price: 380000, available: true },
    { id: 13, option1: '26"', option2: 'Gloss Black', option3: 'Black', price: 360000, available: true },
    { id: 14, option1: '26"', option2: 'Gloss Black', option3: 'Chrome', price: 380000, available: true },
    { id: 15, option1: '26"', option2: 'Black Tint', option3: 'Black', price: 370000, available: true },
    { id: 16, option1: '26"', option2: 'Black Tint', option3: 'Chrome', price: 390000, available: true },
    { id: 17, option1: '26"', option2: 'Titanium Tint', option3: 'Black', price: 380000, available: true },
    { id: 18, option1: '26"', option2: 'Titanium Tint', option3: 'Chrome', price: 400000, available: true }
  ]
};

engine.renderFile('configurator-product-data', { product: mockProduct }).then((out) => {
  let obj = null;
  let parseErr = null;
  try {
    obj = new Function('return (' + out + ');')();
  } catch (e) { parseErr = e.message; }
  if (parseErr) { console.error('JS PARSE ERROR:', parseErr); console.error(out.slice(0, 500)); process.exit(1); }
  const assert = (name, cond, extra) => {
    if (!cond) { console.error('ASSERT FAIL', name, extra); process.exitCode = 1; }
    console.log((cond ? 'OK   ' : 'FAIL ') + name + (extra ? ' ' + extra : ''));
  };
  assert('product_id', obj.product_id === 777001);
  assert('product_handle', obj.product_handle === 'apex-201');
  assert('design_code', obj.design_code === '201');
  assert('hardware_options', JSON.stringify(obj.hardware_options) === JSON.stringify(['Black Bolts', 'Chrome Bolts']));
  assert('default_hardware', obj.default_hardware === 'Black Bolts');
  assert('variants length 18', obj.variants.length === 18);
  assert('diameter unique values', obj.components.diameter.length === 3, JSON.stringify(obj.components.diameter.map(d=>d.label)));
  assert('center unique values', obj.components.center.length === 3, JSON.stringify(obj.components.center.map(c=>c.label)));
  assert('barrel unique values', obj.components.barrel.length === 2, JSON.stringify(obj.components.barrel.map(b=>b.label)));
  assert('hardware unique values', obj.components.hardware.length === 2, JSON.stringify(obj.components.hardware.map(h=>h.label)));
  assert('center image mapped (Gloss Black)', (/design-201-center-bk\.png/.test((obj.components.center.find(c=>c.label==='Gloss Black')||{}).image||'')), JSON.stringify(obj.components.center.find(c=>c.label==='Gloss Black')));
  assert('barrel Black image mapped', (/finish-barrel-bk/.test((obj.components.barrel.find(b=>b.label==='Black')||{}).image||'')), JSON.stringify(obj.components.barrel.find(b=>b.label==='Black')));
  assert('barrel Chrome alias → polished placeholder image', (/polish/i.test((obj.components.barrel.find(b=>b.label==='Chrome')||{}).image||'')), JSON.stringify(obj.components.barrel.find(b=>b.label==='Chrome')));
  assert('hardware image mapped (Chrome Bolts)', (/finish-bolt-chrome\.png/.test((obj.components.hardware.find(h=>h.label==='Chrome Bolts')||{}).image||'')), JSON.stringify(obj.components.hardware.find(h=>h.label==='Chrome Bolts')));
  assert('no substring id collisions (22 vs 22x10)', !/22x10/.test(JSON.stringify(obj.components.diameter.map(d=>d.id))));
  console.log(process.exitCode ? 'LIQUID RENDER: FAILED' : 'LIQUID RENDER: PASS');
  process.exit(process.exitCode || 0);
}).catch((e) => { console.error('RENDER ERROR', e); process.exit(1); });

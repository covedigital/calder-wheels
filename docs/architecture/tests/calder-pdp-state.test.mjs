#!/usr/bin/env node
/**
 * URL tests + browser back/forward QA for the universal PDP state manager (Prompt 04).
 * Run: node docs/architecture/tests/calder-pdp-state.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const THEME = path.resolve(ARCH, '..', 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const require = createRequire(import.meta.url);
const pdpState = require(path.join(THEME, 'assets', 'calder-pdp-state.js'));
const resolverFactory = require(path.join(THEME, 'assets', 'calder-config-resolver.js'));
const registry = JSON.parse(readFileSync(path.join(ARCH, 'calder_design_registry.json'), 'utf8'));

function mockEnv(initialPath) {
  const stack = [{ path: initialPath, state: {} }];
  let idx = 0;
  const listeners = {};
  const env = {
    location: {
      get pathname() { return stack[idx].path.split('?')[0]; },
      get search() { const q = stack[idx].path.split('?')[1]; return q ? '?' + q : ''; }
    },
    history: {
      pushState(s, t, u) { stack.splice(idx + 1); stack.push({ path: u, state: s }); idx++; },
      replaceState(s, t, u) { stack[idx] = { path: u, state: s }; },
      get state() { return stack[idx].state; }
    },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    removeEventListener(type, fn) {
      const a = listeners[type] || [];
      const i = a.indexOf(fn);
      if (i !== -1) a.splice(i, 1);
    },
    back() { idx = Math.max(0, idx - 1); (listeners.popstate || []).forEach((f) => f({ type: 'popstate' })); },
    forward() { idx = Math.min(stack.length - 1, idx + 1); (listeners.popstate || []).forEach((f) => f({ type: 'popstate' })); },
    get stack() { return stack.map((e) => e.path); },
    get idx() { return idx; },
    get url() { return stack[idx].path; }
  };
  return env;
}

function makeState(env, designId) {
  const resolver = resolverFactory.create({
    registry, designId: designId || 'CLB-06',
    availability: { getAvailability: async () => ({ status: 'available', variantId: 1, priceCents: 110000 }) }
  });
  return pdpState.create({ designCode: resolver.design.designCode, resolver, history: env.history, location: env.location, addEventListener: env.addEventListener, removeEventListener: env.removeEventListener });
}

const FULL = '/products/calder-clb-06?diameter=22&center=gloss-black&barrel=gloss-black&hardware=chrome';

test('valid full deep link: complete state, canonical URL normalized via replaceState', () => {
  const env = mockEnv('/products/calder-clb-06?diameter=22&center=gloss-black&barrel=gloss-black&hardware=chrome');
  const s = makeState(env);
  const st = s.getState();
  assert.equal(st.complete, true);
  assert.equal(st.source, 'init');
  assert.deepEqual(st.tokens, { diameter: '22', center: 'gloss-black', barrel: 'gloss-black', hardware: 'chrome' });
  assert.equal(env.url, FULL, 'canonical URL written');
});

test('no params: designated verified default applied, URL stays clean', () => {
  const env = mockEnv('/products/calder-clb-06');
  const s = makeState(env);
  const st = s.getState();
  assert.equal(st.source, 'init-default');
  assert.equal(st.complete, true);
  assert.equal(st.modified, false);
  assert.deepEqual(st.tokens, s.defaultConfig);
  assert.equal(env.url, '/products/calder-clb-06', 'no-param canonical URL untouched');
  assert.equal(s.defaultConfig.diameter, '22');
});

test('partial deep link: requested values kept, purchase state incomplete, URL preserved', () => {
  const env = mockEnv('/products/calder-clb-06?diameter=24&center=black-titanium');
  const s = makeState(env);
  const st = s.getState();
  assert.equal(st.complete, false);
  assert.equal(st.tokens.diameter, '24');
  assert.equal(st.tokens.center, 'black-titanium');
  assert.equal(st.tokens.barrel, null);
  assert.equal(st.requested.barrel, null);
  assert.equal(env.url, '/products/calder-clb-06?diameter=24&center=black-titanium', 'partial URL untouched');
});

test('invalid token: shown as requested when representable, blocked, design never changed', () => {
  const env = mockEnv('/products/calder-clb-06?diameter=22&center=matte-white&barrel=gloss-black&hardware=chrome');
  const s = makeState(env);
  const st = s.getState();
  assert.equal(st.complete, false);
  assert.ok(st.invalid.includes('center'));
  assert.equal(st.requested.center, 'matte-white', 'raw requested value retained');
  assert.equal(st.tokens.center, null);
  assert.equal(env.url.includes('matte-white'), true, 'URL preserved so the share reproduces the blocked state');
  assert.equal(st.designCode, s.resolver.design.designCode, 'design identity locked from PDP context');
});

test('non-canonical input values normalize to canonical URL', () => {
  const env = mockEnv('/products/calder-clb-06?diameter=22%22&center=GLOSS%20BLACK&barrel=Polished&hardware=Chrome%20Bolts');
  const s = makeState(env);
  const st = s.getState();
  assert.equal(st.complete, true);
  assert.deepEqual(st.tokens, { diameter: '22', center: 'gloss-black', barrel: 'polished', hardware: 'chrome' });
  assert.equal(env.url, '/products/calder-clb-06?diameter=22&center=gloss-black&barrel=polished&hardware=chrome');
});

test('user selections from complete default push history entries', () => {
  const env = mockEnv('/products/calder-clb-06');
  const s = makeState(env);
  const before = env.stack.length;
  s.setOption('center', 'black-titanium');
  assert.equal(env.stack.length, before + 1, 'complete config pushes');
  assert.ok(env.url.includes('center=black-titanium'));
});

test('replaceState while incomplete; final completion pushes', () => {
  const env = mockEnv('/products/calder-clb-06?diameter=24&center=black-titanium');
  const s = makeState(env);
  const before = env.stack.length;
  s.setOption('barrel', 'polished');
  assert.equal(env.stack.length, before, 'still incomplete → replace on current entry');
  assert.ok(env.url.includes('barrel=polished'));
  s.setOption('hardware', 'black');
  assert.equal(env.stack.length, before + 1, 'completed config pushes a history entry');
});

test('browser back/forward restores state with popstate source (analytics dedup flag)', () => {
  const env = mockEnv('/products/calder-clb-06');
  const s = makeState(env);
  const events = [];
  s.subscribe((snap) => events.push({ source: snap.source, tokens: { ...snap.tokens } }));
  s.setOption('center', 'black-titanium');
  s.setOption('barrel', 'polished');
  s.setOption('hardware', 'black');
  assert.equal(env.stack.length, 4, 'init + 3 pushes');
  env.back();
  let st = s.getState();
  assert.equal(st.source, 'popstate');
  assert.equal(st.complete, true);
  assert.deepEqual(st.tokens, { diameter: '22', center: 'black-titanium', barrel: 'polished', hardware: 'chrome' });
  env.back();
  st = s.getState();
  assert.equal(st.source, 'popstate');
  assert.deepEqual(st.tokens, { diameter: '22', center: 'black-titanium', barrel: 'gloss-black', hardware: 'chrome' });
  env.back();
  st = s.getState();
  assert.equal(st.source, 'popstate');
  assert.equal(st.modified, false, 'initial default entry');
  assert.deepEqual(st.tokens, s.defaultConfig);
  env.forward();
  st = s.getState();
  assert.equal(st.source, 'popstate');
  assert.deepEqual(st.tokens, { diameter: '22', center: 'black-titanium', barrel: 'gloss-black', hardware: 'chrome' });
  const restores = events.filter((e) => e.source === 'popstate').length;
  assert.equal(restores, 4, 'popstate events flagged for analytics dedup');
});

test('history never contains half-picked entries', () => {
  const env = mockEnv('/products/calder-clb-06');
  const s = makeState(env);
  s.setOption('hardware', 'black');
  s.setOption('hardware', null);
  s.setOption('hardware', 'chrome');
  for (const entry of env.stack) {
    if (entry.includes('hardware=')) {
      const v = new URLSearchParams(entry.split('?')[1]).get('hardware');
      assert.ok(v && v.length > 0, 'no empty hardware params in history: ' + entry);
    }
  }
});

test('applyConfig programmatic restore does not push and flags source', () => {
  const env = mockEnv('/products/calder-clb-06');
  const s = makeState(env);
  const before = env.stack.length;
  const st = s.applyConfig({ diameter: '26', center: 'titanium-tint', barrel: 'gloss-black', hardware: 'black' }, { source: 'programmatic' });
  assert.equal(env.stack.length, before, 'replace, not push');
  assert.equal(st.source, 'programmatic');
  assert.equal(st.complete, true);
  assert.ok(env.url.includes('diameter=26'));
});

test('popstate to a partial link blocks instead of silently completing', () => {
  const env = mockEnv('/products/calder-clb-06?diameter=22');
  const s = makeState(env);
  assert.equal(s.getState().complete, false);
  s.setOption('center', 'black-titanium');
  s.setOption('barrel', 'gloss-black');
  s.setOption('hardware', 'chrome');
  assert.equal(s.getState().complete, true);
  env.history.replaceState({}, '', '/products/calder-clb-06?diameter=22');
  env.back();
  const st = s.getState();
  assert.equal(st.complete, false, 'partial entry is incomplete');
  assert.equal(st.tokens.diameter, '22');
  assert.equal(st.tokens.center, 'black-titanium', 'dims present in the entry URL are adopted');
  assert.equal(st.tokens.hardware, null, 'no silent completion from prior state (hardware absent in URL)');
  assert.equal(st.source, 'popstate');
});

test('every design has a verified default that resolves in the registry', async () => {
  for (const d of registry.designs) {
    const env = mockEnv('/products/' + d.canonical_handle);
    const s = makeState(env, d.design_id);
    assert.deepEqual(s.defaultConfig, d.default_configuration, d.design_id);
    const resolver = s.resolver;
    const out = await resolver.resolve({ ...s.defaultConfig, group: d.fitment_groups[0].id });
    assert.ok(['MAPPED', 'AVAILABLE', 'NO_SELLABLE_RECORD'].includes(out.state), d.design_id + ' default resolves to a known state, got ' + out.state);
    assert.equal(out.state === 'AVAILABLE' || out.state === 'MAPPED' || out.state === 'NO_SELLABLE_RECORD', true);
    assert.ok(out.partNumber || out.state === 'NO_SELLABLE_RECORD');
  }
});

test('URL params from card deep links (Prompt 03 contract) initialize cleanly', () => {
  const env = mockEnv('/products/calder-clm-01?diameter=26&center=black-titanium&barrel=polished&hardware=black');
  const s = makeState(env, 'CLM-01');
  const st = s.getState();
  assert.equal(st.complete, true);
  assert.deepEqual(st.tokens, { diameter: '26', center: 'black-titanium', barrel: 'polished', hardware: 'black' });
});

test('destroy removes the popstate listener', () => {
  const env = mockEnv(FULL);
  const s = makeState(env);
  s.destroy();
  const before = s.getState().seq;
  env.back();
  assert.equal(s.getState().seq, before, 'no state change after destroy');
});

#!/usr/bin/env node
/**
 * Batch 8 (2026-11-15) regression tests — gallery entries link to their OWN
 * details pages (G1).
 * Run: node --test docs/architecture/tests/calder-gallery-links.test.mjs
 *
 * G1: the details page architecture already exists — templates/
 * page.gallery-build.json → calder-gallery-detail (route /pages/gallery-
 * build?build=HANDLE) + the native metaobject route (templates/metaobject.
 * gallery_build.liquid). Every gallery entry card must link there (never
 * to a designated product PDP); the details page keeps its own optional
 * product CTA. The legacy wheel-gallery block pointed at
 * shopify://products/calder-clm-01-wheel (the reported bug) — it now
 * points at its OWN CLM-01 entry's details page, resolved from the
 * authoritative content manifest (docs/gallery-audit/vehicle-content/
 * 03-content-manifest.json: handle cadillac-escalade-m-01 / CLM-01 / 201).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARCH = path.resolve(HERE, '..');
const REPO = path.resolve(ARCH, '..');
const THEME = path.join(REPO, 'design', 'Shopify Themes', 'Working Theme-via-CLI');
const MANIFEST = path.join(REPO, 'gallery-audit', 'vehicle-content', '03-content-manifest.json');

const wheelGallery = readFileSync(path.join(THEME, 'sections', 'calder-wheel-gallery.liquid'), 'utf8');
const vehicleGallery = readFileSync(path.join(THEME, 'sections', 'calder-vehicle-gallery.liquid'), 'utf8');
const galleryDetail = readFileSync(path.join(THEME, 'sections', 'calder-gallery-detail.liquid'), 'utf8');
const wheelPage = readFileSync(path.join(THEME, 'templates', 'page.wheel-gallery.json'), 'utf8');
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const entries = manifest.entries || manifest;

// ---- the details architecture exists and is preserved ----
test('G1: the details page template + route exist and stay wired', () => {
  const pageBuild = readFileSync(path.join(THEME, 'templates', 'page.gallery-build.json'), 'utf8');
  assert.ok(pageBuild.includes('calder-gallery-detail'), '/pages/gallery-build?build= route → calder-gallery-detail section');
  const metaobjRoute = readFileSync(path.join(THEME, 'templates', 'metaobject.gallery_build.liquid'), 'utf8');
  assert.ok(metaobjRoute.includes("section 'calder-gallery-detail'"), 'native metaobject route preserved');
});

test('G1: details entry resolution covers all three routes (query param → native metaobject → fallback block)', () => {
  const resolution = galleryDetail.slice(galleryDetail.indexOf('assign qs = request.query_string'), galleryDetail.indexOf('if entry != blank'));
  assert.ok(resolution.includes("metaobjects['gallery_build'][handle]"), 'tier 1: query-param lookup via the CANONICAL metaobjects global (shop.metaobjects is deprecated — by-handle indexing fails on the live storefront)');
  assert.ok(resolution.includes("{% if entry == blank and handle == blank %}"), 'tier 2 guard: no handle');
  assert.ok(resolution.includes("{% if metaobject != blank %}"), 'tier 2: metaobject global checked');
  assert.ok(resolution.includes("{% assign entry = metaobject %}"), 'tier 2: native-route entry resolved from the metaobject global');
  assert.ok(resolution.includes("path_tail != blank and path_tail != 'gallery-build'"), 'tier 2b: deterministic request.path handle parse for the native route');
  assert.ok(resolution.includes("metaobjects['gallery_build'][path_tail]"), 'tier 2b: canonical lookup from the parsed path handle');
  assert.ok(resolution.includes("fallback != blank %}{% assign entry = fallback.settings %}"), 'tier 3: theme-editor fallback block preserved');
});

test('G1: ZERO usages of the deprecated shop.metaobjects object in any gallery file', () => {
  for (const [name, src] of [
    ['calder-gallery-detail.liquid', galleryDetail],
    ['calder-vehicle-gallery.liquid', vehicleGallery],
    ['calder-wheel-gallery.liquid', wheelGallery],
  ]) {
    const codeUsages = src.match(/\{%[^%]*shop\.metaobjects[^%]*%\}/g) || [];
    assert.deepEqual(codeUsages, [], name + ' still uses the deprecated shop.metaobjects in code');
    assert.ok(src.includes('metaobjects.gallery_build.values') || src.includes("metaobjects['gallery_build']"), name + ' uses the canonical metaobjects global');
  }
});

test('G1: the details page keeps its optional product CTA (the product link lives exactly once)', () => {
  assert.ok(galleryDetail.includes('pdp_link'), 'detail page builds the product CTA');
  assert.ok(galleryDetail.includes('VIEW THIS CONFIGURATION'), 'CTA label preserved');
});

// ---- both galleries: every entry links to its OWN details page ----
test('G1: wheel-gallery metaobject entries link to their own details page (no product deep links)', () => {
  const metaLoop = wheelGallery.slice(wheelGallery.indexOf('for build in all_builds'), wheelGallery.indexOf('for block in section.blocks'));
  assert.ok(metaLoop.includes("build.system.url | default: ''"), 'metaobject web route first');
  assert.ok(metaLoop.includes("'/pages/gallery-build?build=' | append: build.system.handle"), 'query-param detail fallback (same as vehicle gallery)');
  assert.ok(!metaLoop.includes('/products/calder-'), 'no PDP deep-link override remains in the entry loop');
  assert.ok(!metaLoop.includes("render 'calder-finish-tokens'"), 'the PDP finish-token deep link is gone from the listing (kept on the detail page CTA)');
});

test('G1: vehicle-gallery link resolution unchanged (was already correct)', () => {
  const metaLoop = vehicleGallery.slice(vehicleGallery.indexOf('for build in all_builds'), vehicleGallery.indexOf('for block in section.blocks'));
  assert.ok(metaLoop.includes("build.system.url | default: ''"), 'metaobject web route');
  assert.ok(metaLoop.includes("'/pages/gallery-build?build=' | append: build.system.handle"), 'detail fallback');
});

test('G1 404 fix: the query-param fallback only emits when the gallery-build PAGE exists in the store', () => {
  // Live QA (2026-11-15) found /pages/gallery-build was never created in admin → 404.
  // Both galleries now guard the fallback with pages['gallery-build'] so entries
  // without a resolvable destination render as non-navigating cards — never a
  // 404, never a redirect to a designated product PDP.
  for (const src of [wheelGallery, vehicleGallery]) {
    const metaLoop = src.slice(src.indexOf('for build in all_builds'), src.indexOf('for block in section.blocks'));
    assert.ok(metaLoop.includes("detail_link == blank and pages['gallery-build'] != blank"),
      'metaobject fallback guarded by page existence');
    const blockLoop = src.slice(src.indexOf('for block in section.blocks'));
    assert.ok(blockLoop.includes("item.gallery_handle != blank and pages['gallery-build'] != blank"),
      'block fallback guarded by page existence');
    assert.ok(!blockLoop.includes('/products/calder-'), 'no product-PDP fallback anywhere in the fallback chain');
  }
});

test('G1: block-path links prefer the entry handle over any stale product URL (both sections)', () => {
  for (const src of [wheelGallery, vehicleGallery]) {
    const blockLoop = src.slice(src.indexOf('for block in section.blocks'), src.indexOf('data-gallery-grid') === -1 ? undefined : src.length);
    assert.ok(blockLoop.includes("detail_link = item.detail_url"), 'block detail_url base');
    assert.ok(blockLoop.includes("if item.gallery_handle != blank"), 'gallery_handle takes precedence (when the details page exists)');
    assert.ok(blockLoop.includes("'/pages/gallery-build?build=' | append: item.gallery_handle"), 'resolves to the entry details page');
  }
});

// ---- the legacy block: REMOVED via Theme Editor (developer action, 2026-11-15) ----
test('G1 rev4: legacy static CLM-01 block fully removed; metaobject entries are the only cards', () => {
  // The developer deleted the static wheel_build block in the Theme Editor (the
  // template JSON is now Shopify-auto-generated with no blocks section). The
  // duplicate/inert card is gone; gallery cards render exclusively from
  // gallery_build metaobjects.
  assert.ok(wheelPage.includes('auto-generated'), 'template is the Shopify-generated post-editor state');
  assert.ok(!wheelPage.includes('shopify://products/calder-clm-01-wheel'), 'stale product URL gone');
  assert.ok(!/wheel_build/.test(wheelPage), 'static block removed entirely');
  assert.ok(!wheelPage.includes('gallery_handle'), 'no stale handle settings remain');
  // activation instructions + the reviewed data sheet still exist
  const sheet = readFileSync(path.join(REPO, 'gallery-audit', 'wheel-content', 'wheel-entry-data-sheet.json'), 'utf8');
  assert.ok(sheet.includes('_pairing_rule'), 'data sheet documents the pairing rule');
});

test('G1 rev2: wheel-entry data sheet is registry- and export-consistent (six designs)', () => {
  const sheet = JSON.parse(readFileSync(path.join(REPO, 'gallery-audit', 'wheel-content', 'wheel-entry-data-sheet.json'), 'utf8'));
  assert.equal(sheet.entries.length, 6, 'one entry per design');
  const handles = new Set();
  for (const e of sheet.entries) {
    assert.match(e.handle, /^[a-z0-9-]+$/, 'kebab handle: ' + e.handle);
    assert.ok(!handles.has(e.handle), 'unique handle');
    handles.add(e.handle);
    assert.equal(e.gallery_type, 'wheel', e.handle + ' is a wheel-type entry');
    assert.match(e.wheel_design_id, /^(201|202|203|205|206|207)$/, 'registry design id');
    assert.ok(['CLM-01', 'CLM-02', 'CLM-03', 'CLM-05', 'CLM-06', 'CLM-07'].includes(e.wheel_model), 'design code');
    assert.equal(e.series || e.wheel_series, 'SUV Wheel - Spun Forged', 'registry series');
    assert.equal(e.construction, 'Spun Forged', 'registry construction');
    assert.equal(e.official_calder_design, true, 'official design (specs + CTA render)');
    // config vocabulary = PDP registry defaults
    assert.equal(e.center_finish, 'Gloss Black');
    assert.equal(e.lip_finish, 'Gloss Black Lip');
    assert.equal(e.hardware_finish, 'Chrome Bolts');
    assert.match(e.front_wheel_size, /^22x10$/, 'registry default size');
    // REVIEW/SUPPLY fields are marked — nothing silently invented
    assert.ok(e.wheel_offset.startsWith('REVIEW'), 'offset flagged for client input with options listed');
    assert.ok(e.center_bore.startsWith('REVIEW'), 'bore flagged for client input with options listed');
    assert.ok(e.cover_image.startsWith('SUPPLY'), 'media is a manual client task (media policy)');
  }
  // bolt lists must equal the live product metafields (export-verified)
  const expected = {
    'CLM-01': '6x135, 6x139', 'CLM-02': '5x120, 5x130, 6x135, 6x139', 'CLM-03': '6x135, 6x139',
    'CLM-05': '6x135, 6x139', 'CLM-06': '5x120, 5x130, 6x135, 6x139', 'CLM-07': '5x120, 5x130, 6x135, 6x139',
  };
  for (const e of sheet.entries) {
    assert.equal(e.bolt_pattern, expected[e.wheel_model], e.wheel_model + ' bolt list matches the product metafield');
  }
});

// ---- rev2: the details-page pairing rule ----
test('G1 rev2: VEHICLES WITH THIS WHEEL matches design + bolt-pattern membership', () => {
  const related = galleryDetail.slice(galleryDetail.indexOf('show_related'));
  assert.ok(related.includes("entry_bp = entry.bolt_pattern.value | default: entry.bolt_pattern"), 'current entry patterns read');
  assert.ok(related.includes('{% assign entry_bp_clean = entry_bp | strip %}'), 'stripped comparison twin assigned (filters are forbidden inside {% if %} — Shopify parser)');
  assert.ok(related.includes('{% assign cand_bp_clean = cand_bp | strip %}'), 'vehicle mini: candidate pattern pre-stripped');
  assert.ok(related.includes('for p in entry_bp_list %}{% assign p_clean = p | strip %}{% if p_clean == cand_bp_clean %}'), 'vehicle mini: exact membership test via pre-stripped assigns (vehicle pattern in the wheel list)');
  assert.ok(related.includes('{% assign bp_match = false %}'), 'fail-closed: candidates default to NO match');
  const vehicleMini = related.slice(related.indexOf('vehicle_gallery_heading'), related.indexOf('wheel_gallery_heading'));
  assert.ok(!vehicleMini.includes('cand_bp == blank %}{% assign bp_match = true %}'), 'no unpatterned-vehicle escape when the wheel entry is patterned (fail-closed)');
  assert.ok(vehicleMini.includes('{% if entry_bp == blank %}{% assign bp_match = true %}{% endif %}'), 'graceful fallback only when the wheel entry itself is unpatterned');
  assert.ok(related.includes('for p in cand_bp_list %}{% assign p_clean = p | strip %}{% if p_clean == entry_bp_clean %}'), 'vehicle page wheel mini: correlated design + pattern rule');
  assert.ok(/kind == 'vehicle' and build\.wheel_model\.value == model/.test(related), 'vehicle mini design-gated (pairing rule)');
  assert.ok(related.includes("pages['gallery-build'] != blank"), 'related link fallbacks carry the 404 guard');
});

test('G1 rev3: wheel mini browses ACROSS designs on wheel pages (client decision 2026-11-15)', () => {
  const related = galleryDetail.slice(galleryDetail.indexOf('show_related'));
  const wheelMini = related.slice(related.indexOf('wheel_gallery_heading'));
  // On a WHEEL page: every other wheel entry shows — any design, any config
  // (a CLM-02 entry must appear on the CLM-01 page), multiple versions per design included.
  assert.ok(wheelMini.includes("{% if kind == 'wheel' and build.system.handle != current_key %}"), 'wheel mini: only the current entry is excluded — NO design gate');
  assert.ok(wheelMini.includes("{% if gallery_type == 'wheel' %}{% assign wheel_show = true %}{% endif %}"), 'wheel page: every other wheel entry shows (browse across designs)');
  assert.ok(wheelMini.includes("{% if gallery_type != 'wheel' and build.wheel_model.value == model %}"), 'vehicle page: correlated design rule retained (pairing rule)');
  assert.ok(wheelMini.includes("{% if bp_match %}{% assign wheel_show = true %}{% endif %}"), 'vehicle page: pattern membership still gates the correlated wheel');
  assert.ok(wheelMini.includes("More Calder wheels are coming soon."), 'wheel page empty note (across designs)');
  assert.ok(related.includes("More builds for this design are coming soon."), 'vehicle page empty note preserved');
});

test('G1 rev3: self-exclusion is route-independent (native route fix)', () => {
  // Live QA (2026-11-15): on the native web-page route the query-string handle is
  // empty, so the old `!= handle` exclusion never fired and the current entry
  // appeared in its OWN related sections. The exclusion now keys on the RESOLVED
  // entry's system handle, which exists on every route tier.
  const related = galleryDetail.slice(galleryDetail.indexOf('show_related'));
  assert.ok(related.includes('{% assign current_key = entry.system.handle | default: handle %}'),
    'self-exclusion key derived from the resolved entry (works on native + query-param + fallback tiers)');
  assert.ok(!related.includes('build.system.handle != handle'), 'old query-string-only exclusion fully replaced');
  const sites = related.split('build.system.handle != current_key').length - 1;
  assert.equal(sites, 2, 'both related loops exclude via the route-independent key');
});

test('Shopify parser strictness: NO filters inside if/unless conditions (session-changed Liquid)', () => {
  // Shopify's live Liquid parser rejects filters inside {% if %} (local theme check
  // does not) — live QA caught one on 2026-11-15. Sweep every Liquid file this
  // session touched; zero tolerance.
  const changedLiquid = [
    ['sections/calder-gallery-detail.liquid', galleryDetail],
    ['sections/calder-wheel-gallery.liquid', wheelGallery],
    ['sections/calder-vehicle-gallery.liquid', vehicleGallery],
    ['sections/calder-specs.liquid', readFileSync(path.join(THEME, 'sections', 'calder-specs.liquid'), 'utf8')],
    ['sections/main-cart-items.liquid', cartItemsLiquid()],
    ['snippets/header-cart-line-item.liquid', readFileSync(path.join(THEME, 'snippets', 'header-cart-line-item.liquid'), 'utf8')],
    ['snippets/header-cart.liquid', readFileSync(path.join(THEME, 'snippets', 'header-cart.liquid'), 'utf8')],
    ['snippets/facets.liquid', facetsLiquid()],
    ['snippets/facets-mobile-popup-container.liquid', popupLiquid()],
    ['snippets/calder-design-nav.liquid', navLiquid()],
    ['snippets/calder-product-card.liquid', readFileSync(path.join(THEME, 'snippets', 'calder-product-card.liquid'), 'utf8')],
    ['snippets/calder-fitment-guide-data.liquid', readFileSync(path.join(THEME, 'snippets', 'calder-fitment-guide-data.liquid'), 'utf8')],
    ['sections/main-collection-product-grid.liquid', readFileSync(path.join(THEME, 'sections', 'main-collection-product-grid.liquid'), 'utf8')],
    ['sections/calder-product.liquid', readFileSync(path.join(THEME, 'sections', 'calder-product.liquid'), 'utf8')],
  ];
  for (const [name, src] of changedLiquid) {
    const bad = (src.match(/\{%-?\s*(if|unless)\b[^%}]*\|/g) || []);
    assert.deepEqual(bad, [], name + ': filter inside an if/unless condition (Shopify rejects at upload)');
  }
});

// helpers (late-loaded readers keep the file's top lean)
function cartItemsLiquid() { return readFileSync(path.join(THEME, 'sections', 'main-cart-items.liquid'), 'utf8'); }
function facetsLiquid() { return readFileSync(path.join(THEME, 'snippets', 'facets.liquid'), 'utf8'); }
function popupLiquid() { return readFileSync(path.join(THEME, 'snippets', 'facets-mobile-popup-container.liquid'), 'utf8'); }
function navLiquid() { return readFileSync(path.join(THEME, 'snippets', 'calder-design-nav.liquid'), 'utf8'); }

test('G1 rev2: empty pairing results render truthful notes + Theme-Editor create-first hints', () => {
  assert.ok(galleryDetail.includes('cg-mini-empty'), 'shopper-facing coming-soon note');
  assert.ok(galleryDetail.includes('Vehicle builds for this design and bolt pattern are coming soon.'), 'vehicle mini empty text');
  assert.ok(galleryDetail.includes('request.design_mode'), 'editor hints gated to Theme Editor previews only');
  assert.ok(galleryDetail.includes('NO MATCHING VEHICLE GALLERY ENTRY'), 'create-the-vehicle-first hint (vice versa on the wheel side)');
  assert.ok(galleryDetail.includes('NO MATCHING WHEEL GALLERY ENTRY'), 'create-the-wheel-first hint');
  const css = readFileSync(path.join(THEME, 'assets', 'calder-gallery-v2.css'), 'utf8');
  assert.ok(css.includes('.cg-mini-empty'), 'empty-note styles');
  assert.ok(css.includes('.cg-mini-editor-note'), 'editor-note styles');
});

test('G1 rev2: wheel details specs gain OFFSET + CENTER BORE rows (PDP specs parity)', () => {
  const specsRow = galleryDetail.slice(galleryDetail.indexOf('OFFSET</dt>'), galleryDetail.indexOf('OFFSET</dt>') + 260);
  assert.ok(specsRow.includes('wheel_offset.value | default: entry.wheel_offset | default: \'—\''), 'offset row, truthful dash fallback');
  assert.ok(galleryDetail.includes("CENTER BORE</dt>"), 'bore row');
  assert.ok(/if gallery_type == 'wheel' %}<div><dt>OFFSET/.test(galleryDetail), 'rows gated to wheel-type entries');
});

test('G1 rev2: wheel_build block intake speaks the PDP vocabulary', () => {
  const raw = readFileSync(path.join(THEME, 'sections', 'calder-wheel-gallery.liquid'), 'utf8');
  const schema = raw.slice(raw.lastIndexOf('{% schema %}') + 12, raw.lastIndexOf('{% endschema %}'));
  const block = JSON.parse(schema).blocks.find((b) => b.type === 'wheel_build');
  const ids = block.settings.map((s) => s.id);
  for (const id of ['center_finish', 'lip_finish', 'hardware_finish', 'bolt_pattern', 'wheel_offset', 'center_bore']) {
    assert.ok(ids.includes(id), 'intake field present: ' + id);
  }
  assert.ok(ids.includes('wheel_diameter'), 'existing intake untouched');
});

test('G1: all manifest entries reference real registry designs (no invented vehicle-to-wheel assignments)', () => {
  const registryIds = new Set(['201', '202', '203', '205', '206', '207']);
  for (const e of entries) {
    if (e.wheel_design_id) {
      assert.ok(registryIds.has(e.wheel_design_id), e.handle + ' -> known design ' + e.wheel_design_id);
    }
  }
});

// ---- media preservation ----
test('G1: zero media changes in this batch', () => {
  const status = execFileSync('git', ['-C', REPO, 'status', '--porcelain', '--',
    'docs/design/Shopify Themes/Working Theme-via-CLI/assets'], { encoding: 'utf8' });
  const media = status.split('\n').filter((l) => /\.(png|jpe?g|webp|mp4|gif|svg|otf|ttf)/i.test(l));
  assert.deepEqual(media, [], 'no gallery/media asset changes: ' + JSON.stringify(media));
});

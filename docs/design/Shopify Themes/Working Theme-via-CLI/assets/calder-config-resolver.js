/*!
 * Calder Wheels — configuration resolver (Prompt 02, amendment 2026-10-28)
 * Data source: assets/calder-design-registry[-code].js  (window.CALDER_DESIGN_REGISTRY)
 * Generated from docs/architecture/calder_design_registry.json — never edit by hand.
 *
 * API:   CALDER_CONFIG_RESOLVER.create({ designCode|designId|handle, registry?, availability?,
 *                                          storefrontToken?, strict? })
 *        .resolve({ diameter, center, barrel, hardware, group?, vehicle? })  -> Promise<outcome>
 *        .peek(config, group) -> sync registry-only outcome (no availability)
 *        .groupFromVehicle(vehicle, diameter) -> '6x139-25mm-78.1' | null
 *        .isStale(outcome), .options, .design, .validate()
 *        CALDER_CONFIG_RESOLVER.storefrontSkuProvider(token, deps) -> SKU-first
 *          availability provider (Storefront API productVariants query by SKU)
 *
 * Purchase resolution is SKU-FIRST (2026-10-29): the part_number variant SKU is
 * the single purchase identifier. When storefrontToken is set, variants are
 * looked up by SKU alone via the Storefront API — product handles are not part
 * of the purchase path, so handle renames/reimports cannot break Add to Cart.
 * The legacy handle+SKU fetch (/products/{handle}.js) remains as fallback when
 * no token is configured or the SKU query fails (never fail-open).
 * States: AVAILABLE SOLD_OUT NO_CATALOG_PART NO_SELLABLE_RECORD AMBIGUOUS
 *         LEGACY_UNVERIFIED INVALID VEHICLE_REQUIRED LOADING ERROR
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) { module.exports = factory(root); }
  else { root.CALDER_CONFIG_RESOLVER = factory(root); }
}(typeof window !== 'undefined' ? window : this, function (root) {
  'use strict';

  var STATE = Object.freeze({
    AVAILABLE: 'AVAILABLE', SOLD_OUT: 'SOLD_OUT', MAPPED: 'MAPPED', NO_CATALOG_PART: 'NO_CATALOG_PART',
    NO_SELLABLE_RECORD: 'NO_SELLABLE_RECORD', AMBIGUOUS: 'AMBIGUOUS', LEGACY_UNVERIFIED: 'LEGACY_UNVERIFIED',
    INVALID: 'INVALID', VEHICLE_REQUIRED: 'VEHICLE_REQUIRED', LOADING: 'LOADING', ERROR: 'ERROR'
  });

  var ALIASES = {
    center: { 'gloss black': 'gloss-black', 'black tint': 'black-titanium', 'black titanium': 'black-titanium', 'titanium tint': 'titanium-tint' },
    barrel: { 'gloss black lip': 'gloss-black', 'gloss black': 'gloss-black', 'polished lip': 'polished', 'polished': 'polished' },
    hardware: { 'chrome bolts': 'chrome', 'chrome': 'chrome', 'black bolts': 'black', 'black': 'black' }
  };

  /* Design-code aliases (2026-11-02 G): the universal CLB-06 / CLB-07 products
     were renamed to CLM-06 / CLM-07 in the live store. If the admin rename also
     updated the custom.design_code metafield, the PDP boots with 'CLM06' /
     'CLM07'. The registry keys the design by its data-sheet identity
     (CLB06/CLB07 — part numbers CLB06xx…), so map the renamed codes back to
     the registry key before lookup. SKUs/part numbers are NOT affected. */
  var DESIGN_KEY_ALIASES = { 'clm06': 'clb06', 'clm07': 'clb07' };

  function norm(value) {
    return String(value == null ? '' : value).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function normalizeToken(dimension, raw) {
    var v = norm(raw).replace(/"/g, '');
    if (dimension === 'diameter') { return /^\d{2}$/.test(v) ? v : null; }
    if (ALIASES[dimension] && ALIASES[dimension][v]) { return ALIASES[dimension][v]; }
    v = v.replace(/\s+/g, '-');
    return v;
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* Storefront GraphQL: productVariants(first:1, query:"sku:<PN>") —
     one identifier, one request, no product handle involved.
     deps = { fetch, Shopify } is injectable for tests. Exported so the
     SKU-first provider can be unit-tested without a browser. */
  function storefrontSkuProvider(token, deps) {
    deps = deps || {};
    var fetchFn = deps.fetch || root.fetch || (typeof fetch === 'function' ? fetch : null);
    var shopify = deps.Shopify || root.Shopify;
    if (typeof fetchFn !== 'function') {
      return { getAvailability: function () { return Promise.resolve({ status: 'unknown' }); } };
    }
    var cache = {}, inflight = {};
    function routesRoot() {
      return (shopify && shopify.routes && shopify.routes.root) || '/';
    }
    function load(sku) {
      if (cache[sku] && Date.now() - cache[sku].t < 60000) { return Promise.resolve(cache[sku].v); }
      if (inflight[sku]) { return inflight[sku]; }
      var query = '{ productVariants(first: 1, query: "sku:' + sku + '") { nodes { id availableForSale quantityAvailable price { amount } product { handle } } } }';
      inflight[sku] = fetchFn(routesRoot() + 'api/2024-10/graphql.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Shopify-Storefront-Access-Token': token },
        body: JSON.stringify({ query: query })
      }).then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.json();
      }).then(function (json) {
        var nodes = (json && json.data && json.data.productVariants && json.data.productVariants.nodes) || [];
        var hit = null;
        if (nodes.length) {
          var v = nodes[0];
          var m = /\/(\d+)$/.exec(String(v.id || ''));
          hit = {
            variantId: m ? parseInt(m[1], 10) : null,
            available: !!v.availableForSale,
            priceCents: v.price && v.price.amount != null ? Math.round(parseFloat(v.price.amount) * 100) : null,
            inventoryQuantity: typeof v.quantityAvailable === 'number' ? v.quantityAvailable : null,
            handle: v.product && v.product.handle ? v.product.handle : null
          };
        }
        cache[sku] = { t: Date.now(), v: hit };
        delete inflight[sku];
        return hit;
      }).catch(function () {
        delete inflight[sku];
        return null;
      });
      return inflight[sku];
    }
    return {
      getAvailability: function (ref) {
        var sku = String((ref && ref.sku) || '');
        if (!/^[A-Za-z0-9_-]+$/.test(sku)) { return Promise.resolve({ status: 'unknown' }); }
        return load(sku).then(function (hit) {
          if (!hit || !hit.variantId) { return { status: 'unknown' }; }
          return { status: hit.available ? 'available' : 'sold_out', variantId: hit.variantId, priceCents: hit.priceCents, inventoryQuantity: hit.inventoryQuantity, handle: hit.handle };
        });
      }
    };
  }

  function create(opts) {
    opts = opts || {};
    var registry = opts.registry || (typeof window !== 'undefined' ? window.CALDER_DESIGN_REGISTRY : null);
    if (!registry || !Array.isArray(registry.designs)) {
      throw new Error('CALDER_CONFIG_RESOLVER: registry not provided (set window.CALDER_DESIGN_REGISTRY or pass {registry})');
    }
    var key = opts.designCode || opts.designId || opts.handle || '';
    var k = norm(key).replace(/calder-/, '').replace(/-/g, '');
    if (DESIGN_KEY_ALIASES[k]) { k = DESIGN_KEY_ALIASES[k]; }
    var design = null;
    for (var i = 0; i < registry.designs.length; i++) {
      var d = registry.designs[i];
      if (norm(d.legacy_design_code).replace(/-/g, '') === k ||
          norm(d.design_id).replace(/-/g, '') === k ||
          norm(d.canonical_handle).replace(/-/g, '') === k) { design = d; break; }
    }
    if (!design) { throw new Error('CALDER_CONFIG_RESOLVER: unknown design "' + key + '"'); }

    var strictMode = !!opts.strict;
    var tokens = registry.option_tokens || {};
    var validTokens = {
      diameter: (tokens.diameter || []).map(String),
      center: Object.keys(tokens.center || {}),
      barrel: Object.keys(tokens.barrel || {}),
      hardware: Object.keys(tokens.hardware || {})
    };
    var labelMaps = {
      center: tokens.center || {}, barrel: tokens.barrel || {}, hardware: tokens.hardware || {}
    };
    var groupIndex = {};
    (design.fitment_groups || []).forEach(function (g) { groupIndex[g.id] = g; });
    var configIndex = {};
    (design.configurations || []).forEach(function (c) {
      configIndex[c.diameter + '|' + c.center + '|' + c.barrel + '|' + c.hardware] = c;
    });
    var diagnostics = validate(registry);

    function normalizeConfig(raw) {
      raw = raw || {};
      var out = {}, problems = [];
      ['diameter', 'center', 'barrel', 'hardware'].forEach(function (dim) {
        var t = normalizeToken(dim, raw[dim]);
        if (!t || validTokens[dim].indexOf(t) === -1) { problems.push(dim); }
        out[dim] = t || null;
      });
      return { tokens: out, problems: problems, complete: problems.length === 0 };
    }

    function peekCell(config, group) {
      var c = configIndex[config.diameter + '|' + config.center + '|' + config.barrel + '|' + config.hardware];
      if (!c) { return { state: STATE.NO_CATALOG_PART, entry: null, cell: null }; }
      var cells = (c.by_group || []).filter(function (e) { return e.group === group; });
      if (cells.length === 0) {
        return { state: STATE.NO_CATALOG_PART, entry: null, cell: null,
                 message: 'Configuration not offered for this fitment group' };
      }
      var e = cells[0];
      if (cells.length > 1) { return { state: STATE.AMBIGUOUS, entry: e, cell: e, message: 'Duplicate registry cells' }; }
      if (e.state === 'no_catalog_part' || !e.part_number) {
        return { state: STATE.NO_CATALOG_PART, entry: e, cell: e };
      }
      var refs = e.legacy_refs || [];
      var canonical = refs.filter(function (r) { return r.canonical; });
      if (canonical.length > 1) { return { state: STATE.AMBIGUOUS, entry: e, cell: e, message: 'Multiple canonical legacy refs' }; }
      if (canonical.length === 0) {
        return { state: refs.length ? STATE.AMBIGUOUS : STATE.NO_SELLABLE_RECORD, entry: e, cell: e,
                 candidates: refs, message: refs.length ? 'Legacy candidate ambiguity' : 'No sellable legacy record' };
      }
      if (strictMode && canonical[0].canonical_source !== 'verified') {
        return { state: STATE.LEGACY_UNVERIFIED, entry: e, cell: e, legacy: canonical[0],
                 message: 'Canonical legacy mapping unverified (strict mode)' };
      }
      return { state: STATE.MAPPED, entry: e, cell: e, legacy: canonical[0] };
    }

    function peek(config, group) {
      var n = normalizeConfig(config);
      if (!n.complete) { return { seq: seq, state: STATE.INVALID, config: n.tokens, problems: n.problems }; }
      if (!group || !groupIndex[group]) { return { seq: seq, state: STATE.VEHICLE_REQUIRED, config: n.tokens }; }
      var r = peekCell(n.tokens, group);
      return { seq: seq, state: r.state, config: n.tokens, group: group, cell: r.cell,
               entry: r.entry, legacy: r.legacy, candidates: r.candidates, message: r.message };
    }

    function groupFromVehicle(vehicle, diameter) {
      var dia = normalizeToken('diameter', diameter);
      if (!vehicle || !dia || !vehicle.b || vehicle.h == null || !Array.isArray(vehicle.cf)) { return null; }
      var bp = /^(\d+)X(\d+)$/i.exec(norm(vehicle.b).toUpperCase());
      if (!bp) { return null; }
      var off = null;
      for (var i = 0; i < vehicle.cf.length; i++) {
        if (norm(vehicle.cf[i].z).indexOf(dia + 'x') === 0) { off = parseInt(vehicle.cf[i].o, 10); break; }
      }
      if (off == null || isNaN(off)) { return null; }
      var bore = Number(vehicle.h);
      return bp[1].toLowerCase() + 'x' + bp[2] + '-' + pad2(off) + 'mm-' + String(bore);
    }

    /* ── Availability providers ─────────────────────────────────────────
       SKU-FIRST (mismatch-proof): the variant part_number is the single
       purchase identifier, so the primary provider resolves by SKU alone
       via the Storefront API — no product handle involved. Handle renames
       or reimports can never break purchase resolution again.
       The legacy handle+SKU fetch remains as FALLBACK: used when no
       storefront token is configured, or when the SKU query cannot be
       answered (fail-safe, never fail-open). */

    function handleSkuProvider() {
      var cache = {}, inflight = {};
      function routesRoot() {
        return (root.Shopify && root.Shopify.routes && root.Shopify.routes.root) || '/';
      }
      function load(handle) {
        if (cache[handle] && Date.now() - cache[handle].t < 60000) { return Promise.resolve(cache[handle].v); }
        if (inflight[handle]) { return inflight[handle]; }
        inflight[handle] = fetch(routesRoot() + 'products/' + encodeURIComponent(handle) + '.js', {
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) { throw new Error('HTTP ' + res.status); }
          return res.json();
        }).then(function (product) {
          var bySku = {};
          (product.variants || []).forEach(function (v) {
            if (v.sku) { bySku[v.sku] = { variantId: v.id, available: !!v.available, priceCents: v.price, inventoryQuantity: typeof v.inventory_quantity === 'number' ? v.inventory_quantity : null }; }
          });
          cache[handle] = { t: Date.now(), v: bySku };
          delete inflight[handle];
          return bySku;
        }).catch(function () {
          delete inflight[handle];
          return null;
        });
        return inflight[handle];
      }
      return {
        getAvailability: function (ref) {
          return load(ref.handle).then(function (bySku) {
            if (!bySku) { return { status: 'unknown' }; }
            var hit = bySku[ref.sku];
            if (!hit) { return { status: 'unknown' }; }
            return { status: hit.available ? 'available' : 'sold_out', variantId: hit.variantId, priceCents: hit.priceCents, inventoryQuantity: hit.inventoryQuantity };
          });
        }
      };
    }

    function defaultAvailabilityProvider(opts) {
      opts = opts || {};
      var fallback = handleSkuProvider();
      if (!opts.storefrontToken) { return fallback; }
      var primary = storefrontSkuProvider(opts.storefrontToken);
      return {
        getAvailability: function (ref) {
          return primary.getAvailability(ref).then(function (av) {
            if (av && av.status !== 'unknown') { return av; }
            return fallback.getAvailability(ref);
          });
        }
      };
    }

    var availability = opts.availability || defaultAvailabilityProvider(opts);
    var seq = 0;

    function resolve(input) {
      var mySeq = ++seq;
      var n = normalizeConfig(input);
      if (!n.complete) {
        return Promise.resolve({ seq: mySeq, state: STATE.INVALID, config: n.tokens, problems: n.problems,
                                 message: 'Incomplete or invalid selection: ' + n.problems.join(', ') });
      }
      var group = input.group;
      if (!group && input.vehicle) { group = groupFromVehicle(input.vehicle, n.tokens.diameter); }
      if (input.group && !groupIndex[input.group]) {
        return Promise.resolve({ seq: mySeq, state: STATE.INVALID, config: n.tokens,
                                 message: 'Unknown fitment group: ' + input.group });
      }
      if (!group || !groupIndex[group]) {
        return Promise.resolve({ seq: mySeq, state: STATE.VEHICLE_REQUIRED, config: n.tokens,
                                 message: 'Select a fitment-checked vehicle to resolve the exact wheel' });
      }
      var r = peekCell(n.tokens, group);
      if (r.state !== STATE.MAPPED) {
        return Promise.resolve({ seq: mySeq, state: r.state, config: n.tokens, group: group,
                                 entry: r.entry, cell: r.cell, candidates: r.candidates, message: r.message });
      }
      return availability.getAvailability({ handle: r.legacy.handle, sku: r.legacy.sku }).then(function (av) {
        if (mySeq !== seq) { return { seq: mySeq, state: STATE.LOADING, stale: true, config: n.tokens, group: group }; }
        var base = { seq: mySeq, config: n.tokens, group: group, cell: r.cell, entry: r.entry,
                     legacy: { handle: r.legacy.handle, sku: r.legacy.sku, variantId: av.variantId || null },
                     partNumber: r.cell.part_number, msrp: r.entry.msrp };
        if (!av || av.status === 'unknown') {
          base.state = STATE.ERROR;
          base.message = 'Availability could not be verified — purchase is disabled';
          return base;
        }
        base.state = av.status === 'available' ? STATE.AVAILABLE : STATE.SOLD_OUT;
        if (av.inventoryQuantity != null) { base.inventoryQuantity = av.inventoryQuantity; }
        base.price = typeof av.priceCents === 'number' ? av.priceCents / 100 : r.entry.msrp;
        base.availability = av.status;
        return base;
      });
    }

    function isStale(outcome) { return !outcome || outcome.seq !== seq || !!outcome.stale; }

    function validate(reg) {
      var stats = { designs: reg.designs.length, parts: 0, cells: {}, errors: [], warnings: [] };
      reg.designs.forEach(function (d) {
        var seen = {};
        (d.configurations || []).forEach(function (c) {
          var key = c.diameter + '|' + c.center + '|' + c.barrel + '|' + c.hardware;
          if (seen[key]) { stats.errors.push('duplicate configuration ' + d.design_id + ' ' + key); }
          seen[key] = 1;
          var cellSeen = {};
          (c.by_group || []).forEach(function (e) {
            if (cellSeen[e.group]) { stats.errors.push('duplicate registry cell ' + d.design_id + ' ' + key + ' @' + e.group); }
            cellSeen[e.group] = 1;
            stats.cells[e.state] = (stats.cells[e.state] || 0) + 1;
            if (e.part_number) { stats.parts += 1; }
            if (e.state === 'mapped') {
              if (!e.part_number) { stats.errors.push(d.design_id + ' mapped cell without part_number'); }
              var canonCount = (e.legacy_refs || []).filter(function (r) { return r.canonical; }).length;
              if (canonCount === 0) { stats.warnings.push(d.design_id + ' ' + e.part_number + ': mapped without canonical legacy ref'); }
              if (canonCount > 1) { stats.errors.push(d.design_id + ' ' + e.part_number + ': multiple canonical legacy refs'); }
            }
            if (e.state === 'ambiguous') { stats.errors.push(d.design_id + ': ambiguous registry cell in ' + (e.group || '?')); }
          });
        });
      });
      return stats;
    }

    return Object.freeze({
      STATE: STATE,
      design: Object.freeze({
        designId: design.design_id, designNumber: design.design_number,
        designCode: design.legacy_design_code, handle: design.canonical_handle,
        title: design.title, series: design.series, msrpByDiameter: design.msrp_by_diameter,
        defaultConfig: design.default_configuration ? Object.freeze(Object.assign({}, design.default_configuration)) : null,
        fitmentGroups: Object.freeze(design.fitment_groups.slice()),
        diameters: Object.freeze(design.diameters.slice()),
        centers: Object.freeze(design.centers.slice()),
        barrelFinishes: Object.freeze(design.barrel_finishes.slice()),
        hardwareFinishes: Object.freeze(design.hardware_finishes.slice())
      }),
      options: Object.freeze(validTokens),
      labels: Object.freeze(labelMaps),
      normalizeConfig: normalizeConfig,
      normalizeToken: normalizeToken,
      peek: peek,
      peekCell: peekCell,
      groupFromVehicle: groupFromVehicle,
      resolve: resolve,
      isStale: isStale,
      validate: function () { return validate(registry); },
      diagnostics: diagnostics
    });
  }

  return Object.freeze({ STATE: STATE, create: create, normalizeToken: normalizeToken, storefrontSkuProvider: storefrontSkuProvider });
}));

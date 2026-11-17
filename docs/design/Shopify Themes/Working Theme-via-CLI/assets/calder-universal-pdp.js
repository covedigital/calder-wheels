/*!
 * Calder universal PDP controls controller (Prompt 05, amendment 2026-10-28)
 * Wires snippets/calder-universal-controls.liquid to CALDER_CONFIG_RESOLVER +
 * CALDER_PDP_STATE. Updates selection state, preview layers, and spec labels.
 * Purchase CTA/price wiring is Prompt 06 — this module never submits a cart line.
 * Exposes window.CALDER_UNIVERSAL_PDP = { state, resolver, root }.
 */
(function () {
  'use strict';
  var DIMS = ['diameter', 'center', 'barrel', 'hardware'];
  function boot() {
    var CCR = window.CALDER_CONFIG_RESOLVER;
    var CPS = window.CALDER_PDP_STATE;
    var REG = window.CALDER_DESIGN_REGISTRY;
    var root = document.querySelector('[data-calder-universal]');
    if (!CCR || !CPS || !REG || !root) { return; }
    if (root.dataset.calderUcBooted) { return; }
    root.dataset.calderUcBooted = '1';
    var designCode = (root.getAttribute('data-design-code') || '').trim().toUpperCase();
    var storefrontToken = (root.getAttribute('data-storefront-token') || '').trim();
    var resolver;
    try {
      resolver = CCR.create({ registry: REG, designCode: designCode, storefrontToken: storefrontToken });
    } catch (e) {
      root.setAttribute('data-calder-uc-error', 'registry-unavailable');
      return;
    }
    var previewFallback = document.querySelector('[data-calder-uc-fallback]');
    function allLayers(dim) { return Array.prototype.slice.call(document.querySelectorAll('[data-calder-uc-layer="' + dim + '"]')); }
    /* Design-specific component renders (2026-11-02): every universal design has
       its own CalderRender layer set —
         {design_number}-disk-{gb|bt|ti}.png      (center: gloss-black / black-titanium / titanium-tint)
         {design_number}-barrel-{gb|gbl}.png      (lip: gloss-black / polished)
         {design_number}-{24|30}pcs-{bk|ch}.png  (hardware: black / chrome; 203 & 205 are 30-bolt)
       Selected by the registry design_number (resolver.design.designNumber).
       Designs without a render set fall back to the original generic component
       images; a 404 on any layer still trips the data-calder-uc-missing path. */
    var DESIGN_IMAGE_SETS = {
      201: { pcs: '24pcs' },
      202: { pcs: '24pcs' },
      203: { pcs: '30pcs' },
      205: { pcs: '30pcs' },
      206: { pcs: '24pcs' },
      207: { pcs: '24pcs' }
    };
    function buildAssetMap(designNumber) {
      var n = String(designNumber == null ? '' : designNumber).trim();
      var set = DESIGN_IMAGE_SETS[n];
      if (!set) {
        return {
          center: {
            'gloss-black': { src: assetUrl('wheel-component-center-spun-gloss-black.png'), alt: 'Gloss Black center' },
            'black-titanium': { src: assetUrl('wheel-component-center-spun-black-tint.png'), alt: 'Black Titanium center' },
            'titanium-tint': { src: assetUrl('wheel-component-center-spun-titanium-tint.png'), alt: 'Titanium Tint center' }
          },
          barrel: {
            'gloss-black': { src: assetUrl('wheel-component-barrel-spun-gloss-black.png'), alt: 'Gloss Black barrel and lip' },
            'polished': { src: assetUrl('wheel-component-barrel-spun-polished.png'), alt: 'Polished barrel and lip' }
          },
          hardware: {
            'chrome': { src: assetUrl('finish-bolt-chrome.png'), alt: 'Chrome bolts hardware' },
            'black': { src: assetUrl('finish-bolt-bk.png'), alt: 'Black bolts hardware' }
          }
        };
      }
      return {
        center: {
          'gloss-black': { src: assetUrl(n + '-disk-gb.png'), alt: 'Gloss Black center' },
          'black-titanium': { src: assetUrl(n + '-disk-bt.png'), alt: 'Black Titanium center' },
          'titanium-tint': { src: assetUrl(n + '-disk-ti.png'), alt: 'Titanium Tint center' }
        },
        barrel: {
          'gloss-black': { src: assetUrl(n + '-barrel-gb.png'), alt: 'Gloss Black barrel and lip' },
          'polished': { src: assetUrl(n + '-barrel-gbl.png'), alt: 'Polished barrel and lip' }
        },
        hardware: {
          'chrome': { src: assetUrl(n + '-' + set.pcs + '-ch.png'), alt: 'Chrome bolts hardware' },
          'black': { src: assetUrl(n + '-' + set.pcs + '-bk.png'), alt: 'Black bolts hardware' }
        }
      };
    }
    var ASSET_MAP = buildAssetMap(resolver.design.designNumber);
    function assetUrl(name) {
      var el = document.querySelector('script[src*="calder-universal-pdp.js"], link[href*="calder-universal-controls.css"]');
      if (el) {
        var url = el.src || el.href;
        return url.replace(/calder-universal-(pdp\.js|controls\.css).*$/, name);
      }
      return name;
    }

    var state = CPS.create({ designCode: resolver.design.designCode, resolver: resolver });

    function labelsFor(dim) { return resolver.labels[dim] || {}; }

    function syncSelection(tokens) {
      var buttons = root.querySelectorAll('[data-calder-uc-option]');
      Array.prototype.forEach.call(buttons, function (btn) {
        var dim = btn.getAttribute('data-dim');
        var token = btn.getAttribute('data-token');
        var selected = tokens[dim] === token;
        btn.classList.toggle('is-selected', selected);
        btn.setAttribute('aria-checked', selected ? 'true' : 'false');
        btn.tabIndex = selected ? 0 : -1;
      });
      DIMS.forEach(function (dim) {
        var labelEl = root.querySelector('[data-calder-uc-selected="' + dim + '"]');
        if (!labelEl) { return; }
        var token = tokens[dim];
        if (!token) {
          var req = state.getState().requested[dim];
          labelEl.textContent = req ? String(req) : 'Select an option';
          labelEl.setAttribute('data-calder-uc-pending', 'true');
          return;
        }
        labelEl.removeAttribute('data-calder-uc-pending');
        labelEl.textContent = labelsFor(dim)[token] || token;
      });
    }

    function syncPreview(tokens) {
      ['barrel', 'center', 'hardware'].forEach(function (dim) {
        var token = tokens[dim];
        var entry = token && ASSET_MAP[dim] && ASSET_MAP[dim][token];
        allLayers(dim).forEach(function (img) {
          if (!entry) {
            img.style.display = 'none';
            showFallback();
            return;
          }
          if (img.getAttribute('src') !== entry.src) {
            img.onload = function () { img.removeAttribute('data-calder-uc-missing'); hideFallbackIfComplete(tokens); };
            img.onerror = function () {
              img.removeAttribute('src');
              img.setAttribute('data-calder-uc-missing', dim);
              showFallback();
            };
            img.setAttribute('src', entry.src);
            if (img.complete && img.naturalWidth > 0) {
              img.removeAttribute('data-calder-uc-missing');
              hideFallbackIfComplete(tokens);
            }
          }
          img.setAttribute('alt', img.hasAttribute('data-calder-uc-thumb-layer') ? '' : entry.alt);
          img.style.display = '';
          img.style.opacity = '';
        });
      });
      hideFallbackIfComplete(tokens);
    }

    function showFallback() { if (previewFallback) { previewFallback.removeAttribute('hidden'); } }
    function hideFallbackIfComplete(tokens) {
      if (!previewFallback) { return; }
      var allLayersOk = ['barrel', 'center', 'hardware'].every(function (dim) {
        var token = tokens[dim];
        var entry = token && ASSET_MAP[dim] && ASSET_MAP[dim][token];
        if (!entry) { return false; }
        var imgs = allLayers(dim);
        return imgs.length === 0 || imgs.every(function (img) { return !img.hasAttribute('data-calder-uc-missing'); });
      });
      if (allLayersOk) { previewFallback.setAttribute('hidden', 'hidden'); }
    }

    /* Width fragment of a fitment size string ("22x10" -> "10"). Shared by the
       P4 Size labels and the P7 spec cells below. */
    function diaWidthFrom(size) {
      var m = /^\d{2}\s*[x×]\s*([\d.]+)/i.exec(String(size || ''));
      return m ? m[1] : '';
    }

    function updateSpecCells(tokens) {
      var specDims = { diameter: 'diameter', center: 'center', barrel: 'barrel', hardware: 'hardware' };
      Object.keys(specDims).forEach(function (dim) {
        var cell = document.querySelector('[data-calder-spec="' + dim + '"]');
        if (!cell) { return; }
        var token = tokens[dim];
        cell.textContent = token ? ((labelsFor(dim) || {})[token] || token) : '—';
      });
      var diaCells = document.querySelectorAll('[data-calder-spec="diameter"]');
      Array.prototype.forEach.call(diaCells, function (cell) {
        if (tokens.diameter) { cell.textContent = tokens.diameter + '"'; }
      });
      applyVehicleSpecs(tokens);
    }

    /* ── Exact vehicle specs (P7, 2026-11-15) ──
       Width / Bolt Pattern / Center Bore / Offset in .calder-specs__table are
       the GENERAL specification until a vehicle + configuration are selected.
       With both, the EXACT assigned values come from the vehicle's own fitment
       records (cf.z width, cf.o offset) and the resolved registry fitment
       group id (bolt pattern + wheel center bore) — never derived from the
       ranges. Staggered fitments show the true front/rear width pair. When
       anything is unresolvable (no vehicle, no cf match, no group), the
       server-rendered general values + their "general" tags are restored
       untouched; the Batch 5 purchase gates already block any unresolved
       configuration, so no unsafe exact value is ever shown next to a
       purchasable state. */
    var SPEC_DIMS = ['width', 'bolt', 'offset', 'bore'];
    var SPEC_PRISTINE = {};
    SPEC_DIMS.forEach(function (dim) {
      var cell = document.querySelector('[data-calder-spec="' + dim + '"]');
      if (cell) { SPEC_PRISTINE[dim] = cell.innerHTML; }
    });
    function specVehicleData(tokens) {
      var vehicle = readSavedVehicle();
      if (!vehicle || !tokens || !tokens.diameter) { return null; }
      var group = null;
      try { group = resolver.groupFromVehicle(vehicle, tokens.diameter); } catch (e) { group = null; }
      var cfg = null;
      (vehicle.cf || []).forEach(function (c) {
        var m = /^(\d{2})\s*[x×]/i.exec(String((c && c.z) || ''));
        if (m && m[1] === tokens.diameter) { cfg = c; }
      });
      return (group && cfg) ? { group: group, cfg: cfg } : null;
    }
    function specWidthFromCfg(cfg) {
      var front = diaWidthFrom(cfg.z || cfg.fz);
      var rear = diaWidthFrom(cfg.rz || cfg.z);
      if (!front) { return ''; }
      if (cfg.rz && rear && front !== rear) { return 'Front ' + front + '" / Rear ' + rear + '"'; }
      return front + '"';
    }
    function specOffsetFromCfg(cfg) {
      var m = /^\+?0*(\d+(?:\.\d+)?)\s*mm$/i.exec(String(cfg.o || ''));
      return m ? '+' + m[1] + 'mm' : '';
    }
    function setSpecCell(dim, value) {
      var cell = document.querySelector('[data-calder-spec="' + dim + '"]');
      if (!cell) { return; }
      var pristine = SPEC_PRISTINE[dim];
      if (value) {
        cell.textContent = value;
        cell.setAttribute('data-calder-spec-exact', '1');
      } else if (pristine !== undefined && cell.getAttribute('data-calder-spec-exact') === '1') {
        cell.innerHTML = pristine;
        cell.removeAttribute('data-calder-spec-exact');
      }
    }
    function applyVehicleSpecs(tokens) {
      var data = specVehicleData(tokens);
      if (!data) {
        SPEC_DIMS.forEach(function (dim) { setSpecCell(dim, ''); });
        return;
      }
      var parts = String(data.group).split('-');
      setSpecCell('width', specWidthFromCfg(data.cfg));
      setSpecCell('bolt', parts[0] || '');
      setSpecCell('offset', specOffsetFromCfg(data.cfg));
      setSpecCell('bore', parts[2] ? parts[2] + 'mm' : '');
    }
    document.addEventListener('calder:vehicle-selected', function () { applyVehicleSpecs(state.getState().tokens); });
    document.addEventListener('calder:vehicle-cleared', function () { applyVehicleSpecs(state.getState().tokens); });
    window.addEventListener('storage', function (evt) {
      if (evt.key === 'calder_selected_vehicle') { applyVehicleSpecs(state.getState().tokens); }
    });

    var UC_CENTER_CODE = { 'gloss-black': 'GB', 'black-titanium': 'BT', 'titanium-tint': 'TT' };
    var UC_LIP_CODE = { 'gloss-black': 'GBL', 'polished': 'POL' };
    var UC_BOLT_CODE = { 'chrome': 'CH', 'black': 'BK' };
    /* SKU + Part Number presentation (client-approved format 2026-10-29;
       label renamed "Universal Part#" -> "Part Number" 2026-11-17):
       spec table cell:   SKU: CFG-... <br /> Part Number: CLB...
       PDP .calder-pdp__sku block:
         <span class="sku"><span>SKU:</span> CFG-...</span><br />
         <span class="universal-part"><span>Part Number:</span> CLB...</span>
       Values are registry tokens (alnum/dash); sanitizeSpecValue keeps the
       innerHTML write safe. Both targets update on EVERY calder-uc selection
       (the CTA broadcasts calder:universal-resolved with the resolved record). */
    function sanitizeSpecValue(value) {
      return String(value == null ? '' : value).replace(/[^A-Za-z0-9#-]/g, '');
    }

    /* ── Size-dependent price (P6, 2026-11-15) ──
       The resolver returns Shopify's authoritative price for the resolved
       SKU (Storefront API priceCents; registry msrp fallback) on every
       resolve()-backed outcome. The PDP price display updates to it on
       calder:universal-resolved. Formatting mirrors the original Liquid
       rendering captured at init (currency prefix + separator style) so
       "$1,000" becomes "$1,200" — never a differently formatted string.
       Outcomes without a price (vehicle-required, invalid) leave the
       last known price untouched. Cart lines already price by the
       resolved variantId — the checkout price is the variant's own
       Shopify price; no parallel pricing system exists. */
    var priceTextNode = (function () {
      var box = document.querySelector('.calder-pdp__price .prd-price-regular');
      if (box && box.firstChild && box.firstChild.nodeType === 3) { return box.firstChild; }
      return null;
    })();
    var pricePattern = null;
    if (priceTextNode) {
      var pm = /^\s*([^\d]*)(\d[\d.,]*)([\s\S]*)$/.exec(priceTextNode.data);
      if (pm && /^\d[\d.,]*$/.test(pm[2])) {
        pricePattern = { prefix: pm[1], thousands: pm[2].indexOf(',') !== -1, suffix: pm[3] };
      }
    }
    function updatePriceDisplay(out) {
      if (!pricePattern || !priceTextNode || !out || typeof out.price !== 'number') { return; }
      var amount = Number(out.price);
      var text = pricePattern.thousands
        ? amount.toLocaleString('en-US', { maximumFractionDigits: 2 })
        : String(amount);
      priceTextNode.data = pricePattern.prefix + text + pricePattern.suffix;
    }

    document.addEventListener('calder:universal-resolved', function (e) {
      var out = e && e.detail;
      updatePriceDisplay(out);
      var t = state.getState().tokens;
      var cfgSku = resolver && resolver.design && resolver.design.designCode && t.diameter
        ? 'CFG-' + resolver.design.designCode + '-' + t.diameter + '-' + (UC_CENTER_CODE[t.center] || '') + '-' + (UC_LIP_CODE[t.barrel] || '') + '-' + (UC_BOLT_CODE[t.hardware] || '')
        : '';
      var pn = out && out.partNumber ? out.partNumber : null;
      var cell = document.querySelector('[data-calder-spec="sku"]');
      if (cell) {
        if (cfgSku && pn) {
          cell.innerHTML = 'SKU: ' + sanitizeSpecValue(cfgSku) + '<br />Part Number: ' + sanitizeSpecValue(pn);
        } else if (pn) {
          cell.innerHTML = 'Part Number: ' + sanitizeSpecValue(pn);
        } else {
          cell.innerHTML = cfgSku ? 'SKU: ' + sanitizeSpecValue(cfgSku) : '—';
        }
      }
      var block = document.querySelector('.calder-pdp__sku');
      if (block) {
        block.innerHTML =
          '<span class="sku"><span>SKU:</span> ' + (cfgSku ? sanitizeSpecValue(cfgSku) : '—') + '</span>' +
          '<br />' +
          '<span class="universal-part"><span>Part Number:</span> ' + (pn ? sanitizeSpecValue(pn) : '—') + '</span>';
      }
    });

    function syncFromState(snap) {
      syncSelection(snap.tokens);
      if (snap.complete) { syncPreview(snap.tokens); }
      else { showFallback(); }
      updateSpecCells(snap.tokens);
      root.setAttribute('data-calder-uc-complete', snap.complete ? 'true' : 'false');
      root.setAttribute('data-calder-uc-source', snap.source);
    }

    /* Gallery reset hook — assigned by the self-contained gallery controller
       below. Any option click snaps the gallery back to the configurator
       preview slide (the slide paired with the .calder-uc__thumb-stack
       thumbnail — normally the first slide). */
    var galGoToSlide = null;
    var galPreviewSlideIndex = 0;

    root.addEventListener('click', function (evt) {
      var btn = evt.target.closest ? evt.target.closest('[data-calder-uc-option]') : null;
      if (!btn || !root.contains(btn)) { return; }
      evt.preventDefault();
      if (galGoToSlide) { galGoToSlide(galPreviewSlideIndex); }
      var dim = btn.getAttribute('data-dim');
      var token = btn.getAttribute('data-token');
      if (state.getState().tokens[dim] === token) { return; }
      state.setOption(dim, token, { source: 'user' });
    });

    root.addEventListener('keydown', function (evt) {
      var btn = evt.target.closest ? evt.target.closest('[data-calder-uc-option]') : null;
      if (!btn) { return; }
      if (evt.key !== 'ArrowRight' && evt.key !== 'ArrowLeft' && evt.key !== 'ArrowUp' && evt.key !== 'ArrowDown') { return; }
      var dim = btn.getAttribute('data-dim');
      var groupButtons = Array.prototype.slice.call(root.querySelectorAll('[data-calder-uc-option][data-dim="' + dim + '"]'));
      var idx = groupButtons.indexOf(btn);
      var dir = (evt.key === 'ArrowRight' || evt.key === 'ArrowDown') ? 1 : -1;
      var next = groupButtons[(idx + dir + groupButtons.length) % groupButtons.length];
      if (next) {
        evt.preventDefault();
        next.focus();
        next.click();
      }
    });

    syncFromState(state.getState());
    state.subscribe(syncFromState);

    /* ── Explore Other Designs (2026-11-02 A) ──
       The design nav (snippets/calder-design-nav.liquid) links to the other
       universal PDPs. At click time the CURRENT builder configuration rides
       along as query params (same namespaced contract as card deep links).
       The destination PDP validates every param against its own options
       (calder-pdp-state.js parseUrl) and resets invalid values gracefully,
       so incompatible options/bolts are never transferred — invalid cells
       show the pending "Select an option" state instead. The pcd param
       (bolt pattern carried from listings) passes through unchanged when
       present; calder-universal-cta.js validates it on the destination. */
    var designNav = document.querySelector('[data-calder-design-nav]');
    /* Shared saved-vehicle reader (P1 + P4 CHANGES 2026-11-15). */
    function readSavedVehicle() {
      try {
        var raw = localStorage.getItem('calder_selected_vehicle');
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    }
    if (designNav) {
      designNav.addEventListener('click', function (evt) {
        var link = evt.target.closest ? evt.target.closest('[data-calder-design-nav-link]') : null;
        if (!link || !designNav.contains(link)) { return; }
        var snap = state.getState();
        var parts = [];
        DIMS.forEach(function (dim) {
          if (snap.tokens[dim]) { parts.push(dim + '=' + encodeURIComponent(snap.tokens[dim])); }
        });
        var pcd = new URLSearchParams(window.location.search).get('pcd');
        if (pcd) { parts.push('pcd=' + encodeURIComponent(pcd)); }
        var qs = parts.join('&');
        if (qs) { link.setAttribute('href', (link.getAttribute('href') || '').split('?')[0] + '?' + qs); }
      });

      /* ── Design-nav vehicle filtering (P1, 2026-11-15) ──
         While a vehicle is selected, only the designs whose bolt_pattern
         metafield (stamped server-side as data-pcds by
         snippets/calder-design-nav.liquid) includes the vehicle's pattern
         stay visible; every design returns on calder:vehicle-cleared (the
         fitment panel Reset). The current design is excluded from the nav
         and its own compatibility is enforced separately by the CTA
         (VEHICLE_INCOMPATIBLE fail-closes the purchase) — a nav pattern
         match alone never guarantees fitment. Pattern normalization mirrors
         calder-universal-cta.js vehiclePatterns (lowercase, whitespace
         stripped, trailing decimals removed — "6X139.7" == "6x139"), and
         supports both saved-vehicle shapes (compact b / finder
         bolt_pattern). Links without data-pcds stay visible: missing data
         must not drop possibly-compatible designs. */
      var dnLinks = Array.prototype.slice.call(designNav.querySelectorAll('[data-calder-design-nav-link]'));
      var dnEmpty = designNav.querySelector('[data-design-nav-empty]');

      function dnNormalizePattern(raw) {
        return String(raw || '').trim().toLowerCase().replace(/\s+/g, '').replace(/\.\d+$/, '');
      }
      function dnNormalizeList(raw) {
        var out = [];
        String(raw || '').split(',').forEach(function (item) {
          var v = dnNormalizePattern(item);
          if (v && out.indexOf(v) === -1) { out.push(v); }
        });
        return out;
      }
      function dnVehiclePatterns(vehicle) {
        var out = [];
        if (!vehicle) { return out; }
        [vehicle.b, vehicle.bolt_pattern].forEach(function (raw) {
          var v = dnNormalizePattern(raw);
          if (v && out.indexOf(v) === -1) { out.push(v); }
        });
        return out;
      }
      function dnReadVehicle() {
        return readSavedVehicle();
      }
      function dnApplyFilter(vehicle) {
        var patterns = dnVehiclePatterns(vehicle);
        var visible = 0;
        dnLinks.forEach(function (link) {
          var li = link.closest('.calder-design-nav__item') || link;
          var show = true;
          if (patterns.length) {
            var pcds = link.getAttribute('data-pcds');
            if (pcds) {
              var list = dnNormalizeList(pcds);
              show = list.some(function (p) { return patterns.indexOf(p) !== -1; });
            }
          }
          li.hidden = !show;
          if (show) { visible++; }
        });
        if (dnEmpty) { dnEmpty.hidden = visible !== 0; }
      }

      document.addEventListener('calder:vehicle-selected', function (evt) {
        dnApplyFilter((evt && evt.detail) || dnReadVehicle());
      });
      document.addEventListener('calder:vehicle-cleared', function () { dnApplyFilter(null); });
      window.addEventListener('storage', function (evt) {
        if (evt.key === 'calder_selected_vehicle') { dnApplyFilter(dnReadVehicle()); }
      });
      dnApplyFilter(dnReadVehicle());
    }

    /* ── Vehicle-gated Diameter group (P4, 2026-11-15) ──
       The Diameter control only matters once a vehicle is selected — a
       shopper exploring finishes without buying intent never needs it.
       Hidden on initial load when no vehicle is saved; revealed on
       calder:vehicle-selected; hidden again on reset
       (calder:vehicle-cleared, e.g. .calder-pdp__fitment-reset). The
       diameter selection state itself is untouched (URL params, history
       and the resolver default keep working); only the control's
       visibility is gated. Accessible hiding: the hidden attribute +
       the explicit .calder-uc__group[hidden] CSS guard.

       With a vehicle selected (P4): option buttons present the combined
       Size label ("22 × 10") from the vehicle's own fitment records
       (cf.z / fz / rz widths) — display labels ONLY; data-token and the
       underlying diameter/width identifiers never change. A diameter
       whose cf entry carries differing front/rear widths (staggered
       fitment) keeps its plain label rather than showing one half of
       the pair. Diameters the vehicle's fitment data does not offer are
       disabled (unsupported size combinations are prevented at the
       control level; calder-universal-cta.js fail-closes the purchase
       as a backstop). No vehicle -> plain labels, everything enabled. */
    var diaGroup = root.querySelector('[data-calder-uc-group="diameter"]');
    if (diaGroup) {
      var diaButtons = Array.prototype.slice.call(
        diaGroup.querySelectorAll('[data-calder-uc-option][data-dim="diameter"]')
      );
      diaButtons.forEach(function (btn) {
        var nameEl = btn.querySelector('.calder-uc__option-name');
        if (nameEl && !btn.getAttribute('data-calder-dia-plain')) {
          btn.setAttribute('data-calder-dia-plain', nameEl.textContent);
        }
      });
      function diaVehicleInfo(vehicle) {
        var out = { valid: false, supported: {}, labels: {} };
        if (!vehicle || !(vehicle.b || vehicle.bolt_pattern)) { return out; }
        out.valid = true;
        (vehicle.cf || []).forEach(function (cfg) {
          var m = /^(\d{2})\s*[x×]/i.exec(String((cfg && cfg.z) || ''));
          if (!m) { return; }
          var dia = m[1];
          out.supported[dia] = true;
          var front = diaWidthFrom(cfg.z || cfg.fz);
          var rear = diaWidthFrom(cfg.rz || cfg.z);
          if (front && front === rear) {
            out.labels[dia] = dia + ' × ' + front;
          }
        });
        return out;
      }
      var diaApply = function (vehicle) {
        var info = diaVehicleInfo(vehicle);
        diaGroup.hidden = !info.valid;
        diaButtons.forEach(function (btn) {
          var nameEl = btn.querySelector('.calder-uc__option-name');
          var token = btn.getAttribute('data-token');
          var plain = btn.getAttribute('data-calder-dia-plain') || (nameEl ? nameEl.textContent : token + '"');
          var unsupported = info.valid && vehicle && vehicle.cf && vehicle.cf.length && !info.supported[token];
          btn.disabled = !!unsupported;
          btn.setAttribute('aria-disabled', unsupported ? 'true' : 'false');
          if (nameEl) {
            nameEl.textContent = (info.valid && info.labels[token]) ? info.labels[token] : plain;
          }
        });
      };
      document.addEventListener('calder:vehicle-selected', function (evt) {
        diaApply((evt && evt.detail) || readSavedVehicle());
      });
      document.addEventListener('calder:vehicle-cleared', function () { diaApply(null); });
      window.addEventListener('storage', function (evt) {
        if (evt.key === 'calder_selected_vehicle') { diaApply(readSavedVehicle()); }
      });
      diaApply(readSavedVehicle());
    }

    /* ── Self-contained gallery slider ──
       The universal gallery does not use Swiper or Lumia's ProductGallery
       (the approved thumbs strip lives outside <product-gallery>, which Lumia
       cannot manage). The controller owns: fade slides, arrows, thumbs,
       active-state sync. Product media slides participate automatically. */
    var galRoot = document.querySelector('[data-calder-uc-gallery]');
    if (galRoot) {
      var galSlides = Array.prototype.slice.call(galRoot.querySelectorAll('.calder-uc-gal__slides > .calder-uc__gallery-slide'));
      var galActive = 0;

      function galSetThumbActive() {
        var strip = galRoot.querySelector('.calder-pdp__thumbs-wrap');
        if (!strip) { return; }
        var thumbs = strip.querySelectorAll('[data-media-id]');
        var activeId = galSlides[galActive] ? galSlides[galActive].getAttribute('data-media-id') : null;
        Array.prototype.forEach.call(thumbs, function (t) {
          t.classList.toggle('calder-uc-gal__thumb--active', t.getAttribute('data-media-id') === activeId);
        });
      }

      /* ── Zoom — native Lumia parity (added 2026-10-29) ──
         Ports app.js ProductGallery zoom into this self-contained controller:
         - addZoom(): ezPlus INNER hover zoom on the ACTIVE product-media
           slide's img[data-zoom-image], disabled ≤1024px (native respond
           range), skipped when the source is not meaningfully larger than
           the frame (native zoomReserve 1.1). The layered preview slide has
           no single full-size source, so hover zoom applies to real media
           slides only. One-time per slide ('zoom-init' guard, like native).
         - zoomLinkEvent(): the .js-prd-zoom-link icon opens
           jq_lumia.fancybox with every media slide's full-size source —
           same options as native (zoom animation, thumbs strip, light skin).
         Fails silently (icon hidden) when jq_lumia/ezPlus/fancybox or media
         images are absent — slides/arrows/thumbs behavior is untouched. */
      /* app.js declares `const jq_lumia = $.noConflict()` at top level — a
         const binding is NOT a window property, so window.jq_lumia stays
         undefined even though native zoom works inside app.js's own scope.
         Resolve the library through BOTH paths: the window property first,
         then the global lexical binding that classic scripts can see. */
      function zoomLib() {
        if (typeof window.jq_lumia === 'function' && window.jq_lumia.fn) { return window.jq_lumia; }
        try { if (typeof jq_lumia === 'function' && jq_lumia.fn && jq_lumia.fn.ezPlus) { return jq_lumia; } } catch (e) {}
        return null;
      }
      function galEzPlusAvailable() {
        var lib = zoomLib();
        return !!(lib && typeof lib.fn.ezPlus === 'function');
      }
      function activateSlideZoom(idx) {
        var lib = zoomLib();
        if (!lib || !galEzPlusAvailable()) { return; }
        var slide = galSlides[idx];
        if (!slide || slide.classList.contains('zoom-init')) { return; }
        var img = slide.querySelector('img[data-zoom-image]');
        if (!img) { return; }
        var srcW = parseInt(img.getAttribute('data-image-width'), 10) || 0;
        var frameW = slide.clientWidth || img.clientWidth || 0;
        if (srcW && frameW && srcW <= frameW * 1.1) { slide.classList.add('zoom-init'); return; }
        lib(img).ezPlus({
          zoomType: 'inner',
          zoomWindowFadeIn: 500,
          zoomWindowFadeOut: 500,
          lensFadeIn: 500,
          lensFadeOut: 500,
          imageCrossfade: true,
          responsive: true,
          cursor: 'crosshair',
          respond: [{ range: '100-1024', enabled: false, showLens: false }],
          onZoomedImageLoaded: function () { slide.classList.add('zoom-init'); }
        });
        slide.classList.add('zoom-init');
      }
      function galZoomObjects() {
        var objs = [];
        galSlides.forEach(function (slide, i) {
          if (i === 0) { return; }
          var img = slide.querySelector('img[data-zoom-image]');
          if (img && img.getAttribute('data-zoom-image')) {
            objs.push({ src: img.getAttribute('data-zoom-image'), opts: { thumb: img.getAttribute('data-zoom-image'), caption: img.alt || '' } });
          }
        });
        return objs;
      }
      var galZoomBtn = galRoot.querySelector('[data-calder-uc-gal-zoom]');
      var jq_lumia = zoomLib();
      var galZoomObjs = (jq_lumia && jq_lumia.fancybox) ? galZoomObjects() : [];
      if (galZoomBtn && !galZoomObjs.length) {
        galZoomBtn.hidden = true;
        galZoomBtn.classList.add('hidden');
      }
      if (galZoomBtn && galZoomObjs.length) {
        galZoomBtn.addEventListener('click', function (evt) {
          evt.preventDefault();
          var jq_lumia = zoomLib();
          if (!jq_lumia || !jq_lumia.fancybox) { return; }
          jq_lumia.fancybox.open(galZoomObjs, {
            loop: false,
            animationEffect: 'zoom',
            touch: true,
            buttons: ['close'],
            clickSlide: 'close',
            clickOutside: 'close',
            mobile: { clickSlide: 'close', clickOutside: 'close' },
            thumbs: { autoStart: true, axis: 'x' },
            arrows: true,
            beforeShow: function () {
              var containers = document.querySelectorAll('.fancybox-container');
              if (containers.length) { containers[containers.length - 1].classList.add('fancybox--light', 'fancybox-gallery'); }
            }
          }, Math.max(0, galActive - 1));
        });
      }

      function goTo(i) {
        if (!galSlides.length) { return; }
        galActive = Math.max(0, Math.min(galSlides.length - 1, i));
        galSlides.forEach(function (sl, idx) {
          sl.classList.toggle('calder-uc-gal__slide--active', idx === galActive);
        });
        var nextBtn = galRoot.querySelector('[data-calder-uc-gal-next]');
        var prevBtn = galRoot.querySelector('[data-calder-uc-gal-prev]');
        if (nextBtn) { nextBtn.classList.toggle('calder-uc-gal__arrow--disabled', galActive === galSlides.length - 1); }
        if (prevBtn) { prevBtn.classList.toggle('calder-uc-gal__arrow--disabled', galActive === 0); }
        galSetThumbActive();
        activateSlideZoom(galActive);
      }
      var nextBtn = galRoot.querySelector('[data-calder-uc-gal-next]');
      var prevBtn = galRoot.querySelector('[data-calder-uc-gal-prev]');
      if (nextBtn) {
        nextBtn.addEventListener('click', function () { goTo(galActive + 1); });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', function () { goTo(galActive - 1); });
      }
      galRoot.setAttribute('data-calder-uc-gal-count', String(galSlides.length));
      var strip = galRoot.querySelector('.calder-pdp__thumbs-wrap');
      if (strip) {
        /* Thumbs are divs — make them keyboard-operable (2026-11-02 E):
           role=button + tabindex set here so the markup contract stays
           unchanged; Enter/Space trigger the same slide switch as click. */
        var thumbNodes = strip.querySelectorAll('[data-media-id]');
        Array.prototype.forEach.call(thumbNodes, function (thumb) {
          if (thumb.tagName === 'BUTTON' || thumb.tagName === 'A') { return; }
          thumb.setAttribute('role', 'button');
          thumb.setAttribute('tabindex', '0');
        });
        var selectThumb = function (id) {
          for (var i = 0; i < galSlides.length; i++) {
            if (galSlides[i].getAttribute('data-media-id') === id) { goTo(i); return true; }
          }
          return false;
        };
        strip.addEventListener('click', function (evt) {
          var thumb = evt.target.closest ? evt.target.closest('[data-media-id]') : null;
          if (!thumb || !strip.contains(thumb)) { return; }
          selectThumb(thumb.getAttribute('data-media-id'));
        });
        strip.addEventListener('keydown', function (evt) {
          if (evt.key !== 'Enter' && evt.key !== ' ') { return; }
          var thumb = evt.target.closest ? evt.target.closest('[data-media-id]') : null;
          if (!thumb || !strip.contains(thumb)) { return; }
          evt.preventDefault();
          selectThumb(thumb.getAttribute('data-media-id'));
        });
      }
      /* Expose goTo to the option-click handler: locate the preview slide
         (the one holding the [data-calder-uc-stack] layer stack) so option
         clicks always return the gallery to it. Defaults to the first
         slide when no stack is found. */
      var previewSlideIdx = 0;
      for (var psi = 0; psi < galSlides.length; psi++) {
        if (galSlides[psi].querySelector('[data-calder-uc-stack]')) { previewSlideIdx = psi; break; }
      }
      galPreviewSlideIndex = previewSlideIdx;
      galGoToSlide = goTo;
      goTo(0);
    }

    window.CALDER_UNIVERSAL_PDP = Object.freeze({ state: state, resolver: resolver, root: root });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

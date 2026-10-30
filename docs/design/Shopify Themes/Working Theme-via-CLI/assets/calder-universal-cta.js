/*!
 * Calder universal PDP CTA controller (Prompt 06 + client update, amendment 2026-10-28)
 * The buy area shows ONLY "Add to Cart" (enabled on exact in-stock match) or
 * "Add to Cart" disabled with an explanatory notice in .calder-upc__message —
 * never a separate CTA button. Vehicle context is read from the fitment finder's
 * localStorage key (read-only). The resolved LEGACY variant is submitted via
 * /cart/add.js (theme convention with Lumia sections refresh); server-side
 * Shopify inventory remains authoritative. Duplicate submissions are guarded.
 * Broadcasts 'calder:universal-resolved' with the resolved record for specs/SKU.
 */
(function () {
  'use strict';
  var VEHICLE_STORAGE_KEY = 'calder_selected_vehicle';
  var CART_SECTIONS = ['header-cart', 'cart-icon-bubble', 'header-minicart-sticky', 'cart-live-region-text'];

  function boot() {
    var upc = window.CALDER_UNIVERSAL_PDP;
    var root = document.querySelector('[data-calder-universal-purchase]');
    if (!upc || !upc.state || !upc.resolver || !root) { return; }
    if (root.dataset.calderUpcBooted) { return; }
    root.dataset.calderUpcBooted = '1';
    var state = upc.state;
    var resolver = upc.resolver;
    var cta = root.querySelector('[data-calder-uc-cta]');
    var ctaLabel = root.querySelector('[data-calder-uc-cta-label]');
    var message = root.querySelector('[data-calder-uc-message]');
    var minQty = parseInt(root.getAttribute('data-calder-min-qty'), 10);
    if (isNaN(minQty) || minQty < 0) { minQty = 0; }
    var submitting = false;
    var lastOutcome = null;

    function readVehicle() {
      try {
        var raw = window.localStorage.getItem(VEHICLE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    }
    /* Two saved-vehicle shapes exist in this theme:
       compact guide data {y,m,M,b,h,cf} and fitment-finder data
       {year,make,model,bolt_pattern,...}. Support both. */
    function vehiclePatterns(vehicle) {
      var out = [];
      if (!vehicle) { return out; }
      [vehicle.b, vehicle.bolt_pattern].forEach(function (raw) {
        if (!raw) { return; }
        var v = String(raw).trim().toLowerCase().replace(/\s+/g, '').replace(/\.\d+$/, '');
        if (v && out.indexOf(v) === -1) { out.push(v); }
      });
      return out;
    }
    function defaultGroupId() {
      var groups = resolver.design.fitmentGroups || [];
      return groups.length ? groups[0].id : null;
    }
    /* QuickBooks component availability (calder-demo-inventory.js publishes
       window.CALDER_QUICKBOOKS_INVENTORY.parts; n8n cron refreshes it).
       Finished wheel = diameter blank x1 + center x1 + barrel/lip x1 + hardware x20. */
    var QB_CENTER_CODE = { 'gloss-black': 'BKUTI', 'black-titanium': 'BK', 'titanium-tint': 'SU' };
    var QB_BARREL_CODE = { 'gloss-black': 'BK', 'polished': 'POLISH' };
    var QB_BOLT_CODE = { 'chrome': 'CHROME', 'black': 'BK' };
    var BOLTS_PER_WHEEL = 20;
    function qbAvailability(tokens, qty) {
      var payload = (typeof window !== 'undefined' && window.CALDER_QUICKBOOKS_INVENTORY) || null;
      var parts = payload && payload.parts ? payload.parts : null;
      var designNumber = resolver.design.designNumber;
      if (!parts || !designNumber) { return { known: false, available_to_build: 0, components: null, source: 'missing' }; }
      var need = Math.max(1, qty);
      var list = [
        { type: 'diameter', part_number: 'CAL-' + designNumber + '-D-' + tokens.diameter, on_hand_key: 'CAL-' + designNumber + '-D-' + tokens.diameter, needed: need },
        { type: 'center', part_number: 'CAL-' + designNumber + '-C-' + (QB_CENTER_CODE[tokens.center] || ''), on_hand_key: null, needed: need },
        { type: 'barrel', part_number: 'CAL-' + designNumber + '-B-' + (QB_BARREL_CODE[tokens.barrel] || ''), on_hand_key: null, needed: need },
        { type: 'hardware', part_number: 'CAL-H-' + (QB_BOLT_CODE[tokens.hardware] || ''), on_hand_key: null, needed: need * BOLTS_PER_WHEEL }
      ];
      var known = true;
      var buildable = Infinity;
      list.forEach(function (c) {
        var part = parts[c.part_number];
        if (!part) { known = false; c.on_hand = null; c.ok = false; return; }
        c.on_hand = part.on_hand;
        c.ok = part.on_hand >= c.needed;
        var units = Math.floor(part.on_hand / (c.type === 'hardware' ? BOLTS_PER_WHEEL : 1));
        if (units < buildable) { buildable = units; }
      });
      return {
        known: known,
        available_to_build: (known && isFinite(buildable)) ? Math.max(0, buildable) : 0,
        components: list,
        source: payload.source || ''
      };
    }
    function readQuantity() {
      var input = document.querySelector('.calder-pdp__qty-input');
      var q = input ? parseInt(input.value, 10) : 1;
      return isNaN(q) || q < 1 ? 1 : q;
    }
    function setMessage(text) { message.textContent = text || ''; }
    function applyOutcome(out, stateSeq) {
      lastOutcome = { out: out, stateSeq: stateSeq };
      root.setAttribute('data-calder-uc-resolved', out.state);
      var buildable = out.qb ? out.qb.available_to_build : null;
      var lowStock = out.state === 'AVAILABLE' && buildable != null &&
        minQty > 0 && buildable > 0 && buildable <= minQty;
      switch (out.state) {
        case 'AVAILABLE':
          root.setAttribute('data-calder-uc-state', 'AVAILABLE');
          cta.hidden = false;
          ctaLabel.textContent = 'Add to Cart';
          cta.disabled = false;
          setMessage(lowStock ? 'Low availability for this configuration — contact us to confirm current stock.' : '');
          break;
        case 'SOLD_OUT':
          root.setAttribute('data-calder-uc-state', 'SOLD_OUT');
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage('This configuration is currently out of stock — contact a representative about availability.');
          break;
        case 'NO_STOCK':
          root.setAttribute('data-calder-uc-state', 'NO_STOCK');
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage('This exact combination isn\u2019t in stock \u2014 please speak with a support representative to confirm availability.');
          break;
        case 'NO_CATALOG_PART':
        case 'NO_SELLABLE_RECORD':
          root.setAttribute('data-calder-uc-state', out.state);
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage('This combination is not currently listed \u2014 request a custom configuration and our team will build it.');
          break;
        case 'VEHICLE_REQUIRED':
          root.setAttribute('data-calder-uc-state', 'VEHICLE_REQUIRED');
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage('Select your vehicle to confirm fitment and availability for the exact wheel.');
          break;
        case 'INVALID':
          root.setAttribute('data-calder-uc-state', 'INVALID');
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage(out.message || 'Complete your selection to check availability.');
          break;
        case 'AMBIGUOUS':
        case 'LEGACY_UNVERIFIED':
          root.setAttribute('data-calder-uc-state', out.state);
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage('This configuration cannot be purchased online right now. Contact a representative for assistance.');
          break;
        case 'ERROR':
          root.setAttribute('data-calder-uc-state', 'ERROR');
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage(out.message || 'Availability could not be verified — please try again.');
          break;
        case 'VEHICLE_INCOMPATIBLE':
          root.setAttribute('data-calder-uc-state', 'VEHICLE_INCOMPATIBLE');
          cta.disabled = true;
          ctaLabel.textContent = 'Add to Cart';
          setMessage('Your selected vehicle\u2019s bolt pattern isn\u2019t offered on this wheel. Reset your vehicle above or contact us for assistance.');
          break;
        default:
          /* pending/unknown resolution: enabled by default, no loading flash */
          root.setAttribute('data-calder-uc-state', 'AVAILABLE');
          cta.disabled = false;
          ctaLabel.textContent = 'Add to Cart';
          setMessage('');
      }
      try {
        document.dispatchEvent(new CustomEvent('calder:universal-resolved', { detail: out }));
      } catch (e) {}
      renderDevPanel(out);
    }
    /* ── Calder Developer Output panel ── */
    function renderDevPanel(out) {
      var dev = document.querySelector('[data-calder-dev]');
      if (!dev) { return; }
      var snap = state.getState();
      var vehicle = readVehicle();
      var set = function (key, val) {
        var el = dev.querySelector('[data-calder-dev="' + key + '"]');
        if (el) { el.textContent = val == null ? '—' : String(val); }
      };
      set('designCode', resolver.design.designCode);
      set('designNumber', resolver.design.designNumber);
      set('handle', resolver.design.handle);
      set('tokens', JSON.stringify(snap.tokens));
      set('seq', snap.seq + ' / ' + snap.source);
      set('designPatterns', (resolver.design.fitmentGroups || []).map(function (g) { return g.id; }).join(', '));
      set('defaultGroup', defaultGroupId());
      set('group', out && out.group ? out.group : (currentGroup() || '—'));
      set('vehicleRaw', vehicle ? JSON.stringify(vehicle) : 'null');
      set('vehiclePatterns', vehiclePatterns(vehicle).join(', ') || 'none');
      set('match', vehicle ? String(vehicleMatchesDesign(vehicle)) : 'no vehicle');
      var yf = document.querySelector('[data-calder-ffv-year]');
      set('ffvYear', yf && yf.value ? yf.value : '—');
      set('ctaState', out ? out.state : '—');
      set('partNumber', out && out.partNumber ? out.partNumber : peekedPartNumber());
      var legacy = out && out.legacy ? out.legacy : null;
      set('legacyHandle', legacy ? legacy.handle : '—');
      set('legacySku', legacy ? legacy.sku : '—');
      set('variantId', legacy ? legacy.variantId : '—');
      set('qty', readQuantity() + ' / ' + minQty);
      var badge = dev.querySelector('[data-calder-dev-state-badge]');
      if (badge) { badge.textContent = out ? out.state : '—'; }
      var qb = out && out.qb ? out.qb : qbAvailability(snap.tokens, readQuantity());
      var qbBody = dev.querySelector('[data-calder-dev="qb"]');
      if (qbBody) {
        qbBody.innerHTML = '';
        (qb.components || []).forEach(function (c) {
          var tr = document.createElement('tr');
          [c.type, c.part_number, c.on_hand, c.needed, c.ok].forEach(function (v) {
            var td = document.createElement('td');
            td.textContent = v == null ? '—' : String(v);
            tr.appendChild(td);
          });
          qbBody.appendChild(tr);
        });
        if (!qb.known) {
          var tr = document.createElement('tr');
          var td = document.createElement('td');
          td.colSpan = 5;
          td.textContent = 'components unknown (source: ' + (qb.source || 'missing') + ')';
          tr.appendChild(td);
          qbBody.appendChild(tr);
        }
      }
      var payloadEl = dev.querySelector('[data-calder-dev="cartPayload"]');
      if (payloadEl) {
        if (legacy && legacy.variantId) {
          payloadEl.textContent = JSON.stringify({ items: [{ id: legacy.variantId, quantity: readQuantity() }], sections: CART_SECTIONS, sections_url: window.location.pathname });
        } else {
          payloadEl.textContent = 'not resolvable yet — legacy variant missing';
        }
      }
      dev.setAttribute('data-calder-dev-last', out ? out.state : '—');
    }
    function peekedPartNumber() {
      try {
        var peeked = resolver.peek(state.getState().tokens, currentGroup());
        return peeked && peeked.cell ? peeked.cell.part_number : null;
      } catch (e) { return null; }
    }
    var devPanel = document.querySelector('[data-calder-dev]');
    if (devPanel) {
      var devBtn = devPanel.querySelector('[data-calder-dev-refresh]');
      if (devBtn) { devBtn.addEventListener('click', function () { lastOutcome = null; recheck(); }); }
    }

    function currentGroup() {
      var snap = state.getState();
      if (!snap.complete) { return null; }
      var vehicle = readVehicle();
      var exact = vehicle ? resolver.groupFromVehicle(vehicle, snap.tokens.diameter) : null;
      return exact || defaultGroupId();
    }

    function designPatterns() {
      return (resolver.design.fitmentGroups || []).map(function (g) {
        return g.id.split('-')[0];
      });
    }
    function vehicleMatchesDesign(vehicle) {
      var vPats = vehiclePatterns(vehicle);
      if (!vPats.length) { return true; }
      var dPats = designPatterns();
      return dPats.some(function (p) { return vPats.indexOf(p) !== -1; });
    }
    function recheck() {
      var snap = state.getState();
      if (!snap.complete) {
        applyOutcome({ state: 'INVALID', message: 'Complete your selection to check availability.' }, snap.seq);
        return;
      }
      var vehicle = readVehicle();
      var qty = readQuantity();
      var qb = qbAvailability(snap.tokens, qty);
      var buildOutcome = function (resolved) {
        var out = resolved || { state: 'AVAILABLE' };
        out.qb = qb;
        out.requestedQuantity = qty;
        out.vehiclePatterns = vehiclePatterns(vehicle);
        out.designPatterns = designPatterns();
        /* part_number for the CURRENT selection + (exact || default) group,
           attached in every state so the SKU cell is always live */
        var peeked = resolver.peek(snap.tokens, currentGroup());
        if (peeked && peeked.cell && peeked.cell.part_number) {
          out.partNumber = peeked.cell.part_number;
        }
        if (out.state === 'AVAILABLE' && qb.known && qb.available_to_build < qty) {
          out.state = 'NO_STOCK';
        } else if (out.state === 'AVAILABLE' && !qb.known) {
          out.state = 'ERROR';
          out.message = 'Component availability could not be verified — please try again or contact us.';
        }
        applyOutcome(out, snap.seq);
      };
      /* CTA status changes ONLY on vehicle selection + bolt-pattern match.
         No vehicle -> default group, enabled immediately (no loading flash). */
      if (!vehicleMatchesDesign(vehicle)) {
        var incompatOut = {
          state: 'VEHICLE_INCOMPATIBLE',
          vehiclePatterns: vehiclePatterns(vehicle),
          designPatterns: designPatterns(),
          qb: qb,
          requestedQuantity: qty
        };
        var incompatPeek = resolver.peek(snap.tokens, currentGroup());
        if (incompatPeek && incompatPeek.cell && incompatPeek.cell.part_number) {
          incompatOut.partNumber = incompatPeek.cell.part_number;
        }
        applyOutcome(incompatOut, snap.seq);
        return;
      }
      buildOutcome(null);
      var group = currentGroup();
      if (!group) { return; }
      resolver.resolve({
        diameter: snap.tokens.diameter,
        center: snap.tokens.center,
        barrel: snap.tokens.barrel,
        hardware: snap.tokens.hardware,
        group: group
      }).then(function (out) {
        if (resolver.isStale(out)) { return; }
        buildOutcome(out);
      }).catch(function () {
        /* keep the synchronous enabled state; surface nothing flash-y */
      });
    }

    /* ── Cart refresh ──────────────────────────────────────────────────
       The universal CTA performs its own /cart/add.js, so it must refresh
       the minicart EXACTLY like the theme does for normal products:
       cart-items.renderContents() applies each section response with
       Lumia's own per-selector extraction (.js-contents-cart-items etc.).
       NEVER dump a whole section response into an element — the Section
       Rendering response is a full #shopify-section-... wrapper; injecting
       it raw duplicates the cart icon, the popup and every section ID
       inside #header-cart and breaks the minicart (fixed 2026-10-29). */
    function renderCartLikeTheme(cartItemsEl, json) {
      if (!cartItemsEl || typeof cartItemsEl.renderContents !== 'function') { return false; }
      cartItemsEl.renderContents(json);
      if (typeof cartItemsEl.toggleEmptyClass === 'function') { try { cartItemsEl.toggleEmptyClass(json); } catch (e) {} }
      if (typeof cartItemsEl.setParsedState === 'function') { try { cartItemsEl.setParsedState(json); } catch (e) {} }
      if (typeof cartItemsEl.setCartJs === 'function') { try { cartItemsEl.setCartJs(); } catch (e) {} }
      var shippingCalculator = document.querySelector('shipping-calculator') || document.querySelector('shipping-calculator-cart');
      if (shippingCalculator && typeof shippingCalculator.setUpdateStatus === 'function') {
        try { shippingCalculator.setUpdateStatus('true'); } catch (e) {}
      }
      return true;
    }
    /* Fallback for pages without the cart-items element (e.g. stripped-down
       templates). Section responses are ONE wrapper element
       (<div id="shopify-section-{key}">…</div>) — swap the page's existing
       wrapper's innerHTML with the response wrapper's innerHTML so nothing
       is nested or duplicated. */
    function extractSectionInner(html, key) {
      var marker = 'id="shopify-section-' + key + '"';
      var i = html.indexOf(marker);
      if (i === -1) { return html; }
      var openEnd = html.indexOf('>', i);
      var close = html.lastIndexOf('</div>');
      if (openEnd === -1 || close === -1 || close <= openEnd) { return html; }
      return html.slice(openEnd + 1, close);
    }
    function addSectionResponses(response) {
      if (!response || !response.sections) { return; }
      Object.keys(response.sections).forEach(function (key) {
        var html = response.sections[key];
        if (typeof html !== 'string') { return; }
        var inner = extractSectionInner(html, key);
        var pageWrapper = document.getElementById('shopify-section-' + key);
        if (pageWrapper) { pageWrapper.innerHTML = inner; return; }
        var root = document.getElementById(key);
        if (root) { root.innerHTML = inner; }
      });
    }
    function tryOpenMinicart() {
      var popup = document.querySelector('mini-cart-popup');
      if (popup && typeof popup.open === 'function') {
        try { popup.open(); } catch (e) {}
      }
    }

    function addToCart() {
      if (submitting) { return; }
      var snap = state.getState();
      if (!lastOutcome || lastOutcome.stateSeq !== snap.seq || lastOutcome.out.state !== 'AVAILABLE') { recheck(); return; }
      var legacy = lastOutcome.out.legacy;
      if (!legacy || !legacy.handle || !legacy.sku || !legacy.variantId) { recheck(); return; }
      submitting = true;
      root.setAttribute('data-calder-uc-submitting', 'true');
      cta.disabled = true;
      ctaLabel.textContent = 'Adding…';
      var qty = readQuantity();
      var sections = CART_SECTIONS.slice();
      var cartItems = document.querySelector('cart-items');
      if (cartItems && typeof cartItems.getSectionsToRender === 'function') {
        try {
          var cooked = Array.from(new Set(cartItems.getSectionsToRender()
            .filter(function (item) { return Boolean(document.getElementById(item.id)); })
            .map(function (s) { return s.section; })
            .filter(function (name) { return typeof name === 'string'; }))).slice(0, 5);
          if (cooked.length) { sections = cooked; }
        } catch (e) { sections = CART_SECTIONS.slice(); }
      }
      var routesRoot = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
      fetch(routesRoot + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          items: [{ id: legacy.variantId, quantity: qty }],
          sections: sections,
          sections_url: window.location.pathname || '/'
        })
      }).then(function (res) {
        return res.json().then(function (json) { return { ok: res.ok, json: json }; });
      }).then(function (r) {
        submitting = false;
        root.removeAttribute('data-calder-uc-submitting');
        if (r.ok) {
          if (!renderCartLikeTheme(cartItems, r.json)) { addSectionResponses(r.json); }
          ctaLabel.textContent = 'Added to Cart ✓';
          tryOpenMinicart();
          window.setTimeout(recheck, 1200);
        } else {
          var desc = (r.json && (r.json.description || (r.json.errors && String(r.json.errors)))) || 'Unable to add to cart.';
          if (/sold out|unavailable/i.test(String(desc))) {
            applyOutcome({ state: 'SOLD_OUT', message: desc }, snap.seq);
          } else {
            setMessage(String(desc));
            recheck();
          }
        }
      }).catch(function () {
        submitting = false;
        root.removeAttribute('data-calder-uc-submitting');
        setMessage('Network error — please try again.');
        cta.disabled = false;
        ctaLabel.textContent = 'Add to Cart';
      });
    }

    cta.addEventListener('click', function () {
      if (submitting) { return; }
      if (root.getAttribute('data-calder-uc-state') === 'AVAILABLE') { addToCart(); }
    });

    state.subscribe(recheck);
    window.addEventListener('pageshow', recheck);
    document.addEventListener('calder:vehicle-selected', function () { lastOutcome = null; recheck(); });
    document.addEventListener('calder:vehicle-cleared', function () { lastOutcome = null; recheck(); });
    window.addEventListener('storage', function (e) {
      if (e && e.key === VEHICLE_STORAGE_KEY) { recheck(); }
    });
    recheck();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

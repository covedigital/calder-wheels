/* ============================================================
   Calder Wheels — per-line specification confirmations
   (K2 2026-11-15; restructured 2026-11-16 per client feedback)
   ------------------------------------------------------------
   Every Calder cart line (added by calder-universal-cta.js with the
   _configurator marker) renders one INLINE checkbox per displayed
   configuration option/property (embedded in the .cart-table-product-option
   rows). Until every checkbox on every Calder line is checked, Proceed to
   Checkout stays unavailable on every visible route: the cart page button,
   the drawer submit, and the express/dynamic checkout wrappers.

   Additionally: when ALL of a line's checkboxes are checked, the green
   "FITMENT CONFIRMED" badge ([data-calder-line-complete]) appears at the
   end of that line's options — per-line visual confirmation.

   Design/behavior reference: prd-block-agreement + AgreementCheckbox
   (assets/app.js) — NOT replaced, still applies in parallel (AND).

   Invalidation is structural: any cart AJAX re-render (quantity change,
   line removal, new add) recreates the line markup through the Section
   Rendering API, resetting every checkbox; the MutationObservers below
   re-run the scan so the gate re-applies immediately. Lines are keyed by
   item.key — identical SKUs with different configurations confirm
   independently.

   HONEST LIMITS (K3): this is theme-side gating — a determined shopper
   can strip the classes/attributes with devtools or navigate directly
   to /checkout. Making the confirmation truly mandatory across ALL
   routes requires Shopify checkout extensibility (Checkout UI extension
   / app validation) — reported separately; not claimed as absolute
   server-side enforcement.
   ============================================================ */
(function () {
  'use strict';

  function gateTargets() {
    var seen = {};
    var out = [];
    function add(el) {
      var key = el.tagName + '|' + (el.id || '') + '|' + String(el.className).slice(0, 40);
      if (el && !seen[key]) {
        seen[key] = true;
        out.push(el);
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll('button[name="checkout"]'), add);
    Array.prototype.forEach.call(document.querySelectorAll(
      '.additional-checkout-buttons, .cart__dynamic-checkout-buttons, [data-shopify="payment-button"]'
    ), add);
    return out;
  }

  function lineContainers() {
    var els = [];
    Array.prototype.forEach.call(document.querySelectorAll('[data-calder-line-complete]'), function (badge) {
      /* 2026-11-17 Phase 3: .minicart-prd added — the drawer line root (the
         badge was dead there: .header-cart-line-item matched nothing). */
      var container = badge.closest('.cart-table-product, .minicart-prd, .header-cart-line-item, .calder-cart-item, [data-item-id]');
      if (container && els.indexOf(container) === -1) els.push(container);
    });
    return els;
  }

  function scan() {
    var boxes = document.querySelectorAll('[data-calder-line-confirm]');
    var gate = false;
    Array.prototype.forEach.call(boxes, function (box) {
      if (!box.checked) { gate = true; }
    });
    gate = boxes.length > 0 && gate;
    Array.prototype.forEach.call(gateTargets(), function (el) {
      el.classList.toggle('calder-line-confirm-gate', gate);
      if (el.tagName === 'BUTTON') { el.disabled = gate; }
    });

    /* Per-line completion: reveal the green FITMENT CONFIRMED badge when
       every checkbox on that specific line is checked. */
    Array.prototype.forEach.call(lineContainers(), function (container) {
      var lineBoxes = container.querySelectorAll('[data-calder-line-confirm]');
      var badge = container.querySelector('[data-calder-line-complete]');
      if (!badge || lineBoxes.length === 0) { return; }
      var allChecked = true;
      Array.prototype.forEach.call(lineBoxes, function (b) {
        if (!b.checked) { allChecked = false; }
      });
      badge.hidden = !allChecked;
    });
  }

  function boot() {
    if (window.__calderCartConfirmBooted) {
      scan();
      return;
    }
    window.__calderCartConfirmBooted = true;

    document.addEventListener('change', function (evt) {
      if (evt.target && evt.target.matches && evt.target.matches('[data-calder-line-confirm]')) {
        scan();
      }
    });

    var containers = document.querySelectorAll(
      '.js-contents-cart-items, .js-contents-buttons, .js-contents-subtotal, .js-contents-header-cart'
    );
    if (containers.length) {
      var observer = new MutationObserver(function () {
        window.setTimeout(scan, 30);
      });
      Array.prototype.forEach.call(containers, function (el) {
        observer.observe(el, { childList: true, subtree: true });
      });
    }
    scan();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

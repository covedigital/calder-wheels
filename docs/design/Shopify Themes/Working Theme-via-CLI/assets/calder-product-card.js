/*!
 * Calder product card — Shown Configuration sync (2026-11-02 D).
 * Small, card-scoped synchronization handler using the EXISTING variant
 * selection flow: global.js updateVariantInput() dispatches a bubbling
 * `change` on the card form's input[name="id"] after every variant
 * selection. One delegated listener maps the new variant id to the
 * configuration snapshot through the card's own per-variant JSON map
 * (emitted by snippets/calder-product-card.liquid) and updates only the
 * affected card's [data-calder-config] cells via textContent.
 *
 * Scope rules (spec D):
 *   - updates never leave the enclosing <calder-product-card> root, so the
 *     same product rendered twice stays independent;
 *   - dynamically rendered cards work through delegation (no per-card
 *     listeners, no duplicate handlers, no global DOM queries on update);
 *   - unresolvable variant fields are cleared (never stale, never invented);
 *   - variant IDs, pricing updates, media behavior, availability, quantity
 *     rules and cart submissions are untouched (this module never submits).
 */
(function () {
  'use strict';
  if (window.__calderCardSyncBooted) { return; }
  window.__calderCardSyncBooted = true;

  function mapFor(card) {
    var el = card.querySelector('script[data-calder-card-variants]');
    if (!el) { return null; }
    try {
      var parsed = JSON.parse(el.textContent);
      if (!Array.isArray(parsed)) { return null; }
      var byId = {};
      parsed.forEach(function (row) {
        if (row && row.id != null) { byId[String(row.id)] = row; }
      });
      return byId;
    } catch (e) { return null; }
  }

  function syncCard(card, variantId) {
    var byId = mapFor(card);
    var row = byId && variantId ? byId[String(variantId)] : null;
    var cells = {
      d: card.querySelector('[data-calder-config="d"]'),
      c: card.querySelector('[data-calder-config="c"]'),
      b: card.querySelector('[data-calder-config="b"]'),
      h: card.querySelector('[data-calder-config="h"]')
    };
    Object.keys(cells).forEach(function (key) {
      var cell = cells[key];
      if (!cell) { return; }
      var value = row ? (row[key] || '') : '';
      cell.textContent = value || '—';
    });
  }

  document.addEventListener('change', function (evt) {
    var input = evt.target;
    if (!input || !input.getAttribute || input.getAttribute('name') !== 'id') { return; }
    var card = input.closest ? input.closest('calder-product-card') : null;
    if (!card || !card.contains(input)) { return; }
    var variantId = input.value;
    syncCard(card, variantId);
  });

  // Invalid combinations do not reach global.js updateVariantInput().
  // Listen to the card-scoped notification without changing form values.
  document.addEventListener('calder:card-configuration-change', function (evt) {
    var target = evt.target;
    var card = target && target.closest ? target.closest('calder-product-card') : null;
    if (!card) { return; }
    syncCard(card, evt.detail ? evt.detail.variantId : null);
  });
})();

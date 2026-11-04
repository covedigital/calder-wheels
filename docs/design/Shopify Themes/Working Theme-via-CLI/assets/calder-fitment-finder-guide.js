/* ============================================================
   Calder Wheels — Fitment Finder ↔ Fitment Guide Card glue
   ------------------------------------------------------------
   In the "By Vehicle" tab the finder renders the approved PDP
   fitment guide card (.cw-fitment-guide__card). The card is fully
   driven by assets/calder-product-fitment-guide.js (its selects,
   submit, specs, status chip, configurations, wheels, details).

   This module adds ONLY the integration glue so the surrounding
   finder keeps working (assets/fitment-finder.js is unchanged):

   1. When the card renders a vehicle (submit or saved-vehicle
      auto-render), sync the finder's "YOUR VEHICLE" status panel
      with the vehicle the card just saved, and dispatch the
      established `calder:vehicle-selected` event.
   2. When the finder's Change Vehicle / Reset actions clear the
      vehicle (status panel hidden), reset the card through its own
      year-select change handler and dispatch
      `calder:vehicle-cleared`.
   3. On collection pages, when the guide produces specs results
      (.cw-fitment-guide__specs), apply the guide's fitment as URL
      filter parameters to the product grid:
        - filter.p.m.custom.bolt_pattern ← the "Bolt Pattern"
          .cw-fitment-guide__spec-value, normalized to lowercase.
        - filter.v.option.diameter ← when configuration buttons
          exist, the active (or first) .cw-fitment-guide__config-btn
          value contributes the numbers before the "x" (e.g.
          "22x10" → 22), applied in the store's diameter option
          format (22").
      Applied through the theme's native FacetFiltersForm.renderPage
      (AJAX grid + facets refresh, URL pushState, scroll-to-grid);
      falls back to a filtered navigation on /collections/ paths.
      Existing sort_by is preserved; other params (incl. page) are
      replaced so the guide's fitment defines the result set.
   4. While a vehicle is selected via the guide card, the "Bolt
      Pattern" facet block is redundant (the guide results carry a
      single bolt pattern) — the matching filter block(s)
      (.sidebar-block with a "Bolt Pattern"/"Bolt Patter"/"BOLT
      PATTERN" .sidebar-block_title_text) are set display:none and
      restored when the vehicle is cleared. Re-applied after facet
      re-renders (sidebar reload / filter popup rebuild).
   5. While a vehicle is selected, every `.category-page-title h2`
      (desktop sidebar + mobile popup) has everything before its
      "Wheels" word replaced with the guide's vehicle name
      (.cw-fitment-guide__vehicle-name), e.g. "Forged Wheels" →
      "2021 GM Escalade Wheels". Restored when the vehicle is
      cleared; re-applied after facet re-renders.
     6. When the "By Wheel Style" CTA applies its own Diameter/Bolt
        Pattern filters on a collection page (fitment-finder.js
        dispatches `calder:style-filters-applied`), the vehicle-driven
        presentation state is exited: the collection heading reverts
        to its original name, the Bolt Pattern facet block is
        restored, and the facet watcher stops re-applying the
        vehicle state.
     7. The card's RESET button (data-guide-reset) starts the shopper
        over: clears the persistent vehicle, resets the card through
        the guide's own change cascade, hides the status panel, reverts
        the vehicle presentation state, and — when URL filter params
        exist — navigates to the bare collection URL so the facet
        sidebar rebuilds fully unfiltered (a full reload is the only
        way to reset the sidebar's checkbox states cleanly; the
        theme's renderFilters does not re-render them).
     8. Vehicle lock (2026-11-02 B): while a vehicle is selected, the
        individually dismissible applied-filter chips (.filter-row-
        selected) are hidden — the vehicle's fitment constraints can
        only be removed through the dedicated Reset action, never
        chipped away one filter at a time. Restored on vehicle clear.
     9. Style-mode stale-vehicle cleanup (2026-11-02 B): switching the
        browse tabs to By Wheel Style clears the saved vehicle
        (fitment-finder.js) and hides the status panel; on collection
        pages the vehicle-driven URL filter params are then stripped
        so style browsing never inherits the vehicle's constraints.
    10. Vehicle-mode finish filters (2026-11-02 B): barrel/lip and
        bolt/hardware finish selects (real option data from
        fitment-catalog) narrow the guide's already vehicle-matched
        wheels grid client-side; the visible count updates with them.
   ============================================================ */
(function () {
  'use strict';

  var FINDER_SELECTOR = '.hf-fitment';
  var CARD_SELECTOR = '.cw-fitment-guide';
  var STORAGE_KEY = 'calder_selected_vehicle';
  var RENDERED_SELECTOR = '.cw-fitment-guide__vehicle-info';
  var SPECS_SELECTOR = '.cw-fitment-guide__specs';
  var BOLT_PARAM = 'filter.p.m.custom.bolt_pattern';
  var DIAMETER_PARAM = 'filter.v.option.diameter';

  /* ── Vehicle state ── */

  function readSavedVehicle() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* Mirrors fitment-finder.js updateStatusPanel (name + visibility). */
  function syncStatusPanel(section) {
    var panel = section.querySelector('[data-fitment-status]');
    if (!panel) return;
    var vehicle = readSavedVehicle();
    if (!vehicle) return;

    var nameEl = panel.querySelector('[data-fitment-vehicle-name]');
    if (nameEl) {
      nameEl.textContent = vehicle.display_name ||
        [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');
    }
    panel.removeAttribute('hidden');
    panel.style.display = '';
  }

  /* Clears the card through the guide's own change handler, which
     resets make/model, disables the submit button, and hides results. */
  function resetCard(section) {
    var card = section.querySelector(CARD_SELECTOR);
    if (!card) return;
    var yearSel = card.querySelector('[data-guide-year]');
    if (!yearSel) return;
    if (yearSel.value !== '') {
      yearSel.value = '';
      yearSel.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      var results = card.querySelector('[data-guide-results]');
      if (results) {
        results.innerHTML = '';
        results.style.display = 'none';
      }
    }
  }

  /* ── Collection filter from guide results ── */

  function readSpecValue(card, headingText) {
    var cols = card.querySelectorAll('.cw-fitment-guide__spec-col');
    for (var i = 0; i < cols.length; i++) {
      var heading = cols[i].querySelector('.cw-fitment-guide__spec-heading');
      var value = cols[i].querySelector('.cw-fitment-guide__spec-value');
      if (heading && value &&
          heading.textContent.trim().toLowerCase() === headingText.toLowerCase()) {
        return value.textContent.trim();
      }
    }
    return '';
  }

  /* "22x10" → 22 → the store's diameter option format (22"). */
  function readConfigDiameter(card) {
    var btn = card.querySelector('.cw-fitment-guide__config-btn.is-active') ||
              card.querySelector('.cw-fitment-guide__config-btn');
    if (!btn) return '';
    var diameter = btn.textContent.trim().split(/x/i)[0].trim();
    return /^\d+$/.test(diameter) ? diameter + '"' : '';
  }

  function buildFilterSearchParams(card) {
    // Normalized to lowercase to match the store's bolt_pattern
    // metafield format (6x139, 5x112 — industry PCD notation).
    var bolt = readSpecValue(card, 'Bolt Pattern').toLowerCase();
    if (!bolt) return '';

    var params = new URLSearchParams();
    params.set(BOLT_PARAM, bolt);

    var diameter = readConfigDiameter(card);
    if (diameter) params.set(DIAMETER_PARAM, diameter);

    // Preserve the shopper's sort order; the guide's fitment defines
    // the filtered result set (page resets, other params replaced).
    var sortBy = new URLSearchParams(window.location.search).get('sort_by');
    if (sortBy) params.set('sort_by', sortBy);

    return params.toString();
  }

  function searchParamsDiffer(a, b) {
    var ka = new URLSearchParams(a);
    var kb = new URLSearchParams(b);
    var keys = {};
    ka.forEach(function (v, k) { keys[k] = true; });
    kb.forEach(function (v, k) { keys[k] = true; });
    for (var key in keys) {
      if (ka.get(key) !== kb.get(key)) return true;
    }
    return false;
  }

  function applyCollectionFilter(searchParams) {
    if (!searchParams) return;
    if (!searchParamsDiffer(searchParams, window.location.search)) return;

    var hasGrid = typeof FacetFiltersForm !== 'undefined' &&
      document.getElementById('product-grid') &&
      document.getElementById('ProductGridContainer') &&
      document.querySelector('[data-facets-sorting]');

    if (hasGrid) {
      try {
        // Theme-native: AJAX grid + facets refresh, URL pushState,
        // smooth-scroll to the grid on desktop.
        FacetFiltersForm.renderPage(searchParams, null);
        return;
      } catch (e) { /* fall through to navigation */ }
    }

    if (/^\/collections(\/|$)/.test(window.location.pathname)) {
      // Full navigation fallback; the guide re-renders for the saved
      // vehicle on load and the params guard prevents a loop.
      window.location.search = '?' + searchParams;
    }
    // Any other page (home, fitment finder, PDP): no listing to filter.
  }

  function syncCollectionFilter(section) {
    var card = section.querySelector(CARD_SELECTOR);
    if (!card) return;
    if (!card.querySelector(SPECS_SELECTOR)) return; // no specs produced yet
    applyCollectionFilter(buildFilterSearchParams(card));
  }

  /* ── Bolt Pattern facet block ──
     With a vehicle selected, the guide results always carry one bolt
     pattern, so the facet's own "Bolt Pattern" block is redundant. */

  var BOLT_TITLES = ['bolt pattern', 'bolt patter'];
  var boltFilterHidden = false;
  var facetWatchAttached = false;

  function isBoltPatternBlock(block) {
    // .sidebar-block_title_text may or may not carry .heading-font
    // depending on the block type; the title text is what identifies it.
    var title = block.querySelector('.sidebar-block_title_text');
    if (!title) return false;
    return BOLT_TITLES.indexOf(title.textContent.trim().toLowerCase()) !== -1;
  }

  function setBoltPatternFilterVisibility(hidden) {
    boltFilterHidden = hidden;
    var blocks = document.querySelectorAll(
      'facet-filters-form .sidebar-block, filter-popup .sidebar-block'
    );
    Array.prototype.forEach.call(blocks, function (block) {
      if (!isBoltPatternBlock(block)) return;
      block.style.display = hidden ? 'none' : '';
    });
  }

  /* ── Vehicle lock: applied-filter chips (2026-11-02 B) ──
     The vehicle's bolt-pattern/diameter constraints are URL facet params,
     which the sidebar renders as individually dismissible chips
     (.filter-row-selected). While a vehicle is selected those chips are
     hidden so the fitment can only be removed through the dedicated Reset
     action; restored when the vehicle clears. */
  function setAppliedFilterChipsVisibility(hidden) {
    var chips = document.querySelectorAll(
      'facet-filters-form .filter-row-selected, filter-popup .filter-row-selected'
    );
    Array.prototype.forEach.call(chips, function (row) {
      row.style.display = hidden ? 'none' : '';
    });
  }

  /* ── Style-mode stale-vehicle cleanup (2026-11-02 B) ──
     Switching browse modes to By Wheel Style cleared the saved vehicle
     (fitment-finder.js). On collection pages the URL may still carry the
     vehicle-driven filter params — strip them so style browsing starts
     from the unfiltered listing. Uses the theme-native AJAX refresh when
     available, otherwise a same-path navigation. */
  function stripVehicleFilterParams() {
    if (!/^\/collections(\/|$)/.test(window.location.pathname)) return;
    var params = new URLSearchParams(window.location.search);
    var hadVehicleParams = false;
    ['filter.p.m.custom.bolt_pattern', 'filter.v.option.diameter'].forEach(function (key) {
      if (params.get(key) !== null) { hadVehicleParams = true; params.delete(key); }
    });
    if (!hadVehicleParams) return;
    var search = params.toString();
    var hasGrid = typeof FacetFiltersForm !== 'undefined' &&
      document.getElementById('product-grid') &&
      document.getElementById('ProductGridContainer') &&
      document.querySelector('[data-facets-sorting]');
    if (hasGrid) {
      try {
        FacetFiltersForm.renderPage(search, null);
        return;
      } catch (e) { /* fall through to navigation */ }
    }
    window.location.search = search ? '?' + search : '';
  }

  /* ── Collection page title ──
     e.g. "Forged Wheels" → "2021 GM Escalade Wheels": everything
     before the "Wheels" word is replaced by the vehicle name. */

  var collectionTitleOriginal = null;
  var vehicleActive = false;
  var activeSection = null;

  function getVehicleDisplayName(card) {
    var nameEl = card && card.querySelector('.cw-fitment-guide__vehicle-name');
    var name = nameEl ? nameEl.textContent.trim() : '';
    if (name) return name;
    var vehicle = readSavedVehicle();
    if (!vehicle) return '';
    return vehicle.display_name ||
      [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ');
  }

  function applyCollectionTitle(section) {
    var headings = document.querySelectorAll('.category-page-title h2');
    if (!headings.length) return;
    var vehicleName = getVehicleDisplayName(section.querySelector(CARD_SELECTOR));
    if (!vehicleName) return;

    // Always work from the pristine title so re-application after
    // facet re-renders never compounds the replacement.
    if (collectionTitleOriginal === null) {
      collectionTitleOriginal = headings[0].textContent;
    }
    var original = collectionTitleOriginal;
    var match = original.match(/\bwheels\b/i);
    if (!match) return; // no " Wheels" marker in the title — leave it alone
    var newTitle = vehicleName + ' ' + original.slice(match.index);

    Array.prototype.forEach.call(headings, function (heading) {
      if (heading.textContent !== newTitle) heading.textContent = newTitle;
    });
  }

  function restoreCollectionTitle() {
    if (collectionTitleOriginal === null) return;
    var headings = document.querySelectorAll('.category-page-title h2');
    Array.prototype.forEach.call(headings, function (heading) {
      if (heading.textContent !== collectionTitleOriginal) {
        heading.textContent = collectionTitleOriginal;
      }
    });
  }

  /* The sidebar can be rebuilt outside the guide's render cycle
     (FacetFiltersForm.asyncLoadSidebar, filter-popup.render()) —
     re-apply the vehicle-selected presentation state (hidden Bolt
     Pattern block + vehicle-titled page heading) whenever facet
     content changes. */
  function watchFacetRerenders() {
    if (facetWatchAttached) return;
    facetWatchAttached = true;

    var targets = [];
    var column = document.getElementById('filterColumn');
    if (column) targets.push(column);
    var popup = document.querySelector('filter-popup');
    if (popup) targets.push(popup);
    if (!targets.length) return;

    var pending = null;
    var observer = new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () {
        pending = null;
        if (boltFilterHidden) setBoltPatternFilterVisibility(true);
        if (vehicleActive && activeSection) {
          setAppliedFilterChipsVisibility(true);
          applyCollectionTitle(activeSection);
        }
      }, 50);
    });
    targets.forEach(function (target) {
      observer.observe(target, { childList: true, subtree: true });
    });
  }

  /* ── Reset (start over) ── */

  var suppressParamStrip = false;

  function resetFitment(section) {
    // The Reset action owns the full navigation to the bare collection URL
    // (step 5 below); the cleared-observer's param strip must not race it.
    suppressParamStrip = true;
    setTimeout(function () { suppressParamStrip = false; }, 0);
    // 1. Persistent vehicle cleared first — a reload must not restore it.
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

    // 2. Card back to pristine through the guide's own change cascade
    //    (make/model reset, submit disabled, results hidden).
    resetCard(section);

    // 3. Vehicle presentation state off.
    vehicleActive = false;
    activeSection = null;
    setBoltPatternFilterVisibility(false);
    setAppliedFilterChipsVisibility(false);
    restoreCollectionTitle();

    // 4. Finder status panel -> hidden (the empty state syncs through
    //    the section's own MutationObserver, and the vehicle-cleared
    //    event dispatches through the panel observer).
    var panel = section.querySelector('[data-fitment-status]');
    if (panel) {
      panel.setAttribute('hidden', '');
      panel.style.display = 'none';
    }

    // 5. Persistent URL filter params -> clean listing. Full reload so
    //    the facet sidebar's checkbox states rebuild unfiltered.
    if (window.location.search) {
      window.location.href = window.location.pathname;
    }
  }

  /* ── Init ── */

  function initSection(section) {
    if (section.dataset.ffGuideGlue === 'true') return;
    section.dataset.ffGuideGlue = 'true';

    var card = section.querySelector(CARD_SELECTOR);
    if (!card) return; // plain finder variant — no glue needed

    var results = card.querySelector('[data-guide-results]');
    var statusPanel = section.querySelector('[data-fitment-status]');
    if (!results || !statusPanel) return;

    // Guide rendered a vehicle → keep the finder status panel in sync,
    // apply the guide's fitment as URL filters on collection pages,
    // hide the now-redundant Bolt Pattern facet block, and retitle the
    // collection heading with the vehicle name.
    watchFacetRerenders();
    new MutationObserver(function () {
      if (results.querySelector(RENDERED_SELECTOR)) {
        vehicleActive = true;
        activeSection = section;
        syncStatusPanel(section);
        var vehicle = readSavedVehicle();
        if (vehicle) {
          document.dispatchEvent(new CustomEvent('calder:vehicle-selected', { detail: vehicle }));
        }
        syncCollectionFilter(section);
        setBoltPatternFilterVisibility(true);
        setAppliedFilterChipsVisibility(true);
        applyCollectionTitle(section);
      }
    }).observe(results, { childList: true });

    // Finder cleared the vehicle (Change Vehicle / Reset / switching to the
    // By Wheel Style browse mode) → reset the card, restore the Bolt Pattern
    // facet block, show the applied-filter chips again, strip the
    // vehicle-driven URL params on collection pages, and restore the heading.
    new MutationObserver(function () {
      if (statusPanel.hidden) {
        vehicleActive = false;
        activeSection = null;
        resetCard(section);
        setBoltPatternFilterVisibility(false);
        setAppliedFilterChipsVisibility(false);
        restoreCollectionTitle();
        if (!suppressParamStrip) { stripVehicleFilterParams(); }
        document.dispatchEvent(new CustomEvent('calder:vehicle-cleared'));
      }
    }).observe(statusPanel, { attributes: true, attributeFilter: ['hidden'] });

    // Initial state (covers card auto-render before this script ran).
    if (results.querySelector(RENDERED_SELECTOR)) {
      vehicleActive = true;
      activeSection = section;
      syncStatusPanel(section);
      syncCollectionFilter(section);
      setBoltPatternFilterVisibility(true);
      setAppliedFilterChipsVisibility(true);
      applyCollectionTitle(section);
    }

    // Card reset (start over) — clears the persistent vehicle, card
    // state, vehicle presentation state, and URL filter params.
    var resetBtn = card.querySelector('[data-guide-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        resetFitment(section);
      });
    }

    initGuideFinishFilters(section, card, results);
  }

  /* ── Vehicle-mode finish filters (2026-11-02 B) ──
     Barrel/lip + bolt/hardware finish selects narrow the guide's already
     vehicle-matched wheels grid. Options come from the real catalog data
     (fitment-catalog barrel_finishes/bolt_finish; stamped on each wheel
     card by calder-product-fitment-guide.js). Filtering only hides cards —
     the fitment match itself is untouched, so nothing incompatible is
     ever presented as purchasable. The filter row appears with the
     results and hides again when the vehicle clears. */
  function initGuideFinishFilters(section, card, results) {
    var filterRow = card.querySelector('[data-guide-finish-filters]');
    if (!filterRow) return;
    var barrelSel = filterRow.querySelector('[id^="hf-vehicle-barrel-"]');
    var boltSel = filterRow.querySelector('[id^="hf-vehicle-bolt-"]');
    if (!barrelSel && !boltSel) return;

    var catalog = window.__fitmentCatalog || [];
    var barrelSet = {};
    var boltSet = {};
    catalog.forEach(function (p) {
      (p.barrel_finishes || []).forEach(function (b) { if (b) barrelSet[b] = true; });
      if (p.bolt_finish) boltSet[p.bolt_finish] = true;
    });
    if (barrelSel) {
      barrelSel.replaceChildren(new Option('All Barrel Finishes', ''));
      Object.keys(barrelSet).sort().forEach(function (b) { barrelSel.add(new Option(b, b)); });
    }
    if (boltSel) {
      boltSel.replaceChildren(new Option('All Bolt Finishes', ''));
      Object.keys(boltSet).sort().forEach(function (b) { boltSel.add(new Option(b, b)); });
    }

    function applyGuideFinishFilters() {
      var cards = results.querySelectorAll('.cw-fitment-guide__wheel-card');
      if (!cards.length) return;
      var barrelVal = barrelSel ? barrelSel.value : '';
      var boltVal = boltSel ? boltSel.value : '';
      var visible = 0;
      Array.prototype.forEach.call(cards, function (wheelCard) {
        var barrels = (wheelCard.getAttribute('data-barrel') || '').split('|').filter(Boolean);
        var bolt = wheelCard.getAttribute('data-bolt') || '';
        var show = (!barrelVal || barrels.indexOf(barrelVal) !== -1) &&
                   (!boltVal || bolt === boltVal);
        wheelCard.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      var countEl = results.querySelector('.cw-fitment-guide__wheels-count');
      if (countEl) {
        if (!countEl.getAttribute('data-original')) {
          countEl.setAttribute('data-original', countEl.textContent);
        }
        var original = countEl.getAttribute('data-original');
        if (barrelVal || boltVal) {
          countEl.textContent = original + ' — ' + visible + ' shown';
        } else {
          countEl.textContent = original;
        }
      }
    }

    if (barrelSel) barrelSel.addEventListener('change', applyGuideFinishFilters);
    if (boltSel) boltSel.addEventListener('change', applyGuideFinishFilters);

    /* The filter row is part of the card UI: show it whenever the guide
       renders vehicle results, hide it when the results clear. */
    var syncFilterRow = function () {
      var hasResults = !!results.querySelector(RENDERED_SELECTOR);
      filterRow.hidden = !hasResults;
      if (!hasResults) {
        if (barrelSel) barrelSel.value = '';
        if (boltSel) boltSel.value = '';
      }
    };
    new MutationObserver(syncFilterRow).observe(results, { childList: true });
    syncFilterRow();
  }

  function init() {
    var sections = document.querySelectorAll(FINDER_SELECTOR);
    Array.prototype.forEach.call(sections, function (section) {
      if (section.querySelector(CARD_SELECTOR)) initSection(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', function (e) {
    var section = e.target.querySelector ? e.target.querySelector(FINDER_SELECTOR) : null;
    if (section && section.querySelector(CARD_SELECTOR)) initSection(section);
  });

  /* Style tab hand-off: the finder's "By Wheel Style" CTA applied its
     own Diameter/Bolt Pattern filters on a collection page — exit the
     vehicle-driven presentation state (title override, hidden Bolt
     Pattern block) so the manual filter flow has full control. */
  document.addEventListener('calder:style-filters-applied', function (event) {
    var searchParams = event.detail && event.detail.searchParams;
    if (searchParams) applyCollectionFilter(searchParams);
    vehicleActive = false;
    activeSection = null;
    setBoltPatternFilterVisibility(false);
    setAppliedFilterChipsVisibility(false);
    restoreCollectionTitle();
  });
})();

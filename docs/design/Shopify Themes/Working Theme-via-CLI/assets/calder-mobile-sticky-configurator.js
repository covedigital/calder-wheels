/*!
 * Calder mobile sticky configurator controller — feature/calder-mobile-sticky-configurator.
 * Two-state mobile UI for universal PDPs: collapsed bar + expanded bottom sheet.
 *
 * Shares the ONE authoritative state: window.CALDER_UNIVERSAL_PDP.state
 * (CALDER_PDP_STATE instance). Never creates a second state instance, never
 * duplicates resolver logic, never writes configuration URL parameters,
 * never dispatches cart or analytics events.
 *
 * Synchronization contract:
 *   Mobile selection -> clicks the ORIGINAL [data-calder-uc-option] button,
 *   which routes through the existing root click handler (gallery preview
 *   snap + state.setOption). Fallback -> state.setOption directly.
 *   Original UI / URL / history / design-nav selections -> state.subscribe
 *   callback updates tabs, summary, and thumbnail here.
 *
 * Option lists, labels, and tokens are read from CALDER_UNIVERSAL_PDP.resolver
 * (registry-backed). Swatch image srcs are copied from the original controls'
 * swatch images; thumbnail layers are copied from the existing gallery preview
 * stack ([data-calder-uc-stack]) — all browser-cached, zero new downloads.
 *
 * Cleanup: destroys all listeners/observers on shopify:section:unload.
 */
(function () {
  'use strict';

  var DIMS = ['diameter', 'center', 'barrel', 'hardware'];
  /* Full names stay on the active-category label + aria-labels; the tab
     chips use the short names below (client update 2026-11-03). */
  var DIM_LABELS = { diameter: 'Diameter', center: 'Center Finish', barrel: 'Barrel & Lip Finish', hardware: 'Hardware & Rivet Finish' };
  var TAB_LABELS = { diameter: 'Diameter', center: 'Center', barrel: 'Barrel & Lip', hardware: 'Bolts' };
  var TAB_ICONS = {
    diameter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v4M12 17v4M3 12h4M17 12h4"></path></svg>',
    center: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3.5"></circle><path d="M12 3v5.5M12 15.5V21M3.6 7.5l4.8 2.7M15.6 13.8l4.8 2.7M3.6 16.5l4.8-2.7M15.6 10.2l4.8-2.7"></path></svg>',
    barrel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="15" stroke-dasharray="2 3"></circle><path d="M12 3v4M12 17v4M3 12h4M17 12h4"></path></svg>',
    hardware: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="7" r="1.2"></circle><circle cx="16.3" cy="9.5" r="1.2"></circle><circle cx="16.3" cy="14.5" r="1.2"></circle><circle cx="12" cy="17" r="1.2"></circle><circle cx="7.7" cy="14.5" r="1.2"></circle><circle cx="7.7" cy="9.5" r="1.2"></circle></svg>'
  };

  function boot() {
    var root = document.querySelector('[data-calder-mobile-uc]');
    if (!root) { return; }
    if (root.dataset.calderMucBooted) { return; }
    root.dataset.calderMucBooted = '1';

    var bar = root.querySelector('[data-calder-mobile-uc-bar]');
    var sheet = root.querySelector('[data-calder-mobile-uc-sheet]');
    var tabsEl = root.querySelector('[data-calder-mobile-uc-tabs]');
    var categoryEl = root.querySelector('[data-calder-mobile-uc-category]');
    var optionsEl = root.querySelector('[data-calder-mobile-uc-options]');
    if (!bar || !sheet || !tabsEl || !optionsEl) { return; }

    var barSummaryEls = root.querySelectorAll('[data-calder-mobile-uc-summary]');
    var statusTextEl = root.querySelector('[data-calder-mobile-uc-status-text]');
    var thumbs = root.querySelectorAll('[data-calder-mobile-uc-thumb]');

    var unsubscribe = null;
    var bodyObserver = null;
    var resizeRaf = null;
    var unloadHandler = null;
    var keydownHandler = null;
    var grabHandlers = [];
    var destroyed = false;
    var activeDim = 'diameter';
    var optionButtons = {}; /* dim -> [buttons] */

    /* ── Universal controller availability ──
       calder-universal-pdp.js boots on DOMContentLoaded and may still be
       initializing when this deferred script runs. Poll briefly; if the
       controller never appears (non-universal page, registry failure),
       the feature stays hidden and inert. */
    var pollTries = 0;
    function pollController() {
      if (destroyed) { return; }
      if (window.CALDER_UNIVERSAL_PDP && window.CALDER_UNIVERSAL_PDP.state) {
        init(window.CALDER_UNIVERSAL_PDP);
        return;
      }
      if (pollTries++ < 80) { setTimeout(pollController, 100); }
    }

    function labelFor(resolver, dim, token) {
      if (!token) { return null; }
      if (dim === 'diameter') { return token + '"'; }
      return (resolver.labels[dim] && resolver.labels[dim][token]) || token;
    }

    /* Options valid for THIS design: resolver.options is registry-wide;
       resolver.design carries the per-design availability lists. */
    function tokensForDim(resolver, dim) {
      var design = resolver.design;
      var perDesign = null;
      if (dim === 'diameter') { perDesign = design.diameters; }
      else if (dim === 'center') { perDesign = design.centers; }
      else if (dim === 'barrel') { perDesign = design.barrelFinishes; }
      else if (dim === 'hardware') { perDesign = design.hardwareFinishes; }
      if (perDesign && perDesign.length) {
        var all = resolver.options[dim] || [];
        return perDesign.filter(function (t) { return all.indexOf(t) !== -1; });
      }
      return (resolver.options[dim] || []).slice();
    }

    function summaryText(resolver, tokens) {
      var parts = [];
      var missing = 0;
      DIMS.forEach(function (dim) {
        var lbl = labelFor(resolver, dim, tokens[dim]);
        if (lbl) { parts.push(lbl); } else { missing++; }
      });
      if (!parts.length) { return 'Select your options'; }
      if (missing) { parts.push('…'); }
      return parts.join(' · ');
    }

    /* Reuse the existing composite rendering: copy layer srcs from the
       gallery preview stack (same files the gallery already loaded).
       Hidden layers (incomplete config) leave the previous src — the
       fallback copy in the gallery governs what is "current". */
    function syncThumbs() {
      ['barrel', 'center', 'hardware'].forEach(function (dim) {
        var layerImg = document.querySelector('[data-calder-uc-stack] img[data-calder-uc-layer="' + dim + '"]');
        if (!layerImg) { return; }
        var shown = layerImg.style.display !== 'none' && layerImg.getAttribute('src');
        if (!shown) { return; }
        Array.prototype.forEach.call(thumbs, function (thumb) {
          var img = thumb.querySelector('[data-calder-mobile-uc-thumb-layer="' + dim + '"]');
          if (img && img.getAttribute('src') !== shown) { img.setAttribute('src', shown); }
        });
      });
    }

    /* ── Build the four tabs + option groups from the resolver ── */
    function buildTabs(resolver) {
      tabsEl.textContent = '';
      optionButtons = {};
      DIMS.forEach(function (dim) {
        var tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'calder-mobile-uc__tab';
        tab.id = 'calder-mobile-uc-tab-' + dim;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', dim === activeDim ? 'true' : 'false');
        tab.setAttribute('aria-controls', 'calder-mobile-uc-panel');
        tab.setAttribute('data-dim', dim);
        tab.tabIndex = dim === activeDim ? 0 : -1;
        tab.innerHTML = TAB_ICONS[dim] + '<span class="calder-mobile-uc__tab-name">' + TAB_LABELS[dim] + '</span>';
        tabsEl.appendChild(tab);
      });
    }

    function buildOptions(resolver, tokens) {
      DIMS.forEach(function (dim) {
        var list = tokensForDim(resolver, dim);
        var buttons = [];
        list.forEach(function (token) {
          var btn = document.createElement('button');
          btn.type = 'button';
          var isDia = dim === 'diameter';
          btn.className = 'calder-mobile-uc__option' + (isDia ? ' calder-mobile-uc__option--dia' : '');
          if (!isDia) {
            var origImg = document.querySelector(
              '.calder-uc [data-calder-uc-option][data-dim="' + dim + '"][data-token="' + token + '"] img'
            );
            if (origImg && origImg.getAttribute('src')) {
              btn.classList.add('calder-mobile-uc__option--swatch');
              var img = document.createElement('img');
              img.className = 'calder-mobile-uc__option-swatch';
              img.setAttribute('src', origImg.getAttribute('src'));
              img.setAttribute('alt', '');
              img.setAttribute('width', '44');
              img.setAttribute('height', '44');
              img.setAttribute('loading', 'lazy');
              img.setAttribute('decoding', 'async');
              btn.appendChild(img);
            }
          }
          var name = document.createElement('span');
          name.className = 'calder-mobile-uc__option-name';
          name.textContent = labelFor(resolver, dim, token) || token;
          btn.appendChild(name);
          btn.setAttribute('role', 'radio');
          btn.setAttribute('data-dim', dim);
          btn.setAttribute('data-token', token);
          btn.setAttribute('aria-checked', tokens[dim] === token ? 'true' : 'false');
          btn.tabIndex = tokens[dim] === token ? 0 : -1;
          buttons.push(btn);
        });
        optionButtons[dim] = buttons;
      });
    }

    /* Selection routes through the ORIGINAL controls when possible so the
       existing gallery-snap + setOption path stays authoritative. */
    function selectOption(dim, token) {
      var orig = document.querySelector(
        '.calder-uc [data-calder-uc-option][data-dim="' + dim + '"][data-token="' + token + '"]'
      );
      if (orig) { orig.click(); return; }
      var UC = window.CALDER_UNIVERSAL_PDP;
      if (UC && UC.state && UC.state.getState().tokens[dim] !== token) {
        UC.state.setOption(dim, token, { source: 'user' });
      }
    }

    function renderActivePanel() {
      var buttons = optionButtons[activeDim] || [];
      optionsEl.textContent = '';
      optionsEl.setAttribute('role', 'radiogroup');
      optionsEl.setAttribute('aria-label', DIM_LABELS[activeDim]);
      buttons.forEach(function (btn) { optionsEl.appendChild(btn); });
      categoryEl.textContent = DIM_LABELS[activeDim];
    }

    function setActiveTab(dim) {
      activeDim = DIMS.indexOf(dim) !== -1 ? dim : 'diameter';
      Array.prototype.forEach.call(tabsEl.querySelectorAll('[data-dim]'), function (tab) {
        var selected = tab.getAttribute('data-dim') === activeDim;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
      renderActivePanel();
    }

    /* ── State subscription — the single sync entry point ── */
    function onState(snap) {
      var UC = window.CALDER_UNIVERSAL_PDP;
      if (!UC || destroyed) { return; }
      var resolver = UC.resolver;
      var tokens = snap.tokens;

      Array.prototype.forEach.call(barSummaryEls, function (el) { el.textContent = summaryText(resolver, tokens); });
      if (statusTextEl) {
        statusTextEl.textContent = snap.complete ? 'Complete' : 'Incomplete';
      }
      root.classList.toggle('is-complete', !!snap.complete);

      DIMS.forEach(function (dim) {
        (optionButtons[dim] || []).forEach(function (btn) {
          var selected = tokens[dim] === btn.getAttribute('data-token');
          btn.setAttribute('aria-checked', selected ? 'true' : 'false');
          btn.tabIndex = selected ? 0 : -1;
        });
      });
      syncThumbs();
    }

    /* ── Open / close ── */
    function isOpen() { return root.classList.contains('is-open'); }

    function openSheet() {
      if (isOpen() || destroyed) { return; }
      sheet.hidden = false;
      requestAnimationFrame(function () {
        root.classList.add('is-open');
        bar.setAttribute('aria-expanded', 'true');
      });
      var firstTab = tabsEl.querySelector('[data-dim="' + activeDim + '"]');
      if (firstTab) { firstTab.focus({ preventScroll: true }); }
    }

    function closeSheet() {
      if (!isOpen() || destroyed) { return; }
      root.classList.remove('is-open');
      bar.setAttribute('aria-expanded', 'false');
      if (typeof sheet.addEventListener === 'function' && typeof window.TransitionEvent !== 'undefined') {
        sheet.addEventListener('transitionend', function once() {
          sheet.removeEventListener('transitionend', once);
          if (!isOpen()) { sheet.hidden = true; }
        });
      } else {
        setTimeout(function () { if (!isOpen()) { sheet.hidden = true; } }, 350);
      }
      bar.focus({ preventScroll: true });
    }

    /* ── Bottom navigation offset (no competing scroll listener) ──
       The nav is .hdr-mobile-bottom: fixed, 62px. header.js expresses its
       INTENT through body classes (scroll-down = hidden, plus
       has-hdr_sticky_not_hiding = always visible, and .offScroll moves the
       nav out of the fixed layer). We read those classes + the non-transitioned
       computed position — stable at the instant header.js toggles, so this
       runs correctly on every MutationObserver tick. The bar's 0.35s bottom
       transition matches the nav's 0.35s transform, so both travel in sync.
       data-calder-muc-nav-hidden lets CSS drop the bar to the safe-area only
       when the nav is hidden (no gap above the visible nav). */
    function updateNavOffset() {
      if (destroyed) { return; }
      var nav = document.querySelector('.hdr-mobile-bottom');
      var hidden = true;
      var offset = 0;
      if (nav && window.matchMedia('(max-width: 1024px)').matches) {
        var body = document.body;
        var isFixed = window.getComputedStyle(nav).position === 'fixed';
        var alwaysVisible = body.classList.contains('has-hdr_sticky_not_hiding');
        var scrolledDown = body.classList.contains('scroll-down');
        hidden = !isFixed || (!alwaysVisible && scrolledDown);
        if (!hidden) { offset = nav.offsetHeight || 62; }
      }
      var flag = hidden ? 'true' : 'false';
      if (root.getAttribute('data-calder-muc-nav-hidden') !== flag) {
        root.setAttribute('data-calder-muc-nav-hidden', flag);
      }
      if (root.style.getPropertyValue('--calder-muc-nav-offset') !== offset + 'px') {
        root.style.setProperty('--calder-muc-nav-offset', offset + 'px');
      }
    }

    function onResize() {
      if (resizeRaf) { cancelAnimationFrame(resizeRaf); }
      resizeRaf = requestAnimationFrame(function () {
        resizeRaf = null;
        updateNavOffset();
        /* Desktop: unhide guard — CSS already display:none >749px; nothing to do. */
      });
    }

    var grab = root.querySelector('[data-calder-mobile-uc-grab]');

    /* ── Swipe-down on the grab handle (touch/pointer only) ── */
    function bindGrab() {
      var startY = null;
      var startT = 0;
      function onDown(evt) {
        if (evt.pointerType === 'mouse' && evt.button !== 0) { return; }
        startY = evt.clientY;
        startT = Date.now();
      }
      function onUp(evt) {
        if (startY == null) { return; }
        var dy = evt.clientY - startY;
        startY = null;
        if (dy > 44 && Date.now() - startT < 800) { closeSheet(); }
      }
      if (window.PointerEvent) {
        grab.addEventListener('pointerdown', onDown);
        grab.addEventListener('pointerup', onUp);
        grabHandlers.push([grab, onDown], [grab, onUp]);
      }
    }

    /* ── Global keydown (Escape + roving focus) ── */
    keydownHandler = function (evt) {
      if (destroyed) { return; }
      if (evt.key === 'Escape' && isOpen()) { closeSheet(); return; }
      if (grab && evt.target === grab && (evt.key === 'Enter' || evt.key === ' ')) {
        evt.preventDefault();
        closeSheet();
        return;
      }
      var tab = evt.target.closest ? evt.target.closest('[data-dim]', tabsEl) : null;
      if (tab && tab.parentElement === tabsEl && (evt.key === 'ArrowRight' || evt.key === 'ArrowLeft')) {
        var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll('[data-dim]'));
        var idx = tabs.indexOf(tab);
        var next = tabs[(idx + (evt.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        if (next) {
          evt.preventDefault();
          setActiveTab(next.getAttribute('data-dim'));
          next.focus({ preventScroll: true });
        }
        return;
      }
      /* Radio-group roving focus inside the options panel */
      var opt = evt.target.closest ? evt.target.closest('.calder-mobile-uc__option') : null;
      if (opt && optionsEl.contains(opt)) {
        if (evt.key !== 'ArrowRight' && evt.key !== 'ArrowLeft' && evt.key !== 'ArrowUp' && evt.key !== 'ArrowDown') { return; }
        var dim = opt.getAttribute('data-dim');
        var group = optionButtons[dim] || [];
        var i = group.indexOf(opt);
        if (i === -1) { return; }
        var dir = (evt.key === 'ArrowRight' || evt.key === 'ArrowDown') ? 1 : -1;
        var nextOpt = group[(i + dir + group.length) % group.length];
        if (nextOpt) {
          evt.preventDefault();
          nextOpt.focus({ preventScroll: true });
        }
      }
    };

    /* ── Delegated clicks (bar open, tabs, options) ── */
    var clickHandler = function (evt) {
      if (destroyed) { return; }
      var target = evt.target;
      if (!target || !target.closest) { return; }
      if (bar.contains(target) && target.closest('[data-calder-mobile-uc-bar]') === bar) {
        if (isOpen()) { closeSheet(); } else { openSheet(); }
        return;
      }
      var tab = target.closest('[data-dim]', tabsEl);
      if (tab && tab.parentElement === tabsEl) {
        setActiveTab(tab.getAttribute('data-dim'));
        return;
      }
      var opt = target.closest('.calder-mobile-uc__option');
      if (opt && optionsEl.contains(opt)) {
        selectOption(opt.getAttribute('data-dim'), opt.getAttribute('data-token'));
        /* Keep the sheet open — no auto-collapse after a selection. */
        return;
      }
      var minimize = target.closest('[data-calder-mobile-uc-minimize]');
      if (minimize && root.contains(minimize)) {
        closeSheet();
        return;
      }
      if (grab && (target === grab || grab.contains(target))) {
        closeSheet();
      }
    };
    root.addEventListener('click', clickHandler);

    /* ── Init with the live controller ── */
    function init(UC) {
      var resolver = UC.resolver;
      var state = UC.state;

      buildTabs(resolver);
      buildOptions(resolver, state.getState().tokens);
      setActiveTab('diameter'); /* default tab on first opening */
      onState(state.getState());
      unsubscribe = state.subscribe(onState);

      bodyObserver = new MutationObserver(function () { updateNavOffset(); });
      bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('resize', onResize);
      updateNavOffset();

      root.removeAttribute('hidden');
    }

    /* ── Theme Editor + teardown ── */
    unloadHandler = function (evt) {
      if (evt && evt.target && evt.target.querySelector && !evt.target.contains(root)) { return; }
      destroy();
    };
    document.addEventListener('shopify:section:unload', unloadHandler);

    function destroy() {
      destroyed = true;
      if (unsubscribe) { try { unsubscribe(); } catch (e) {} }
      if (bodyObserver) { bodyObserver.disconnect(); }
      if (resizeRaf) { cancelAnimationFrame(resizeRaf); }
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('shopify:section:unload', unloadHandler);
      root.removeEventListener('click', clickHandler);
      grabHandlers.forEach(function (pair) {
        try { pair[0].removeEventListener('pointerdown', pair[1]); pair[0].removeEventListener('pointerup', pair[1]); } catch (e) {}
      });
      root.setAttribute('hidden', 'hidden');
    }

    document.addEventListener('keydown', keydownHandler);
    bindGrab();
    pollController();
  }

  /* Re-boot on Theme Editor section reload (the DOM node is replaced). */
  document.addEventListener('shopify:section:load', function (evt) {
    if (evt.target && evt.target.querySelector && evt.target.querySelector('[data-calder-mobile-uc]')) {
      boot();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

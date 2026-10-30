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
    var ASSET_MAP = {
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
    }

    var UC_CENTER_CODE = { 'gloss-black': 'GB', 'black-titanium': 'BT', 'titanium-tint': 'TT' };
    var UC_LIP_CODE = { 'gloss-black': 'GBL', 'polished': 'POL' };
    var UC_BOLT_CODE = { 'chrome': 'CH', 'black': 'BK' };
    /* SKU + Universal Part# presentation (client-approved format 2026-10-29):
       spec table cell:   SKU: CFG-... <br /> Universal Part#: CLB...
       PDP .calder-pdp__sku block:
         <span class="sku"><span>SKU:</span> CFG-...</span><br />
         <span class="universal-part"><span>Universal Part#:</span> CLB...</span>
       Values are registry tokens (alnum/dash); sanitizeSpecValue keeps the
       innerHTML write safe. Both targets update on EVERY calder-uc selection
       (the CTA broadcasts calder:universal-resolved with the resolved record). */
    function sanitizeSpecValue(value) {
      return String(value == null ? '' : value).replace(/[^A-Za-z0-9#-]/g, '');
    }
    document.addEventListener('calder:universal-resolved', function (e) {
      var out = e && e.detail;
      var t = state.getState().tokens;
      var cfgSku = resolver && resolver.design && resolver.design.designCode && t.diameter
        ? 'CFG-' + resolver.design.designCode + '-' + t.diameter + '-' + (UC_CENTER_CODE[t.center] || '') + '-' + (UC_LIP_CODE[t.barrel] || '') + '-' + (UC_BOLT_CODE[t.hardware] || '')
        : '';
      var pn = out && out.partNumber ? out.partNumber : null;
      var cell = document.querySelector('[data-calder-spec="sku"]');
      if (cell) {
        if (cfgSku && pn) {
          cell.innerHTML = 'SKU: ' + sanitizeSpecValue(cfgSku) + '<br />Universal Part#: ' + sanitizeSpecValue(pn);
        } else if (pn) {
          cell.innerHTML = 'Universal Part#: ' + sanitizeSpecValue(pn);
        } else {
          cell.innerHTML = cfgSku ? 'SKU: ' + sanitizeSpecValue(cfgSku) : '—';
        }
      }
      var block = document.querySelector('.calder-pdp__sku');
      if (block) {
        block.innerHTML =
          '<span class="sku"><span>SKU:</span> ' + (cfgSku ? sanitizeSpecValue(cfgSku) : '—') + '</span>' +
          '<br />' +
          '<span class="universal-part"><span>Universal Part#:</span> ' + (pn ? sanitizeSpecValue(pn) : '—') + '</span>';
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

    root.addEventListener('click', function (evt) {
      var btn = evt.target.closest ? evt.target.closest('[data-calder-uc-option]') : null;
      if (!btn || !root.contains(btn)) { return; }
      evt.preventDefault();
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
      function galEzPlusAvailable() {
        return typeof window.jq_lumia === 'function' && window.jq_lumia.fn && typeof window.jq_lumia.fn.ezPlus === 'function';
      }
      function activateSlideZoom(idx) {
        if (!galEzPlusAvailable()) { return; }
        var slide = galSlides[idx];
        if (!slide || slide.classList.contains('zoom-init')) { return; }
        var img = slide.querySelector('img[data-zoom-image]');
        if (!img) { return; }
        var srcW = parseInt(img.getAttribute('data-image-width'), 10) || 0;
        var frameW = slide.clientWidth || img.clientWidth || 0;
        if (srcW && frameW && srcW <= frameW * 1.1) { slide.classList.add('zoom-init'); return; }
        window.jq_lumia(img).ezPlus({
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
      var galZoomObjs = (window.jq_lumia && window.jq_lumia.fancybox) ? galZoomObjects() : [];
      if (galZoomBtn && !galZoomObjs.length) {
        galZoomBtn.hidden = true;
        galZoomBtn.classList.add('hidden');
      }
      if (galZoomBtn && galZoomObjs.length) {
        galZoomBtn.addEventListener('click', function (evt) {
          evt.preventDefault();
          if (!window.jq_lumia || !window.jq_lumia.fancybox) { return; }
          window.jq_lumia.fancybox.open(galZoomObjs, {
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
        strip.addEventListener('click', function (evt) {
          var thumb = evt.target.closest ? evt.target.closest('[data-media-id]') : null;
          if (!thumb || !strip.contains(thumb)) { return; }
          var id = thumb.getAttribute('data-media-id');
          for (var i = 0; i < galSlides.length; i++) {
            if (galSlides[i].getAttribute('data-media-id') === id) { goTo(i); return; }
          }
        });
      }
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

(function () {
  'use strict';
  if (window.CalderBuilderUI) return;
  window.CalderBuilderUI = true;

  var sectionId = null;
  var root = document.querySelector('.calder-builder-page');
  if (!root) return;

  var configSection = root.querySelector('[data-section-id]');
  if (configSection) sectionId = configSection.dataset.sectionId;

  if (!sectionId) {
    var match = root.innerHTML.match(/wheel-configurator-([A-Za-z0-9_-]+)/);
    if (match) sectionId = match[1];
  }
  if (!sectionId) return;

  var configEl = document.getElementById('wheel-configurator-' + sectionId);
  var productId = configEl ? configEl.dataset.productId : '';

  var CONFIG_TYPES = ['center', 'barrel', 'hardware'];
  var FINISH_TYPES = ['center', 'barrel', 'hardware'];

  function container(type) {
    var suffix = type + 's';
    return document.getElementById('configurator-' + suffix + '-' + sectionId);
  }

  function diameterSelect() {
    return container('diameter');
  }

  function selectedDiameter() {
    var d = diameterSelect();
    return d && d.value ? { id: (d.selectedOptions[0] && d.selectedOptions[0].dataset.id) || d.value, label: d.value } : null;
  }

  function selected(type) {
    if (type === 'diameter') return selectedDiameter();
    var c = container(type);
    return c ? c.querySelector('.wheel-configurator__option--selected') : null;
  }

  function selectedImg(type) {
    if (type === 'diameter') return null;
    var s = selected(type);
    return s ? s.querySelector('img') : null;
  }

  /* ── RESET ── */
  var resetBtn = document.getElementById('configurator-reset-' + sectionId);
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      CONFIG_TYPES.forEach(function (t) {
        var c = container(t);
        if (!c) return;
        var first = c.querySelector('.wheel-configurator__option:not(.wheel-configurator__option--unavailable)');
        if (first) first.click();
      });
      var d = diameterSelect();
      if (d && d.options.length > 1) {
        d.selectedIndex = 1;
        d.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  /* ── ZOOM ── */
  var zoomBtn = document.getElementById('configurator-zoom-' + sectionId);
  var canvas = document.getElementById('configurator-canvas-' + sectionId);
  if (zoomBtn && canvas) {
    zoomBtn.addEventListener('click', function () {
      var layers = canvas.querySelector('.wheel-configurator__preview-layers');
      if (!layers) return;
      layers.classList.toggle('wheel-configurator__preview-layers--zoomed');
      zoomBtn.classList.toggle('cbp-config__preview-action--active');
    });
  }

  /* ── lightweight WheelConfigurator view for shared utils ── */
  function configuratorView() {
    var sels = {};
    CONFIG_TYPES.forEach(function (t) {
      var s = selected(t);
      if (s) {
        sels[t] = { id: s.dataset.componentId, label: (s.querySelector('img') || {}).alt || '' };
      }
    });
    var seld = selectedDiameter();
    if (seld) sels.diameter = seld;
    var canvasEl = document.getElementById('configurator-canvas-' + sectionId);
    var wcEl = document.getElementById('wheel-configurator-' + sectionId);
    var pid = wcEl ? wcEl.dataset.productId : productId;
    return {
      productId: pid,
      selected: sels,
      priceEl: document.getElementById('configurator-summary-price'),
      availabilityEl: document.getElementById('configurator-availability-' + sectionId),
      layerImgs: {
        center: canvasEl ? canvasEl.querySelector('.wheel-configurator__layer--center') : null,
        barrel: canvasEl ? canvasEl.querySelector('.wheel-configurator__layer--barrel') : null,
        hardware: canvasEl ? canvasEl.querySelector('.wheel-configurator__layer--hardware') : null
      }
    };
  }

  /* ── SAVE BUILD → PDF (browser Save as PDF) ── */
  var saveBtn = document.getElementById('configurator-save-' + sectionId);
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (typeof window.CalderConfigurator !== 'undefined') {
        window.CalderConfigurator.saveBuild(configuratorView());
        window.CalderConfigurator.buildPdf(configuratorView());
        saveBtn.innerHTML = '<span>Print / Save PDF</span>';
        setTimeout(function () {
          saveBtn.innerHTML = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v7a2 2 0 0 1-2 2zM13 17v-4H7v4M7 1v4"/></svg><span>Save Build</span>';
        }, 2500);
      }
    });
  }

  /* ── SHARE BUILD (native share / clipboard / prompt) ── */
  var shareBtn = document.getElementById('configurator-share-' + sectionId);
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      if (typeof window.CalderConfigurator !== 'undefined') {
        window.CalderConfigurator.shareBuild(configuratorView());
      }
    });
  }

  /* ── RESTORE saved / shared config ── */
  function restoreFromHash() {
    var match = window.location.hash.match(/#cfg=([^&]+)/);
    if (!match) return false;
    var raw, data;
    try { raw = atob(match[1]); } catch (e) { return false; }
    try { data = JSON.parse(raw); } catch (e) { return false; }
    if (data && data.c && (data.c.center || data.c.barrel)) return data.c;
    return data;
  }

  function restoreOptions(data) {
    CONFIG_TYPES.forEach(function (t) {
      var id = data[t];
      if (!id) return;
      var c = container(t);
      if (!c) return;
      var opt = c.querySelector('[data-component-id="' + id + '"]:not(.wheel-configurator__option--unavailable)');
      if (opt) opt.click();
    });

    var dLabel = data.diameter;
    if (dLabel) {
      var d = diameterSelect();
      if (d) {
        var target = null;
        for (var i = 0; i < d.options.length; i++) {
          var o = d.options[i];
          if (o.value === dLabel || (o.dataset && o.dataset.id === dLabel)) { target = o; break; }
        }
        if (target) {
          d.value = target.value;
          d.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  }

  var sharedCfg = restoreFromHash();
  if (!sharedCfg) {
    try {
      var saved = JSON.parse(localStorage.getItem('calder-config-' + productId) || '{}');
      if (saved.selections) sharedCfg = saved.selections;
    } catch (e) {}
  }

  if (sharedCfg) {
    var restoreTimer = setInterval(function () {
      var ready = FINISH_TYPES.every(function (t) { return selected(t); });
      var dias = diameterSelect();
      if ((ready && dias && dias.value) || document.querySelectorAll('.wheel-configurator__option').length > 0) {
        clearInterval(restoreTimer);
        setTimeout(function () { restoreOptions(sharedCfg); }, 200);
      }
    }, 300);
    setTimeout(function () { clearInterval(restoreTimer); }, 15000);
  }

  /* ── Specialist "Request a Quote" → Calder quote modal ──
     The quote modal is a standalone contact-form inquiry; it is not part
     of the wheel configurator's purchase controls. */
  var quoteTrigger = root.querySelector('[data-calder-quote-open]');
  if (quoteTrigger) {
    quoteTrigger.addEventListener('click', function (evt) {
      evt.preventDefault();
      var modal = document.getElementById('wheel-configurator-quote-' + sectionId);
      if (!modal) return;
      if (typeof jq_lumia !== 'undefined' && jq_lumia.fancybox) {
        jq_lumia.fancybox.open({ src: '#' + modal.id, type: 'inline' });
      } else {
        modal.style.display = 'block';
        modal.classList.add('is-open');
      }
    });
  }

  /* ── WHEEL DESIGN SELECTOR ── */
  var designRow = document.getElementById('cbp-design-row-' + sectionId);
  if (designRow) {
    var designChips = designRow.querySelectorAll('[data-byw-design]');

    designRow.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-byw-design]');
      if (!chip) return;
      var pid = chip.dataset.productId;
      var handle = chip.dataset.productHandle;
      var title = chip.dataset.productTitle;
      if (!pid) return;

      designChips.forEach(function (c) { c.classList.remove('cbp-config__design-chip--selected'); });
      chip.classList.add('cbp-config__design-chip--selected');

      var nameEl = document.getElementById('cbp-selected-name');
      if (nameEl) nameEl.textContent = title || '';

      var data = (window._bywProductData && window._bywProductData[pid]) || null;

      if (data) {
        window._calderProductData = window._calderProductData || {};
        window._calderProductData[pid] = data;
        window._calderProductComponents = data;
        if (data.design_code) window._calderDesignCode = data.design_code;
      }

      var wcEl = document.getElementById('wheel-configurator-' + sectionId);
      if (wcEl) {
        wcEl.dataset.productId = String(pid);
        if (handle) wcEl.dataset.productHandle = handle;
        if (data && window.__calderActiveConfigurator && typeof window.__calderActiveConfigurator.configure === 'function') {
          window.__calderActiveConfigurator.configure(data);
        } else if (typeof WheelConfigurator === 'function') {
          new WheelConfigurator(wcEl);
        }
      }
    });

    var firstChip = designRow.querySelector('[data-byw-design]');
    if (firstChip && firstChip.dataset.productId) {
      firstChip.classList.add('cbp-config__design-chip--selected');
    }
  }

})();
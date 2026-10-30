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
  var types = ['center', 'barrel', 'hardware'];

  function container(type) {
    return document.getElementById('configurator-' + type + 's-' + sectionId);
  }

  function selected(type) {
    var c = container(type);
    return c ? c.querySelector('.wheel-configurator__option--selected') : null;
  }

  function selectedImg(type) {
    var s = selected(type);
    return s ? s.querySelector('img') : null;
  }

  function getSelections() {
    var s = {};
    types.forEach(function (t) {
      var opt = selected(t);
      if (opt) s[t] = opt.dataset.componentId;
    });
    return s;
  }

  /* ── RESET ── */
  var resetBtn = document.getElementById('configurator-reset-' + sectionId);
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      types.forEach(function (t) {
        var c = container(t);
        if (!c) return;
        var first = c.querySelector('.wheel-configurator__option:not(.wheel-configurator__option--unavailable)');
        if (first) first.click();
      });
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

  /* ── SAVE BUILD (localStorage) ── */
  var saveBtn = document.getElementById('configurator-save-' + sectionId);
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var selections = getSelections();
      if (!selections.center || !selections.barrel || !selections.hardware) return;
      try {
        localStorage.setItem(
          'calder-config-' + productId,
          JSON.stringify({ selections: selections, saved: Date.now() })
        );
      } catch (e) {}
      saveBtn.innerHTML = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 12l2 2 4-4"/></svg><span>Build Saved</span>';
      setTimeout(function () {
        saveBtn.innerHTML = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v7a2 2 0 0 1-2 2zM13 17v-4H7v4M7 1v4"/></svg><span>Save Build</span>';
      }, 2000);
    });
  }

  /* ── SHARE BUILD ── */
  var shareBtn = document.getElementById('configurator-share-' + sectionId);
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var selections = getSelections();
      if (!selections.center || !selections.barrel || !selections.hardware) return;
      var cfg = btoa(JSON.stringify(selections));
      var shareUrl = window.location.href.split('#')[0] + '#cfg=' + cfg;
      if (navigator.share) {
        navigator.share({ title: document.title, text: 'Check out my custom wheel build!', url: shareUrl }).catch(function () {});
        return;
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(function () {
          shareBtn.innerHTML = '<span>Link Copied</span>';
          setTimeout(function () {
            shareBtn.innerHTML = '<svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="10" r="2.5"/><circle cx="14" cy="4" r="2.5"/><circle cx="14" cy="16" r="2.5"/><path d="M8.5 11.5l5 2M8.5 8.5l5-2"/></svg><span>Share Build</span>';
          }, 2000);
        }).catch(function () {});
      } else {
        var mailto = 'mailto:?subject=' + encodeURIComponent(document.title) + '&body=' + encodeURIComponent('Check out my custom wheel build: ' + shareUrl);
        window.location.href = mailto;
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
    return data;
  }

  function restoreOptions(data) {
    types.forEach(function (t) {
      var id = data[t];
      if (!id) return;
      var c = container(t);
      if (!c) return;
      var opt = c.querySelector('[data-component-id="' + id + '"]:not(.wheel-configurator__option--unavailable)');
      if (opt) opt.click();
    });
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
      var ready = types.every(function (t) { return selected(t); });
      if (ready || document.querySelectorAll('.wheel-configurator__option').length > 0) {
        clearInterval(restoreTimer);
        setTimeout(function () { restoreOptions(sharedCfg); }, 200);
      }
    }, 300);
    setTimeout(function () { clearInterval(restoreTimer); }, 15000);
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

      if (window._bywProductData && window._bywProductData[pid]) {
        window._calderProductComponents = window._bywProductData[pid];
      }

      var wcEl = document.getElementById('wheel-configurator-' + sectionId);
      if (wcEl) {
        wcEl.dataset.productId = String(pid);
        if (typeof WheelConfigurator === 'function') {
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
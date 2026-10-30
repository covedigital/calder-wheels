(function () {
  var FINISH_TYPES = ['center', 'barrel', 'hardware'];
  var CONFIG_TYPES = ['center', 'barrel', 'hardware'];
  var ALL_TYPES = ['diameter', 'center', 'barrel', 'hardware'];
  var SUMMARY_KEYS = { diameter: 'Diameter', center: 'Center Finish', barrel: 'Barrel & Lip', hardware: 'Hardware & Rivet Finish' };

  function normalize(s) { return String(s == null ? '' : s).trim().toLowerCase(); }
  function slugify(s) { return normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function WheelConfigurator(containerEl) {
    this.el = containerEl;
    this.sectionId = containerEl.dataset.sectionId;
    this.productId = containerEl.dataset.productId;
    this.productHandle = containerEl.dataset.productHandle || this.productId;
    this.canvas = document.getElementById('configurator-canvas-' + this.sectionId);
    this.selected = { diameter: null, center: null, barrel: null, hardware: null };
    this.components = { diameter: [], center: [], barrel: [], hardware: [] };
    this.variantsData = [];
    this.hardwareOptions = [];
    this.defaultHardware = '';
    this.images = {};
    this.currentPrice = null;
    this.currentVariantId = null;
    this.currentAvailability = null;
    this._availSeq = 0;
    this._addingToCart = false;
    this._lastPushedVariantId = null;
    this._matchedProductHandle = null;
    this._matchedDesignCode = '';
    this._qtyListenerBound = false;

    if (!this.canvas) return;

    this.loadingEl = this.canvas.querySelector('.wheel-configurator__preview-loading');
    this.layersEl = this.canvas.querySelector('.wheel-configurator__preview-layers');
    this.layerImgs = {
      center: this.canvas.querySelector('.wheel-configurator__layer--center'),
      barrel: this.canvas.querySelector('.wheel-configurator__layer--barrel'),
      hardware: this.canvas.querySelector('.wheel-configurator__layer--hardware')
    };

    this.diameterSelect = this.el.querySelector('[data-component="diameter"]');
    this.availabilityEl = document.getElementById('configurator-availability-' + this.sectionId);
    this.actionsEl = this.canvas.closest('.wheel-configurator').querySelector('.wheel-configurator__actions');
    this.addBtn = document.getElementById('configurator-add-' + this.sectionId);
    this.quoteBtn = document.getElementById('configurator-quote-' + this.sectionId);
    this.summaryEl = document.getElementById('configurator-summary-' + this.sectionId);
    this.priceEl = document.getElementById('configurator-summary-price');
    this.syncPdpVariant = true;
    this._diamBound = false;
    this._pdpListenerBound = false;

    /* Reference to the PDP section for bidirectional sync */
    this.pdpSection = document.getElementById('CalderProduct-' + this.sectionId) ||
                      document.querySelector('.calder-pdp');

    window.__calderActiveConfigurator = this;

    this.init();
  }

  WheelConfigurator.prototype.init = function () {
    this.loadingEl.style.display = 'block';
    this.layersEl.style.display = 'none';
    if (this.actionsEl) this.actionsEl.style.display = 'none';
    if (this.summaryEl) this.summaryEl.style.display = 'none';
    if (this.availabilityEl) this.availabilityEl.style.display = 'none';

    if (window.ConfiguratorAPI && window.ConfiguratorAPI.loadComponents) {
      var self = this;
      window.ConfiguratorAPI.loadComponents(this.productHandle, this.sectionId, function (data) {
        self.handleComponentsData(data);
      });
    } else {
      this.loadComponentsFallback();
    }
  };

  WheelConfigurator.prototype.loadComponentsFallback = function () {
    var self = this;
    var url = '/products/' + this.productHandle + '.js';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          self.handleComponentsData({ components: buildComponentsFromProduct(JSON.parse(xhr.responseText)).components, product: JSON.parse(xhr.responseText) });
          return;
        } catch (e) {}
      }
      self.handleComponentsData(null);
    };
    xhr.onerror = function () { self.handleComponentsData(null); };
    xhr.send();
  };

  /* ── Data ingestion ── */
  WheelConfigurator.prototype.setProductData = function (data) {
    if (!data) return;
    if (data.product_id != null) this.productId = String(data.product_id);
    if (data.product_handle) this.productHandle = data.product_handle;
    if (this.el) {
      if (data.product_id != null) this.el.dataset.productId = String(data.product_id);
      if (data.product_handle) this.el.dataset.productHandle = data.product_handle;
    }
    if (data.design_code) window._calderDesignCode = data.design_code;

    this.components = data.components || { diameter: [], center: [], barrel: [], hardware: [] };
    this.variantsData = data.variants || [];
    this.hardwareOptions = data.hardware_options || [];
    this.defaultHardware = data.default_hardware || (this.hardwareOptions.length ? this.hardwareOptions[0] : '');

    this.currentVariantId = null;
    this.currentAvailability = null;
    this.currentPrice = null;
    this._lastPushedVariantId = null;
    this.selected = { diameter: null, center: null, barrel: null, hardware: null };
  };

  WheelConfigurator.prototype.handleComponentsData = function (data) {
    this.loadingEl.style.display = 'none';
    this.layersEl.style.display = 'flex';

    if (data && data.product) {
      this.setProductData(data.product);
    } else if (data && data.components) {
      this.setProductData({
        product_id: this.productId,
        product_handle: this.productHandle,
        components: data.components,
        variants: data.variants || [],
        hardware_options: (data.product && data.product.hardware_options) || []
      });
    }

    this.renderDiameterOptions();
    for (var i = 0; i < FINISH_TYPES.length; i++) {
      this.renderOptions(FINISH_TYPES[i]);
    }
    this.bindDiameter();

    this.initSelections();

    this.showActions();
    this.listenForPdpChanges();
    this.checkAvailability();
  };

  WheelConfigurator.prototype.configure = function (data) {
    /* Standalone builder design switch — swaps the whole product identity
       and resets ALL state (never reuses the previous product's variants). */
    if (!data) return;
    this.setProductData(data);
    FINISH_TYPES.forEach(function (type) {
      var layer = this.layerImgs[type];
      if (layer) { layer.removeAttribute('src'); layer.style.display = 'none'; }
    }, this);
    this._availSeq += 1;

    this.renderDiameterOptions();
    this.renderOptions('center');
    this.renderOptions('barrel');
    this.renderOptions('hardware');
    this.bindDiameter();

    this.initSelections();

    this.showActions();
    this.listenForPdpChanges();
    this.checkAvailability();
  };

  /* ── Diameter control (select) ── */
  WheelConfigurator.prototype.renderDiameterOptions = function () {
    if (!this.diameterSelect) return;
    var items = this.components.diameter || [];
    if (!items.length) return;
    var html = '';
    for (var i = 0; i < items.length; i++) {
      html += '<option value="' + escAttr(items[i].label) + '" data-id="' + escAttr(items[i].id) + '">' + escAttr(items[i].label) + '</option>';
    }
    this.diameterSelect.innerHTML = html;
    this.diameterSelect.disabled = false;
  };

  WheelConfigurator.prototype.bindDiameter = function () {
    if (!this.diameterSelect) return;
    if (this._diamBound) return;
    this._diamBound = true;
    var self = this;
    this.diameterSelect.addEventListener('change', function () {
      var opt = self.diameterSelect.selectedOptions[0];
      self.setSelected('diameter', opt ? { id: opt.dataset.id || opt.value, label: opt.text.trim() } : null);
      self.updatePreview('diameter');
      self.updateSummary();
      self.checkAvailability();
      self.syncToPdpOption('diameter');
    });
  };

  /* ── Finish chip groups ── */
  WheelConfigurator.prototype.renderOptions = function (type) {
    var container = document.getElementById('configurator-' + type + 's-' + this.sectionId);
    if (!container) return;

    var items = this.components[type] || [];
    if (items.length === 0) {
      container.innerHTML = '<p style="color:var(--text-color);opacity:0.5;font-size:0.85rem;">No ' + type + ' options available</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < items.length; i++) {
      html += this.renderOptionHtml(items[i]);
    }

    container.innerHTML = html;
    container.dataset.loaded = 'true';
    this.bindOptionClicks(container, type);
  };

  WheelConfigurator.prototype.renderOptionHtml = function (item) {
    var cls = 'wheel-configurator__option';
    if (!item.available) cls += ' wheel-configurator__option--unavailable';
    var label = item.label || item.finish || item.title || '';
    return '<div class="' + cls + '" data-component-id="' + escAttr(item.id) + '" data-component-type="' + escAttr(item.type) + '" ' + (!item.available ? 'title="Out of Stock"' : '') + '>' +
      '<img src="' + escAttr(item.swatch_image || item.image || '') + '" alt="' + escAttr(label) + '" loading="lazy">' +
      '<span class="wheel-configurator__stock-badge" data-stock-badge hidden></span>' +
      (label ? '<span class="wheel-configurator__option-label">' + escAttr(label) + '</span>' : '') +
      '</div>';
  };

  WheelConfigurator.prototype.bindOptionClicks = function (container, type) {
    var self = this;
    var options = container.querySelectorAll('.wheel-configurator__option:not(.wheel-configurator__option--unavailable)');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function () {
        var t = this.dataset.componentType || type;
        var img = this.querySelector('img');

        container.querySelectorAll('.wheel-configurator__option--selected').forEach(function (el) {
          el.classList.remove('wheel-configurator__option--selected');
        });
        this.classList.add('wheel-configurator__option--selected');

        var component = (self.components[t] || []).find(function (c) { return String(c.id) === String(this.dataset.componentId); }, this);
        self.setSelected(t, { id: this.dataset.componentId, image: component ? component.image : '', swatch_image: component ? component.swatch_image : '', label: img ? img.alt : this.dataset.componentId });
        self.updatePreview(t);
        self.updateSummary();
        self.updatePrice(self.currentPrice);
        self.checkAvailability();
        self.syncToPdpOption(t);
      });
    }
  };

  WheelConfigurator.prototype.setSelected = function (type, sel) {
    if (type === 'diameter') {
      this.selected.diameter = sel ? { id: sel.id, label: sel.label } : null;
      if (this.diameterSelect) {
        var i, targetVal = sel ? sel.label : '';
        for (i = 0; i < this.diameterSelect.options.length; i++) {
          if (this.diameterSelect.options[i].value === targetVal || this.diameterSelect.options[i].dataset.id === (sel ? sel.id : '')) {
            this.diameterSelect.selectedIndex = i;
            break;
          }
        }
      }
      return;
    }
    if (sel && sel.label == null && sel.id != null) sel.label = sel.id;
    this.selected[type] = sel;
    this.updateChipSelection(type);
  };

  WheelConfigurator.prototype.updateChipSelection = function (type) {
    var container = document.getElementById('configurator-' + type + 's-' + this.sectionId);
    if (!container) return;
    var sel = this.selected[type];
    var found = false;
    var opts = container.querySelectorAll('.wheel-configurator__option');
    for (var i = 0; i < opts.length; i++) {
      var img = opts[i].querySelector('img');
      var id = opts[i].dataset.componentId || '';
      var label = img ? img.alt : '';
      var match = false;
      if (sel) {
        match = (id && sel.id && String(id).toLowerCase() === String(sel.id).toLowerCase()) ||
                (label && sel.label && normalize(label) === normalize(sel.label));
      }
      opts[i].classList.toggle('wheel-configurator__option--selected', match);
      if (match) found = true;
    }
    /* Only default-highlight when nothing is selected yet; an unmatched
       explicit label must not silently highlight a different chip. */
    if (!found && !sel && opts.length) {
      var first = container.querySelector('.wheel-configurator__option:not(.wheel-configurator__option--unavailable)') || opts[0];
      first.classList.add('wheel-configurator__option--selected');
    }
  };

  /* ── QuickBooks component stock badges ──
     Each finish chip shows whether QuickBooks can cover the requested
     quantity for that component. `components` comes from the availability
     response: { type: [{ label, part_number, on_hand, needed, ok }] }.
     Passing null clears every badge. */
  WheelConfigurator.prototype.applyStockBadges = function (components) {
    var self = this;
    FINISH_TYPES.forEach(function (type) {
      var container = document.getElementById('configurator-' + type + 's-' + self.sectionId);
      if (!container) return;
      var detail = components ? (components[type] || []) : null;
      var chips = container.querySelectorAll('.wheel-configurator__option');
      for (var i = 0; i < chips.length; i++) {
        var chip = chips[i];
        var badge = chip.querySelector('[data-stock-badge]');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'wheel-configurator__stock-badge';
          badge.setAttribute('data-stock-badge', '');
          chip.appendChild(badge);
        }
        var state = '';
        if (detail && detail.length) {
          var img = chip.querySelector('img');
          var labelEl = chip.querySelector('.wheel-configurator__option-label');
          var chipLabel = (img && img.alt) || (labelEl ? labelEl.textContent : '') || '';
          for (var j = 0; j < detail.length; j++) {
            if (normalize(detail[j].label) === normalize(chipLabel) && chipLabel) {
              state = detail[j].ok ? 'in' : 'out';
              break;
            }
          }
        }
        if (state) {
          badge.textContent = state === 'in' ? 'In Stock' : 'Out of Stock';
          badge.className = 'wheel-configurator__stock-badge wheel-configurator__stock-badge--' + state;
          badge.hidden = false;
        } else {
          badge.hidden = true;
        }
      }
    });

    /* Diameter is a native select — reflect the selected diameter's stock
       in a flag beside it. */
    var flag = document.getElementById('configurator-diameter-stock-' + this.sectionId);
    if (flag) {
      var diamDetail = components ? (components.diameter || []) : null;
      var selDiam = this.selected.diameter ? (this.selected.diameter.label || this.selected.diameter.id || '') : '';
      var diamState = '';
      if (diamDetail && selDiam) {
        for (var k = 0; k < diamDetail.length; k++) {
          if (normalize(diamDetail[k].label) === normalize(selDiam)) {
            diamState = diamDetail[k].ok ? 'in' : 'out';
            break;
          }
        }
      }
      if (diamState) {
        flag.textContent = diamState === 'in' ? 'In Stock' : 'Out of Stock';
        flag.className = 'wheel-configurator__stock-badge wheel-configurator__stock-badge--' + diamState + ' wheel-configurator__stock-badge--diameter';
        flag.hidden = false;
      } else {
        flag.hidden = true;
      }
    }
  };

  WheelConfigurator.prototype.updatePreview = function (type) {
    if (type === 'diameter') return;
    var layer = this.layerImgs[type];
    if (!layer) return;
    var selected = this.selected[type];
    // Keep all visual components in the original, aligned preview-layer stack.
    // Remove legacy finish badges created by previous theme revisions.
    if (this.canvas) {
      this.canvas.querySelectorAll('[data-calder-preview-finish]').forEach(function (badge) {
        badge.remove();
      });
    }
    // `image` is the full-size component artwork; `swatch_image` is only
    // for the selectable thumbnail. Never scale a finish swatch over a wheel.
    var url = selected && selected.image;
    if (!url) {
      layer.onload = null;
      layer.onerror = null;
      layer.removeAttribute('src');
      layer.style.display = 'none';
      if (selected) console.warn('[Calder Builder] Missing full-size ' + type + ' preview layer; finish swatch is not a compositing image:', selected);
      return;
    }
    layer.onload = function () { layer.style.display = 'block'; };
    layer.onerror = function () {
      console.warn('[Calder Builder] Preview layer failed to load:', url);
      layer.style.display = 'none';
      layer.removeAttribute('src');
    };
    layer.style.display = 'none';
    layer.src = url;
  };

  /* ── Selection initialization (URL variant first, defaults otherwise) ── */
  WheelConfigurator.prototype.initSelections = function () {
    if (this.applyPdpSelections()) {
      this.syncHardwareToPdp();
      this.refreshSelections();
      return;
    }
    this.applyDefaults();
    this.syncHardwareToPdp();
    this.refreshSelections();
  };

  WheelConfigurator.prototype.applyPdpSelections = function () {
    if (!this.pdpSection) return false;
    var pdpLabels = this.readPdpSelectionLabels();
    var diameterLabel = pdpLabels.diameter;
    var centerLabel = pdpLabels.center;
    var barrelLabel = pdpLabels.barrel;
    var hardwareLabel = pdpLabels.hardware || this.defaultHardware;

    var applied = false;
    var diameterItem = diameterLabel ? this.findComponentByLabel('diameter', diameterLabel) : null;
    if (diameterItem) { this.setSelected('diameter', { id: diameterItem.id, label: diameterItem.label }); applied = true; }
    else if (diameterLabel) { this.setSelected('diameter', { id: slugify(diameterLabel), label: diameterLabel }); applied = true; }

    var centerItem = centerLabel ? this.findComponentByLabel('center', centerLabel) : null;
    if (centerItem) { this.setSelected('center', { id: centerItem.id, image: centerItem.image, label: centerItem.label }); applied = true; }

    var barrelItem = barrelLabel ? this.findComponentByLabel('barrel', barrelLabel) : null;
    if (barrelItem) { this.setSelected('barrel', { id: barrelItem.id, image: barrelItem.image, swatch_image: barrelItem.swatch_image, label: barrelItem.label }); applied = true; }

    var hwItem = hardwareLabel ? this.findComponentByLabel('hardware', hardwareLabel) : null;
    if (hwItem) { this.setSelected('hardware', { id: hwItem.id, image: hwItem.image, swatch_image: hwItem.swatch_image, label: hwItem.label }); applied = true; }
    else if (hardwareLabel) { this.setSelected('hardware', { id: slugify(hardwareLabel), label: hardwareLabel }); applied = true; }

    /* Fill any finish group still unselected with its default when the
       PDP selection cannot be resolved from this product's data. */
    for (var i = 0; i < FINISH_TYPES.length; i++) {
      if (!this.selected[FINISH_TYPES[i]]) this.selectDefaultFor(FINISH_TYPES[i]);
    }
    if (!this.selected.diameter) this.selectDefaultFor('diameter');
    return applied;
  };

  WheelConfigurator.prototype.readPdpSelectionLabels = function () {
    var out = {};
    var picker = this.pdpSection.querySelector('variant-selects') || this.pdpSection.querySelector('variant-radios');
    if (picker) {
      var selects = picker.querySelectorAll('select');
      if (selects.length) {
        selects.forEach(function (s) {
          var name = (s.name || '').toLowerCase();
          var val = s.value ? s.value.trim() : '';
          if (name.indexOf('diameter') !== -1) out.diameter = val;
          else if (name.indexOf('center') !== -1) out.center = val;
          else if (name.indexOf('barrel') !== -1) out.barrel = val;
        });
      } else {
        var fieldsets = picker.querySelectorAll('fieldset');
        fieldsets.forEach(function (fs) {
          var checked = fs.querySelector('input:checked');
          if (!checked) return;
          var val = checked.value.trim() || '';
          if (!val) return;
          if (!out.diameter) out.diameter = val;
          else if (!out.center) out.center = val;
          else if (!out.barrel) out.barrel = val;
        });
      }
    }

    var diamGroup = this.pdpSection.querySelector('[data-calder-diameter]');
    if (diamGroup) {
      var selectedPill = diamGroup.querySelector('[data-calder-diameter-option].is-selected');
      if (selectedPill) out.diameter = selectedPill.dataset.value || selectedPill.textContent.trim();
    }

    ['center', 'barrel', 'hardware'].forEach(function (type) {
      if (out[type]) return;
      var group = this.pdpSection.querySelector('[data-calder-finishes="' + type + '"]');
      if (group) {
        var selected = group.querySelector('[data-calder-finish].is-selected');
        if (selected) out[type] = selected.dataset.value;
      }
    }, this);

    var barrelPalette = this.pdpSection.querySelector('.calder-pdp__cross-product-barrel .is-selected');
    if (barrelPalette) out.barrel = barrelPalette.dataset.value;
    var hwRivetSelect = this.pdpSection.querySelector('[data-calder-hardware-rivet]');
    if (hwRivetSelect && hwRivetSelect.value) out.hardware = hwRivetSelect.value.trim();

    var activeId = this.currentPdpVariantId();
    if ((!out.diameter || !out.center || !out.barrel) && activeId && this.variantsData.length) {
      for (var i = 0; i < this.variantsData.length; i++) {
        var v = this.variantsData[i];
        if (String(v.id) === String(activeId)) {
          if (!out.diameter && v.option1) out.diameter = String(v.option1).trim();
          if (!out.center && v.option2) out.center = String(v.option2).trim();
          if (!out.barrel && v.option3) out.barrel = String(v.option3).trim();
          break;
        }
      }
    }
    return out;
  };

  WheelConfigurator.prototype.currentPdpVariantId = function () {
    if (!this.pdpSection) return null;
    var input = this.pdpSection.querySelector('input[name="id"]');
    return input ? (input.value || null) : null;
  };

  WheelConfigurator.prototype.findComponentByLabel = function (type, label) {
    var list = this.components[type] || [];
    var target = normalize(label);
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      if (normalize(it.label || it.name || it.id || '') === target || normalize(it.id) === target) return it;
    }
    return null;
  };

  WheelConfigurator.prototype.selectDefaultFor = function (type) {
    if (type === 'diameter') {
      var di = (this.components.diameter || [])[0];
      if (di) this.setSelected('diameter', { id: di.id, label: di.label });
      return;
    }
    var list = this.components[type] || [];
    if (type === 'hardware' && this.defaultHardware) {
      var preset = this.findComponentByLabel(type, this.defaultHardware);
      if (preset) { this.setSelected(type, {id:preset.id, image:preset.image, swatch_image:preset.swatch_image, label:preset.label}); return; }
    }
    var item = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].available) { item = list[i]; break; }
    }
    if (!item) item = list[0];
    if (item) this.setSelected(type, { id: item.id, image: item.image, swatch_image: item.swatch_image, label: item.label });
  };

  WheelConfigurator.prototype.applyDefaults = function () {
    if (!this.selected.diameter) this.selectDefaultFor('diameter');
    for (var i = 0; i < FINISH_TYPES.length; i++) {
      if (!this.selected[FINISH_TYPES[i]]) this.selectDefaultFor(FINISH_TYPES[i]);
    }
    if (!this.selected.hardware && this.defaultHardware) {
      var hwItem = this.findComponentByLabel('hardware', this.defaultHardware);
      if (hwItem) this.setSelected('hardware', { id: hwItem.id, image: hwItem.image, swatch_image: hwItem.swatch_image, label: hwItem.label });
    }
  };

  WheelConfigurator.prototype.refreshSelections = function () {
    for (var i = 0; i < FINISH_TYPES.length; i++) {
      this.updatePreview(FINISH_TYPES[i]);
    }
    this.updateSummary();
    this.updatePrice(this.currentPrice);
    this.checkAvailability();
  };

  WheelConfigurator.prototype.getLabel = function (type) {
    return this.selected[type] ? (this.selected[type].label || this.selected[type].id || '') : '';
  };

  WheelConfigurator.prototype.isHardwareAllowed = function () {
    var label = normalize(this.getLabel('hardware'));
    if (!label) return false;
    if (this.hardwareOptions.length) {
      for (var i = 0; i < this.hardwareOptions.length; i++) {
        if (normalize(this.hardwareOptions[i]) === label) return true;
      }
      return false;
    }
    var comps = this.components.hardware || [];
    for (var j = 0; j < comps.length; j++) {
      if (normalize(comps[j].label || comps[j].name || comps[j].id || '') === label) return true;
    }
    return false;
  };

  /* ── Summary ── */
  WheelConfigurator.prototype.updateSummary = function () {
    if (!this.summaryEl) return;

    var allSelected = true;
    for (var t in SUMMARY_KEYS) {
      var el = document.getElementById('configurator-summary-' + t);
      if (el) {
        el.textContent = this.selected[t] ? (this.selected[t].label || this.selected[t].id) : '\u2014';
        if (!this.selected[t]) allSelected = false;
      }
    }

    this.summaryEl.style.display = allSelected ? 'flex' : 'none';
  };

  WheelConfigurator.prototype.configSummaryText = function () {
    return 'Diameter: ' + (this.selected.diameter ? (this.selected.diameter.label || this.selected.diameter.id) : '\u2014') +
      ', Center: ' + (this.selected.center ? (this.selected.center.label || this.selected.center.id) : '\u2014') +
      ', Barrel: ' + (this.selected.barrel ? (this.selected.barrel.label || this.selected.barrel.id) : '\u2014') +
      ', Hardware: ' + (this.selected.hardware ? (this.selected.hardware.label || this.selected.hardware.id) : '\u2014');
  };

  /* ── Availability (with stale-response guard) ── */
  WheelConfigurator.prototype.checkAvailability = function () {
    var self = this;
    this._matchedProductHandle = null;
    this._matchedDesignCode = '';
    this.updatePrimaryActionLabel();
    var allSelected = !!(this.selected.diameter && this.selected.center && this.selected.barrel && this.selected.hardware);

    if (!allSelected) {
      this._availSeq += 1;
      if (this.availabilityEl) this.availabilityEl.style.display = 'none';
      this.currentAvailability = null;
      this.disablePurchase('incomplete');
      return;
    }

    this._availSeq += 1;
    var seq = this._availSeq;

    if (this.availabilityEl) {
      this.availabilityEl.style.display = 'block';
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--partial';
      this.availabilityEl.innerHTML = 'Checking availability...';
    }
    this.disablePurchase('checking');

    if (window.ConfiguratorAPI && window.ConfiguratorAPI.resolveCatalog) {
      var catalogResult = window.ConfiguratorAPI.resolveCatalog(
        this.productHandle, this.selected.diameter, this.selected.center, this.selected.barrel, this.selected.hardware
      );
      if (catalogResult.status !== 'catalog-missing' && catalogResult.status !== 'fitment-unknown') {
        if (seq === this._availSeq) {
          /* QuickBooks component inventory gates every purchasable match:
             the shopper needs enough of every component (diameter blank,
             center, barrel/lip, hardware) to cover the requested quantity. */
          var catalogQty = this.captureQuantity();
          var compGate = (catalogResult.status === 'available' || catalogResult.status === 'other-product')
            ? this.checkComponentInventory(catalogQty)
            : null;
          if (compGate && (!compGate.known || compGate.available_to_build < catalogQty)) {
            this.handleAvailabilityData({
              status: 'no-stock', supported: true,
              available_to_build: compGate.available_to_build,
              requested_quantity: catalogQty,
              components: compGate.components,
              variant_id: catalogResult.variant_id,
              price: catalogResult.price,
              product_handle: catalogResult.product_handle,
              design_code: catalogResult.design_code
            });
            return;
          }
          if (compGate && compGate.known) {
            catalogResult.components = compGate.components;
            catalogResult.requested_quantity = catalogQty;
          }
          this.handleAvailabilityData(catalogResult);
        }
        return;
      }
      // No usable catalog for this product (missing collection, or a handle
      // without the fitment-key segment): fall through to the per-product
      // availability check instead of erroring. Never claim that
      // other-product configurations are unavailable.
    }
    if (window.ConfiguratorAPI && window.ConfiguratorAPI.checkAvailability) {
      window.ConfiguratorAPI.checkAvailability(
        this.productHandle,
        this.selected.center,
        this.selected.barrel,
        this.selected.hardware,
        this.selected.diameter,
        this.sectionId,
        function (data) { if (seq === self._availSeq) self.handleAvailabilityData(data); },
        this.captureQuantity()
      );
    } else {
      this.checkAvailabilityFallback(seq);
    }
  };

  /* QuickBooks component availability for the current selection and
     quantity. Returns null when no inventory connection is loaded — the
     storefront then relies on Shopify variant availability alone. */
  WheelConfigurator.prototype.checkComponentInventory = function (qty) {
    if (!window._calderDemoInventory || typeof window._calderDemoInventory.getAvailabilityStatus !== 'function') return null;
    var sel = this.selected;
    if (!(sel && sel.diameter && sel.center && sel.barrel && sel.hardware)) return null;
    return window._calderDemoInventory.getAvailabilityStatus(
      this.productHandle, sel.diameter, sel.center, sel.barrel, sel.hardware, qty
    ) || null;
  };

  WheelConfigurator.prototype.checkAvailabilityFallback = function (seq) {
    var self = this;
    var finish = function (extra) {
      var out = {
        status: 'checking', supported: true, available_to_build: 0, demo_unknown: false,
        variant_id: null, price: null, lead_time: '5-10 business days'
      };
      for (var k in extra) out[k] = extra[k];
      return out;
    };

    var resolveLocal = function (variants) {
      if (!window.ConfiguratorAPI || !window.ConfiguratorAPI.resolveExact) return null;
      return window.ConfiguratorAPI.resolveExact(variants, self.selected.diameter, self.selected.center, self.selected.barrel);
    };

    var run = function (variants) {
      if (!variants) {
        if (seq === self._availSeq) self.handleAvailabilityData(finish({ status: 'error' }));
        return;
      }
      var res = resolveLocal(variants);
      if (!res) {
        if (seq === self._availSeq) self.handleAvailabilityData(finish({ status: 'error' }));
        return;
      }
      var out = finish({});
      if (res.status === 'unsupported' || res.status === 'no-variants' || res.status === 'no-selection') {
        out.status = 'unsupported'; out.supported = true; out.available_to_build = 0;
      } else if (res.status === 'no-stock' || !res.variant.available) {
        out.status = 'no-stock'; out.available_to_build = 0; out.variant_id = res.variant_id; out.price = res.variant.price;
      } else {
        out.status = 'available'; out.available_to_build = 1; out.variant_id = res.variant_id; out.price = res.variant.price;
      }
      if (out.status === 'available' && window._calderDemoInventory && typeof window._calderDemoInventory.getAvailabilityStatus === 'function') {
        var demoQty = self.captureQuantity();
        var demo = window._calderDemoInventory.getAvailabilityStatus(self.productHandle, self.selected.diameter, self.selected.center, self.selected.barrel, self.selected.hardware, demoQty);
        if (demo && demo.known) {
          out.available_to_build = Math.max(0, demo.available_to_build);
          out.requested_quantity = demoQty;
          out.components = demo.components;
          if (out.available_to_build < demoQty) out.status = 'no-stock';
        } else if (demo) {
          /* A component without a QuickBooks part cannot be verified —
             quantity is the only purchase gate. */
          out.status = 'no-stock';
          out.components = demo.components;
          out.requested_quantity = demoQty;
        }
      }
      if (seq === self._availSeq) self.handleAvailabilityData(out);
    };

    if (this.variantsData.length) { run(this.variantsData); return; }

    var url = '/products/' + this.productHandle + '.js';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        try { run(JSON.parse(xhr.responseText).variants); return; } catch (e) {}
      }
      run(null);
    };
    xhr.onerror = function () { run(null); };
    xhr.send();
  };

  WheelConfigurator.prototype.handleAvailabilityData = function (data) {
    if (!this.availabilityEl) return;

    this.availabilityEl.style.display = 'block';
    this.currentAvailability = data || null;

    var status = data ? data.status : 'error';
    var isSupported = data ? data.supported !== false : true;

    this._matchedProductHandle = null;
    this._matchedDesignCode = '';
    if (status === 'other-product' && data.variant_id && data.product_handle) {
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--available';
      this.availabilityEl.textContent = 'This configuration is available on another Calder product.';
      this._matchedProductHandle = data.product_handle;
      this._matchedDesignCode = data.design_code || '';
      this.currentVariantId = data.variant_id;
      this.currentPrice = data.price;
      this.updatePrice(data.price);
      if (this.addBtn) { this.addBtn.disabled = false; this.addBtn.dataset.reason = ''; }
      this.setAddAction();
      this.updatePrimaryActionLabel();
      this.applyStockBadges(data.components || null);
      return;
    }
    this.updatePrimaryActionLabel();
    if (status === 'unsupported' || !isSupported) {
      /* The combination cannot be resolved to a purchasable product.
         Under the Calder catalog model every variant/component combination
         exists, so this can only mean it cannot be built right now. */
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--unavailable';
      this.availabilityEl.innerHTML = 'This exact combination isn\u2019t in stock - please speak to a support rep (305) 555-1234.';
      this.currentVariantId = null;
      this.currentPrice = null;
      this.updatePrice(null);
      this.applyStockBadges(null);
      this.disablePurchase('out-of-stock');
      return;
    }

    if (status === 'no-stock') {
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--unavailable';
      this.availabilityEl.innerHTML = 'This exact combination isn\u2019t in stock - please speak to a support rep (305) 555-1234.';
      this.currentVariantId = null;
      this.currentPrice = null;
      this.updatePrice(null);
      this.applyStockBadges(data ? (data.components || null) : null);
      this.disablePurchase('out-of-stock');
      return;
    }

    if (status === 'available' && data.variant_id) {
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--available';
      if (data.demo_unknown) {
        this.availabilityEl.innerHTML = 'Available to order \u2022 Ships in ' + (data.lead_time || '5-10 business days');
      } else if (data.available_to_build > 0) {
        this.availabilityEl.innerHTML = data.available_to_build + ' available to build \u2022 Ships in ' + (data.lead_time || '5-10 business days');
      } else {
        this.availabilityEl.innerHTML = 'Available to order (build-to-order) \u2022 Ships in ' + (data.lead_time || '5-10 business days');
      }
      this.currentVariantId = data.variant_id;
      this.currentPrice = data.price != null ? data.price : this.currentPrice;
      this.updatePrice(this.currentPrice);
      if (this.addBtn) { this.addBtn.disabled = false; this.addBtn.dataset.reason = ''; }
      if (this.quoteBtn) this.quoteBtn.disabled = false;
      this.setAddAction();
      this.updatePrimaryActionLabel();
      this.applyStockBadges(data.components || null);
      return;
    }

    if (status === 'error') {
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--unavailable';
      this.availabilityEl.innerHTML = 'We couldn\u2019t check availability right now. Please try again.';
      this.currentVariantId = null;
      this.currentPrice = null;
      this.updatePrice(null);
      this.applyStockBadges(null);
      this.disablePurchase('error');
      return;
    }

    this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--partial';
    this.availabilityEl.innerHTML = 'Checking availability...';
    this.disablePurchase('checking');
  };

  WheelConfigurator.prototype.disablePurchase = function (reason) {
    if (this.addBtn) {
      this.addBtn.disabled = true;
      this.addBtn.dataset.reason = reason || '';
    }
    if (this.quoteBtn) {
      this.quoteBtn.disabled = !(reason === 'build-to-order' || reason === 'not-supported' || reason === 'out-of-stock' || reason === 'error');
    }
    this.updatePrimaryActionLabel();
  };

  WheelConfigurator.prototype.updatePrimaryActionLabel = function () {
    if (!this.addBtn) return;
    var span = this.addBtn.querySelector('span');
    if (span) span.textContent = 'Add to Cart';
    else this.addBtn.textContent = 'Add to Cart';
  };

  WheelConfigurator.prototype.setAddAction = function () {
    if (!this.addBtn) return;
    if (this.addBtn._calderHandlerAttached) return;
    this.addBtn._calderHandlerAttached = true;
    var self = this;
    this.addBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      self.addToCart();
    });
  };

  /* ── Price (authoritative = resolved Shopify variant) ── */
  WheelConfigurator.prototype.updatePrice = function (price) {
    if (!this.priceEl) return;
    var minor = price != null ? price : this.currentPrice;
    if (minor == null) {
      this.priceEl.textContent = '\u2014';
      return;
    }
    this.priceEl.textContent = window.Shopify && window.Shopify.formatMoney
      ? window.Shopify.formatMoney(minor, window.themeMoneyFormat || '${{amount}}')
      : '$' + (Number(minor) / 100).toFixed(2);
  };

  WheelConfigurator.prototype.updateComponentPrice = function () {
    this.updatePrice(this.currentPrice);
  };

  WheelConfigurator.prototype.showActions = function () {
    if (this.actionsEl) this.actionsEl.style.display = 'flex';
  };

  WheelConfigurator.prototype.productTitleLabel = function () {
    var h1 = document.querySelector('h1');
    var t = (document.title || '').split(' \u2013 ')[0];
    return (t && t.length > 2) ? t : (h1 ? h1.textContent.trim() : '');
  };

  /* ── SYNC: Configurator → PDP ── */
  WheelConfigurator.prototype.syncToPdpOption = function (changedType) {
    if (!this.syncPdpVariant) return;
    if (!this.pdpSection) return;
    if (this._syncingFromPdp) return;

    this._syncingToPdp = true;

    var centerLabel = this.getLabel('center');
    var barrelLabel = this.getLabel('barrel');
    var hardwareLabel = this.getLabel('hardware');

    // Do not synchronize a different product's preset into the current PDP.
    // Catalog resolution includes hardware and fitment, unlike native variants.
    if (!window.ConfiguratorAPI || !window.ConfiguratorAPI.resolveCatalog) {
      this._syncingToPdp = false; return;
    }
    var match = window.ConfiguratorAPI.resolveCatalog(
      this.productHandle, this.selected.diameter, this.selected.center,
      this.selected.barrel, this.selected.hardware
    );
    if (!match || match.status !== 'available' || match.product_handle !== this.productHandle) {
      this._syncingToPdp = false; return;
    }

    this.syncDiameterToPdp();
    this.updatePdpFinishChips('center', centerLabel, true);
    this.updatePdpFinishChips('barrel', barrelLabel, true);
    this.updatePdpFinishChips('hardware', hardwareLabel, true);
    this.syncHardwareToPdp();

var variants = this.getPdpVariants();
    if (!variants || !variants.length) { this._syncingToPdp = false; return; }
    if (!window.ConfiguratorAPI || !window.ConfiguratorAPI.resolveExact) { this._syncingToPdp = false; return; }

    var res;
    try {
      res = window.ConfiguratorAPI.resolveExact(variants, this.selected.diameter, this.selected.center, this.selected.barrel);
    } catch (e) { this._syncingToPdp = false; return; }
    if (!res || (res.status !== 'available' && res.status !== 'unavailable') || !res.variant) { this._syncingToPdp = false; return; }

    var vid = String(res.variant.id);
    if (this._lastPushedVariantId === vid) { this._syncingToPdp = false; return; }
    this._lastPushedVariantId = vid;

    var picker = this.pdpSection.querySelector('variant-selects') || this.pdpSection.querySelector('variant-radios');
    if (!picker) { this._syncingToPdp = false; return; }

    var ok = this.setNativePicker(picker, res.variant);
    if (ok) {
      try {
        picker.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}
    }
    this._syncingToPdp = false;
  };

  WheelConfigurator.prototype.getPdpVariants = function () {
    var json = this.pdpSection.querySelector('[data-calder-product-json]');
    if (json) {
      try {
        var parsed = JSON.parse(json.textContent);
        if (parsed && parsed.length) return parsed;
      } catch (e) {}
    }
    return this.variantsData && this.variantsData.length ? this.variantsData : null;
  };

  WheelConfigurator.prototype.setNativePicker = function (picker, variant) {
    var selects = picker.querySelectorAll('select');
    var opts = variant.options || [variant.option1, variant.option2, variant.option3];
    if (selects.length) {
      for (var i = 0; i < selects.length; i++) {
        var val = opts[i];
        for (var j = 0; j < selects[i].options.length; j++) {
          if (selects[i].options[j].value === val) {
            selects[i].selectedIndex = j;
            break;
          }
        }
        if (selects[i].selectedIndex === -1) return false;
      }
      return true;
    }

    var radios = picker.querySelectorAll('input[type="radio"]');
    if (radios.length) {
      var groups = {};
      radios.forEach(function (input) {
        var key = input.name || 'g';
        (groups[key] = groups[key] || []).push(input);
      });
      for (var g in groups) {
        if (!Object.prototype.hasOwnProperty.call(groups, g)) continue;
        var gIndex = Object.keys(groups).indexOf(g);
        var val2 = variant.options[gIndex];
        var matched = false;
        groups[g].forEach(function (input) {
          if (input.value === val2 && !matched) { input.checked = true; groupedSwatch(input); matched = true; }
        });
        if (!matched) return false;
      }
      return true;
    }
    return false;
  };

  function groupedSwatch(input) {
    var label = input.closest('label');
    var group = input.closest('fieldset');
    if (group) group.querySelectorAll('label').forEach(function (l) { l.classList.remove('swatch-active'); });
    if (label) label.classList.add('swatch-active');
  }

  WheelConfigurator.prototype.syncHardwareToPdp = function () {
    if (!this.pdpSection) return;
    var hwLabel = this.getLabel('hardware');
    if (!hwLabel) return;

    var select = this.pdpSection.querySelector('[data-calder-hardware-rivet]');
    if (select) {
      var found = false;
      for (var i = 0; i < select.options.length; i++) {
        if (normalize(select.options[i].value) === normalize(hwLabel)) {
          select.value = select.options[i].value;
          found = true;
          break;
        }
      }
      if (!found) select.value = hwLabel;
    }
    var prop = this.pdpSection.querySelector('[data-calder-hw-rivet-property]');
    if (prop) prop.value = hwLabel;
  };

  WheelConfigurator.prototype.updatePdpFinishChips = function (type, label, silent) {
    if (!this.pdpSection) return;
    var group = this.pdpSection.querySelector('[data-calder-finishes="' + type + '"]');
    if (!group) return;
    var chips = group.querySelectorAll('[data-calder-finish]');
    if (!chips.length) return;
    for (var i = 0; i < chips.length; i++) {
      var chipVal = (chips[i].dataset.value || chips[i].textContent).trim().toLowerCase();
      if (chipVal === label.toLowerCase()) {
        chips.forEach(function (c) { c.classList.remove('is-selected'); c.setAttribute('aria-pressed', 'false'); });
        chips[i].classList.add('is-selected');
        chips[i].setAttribute('aria-pressed', 'true');
        break;
      }
    }
  };

  WheelConfigurator.prototype.syncDiameterToPdp = function () {
    if (!this.pdpSection) return;
    var group = this.pdpSection.querySelector('[data-calder-diameter]');
    if (!group) return;
    var label = this.getLabel('diameter');
    if (!label) return;
    var pills = group.querySelectorAll('[data-calder-diameter-option]');
    for (var i = 0; i < pills.length; i++) {
      var pillVal = (pills[i].dataset.value || pills[i].textContent).trim().toLowerCase();
      if (pillVal === label.toLowerCase()) {
        pills.forEach(function (p) { p.classList.remove('is-selected'); p.setAttribute('aria-pressed', 'false'); });
        pills[i].classList.add('is-selected');
        pills[i].setAttribute('aria-pressed', 'true');
        break;
      }
    }
  };

  /* ── SYNC: PDP → Configurator ── */
  WheelConfigurator.prototype.listenForPdpChanges = function () {
    if (!this.pdpSection) return;
    if (this._pdpListenerBound) return;
    this._pdpListenerBound = true;
    var self = this;

    this.pdpSection.addEventListener('calder:pdp-variant-change', function (event) {
      if (!event.detail) return;
      if (self._syncingToPdp) return;
      self._syncingFromPdp = true;
      self.syncPdpVariant = false;
      try {
        self.applyExternalSelections(event.detail);
        self.syncHardwareToPdp();
        self.refreshSelections();
      } finally {
        self.syncPdpVariant = true;
        self._syncingFromPdp = false;
      }
    });

    /* QuickBooks component availability depends on the requested quantity:
       re-run the check (and stock badges) whenever it changes. */
    var qtyInput = this.pdpSection.querySelector('[data-calder-qty-input]');
    if (qtyInput && !this._qtyListenerBound) {
      this._qtyListenerBound = true;
      qtyInput.addEventListener('change', function () { self.checkAvailability(); });
      qtyInput.addEventListener('input', function () { self.checkAvailability(); });
    }
  };

  WheelConfigurator.prototype.applyExternalSelections = function (detail) {
    var diameterLabel = detail.diameter || detail.option1 || '';
    var centerLabel = detail.center || detail.option2 || '';
    var barrelLabel = detail.barrel || detail.option3 || '';
    var hardwareLabel = detail.hardware || detail.hardware_rivet || '';

    var apply = function (type, label) {
      if (!label) return;
      var item = this.findComponentByLabel(type, label);
      if (item) this.setSelected(type, { id: item.id, image: item.image, swatch_image: item.swatch_image, label: item.label });
      else if (type === 'diameter') this.setSelected('diameter', { id: slugify(label), label: label });
    }.bind(this);

    apply('diameter', diameterLabel);
    apply('center', centerLabel);
    apply('barrel', barrelLabel);
    apply('hardware', hardwareLabel);
  };

  /* ── Add to Cart (single authoritative payload, no fallback submission) ── */
  WheelConfigurator.prototype.addToCart = function () {
    var self = this;
    if (this._addingToCart) return;

    /* Freeze the current selections so a mid-flight change can never mix
       with the variant being validated and submitted. */
    var sel = this.selected ? {
      diameter: this.selected.diameter,
      center: this.selected.center,
      barrel: this.selected.barrel,
      hardware: this.selected.hardware
    } : null;
    if (!(sel && sel.diameter && sel.center && sel.barrel && sel.hardware)) {
      alert('Please complete all four selections before adding to cart.');
      return;
    }
    var crossProduct = !!(this._matchedProductHandle && this._matchedProductHandle !== this.productHandle);
    var revalidateHandle = crossProduct ? this._matchedProductHandle : this.productHandle;
    if (!this.currentVariantId || !this.currentAvailability ||
        (this.currentAvailability.status !== 'available' && this.currentAvailability.status !== 'other-product')) {
      alert('This configuration is not currently available. Use Request a Quote for this build.');
      return;
    }
    var qty = this.captureQuantity();
    var submit = function (variantId) {
      if (!variantId) {
        self.showAddError('This configuration is not currently available. Please adjust your selections.');
        return;
      }
      var properties = {
        'Hardware & Rivet Finish': sel.hardware.label || sel.hardware.id,
        '_configurator': 'true',
        '_source': 'wheel-configurator',
        '_diameter': sel.diameter ? (sel.diameter.label || sel.diameter.id) : '',
        '_center_finish': sel.center ? (sel.center.label || sel.center.id) : '',
        '_barrel_finish': sel.barrel ? (sel.barrel.label || sel.barrel.id) : '',
        '_hardware_finish': sel.hardware ? (sel.hardware.label || sel.hardware.id) : '',
        '_design_code': (crossProduct && self._matchedDesignCode) ? self._matchedDesignCode : ((typeof window._calderDesignCode !== 'undefined') ? window._calderDesignCode : ''),
        '_variant_id': String(variantId),
        '_product_handle': crossProduct ? self._matchedProductHandle : self.productHandle
      };

      self._addingToCart = true;
      self.setAddingState(true);

      if (window.ConfiguratorAPI && window.ConfiguratorAPI.addToCart) {
        window.ConfiguratorAPI.addToCart(variantId, qty, properties, function (err, responseText) {
          self._addingToCart = false;
          self.setAddingState(false);
          if (err) { self.showAddError(err); return; }
          self.renderCartSections(responseText);
        });
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/cart/add.js', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        self._addingToCart = false;
        self.setAddingState(false);
        if (xhr.status === 200) {
          self.renderCartSections(xhr.responseText);
        } else {
          var msg = 'Failed to add to cart.';
          try { var err = JSON.parse(xhr.responseText); if (err.description) msg = err.description; } catch (e) {}
          self.showAddError(msg);
        }
      };
      xhr.onerror = function () {
        self._addingToCart = false;
        self.setAddingState(false);
        self.showAddError('Network error. Please check your connection and try again.');
      };
      /* 2026-10-29: /cart/add.js with Content-Type: application/json REQUIRES
         the items[] format — a bare {id, quantity} is rejected with
         "Required parameter missing or invalid: items". */
      var body = { items: [{ id: variantId, quantity: qty, properties: properties }] };
      body.sections = self.sectionsParam();
      body.sections_url = window.location.pathname || '/';
      xhr.send(JSON.stringify(body));
    };

    /* Re-verify the exact variant against the CURRENT selections right
       before submission so a stale id can never be added. Cross-product
       matches re-verify against the MATCHED product, not the current PDP. */
    if (window.ConfiguratorAPI && window.ConfiguratorAPI.resolveConfiguration) {
      window.ConfiguratorAPI.resolveConfiguration(revalidateHandle, sel.diameter, sel.center, sel.barrel, function (res) {
        if (!res || !res.variant || res.status !== 'available') {
          self.showAddError(crossProduct
            ? 'This configuration just sold out on the matching product. Please try again or request a quote.'
            : 'This configuration is no longer available. Please adjust your selections.');
          return;
        }
        self.currentVariantId = res.variant_id;
        if (res.variant.price != null) self.currentPrice = res.variant.price;
        submit(res.variant_id);
      });
      return;
    }
    submit(this.currentVariantId);
  };

  WheelConfigurator.prototype.setAddingState = function (active) {
    if (!this.addBtn) return;
    this.addBtn.disabled = active;
    this.addBtn.dataset.busy = active ? 'true' : 'false';
  };

  WheelConfigurator.prototype.showAddError = function (msg) {
    var text = msg || 'Failed to add to cart. Please try again.';
    if (typeof msg === 'string' && msg.indexOf('Add to cart') !== -1) text = msg;
    alert(text);
  };

  WheelConfigurator.prototype.captureQuantity = function () {
    var qty = 1;
    var host = this.pdpSection || this.el;
    if (host) {
      var input = host.querySelector('[data-calder-qty-input]');
      if (input) {
        var v = parseInt(input.value, 10);
        if (!isNaN(v) && v >= 1) qty = v;
      }
    }
    return qty;
  };

  /* Lumia `sections` + `sections_url` fields so the /cart/add.js response
     includes the section HTML needed to re-render the minicart. */
  WheelConfigurator.prototype.sectionsParam = function () {
    var sections = ['header-cart', 'cart-icon-bubble', 'header-minicart-sticky', 'cart-live-region-text'];
    var cartItems = document.querySelector('cart-items');
    if (cartItems && typeof cartItems.getSectionsToRender === 'function') {
      var cooked = Array.from(new Set(cartItems.getSectionsToRender()
        .filter(function (item) { return Boolean(document.querySelector('#' + item.id)); })
        .map(function (section) { return section.section; })))
        .filter(function (element) { return element !== undefined; })
        .slice(0, 5);
      if (cooked.length) sections = cooked;
    }
    return sections;
  };

  /* Render the cart through Lumia's native pipeline after a configurator add,
     so the minicart updates AND the user gets the "Added" banner + drawer. */
  WheelConfigurator.prototype.renderCartSections = function (responseText) {
    var response;
    try { response = JSON.parse(responseText); } catch (e) { response = null; }

    var cartItems = document.querySelector('cart-items');
    if (!cartItems) { this.openCartDrawerFallback(); document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true })); return; }

    try {
      if (response && response.sections && typeof cartItems.renderContents === 'function') {
        cartItems.renderContents(response);
        if (typeof cartItems.toggleEmptyClass === 'function') cartItems.toggleEmptyClass(response);
        if (typeof cartItems.setCartJs === 'function') cartItems.setCartJs();
        if (typeof cartItems.setStatus === 'function') {
          cartItems.setStatus('new', null, response.items ? response.items.length : 1, true);
        }
      } else {
        if (typeof cartItems.setStatus === 'function') {
          cartItems.setStatus('new', null, response && response.items ? response.items.length : 1, true);
        } else {
          this.openCartDrawerFallback();
        }
      }
    } catch (e) {
      this.openCartDrawerFallback();
    }
    document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true }));
  };

  WheelConfigurator.prototype.openCartDrawerFallback = function () {
    var miniCart = document.querySelector('mini-cart-popup');
    if (miniCart && typeof miniCart.open === 'function') {
      miniCart.open();
      return;
    }
    var drawer = document.getElementById('dropdnMinicart');
    if (drawer) {
      if (typeof jq_lumia !== 'undefined') { jq_lumia(drawer).addClass('open'); }
      else { drawer.classList.add('open'); }
    }
    var cartDrawer = document.querySelector('cart-drawer, cart-notification');
    if (cartDrawer && typeof cartDrawer.open === 'function') { cartDrawer.open(); }
  };

  WheelConfigurator.prototype.requestQuote = function () {
    var self = this;
    if (!this.selected.center || !this.selected.barrel || !this.selected.hardware) return;

    var modal = document.getElementById('wheel-configurator-quote-' + this.sectionId) ||
      document.querySelector('.quote-modal');

    if (modal) {
      var form = modal.querySelector('form');
      if (form) {
        var set = function (name, val) {
          var el = form.querySelector('[name="' + name + '"]');
          if (el) { el.value = val || ''; }
        };
        var designCode = this._matchedDesignCode ||
          ((typeof window._calderDesignCode !== 'undefined') ? window._calderDesignCode : '');
        set('product_id', this.productId);
        set('variant_id', this.currentVariantId || '');
        set('product_title', (document.title || '').split(' \u2013 ')[0] || '');
        set('notes', 'Config: ' + this.configSummaryText() +
          (designCode ? ' \u00b7 Design: ' + designCode : '') +
          (this.currentPrice != null ? ' \u00b7 Price: ' + this.priceEl.textContent : '') +
          ' \u00b7 Source: ' + window.location.href);
      }
      var ptEl = modal.querySelector('[data-quote-product-title]');
      if (ptEl) ptEl.textContent = this.productTitleLabel() || ((document.title || '').split(' \u2013 ')[0] || '');
      var csEl = modal.querySelector('[data-quote-config-summary]');
      if (csEl) csEl.textContent = 'Configuration: ' + this.configSummaryText() +
        (this.priceEl && this.priceEl.textContent ? ' \u00b7 Price per wheel: ' + this.priceEl.textContent : '');
      if (typeof jq_lumia !== 'undefined' && jq_lumia.fancybox) {
        jq_lumia.fancybox.open({ src: '#' + modal.id, type: 'inline' });
      } else {
        modal.style.display = 'block';
        modal.classList.add('is-open');
      }
      return;
    }

    var data = {
      product_id: this.productId.toString(),
      variant_id: this.currentVariantId ? this.currentVariantId.toString() : '',
      product_title: (document.title || '').split(' \u2013 ')[0] || '',
      name: '',
      email: '',
      phone: '',
      vehicle: '',
      quantity: '4',
      notes: 'Configurator Quote Request \u2014 ' + this.configSummaryText(),
      dealer_inquiry: ''
    };

    var apiBase = window.CALDER_API_BASE || '';
    var quoteUrl = apiBase ? apiBase + '/api/configurator/quote' : '/apps/wheel-configurator/api/quote';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', quoteUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200 || xhr.status === 201) {
        alert('Quote request submitted! We will contact you within 1-2 business days.');
      } else {
        try {
          var err = JSON.parse(xhr.responseText);
          alert(err.description || 'Failed to submit quote request. Please try again.');
        } catch (e) {
          alert('Failed to submit quote request. Please try again.');
        }
      }
    };
    xhr.onerror = function () {
      alert('Network error. Please check your connection and try again.');
    };
    xhr.send(JSON.stringify(data));
  };

  function buildComponentsFromProduct(product) {
    var components = { diameter: [], center: [], barrel: [], hardware: [] };
    if (!product || !product.variants) return { components: components };
    var seen = { diameter: {}, center: {}, barrel: {}, hardware: {} };

    for (var i = 0; i < product.variants.length; i++) {
      var v = product.variants[i];
      for (var j = 0; j < 3; j++) {
        var optKey = 'option' + (j + 1);
        var type = j === 0 ? 'diameter' : (j === 1 ? 'center' : 'barrel');
        var opt = ((v[optKey] || '').split(' ; ')[0] || '').trim();
        if (!opt) continue;
        if (seen[type][opt]) continue;
        seen[type][opt] = true;
        components[type].push({
          id: opt.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: type,
          label: opt,
          image: '',
          available: true
        });
      }
    }
    var hwSeen = {};
    return { components: components };
  }

  /* ── Shared configurator utilities ── */
  window.CalderConfigurator = {
    selections: function (wc) {
      var s = (wc && wc.selected) ? wc.selected : {};
      return {
        diameter: s.diameter ? (s.diameter.label || s.diameter.id) : '\u2014',
        center: s.center ? (s.center.label || s.center.id) : '\u2014',
        barrel: s.barrel ? (s.barrel.label || s.barrel.id) : '\u2014',
        hardware: s.hardware ? (s.hardware.label || s.hardware.id) : '\u2014'
      };
    },

    selectionIds: function (wc) {
      var s = (wc && wc.selected) ? wc.selected : {};
      var out = {};
      ALL_TYPES.forEach(function (t) { if (s[t]) out[t] = s[t].id; });
      return out;
    },

    productId: function (wc) {
      if (wc && wc.productId) return wc.productId;
      if (typeof window._calderProductComponents !== 'undefined' && window._calderProductComponents) {
        return window._calderProductComponents.product_id || '';
      }
      return '';
    },

    productTitle: function () {
      var h1 = document.querySelector('h1');
      var t = (document.title || '').split(' \u2013 ')[0];
      return (t && t.length > 2) ? t : (h1 ? h1.textContent.trim() : 'Calder Wheel');
    },

    designCode: function () {
      return (typeof window._calderDesignCode !== 'undefined') ? window._calderDesignCode : '';
    },

    priceLabel: function (wc) {
      return (wc && wc.priceEl) ? wc.priceEl.textContent : '';
    },

    availabilityLabel: function (wc) {
      return (wc && wc.availabilityEl) ? wc.availabilityEl.textContent : '';
    },

    previewUrls: function (wc) {
      var urls = {};
      if (wc && wc.layerImgs) {
        ['center', 'barrel', 'hardware'].forEach(function (t) {
          if (wc.layerImgs[t] && wc.layerImgs[t].src) urls[t] = wc.layerImgs[t].src;
        });
      }
      return urls;
    },

    saveBuild: function (wc) {
      var ids = this.selectionIds(wc);
      if (!(ids.diameter && ids.center && ids.barrel && ids.hardware)) return false;
      try {
        localStorage.setItem('calder-config-' + this.productId(wc), JSON.stringify({ selections: ids, saved: Date.now() }));
      } catch (e) { return false; }
      return true;
    },

    shareBuild: function (wc) {
      var ids = this.selectionIds(wc);
      if (!(ids.diameter && ids.center && ids.barrel && ids.hardware)) return false;
      var payload;
      try { payload = btoa(JSON.stringify({ p: String(this.productId(wc)), c: ids })); }
      catch (e) { return false; }
      var url = window.location.href.split('#')[0] + '#cfg=' + payload;
      var text = 'Check out my custom ' + this.productTitle() + ' build!';
      if (navigator.share) {
        navigator.share({ title: this.productTitle(), text: text, url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          alert('Build link copied to clipboard.');
        }).catch(function () {
          window.prompt('Copy your build link:', url);
        });
      } else {
        window.prompt('Copy your build link:', url);
      }
      return true;
    },

    buildPdf: function (wc) {
      var ids = this.selectionIds(wc);
      if (!(ids.diameter && ids.center && ids.barrel && ids.hardware)) return false;

      var sel = this.selections(wc);
      var urls = this.previewUrls(wc);
      var price = this.priceLabel(wc) || '\u2014';
      var avail = this.availabilityLabel(wc) || 'Build-to-order';
      var designCode = this.designCode();
      var title = this.productTitle();
      var today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      var hasImages = Object.keys(urls).length > 0;

      var imgRow = hasImages
        ? '<div style="display:flex;gap:12px;align-items:flex-end;margin-bottom:18px;">' +
            (urls.center ? '<img src="' + urls.center + '" style="max-width:180px;" alt="Center finish">' : '') +
            (urls.barrel ? '<img src="' + urls.barrel + '" style="max-width:180px;" alt="Barrel finish">' : '') +
            (urls.hardware ? '<img src="' + urls.hardware + '" style="max-width:120px;" alt="Hardware finish">' : '') +
          '</div>'
        : '';

      var wrap = document.createElement('div');
      wrap.className = 'calder-print-wrap';
      wrap.style.cssText = 'display:none;';
      wrap.innerHTML =
        '<style>' +
          '@media print {' +
            'body.calder-printing *{visibility:hidden;}' +
            '.calder-print-wrap{display:block !important;}' +
            '.calder-print-wrap,.calder-print-wrap *{visibility:visible;}' +
            '.calder-print-wrap{position:absolute;left:0;top:0;width:100%;padding:32px;}' +
            '.calder-print-summary{font-family:Georgia,\'Times New Roman\',serif;color:#111;max-width:680px;margin:0 auto;}' +
            '.calder-print-summary h1{font-size:22px;margin:0 0 2px;}' +
            '.calder-print-summary .ps-sub{font-size:11px;color:#555;margin:0 0 18px;}' +
            '.calder-print-summary table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;}' +
            '.calder-print-summary td{padding:7px 10px;border-bottom:1px solid #ddd;}' +
            '.calder-print-summary td:first-child{color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.4px;width:38%;}' +
            '.calder-print-summary .ps-total{font-size:16px;font-weight:700;}' +
            '.calder-print-summary .ps-note{font-size:10px;color:#777;margin-top:18px;}' +
          '}' +
        '</style>' +
        '<div class="calder-print-summary">' +
          '<h1>' + title + '</h1>' +
          '<p class="ps-sub">Calder Wheels \u00b7 Build summary \u00b7 ' + today + (designCode ? ' \u00b7 Design ' + designCode : '') + '</p>' +
          imgRow +
          '<table>' +
            '<tr><td>Diameter</td><td>' + sel.diameter + '</td></tr>' +
            '<tr><td>Center Finish</td><td>' + sel.center + '</td></tr>' +
            '<tr><td>Barrel &amp; Lip</td><td>' + sel.barrel + '</td></tr>' +
            '<tr><td>Hardware</td><td>' + sel.hardware + '</td></tr>' +
          '</table>' +
          '<table>' +
            '<tr><td>Price per wheel</td><td class="ps-total">' + price + '</td></tr>' +
            '<tr><td>Availability</td><td>' + avail + '</td></tr>' +
            '<tr><td>Build</td><td>Built to order \u00b7 Ships in 5\u201310 business days</td></tr>' +
          '</table>' +
          '<p class="ps-note">This build summary corresponds to the configuration selected in the wheel configurator. Component availability and pricing verified at time of selection.</p>' +
        '</div>';

      document.body.appendChild(wrap);
      document.body.classList.add('calder-printing');

      var cleanup = function () {
        document.body.classList.remove('calder-printing');
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
        window.removeEventListener('afterprint', cleanup);
        window.removeEventListener('beforeprint', beforeHandler);
      };
      var beforeHandler = function () {
        wrap.style.display = 'block';
      };
      window.addEventListener('beforeprint', beforeHandler);
      window.addEventListener('afterprint', cleanup);

      setTimeout(function () { window.print(); }, 150);
      return true;
    }
  };

  function init() {
    var containers = document.querySelectorAll('.wheel-configurator');
    for (var i = 0; i < containers.length; i++) {
      var el = containers[i];
      /* Per-container guard: re-initializes fresh DOM after Theme Editor
         section reloads; a global flag would block the new instance. */
      if (el.dataset.calderConfiguratorInit === 'true') continue;
      el.dataset.calderConfiguratorInit = 'true';
      new WheelConfigurator(el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
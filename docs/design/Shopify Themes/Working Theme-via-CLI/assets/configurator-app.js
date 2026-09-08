(function () {
  if (window.WheelConfiguratorInitialized) return;
  window.WheelConfiguratorInitialized = true;

  var COMPONENT_TYPES = ['center', 'barrel', 'hardware'];

  function WheelConfigurator(containerEl) {
    this.el = containerEl;
    this.sectionId = containerEl.dataset.sectionId;
    this.productId = containerEl.dataset.productId;
    this.canvas = document.getElementById('configurator-canvas-' + this.sectionId);
    this.selected = { center: null, barrel: null, hardware: null };
    this.components = { center: [], barrel: [], hardware: [] };
    this.images = {};
    this.currentPrice = null;
    this.currentVariantId = null;

    if (!this.canvas) return;

    this.loadingEl = this.canvas.querySelector('.wheel-configurator__preview-loading');
    this.layersEl = this.canvas.querySelector('.wheel-configurator__preview-layers');
    this.layerImgs = {
      center: this.canvas.querySelector('.wheel-configurator__layer--center'),
      barrel: this.canvas.querySelector('.wheel-configurator__layer--barrel'),
      hardware: this.canvas.querySelector('.wheel-configurator__layer--hardware')
    };

    this.availabilityEl = document.getElementById('configurator-availability-' + this.sectionId);
    this.actionsEl = this.canvas.closest('.wheel-configurator').querySelector('.wheel-configurator__actions');
    this.addBtn = document.getElementById('configurator-add-' + this.sectionId);
    this.quoteBtn = document.getElementById('configurator-quote-' + this.sectionId);
    this.summaryEl = document.getElementById('configurator-summary-' + this.sectionId);
    this.priceEl = document.getElementById('configurator-summary-price');

    this.init();
  }

  WheelConfigurator.prototype.init = function () {
    this.loadingEl.style.display = 'block';
    this.layersEl.style.display = 'none';
    if (this.actionsEl) this.actionsEl.style.display = 'none';
    if (this.summaryEl) this.summaryEl.style.display = 'none';
    if (this.availabilityEl) this.availabilityEl.style.display = 'none';

    this.loadComponents();
  };

  WheelConfigurator.prototype.loadComponents = function () {
    var self = this;

    if (window.ConfiguratorAPI && window.ConfiguratorAPI.loadComponents) {
      window.ConfiguratorAPI.loadComponents(this.productId, this.sectionId, function (data) {
        self.handleComponentsData(data);
      });
    } else {
      this.loadComponentsFallback();
    }
  };

  WheelConfigurator.prototype.loadComponentsFallback = function () {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/products/' + this.productId + '.js', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var product = JSON.parse(xhr.responseText);
          self.handleComponentsData(buildComponentsFromProduct(product));
        } catch (e) {
          self.handleComponentsData(null);
        }
      } else {
        self.handleComponentsData(null);
      }
    };
    xhr.onerror = function () { self.handleComponentsData(null); };
    xhr.send();
  };

  WheelConfigurator.prototype.handleComponentsData = function (data) {
    this.loadingEl.style.display = 'none';
    this.layersEl.style.display = 'flex';

    if (data && data.components) {
      this.components = data.components;
      for (var i = 0; i < COMPONENT_TYPES.length; i++) {
        this.renderOptions(COMPONENT_TYPES[i]);
      }
    } else {
      this.renderOptionsFromDom();
    }

    this.preloadDefaultImages();
    this.showActions();
  };

  WheelConfigurator.prototype.renderOptionsFromDom = function () {
    for (var i = 0; i < COMPONENT_TYPES.length; i++) {
      var type = COMPONENT_TYPES[i];
      var container = document.getElementById('configurator-' + type + 's-' + this.sectionId);
      if (!container) continue;

      var imgs = container.querySelectorAll('img[data-component-id]');
      if (imgs.length === 0) {
        container.innerHTML = '<p style="color:var(--text-color);opacity:0.5;font-size:0.85rem;">No ' + type + ' options available</p>';
        continue;
      }

      var html = '';
      for (var j = 0; j < imgs.length; j++) {
        var img = imgs[j];
        html += this.renderOptionHtml({
          id: img.dataset.componentId,
          type: type,
          image: img.src,
          label: img.alt || img.dataset.label || '',
          available: img.dataset.available !== 'false'
        });
      }
      container.innerHTML = html;
      container.dataset.loaded = 'true';
      this.bindOptionClicks(container, type);
    }
  };

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
    return '<div class="' + cls + '" data-component-id="' + item.id + '" data-component-type="' + item.type + '" ' + (!item.available ? 'title="Out of Stock"' : '') + '>' +
      '<img src="' + item.image + '" alt="' + label + '" loading="lazy">' +
      (label ? '<span class="wheel-configurator__option-label">' + label + '</span>' : '') +
      '</div>';
  };

  WheelConfigurator.prototype.bindOptionClicks = function (container, type) {
    var self = this;
    var options = container.querySelectorAll('.wheel-configurator__option:not(.wheel-configurator__option--unavailable)');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function () {
        var id = this.dataset.componentId;
        var t = this.dataset.componentType || type;

        container.querySelectorAll('.wheel-configurator__option--selected').forEach(function (el) {
          el.classList.remove('wheel-configurator__option--selected');
        });
        this.classList.add('wheel-configurator__option--selected');

        self.selected[t] = { id: id, image: this.querySelector('img').src, label: this.querySelector('img').alt };
        self.updatePreview(t);
        self.updateSummary();
        self.checkAvailability();
      });
    }
  };

  WheelConfigurator.prototype.preloadDefaultImages = function () {
    for (var t = 0; t < COMPONENT_TYPES.length; t++) {
      var type = COMPONENT_TYPES[t];
      var container = document.getElementById('configurator-' + type + 's-' + this.sectionId);
      if (!container) continue;

      var firstAvail = container.querySelector('.wheel-configurator__option:not(.wheel-configurator__option--unavailable)');
      if (firstAvail) {
        firstAvail.classList.add('wheel-configurator__option--selected');
        this.selected[type] = {
          id: firstAvail.dataset.componentId,
          image: firstAvail.querySelector('img').src,
          label: firstAvail.querySelector('img').alt
        };
        this.layerImgs[type].src = this.selected[type].image;
        this.layerImgs[type].style.display = 'block';
      }
    }

    this.updateSummary();
    this.checkAvailability();
  };

  WheelConfigurator.prototype.updatePreview = function (type) {
    if (this.selected[type] && this.selected[type].image) {
      this.layerImgs[type].src = this.selected[type].image;
      this.layerImgs[type].style.display = 'block';
    }
  };

  WheelConfigurator.prototype.updateSummary = function () {
    if (!this.summaryEl) return;

    var allSelected = true;
    for (var t = 0; t < COMPONENT_TYPES.length; t++) {
      var type = COMPONENT_TYPES[t];
      var el = document.getElementById('configurator-summary-' + type);
      if (el) {
        el.textContent = this.selected[type] ? this.selected[type].label || this.selected[type].id : '—';
        if (!this.selected[type]) allSelected = false;
      }
    }

    this.summaryEl.style.display = allSelected ? 'flex' : 'none';
  };

  WheelConfigurator.prototype.checkAvailability = function () {
    var self = this;
    var allSelected = this.selected.center && this.selected.barrel && this.selected.hardware;

    if (!allSelected) {
      if (this.availabilityEl) this.availabilityEl.style.display = 'none';
      if (this.addBtn) this.addBtn.disabled = true;
      if (this.quoteBtn) this.quoteBtn.disabled = true;
      return;
    }

    if (window.ConfiguratorAPI && window.ConfiguratorAPI.checkAvailability) {
      window.ConfiguratorAPI.checkAvailability(
        this.productId,
        this.selected.center,
        this.selected.barrel,
        this.selected.hardware,
        this.sectionId,
        function (data) { self.handleAvailabilityData(data); }
      );
    } else {
      this.checkAvailabilityFallback();
    }
  };

  WheelConfigurator.prototype.checkAvailabilityFallback = function () {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/products/' + this.productId + '.js', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status !== 200) { self.handleAvailabilityData(null); return; }
      try {
        var product = JSON.parse(xhr.responseText);
        var centerLabel = (self.selected.center.label || '').toLowerCase();
        var barrelLabel = (self.selected.barrel.label || '').toLowerCase();
        var hardwareLabel = (self.selected.hardware.label || '').toLowerCase();

        for (var i = 0; i < product.variants.length; i++) {
          var v = product.variants[i];
          var opts = (v.option1 + '|' + v.option2 + '|' + v.option3).toLowerCase();
          if (opts.indexOf(centerLabel) !== -1 && opts.indexOf(barrelLabel) !== -1 && opts.indexOf(hardwareLabel) !== -1) {
            self.handleAvailabilityData({
              available_to_build: v.available ? v.inventory_quantity : 0,
              variant_id: v.id,
              price: v.price,
              lead_time: '5-10 business days',
              available: v.available
            });
            return;
          }
        }
        self.handleAvailabilityData({ available_to_build: 0, variant_id: null, price: null, lead_time: '5-10 business days', available: false });
      } catch (e) {
        self.handleAvailabilityData(null);
      }
    };
    xhr.onerror = function () { self.handleAvailabilityData(null); };
    xhr.send();
  };

  WheelConfigurator.prototype.handleAvailabilityData = function (data) {
    if (!this.availabilityEl) return;

    this.availabilityEl.style.display = 'block';

    if (data && data.available_to_build > 0) {
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--available';
      this.availabilityEl.innerHTML = data.available_to_build + ' available to build &bull; Ships in ' + (data.lead_time || '5-10') + ' business days';
      if (this.addBtn) this.addBtn.disabled = false;
      if (this.quoteBtn) this.quoteBtn.disabled = false;

      this.currentVariantId = data.variant_id;
      this.currentPrice = data.price;

      this.updatePrice(data.price);

      if (this.addBtn) {
        this.addBtn.dataset.variantId = data.variant_id;
        this.addBtn.onclick = null;
        var self = this;
        this.addBtn.addEventListener('click', function () {
          self.addToCart(data.variant_id);
        }, { once: true });
      }
    } else if (data && data.available_to_build === 0) {
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--unavailable';
      this.availabilityEl.innerHTML = 'Currently out of stock. Some components unavailable.';
      if (this.addBtn) this.addBtn.disabled = true;
      if (this.quoteBtn) this.quoteBtn.disabled = false;
      this.currentVariantId = null;
      this.currentPrice = null;
      this.updatePrice(null);
    } else {
      this.availabilityEl.className = 'wheel-configurator__availability wheel-configurator__availability--partial';
      this.availabilityEl.innerHTML = 'Checking availability...';
      if (this.addBtn) this.addBtn.disabled = true;
      if (this.quoteBtn) this.quoteBtn.disabled = true;
      this.currentVariantId = null;
      this.currentPrice = null;
      this.updatePrice(null);
    }
  };

  WheelConfigurator.prototype.updatePrice = function (price) {
    if (!this.priceEl) return;
    if (price) {
      this.priceEl.textContent = Shopify ? Shopify.formatMoney(price, window.themeMoneyFormat || '${{amount}}') : '$' + (price / 100).toFixed(2);
    } else {
      this.priceEl.textContent = '—';
    }
  };

  WheelConfigurator.prototype.showActions = function () {
    if (this.actionsEl) this.actionsEl.style.display = 'flex';
  };

  WheelConfigurator.prototype.addToCart = function (variantId) {
    var self = this;
    if (!variantId) return;

    var properties = {
      '_configurator': 'true',
      '_center_finish': self.selected.center.label,
      '_barrel_finish': self.selected.barrel.label,
      '_hardware_finish': self.selected.hardware.label
    };

    if (window.ConfiguratorAPI && window.ConfiguratorAPI.addToCart) {
      window.ConfiguratorAPI.addToCart(variantId, 1, properties, function (err) {
        if (err) {
          alert(err);
        } else {
          self.showCartNotification();
          self.refreshCart();
        }
      });
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', window.routes.cart_add_url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          self.showCartNotification();
          self.refreshCart();
        } else {
          try {
            var err = JSON.parse(xhr.responseText);
            alert(err.description || 'Failed to add to cart');
          } catch (e) {
            alert('Failed to add to cart. Please try again.');
          }
        }
      };
      xhr.send(JSON.stringify({ id: parseInt(variantId, 10), quantity: 1, properties: properties }));
    }
  };

  WheelConfigurator.prototype.showCartNotification = function () {
    var drawer = document.getElementById('dropdnMinicart');
    if (drawer && typeof jq_lumia !== 'undefined') {
      jq_lumia(drawer).addClass('open');
    }
  };

  WheelConfigurator.prototype.refreshCart = function () {
    var cartItems = document.querySelector('cart-items');
    if (cartItems && cartItems.update) {
      cartItems.update();
    }
  };

  function buildComponentsFromProduct(product) {
    var components = { center: [], barrel: [], hardware: [] };
    if (!product || !product.variants) return { components: components };

    var seen = { center: {}, barrel: {}, hardware: {} };

    for (var i = 0; i < product.variants.length; i++) {
      var v = product.variants[i];
      var opts = [v.option1, v.option2, v.option3].filter(Boolean);

      for (var j = 0; j < opts.length; j++) {
        var opt = (opts[j] || '').trim();
        if (!opt) continue;

        var type = j === 0 ? 'center' : (j === 1 ? 'barrel' : 'hardware');
        if (seen[type][opt]) continue;
        seen[type][opt] = true;

        components[type].push({
          id: opt.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: type,
          label: opt,
          image: v.featured_image ? v.featured_image.src : '',
          available: v.available
        });
      }
    }

    return { components: components };
  }

  function init() {
    var containers = document.querySelectorAll('.wheel-configurator');
    for (var i = 0; i < containers.length; i++) {
      new WheelConfigurator(containers[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
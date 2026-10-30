(function () {
  'use strict';
  if (window.ConfiguratorAPI) return;
  window.ConfiguratorAPI = {};

  var API_BASE = window.CALDER_API_BASE || '';
  var ASSET_BASE = window.CALDER_ASSET_BASE || '';
  var DESIGN_CODE = window._calderDesignCode || ''; // Never silently use design 201 for another wheel.
  var SHOPIFY_PRODUCT_API = '/products/';
  var SHOPIFY_CART_API = '/cart/add.js';
  var _productCache = {};
  var PRODUCT_CACHE_TTL = 30000;

  var CONFIG_TYPES = ['center', 'barrel', 'hardware'];

  function normalize(s) {
    return String(s == null ? '' : s).trim().toLowerCase();
  }

  /* ── Embedded per-product data (keyed store, no global overwrites) ── */
  function embeddedFor(productIdentifier) {
    var id = String(productIdentifier);
    var store = window._calderProductData || {};

    if (store[id]) return store[id];
    for (var k in store) {
      if (!Object.prototype.hasOwnProperty.call(store, k)) continue;
      var e = store[k];
      if (e && (String(e.product_id) === id || String(e.product_handle) === id)) return e;
    }

    var byw = window._bywProductData || {};
    if (byw[id]) return byw[id];
    for (var b in byw) {
      if (!Object.prototype.hasOwnProperty.call(byw, b)) continue;
      var eb = byw[b];
      if (eb && (String(eb.product_id) === id || String(eb.product_handle) === id)) return eb;
    }

    var current = window._calderProductComponents;
    if (current && (String(current.product_id) === id || String(current.product_handle) === id)) return current;
    return null;
  }

  function componentsPopulated(data) {
    if (!data || !data.components) return false;
    var c = data.components;
    return !!((c.center && c.center.length) ||
              (c.barrel && c.barrel.length) ||
              (c.hardware && c.hardware.length));
  }

  function buildFinishImageUrl(f, type) {
    if (!f || !f.image_filename) return '';
    var fn = f.image_filename;

    if (fn.indexOf('/') !== -1 || /^(design-|finish-|wheel-component-)/.test(fn)) {
      return ASSET_BASE ? ASSET_BASE + fn : '';
    }

    var prefix = (type === 'center') ? 'design-' + DESIGN_CODE + '-' : 'finish-';
    return ASSET_BASE ? ASSET_BASE + prefix + fn : '';
  }

  function buildFinish(f, type) {
    var imgUrl = buildFinishImageUrl(f, type);
    return { id: f.id, type: type, label: f.name, image: imgUrl, available: true };
  }

  function callApi(endpoint, body, callback, fallback, method) {
    method = method || 'POST';
    if (!API_BASE) {
      if (fallback) fallback();
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(method, API_BASE + endpoint, true);
    if (method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.timeout = 3000;

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          callback(JSON.parse(xhr.responseText));
          return;
        } catch (e) {}
      }
      if (fallback) fallback();
    };

    xhr.onerror = function () { if (fallback) fallback(); };
    xhr.ontimeout = function () { if (fallback) fallback(); };
    xhr.send(JSON.stringify(body));
  }

  function loadProduct(productIdentifier, callback) {
    var now = Date.now();
    var cached = _productCache[productIdentifier];
    if (cached && (now - cached.t) < PRODUCT_CACHE_TTL) {
      callback(cached.v);
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', SHOPIFY_PRODUCT_API + productIdentifier + '.js', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var product = JSON.parse(xhr.responseText);
          _productCache[productIdentifier] = { v: product, t: Date.now() };
          callback(product);
          return;
        } catch (e) {}
      }
      callback(null);
    };
    xhr.onerror = function () { callback(null); };
    xhr.send();
  }

  /* ── Resolve variants (embedded first, network as fallback) ── */
  function getVariants(embedded, productIdentifier, callback) {
    if (embedded && Array.isArray(embedded.variants) && embedded.variants.length) {
      callback(embedded.variants);
      return;
    }
    loadProduct(productIdentifier, function (product) {
      callback(product && product.variants ? product.variants : null);
    });
  }

  /**
   * Exact Shopify variant resolution (CFG-002).
   * - option1 === normalized diameter
   * - option2 === normalized center finish
   * - option3 === normalized barrel/lip finish
   * Hardware is NOT a native variant option and is matched separately.
   * No fallback to current/first-available/first variants ever occurs.
   * Returns a structured result; a failed match has no variant_id.
   */
  function resolveAllOptionVariant(productData, diameter, center, barrel) {
    if (!productData) return { status: 'data-error', variant_id: null };
    if (!productData.variants || !productData.variants.length) return { status: 'no-variants', variant_id: null };

    var dl = normalize(diameter && (diameter.label || diameter.id || ''));
    var cl = normalize(center && (center.label || center.id || ''));
    var bl = normalize(barrel && (barrel.label || barrel.id || ''));
    var hasSel = !!(dl || cl || bl);
    if (!hasSel) return { status: 'no-selection', variant_id: null };

    for (var i = 0; i < productData.variants.length; i++) {
      var v = productData.variants[i];
      if (dl && normalize(v.option1) !== dl) continue;
      if (cl && normalize(v.option2) !== cl) continue;
      if (bl && normalize(v.option3) !== bl) continue;
      return { status: v.available ? 'available' : 'unavailable', variant: v, variant_id: v.id };
    }
    return { status: 'unsupported', variant_id: null };
  }

  /* ── Hardware validation against the product's allowed choices ── */
  function isHardwareAllowed(embedded, hardware) {
    var label = normalize(hardware && (hardware.label || hardware.id || ''));
    if (!label) return false;

    var opts = (embedded && embedded.hardware_options) || [];
    if (!opts.length && embedded && embedded.components && embedded.components.hardware) {
      opts = embedded.components.hardware.map(function (c) { return c.label || c.name || c.id; });
    }
    for (var i = 0; i < opts.length; i++) {
      if (normalize(opts[i]) === label) return true;
    }
    return false;
  }

  function listContainsComponent(compList, compId, compLabel) {
    if (!compList) return false;
    var label = normalize(compLabel);
    var id = normalize(compId);
    for (var i = 0; i < compList.length; i++) {
      var it = compList[i];
      if (String(it.id) === id || normalize(it.client_code) === id ||
          normalize(it.label || it.name || '') === label) {
        return true;
      }
    }
    return false;
  }

  window.ConfiguratorAPI.loadComponents = function (productIdentifier, sectionId, callback) {
    var embedded = embeddedFor(productIdentifier);
    if (componentsPopulated(embedded)) {
      callback({ components: embedded.components, product: embedded });
      return;
    }

    if (API_BASE) {
      callApi(
        '/api/configurator/finishes',
        {},
        function (data) {
          if (data && data.center) {
            data.components = {
              center: data.center.map(function (f) { return buildFinish(f, 'center'); }),
              barrel: data.barrel.map(function (f) { return buildFinish(f, 'barrel'); }),
              hardware: data.hardware.map(function (f) { return buildFinish(f, 'hardware'); }),
            };
            data.variants = null;
            callback(data);
            return;
          }
          tryShopifyAjax();
        },
        tryShopifyAjax,
        'GET'
      );
    } else {
      tryShopifyAjax();
    }

    function tryShopifyAjax() {
      loadProduct(productIdentifier, function (product) {
        if (product) {
          callback({ components: buildComponentsFromProduct(product).components, product: product });
        } else {
          callback(null);
        }
      });
    }
  };

  /**
   * Availability check (CFG-003).
   * Primary gate: exact Shopify variant exists AND is available.
   * Additional constraint (demo only): component inventory when data is
   * present. Missing demo data is "unknown", never confirmed stock.
   */
  window.ConfiguratorAPI.checkAvailability = function (productIdentifier, center, barrel, hardware, diameter, sectionId, callback, quantity) {
    var embedded = embeddedFor(productIdentifier);
    var requestedQuantity = Math.max(1, parseInt(quantity, 10) || 1);

    function finish(extra) {
      var out = {
        status: 'checking',
        supported: true,
        available_to_build: 0,
        demo_unknown: false,
        variant_id: null,
        price: null,
        design_code: (embedded && embedded.design_code) || '',
        lead_time: (embedded && embedded.lead_time_days) ? embedded.lead_time_days + ' business days' : '5-10 business days'
      };
      for (var k in extra) out[k] = extra[k];
      return out;
    }

    /* Hardware is not a native variant option and every hardware finish is
       purchasable — the quantity of QuickBooks components is the only
       purchase gate, applied after the variant resolves below. */
    getVariants(embedded, productIdentifier, function (variants) {
      if (!variants) {
        callback(finish({ status: 'error', supported: true, build_to_order: false, available_to_build: 0 }));
        return;
      }

      var res = resolveAllOptionVariant({ variants: variants }, diameter, center, barrel);
      if (res.status === 'no-selection') {
        callback(finish({ status: 'checking', supported: true, available_to_build: 0 }));
        return;
      }
      if (res.status === 'unsupported' || res.status === 'no-variants') {
        callback(finish({ status: 'unsupported', supported: true, available_to_build: 0 }));
        return;
      }
      if (res.status === 'data-error') {
        callback(finish({ status: 'error', supported: true, available_to_build: 0 }));
        return;
      }

      var v = res.variant;
      var out = finish({
        status: v.available ? 'available' : 'no-stock',
        variant_id: v.id,
        price: v.price != null ? v.price : null,
        available_to_build: v.available ? 1 : 0
      });

      if (v.available && window._calderDemoInventory && typeof window._calderDemoInventory.getAvailabilityStatus === 'function') {
        /* QuickBooks component inventory is the true stock source: the
           configuration is orderable only when every component can cover
           the requested quantity. */
        var demo = window._calderDemoInventory.getAvailabilityStatus(productIdentifier, diameter, center, barrel, hardware, requestedQuantity);
        if (demo) {
          if (demo.known) {
            out.available_to_build = Math.max(0, demo.available_to_build);
            out.requested_quantity = requestedQuantity;
            out.components = demo.components;
            if (out.available_to_build < requestedQuantity) out.status = 'no-stock';
          } else {
            /* A component without a QuickBooks part cannot be verified —
               quantity is the only purchase gate, so the configuration is
               not purchasable until inventory confirms it. */
            out.status = 'no-stock';
            out.components = demo.components;
            out.requested_quantity = requestedQuantity;
          }
          if (demo.design_number) out.design_number = demo.design_number;
          if (demo.design_code) out.design_code = demo.design_code;
        }
      }

      callback(out);
    });
  };

  /* Re-resolution used at cart time to guarantee the payload's variant id
     still matches the current selections (CFG-006). */
  window.ConfiguratorAPI.resolveConfiguration = function (productIdentifier, diameter, center, barrel, callback) {
    var embedded = embeddedFor(productIdentifier);
    getVariants(embedded, productIdentifier, function (variants) {
      if (!variants) {
        callback({ status: 'error', variant_id: null });
        return;
      }
      callback(resolveAllOptionVariant({ variants: variants }, diameter, center, barrel));
    });
  };

  /* Synchronous exact resolution, shared by the configurator and the
     standalone builder (single resolver, no duplicated logic). */
  window.ConfiguratorAPI.resolveExact = function (variants, diameter, center, barrel) {
    return resolveAllOptionVariant({ variants: variants || [] }, diameter, center, barrel);
  };

  /* Catalog-wide preset lookup: exact native variant + hardware + fitment identity.
     Shopify Liquid supplies the collection index; do not guess from the current product. */
  window.ConfiguratorAPI.resolveCatalog = function (currentHandle, diameter, center, barrel, hardware) {
    var catalog = window._calderConfigurationCatalog || {};
    var current = catalog[currentHandle];
    var result = { status: 'unsupported', variant_id: null, product_handle: null };
    if (!current) return { status: 'catalog-missing', variant_id: null };
    function fitmentKey(handle) {
      var match = String(handle).match(/^(.+?-[56]x\d+-[pm]\d+-[\d.]+mm)(?:-|$)/i);
      return match ? match[1].toLowerCase() : null;
    }
    var currentKey = fitmentKey(currentHandle);
    if (!currentKey) return { status: 'fitment-unknown', variant_id: null };
    var keys = Object.keys(catalog);
    keys.sort(function (a, b) { return (a === currentHandle ? -1 : 0) - (b === currentHandle ? -1 : 0); });
    for (var i = 0; i < keys.length; i++) {
      var product = catalog[keys[i]];
      if (fitmentKey(product.handle) !== currentKey || normalize(product.design) !== normalize(current.design)) continue;
      var allowed = String(product.hardware || '').split(',').some(function (h) { return normalize(h) === normalize(hardware && (hardware.label || hardware.id)); });
      if (!allowed) continue;
      var matched = resolveAllOptionVariant(product, diameter, center, barrel);
      if (!matched.variant) continue;
      var same = product.handle === currentHandle;
      var output = {
        status: matched.variant.available ? (same ? 'available' : 'other-product') : 'no-stock',
        variant_id: matched.variant.id, variant: matched.variant,
        price: matched.variant.price, product_handle: product.handle,
        design_code: product.design,
        url: '/products/' + encodeURIComponent(product.handle) + '?variant=' + encodeURIComponent(matched.variant.id),
        available_to_build: matched.variant.available ? 1 : 0, supported: true
      };
      if (matched.variant.available) return output;
      result = output;
    }
    return result;
  };

  /* Build the Lumia `sections` + `sections_url` request fields used by
     /cart/*.js so the response includes the section HTML the theme needs
     to re-render the minicart / header count after a configurator add. */
  function cartSectionsParam() {
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
    return { sections: sections, sections_url: window.location.pathname || '/' };
  }

  window.ConfiguratorAPI.addToCart = function (variantId, quantity, properties, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', SHOPIFY_CART_API, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) { callback(null, xhr.responseText); }
      else {
        try { var err = JSON.parse(xhr.responseText); callback(err.description || 'Failed to add to cart', null); }
        catch (e) { callback('Failed to add to cart', null); }
      }
    };
    xhr.onerror = function () { callback('Network error', null); };
    var body = { id: variantId, quantity: quantity || 1, properties: properties || {} };
    var sp = cartSectionsParam();
    body.sections = sp.sections;
    body.sections_url = sp.sections_url;
    xhr.send(JSON.stringify(body));
  };

  window.ConfiguratorAPI.getFinishes = function (callback) {
    if (API_BASE) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', API_BASE + '/api/configurator/finishes', true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          try { callback(JSON.parse(xhr.responseText)); return; } catch (e) {}
        }
        callback(null);
      };
      xhr.onerror = function () { callback(null); };
      xhr.send();
    } else { callback(null); }
  };

  function buildComponentsFromProduct(product) {
    var components = { center: [], barrel: [], hardware: [] };
    if (!product || !product.variants) return { components: components };
    var seen = { center: {}, barrel: {}, hardware: {} };

    for (var i = 0; i < product.variants.length; i++) {
      var v = product.variants[i];
      for (var j = 1; j < 4; j++) {
        var opt = (v['option' + (j + 1)] || '').trim();
        if (!opt) continue;
        var type = j === 1 ? 'center' : (j === 2 ? 'barrel' : 'hardware');
        if (seen[type][opt]) continue;
        seen[type][opt] = true;
        components[type].push({
          id: opt.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: type, label: opt,
          image: v.featured_image ? v.featured_image.src : '',
          available: v.available,
        });
      }
    }
    return { components: components };
  }
})();
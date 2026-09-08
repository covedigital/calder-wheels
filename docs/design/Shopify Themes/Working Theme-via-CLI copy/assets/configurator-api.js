(function () {
  'use strict';
  if (window.ConfiguratorAPI) return;
  window.ConfiguratorAPI = {};

  var API_BASE = window.CALDER_API_BASE || '';
  var ASSET_BASE = window.CALDER_ASSET_BASE || '';
  var DESIGN_CODE = window._calderDesignCode || '201';
  var SHOPIFY_PRODUCT_API = '/products/';
  var SHOPIFY_CART_API = '/cart/add.js';

  function callApi(endpoint, body, callback, fallback) {
    if (!API_BASE) {
      if (fallback) fallback();
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', API_BASE + endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
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

  window.ConfiguratorAPI.loadComponents = function (productId, sectionId, callback) {
    var embedded = document.getElementById('configurator-data-' + sectionId);

    if (API_BASE) {
      callApi(
        '/api/configurator/finishes',
        {},
        function (data) {
          if (data && data.center) {
            data.components = {
              center: data.center.map(function (f) {
                return { id: f.id, type: 'center', label: f.name, image: ASSET_BASE + 'design-' + DESIGN_CODE + '-' + (f.image_filename || ''), available: true };
              }),
              barrel: data.barrel.map(function (f) {
                return { id: f.id, type: 'barrel', label: f.name, image: ASSET_BASE + 'design-' + DESIGN_CODE + '-' + (f.image_filename || ''), available: true };
              }),
              hardware: data.hardware.map(function (f) {
                return { id: f.id, type: 'hardware', label: f.name, image: ASSET_BASE + 'design-' + DESIGN_CODE + '-' + (f.image_filename || ''), available: true };
              }),
            };
            callback(data);
            return;
          }
          tryEmbedded();
        },
        tryEmbedded
      );
    } else {
      tryEmbedded();
    }

    function tryEmbedded() {
      if (window._calderProductComponents && window._calderProductComponents.components) {
        callback({components: window._calderProductComponents.components});
        return;
      }
      if (embedded) {
        try {
          var data = JSON.parse(embedded.textContent);
          if (data && data.components) {
            callback(data);
            return;
          }
        } catch (e) {}
      }
      tryShopifyAjax();
    }

    function tryShopifyAjax() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', SHOPIFY_PRODUCT_API + productId + '.js', true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            callback(buildComponentsFromProduct(JSON.parse(xhr.responseText)));
          } catch (e) { callback(null); }
        } else { callback(null); }
      };
      xhr.onerror = function () { callback(null); };
      xhr.send();
    }
  };

  window.ConfiguratorAPI.checkAvailability = function (productId, center, barrel, hardware, sectionId, callback) {
    var embedded = document.getElementById('configurator-data-' + sectionId);
    var config = {
      design_code: center.id,
      series: 'three_piece',
      center_finish: center.id,
      barrel_finish: barrel.id,
      hardware_finish: hardware.id,
      diameter: 24,
      width: 10,
      bolt_pattern: '5x114.3',
    };

    function parseAvailability(data) {
      if (!data) return null;
      return {
        available_to_build: data.is_orderable ? (data.available_to_build || 999) : 0,
        variant_id: data.variant_id || null,
        price: data.total_retail ? Math.round(data.total_retail * 100) : null,
        lead_time: data.lead_time || '5-10 business days',
        available: !!data.is_orderable,
      };
    }

    if (API_BASE) {
      callApi(
        '/api/configurator/available',
        config,
        function (data) {
          var parsed = parseAvailability(data);
          if (parsed) { callback(parsed); return; }
          tryEmbeddedAvailability();
        },
        tryEmbeddedAvailability
      );
    } else {
      tryEmbeddedAvailability();
    }

    function tryEmbeddedAvailability() {
      if (window._calderProductComponents) {
        var variantMap = window._calderProductComponents.variant_map;
        var leadTime = window._calderProductComponents.lead_time_days || 10;
        var configKey = center.id + '|' + barrel.id + '|' + hardware.id;
        if (variantMap && variantMap[configKey]) {
          tryResolveFromShopify(variantMap[configKey], leadTime);
          return;
        }
        tryResolveFromShopify(null, leadTime);
        return;
      }
      if (embedded) {
        try {
          var embeddedData = JSON.parse(embedded.textContent);
          var variantMap = embeddedData.variant_map;
          var leadTime = embeddedData.lead_time_days || 10;
          var configKey = center.id + '|' + barrel.id + '|' + hardware.id;

          if (variantMap && variantMap[configKey]) {
            tryResolveFromShopify(variantMap[configKey], leadTime);
            return;
          }
        } catch (e) {}
      }
      tryResolveFromShopify(null, 10);
    }

    function tryResolveFromShopify(mappedVariantId, leadTime) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', SHOPIFY_PRODUCT_API + productId + '.js', true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onload = function () {
        if (xhr.status !== 200) { callback(null); return; }
        try {
          var product = JSON.parse(xhr.responseText);
          var matched = null;

          if (mappedVariantId) {
            for (var i = 0; i < product.variants.length; i++) {
              if (product.variants[i].id == mappedVariantId) {
                matched = product.variants[i]; break;
              }
            }
          }

          if (!matched) {
            for (var j = 0; j < product.variants.length; j++) {
              var v = product.variants[j];
              var opts = (v.option1 + '|' + v.option2 + '|' + v.option3).toLowerCase();
              var labels = (center.label + '|' + barrel.label + '|' + hardware.label).toLowerCase();
              if (opts.indexOf(center.label.toLowerCase()) !== -1 &&
                  opts.indexOf(barrel.label.toLowerCase()) !== -1 &&
                  opts.indexOf(hardware.label.toLowerCase()) !== -1) {
                matched = v; break;
              }
            }
          }

          if (matched) {
            callback({
              available_to_build: matched.available ? matched.inventory_quantity : 0,
              variant_id: matched.id,
              price: matched.price,
              lead_time: leadTime + ' business days',
              available: matched.available,
            });
          } else {
            callback({ available_to_build: 0, variant_id: null, price: null, lead_time: leadTime + ' business days', available: false });
          }
        } catch (e) { callback(null); }
      };
      xhr.onerror = function () { callback(null); };
      xhr.send();
    }
  };

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
    xhr.send(JSON.stringify({
      id: parseInt(variantId, 10),
      quantity: quantity || 1,
      properties: properties || {},
    }));
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
      for (var j = 0; j < 3; j++) {
        var opt = (v['option' + (j + 1)] || '').trim();
        if (!opt) continue;
        var type = j === 0 ? 'center' : (j === 1 ? 'barrel' : 'hardware');
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
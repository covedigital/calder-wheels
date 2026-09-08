/**
 * Calder Wheels — Configurator API Layer
 * Replaces /apps/wheel-configurator/api/ HTTP calls with:
 *   1. Inline component data from Liquid (snippets/configurator-data.liquid)
 *   2. Shopify Ajax Product API for variant/price resolution
 *   3. Shopify Ajax Cart API for add-to-cart
 */
(function () {
  'use strict';
  if (window.ConfiguratorAPI) return;
  window.ConfiguratorAPI = {};

  var SHOPIFY_PRODUCT_API = '/products/';
  var SHOPIFY_CART_API = '/cart/add.js';

  /**
   * Load component data for a product.
   * First tries inline JSON from the DOM, then falls back to the Ajax API.
   */
  window.ConfiguratorAPI.loadComponents = function (productId, sectionId, callback) {
    var embedded = document.getElementById('configurator-data-' + sectionId);
    if (embedded) {
      try {
        var data = JSON.parse(embedded.textContent);
        if (data && data.components) {
          callback(data);
          return;
        }
      } catch (e) {
        console.warn('Configurator: embedded data parse error, falling back to API', e);
      }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', SHOPIFY_PRODUCT_API + productId + '.js', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var product = JSON.parse(xhr.responseText);
          callback(buildComponentsFromProduct(product));
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
    };
    xhr.onerror = function () { callback(null); };
    xhr.send();
  };

  /**
   * Check availability of a specific configuration.
   * Matches the selected center+barrel+hardware to a variant, then
   * returns available_to_build, variant_id, price, lead_time.
   */
  window.ConfiguratorAPI.checkAvailability = function (productId, center, barrel, hardware, sectionId, callback) {
    var embedded = document.getElementById('configurator-data-' + sectionId);
    var variantMap = null;
    var leadTime = 10;

    if (embedded) {
      try {
        var embeddedData = JSON.parse(embedded.textContent);
        variantMap = embeddedData.variant_map;
        leadTime = embeddedData.lead_time_days || 10;
      } catch (e) {}
    }

    var configKey = center.id + '|' + barrel.id + '|' + hardware.id;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', SHOPIFY_PRODUCT_API + productId + '.js', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status !== 200) {
        callback(null);
        return;
      }

      try {
        var product = JSON.parse(xhr.responseText);
        var matchedVariant = null;

        if (variantMap && variantMap[configKey]) {
          var mappedId = variantMap[configKey];
          for (var i = 0; i < product.variants.length; i++) {
            if (product.variants[i].id == mappedId) {
              matchedVariant = product.variants[i];
              break;
            }
          }
        }

        if (!matchedVariant) {
          for (var j = 0; j < product.variants.length; j++) {
            var v = product.variants[j];
            var option1 = String(v.option1 || v.title || '').toLowerCase();
            var option2 = String(v.option2 || '').toLowerCase();
            var option3 = String(v.option3 || '').toLowerCase();

            var centerLabel = (center.label || center.id || '').toLowerCase();
            var barrelLabel = (barrel.label || barrel.id || '').toLowerCase();
            var hardwareLabel = (hardware.label || hardware.id || '').toLowerCase();

            var allOptions = option1 + '|' + option2 + '|' + option3;
            var allLabels = centerLabel + '|' + barrelLabel + '|' + hardwareLabel;

            var centerMatch = allOptions.indexOf(centerLabel) !== -1;
            var barrelMatch = allOptions.indexOf(barrelLabel) !== -1;
            var hardwareMatch = allOptions.indexOf(hardwareLabel) !== -1;

            if (centerMatch && barrelMatch && hardwareMatch) {
              matchedVariant = v;
              break;
            }
          }
        }

        if (matchedVariant) {
          var available = matchedVariant.available ? matchedVariant.inventory_quantity : 0;
          callback({
            available_to_build: Math.min(available, 999),
            variant_id: matchedVariant.id,
            price: matchedVariant.price,
            compare_at_price: matchedVariant.compare_at_price,
            lead_time: leadTime + ' business days',
            available: matchedVariant.available
          });
        } else {
          callback({
            available_to_build: 0,
            variant_id: null,
            price: null,
            lead_time: leadTime + ' business days',
            available: false
          });
        }
      } catch (e) {
        callback(null);
      }
    };
    xhr.onerror = function () { callback(null); };
    xhr.send();
  };

  /**
   * Add configured wheel to cart with line-item properties.
   */
  window.ConfiguratorAPI.addToCart = function (variantId, quantity, properties, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', SHOPIFY_CART_API, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      } else {
        try {
          var err = JSON.parse(xhr.responseText);
          callback(err.description || 'Failed to add to cart', null);
        } catch (e) {
          callback('Failed to add to cart', null);
        }
      }
    };
    xhr.onerror = function () { callback('Network error', null); };
    xhr.send(JSON.stringify({
      id: parseInt(variantId, 10),
      quantity: quantity || 1,
      properties: properties || {}
    }));
  };

  /**
   * Build component data from a Shopify product.js response.
   * Used as fallback when inline data is unavailable.
   */
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
})();
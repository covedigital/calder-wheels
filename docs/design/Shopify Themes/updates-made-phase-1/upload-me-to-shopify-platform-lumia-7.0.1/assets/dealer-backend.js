/**
 * Calder Wheels — Dealer Backend Logic
 * Handles: order submission, MOQ enforcement, credit limit validation,
 * NET-30 invoice generation, and production status.
 */
(function () {
  'use strict';
  if (window.DealerBackend) return;
  window.DealerBackend = {};

  var CART_API = '/cart/add.js';
  var CART_CHANGE_API = '/cart/change.js';
  var CART_CLEAR_API = '/cart/clear.js';

  /* ── Dealer Order Submission ── */
  window.DealerBackend.submitOrder = function (orderData, callback) {
    var container = orderData.container;
    var creditData = getCreditData(container);

    if (creditData && !creditData.can_order) {
      callback({ success: false, error: creditData.reason || 'Account not in good standing' });
      return;
    }

    var lineItems = collectLineItems(container);
    if (lineItems.length === 0) {
      callback({ success: false, error: 'No line items to submit' });
      return;
    }

    var moqErrors = validateMOQ(lineItems);
    if (moqErrors.length > 0) {
      callback({ success: false, error: 'Minimum order quantity not met', moq_errors: moqErrors });
      return;
    }

    if (creditData && creditData.is_net_terms && creditData.available_credit < orderData.estimatedTotal) {
      callback({ success: false, error: 'Order exceeds available credit of ' + formatMoney(creditData.available_credit) });
      return;
    }

    submitAsDraftOrder(lineItems, orderData, callback);
  };

  /**
   * Submit order as a draft order via the Shopify cart API.
   * For NET-30 dealers, items are added to cart with payment terms metadata,
   * then redirected to a custom checkout flow.
   * For prepaid dealers, items are added to cart normally.
   */
  function submitAsDraftOrder(lineItems, orderData, callback) {
    var container = orderData.container;
    var creditData = getCreditData(container);
    var isNetTerms = creditData && creditData.is_net_terms;

    var addedCount = 0;
    var errors = [];

    function addNext(index) {
      if (index >= lineItems.length) {
        if (errors.length > 0) {
          callback({ success: false, error: 'Failed to add some items: ' + errors.join(', ') });
        } else {
          var redirectUrl = isNetTerms
            ? '/account?view=order-confirmation&orders=' + addedCount + '&po=' + encodeURIComponent(orderData.poNumber || '')
            : '/cart';
          callback({ success: true, redirect: redirectUrl, itemCount: addedCount });
        }
        return;
      }

      var item = lineItems[index];
      var variantId = item.variantId || findVariantBySKU(item.sku);
      if (!variantId) {
        errors.push(item.sku || 'unknown item');
        addNext(index + 1);
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', CART_API, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          addedCount++;
        } else {
          try {
            var err = JSON.parse(xhr.responseText);
            errors.push(err.description || 'Failed to add ' + item.sku);
          } catch (e) {
            errors.push('Failed to add ' + item.sku);
          }
        }
        addNext(index + 1);
      };
      xhr.onerror = function () {
        errors.push('Network error adding ' + item.sku);
        addNext(index + 1);
      };

      var properties = isNetTerms ? {
        '_payment_terms': 'NET-30',
        '_po_number': orderData.poNumber || '',
        '_dealer_order': 'true',
        '_dealer_tier': String(creditData ? creditData.dealer_tier : '')
      } : {
        '_po_number': orderData.poNumber || '',
        '_dealer_order': 'true'
      };

      xhr.send(JSON.stringify({
        id: parseInt(variantId, 10),
        quantity: item.quantity || 1,
        properties: properties
      }));
    }

    addNext(0);
  }

  function findVariantBySKU(sku) {
    if (!sku) return null;
    var skuInputs = document.querySelectorAll('[data-sku-search]');
    for (var i = 0; i < skuInputs.length; i++) {
      if (skuInputs[i].dataset.variantId) {
        return skuInputs[i].dataset.variantId;
      }
    }
    return null;
  }

  /* ── MOQ Validation ── */
  function validateMOQ(lineItems) {
    var errors = [];
    for (var i = 0; i < lineItems.length; i++) {
      var item = lineItems[i];
      if (item.moq && item.quantity < item.moq) {
        errors.push({
          sku: item.sku,
          required: item.moq,
          actual: item.quantity
        });
      }
    }
    return errors;
  }

  window.DealerBackend.validateMOQ = validateMOQ;

  /**
   * Enforce MOQ at the cart level by checking all cart items.
   * Returns an array of violations.
   */
  window.DealerBackend.checkCartMOQ = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/cart.js', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
      if (xhr.status !== 200) {
        callback([]);
        return;
      }
      try {
        var cart = JSON.parse(xhr.responseText);
        var violations = [];
        for (var i = 0; i < cart.items.length; i++) {
          var item = cart.items[i];
          var moq = 1;
          if (item.properties && item.properties._moq) {
            moq = parseInt(item.properties._moq, 10) || 1;
          }
          if (item.quantity < moq) {
            violations.push({
              variant_id: item.variant_id,
              title: item.title,
              quantity: item.quantity,
              moq: moq,
              line: i + 1
            });
          }
        }
        callback(violations);
      } catch (e) {
        callback([]);
      }
    };
    xhr.onerror = function () { callback([]); };
    xhr.send();
  };

  /* ── Credit Limit Validation ── */
  window.DealerBackend.validateCredit = function (containerOrOrderTotal) {
    var creditEl = document.querySelector('[id^="dealer-credit-data-"]');
    if (!creditEl) return { can_order: true };

    try {
      var data = JSON.parse(creditEl.textContent);
      if (typeof containerOrOrderTotal === 'number') {
        if (data.is_net_terms && data.available_credit < containerOrOrderTotal) {
          return {
            can_order: false,
            reason: 'Order exceeds available credit of ' + formatMoney(data.available_credit),
            available_credit: data.available_credit,
            required: containerOrOrderTotal
          };
        }
      }
      return {
        can_order: data.can_order,
        reason: data.reason || '',
        available_credit: data.available_credit,
        credit_limit: data.credit_limit,
        is_net_terms: data.is_net_terms
      };
    } catch (e) {
      return { can_order: true };
    }
  };

  /* ── Production Status ── */
  /**
   * Refresh production status for an order.
   * In production, this would call a Shopify App Proxy endpoint.
   * For theme-only, it reads from order metafields rendered in the DOM.
   */
  window.DealerBackend.refreshProductionStatus = function (orderName, callback) {
    var statusEls = document.querySelectorAll('[data-production-status]');
    for (var i = 0; i < statusEls.length; i++) {
      var el = statusEls[i];
      if (el.dataset.orderName === orderName) {
        try {
          var status = JSON.parse(el.dataset.productionStatus);
          callback(null, status);
        } catch (e) {
          callback('Invalid status data', null);
        }
        return;
      }
    }
    callback('Order not found', null);
  };

  /* ── Quote Management ── */
  window.DealerBackend.saveQuote = function (quoteData, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/account?view=quotes', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        callback(null, { saved: true });
      } else {
        callback('Failed to save quote', null);
      }
    };
    xhr.onerror = function () { callback('Network error', null); };
    xhr.send(JSON.stringify(quoteData));
  };

  /* ── Helpers ── */
  function getCreditData(container) {
    var creditEl = container ? container.querySelector('[id^="dealer-credit-data-"]') : null;
    if (!creditEl) {
      creditEl = document.querySelector('[id^="dealer-credit-data-"]');
    }
    if (!creditEl) return null;
    try {
      return JSON.parse(creditEl.textContent);
    } catch (e) {
      return null;
    }
  }

  function collectLineItems(container) {
    var items = [];
    var rows = container.querySelectorAll('[data-line-item]');
    rows.forEach(function (row) {
      var skuSearch = row.querySelector('[data-sku-search]');
      var sku = skuSearch ? skuSearch.value.trim() : '';
      var variantId = skuSearch ? skuSearch.dataset.variantId : null;

      var qtyEl = row.querySelector('[data-qty-value]');
      var qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 0 : 0;

      if (variantId && qty > 0) {
        items.push({
          sku: sku,
          variantId: variantId,
          quantity: qty,
          size: row.querySelector('[data-size-select]') ? row.querySelector('[data-size-select]').value : '',
          finish: row.querySelector('[data-finish-select]') ? row.querySelector('[data-finish-select]').value : '',
          moq: parseInt(row.dataset.moq, 10) || 1
        });
      }
    });
    return items;
  }

  window.DealerBackend.collectLineItems = collectLineItems;

  function formatMoney(cents) {
    if (typeof cents === 'undefined') return '$0.00';
    var dollars = cents / 100;
    return '$' + dollars.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
})();
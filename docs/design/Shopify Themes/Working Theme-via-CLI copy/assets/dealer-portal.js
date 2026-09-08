/**
 * Calder Wheels — Dealer Portal JavaScript
 * Tab navigation, Quick Order line management, SKU autocomplete, quote filters.
 * Wires into DealerBackend for order submission, MOQ, credit, production status.
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initDealerPortal();
  });

  function initDealerPortal() {
    var portal = document.querySelector('.dp-root');
    if (!portal) return;

    initTabNavigation();
    initQuoteSearch();
    initLineItemTotals();
    initCreditDisplay();
    initProductionStatus();
    initCartMOQCheck();
  }

  /* ── Tab Navigation (sidebar links switch content views) ── */
  function initTabNavigation() {
    var tabs = document.querySelectorAll('.dp-nav__link[data-dp-tab]');
    var panels = document.querySelectorAll('.dp-root');

    if (tabs.length === 0 || panels.length <= 1) return;

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        var target = this.getAttribute('data-dp-tab');
        if (target === 'catalog') return;

        tabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
      });
    });
  }

  /* ── Quote Search/Filter ── */
  function initQuoteSearch() {
    var searchInput = document.querySelector('[data-quote-search]');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase();
      var rows = document.querySelectorAll('[data-quote-row]');

      rows.forEach(function(row) {
        var text = row.textContent.toLowerCase();
        row.style.display = text.indexOf(query) > -1 ? '' : 'none';
      });
    });
  }

  /* ── Credit Display Initialization ── */
  function initCreditDisplay() {
    var creditEl = document.querySelector('[id^="dealer-credit-data-"]');
    if (!creditEl) return;

    try {
      var credit = JSON.parse(creditEl.textContent);
      if (!credit.can_order) {
        var submitBtns = document.querySelectorAll('[data-submit-order]');
        submitBtns.forEach(function(btn) {
          btn.disabled = true;
          btn.title = credit.reason || 'Account not in good standing';
          btn.style.opacity = '0.5';
        });

        var notices = document.querySelectorAll('.dp-order-summary');
        notices.forEach(function(summary) {
          var existing = summary.querySelector('.dp-credit-warning');
          if (existing) return;
          var warning = document.createElement('div');
          warning.className = 'dp-credit-warning';
          warning.style.cssText = 'color:#db6e5b;font-size:13px;padding:8px 12px;margin-top:8px;background:rgba(219,110,91,0.1);border-radius:6px;';
          warning.textContent = credit.reason || 'Ordering is currently restricted';
          summary.appendChild(warning);
        });
      }
    } catch (e) {}
  }

  /* ── Production Status Polling ── */
  function initProductionStatus() {
    var statusEls = document.querySelectorAll('[data-production-status]');
    if (statusEls.length === 0) return;

    statusEls.forEach(function(el) {
      var orderName = el.dataset.orderName;
      if (!orderName) return;

      if (window.DealerBackend && window.DealerBackend.refreshProductionStatus) {
        window.DealerBackend.refreshProductionStatus(orderName, function(err, status) {
          if (err || !status) return;
          el.dataset.productionStatus = JSON.stringify(status);
        });
      }
    });
  }

  /* ── Cart MOQ Check ── */
  function initCartMOQCheck() {
    var moqWarnings = document.getElementById('dealer-moq-warnings');
    if (!moqWarnings) return;

    if (window.DealerBackend && window.DealerBackend.checkCartMOQ) {
      window.DealerBackend.checkCartMOQ(function(violations) {
        if (violations.length === 0) return;

        var checkoutBtn = document.querySelector('[name="checkout"], .checkout-btn, #checkout');
        if (checkoutBtn) {
          checkoutBtn.disabled = true;
          checkoutBtn.style.opacity = '0.5';
          checkoutBtn.title = 'Please resolve MOQ violations before checkout';

          var moqNotice = document.createElement('div');
          moqNotice.style.cssText = 'color:#db6e5b;font-size:14px;padding:12px;margin:8px 0;background:rgba(219,110,91,0.1);border-radius:6px;text-align:center;';
          moqNotice.textContent = violations.length + ' item(s) do not meet minimum order quantities. Please update before checkout.';
          checkoutBtn.parentNode.insertBefore(moqNotice, checkoutBtn);
        }
      });
    }
  }

  /* ── Line Item Total Calculation (for quick order tables) ── */
  function initLineItemTotals() {
    var tables = document.querySelectorAll('[data-line-items-table]');
    tables.forEach(function(table) {
      table.addEventListener('change', function(e) {
        var target = e.target;
        if (target.matches('[data-qty-minus], [data-qty-plus]') ||
            target.matches('[data-size-select], [data-finish-select]')) {
          updateTableTotals(table.closest('.dp-root'));
        }
      });
    });
  }

  function updateTableTotals(container) {
    if (!container) return;
    var rows = container.querySelectorAll('[data-line-item]');
    var totalItems = 0;
    var grandTotal = 0;

    rows.forEach(function(row, index) {
      var qtyEl = row.querySelector('[data-qty-value]');
      var qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 0 : 0;
      totalItems += qty;

      var unitPriceEl = row.querySelector('[data-unit-price]');
      var price = 0;
      if (unitPriceEl && unitPriceEl.textContent !== '—') {
        price = parseFloat(unitPriceEl.textContent.replace(/[^0-9.]/g, '')) || 0;
      }
      grandTotal += qty * price;
    });

    var orderSummary = container.querySelector('.dp-order-summary');
    if (orderSummary) {
      var lines = orderSummary.querySelectorAll('.dp-order-summary__line');
      if (lines[0]) {
        lines[0].querySelectorAll('span')[1].textContent = 'Items (' + totalItems + ')';
      }
      if (lines[1]) {
        lines[1].querySelectorAll('span')[1].textContent = grandTotal > 0 ? '$' + grandTotal.toFixed(2) : '—';
      }
      if (lines[lines.length - 1]) {
        lines[lines.length - 1].querySelectorAll('span')[1].textContent = grandTotal > 0 ? '$' + grandTotal.toFixed(2) : '—';
      }
    }
  }
})();
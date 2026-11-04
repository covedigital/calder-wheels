(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     Calder Wheels — QuickBooks Enterprise Desktop component
     inventory (DEMO DATASET)

     Production: QuickBooks Enterprise Desktop is the true source of
     component inventory. An n8n server polls QB via remote access on a
     cron schedule and publishes the payload below
     (window.CALDER_QUICKBOOKS_INVENTORY) to the storefront — same shape,
     same part numbers, fresh on_hand counts. This file is the demo stand-in
     and mimics that connection 1:1 so the storefront code never changes
     when the real feed lands.

     Inventory model (AGENTS.md §Inventory Model):
       Finished wheel = Diameter barrel blank + Center + Barrel/Lip + Hardware (N bolts)
       A configuration is orderable only when every required component has
       enough stock to cover the requested quantity.

     Every component carries the part number that exists in QuickBooks:
       CAL-<design>-C-<FIN>     center, per design + finish   (1 per wheel)
       CAL-<design>-B-<FIN>     barrel/lip, per design + finish (1 per wheel)
       CAL-<design>-D-<size>    barrel blank / diameter, per design (1 per wheel)
       CAL-H-<FIN>              hardware & rivets (20 bolts = 1 wheel set)
     ───────────────────────────────────────────────────────────── */

  if (window._calderDemoInventory) return;

  var BOLTS_PER_WHEEL = 20;

  /* ─── QB on-hand quantities per part (demo values) ───
     STOCK is keyed by JB design number. Center finishes:
       BK = Black Tint, BKUTI = Gloss Black, SU = Titanium Tint
     Barrel/lip finishes: BK = Black, POLISH = Polish/Chrome lip.
     Diameters are barrel blanks (one per wheel).
     Low rows (e.g. design 204 SU: 4, 26" blanks: 2-3) exist so testers can
     reproduce the out-of-stock state with quantity 4 (audit example 3). */
  var STOCK = {
    '201': { center: { BK: 25, BKUTI: 18, SU: 12 }, barrel: { BK: 40, POLISH: 35 }, diameter: { '18': 9, '19': 7, '20': 11, '21': 6, '22': 14, '23': 5, '24': 8, '26': 3 } },
    '202': { center: { BK: 20, BKUTI: 15, SU: 10 }, barrel: { BK: 32, POLISH: 27 }, diameter: { '18': 6, '19': 5, '20': 9,  '21': 4, '22': 12, '23': 4, '24': 7, '26': 2 } },
    '203': { center: { BK: 30, BKUTI: 22, SU: 8  }, barrel: { BK: 44, POLISH: 30 }, diameter: { '18': 8, '19': 6, '20': 10, '21': 5, '22': 13, '23': 6, '24': 6, '26': 2 } },
    '204': { center: { BK: 14, BKUTI: 9,  SU: 4  }, barrel: { BK: 22, POLISH: 18 }, diameter: { '18': 5, '19': 3, '20': 7,  '21': 3, '22': 9,  '23': 2, '24': 5, '26': 2 } },
    '205': { center: { BK: 15, BKUTI: 10, SU: 5  }, barrel: { BK: 24, POLISH: 20 }, diameter: { '18': 4, '19': 3, '20': 6,  '21': 3, '22': 8,  '23': 3, '24': 4, '26': 1 } },
    '206': { center: { BK: 16, BKUTI: 11, SU: 6  }, barrel: { BK: 26, POLISH: 21 }, diameter: { '18': 5, '19': 4, '20': 8,  '21': 4, '22': 10, '23': 3, '24': 5, '26': 2 } },
    '207': { center: { BK: 28, BKUTI: 20, SU: 14 }, barrel: { BK: 38, POLISH: 33 }, diameter: { '18': 7, '19': 5, '20': 12, '21': 6, '22': 15, '23': 5, '24': 9, '26': 3 } }
  };

  var HARDWARE = {
    'CAL-H-BK':     { description: 'Hardware & Rivets — Black (20-bolt wheel set)', on_hand: 500 },
    'CAL-H-CHROME': { description: 'Hardware & Rivets — Chrome (20-bolt wheel set)', on_hand: 400 }
  };

  var CENTER_FINISH_NAMES = { BK: 'Black Tint', BKUTI: 'Gloss Black', SU: 'Titanium Tint' };
  var BARREL_FINISH_NAMES = { BK: 'Black', POLISH: 'Polish' };

  /* ─── Flatten STOCK into the QuickBooks part list ─── */
  var PARTS = {};
  Object.keys(STOCK).forEach(function (design) {
    Object.keys(STOCK[design].center).forEach(function (code) {
      PARTS['CAL-' + design + '-C-' + code] = {
        description: 'Center — ' + CENTER_FINISH_NAMES[code] + ' (Design ' + design + ')',
        on_hand: STOCK[design].center[code]
      };
    });
    Object.keys(STOCK[design].barrel).forEach(function (code) {
      PARTS['CAL-' + design + '-B-' + code] = {
        description: 'Barrel & Lip — ' + BARREL_FINISH_NAMES[code] + ' (Design ' + design + ')',
        on_hand: STOCK[design].barrel[code]
      };
    });
    Object.keys(STOCK[design].diameter).forEach(function (size) {
      PARTS['CAL-' + design + '-D-' + size] = {
        description: 'Barrel Blank — ' + size + '" (Design ' + design + ')',
        on_hand: STOCK[design].diameter[size]
      };
    });
  });
  Object.keys(HARDWARE).forEach(function (pn) {
    PARTS[pn] = HARDWARE[pn];
  });

  /* ─── Published payload — the exact shape n8n will deliver ─── */
  window.CALDER_QUICKBOOKS_INVENTORY = {
    source: 'quickbooks-enterprise-desktop-demo',
    synced_at: '2026-10-28T09:00:00Z',
    parts: PARTS
  };

  /* ─── Finish label → component finish code maps ─── */
  var DESIGN_CODE_TO_NUMBER = {
    'clm-01': '201', 'clm-02': '202', 'clm-03': '203',
    'clm-05': '204', 'clb-06': '206', 'clb-07': '207',
    /* Rename aliases (2026-11-02 G): renamed universal products CLM-06 /
       CLM-07 resolve their (unchanged) CLB-06 / CLB-07 design data.
       No stock values or behavior change — key-level compatibility only. */
    'clm-06': '206', 'clm-07': '207'
  };

  var CENTER_LABEL_CODES = { 'black tint': 'BK', 'gloss black': 'BKUTI', 'titanium tint': 'SU' };
  var BARREL_LABEL_CODES = { black: 'BK', chrome: 'POLISH', polish: 'POLISH', 'polished': 'POLISH', 'polished lip': 'POLISH', 'gloss black': 'BK', 'black lip': 'BK', 'satin lip': 'SU' };
  var HARDWARE_LABEL_CODES = { black: 'BK', 'black bolts': 'BK', chrome: 'CHROME', 'chrome bolts': 'CHROME' };

  /* ─── Resolve the JB design number for a product (same authority as
         configurator-product-data.liquid: design_number metafield, then
         design_code mapping, then a numeric design_nickname) ─── */
  function entryFor(store, pid) {
    if (!store) return null;
    if (store[pid]) return store[pid];
    for (var k in store) {
      if (Object.prototype.hasOwnProperty.call(store, k)) {
        var e = store[k];
        if (e && (String(e.product_id) === pid || String(e.product_handle) === pid)) return e;
      }
    }
    return null;
  }

  function resolveDesignNumber(productId) {
    var pid = String(productId);
    var entry = entryFor(window._calderProductData, pid) || entryFor(window._bywProductData, pid) || window._calderProductComponents;

    if (entry) {
      if (entry.design_number) return String(entry.design_number);
      var mapped = entry.design_code ? DESIGN_CODE_TO_NUMBER[String(entry.design_code).toLowerCase()] : null;
      if (mapped) return mapped;
    }
    if (window._calderDesignCode) {
      var mappedGlobal = DESIGN_CODE_TO_NUMBER[String(window._calderDesignCode).toLowerCase()];
      if (mappedGlobal) return mappedGlobal;
    }
    /* Last resort: numeric token in the product URL handle (20x). */
    var match = window.location.pathname.match(/\/products\/([^/]+)/);
    if (match) {
      var parts = match[1].split('-');
      for (var i = 0; i < parts.length; i++) {
        if (/^20[1-9]$/.test(parts[i])) return parts[i];
      }
    }
    return '201';
  }

  function normalizeLabel(value) {
    return String(value == null ? '' : value).trim().toLowerCase();
  }

  /* Build one component line: part number, on-hand, needed, verdict. */
  function buildComponent(type, label, partNumber, qty) {
    var part = partNumber ? PARTS[partNumber] : null;
    var units = 0;
    if (part) {
      units = (type === 'hardware')
        ? Math.floor(part.on_hand / BOLTS_PER_WHEEL)
        : part.on_hand;
    }
    return {
      type: type,
      label: label,
      part_number: partNumber || '',
      on_hand: part ? part.on_hand : null,
      needed: qty,
      available_units: units,
      ok: !!part && units >= qty
    };
  }

  /* ─── Public API ─── */

  window._calderDemoInventory = {

    /* Quantity-aware availability for a full configuration.
       Returns:
         known      — false when any component has no QuickBooks part
                      (missing data is NEVER reported as confirmed stock)
         available_to_build — max wheels buildable with current stock
         components — per-component { part_number, on_hand, needed, ok }
    */
    getAvailabilityStatus: function (productId, diameter, center, barrel, hardware, quantity) {
      var qty = Math.max(1, parseInt(quantity, 10) || 1);
      var design = resolveDesignNumber(productId);

      var diamLabel = String((diameter && (diameter.label || diameter.id)) || '').trim();
      var diamDigits = diamLabel.replace(/[^0-9]/g, '');
      var diamPart = diamDigits ? 'CAL-' + design + '-D-' + diamDigits : null;

      var centerCode = CENTER_LABEL_CODES[normalizeLabel(center && (center.label || center.id))] || null;
      var barrelCode = BARREL_LABEL_CODES[normalizeLabel(barrel && (barrel.label || barrel.id))] || null;
      var hardwareCode = HARDWARE_LABEL_CODES[normalizeLabel(hardware && (hardware.label || hardware.id))] || null;

      var components = {
        diameter: [],
        center: [],
        barrel: [],
        hardware: []
      };
      if (diamLabel) {
        components.diameter.push(buildComponent('diameter', diamLabel, diamPart, qty));
      }
      components.center.push(buildComponent('center', (center && (center.label || center.id)) || '', centerCode ? 'CAL-' + design + '-C-' + centerCode : null, qty));
      components.barrel.push(buildComponent('barrel', (barrel && (barrel.label || barrel.id)) || '', barrelCode ? 'CAL-' + design + '-B-' + barrelCode : null, qty));
      components.hardware.push(buildComponent('hardware', (hardware && (hardware.label || hardware.id)) || '', hardwareCode ? 'CAL-H-' + hardwareCode : null, qty));

      var known = true;
      var buildable = Infinity;
      ['diameter', 'center', 'barrel', 'hardware'].forEach(function (type) {
        if (!components[type].length) return;
        var line = components[type][0];
        if (!line.part_number) known = false;
        if (line.available_units < buildable) buildable = line.available_units;
      });
      buildable = (known && isFinite(buildable)) ? Math.max(0, buildable) : 0;

      return {
        known: known,
        available_to_build: buildable,
        design_number: design,
        requested_quantity: qty,
        components: components
      };
    },

    /* Max wheels buildable for a configuration (legacy consumer shape). */
    getAvailableToBuild: function (productId, diameter, center, barrel, hardware) {
      var status = this.getAvailabilityStatus(productId, diameter, center, barrel, hardware, 1);
      return status.known ? status.available_to_build : 0;
    },

    /* Component-level stock detail (legacy consumer shape, now
       quantity- and part-number aware). */
    getComponentDetails: function (productId, center, barrel, hardware, quantity) {
      return this.getAvailabilityStatus(productId, null, center, barrel, hardware, quantity || 1);
    },

    getAllStock: function () {
      var result = {};
      for (var key in PARTS) {
        if (Object.prototype.hasOwnProperty.call(PARTS, key)) {
          result[key] = { description: PARTS[key].description, on_hand: PARTS[key].on_hand };
        }
      }
      return result;
    },

    /* Simulate a QuickBooks deduction (demo tooling only). */
    deductComponents: function (productId, center, barrel, hardware, quantity) {
      var qty = Math.max(1, parseInt(quantity, 10) || 1);
      var status = this.getAvailabilityStatus(productId, null, center, barrel, hardware, qty);
      ['center', 'barrel', 'hardware'].forEach(function (type) {
        var pn = status.components[type][0].part_number;
        if (pn && PARTS[pn]) {
          PARTS[pn].on_hand -= (type === 'hardware') ? qty * BOLTS_PER_WHEEL : qty;
        }
      });
      if (window.console && console.info) {
        console.info('[Calder Demo Inventory] Deducted ' + qty + ' wheel(s) against QuickBooks demo parts.');
      }
      return true;
    }
  };

  if (window.console && console.info) {
    console.info('[Calder Demo Inventory] Loaded. ' +
      Object.keys(PARTS).length + ' QuickBooks component parts tracked (demo dataset).');
  }

})();

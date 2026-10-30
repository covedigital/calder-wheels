(function () {
  'use strict';

  var SECTION_SELECTOR = '.cw-fitment-guide';
  var STORAGE_KEY = 'calder_selected_vehicle';
  var fitmentData = null;

  function getSection(el) {
    return el.closest ? el.closest(SECTION_SELECTOR) : null;
  }

  function getSectionId(section) {
    return section ? section.getAttribute('data-section-id') : null;
  }

  function q(section, sel) {
    return section ? section.querySelector(sel) : null;
  }

  function qa(section, sel) {
    return section ? Array.prototype.slice.call(section.querySelectorAll(sel)) : [];
  }

  /* ── Data loading ── */

  function loadFitmentData(callback) {
    if (fitmentData) {
      callback(fitmentData);
      return;
    }
    var configEl = document.getElementById('calder-fitment-guide-config');
    if (!configEl) { callback([]); return; }
    var config;
    try { config = JSON.parse(configEl.textContent); } catch (e) { callback([]); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', config.dataUrl, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var parsed = JSON.parse(xhr.responseText);
          fitmentData = parsed.vehicles || [];
          window.__cwFitmentData = fitmentData;
          callback(fitmentData);
          return;
        } catch (e) {}
      }
      callback([]);
    };
    xhr.onerror = function () { callback([]); };
    xhr.send();
  }

  /* ── Vehicle persistence ── */

  function saveVehicle(v) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch (e) {}
  }

  function loadVehicle() {
    try { var d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch (e) { return null; }
  }

  /* ── Dropdown populating ── */

  function populateYears(section, data) {
    var sel = q(section, '[data-guide-year]');
    if (!sel) return;
    var years = {};
    data.forEach(function (v) { if (v.y) years[v.y] = true; });
    var sorted = Object.keys(years).map(Number).sort(function (a, b) { return b - a; });
    sel.innerHTML = '<option value="">' + (sel.getAttribute('data-placeholder') || 'Select Year') + '</option>';
    sorted.forEach(function (y) {
      var opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      sel.appendChild(opt);
    });
    sel.disabled = false;
    var vehicle = loadVehicle();
    if (vehicle && vehicle.year) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === String(vehicle.year)) {
          sel.value = String(vehicle.year);
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
  }

  function populateMakes(section, data, year) {
    var sel = q(section, '[data-guide-make]');
    var modelSel = q(section, '[data-guide-model]');
    if (!sel) return;
    modelSel.innerHTML = '<option value="">' + (modelSel.getAttribute('data-placeholder') || 'Select Model') + '</option>';
    modelSel.disabled = true;
    var makes = {};
    data.forEach(function (v) { if (v.y === year) makes[v.m] = true; });
    var sorted = Object.keys(makes).sort();
    sel.innerHTML = '<option value="">' + (sel.getAttribute('data-placeholder') || 'Select Make') + '</option>';
    sorted.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      sel.appendChild(opt);
    });
    sel.disabled = false;
    var vehicle = loadVehicle();
    if (vehicle && vehicle.make && year === vehicle.year) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === vehicle.make) {
          sel.value = vehicle.make;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
  }

  function populateModels(section, data, year, make) {
    var sel = q(section, '[data-guide-model]');
    if (!sel) return;
    var models = {};
    data.forEach(function (v) { if (v.y === year && v.m === make) models[v.M] = true; });
    var sorted = Object.keys(models).sort();
    sel.innerHTML = '<option value="">' + (sel.getAttribute('data-placeholder') || 'Select Model') + '</option>';
    sorted.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      sel.appendChild(opt);
    });
    sel.disabled = false;
    var vehicle = loadVehicle();
    if (vehicle && vehicle.model && year === vehicle.year && make === vehicle.make) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === vehicle.model) {
          sel.value = vehicle.model;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
  }

  /* ── Fitment display ── */

  function getVehicle(data, year, make, model) {
    for (var i = 0; i < data.length; i++) {
      var v = data[i];
      if (v.y === year && v.m === make && v.M === model) return v;
    }
    return null;
  }

  function getConfig(config) {
    var id = document.getElementById('calder-fitment-guide-config');
    if (!id) return {};
    try { return JSON.parse(id.textContent); } catch (e) { return {}; }
  }

  /* ── Status determination ──
   *
   * Precedence:
   * 1. Explicit verified compatibility record → VERIFIED
   * 2. Known unresolved condition (staggered, no brake data) → REVIEW
   * 3. Vehicle match in reference data → DATA_AVAILABLE
   * 4. No match → NO_DATA
   *
   * NOTE: The existing PDP displays "Fits Your Vehicle" as a presentation
   * label, NOT as authoritative verification. The PDP's fitment-finder.js
   * only matches bolt pattern + diameter range (reference matching), not
   * technical verification. Verified Fitment is never shown without an
   * explicit verification record — none currently exist in the dataset.
   */

  var VERIFICATION_RECORDS = null;
  var VERIFIED_IDS = {};

  function loadVerificationRecords(callback) {
    if (VERIFICATION_RECORDS) { callback(VERIFICATION_RECORDS); return; }
    VERIFICATION_RECORDS = {};
    callback(VERIFICATION_RECORDS);
  }

  function resolveStatus(vehicle, configIndex) {
    var cfg = vehicle.cf[configIndex || 0];

    // 1. Check explicit verification record
    var vkey = vehicle.y + '|' + vehicle.m + '|' + vehicle.M + '|' + (cfg ? cfg.z : '');
    if (VERIFIED_IDS[vkey]) {
      return { status: 'verified', label: 'Verified Fitment', note: null };
    }

    // 2. Staggered fitments require specialist review
    var hasStaggered = cfg ? (cfg.isStaggered || vehicle.st) : vehicle.st;
    if (hasStaggered) {
      return { status: 'verification-required', label: 'Verification Required', note: 'Staggered fitment requires specialist review.' };
    }

    // 3. Vehicle found in reference dataset
    return { status: 'data-available', label: 'Fitment Data Available', note: null };
  }

  var STATUS_ICONS = {
    'verified': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    'data-available': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    'verification-required': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'no-data': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  };

  /* ── Wheel catalog filtering (mirrors fitment-finder.js filterByVehicle) ── */

  function filterGuideWheels(products, vehicle) {
    if (!products || !vehicle) return [];
    var bp = (vehicle.b || '').replace(/\s+/g, '').replace(/\.\d+$/, '').toLowerCase();
    var minDia = 99, maxDia = 0;
    if (vehicle.cf) {
      vehicle.cf.forEach(function (c) {
        var dia = parseFloat((c.z || '').split('x')[0]);
        if (dia && dia < minDia) minDia = dia;
        if (dia && dia > maxDia) maxDia = dia;
      });
    }
    if (minDia === 99) minDia = 0;
    if (maxDia === 0) maxDia = 999;
    var normBp = function (s) { return String(s || '').replace(/\s+/g, '').replace(/\.\d+$/, '').toLowerCase(); };
    function matchesBoltPattern(p) {
      var list = [];
      if (p.bolt_patterns && p.bolt_patterns.length) list = p.bolt_patterns;
      else if (p.bolt_pattern) list = [p.bolt_pattern];
      for (var i = 0; i < list.length; i++) {
        if (normBp(list[i]) === bp) return true;
      }
      return false;
    }
    return products.filter(function (p) {
      if (!matchesBoltPattern(p)) return false;
      var hasDiameterInRange = false;
      if (p.diameters && p.diameters.length > 0) {
        for (var d = 0; d < p.diameters.length; d++) {
          var dia = parseFloat(p.diameters[d]);
          if (dia >= minDia && dia <= maxDia) { hasDiameterInRange = true; break; }
        }
      }
      return hasDiameterInRange;
    });
  }

  function buildWheelsHtml(matched, vehicle) {
    if (!matched || !matched.length) {
      return '<div class="cw-fitment-guide__wheels"><p class="cw-fitment-guide__wheels-no-results">No wheels found for this vehicle.</p></div>';
    }
    var bp = (vehicle.b || '').replace(/\.\d+$/, '').toLowerCase();
    var filterUrl = '/collections/all?filter.p.m.custom.bolt_pattern=' + encodeURIComponent(bp);
    var matchedDiameters = {};
    matched.forEach(function (p) {
      var labels = p.diameter_labels && p.diameter_labels.length ? p.diameter_labels : (p.diameters || []).map(function (d) { return d + '"'; });
      labels.forEach(function (label) {
        matchedDiameters[String(parseFloat(label))] = label;
      });
    });
    Object.keys(matchedDiameters).sort(function (a, b) { return parseFloat(a) - parseFloat(b); }).forEach(function (k) {
      filterUrl += '&filter.v.option.diameter=' + encodeURIComponent(matchedDiameters[k]);
    });
    var html = '<div class="cw-fitment-guide__wheels">';
    html += '<div class="cw-fitment-guide__wheels-count">' + matched.length + ' compatible wheel' + (matched.length !== 1 ? 's' : '') + ' found</div>';
    html += '<div class="cw-fitment-guide__wheels-grid">';
    for (var i = 0; i < matched.length; i++) {
      var prod = matched[i];
      var codeLabel = prod.design_code || '';
      var nameLabel = prod.nickname || '';
      var subtitle = codeLabel ? (nameLabel ? codeLabel + ' \u00B7 ' + nameLabel : codeLabel) : nameLabel;
      var diaRange = '';
      if (prod.diameter_labels && prod.diameter_labels.length) {
        var diaNums = prod.diameter_labels.map(function (d) { return parseFloat(d); }).filter(function (n) { return !isNaN(n); }).sort(function (a, b) { return a - b; });
        if (diaNums.length) diaRange = diaNums[0] + '"' + (diaNums.length > 1 ? '\u2013' + diaNums[diaNums.length - 1] + '"' : '');
      }
      var finishCount = prod.finishes && prod.finishes.length ? prod.finishes.length : 0;
      var metaParts = [];
      if (diaRange) metaParts.push(diaRange);
      if (finishCount > 0) metaParts.push(finishCount + ' finish' + (finishCount !== 1 ? 'es' : ''));
      if (prod.construction) metaParts.push(prod.construction);
      html += '<a href="' + prod.url + '" class="cw-fitment-guide__wheel-card">';
      if (prod.featured_image) {
        html += '<img src="' + prod.featured_image + '" alt="' + prod.title + '" class="cw-fitment-guide__wheel-image" loading="lazy">';
      }
      html += '<div class="cw-fitment-guide__wheel-info">';
      html += '<span class="cw-fitment-guide__wheel-title">' + prod.title + '</span>';
      if (subtitle) html += '<span class="cw-fitment-guide__wheel-subtitle">' + subtitle + '</span>';
      if (metaParts.length) html += '<span class="cw-fitment-guide__wheel-meta">' + metaParts.join(' \u00B7 ') + '</span>';
      if (prod.price) {
        html += '<span class="cw-fitment-guide__wheel-price">$' + prod.price + '</span>';
      }
      html += '</div>';
      html += '</a>';
    }
    html += '</div>';
    html += '<div class="cw-fitment-guide__wheels-action"><a href="' + filterUrl + '" class="btn btn--primary">View All Compatible Wheels</a></div>';
    html += '</div>';
    return html;
  }

  function renderResults(section, vehicle, configIndex) {
    var config = getConfig();
    var defaultImages = config.defaultImages || {};
    var categories = config.vehicleCategories || {};

    var resultsEl = q(section, '[data-guide-results]');
    if (!resultsEl) return;

    var cfg = vehicle.cf[configIndex || 0];
    if (!cfg) cfg = vehicle.cf[0];
    if (!cfg) { resultsEl.innerHTML = '<div class=\"cw-fitment-guide__no-data\"><p>No configuration data available.</p></div>'; return; }

    var displayName = vehicle.y + ' ' + vehicle.m + ' ' + vehicle.M;
    var hasStaggered = cfg ? (cfg.isStaggered || vehicle.st) : vehicle.st;

    var sizeStr = cfg ? (cfg.z || '') : '';
    var offsetStr = cfg ? (cfg.o || '') : '';
    var tireStr = cfg ? (cfg.t || '') : '';
    // Dataset stores bolt patterns with an uppercase "X" (e.g. 6X139);
    // normalize to lowercase for display and filter URLs (5x112 style,
    // matching the store's bolt_pattern metafield format).
    var bp = (vehicle.b || '').toString().toLowerCase();
    var hub = vehicle.h || '';

    var bpDisplay = bp;

    var cat = categories[vehicle.m] || 'SUV / Crossover';
    if (config.vehicleModelImages) {
      var yearKey = vehicle.y + '|' + vehicle.m + '|' + vehicle.M;
      var modelKey = vehicle.m + '|' + vehicle.M;
      if (config.vehicleModelImages[yearKey]) {
        cat = config.vehicleModelImages[yearKey];
      } else if (config.vehicleModelImages[modelKey]) {
        cat = config.vehicleModelImages[modelKey];
      }
    }
    var imgSrc = defaultImages[cat] || '';

    // Resolve status
    loadVerificationRecords(function () {
      /* verification records loaded */
    });
    var statusResult = resolveStatus(vehicle, configIndex);

    var statusHtml = '<div class=\"cw-fitment-guide__status cw-fitment-guide__status--' + statusResult.status + '\">';
    statusHtml += '<span class=\"cw-fitment-guide__status-icon\">' + (STATUS_ICONS[statusResult.status] || STATUS_ICONS['data-available']) + '</span>';
    statusHtml += '<span class=\"cw-fitment-guide__status-label\">' + statusResult.label + '</span>';
    statusHtml += '</div>';
    var reviewNoteHtml = statusResult.note ? '<div class=\"cw-fitment-guide__status-review-note\">' + statusResult.note + '</div>' : '';

    // Configurations list
    var configHtml = '';
    if (vehicle.cf.length > 1) {
      configHtml += '<div class=\"cw-fitment-guide__configurations\">';
      configHtml += '<div class=\"cw-fitment-guide__config-label\">Available Configurations</div>';
      configHtml += '<div class=\"cw-fitment-guide__config-list\" data-guide-config-list>';
      vehicle.cf.forEach(function (c, idx) {
        var isActive = idx === (configIndex || 0);
        configHtml += '<button type=\"button\" class=\"cw-fitment-guide__config-btn' + (isActive ? ' is-active' : '') + '\" data-guide-config-idx=\"' + idx + '\">' + c.z + '</button>';
      });
      configHtml += '</div></div>';
    }

    var staggerHtml = '';
    if (hasStaggered && cfg.rearSize) {
      staggerHtml = '<div class=\"cw-fitment-guide__spec-staggered\">';
      staggerHtml += '<div class=\"cw-fitment-guide__spec-axle\"><div class=\"cw-fitment-guide__spec-axle-label\">Front</div>' + cfg.frontSize + ' / ' + cfg.frontOffset + ' / ' + cfg.frontTire + '</div>';
      staggerHtml += '<div class=\"cw-fitment-guide__spec-axle\"><div class=\"cw-fitment-guide__spec-axle-label\">Rear</div>' + cfg.rearSize + ' / ' + cfg.rearOffset + ' / ' + cfg.rearTire + '</div>';
      staggerHtml += '</div>';
    }

    // Wheel results
    var wheelsHtml = '';
    if (window.__fitmentCatalog && window.__fitmentCatalog.length > 0) {
      var matched = filterGuideWheels(window.__fitmentCatalog, vehicle);
      wheelsHtml = buildWheelsHtml(matched, vehicle);
    }

    var detailsHtml = '';
    detailsHtml += '<button type=\"button\" class=\"cw-fitment-guide__details-toggle\" data-guide-details-toggle aria-expanded=\"false\">';
    detailsHtml += '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"/></svg>';
    detailsHtml += ' View Full Fitment Details';
    detailsHtml += '<svg class=\"cw-fitment-guide__toggle-chevron\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"/></svg>';
    detailsHtml += '</button>';
    detailsHtml += '<div class=\"cw-fitment-guide__details-panel\" data-guide-details-panel>';
    detailsHtml += '<div class=\"cw-fitment-guide__details-inner\">';
    detailsHtml += '<div class=\"cw-fitment-guide__detail-item\"><div class=\"cw-fitment-guide__detail-term\">Bolt Pattern (PCD)</div><div class=\"cw-fitment-guide__detail-desc\">' + bpDisplay + ' — The number of mounting holes and the diameter of the bolt circle.</div></div>';
    detailsHtml += '<div class=\"cw-fitment-guide__detail-item\"><div class=\"cw-fitment-guide__detail-term\">Center Bore</div><div class=\"cw-fitment-guide__detail-desc\">' + hub + 'mm — The diameter of the wheel\'s center opening relative to the vehicle hub.</div></div>';
    detailsHtml += '<div class=\"cw-fitment-guide__detail-item\"><div class=\"cw-fitment-guide__detail-term\">Wheel Diameter</div><div class=\"cw-fitment-guide__detail-desc\">' + sizeStr + ' — The nominal diameter of the wheel.</div></div>';
    detailsHtml += '<div class=\"cw-fitment-guide__detail-item\"><div class=\"cw-fitment-guide__detail-term\">Wheel Width</div><div class=\"cw-fitment-guide__detail-desc\">' + (sizeStr.split('x')[1] || '') + ' — The nominal width of the wheel between the bead seats.</div></div>';
    detailsHtml += '<div class=\"cw-fitment-guide__detail-item\"><div class=\"cw-fitment-guide__detail-term\">Offset</div><div class=\"cw-fitment-guide__detail-desc\">' + offsetStr + ' — The position of the wheel mounting surface relative to the wheel centerline.</div></div>';
    detailsHtml += '<div class=\"cw-fitment-guide__detail-item\"><div class=\"cw-fitment-guide__detail-term\">Recommended Tire</div><div class=\"cw-fitment-guide__detail-desc\">' + tireStr + ' — A reference tire specification associated with this configuration.</div></div>';
    if (hasStaggered) {
      detailsHtml += '<div class=\"cw-fitment-guide__detail-item\"><div class=\"cw-fitment-guide__detail-term\">Staggered Fitment</div><div class=\"cw-fitment-guide__detail-desc\">Front and rear wheels use different dimensions for optimized handling.</div></div>';
    }
    detailsHtml += '</div></div>';

    resultsEl.innerHTML = '';
    resultsEl.style.display = '';

    var leftCol = document.createElement('div');
    leftCol.className = 'cw-fitment-guide__image-container';
    leftCol.innerHTML = '<img src=\"' + imgSrc + '\" alt=\"' + vehicle.m + ' ' + vehicle.M + '\" class=\"cw-fitment-guide__image\" loading=\"lazy\">';

    var rightCol = document.createElement('div');
    rightCol.className = 'cw-fitment-guide__vehicle-info';

    rightCol.innerHTML =
      '<div class=\"cw-fitment-guide__vehicle-heading\">' +
        '<h3 class=\"cw-fitment-guide__vehicle-name\">' + displayName + '</h3>' +
        statusHtml +
      '</div>' +
      reviewNoteHtml +
      '<div class=\"cw-fitment-guide__specs\">' +
        '<div class=\"cw-fitment-guide__spec-col\"><div class=\"cw-fitment-guide__spec-heading\">Size</div><div class=\"cw-fitment-guide__spec-value\">' + sizeStr + '</div></div>' +
        '<div class=\"cw-fitment-guide__spec-col\"><div class=\"cw-fitment-guide__spec-heading\">Bolt Pattern</div><div class=\"cw-fitment-guide__spec-value\">' + bpDisplay + '</div></div>' +
        '<div class=\"cw-fitment-guide__spec-col\"><div class=\"cw-fitment-guide__spec-heading\">Offset</div><div class=\"cw-fitment-guide__spec-value\">' + offsetStr + '</div></div>' +
        '<div class=\"cw-fitment-guide__spec-col\"><div class=\"cw-fitment-guide__spec-heading\">Center Bore</div><div class=\"cw-fitment-guide__spec-value\">' + hub + 'mm</div></div>' +
        '<div class=\"cw-fitment-guide__spec-col\"><div class=\"cw-fitment-guide__spec-heading\">Tire</div><div class=\"cw-fitment-guide__spec-value\">' + tireStr + '</div></div>' +
      '</div>' +
      configHtml +
      wheelsHtml +
      detailsHtml;

    resultsEl.appendChild(leftCol);
    resultsEl.appendChild(rightCol);

    // Wire up config buttons
    var configBtns = qa(rightCol, '[data-guide-config-idx]');
    configBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-guide-config-idx'));
        renderResults(section, vehicle, idx);
      });
    });

    // Wire up details toggle
    var toggle = q(rightCol, '[data-guide-details-toggle]');
    var panel = q(rightCol, '[data-guide-details-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var isOpen = panel.classList.contains('is-open');
        panel.classList.toggle('is-open');
        toggle.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', !isOpen);
      });
    }

    saveVehicle(Object.assign({}, vehicle, {
      year: vehicle.y, make: vehicle.m, model: vehicle.M,
      display_name: [vehicle.y, vehicle.m, vehicle.M].filter(Boolean).join(' ')
    }));
  }

  function showNoFitment(section) {
    var resultsEl = q(section, '[data-guide-results]');
    if (!resultsEl) return;
    resultsEl.innerHTML =
      '<div class=\"cw-fitment-guide__no-data\">' +
        '<div class=\"cw-fitment-guide__no-data-icon\">' +
          '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"/><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"/></svg>' +
        '</div>' +
        '<div class=\"cw-fitment-guide__no-data-text\">No Fitment Data</div>' +
        '<div class=\"cw-fitment-guide__no-data-sub\">We don\'t have fitment data for this vehicle yet. Contact our specialists for assistance.</div>' +
      '</div>';
    resultsEl.style.display = '';
  }

  /* ── Events ── */

  function hideResults(section) {
    var el = q(section, '[data-guide-results]');
    if (el) { el.style.display = 'none'; el.innerHTML = ''; }
  }

  function initSection(section) {
    var id = section.getAttribute('data-section-id');
    if (section.dataset.guideInitialized === 'true') return;
    section.dataset.guideInitialized = 'true';

    var yearSel = q(section, '[data-guide-year]');
    var makeSel = q(section, '[data-guide-make]');
    var modelSel = q(section, '[data-guide-model]');
    var submitBtn = q(section, '[data-guide-submit]');
    var assistanceBtn = q(section, '[data-guide-assistance]');
    var faqBtn = q(section, '[data-guide-faq-toggle]');
    var faqPanel = q(section, '[data-guide-faq-panel]');

    loadFitmentData(function (data) {
      if (!data || !data.length) {
        if (submitBtn) submitBtn.disabled = true;
        return;
      }

      loadVerificationRecords(function () {
        populateYears(section, data);
      });

      yearSel.addEventListener('change', function () {
        hideResults(section);
        var y = parseInt(this.value);
        if (y) {
          populateMakes(section, data, y);
        } else {
          makeSel.innerHTML = '<option value="">' + (makeSel.getAttribute('data-placeholder') || 'Select Make') + '</option>';
          makeSel.disabled = true;
          modelSel.innerHTML = '<option value="">' + (modelSel.getAttribute('data-placeholder') || 'Select Model') + '</option>';
          modelSel.disabled = true;
          if (submitBtn) submitBtn.disabled = true;
        }
      });

      makeSel.addEventListener('change', function () {
        hideResults(section);
        if (this.value && yearSel.value) {
          populateModels(section, data, parseInt(yearSel.value), this.value);
        } else {
          modelSel.innerHTML = '<option value="">' + (modelSel.getAttribute('data-placeholder') || 'Select Model') + '</option>';
          modelSel.disabled = true;
          if (submitBtn) submitBtn.disabled = true;
        }
      });

      modelSel.addEventListener('change', function () {
        if (submitBtn) submitBtn.disabled = !(yearSel.value && makeSel.value && this.value);
      });

      if (submitBtn) {
        submitBtn.addEventListener('click', function () {
          var y = parseInt(yearSel.value);
          var mk = makeSel.value;
          var md = modelSel.value;
          if (!y || !mk || !md) return;
          var vehicle = getVehicle(data, y, mk, md);
          if (vehicle) {
            renderResults(section, vehicle, 0);
          } else {
            showNoFitment(section);
          }
        });
      }

      // Auto-submit if vehicle was previously selected
      var vehicle = loadVehicle();
      if (vehicle && vehicle.year && vehicle.make && vehicle.model) {
        var found = getVehicle(data, vehicle.year, vehicle.make, vehicle.model);
        if (found) {
          yearSel.value = String(vehicle.year);
          yearSel.dispatchEvent(new Event('change', { bubbles: true }));
          makeSel.value = String(vehicle.make);
          makeSel.dispatchEvent(new Event('change', { bubbles: true }));
          modelSel.value = String(vehicle.model);
          modelSel.dispatchEvent(new Event('change', { bubbles: true }));
          renderResults(section, found, 0);
        }
      }
    });

    // Assistance button
    if (assistanceBtn) {
      assistanceBtn.addEventListener('click', function () {
        var url = assistanceBtn.getAttribute('data-guide-contact-url') || '/pages/contact';
        window.location.href = url;
      });
    }

    // FAQ toggle
    if (faqBtn && faqPanel) {
      faqBtn.addEventListener('click', function () {
        faqPanel.classList.toggle('is-open');
      });
    }

    // FAQ items
    var faqQuestions = qa(section, '[data-guide-faq-question]');
    faqQuestions.forEach(function (q) {
      q.addEventListener('click', function () {
        var answer = this.nextElementSibling;
        if (answer) answer.hidden = !answer.hidden;
      });
    });
  }

  /* ── Init ── */

  function init() {
    var sections = document.querySelectorAll(SECTION_SELECTOR);
    Array.prototype.forEach.call(sections, initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', function (e) {
    var section = e.target.querySelector ? e.target.querySelector(SECTION_SELECTOR) : null;
    if (section) initSection(section);
  });
})();
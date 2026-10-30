(function () {
  if (window.CalderFitmentInitialized) return;
  window.CalderFitmentInitialized = true;

  var fitmentData = null;
  var fitmentDataLoaded = false;

  var FITMENT_API_BASE = window.CALDER_FITMENT_API || '';

  var VEHICLE_STORAGE_KEY = 'calder_selected_vehicle';

  /* ── Data Loading ── */

  function loadFitmentData(callback) {
    if (fitmentDataLoaded && fitmentData) {
      callback(fitmentData);
      return;
    }
    if (FITMENT_API_BASE) {
      callFitmentAPI(function (apiData) {
        if (apiData && apiData.vehicles && apiData.vehicles.length > 0) {
          fitmentData = apiData;
          fitmentDataLoaded = true;
          window.__fitmentData = apiData;
          callback(apiData);
          return;
        }
        tryEmbedded();
      });
    } else {
      tryEmbedded();
    }

    function tryEmbedded() {
      var embedded = document.getElementById('fitment-data-json');
      if (embedded) {
        try {
          var data = JSON.parse(embedded.textContent);
          if (data && data.vehicles && data.vehicles.length > 0) {
            fitmentData = data;
            fitmentDataLoaded = true;
            window.__fitmentData = data;
            callback(data);
            return;
          }
        } catch (e) {}
      }
      if (window.__fitmentData) {
        fitmentData = window.__fitmentData;
        fitmentDataLoaded = true;
        callback(fitmentData);
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open('GET', window.Shopify.routes.root + '?section_id=async-fitment-data', true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText, 'text/html');
            var scriptEl = doc.querySelector('#fitment-data-json');
            if (scriptEl) {
              var data = JSON.parse(scriptEl.textContent);
              if (data && data.vehicles && data.vehicles.length > 0) {
                fitmentData = data;
                fitmentDataLoaded = true;
                callback(data);
                return;
              }
            }
          } catch (e) {}
        }
        callback({ vehicles: [] });
      };
      xhr.onerror = function () { callback({ vehicles: [] }); };
      xhr.send();
    }
  }

  function callFitmentAPI(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', FITMENT_API_BASE + '/api/fitment/vehicles', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.timeout = 5000;
    xhr.onload = function () {
      if (xhr.status === 200) {
        try { callback(JSON.parse(xhr.responseText)); return; } catch (e) {}
      }
      callback(null);
    };
    xhr.onerror = function () { callback(null); };
    xhr.ontimeout = function () { callback(null); };
    xhr.send();
  }

  /* ── Vehicle Persistence ── */

  function saveVehicle(vehicle) {
    try {
      localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicle));
    } catch (e) {}
  }

  function loadVehicle() {
    try {
      var data = localStorage.getItem(VEHICLE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function clearVehicle() {
    try {
      localStorage.removeItem(VEHICLE_STORAGE_KEY);
    } catch (e) {}
  }

  function updateStatusPanel(sectionId, vehicle) {
    var statusEl = document.querySelector('#calder-fitment-finder-' + sectionId + ' [data-fitment-status]');
    if (!statusEl) return;
    if (vehicle) {
      var nameEl = statusEl.querySelector('[data-fitment-vehicle-name]');
      if (nameEl) {
        if (vehicle.display_name) {
          nameEl.textContent = vehicle.display_name;
        } else {
          var parts = [];
          if (vehicle.year) parts.push(vehicle.year);
          if (vehicle.make) parts.push(vehicle.make);
          if (vehicle.model) parts.push(vehicle.model);
          if (vehicle.trim && vehicle.trim !== vehicle.display_name) parts.push(vehicle.trim);
          nameEl.textContent = parts.join(' ') || 'Vehicle selected';
        }
      }
      statusEl.removeAttribute('hidden');
      statusEl.style.display = '';
    } else {
      statusEl.setAttribute('hidden', '');
      statusEl.style.display = 'none';
    }
  }

  /* ── Tab Switching ── */

  function initTabs(sectionId) {
    var section = document.querySelector('#calder-fitment-finder-' + sectionId);
    if (!section) return;
    var tabs = section.querySelectorAll('.hf-fitment__tab');
    var panels = {
      vehicle: section.querySelector('[id^="hf-panel-vehicle-"]'),
      style: section.querySelector('[id^="hf-panel-style-"]')
    };

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');
        tabs.forEach(function (t) {
          t.classList.remove('hf-fitment__tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('hf-fitment__tab--active');
        this.setAttribute('aria-selected', 'true');
        Object.keys(panels).forEach(function (key) {
          if (panels[key]) {
            if (key === target) {
              panels[key].classList.add('hf-fitment__panel--active');
              panels[key].removeAttribute('hidden');
              panels[key].style.setProperty('display', 'block', 'important');
            } else {
              panels[key].classList.remove('hf-fitment__panel--active');
              panels[key].setAttribute('hidden', '');
              panels[key].style.setProperty('display', 'none', 'important');
            }
          }
        });
        // Toggle descriptions
        var descVehicle = section.querySelector('[data-description-vehicle]');
        var descStyle = section.querySelector('[data-description-style]');
        if (descVehicle && descStyle) {
          if (target === 'vehicle') {
            descVehicle.removeAttribute('hidden');
            descStyle.setAttribute('hidden', '');
          } else {
            descStyle.removeAttribute('hidden');
            descVehicle.setAttribute('hidden', '');
          }
        }
      });
    });
  }

  /* ── By Wheel Style Form ── */

  function initStyleTab(sectionId) {
    var diameter = document.getElementById('hf-diameter-' + sectionId);
    var bolt = document.getElementById('hf-bolt-' + sectionId);
    var finish = document.getElementById('hf-finish-' + sectionId);
    function populate(select, placeholder, options) {
      if (!select) return;
      select.replaceChildren(new Option(placeholder, ''));
      options.forEach(function (option) {
        select.add(new Option(option[0], option[1]));
      });
    }
    // Derive diameter, finish, and bolt pattern options from the actual
    // product catalog so the filters reflect published products.
    // Option values are emitted with their RAW store labels (e.g. 22"), so
    // the collection-facing filter value matches the option value exactly.
    var catalog = window.__fitmentCatalog || [];
    var diameterSet = {};
    var finishSet = {};
    var boltSet = {};
    catalog.forEach(function (p) {
      var labels = p.diameter_labels && p.diameter_labels.length ? p.diameter_labels : (p.diameters || []).map(function (d) { return d + '"'; });
      labels.forEach(function (raw) {
        var n = parseInt(raw);
        if (n > 0) diameterSet[raw] = true;
      });
      (p.finishes || []).forEach(function (f) { if (f) finishSet[f] = true; });
      var bolts = p.bolt_patterns && p.bolt_patterns.length ? p.bolt_patterns : (p.bolt_pattern ? [p.bolt_pattern] : []);
      bolts.forEach(function (b) { if (b) boltSet[b] = true; });
    });
    var dOpts = Object.keys(diameterSet).sort(function (a, b) { return parseFloat(a) - parseFloat(b); });
    if (dOpts.length === 0) { dOpts = ['22"', '24"', '26"']; }
    populate(diameter, 'All Diameters', dOpts.map(function (d) { return [d, d]; }));
    var fOpts = Object.keys(finishSet).sort();
    if (fOpts.length === 0) { fOpts = ['Gloss Black', 'Black Tint', 'Titanium Tint']; }
    populate(finish, 'All Finishes', fOpts.map(function (f) { return [f, f]; }));
    var bOpts = Object.keys(boltSet).sort();
    if (bOpts.length === 0) { bOpts = ['5x112', '5x114.3', '5x120', '5x127', '5x130', '5x135', '5x139.7', '6x135', '6x139.7']; }
    populate(bolt, 'All Bolt Patterns', bOpts.map(function (b) { return [b, b]; }));
  }

  /* ── By Wheel Style Submit ── */
  function initStyleSubmit(sectionId) {
    var btn = document.getElementById('hf-style-submit-' + sectionId);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var model = document.getElementById('hf-wheel-model-' + sectionId);
      var diameter = document.getElementById('hf-diameter-' + sectionId);
      var finish = document.getElementById('hf-finish-' + sectionId);
      var bolt = document.getElementById('hf-bolt-' + sectionId);

      // On a collection page (theme product grid present), the selected
      // Diameter and Bolt Pattern update the listing's facet filters in
      // place instead of navigating away. The fitment guide glue listens
      // for this event and reverts the vehicle-driven presentation state
      // (page title, hidden Bolt Pattern facet block).
      var hasGrid = document.getElementById('product-grid') &&
        document.getElementById('ProductGridContainer');
      var hasStyleFilters = (diameter && diameter.value) || (bolt && bolt.value);

      if (hasGrid && hasStyleFilters && !(model && model.value)) {
        var inlineParams = new URLSearchParams();
        if (diameter && diameter.value) inlineParams.set('filter.v.option.diameter', diameter.value);
        if (bolt && bolt.value) inlineParams.set('filter.p.m.custom.bolt_pattern', bolt.value);
        var sortBy = new URLSearchParams(window.location.search).get('sort_by');
        if (sortBy) inlineParams.set('sort_by', sortBy);
        document.dispatchEvent(new CustomEvent('calder:style-filters-applied', {
          detail: { searchParams: inlineParams.toString() }
        }));
        return;
      }

      var params = new URLSearchParams();
      // Collection option filters must use the store's EXACT option value
      // (e.g. 22") — appending "in" or stripping the inch mark would match
      // no facet and return zero results.
      if (model && model.value) params.set('q', model.value);
      if (diameter && diameter.value) params.set('filter.v.option.diameter', diameter.value);
      if (finish && finish.value) params.set('filter.v.option.center-finish', finish.value);
      if (bolt && bolt.value) params.set('filter.p.m.custom.bolt_pattern', bolt.value);
      var base = model && model.value ? '/search' : '/collections/all-calder-wheels';
      if (model && model.value) params.set('type', 'product');
      window.location.href = base + (params.toString() ? '?' + params.toString() : '');
    });
  }

  /* ── Change Vehicle / Reset ── */

  function initStatusActions(sectionId) {
    var section = document.querySelector('#calder-fitment-finder-' + sectionId);
    if (!section) return;
    var changeBtn = section.querySelector('[data-fitment-change]');
    var resetBtn = section.querySelector('[data-fitment-reset]');
    var resultsDiv = document.getElementById('hf-results-' + sectionId);

    if (changeBtn) {
      changeBtn.addEventListener('click', function () {
        clearVehicle();
        updateStatusPanel(sectionId, null);
        var yearSelect = document.getElementById('hf-year-' + sectionId);
        if (yearSelect) {
          yearSelect.value = '';
          yearSelect.dispatchEvent(new Event('change'));
        }
        if (resultsDiv) {
          resultsDiv.style.display = 'none';
          resultsDiv.innerHTML = '';
        }
        window.scrollTo({ top: section.offsetTop - 100, behavior: 'smooth' });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        clearVehicle();
        updateStatusPanel(sectionId, null);
        var selects = ['hf-year-', 'hf-make-', 'hf-model-', 'hf-trim-'];
        selects.forEach(function (prefix) {
          var el = document.getElementById(prefix + sectionId);
          if (el) {
            el.value = '';
            el.dispatchEvent(new Event('change'));
          }
        });
        if (resultsDiv) {
          resultsDiv.style.display = 'none';
          resultsDiv.innerHTML = '';
        }
      });
    }
  }

  /* ── By Vehicle Form ── */

  function loadYears(sectionId) {
    var yearSelect = document.getElementById('hf-year-' + sectionId);
    if (!yearSelect) return;
    yearSelect.disabled = true;
    yearSelect.innerHTML = '<option value="">Loading...</option>';
    loadFitmentData(function (data) {
      var years = [];
      for (var i = 0; i < data.vehicles.length; i++) {
        var y = data.vehicles[i].year;
        if (years.indexOf(y) === -1) years.push(y);
      }
      years.sort(function (a, b) { return b - a; });
      var placeholder = yearSelect.options[0] ? yearSelect.options[0].text : 'Year';
      yearSelect.innerHTML = '<option value="">' + placeholder + '</option>';
      for (var j = 0; j < years.length; j++) {
        var opt = document.createElement('option');
        opt.value = years[j];
        opt.textContent = years[j];
        yearSelect.appendChild(opt);
      }
      yearSelect.disabled = false;
      restoreVehicleSelection(sectionId);
    });
  }

  function restoreVehicleSelection(sectionId) {
    var vehicle = loadVehicle();
    if (!vehicle) return;
    var yearSelect = document.getElementById('hf-year-' + sectionId);
    if (yearSelect && vehicle.year) {
      for (var i = 0; i < yearSelect.options.length; i++) {
        if (yearSelect.options[i].value === vehicle.year.toString()) {
          yearSelect.value = vehicle.year.toString();
          break;
        }
      }
      if (yearSelect.value) {
        yearSelect.dispatchEvent(new Event('change'));
        setTimeout(function () {
          var makeSelect = document.getElementById('hf-make-' + sectionId);
          if (makeSelect && vehicle.make) {
            for (var j = 0; j < makeSelect.options.length; j++) {
              if (makeSelect.options[j].value === vehicle.make) {
                makeSelect.value = vehicle.make;
                break;
              }
            }
            if (makeSelect.value) {
              makeSelect.dispatchEvent(new Event('change'));
              setTimeout(function () {
                var modelSelect = document.getElementById('hf-model-' + sectionId);
                if (modelSelect && vehicle.model) {
                  for (var k = 0; k < modelSelect.options.length; k++) {
                    if (modelSelect.options[k].value === vehicle.model) {
                      modelSelect.value = vehicle.model;
                      break;
                    }
                  }
                  if (modelSelect.value) {
                    modelSelect.dispatchEvent(new Event('change'));
                    setTimeout(function () {
                      var trimSelect = document.getElementById('hf-trim-' + sectionId);
                      if (trimSelect && vehicle.trim) {
                        for (var l = 0; l < trimSelect.options.length; l++) {
                          if (trimSelect.options[l].value === vehicle.trim || trimSelect.options[l].textContent.indexOf(vehicle.trim) !== -1) {
                            trimSelect.value = trimSelect.options[l].value;
                            break;
                          }
                        }
                        if (trimSelect.value) {
                          trimSelect.dispatchEvent(new Event('change'));
                        }
                      }
                    }, 300);
                  }
                }
              }, 300);
            }
          }
        }, 300);
      }
    }
  }

  function populateMakes(sectionId, year) {
    var makeSelect = document.getElementById('hf-make-' + sectionId);
    var modelSelect = document.getElementById('hf-model-' + sectionId);
    var trimSelect = document.getElementById('hf-trim-' + sectionId);
    var submitBtn = document.getElementById('hf-submit-' + sectionId);
    modelSelect.innerHTML = '<option value="">Model</option>';
    modelSelect.disabled = true;
    trimSelect.innerHTML = '<option value="">Trim</option>';
    trimSelect.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    loadFitmentData(function (data) {
      var makes = [];
      for (var i = 0; i < data.vehicles.length; i++) {
        if (data.vehicles[i].year.toString() === year.toString()) {
          var m = data.vehicles[i].make;
          if (makes.indexOf(m) === -1) makes.push(m);
        }
      }
      makes.sort();
      makeSelect.innerHTML = '<option value="">Make</option>';
      for (var j = 0; j < makes.length; j++) {
        var opt = document.createElement('option');
        opt.value = makes[j];
        opt.textContent = makes[j];
        makeSelect.appendChild(opt);
      }
      makeSelect.disabled = false;
    });
  }

  function populateModels(sectionId, year, make) {
    var modelSelect = document.getElementById('hf-model-' + sectionId);
    var trimSelect = document.getElementById('hf-trim-' + sectionId);
    var submitBtn = document.getElementById('hf-submit-' + sectionId);
    trimSelect.innerHTML = '<option value="">Trim</option>';
    trimSelect.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    loadFitmentData(function (data) {
      var models = [];
      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year.toString() && v.make === make) {
          if (models.indexOf(v.model) === -1) models.push(v.model);
        }
      }
      models.sort();
      modelSelect.innerHTML = '<option value="">Model</option>';
      for (var j = 0; j < models.length; j++) {
        var opt = document.createElement('option');
        opt.value = models[j];
        opt.textContent = models[j];
        modelSelect.appendChild(opt);
      }
      modelSelect.disabled = false;
    });
  }

  function populateTrims(sectionId, year, make, model) {
    var trimSelect = document.getElementById('hf-trim-' + sectionId);
    var submitBtn = document.getElementById('hf-submit-' + sectionId);
    loadFitmentData(function (data) {
      var trims = [];
      var seen = {};
      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year.toString() && v.make === make && v.model === model) {
          var key = v.generation + '|' + v.trim;
          if (!seen[key]) {
            seen[key] = true;
            trims.push({
              key: key,
              label: v.trim || v.generation || 'Standard'
            });
          }
        }
      }
      trimSelect.innerHTML = '<option value="">Trim</option>';
      if (trims.length === 0) {
        trimSelect.innerHTML = '<option value="' + make + '|' + model + '|' + year + '">Standard</option>';
        trimSelect.value = make + '|' + model + '|' + year;
        trimSelect.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
      } else {
        for (var j = 0; j < trims.length; j++) {
          var opt = document.createElement('option');
          opt.value = trims[j].key;
          opt.textContent = trims[j].label;
          trimSelect.appendChild(opt);
        }
        trimSelect.disabled = false;
      }
    });
  }

  function submitFitment(sectionId) {
    var year = document.getElementById('hf-year-' + sectionId).value;
    var make = document.getElementById('hf-make-' + sectionId).value;
    var model = document.getElementById('hf-model-' + sectionId).value;
    var trimSelect = document.getElementById('hf-trim-' + sectionId);
    var trimValue = trimSelect.value;
    var trimParts = trimValue.split('|');

    var resultsDiv = document.getElementById('hf-results-' + sectionId);
    if (!resultsDiv) return;

    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div class="fitment-finder__results-loading" style="text-align:center;padding:20px 0;"><div class="loading-overlay__spinner" style="display:block;width:40px;height:40px;margin:0 auto;"><div data-load="loading"></div></div></div>';

    loadFitmentData(function (data) {
      var selectedVehicle = null;
      var isAllVariant = (trimParts.length === 3 && trimParts[0] === make);

      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year && v.make === make && v.model === model) {
          if (isAllVariant || v.generation === trimParts[0]) {
            selectedVehicle = v;
            break;
          }
        }
      }

      if (!selectedVehicle) {
        resultsDiv.innerHTML = '<p class="fitment-finder__no-results">No vehicles found matching your selection.</p>';
        return;
      }

      var displayName = year + ' ' + make + ' ' + model;
      if (trimParts[0] && trimParts[0] !== make) displayName += ' ' + trimParts[0];
      if (trimParts[1]) displayName += ' ' + trimParts[1];

      var trimLabel = '';
      if (trimSelect.selectedIndex >= 0) {
        trimLabel = trimSelect.options[trimSelect.selectedIndex].textContent || '';
      }
      if (!trimLabel) trimLabel = '';

      saveVehicle({
        year: year,
        make: make,
        model: model,
        trim: trimLabel,
        display_name: displayName,
        generation: trimParts[0],
        bolt_pattern: selectedVehicle.bolt_pattern
      });

      updateStatusPanel(sectionId, { year: year, make: make, model: model, trim: trimLabel, display_name: displayName });

      var filterBp = (selectedVehicle.bolt_pattern || '').replace(/\.\d+$/, '');
      var filterUrl = '/collections/all?filter.p.m.custom.bolt_pattern=' + encodeURIComponent(filterBp);

      // Build diameter filter from the matched products so it matches what
      // actually exists in the store (raw option values, e.g. 22").
      getCompatibleProducts(selectedVehicle, sectionId, function (result) {
        var matchedDiameters = {};
        if (result.products) {
          result.products.forEach(function (p) {
            var labels = p.diameter_labels && p.diameter_labels.length
              ? p.diameter_labels
              : (p.diameters || []).map(function (d) { return d + '"'; });
            labels.forEach(function (label) {
              if (parseFloat(label) >= parseFloat(selectedVehicle.min_diameter || 0) &&
                  parseFloat(label) <= parseFloat(selectedVehicle.max_diameter || 999)) {
                matchedDiameters[String(parseFloat(label))] = label;
              }
            });
          });
        }
        if (Object.keys(matchedDiameters).length > 0) {
          Object.keys(matchedDiameters).sort(function (a, b) { return parseFloat(a) - parseFloat(b); }).forEach(function (k) {
            filterUrl += '&filter.v.option.diameter=' + encodeURIComponent(matchedDiameters[k]);
          });
        } else if (selectedVehicle.min_diameter) {
          filterUrl += '&filter.v.option.diameter=' + encodeURIComponent(Math.ceil(parseFloat(selectedVehicle.min_diameter)) + '"');
        }
        var html = '';
        if (result.products && result.products.length > 0) {
          html += '<div class="fitment-finder__results-count">' + result.products.length + ' compatible wheels found for ' + displayName + '</div>';
          if (result.fallback) {
            html += '<p class="fitment-finder__results-note">Vehicle fitment specs are still being seeded — showing all available wheels for now.</p>';
          }
          html += '<div class="fitment-finder__results-grid">';
          for (var p = 0; p < result.products.length; p++) {
            var prod = result.products[p];
            html += '<a href="' + prod.url + '" class="fitment-finder__result-item">';
            if (prod.featured_image) {
              html += '<img src="' + prod.featured_image + '" alt="' + prod.title + '" class="fitment-finder__result-image" loading="lazy">';
            }
            html += '<span class="fitment-finder__result-title">' + prod.title + '</span>';
            if (prod.price) {
              html += '<span class="fitment-finder__result-price">$' + prod.price + '</span>';
            }
            html += '</a>';
          }
          html += '</div>';
          html += '<div class="fitment-finder__results-action"><a href="' + filterUrl + '" class="btn btn--primary">View All Compatible Wheels</a></div>';
        } else {
          html += '<p class="fitment-finder__no-results">No wheels found for this vehicle. <a href="/collections/all">Browse all wheels</a>.</p>';
        }
        resultsDiv.innerHTML = html;
      });
    });
  }

  function getCompatibleProducts(vehicle, sectionId, callback) {
    // Primary: inline catalog embedded in the section markup (no network round-trip)
    if (window.__fitmentCatalog && window.__fitmentCatalog.length > 0) {
      var matched = filterByVehicle(window.__fitmentCatalog, vehicle);
      callback({ products: matched });
      return;
    }

    // Fallback: load catalog from the async section endpoint
    var params = 'section_id=async-fitment-results';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.Shopify.routes.root + '?' + params, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var parser = new DOMParser();
          var doc = parser.parseFromString(xhr.responseText, 'text/html');
          var scriptEl = doc.querySelector('#hf-results-json');
          if (scriptEl) {
            var allProducts = JSON.parse(scriptEl.textContent);
            var matched = filterByVehicle(allProducts, vehicle);
            if (matched.length > 0) {
              callback({ products: matched });
              return;
            }
          }
        } catch (e) {}
      }
      callback({ products: [] });
    };
    xhr.onerror = function () { callback({ products: [] }); };
    xhr.send();
  }

  function filterByVehicle(products, vehicle) {
    if (!products || !vehicle) return [];

    var bp = (vehicle.bolt_pattern || '').replace(/\s+/g, '').replace(/\.\d+$/, '');
    var minDia = parseFloat(vehicle.min_diameter) || 0;
    var maxDia = parseFloat(vehicle.max_diameter) || 999;
    var loadMin = parseFloat(vehicle.load_rating_min) || 0;

    var normBp = function (s) { return String(s || '').replace(/\s+/g, '').replace(/\.\d+$/, ''); };

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

      // Match diameter range
      var hasDiameterInRange = false;
      if (p.diameters && p.diameters.length > 0) {
        for (var d = 0; d < p.diameters.length; d++) {
          var dia = parseFloat(p.diameters[d]);
          if (dia >= minDia && dia <= maxDia) {
            hasDiameterInRange = true;
            break;
          }
        }
      }
      if (!hasDiameterInRange) return false;

      // Match load rating
      if (loadMin > 0 && p.load_rating && p.load_rating < loadMin) return false;

      return true;
    }).map(function (p) {
      var price = (typeof p.price === 'number' && !isNaN(p.price)) ? p.price.toFixed(2) : '';
      return {
        url: p.url,
        title: p.title,
        price: price,
        featured_image: p.featured_image || '',
        diameters: p.diameters || [],
        diameter_labels: p.diameter_labels || []
      };
    });
  }

  /* ── Section Initialization ── */

  function initSection(sectionEl) {
    var id = sectionEl.getAttribute('data-section-id');
    if (!id) return;

    var yearSelect = document.getElementById('hf-year-' + id);
    var makeSelect = document.getElementById('hf-make-' + id);
    var modelSelect = document.getElementById('hf-model-' + id);
    var trimSelect = document.getElementById('hf-trim-' + id);
    var submitBtn = document.getElementById('hf-submit-' + id);

    initTabs(id);
    initStyleTab(id);
    initStyleSubmit(id);
    initStatusActions(id);

    var savedVehicle = loadVehicle();
    if (savedVehicle) {
      updateStatusPanel(id, savedVehicle);
    }

    // The vehicle form may be replaced by the fitment guide card
    // (.cw-fitment-guide) — tabs, style filters, and status actions above
    // must still initialize; skip only the vehicle-form wiring below.
    if (!yearSelect || !makeSelect || !modelSelect || !trimSelect || !submitBtn) return;

    loadYears(id);

    yearSelect.addEventListener('change', function () {
      if (this.value) {
        populateMakes(id, this.value);
      } else {
        makeSelect.innerHTML = '<option value="">Make</option>';
        makeSelect.disabled = true;
        modelSelect.innerHTML = '<option value="">Model</option>';
        modelSelect.disabled = true;
        trimSelect.innerHTML = '<option value="">Trim</option>';
        trimSelect.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        var resultsDiv = document.getElementById('hf-results-' + id);
        if (resultsDiv) resultsDiv.style.display = 'none';
      }
    });

    makeSelect.addEventListener('change', function () {
      if (this.value) {
        populateModels(id, yearSelect.value, this.value);
      } else {
        modelSelect.innerHTML = '<option value="">Model</option>';
        modelSelect.disabled = true;
        trimSelect.innerHTML = '<option value="">Trim</option>';
        trimSelect.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
      }
    });

    modelSelect.addEventListener('change', function () {
      if (this.value) {
        populateTrims(id, yearSelect.value, makeSelect.value, this.value);
      } else {
        trimSelect.innerHTML = '<option value="">Trim</option>';
        trimSelect.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
      }
    });

    trimSelect.addEventListener('change', function () {
      if (submitBtn) submitBtn.disabled = !this.value;
    });

    submitBtn.addEventListener('click', function () {
      if (!trimSelect.value) return;
      submitFitment(id);
    });
  }

  function init() {
    var sections = document.querySelectorAll('#calder-fitment-finder');
    for (var i = 0; i < sections.length; i++) {
      initSection(sections[i]);
    }
    if (sections.length === 0) {
      var fallback = document.querySelectorAll('.hf-fitment');
      for (var j = 0; j < fallback.length; j++) {
        initSection(fallback[j]);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
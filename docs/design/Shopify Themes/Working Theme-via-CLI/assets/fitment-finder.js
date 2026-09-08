(function () {
  if (window.FitmentFinderInitialized) return;
  window.FitmentFinderInitialized = true;

  var fitmentData = null;
  var fitmentDataLoaded = false;
  var activeSectionId = null;

  /* ── API Base URL ── */
  var FITMENT_API_BASE = window.CALDER_FITMENT_API || '';

  /**
   * Load fitment data from the best available source.
   * Priority: Middleware API → Embedded DOM → window.__fitmentData → Async section
   */
  function loadFitmentData(callback) {
    if (fitmentDataLoaded && fitmentData) {
      callback(fitmentData);
      return;
    }

    // 1. Try the middleware API (live data, auto-synced with NHTSA)
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
      // 2. Try the embedded DOM data (from fitment-data.liquid snippet)
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
        } catch (e) {
          console.warn('Fitment: embedded data parse error', e);
        }
      }

      // 3. Try window.__fitmentData
      if (window.__fitmentData) {
        fitmentData = window.__fitmentData;
        fitmentDataLoaded = true;
        callback(fitmentData);
        return;
      }

      // 4. Try async section endpoint (last resort)
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
        console.warn('No fitment data available');
        callback({ vehicles: [] });
      };
      xhr.onerror = function () { callback({ vehicles: [] }); };
      xhr.send();
    }
  }

  /**
   * Call the middleware fitment API with a timeout.
   */
  function callFitmentAPI(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', FITMENT_API_BASE + '/api/fitment/vehicles', true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.timeout = 5000;

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          callback(JSON.parse(xhr.responseText));
          return;
        } catch (e) {}
      }
      callback(null);
    };

    xhr.onerror = function () { callback(null); };
    xhr.ontimeout = function () { callback(null); };
    xhr.send();
  }

  function loadYears(sectionId) {
    var yearSelect = document.getElementById('fitment-year-' + sectionId);
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

      yearSelect.innerHTML = '<option value="">' + (yearSelect.dataset.placeholder || 'Select Year') + '</option>';
      for (var j = 0; j < years.length; j++) {
        var opt = document.createElement('option');
        opt.value = years[j];
        opt.textContent = years[j];
        yearSelect.appendChild(opt);
      }
      yearSelect.disabled = false;
    });
  }

  function populateMakes(sectionId, year) {
    var makeSelect = document.getElementById('fitment-make-' + sectionId);
    var modelSelect = document.getElementById('fitment-model-' + sectionId);
    var genSelect = document.getElementById('fitment-generation-' + sectionId);
    var submitBtn = document.getElementById('fitment-submit-' + sectionId);

    modelSelect.innerHTML = '<option value="">Select Model</option>';
    modelSelect.disabled = true;
    genSelect.innerHTML = '<option value="">Select Generation</option>';
    genSelect.disabled = true;
    submitBtn.disabled = true;

    loadFitmentData(function (data) {
      var makes = [];
      for (var i = 0; i < data.vehicles.length; i++) {
        if (data.vehicles[i].year.toString() === year.toString()) {
          var m = data.vehicles[i].make;
          if (makes.indexOf(m) === -1) makes.push(m);
        }
      }
      makes.sort();

      makeSelect.innerHTML = '<option value="">Select Make</option>';
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
    var modelSelect = document.getElementById('fitment-model-' + sectionId);
    var genSelect = document.getElementById('fitment-generation-' + sectionId);
    var submitBtn = document.getElementById('fitment-submit-' + sectionId);

    genSelect.innerHTML = '<option value="">Select Generation</option>';
    genSelect.disabled = true;
    submitBtn.disabled = true;

    loadFitmentData(function (data) {
      var models = [];
      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year.toString() && v.make === make) {
          if (models.indexOf(v.model) === -1) models.push(v.model);
        }
      }
      models.sort();

      modelSelect.innerHTML = '<option value="">Select Model</option>';
      for (var j = 0; j < models.length; j++) {
        var opt = document.createElement('option');
        opt.value = models[j];
        opt.textContent = models[j];
        modelSelect.appendChild(opt);
      }
      modelSelect.disabled = false;
    });
  }

  function populateGenerations(sectionId, year, make, model) {
    var genSelect = document.getElementById('fitment-generation-' + sectionId);
    var submitBtn = document.getElementById('fitment-submit-' + sectionId);

    loadFitmentData(function (data) {
      var generations = [];
      var seen = {};
      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year.toString() && v.make === make && v.model === model) {
          var key = v.generation + '|' + v.trim;
          if (!seen[key]) {
            seen[key] = true;
            generations.push({
              key: key,
              label: v.generation + (v.trim ? ' ' + v.trim : '')
            });
          }
        }
      }

      genSelect.innerHTML = '<option value="">Select Generation</option>';
      var allBlank = true;
      for (var j = 0; j < generations.length; j++) {
        if (generations[j].key && generations[j].key !== '|') {
          allBlank = false;
          break;
        }
      }

      if (allBlank || generations.length === 0) {
        // No distinct generations — skip selection, enable submit directly
        genSelect.innerHTML = '<option value="' + make + '|' + model + '|' + year + '">All ' + model + ' variants</option>';
        genSelect.value = make + '|' + model + '|' + year;
        genSelect.disabled = false;
        submitBtn.disabled = false;
      } else {
        for (var j = 0; j < generations.length; j++) {
          var opt = document.createElement('option');
          opt.value = generations[j].key;
          opt.textContent = generations[j].label;
          genSelect.appendChild(opt);
        }
        genSelect.disabled = false;
      }
    });
  }

  function getFitmentFilterParams(sectionId) {
    var genParts = (document.getElementById('fitment-generation-' + sectionId).value || '').split('|');
    return {
      generation: genParts[0],
      trim: genParts[1] || ''
    };
  }

  function getCompatibleProducts(vehicle, sectionId, callback) {
    var params = 'section_id=async-fitment-results';
    if (vehicle) {
      if (vehicle.bolt_pattern) params += '&bolt_pattern=' + encodeURIComponent(vehicle.bolt_pattern);
      if (vehicle.min_diameter) params += '&min_diameter=' + encodeURIComponent(vehicle.min_diameter);
      if (vehicle.max_diameter) params += '&max_diameter=' + encodeURIComponent(vehicle.max_diameter);
      if (vehicle.min_width) params += '&min_width=' + encodeURIComponent(vehicle.min_width);
      if (vehicle.max_width) params += '&max_width=' + encodeURIComponent(vehicle.max_width);
      if (vehicle.min_offset !== null && vehicle.min_offset !== undefined) params += '&min_offset=' + encodeURIComponent(vehicle.min_offset);
      if (vehicle.max_offset !== null && vehicle.max_offset !== undefined) params += '&max_offset=' + encodeURIComponent(vehicle.max_offset);
      if (vehicle.hub_bore) params += '&hub_bore=' + encodeURIComponent(vehicle.hub_bore);
      if (vehicle.load_rating_min) params += '&load_rating_min=' + encodeURIComponent(vehicle.load_rating_min);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.Shopify.routes.root + '?' + params, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var parser = new DOMParser();
          var doc = parser.parseFromString(xhr.responseText, 'text/html');
          var scriptEl = doc.querySelector('#fitment-results-json');
          if (scriptEl) {
            var data = JSON.parse(scriptEl.textContent);
            if (data && data.length > 0) {
              callback({ products: data });
              return;
            }
          }
        } catch (e) {}
      }
      // Fallback: fetch all products from store's products.json
      var fallback = new XMLHttpRequest();
      fallback.open('GET', window.Shopify.routes.root + 'products.json?limit=50', true);
      fallback.onload = function () {
        if (fallback.status === 200) {
          try {
            var all = JSON.parse(fallback.responseText);
            var prods = (all.products || []).map(function (p) {
              return {
                url: p.url,
                title: p.title,
                price: p.variants && p.variants[0] ? (p.variants[0].price / 100).toFixed(2) : '',
                featured_image: p.images && p.images[0] ? p.images[0].src : ''
              };
            });
            callback({ products: prods, fallback: true });
            return;
          } catch (e) {}
        }
        callback({ products: [] });
      };
      fallback.onerror = function () { callback({ products: [] }); };
      fallback.send();
    };
    xhr.onerror = function () {
      // Network error on async section — try products.json fallback
      var fallback = new XMLHttpRequest();
      fallback.open('GET', window.Shopify.routes.root + 'products.json?limit=50', true);
      fallback.onload = function () {
        if (fallback.status === 200) {
          try {
            var all = JSON.parse(fallback.responseText);
            var prods = (all.products || []).map(function (p) {
              return {
                url: p.url,
                title: p.title,
                price: p.variants && p.variants[0] ? (p.variants[0].price / 100).toFixed(2) : '',
                featured_image: p.images && p.images[0] ? p.images[0].src : ''
              };
            });
            callback({ products: prods, fallback: true });
            return;
          } catch (e) {}
        }
        callback({ products: [] });
      };
      fallback.onerror = function () { callback({ products: [] }); };
      fallback.send();
    };
    xhr.send();
  }

  function submitFitment(sectionId) {
    var year = document.getElementById('fitment-year-' + sectionId).value;
    var make = document.getElementById('fitment-make-' + sectionId).value;
    var model = document.getElementById('fitment-model-' + sectionId).value;
    var genSelect = document.getElementById('fitment-generation-' + sectionId);
    var generation = genSelect.value;
    var genParts = generation.split('|');

    var resultsDiv = document.getElementById('fitment-results-' + sectionId);
    if (!resultsDiv) return;

    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div class="fitment-finder__results-loading"><div class="loading-overlay__spinner" style="display:block;width:40px;height:40px;margin:0 auto;"><div data-load="loading"></div></div></div>';

    loadFitmentData(function (data) {
      var selectedVehicle = null;
      var isAllVariant = (genParts.length === 3 && genParts[0] === make);

      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year && v.make === make && v.model === model) {
          if (isAllVariant || v.generation === genParts[0]) {
            selectedVehicle = v;
            break;
          }
        }
      }

      if (!selectedVehicle) {
        resultsDiv.innerHTML = '<p class="fitment-finder__no-results">No vehicles found matching your selection.</p>';
        return;
      }

      var filterUrl = '/collections/all?filter.p.m.custom.bolt_pattern=' + encodeURIComponent(selectedVehicle.bolt_pattern);
      if (selectedVehicle.min_diameter) filterUrl += '&filter.v.option.diameter=' + selectedVehicle.min_diameter;
      if (selectedVehicle.min_offset) filterUrl += '&filter.v.option.offset=' + selectedVehicle.min_offset;

      getCompatibleProducts(selectedVehicle, sectionId, function (result) {
        var html = '';
        if (result.products && result.products.length > 0) {
          html += '<div class="fitment-finder__results-count">' + result.products.length + ' compatible wheels found for ' + make + ' ' + model + ' ' + genParts[0] + '</div>';
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

  function initSection(sectionEl) {
    var id = sectionEl.getAttribute('id').replace('fitment-finder-', '');
    var yearSelect = document.getElementById('fitment-year-' + id);
    var makeSelect = document.getElementById('fitment-make-' + id);
    var modelSelect = document.getElementById('fitment-model-' + id);
    var genSelect = document.getElementById('fitment-generation-' + id);
    var submitBtn = document.getElementById('fitment-submit-' + id);

    if (!yearSelect) return;

    loadYears(id);

    yearSelect.addEventListener('change', function () {
      if (this.value) {
        populateMakes(id, this.value);
      } else {
        makeSelect.innerHTML = '<option value="">Select Make</option>';
        makeSelect.disabled = true;
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        modelSelect.disabled = true;
        genSelect.innerHTML = '<option value="">Select Generation</option>';
        genSelect.disabled = true;
        submitBtn.disabled = true;
        var resultsDiv = document.getElementById('fitment-results-' + id);
        if (resultsDiv) resultsDiv.style.display = 'none';
      }
    });

    makeSelect.addEventListener('change', function () {
      if (this.value) {
        populateModels(id, yearSelect.value, this.value);
      } else {
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        modelSelect.disabled = true;
        genSelect.innerHTML = '<option value="">Select Generation</option>';
        genSelect.disabled = true;
        submitBtn.disabled = true;
      }
    });

    modelSelect.addEventListener('change', function () {
      if (this.value) {
        populateGenerations(id, yearSelect.value, makeSelect.value, this.value);
      } else {
        genSelect.innerHTML = '<option value="">Select Generation</option>';
        genSelect.disabled = true;
        submitBtn.disabled = true;
      }
    });

    genSelect.addEventListener('change', function () {
      submitBtn.disabled = !this.value;
    });

    submitBtn.addEventListener('click', function () {
      if (!genSelect.value) return;
      submitFitment(id);
    });
  }

  function init() {
    var sections = document.querySelectorAll('.fitment-finder');
    for (var i = 0; i < sections.length; i++) {
      initSection(sections[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
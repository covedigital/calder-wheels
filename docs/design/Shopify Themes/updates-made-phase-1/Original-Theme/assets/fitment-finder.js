(function () {
  if (window.FitmentFinderInitialized) return;
  window.FitmentFinderInitialized = true;

  var fitmentData = null;
  var fitmentDataLoaded = false;
  var activeSectionId = null;

  function loadFitmentData(callback) {
    if (fitmentDataLoaded && fitmentData) {
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
            fitmentData = JSON.parse(scriptEl.textContent);
            fitmentDataLoaded = true;
            callback(fitmentData);
            return;
          }
        } catch (e) {
          console.warn('Fitment data parse failed, using embedded data', e);
        }
      }
      if (window.__fitmentData) {
        fitmentData = window.__fitmentData;
        fitmentDataLoaded = true;
        callback(fitmentData);
      } else {
        console.warn('No fitment data available');
        callback({ vehicles: [] });
      }
    };
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
      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year.toString() && v.make === make && v.model === model) {
          generations.push({
            key: v.generation + '|' + v.trim,
            label: v.generation + (v.trim ? ' ' + v.trim : '')
          });
        }
      }

      genSelect.innerHTML = '<option value="">Select Generation</option>';
      for (var j = 0; j < generations.length; j++) {
        var opt = document.createElement('option');
        opt.value = generations[j].key;
        opt.textContent = generations[j].label;
        genSelect.appendChild(opt);
      }
      genSelect.disabled = false;
    });
  }

  function getFitmentFilterParams(sectionId) {
    var genParts = (document.getElementById('fitment-generation-' + sectionId).value || '').split('|');
    return {
      generation: genParts[0],
      trim: genParts[1] || ''
    };
  }

  function getCompatibleProducts(id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.Shopify.routes.root + '?section_id=async-fitment-results&vehicle_id=' + encodeURIComponent(id), true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var parser = new DOMParser();
          var doc = parser.parseFromString(xhr.responseText, 'text/html');
          var scriptEl = doc.querySelector('#fitment-results-json');
          if (scriptEl) {
            callback(JSON.parse(scriptEl.textContent));
            return;
          }
        } catch (e) {}
      }
      callback({ products: [] });
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
      for (var i = 0; i < data.vehicles.length; i++) {
        var v = data.vehicles[i];
        if (v.year.toString() === year && v.make === make && v.model === model && v.generation === genParts[0]) {
          selectedVehicle = v;
          break;
        }
      }

      if (!selectedVehicle) {
        resultsDiv.innerHTML = '<p class="fitment-finder__no-results">No vehicles found matching your selection.</p>';
        return;
      }

      var filterUrl = '/collections/all?filter.p.m.custom.bolt_pattern=' + encodeURIComponent(selectedVehicle.bolt_pattern);
      if (selectedVehicle.min_diameter) filterUrl += '&filter.v.option.diameter=' + selectedVehicle.min_diameter;
      if (selectedVehicle.min_offset) filterUrl += '&filter.v.option.offset=' + selectedVehicle.min_offset;

      getCompatibleProducts(selectedVehicle.id || genParts[0], function (result) {
        var html = '';
        if (result.products && result.products.length > 0) {
          html += '<div class="fitment-finder__results-count">' + result.products.length + ' compatible wheels found for ' + make + ' ' + model + ' ' + genParts[0] + '</div>';
          html += '<div class="fitment-finder__results-grid">';
          for (var p = 0; p < result.products.length; p++) {
            var prod = result.products[p];
            html += '<a href="' + prod.url + '" class="fitment-finder__result-item">';
            if (prod.featured_image) {
              html += '<img src="' + prod.featured_image + '" alt="' + prod.title + '" class="fitment-finder__result-image" loading="lazy">';
            }
            html += '<span class="fitment-finder__result-title">' + prod.title + '</span>';
            if (prod.price) {
              html += '<span class="fitment-finder__result-price">' + prod.price + '</span>';
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
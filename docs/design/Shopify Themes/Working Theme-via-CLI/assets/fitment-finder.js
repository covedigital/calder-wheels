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
        var parts = [];
        if (vehicle.year) parts.push(vehicle.year);
        if (vehicle.make) parts.push(vehicle.make);
        if (vehicle.model) parts.push(vehicle.model);
        if (vehicle.trim) parts.push(vehicle.trim);
        nameEl.textContent = parts.join(' ') || vehicle.display_name || 'Vehicle selected';
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
            } else {
              panels[key].classList.remove('hf-fitment__panel--active');
              panels[key].setAttribute('hidden', '');
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
    var width = document.getElementById('hf-width-' + sectionId);
    var bolt = document.getElementById('hf-bolt-' + sectionId);
    var finish = document.getElementById('hf-finish-' + sectionId);

    if (diameter) {
      var dias = ['All Diameters','18"','19"','20"','21"','22"','23"','24"'];
      diameter.innerHTML = dias.map(function(v) { return '<option value="' + (v === dias[0] ? '' : v.replace('"','')) + '">' + v + '</option>'; }).join('');
    }
    if (width) {
      var wids = ['All Widths','8.5"','9"','9.5"','10"','10.5"','11"','11.5"','12"','12.5"','13"','14"'];
      width.innerHTML = wids.map(function(v) { return '<option value="' + (v === wids[0] ? '' : v.replace('"','')) + '">' + v + '</option>'; }).join('');
    }
    if (bolt) {
      var bolts = ['All Bolt Patterns','5x100','5x112','5x114.3','5x120','5x120.7','5x127','5x130','5x135','5x139.7','5x150','6x135','6x139.7'];
      bolt.innerHTML = bolts.map(function(v) { return '<option value="' + (v === bolts[0] ? '' : v) + '">' + v + '</option>'; }).join('');
    }
    if (finish) {
      var fins = ['All Finishes','Gloss Black','Satin Black','Matte Black','Brushed Silver','Polished Silver','Gloss Silver','Brushed Bronze','Matte Bronze','Gloss Bronze','Brushed Titanium','Satin Titanium','Gloss White','Brushed Clear','Chrome','Gold'];
      finish.innerHTML = fins.map(function(v) { return '<option value="' + (v === fins[0] ? '' : v.toLowerCase().replace(/ /g,'-')) + '">' + v + '</option>'; }).join('');
    }
  }

  /* ── By Wheel Style Submit ── */

  function initStyleSubmit(sectionId) {
    var btn = document.getElementById('hf-style-submit-' + sectionId);
    var btn = document.getElementById('hf-style-submit-' + sectionId);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var diameter = document.getElementById('hf-diameter-' + sectionId);
      var width = document.getElementById('hf-width-' + sectionId);
      var bolt = document.getElementById('hf-bolt-' + sectionId);
      var finish = document.getElementById('hf-finish-' + sectionId);
      var params = [];
      if (diameter && diameter.value) params.push('filter.v.option.diameter=' + encodeURIComponent(diameter.value));
      if (width && width.value) params.push('filter.v.option.width=' + encodeURIComponent(width.value));
      if (bolt && bolt.value) params.push('filter.p.m.custom.bolt_pattern=' + encodeURIComponent(bolt.value));
      if (finish && finish.value) params.push('filter.p.m.custom.finish=' + encodeURIComponent(finish.value));
      var url = '/collections/all';
      if (params.length) url += '?' + params.join('&');
      window.location.href = url;
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

      saveVehicle({
        year: year,
        make: make,
        model: model,
        trim: displayName,
        generation: trimParts[0],
        bolt_pattern: selectedVehicle.bolt_pattern
      });

      updateStatusPanel(sectionId, { year: year, make: make, model: model, trim: displayName });

      var filterUrl = '/collections/all?filter.p.m.custom.bolt_pattern=' + encodeURIComponent(selectedVehicle.bolt_pattern);
      if (selectedVehicle.min_diameter) filterUrl += '&filter.v.option.diameter=' + selectedVehicle.min_diameter;
      if (selectedVehicle.min_offset) filterUrl += '&filter.v.option.offset=' + selectedVehicle.min_offset;

      getCompatibleProducts(selectedVehicle, sectionId, function (result) {
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
          var scriptEl = doc.querySelector('#hf-results-json');
          if (scriptEl) {
            var data = JSON.parse(scriptEl.textContent);
            if (data && data.length > 0) {
              callback({ products: data });
              return;
            }
          }
        } catch (e) {}
      }
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

  /* ── Section Initialization ── */

  function initSection(sectionEl) {
    var id = sectionEl.getAttribute('data-section-id');
    if (!id) return;

    var yearSelect = document.getElementById('hf-year-' + id);
    var makeSelect = document.getElementById('hf-make-' + id);
    var modelSelect = document.getElementById('hf-model-' + id);
    var trimSelect = document.getElementById('hf-trim-' + id);
    var submitBtn = document.getElementById('hf-submit-' + id);

    if (!yearSelect) return;

    initTabs(id);
    initStyleTab(id);
    initStyleSubmit(id);
    initStatusActions(id);

    var savedVehicle = loadVehicle();
    if (savedVehicle) {
      updateStatusPanel(id, savedVehicle);
    }

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
/* ── CALDER GALLERY FILTER SYSTEM ── */
(function() {
  'use strict';

  if (window._calderGalleryLoaded) return;
  window._calderGalleryLoaded = true;

  const SELECTORS = {
    grid: '.calder-gallery-grid',
    item: '.calder-gallery-grid__item',
    filterSelect: '.calder-gallery-filters__select',
    resetBtn: '.calder-gallery-filters__reset',
    count: '.calder-gallery-filters__count',
    loadMore: '.calder-gallery-loadmore__btn',
    empty: '.calder-gallery-empty',
    mobileToggle: '.calder-gallery-filters__mobile-toggle',
    desktopFilters: '.calder-gallery-filters__desktop'
  };

  function initGallery(galleryEl) {
    const grid = galleryEl.querySelector(SELECTORS.grid);
    if (!grid) return;
    const items = Array.from(galleryEl.querySelectorAll(SELECTORS.item));
    if (items.length === 0) return;
    const selects = Array.from(galleryEl.querySelectorAll(SELECTORS.filterSelect));
    const resetBtn = galleryEl.querySelector(SELECTORS.resetBtn);
    const countEl = galleryEl.querySelector(SELECTORS.count);
    const loadMoreBtn = galleryEl.querySelector(SELECTORS.loadMore);
    const emptyEl = galleryEl.querySelector(SELECTORS.empty);
    const mobileToggle = galleryEl.querySelector(SELECTORS.mobileToggle);
    const desktopFilters = galleryEl.querySelector(SELECTORS.desktopFilters);
    const itemsPerPage = parseInt(grid.dataset.itemsPerPage || '12', 10);
    let visibleCount = itemsPerPage;

    function getActiveFilters() {
      const filters = {};
      selects.forEach(function(sel) {
        var val = sel.value;
        if (val && val !== '__all__') {
          filters[sel.dataset.filterKey || sel.name] = val;
        }
      });
      return filters;
    }

    function filterItems() {
      var filters = getActiveFilters();
      var filterKeys = Object.keys(filters);
      if (filterKeys.length === 0) {
        return items.slice(0);
      }
      return items.filter(function(item) {
        return filterKeys.every(function(key) {
          var itemVal = (item.dataset[key] || '').toLowerCase();
          return itemVal === filters[key].toLowerCase();
        });
      });
    }

    function renderPage(filtered) {
      var total = filtered.length;
      var showCount = Math.min(visibleCount, total);
      items.forEach(function(item) { item.style.display = 'none'; });
      for (var i = 0; i < showCount; i++) {
        filtered[i].style.display = '';
      }
      var hasMore = showCount < total;
      if (loadMoreBtn) {
        loadMoreBtn.style.display = hasMore ? '' : 'none';
        loadMoreBtn.classList.remove('calder-gallery-loadmore__btn--loading');
      }
      if (countEl) {
        countEl.textContent = showCount + ' of ' + total + (total === 1 ? ' build' : ' builds');
      }
      if (emptyEl) {
        emptyEl.style.display = showCount === 0 ? '' : 'none';
      }
    }

    function applyFilters() {
      visibleCount = itemsPerPage;
      renderPage(filterItems());
    }

    function resetFilters() {
      selects.forEach(function(sel) { sel.value = '__all__'; });
      applyFilters();
    }

    function loadMore() {
      var filtered = filterItems();
      visibleCount = Math.min(visibleCount + itemsPerPage, filtered.length);
      renderPage(filtered);
      if (loadMoreBtn) {
        loadMoreBtn.classList.remove('calder-gallery-loadmore__btn--loading');
      }
    }

    selects.forEach(function(sel) {
      sel.addEventListener('change', applyFilters);
    });
    if (resetBtn) {
      resetBtn.addEventListener('click', resetFilters);
    }
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        this.classList.add('calder-gallery-loadmore__btn--loading');
        setTimeout(loadMore, 200);
      });
    }
    if (mobileToggle && desktopFilters) {
      mobileToggle.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
        this.setAttribute('aria-expanded', expanded);
        desktopFilters.style.display = expanded === 'true' ? 'flex' : 'none';
      });
    }
    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', function() {
    var galleries = document.querySelectorAll('[data-calder-gallery]');
    galleries.forEach(initGallery);
  });
})();
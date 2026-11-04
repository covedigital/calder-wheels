/* Calder gallery v2 — client filter/search/sort/pagination + detail slider + lightbox.
   Rewritten 2026-11-01 (gallery audit): un-minified for maintainability.
   Changes vs. minified original (audit doc 03/06/08):
   - BUG-01 companion: empty-state split — filtered-empty message ([data-gallery-empty])
     is suppressed when the grid has zero cards total; the server-rendered
     no-content message ([data-gallery-empty-none]) owns that state.
   - Phase C: dependent Make -> Model filtering (model options scope to selected make).
   - Phase E: fullscreen lightbox on detail hero slides (focus-managed, Esc/arrows).
   Protected functionality untouched: no fitment, configurator, cart, or PDP logic. */
(() => {
  const normalize = (v, key) => {
    let x = String(v || '').trim().toLowerCase().replace(/[\u201c\u201d]/g, '"').replace(/\s+/g, ' ');
    if (key === 'size') {
      const n = parseFloat(x);
      return Number.isFinite(n) ? String(n) : x;
    }
    if (key === 'bolt') return x.replace(/\s+/g, '').replace(/\.0+(?=$|[,;|])/g, '');
    return x;
  };
  const splitValues = (v) => String(v || '').split(/[,;|]/).map((x) => x.trim()).filter(Boolean);

  document.querySelectorAll('[data-gallery-root]').forEach((root) => {
    const grid = root.querySelector('[data-gallery-grid]');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.calder-gallery-grid__item')];
    const filters = [...root.querySelectorAll('[data-filter-key]')];
    const search = root.querySelector('[data-gallery-search]');
    const sort = root.querySelector('[data-gallery-sort]');
    const count = root.querySelector('[data-gallery-count]');
    const pagination = root.querySelector('[data-gallery-pagination]');
    const empty = root.querySelector('[data-gallery-empty]');
    let page = 1;
    const per = Math.max(1, Number(grid.dataset.itemsPerPage) || 12);
    const hasCards = cards.length > 0;

    const toggle = root.querySelector('.calder-gallery-filters__mobile-toggle');
    toggle?.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      root.querySelector('.calder-gallery-filters')?.classList.toggle('is-open', !expanded);
    });

    const buildOptions = (sel, values) => {
      const key = sel.dataset.filterKey;
      const first = sel.querySelector('option');
      sel.replaceChildren(first);
      values.sort((a, b) => (key === 'size' ? parseFloat(a) - parseFloat(b) : a.localeCompare(b)));
      values.forEach((v) => {
        const o = document.createElement('option');
        o.value = v;
        o.textContent = v;
        sel.append(o);
      });
    };

    filters.forEach((sel) => {
      const key = sel.dataset.filterKey;
      const vals = [...new Set(cards.flatMap((c) => splitValues(c.dataset[key])))];
      buildOptions(sel, vals);
      sel.addEventListener('change', () => {
        page = 1;
        /* Dependent filtering: choosing a Make scopes the Model options (Phase C). */
        if (key === 'make') {
          const modelSel = filters.find((s) => s.dataset.filterKey === 'model');
          if (modelSel) {
            const makeVal = normalize(sel.value, 'make');
            const models = [
              ...new Set(
                cards
                  .filter((c) => !makeVal || splitValues(c.dataset.make).some((m) => normalize(m, 'make') === makeVal))
                  .flatMap((c) => splitValues(c.dataset.model))
              ),
            ];
            buildOptions(modelSel, models);
          }
        }
        render();
      });
    });

    function render() {
      const q = (search?.value || '').trim().toLowerCase();
      const visible = cards.filter((c) =>
        filters.every(
          (s) =>
            !s.value ||
            splitValues(c.dataset[s.dataset.filterKey]).some(
              (v) => normalize(v, s.dataset.filterKey) === normalize(s.value, s.dataset.filterKey)
            )
        ) &&
        (!q || c.textContent.toLowerCase().includes(q) || Object.values(c.dataset).some((v) => String(v).toLowerCase().includes(q)))
      );
      if (sort?.value === 'az') visible.sort((a, b) => a.textContent.localeCompare(b.textContent));
      if (sort?.value === 'za') visible.sort((a, b) => b.textContent.localeCompare(a.textContent));
      visible.forEach((c) => grid.append(c));
      cards.forEach((c) => (c.hidden = true));
      const pages = Math.ceil(visible.length / per);
      page = Math.max(1, Math.min(page, pages || 1));
      visible.slice((page - 1) * per, page * per).forEach((c) => (c.hidden = false));
      /* BUG-01 companion: with zero cards total the no-content message owns the state. */
      if (empty) empty.hidden = visible.length > 0 || !hasCards;
      if (count) count.textContent = visible.length + ' of ' + cards.length + (cards.length === 1 ? ' build' : ' builds');
      if (pagination) {
        pagination.replaceChildren();
        for (let i = 1; i <= pages; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = i;
          if (i === page) b.setAttribute('aria-current', 'page');
          b.addEventListener('click', () => {
            page = i;
            render();
            grid.scrollIntoView({ block: 'start', behavior: 'smooth' });
          });
          pagination.append(b);
        }
      }
    }

    search?.addEventListener('input', () => {
      page = 1;
      render();
    });
    sort?.addEventListener('change', render);
    root.querySelector('.calder-gallery-filters__reset')?.addEventListener('click', () => {
      filters.forEach((s) => (s.value = ''));
      if (search) search.value = '';
      page = 1;
      render();
    });
    render();
  });

  /* Detail hero slider (unchanged behavior) + lightbox (Phase E). */
  document.querySelectorAll('[data-gallery-detail]').forEach((root) => {
    const slides = [...root.querySelectorAll('[data-slide]')];
    const thumbs = [...root.querySelectorAll('[data-index]')];
    if (!slides.length) return;
    let i = 0;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      thumbs.forEach((t) => {
        t.classList.toggle('is-active', Number(t.dataset.index) === i);
        t.setAttribute('aria-pressed', String(Number(t.dataset.index) === i));
      });
      const counter = root.querySelector('[data-slide-counter]');
      if (counter)
        counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      const lightboxImg = lightbox?.querySelector('img');
      if (lightboxImg && lightboxOpen) lightboxImg.src = slides[i].src;
    }

    root.querySelector('.cg-slide-prev')?.addEventListener('click', () => show(i - 1));
    root.querySelector('.cg-slide-next')?.addEventListener('click', () => show(i + 1));
    thumbs.forEach((t) => t.addEventListener('click', () => show(Number(t.dataset.index))));

    /* Lightbox: click active slide (or expand) for fullscreen view. */
    let lightbox = null;
    let lightboxOpen = false;
    let lastFocused = null;

    function openLightbox() {
      if (lightboxOpen) return;
      lastFocused = document.activeElement;
      lightbox = document.createElement('div');
      lightbox.className = 'cg-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Gallery image viewer');
      lightbox.innerHTML =
        '<button type="button" class="cg-lightbox__close" aria-label="Close fullscreen view">✕</button>' +
        '<button type="button" class="cg-lightbox__prev" aria-label="Previous image">‹</button>' +
        '<img src="' + slides[i].src + '" alt="' + (slides[i].alt || 'Gallery image') + '">' +
        '<button type="button" class="cg-lightbox__next" aria-label="Next image">›</button>';
      document.body.append(lightbox);
      document.body.style.overflow = 'hidden';
      lightboxOpen = true;
      lightbox.querySelector('.cg-lightbox__close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.cg-lightbox__prev').addEventListener('click', () => show(i - 1));
      lightbox.querySelector('.cg-lightbox__next').addEventListener('click', () => show(i + 1));
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      lightbox.querySelector('.cg-lightbox__close').focus();
    }

    function closeLightbox() {
      if (!lightboxOpen) return;
      lightbox?.remove();
      lightbox = null;
      lightboxOpen = false;
      document.body.style.overflow = '';
      lastFocused?.focus();
    }

    document.addEventListener('keydown', (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });

    slides.forEach((s) =>
      s.addEventListener('click', () => {
        if (s.classList.contains('is-active')) openLightbox();
      })
    );

    if (root.dataset.autoplay === 'true' && slides.length > 1) {
      setInterval(() => {
        if (!document.hidden) show(i + 1);
      }, Math.max(3000, Number(root.dataset.interval) || 6000));
    }
    show(0);
  });
})();
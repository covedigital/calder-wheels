/* ── CALDER GALLERY DETAIL LIGHTBOX ── */
(function() {
  'use strict';

  if (window._calderGalleryDetailLoaded) return;
  window._calderGalleryDetailLoaded = true;

  var lightbox = document.querySelector('[data-calder-detail-lightbox]');
  var gallery = document.querySelector('[data-calder-detail-gallery]');
  if (!lightbox || !gallery) return;

  var images = Array.from(gallery.querySelectorAll('.calder-detail-gallery__img'));
  var lightboxImg = lightbox.querySelector('.calder-detail-gallery__image');
  var closeBtn = lightbox.querySelector('.calder-detail-lightbox__close');
  var prevBtn = lightbox.querySelector('.calder-detail-lightbox__prev');
  var nextBtn = lightbox.querySelector('.calder-detail-lightbox__next');
  var counterEl = lightbox.querySelector('.calder-detail-lightbox__counter');
  var currentIndex = 0;

  function getImageData(index) {
    var img = images[index];
    if (!img) return null;
    var src = img.getAttribute('src');
    var alt = img.getAttribute('alt') || 'Gallery image';
    return { src: src, alt: alt, index: index, total: images.length };
  }

  function showImage(index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    var data = getImageData(index);
    if (!data) return;
    lightboxImg.setAttribute('src', data.src);
    lightboxImg.setAttribute('alt', data.alt);
    counterEl.textContent = (index + 1) + ' of ' + images.length;
    prevBtn.style.display = images.length > 1 ? '' : 'none';
    nextBtn.style.display = images.length > 1 ? '' : 'none';
  }

  function openLightbox(index) {
    index = index || 0;
    lightbox.style.display = 'flex';
    lightbox.classList.add('calder-detail-lightbox--open');
    document.body.style.overflow = 'hidden';
    showImage(index);
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightbox.classList.remove('calder-detail-lightbox--open');
    document.body.style.overflow = '';
  }

  function prevImage() {
    if (images.length < 2) return;
    var idx = currentIndex - 1;
    if (idx < 0) idx = images.length - 1;
    showImage(idx);
  }

  function nextImage() {
    if (images.length < 2) return;
    var idx = currentIndex + 1;
    if (idx >= images.length) idx = 0;
    showImage(idx);
  }

  images.forEach(function(img, i) {
    img.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(i);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') { closeLightbox(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { prevImage(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { nextImage(); e.preventDefault(); }
  });
})();
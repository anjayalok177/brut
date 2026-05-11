/* ============================================================
   GALLERY — 3D Scroll-Driven Carousel
   ============================================================ */

(function() {
  const carousel = document.getElementById('carousel');
  const galleryScroll = document.getElementById('galleryScroll');
  const n = galleryImages.length;

  // Set CSS custom property
  document.documentElement.style.setProperty('--n', n);

  // Build carousel items
  galleryImages.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.style.setProperty('--i', i);
    item.style.setProperty('--url', 'url(' + img.src + ')');
    item.innerHTML =
      '<div class="item-back">' +
        '<h3>' + img.title + '</h3>' +
        '<p>' + img.desc + '</p>' +
      '</div>' +
      '<div class="item-front">' +
        '<img src="' + img.src + '" alt="' + img.title + '" loading="lazy">' +
        '<div class="item-caption">' + img.title + '</div>' +
      '</div>';
    item.addEventListener('click', () => modal.open(i));
    carousel.appendChild(item);
  });

  // Scroll sync function (exact from user)
  function f(k) {
    if (Math.abs(k) > 0.5) {
      const max = galleryScroll.scrollHeight - galleryScroll.clientHeight;
      galleryScroll.scrollTo(0, 0.5 * (k - Math.sign(k) + 1) * max);
    }
  }

  function updateK() {
    const max = galleryScroll.scrollHeight - galleryScroll.clientHeight;
    if (max <= 0) return;
    const k = -1 + 2 * (galleryScroll.scrollTop / max);
    carousel.style.setProperty('--k', k);
  }

  galleryScroll.addEventListener('scroll', () => {
    updateK();
    const k = +getComputedStyle(carousel).getPropertyValue('--k');
    f(k);
  });

  f(-1);
})();

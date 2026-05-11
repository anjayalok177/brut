/* ============================================================
   GALLERY — 3D Scroll-Driven Carousel (Redesigned)
   ============================================================ */

(function() {
  const carousel       = document.getElementById('carousel');
  const galleryScroll  = document.getElementById('galleryScroll');
  const galleryCounter = document.getElementById('galleryCounter');
  const n              = galleryImages.length;

  // Set CSS custom property
  document.documentElement.style.setProperty('--n', n);

  // Initialise counter text
  if (galleryCounter) {
    galleryCounter.textContent = '01 / ' + String(n).padStart(2, '0');
  }

  // Build carousel items
  galleryImages.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.style.setProperty('--i', i);
    item.style.setProperty('--url', 'url(' + img.src + ')');

    item.innerHTML =
      /* Back face — info card */
      '<div class="item-back">' +
        '<div class="item-back-glyph">✦</div>' +
        '<h3>' + img.title + '</h3>' +
        '<p>'  + img.desc  + '</p>'  +
        '<div class="item-back-cta">View Photo →</div>' +
      '</div>' +

      /* Front face — image with overlaid layers */
      '<div class="item-front">' +
        '<img src="'  + img.src   + '" alt="' + img.title + '" loading="lazy">' +
        '<div class="item-gradient-overlay"></div>' +
        '<div class="item-number">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="item-caption">' +
          '<span class="item-caption-title">' + img.title + '</span>' +
          '<span class="item-caption-desc">'  + img.desc  + '</span>' +
        '</div>' +
      '</div>';

    item.addEventListener('click', () => modal.open(i));
    carousel.appendChild(item);
  });

  // ── Scroll sync (original logic preserved) ──────────────────
  function f(k) {
    if (Math.abs(k) > 0.5) {
      const max = galleryScroll.scrollHeight - galleryScroll.clientHeight;
      galleryScroll.scrollTo(0, 0.5 * (k - Math.sign(k) + 1) * max);
    }
  }

  function updateK() {
    const max = galleryScroll.scrollHeight - galleryScroll.clientHeight;
    if (max <= 0) return;

    const scrollRatio = galleryScroll.scrollTop / max;
    const k = -1 + 2 * scrollRatio;
    carousel.style.setProperty('--k', k);

    // Update live photo counter
    if (galleryCounter) {
      const activeIndex = Math.min(Math.round(scrollRatio * (n - 1)), n - 1);
      galleryCounter.textContent =
        String(activeIndex + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    }
  }

  galleryScroll.addEventListener('scroll', () => {
    updateK();
    const k = +getComputedStyle(carousel).getPropertyValue('--k');
    f(k);
  });

  f(-1);
})();

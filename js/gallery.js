/* ============================================================
   GALLERY — ProfileCard-Style 3D Tilt Cards (Vanilla JS)
   Ported from React Bits ProfileCard component
   ============================================================ */

(function () {
  const container = document.getElementById('galleryCards');
  if (!container) return;

  // ── Utility helpers ──
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const round = (v, p) => parseFloat(v.toFixed(p || 3));
  const adjust = (v, fMin, fMax, tMin, tMax) =>
    round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

  // ── Tilt Engine Factory (per-card) ──
  function createTiltEngine(shell, wrap) {
    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    function setVarsFromXY(x, y) {
      const w = shell.clientWidth || 1;
      const h = shell.clientHeight || 1;

      const px = clamp((100 / w) * x, 0, 100);
      const py = clamp((100 / h) * y, 0, 100);
      const cx = px - 50;
      const cy = py - 50;

      wrap.style.setProperty('--pointer-x', px + '%');
      wrap.style.setProperty('--pointer-y', py + '%');
      wrap.style.setProperty('--background-x', adjust(px, 0, 100, 35, 65) + '%');
      wrap.style.setProperty('--background-y', adjust(py, 0, 100, 35, 65) + '%');
      wrap.style.setProperty('--pointer-from-center',
        '' + clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1));
      wrap.style.setProperty('--pointer-from-top', '' + (py / 100));
      wrap.style.setProperty('--pointer-from-left', '' + (px / 100));
      wrap.style.setProperty('--rotate-x', round(-(cx / 5)) + 'deg');
      wrap.style.setProperty('--rotate-y', round(cy / 4) + 'deg');
    }

    function step(ts) {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar =
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    }

    function start() {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    }

    return {
      setImmediate(x, y) { currentX = x; currentY = y; setVarsFromXY(x, y); },
      setTarget(x, y) { targetX = x; targetY = y; start(); },
      toCenter() {
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(ms) { initialUntil = performance.now() + ms; start(); },
      getCurrent() { return { x: currentX, y: currentY, tx: targetX, ty: targetY }; },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null; running = false; lastTs = 0;
      }
    };
  }

  // ── Build Cards ──
  galleryImages.forEach((img, i) => {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'pc-card-wrapper';

    wrapper.innerHTML =
      '<div class="pc-behind"></div>' +
      '<div class="pc-card-shell">' +
        '<section class="pc-card">' +
          '<div class="pc-inside">' +
            '<div class="pc-photo-layer">' +
              '<img src="' + img.src + '" alt="' + img.title + '" loading="lazy">' +
            '</div>' +
            '<div class="pc-shine"></div>' +
            '<div class="pc-glare"></div>' +
            '<div class="pc-photo-num">' + String(i + 1).padStart(2, '0') + '</div>' +
            '<div class="pc-info-bar">' +
              '<div class="pc-info-text">' +
                '<div class="pc-info-title">' + img.title + '</div>' +
                '<div class="pc-info-desc">' + img.desc + '</div>' +
              '</div>' +
              '<button class="pc-view-btn" type="button">View →</button>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>';

    container.appendChild(wrapper);

    // Get references
    const shell = wrapper.querySelector('.pc-card-shell');
    const viewBtn = wrapper.querySelector('.pc-view-btn');
    let enterTimer = null;
    let leaveRaf = null;

    // Create tilt engine for this card
    const engine = createTiltEngine(shell, wrapper);

    // ── Event Handlers ──
    function getOffsets(evt) {
      const rect = shell.getBoundingClientRect();
      return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }

    shell.addEventListener('pointerenter', function (e) {
      shell.classList.add('active');
      shell.classList.add('entering');
      wrapper.style.setProperty('--card-opacity', '1');
      if (enterTimer) clearTimeout(enterTimer);
      enterTimer = setTimeout(function () {
        shell.classList.remove('entering');
      }, 180);
      const { x, y } = getOffsets(e);
      engine.setTarget(x, y);
    });

    shell.addEventListener('pointermove', function (e) {
      const { x, y } = getOffsets(e);
      engine.setTarget(x, y);
    });

    shell.addEventListener('pointerleave', function () {
      wrapper.style.setProperty('--card-opacity', '0');
      engine.toCenter();

      function checkSettle() {
        const { x, y, tx, ty } = engine.getCurrent();
        if (Math.hypot(tx - x, ty - y) < 0.6) {
          shell.classList.remove('active');
          leaveRaf = null;
        } else {
          leaveRaf = requestAnimationFrame(checkSettle);
        }
      }
      if (leaveRaf) cancelAnimationFrame(leaveRaf);
      leaveRaf = requestAnimationFrame(checkSettle);
    });

    // Click card or view button → open modal
    function openThisModal(e) {
      e.stopPropagation();
      if (typeof modal !== 'undefined' && typeof modal.open === 'function') {
        modal.open(i);
      }
    }
    shell.addEventListener('click', openThisModal);
    viewBtn.addEventListener('click', openThisModal);

    // ── Initial Animation ──
    const ix = (shell.clientWidth || 200) - 70;
    const iy = 60;
    engine.setImmediate(ix, iy);
    engine.toCenter();
    engine.beginInitial(1200);
  });

  // ── GSAP ScrollTrigger Entrance ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.gallery-section .section-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-section', start: 'top 80%' }
      }
    );

    gsap.fromTo('.pc-card-wrapper',
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.gallery-cards', start: 'top 85%' }
      }
    );
  }
})();

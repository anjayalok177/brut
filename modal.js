/* ============================================================
   MODAL — Cinematic Scale-Blur Reveal
   ============================================================
   Animasi:
   - Backdrop: blur(0) → blur(30px) + darken
   - Content: scale(0.7) + blur(20px) + opacity(0) → scale(1) + blur(0) + opacity(1)
   - Close/Nav buttons: scale(0.8) → scale(1) dengan delay stagger
   - Caption: translateY(20px) → translateY(0) dengan delay
   ============================================================ */

const modal = (function() {
  const el = document.getElementById('imageModal');
  const img = document.getElementById('modalImage');
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDesc');
  let currentIndex = 0;
  let isAnimating = false;

  function updateContent(index) {
    const data = galleryImages[index];
    img.src = data.src;
    img.alt = data.title;
    title.textContent = data.title;
    desc.textContent = data.desc;
  }

  function open(index) {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = index;
    updateContent(index);

    // Activate modal (triggers CSS transitions)
    el.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => { isAnimating = false; }, 700);
  }

  function close() {
    if (isAnimating) return;
    isAnimating = true;

    el.classList.remove('active');

    // Wait for close animation before clearing
    setTimeout(() => {
      document.body.style.overflow = '';
      isAnimating = false;
    }, 500);
  }

  function next() {
    if (isAnimating) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;

    // Animate out current image
    gsap.to(img, {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        updateContent(currentIndex);
        // Animate in new image
        gsap.fromTo(img,
          { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }
        );
        gsap.fromTo(title,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1 }
        );
        gsap.fromTo(desc,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.15 }
        );
      }
    });
  }

  function prev() {
    if (isAnimating) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;

    gsap.to(img, {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        updateContent(currentIndex);
        gsap.fromTo(img,
          { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }
        );
        gsap.fromTo(title,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1 }
        );
        gsap.fromTo(desc,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.15 }
        );
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!el.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  return { open, close, next, prev };
})();

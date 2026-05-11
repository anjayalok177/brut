/* ============================================================
   MAIN — Navbar, Hero Animations, Utilities
   ============================================================ */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hero entrance animations
gsap.registerPlugin(ScrollTrigger);

gsap.to('.hero-title', {
  opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power3.out'
});
gsap.to('.hero-desc', {
  opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out'
});
gsap.to('.live-status', {
  opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out'
});
gsap.to('.action-pills', {
  opacity: 1, y: 0, duration: 1, delay: 1.0, ease: 'power3.out'
});
gsap.to('.hero-buttons', {
  opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power3.out'
});

// Smooth scroll helper
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

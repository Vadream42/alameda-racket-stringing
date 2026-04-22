/**
 * parallax.js
 * Tiny scroll-driven parallax for decorative hero elements.
 *
 * Any element with a `data-parallax` attribute will translate vertically
 * as the user scrolls — the value is a multiplier of window.scrollY.
 *   data-parallax="0.25"   -> moves down 25% as fast as the scroll (drifts up relative to content)
 *   data-parallax="-0.15"  -> moves up as the page scrolls (drifts the other way)
 *
 * As sensible defaults, the hero glow and tennis-ball illustration get
 * parallax automatically so every page feels alive without editing HTML.
 *
 * Respects `prefers-reduced-motion` — no movement for users who've asked for less.
 */

(function parallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [];

  // Explicit opt-ins via data-parallax="<speed>"
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax);
    if (!Number.isNaN(speed)) targets.push({ el, speed });
  });

  // Sensible defaults for existing decorative elements
  document.querySelectorAll('.hero-glow').forEach((el) => {
    if (!el.hasAttribute('data-parallax')) targets.push({ el, speed: 0.25 });
  });
  document.querySelectorAll('.hero-illus').forEach((el) => {
    if (!el.hasAttribute('data-parallax')) targets.push({ el, speed: -0.18 });
  });

  if (!targets.length) return;

  let ticking = false;
  function update() {
    const y = window.scrollY;
    for (const t of targets) {
      t.el.style.transform = `translate3d(0, ${(y * t.speed).toFixed(1)}px, 0)`;
    }
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
})();

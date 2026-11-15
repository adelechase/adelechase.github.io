(() => {
  const header = document.querySelector('[data-art-header]');
  const updateHeaderHeight = () => {
    if (header) document.documentElement.style.setProperty('--art-header-height', header.getBoundingClientRect().height + 'px');
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight, { passive: true });
  if ('ResizeObserver' in window && header) new ResizeObserver(updateHeaderHeight).observe(header);

  const carousel = document.querySelector('[data-art-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('[data-art-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-art-dot]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer = null;
  let manuallyPaused = false;
  let hoverPaused = false;
  let focusPaused = false;
  const toggle = carousel.querySelector('[data-art-toggle]');

  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((slide, index) => { slide.hidden = index !== current; });
    dots.forEach((dot, index) => {
      if (index === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  const updateToggle = () => {
    if (!toggle) return;
    const label = manuallyPaused ? 'Play slideshow' : 'Pause slideshow';
    toggle.textContent = label;
    toggle.setAttribute('aria-label', label);
  };
  const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    const canRotate = !manuallyPaused && !hoverPaused && !focusPaused &&
      !reduceMotion.matches && !document.hidden;
    carousel.setAttribute('aria-live', canRotate ? 'off' : 'polite');
    if (canRotate) timer = window.setInterval(() => show(current + 1), 6500);
  };
  const navigate = (i) => {
    show(i);
    // Manual navigation stops automatic movement until Play is explicitly chosen.
    manuallyPaused = true;
    updateToggle();
    start();
  };
  const prev = carousel.querySelector('[data-art-prev]');
  const next = carousel.querySelector('[data-art-next]');
  prev?.addEventListener('click', () => navigate(current - 1));
  next?.addEventListener('click', () => navigate(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => navigate(index)));
  toggle?.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    if (!manuallyPaused) focusPaused = false; // Explicit Play overrides focus pause.
    updateToggle();
    start();
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  carousel.addEventListener('mouseenter', () => { hoverPaused = true; start(); });
  carousel.addEventListener('mouseleave', () => { hoverPaused = false; start(); });
  carousel.addEventListener('focusin', () => { focusPaused = true; start(); });
  carousel.addEventListener('focusout', (e) => {
    if (!carousel.contains(e.relatedTarget)) { focusPaused = false; start(); }
  });
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener?.('change', start);
  let startX = null;
  carousel.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) startX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    if (startX === null || !e.changedTouches.length) return;
    const delta = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(delta) > 55) navigate(current + (delta < 0 ? 1 : -1));
  }, { passive: true });
  show(0);
  updateToggle();
  start();
})();

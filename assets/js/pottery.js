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
  let paused = false;
  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((slide, index) => { slide.hidden = index !== current; });
    dots.forEach((dot, index) => {
      if (index === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    if (!paused && !reduceMotion.matches && !document.hidden) {
      timer = window.setInterval(() => show(current + 1), 6500);
    }
  };
  const navigate = (i) => { show(i); start(); };
  const prev = carousel.querySelector('[data-art-prev]');
  const next = carousel.querySelector('[data-art-next]');
  prev?.addEventListener('click', () => navigate(current - 1));
  next?.addEventListener('click', () => navigate(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => navigate(index)));
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  carousel.addEventListener('mouseenter', () => { paused = true; stop(); });
  carousel.addEventListener('mouseleave', () => { paused = false; start(); });
  carousel.addEventListener('focusin', () => { paused = true; stop(); });
  carousel.addEventListener('focusout', (e) => {
    if (!carousel.contains(e.relatedTarget)) { paused = false; start(); }
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
  start();
})();

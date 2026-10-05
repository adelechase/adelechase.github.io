// The site works without JavaScript. This adds a subtle entrance effect.
const cards = document.querySelectorAll('.project-card');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach(card => { card.classList.add('will-reveal'); observer.observe(card); });
}

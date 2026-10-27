const lazyImages = document.querySelectorAll('img.lazy[data-src]');

function loadImage(img) {
  const src = img.dataset.src;
  if (!src) return;

  img.addEventListener('load', () => img.classList.add('loaded'), { once: true });

  img.addEventListener('error', () => {
    img.classList.add('loaded');
    img.alt = 'Не вдалося завантажити зображення';
  }, { once: true });

  img.src = src;
  img.removeAttribute('data-src');
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      loadImage(entry.target);
      obs.unobserve(entry.target);
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01
  });

  lazyImages.forEach(img => observer.observe(img));

  document.getElementById('load-all').addEventListener('click', () => {
    lazyImages.forEach(img => {
      loadImage(img);
      observer.unobserve(img);
    });
  });
} else {
  lazyImages.forEach(loadImage);
  document.getElementById('load-all').addEventListener('click', () => {
    lazyImages.forEach(loadImage);
  });
}

document.querySelectorAll('img.on-click').forEach(img => {
  const handler = () => {
    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  };
  img.addEventListener('click', handler, { once: true });
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
  }, { once: true });
});


document.getElementById('reset').addEventListener('click', () => location.reload());

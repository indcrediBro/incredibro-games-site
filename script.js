(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('is-open', !open);
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        nav.classList.remove('is-open');
      });
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  // Card tilt + light-sweep, following the pointer.
  const cards = document.querySelectorAll('.game-card');
  const MAX_TILT = 6; // degrees
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;    // 0..1
      const tiltY = (px - 0.5) * MAX_TILT * 2;
      const tiltX = (0.5 - py) * MAX_TILT * 2;
      card.style.setProperty('--tiltX', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tiltY', `${tiltY.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
    });
  });

  // Scroll-reveal: sections and game cards fade/rise in once, on first approach.
  const revealTargets = document.querySelectorAll('.section, .game-card');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('game-card')) {
        // Stagger cards within the grid they belong to.
        const siblings = Array.from(el.parentElement.children);
        const index = siblings.indexOf(el);
        el.style.transitionDelay = `${Math.min(index, 7) * 60}ms`;
      }
      el.classList.add('is-visible');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(el => io.observe(el));

  // Gentle parallax on the hero avatar as the hero section scrolls by.
  const heroArt = document.querySelector('.hero-art-parallax');
  const heroSection = document.querySelector('.hero');
  if (heroArt && heroSection) {
    let ticking = false;
    const updateParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      const progress = 1 - Math.min(Math.max(rect.top / (window.innerHeight || 1), -1), 1);
      const shift = (progress - 0.5) * 24; // px
      heroArt.style.setProperty('--parallax', `${shift.toFixed(1)}px`);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // Count-up on the about-stats numbers, once, when they scroll into view.
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count-to'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        if (Number.isNaN(target)) return;
        const duration = 900;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => countIO.observe(el));
  }
})();

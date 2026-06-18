/* main.js — Minimal vanilla JS for Mehta & Associates website */

/* ---- Sticky header shadow ---- */
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Mobile nav toggle ---- */
const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobileNav.style.display = open ? 'flex' : 'none';
    toggle.setAttribute('aria-expanded', open);
  });
}

/* ---- Active nav link (by pathname) ---- */
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
  const href = a.getAttribute('href');
  if (href && window.location.pathname.endsWith(href)) a.classList.add('active');
  if (href === 'index.html' && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html'))) {
    a.classList.add('active');
  }
});

/* ---- Services page: sticky sidebar highlight ---- */
const servicesNav = document.querySelector('.services-nav');
if (servicesNav) {
  const sections = document.querySelectorAll('.service-section[id]');
  const navLinks = servicesNav.querySelectorAll('a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ---- Resource tabs ---- */
const tabBtns = document.querySelectorAll('.tab-btn');
if (tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ---- Contact form validation ---- */
const form = document.getElementById('enquiry-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const err = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        valid = false;
        if (err) err.style.display = 'block';
        field.style.borderColor = 'var(--error)';
      } else {
        if (err) err.style.display = 'none';
        field.style.borderColor = '';
      }
    });

    if (valid) {
      form.style.display = 'none';
      const success = document.getElementById('form-success');
      if (success) success.style.display = 'block';
    }
  });
}

/* ---- Lazy-load images (fallback for browsers without native support) ---- */
if ('loading' in HTMLImageElement.prototype === false) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
});

// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const [s0, s1, s2] = hamburger.querySelectorAll('span');
  s0.style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  s1.style.opacity   = open ? '0' : '';
  s2.style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

// Counter animation (fires once via IntersectionObserver)
function animateCounters(scope = document) {
  scope.querySelectorAll('.stat-num').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = +el.dataset.target;
    const step = target / (1800 / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
  });
}

// Generic fade-in on scroll
const fadeIo = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.transition = 'opacity .55s ease, transform .55s ease';
    e.target.style.opacity = '1';
    e.target.style.transform = 'translateY(0)';
    // trigger counters if inside this element
    if (e.target.querySelector?.('.stat-num')) animateCounters(e.target);
    fadeIo.unobserve(e.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.svc-card, .prod-card, .testi-card, .team-card, .val-card, .country-card, .ts-card, .process-card, .sband-stat, .cert-badge, .why-feat, .tl-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  fadeIo.observe(el);
});

// Counters in stats-band
document.querySelectorAll('.stats-band, .hero-stats').forEach(el => {
  new IntersectionObserver(([e]) => { if (e.isIntersecting) { animateCounters(e.target); } }, { threshold: 0.3 }).observe(el);
});

// Active nav link
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href').split('#')[0];
  a.classList.toggle('active', href === page);
});

// Contact form
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const s = document.getElementById('formSuccess');
  if (s) { s.style.display = 'flex'; setTimeout(() => s.style.display = 'none', 6000); }
  e.target.reset();
});

// Quote multi-step
const qSections = document.querySelectorAll('.quote-section');
const qSteps    = document.querySelectorAll('.qstep');
let currentStep = 0;

function showQStep(n) {
  qSections.forEach((s, i) => s.classList.toggle('visible', i === n));
  qSteps.forEach((s, i) => {
    s.classList.toggle('active', i === n);
    s.classList.toggle('done', i < n);
  });
  // update done step circle to checkmark
  qSteps.forEach((s, i) => {
    const circle = s.querySelector('.qstep-circle');
    if (i < n) circle.innerHTML = '<i class="fa-solid fa-check" style="font-size:.7rem"></i>';
    else if (i === n) circle.textContent = i + 1;
    else circle.textContent = i + 1;
  });
}
if (qSections.length) showQStep(0);

document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => {
  if (currentStep < qSections.length - 1) { currentStep++; showQStep(currentStep); window.scrollTo({ top: document.querySelector('.quote-form-card').offsetTop - 100, behavior: 'smooth' }); }
}));
document.querySelectorAll('[data-prev]').forEach(btn => btn.addEventListener('click', () => {
  if (currentStep > 0) { currentStep--; showQStep(currentStep); }
}));

// Incoterm buttons
document.querySelectorAll('.inco-btn').forEach(btn => btn.addEventListener('click', () => {
  btn.closest('.incoterms-grid').querySelectorAll('.inco-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}));

// Quote form submit
document.getElementById('quoteForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const s = document.getElementById('quoteSuccess');
  if (s) s.style.display = 'flex';
});

// Product filter
document.querySelectorAll('.flt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.prod-detail-card').forEach(card => {
      card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
    });
  });
});

// Smooth hash scroll
document.querySelectorAll('a[href*="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const hash = a.getAttribute('href').split('#')[1];
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el && a.pathname === location.pathname) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

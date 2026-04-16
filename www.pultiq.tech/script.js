// Lenis smooth scroll (darkroomengineering/lenis) — lighter settings
const lenis = new Lenis({ duration: 1.0, smoothWheel: true });
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// GSAP + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);

// Hero title words stagger in
gsap.to('.hero-title .word', {
  opacity: 1, y: 0, rotateX: 0,
  duration: 0.8, ease: 'power3.out', stagger: 0.07, delay: 0.15
});

// Reveal on scroll — use IntersectionObserver (cheaper than 20+ ScrollTriggers)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Nav scrolled state — plain scroll listener, passive
const nav = document.querySelector('.nav');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Animated counters
document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; }
        });
        counterIO.unobserve(el);
      }
    });
  });
  counterIO.observe(el);
});

// Smooth anchor links via Lenis
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -60 }); }
    }
  });
});

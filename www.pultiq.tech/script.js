// GSAP for hero entrance + counters (no ScrollTrigger, no Lenis — native scroll)
gsap.to('.hero-title .word', {
  opacity: 1, y: 0, rotateX: 0,
  duration: 0.8, ease: 'power3.out', stagger: 0.07, delay: 0.15
});

// Reveal on scroll — IntersectionObserver (no layout thrash)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Nav scrolled state — passive + rAF throttle
const nav = document.querySelector('.nav');
let navTicking = false;
window.addEventListener('scroll', () => {
  if (!navTicking) {
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      navTicking = false;
    });
    navTicking = true;
  }
}, { passive: true });

// Counters
document.querySelectorAll('.stat-num').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; }
        });
        cIO.unobserve(el);
      }
    });
  });
  cIO.observe(el);
});

// Cursor glow — transform only, rAF throttle, desktop only
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches && window.innerWidth > 900) {
  let mx = 0, my = 0, gx = 0, gy = 0, rafId = null;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(animate);
  }, { passive: true });
  function animate(){
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.transform = `translate3d(${gx - 250}px,${gy - 250}px,0)`;
    if (Math.abs(mx - gx) > 0.5 || Math.abs(my - gy) > 0.5) {
      rafId = requestAnimationFrame(animate);
    } else { rafId = null; }
  }
} else if (glow) {
  glow.style.display = 'none';
}

// Hero mockup tilt on mouse (only this ONE element, not 20 cards)
const heroVisual = document.querySelector('.hero-visual');
const heroWindow = document.querySelector('.hero-visual .window');
if (heroVisual && heroWindow && window.matchMedia('(pointer:fine)').matches) {
  let tiltRAF = null, tx = 0, ty = 0;
  heroVisual.addEventListener('mousemove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 8;
    ty = ((e.clientY - r.top) / r.height - 0.5) * -6;
    if (!tiltRAF) tiltRAF = requestAnimationFrame(applyTilt);
  }, { passive: true });
  heroVisual.addEventListener('mouseleave', () => {
    tx = 0; ty = 5;
    if (!tiltRAF) tiltRAF = requestAnimationFrame(applyTilt);
  });
  function applyTilt(){
    heroWindow.style.transform = `perspective(1200px) rotateX(${5 + ty}deg) rotateY(${tx}deg) translateZ(0)`;
    tiltRAF = null;
  }
}

// Smooth anchor links — native behavior
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
      }
    }
  });
});

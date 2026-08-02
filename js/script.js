/* ============ PRELOADER ============ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hide'), 300);
});

/* ============ FOOTER YEAR ============ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============ SCROLL PROGRESS + NAVBAR STATE ============ */
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function onScroll(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';

  navbar.classList.toggle('scrolled', scrollTop > 40);
  backToTop.classList.toggle('show', scrollTop > 500);
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* ============ MOBILE MENU ============ */
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobileMenu');

function openMenu(){
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu(){
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
document.querySelectorAll('[data-nav-mobile]').forEach(link => {
  link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ============ SCROLLSPY (active nav link) ============ */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('[data-nav]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(sec => spyObserver.observe(sec));

/* ============ REVEAL ON SCROLL ============ */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ============ TYPING EFFECT ============ */
const roles = [
  'Network Security Engineer Intern',
  'Network Engineer',
  'Full-Stack Developer'
];
const typedEl = document.getElementById('typedRole');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIndex];

  if (!deleting){
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

/* ============ ANIMATED COUNTERS ============ */
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = decimals ? target.toFixed(decimals) : target;
    }
    requestAnimationFrame(tick);
    obs.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ============ NETWORK NODE CANVAS (HERO BACKGROUND) ============ */
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas(){
  const hero = document.getElementById('home');
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
  initParticles();
}

function initParticles(){
  const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.8 + 1
  }));
}

function drawNetwork(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const linkDist = 140;

  for (let i = 0; i < particles.length; i++){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++){
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < linkDist){
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / linkDist})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    if (mouse.x !== null){
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160){
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(34, 211, 238, ${1 - dist / 160})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  if (!prefersReducedMotion) requestAnimationFrame(drawNetwork);
}

document.getElementById('home').addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
document.getElementById('home').addEventListener('mouseleave', () => {
  mouse.x = null; mouse.y = null;
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
if (!prefersReducedMotion) drawNetwork();
else drawNetwork();

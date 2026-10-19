// Animations : défilement fluide, révélations, compteurs, bande défilante, court 3D et balle qui rebondit.
const gsap = window.gsap;
const ST = window.ScrollTrigger;
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(gsap && ST);
if (hasGsap) gsap.registerPlugin(ST);

export function initSmooth() {
  if (reduced || !hasGsap || !window.Lenis) return;
  const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
  window.__lenis = lenis;
  lenis.on('scroll', ST.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // ancres internes
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -90 }); history.replaceState(null, '', a.getAttribute('href')); }
  });
}

export function splitWords(el) {
  if (!el || el.dataset.split) return [];
  el.dataset.split = '1';
  const walk = (node) => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'split-word';
          const i = document.createElement('span'); i.textContent = part;
          w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  return el.querySelectorAll('.split-word > span');
}

export function reveal(root = document) {
  if (!hasGsap || reduced) {
    root.querySelectorAll('[data-reveal="up"]').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
    root.querySelectorAll('.reveal-wipe').forEach(e => e.style.clipPath = 'none');
    root.querySelectorAll('[data-count]').forEach(e => e.textContent = e.dataset.count);
    return;
  }
  root.querySelectorAll('[data-reveal="words"]:not([data-done])').forEach(el => {
    el.dataset.done = 1;
    const words = splitWords(el);
    gsap.from(words, { yPercent: 110, rotate: 4, duration: 1, ease: 'power4.out', stagger: .045, scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  root.querySelectorAll('[data-reveal="up"]:not([data-done])').forEach(el => {
    el.dataset.done = 1;
    gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 90%' } });
  });
  root.querySelectorAll('[data-stagger]:not([data-done])').forEach(el => {
    el.dataset.done = 1;
    const kids = [...el.children];
    gsap.set(kids, { opacity: 0, y: 40 });
    ST.batch(kids, { start: 'top 92%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .09, overwrite: true }) });
  });
  root.querySelectorAll('.reveal-wipe:not([data-done])').forEach(el => {
    el.dataset.done = 1;
    gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    const img = el.querySelector('img');
    if (img) gsap.from(img, { scale: 1.25, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  root.querySelectorAll('[data-parallax]:not([data-done])').forEach(el => {
    el.dataset.done = 1;
    const amt = +el.dataset.parallax || 12;
    gsap.fromTo(el, { yPercent: -amt / 2 }, { yPercent: amt / 2, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  root.querySelectorAll('[data-count]:not([data-done])').forEach(el => {
    el.dataset.done = 1;
    const target = el.dataset.count;
    const n = parseFloat(target);
    if (!/^\d+([.,]\d+)?$/.test(target)) { // valeur non numérique (ex. 7/7) : effet « tableau »
      el.textContent = target.replace(/\d/g, '0');
      ST.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => scramble(el, target) });
      return;
    }
    const o = { v: 0 };
    el.textContent = '0';
    gsap.to(o, { v: n, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => el.textContent = Math.round(o.v) });
  });
}

function scramble(el, final) {
  let i = 0;
  const id = setInterval(() => {
    el.textContent = final.replace(/\d/g, () => Math.floor(Math.random() * 10));
    if (++i > 15) { clearInterval(id); el.textContent = final; }
  }, 55);
}

export function marquee(el, speed = 60) {
  if (!el) return;
  const track = el.querySelector('.marquee-track');
  track.innerHTML += track.innerHTML; // boucle sans couture
  if (!hasGsap || reduced) return;
  const w = track.scrollWidth / 2;
  const tw = gsap.to(track, { x: -w, duration: w / speed, ease: 'none', repeat: -1 });
  let dir = 1;
  ST.create({
    trigger: el, start: 'top bottom', end: 'bottom top',
    onUpdate: self => {
      const v = self.getVelocity();
      if (Math.abs(v) > 20) dir = v > 0 ? 1 : -1;
      gsap.to(tw, { timeScale: dir * Math.min(4, 1 + Math.abs(v) / 900), duration: .3, overwrite: true });
      gsap.to(tw, { timeScale: dir, duration: 1.2, delay: .3 });
    }
  });
}

// ---------- Court 3D du hero ----------
export function heroCourt(hero) {
  if (!hero) return;
  const court = hero.querySelector('.court');
  const lines = hero.querySelectorAll('.court .lines, .court .glass');
  const ball = hero.querySelector('.hero-ball');
  const shadow = hero.querySelector('.hero-ball-shadow');
  const title = hero.querySelectorAll('.hero-title .line > span');
  const rest = hero.querySelectorAll('[data-hero-fade]');
  if (!hasGsap || reduced) { ball && (ball.style.display = 'none'); shadow && (shadow.style.display = 'none'); return; }

  gsap.set(court, { rotateX: 62, rotateZ: -14, scale: 1 }); // remplace la transformation CSS par des valeurs que GSAP connaît
  lines.forEach(p => { const l = p.getTotalLength ? p.getTotalLength() : 1000; p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from(court, { rotateX: 80, rotateZ: -4, scale: .8, opacity: 0, duration: 1.6 })
    .to(lines, { strokeDashoffset: 0, duration: 1.4, stagger: .06, ease: 'power2.inOut' }, '-=1.2')
    .from(title, { yPercent: 120, rotate: 3, duration: 1.1, stagger: .09 }, '-=1.3')
    .from(rest, { opacity: 0, y: 24, duration: .9, stagger: .08 }, '-=.7')
    .add(() => rally(hero, ball, shadow), '-=1.2');

  // au défilement : la caméra prend de la hauteur
  gsap.to(court, { rotateX: 74, rotateZ: -24, scale: 1.25, yPercent: -10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to(hero.querySelector('.hero-content'), { y: -80, opacity: .2, ease: 'none', scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true } });
}

// Un échange : la balle rebondit au sol et sur la vitre du fond.
function rally(hero, ball, shadow) {
  if (!ball) return;
  // points de contact (en % du hero) et hauteur de la trajectoire suivante
  const pts = [
    { x: 14, y: 82, h: 22, d: 1.0 },
    { x: 42, y: 63, h: 16, d: .8 },
    { x: 69, y: 48, h: 9, d: .55 },
    { x: 84, y: 38, h: 4, d: .35, wall: true }, // la vitre !
    { x: 74, y: 44, h: 18, d: .9 },
    { x: 46, y: 66, h: 26, d: 1.1 },
    { x: 24, y: 76, h: 12, d: .7 },
  ];
  let i = 0, t = 0, last = performance.now();
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  gsap.set([ball, shadow], { opacity: 0 });
  gsap.to([ball, shadow], { opacity: 1, duration: .6 });
  gsap.ticker.add(() => {
    const now = performance.now();
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!visible) return;
    const a = pts[i], b = pts[(i + 1) % pts.length];
    t += dt / a.d;
    if (t >= 1) { t = 0; i = (i + 1) % pts.length; squash(ball, b.wall); return; }
    const W = hero.clientWidth, H = hero.clientHeight;
    const e = t; // horizontal linéaire, comme une vraie balle
    const gx = (a.x + (b.x - a.x) * e) / 100 * W;
    const gy = (a.y + (b.y - a.y) * e) / 100 * H;
    const height = Math.sin(Math.PI * t) * a.h / 100 * H;
    const k = 1 - height / (H * .3);
    gsap.set(shadow, { x: gx, y: gy + 10, scale: .5 + .5 * Math.max(0, k), opacity: .25 + .5 * Math.max(0, k) });
    gsap.set(ball, { x: gx, y: gy - height, rotate: (now / 4) % 360 });
  });
}
function squash(el, wall) {
  gsap.fromTo(el, { scaleX: wall ? .6 : 1.35, scaleY: wall ? 1.35 : .65 }, { scaleX: 1, scaleY: 1, duration: .35, ease: 'elastic.out(1, .4)' });
}

// ---------- La balle qui suit le défilement de page ----------
export function reboundBall() {
  if (!hasGsap || reduced || window.innerWidth < 900) return;
  const el = document.createElement('div');
  el.className = 'rebound-ball';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = ballSVG();
  document.body.appendChild(el);
  let lastSide = -1;
  const update = () => {
    const vh = window.innerHeight, vw = document.documentElement.clientWidth;
    const y = window.scrollY;
    const startAt = vh * .7;
    el.classList.toggle('on', y > startAt && y < document.documentElement.scrollHeight - vh * 1.6);
    const phase = Math.max(0, y - startAt) / (vh * 1.15);
    const n = Math.floor(phase), t = phase - n;
    const x01 = n % 2 === 0 ? t : 1 - t;
    const margin = 10, size = 18;
    const x = margin + x01 * (vw - 2 * margin - size);
    const yy = vh * .62 - Math.sin(Math.PI * t) * vh * .2;
    const side = n % 2;
    if (side !== lastSide && lastSide !== -1) gsap.fromTo(el.firstElementChild, { scaleX: .55, scaleY: 1.3 }, { scaleX: 1, scaleY: 1, duration: .4, ease: 'elastic.out(1,.4)' });
    lastSide = side;
    gsap.set(el, { x, y: yy, rotate: phase * 540 });
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export function ballSVG() {
  return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#DDF247"/><path d="M3.2 6.5c4 1.8 5.6 6.8 3.4 13.3M20.8 6.5c-4 1.8-5.6 6.8-3.4 13.3" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/><circle cx="12" cy="12" r="11" fill="none" stroke="rgba(0,0,0,.12)"/></svg>`;
}

// SVG du court (vue de dessus), réutilisé dans plusieurs pages
export function courtSVG() {
  return `<svg viewBox="-40 -40 2080 1080" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect class="surface" x="0" y="0" width="2000" height="1000" rx="6"/>
    <path class="lines" d="M0 0H2000V1000H0Z"/>
    <path class="lines" d="M305 0V1000M1695 0V1000"/>
    <path class="lines" d="M305 500H1695"/>
    <path class="net" d="M1000 -30V1030" fill="none"/>
    <path class="glass" d="M-18 -18H400M1600 -18H2018M-18 1018H400M1600 1018H2018M-18 -18V1018M2018 -18V1018"/>
  </svg>`;
}

export function refresh() { if (hasGsap) ST.refresh(); }

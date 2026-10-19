import { boot } from '../boot.js';
import { settings, centers, offers, blocks, posts, faq, bySection, groupBy, esc, rich, link, ext } from '../data.js';
import { $, set, marqueeHTML, faqHTML, hoursHTML, newsCardHTML, postSheet, openSheet, ctaBandHTML } from '../ui.js';
import { heroCourt, marquee, courtSVG, ballSVG, reduced } from '../fx.js';

boot('home', async ({ s, cs, g }) => {
  set('#court', courtSVG());
  set('#heroBall', ballSVG());

  // --- Hero
  const h = s.home_hero || {};
  if (h.kicker) set('#heroKicker', esc(h.kicker));
  if (h.title) {
    const lines = h.title.split('\n').filter(Boolean);
    set('#heroTitle', lines.map((l, i) => `<span class="line"><span${i === 0 && lines.length > 1 ? ' class="outline"' : ''}>${esc(l)}</span></span>`).join(''));
  }
  if (h.subtitle) set('#heroSub', esc(h.subtitle));
  if (h.cta_label) $('#heroCta').textContent = h.cta_label;
  if (h.cta2_label) { $('#heroCta2').textContent = h.cta2_label; $('#heroCta2').href = link(h.cta2_url, g); }
  set('#heroHours', (s.hours?.items || []).map(x => `<span><b>${esc(x.hours)}</b>${esc(x.days)}</span>`).join(''));
  $('.hero-content').style.opacity = 1;
  heroCourt($('#hero'));

  // --- Bande défilante
  set('#marquee', marqueeHTML(s.marquee?.items || ['Jouer', 'Apprendre', 'Partager'], 'tilt'));
  marquee($('#marquee .marquee'));

  const [bl, of, ps, fq] = await Promise.all([
    blocks('home'),
    offers(['home-pillars', 'first-steps']),
    posts(3),
    faq(),
  ]);
  const B = bySection(bl);
  const O = groupBy(of, 'category');

  // --- Intro
  const intro = B.intro;
  if (intro) {
    set('#introImg', intro.image ? `<img src="${esc(intro.image)}" alt="L'équipe du Let Padel" loading="lazy">` : '');
    set('#introText', `
      <p class="kicker">${esc(intro.kicker || '')}</p>
      <h2 class="display h-l" data-reveal="words">${esc(intro.title)}</h2>
      <div class="lead prose" style="margin:24px 0 30px" data-reveal="up">${rich(intro.body)}</div>
      ${intro.cta_label ? `<a class="btn btn-blue" href="${esc(link(intro.cta_url, g))}">${esc(intro.cta_label)}</a>` : ''}`);
  }

  // --- Piliers
  const track = $('#pillarsTrack');
  track.insertAdjacentHTML('beforeend', (O['home-pillars'] || []).map(p => {
    const url = link(p.cta_url, g);
    return `<a class="pillar" href="${esc(url)}"${ext(url)}>
      ${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : ''}
      <span class="sub">${esc(p.subtitle || '')}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.body || '')}</p>
      ${p.cta_label ? `<span class="btn btn-sm">${esc(p.cta_label)}</span>` : ''}
    </a>`;
  }).join(''));
  horizontalPillars();

  // --- Centres : les deux côtés du filet
  set('#centres', cs.map(c => `
    <a class="net-side" href="centres.html#${esc(c.slug)}">
      <img src="${esc(c.image)}" alt="" loading="lazy">
      <span class="num" aria-hidden="true">${esc(c.postcode)}</span>
      <h3>${esc(c.short_name || c.name)}</h3>
      <p class="addr">${esc(c.address)}, ${esc(c.city)} · ${esc(c.phone)}</p>
      <span class="btn btn-sm">Accéder au centre</span>
    </a>`).join('') + `<div class="net-line" aria-hidden="true"></div><div class="net-label" aria-hidden="true">Choisissez votre côté</div>`);
  netAnim();

  // --- Horaires & chiffres
  set('#hoursBand', hoursHTML(s.hours));
  set('#hoursNote', esc(s.hours?.note || ''));
  set('#scoreGrid', (s.stats?.items || []).map(x => `<div class="score-cell"><span class="score-val" data-count="${esc(x.value)}">${esc(x.value)}</span><span class="score-lbl">${esc(x.label)}</span></div>`).join(''));

  // --- Premier match
  const first = B.first;
  if (first?.kicker) set('#firstKicker', esc(first.kicker));
  if (first?.title) set('#firstTitle', esc(first.title));
  const steps = O['first-steps'] || [];
  set('#steps', `<svg class="steps-path" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M35 70 Q 185 -20 350 70 T 685 70 T 1000 40"/></svg>` + steps.map((st, i) => `
    <div class="step" data-reveal="up" data-delay="${i * .12}">
      <span class="step-n">${esc(st.badge || i + 1)}</span>
      <h3>${esc(st.title)}</h3>
      <p>${esc(st.body || '')}</p>
      ${i === 0 ? `<a class="link-arrow" href="${esc(g.booking_url || '#')}" target="_blank" rel="noopener">${esc(first?.cta_label || 'Je réserve')}</a>` : ''}
    </div>`).join(''));
  stepsPath();

  // --- Restaurant
  const r = B.restaurant;
  if (r) {
    set('#restoImg', r.image ? `<img src="${esc(r.image)}" alt="Au club house du Let Padel" loading="lazy">` : '');
    set('#restoText', `
      <p class="kicker">${esc(r.kicker || '')}</p>
      <h2 class="display h-l" data-reveal="words">${esc(r.title)}</h2>
      <div class="lead prose" style="margin:24px 0 30px" data-reveal="up">${rich(r.body)}</div>
      ${r.cta_label ? `<a class="btn" href="${esc(link(r.cta_url, g))}">${esc(r.cta_label)}</a>` : ''}`);
  }

  // --- Actualités
  set('#news', ps.length ? ps.map(p => newsCardHTML(p, g)).join('') : '<p class="empty">Les prochaines actualités arrivent bientôt.</p>');
  $('#news').addEventListener('click', e => {
    const b = e.target.closest('[data-post]'); if (!b) return;
    const p = ps.find(x => (x.slug || x.id) === b.dataset.post);
    if (p) openSheet(postSheet(p, g), b);
  });

  // --- FAQ
  set('#faqList', faqHTML(fq.slice(0, 5)));

  set('#cta', ctaBandHTML(g));
});

function horizontalPillars() {
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (!gsap || reduced) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const sec = $('#pillars'), track = $('#pillarsTrack');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    track.querySelectorAll('.pillar img').forEach(img => {
      gsap.fromTo(img, { xPercent: -8, scale: 1.18 }, { xPercent: 8, scale: 1.18, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
    });
    return () => tw.scrollTrigger?.kill();
  });
}

function netAnim() {
  const gsap = window.gsap;
  if (!gsap || reduced) return;
  const sec = $('#centres');
  const sides = sec.querySelectorAll('.net-side');
  const wide = window.matchMedia('(min-width: 761px)').matches;
  gsap.from(sides[0], { [wide ? 'xPercent' : 'yPercent']: -30, opacity: 0, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: sec, start: 'top 70%' } });
  if (sides[1]) gsap.from(sides[1], { [wide ? 'xPercent' : 'yPercent']: 30, opacity: 0, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: sec, start: 'top 70%' } });
  gsap.fromTo(sec.querySelector('.net-line'), { '--net': 0 }, { '--net': 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 80%', end: 'top 20%', scrub: true } });
  gsap.from(sec.querySelector('.net-label'), { scale: 0, rotate: -20, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: sec, start: 'top 45%' } });
}

function stepsPath() {
  const gsap = window.gsap;
  const svg = $('#steps .steps-path');
  if (!gsap || reduced || !svg) return;
  gsap.fromTo(svg, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 80%', end: 'top 30%', scrub: true } });
}

// Composants d'interface partagés entre les pages.
import { esc, rich, link, ext, fmtDate } from './data.js';
import { ICON } from './layout.js';
import { courtSVG } from './fx.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const set = (sel, html) => { const el = typeof sel === 'string' ? $(sel) : sel; if (el) el.innerHTML = html; return el; };

export function marqueeHTML(items = [], cls = '') {
  return `<div class="marquee ${cls}" aria-hidden="true"><div class="marquee-track">${items.map(t => `<span class="marquee-item">${esc(t)}</span>`).join('')}${items.map(t => `<span class="marquee-item">${esc(t)}</span>`).join('')}</div></div>`;
}

// Remplit le hero d'une page interne à partir d'un bloc « hero »
export function pageHero(b, fallbackTitle) {
  const hero = $('.page-hero');
  if (!hero) return;
  const title = b?.title || fallbackTitle;
  if (b?.image) {
    let bg = $('.bg', hero);
    if (!bg) { bg = document.createElement('div'); bg.className = 'bg'; hero.prepend(bg); }
    bg.innerHTML = `<img src="${esc(b.image)}" alt="" data-parallax="16" fetchpriority="high">`;
  } else {
    hero.classList.add('plain');
    if (!$('.court-lines', hero)) hero.insertAdjacentHTML('afterbegin', `<svg class="court-lines" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M520 40H980V460H520ZM520 250H900M900 40V460M720 40V460"/></svg>`);
  }
  if (b?.kicker) set($('.kicker', hero), esc(b.kicker));
  const h1 = $('h1', hero);
  if (h1 && title) h1.textContent = title;
  if (b?.body) set($('.lead', hero), rich(b.body));
  document.title = `${title} — Let Padel Club`;
}

export function faqHTML(list) {
  if (!list?.length) return '<p class="empty">Aucune question pour le moment.</p>';
  return list.map(f => `<details><summary>${esc(f.question)}</summary><div class="ans prose">${rich(f.answer)}</div></details>`).join('');
}

export function hoursHTML(hours) {
  return (hours?.items || []).map(h => `<div><span class="muted">${esc(h.days)}</span><div class="big">${esc(h.hours)}</div></div>`).join('');
}

export function mapEmbed(c) {
  const q = encodeURIComponent(`Let Padel ${c.address} ${c.postcode} ${c.city}`);
  return `<div class="map-frame"><iframe title="Plan d'accès — ${esc(c.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${q}&z=15&output=embed"></iframe></div>`;
}

export function centerInfoHTML(c) {
  const tel = (c.phone || '').replace(/\s/g, '');
  return `<div class="center-info">
    <div class="info-row">${ICON.pin}<div><b>${esc(c.address)}</b>${esc(c.postcode)} ${esc(c.city)}<br><a class="link-arrow" href="${esc(c.map_url)}" target="_blank" rel="noopener">Itinéraire</a></div></div>
    <div class="info-row">${ICON.phone}<div><b><a href="tel:${esc(tel)}">${esc(c.phone)}</a></b>Accueil du club</div></div>
    <div class="info-row">${ICON.clock}<div>${(c.hours || []).map(h => `<b>${esc(h.hours)}</b>${esc(h.days)}`).join('<br>')}</div></div>
    ${c.transport ? `<div class="info-row">${ICON.bus}<div><b>En transports</b>${esc(c.transport)}</div></div>` : ''}
  </div>`;
}

export function priceBoardHTML(t) {
  if (!t) return '';
  const cols = t.padel_columns || [];
  const rows = (t.padel_rows || []).map(r => `<tr><td><b>${esc(r.label)}</b><small>${esc(r.unit || '')}</small></td>${(r.values || []).map((v, i) => `<td><span class="v${i ? ' peak' : ''}">${esc(v)}</span></td>`).join('')}</tr>`).join('');
  const periods = (t.periods || []).map(p => `<div><b>${esc(p.name)}</b>${(p.lines || []).map(esc).join('<br>')}</div>`).join('');
  return `<div class="price-board">
    <table><caption class="sr-only">${esc(t.padel_title || 'Tarifs padel')}</caption>
      <thead><tr><th scope="col">${esc(t.padel_title || 'Padel')}</th>${cols.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${periods ? `<div class="price-note">${periods}</div>` : ''}
  </div>`;
}

export function otherPricesHTML(t) {
  if (!t) return '';
  const li = (r) => `<li><b>${esc(r.label)}</b><span>${esc(r.value)}${r.note ? `<small>${esc(r.note)}</small>` : ''}</span></li>`;
  return `<h3 class="display h-s" style="margin-bottom:8px">${esc(t.other_title || '')}</h3>
    <ul class="price-list">${(t.other_rows || []).map(li).join('')}</ul>
    ${(t.extras || []).length ? `<ul class="price-list" style="margin-top:20px">${t.extras.map(li).join('')}</ul>` : ''}`;
}

export function coachesHTML(list) {
  return `<div class="coaches" data-stagger>${list.map((c, i) => `
    <button class="coach" type="button" data-coach="${i}" aria-haspopup="dialog">
      <img src="${esc(c.photo)}" alt="" loading="lazy">
      <span class="plus" aria-hidden="true">+</span>
      <span class="meta">
        <span class="name">${esc(c.name)}</span>
        <span class="role">${esc(c.role || '')}</span>
        ${c.highlight ? `<span class="hl">${esc(c.highlight)}</span>` : ''}
      </span>
      <span class="sr-only">Voir le profil</span>
    </button>`).join('')}</div>`;
}

export function bindCoaches(root, list) {
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-coach]');
    if (!b) return;
    const c = list[+b.dataset.coach];
    openSheet(`<div class="sheet-in">
      <div class="frame"><img src="${esc(c.photo)}" alt="${esc(c.name)}"></div>
      <div class="sheet-body">
        <p class="kicker">${esc(c.role || 'Coach')}</p>
        <h2 class="display h-m">${esc(c.name)}</h2>
        ${c.highlight ? `<p style="margin-top:12px"><span class="tag event">${esc(c.highlight)}</span></p>` : ''}
        <div class="prose" style="margin-top:18px">${rich(c.bio)}</div>
      </div></div>`, b);
  });
}

export function openSheet(html, opener) {
  let d = $('#sheet');
  if (!d) {
    d = document.createElement('dialog');
    d.id = 'sheet'; d.className = 'sheet';
    document.body.appendChild(d);
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    d.addEventListener('close', () => { window.__lenis?.start(); d.__opener?.focus(); });
  }
  d.__opener = opener;
  d.innerHTML = `<button class="sheet-close" type="button" aria-label="Fermer">×</button>${html}`;
  $('.sheet-close', d).addEventListener('click', () => d.close());
  window.__lenis?.stop();
  d.showModal();
  d.scrollTop = 0;
}

export function newsCardHTML(p, g) {
  const date = p.kind === 'event' && p.event_date ? fmtDate(p.event_date) : fmtDate(p.published_at);
  return `<button class="news-card" type="button" data-post="${esc(p.slug || p.id)}">
    <div class="frame">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : ''}</div>
    <div class="body">
      <span class="tag${p.kind === 'event' ? ' event' : ''}">${p.kind === 'event' ? 'Événement' : p.kind === 'blog' ? 'Blog' : 'Actualité'}</span>
      <span class="date">&nbsp; ${esc(date)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.excerpt || '')}</p>
    </div></button>`;
}

export function postSheet(p, g) {
  const url = link(p.link_url, g);
  const linkLabel = /helloasso/.test(url) ? 'Je prends ma licence' : /\.pdf($|\?)/i.test(url) ? 'Télécharger la brochure' : /forms\.gle|google\.com\/forms/.test(url) ? 'Je m\'inscris' : 'En savoir plus';
  return `<article>
    ${p.image ? `<div class="frame wide" style="border-radius:0"><img src="${esc(p.image)}" alt=""></div>` : ''}
    <div class="sheet-body">
      <p class="kicker">${p.kind === 'event' ? 'Événement' : 'Actualité'} — ${esc(p.kind === 'event' && p.event_date ? fmtDate(p.event_date) : fmtDate(p.published_at))}${p.location ? ' — ' + esc(p.location) : ''}</p>
      <h2 class="display h-m">${esc(p.title)}</h2>
      <div class="prose" style="margin-top:20px">${rich(p.body || `<p>${esc(p.excerpt || '')}</p>`)}</div>
      ${p.link_url ? `<p style="margin-top:24px"><a class="btn" href="${esc(url)}"${ext(url)}>${linkLabel}</a></p>` : ''}
    </div></article>`;
}

export function ctaBandHTML(g, title = 'Prêts à jouer ?', text = 'Choisissez votre centre, votre créneau, et rendez-vous sur la piste.') {
  return `<section class="cta-band section-tight">
    <svg class="court-mini" viewBox="0 0 2000 1000" aria-hidden="true"><rect x="0" y="0" width="2000" height="1000"/><path d="M305 0V1000M1695 0V1000M305 500H1695M1000 0V1000"/></svg>
    <div class="wrap">
      <h2 class="display big" data-reveal="words">${esc(title)}</h2>
      <p class="lead" style="margin:18px 0 28px">${esc(text)}</p>
      <div class="btn-row">
        <a class="btn btn-white" href="${esc(g.booking_url || '#')}" target="_blank" rel="noopener">Je réserve une piste</a>
        <a class="btn btn-ghost" href="contact.html">Nous contacter</a>
      </div>
    </div></section>`;
}

export { courtSVG };

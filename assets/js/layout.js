// En-tête, menu mobile, bandeau d'annonce et pied de page communs à toutes les pages.
import { settings, centers, esc, ext } from './data.js';

const NAV = [
  ['centres', 'centres.html', 'Nos centres'],
  ['academie', 'academie.html', 'Académie'],
  ['entreprise', 'entreprise.html', 'Entreprise'],
  ['restaurant', 'restaurant.html', 'La cuisine'],
  ['club', 'club.html', 'Le club'],
  ['actualites', 'actualites.html', 'Actualités'],
  ['contact', 'contact.html', 'Contact'],
];

const FALLBACK = {
  logo: 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/principal/logo-lp.svg',
  logo_white: 'https://kdcflcvufukagdjycwww.supabase.co/storage/v1/object/public/letpadel-media/site/principal/logo-lp-blanc.svg',
  booking_url: 'https://letpadel.doinsport.club/home',
  tournaments_url: 'https://letpadel.doinsport.club/home',
};

export const ICON = {
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 17v3M16 17v3"/><circle cx="8" cy="14" r=".6" fill="currentColor"/><circle cx="16" cy="14" r=".6" fill="currentColor"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

export function header(page, g = FALLBACK) {
  const items = NAV.map(([k, href, label]) => `<li><a href="${href}"${k === page ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
  return `
  <a class="skip" href="#main">Aller au contenu</a>
  <div class="announce" id="announce" hidden></div>
  <header class="site-header" id="siteHeader">
    <div class="wrap header-in">
      <a class="brand" href="index.html" aria-label="Let Padel Club — accueil">
        <img class="logo-color" src="${esc(g.logo)}" alt="Let Padel Club" width="106" height="52">
        <img class="logo-white" src="${esc(g.logo_white)}" alt="" width="106" height="52">
      </a>
      <nav class="nav" aria-label="Navigation principale"><ul>${items}</ul></nav>
      <div class="header-cta">
        <a class="btn btn-ghost btn-sm" data-link="tournaments" href="${esc(g.tournaments_url)}" target="_blank" rel="noopener">Tournois</a>
        <a class="btn btn-sm" data-link="booking" href="${esc(g.booking_url)}" target="_blank" rel="noopener">Je réserve</a>
      </div>
      <button class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    <ul>${`<li><a href="index.html"${page === 'home' ? ' aria-current="page"' : ''}>Accueil</a></li>` + items}</ul>
    <div class="btn-row">
      <a class="btn" data-link="booking" href="${esc(g.booking_url)}" target="_blank" rel="noopener">Je réserve</a>
      <a class="btn btn-ghost" data-link="tournaments" href="${esc(g.tournaments_url)}" target="_blank" rel="noopener">Tournois</a>
    </div>
  </div>`;
}

export function footer(g = {}, cs = []) {
  const year = new Date().getFullYear();
  const centersHtml = cs.map(c => `
    <div>
      <h2>${esc(c.name)}</h2>
      <ul>
        <li>${esc(c.address)}<br>${esc(c.postcode)} ${esc(c.city)}</li>
        <li><a href="tel:${esc((c.phone || '').replace(/\s/g, ''))}">${esc(c.phone)}</a></li>
        <li><a href="${esc(c.map_url)}" target="_blank" rel="noopener">Itinéraire</a></li>
      </ul>
    </div>`).join('');
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <img class="footer-logo" src="${esc(g.logo_white || FALLBACK.logo_white)}" alt="Let Padel Club" width="143" height="70">
          <p>${esc(g.description || '')}</p>
          <div class="socials">
            ${g.instagram ? `<a href="${esc(g.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>` : ''}
            ${g.facebook ? `<a href="${esc(g.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${ICON.fb}</a>` : ''}
          </div>
        </div>
        ${centersHtml}
        <div>
          <h2>Le club</h2>
          <ul>
            <li><a href="club.html">Notre histoire</a></li>
            <li><a href="academie.html">L'Académie</a></li>
            <li><a href="actualites.html">Actualités</a></li>
            ${g.shop_url ? `<li><a href="${esc(g.shop_url)}" target="_blank" rel="noopener">Let Padel Shop</a></li>` : ''}
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-word" aria-hidden="true">Let's play</div>
      <div class="footer-bottom">
        <span>© ${year} Let Padel — tous droits réservés</span>
        <nav aria-label="Informations légales">
          ${g.cgv_url ? `<a href="${esc(g.cgv_url)}" target="_blank" rel="noopener">Conditions générales de vente</a>` : ''}
          <a href="mentions-legales.html">Mentions légales</a>
          <a href="admin/">Espace admin</a>
        </nav>
      </div>
    </div>
  </footer>`;
}

function announce(a) {
  const el = document.getElementById('announce');
  if (!el || !a?.active || !a.text) return;
  const key = 'lp-ann-' + a.text.length + a.text.slice(0, 12);
  try { if (localStorage.getItem(key)) return; } catch {}
  el.innerHTML = (a.url ? `<a href="${esc(a.url)}"${ext(a.url)}>${esc(a.text)}</a>` : esc(a.text)) + '<button type="button" aria-label="Masquer l\'annonce">×</button>';
  el.hidden = false;
  el.querySelector('button').addEventListener('click', () => { el.hidden = true; try { localStorage.setItem(key, '1'); } catch {} });
}

function behaviour() {
  const h = document.getElementById('siteHeader');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    h.classList.toggle('is-solid', y > 40);
    h.classList.toggle('is-hidden', y > 400 && y > last + 4 && !document.body.classList.contains('menu-open'));
    if (y < last - 4) h.classList.remove('is-hidden');
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const close = () => { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); window.__lenis?.start(); };
  burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.setAttribute('aria-hidden', String(!open));
    open ? window.__lenis?.stop() : window.__lenis?.start();
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// Monte le gabarit immédiatement, puis complète avec les données.
export async function mountLayout(page) {
  document.documentElement.classList.add('js');
  const top = document.getElementById('top');
  const bottom = document.getElementById('bottom');
  if (top) top.outerHTML = header(page);
  behaviour();
  try {
    const [s, cs] = await Promise.all([settings(), centers()]);
    const g = s.general || {};
    document.querySelectorAll('[data-link="booking"]').forEach(a => g.booking_url && (a.href = g.booking_url));
    document.querySelectorAll('[data-link="tournaments"]').forEach(a => g.tournaments_url && (a.href = g.tournaments_url));
    if (bottom) bottom.outerHTML = footer(g, cs);
    announce(s.announce);
    return { s, cs, g };
  } catch (e) {
    console.error(e);
    if (bottom) bottom.outerHTML = footer({}, []);
    return { s: {}, cs: [], g: {} };
  }
}

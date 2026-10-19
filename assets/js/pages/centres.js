import { boot } from '../boot.js';
import { offers, blocks, bySection, groupBy, esc, link, ext } from '../data.js';
import { $, $$, set, pageHero, centerInfoHTML, mapEmbed, priceBoardHTML, otherPricesHTML, ctaBandHTML } from '../ui.js';

boot('centres', async ({ s, cs, g }) => {
  const [bl, of] = await Promise.all([blocks('centres'), offers(['equipements', 'avantages'])]);
  const B = bySection(bl);
  if (B.hero) pageHero(B.hero);
  const O = groupBy(of, 'category');

  set('#switch', cs.map((c, i) => `<a href="#${esc(c.slug)}"${i === 0 ? ' class="active"' : ''}>${esc(c.short_name || c.name)}</a>`).join(''));

  set('#centersList', cs.map((c, i) => `
    <section class="center-block${i % 2 ? ' on-white' : ''}" id="${esc(c.slug)}" aria-labelledby="t-${esc(c.slug)}">
      <div class="wrap">
        <div class="split${i % 2 ? ' reverse' : ''}" style="align-items:start">
          <div>
            <p class="kicker">${esc(c.city)}</p>
            <h2 class="display h-l" id="t-${esc(c.slug)}" data-reveal="words">${esc(c.name)}</h2>
            <p class="lead" style="margin:20px 0 28px" data-reveal="up">${esc(c.description || '')}</p>
            ${centerInfoHTML(c)}
            <div class="btn-row" style="margin-top:30px">
              <a class="btn" href="${esc(c.booking_url || g.booking_url || '#')}" target="_blank" rel="noopener">Je réserve à ${esc(c.short_name || c.city)}</a>
              <a class="btn btn-ghost" href="contact.html?centre=${esc(c.slug)}">Nous contacter</a>
            </div>
          </div>
          <div style="display:grid;gap:16px">
            <div class="frame wide reveal-wipe"><img src="${esc(c.image)}" alt="Les pistes de ${esc(c.name)}" loading="lazy"></div>
            ${mapEmbed(c)}
          </div>
        </div>
      </div>
    </section>`).join(''));

  // Centre actif dans le sélecteur
  if (window.ScrollTrigger) {
    cs.forEach(c => window.ScrollTrigger.create({
      trigger: '#' + c.slug, start: 'top 50%', end: 'bottom 50%',
      onToggle: self => self.isActive && $$('#switch a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + c.slug)),
    }));
  }

  set('#equip', (O.equipements || []).map(e => `
    <div class="equip-item">${e.image ? `<img src="${esc(e.image)}" alt="" loading="lazy">` : ''}<b>${esc(e.title)}</b>${e.subtitle ? `<small>${esc(e.subtitle)}</small>` : ''}</div>`).join(''));

  set('#priceBoard', priceBoardHTML(s.tarifs));
  set('#otherPrices', otherPricesHTML(s.tarifs));

  set('#perks', (O.avantages || []).map(a => {
    const url = link(a.cta_url, g);
    return `<div class="glass-card">
      ${a.badge ? `<span class="tag event">${esc(a.badge)}</span>` : ''}
      <h3 class="display h-m" style="margin:14px 0 6px">${esc(a.title)}</h3>
      <p style="font-weight:700;color:var(--ball)">${esc(a.subtitle || '')}</p>
      <p style="color:rgba(255,255,255,.85)">${esc(a.body || '')}</p>
      ${a.cta_label ? `<a class="link-arrow" style="color:#fff" href="${esc(url)}"${ext(url)}>${esc(a.cta_label)}</a>` : ''}
    </div>`;
  }).join(''));

  set('#cta', ctaBandHTML(g));
});

import { boot } from '../boot.js';
import { offers, blocks, gallery, bySection, groupBy, esc, rich, link, ext } from '../data.js';
import { set, pageHero, ctaBandHTML } from '../ui.js';

boot('entreprise', async ({ g }) => {
  const [bl, of, ga] = await Promise.all([blocks('entreprise'), offers(['entreprise', 'entreprise-formats']), gallery('entreprise')]);
  const B = bySection(bl);
  const O = groupBy(of, 'category');
  pageHero(B.hero, 'Entreprise');

  set('#bizOffers', (O.entreprise || []).map(o => `
    <div class="card" style="display:flex;flex-direction:column;gap:6px;min-height:240px">
      <span class="display" style="font-size:2.6rem;color:var(--orange);line-height:1">${esc(o.badge || '')}</span>
      <h3 style="margin-top:auto">${esc(o.title)}</h3>
      <p class="muted" style="margin:0">${esc(o.body || '')}</p>
    </div>`).join(''));

  set('#bizFormats', (O['entreprise-formats'] || []).map((f, i) => {
    const url = link(f.cta_url, g);
    return `<section class="section${i % 2 ? ' on-white' : ' on-dark'}">
      <div class="wrap split${i % 2 ? ' reverse' : ''}">
        <div class="frame-deco"><div class="frame wide reveal-wipe">${f.image ? `<img src="${esc(f.image)}" alt="" loading="lazy">` : ''}</div></div>
        <div>
          <p class="kicker">${esc(f.subtitle || '')}</p>
          <h2 class="display h-l" data-reveal="words">${esc(f.title)}</h2>
          <div class="lead prose" style="margin:22px 0 28px">${rich(f.body)}</div>
          ${f.cta_label ? `<a class="btn" href="${esc(url)}"${ext(url)}>${esc(f.cta_label)}</a>` : ''}
        </div>
      </div></section>`;
  }).join(''));

  const c = B.contact;
  set('#bizContact', c ? `
    <div class="frame square reveal-wipe" style="max-width:460px">${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy">` : ''}</div>
    <div>
      <p class="kicker light">${esc(c.kicker || '')}</p>
      <h2 class="display h-l" data-reveal="words">${esc(c.title)}</h2>
      <div class="lead prose" style="margin:22px 0 28px;color:rgba(255,255,255,.9)">${rich(c.body)}</div>
      ${c.cta_label ? `<a class="btn btn-white" href="${esc(link(c.cta_url, g))}">${esc(c.cta_label)}</a>` : ''}
    </div>` : '');

  // galerie : album « entreprise » s'il existe, sinon les visuels des formats
  const imgs = ga.length ? ga : [];
  if (!imgs.length) document.getElementById('galerie-entreprise').remove();
  else set('#bizGallery', imgs.map(x => `<figure><img src="${esc(x.image)}" alt="${esc(x.caption || '')}" loading="lazy">${x.caption ? `<figcaption>${esc(x.caption)}</figcaption>` : ''}</figure>`).join(''));

  set('#cta', ctaBandHTML(g, 'Un projet pour vos équipes ?', 'Parlez-nous de votre événement : nous construisons la formule adaptée, clés en main.'));
});

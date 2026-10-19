import { boot } from '../boot.js';
import { offers, blocks, bySection, esc, rich } from '../data.js';
import { $, set, pageHero, marqueeHTML, centerInfoHTML, ctaBandHTML } from '../ui.js';
import { marquee } from '../fx.js';

boot('restaurant', async ({ cs, g }) => {
  const [bl, of] = await Promise.all([blocks('restaurant'), offers(['restaurant-moments'])]);
  const B = bySection(bl);
  pageHero(B.hero, 'La cuisine du Let');

  const i = B.intro;
  set('#restoIntro', i ? `
    <div>
      <p class="kicker">${esc(i.kicker || '')}</p>
      <h2 class="display h-l" data-reveal="words">${esc(i.title)}</h2>
      <div class="lead prose" style="margin-top:24px" data-reveal="up">${rich(i.body)}</div>
    </div>
    <div class="frame-deco"><div class="frame square reveal-wipe" style="background:#FDF0DA">${i.image ? `<img src="${esc(i.image)}" alt="La carte de la cuisine du Let" loading="lazy" style="object-fit:contain">` : ''}</div></div>` : '');

  set('#restoMarquee', marqueeHTML(['Produits frais', 'Fait maison', 'Planches à partager', 'Afterwork', 'Terrasse'], 'tilt'));
  marquee($('#restoMarquee .marquee'));

  set('#moments-list', of.map(m => `
    <div class="photo-card">
      <div class="frame">${m.image ? `<img src="${esc(m.image)}" alt="" loading="lazy">` : ''}</div>
      <h3>${esc(m.title)}</h3>
      <p>${esc(m.body || '')}</p>
    </div>`).join(''));

  set('#restoCenters', cs.map(c => `<div class="card"><h3>${esc(c.name)}</h3>${centerInfoHTML(c)}</div>`).join(''));
  set('#cta', ctaBandHTML(g, 'Une partie, puis un verre ?', 'Réservez votre piste et prolongez le moment au club house.'));
});

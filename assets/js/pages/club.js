import { boot } from '../boot.js';
import { offers, blocks, gallery, bySection, groupBy, esc, rich, link } from '../data.js';
import { $, set, pageHero, marqueeHTML, ctaBandHTML } from '../ui.js';
import { marquee } from '../fx.js';

boot('club', async ({ s, g }) => {
  const [bl, of, ga] = await Promise.all([blocks('club'), offers(['infrastructures', 'clubhouse']), gallery('general')]);
  const B = bySection(bl);
  const O = groupBy(of, 'category');
  pageHero(B.hero, 'Notre histoire');

  const st = B.story;
  set('#story', st ? `
    <div class="frame-deco"><div class="frame tall reveal-wipe">${st.image ? `<img src="${esc(st.image)}" alt="Les fondateurs du Let Padel" loading="lazy">` : ''}</div></div>
    <div>
      <p class="kicker">${esc(st.kicker || '')}</p>
      <h2 class="display h-l" data-reveal="words">${esc(st.title)}</h2>
      <div class="lead prose" style="margin-top:24px" data-reveal="up">${rich(st.body)}</div>
    </div>` : '');

  set('#clubMarquee', marqueeHTML(s.marquee?.items || [], 'dark'));
  marquee($('#clubMarquee .marquee'));

  const inf = B.infra;
  set('#infraHead', inf ? `<div><p class="kicker">${esc(inf.kicker || '')}</p><h2 class="display h-l" data-reveal="words">${esc(inf.title)}</h2></div><div class="lead prose" style="color:rgba(255,255,255,.85)">${rich(inf.body)}</div>` : '');
  set('#infra', (O.infrastructures || []).map(x => `
    <div class="photo-card">
      <div class="frame">${x.image ? `<img src="${esc(x.image)}" alt="" loading="lazy">` : ''}</div>
      <h3>${esc(x.title)}</h3>
      <p>${esc(x.body || '')}</p>
    </div>`).join(''));

  set('#scoreGrid', (s.stats?.items || []).map(x => `<div class="score-cell"><span class="score-val" data-count="${esc(x.value)}">${esc(x.value)}</span><span class="score-lbl">${esc(x.label)}</span></div>`).join(''));

  const ch = B.clubhouse;
  set('#chHead', ch ? `<div><p class="kicker">${esc(ch.kicker || '')}</p><h2 class="display h-l" data-reveal="words">${esc(ch.title)}</h2></div><div><div class="lead prose muted">${rich(ch.body)}</div>${ch.cta_label ? `<p style="margin-top:18px"><a class="link-arrow" href="${esc(link(ch.cta_url, g))}">${esc(ch.cta_label)}</a></p>` : ''}</div>` : '');
  set('#clubhouse', (O.clubhouse || []).map(x => `
    <div class="photo-card"><div class="frame" style="aspect-ratio:4/5">${x.image ? `<img src="${esc(x.image)}" alt="" loading="lazy">` : ''}</div><h3>${esc(x.title)}</h3>${x.body ? `<p>${esc(x.body)}</p>` : ''}</div>`).join(''));

  if (!ga.length) $('#galerie').remove();
  else set('#gallery', ga.map(x => `<figure><img src="${esc(x.image)}" alt="${esc(x.caption || '')}" loading="lazy">${x.caption ? `<figcaption>${esc(x.caption)}</figcaption>` : ''}</figure>`).join(''));

  set('#cta', ctaBandHTML(g));
});

import { boot } from '../boot.js';
import { offers, blocks, coaches, faq, bySection, groupBy, esc, rich, link, ext } from '../data.js';
import { $, set, pageHero, coachesHTML, bindCoaches, faqHTML, ctaBandHTML } from '../ui.js';

boot('academie', async ({ g }) => {
  const [bl, of, co, fq] = await Promise.all([
    blocks('academie'), offers(['programmes', 'cycles', 'cours', 'stages']), coaches(), faq(),
  ]);
  const B = bySection(bl);
  const O = groupBy(of, 'category');
  pageHero(B.hero, "L'Académie");
  const br = $('#brochure');
  if (g.brochure_url) br.href = g.brochure_url; else br.remove();

  // Découvrir
  const d = B.discover;
  set('#discover', d ? `
    <div class="frame-deco"><div class="frame tall reveal-wipe">${d.image ? `<img src="${esc(d.image)}" alt="" loading="lazy">` : ''}</div></div>
    <div>
      <p class="kicker">${esc(d.kicker || '')}</p>
      <h2 class="display h-l" data-reveal="words">${esc(d.title)}</h2>
      <div class="lead prose" style="margin:24px 0 30px" data-reveal="up">${rich(d.body)}</div>
      ${d.cta_label ? `<a class="btn" href="${esc(link(d.cta_url, g))}"${ext(link(d.cta_url, g))}>${esc(d.cta_label)}</a>` : ''}
    </div>` : '');

  // Jeunes / adultes
  set('#programs', (O.programmes || []).map(p => {
    const url = link(p.cta_url, g);
    return `<article class="card program" data-reveal="up">
      ${p.image ? `<div class="frame square" style="border-radius:50%"><img src="${esc(p.image)}" alt="" loading="lazy"></div>` : '<span></span>'}
      <div>
        ${p.badge ? `<span class="tag event">${esc(p.badge)}</span>` : ''}
        <h3 class="display h-m" style="margin:12px 0 6px">${esc(p.title)}</h3>
        <p class="sub">${esc(p.subtitle || '')}</p>
        <div class="prose">${rich(p.body)}</div>
        <div class="btn-row" style="margin-top:22px">
          ${p.cta_label ? `<a class="btn btn-sm" href="${esc(url)}"${ext(url)}>${esc(p.cta_label)}</a>` : ''}
          ${g.brochure_url ? `<a class="btn btn-sm btn-ghost" href="${esc(g.brochure_url)}" target="_blank" rel="noopener">Brochure</a>` : ''}
        </div>
      </div>
    </article>`;
  }).join(''));

  // Cycles : on situe aujourd'hui dans la saison
  const cy = O.cycles || [];
  const today = new Date();
  const parse = (s, y) => { const m = (s || '').match(/(\d{2})\/(\d{2})\D+(\d{2})\/(\d{2})/); if (!m) return null; return [new Date(+y, +m[2] - 1, +m[1]), new Date(+y, +m[4] - 1, +m[3], 23)]; };
  let nowIdx = -1, doneIdx = -1;
  cy.forEach((c, i) => { const r = parse(c.subtitle, c.badge || today.getFullYear()); if (!r) return; if (today >= r[0] && today <= r[1]) nowIdx = i; if (today > r[1]) doneIdx = i; });
  const progressTo = nowIdx >= 0 ? nowIdx : doneIdx;
  $('#cycleList').insertAdjacentHTML('beforeend', cy.map((c, i) => `
    <div class="cycle${i === nowIdx ? ' now' : ''}">
      <em>${esc(c.badge || '')}${i === nowIdx ? ' — en cours' : (i === progressTo + 1 && nowIdx < 0 ? ' — prochain' : '')}</em>
      <b>${esc(c.title)}</b>
      <span>${esc(c.subtitle || '')}</span>
    </div>`).join(''));
  const prog = $('#cycleList .progress');
  const pct = cy.length ? Math.max(0, (progressTo + .5) / cy.length * 100) : 0;
  if (window.gsap) window.gsap.to(prog, { width: pct + '%', duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: '#cycleList', start: 'top 80%' } });
  else prog.style.width = pct + '%';

  // Cours ponctuels
  set('#lessons', (O.cours || []).map((c, i) => {
    const n = parseInt((c.subtitle || '').match(/\d+/)?.[0] || i + 1, 10);
    return `<div class="lesson">
      <span class="who" aria-hidden="true">${'<i></i>'.repeat(Math.min(n, 4))}</span>
      <b>${esc(c.title)}</b>
      <small>${esc(c.subtitle || '')}</small>
      <span class="p">${esc(c.price || '')}</span>
      <small>${esc(c.badge || 'l\'heure')}</small>
    </div>`;
  }).join(''));

  // Stages
  const st = O.stages || [];
  set('#stageList', `<div class="sec-head"><p class="kicker light">Stages vacances</p><h2 class="display h-l" data-reveal="words">Des vacances à fond</h2></div>` + (st.length ? st.map(s => {
    const url = link(s.cta_url, g);
    return `<div class="split" style="align-items:center;margin-top:24px">
      <div class="frame wide reveal-wipe">${s.image ? `<img src="${esc(s.image)}" alt="" loading="lazy">` : ''}</div>
      <div>
        <h3 class="display h-m">${esc(s.title)}</h3>
        <p style="font-weight:700;color:var(--ball);margin:10px 0 16px">${esc(s.subtitle || '')}</p>
        <div class="prose" style="color:rgba(255,255,255,.88)">${rich(s.body)}</div>
        <p style="margin:22px 0 4px"><span class="display h-m" style="color:#fff">${esc(s.price || '')}</span> <span style="color:rgba(255,255,255,.75)">${esc(s.badge || '')}</span></p>
        ${s.cta_label ? `<a class="btn" style="margin-top:16px" href="${esc(url)}"${ext(url)}>${esc(s.cta_label)}</a>` : ''}
      </div></div>`;
  }).join('') : `<p class="lead" style="color:rgba(255,255,255,.85)">Les prochains stages seront annoncés ici. <a class="link-arrow" style="color:#fff" href="contact.html?sujet=stages">Être prévenu</a></p>`));

  // Centre d'entraînement
  const t = B.training;
  set('#training', t ? `
    <div class="frame-deco"><div class="frame wide reveal-wipe">${t.image ? `<img src="${esc(t.image)}" alt="" loading="lazy">` : ''}</div></div>
    <div>
      <p class="kicker">${esc(t.kicker || '')}</p>
      <h2 class="display h-l" data-reveal="words">${esc(t.title)}</h2>
      <div class="lead prose" style="margin:24px 0 30px">${rich(t.body)}</div>
      ${t.cta_label ? `<a class="btn btn-blue" href="${esc(link(t.cta_url, g))}">${esc(t.cta_label)}</a>` : ''}
    </div>` : '');

  // Coachs
  set('#coachList', coachesHTML(co));
  bindCoaches($('#coachList'), co);

  set('#faqList', faqHTML(fq));
  set('#cta', ctaBandHTML(g, 'On se voit sur la piste ?', 'Une question sur les cours ? Mathis, notre responsable pédagogique, vous oriente vers la bonne formule.'));
});

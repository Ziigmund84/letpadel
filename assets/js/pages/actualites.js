import { boot } from '../boot.js';
import { posts, blocks, bySection, esc } from '../data.js';
import { $, $$, set, pageHero, newsCardHTML, postSheet, openSheet, ctaBandHTML } from '../ui.js';
import { ICON } from '../layout.js';
import { reveal, refresh } from '../fx.js';

boot('actualites', async ({ g }) => {
  const [ps, bl] = await Promise.all([posts(), blocks('actualites')]);
  const B = bySection(bl);
  if (B.hero) pageHero(B.hero);

  // Les événements à venir passent devant
  const today = new Date().toISOString().slice(0, 10);
  const sorted = [...ps].sort((a, b) => {
    const ua = a.kind === 'event' && a.event_date >= today, ub = b.kind === 'event' && b.event_date >= today;
    if (ua !== ub) return ua ? -1 : 1;
    return (b.published_at || '').localeCompare(a.published_at || '');
  });

  // Masque les filtres vides
  $$('#filters [data-kind]').forEach(b => { if (b.dataset.kind !== 'all' && !ps.some(p => p.kind === b.dataset.kind)) b.remove(); });

  const draw = (kind) => {
    const list = kind === 'all' ? sorted : sorted.filter(p => p.kind === kind);
    set('#news', list.length ? list.map(p => newsCardHTML(p, g)).join('') : '<p class="empty">Aucune publication dans cette catégorie pour le moment.</p>');
    reveal($('#news')); refresh();
  };
  draw('all');

  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('button[data-kind]'); if (!b) return;
    $$('#filters button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    draw(b.dataset.kind);
  });

  const open = (key, opener) => { const p = ps.find(x => (x.slug || x.id) === key); if (p) { openSheet(postSheet(p, g), opener); history.replaceState(null, '', '?a=' + encodeURIComponent(key)); } };
  $('#news').addEventListener('click', e => { const b = e.target.closest('[data-post]'); if (b) open(b.dataset.post, b); });
  document.addEventListener('close', () => history.replaceState(null, '', location.pathname), true);
  const q = new URLSearchParams(location.search).get('a');
  if (q) setTimeout(() => open(q), 300);

  set('#socialBtns', [
    g.instagram && `<a class="btn" href="${esc(g.instagram)}" target="_blank" rel="noopener">${ICON.ig.replace('<svg', '<svg width="20" height="20"')} Instagram</a>`,
    g.facebook && `<a class="btn btn-ghost" href="${esc(g.facebook)}" target="_blank" rel="noopener">${ICON.fb.replace('<svg', '<svg width="20" height="20"')} Facebook</a>`,
  ].filter(Boolean).join(''));

  set('#cta', ctaBandHTML(g));
});

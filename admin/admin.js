// Espace d'administration Let Padel — Supabase (auth + base + stockage)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.1.7/+esm';
import { SUPABASE_URL, SUPABASE_KEY, MEDIA_BUCKET, PREFIX } from '../assets/js/config.js';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, storageKey: 'letpadel-admin' } });
const T = (name) => sb.from(PREFIX + name);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = '') => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PUBLIC = `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/`;

function toast(text, err = false) {
  const t = $('#toast');
  t.textContent = text; t.className = 'toast show' + (err ? ' err' : '');
  clearTimeout(t._t); t._t = setTimeout(() => t.className = 'toast', 3200);
}
function clearPublicCache() { try { Object.keys(sessionStorage).filter(k => k.startsWith('lp:')).forEach(k => sessionStorage.removeItem(k)); } catch {} }

// ============================================================
// Schémas de contenu
// ============================================================
const PAGES = { home: 'Accueil', centres: 'Nos centres', academie: 'Académie', entreprise: 'Entreprise', restaurant: 'La cuisine', club: 'Le club', actualites: 'Actualités', contact: 'Contact' };
const SECTIONS = {
  home: { intro: 'Présentation du club', restaurant: 'Teaser restaurant', first: 'Premier match (titres)' },
  centres: { hero: 'Bandeau de page' },
  academie: { hero: 'Bandeau de page', discover: 'Découvrir le padel', training: "Centre d'entraînement" },
  entreprise: { hero: 'Bandeau de page', contact: 'Votre interlocuteur' },
  restaurant: { hero: 'Bandeau de page', intro: 'Nouvelle carte' },
  club: { hero: 'Bandeau de page', story: 'Notre histoire', infra: 'Infrastructures (intro)', clubhouse: 'Club house (intro)' },
  actualites: { hero: 'Bandeau de page' },
  contact: { hero: 'Bandeau de page' },
};
const CATEGORIES = {
  'home-pillars': ['Accueil — Jouer / Apprendre / Entreprise', 'Les 3 grandes cartes du défilement horizontal.'],
  'first-steps': ['Accueil — Premier match en 3 étapes', 'Les 3 étapes numérotées.'],
  'equipements': ['Centres — Équipements', 'Icônes « tout est sur place ».'],
  'avantages': ['Centres — Avantages club', 'Abonnements, wallets, licence…'],
  'programmes': ['Académie — Jeunes / Adultes', 'Programmes de la saison.'],
  'cycles': ['Académie — Cycles adultes', 'Titre = Cycle n, sous-titre = « Du jj/mm au jj/mm », badge = année.'],
  'cours': ['Académie — Cours ponctuels', 'Prix par personne ; le nombre dans le sous-titre dessine les joueurs.'],
  'stages': ['Académie — Stages vacances', 'Prix = tarif principal, badge = tarif secondaire.'],
  'entreprise': ['Entreprise — Formules', 'Badge = mot court affiché en grand.'],
  'entreprise-formats': ['Entreprise — Formats événements', 'Lunch Social Club, Afterwork…'],
  'infrastructures': ['Le club — Infrastructures', ''],
  'clubhouse': ['Le club — Club house', ''],
  'restaurant-moments': ['La cuisine — Moments', ''],
};
const LINK_HINT = 'Lien d\'une page du site (ex. academie.html), adresse complète, ou raccourci : @booking, @licence, @shop, @tournaments, @brochure';

const F = {
  text: (k, label, o = {}) => ({ k, label, t: 'text', ...o }),
  area: (k, label, o = {}) => ({ k, label, t: 'textarea', ...o }),
  rich: (k, label, o = {}) => ({ k, label, t: 'rich', ...o }),
  img: (k, label, o = {}) => ({ k, label, t: 'image', ...o }),
  file: (k, label, o = {}) => ({ k, label, t: 'image', file: true, ...o }),
  url: (k, label, o = {}) => ({ k, label, t: 'text', hint: LINK_HINT, ...o }),
  bool: (k, label, o = {}) => ({ k, label, t: 'bool', ...o }),
  num: (k, label, o = {}) => ({ k, label, t: 'number', ...o }),
  date: (k, label, o = {}) => ({ k, label, t: 'date', ...o }),
  dt: (k, label, o = {}) => ({ k, label, t: 'datetime', ...o }),
  sel: (k, label, opts, o = {}) => ({ k, label, t: 'select', opts, ...o }),
  strs: (k, label, o = {}) => ({ k, label, t: 'strlist', ...o }),
  imgs: (k, label, o = {}) => ({ k, label, t: 'imglist', ...o }),
  list: (k, label, fields, o = {}) => ({ k, label, t: 'list', fields, ...o }),
};

const TABLES = {
  posts: {
    label: 'Actualités', order: ['published_at', false], title: r => r.title,
    sub: r => `${r.kind === 'event' ? 'Événement' : r.kind === 'blog' ? 'Blog' : 'Actualité'} · ${new Date(r.published_at).toLocaleDateString('fr-FR')}`,
    img: r => r.image, visibleKey: 'published',
    fields: [
      F.text('title', 'Titre', { req: true, full: true }),
      F.sel('kind', 'Type', [['actu', 'Actualité'], ['event', 'Événement'], ['blog', 'Blog']]),
      F.dt('published_at', 'Date de publication'),
      F.area('excerpt', 'Résumé (cartes)', { full: true }),
      F.rich('body', 'Texte complet', { full: true }),
      F.img('image', 'Image', { full: true }),
      F.date('event_date', 'Date de l\'événement', { hint: 'Pour un événement : il remonte en tête tant qu\'il est à venir.' }),
      F.text('location', 'Lieu'),
      F.url('link_url', 'Lien du bouton', { full: true }),
      F.text('slug', 'Adresse courte (slug)', { hint: 'Généré automatiquement depuis le titre si vide.' }),
      F.bool('published', 'Publié'),
    ],
    defaults: { kind: 'actu', published: true },
  },
  centers: {
    label: 'Centres', order: ['sort', true], title: r => r.name, sub: r => `${r.address || ''} — ${r.city || ''}`, img: r => r.image,
    fields: [
      F.text('name', 'Nom', { req: true }), F.text('short_name', 'Nom court'),
      F.text('slug', 'Identifiant (ancre)', { req: true, hint: 'ex. saint-pryve — utilisé dans les liens centres.html#…' }), F.text('phone', 'Téléphone'),
      F.text('address', 'Adresse'), F.text('postcode', 'Code postal'), F.text('city', 'Ville'), F.text('email', 'E-mail'),
      F.list('hours', 'Horaires', [F.text('days', 'Jours'), F.text('hours', 'Heures')], { full: true }),
      F.text('transport', 'Transports', { full: true }),
      F.area('description', 'Présentation', { full: true }),
      F.strs('features', 'Équipements', { full: true }),
      F.img('image', 'Photo principale', { full: true }),
      F.imgs('gallery', 'Autres photos', { full: true }),
      F.url('map_url', 'Lien Google Maps (itinéraire)', { full: true }),
      F.url('booking_url', 'Lien de réservation', { full: true }),
      F.num('sort', 'Ordre'), F.bool('visible', 'Visible'),
    ],
    defaults: { visible: true, hours: [], features: [], gallery: [] },
  },
  coaches: {
    label: 'Coachs', order: ['sort', true], title: r => r.name, sub: r => r.role, img: r => r.photo,
    fields: [
      F.text('name', 'Nom', { req: true }), F.text('role', 'Rôle'),
      F.text('highlight', 'Point fort (pastille)', { full: true }),
      F.rich('bio', 'Présentation', { full: true }),
      F.img('photo', 'Photo (portrait)', { full: true }),
      F.num('sort', 'Ordre'), F.bool('visible', 'Visible'),
    ],
    defaults: { visible: true },
  },
  faq: {
    label: 'Questions fréquentes', order: ['sort', true], title: r => r.question, sub: r => DOMPurify.sanitize(r.answer || '', { ALLOWED_TAGS: [] }).slice(0, 120),
    fields: [F.text('question', 'Question', { req: true, full: true }), F.rich('answer', 'Réponse', { req: true, full: true }), F.num('sort', 'Ordre'), F.bool('visible', 'Visible')],
    defaults: { visible: true, category: 'general' },
  },
  gallery: {
    label: 'Galerie', order: ['sort', true], title: r => r.caption || '(sans légende)', sub: r => 'Album : ' + (r.album === 'entreprise' ? 'Entreprise' : 'Le club'), img: r => r.image,
    groupBy: 'album', groups: { general: 'Le club', entreprise: 'Entreprise' },
    fields: [F.img('image', 'Image', { req: true, full: true }), F.text('caption', 'Légende'), F.sel('album', 'Album', [['general', 'Le club'], ['entreprise', 'Entreprise']]), F.num('sort', 'Ordre'), F.bool('visible', 'Visible')],
    defaults: { visible: true, album: 'general' },
  },
  offers: {
    label: 'Cartes & offres', order: ['sort', true], title: r => r.title, sub: r => [r.subtitle, r.price].filter(Boolean).join(' · '), img: r => r.image,
    groupBy: 'category', groups: Object.fromEntries(Object.entries(CATEGORIES).map(([k, v]) => [k, v[0]])),
    fields: [
      F.sel('category', 'Emplacement', Object.entries(CATEGORIES).map(([k, v]) => [k, v[0]]), { full: true }),
      F.text('title', 'Titre', { req: true }), F.text('subtitle', 'Sous-titre'),
      F.rich('body', 'Texte', { full: true }),
      F.text('price', 'Prix'), F.text('badge', 'Badge / mention'),
      F.img('image', 'Image / icône', { full: true }),
      F.text('cta_label', 'Texte du bouton'), F.url('cta_url', 'Lien du bouton'),
      F.num('sort', 'Ordre'), F.bool('visible', 'Visible'),
    ],
    defaults: { visible: true },
  },
  blocks: {
    label: 'Textes des pages', order: ['sort', true], title: r => (SECTIONS[r.page]?.[r.section] || r.section) + ' — ' + (r.title || ''), sub: r => r.kicker || '', img: r => r.image,
    groupBy: 'page', groups: PAGES,
    fields: [
      F.sel('page', 'Page', Object.entries(PAGES)), F.text('section', 'Section', { req: true, hint: 'Identifiant technique : ne pas modifier pour un bloc existant.' }),
      F.text('kicker', 'Surtitre'), F.text('title', 'Titre', { full: true }),
      F.rich('body', 'Texte', { full: true }),
      F.img('image', 'Image', { full: true }),
      F.text('cta_label', 'Texte du bouton'), F.url('cta_url', 'Lien du bouton'),
      F.num('sort', 'Ordre'), F.bool('visible', 'Visible'),
    ],
    defaults: { visible: true, data: {} },
  },
};

const SETTINGS = {
  general: { label: 'Informations générales', desc: 'Nom, logos, liens de réservation, réseaux sociaux, documents.', fields: [
    F.text('name', 'Nom du club'), F.text('pedago_email', 'E-mail du responsable pédagogique'),
    F.area('description', 'Description courte (pied de page, référencement)', { full: true }),
    F.img('logo', 'Logo couleur'), F.img('logo_white', 'Logo blanc'),
    F.text('booking_url', 'Lien « Je réserve »'), F.text('tournaments_url', 'Lien « Tournois »'),
    F.text('shop_url', 'Lien Let Padel Shop'), F.text('licence_url', 'Lien licence (HelloAsso)'),
    F.text('instagram', 'Instagram'), F.text('facebook', 'Facebook'),
    F.file('cgv_url', 'Conditions générales de vente (PDF)'), F.file('brochure_url', 'Brochure Académie (PDF)'),
  ] },
  announce: { label: 'Bandeau d\'annonce', desc: 'Message affiché tout en haut de chaque page.', fields: [
    F.bool('active', 'Afficher le bandeau'), F.text('text', 'Message', { full: true }), F.url('url', 'Lien (facultatif)', { full: true }),
  ] },
  home_hero: { label: 'Accueil — grand titre', desc: 'Le premier écran de la page d\'accueil.', fields: [
    F.text('kicker', 'Surtitre', { full: true }),
    F.area('title', 'Titre', { full: true, hint: 'Une ligne par ligne de titre. La première ligne s\'affiche en contour.' }),
    F.area('subtitle', 'Texte', { full: true }),
    F.text('cta_label', 'Bouton principal (réservation)'), F.text('cta2_label', 'Bouton secondaire'), F.url('cta2_url', 'Lien du bouton secondaire', { full: true }),
  ] },
  hours: { label: 'Horaires d\'ouverture', desc: 'Affichés sur l\'accueil.', fields: [
    F.list('items', 'Plages horaires', [F.text('days', 'Jours'), F.text('hours', 'Heures')], { full: true }), F.text('note', 'Remarque', { full: true }),
  ] },
  stats: { label: 'Chiffres clés', desc: 'Le tableau d\'affichage de l\'accueil et de la page Le club.', fields: [
    F.list('items', 'Chiffres', [F.text('value', 'Valeur'), F.text('label', 'Libellé')], { full: true }),
  ] },
  marquee: { label: 'Bande défilante', desc: 'Les mots qui défilent sur l\'accueil et la page Le club.', fields: [F.strs('items', 'Mots', { full: true })] },
  tarifs: { label: 'Tarifs', desc: 'Grille de la page Nos centres.', fields: [
    F.text('padel_title', 'Titre du tableau padel'), F.strs('padel_columns', 'Colonnes (ex. heures creuses / pleines)'),
    F.list('padel_rows', 'Lignes padel', [F.text('label', 'Durée'), F.text('unit', 'Unité'), F.strs('values', 'Prix (un par colonne)')], { full: true }),
    F.list('periods', 'Définition des périodes', [F.text('name', 'Nom'), F.strs('lines', 'Lignes')], { full: true }),
    F.text('other_title', 'Titre pickleball / badminton', { full: true }),
    F.list('other_rows', 'Tarifs pickleball / badminton', [F.text('label', 'Durée'), F.text('value', 'Prix'), F.text('note', 'Précision')], { full: true }),
    F.list('extras', 'Extras (location, balles…)', [F.text('label', 'Libellé'), F.text('value', 'Prix')], { full: true }),
  ] },
  legal: { label: 'Mentions légales', desc: '', fields: [F.rich('html', 'Contenu', { full: true })] },
};

// ============================================================
// Champs de formulaire
// ============================================================
function fieldHTML(f, v, path) {
  const id = 'fld-' + path.replace(/[^\w-]/g, '_');
  const lab = `<span>${esc(f.label)}${f.req ? ' *' : ''}</span>`;
  const hint = f.hint ? `<small>${esc(f.hint)}</small>` : '';
  const wrap = (inner, cls = '') => `<div class="f ${f.full ? 'full' : ''} ${cls}" data-path="${esc(path)}" data-type="${f.t}">${inner}</div>`;
  switch (f.t) {
    case 'text': return wrap(`<label for="${id}">${lab}</label><input id="${id}" type="text" value="${esc(v ?? '')}"${f.req ? ' required' : ''}>${hint}`);
    case 'number': return wrap(`<label for="${id}">${lab}</label><input id="${id}" type="number" value="${esc(v ?? 0)}">${hint}`);
    case 'date': return wrap(`<label for="${id}">${lab}</label><input id="${id}" type="date" value="${esc(v ?? '')}">${hint}`);
    case 'datetime': { const d = v ? new Date(v) : new Date(); const loc = new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); return wrap(`<label for="${id}">${lab}</label><input id="${id}" type="datetime-local" value="${loc}">${hint}`); }
    case 'textarea': return wrap(`<label for="${id}">${lab}</label><textarea id="${id}">${esc(v ?? '')}</textarea>${hint}`);
    case 'bool': return wrap(`<label class="check"><input id="${id}" type="checkbox"${v ? ' checked' : ''}> ${esc(f.label)}</label>${hint}`);
    case 'select': return wrap(`<label for="${id}">${lab}</label><select id="${id}">${f.opts.map(([k, l]) => `<option value="${esc(k)}"${k === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>${hint}`);
    case 'rich': return wrap(`<span class="f-label">${esc(f.label)}${f.req ? ' *' : ''}</span>
      <div class="rte"><div class="rte-bar">
        <button type="button" data-cmd="bold" title="Gras"><b>G</b></button>
        <button type="button" data-cmd="italic" title="Italique"><i>I</i></button>
        <button type="button" data-cmd="insertUnorderedList" title="Liste à puces">• Liste</button>
        <button type="button" data-cmd="link" title="Lien">Lien</button>
        <button type="button" data-cmd="unlink" title="Retirer le lien">Délier</button>
        <button type="button" data-cmd="h2" title="Intertitre">Titre</button>
        <button type="button" data-cmd="p" title="Paragraphe">¶</button>
        <button type="button" data-cmd="removeFormat" title="Effacer la mise en forme">⌫</button>
        <button type="button" data-cmd="src" title="Code HTML">&lt;/&gt;</button>
      </div><div class="rte-area" contenteditable="true">${DOMPurify.sanitize(v || '')}</div><textarea class="rte-src"></textarea></div>${hint}`);
    case 'image': return wrap(`<label for="${id}">${lab}</label>
      <div class="img-field"><div class="img-prev" style="${v && !f.file ? `background-image:url('${esc(v)}')` : ''}">${f.file && v ? '<span style="display:grid;place-items:center;height:100%;font-weight:700">PDF</span>' : ''}</div>
        <div><input id="${id}" type="text" value="${esc(v ?? '')}" placeholder="https://…">
          <div class="row"><button type="button" class="b b-sm b-blue" data-act="upload">Téléverser</button><button type="button" class="b b-sm" data-act="pick">Médiathèque</button>${v ? `<a class="b b-sm b-ghost" href="${esc(v)}" target="_blank" rel="noopener">Ouvrir</a>` : ''}</div>
          <input type="file" hidden accept="${f.file ? 'application/pdf,image/*' : 'image/*'}">${hint}</div></div>`);
    case 'strlist': return wrap(`<span class="f-label">${esc(f.label)}</span><div class="strlist">${(v || []).map(s => strRow(s)).join('')}</div><div><button type="button" class="b b-sm" data-act="add-str">+ Ajouter</button></div>${hint}`);
    case 'imglist': return wrap(`<span class="f-label">${esc(f.label)}</span><div class="strlist">${(v || []).map(s => strRow(s, true)).join('')}</div><div class="row"><button type="button" class="b b-sm" data-act="add-img">+ Depuis la médiathèque</button></div>${hint}`);
    case 'list': return wrap(`<span class="f-label">${esc(f.label)}</span><div class="rep">${(v || []).map((it, i) => repItem(f, it, path + '.' + i)).join('')}<div><button type="button" class="b b-sm" data-act="add-item">+ Ajouter</button></div></div>${hint}`);
  }
  return '';
}
const strRow = (s, img) => `<div class="row">${img ? `<span class="thumb" style="width:40px;height:40px"><img src="${esc(s)}" alt=""></span>` : ''}<input type="text" value="${esc(s)}"><button type="button" class="b b-icon b-sm" data-act="up" title="Monter">↑</button><button type="button" class="b b-icon b-sm b-danger" data-act="del-str" title="Retirer">×</button></div>`;
function repItem(f, it, path) {
  return `<div class="rep-item" data-item><div class="grid2">${f.fields.map(sf => fieldHTML(sf, it?.[sf.k], path + '.' + sf.k)).join('')}</div>
    <div class="rep-acts"><button type="button" class="b b-icon b-sm" data-act="item-up" title="Monter">↑</button><button type="button" class="b b-icon b-sm b-danger" data-act="del-item" title="Supprimer">×</button></div></div>`;
}

function readField(el, f) {
  switch (f.t) {
    case 'bool': return $('input', el).checked;
    case 'number': return Number($('input', el).value || 0);
    case 'date': return $('input', el).value || null;
    case 'datetime': return $('input', el).value ? new Date($('input', el).value).toISOString() : new Date().toISOString();
    case 'textarea': return $('textarea', el).value;
    case 'select': return $('select', el).value;
    case 'rich': { const r = $('.rte', el); if (r.classList.contains('src')) $('.rte-area', r).innerHTML = $('.rte-src', r).value; const h = DOMPurify.sanitize($('.rte-area', r).innerHTML.trim(), { ADD_ATTR: ['target'] }); return h === '<br>' ? '' : h; }
    case 'strlist': case 'imglist': return $$(':scope > .strlist > .row input', el).map(i => i.value.trim()).filter(Boolean);
    case 'list': return $$(':scope > .rep > [data-item]', el).map(item => Object.fromEntries(f.fields.map(sf => [sf.k, readField(item.querySelector(`:scope > .grid2 > [data-type]:nth-child(${f.fields.indexOf(sf) + 1})`), sf)])));
    default: return $('input', el).value.trim();
  }
}
function readForm(root, fields) {
  const top = $$(':scope > [data-type]', root);
  return Object.fromEntries(fields.map((f, i) => [f.k, readField(top[i], f)]));
}

function bindForm(root, fields) {
  root.addEventListener('click', async (e) => {
    const b = e.target.closest('button[data-act], .rte-bar button'); if (!b) return;
    const fe = b.closest('[data-type]');
    if (b.dataset.cmd) return rteCmd(b, b.dataset.cmd);
    const act = b.dataset.act;
    if (act === 'add-str') $(':scope > .strlist', fe).insertAdjacentHTML('beforeend', strRow(''));
    if (act === 'add-img') { const url = await pickMedia(); if (url) $(':scope > .strlist', fe).insertAdjacentHTML('beforeend', strRow(url, true)); }
    if (act === 'del-str') b.closest('.row').remove();
    if (act === 'up') { const r = b.closest('.row'); r.previousElementSibling && r.parentElement.insertBefore(r, r.previousElementSibling); }
    if (act === 'add-item') {
      const f = findFieldByPath(fields, fe.dataset.path);
      b.parentElement.insertAdjacentHTML('beforebegin', repItem(f, {}, fe.dataset.path + '.' + Date.now()));
    }
    if (act === 'del-item') b.closest('[data-item]').remove();
    if (act === 'item-up') { const r = b.closest('[data-item]'); r.previousElementSibling?.matches('[data-item]') && r.parentElement.insertBefore(r, r.previousElementSibling); }
    if (act === 'pick') { const url = await pickMedia(fe.querySelector('input[type=file]').accept.includes('pdf')); if (url) setImg(fe, url); }
    if (act === 'upload') fe.querySelector('input[type=file]').click();
  });
  root.addEventListener('change', async (e) => {
    if (e.target.type !== 'file' || !e.target.files[0]) return;
    const fe = e.target.closest('[data-type]');
    const btn = $('[data-act=upload]', fe); btn.disabled = true; btn.textContent = 'Envoi…';
    try { setImg(fe, await uploadFile(e.target.files[0])); toast('Fichier téléversé'); }
    catch (err) { toast('Téléversement impossible : ' + err.message, true); }
    finally { btn.disabled = false; btn.textContent = 'Téléverser'; e.target.value = ''; }
  });
  root.addEventListener('input', e => { if (e.target.matches('.img-field input[type=text]')) setImg(e.target.closest('[data-type]'), e.target.value, true); });
}
function findFieldByPath(fields, path) {
  const parts = path.split('.').filter(p => !/^\d+$/.test(p));
  let list = fields, f;
  for (const p of parts) { f = list.find(x => x.k === p); list = f?.fields || []; }
  return f;
}
function setImg(fe, url, typing) {
  if (!typing) $('input[type=text]', fe).value = url;
  const pv = $('.img-prev', fe);
  if (/\.pdf($|\?)/i.test(url)) { pv.style.backgroundImage = ''; pv.innerHTML = '<span style="display:grid;place-items:center;height:100%;font-weight:700">PDF</span>'; }
  else { pv.innerHTML = ''; pv.style.backgroundImage = url ? `url('${url.replace(/'/g, '%27')}')` : ''; }
}
function rteCmd(b, cmd) {
  const r = b.closest('.rte'), area = $('.rte-area', r), src = $('.rte-src', r);
  if (cmd === 'src') {
    if (r.classList.toggle('src')) src.value = area.innerHTML; else area.innerHTML = DOMPurify.sanitize(src.value);
    return;
  }
  area.focus();
  if (cmd === 'link') { const u = prompt('Adresse du lien (https://… ou page du site) :'); if (u) document.execCommand('createLink', false, u); return; }
  if (cmd === 'h2') return document.execCommand('formatBlock', false, 'h2');
  if (cmd === 'p') return document.execCommand('formatBlock', false, 'p');
  document.execCommand(cmd, false, null);
}

// ============================================================
// Médias
// ============================================================
async function compress(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 400 * 1024) return file;
  const bmp = await createImageBitmap(file);
  const max = 2200, k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, file.type === 'image/png' ? 'image/webp' : 'image/jpeg', .85));
  if (!blob || blob.size >= file.size) return file;
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  return new File([blob], file.name.replace(/\.\w+$/, '.' + ext), { type: blob.type });
}
async function uploadFile(file, folder) {
  const f = await compress(file);
  const d = new Date();
  const clean = f.name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
  const path = `${folder || `uploads/${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`}/${Date.now().toString(36)}-${clean}`;
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, f, { contentType: f.type, upsert: false, cacheControl: '31536000' });
  if (error) throw error;
  return PUBLIC + path;
}
async function listFolder(prefix) {
  const { data, error } = await sb.storage.from(MEDIA_BUCKET).list(prefix, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error) throw error;
  return data.filter(x => x.name !== '.emptyFolderPlaceholder');
}
function mediaBrowserHTML(prefix, items, picking) {
  const parts = prefix ? prefix.split('/') : [];
  const crumbs = [`<button class="b b-sm" data-go="">Médiathèque</button>`].concat(parts.map((p, i) => `<span>/</span><button class="b b-sm" data-go="${esc(parts.slice(0, i + 1).join('/'))}">${esc(p)}</button>`)).join('');
  const folders = items.filter(x => !x.id), files = items.filter(x => x.id);
  return `<div class="crumb">${crumbs}</div>
    <div class="drop" data-drop>Glissez des images ici ou <button type="button" class="b b-sm b-blue" data-act="browse">choisissez des fichiers</button><input type="file" hidden multiple accept="image/*,application/pdf"></div>
    <div class="media-grid" style="margin-top:14px">
      ${folders.map(f => `<button type="button" class="media folder" data-go="${esc((prefix ? prefix + '/' : '') + f.name)}"><span class="pv">📁</span><span class="nm">${esc(f.name)}</span></button>`).join('')}
      ${files.map(f => { const url = PUBLIC + (prefix ? prefix + '/' : '') + f.name; const pdf = /\.pdf$/i.test(f.name); return `<button type="button" class="media" data-url="${esc(url)}" title="${esc(f.name)}"><span class="pv" style="${pdf ? '' : `background-image:url('${esc(url)}')`}">${pdf ? 'PDF' : ''}</span><span class="nm">${esc(f.name)}</span></button>`; }).join('')}
      ${!folders.length && !files.length ? '<p class="empty" style="grid-column:1/-1">Dossier vide.</p>' : ''}
    </div>
    ${picking ? '' : '<p class="hint" style="margin-top:12px">Cliquez sur un fichier pour copier son adresse ou le supprimer.</p>'}`;
}
async function mediaBrowser(container, { picking = false, onPick } = {}) {
  let prefix = '';
  const draw = async () => {
    container.innerHTML = '<p class="hint">Chargement…</p>';
    try { container.innerHTML = mediaBrowserHTML(prefix, await listFolder(prefix), picking); }
    catch (e) { container.innerHTML = `<p class="empty">Impossible de lister les fichiers : ${esc(e.message)}</p>`; }
  };
  const upload = async (files) => {
    const target = prefix.startsWith('uploads') ? prefix : undefined;
    for (const f of files) { try { await uploadFile(f, target); } catch (e) { toast(`${f.name} : ${e.message}`, true); } }
    toast(`${files.length} fichier(s) téléversé(s)`);
    if (!prefix.startsWith('uploads')) { const d = new Date(); prefix = `uploads/${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; }
    draw();
  };
  container.onclick = async (e) => {
    const go = e.target.closest('[data-go]'); if (go) { prefix = go.dataset.go; return draw(); }
    if (e.target.closest('[data-act=browse]')) return $('input[type=file]', container).click();
    const m = e.target.closest('[data-url]'); if (!m) return;
    if (picking) return onPick(m.dataset.url);
    const url = m.dataset.url;
    const choice = await confirmBox(`<p style="word-break:break-all"><a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a></p>${/\.pdf$/i.test(url) ? '' : `<img src="${esc(url)}" alt="" style="max-height:300px;margin:12px auto;border-radius:8px">`}`, [['copy', 'Copier l\'adresse', 'b-blue'], ['del', 'Supprimer', 'b-danger']]);
    if (choice === 'copy') { await navigator.clipboard.writeText(url).catch(() => {}); toast('Adresse copiée'); }
    if (choice === 'del' && await confirmBox('Supprimer définitivement ce fichier ? Les pages qui l\'utilisent n\'afficheront plus l\'image.', [['ok', 'Supprimer', 'b-danger']]) === 'ok') {
      const path = url.replace(PUBLIC, '');
      const { error } = await sb.storage.from(MEDIA_BUCKET).remove([path]);
      error ? toast(error.message, true) : (toast('Fichier supprimé'), draw());
    }
  };
  container.onchange = (e) => { if (e.target.type === 'file' && e.target.files.length) upload([...e.target.files]); };
  container.ondragover = (e) => { const d = e.target.closest('[data-drop]'); if (d) { e.preventDefault(); d.classList.add('over'); } };
  container.ondragleave = (e) => e.target.closest('[data-drop]')?.classList.remove('over');
  container.ondrop = (e) => { const d = e.target.closest('[data-drop]'); if (!d) return; e.preventDefault(); d.classList.remove('over'); upload([...e.dataTransfer.files]); };
  draw();
}
function pickMedia() {
  return new Promise(resolve => {
    const d = document.createElement('dialog'); d.className = 'modal';
    d.innerHTML = `<div class="modal-head"><h2>Choisir un fichier</h2><button class="b b-sm" data-close type="button">Fermer</button></div><div class="modal-body"></div>`;
    document.body.appendChild(d);
    let picked = null;
    const done = () => { d.close(); d.remove(); resolve(picked); };
    $('[data-close]', d).onclick = done;
    d.addEventListener('cancel', (e) => { e.preventDefault(); done(); });
    mediaBrowser($('.modal-body', d), { picking: true, onPick: (url) => { picked = url; done(); } });
    d.showModal();
  });
}

function confirmBox(html, buttons) {
  return new Promise(resolve => {
    const d = document.createElement('dialog'); d.className = 'modal'; d.style.width = 'min(560px, calc(100% - 24px))';
    d.innerHTML = `<div class="modal-body">${html}</div><div class="modal-foot"><button class="b" data-r="" type="button">Annuler</button>${buttons.map(([k, l, c]) => `<button class="b ${c || ''}" data-r="${k}" type="button">${l}</button>`).join('')}</div>`;
    document.body.appendChild(d);
    d.onclick = (e) => { const b = e.target.closest('[data-r]'); if (b) { d.close(); d.remove(); resolve(b.dataset.r); } };
    d.addEventListener('cancel', () => { d.remove(); resolve(''); });
    d.showModal();
  });
}

// ============================================================
// Vues
// ============================================================
const NAV = [
  ['Général', [['dashboard', 'Tableau de bord'], ['messages', 'Messages'], ['settings', 'Réglages du site']]],
  ['Contenus', [['blocks', 'Textes des pages'], ['offers', 'Cartes & offres'], ['posts', 'Actualités'], ['centers', 'Centres'], ['coaches', 'Coachs'], ['faq', 'Questions fréquentes'], ['gallery', 'Galerie']]],
  ['Fichiers', [['media', 'Médiathèque']]],
];
let unread = 0;
function drawNav(active) {
  $('#sideNav').innerHTML = NAV.map(([g, items]) => `<div class="grp">${g}</div>` + items.map(([k, l]) => `<a href="#${k}" class="${k === active ? 'active' : ''}">${l}${k === 'messages' && unread ? `<span class="badge">${unread}</span>` : ''}</a>`).join('')).join('');
}
async function refreshUnread() {
  const { count } = await T('messages').select('id', { count: 'exact', head: true }).eq('handled', false);
  unread = count || 0;
}

async function route() {
  const [view, arg] = (location.hash.slice(1).split('?')[0] || 'dashboard').split('/');
  drawNav(view);
  $('#side').classList.remove('open');
  const v = $('#view');
  v.innerHTML = '<p class="hint">Chargement…</p>';
  try {
    if (view === 'dashboard') await viewDashboard(v);
    else if (view === 'messages') await viewMessages(v);
    else if (view === 'settings') await viewSettings(v, arg);
    else if (view === 'media') { setTitle('Médiathèque'); v.innerHTML = '<div class="panel"><div id="mb"></div></div>'; mediaBrowser($('#mb')); }
    else if (TABLES[view]) await viewTable(v, view, arg);
    else location.hash = 'dashboard';
  } catch (e) {
    console.error(e);
    v.innerHTML = `<div class="empty">Erreur : ${esc(e.message)}</div>`;
  }
}
const setTitle = (t) => { $('#viewTitle').textContent = t; document.title = t + ' — Admin Let Padel'; };

async function viewDashboard(v) {
  setTitle('Tableau de bord');
  const counts = await Promise.all(['posts', 'offers', 'blocks', 'coaches', 'faq', 'gallery', 'centers'].map(async t => [t, (await T(t).select('id', { count: 'exact', head: true })).count]));
  const { data: msgs } = await T('messages').select('*').order('created_at', { ascending: false }).limit(5);
  v.innerHTML = `
    <div class="stats">
      <a class="stat" href="#messages"><b>${unread}</b>message(s) non traité(s)</a>
      ${counts.map(([t, c]) => `<a class="stat" href="#${t}"><b>${c ?? 0}</b>${TABLES[t].label}</a>`).join('')}
    </div>
    <div class="panel">
      <h2>Raccourcis</h2>
      <p class="desc">Les modifications sont visibles sur le site en quelques secondes (rechargez la page du site).</p>
      <div class="row">
        <a class="b b-primary" href="#posts/new">+ Nouvelle actualité</a>
        <a class="b" href="#settings/announce">Bandeau d'annonce</a>
        <a class="b" href="#settings/tarifs">Tarifs</a>
        <a class="b" href="#settings/hours">Horaires</a>
        <a class="b" href="#offers">Stages & offres</a>
        <a class="b" href="#media">Médiathèque</a>
      </div>
    </div>
    <div class="panel">
      <div class="row"><h2>Derniers messages</h2><span class="spacer"></span><a href="#messages">Tout voir</a></div>
      <div class="list" style="margin-top:12px">${(msgs || []).length ? msgs.map(m => `<div class="item" style="grid-template-columns:1fr auto"><div><div class="t">${esc(m.name)} ${m.handled ? '' : '<span class="pill new">Nouveau</span>'}</div><div class="s">${esc(m.subject || '')} — ${esc(m.message.slice(0, 90))}</div></div><span class="s">${new Date(m.created_at).toLocaleDateString('fr-FR')}</span></div>`).join('') : '<p class="empty">Aucun message pour l\'instant.</p>'}</div>
    </div>`;
}

async function viewMessages(v) {
  setTitle('Messages');
  const { data, error } = await T('messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  v.innerHTML = `<div class="panel"><p class="desc">Messages envoyés depuis le formulaire de contact du site.</p><div class="list">${data.length ? data.map(m => `
    <article class="msg-item ${m.handled ? '' : 'unread'}" data-id="${m.id}">
      <header><b>${esc(m.name)}</b><a href="mailto:${esc(m.email)}">${esc(m.email)}</a>${m.phone ? `<a href="tel:${esc(m.phone)}">${esc(m.phone)}</a>` : ''}<span class="spacer"></span><span class="hint">${new Date(m.created_at).toLocaleString('fr-FR')}</span></header>
      <div class="hint">${esc(m.subject || '')}${m.center ? ' — ' + esc(m.center) : ''}</div>
      <div class="body">${esc(m.message)}</div>
      <div class="row"><a class="b b-sm b-blue" href="mailto:${esc(m.email)}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Votre message au Let Padel'))}">Répondre par e-mail</a>
        <button class="b b-sm" data-act="toggle">${m.handled ? 'Marquer non traité' : 'Marquer traité'}</button>
        <button class="b b-sm b-danger" data-act="del">Supprimer</button></div>
    </article>`).join('') : '<p class="empty">Aucun message pour l\'instant.</p>'}</div></div>`;
  v.onclick = async (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const id = b.closest('[data-id]').dataset.id; const m = data.find(x => x.id === id);
    if (b.dataset.act === 'toggle') { const { error } = await T('messages').update({ handled: !m.handled }).eq('id', id); if (error) return toast(error.message, true); }
    if (b.dataset.act === 'del') { if (await confirmBox('Supprimer ce message ?', [['ok', 'Supprimer', 'b-danger']]) !== 'ok') return; const { error } = await T('messages').delete().eq('id', id); if (error) return toast(error.message, true); }
    await refreshUnread(); route();
  };
}

async function viewSettings(v, key) {
  setTitle('Réglages du site');
  const { data, error } = await T('settings').select('*');
  if (error) throw error;
  const map = Object.fromEntries(data.map(r => [r.key, r.value]));
  const k = SETTINGS[key] ? key : null;
  if (!k) {
    v.innerHTML = `<div class="list">${Object.entries(SETTINGS).map(([sk, s]) => `<a class="item" href="#settings/${sk}" style="grid-template-columns:1fr auto;text-decoration:none;color:inherit"><div><div class="t">${esc(s.label)}</div><div class="s">${esc(s.desc)}</div></div><span class="b b-sm">Modifier</span></a>`).join('')}</div>`;
    return;
  }
  const s = SETTINGS[k];
  const val = map[k] || {};
  v.innerHTML = `<p><a href="#settings">← Tous les réglages</a></p><div class="panel"><h2>${esc(s.label)}</h2><p class="desc">${esc(s.desc)}</p>
    <div class="form grid2" id="sform">${s.fields.map(f => fieldHTML(f, val[f.k], f.k)).join('')}</div>
    <div class="row end" style="margin-top:20px"><button class="b b-primary" id="saveSet" type="button">Enregistrer</button></div></div>`;
  bindForm($('#sform'), s.fields);
  $('#saveSet').onclick = async () => {
    const out = { ...val, ...readForm($('#sform'), s.fields) };
    const { error } = await T('settings').upsert({ key: k, value: out });
    if (error) return toast(error.message, true);
    clearPublicCache(); toast('Enregistré — visible sur le site');
  };
}

async function viewTable(v, name, arg) {
  const cfg = TABLES[name];
  setTitle(cfg.label);
  if (arg) return editRow(v, name, arg === 'new' ? null : arg);
  const [col, asc] = cfg.order;
  let q = T(name).select('*').order(col, { ascending: asc });
  if (name === 'blocks') q = q.order('page');
  const { data, error } = await q;
  if (error) throw error;
  const vis = cfg.visibleKey || 'visible';
  const groups = cfg.groupBy ? Object.keys(cfg.groups).filter(gk => data.some(r => r[cfg.groupBy] === gk)).concat([...new Set(data.map(r => r[cfg.groupBy]))].filter(gk => !cfg.groups[gk])) : [null];
  let current = sessionStorage.getItem('adm-tab-' + name);
  if (!groups.includes(current)) current = groups[0];
  const draw = () => {
    const rows = cfg.groupBy ? data.filter(r => r[cfg.groupBy] === current) : data;
    $('#rows').innerHTML = rows.length ? rows.map(r => `
      <div class="item ${r[vis] === false ? 'hidden-item' : ''}" data-id="${r.id}">
        <div class="thumb">${cfg.img?.(r) ? `<img src="${esc(cfg.img(r))}" alt="" loading="lazy">` : '—'}</div>
        <div style="min-width:0"><div class="t">${esc(cfg.title(r) || '(sans titre)')}${r[vis] === false ? `<span class="pill off">${vis === 'published' ? 'Brouillon' : 'Masqué'}</span>` : ''}</div><div class="s">${esc(cfg.sub?.(r) || '')}</div></div>
        <div class="acts">
          ${'sort' in r ? '<button class="b b-icon b-sm" data-act="up" title="Monter">↑</button><button class="b b-icon b-sm" data-act="down" title="Descendre">↓</button>' : ''}
          <button class="b b-sm" data-act="vis">${r[vis] === false ? 'Afficher' : 'Masquer'}</button>
          <a class="b b-sm b-blue" href="#${name}/${r.id}">Modifier</a>
        </div>
      </div>`).join('') : '<p class="empty">Rien ici pour l\'instant. Ajoutez un premier élément.</p>';
    if (cfg.groupBy) $('#ghint').textContent = name === 'offers' ? (CATEGORIES[current]?.[1] || '') : '';
  };
  v.innerHTML = `
    <div class="row" style="margin-bottom:14px"><span class="spacer"></span><a class="b b-primary" id="addBtn" href="#${name}/new">+ Ajouter</a></div>
    ${cfg.groupBy ? `<div class="tabs" role="tablist">${groups.map(gk => `<button role="tab" type="button" data-g="${esc(gk)}" aria-selected="${gk === current}">${esc(cfg.groups[gk] || gk)}</button>`).join('')}</div><p class="hint" id="ghint"></p>` : ''}
    <div class="list" id="rows"></div>`;
  draw();
  const updAdd = () => { $('#addBtn').href = `#${name}/new` + (cfg.groupBy ? `?${cfg.groupBy}=${encodeURIComponent(current)}` : ''); };
  updAdd();
  v.onclick = async (e) => {
    const tab = e.target.closest('[data-g]');
    if (tab) { current = tab.dataset.g; sessionStorage.setItem('adm-tab-' + name, current); $$('.tabs button', v).forEach(b => b.setAttribute('aria-selected', String(b === tab))); updAdd(); return draw(); }
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const id = b.closest('[data-id]').dataset.id;
    const r = data.find(x => x.id === id);
    if (b.dataset.act === 'vis') {
      const { error } = await T(name).update({ [vis]: r[vis] === false }).eq('id', id);
      if (error) return toast(error.message, true);
      r[vis] = r[vis] === false; clearPublicCache(); draw(); toast('Mis à jour');
    }
    if (b.dataset.act === 'up' || b.dataset.act === 'down') {
      const rows = cfg.groupBy ? data.filter(x => x[cfg.groupBy] === current) : data;
      const i = rows.indexOf(r), j = b.dataset.act === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= rows.length) return;
      [rows[i], rows[j]] = [rows[j], rows[i]];
      const updates = rows.map((x, k) => ({ id: x.id, sort: k + 1 }));
      for (const u of updates) { const row = data.find(x => x.id === u.id); if (row.sort !== u.sort) { row.sort = u.sort; await T(name).update({ sort: u.sort }).eq('id', u.id); } }
      data.sort((a, b) => a.sort - b.sort); clearPublicCache(); draw();
    }
  };
}

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

async function editRow(v, name, id) {
  const cfg = TABLES[name];
  let row = { ...cfg.defaults };
  const qs = new URLSearchParams(location.hash.split('?')[1] || '');
  qs.forEach((val, k) => row[k] = val);
  if (id) { const { data, error } = await T(name).select('*').eq('id', id).single(); if (error) throw error; row = data; }
  else if (cfg.fields.some(f => f.k === 'sort')) {
    let q = T(name).select('sort').order('sort', { ascending: false }).limit(1);
    if (cfg.groupBy && row[cfg.groupBy]) q = q.eq(cfg.groupBy, row[cfg.groupBy]);
    const { data } = await q; row.sort = (data?.[0]?.sort || 0) + 1;
  }
  const back = `#${name}`;
  v.innerHTML = `<p><a href="${back}">← ${esc(cfg.label)}</a></p>
    <div class="panel"><h2>${id ? 'Modifier' : 'Ajouter'} — ${esc(cfg.label)}</h2><p class="desc">Les champs marqués * sont obligatoires.</p>
      <div class="form grid2" id="eform">${cfg.fields.map(f => fieldHTML(f, row[f.k], f.k)).join('')}</div>
      <div class="row" style="margin-top:22px">${id ? '<button class="b b-danger" id="delBtn" type="button">Supprimer</button>' : ''}<span class="spacer"></span><a class="b" href="${back}">Annuler</a><button class="b b-primary" id="saveBtn" type="button">Enregistrer</button></div>
    </div>`;
  bindForm($('#eform'), cfg.fields);
  $('#saveBtn').onclick = async () => {
    const vals = readForm($('#eform'), cfg.fields);
    const missing = cfg.fields.filter(f => f.req && (vals[f.k] === '' || vals[f.k] == null));
    if (missing.length) return toast('Champ obligatoire : ' + missing.map(f => f.label).join(', '), true);
    if (name === 'posts' && !vals.slug) vals.slug = slugify(vals.title) + '-' + Date.now().toString(36).slice(-4);
    if (name === 'centers' && vals.slug) vals.slug = slugify(vals.slug);
    if (name === 'faq' && !id) vals.category = 'general';
    const btn = $('#saveBtn'); btn.disabled = true;
    const res = id ? await T(name).update(vals).eq('id', id) : await T(name).insert(vals);
    btn.disabled = false;
    if (res.error) return toast(res.error.message, true);
    clearPublicCache(); toast('Enregistré — visible sur le site');
    location.hash = back;
  };
  $('#delBtn')?.addEventListener('click', async () => {
    if (await confirmBox('Supprimer définitivement cet élément ? Pour le retirer temporairement, utilisez plutôt « Masquer ».', [['ok', 'Supprimer', 'b-danger']]) !== 'ok') return;
    const { error } = await T(name).delete().eq('id', id);
    if (error) return toast(error.message, true);
    clearPublicCache(); toast('Supprimé'); location.hash = back;
  });
}

// ============================================================
// Authentification
// ============================================================
async function showApp(session) {
  const { data: isAdmin, error } = await sb.rpc('letpadel_is_admin');
  if (error || !isAdmin) {
    $('#app').hidden = true; $('#login').hidden = false;
    const m = $('#loginMsg'); m.className = 'msg err';
    m.textContent = `Le compte ${session.user.email} n'a pas les droits d'administration du site Let Padel.`;
    await sb.auth.signOut();
    return;
  }
  $('#login').hidden = true; $('#app').hidden = false;
  $('#whoami').textContent = session.user.email;
  await refreshUnread();
  route();
}

function initAuth() {
  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target); const m = $('#loginMsg');
    m.className = 'msg'; m.textContent = 'Connexion…';
    const { data, error } = await sb.auth.signInWithPassword({ email: fd.get('email'), password: fd.get('password') });
    if (error) { m.className = 'msg err'; m.textContent = error.message === 'Invalid login credentials' ? 'E-mail ou mot de passe incorrect.' : error.message; return; }
    m.textContent = '';
    showApp(data.session);
  });
  $('#forgotBtn').addEventListener('click', async () => {
    const email = $('#loginForm [name=email]').value.trim(); const m = $('#loginMsg');
    if (!email) { m.className = 'msg err'; m.textContent = 'Saisissez d\'abord votre e-mail ci-dessus.'; return; }
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
    m.className = error ? 'msg err' : 'msg ok';
    m.textContent = error ? error.message : 'Si ce compte existe, un e-mail de réinitialisation vient d\'être envoyé.';
  });
  $('#resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = new FormData(e.target).get('password'); const m = $('#resetMsg');
    const { error } = await sb.auth.updateUser({ password: pw });
    if (error) { m.className = 'msg err'; m.textContent = error.message; return; }
    m.className = 'msg ok'; m.textContent = 'Mot de passe enregistré.';
    history.replaceState(null, '', location.pathname);
    const { data } = await sb.auth.getSession(); setTimeout(() => showApp(data.session), 600);
  });
  $('#logoutBtn').addEventListener('click', async () => { await sb.auth.signOut(); location.hash = ''; location.reload(); });
  $('#menuBtn').addEventListener('click', () => $('#side').classList.toggle('open'));
  window.addEventListener('hashchange', () => { if (!$('#app').hidden) route(); });

  sb.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') { $('#app').hidden = true; $('#login').hidden = false; $('#loginForm').hidden = true; $('#resetForm').hidden = false; }
  });
}

(async () => {
  initAuth();
  const isRecovery = /type=recovery/.test(location.hash);
  const { data } = await sb.auth.getSession();
  if (data.session && !isRecovery) showApp(data.session);
  else if (!isRecovery) $('#login').hidden = false;
})();

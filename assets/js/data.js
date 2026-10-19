// Accès en lecture aux contenus publics (API REST Supabase) + petit cache de session.
import { SUPABASE_URL, SUPABASE_KEY, PREFIX } from './config.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.1.7/+esm';

const TTL = 3 * 60 * 1000; // 3 min : navigation rapide entre les pages, contenus frais ensuite
const inflight = new Map();

function cacheGet(k) {
  try {
    const raw = sessionStorage.getItem('lp:' + k);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    return Date.now() - t < TTL ? v : null;
  } catch { return null; }
}
function cacheSet(k, v) {
  try { sessionStorage.setItem('lp:' + k, JSON.stringify({ t: Date.now(), v })); } catch { /* quota / privé */ }
}

export async function api(table, query = '') {
  const key = table + '?' + query;
  const cached = cacheGet(key);
  if (cached) return cached;
  if (inflight.has(key)) return inflight.get(key);
  const p = fetch(`${SUPABASE_URL}/rest/v1/${PREFIX}${table}?${query}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  }).then(async r => {
    if (!r.ok) throw new Error(`Lecture ${table} impossible (${r.status})`);
    const data = await r.json();
    cacheSet(key, data);
    inflight.delete(key);
    return data;
  }).catch(e => { inflight.delete(key); throw e; });
  inflight.set(key, p);
  return p;
}

export async function settings() {
  const rows = await api('settings', 'select=key,value');
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}
export const centers = () => api('centers', 'select=*&visible=eq.true&order=sort');
export const coaches = () => api('coaches', 'select=*&visible=eq.true&order=sort');
export const faq = () => api('faq', 'select=*&visible=eq.true&order=sort');
export const gallery = (album) => api('gallery', 'select=*&visible=eq.true&order=sort' + (album ? `&album=eq.${encodeURIComponent(album)}` : ''));
export const offers = (cats) => api('offers', `select=*&visible=eq.true&order=sort&category=in.(${cats.map(c => `"${c}"`).join(',')})`);
export const blocks = (page) => api('blocks', `select=*&visible=eq.true&order=sort&page=eq.${encodeURIComponent(page)}`);
export const posts = (limit) => api('posts', 'select=*&published=eq.true&order=published_at.desc' + (limit ? `&limit=${limit}` : ''));

export function groupBy(list, key) {
  return list.reduce((acc, it) => ((acc[it[key]] ||= []).push(it), acc), {});
}
export function bySection(list) {
  const g = groupBy(list, 'section');
  return new Proxy(g, { get: (t, k) => (t[k] || [])[0] || null });
}

// Texte → HTML sûr
export const esc = (s = '') => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const rich = (html = '') => DOMPurify.sanitize(html || '', { ADD_ATTR: ['target'] });
export const nl2br = (s = '') => esc(s).replace(/\n/g, '<br>');

// Liens spéciaux : @booking, @licence, @shop, @tournaments → URL des réglages
export function link(url, general = {}) {
  if (!url) return '#';
  const map = { '@booking': general.booking_url, '@licence': general.licence_url, '@shop': general.shop_url, '@tournaments': general.tournaments_url, '@brochure': general.brochure_url };
  return map[url] || url;
}
export const isExternal = (url = '') => /^https?:\/\//.test(url) && !url.includes(location.host);
export const ext = (url) => isExternal(url) ? ' target="_blank" rel="noopener"' : '';

export function fmtDate(d, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', opts);
}

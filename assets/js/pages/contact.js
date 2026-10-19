import { boot } from '../boot.js';
import { faq, blocks, bySection, esc } from '../data.js';
import { SUPABASE_URL, SUPABASE_KEY, PREFIX } from '../config.js';
import { $, set, pageHero, faqHTML, centerInfoHTML, mapEmbed } from '../ui.js';

boot('contact', async ({ cs }) => {
  const [fq, bl] = await Promise.all([faq(), blocks('contact')]);
  const B = bySection(bl);
  if (B.hero) pageHero(B.hero);

  set('#faqList', faqHTML(fq));
  set('#contactCenters', cs.map(c => `<div class="card"><h3>${esc(c.name)}</h3>${centerInfoHTML(c)}<div style="margin-top:18px">${mapEmbed(c)}</div></div>`).join(''));

  const sel = $('#f-center');
  cs.forEach(c => sel.insertAdjacentHTML('beforeend', `<option value="${esc(c.slug)}">${esc(c.name)}</option>`));

  const params = new URLSearchParams(location.search);
  if (params.get('sujet')) $('#f-subject').value = params.get('sujet');
  if (params.get('centre')) sel.value = params.get('centre');

  const form = $('#contactForm');
  const msg = $('#formMsg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = ''; msg.textContent = '';
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return; // robot
    const bad = [];
    if (!data.name?.trim()) bad.push('#f-name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) bad.push('#f-email');
    if (!data.subject) bad.push('#f-subject');
    if (!data.message?.trim()) bad.push('#f-msg');
    form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
    if (bad.length) {
      bad.forEach(s => $(s).setAttribute('aria-invalid', 'true'));
      msg.className = 'form-msg err';
      msg.textContent = 'Merci de compléter les champs indiqués : nom, e-mail valide, sujet et message.';
      $(bad[0]).focus();
      return;
    }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Envoi…';
    try {
      const subjectLabel = $('#f-subject').selectedOptions[0]?.textContent || data.subject;
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${PREFIX}messages`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          name: data.name.trim(), email: data.email.trim(), phone: data.phone?.trim() || null,
          center: sel.selectedOptions[0]?.value ? sel.selectedOptions[0].textContent : null,
          subject: subjectLabel, message: data.message.trim(),
        }),
      });
      if (!r.ok) throw new Error(r.status);
      form.reset();
      msg.className = 'form-msg ok';
      msg.textContent = 'Message envoyé ! L\'équipe du Let Padel vous répond très vite.';
    } catch {
      msg.className = 'form-msg err';
      msg.textContent = 'Le message n\'est pas parti. Vérifiez votre connexion et réessayez, ou appelez directement votre centre.';
    } finally {
      btn.disabled = false; btn.textContent = 'Envoyer le message';
    }
  });
});

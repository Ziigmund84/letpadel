import { mountLayout } from './layout.js';
import { initSmooth, reveal, reboundBall, refresh } from './fx.js';

// Démarre une page : gabarit, défilement fluide, rendu du contenu, animations.
export async function boot(page, render) {
  initSmooth();
  const ctx = await mountLayout(page);
  try {
    await render?.(ctx);
  } catch (e) {
    console.error(e);
    const main = document.getElementById('main');
    const box = document.createElement('div');
    box.className = 'wrap empty';
    box.style.margin = '40px auto';
    box.textContent = 'Une partie du contenu n\'a pas pu être chargée. Rechargez la page dans un instant.';
    main?.appendChild(box);
  }
  reveal();
  reboundBall();
  // les images chargées changent les hauteurs : on recalcule les déclencheurs
  window.addEventListener('load', refresh);
  setTimeout(refresh, 600);
  if (location.hash) setTimeout(() => {
    const t = document.querySelector(location.hash);
    if (t) (window.__lenis ? window.__lenis.scrollTo(t, { offset: -90, immediate: true }) : t.scrollIntoView());
  }, 350);
  return ctx;
}

import { boot } from '../boot.js';
import { rich } from '../data.js';
import { set } from '../ui.js';

const page = document.body.dataset.page;
boot(page === '404' ? '' : 'legal', async ({ s }) => {
  if (page !== '404') set('#legal', rich(s.legal?.html || '<p>Les mentions légales seront publiées prochainement.</p>'));
});

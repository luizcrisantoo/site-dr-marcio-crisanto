/**
 * Dr. Márcio Crisanto · script principal
 * Importa e inicializa os módulos. Nada no escopo global.
 */
import { initMenu } from './modules/menu.js';
import { initScroll } from './modules/scroll.js';
import { initBooking } from './modules/booking.js';
import { initPlans } from './modules/plans.js';
import { initAnalytics } from './modules/api.js';

function init() {
  document.documentElement.classList.add('js');
  initMenu();
  initScroll();
  initPlans();
  initBooking();
  initAnalytics();

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * consent.js · aviso de cookies (LGPD) ligado ao Modo de Consentimento do Google Analytics.
 * Mostra o aviso só se o visitante ainda não escolheu. Botões com data-consent-open reabrem o aviso.
 */
const STORAGE_KEY = 'dmc-consent-analytics';

function readChoice() {
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function saveChoice(value) {
  try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* navegador sem armazenamento: vale só nesta visita */ }
}

function updateConsent(value) {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: value });
  }
}

function buildBanner() {
  const banner = document.createElement('section');
  banner.className = 'consent';
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.hidden = true;

  const text = document.createElement('p');
  text.className = 'consent__text';
  text.append(document.createTextNode('Usamos cookies do Google Analytics para entender como o site é usado, sem identificar você. '));
  const link = document.createElement('a');
  link.href = '/privacidade/';
  link.textContent = 'Política de privacidade';
  text.append(link);

  const actions = document.createElement('div');
  actions.className = 'consent__actions';
  const decline = document.createElement('button');
  decline.type = 'button';
  decline.className = 'btn btn--quiet btn--sm';
  decline.textContent = 'Recusar';
  const accept = document.createElement('button');
  accept.type = 'button';
  accept.className = 'btn btn--primary btn--sm';
  accept.textContent = 'Aceitar';
  actions.append(decline, accept);

  banner.append(text, actions);
  document.body.appendChild(banner);

  function choose(value) {
    saveChoice(value);
    updateConsent(value);
    banner.hidden = true;
    document.documentElement.classList.remove('has-consent-banner');
  }
  accept.addEventListener('click', () => choose('granted'));
  decline.addEventListener('click', () => choose('denied'));
  return banner;
}

export function initConsent() {
  const banner = buildBanner();

  function open() {
    banner.hidden = false;
    document.documentElement.classList.add('has-consent-banner');
  }

  if (!readChoice()) open();

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-consent-open]')) {
      event.preventDefault();
      open();
      banner.querySelector('button')?.focus();
    }
  });
}

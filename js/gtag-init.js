// Google Analytics 4 com Modo de Consentimento (LGPD).
// Carregado ANTES do gtag.js. Por padrão a coleta com cookies fica negada até o visitante aceitar
// (a escolha fica salva no navegador e o banner em js/modules/consent.js atualiza o consentimento).
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;

(function applyDefaultConsent() {
  let stored = null;
  try { stored = window.localStorage.getItem('dmc-consent-analytics'); } catch (e) { stored = null; }
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: stored === 'granted' ? 'granted' : 'denied',
    wait_for_update: 500
  });
})();

gtag('js', new Date());
gtag('config', 'G-GRQ0C4XLX9');

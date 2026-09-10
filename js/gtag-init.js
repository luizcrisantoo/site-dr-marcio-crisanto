// Inicialização do Google Analytics 4 (arquivo externo para respeitar a CSP sem 'unsafe-inline').
// Substituir G-XXXXXXXXXX pelo ID da propriedade.
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');

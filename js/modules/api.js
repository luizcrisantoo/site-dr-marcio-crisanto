/**
 * api.js · integrações externas: WhatsApp, telefone e Analytics (agendamento e avaliações).
 * Ponto de extensão: se no futuro houver agenda online / backend, conectar aqui.
 */
export const BASE_MESSAGE = 'Olá, vim através do site do Dr. Márcio Crisanto e gostaria de agendar uma consulta com ele.';

/** Mantém somente dígitos (evita qualquer injeção no link) */
export function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

/** Remove caracteres de controle e sinais de marcação de textos digitados pelo paciente */
export function sanitizeText(value, max = 40) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F<>"'`&]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function buildWhatsAppUrl(number, message) {
  const digits = onlyDigits(number);
  if (digits.length < 12 || digits.length > 13) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl(number) {
  const digits = onlyDigits(number);
  return digits ? `tel:+${digits}` : '';
}

export function isSafeHttpsUrl(url) {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

/** Evento de clique no WhatsApp/telefone para o GA4 (só dispara se o gtag estiver ativo) */
export function trackContact(origin) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'clique_agendamento', { origem: origin || 'geral' });
  }
}

/** Evento de clique nos links de avaliações (Google / Doctoralia) para o GA4 */
export function trackReviews(platform) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'clique_avaliacoes', { plataforma: platform || 'geral' });
  }
}

export function initAnalytics() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href*="wa.me"], a[href^="tel:"]');
    if (link) trackContact(link.dataset.origem || link.closest('[data-location]')?.dataset.location);

    const review = event.target.closest('a[data-origem^="avaliacoes-"]');
    if (review) trackReviews(review.dataset.origem.slice('avaliacoes-'.length));
  });
}

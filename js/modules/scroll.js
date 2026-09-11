/**
 * scroll.js · header com sombra, animações on-scroll, voltar ao topo
 * e barra de agendamento do mobile (some quando a seção de agendamento está visível)
 */
const REVEAL_SELECTOR = '.section__head, .condition, .step, .alert-box, .about__media, .about__content, .congress, .faq__item';

function observeReveal() {
  const items = document.querySelectorAll(REVEAL_SELECTOR);
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });
}

function observeBookingSection() {
  const booking = document.getElementById('agendar');
  const footer = document.querySelector('.footer');
  const bar = document.querySelector('[data-mobile-cta]');
  if (!booking || !bar || !('IntersectionObserver' in window)) return;

  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    bar.classList.toggle('is-hidden', visible.size > 0);
  }, { threshold: 0.05 });

  observer.observe(booking);
  if (footer) observer.observe(footer);
}

function handleScrollState(header, toTop) {
  let ticking = false;

  function update() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 900);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.requestAnimationFrame(update);
}

/* Mostra no menu em qual seção o visitante está (heurística: visibilidade do status do sistema) */
function observeActiveSection() {
  const links = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.removeAttribute('aria-current'));
      const active = byId.get(entry.target.id);
      if (active) active.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

export function initScroll() {
  handleScrollState(document.querySelector('.header'), document.querySelector('[data-to-top]'));
  observeReveal();
  observeBookingSection();
  observeActiveSection();
}

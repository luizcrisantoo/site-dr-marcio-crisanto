/**
 * menu.js · menu hambúrguer (mobile) e estado do header
 */
const DESKTOP_QUERY = '(min-width: 1024px)';

function setMenuState(toggle, nav, open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.visually-hidden').textContent = open ? 'Fechar menu' : 'Abrir menu';
  nav.classList.toggle('is-open', open);
}

export function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu-principal');
  if (!toggle || !nav) return;

  function handleToggle() {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenuState(toggle, nav, !isOpen);
  }

  function handleLinkClick(event) {
    if (event.target.closest('a') && !window.matchMedia(DESKTOP_QUERY).matches) {
      setMenuState(toggle, nav, false);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenuState(toggle, nav, false);
      toggle.focus();
    }
  }

  function handleOutsideClick(event) {
    if (nav.classList.contains('is-open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setMenuState(toggle, nav, false);
    }
  }

  toggle.addEventListener('click', handleToggle);
  nav.addEventListener('click', handleLinkClick);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleOutsideClick);
}

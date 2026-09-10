/**
 * plans.js · lista de convênios recolhida em até 2 linhas por card
 *
 * Divulgação progressiva: cada lista mostra no máximo 2 linhas de etiquetas.
 * O que não couber fica oculto (atributo hidden, continua no DOM) e a última
 * posição visível vira o botão "+N convênios", que expande a lista inteira.
 *
 * O cálculo é feito por medição real (offsetTop), porque a largura dos cards
 * muda com a tela e com a fonte. Sem JavaScript, todas as etiquetas aparecem.
 * "Particular" e a etiqueta destacada no fluxo (is-match) nunca são ocultadas.
 */

const MAX_ROWS = 2;
const RESIZE_DELAY = 150;
const lists = [];
let lastViewportWidth = 0;
let resizeTimer = 0;

function getChips(list) {
  return Array.from(list.querySelectorAll(':scope > [data-plan]'));
}

function isProtected(chip) {
  return chip.dataset.plan === 'particular' || chip.classList.contains('is-match');
}

function pluralize(n) {
  return n === 1 ? 'convênio' : 'convênios';
}

function setButtonState(entry, hiddenCount) {
  const { button, list } = entry;
  button.setAttribute('aria-expanded', String(entry.expanded));
  if (entry.expanded) {
    button.textContent = 'Mostrar menos';
    button.setAttribute('aria-label', 'Mostrar menos convênios');
  } else {
    button.textContent = `+${hiddenCount} ${pluralize(hiddenCount)}`;
    button.setAttribute('aria-label', `Mostrar mais ${hiddenCount} ${pluralize(hiddenCount)}`);
  }
  list.classList.toggle('is-collapsed', !entry.expanded && hiddenCount > 0);
}

/** Linhas ocupadas pelas etiquetas visíveis (valores distintos de offsetTop). */
function getRowTops(items) {
  const tops = [];
  items.forEach((item) => {
    const top = item.offsetTop;
    if (!tops.some((t) => Math.abs(t - top) < 2)) tops.push(top);
  });
  return tops.sort((a, b) => a - b);
}

function layout(entry) {
  const { list, more } = entry;
  const chips = getChips(list);

  // Card oculto (filtro por região ou passo 1 escondido) mede 0: não mexe no estado atual
  if (!list.offsetWidth) return;

  chips.forEach((chip) => { chip.hidden = false; });

  if (entry.expanded) {
    more.hidden = false;
    setButtonState(entry, 0);
    return;
  }

  more.hidden = true;
  const rows = getRowTops(chips);
  if (rows.length <= MAX_ROWS) {
    setButtonState(entry, 0);
    return;
  }

  // Esconde tudo que passa da 2ª linha
  const limit = rows[MAX_ROWS - 1] + 1;
  chips.forEach((chip) => {
    if (chip.offsetTop > limit && !isProtected(chip)) chip.hidden = true;
  });

  const countHidden = () => chips.filter((chip) => chip.hidden).length;
  more.hidden = false;
  setButtonState(entry, countHidden());

  // Libera espaço, do fim para o começo, até o botão "+N" caber na 2ª linha
  let guard = chips.length;
  while (guard > 0 && getRowTops(chips.filter((c) => !c.hidden).concat(more)).length > MAX_ROWS) {
    const candidate = chips.filter((chip) => !chip.hidden && !isProtected(chip)).pop();
    if (!candidate) break;
    candidate.hidden = true;
    setButtonState(entry, countHidden());
    guard -= 1;
  }
}

function toggle(entry) {
  entry.expanded = !entry.expanded;
  layout(entry);
}

function createMoreItem(list) {
  const item = document.createElement('li');
  item.className = 'chip chip--more';
  item.hidden = true;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'chip__more';
  button.setAttribute('aria-controls', list.id);
  button.setAttribute('aria-expanded', 'false');

  item.appendChild(button);
  list.appendChild(item);
  return { item, button };
}

/** Recalcula o recolhimento das listas dentro de root (ex.: um card que acabou de aparecer). */
export function refreshPlans(root = document) {
  lists.forEach((entry) => {
    if (root === document || root.contains(entry.list)) layout(entry);
  });
}

function handleResize() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const width = window.innerWidth;
    if (width === lastViewportWidth) return;
    lastViewportWidth = width;
    refreshPlans();
  }, RESIZE_DELAY);
}

export function initPlans() {
  const found = Array.from(document.querySelectorAll('ul[data-plans]'));
  if (!found.length) return;

  found.forEach((list, index) => {
    if (!list.id) {
      const card = list.closest('[data-location]');
      const key = card && card.dataset.location ? card.dataset.location : String(index + 1);
      list.id = `convenios-${key}`;
    }
    const { item, button } = createMoreItem(list);
    const entry = { list, more: item, button, expanded: false };
    button.addEventListener('click', () => toggle(entry));
    lists.push(entry);
  });

  lastViewportWidth = window.innerWidth;
  refreshPlans();
  window.addEventListener('resize', handleResize, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => refreshPlans()).catch(() => {});
  }
}

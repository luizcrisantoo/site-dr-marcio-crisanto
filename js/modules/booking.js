/**
 * booking.js · fluxo de agendamento em 3 passos
 *   1. Local  →  2. Particular ou convênio  →  3. Mensagem pronta no WhatsApp (ou ligação)
 *
 * Os dados de cada unidade ficam no próprio HTML (data-attributes e chips de convênio),
 * então o conteúdo continua indexável e o site funciona sem JavaScript.
 * Todo texto dinâmico é inserido com textContent / createElement (nunca innerHTML).
 */
import { BASE_MESSAGE, buildWhatsAppUrl, buildTelUrl, isSafeHttpsUrl, sanitizeText } from './api.js';
import { refreshPlans } from './plans.js';

const state = {
  location: null,
  type: '',
  plan: '',
  planLabel: '',
  otherPlan: '',
};

const el = {};

/* ---------- utilidades ---------- */

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function getLocationPlans(location) {
  return $all('[data-plan]', location).map((chip) => chip.dataset.plan);
}

function getLocationName(location) {
  return location.dataset.name || '';
}

function createButton(text, onClick, className = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

/* ---------- navegação entre passos ---------- */

function updateStepper(step) {
  $all('[data-stepper-item]').forEach((item) => {
    const n = Number(item.dataset.stepperItem);
    item.classList.toggle('is-current', n === step);
    item.classList.toggle('is-done', n < step);
    if (n === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
}

function goToStep(step) {
  $all('[data-step]', el.panel).forEach((panel) => {
    const isTarget = Number(panel.dataset.step) === step;
    panel.hidden = !isTarget;
    panel.classList.toggle('is-entering', isTarget);
  });

  el.panel.classList.toggle('is-compact', step > 1);
  updateStepper(step);
  // A lista de locais esteve oculta: recalcula as etiquetas de convênio (e mantém visível a destacada)
  if (step === 1) refreshPlans(el.panel);

  const title = $(`[data-step="${step}"] .booking__step-title`, el.panel);
  el.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (title && step > 1) {
    window.setTimeout(() => title.focus({ preventScroll: true }), 350);
  }
}

/* ---------- passo 1 ---------- */

function selectLocation(location) {
  state.location = location;
  $all('.location', el.panel).forEach((card) => card.classList.toggle('is-selected', card === location));
  $('[data-chosen-name]', el.panel).textContent = getLocationName(location);
  updatePlanStatus();
  goToStep(2);
}

function handleLocationClick(event) {
  const trigger = event.target.closest('[data-select-location]');
  if (!trigger) return;
  const location = trigger.closest('[data-location]');
  if (!location) return;
  event.preventDefault();
  selectLocation(location);
}

/* ---------- passo 2 ---------- */

function highlightMatchingChips() {
  const target = state.type === 'particular' ? 'particular' : state.plan;
  $all('[data-plan]', el.panel).forEach((chip) => {
    chip.classList.toggle('is-match', Boolean(target) && chip.dataset.plan === target);
  });
}

function renderAlternatives(container, planKey) {
  const others = $all('.location', el.panel).filter(
    (loc) => loc !== state.location && getLocationPlans(loc).includes(planKey)
  );
  if (!others.length) return;

  const intro = document.createElement('span');
  intro.textContent = ' Unidades que aparecem com essa opção: ';
  container.appendChild(intro);

  others.forEach((loc, index) => {
    container.appendChild(createButton(getLocationName(loc), () => selectLocation(loc)));
    if (index < others.length - 1) container.appendChild(document.createTextNode(' · '));
  });
}

function updatePlanStatus() {
  const status = el.status;
  status.textContent = '';
  status.className = 'plan-status';
  highlightMatchingChips();

  if (!state.location || !state.type) return;

  const plans = getLocationPlans(state.location);
  const name = getLocationName(state.location);

  if (state.type === 'particular') {
    if (plans.includes('particular')) {
      status.classList.add('is-ok');
      status.textContent = `Esta unidade informa atendimento particular.`;
    } else {
      status.classList.add('is-warn');
      status.textContent = `${name} não informa atendimento particular no site. Você pode perguntar na mensagem.`;
      renderAlternatives(status, 'particular');
    }
    return;
  }

  if (!state.plan) return;

  if (state.plan === 'outro') {
    status.classList.add('is-warn');
    status.textContent = 'Informe o nome do plano. A recepção confirma a cobertura pela mensagem.';
    return;
  }

  if (plans.includes(state.plan)) {
    status.classList.add('is-ok');
    status.textContent = `${state.planLabel} aparece na lista desta unidade. A recepção confirma a cobertura do seu plano.`;
  } else {
    status.classList.add('is-warn');
    status.textContent = `${state.planLabel} não aparece na lista de ${name}. Você pode perguntar mesmo assim.`;
    renderAlternatives(status, state.plan);
  }
}

function canContinue() {
  if (!state.location || !state.type) return false;
  if (state.type === 'convenio') return Boolean(state.plan);
  return true;
}

function refreshStep2() {
  const isConvenio = state.type === 'convenio';
  el.planField.hidden = !isConvenio;
  el.otherField.hidden = !(isConvenio && state.plan === 'outro');
  updatePlanStatus();
  const ok = canContinue();
  el.next.disabled = !ok;
  if (el.hint) el.hint.hidden = ok;
}

function handleTypeChange(event) {
  state.type = event.target.value;
  refreshStep2();
}

function handlePlanChange(event) {
  const option = event.target.selectedOptions[0];
  state.plan = event.target.value;
  state.planLabel = option && option.value ? option.textContent : '';
  refreshStep2();
}

function handleOtherInput(event) {
  state.otherPlan = sanitizeText(event.target.value);
}

/* ---------- passo 3 ---------- */

function describeService() {
  if (state.type === 'particular') return 'Particular';
  if (state.plan === 'outro') return `Convênio ${state.otherPlan || '(outro plano)'}`;
  return `Convênio ${state.planLabel}`;
}

function buildMessage() {
  const local = getLocationName(state.location);
  let service = 'particular';
  if (state.type === 'convenio') {
    const plan = state.plan === 'outro' ? state.otherPlan || 'outro plano' : state.planLabel;
    service = `pelo convênio ${plan}`;
  }
  return `${BASE_MESSAGE} Local: ${local}. Atendimento ${service}.`;
}

function createActionLink({ href, text, icon, external, origem }) {
  const link = document.createElement('a');
  link.className = 'btn btn--quiet btn--block';
  link.href = href;
  link.dataset.origem = origem;
  if (external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  const iconEl = document.createElement('span');
  iconEl.className = `icon icon--${icon}`;
  iconEl.setAttribute('aria-hidden', 'true');
  link.append(iconEl, document.createTextNode(text));
  if (external) {
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = ' (abre em nova aba)';
    link.appendChild(sr);
  }
  return link;
}

function renderStep3() {
  const location = state.location;
  const origem = location.dataset.location;
  const message = buildMessage();
  const whatsappUrl = buildWhatsAppUrl(location.dataset.whatsapp, message);
  const telUrl = buildTelUrl(location.dataset.phone);
  const onlineUrl = isSafeHttpsUrl(location.dataset.online) ? location.dataset.online : '';

  $('[data-summary-location]', el.panel).textContent = getLocationName(location);
  $('[data-summary-type]', el.panel).textContent = describeService();

  const messageLabel = $('.summary__message-label', el.panel);
  const messageText = $('[data-summary-message]', el.panel);
  const send = $('[data-send]', el.panel);
  const sendLabel = $('[data-send-label]', el.panel);
  const sendSr = $('[data-send-sr]', el.panel);
  const sendIcon = $('.icon', send);
  send.dataset.origem = origem;
  messageText.textContent = message;

  // Canal principal: WhatsApp > agendamento online > telefone
  if (whatsappUrl) {
    send.href = whatsappUrl;
    send.target = '_blank';
    sendLabel.textContent = 'Enviar pelo WhatsApp';
    sendSr.textContent = ' (abre o WhatsApp em nova aba)';
    sendIcon.className = 'icon icon--whatsapp';
    messageLabel.textContent = 'Mensagem que será enviada';
  } else if (onlineUrl) {
    send.href = onlineUrl;
    send.target = '_blank';
    sendLabel.textContent = 'Agendar online pela Rede D’Or';
    sendSr.textContent = ' (abre em nova aba)';
    sendIcon.className = 'icon icon--calendar';
    messageLabel.textContent = 'Esta unidade agenda pelo sistema da Rede D’Or';
    messageText.textContent = 'A página já abre no perfil do Dr. Márcio, na unidade Paissandu. Escolha o dia, o horário e o seu plano. Se preferir, ligue para a central.';
  } else {
    send.href = telUrl;
    send.removeAttribute('target');
    sendLabel.textContent = 'Ligar para agendar';
    sendSr.textContent = '';
    sendIcon.className = 'icon icon--phone';
    messageLabel.textContent = 'Esta unidade agenda por telefone. O que dizer na ligação';
  }

  const alt = $('[data-alt]', el.panel);
  alt.textContent = '';
  if ((whatsappUrl || onlineUrl) && telUrl) {
    alt.appendChild(createActionLink({ href: telUrl, text: 'Prefiro ligar', icon: 'phone', external: false, origem }));
  }
}

function handleNext() {
  if (!canContinue()) return;
  renderStep3();
  goToStep(3);
}

function handleBack(event) {
  const target = Number(event.currentTarget.dataset.back);
  goToStep(target);
}

/* ---------- filtro por região (passo 1) ---------- */

function applyRegionFilter(region) {
  $all('[data-region-btn]', el.panel).forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.regionBtn === region));
  });
  $all('.location', el.panel).forEach((card) => {
    card.hidden = region !== 'todas' && card.dataset.region !== region;
  });
  // Card que estava oculto mediu 0: recalcula o recolhimento dos convênios agora que aparece
  refreshPlans(el.panel);
}

function initRegionFilter() {
  const filter = $('[data-region-filter]', el.panel);
  if (!filter) return;
  const cards = $all('.location', el.panel);

  $all('[data-region-btn]', filter).forEach((btn) => {
    const region = btn.dataset.regionBtn;
    const total = region === 'todas' ? cards.length : cards.filter((c) => c.dataset.region === region).length;
    $('[data-count]', btn).textContent = `(${total})`;
    btn.addEventListener('click', () => applyRegionFilter(region));
  });
  filter.hidden = false;
}

/* ---------- init ---------- */

export function initBooking() {
  el.section = document.getElementById('agendar');
  el.panel = $('[data-booking]');
  if (!el.section || !el.panel) return;

  el.status = $('[data-plan-status]', el.panel);
  el.planField = $('[data-plan-field]', el.panel);
  el.otherField = $('[data-other-field]', el.panel);
  el.next = $('[data-next]', el.panel);
  el.hint = $('[data-next-hint]', el.panel);
  initRegionFilter();

  // Com JS ativo, o botão do card passa a escolher o local (em vez de abrir o WhatsApp direto)
  $all('[data-select-location]', el.panel).forEach((button) => {
    const icon = $('.icon', button);
    if (icon) icon.className = 'icon icon--check';
    button.lastChild.textContent = 'Escolher este local';
    button.removeAttribute('target');
  });

  const stepper = $('[data-stepper]');
  if (stepper) stepper.hidden = false;

  el.panel.addEventListener('click', handleLocationClick);
  $all('[data-type]', el.panel).forEach((radio) => radio.addEventListener('change', handleTypeChange));
  $('[data-plan-select]', el.panel).addEventListener('change', handlePlanChange);
  $('[data-other-input]', el.panel).addEventListener('input', handleOtherInput);
  el.next.addEventListener('click', handleNext);
  $all('[data-back]', el.panel).forEach((button) => button.addEventListener('click', handleBack));
  // Links para a lista de locais sempre voltam ao passo 1
  document.addEventListener('click', (event) => {
    if (event.target.closest('a[href="#locais-lista"]') && el.panel.querySelector('[data-step="1"]').hidden) {
      goToStep(1);
    }
  });

  $('[data-send]', el.panel).addEventListener('click', (event) => {
    if (!event.currentTarget.getAttribute('href') || event.currentTarget.getAttribute('href') === '#') {
      event.preventDefault();
    }
  });
}

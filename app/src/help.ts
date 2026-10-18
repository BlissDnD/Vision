/* Help mode: transient/pinned linked cards, keyboard and one-shot touch inspection. UI only. */
import { h } from './dom';
import { HELP_BINDINGS, helpTopic, HelpTopic } from './helpdata';

const pref = (v?: boolean) => { try { if (v === undefined) return localStorage.getItem('vel.help') === '1'; localStorage.setItem('vel.help', v ? '1' : '0'); } catch (_) {} return false; };
let enabled = pref(), picking = false, dragging = false, pinned = false;
let target: HTMLElement | null = null, rootTopic: HelpTopic | null = null;
let history: string[] = [], openTimer = 0, closeTimer = 0, installed = false;
let root: HTMLElement, child: HTMLElement, toggle: HTMLButtonElement, pick: HTMLButtonElement;
let described: HTMLElement | null = null, previousDescription: string | null = null;
let modalObserver: MutationObserver, restoringFocus = false;
const $ = (id: string) => document.getElementById(id);
const inHelp = (el: Element | null) => el instanceof Element && !!el.closest('.help-card,#helpModeBtn,#helpPickBtn');
export const helpModeOn = () => enabled;
export const helpPicking = () => picking;
export const helpOpen = () => !!root && (!root.hidden || !child.hidden);
function clearTimers() { clearTimeout(openTimer); clearTimeout(closeTimer); }
function restoreDescription() {
  if (described) { if (previousDescription === null) described.removeAttribute('aria-describedby'); else described.setAttribute('aria-describedby', previousDescription); }
  described = null;
}
function safeFocus(el: HTMLElement | null) { if (el?.isConnected) { restoringFocus = true; el.focus({ preventScroll: true }); restoringFocus = false; } }
export function closeHelp(focus = false) {
  clearTimers(); const old = target; restoreDescription();
  if (root) root.hidden = true; if (child) child.hidden = true;
  target = null; rootTopic = null; pinned = false; history = [];
  if (focus) safeFocus(old);
}
function syncButtons() {
  toggle?.setAttribute('aria-pressed', String(enabled));
  if (pick) { pick.hidden = !enabled; pick.textContent = picking ? 'Mégse' : 'Mi ez?'; pick.setAttribute('aria-pressed', String(picking)); }
}
export function setHelpMode(on: boolean) { enabled = on; pref(on); picking = false; closeHelp(); syncButtons(); }
export function setHelpPicking(on: boolean) { picking = on && enabled; closeHelp(); syncButtons(); }
function topicFor(el: HTMLElement): HelpTopic | null {
  const id = el.dataset.helpId;
  if (id && helpTopic(id)) return helpTopic(id)!;
  const text = el.dataset.tip || el.title || el.getAttribute('aria-label');
  return text ? { id: '', title: text, summary: 'Ehhez a vezérlőhöz még nincs részletes súgó. A fenti felirat a meglévő rövid magyarázat.', steps: [], relatedIds: [], sourceRefs: [] } : null;
}
function candidate(el: Element | null) {
  // Prefer the nearest control: an ancestor's general topic must not mask a precise local title.
  return el?.closest<HTMLElement>('[data-help-id],[data-tip],[title],button[aria-label],input[aria-label],select[aria-label]') || null;
}
function position() {
  if (!target || !rootTopic) return;
  if (!target?.isConnected) { closeHelp(); return; }
  const modal = $('modal');
  if (modal && !modal.hidden && !modal.contains(target)) { closeHelp(); return; }
  const gap = 10, narrow = innerWidth < 720;
  for (const card of [root, child]) { card.style.left = ''; card.style.top = ''; card.style.bottom = ''; card.style.width = ''; }
  if (narrow) {
    root.hidden = history.length > 0; const card = history.length ? child : root;
    card.style.left = '8px'; card.style.bottom = '8px'; card.style.width = 'calc(100vw - 16px)'; return;
  }
  root.hidden = false;
  const r = target.getBoundingClientRect(), b = root.getBoundingClientRect();
  const x = Math.max(8, Math.min(innerWidth - b.width - 8, r.left));
  const y = Math.max(8, Math.min(innerHeight - b.height - 8, r.bottom + gap));
  root.style.left = x + 'px'; root.style.top = y + 'px';
  if (history.length) {
    const c = child.getBoundingClientRect();
    const cx = x + b.width + gap + c.width <= innerWidth - 8 ? x + b.width + gap : x - c.width - gap;
    child.style.left = Math.max(8, Math.min(innerWidth - c.width - 8, cx)) + 'px';
    child.style.top = Math.max(8, Math.min(innerHeight - c.height - 8, y)) + 'px';
  }
}
function cardContents(card: HTMLElement, t: HelpTopic, isChild: boolean) {
  card.replaceChildren();
  const close = h('button', { type: 'button', 'aria-label': isChild ? 'Kapcsolódó leírás bezárása' : 'Súgókártya bezárása', onclick: () => isChild ? backHelp() : closeHelp(true) }, '×');
  const header = h('div', { class: 'help-head' }, h('strong', { id: card.id + '-title' }, t.title), close);
  const summary = h('p', { id: card.id + '-summary' }, ...(t.parts || [t.summary]).map(part => typeof part === 'string' ? part : h('button', { type: 'button', class: 'help-inline', 'data-help-term': part.term, onclick: () => openHelpTerm(part.term) }, part.label || helpTopic(part.term)?.title || part.term)));
  card.append(header, summary);
  if (!isChild && !pinned) header.insertBefore(h('button', { type: 'button', 'data-help-pin': '', onclick: () => pinHelp() }, 'Rögzítés'), close);
  if (isChild) card.insertBefore(h('button', { type: 'button', 'data-help-back': '', onclick: () => backHelp() }, '← Vissza'), header);
  if (t.steps.length) card.append(h('ul', null, ...t.steps.map(s => h('li', null, s))));
  if (t.relatedIds.length) card.append(h('nav', { 'aria-label': 'Kapcsolódó fogalmak', class: 'help-links' }, ...t.relatedIds.map(id => h('button', { type: 'button', 'data-help-term': id, onclick: () => openHelpTerm(id) }, helpTopic(id)!.title))));
  if (!isChild && !pinned) card.append(h('small', null, 'Rögzítés: gomb vagy F1 · Kilépés: Escape'));
}
export function showHelpFor(el: HTMLElement, lock = false) {
  if (!enabled || !el.isConnected || dragging) return;
  const t = topicFor(el); if (!t) return;
  closeHelp(); target = el; rootTopic = t; pinned = lock;
  const modal = $('modal');
  const host = modal && !modal.hidden && modal.contains(el) ? $('dlg')! : document.body;
  host.append(root, child);
  // Help mode owns the native title too, avoiding duplicate browser tooltips.
  if (el.title) {
    el.dataset.tip = el.title;
    if (!el.getAttribute('aria-label') && !el.textContent?.trim()) el.setAttribute('aria-label', el.title);
    el.removeAttribute('title');
  }
  cardContents(root, t, false); root.hidden = false;
  described = el; previousDescription = el.getAttribute('aria-describedby');
  el.setAttribute('aria-describedby', [previousDescription, root.id + '-summary'].filter(Boolean).join(' '));
  position(); if (lock) safeFocus(root.querySelector('button'));
}
export function pinHelp() {
  if (!target || !rootTopic) return; clearTimers(); pinned = true;
  cardContents(root, rootTopic, false); position(); safeFocus(root.querySelector('button'));
}
export function openHelpTerm(id: string) {
  if (!helpTopic(id) || !rootTopic) return;
  clearTimers(); if (!pinned) { pinned = true; cardContents(root, rootTopic, false); }
  if (id === rootTopic.id) history = [];
  else { const at = history.indexOf(id); history = at >= 0 ? history.slice(0, at + 1) : [...history, id]; }
  renderChild();
}
function renderChild() {
  child.hidden = !history.length;
  if (history.length) { cardContents(child, helpTopic(history[history.length - 1])!, true); position(); safeFocus(child.querySelector('button')); }
  else { position(); safeFocus(root.querySelector('[data-help-term]') || root.querySelector('button')); }
}
export function backHelp() {
  const from = history.pop(); renderChild();
  const card = history.length ? child : root;
  const link = [...card.querySelectorAll<HTMLElement>('[data-help-term]')].find(el => el.dataset.helpTerm === from);
  if (link) safeFocus(link);
}
function schedule(el: HTMLElement) {
  clearTimers(); if (pinned || picking || dragging || !enabled) return;
  if (target === el && helpOpen()) return;
  openTimer = window.setTimeout(() => showHelpFor(el), 450);
}
function dismissLater() { clearTimeout(openTimer); clearTimeout(closeTimer); if (!pinned) closeTimer = window.setTimeout(() => closeHelp(), 220); }
export function installHelp() {
  if (installed) return; installed = true;
  toggle = h('button', { id: 'helpModeBtn', type: 'button', class: 'pill', 'aria-label': 'Részletes súgó mód', onclick: () => setHelpMode(!enabled) }, '? Súgó');
  pick = h('button', { id: 'helpPickBtn', type: 'button', class: 'pill', onclick: () => setHelpPicking(!picking) }, 'Mi ez?');
  $('helpBtn')?.before(toggle, pick);
  for (const [id, topic] of Object.entries(HELP_BINDINGS)) { const el = $(id); if (el) el.dataset.helpId = topic; }
  root = h('section', { id: 'vel-help-root', class: 'help-card', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'vel-help-root-title', hidden: true });
  child = h('section', { id: 'vel-help-child', class: 'help-card', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'vel-help-child-title', hidden: true });
  document.body.append(root, child); syncButtons();
  document.addEventListener('pointerover', e => {
    if (!enabled) return;
    const el = e.target as Element;
    if (inHelp(el)) { clearTimers(); return; }
    if (e.buttons) return;
    const next = candidate(el); if (next) schedule(next); else dismissLater();
  });
  document.addEventListener('pointerout', e => {
    if (!enabled || pinned) return;
    const next = e.relatedTarget as Element | null;
    if (inHelp(next) || (target && next && target.contains(next))) return;
    dismissLater();
  });
  document.addEventListener('focusin', e => {
    if (!enabled || restoringFocus || inHelp(e.target as Element)) return;
    const el = candidate(e.target as Element); if (el) schedule(el);
  });
  document.addEventListener('focusout', e => {
    if (!pinned && !inHelp(e.relatedTarget as Element | null)) dismissLater();
  });
  document.addEventListener('pointerdown', e => {
    if (!enabled || inHelp(e.target as Element)) return;
    if (picking) return; // click handles activation, including synthetic keyboard clicks
    dragging = true; closeHelp();
  }, true);
  window.addEventListener('pointerup', () => { dragging = false; }, true);
  window.addEventListener('pointercancel', () => { dragging = false; }, true);
  window.addEventListener('blur', () => { dragging = false; setHelpPicking(false); });
  document.addEventListener('click', e => {
    if (!picking || inHelp(e.target as Element)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const el = candidate(e.target as Element); setHelpPicking(false); if (el) showHelpFor(el, true);
  }, true);
  // Block pointer-start actions while inspecting, not just subsequent click handlers.
  document.addEventListener('pointerdown', e => {
    if (picking && !inHelp(e.target as Element)) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  document.addEventListener('keydown', e => {
    if (!enabled) return;
    if (e.key === 'Escape' && (helpOpen() || history.length || picking)) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (picking) setHelpPicking(false); else if (history.length) backHelp(); else closeHelp(true);
      return;
    }
    if (e.key === 'F1') {
      const el = candidate(document.activeElement);
      if (helpOpen() || el) { e.preventDefault(); e.stopImmediatePropagation(); if (helpOpen()) pinHelp(); else if (el) showHelpFor(el, true); }
      return;
    }
    // Editor shortcuts must not leak out of the reading surface; retain native Tab, selection and copy.
    if (e.target instanceof Element && e.target.closest('.help-card')) e.stopPropagation();
  }, true);
  document.addEventListener('wheel', e => {
    if (e.target instanceof Element && e.target.closest('.help-card')) e.stopPropagation(); else if (!pinned) closeHelp();
  }, { capture: true, passive: true });
  window.addEventListener('resize', position);
  document.addEventListener('scroll', e => { if (inHelp(e.target as Element)) return; if (pinned) position(); else closeHelp(); }, true);
  // One observer only: remove stale anchors and react to modal lifecycle, no frame polling.
  modalObserver = new MutationObserver(() => { if (target && (!target.isConnected || (target !== document.body && !target.getClientRects().length))) closeHelp(); else position(); });
  for (const id of ['modal', 'insp', 'side']) { const el = $(id); if (el) modalObserver.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
}

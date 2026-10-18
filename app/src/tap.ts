/* Időzítés gyorsan · Tap timing kosárral.
 * T arms „Tap”: clicks on layers (canvas or layer list) collect them into a basket in click order (numbered badges, click again
 * removes, drag a badge / strip chip to reorder; arming takes over a selected group's children or the layers of selected keys).
 * Then play and tap J (or the strip's button): each tap moves the NEXT basket layer's entrance to the tap time (shiftBlock of its
 * motion block; no entrance → a default Rugalmas beúszás at the tap) and stores the tap as a J cue. The whole take is one undo
 * step (commit only when it ends); Esc reverts the take (snapshot), Esc again disarms. Pure UI state lives in R (never saved). */
import { R } from './runtime';
import { $, h } from './dom';
import { BASEK } from './effects/index';
import { cv } from './gl';
import { findItem, sel, st, walk } from './state';
import { ev } from './evaluation';
import { outSize } from './render';
import { commit, renderAll, restore, snapshot } from './history';
import { renderLayers } from './layers';
import { renderInsp } from './inspector';
import { renderTimeline } from './timeline';
import { markDirty } from './loop';
import { toast } from './modals';
import { setPlay } from './transport';
import { hitsAt } from './pick';
import { addCue, shiftBlock, timeFields } from './retime';
import { makeMo } from './motion';

R.tapArm = false; R.tapBasket = [] as string[]; R.tapIdx = 0; R.tapS0 = null as string | null; R.tapDone = '';
const r3 = (v: number) => Math.max(0, Math.round(v * 1000) / 1000);
const item = (id: string) => { const f = findItem(id); return f ? f.it : null; };
const nameOf = (id: string) => (item(id) || { name: '?' }).name;

/** Start of a layer's entrance (earliest 'in' time field), or null when it has none. */
export function entranceStart(L: any) { const ins = timeFields(L).filter(f => f.role === 'in'); return ins.length ? Math.min(...ins.map(f => f.get())) : null; }

function changed() { renderLayers(); renderStrip(); markDirty(); }
/** Add (or, if already in, remove) a layer; a group adds its children that are not in yet. */
export function basketToggle(id: string) {
  const it = item(id); if (!it || R.tapS0) return;                       // the basket is fixed while a take is running
  const B: string[] = R.tapBasket, i = B.indexOf(id);
  if (i >= 0) B.splice(i, 1);
  else if (it.type === 'group') { const kids = (it.children || []).map((c: any) => c.id).filter((c: string) => !B.includes(c)); if (kids.length) B.push(...kids); else for (const c of it.children || []) { const j = B.indexOf(c.id); if (j >= 0) B.splice(j, 1); } }
  else B.push(id);
  changed();
}
export function basketMove(from: number, to: number) { const B: string[] = R.tapBasket; if (R.tapS0 || from === to || from < 0 || from >= B.length) return; to = Math.max(0, Math.min(B.length - 1, to)); const [x] = B.splice(from, 1); B.splice(to, 0, x); changed(); }
/** Take over what is selected: the layers of selected keys (Sávok), else the selected group's children, else the selected layer. */
export function basketTakeSel() {
  const B: string[] = R.tapBasket; let ids: string[] = [];
  for (const s of R.tlxSels || []) if (!ids.includes(s.id)) ids.push(s.id);
  if (!ids.length) { const L = sel(); if (L) ids = L.type === 'group' ? (L.children || []).map((c: any) => c.id) : [L.id]; }
  let n = 0; for (const id of ids) { const it = item(id); if (it && it.type !== 'group' && !B.includes(id)) { B.push(id); n++; } }
  if (n) changed(); return n;
}

export function setTapArm(on: boolean) {
  if (on === R.tapArm) return;
  if (!on && R.tapS0) finishTake(false);
  R.tapArm = on; R.tapDone = ''; $('#tapBtn').setAttribute('aria-pressed', String(on));
  if (on) { R.tapBasket = (R.tapBasket as string[]).filter(id => item(id)); R.tapIdx = 0; const n = basketTakeSel();
    toast(n > 1 ? `Tap armed: ${n} items in the basket (from the selection). Space: play, J: the next one enters. Esc: exit.` : 'Tap armed: click the layers (on the canvas or in the list) in entrance order, then Space and J on every beat.'); }
  changed();
}

/** One tap: the next basket layer enters at time t. */
export function tapNow(t: number = R.time) {
  const B: string[] = R.tapBasket; if (!R.tapArm) return null;
  if (!B.length) { toast('The basket is empty: click the layers first.'); return null; }
  if (R.tapIdx >= B.length) return null;
  if (!R.tapS0) R.tapS0 = snapshot();
  const L = item(B[R.tapIdx]); t = r3(t);
  if (L) { const s = entranceStart(L);
    if (s == null) { if (!L.mo) L.mo = []; L.mo.push(makeMo('spring', { at: t })); }
    else shiftBlock(L, t - s, false);
    addCue(t, L.name); }
  R.tapIdx++; R.tapPulse = performance.now();
  renderTimeline(); markDirty();
  if (R.tapIdx >= B.length) finishTake(true); else renderStrip();
  return L;
}
/** End the take: one commit (one undo step). */
function finishTake(all: boolean) {
  const n = R.tapIdx; R.tapS0 = null; commit(); renderInsp(); renderTimeline();
  if (all) { R.tapDone = `Done: all ${n} items in place · ⌘Z undoes it`; R.tapArm = false; $('#tapBtn').setAttribute('aria-pressed', 'false'); R.tapIdx = 0; renderLayers(); renderStrip(); toast(R.tapDone);
    const msg = R.tapDone; setTimeout(() => { if (R.tapDone === msg) { R.tapDone = ''; renderStrip(); } }, 3500); }
}
/** Esc: revert a running take (stay armed, basket kept); with no take running, disarm. */
export function tapEsc() {
  if (R.tapS0) { const s = R.tapS0; R.tapS0 = null; R.tapIdx = 0; if (R.playing) setPlay(false); restore(s); changed(); toast('Tap undone: nothing changed. Try again (Space, J), or Esc: exit.'); return; }
  setTapArm(false);
}
R.tapSetArm = setTapArm; R.tapNow = () => tapNow(); R.tapEsc = tapEsc; R.tapToggle = basketToggle;

/* ---------- reorder by dragging (layer-list badges and strip chips) ---------- */
function dragReorder(el: HTMLElement, from: number, sel: string) {
  el.onpointerdown = (e: PointerEvent) => {
    if (e.button !== 0 || R.tapS0) return; e.preventDefault(); e.stopPropagation(); el.classList.add('drag');
    let moved = false; const x0 = e.clientX, y0 = e.clientY;
    const mv = (q: PointerEvent) => { if (Math.abs(q.clientX - x0) + Math.abs(q.clientY - y0) > 4) moved = true; };
    const up = (q: PointerEvent) => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up, true); el.classList.remove('drag');
      if (!moved) return; q.stopPropagation(); const tgt = document.elementFromPoint(q.clientX, q.clientY) as HTMLElement | null, hit = tgt && tgt.closest(sel) as HTMLElement | null;
      const id = hit && (hit.dataset.tid || hit.dataset.id); const to = id ? (R.tapBasket as string[]).indexOf(id) : -1; if (to >= 0) basketMove(from, to); };
    document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up, true);
  };
  el.onclick = (e: MouseEvent) => e.stopPropagation();
}
/** Numbered badge on a layer row (layers.ts asks for it). */
R.tapBadge = (id: string) => {
  if (!R.tapArm) return null; const i = (R.tapBasket as string[]).indexOf(id); if (i < 0) return null;
  const b = h('span', { class: 'tapbdg' + (i === R.tapIdx ? ' next' : '') + (i < R.tapIdx ? ' done' : ''), title: 'Entrance order for tapping · drag onto another number to reorder · click the row: remove' }, String(i + 1)) as HTMLElement;
  dragReorder(b, i, 'li.lr'); return b;
};

/* ---------- the strip (no window) ---------- */
const strip = h('div', { class: 'tapstrip', hidden: true, role: 'region', 'aria-label': 'Tap basket' }) as HTMLElement;
$('#wrap').appendChild(strip);
export function renderStrip() {
  strip.innerHTML = '';
  if (!R.tapArm) { strip.hidden = !R.tapDone; if (R.tapDone) strip.appendChild(h('span', { class: 'tapmsg ok' }, R.tapDone)); return; }
  strip.hidden = false; const B: string[] = R.tapBasket;
  strip.appendChild(h('span', { class: 'taplbl' }, 'Tap'));
  if (!B.length) strip.appendChild(h('span', { class: 'tapmsg' }, 'Click the layers in entrance order (on the canvas or in the list).'));
  B.forEach((id, i) => { const c = h('span', { class: 'tapchip' + (i === R.tapIdx ? ' next' : '') + (i < R.tapIdx ? ' done' : ''), 'data-tid': id, title: 'Drag to reorder' },
    h('b', null, String(i + 1)), h('span', null, nameOf(id)),
    R.tapS0 ? null : h('button', { class: 'x', type: 'button', 'aria-label': nameOf(id) + ' remove', title: 'Remove from the basket', onclick: (e: MouseEvent) => { e.stopPropagation(); basketToggle(id); } }, '×')) as HTMLElement;
    dragReorder(c, i, '.tapchip'); strip.appendChild(c); });
  if (B.length) { const left = B.length - R.tapIdx;
    strip.appendChild(h('button', { class: 'btn tapgo', type: 'button', title: 'Tap now (J): the next item enters here', onclick: () => tapNow() }, `J · ${nameOf(B[R.tapIdx])} enters`));
    strip.appendChild(h('span', { class: 'tapmsg' }, R.tapS0 ? `${left} left · Esc: undo` : `Space: play · J on every beat · Esc: exit`)); }
  place();
}
function place() { // above the timeline bar, and above the Sávok / Jelenetek panel when one is open
  let b = 52; for (const s of ['#tlx', '#scn']) { const e = $(s) as HTMLElement; if (e && !e.hidden) b = Math.max(b, 52 + e.offsetHeight + 6); }
  strip.style.bottom = b + 'px';
}

/* ---------- canvas: click to collect, numbers next to the layers ---------- */
const nums = h('div', { class: 'tapnums' }) as HTMLElement; $('#wrap').appendChild(nums);
const wrap = $('#wrap') as HTMLElement;
document.addEventListener('pointerdown', (e: PointerEvent) => {
  if (!R.tapArm || e.button !== 0) return; const tg = e.target as HTMLElement;
  if (!wrap.contains(tg) || tg.closest('.hudbar,.hud,.tl,.tlx,.kmenu,.scn,.textbar,.tapstrip,.popover,.moarrow')) return;
  const r = cv.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
  e.stopPropagation(); e.preventDefault();
  const hit = hitsAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)[0];
  if (hit) basketToggle(hit.it.id); else toast('No layer here.');
}, { capture: true });
R.updTap = (t: number) => {
  const B: string[] = R.tapBasket; if (!R.tapArm || !B.length) { if (nums.childElementCount) nums.innerHTML = ''; return; }
  if (nums.childElementCount !== B.length) { nums.innerHTML = ''; B.forEach(() => nums.appendChild(h('i', null))); }
  const cr = cv.getBoundingClientRect(), wr = wrap.getBoundingClientRect(), { W, H } = outSize();
  const par: Record<string, any> = {}; walk(st.layers, (it: any, _l: any, p: any) => { par[it.id] = p; });
  B.forEach((id, i) => { const L = item(id), el = nums.children[i] as HTMLElement; if (!L) { el.hidden = true; return; }
    let x = ev(L.n.x, BASEK.x, t), y = ev(L.n.y, BASEK.y, t); const g = par[id]; if (g) { x += ev(g.n.x, BASEK.x, t); y += ev(g.n.y, BASEK.y, t); }
    el.hidden = false; el.textContent = String(i + 1); el.className = i === R.tapIdx ? 'next' : i < R.tapIdx ? 'done' : '';
    el.style.left = (cr.left - wr.left + (x / (W / H) + .5) * cr.width + 10) + 'px'; el.style.top = (cr.top - wr.top + (.5 - y) * cr.height - 22) + 'px'; });
};

/* ---------- the button on the timeline bar ---------- */
const btn = h('button', { class: 'ib', id: 'tapBtn', type: 'button', 'aria-pressed': 'false', title: 'Tap (T): rétegek kosárba a belépés sorrendjében, aztán lejátszás közben J minden ütemre', 'aria-label': 'Tap timing',
  html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10l4.2.9a2 2 0 0 1 1.6 2.2l-.6 4.9H10l-3.2-4.2a1.4 1.4 0 0 1 2.2-1.7z"/><path d="M5 4.5 3.5 3M15.5 4.5 17 3M4 8H2"/></svg>' }) as HTMLElement;
btn.onclick = () => setTapArm(!R.tapArm);
$('#tlxBtn').after(btn);

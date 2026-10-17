/* K1 · Kapcsolat-zsinór (spec: vel-intuitiv-mozgas-es-kapcsolatok.md 2–3., 9.)
 * The selected element shows a small ⇢ point next to its gizmo. Dragging it draws a thin cord; only targets it can
 * meaningfully act on are highlighted (rings on the canvas, chips for full-frame layers, layer rows). Releasing on a
 * target opens a short card with human choices ("Napfény hat az Égre", "Kövesse", "Vezérelje: …"): hovering a choice
 * previews it, a click applies it (one commit, undoable). Drawing the cord alone never changes the project.
 * Selected element: only its own cords are drawn; the ⇢ badge (layer row or cord midpoint) opens a mini-card. */
import { R } from './runtime';
import { $, h } from './dom';
import { BASE, BASEK, EFFECTS, kindOf } from './effects/index';
import { cv } from './gl';
import { findItem, sel, st } from './state';
import { curV, ev } from './evaluation';
import { outSize } from './render';
import { wrap } from './stage';
import { pathPos } from './animate';
import { units } from './pick';
import { addEffectLink, addLink, attachLinks, describeLink, linksOf, paramDef, removeLink, sunCanvas, sunLit, Link } from './variants';
import { SECOPEN } from './controls';
import { commit, renderAll } from './history';
import { markDirty } from './loop';
import { toast } from './modals';
import { setITab } from './inspector';

const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag: string, cls: string) => { const e = document.createElementNS(NS, tag); e.setAttribute('class', cls); return e; };

/* ---------- geometry ---------- */
/** Placeable = has a meaningful position on the canvas (not a full-frame source or a filter). */
export const placeable = (L: any) => !!L && (L.type === 'group' || L.type === 'sun' || L.type === 'planet' || L.type === 'flare' || !['gen', 'fx'].includes(kindOf(L)));
const nameOf = (id: string) => { const r = findItem(id); return r ? r.it.name : '(törölve)'; };
/** Canvas anchor (aspect units) of an element, or null for full-frame layers. */
export function anchorOf(L: any, t: number): { x: number; y: number } | null {
  if (!L) return null;
  if (L.type === 'sun') { const [x, y] = sunCanvas(L, t, ev); return { x, y }; }
  return placeable(L) ? pathPos(L, t) : null;
}
function toPx(x: number, y: number) {
  const cr = cv.getBoundingClientRect(), wr = wrap.getBoundingClientRect(); const { W, H } = outSize();
  return [cr.left - wr.left + (x / (W / H) + .5) * cr.width, cr.top - wr.top + (.5 - y) * cr.height];
}
const cordD = (x0: number, y0: number, x1: number, y1: number) => { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + Math.min(60, Math.hypot(x1 - x0, y1 - y0) * .18); return `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`; };

/* ---------- what can A do to B? ---------- */
const numParams = (L: any) => ((EFFECTS[L.type] && EFFECTS[L.type].params) || []).filter((d: any) => !d.type);
/** The source quantity a "Vezérelje" link reads: the first animated parameter, else the horizontal position. */
export function driverOf(A: any): { g: 'n' | 'p'; k: string; l: string } {
  for (const g of ['n', 'p'] as const) for (const k in A[g] || {}) { const n = A[g][k], d = paramDef(A, g, k); if (d && n && typeof n === 'object' && ((n.k && n.k.length) || n.a > 0 || n.s)) return { g, k, l: d.l }; }
  return { g: 'n', k: 'x', l: 'vízszintes helye' };
}
export interface Opt { kind: 'sunsky' | 'follow' | 'param'; label: string; sub: string; rec?: boolean; g?: 'n' | 'p'; k?: string }
/** Human choices for a cord from A to B, the clearest first; [] = not a meaningful target. */
export function linkOptions(A: any, B: any): Opt[] {
  if (!A || !B || A.id === B.id) return [];
  const out: Opt[] = [], have = (kind: string, a = A.id, b = B.id) => (st.links || []).some((l: Link) => l.kind === kind && l.from.id === a && l.to.id === b);
  if (A.type === 'sun' && sunLit(B) && !have('sunsky')) out.push({ kind: 'sunsky', rec: true, label: `Napfény hat: ${B.name}`, sub: 'A színe és a derengése a Nap helyéhez igazodik' });
  if (placeable(A) && placeable(B)) {
    if (!have('follow') && !have('follow', B.id, A.id)) out.push({ kind: 'follow', rec: !out.length, label: 'Kövesse', sub: `„${B.name}” kis késéssel követi „${A.name}” mozgását` });
  }
  const ps = numParams(B).filter((d: any) => (EFFECTS[B.type].main || []).includes(d.k));
  if (ps.length || B.n) out.push({ kind: 'param', label: 'Vezérelje', sub: `„${A.name}” ${driverOf(A).l} vezérli „${B.name}” egy értékét` });
  return out;
}
/** Parameters offered under "Vezérelje": the target's main sliders first, then placement. */
export function paramChoices(B: any): [string, string, string][] {
  const main = numParams(B).filter((d: any) => (EFFECTS[B.type].main || []).includes(d.k)).map((d: any) => ['p', d.k, d.l] as [string, string, string]);
  const rest = numParams(B).filter((d: any) => !(EFFECTS[B.type].main || []).includes(d.k)).map((d: any) => ['p', d.k, d.l] as [string, string, string]);
  const base = BASE.filter((b: any) => ['opacity', 's', 'r', 'x', 'y'].includes(b.k)).map((b: any) => ['n', b.k, b.l] as [string, string, string]);
  return [...main, ...base, ...rest];
}
/** Apply a choice: returns the new link (already in st.links, hooks attached; caller commits or removes). */
export function applyOpt(A: any, B: any, o: Opt, pk?: string): Link {
  let lk: Link;
  if (o.kind === 'sunsky') lk = addEffectLink('sunsky', A.id, B.id);
  else if (o.kind === 'follow') lk = addEffectLink('follow', A.id, B.id, { lag: .25, rx: curV(A.n.x), ry: curV(A.n.y) });
  else { const d = driverOf(A); const [g, k] = (pk || paramChoices(B).map(c => c[0] + ':' + c[1])[0]).split(':'); lk = addLink({ id: A.id, g: d.g, k: d.k }, { id: B.id, g: g as any, k }, 'add', .6); }
  attachLinks(ev); markDirty(); return lk;
}
/* ---------- overlay ---------- */
const svg = svgEl('svg', 'kcord-svg'); svg.setAttribute('aria-hidden', 'true');
const live = svgEl('path', 'kcord live'), cords = svgEl('g', ''), rings = svgEl('g', '');
svg.append(rings, cords, live); wrap.insertBefore(svg, $('#gizmo'));
const chips = h('div', { class: 'kchips', hidden: true }); wrap.appendChild(chips);
const dot = h('div', { class: 'h k', title: 'Kapcsolat: húzd egy másik elemre', role: 'button', 'aria-label': 'Kapcsolat húzása' }, '⇢');
$('#gizmo').appendChild(dot);

R.kdrag = null;
interface Cand { L: any; px?: number; py?: number; r?: number; chip?: HTMLElement; opts: Opt[] }
function candidates(A: any): Cand[] {
  const out: Cand[] = [];
  for (const L of units()) { if (L.id === A.id) continue; const opts = linkOptions(A, L); if (opts.length) out.push({ L, opts }); }
  return out;
}
function rowOf(id: string) { return document.querySelector(`#ltree .lr[data-id="${id}"]`) as HTMLElement | null; }
function markRows(c: Cand[] | null, hot?: string) {
  document.querySelectorAll('#ltree .lr.kc-ok,#ltree .lr.kc-hot').forEach(e => e.classList.remove('kc-ok', 'kc-hot'));
  if (c) for (const x of c) { const r = rowOf(x.L.id); if (r) { r.classList.add('kc-ok'); if (x.L.id === hot) r.classList.add('kc-hot'); } }
}
export function startCord(A: any, x0: number, y0: number) {
  const C = candidates(A); rings.replaceChildren(); chips.replaceChildren();
  for (const c of C) {
    const a = anchorOf(c.L, R.time);
    const rec = c.opts[0].kind !== 'param';
    if (a) { const [px, py] = toPx(a.x, a.y); c.px = px; c.py = py; c.r = 26;
      const ring = svgEl('circle', 'kring' + (rec ? ' rec' : '')); ring.setAttribute('cx', px.toFixed(1)); ring.setAttribute('cy', py.toFixed(1)); ring.setAttribute('r', '22'); ring.dataset.id = c.L.id; rings.appendChild(ring); }
    else { c.chip = h('span', { class: 'kchip' + (rec ? ' rec' : ''), 'data-id': c.L.id }, c.L.name); chips.appendChild(c.chip); }
  }
  chips.hidden = !chips.childNodes.length; svg.style.display = '';
  R.kdrag = { A, C, x0, y0, hot: null }; markRows(C);
  if (!C.length) toast('Nincs olyan elem, amelyre ez értelmesen hathatna.');
}
function targetAt(clientX: number, clientY: number): Cand | null {
  const d = R.kdrag; if (!d) return null;
  const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
  const id = el && (el.closest('.kchip,#ltree .lr') as HTMLElement | null)?.dataset.id;
  if (id) return d.C.find((c: Cand) => c.L.id === id) || null;
  const wr = wrap.getBoundingClientRect(), x = clientX - wr.left, y = clientY - wr.top;
  let best: Cand | null = null, bd = 1e9;
  for (const c of d.C) if (c.px != null) { const dd = Math.hypot(c.px - x, c.py! - y); if (dd < c.r! && dd <= bd) { bd = dd; best = c; } }
  return best;
}
function moveCord(clientX: number, clientY: number) {
  const d = R.kdrag; if (!d) return; const wr = wrap.getBoundingClientRect();
  const c = targetAt(clientX, clientY); d.hot = c ? c.L.id : null;
  const [x1, y1] = c && c.px != null ? [c.px, c.py!] : [clientX - wr.left, clientY - wr.top];
  live.setAttribute('d', cordD(d.x0, d.y0, x1, y1)); live.classList.toggle('hot', !!c);
  rings.querySelectorAll('.kring').forEach((r: any) => r.classList.toggle('hot', r.dataset.id === d.hot));
  chips.querySelectorAll('.kchip').forEach((r: any) => r.classList.toggle('hot', r.dataset.id === d.hot));
  markRows(d.C, d.hot);
}
function endCord(clientX?: number, clientY?: number) {
  const d = R.kdrag; if (!d) return;
  const c = clientX != null ? targetAt(clientX, clientY!) : null; R.kdrag = null;
  live.removeAttribute('d'); rings.replaceChildren(); chips.replaceChildren(); chips.hidden = true; markRows(null);
  if (c) openChoice(d.A, c.L, clientX!, clientY!);
}
dot.addEventListener('pointerdown', (e: PointerEvent) => {
  const A = sel(); if (!A || e.button !== 0) return; e.stopPropagation(); e.preventDefault();
  try { dot.setPointerCapture(e.pointerId); } catch (_) { /* synthetic */ }
  const wr = wrap.getBoundingClientRect(), r = dot.getBoundingClientRect();
  startCord(A, r.left + r.width / 2 - wr.left, r.top + r.height / 2 - wr.top);
  dot.onpointermove = (ev2: PointerEvent) => moveCord(ev2.clientX, ev2.clientY);
  dot.onpointerup = (ev2: PointerEvent) => { dot.onpointermove = dot.onpointerup = dot.onpointercancel = null; endCord(ev2.clientX, ev2.clientY); };
  dot.onpointercancel = () => { dot.onpointermove = dot.onpointerup = dot.onpointercancel = null; endCord(); };
});

/* ---------- choice card (after release) and mini-card (existing links) ---------- */
let card: HTMLElement | null = null, preview: Link | null = null, cardOff: any = null;
function dropPreview() { if (preview) { removeLink(preview.id); preview = null; attachLinks(ev); markDirty(); } }
export function closeCard() { dropPreview(); if (card) { card.remove(); card = null; } if (cardOff) { document.removeEventListener('pointerdown', cardOff, true); document.removeEventListener('keydown', cardOff, true); cardOff = null; } }
function placeCard(el: HTMLElement, x: number, y: number) {
  document.body.appendChild(el); const w = el.offsetWidth, hh = el.offsetHeight;
  el.style.left = Math.min(innerWidth - w - 10, Math.max(10, x + 12)) + 'px'; el.style.top = Math.min(innerHeight - hh - 10, Math.max(10, y - 10)) + 'px';
  setTimeout(() => { cardOff = (e: any) => { if (e.type === 'keydown') { if (e.key === 'Escape') { e.stopPropagation(); closeCard(); } return; } if (card && !card.contains(e.target)) closeCard(); };
    document.addEventListener('pointerdown', cardOff, true); document.addEventListener('keydown', cardOff, true); }, 0);
}
/** The card shown when the cord is released on B. Hover = preview, click = apply (one commit). */
export function openChoice(A: any, B: any, x: number, y: number) {
  closeCard();
  const opts = linkOptions(A, B), rev = linkOptions(B, A).filter(o => o.kind !== 'param');
  const accept = (o: Opt, pk?: string) => { dropPreview(); const lk = applyOpt(A, B, o, pk); closeCard(); commit(); renderAll();
    toast(`Kapcsolat kész: ${describeLink(lk)}. A ⇢ jelvényre kattintva állíthatod vagy törölheted.`); return lk; };
  const prev = (o: Opt, pk?: string) => { dropPreview(); preview = applyOpt(A, B, o, pk); };
  const btns = opts.filter(o => o.kind !== 'param').map(o => { const b = h('button', { class: 'kopt' + (o.rec ? ' rec' : ''), 'data-kind': o.kind }, h('b', null, o.label), h('small', null, o.sub));
    b.onmouseenter = b.onfocus = () => prev(o); b.onmouseleave = b.onblur = dropPreview; b.onclick = () => accept(o); return b; });
  const po = opts.find(o => o.kind === 'param');
  let prow: any = null;
  if (po) {
    const sp = h('select', { 'aria-label': 'Vezérelt érték' }, ...paramChoices(B).map(([g, k, l]) => h('option', { value: g + ':' + k }, l))) as HTMLSelectElement;
    const go = h('button', { class: 'btn', 'data-kind': 'param' }, 'Vezérelje');
    go.onmouseenter = () => prev(po, sp.value); go.onmouseleave = dropPreview; go.onclick = () => accept(po, sp.value);
    prow = h('div', { class: 'kparam' }, h('small', null, `„${A.name}” ${driverOf(A).l} →`), h('div', { class: 'row2' }, h('div', { class: 'pop' }, sp), go));
  }
  card = h('div', { class: 'kcard popover', role: 'dialog', 'aria-label': 'Kapcsolat választása' },
    h('div', { class: 'khead' }, h('span', null, `${A.name} → ${B.name}`), rev.length ? h('button', { class: 'ib', title: 'Irány megfordítása: a másik hasson erre', 'aria-label': 'Irány megfordítása', onclick: () => openChoice(B, A, x, y) }, '⇄') : null),
    ...btns, prow, h('div', { class: 'btnrow' }, h('button', { class: 'btn', onclick: closeCard }, 'Mégse')));
  placeCard(card, x, y);
}
/** Mini-card for the links of an element: on/off, strength, delay, details, delete. */
export function openLinkCard(id: string, x: number, y: number) {
  closeCard(); const list = linksOf(id); if (!list.length) return;
  const rows = list.map((lk: Link) => {
    const on = h('input', { type: 'checkbox', checked: lk.on, 'aria-label': 'Kapcsolat be' }) as HTMLInputElement;
    on.onchange = () => { lk.on = on.checked; commit(); renderAll(); };
    const sl = (label: string, key: 'amt' | 'lag', min: number, max: number) => { const r = h('input', { type: 'range', min, max, step: .01, value: (lk as any)[key] ?? 0, 'aria-label': label }) as HTMLInputElement;
      r.oninput = () => { (lk as any)[key] = +r.value; attachLinks(ev); markDirty(); }; r.onchange = () => commit(); return h('label', { class: 'row2' }, h('span', null, label), r); };
    return h('div', { class: 'klink', 'data-id': lk.id },
      h('div', { class: 'row2' }, h('b', null, describeLink(lk)), on),
      sl('Erősség', 'amt', lk.kind ? 0 : -2, lk.kind ? 1 : 2), lk.kind === 'follow' ? sl('Késés (mp)', 'lag', 0, 2) : null,
      h('div', { class: 'btnrow' },
        h('button', { class: 'btn', onclick: () => { closeCard(); R.selId = lk.to.id.split('.')[0]; SECOPEN.links = true; setITab('motion'); renderAll(); } }, 'Részletek'),
        h('button', { class: 'btn', onclick: () => { removeLink(lk.id); closeCard(); commit(); renderAll(); toast('Kapcsolat törölve.'); } }, 'Törlés')));
  });
  card = h('div', { class: 'kcard popover', role: 'dialog', 'aria-label': 'Kapcsolatok' }, h('div', { class: 'khead' }, h('span', null, `Kapcsolatok · ${nameOf(id)}`)), ...rows);
  placeCard(card, x, y);
}
R.openLinkCard = openLinkCard;

/* ---------- per frame: ⇢ point beside the gizmo, the selected element's own cords ---------- */
let sig = '';
export function updCords(t: number) {
  const L = sel(); const g = $('#gizmo');
  dot.hidden = !L || g.hidden;
  if (!dot.hidden) { const ring = g.querySelector('.ring') as HTMLElement; const rad = (parseFloat(ring.style.width) || 28) / 2; dot.style.left = (rad + 18) + 'px'; dot.style.top = '0px'; }
  if (R.kdrag) { cords.replaceChildren(); sig = ''; return; }
  const list = L && R.gizmoOn && R.tool !== 'orbit' ? linksOf(L.id).filter((l: Link) => l.on) : [];
  if (!list.length) { if (cords.childNodes.length) cords.replaceChildren(); sig = ''; svg.style.display = 'none'; return; }
  svg.style.display = '';
  const cr = cv.getBoundingClientRect(); const top = toPx(0, .5);
  const segs = list.map((lk: Link) => { const a = findItem(lk.from.id), b = findItem(lk.to.id); if (!a || !b) return null;
    const pa = anchorOf(a.it, t), pb = anchorOf(b.it, t);
    const A = pa ? toPx(pa.x, pa.y) : [top[0] - 40, top[1] + 14], B = pb ? toPx(pb.x, pb.y) : [top[0] + 40, top[1] + 14];
    return { lk, A, B }; }).filter(Boolean) as any[];
  const s2 = JSON.stringify(segs.map(s => [s.lk.id, s.A.map((v: number) => Math.round(v)), s.B.map((v: number) => Math.round(v))])) + cr.width;
  if (s2 === sig) return; sig = s2; cords.replaceChildren();
  for (const s of segs) {
    const p = svgEl('path', 'kcord' + (s.lk.kind ? ' fx' : '')); p.setAttribute('d', cordD(s.A[0], s.A[1], s.B[0], s.B[1])); cords.appendChild(p);
    const mx = (s.A[0] + s.B[0]) / 2, my = (s.A[1] + s.B[1]) / 2 + Math.min(60, Math.hypot(s.B[0] - s.A[0], s.B[1] - s.A[1]) * .18) / 2;
    const m = svgEl('circle', 'kmid'); m.setAttribute('cx', mx.toFixed(1)); m.setAttribute('cy', my.toFixed(1)); m.setAttribute('r', '6');
    const tt = document.createElementNS(NS, 'title'); tt.textContent = describeLink(s.lk) + ' · kattints a beállításhoz'; m.appendChild(tt);
    m.addEventListener('pointerdown', (e: any) => { e.stopPropagation(); e.preventDefault(); openLinkCard(L.id, e.clientX, e.clientY); });
    cords.appendChild(m);
  }
}
R.updCords = updCords;
document.addEventListener('keydown', e => { if (e.key === 'Escape' && R.kdrag) { e.stopPropagation(); endCord(); } }, true);

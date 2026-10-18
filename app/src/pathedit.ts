/* P2 · Útvonal szerkesztése a vásznon: a grip per control point of the selected Útvonal layer, the control polygon as a
 * hit line (double-click = insert a point there), Alt+click on a grip = delete, freehand drawing (one drag → simplified
 * points, the raw gesture is not kept). Plus the inspector pieces: „Útvonal” section and the path picker that the
 * Mozgás „Útvonalon” and the Részecske Forrás (Alak: Útvonal) share. Everything is one commit per gesture. */
import { R } from './runtime';
import { $, h } from './dom';
import { cv } from './gl';
import { sel, findItem } from './state';
import { outSize } from './render';
import { section } from './controls';
import { commit } from './history';
import { markDirty } from './loop';
import { Pt, arc, closedOf, insertPt, isPath, pathLayers, placeAt, ptsOf, simplify, toLocal, toWorld } from './paths';
import { toast } from './modals';

const asp = () => { const { W, H } = outSize(); return W / H; };
const rel = () => { const cr = cv.getBoundingClientRect(), wr = $('#wrap').getBoundingClientRect(); return { cr, ox: cr.left - wr.left, oy: cr.top - wr.top }; };
/** World (scene units) → px relative to #wrap. */
export function toScreen(q: Pt) { const { cr, ox, oy } = rel(); return { x: ox + (q[0] / asp() + .5) * cr.width, y: oy + (.5 - q[1]) * cr.height }; }
/** Client px → world. */
export function fromClient(cx: number, cy: number): Pt { const cr = cv.getBoundingClientRect(); return [((cx - cr.left) / cr.width - .5) * asp(), .5 - (cy - cr.top) / cr.height]; }
const rerender = () => import('./inspector').then(m => m.renderInsp());

let box: HTMLElement | null = null, hit: SVGPolylineElement | null = null, line: SVGPolylineElement | null = null, pad: HTMLElement | null = null;
R.pathSel = 0; R.pathDraw = null;
export function updPathGrips(t: number) {
  const L = sel(), show = !R.seqPlay && isPath(L) && R.gizmoOn && L.vis && !R.pathDraw;
  if (!box) {
    box = h('div', { class: 'sgrips pgrips' }); const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    hit = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); hit.setAttribute('class', 'phit'); line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    svg.appendChild(line); svg.appendChild(hit); box.appendChild(svg); $('#wrap').appendChild(box);
    hit.addEventListener('dblclick', (e: MouseEvent) => { const L = sel(); if (!isPath(L)) return; e.stopPropagation(); e.preventDefault();
      const P = placeAt(L, R.time); R.pathSel = insertPt(L, toLocal(P, fromClient(e.clientX, e.clientY))); commit(); markDirty(); rerender(); });
  }
  if (!show) { box.hidden = true; return; }
  box.hidden = false;
  const S = ptsOf(L), P = placeAt(L, t);
  while (box.childElementCount - 1 < S.length) {
    const g = h('button', { class: 'sgrip', type: 'button', 'data-h': 'path', 'aria-label': 'Útvonalpont', title: 'Húzd: a pont mozgatása. Alt+kattintás: törlés. Dupla kattintás a szaggatott vonalon: új pont.' });
    g.addEventListener('pointerdown', down); box.appendChild(g);
  }
  while (box.childElementCount - 1 > S.length) box.lastElementChild!.remove();
  const pts: string[] = [];
  [...box.children].slice(1).forEach((g: any, i) => { const q = toScreen(toWorld(P, S[i])); g.dataset.i = String(i); g.style.transform = `translate(${q.x}px,${q.y}px)`; g.classList.toggle('on', i === R.pathSel); pts.push(q.x.toFixed(1) + ',' + q.y.toFixed(1)); });
  if (closedOf(L) && pts.length > 2) pts.push(pts[0]);
  line!.setAttribute('points', pts.join(' ')); hit!.setAttribute('points', pts.join(' '));
}
function down(e0: PointerEvent) {
  const L = sel(); if (!isPath(L)) return; e0.stopPropagation(); e0.preventDefault();
  const g = e0.currentTarget as HTMLElement, i = +g.dataset.i!, S = ptsOf(L);
  if (e0.altKey) { if (S.length <= 2) { toast('Egy útvonalnak legalább két pontja van.'); return; } S.splice(i, 1); R.pathSel = Math.max(0, i - 1); commit(); markDirty(); rerender(); return; }
  g.setPointerCapture(e0.pointerId); R.pathSel = i; const P = placeAt(L, R.time); let moved = false;
  g.onpointermove = (m: PointerEvent) => { const q = toLocal(P, fromClient(m.clientX, m.clientY)); S[i] = [Math.round(q[0] * 1000) / 1000, Math.round(q[1] * 1000) / 1000]; moved = true; markDirty(); };
  const up = () => { g.onpointermove = null; g.onpointerup = null; if (moved) commit(); rerender(); };
  g.onpointerup = up; g.onpointercancel = up;
}
/** Freehand drawing: a transparent pad over the canvas; one drag replaces the layer's points. Esc cancels. */
export function armPathDraw(id: string) {
  const r = findItem(id); if (!r || !isPath(r.it)) return; R.pathDraw = id;
  if (!pad) { pad = h('div', { class: 'pdraw', title: 'Rajzold meg az útvonalat egy húzással. Esc: mégse.' }); $('#wrap').appendChild(pad);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); svg.appendChild(pl); pad.appendChild(svg);
    pad.addEventListener('pointerdown', (e0: PointerEvent) => {
      const rr = R.pathDraw && findItem(R.pathDraw); if (!rr) { disarm(); return; } e0.preventDefault(); pad!.setPointerCapture(e0.pointerId);
      const raw: Pt[] = [fromClient(e0.clientX, e0.clientY)], scr: string[] = [];
      const wr = $('#wrap').getBoundingClientRect(), addS = (e: PointerEvent) => scr.push((e.clientX - wr.left).toFixed(1) + ',' + (e.clientY - wr.top).toFixed(1)); addS(e0);
      pad!.onpointermove = (m: PointerEvent) => { raw.push(fromClient(m.clientX, m.clientY)); addS(m); pl.setAttribute('points', scr.join(' ')); };
      pad!.onpointerup = () => { pad!.onpointermove = null; pad!.onpointerup = null; pl.setAttribute('points', '');
        const L = rr.it, P = placeAt(L, R.time), loc = raw.map(q => toLocal(P, q)), pts = simplify(loc, .006 / Math.max(P[2], .01));
        if (pts.length < 2 || arc(loc).len < .02) { toast('Túl rövid vonal: húzz hosszabban.'); disarm(); return; }
        L.pts = pts.slice(0, 64); R.pathSel = 0; disarm(); commit(); markDirty(); rerender(); toast(`Útvonal: ${L.pts.length} pont · húzd a pontokat, dupla kattintás: új pont · ⌘Z visszavonja`); };
    });
  }
  pad.hidden = false; markDirty(); rerender();
}
export function disarm() { R.pathDraw = null; if (pad) pad.hidden = true; markDirty(); }
window.addEventListener('keydown', e => { if (e.key === 'Escape' && R.pathDraw) { disarm(); rerender(); } }, true);
R.armPathDraw = armPathDraw;
R.updPathGrips = updPathGrips;

/** The first Útvonal layer other than exceptId (for a freshly attached „Útvonalon” motion). */
R.pathFirst = (exceptId?: string) => { const P = pathLayers().filter(x => x.id !== exceptId); return P.length ? P[P.length - 1].id : null; };
/** Picker row: obj[key] = path layer id. Used by the motion card and the emitter. */
export function pathPick(obj: any, key: string, exceptId?: string) {
  const P = pathLayers().filter(x => x.id !== exceptId);
  const s = h('select', { class: 'sel', title: 'Melyik Útvonal rétegen' }, h('option', { value: '' }, P.length ? '— válassz útvonalat —' : '— nincs Útvonal réteg —'),
    ...P.map(x => h('option', { value: x.id, selected: obj[key] === x.id }, x.name)));
  s.onchange = () => { if (s.value) obj[key] = s.value; else delete obj[key]; commit(); markDirty(); };
  return h('div', { class: 'ctl' }, h('label', null, 'Útvonal'), s,
    P.length ? null : h('p', { class: 'small' }, 'Rajzolj egyet: 2D Formák → Útvonal (rajzolj).'));
}
R.pathPick = pathPick;
/** Inspector content for the Útvonal layer, and the path picker for the emitter's Útvonal shape. */
R.pathSection = (L: any) => {
  if (L.type === 'emitter') return Math.round(L.p.shape.v) === 6 ? section('Útvonal (kibocsátás)', 'empath', true, pathPick(L, 'path', L.id), h('p', { class: 'small' }, 'A részecskék a vonal mentén születnek; a Kifelé az alakból a vonalra merőlegesen löki őket.')) : null;
  if (L.type === 'textpath') return section('Útvonal (a szöveg alatt)', 'txpath', true, pathPick(L, 'path', L.id), h('p', { class: 'small' }, 'Útvonal nélkül egy saját ívet használ. Az Eltolás és az Úszás a betűket végigviszi rajta.'));
  if (!isPath(L)) return null;
  const S = ptsOf(L), i = Math.min(R.pathSel, S.length - 1);
  const redo = () => { commit(); markDirty(); rerender(); };
  return section('Útvonal', 'path', true,
    h('p', { class: 'small' }, `${S.length} pont. A vásznon húzd a pontokat; dupla kattintás a szaggatott vonalon: új pont; Alt+kattintás egy ponton: törlés.`),
    h('div', { class: 'btnrow' },
      h('button', { class: 'btn' + (R.pathDraw === L.id ? ' accent' : ''), onclick: () => (R.pathDraw === L.id ? (disarm(), rerender()) : armPathDraw(L.id)) }, R.pathDraw === L.id ? 'Rajzolás… (Esc: mégse)' : 'Újrarajzolás'),
      h('button', { class: 'btn', disabled: S.length <= 2, onclick: () => { S.splice(i, 1); R.pathSel = Math.max(0, i - 1); redo(); } }, `${i + 1}. pont törlése`),
      h('button', { class: 'btn', onclick: () => { S.reverse(); redo(); } }, 'Irány megfordítása')));
};

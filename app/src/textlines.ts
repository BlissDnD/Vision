/* M4 · soronkénti tipográfia: vászonfogantyú minden sor elején + „Sorok” szekció az inspectorban.
 * Grip drag: horizontal = indent (dx), vertical = space before the line (gap), Shift+vertical = line size.
 * All values live in L.text.lines[i] (em of the base size), so the text stays live, editable and animatable. */
import { R } from './runtime';
import { $, h } from './dom';
import { BASEK } from './effects/index';
import { cv } from './gl';
import { sel, st } from './state';
import { ev } from './evaluation';
import { outSize } from './render';
import { textCache, textLines, textTex } from './text';
import { ctlSlider, ctlSwitch, section } from './controls';
import { commit } from './history';
import { markDirty } from './loop';

const isText = (L: any) => L && (L.type === 'text' || L.type === 'mtext') && L.text;
export function lineObj(L: any, i: number) { const T = L.text; if (!T.lines) T.lines = []; while (T.lines.length <= i) T.lines.push({}); return T.lines[i]; }
/** Drop empty per-line entries so an untouched text keeps its old file form. */
export function tidyLines(T: any) {
  if (!T.lines) return; for (const q of T.lines) for (const k of Object.keys(q)) if (q[k] === '' || q[k] == null || (k === 'size' && q[k] === 1) || ((k === 'dx' || k === 'gap') && q[k] === 0) || (k === 'italic' && !q[k])) delete q[k];
  while (T.lines.length && !Object.keys(T.lines[T.lines.length - 1]).length) T.lines.pop(); if (!T.lines.length) delete T.lines;
}

/** Screen position (relative to #wrap) of a point given in text-canvas pixels. */
function toScreen(L: any, e: any, cx: number, cy: number, t: number) {
  const cr = cv.getBoundingClientRect(), wr = $('#wrap').getBoundingClientRect(), { W, H } = outSize();
  const x = ev(L.n.x, BASEK.x, t), y = ev(L.n.y, BASEK.y, t), s = ev(L.n.s, BASEK.s, t), a = (ev(L.n.r, BASEK.r, t) + L.n.spin.v * t) * Math.PI / 180;
  const k = e.fsz * 1.5, px = (cx - e.a0 * e.w) / k, py = (e.h / 2 - cy) / k;
  const ax = x + s * (px * Math.cos(a) + py * Math.sin(a)), ay = y + s * (-px * Math.sin(a) + py * Math.cos(a));
  return { x: cr.left - wr.left + (ax / (W / H) + 0.5) * cr.width, y: cr.top - wr.top + (0.5 - ay) * cr.height, k: cr.height * s / k };
}

let box: HTMLElement | null = null, drag: any = null;
export function updLineHandles(t: number) {
  const L = sel();
  const show = !R.seqPlay && isText(L) && R.gizmoOn && L.vis && R.tool !== 'orbit' && !(st.cam && st.cam.on);
  if (!box) { box = h('div', { class: 'lgrips' }); $('#wrap').appendChild(box); }
  if (!show) { box.hidden = true; return; }
  const e = textTex(L); if (!e || !e.layout) { box.hidden = true; return; }
  box.hidden = false;
  while (box.childElementCount < e.layout.length) {
    const g = h('div', { class: 'lgrip', 'data-h': 'line', role: 'slider', 'aria-label': 'Line handle', title: 'Drag: horizontally indent, vertically line spacing. Shift + vertical: the line size.' });
    g.addEventListener('pointerdown', down); box.appendChild(g);
  }
  [...box.children].forEach((g: any, i) => {
    const ln = e.layout[i]; if (!ln) { g.hidden = true; return; } g.hidden = false; g.dataset.i = String(i);
    const p = toScreen(L, e, ln.left - e.fsz * 0.12, ln.top + ln.h / 2, t);
    g.style.transform = `translate(${p.x}px,${p.y}px)`; g.style.height = Math.max(10, ln.h * p.k * 0.7) + 'px';
    g.classList.toggle('on', !!(L.text.lines && L.text.lines[i] && Object.keys(L.text.lines[i]).length));
  });
}
function down(ev0: PointerEvent) {
  const L = sel(); if (!isText(L)) return; ev0.stopPropagation(); ev0.preventDefault();
  const g = ev0.currentTarget as HTMLElement, i = +g.dataset.i!, q = lineObj(L, i), e = textCache.get(L.id);
  g.setPointerCapture(ev0.pointerId);
  drag = { L, i, x0: ev0.clientX, y0: ev0.clientY, dx: +q.dx || 0, gap: +q.gap || 0, size: +q.size || 1, k: toScreen(L, e, 0, 0, R.time).k, fsz: e.fsz };
  g.onpointermove = (m: PointerEvent) => {
    if (!drag) return; const q2 = lineObj(drag.L, drag.i), em = drag.k * drag.fsz, ddx = (m.clientX - drag.x0) / em, ddy = (m.clientY - drag.y0) / em;
    if (m.shiftKey) q2.size = Math.round(Math.min(6, Math.max(0.1, drag.size * Math.exp(-(m.clientY - drag.y0) * 0.006))) * 100) / 100;
    else { q2.dx = Math.round((drag.dx + ddx) * 100) / 100; if (drag.i > 0) q2.gap = Math.round((drag.gap + ddy) * 100) / 100; }
    markDirty();
  };
  const up = () => { if (!drag) return; tidyLines(drag.L.text); drag = null; g.onpointermove = null; commit(); import('./inspector').then(m => m.renderInsp()); };
  g.onpointerup = up; g.onpointercancel = up;
}

/** Inspector: one compact row group per line. */
export function linesSection(L: any) {
  if (!isText(L)) return null;
  const T = L.text, lines = textLines(T, null, 200);
  const done = () => { tidyLines(T); commit(); };
  const prop = (i: number, k: string, def: number) => ({ get v() { const q = T.lines && T.lines[i]; return q && q[k] != null ? +q[k] : def; }, set v(x: number) { lineObj(L, i)[k] = x; markDirty(); } });
  const rows = lines.map((s, i) => {
    const q = (T.lines && T.lines[i]) || {};
    const wsel = h('select', { 'aria-label': `Weight of line ${i + 1}` }, ...['', '300', '400', '500', '600', '700', '800', '900'].map(w => h('option', { value: w, selected: (q.weight || '') === w }, w || 'same as the text'))) as HTMLSelectElement;
    wsel.onchange = () => { lineObj(L, i).weight = wsel.value; done(); };
    return h('div', { class: 'lrow' }, h('div', { class: 'lhead' }, h('b', null, `${i + 1}.`), ' ', h('span', { class: 'small' }, s.length > 28 ? s.slice(0, 28) + '…' : s)),
      ctlSlider(prop(i, 'size', 1), { k: 'size', l: 'Size (×)', min: 0.2, max: 3 }, { noAnim: true, onInput: () => {} }),
      ctlSlider(prop(i, 'dx', 0), { k: 'dx', l: 'Indent (em)', min: -3, max: 3 }, { noAnim: true, onInput: () => {} }),
      i > 0 ? ctlSlider(prop(i, 'gap', 0), { k: 'gap', l: 'Space before (em)', min: -1, max: 2 }, { noAnim: true, onInput: () => {} }) : null,
      h('div', { class: 'row2' }, h('span', null, 'Weight'), h('div', { class: 'pop' }, wsel)),
      ctlSwitch('Italic', !!q.italic, (v: boolean) => { lineObj(L, i).italic = v; done(); }));
  });
  return section('Lines (size, indent and spacing per line)', 'lines', !!(T.lines && T.lines.length),
    h('p', { class: 'small' }, 'There is a handle at the start of every line on the canvas: horizontally indent, vertically spacing, with Shift size. The text stays editable meanwhile.'),
    ...rows, h('div', { class: 'btnrow' }, h('button', { class: 'btn', disabled: !T.lines, onclick: () => { delete T.lines; commit(); import('./inspector').then(m => m.renderInsp()); } }, 'Clear per-line settings')));
}

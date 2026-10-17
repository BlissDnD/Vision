/* U1 · Animálás mód + mozgáspálya.
 * Animálás (A): every animatable edit (slider, number field, canvas drag) writes a key at the playhead (see setVal in evaluation.ts).
 * Mozgáspálya: the selected layer's x/y keys drawn on the canvas as a path with one draggable dot per key time.
 * Dragging a dot moves that key's position (x and y keys are written together, so a dot always moves in 2D). */
import { R } from './runtime';
import { $ } from './dom';
import { BASEK, kindOf } from './effects/index';
import { cv } from './gl';
import { sel, st } from './state';
import { KEY_EPS, ev, hasK, keyIdx, keyVal, seekTo, setKey } from './evaluation';
import { camApply, outSize } from './render';
import { commit } from './history';
import { renderTimeline } from './timeline';
import { markDirty } from './loop';
import { toast } from './modals';
import { toAsp, wrap } from './stage';

export function setAnimMode(on: boolean) {
  R.animMode = on; $('#animBtn').setAttribute('aria-pressed', String(on)); wrap.classList.toggle('animon', on);
  if (on) toast('Animálás: amit most állítasz (vásznon húzás, csúszka, szám), kulcskocka lesz az aktuális időponton. Lépj máshová az idővonalon, és állítsd tovább. Kikapcsolás: A.');
}
$('#animBtn').onclick = () => setAnimMode(!R.animMode);

const NS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'mpath'); svg.setAttribute('aria-hidden', 'true');
const line = document.createElementNS(NS, 'path'); line.setAttribute('class', 'mp-line'); svg.appendChild(line);
const dots = document.createElementNS(NS, 'g'); svg.appendChild(dots);
wrap.insertBefore(svg, $('#gizmo'));

/** Times that carry a position key (x or y). */
export function pathTimes(L: any): number[] {
  const m: number[] = [];
  for (const k of ['x', 'y']) if (hasK(L.n[k])) for (const q of L.n[k].k) if (!m.some(t => Math.abs(t - q.t) < KEY_EPS)) m.push(q.t);
  return m.sort((a, b) => a - b);
}
/** Canvas-space position (asp units, after camera) of layer L at time t, plus the camera scale. */
export function pathPos(L: any, t: number) {
  let x = ev(L.n.x, BASEK.x, t), y = ev(L.n.y, BASEK.y, t), m = 1;
  if (st.cam.on && L.type !== 'group' && kindOf(L) !== 'fx') { const sv = R.CAMON; R.CAMON = true; const r = camApply(L, t, x, y, 1, 0); R.CAMON = sv; x = r[0]; y = r[1]; m = Math.max(.01, r[2]); }
  return { x, y, m };
}
let lastSig = '', pdrag: any = null;
export function updPath(t: number) {
  const L = sel();
  const show = !!L && L.vis && R.gizmoOn && R.tool !== 'orbit' && (hasK(L.n.x) || hasK(L.n.y)) && L.type !== 'surface3d';
  if (!show) { if (svg.style.display !== 'none') svg.style.display = 'none'; lastSig = ''; return; }
  svg.style.display = '';
  const cr = cv.getBoundingClientRect(), wr = wrap.getBoundingClientRect(); const { W, H } = outSize();
  const P = (x: number, y: number) => [cr.left - wr.left + (x / (W / H) + .5) * cr.width, cr.top - wr.top + (.5 - y) * cr.height];
  const ts = pathTimes(L); const a = ts[0], b = ts[ts.length - 1];
  // the drawn path only changes when keys, the canvas box or the camera change; the highlighted dot follows the playhead
  const sig = JSON.stringify([L.id, L.n.x.k, L.n.y.k, L.n.x.a, L.n.y.a, cr.left, cr.top, cr.width, cr.height, wr.left, wr.top, st.cam.on ? t : 0]);
  if (sig !== lastSig) {
    lastSig = sig; let d = '';
    const N = Math.max(24, Math.min(240, Math.round((b - a) * 60)));
    for (let i = 0; i <= N; i++) { const q = pathPos(L, a + (b - a) * i / N); const [px, py] = P(q.x, q.y); d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); }
    line.setAttribute('d', d);
    while (dots.childNodes.length > ts.length) dots.lastChild!.remove();
    while (dots.childNodes.length < ts.length) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '5.5'); c.setAttribute('class', 'mp-dot'); c.addEventListener('pointerdown', dotDown); dots.appendChild(c); }
    ts.forEach((kt, i) => { const q = pathPos(L, kt); const [px, py] = P(q.x, q.y); const c = dots.childNodes[i] as SVGCircleElement;
      c.setAttribute('cx', px.toFixed(1)); c.setAttribute('cy', py.toFixed(1)); c.dataset.t = String(kt);
      const tt = document.createElementNS(NS, 'title'); tt.textContent = `Pozíció-kulcs @ ${kt.toFixed(2)} mp · húzd az áthelyezéshez`; c.replaceChildren(tt); });
  }
  dots.childNodes.forEach((c: any) => c.classList.toggle('on', Math.abs(+c.dataset.t - t) < KEY_EPS));
}
function dotDown(e: PointerEvent) {
  const L = sel(); if (!L) return; e.stopPropagation(); e.preventDefault();
  const c = e.currentTarget as SVGCircleElement; const kt = +c.dataset.t!; try { c.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events */ } seekTo(kt);
  const x0 = hasK(L.n.x) ? keyVal(L.n.x.k, kt) : L.n.x.v, y0 = hasK(L.n.y) ? keyVal(L.n.y.k, kt) : L.n.y.v;
  pdrag = { L, kt, p0: toAsp(e), x0, y0, m: pathPos(L, kt).m, moved: false };
  c.onpointermove = (ev2: PointerEvent) => { if (!pdrag) return; const p = toAsp(ev2); pdrag.moved = true;
    setKey(L.n.x, kt, pdrag.x0 + (p.x - pdrag.p0.x) / pdrag.m); setKey(L.n.y, kt, pdrag.y0 + (p.y - pdrag.p0.y) / pdrag.m); markDirty(); };
  c.onpointerup = c.onpointercancel = () => { c.onpointermove = c.onpointerup = c.onpointercancel = null; const was = pdrag; pdrag = null;
    if (was && was.moved) { commit(); renderTimeline(); } };
}
/** For tests: is there a key at kt on both position params? */
export const pathKeyAt = (L: any, kt: number) => keyIdx(L.n.x, kt) >= 0 && keyIdx(L.n.y, kt) >= 0;

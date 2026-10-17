/* M6 · Gerincfelület on-canvas editing: one grip per spine point (projected through the layer's own 3D camera),
 * a thin polyline between them, and the "Gerinc" inspector section.
 * Grip drag moves the point in the plane facing the camera; Shift: in the horizontal plane (height stays).
 * Empty-canvas drag on this layer pans the camera target, wheel = camera distance (see stage.ts): the 2D
 * placement (x/y/s) has no meaning for a real 3D layer, so its gizmo and inspector section are hidden. */
import { R } from './runtime';
import { $, h } from './dom';
import { EFFECTS } from './effects/index';
import { cv } from './gl';
import { sel } from './state';
import { ev, setVal } from './evaluation';
import { outSize } from './render';
import { DEF_SPINE, camOf, meshFor } from './mesh3d';
import { section } from './controls';
import { commit } from './history';
import { markDirty } from './loop';

type V3 = [number, number, number];
export const isSurf = (L: any) => !!(L && L.type !== 'group' && EFFECTS[L.type] && EFFECTS[L.type].mesh);
const P = (L: any, k: string, t: number) => ev(L.p[k], EFFECTS[L.type].params.find((x: any) => x.k === k), t);
const asp = () => { const { W, H } = outSize(); return W / H; };
const xf = (m: number[], v: number[]) => [0, 1, 2, 3].map(r => m[r] * v[0] + m[4 + r] * v[1] + m[8 + r] * v[2] + m[12 + r] * v[3]);
export function spineOf(L: any): V3[] { if (!Array.isArray(L.spine) || L.spine.length < 3) L.spine = JSON.parse(JSON.stringify(DEF_SPINE)); return L.spine; }

/** World point → position relative to #wrap (null when behind the camera). */
export function projectPt(C: any, p: V3) {
  const q = xf(C.VP, [p[0], p[1], p[2], 1]); if (q[3] <= 0.01) return null;
  const cr = cv.getBoundingClientRect(), wr = $('#wrap').getBoundingClientRect();
  return { x: cr.left - wr.left + (q[0] / q[3] * 0.5 + 0.5) * cr.width, y: cr.top - wr.top + (0.5 - q[1] / q[3] * 0.5) * cr.height };
}
/** Mouse → world ray. */
export function rayAt(C: any, clientX: number, clientY: number) {
  const cr = cv.getBoundingClientRect(), nx = (clientX - cr.left) / cr.width * 2 - 1, ny = 1 - (clientY - cr.top) / cr.height * 2;
  const a = xf(C.inv, [nx, ny, -1, 1]), b = xf(C.inv, [nx, ny, 1, 1]);
  const o: V3 = [a[0] / a[3], a[1] / a[3], a[2] / a[3]], f: V3 = [b[0] / b[3], b[1] / b[3], b[2] / b[3]], d = [f[0] - o[0], f[1] - o[1], f[2] - o[2]], l = Math.hypot(d[0], d[1], d[2]) || 1;
  return { o, d: [d[0] / l, d[1] / l, d[2] / l] as V3 };
}
/** Camera right/up/forward unit vectors. */
export function camBasis(C: any) {
  const f = [C.c[0] - C.eye[0], C.c[1] - C.eye[1], C.c[2] - C.eye[2]], fl = Math.hypot(f[0], f[1], f[2]) || 1, F: V3 = [f[0] / fl, f[1] / fl, f[2] / fl];
  let r: V3 = [-F[2], 0, F[0]]; const rl = Math.hypot(r[0], r[2]) || 1; r = [r[0] / rl, 0, r[2] / rl];
  const u: V3 = [r[1] * F[2] - r[2] * F[1], r[2] * F[0] - r[0] * F[2], r[0] * F[1] - r[1] * F[0]];
  return { r, u, f: F };
}
/** Move spine point i so that it sits under the mouse; plane through its start position (normal: camera forward, or up with Shift). */
export function dragSpinePt(L: any, i: number, start: V3, clientX: number, clientY: number, flat: boolean, t = R.time) {
  const C = camOf(L, t, EFFECTS[L.type], asp()), arch = Math.max(0.05, P(L, 'arch', t)), w: V3 = [start[0], start[1] * arch, start[2]];
  const n = flat ? [0, 1, 0] : camBasis(C).f, ray = rayAt(C, clientX, clientY), dn = ray.d[0] * n[0] + ray.d[1] * n[1] + ray.d[2] * n[2];
  if (Math.abs(dn) < 1e-4) return;
  const k = ((w[0] - ray.o[0]) * n[0] + (w[1] - ray.o[1]) * n[1] + (w[2] - ray.o[2]) * n[2]) / dn; if (k <= 0) return;
  const q = [ray.o[0] + ray.d[0] * k, ray.o[1] + ray.d[1] * k, ray.o[2] + ray.d[2] * k], rd = (v: number) => Math.round(v * 100) / 100;
  spineOf(L)[i] = [rd(q[0]), rd(flat ? start[1] : q[1] / arch), rd(q[2])]; markDirty();
}

let box: HTMLElement | null = null, line: SVGPolylineElement | null = null, drag: any = null;
R.spSel = 0;
export function updSpineGrips(t: number) {
  const L = sel(), show = isSurf(L) && R.gizmoOn && L.vis && R.tool !== 'orbit';
  if (!box) {
    box = h('div', { class: 'sgrips' }); const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); svg.appendChild(line); box.appendChild(svg); $('#wrap').appendChild(box);
  }
  if (!show) { box.hidden = true; return; }
  box.hidden = false;
  const S = spineOf(L), C = camOf(L, t, EFFECTS[L.type], asp()), arch = P(L, 'arch', t);
  while (box.childElementCount - 1 < S.length) {
    const g = h('button', { class: 'sgrip', type: 'button', 'data-h': 'spine', 'aria-label': 'Gerincpont', title: 'Húzd: a pont mozgatása a kamerával szemközti síkban. Shift: vízszintesen (a magasság marad).' });
    g.addEventListener('pointerdown', down); box.appendChild(g);
  }
  const pts: string[] = [];
  [...box.children].slice(1).forEach((g: any, i) => {
    const p = S[i] && projectPt(C, [S[i][0], S[i][1] * arch, S[i][2]]); if (!p) { g.hidden = true; return; }
    g.hidden = false; g.dataset.i = String(i); g.style.transform = `translate(${p.x}px,${p.y}px)`; g.classList.toggle('on', i === R.spSel); pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1));
  });
  line!.setAttribute('points', pts.join(' '));
}
function down(e0: PointerEvent) {
  const L = sel(); if (!isSurf(L)) return; e0.stopPropagation(); e0.preventDefault();
  const g = e0.currentTarget as HTMLElement, i = +g.dataset.i!; g.setPointerCapture(e0.pointerId);
  R.spSel = i; drag = { L, i, start: [...spineOf(L)[i]] as V3, moved: false };
  g.onpointermove = (m: PointerEvent) => { if (!drag) return; drag.moved = true; dragSpinePt(drag.L, drag.i, drag.start, m.clientX, m.clientY, m.shiftKey); };
  const up = () => { if (!drag) return; const mv = drag.moved; drag = null; g.onpointermove = null; if (mv) commit(); import('./inspector').then(m => m.renderInsp()); };
  g.onpointerup = up; g.onpointercancel = up;
}

/** Ray → nearest surface hit (CPU, on the cached geometry): point + interpolated normal facing the ray. */
export function hitSurface(L: any, ray: { o: V3, d: V3 }, t = R.time) {
  const M = meshFor(L, t, EFFECTS[L.type]), V = M.V, I = M.idx, o = ray.o, d = ray.d; let best = 1e9, bi = -1, bu = 0, bv = 0;
  for (let k = 0; k < I.length; k += 3) {
    const a = I[k] * 10, b = I[k + 1] * 10, c = I[k + 2] * 10;
    const e1x = V[b] - V[a], e1y = V[b + 1] - V[a + 1], e1z = V[b + 2] - V[a + 2], e2x = V[c] - V[a], e2y = V[c + 1] - V[a + 1], e2z = V[c + 2] - V[a + 2];
    const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x, det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-9) continue; const inv = 1 / det, tx = o[0] - V[a], ty = o[1] - V[a + 1], tz = o[2] - V[a + 2], u = (tx * px + ty * py + tz * pz) * inv; if (u < 0 || u > 1) continue;
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x, v = (d[0] * qx + d[1] * qy + d[2] * qz) * inv; if (v < 0 || u + v > 1) continue;
    const s = (e2x * qx + e2y * qy + e2z * qz) * inv; if (s > 1e-4 && s < best) { best = s; bi = k; bu = u; bv = v; }
  }
  if (bi < 0) return null;
  const w = [1 - bu - bv, bu, bv], n: V3 = [0, 0, 0]; for (let j = 0; j < 3; j++) { const q = I[bi + j] * 10; n[0] += V[q + 3] * w[j]; n[1] += V[q + 4] * w[j]; n[2] += V[q + 5] * w[j]; }
  const nl = Math.hypot(n[0], n[1], n[2]) || 1, sg = (n[0] * d[0] + n[1] * d[1] + n[2] * d[2]) > 0 ? -1 / nl : 1 / nl;
  return { p: [o[0] + d[0] * best, o[1] + d[1] * best, o[2] + d[2] * best] as V3, n: [n[0] * sg, n[1] * sg, n[2] * sg] as V3 };
}
/** Glint drag: put a ceiling light strip where the mirror direction of the clicked surface point meets the ceiling,
 * so the highlight appears under the mouse. Keeps the strip nearest to the current setting (3 strips, 2.6 apart). */
export function glintDrag(L: any, clientX: number, clientY: number, t = R.time) {
  const C = camOf(L, t, EFFECTS[L.type], asp()), ray = rayAt(C, clientX, clientY), hit = hitSurface(L, ray, t); if (!hit) return false;
  const d = ray.d, n = hit.n, k = 2 * (d[0] * n[0] + d[1] * n[1] + d[2] * n[2]), rf = [d[0] - k * n[0], d[1] - k * n[1], d[2] - k * n[2]];
  if (rf[1] < 0.03) return false;                       // the point looks down / sideways: no ceiling strip can light it
  const hx = hit.p[0] + rf[0] * (7.8 - hit.p[1]) / rf[1], cur = P(L, 'stripPos', t), def = EFFECTS[L.type].params.find((x: any) => x.k === 'stripPos');
  const opts = [-1, 0, 1].map(i => hx - i * 2.6).filter(v => v >= def.min && v <= def.max); if (!opts.length) return false;
  const v = opts.reduce((a, b) => (Math.abs(b - cur) < Math.abs(a - cur) ? b : a)); setVal(L.p.stripPos, Math.round(v * 100) / 100); markDirty(); return true;
}
R.glint = false;

/** Empty-canvas drag on the surface layer: pan the camera target in the view plane. */
export function panStart(L: any) { return { tx: P(L, 'tx', R.time), ty: P(L, 'ty', R.time), tz: P(L, 'tz', R.time) }; }
export function panDrag(L: any, s0: any, dx: number, dy: number) {   // dx/dy in canvas-height units (toAsp)
  const C = camOf(L, R.time, EFFECTS[L.type], asp()), B = camBasis(C), k = 2 * C.dist * Math.tan(C.fov * Math.PI / 360);
  const lim = (key: string, v: number) => { const d = EFFECTS[L.type].params.find((x: any) => x.k === key); return Math.min(d.max, Math.max(d.min, v)); };
  setVal(L.p.tx, lim('tx', s0.tx - (B.r[0] * dx + B.u[0] * dy) * k)); setVal(L.p.ty, lim('ty', s0.ty - (B.r[1] * dx + B.u[1] * dy) * k)); setVal(L.p.tz, lim('tz', s0.tz - (B.r[2] * dx + B.u[2] * dy) * k));
}
export function wheelDist(L: any, dy: number) { const d = EFFECTS[L.type].params.find((x: any) => x.k === 'dist'); setVal(L.p.dist, Math.min(d.max, Math.max(d.min, P(L, 'dist', R.time) * Math.exp(dy * 0.0012)))); }

/** Inspector: the spine itself (replaces "Elhelyezés" for mesh layers). */
export function spineSection(L: any) {
  const S = spineOf(L), i = Math.min(R.spSel, S.length - 1);
  const redo = () => { commit(); markDirty(); import('./inspector').then(m => m.renderInsp()); };
  const add = () => { const a = S[i], b = S[i + 1] || S[i - 1], m = a.map((v: number, k: number) => Math.round((v + b[k]) / 2 * 100) / 100) as V3;
    const at = S[i + 1] ? i + 1 : i; S.splice(at, 0, m); R.spSel = at; redo(); };
  const del = () => { if (S.length <= 3) return; S.splice(i, 1); R.spSel = Math.max(0, i - 1); redo(); };
  const reset = () => { L.spine = JSON.parse(JSON.stringify(DEF_SPINE)); R.spSel = 0; redo(); };
  return section('Gerinc (a forma vonala)', 'spine', true,
    h('p', { class: 'small' }, `${S.length} pont. A vásznon húzd a kék pontokat (Shift: vízszintesen). Üres helyen húzva a kamera célpontja mozog, görgővel a távolsága változik; körbejárás: 3D forgatás eszköz (O).`),
    h('p', { class: 'small' }, `Kijelölt: ${i + 1}. pont (${S[i].map((v: number) => v.toFixed(2).replace('.', ',')).join('; ')})`),
    h('div', { class: 'btnrow' },
      h('button', { class: 'btn', onclick: add }, 'Új pont utána'),
      h('button', { class: 'btn', disabled: S.length <= 3, onclick: del }, 'Pont törlése'),
      h('button', { class: 'btn', onclick: reset }, 'Alapgerinc')),
    h('div', { class: 'btnrow' }, h('button', { class: 'btn' + (R.glint ? ' accent' : ''), 'aria-pressed': String(!!R.glint), title: 'Bekapcsolva a felületen húzva a mennyezeti fénycsík oda kerül, hogy a csillanás az egér alatt legyen.',
      onclick: () => { R.glint = !R.glint; import('./inspector').then(m => m.renderInsp()); } }, R.glint ? 'Csillanás húzása: be' : 'Csillanás húzása a vásznon')));
}

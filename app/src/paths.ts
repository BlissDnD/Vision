/* P2 · Közös útvonal: one editable curve model for every use (Útvonal layer, Mozgás „Útvonalon”, emitter shape,
 * later camera / text). Points live on the pathshape layer (L.pts, local units, same frame as its placement);
 * the curve is a uniform Catmull-Rom through them (docs/spec/vel-utvonal-mag-prototipus.mjs), sampled by arc length.
 * World = placement offset + clockwise rotation(r) · (p · s), the same convention as the layer shaders (glsl.ts toUV). */
import { R } from './runtime';
import { BASEK, kindOf } from './effects/index';
import { st, walk } from './state';
import { ev } from './evaluation';
import { behav, camApply } from './render';

export type Pt = [number, number];
export const DEF_PATH: Pt[] = [[-.55, -.12], [-.2, .16], [.18, -.14], [.55, .1]];
export function ptsOf(L: any): Pt[] { if (!Array.isArray(L.pts) || L.pts.length < 2) L.pts = DEF_PATH.map(p => [...p]); return L.pts; }
export const isPath = (L: any) => !!L && L.type === 'pathshape';

/** Layer placement at t, as render.setXform computes it: [x, y, scale, rotation°]. */
export function placeAt(L: any, t: number) {
  const n = L.n, B = behav(L, t); let ox = ev(n.x, BASEK.x, t), oy = ev(n.y, BASEK.y, t), sc = Math.max(.01, ev(n.s, BASEK.s, t));
  if (B) { ox += B.dx; oy += B.dy; sc *= Math.max(.001, B.sc); }
  let rot = ev(n.r, BASEK.r, t) + n.spin.v * t + (B && B.rot || 0);
  if (R.CAMON && kindOf(L) !== 'fx') [ox, oy, sc, rot] = camApply(L, t, ox, oy, sc, rot);
  return [ox, oy, sc, rot];
}
/** Local → world with a placement [x, y, s, r°]. */
export function toWorld(P: number[], p: Pt): Pt { const a = P[3] * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), x = p[0] * P[2], y = p[1] * P[2]; return [P[0] + c * x + s * y, P[1] - s * x + c * y]; }
/** World → local (inverse of toWorld). */
export function toLocal(P: number[], q: Pt): Pt { const a = P[3] * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), x = q[0] - P[0], y = q[1] - P[1]; return [(c * x - s * y) / P[2], (s * x + c * y) / P[2]]; }

const cr = (a: number, b: number, c: number, d: number, t: number) => { const t2 = t * t, t3 = t2 * t; return .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); };
/** Dense polyline through the control points (smooth = Catmull-Rom, else straight segments). Closed: last = first. */
export function curve(pts: Pt[], closed: boolean, smooth = true, res = 20): Pt[] {
  const n = pts.length; if (n < 2) return pts.map(p => [...p] as Pt);
  const at = (i: number) => closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  const segs = closed ? n : n - 1, out: Pt[] = [];
  for (let i = 0; i < segs; i++) {
    const a = at(i - 1), b = at(i), c = at(i + 1), d = at(i + 2), R0 = smooth ? res : 1;
    for (let k = 0; k < R0; k++) { const t = k / R0; out.push(smooth ? [cr(a[0], b[0], c[0], d[0], t), cr(a[1], b[1], c[1], d[1], t)] : [b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t]); }
  }
  out.push(closed ? [...out[0]] as Pt : [...pts[n - 1]] as Pt); return out;
}
/** Cumulative arc length of a polyline. */
export function arc(poly: Pt[]) { const cum = [0]; for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1])); return { cum, len: cum[cum.length - 1] }; }
/** Point + tangent angle (rad, counter-clockwise from +x) at arc fraction u (0…1). */
export function sampleArc(poly: Pt[], A: { cum: number[], len: number }, u: number) {
  const L = Math.max(0, Math.min(1, u)) * A.len, c = A.cum; let lo = 0, hi = c.length - 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (c[m] < L) lo = m + 1; else hi = m; }
  const j = Math.max(1, lo), a = poly[j - 1], b = poly[j], f = c[j] > c[j - 1] ? (L - c[j - 1]) / (c[j] - c[j - 1]) : 0;
  return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
}
/** n points evenly spaced by arc length. */
export function resample(poly: Pt[], n: number): Pt[] { const A = arc(poly); return Array.from({ length: n }, (_, i) => { const q = sampleArc(poly, A, n > 1 ? i / (n - 1) : 0); return [q.x, q.y] as Pt; }); }
/** Ramer–Douglas–Peucker: the drawn stroke → few control points (the curve passes through them). */
export function simplify(raw: Pt[], eps: number): Pt[] {
  if (raw.length < 3) return raw.map(p => [...p] as Pt);
  const keep = new Uint8Array(raw.length); keep[0] = keep[raw.length - 1] = 1; const st0: [number, number][] = [[0, raw.length - 1]];
  while (st0.length) { const [a, b] = st0.pop()!; const A = raw[a], B = raw[b], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1e-9; let md = -1, mi = -1;
    for (let i = a + 1; i < b; i++) { const d = Math.abs((raw[i][0] - A[0]) * dy - (raw[i][1] - A[1]) * dx) / l; if (d > md) { md = d; mi = i; } }
    if (md > eps) { keep[mi] = 1; st0.push([a, mi], [mi, b]); } }
  return raw.filter((_, i) => keep[i]).map(p => [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000] as Pt);
}
const pv = (L: any, k: string) => L.p && L.p[k] ? Math.round(L.p[k].v) : 0;
export const closedOf = (L: any) => pv(L, 'closed') === 1;
export const smoothOf = (L: any) => pv(L, 'smooth') === 0;
/** World polyline of a path layer at t (dense, before any visual wave), with its arc table. depth guards a path that moves along itself. */
let depth = 0;
export function pathWorld(L: any, t: number) {
  if (depth > 2) return null; depth++;
  try { const P = placeAt(L, t), loc = curve(ptsOf(L), closedOf(L), smoothOf(L)), poly = loc.map(p => toWorld(P, p)); return { poly, A: arc(poly), P }; }
  finally { depth--; }
}
export function pathLayers(): any[] { const out: any[] = []; walk(st.layers, (it: any) => { if (isPath(it)) out.push(it); }); return out; }
export function findPath(id: string) { return pathLayers().find(x => x.id === id) || null; }
/** Shared lookup for other modules (motion.ts reaches it through R to keep the import order). */
export function pathAt(id: string, t: number, u: number) { const L = findPath(id); if (!L) return null; const W = pathWorld(L, t); if (!W || W.A.len <= 1e-9) return null; return sampleArc(W.poly, W.A, u); }
R.pathAt = pathAt;
/** Insert a control point on the segment (of the control polygon) nearest to the local point q; returns its index. */
export function insertPt(L: any, q: Pt) {
  const P = ptsOf(L), n = P.length, closed = closedOf(L); let best = 1e9, bi = n;
  for (let i = 0; i < (closed ? n : n - 1); i++) { const a = P[i], b = P[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1e-9;
    const f = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l2)), d = Math.hypot(a[0] + dx * f - q[0], a[1] + dy * f - q[1]); if (d < best) { best = d; bi = i + 1; } }
  P.splice(bi, 0, [Math.round(q[0] * 1000) / 1000, Math.round(q[1] * 1000) / 1000]); return bi;
}

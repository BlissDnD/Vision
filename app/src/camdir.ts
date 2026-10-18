/* K3 · Kamera-rendezés: where the 2.5D camera looks, from scene time only (seek = export = live).
 * st.cam.mode 0 = Kézi (keys), 1 = Célpontok (st.cam.shots [{t,id}]: from t on the camera centres that layer; a change
 * glides over „Célváltás ideje”; „Követés késése” = weighted mean of the target's past positions, so following stays a
 * pure function of t), 2 = Útvonalon (st.cam.path, a P2 Útvonal layer). The keyed X/Y act as an offset in modes 1–2.
 * Kézikamera: smooth deterministic shake in every mode. focusT: the DOF plane follows the target's depth. */
import { R } from './runtime';
import { BASEK } from './effects/index';
import { st, findItem } from './state';
import { ev } from './evaluation';
import { CAMK } from './render';
import { placeAt, pathAt } from './paths';

const E = (k: string, t: number) => ev(st.cam.n[k], CAMK[k], t);
const ez = (x: number) => { x = Math.max(0, Math.min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
const h1 = (n: number) => { const x = Math.sin(n) * 43758.5453; return x - Math.floor(x); };
const nz = (x: number, s: number) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return (h1(i * 12.9898 + s) * (1 - u) + h1((i + 1) * 12.9898 + s) * u) * 2 - 1; };
/** Raw placement of a layer (without the camera itself), its depth. */
function rawPos(id: string, t: number) {
  const r = findItem(id); if (!r) return null; const sv = R.CAMON; R.CAMON = false;
  try { const P = placeAt(r.it, t); return { x: P[0], y: P[1], z: ev(r.it.n.z, BASEK.z, t) }; } finally { R.CAMON = sv; }
}
/** Target position followed with a lag (8 past samples, linearly weighted). */
function follow(id: string, t: number, lag: number) {
  if (lag < .01) return rawPos(id, t);
  let sx = 0, sy = 0, sz = 0, sw = 0; for (let i = 0; i < 8; i++) { const q = rawPos(id, t - lag * i / 7); if (!q) return null; const w = 8 - i; sx += q.x * w; sy += q.y * w; sz += q.z * w; sw += w; }
  return { x: sx / sw, y: sy / sw, z: sz / sw };
}
/** Active shot index at t (−1 = before the first: the first one holds). */
export function shotAt(t: number) { const S = st.cam.shots || []; let k = -1; for (let i = 0; i < S.length; i++) if (S[i].t <= t + 1e-9) k = i; return k; }
/** Offset of the camera centre (dx, dy), roll, focus plane (null = the slider) at t. Cached per t. */
let memo: { t: number, key: string, v: any } | null = null;
export function camDir(t: number) {
  const C = st.cam, key = (R.camFrame || 0) + JSON.stringify([C.mode, C.shots, C.path, C.ploop, C.focusT]);
  if (memo && memo.t === t && memo.key === key) return memo.v;
  const v = { dx: 0, dy: 0, droll: 0, focus: null as number | null };
  if (C.mode === 1 && C.shots && C.shots.length) {
    const S = C.shots, k = Math.max(0, shotAt(t)), lag = E('lag', t), cur = follow(S[k].id, t, lag);
    let p = cur;
    if (cur && k > 0) { const tr = Math.max(.05, E('trans', t)), x = (t - S[k].t) / tr; if (x < 1) { const prev = follow(S[k - 1].id, t, lag); if (prev) { const e = ez(x); p = { x: prev.x + (cur.x - prev.x) * e, y: prev.y + (cur.y - prev.y) * e, z: prev.z + (cur.z - prev.z) * e }; } } }
    if (p) { v.dx = p.x; v.dy = p.y; if (C.focusT) v.focus = p.z; }
  } else if (C.mode === 2 && C.path) {
    let u = t / Math.max(.05, E('pper', t)); const lp = C.ploop || 0;
    u = lp === 0 ? u - Math.floor(u) : lp === 1 ? (() => { const w = u - 2 * Math.floor(u / 2); return w < 1 ? w : 2 - w; })() : Math.max(0, Math.min(1, u));
    const q = pathAt(C.path, t, u); if (q) { v.dx = q.x; v.dy = q.y; }
  }
  const sh = E('shake', t); if (sh > 0) { const f = t * 1.7; v.dx += (nz(f, 1.3) * .7 + nz(f * 2.3, 7.1) * .3) * .03 * sh; v.dy += (nz(f, 4.7) * .7 + nz(f * 2.1, 9.9) * .3) * .03 * sh; v.droll += nz(f * .8, 3.3) * 1.5 * sh; }
  memo = { t, key, v }; return v;
}
R.camDir = camDir;

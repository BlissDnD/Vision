/* M7b · Felhő + Lufi: blob layout of the shared shape (deterministic from Alak + Változat), the uniforms of the cloud
 * shader (scene light + the Lufi appearance found in the layer's own chain) and the target check for "host" appearances
 * (an appearance that reshapes its source instead of filtering pixels: it only works on the listed layer types). */
import { BASEK, EFFECTS } from './effects/index';
import { U, gl } from './gl';
import { ev } from './evaluation';
import { hexRGB } from './palettes';
import { lightU } from './render';

const rng = (seed: number) => { let s = (Math.floor(seed) * 2654435761 + 1013904223) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

/** Blobs [x,y,z,r] for shape 0 Gomoly (cumulus), 1 Lapos (flat), 2 Tornyos (towering), centred on the origin. */
export function cloudBlobs(shape: number, seed: number): number[][] {
  const r = rng(seed + shape * 101), j = (a: number) => (r() - 0.5) * a, B: number[][] = [];
  if (shape === 1) { for (let i = 0; i < 8; i++) B.push([-1.0 + i * 0.29 + j(0.1), j(0.08) - (i % 2) * 0.04, j(0.45), 0.2 + r() * 0.1]); }
  else if (shape === 2) {
    for (let i = 0; i < 3; i++) B.push([-0.45 + i * 0.45 + j(0.1), -0.55 + j(0.06), j(0.3), 0.3 + r() * 0.08]);
    for (let i = 0; i < 4; i++) B.push([j(0.35), -0.2 + i * 0.27 + j(0.05), j(0.25), 0.3 - i * 0.025 + r() * 0.06]);
    B.push([0.18 + j(0.1), 0.62, j(0.2), 0.24]);
  } else {
    for (let i = 0; i < 4; i++) B.push([-0.72 + i * 0.48 + j(0.1), -0.22 + j(0.05), j(0.35), 0.27 + r() * 0.08]);
    for (let i = 0; i < 3; i++) B.push([-0.42 + i * 0.42 + j(0.16), 0.07 + j(0.08), j(0.3), 0.33 + r() * 0.1]);
    B.push([j(0.3), 0.33 + j(0.05), j(0.15), 0.26 + r() * 0.06]);
  }
  let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (const b of B) for (let a = 0; a < 3; a++) { lo[a] = Math.min(lo[a], b[a] - b[3]); hi[a] = Math.max(hi[a], b[a] + b[3]); }
  const c = lo.map((x, a) => (x + hi[a]) / 2), k = Math.min(1, 1.6 / Math.max(hi[0] - lo[0], hi[1] - lo[1]) * (shape === 1 ? 1.25 : 1));   // fits the frame at scale 1
  return B.map(b => [(b[0] - c[0]) * k, (b[1] - c[1]) * k, (b[2] - c[2]) * k, b[3] * k]);
}
/** The visible Lufi appearance on a layer (or null). */
export { fxFits, fxHostNote } from './effects/index';
export const balloonOf = (L: any) => (L.fx || []).find((f: any) => f.type === 'balloon' && f.vis) || null;
const cache = new Map<string, { A: Float32Array, n: number, R: number }>();
const PV = (F: any, k: string, t: number) => { const d = EFFECTS[F.type].params.find((x: any) => x.k === k); const v = F.p[k]; return d.type === 'color' ? hexRGB(v ? v.v : d.def) : v ? (d.type === 'sel' ? v.v : ev(v, d, t)) : d.def; };

/** Lufi values at t: inflation (× the appearance's Erősség), colour, gloss, glint. */
export function balloonVals(L: any, t: number) {
  const F = balloonOf(L); if (!F) return { infl: 0, col: [1, 1, 1], gloss: 0, shine: 0 };
  const o = Math.min(1, Math.max(0, ev(F.n.opacity, BASEK.opacity, t)));
  return { infl: Math.min(1, Math.max(0, PV(F, 'infl', t) * o)), col: PV(F, 'color', t), gloss: PV(F, 'gloss', t), shine: PV(F, 'shine', t) };
}
EFFECTS.cloud3d.setU = (p: any, L: any, t: number) => {
  lightU(p, L, t);
  const sh = Math.round(L.p.shape.v), sd = Math.round(L.p.seed.v), key = sh + ':' + sd;
  let C = cache.get(key);
  if (!C) { const B = cloudBlobs(sh, sd).slice(0, 10), A = new Float32Array(40); B.forEach((b, i) => A.set(b, i * 4)); C = { A, n: B.length, R: Math.max(...B.map(b => Math.hypot(b[0], b[1], b[2]) + b[3])) }; cache.set(key, C); }
  const wind = Math.abs(ev(L.p.wind, EFFECTS.cloud3d.params.find((d: any) => d.k === 'wind')!, t));
  gl.uniform4fv(U(p, 'uBl'), C.A); gl.uniform1f(U(p, 'uBn'), C.n); gl.uniform4f(U(p, 'uBnd'), 0, 0, 0, C.R * 1.12 + 0.18 + wind * 0.3);
  const b = balloonVals(L, t);
  gl.uniform1f(U(p, 'uBI'), b.infl); gl.uniform3f(U(p, 'uBC'), b.col[0], b.col[1], b.col[2]); gl.uniform1f(U(p, 'uBG'), b.gloss); gl.uniform1f(U(p, 'uBS'), b.shine);
};

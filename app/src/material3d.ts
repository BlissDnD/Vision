/* MAT1 · 3D material interface (JS side): finds the host material appearance on a 3D layer (Rajzolt toll / Hologram)
 * and sets the shared uM* uniforms of effects/mat3d.ts. Used by render.ts (obj3d, sdfscene) and mesh3d.ts (surface3d). */
import { BASEK, EFFECTS } from './effects/index';
import { gl } from './gl';
import { ev } from './evaluation';
import { hexRGB } from './palettes';

export const MAT_TYPES: Record<string, number> = { inksketch: 1, hologram: 2 };
/** The active material appearance on L (the last visible one wins) or null. */
export const matOf = (L: any) => { let F = null; for (const f of L.fx || []) if (f.vis && MAT_TYPES[f.type]) F = f; return F as any; };
const PV = (F: any, k: string, t: number) => { const d = EFFECTS[F.type].params.find((x: any) => x.k === k); const v = F.p[k];
  return d.type === 'color' ? hexRGB(v ? v.v : d.def) : v ? (d.type === 'sel' ? v.v : ev(v, d, t)) : d.def; };
/** Material values at t: type, strength (the appearance's Erősség), two vec4 parameter packs, two colours. */
export function matVals(L: any, t: number) {
  const F = matOf(L); if (!F) return null;
  const s = Math.min(1, Math.max(0, ev(F.n.opacity, BASEK.opacity, t))), P = (k: string) => PV(F, k, t);
  if (F.type === 'inksketch') return { mt: 1, s, a: [P('density'), P('width'), P('press'), P('boil')], b: [P('contour'), P('paperbg'), P('orig'), P('angle') * Math.PI / 180], c1: P('ink'), c2: P('paper') };
  return { mt: 2, s, a: [P('alpha'), P('rim'), P('lines'), P('scan')], b: [P('flick'), P('glitch'), P('band'), 0], c1: P('color'), c2: [0, 0, 0] };
}
/** Set the material uniforms on program p. Uf: uniform-location getter; sc: host scale (world units → hatch units); lin: linearise colours. */
export function matU(p: any, L: any, t: number, Uf: (p: any, n: string) => any, sc = 1, lin = false) {
  const m = matVals(L, t);
  gl.uniform1f(Uf(p, 'uMt'), m && m.s > 0 ? m.mt : 0); gl.uniform1f(Uf(p, 'uMsc'), sc); if (!m) return null;
  const C = (c: number[]) => lin ? c.map(x => Math.pow(x, 2.2)) : c, c1 = C(m.c1), c2 = C(m.c2);
  gl.uniform1f(Uf(p, 'uMs'), m.s); gl.uniform4f(Uf(p, 'uMa'), m.a[0], m.a[1], m.a[2], m.a[3]); gl.uniform4f(Uf(p, 'uMb'), m.b[0], m.b[1], m.b[2], m.b[3]);
  gl.uniform3f(Uf(p, 'uMc1'), c1[0], c1[1], c1[2]); gl.uniform3f(Uf(p, 'uMc2'), c2[0], c2[1], c2[2]); return m;
}

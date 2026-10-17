/* M7 · Részecske Megjelenés ("pdisp"): a layer effect that turns its input (text, shape, image) into points,
 * scatters them on an event and reassembles. Events: manual slider, Jelzések (st.cues) or a fixed repeat.
 * Everything is a pure function of time, so seek / export / reopen give the same frame.
 * Optional F.alts: new texts; the text layer switches at each scatter peak (k-th event → alts cycle), so
 * "breaks apart on the beat, comes back as the next word" works while the text stays live and editable. */
import { EFFECTS } from './effects/index';
import { st } from './state';
import { ev } from './evaluation';

const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / ((b - a) || 1e-6))); return t * t * (3 - 2 * t); };
const P = (F: any, k: string, t: number) => { const d = EFFECTS.pdisp.params.find((x: any) => x.k === k); return F.p[k] ? (d.type === 'sel' ? F.p[k].v : ev(F.p[k], d, t)) : d.def; };

/** Event times up to t (sorted). */
export function pdEvents(F: any, t: number): number[] {
  const trig = Math.round(P(F, 'trig', t));
  if (trig === 1) return (st.cues || []).map((c: any) => c.t).filter((x: number) => x <= t).sort((a: number, b: number) => a - b);
  if (trig === 2) { const e = Math.max(0.3, P(F, 'every', t)), out: number[] = []; for (let x = 1; x <= t && out.length < 10000; x += e) out.push(x); return out; }
  return [];
}
/** Scatter amount 0…1 at t. */
export function pdEnv(F: any, t: number) {
  if (Math.round(P(F, 'trig', t)) === 0) return P(F, 'amount', t);
  const ev0 = pdEvents(F, t); if (!ev0.length) return 0;
  const u = t - ev0[ev0.length - 1], o = P(F, 'out', t), hd = P(F, 'hold', t), bk = P(F, 'back', t);
  return sm(0, o, u) * (1 - sm(o + hd, o + hd + bk, u));
}
/** Values for every uniform of the shared particle shader. */
export function pdUniforms(F: any, t: number) {
  const o: Record<string, number> = {};
  for (const d of EFFECTS.particles.params) o[d.k] = d.def;
  for (const k of ['density', 'size', 'depth', 'swirl', 'wave', 'jitter', 'speed', 'color', 'bright', 'pblend']) o[k] = P(F, k, t);
  Object.assign(o, { source: 0, thresh: 0.02, tilt: 0, turn: 0, spin: 0, hidesrc: 1 });
  const e = pdEnv(F, t); o.explode = e * P(F, 'spread', t); o.swirl += e * P(F, 'turb', t); return o;
}
/** Text actually shown by a text layer at t (alternatives switch at each scatter peak), or null = its own text. */
export function altText(L: any, t: number): string | null {
  const F = (L.fx || []).find((f: any) => f.type === 'pdisp' && f.vis && Array.isArray(f.alts) && f.alts.some((s: string) => s.trim()));
  if (!F || Math.round(P(F, 'trig', t)) === 0) return null;
  const o = P(F, 'out', t), k = pdEvents(F, t).filter(x => x + o <= t).length; if (!k) return null;
  const list = [L.text.str, ...F.alts.filter((s: string) => s.trim())]; return list[k % list.length];
}
/** Original ↔ points crossfade: 0 = crisp input, 1 = points only. */
export function pdMix(F: any, t: number) { const e = pdEnv(F, t); return sm(0, 0.18, e); }

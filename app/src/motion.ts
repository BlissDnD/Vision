/** Mozgás v1: draggable motions on a layer (L.mo = [{id, t, on, p:{key: NParam}}]). Every motion is a pure function of
 *  scene time (seek = export = live), added on top of placement in render.setXform / opacity. Continuous ones (Lebegés,
 *  Forgás, Lüktetés, Keringés, Remegés) are periodic and run on their own, independent of the project Loop; the timed
 *  Rugalmas beúszás uses Anime.js easing (spring / outBack) through this adapter — the Vel clock stays the only clock. */
import { spring, eases } from 'animejs';
import { S, SEL } from './effects/helpers';
import { mkN, uid } from './state';
import { ev } from './evaluation';
import { R } from './runtime';

const TAU = Math.PI * 2;
export interface MoDef { name: string; icon: string; cont: boolean; params: any[]; main: string[]; desc: string }
export const MO: Record<string, MoDef> = {
  float: { name: 'Lebegés', cont: true, main: ['amp', 'period'], desc: 'Lassú, puha fel-le (vagy tetszőleges irányú) ringás.',
    icon: '<path d="M4 14c2.5-4 5.5-4 8 0s5.5 4 8 0"/><path d="M12 4v4M10 6l2-2 2 2"/>',
    params: [S('amp', 'Kitérés', 0, .5, .04), S('period', 'Ütem (mp / kör)', .3, 12, 3), S('ang', 'Irány °', -180, 180, 90), S('phase', 'Fáziseltolás', 0, 1, 0)] },
  spin: { name: 'Forgás', cont: true, main: ['speed'], desc: 'Folyamatos forgás a réteg középpontja körül.',
    icon: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4h-4"/>',
    params: [S('speed', 'Sebesség °/mp', -360, 360, 45)] },
  pulse: { name: 'Lüktetés', cont: true, main: ['amp', 'period'], desc: 'Ritmikus nagyobbodás és kisebbedés.',
    icon: '<circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8" stroke-dasharray="2.5 2.5"/>',
    params: [S('amp', 'Erő', 0, 1, .08), S('period', 'Ütem (mp / kör)', .2, 8, 1.2), S('phase', 'Fáziseltolás', 0, 1, 0)] },
  orbit: { name: 'Keringés', cont: true, main: ['radius', 'period'], desc: 'Körpályán kering a saját helye körül.',
    icon: '<circle cx="12" cy="12" r="7"/><circle cx="19" cy="12" r="2" fill="currentColor"/>',
    params: [S('radius', 'Sugár', 0, .6, .08), S('period', 'Kör ideje (mp)', .3, 20, 4), SEL('dir', 'Irány', ['Óramutatóval', 'Ellentétesen'], 1), S('phase', 'Fáziseltolás', 0, 1, 0)] },
  shake: { name: 'Remegés', cont: true, main: ['amp', 'rate'], desc: 'Ideges, véletlenszerű remegés (mindig ugyanaz a minta).',
    icon: '<path d="M3 12h3l2-5 3 10 3-8 2 5 2-2h3"/>',
    params: [S('amp', 'Erő', 0, .1, .01), S('rate', 'Gyorsaság (Hz)', .5, 30, 12), S('rot', 'Billegés °', 0, 20, 2), S('seed', 'Minta', 0, 99, 7, 1)] },
  spring: { name: 'Rugalmas beúszás', cont: false, main: ['dur', 'char'], desc: 'Megadott irányból rugalmasan érkezik a helyére. Az irányt a vásznon a nyíllal fogod meg.',
    icon: '<path d="M3 12h9"/><path d="M12 12c1.5-3 2.5-3 3 0s1.5 3 2.5 0 1.5-3 2.5 0"/><path d="M6 9l-3 3 3 3"/>',
    params: [S('at', 'Kezdés (mp)', 0, 60, 0), S('dur', 'Időtartam (mp)', .1, 4, .9), SEL('char', 'Karakter', ['Lágy', 'Ütés', 'Rugó'], 2), S('dist', 'Távolság', 0, 2, .45), S('ang', 'Érkezés iránya °', -180, 180, 180), S('fade', 'Beúszó áttetszőség', 0, 1, 1), S('from', 'Kezdő méret', .2, 2, 1)] },
};
export const MO_ORDER = ['float', 'spin', 'pulse', 'orbit', 'shake', 'spring'];
export const moIcon = (t: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${(MO[t] || MO.float).icon}</svg>`;
export const AMT = S('amt', 'Erősség', 0, 1, 1);
/** A new motion item (all params as animatable values, so later slices can key them). */
export function makeMo(t: string, o: any = {}) {
  const d = MO[t]; const p: any = { amt: mkN(o.amt ?? 1) }; for (const q of d.params) p[q.k] = mkN(o[q.k] ?? q.def);
  return { id: 'M' + uid().slice(1), t, on: true, p };
}
export const moParam = (m: any, k: string) => k === 'amt' ? AMT : MO[m.t].params.find((q: any) => q.k === k);
const V = (m: any, k: string, t: number) => { const n = m.p[k], d = moParam(m, k); return n ? ev(n, d, t) : d.def; };

// Anime.js adapter: progress → eased progress, cached per character/duration (pure functions, no Anime.js clock)
const EASE: Record<string, (x: number) => number> = {};
export function charEase(ch: number, dur: number) {
  const key = ch + '|' + Math.round(dur * 100); if (EASE[key]) return EASE[key];
  let f: (x: number) => number;
  try { f = ch === 0 ? spring({ bounce: 0, duration: dur * 1000 }).ease : ch === 1 ? eases.outBack(2.4) : spring({ bounce: .45, duration: dur * 1000 }).ease; }
  catch (_) { f = (x: number) => 1 - Math.pow(1 - x, 3); }
  return (EASE[key] = (x: number) => x <= 0 ? 0 : x >= 1 ? 1 : f(x));
}
const h1 = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
const smoothNoise = (x: number, seed: number) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return (h1(i + seed * 17.3) * (1 - u) + h1(i + 1 + seed * 17.3) * u) * 2 - 1; };

/** Combined motion of a layer at time t: {op, dx, dy, sc, rot (deg)}; null when it has none. aud = a motion previewed on hover. */
export function moEval(L: any, t0: number, aud?: any): any {
  const list = aud ? [...(L.mo || []), aud.mo] : L.mo; if (!list || !list.length) return null;
  const r = { op: 1, dx: 0, dy: 0, sc: 1, rot: 0 }; let any = false;
  for (const m of list) {
    if (!m || m.on === false || !MO[m.t]) continue; any = true;
    // a shelf motion previewed on hover runs on its own clock (the timed one repeats), so it is visible even when paused
    let t = t0; if (aud && m === aud.mo) { const ta = (performance.now() - aud.t0) / 1000; t = m.t === 'spring' ? ta % (m.p.dur.v + .9) : ta; }
    const a = V(m, 'amt', t);
    switch (m.t) {
      case 'float': { const w = Math.sin(TAU * (t / Math.max(.05, V(m, 'period', t)) + V(m, 'phase', t))) * V(m, 'amp', t) * a, g = V(m, 'ang', t) * Math.PI / 180; r.dx += Math.cos(g) * w; r.dy += Math.sin(g) * w; break; }
      case 'spin': r.rot += V(m, 'speed', t) * t * a; break;
      case 'pulse': r.sc *= Math.max(.01, 1 + Math.sin(TAU * (t / Math.max(.05, V(m, 'period', t)) + V(m, 'phase', t))) * V(m, 'amp', t) * a); break;
      case 'orbit': { const ph = TAU * (t / Math.max(.05, V(m, 'period', t)) + V(m, 'phase', t)) * (Math.round(V(m, 'dir', t)) === 0 ? -1 : 1), R0 = V(m, 'radius', t) * a; r.dx += Math.cos(ph) * R0; r.dy += Math.sin(ph) * R0; break; }
      case 'shake': { const x = t * V(m, 'rate', t), sd = V(m, 'seed', t), A = V(m, 'amp', t) * a; r.dx += smoothNoise(x, sd) * A; r.dy += smoothNoise(x + 31.7, sd + 3) * A; r.rot += smoothNoise(x + 77.1, sd + 5) * V(m, 'rot', t) * a; break; }
      case 'spring': {
        const at = V(m, 'at', t), dur = Math.max(.05, V(m, 'dur', t)), x = (t - at) / dur; if (x >= 1) break;
        const e = charEase(Math.round(V(m, 'char', t)), dur)(Math.max(0, x)), u = 1 - e, g = V(m, 'ang', t) * Math.PI / 180, D = V(m, 'dist', t) * a;
        r.dx += Math.cos(g) * D * u; r.dy += Math.sin(g) * D * u;
        const fr = V(m, 'from', t); r.sc *= Math.max(.01, fr + (1 - fr) * e);
        const fd = V(m, 'fade', t); r.op *= x <= 0 ? 1 - fd : 1 - fd * Math.max(0, 1 - Math.min(1, x * 2.5)); break;
      }
    }
  }
  return any ? r : null;
}
/** Timed motions as [start, end] for the timeline block and retime. */
export const moSpan = (m: any) => m.t === 'spring' ? [m.p.at.v, m.p.at.v + m.p.dur.v] : null;

/** Mark every keyed value of L (own + its appearances) with the layer-wide key range while its key Loop is on. */
export function syncKLoop(L: any) {
  const on = !!(L.kloop && L.kloop.on); if (!on && !L._klSet) return;
  const vals: any[] = []; const add = (g: any) => { for (const k in g || {}) { const o = g[k]; if (o && Array.isArray(o.k) && o.k.length) vals.push(o); } };
  add(L.n); add(L.p); for (const F of L.fx || []) { add(F.n); add(F.p); }
  let kl: any = null;
  if (on && vals.length) { let a = Infinity, b = -Infinity; for (const o of vals) { a = Math.min(a, o.k[0].t); b = Math.max(b, o.k[o.k.length - 1].t); } if (b > a) kl = { a, b, ret: Math.max(.05, +L.kloop.ret || .5) }; }
  for (const o of vals) { if (kl) Object.defineProperty(o, '_kl', { value: kl, enumerable: false, writable: true, configurable: true }); else if (o._kl) delete o._kl; }
  Object.defineProperty(L, '_klSet', { value: !!kl, enumerable: false, writable: true, configurable: true });
  return kl;
}

/** Loading: keep known motions, fill missing params with defaults (unknown kinds are dropped). */
R.normMo = (L: any) => { if (!Array.isArray(L.mo)) { if (L.mo != null) delete L.mo; return; }
  L.mo = L.mo.filter((m: any) => m && MO[m.t]).map((m: any) => { const b = makeMo(m.t); b.id = m.id || b.id; b.on = m.on !== false; for (const k in b.p) if (m.p && m.p[k] && isFinite(m.p[k].v)) b.p[k] = mkN(m.p[k]); return b; }); };

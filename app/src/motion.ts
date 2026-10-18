/** Mozgás v1: draggable motions on a layer (L.mo = [{id, t, on, p:{key: NParam}}]). Every motion is a pure function of
 *  scene time (seek = export = live), added on top of placement in render.setXform / opacity. Continuous ones (Lebegés,
 *  Forgás, Lüktetés, Keringés, Remegés) are periodic and run on their own, independent of the project Loop; the timed
 *  Rugalmas beúszás uses Anime.js easing (spring / outBack) through this adapter — the Vel clock stays the only clock. */
import { spring, eases } from 'animejs';
import { S, SEL } from './effects/helpers';
import { mkN, st, uid } from './state';
import { ev, keyVal, setKey } from './evaluation';
import { R } from './runtime';
import { BASEK } from './effects/index';
import { physAt } from './physics';

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
    params: [S('at', 'Kezdés (mp)', 0, 60, 0), S('dur', 'Időtartam (mp)', .1, 4, .9), SEL('char', 'Karakter', ['Lágy', 'Ütés', 'Rugó'], 2), S('dist', 'Távolság', 0, 2, .45), S('ang', 'Érkezés iránya °', -180, 180, 180), S('fade', 'Beúszó áttetszőség', 0, 1, 1), S('from', 'Kezdő méret', .2, 2, 1), S('bend', 'Ív', -1.5, 1.5, 0)] },
  path: { name: 'Útvonalon', cont: true, main: ['period', 'orient'], desc: 'Végigmegy egy Útvonal rétegen (2D Formák → Útvonal): a réteg a vonalra kerül, és körbe, oda-vissza vagy egyszer bejárja. Ha átrajzolod az útvonalat, követi.',
    icon: '<path d="M4 18c3-9 7 3 10-6s4-5 6-6"/><circle cx="4" cy="18" r="1.6" fill="currentColor"/>',
    params: [S('period', 'Bejárás ideje (mp)', .3, 30, 4), SEL('loop', 'Ismétlés', ['Körbe', 'Oda-vissza', 'Egyszer'], 0), SEL('orient', 'Irányba fordul', ['Nem', 'Igen'], 0), S('phase', 'Kezdőpont', 0, 1, 0)] },
  phys: { name: 'Fizikai test', cont: false, main: ['grav', 'bounce', 'push'], desc: 'Merev testté teszi a réteget: a vászon széle fal, a testek egymásról lepattannak, gurulnak. A Gravitáció alapból kikapcsolt. Ugrás és export ugyanazt adja (t = 0-tól számolva).',
    icon: '<circle cx="9" cy="7" r="3.5"/><rect x="11" y="13" width="8" height="7" rx="1"/><path d="M3 21h18"/><path d="M9 12v3M7.5 13.5L9 15l1.5-1.5"/>',
    params: [SEL('shape', 'Alak', ['Automatikus', 'Kör', 'Doboz'], 0), S('grav', 'Gravitáció', 0, 3, 0), S('gang', 'Gravitáció iránya °', -180, 180, -90), S('mass', 'Tömeg', .1, 10, 1),
      S('bounce', 'Pattanás', 0, 1, .5), S('fric', 'Súrlódás', 0, 1, .4), S('push', 'Kezdő lökés', 0, 3, 0), S('pang', 'Lökés iránya °', -180, 180, 30), S('spinv', 'Pörgetés °/mp', -720, 720, 0),
      SEL('coll', 'Ütközés', ['Mindennel', 'Csak a csoportjával', 'Semmivel'], 0), S('group', 'Csoport', 1, 4, 1, 1), SEL('fixed', 'Test', ['Szabad', 'Rögzített'], 0),
      SEL('walls', 'Vászon széle', ['Fal', 'Átengedi'], 0), S('at', 'Kezdés (mp)', 0, 60, 0)] },
};
export const MO_ORDER = ['float', 'spin', 'pulse', 'orbit', 'shake', 'spring', 'path', 'phys'];
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

/* ---------- v1.1 Ritmus: a periodic speed (Tempó) or strength (Erő) curve per continuous motion ----------
 *  m.ry = {k: preset (0 Folyamatos … 4 Véletlen, 5 Egyéni), cyc: cycle s, pts: RY_N values 0..2 (1 = normal), tgt: 0 Tempó / 1 Erő,
 *  rnd: 1 = seeded cycles skip the curve, seed}. Points are joined by smoothsteps (C1 speed → soft stop and restart); the phase is
 *  the analytic integral of that curve, so every motion stays a pure function of t (seek = export = live). Clip: m.a start (0),
 *  m.b end (absent = open-ended); a soft ramp eases the motion in/out at a set start/end. */
export const RY_N = 10, RAMP = .6;
const sm = (x: number) => x * x * (3 - 2 * x), smI = (x: number) => x * x * x - x * x * x * x / 2;
export const RY_PRE: { name: string; tip: string; ry?: any }[] = [
  { name: 'Folyamatos', tip: 'Egyenletesen fut, ahogy eddig.' },
  { name: 'Megáll időnként', tip: '5 mp-enként lelassul, kb. 1,5 mp-re megáll, aztán puhán újraindul.', ry: { cyc: 5, tgt: 0, rnd: 0, pts: [1, 1, 1, 1, 1, 1, 0, 0, 0, 1] } },
  { name: 'Lassul–gyorsul', tip: 'Lélegző tempó: lassabb és gyorsabb szakaszok váltják egymást.', ry: { cyc: 6, tgt: 0, rnd: 0, pts: Array.from({ length: RY_N }, (_, i) => Math.round((1 + .65 * Math.sin(TAU * i / RY_N)) * 100) / 100) } },
  { name: 'Elcsendesedik', tip: 'A kitérés elhalkul, majd visszatér; a ritmus közben fut tovább.', ry: { cyc: 8, tgt: 1, rnd: 0, pts: [1, 1, .8, .4, .1, 0, .1, .4, .8, 1] } },
  { name: 'Véletlen szünetek', tip: 'Néha megáll, néha nem. A minta ismételhető (mindig ugyanaz).', ry: { cyc: 3.5, tgt: 0, rnd: 1, seed: 1, pts: [1, 1, 1, 1, 0, 0, 0, 1, 1, 1] } },
];
/** Apply rhythm preset k to a motion (0 removes the rhythm). */
export function setRy(m: any, k: number) { if (!k) { delete m.ry; return; } const P = RY_PRE[k].ry; m.ry = { k, cyc: P.cyc, tgt: P.tgt, rnd: P.rnd, seed: m.ry?.seed ?? P.seed ?? 1, pts: [...P.pts] }; }
const ryAct = (ry: any, c: number) => !ry.rnd || c === 0 || h1(c * 7.31 + (ry.seed || 0) * 13.7) < .55;
const pAt = (P: number[], j: number) => P[j % P.length];
function segU(P: number[], u: number) { const N = P.length, x = u * N, j = Math.min(N - 1, Math.floor(x)); return [j, x - j]; }
/** Curve value at cycle phase u ∈ [0,1). */
export function ryValU(P: number[], u: number) { const [j, f] = segU(P, u); return P[j] + (pAt(P, j + 1) - P[j]) * sm(f); }
function ryIntU(P: number[], u: number) { const N = P.length; const [j, f] = segU(P, u); let s = 0; for (let i = 0; i < j; i++) s += (P[i] + pAt(P, i + 1)) / 2; return (s + P[j] * f + (pAt(P, j + 1) - P[j]) * smI(f)) / N; }
const ryMean = (P: number[]) => P.reduce((s, v) => s + v, 0) / P.length;
/** Rhythm value at local time x (s since the clip start). */
export function ryVal(ry: any, x: number) { const cyc = Math.max(.2, ry.cyc), c = Math.floor(x / cyc), u = x / cyc - c; return ryAct(ry, c) ? ryValU(ry.pts, u) : ry.pts[0]; }
/** ∫0^x speed: phase time at local time x. */
export function ryTau(ry: any, x: number) {
  if (x <= 0) return x; const cyc = Math.max(.2, ry.cyc), P = ry.pts, I = ryMean(P), c = Math.floor(x / cyc), u = x / cyc - c;
  if (!ry.rnd) return cyc * (c * I + ryIntU(P, u));
  let nA = 0; const cm = Math.min(c, 20000); for (let i = 0; i < cm; i++) if (ryAct(ry, i)) nA++;
  return cyc * (nA * I + (c - nA) * P[0] + (ryAct(ry, c) ? ryIntU(P, u) : P[0] * u));
}
/** Clip of a continuous motion: [a, b|null, ramp]. */
export function moClip(m: any) { const a = Math.max(0, +m.a || 0), b = m.b != null && isFinite(m.b) ? Math.max(a + .05, +m.b) : null; const r = b == null ? RAMP : Math.min(RAMP, (b - a) / 2); return { a, b, r }; }
/** Time warp of a continuous motion at t: tau = phase time (rhythm tempo + ramps integrated), amp = strength factor (ramps × Erő rhythm). */
export function moTime(m: any, t: number) {
  const { a, b, r } = moClip(m), ry = m.ry && m.ry.k ? m.ry : null, tempo = !!ry && (ry.tgt !== 1 || m.t === 'spin');
  const inR = a > 0 ? r : 0, outR = b != null ? r : 0;
  const env = (x: number) => (inR && x < a + inR ? (x <= a ? 0 : sm((x - a) / inR)) : 1) * (outR && x > b! - outR ? (x >= b! ? 0 : sm((b! - x) / outR)) : 1);
  const spd = (x: number) => tempo ? Math.max(0, ryVal(ry, x - a)) : 1, Q = (x: number) => tempo ? ryTau(ry, x - a) : x - a;
  const simp = (x0: number, x1: number) => { if (x1 <= x0) return 0; const n = 12, hh = (x1 - x0) / n; let s = 0; for (let i = 0; i <= n; i++) { const x = x0 + i * hh; s += env(x) * spd(x) * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2); } return s * hh / 3; };
  const t1 = b != null ? Math.min(t, b) : t; let tau: number;
  if (t1 <= a && a > 0) tau = 0;
  else if (inR && t1 < a + inR) tau = simp(a, t1);
  else { const N1 = inR ? simp(a, a + inR) : 0;
    tau = outR && t1 > b! - outR ? N1 + Q(b! - outR) - Q(a + inR) + simp(b! - outR, t1) : N1 + Q(t1) - Q(a + inR); }
  let amp = env(t); if (ry && !tempo) amp *= Math.max(0, ryVal(ry, t - a));
  return { tau, amp };
}

/** Combined motion of a layer at time t: {op, dx, dy, sc, rot (deg)}; null when it has none. aud = a motion previewed on hover. */
export function moEval(L: any, t0: number, aud?: any): any {
  const list = aud ? [...(L.mo || []), aud.mo] : L.mo; if (!list || !list.length) return null;
  const r = { op: 1, dx: 0, dy: 0, sc: 1, rot: 0 }; let any = false;
  for (const m of list) {
    if (!m || m.on === false || !MO[m.t]) continue; any = true;
    // a shelf motion previewed on hover runs on its own clock (the timed one repeats), so it is visible even when paused
    let t = t0; if (aud && m === aud.mo) { const ta = (performance.now() - aud.t0) / 1000; t = m.t === 'spring' ? ta % (m.p.dur.v + .9) : ta; }
    const W = m.t === 'spring' || m.t === 'phys' ? null : moTime(m, t), T = W ? W.tau : t, a = V(m, 'amt', t) * (W && m.t !== 'spin' ? W.amp : 1);
    switch (m.t) {
      case 'float': { const w = Math.sin(TAU * (T / Math.max(.05, V(m, 'period', t)) + V(m, 'phase', t))) * V(m, 'amp', t) * a, g = V(m, 'ang', t) * Math.PI / 180; r.dx += Math.cos(g) * w; r.dy += Math.sin(g) * w; break; }
      case 'spin': r.rot += V(m, 'speed', t) * T * a; break;
      case 'pulse': r.sc *= Math.max(.01, 1 + Math.sin(TAU * (T / Math.max(.05, V(m, 'period', t)) + V(m, 'phase', t))) * V(m, 'amp', t) * a); break;
      case 'orbit': { const ph = TAU * (T / Math.max(.05, V(m, 'period', t)) + V(m, 'phase', t)) * (Math.round(V(m, 'dir', t)) === 0 ? -1 : 1), R0 = V(m, 'radius', t) * a; r.dx += Math.cos(ph) * R0; r.dy += Math.sin(ph) * R0; break; }
      case 'shake': { const x = T * V(m, 'rate', t), sd = V(m, 'seed', t), A = V(m, 'amp', t) * a; r.dx += smoothNoise(x, sd) * A; r.dy += smoothNoise(x + 31.7, sd + 3) * A; r.rot += smoothNoise(x + 77.1, sd + 5) * V(m, 'rot', t) * a; break; }
      case 'path': {
        const q = m.path && R.pathAt ? (() => { let u = T / Math.max(.05, V(m, 'period', t)) + V(m, 'phase', t); const lp = Math.round(V(m, 'loop', t));
          u = lp === 0 ? u - Math.floor(u) : lp === 1 ? (() => { const w = u - 2 * Math.floor(u / 2); return w < 1 ? w : 2 - w; })() : Math.max(0, Math.min(1, u));
          return R.pathAt(m.path, t, u); })() : null;
        if (q) { r.dx += (q.x - ev(L.n.x, BASEK.x, t)) * a; r.dy += (q.y - ev(L.n.y, BASEK.y, t)) * a; if (Math.round(V(m, 'orient', t)) === 1) r.rot -= q.ang * 180 / Math.PI * a; }
        break;
      }
      case 'phys': { if (aud && m === aud.mo) break; const P = physAt(L, t); if (P) { r.dx += P.dx * a; r.dy += P.dy * a; r.rot += P.rot * a; } break; }
      case 'spring': {
        const at = V(m, 'at', t), dur = Math.max(.05, V(m, 'dur', t)), x = (t - at) / dur; if (x >= 1) break;
        const e = charEase(Math.round(V(m, 'char', t)), dur)(Math.max(0, x)), u = 1 - e, g = V(m, 'ang', t) * Math.PI / 180, D = V(m, 'dist', t) * a;
        // Gesztus: the path is a quadratic Bézier from the start offset S to rest, its control point bent sideways by bend × dist
        // (bend 0 = the straight line u·S); overshoot (e > 1) continues along the same curve
        const b = V(m, 'bend', t), cg = Math.cos(g), sg = Math.sin(g), Sx = cg * D, Sy = sg * D, Cx = Sx / 2 - sg * b * D, Cy = Sy / 2 + cg * b * D;
        r.dx += u * u * Sx + 2 * u * e * Cx; r.dy += u * u * Sy + 2 * u * e * Cy;
        const fr = V(m, 'from', t); r.sc *= Math.max(.01, fr + (1 - fr) * e);
        const fd = V(m, 'fade', t); r.op *= x <= 0 ? 1 - fd : 1 - fd * Math.max(0, 1 - Math.min(1, x * 2.5)); break;
      }
    }
  }
  return any ? r : null;
}

/** Kulcsokká alakítás: sample this one motion onto the layer's own n.x/n.y/n.s/n.r/opacity keys (linear keys, simplified),
 *  then remove the motion. Returns the number of keys written (the caller commits once = one undo step). */
export function bakeMo(L: any, m: any) {
  const i = (L.mo || []).indexOf(m); if (i < 0) return 0;
  const C = m.t === 'spring' ? [Math.max(0, m.p.at.v), m.p.at.v + m.p.dur.v] : (() => { const c = moClip(m); return [c.a, c.b ?? Math.max(c.a + .1, st.dur)]; })();
  const n = Math.max(2, Math.min(3000, Math.ceil((C[1] - C[0]) * 30))), ts = Array.from({ length: n + 1 }, (_, j) => Math.round((C[0] + (C[1] - C[0]) * j / n) * 1000) / 1000);
  const one = { id: L.id, n: L.n, mo: [{ ...m, on: true }] }, S0 = ts.map(t => moEval(one, t));
  const base = (o: any, t: number) => o.k && o.k.length ? keyVal(o.k, t) : o.v;
  const CH: [string, (b: number, r: any) => number, number][] = [['x', (b, r) => b + r.dx, .0015], ['y', (b, r) => b + r.dy, .0015], ['s', (b, r) => b * r.sc, .002], ['r', (b, r) => b + r.rot, .15], ['opacity', (b, r) => Math.max(0, Math.min(1, b * r.op)), .004]];
  let cnt = 0;
  for (const [k, f, tol] of CH) { const o = L.n[k]; if (!o) continue;
    const vs = ts.map((t, j) => f(base(o, t), S0[j])); if (vs.every((v, j) => Math.abs(v - base(o, ts[j])) < 1e-6)) continue;
    // keep the shape with few keys: greedy split until linear segments stay within tol (Ramer–Douglas–Peucker)
    const keep = new Set([0, n]); const rdp = (p: number, q: number) => { let w = -1, wd = tol; for (let j = p + 1; j < q; j++) { const l = vs[p] + (vs[q] - vs[p]) * (ts[j] - ts[p]) / (ts[q] - ts[p]), d = Math.abs(vs[j] - l); if (d > wd) { wd = d; w = j; } } if (w > 0) { keep.add(w); rdp(p, w); rdp(w, q); } };
    rdp(0, n); const v0 = o.v;
    if (o.k) o.k = o.k.filter((x: any) => x.t < C[0] - 1e-6 || x.t > C[1] + 1e-6);
    for (const j of [...keep].sort((a, b) => a - b)) { setKey(o, ts[j], vs[j]); const kk = o.k.find((x: any) => Math.abs(x.t - ts[j]) < 1e-6); if (kk) kk.e = 4; cnt++; }
    o.v = o.k && o.k.length ? keyVal(o.k, R.time) : v0; }
  L.mo.splice(i, 1); return cnt;
}

/** Timed motions as [start, end] for the timeline block and retime. */
export const moSpan = (m: any) => m.t === 'spring' ? [m.p.at.v, m.p.at.v + m.p.dur.v] : null;

/** Mark every keyed value of L (own + its appearances) with the layer-wide key range while its key Loop is on. */
export function syncKLoop(L: any) {
  const on = !!(L.kloop && L.kloop.on); if (!on && !L._klSet) return;
  const vals: any[] = []; const add = (g: any) => { for (const k in g || {}) { const o = g[k]; if (o && Array.isArray(o.k) && o.k.length) vals.push(o); } };
  add(L.n); add(L.p); for (const F of L.fx || []) { add(F.n); add(F.p); } for (const m of L.mo || []) add(m.p);
  let kl: any = null;
  if (on && vals.length) { let a = Infinity, b = -Infinity; for (const o of vals) { a = Math.min(a, o.k[0].t); b = Math.max(b, o.k[o.k.length - 1].t); } if (b > a) kl = { a, b, ret: Math.max(.05, +L.kloop.ret || .5) }; }
  for (const o of vals) { if (kl) Object.defineProperty(o, '_kl', { value: kl, enumerable: false, writable: true, configurable: true }); else if (o._kl) delete o._kl; }
  Object.defineProperty(L, '_klSet', { value: !!kl, enumerable: false, writable: true, configurable: true });
  return kl;
}

/** Loading: keep known motions, fill missing params with defaults (unknown kinds are dropped). */
R.normMo = (L: any) => { if (!Array.isArray(L.mo)) { if (L.mo != null) delete L.mo; return; }
  L.mo = L.mo.filter((m: any) => m && MO[m.t]).map((m: any) => { const b: any = makeMo(m.t); b.id = m.id || b.id; b.on = m.on !== false; for (const k in b.p) if (m.p && m.p[k] && isFinite(m.p[k].v)) b.p[k] = mkN(m.p[k]);
    // v1.1 fields only when present (no silent defaults written into the project)
    if (typeof m.path === 'string') b.path = m.path;
    if (isFinite(m.a) && m.a > 0) b.a = +m.a; if (m.b != null && isFinite(m.b)) b.b = +m.b;
    const y = m.ry; if (y && y.k > 0 && Array.isArray(y.pts) && y.pts.length === RY_N && y.pts.every((v: any) => isFinite(v)))
      b.ry = { k: Math.min(5, Math.round(y.k)), cyc: Math.max(.2, Math.min(60, +y.cyc || 5)), tgt: y.tgt === 1 ? 1 : 0, rnd: y.rnd ? 1 : 0, seed: +y.seed || 1, pts: y.pts.map((v: number) => Math.max(0, Math.min(2, +v))) };
    return b; }); };

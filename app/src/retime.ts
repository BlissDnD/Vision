/* M5 · Mozgásblokk és könnyű retime + kézi Jelzések.
 *
 * A layer's motion block = everything timed on it: entry (tm.in*, type "start"), middle events (bento morph), exit
 * (tm.out*, type "outAt") and all keyframes. Phases: [a, inEnd] entry · [inEnd, outStart] elastic middle · [outStart, b] exit.
 *  - shiftBlock: everything moves together.
 *  - stretchBlock(..,'hold'): the right edge lengthens the middle only (entry speed unchanged, exit moves later).
 *  - stretchBlock(..,'close'): „Zárás lassítása”: the exit phase itself gets longer.
 *  - Cues (st.cues, manual taps): keys sitting exactly on a cue are anchors and stay on it during a retime
 *    (nothing slips silently: the caller reports how many stayed). */
import { st, uid } from './state';
import { KEY_EPS, hasK } from './evaluation';
import { textCache } from './text';

type Field = { role: 'in' | 'mid' | 'out'; get: () => number; set: (v: number) => void; len?: () => number; setLen?: (v: number) => void };
const r3 = (v: number) => Math.max(0, Math.round(v * 1000) / 1000);

/** Time fields of a layer, by role. Only fields that are active (an exit at 0 means "no exit"). */
export function timeFields(L: any): Field[] {
  const f: Field[] = [], T = L.tm, P = (k: string) => L.p && L.p[k];
  if (T && T.in) f.push({ role: 'in', get: () => T.inAt, set: v => { T.inAt = r3(v); }, len: () => T.inDur });
  if (T && T.out) f.push({ role: 'out', get: () => T.outAt, set: v => { T.outAt = r3(v); }, len: () => T.outDur, setLen: v => { T.outDur = Math.max(.05, Math.round(v * 1000) / 1000); } });
  const pv = (k: string, role: Field['role'], len?: () => number) => { const o = P(k); if (o) f.push({ role, get: () => o.v, set: v => { o.v = r3(v); }, len }); };
  for (const m of L.mo || []) if (m.t === 'spring' && m.on !== false) f.push({ role: 'in', get: () => m.p.at.v, set: v => { m.p.at.v = r3(v); }, len: () => m.p.dur.v, setLen: v => { m.p.dur.v = Math.max(.1, Math.round(v * 1000) / 1000); } });
  if (L.type === 'mtext') { // staggered units: letters / words / lines, as the timeline segments count them
    const n = () => { const tc = textCache.get(L.id), u = Math.round(P('unit').v); if (tc && tc.info) return u === 0 ? tc.info[0] : u === 1 ? tc.info[1] : tc.geo[0];
      const str = (L.text && L.text.str) || ''; return u === 2 ? str.split('\n').length : u === 1 ? str.split(/\s+/).filter(Boolean).length : [...str.replace(/\s/g, '')].length; };
    const len = () => P('dur').v + P('stagger').v * Math.max(0, n() - 1);
    pv('start', 'in', len); if (P('outAt') && P('outAt').v > 0) pv('outAt', 'out', len); }
  if (L.type === 'bento') { pv('start', 'in', () => P('dur').v); if (P('layout2') && Math.round(P('layout2').v) > 0) pv('morphAt', 'mid', () => P('morphDur').v); if (P('outAt') && P('outAt').v > 0) pv('outAt', 'out', () => P('dur').v); }
  if (L.type === 'reveal') { const d = Math.round(P('dir').v); pv('at', d === 1 ? 'out' : 'in', () => P('dur').v); if (d === 2) pv('outAt', 'out', () => P('dur').v); }
  return f;
}
export function keyRefs(L: any) { const r: any[] = []; for (const g of ['n', 'p']) for (const k in L[g] || {}) { const o = L[g][k]; if (hasK(o)) for (const x of o.k) r.push(x); } return r; }

export interface Block { a: number; inEnd: number; outStart: number; b: number }
export function blockOf(L: any): Block | null {
  const F = timeFields(L), K = keyRefs(L); if (!F.length && !K.length) return null;
  const ins = F.filter(x => x.role === 'in'), outs = F.filter(x => x.role === 'out');
  const starts = [...F.map(x => x.get()), ...K.map(k => k.t)], ends = [...F.map(x => x.get() + (x.len ? x.len() : 0)), ...K.map(k => k.t)];
  const a = Math.min(...starts), b = Math.max(...ends);
  const inEnd = ins.length ? Math.max(...ins.map(x => x.get() + (x.len ? x.len() : 0))) : a;
  const outStart = outs.length ? Math.min(...outs.map(x => x.get())) : b;
  return { a, inEnd: Math.min(inEnd, outStart), outStart, b };
}

export const cueAt = (t: number) => (st.cues || []).find((c: any) => Math.abs(c.t - t) < KEY_EPS);
export function addCue(t: number, label = '') { if (!st.cues) st.cues = []; if (cueAt(t)) return null; const c = { id: 'C' + uid().slice(1), t: r3(t), label }; st.cues.push(c); st.cues.sort((x: any, y: any) => x.t - y.t); return c; }
export function removeCue(id: string) { st.cues = (st.cues || []).filter((c: any) => c.id !== id); }

/** Apply a time map to a layer; anchored keys (on a cue) keep their time. Returns how many keys stayed on a cue. */
function remap(L: any, mapT: (t: number, role: Field['role'] | 'key') => number, anchors: boolean) {
  for (const f of timeFields(L)) f.set(mapT(f.get(), f.role));
  let kept = 0;
  for (const g of ['n', 'p']) for (const k in L[g] || {}) { const o = L[g][k]; if (!hasK(o)) continue;
    for (const x of o.k) { if (anchors && cueAt(x.t)) { kept++; continue; } x.t = r3(mapT(x.t, 'key')); }
    o.k.sort((p: any, q: any) => p.t - q.t);
    for (let i = o.k.length - 1; i > 0; i--) if (Math.abs(o.k[i].t - o.k[i - 1].t) < KEY_EPS) o.k.splice(i, 1); } // collisions: keep one
  return kept;
}
export function shiftBlock(L: any, dt: number, anchors = true) { const B = blockOf(L); if (!B) return 0; dt = Math.max(dt, -B.a); return remap(L, t => t + dt, anchors); }
export function stretchBlock(L: any, newB: number, mode: 'hold' | 'close' = 'hold', anchors = true) {
  const B = blockOf(L); if (!B) return 0;
  if (mode === 'close') {
    const old = Math.max(1e-3, B.b - B.outStart), k = Math.max(0.05, (newB - B.outStart) / old);
    const fs = timeFields(L).filter(f => f.role === 'out' && f.setLen); for (const f of fs) f.setLen!(f.len!() * k);
    return remap(L, (t, role) => (role === 'key' && t > B.outStart ? B.outStart + (t - B.outStart) * k : t), anchors);
  }
  const dt = Math.max(newB, B.inEnd + 0.05) - B.b, hold = B.outStart - B.inEnd, k = hold > 1e-3 ? (hold + dt) / hold : 1;
  return remap(L, (t, role) => {
    if (role === 'in' || t <= B.inEnd + 1e-9) return t;                          // entry: untouched
    if (role === 'out' || t >= B.outStart - 1e-9) return t + dt;                  // exit: later, same speed
    return hold > 1e-3 ? B.inEnd + (t - B.inEnd) * k : t + dt;                     // middle: elastic
  }, anchors);
}

/* ----- Időzítés gyorsan · Tempó: a real retime of an item's data (keys, motion blocks, motions' rates/periods) ----- */
/** Every keyed value on a layer, including its effects and motions. */
function allKeyed(L: any) { const r: any[] = []; const add = (g: any) => { for (const k in g || {}) { const o = g[k]; if (o && typeof o === 'object' && 'v' in o) r.push(o); } };
  add(L.n); add(L.p); for (const F of L.fx || []) { add(F.n); add(F.p); } for (const m of L.mo || []) add(m.p); return r; }
const itemsOf = (it: any) => it.type === 'group' ? [it, ...(it.children || [])] : [it];
/** Pivot of a tempo change: the earliest block start of the item (a group: of itself and its children). */
export function tempoPivot(it: any) { let a = Infinity; for (const L of itemsOf(it)) { const B = blockOf(L); if (B) a = Math.min(a, B.a); } return isFinite(a) ? a : 0; }
/** Scale the item's whole motion by tempo factor f (2 = twice as fast) around its block start: times t → a + (t − a)/f,
 *  durations /f, periods /f, speeds and rates ×f. Keeps L.tpo (the item's tempo relative to how it was made) for the chips.
 *  The caller commits (one undo step). */
export function tempoItem(it: any, f: number) {
  if (!(f > 0) || Math.abs(f - 1) < 1e-6) return 0; const a = tempoPivot(it), T = (t: number) => r3(a + (t - a) / f), D = (d: number) => Math.max(.01, Math.round(d / f * 1000) / 1000);
  let n = 0;
  for (const L of itemsOf(it)) {
    const fs = timeFields(L); const vals = fs.map(x => x.get());          // read all before writing (fields can share data)
    const P = (k: string) => L.p && L.p[k], dur = (o: any) => { if (o && isFinite(o.v)) o.v = D(o.v); };
    if (L.tm) { if (isFinite(L.tm.inDur)) L.tm.inDur = D(L.tm.inDur); if (isFinite(L.tm.outDur)) L.tm.outDur = D(L.tm.outDur); }
    if (L.type === 'mtext') { dur(P('dur')); if (P('stagger')) P('stagger').v = Math.round(P('stagger').v / f * 10000) / 10000; }
    if (L.type === 'bento') { dur(P('dur')); dur(P('morphDur')); }
    if (L.type === 'reveal') dur(P('dur'));
    fs.forEach((x, i) => x.set(T(vals[i])));
    for (const m of L.mo || []) { const p = m.p;
      if (m.t === 'spring') dur(p.dur);
      if (p.period) p.period.v = Math.max(.05, Math.round(p.period.v / f * 1000) / 1000);
      if (p.speed) p.speed.v = Math.round(p.speed.v * f * 100) / 100;
      if (p.rate) p.rate.v = Math.round(p.rate.v * f * 100) / 100;
      if (m.ry && isFinite(m.ry.cyc)) m.ry.cyc = Math.max(.05, Math.round(m.ry.cyc / f * 1000) / 1000);
      if (isFinite(m.a) && m.a > 0) m.a = T(m.a); if (m.b != null && isFinite(m.b)) m.b = T(m.b); }
    for (const o of allKeyed(L)) {
      if (o.a && isFinite(o.f)) o.f = Math.round(o.f * f * 10000) / 10000;  // waves (LFO) keep their character: faster too
      if (hasK(o)) { for (const x of o.k) x.t = T(x.t); n += o.k.length;
        for (let i = o.k.length - 1; i > 0; i--) if (Math.abs(o.k[i].t - o.k[i - 1].t) < KEY_EPS) o.k.splice(i, 1); } }
  }
  it.tpo = Math.round((it.tpo || 1) * f * 1000) / 1000; if (Math.abs(it.tpo - 1) < 1e-3) delete it.tpo;
  return n;
}

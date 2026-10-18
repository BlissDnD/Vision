/* M5 + U1 · Eljátszás simítással.
 * Armed (E): playback stops. The first value change of any animatable parameter during a pointer gesture (canvas drag of
 * position / size / rotation / 3D orbit, a slider, a number scrub) starts playback and the take; releasing the pointer stops
 * playback, writes the take as keys and jumps the playhead back to where the take started. Every parameter touched in the
 * gesture is one component of the take (x+y of a canvas move are smoothed together in 2D).
 * The raw take is kept, so the Simítás slider re-builds the keys from the same gesture (no re-take needed).
 * Smoothing = Gaussian over time (σ grows with Simítás) + Ramer–Douglas–Peucker reduction on range-normalised values; only keys
 * inside the take's time range are replaced. Live preview uses a transient, non-saved `_pv` override. */
import { R } from './runtime';
import { $ } from './dom';
import { BASEK } from './effects/index';
import { sel } from './state';
import { SMOOTH_E, delKey, hasK, keyVal, seekTo, setKey } from './evaluation';
import { setPlay } from './transport';
import { commit } from './history';
import { renderInsp } from './inspector';
import { markDirty } from './loop';
import { toast } from './modals';

export interface Sample { t: number; x: number; y: number }
/** A multi-component sample: v[i] belongs to take.objs[i]. */
export interface MSample { t: number; v: number[] }
R.perform = false; R.perfSmooth = 0.5; R.lastTake = null;

function gaussN(S: MSample[], sigma: number): MSample[] {
  if (sigma <= 1e-4 || S.length < 3) return S.map(s => ({ t: s.t, v: [...s.v] }));
  const t0 = S[0].t, t1 = S[S.length - 1].t, C = S[0].v.length;
  return S.map(s => { const sg = Math.max(1e-4, Math.min(sigma, (s.t - t0) / 2, (t1 - s.t) / 2)); // narrower near the ends: no one-sided pull
    if (sg <= 1e-4) return { t: s.t, v: [...s.v] };
    const acc = new Array(C).fill(0); let w = 0;
    for (const q of S) { const d = (q.t - s.t) / sg; if (d * d > 9) continue; const k = Math.exp(-0.5 * d * d); for (let c = 0; c < C; c++) acc[c] += q.v[c] * k; w += k; }
    return { t: s.t, v: acc.map(a => a / w) }; });
}
/** RDP against linear interpolation in time; `sc` = per-component scale (distance is measured in value / sc). */
function rdpN(S: MSample[], eps: number, sc: number[]): MSample[] {
  if (S.length < 3) return S;
  const keep = new Uint8Array(S.length); keep[0] = keep[S.length - 1] = 1;
  const stack: [number, number][] = [[0, S.length - 1]];
  while (stack.length) { const [a, b] = stack.pop()!; let best = -1, bd = eps;
    for (let i = a + 1; i < b; i++) { const u = (S[i].t - S[a].t) / Math.max(1e-6, S[b].t - S[a].t); let d2 = 0;
      for (let c = 0; c < sc.length; c++) { const dv = (S[i].v[c] - (S[a].v[c] + (S[b].v[c] - S[a].v[c]) * u)) / sc[c]; d2 += dv * dv; }
      const d = Math.sqrt(d2); if (d > bd) { bd = d; best = i; } }
    if (best > 0) { keep[best] = 1; stack.push([a, best], [best, b]); } }
  return S.filter((_, i) => keep[i]);
}
/** Gesture → key samples. smooth ∈ [0,1]: 0 = raw (dense), 1 = very smooth and sparse. */
export function smoothTakeN(S: MSample[], smooth: number, sc: number[]) { return rdpN(gaussN(S, smooth * 0.22), 0.0015 + smooth * 0.02, sc); }
/** 2D (x/y) form kept for the M5 API. */
export function smoothTake(S: Sample[], smooth: number) {
  return smoothTakeN(S.map(s => ({ t: s.t, v: [s.x, s.y] })), smooth, [1, 1]).map(s => ({ t: s.t, x: s.v[0], y: s.v[1] }));
}
/** Write a take into its params, replacing only keys inside [t0, t1]. Returns the number of keys per param. */
export function applyTakeN(objs: any[], S: MSample[], smooth: number, sc: number[]) {
  if (S.length < 2) return 0;
  const t0 = S[0].t, t1 = S[S.length - 1].t, pts = smoothTakeN(S, smooth, sc);
  for (const n of objs) if (hasK(n)) for (let i = n.k.length - 1; i >= 0; i--) if (n.k[i].t >= t0 - 1e-6 && n.k[i].t <= t1 + 1e-6) delKey(n, i);
  for (const p of pts) objs.forEach((n, c) => setKey(n, p.t, p.v[c]));
  for (const n of objs) for (const q of n.k) if (q.t >= t0 - 1e-6 && q.t <= t1 + 1e-6) q.e = SMOOTH_E; // pass-through curve: follows the gesture without corners or a stop at every key
  return pts.length;
}
/** Position take of layer L (M5 API). */
export function applyTake(L: any, S: Sample[], smooth: number) {
  return applyTakeN([L.n.x, L.n.y], S.map(s => ({ t: s.t, v: [s.x, s.y] })), smooth, [1, 1]);
}

/* ----- live gesture ----- */
let gest: any = null;   // pointer is down while armed
let take: any = null;   // a take is running (first value change happened)
/** Range of a param for normalising the smoothing: the slider's own range, the layer placement range, else 1. */
function scaleOf(n: any) {
  const c = (R.liveCtl || []).find((x: any) => x.obj === n); if (c && c.d.max > c.d.min) return c.d.max - c.d.min;
  const L = sel(); if (L) { if (n === L.n.x || n === L.n.y) return 1; for (const k in L.n) if (L.n[k] === n && BASEK[k]) return (BASEK[k].max - BASEK[k].min) / 2; }
  return 1;
}
const valAt = (n: any, t: number) => hasK(n) ? keyVal(n.k, t) : n.v;
/** setVal hook: while a gesture is armed, value edits go into the take instead of the project. */
R.perfHook = null;
function hook(n: any, v: number) {
  if (!gest || typeof v !== 'number' || !isFinite(v)) return false;
  if (!take) { take = { objs: [], sc: [], base: [], cur: [], t0: R.time, S: [] as MSample[] }; if (!R.playing) setPlay(true); }
  let c = take.objs.indexOf(n);
  if (c < 0) { c = take.objs.length; take.objs.push(n); take.sc.push(scaleOf(n)); const b = valAt(n, take.t0); take.base.push(b); take.cur.push(b);
    for (const s of take.S) s.v.push(b); if (!take.S.length) take.S.push({ t: take.t0, v: [...take.cur] }); }
  take.cur[c] = v;
  const last = take.S[take.S.length - 1];
  if (R.time > last.t + 1e-4) take.S.push({ t: R.time, v: [...take.cur] }); else if (take.S.length > 1) last.v = [...take.cur];
  Object.defineProperty(n, '_pv', { value: v, configurable: true, writable: true, enumerable: false });
  markDirty(); return true;
}
function finish() {
  gest = null; R.perfHook = null; if (!take) return;
  const T = take; take = null; setPlay(false);
  for (const n of T.objs) delete n._pv;
  if (T.S.length < 3) { seekTo(T.t0); markDirty(); toast('Gesture too short: hold it down and keep moving a little longer.'); return; }
  const n = applyTakeN(T.objs, T.S, R.perfSmooth, T.sc); const L = sel();
  R.lastTake = { id: L && L.id, objs: T.objs, S: T.S, sc: T.sc }; seekTo(T.t0); commit(); renderInsp();
  toast(`Performed: ${(T.S[T.S.length - 1].t - T.S[0].t).toFixed(1)} s → ${n} keyframes${T.objs.length > 1 ? ' per parameter' : ''} (smoothing ${Math.round(R.perfSmooth * 100)}%). The playhead jumped back to the start of the take; you can smooth it afterwards with the slider.`);
}
document.addEventListener('pointerdown', (e: PointerEvent) => { if (!R.perform || e.button !== 0) return; if ((e.target as HTMLElement).closest('#perfBtn,#perfSmooth,#playBtn')) return; gest = { id: e.pointerId }; R.perfHook = hook; }, { capture: true });
document.addEventListener('pointerup', () => { if (gest) finish(); }, { capture: true });
document.addEventListener('pointercancel', () => { if (gest) finish(); }, { capture: true });

export function setPerform(on: boolean) { R.perform = on; $('#perfBtn').setAttribute('aria-pressed', String(on)); $('#perfSmooth').hidden = !on;
  if (on) { if (R.playing) setPlay(false); toast('Perform armed: playback is stopped. Grab something (a layer on the canvas, a slider, a number): playback and recording start on the first move and stop when you release. Turn off: E.'); } }
$('#perfBtn').onclick = () => setPerform(!R.perform);
$('#perfSmooth').oninput = (e: any) => { R.perfSmooth = +e.target.value; const T = R.lastTake;
  if (T && T.objs) { applyTakeN(T.objs, T.S, R.perfSmooth, T.sc); markDirty(); } };
$('#perfSmooth').onchange = () => { if (R.lastTake) commit(); };
export const perfState = () => ({ armed: !!gest, recording: !!take, comps: take ? take.objs.length : 0 });

/* M5 · Eljátszás simítással: record a drag of the selected layer while the scene plays, turn it into position keys.
 * The raw take is kept, so the Simítás slider re-builds the keys from the same gesture (no re-take needed).
 * Smoothing = Gaussian over time (σ grows with Simítás) + Ramer–Douglas–Peucker reduction; only keys inside the take's
 * time range are replaced, everything before/after stays. Live preview uses a transient, non-saved `_pv` override. */
import { R } from './runtime';
import { $ } from './dom';
import { sel } from './state';
import { curV, delKey, hasK, setKey } from './evaluation';
import { toAsp } from './stage';
import { setPlay } from './transport';
import { commit } from './history';
import { renderInsp } from './inspector';
import { markDirty } from './loop';
import { toast } from './modals';

export interface Sample { t: number; x: number; y: number }
R.perform = false; R.perfSmooth = 0.5; R.lastTake = null;

function gauss(S: Sample[], sigma: number): Sample[] {
  if (sigma <= 1e-4 || S.length < 3) return S.map(s => ({ ...s }));
  const t0 = S[0].t, t1 = S[S.length - 1].t;
  return S.map(s => { const sg = Math.max(1e-4, Math.min(sigma, (s.t - t0) / 2, (t1 - s.t) / 2)); // narrower near the ends: no one-sided pull
    if (sg <= 1e-4) return { ...s };
    let wx = 0, wy = 0, w = 0; for (const q of S) { const d = (q.t - s.t) / sg; if (d * d > 9) continue; const k = Math.exp(-0.5 * d * d); wx += q.x * k; wy += q.y * k; w += k; } return { t: s.t, x: wx / w, y: wy / w }; });
}
function rdp(S: Sample[], eps: number, tScale: number): Sample[] {
  if (S.length < 3) return S;
  const keep = new Uint8Array(S.length); keep[0] = keep[S.length - 1] = 1;
  const st: [number, number][] = [[0, S.length - 1]];
  while (st.length) { const [a, b] = st.pop()!; let best = -1, bd = eps;
    for (let i = a + 1; i < b; i++) { const u = (S[i].t - S[a].t) / Math.max(1e-6, S[b].t - S[a].t); // distance to the linear interpolation
      const dx = S[i].x - (S[a].x + (S[b].x - S[a].x) * u), dy = S[i].y - (S[a].y + (S[b].y - S[a].y) * u), d = Math.hypot(dx, dy) + 0 * tScale;
      if (d > bd) { bd = d; best = i; } }
    if (best > 0) { keep[best] = 1; st.push([a, best], [best, b]); } }
  return S.filter((_, i) => keep[i]);
}
/** Gesture → key samples. smooth ∈ [0,1]: 0 = raw (dense), 1 = very smooth and sparse. */
export function smoothTake(S: Sample[], smooth: number) {
  const g = gauss(S, smooth * 0.22), eps = 0.0015 + smooth * 0.02;
  return rdp(g, eps, 1);
}
/** Write a take into L's position keys, replacing only keys inside [t0, t1]. */
export function applyTake(L: any, S: Sample[], smooth: number) {
  if (S.length < 2) return 0;
  const t0 = S[0].t, t1 = S[S.length - 1].t, pts = smoothTake(S, smooth);
  for (const k of ['x', 'y']) { const n = L.n[k]; if (hasK(n)) for (let i = n.k.length - 1; i >= 0; i--) if (n.k[i].t >= t0 - 1e-6 && n.k[i].t <= t1 + 1e-6) delKey(n, i); }
  for (const p of pts) { setKey(L.n.x, p.t, p.x); setKey(L.n.y, p.t, p.y); }
  const LIN = 4; // performed keys are dense: linear segments follow the gesture; an eased curve would stop at every key
  for (const k of ['x', 'y']) for (const q of L.n[k].k) if (q.t >= t0 - 1e-6 && q.t <= t1 + 1e-6) q.e = LIN;
  return pts.length;
}

let take: any = null;
const wrap = $('#wrap');
wrap.addEventListener('pointerdown', (e: PointerEvent) => {
  if (!R.perform || e.button !== 0 || (e.target as HTMLElement).closest('.hudbar,.hud,.tl') || (e.target as HTMLElement).dataset.h) return;
  const L = sel(); if (!L) return;
  e.stopImmediatePropagation(); e.preventDefault(); try { wrap.setPointerCapture(e.pointerId); } catch (_) { /* synthetic events */ }
  if (!R.playing) setPlay(true);
  const p = toAsp(e); take = { L, p0: p, x0: curV(L.n.x), y0: curV(L.n.y), S: [{ t: R.time, x: curV(L.n.x), y: curV(L.n.y) }] };
}, { capture: true });
wrap.addEventListener('pointermove', (e: PointerEvent) => {
  if (!take) return; const p = toAsp(e), L = take.L, x = take.x0 + (p.x - take.p0.x), y = take.y0 + (p.y - take.p0.y);
  const last = take.S[take.S.length - 1]; if (R.time > last.t + 1e-4) take.S.push({ t: R.time, x, y });
  for (const [k, v] of [['x', x], ['y', y]] as const) Object.defineProperty(L.n[k], '_pv', { value: v, configurable: true, writable: true, enumerable: false });
  markDirty();
}, { capture: true });
const finish = () => {
  if (!take) return; const { L, S } = take; take = null; delete L.n.x._pv; delete L.n.y._pv;
  if (S.length < 3) { toast('Túl rövid mozdulat. Tartsd lenyomva, és mozgasd lejátszás közben.'); return; }
  const n = applyTake(L, S, R.perfSmooth); R.lastTake = { id: L.id, S }; commit(); renderInsp();
  toast(`Eljátszva: ${(S[S.length - 1].t - S[0].t).toFixed(1)} mp → ${n} kulcskocka (simítás ${Math.round(R.perfSmooth * 100)}%). A csúszkával utólag is simíthatsz.`);
};
wrap.addEventListener('pointerup', () => finish(), { capture: true }); wrap.addEventListener('pointercancel', () => finish(), { capture: true });

export function setPerform(on: boolean) { R.perform = on; $('#perfBtn').setAttribute('aria-pressed', String(on)); $('#perfSmooth').hidden = !on;
  if (on) toast('Eljátszás: húzd a kijelölt réteget, a lejátszás elindul, a mozdulatból kulcskockák lesznek. Kikapcsolás: E.'); }
$('#perfBtn').onclick = () => setPerform(!R.perform);
$('#perfSmooth').oninput = (e: any) => { R.perfSmooth = +e.target.value; const T = R.lastTake, L = sel();
  if (T && L && L.id === T.id) { applyTake(L, T.S, R.perfSmooth); markDirty(); } };
$('#perfSmooth').onchange = () => { if (R.lastTake) commit(); };

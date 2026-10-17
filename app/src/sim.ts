/* Shared scene clock for stateful layers (feedback / "Visszhang", blob tracking).
 *
 * Contract (Vel "egy közös idő"):
 *  - Stateless layers are a pure function of scene time t.
 *  - Stateful layers advance only on a fixed SIM_HZ grid. Their state at t is the result of the
 *    grid ticks in (start, t], where start = max(0, t - WARM) after a reset (seek, loop wrap, export start).
 *  - exact = true  (export, still image, paused seek/edit refinement): every grid tick is simulated, the
 *    displayed frame is composed at t without advancing state again. Same request sequence -> same pixels.
 *  - exact = false (live preview): at most PREVIEW_CAP ticks per displayed frame; the displayed frame itself
 *    counts as the last tick. Faster, may lag behind exact; ctx.approx tells the HUD.
 */
import { EFFECTS } from './effects/index';
import { clearTarget } from './gl';
import { renderScene } from './render';
import { resetBlobs } from './blob';
import { R } from './runtime';
import { st } from './state';

/** What the canvas / export shows at clock t: the workbench, or (Jelenetsor) the scene sequence with its local time. */
export function frameAt(t: number): { items: any[]; t: number } { const f = R.seqPlay && R.seqFrame ? R.seqFrame(t) : null; return f ? { items: f.items, t: f.t } : { items: st.layers, t }; }

export const SIM_HZ = 60;
export const STEP = 1 / SIM_HZ;
export const WARM = 3;          // seconds of pre-roll after a reset
const PREVIEW_CAP = 2;
const EPS = 1e-7;
export const tickOf = (t: number) => Math.floor(t * SIM_HZ + 1e-6);

/** feedback ("Visszhang") and blob tracking keep history between frames */
const stateful = (type: string) => !!(EFFECTS[type] && (EFFECTS[type].feedback || EFFECTS[type].blob));

function hasState(items: any[]): boolean {
  for (const L of items) {
    if (!L || L.vis === false) continue;
    if (stateful(L.type)) return true;
    if ((L.fx || []).some((f: any) => f.vis !== false && stateful(f.type))) return true;
    if (L.type === 'group' && hasState(L.children || [])) return true;
  }
  return false;
}
export const sceneHasState = hasState;

/** Drop all stateful history of a render context (seek, loop wrap, export start). */
export function resetSim(ctx: any) {
  if (!ctx) return;
  for (const x of ctx.hist.values()) { clearTarget(x.cur); clearTarget(x.next); x.stepped = false; }
  resetBlobs(ctx);
  ctx.simT = null;
}

function step(items: any[], ctx: any, t: number, bg: string) {
  ctx.advance = true; const out = renderScene(items, ctx, t, bg); return out;
}

/** Render the scene at time t, advancing stateful layers along the fixed grid. Returns the scene target. */
export function renderAt(items: any[], ctx: any, t: number, bg: string, exact: boolean) {
  ctx.approx = false;
  if (!hasState(items)) { ctx.simT = t; ctx.advance = true; return renderScene(items, ctx, t, bg); }
  let s: number | null = ctx.simT;
  const far = exact ? WARM : 0.5;
  if (s == null || t < s - EPS || t - s > far) {
    resetSim(ctx);
    if (!exact) { const out = step(items, ctx, t, bg); ctx.simT = t; return out; }
    const k0 = tickOf(Math.max(0, t - WARM));
    step(items, ctx, k0 * STEP, bg); s = k0 * STEP;
  }
  const kEnd = tickOf(t);
  let k = tickOf(s) + 1;
  if (exact) {
    for (; k <= kEnd; k++) step(items, ctx, k * STEP, bg);
    ctx.simT = Math.max(s, kEnd * STEP);
    // compose at t without advancing again (state = state at tick(t))
    ctx.advance = false; const out = renderScene(items, ctx, t, bg); ctx.advance = true;
    return out;
  }
  let n = 0;
  for (; k < kEnd && n < PREVIEW_CAP; k++, n++) step(items, ctx, k * STEP, bg);
  if (k < kEnd) ctx.approx = true;
  const adv = kEnd > tickOf(s);
  ctx.advance = adv; const out = renderScene(items, ctx, t, bg); ctx.advance = true;
  if (adv) ctx.simT = t;
  return out;
}

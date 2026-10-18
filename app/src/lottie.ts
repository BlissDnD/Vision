/** Seekable Lottie Canvas → WebGL adapter; one paused player per asset and render size. */
import lottie from 'lottie-web/build/player/lottie_light_canvas';
import { BLANK, gl, texFromCanvas } from './gl';
import { BASEK } from './effects/index';
import { ev } from './evaluation';
import { vectorAssets } from './state';
import { markDirty } from './loop';
import { parseVectorLottie, sampleLottieFrame } from './lottieCore';

type Entry = { canvas: HTMLCanvasElement; player: any; ready: boolean; frame: number | null; tex: WebGLTexture | null; w: number; h: number };
const parsed = new Map<string, { source: string; data: any; meta: any }>();
const entries = new Map<string, Entry>();
const MAX_PLAYERS = 8;
const MAX_CACHE_PIXELS = 12_000_000;
export const createLottiePlayer = (canvas: HTMLCanvasElement, data: any): any => lottie.loadAnimation({ renderer: 'canvas', autoplay: false, loop: false,
  animationData: structuredClone(data), rendererSettings: { context: canvas.getContext('2d'), clearCanvas: true, runExpressions: false } } as any);

export function clearLottieCache() {
  for (const e of entries.values()) { e.player.destroy(); if (e.tex) gl.deleteTexture(e.tex); }
  entries.clear(); parsed.clear();
}
export function lottieMeta(id: string) {
  const source = vectorAssets[id]; if (!source) return null;
  let p = parsed.get(id);
  if (!p || p.source !== source) { p = { source, ...parseVectorLottie(source) }; parsed.set(id, p); }
  return p;
}
function sizeFor(meta: any, L: any, ctx: any) {
  const scale = Math.max(.05, ev(L.n.s, BASEK.s, ctx.t ?? 0));
  const targetH = Math.max(64, Math.min(4096, Math.ceil((ctx.h || 512) * scale / 64) * 64));
  const ratio = meta.width / meta.height;
  const h = Math.min(targetH, Math.floor(4096 / ratio));
  return { w: Math.max(1, Math.round(h * ratio)), h: Math.max(1, h) };
}
function playerFor(id: string, w: number, h: number, data: any): Entry {
  const key = `${id}:${w}x${h}`;
  const old = entries.get(key);
  if (old) { entries.delete(key); entries.set(key, old); return old; }
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const entry: Entry = { canvas, player: null, ready: false, frame: null, tex: null, w, h };
  const player = createLottiePlayer(canvas, data);
  entry.player = player;
  entry.ready = !!player.isLoaded;
  player.addEventListener('DOMLoaded', () => { entry.ready = true; markDirty(); });
  player.addEventListener('data_ready', () => { entry.ready = true; markDirty(); });
  entries.set(key, entry);
  let pixels = [...entries.values()].reduce((n,e)=>n+e.w*e.h,0);
  while (entries.size > 1 && (entries.size > MAX_PLAYERS || pixels > MAX_CACHE_PIXELS)) {
    const [oldKey, stale] = entries.entries().next().value;
    entries.delete(oldKey); pixels -= stale.w*stale.h; stale.player.destroy(); if (stale.tex) gl.deleteTexture(stale.tex);
  }
  return entry;
}
export function lottieMediaFor(L: any, t: number, ctx: any) {
  try {
    const p = lottieMeta(L.asset); if (!p) return { tex: BLANK, w: 1, h: 1 };
    const media = L.media || { start: 0, speed: 1, loop: true };
    const frame = sampleLottieFrame(p.meta, t, media);
    if (frame == null) return { tex: BLANK, w: 1, h: 1 };
    const { w, h } = sizeFor(p.meta, L, { ...ctx, t });
    const entry = playerFor(L.asset, w, h, p.data);
    if (!entry.ready) return { tex: BLANK, w, h };
    const f = Math.floor(frame + 1e-6);
    if (entry.frame !== f || !entry.tex) {
      // lottie-web's goToAndStop is relative to animationData.ip (it adds firstFrame when rendering).
      entry.player.goToAndStop(f - p.meta.ip, true);
      entry.tex = texFromCanvas(entry.canvas, entry.tex);
      entry.frame = f;
    }
    return { tex: entry.tex, w, h };
  } catch (e) { console.warn('Lottie render:', e); return { tex: BLANK, w: 1, h: 1 }; }
}

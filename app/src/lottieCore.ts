/** Strict, vector-only Lottie input and scene-time sampling. No browser or renderer dependency. */
export const LOTTIE_LIMITS = { bytes: 2_000_000, nodes: 100_000, depth: 80, dimension: 4096, frames: 18_000, fps: 120 };
export interface LottieMeta { width: number; height: number; fps: number; ip: number; op: number; duration: number }
const inRange = (v: unknown, lo: number, hi: number, name: string): number => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < lo || v > hi) throw new RangeError(`Invalid ${name}.`);
  return v;
};
export function isLottieJSON(o: any): boolean {
  return !!o && typeof o === 'object' && !o.app && !o.state && !o.kind &&
    typeof o.v === 'string' && Array.isArray(o.layers) &&
    ['fr', 'ip', 'op', 'w', 'h'].every(k => typeof o[k] === 'number');
}
export function parseVectorLottie(source: string): { data: any; meta: LottieMeta } {
  if (typeof source !== 'string' || new TextEncoder().encode(source).byteLength > LOTTIE_LIMITS.bytes)
    throw new RangeError('A Lottie file can be at most 2 MB.');
  let data: any;
  try { data = JSON.parse(source); } catch { throw new TypeError('Invalid Lottie JSON.'); }
  if (!isLottieJSON(data)) throw new TypeError('This is not a Lottie animation.');
  if (data.segments) throw new TypeError('External Lottie segments cannot be imported.');
  const width = inRange(data.w, 1, LOTTIE_LIMITS.dimension, 'width');
  const height = inRange(data.h, 1, LOTTIE_LIMITS.dimension, 'height');
  const fps = inRange(data.fr, 1, LOTTIE_LIMITS.fps, 'frame count');
  const ip = inRange(data.ip, -LOTTIE_LIMITS.frames, LOTTIE_LIMITS.frames, 'first frame');
  const op = inRange(data.op, ip + .001, ip + LOTTIE_LIMITS.frames, 'last frame');
  if (!data.layers.length) throw new TypeError('The Lottie contains no layer.');
  let count = 0;
  const stack = [{ value: data, depth: 0 }];
  while (stack.length) {
    const { value, depth } = stack.pop();
    if (++count > LOTTIE_LIMITS.nodes || depth > LOTTIE_LIMITS.depth)
      throw new RangeError('The Lottie is too complex for this import.');
    if (!value || typeof value !== 'object') continue;
    for (const [key, child] of Object.entries(value)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') throw new TypeError('Unsafe Lottie key.');
      if (key === 'x' && typeof child === 'string' && child.trim()) throw new TypeError('A Lottie containing expressions cannot be imported.');
      if (key === 'layers' && Array.isArray(child) && child.some((layer: any) => ![0, 1, 3, 4].includes(layer?.ty)))
        throw new TypeError('Only vector layers are supported here; images and text are not.');
      if (key === 'assets' && Array.isArray(child) && child.some((asset: any) => asset && (asset.p || asset.u)))
        throw new TypeError('A Lottie with external or embedded images cannot be imported.');
      if (child && typeof child === 'object') stack.push({ value: child, depth: depth + 1 });
    }
  }
  if (Array.isArray(data.fonts?.list) && data.fonts.list.length) throw new TypeError('A Lottie with fonts cannot be imported.');
  return { data, meta: { width, height, fps, ip, op, duration: (op - ip) / fps } };
}
export function sampleLottieFrame(meta: LottieMeta, sceneTime: number, media: { start: number; speed: number; loop: boolean }): number | null {
  if (![meta.ip, meta.op, meta.fps, sceneTime, media.start, media.speed].every(Number.isFinite) ||
      meta.op <= meta.ip || meta.fps <= 0 || media.speed < 0) throw new RangeError('Invalid Lottie timing.');
  const local = sceneTime - media.start;
  if (local < 0) return null;
  const span = meta.op - meta.ip;
  const offset = local * meta.fps * media.speed;
  return meta.ip + (media.loop ? ((offset % span) + span) % span : Math.min(offset, span - .001));
}

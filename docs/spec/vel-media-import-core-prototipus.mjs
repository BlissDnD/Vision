// Standalone, dependency-free preparation for a future Vel media importer.
// This validates a deliberately narrow vector-only Lottie subset; it does not render media.
const DEFAULT_LIMITS = Object.freeze({ bytes: 2_000_000, nodes: 100_000, depth: 80, dimension: 4096, frames: 18_000, fps: 120 });

function finiteRange(value, min, max, name) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`Invalid ${name}`);
  return value;
}

export function parseVectorLottie(source, limits = DEFAULT_LIMITS) {
  if (typeof source !== 'string' || new TextEncoder().encode(source).byteLength > limits.bytes) {
    throw new RangeError('Lottie JSON exceeds size limit');
  }
  let data;
  try { data = JSON.parse(source); } catch { throw new TypeError('Invalid Lottie JSON'); }
  if (!data || Array.isArray(data) || typeof data !== 'object') throw new TypeError('Lottie root must be an object');
  const width = finiteRange(data.w, 1, limits.dimension, 'width');
  const height = finiteRange(data.h, 1, limits.dimension, 'height');
  const fps = finiteRange(data.fr, 1, limits.fps, 'fps');
  const ip = finiteRange(data.ip, -limits.frames, limits.frames, 'first frame');
  const op = finiteRange(data.op, ip + 0.001, ip + limits.frames, 'last frame');
  if (!Array.isArray(data.layers) || data.layers.length === 0) throw new TypeError('No Lottie layers');

  let count = 0;
  const stack = [{ value: data, depth: 0 }];
  while (stack.length) {
    const { value, depth } = stack.pop();
    if (++count > limits.nodes || depth > limits.depth) throw new RangeError('Lottie structure exceeds complexity limit');
    if (!value || typeof value !== 'object') continue;
    for (const [key, child] of Object.entries(value)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') throw new TypeError('Unsafe Lottie key');
      if (key === 'x' && typeof child === 'string' && child.trim()) throw new TypeError('Lottie expressions are not supported');
      if (key === 'layers' && Array.isArray(child) && child.some(layer => layer?.ty === 5 || layer?.ty === 2)) {
        throw new TypeError('Lottie text and image layers are not supported in the first importer');
      }
      if (key === 'assets' && Array.isArray(child) && child.some(asset => asset && (asset.p || asset.u))) {
        throw new TypeError('External or embedded image assets are not supported in the first importer');
      }
      if (child && typeof child === 'object') stack.push({ value: child, depth: depth + 1 });
    }
  }
  if (Array.isArray(data.fonts?.list) && data.fonts.list.length) throw new TypeError('External fonts are not supported');
  return { data, meta: { width, height, fps, ip, op, duration: (op - ip) / fps } };
}

const positiveModulo = (value, span) => ((value % span) + span) % span;

/** Frame depends only on scene time. null means the clip has not started yet. */
export function sampleLottieFrame(meta, sceneTime, { layerStart = 0, speed = 1, loop = false } = {}) {
  if (![meta?.ip, meta?.op, meta?.fps, sceneTime, layerStart, speed].every(Number.isFinite) ||
      meta.op <= meta.ip || meta.fps <= 0 || speed < 0) throw new RangeError('Invalid Lottie timing');
  const localTime = sceneTime - layerStart;
  if (localTime < 0) return null;
  const span = meta.op - meta.ip;
  const offset = localTime * meta.fps * speed;
  return meta.ip + (loop ? positiveModulo(offset, span) : Math.min(offset, span - 0.001));
}

/** Parse only known Imgur post/media URL shapes. Never fetches or grants reuse rights. */
export function parseImgurMediaUrl(input) {
  let url;
  try { url = new URL(input); } catch { throw new TypeError('Invalid Imgur URL'); }
  if (url.protocol !== 'https:' || !['imgur.com', 'www.imgur.com', 'i.imgur.com'].includes(url.hostname) ||
      url.port || url.username || url.password || url.search || url.hash) throw new TypeError('Unsupported Imgur URL');
  const direct = url.hostname === 'i.imgur.com';
  const match = direct ? /^\/([A-Za-z0-9]{5,16})\.(gif|gifv|mp4)$/i.exec(url.pathname) :
    /^\/(?:gallery\/)?([A-Za-z0-9]{5,16})\/?$/.exec(url.pathname);
  if (!match) throw new TypeError('Unsupported Imgur post or media path');
  return { id: match[1], format: direct ? match[2].toLowerCase() : 'post', postUrl: `https://imgur.com/${match[1]}` };
}

/** Validate and index variable GIF frame delays once, at import time. */
export function createTimedFrameIndex(durationsMs) {
  if (!Array.isArray(durationsMs) || !durationsMs.length || durationsMs.length > 5000 ||
      durationsMs.some(ms => !Number.isFinite(ms) || ms < 0 || ms > 60_000)) {
    throw new RangeError('Invalid timed media');
  }
  const ends = [];
  let totalMs = 0;
  for (const ms of durationsMs) { totalMs += Math.max(20, ms); ends.push(totalMs); }
  if (totalMs > 180_000) throw new RangeError('Timed media exceeds duration limit');
  return Object.freeze({ ends: Object.freeze(ends), totalMs });
}

/** Select a decoded GIF frame by Vel scene time. O(log frames) after one-time indexing. */
export function sampleTimedFrames(index, sceneTime, { layerStart = 0, speed = 1, loop = true } = {}) {
  if (!index || !Array.isArray(index.ends) || !(index.totalMs > 0) ||
      ![sceneTime, layerStart, speed].every(Number.isFinite) || speed < 0 || speed > 8) {
    throw new RangeError('Invalid timed media');
  }
  if (sceneTime < layerStart) return null;
  const elapsed = (sceneTime - layerStart) * speed * 1000;
  const target = loop ? positiveModulo(elapsed, index.totalMs) : Math.min(elapsed, index.totalMs - 0.001);
  let lo = 0, hi = index.ends.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (target < index.ends[mid]) hi = mid; else lo = mid + 1;
  }
  return lo;
}

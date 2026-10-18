/** Shared validation, deterministic sampling and resource ownership; no Vel imports. */
export function finite(value, name = "value") {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
}
export function bounded(value, min, max, name = "value") {
  finite(value, name);
  if (value < min || value > max)
    throw new RangeError(`${name} outside ${min}..${max}`);
  return value;
}
export function seeded(seed = 1) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function points2(points, min = 3) {
  if (
    !Array.isArray(points) ||
    points.length < min ||
    points.some((p) => p.length !== 2 || !p.every(Number.isFinite))
  )
    throw new TypeError(`Expected ${min}+ finite 2D points`);
  return points.map((p) => p.slice());
}
export function rgba(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new TypeError("Expected #rrggbb");
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}
export function owned(...resources) {
  let disposed = false;
  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const r of resources.reverse()) r?.dispose?.();
    },
  };
}
export function disposeObject(root) {
  const seen = new Set();
  root.traverse((o) => {
    o.userData?.disposeExtra?.();
    o.dispose?.();
    for (const r of [
      o.geometry,
      ...(Array.isArray(o.material) ? o.material : [o.material]),
    ])
      if (r && !seen.has(r)) {
        seen.add(r);
        r.dispose?.();
      }
  });
  root.removeFromParent();
}
/** Replay a stateful system on a fixed grid; seeking backward rebuilds it. */
export function fixedReplay(factory, { hz = 60, maxSeconds = 120 } = {}) {
  bounded(hz, 1, 240, "hz");
  let instance = factory(),
    tick = 0;
  return {
    seek(seconds) {
      bounded(seconds, 0, maxSeconds, "time");
      const target = Math.floor(seconds * hz + 1e-7);
      if (target < tick) {
        instance.dispose?.();
        instance = factory();
        tick = 0;
      }
      while (tick < target) {
        instance.step(1 / hz);
        tick++;
      }
      return instance;
    },
    get current() {
      return instance;
    },
    dispose() {
      instance.dispose?.();
    },
  };
}

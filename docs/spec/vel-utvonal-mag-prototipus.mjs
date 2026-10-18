// Standalone reference implementation for Vel's future editable path model.
// Not wired into the app. No third-party code or dependency.

const EPS = 1e-8;
const mod1 = x => ((x % 1) + 1) % 1;
const lerp = (a, b, t) => a + (b - a) * t;
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function segmentPoint(a, b, c, d, t) {
  // Uniform Catmull-Rom: passes through b and c without control handles.
  const t2 = t * t, t3 = t2 * t;
  return [0, 1, 2].map(i => 0.5 * (
    2 * b[i] + (-a[i] + c[i]) * t +
    (2 * a[i] - 5 * b[i] + 4 * c[i] - d[i]) * t2 +
    (-a[i] + 3 * b[i] - 3 * c[i] + d[i]) * t3
  ));
}

/**
 * points: >=2 finite [x,y,z] positions in Vel scene coordinates.
 * sample(u): u is travelled distance / total length, not control-point index.
 * Closed paths wrap; open paths clamp. No playback state or randomness.
 */
export function createArcPath(points, { closed = false, samplesPerSegment = 32 } = {}) {
  if (!Array.isArray(points) || points.length < 2 ||
      points.some(p => !Array.isArray(p) || p.length !== 3 || p.some(v => !Number.isFinite(v)))) {
    throw new TypeError('Expected at least two finite [x,y,z] points');
  }
  const p = points.map(v => v.slice());
  const count = closed ? p.length : p.length - 1;
  const resolution = Math.max(8, Math.min(256, Math.floor(samplesPerSegment)));
  const atIndex = i => closed ? p[(i % p.length + p.length) % p.length] : p[Math.max(0, Math.min(i, p.length - 1))];
  const rawPoint = s => {
    const segment = Math.min(Math.floor(s), count - 1);
    const t = Math.max(0, Math.min(1, s - segment));
    return segmentPoint(atIndex(segment - 1), atIndex(segment), atIndex(segment + 1), atIndex(segment + 2), t);
  };

  const table = [{ s: 0, length: 0 }];
  let previous = rawPoint(0), total = 0;
  for (let i = 1; i <= count * resolution; i++) {
    const s = i / resolution, next = rawPoint(s);
    total += distance(previous, next);
    table.push({ s, length: total });
    previous = next;
  }
  if (total <= EPS) throw new RangeError('Path has zero length');

  function sample(u) {
    const normalized = closed ? mod1(u) : Math.max(0, Math.min(1, u));
    const target = normalized * total;
    let lo = 0, hi = table.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (table[mid].length < target) lo = mid + 1; else hi = mid;
    }
    const right = table[lo], left = table[Math.max(0, lo - 1)];
    const f = right.length > left.length ? (target - left.length) / (right.length - left.length) : 0;
    return rawPoint(lerp(left.s, right.s, f));
  }

  function tangent(u) {
    const delta = 1 / (count * resolution * 8);
    const a = sample(u - delta), b = sample(u + delta);
    const length = distance(a, b);
    return length > EPS ? [(b[0] - a[0]) / length, (b[1] - a[1]) / length, (b[2] - a[2]) / length] : [1, 0, 0];
  }

  return Object.freeze({ closed, length: total, sample, tangent });
}

/** Stable arrangement for gallery cards or text items along a path. */
export function distributeOnPath(path, count, { start = 0, span = 1 } = {}) {
  if (!Number.isInteger(count) || count < 0) throw new RangeError('count must be a nonnegative integer');
  return Array.from({ length: count }, (_, i) => {
    const u = start + span * i / (path.closed ? Math.max(count, 1) : Math.max(count - 1, 1));
    return { u, position: path.sample(u), tangent: path.tangent(u) };
  });
}

/** Camera pose derived only from scene time; scrub/export give the same result. */
export function cameraOnPath(path, sceneTime, { startTime = 0, duration = 5, lookAhead = 0.005, loop = path.closed } = {}) {
  if (!(duration > 0)) throw new RangeError('duration must be positive');
  const progress = (sceneTime - startTime) / duration;
  const u = loop ? mod1(progress) : Math.max(0, Math.min(1, progress));
  return { u, position: path.sample(u), target: path.sample(loop ? mod1(u + lookAhead) : Math.min(1, u + lookAhead)) };
}

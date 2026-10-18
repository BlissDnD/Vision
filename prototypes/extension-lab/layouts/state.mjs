/** Serializable layout controls and frame-independent motion. */
export const defaults = Object.freeze({
  threads: 26,
  segments: 20,
  height: 452,
  aspect: 0.75,
  gap: 0.11,
  radius: 20,
  speed: 95,
  offset: 0,
  zone: 0.26,
  zoneMax: 380,
  strength: 1,
  wobble: 1,
  seed: 0,
  background: "#ffffff",
  title: "WIDE",
  subtitle: "SIMPLICITY AND GEOMETRY",
  body: "Even chaos has its own rhythm and perfect order.",
  margin: 4,
  gutter: 2,
  titleSize: 22,
  duration: 1.4,
  composition: 0,
});
export const ranges = {
  threads: [4, 96, 1],
  segments: [4, 64, 1],
  height: [100, 1200, 1],
  aspect: [0.3, 2, 0.01],
  gap: [0, 0.6, 0.01],
  radius: [0, 100, 1],
  speed: [-600, 600, 1],
  offset: [-4000, 4000, 1],
  zone: [0.05, 0.49, 0.01],
  zoneMax: [50, 900, 1],
  strength: [0, 1, 0.01],
  wobble: [0, 3, 0.01],
  seed: [0, 100, 1],
  margin: [1, 12, 0.1],
  gutter: [0.2, 6, 0.1],
  titleSize: [10, 36, 0.1],
  duration: [0.2, 5, 0.1],
  composition: [0, 4, 1],
};
export function normalize(input = {}) {
  const out = { ...defaults };
  for (const [key, value] of Object.entries(input)) {
    if (key in ranges) {
      const [lo, hi, step] = ranges[key];
      if (!Number.isFinite(value)) continue;
      out[key] = Math.max(
        lo,
        Math.min(hi, step === 1 ? Math.round(value) : value),
      );
    } else if (
      ["title", "subtitle", "body"].includes(key) &&
      typeof value === "string"
    )
      out[key] = value.slice(0, 2000);
    else if (key === "background" && /^#[0-9a-f]{6}$/i.test(value))
      out[key] = value;
  }
  return out;
}
export const wrap = (x, span) => ((x % span) + span) % span;
export function travel(time, speed) {
  const t = Math.max(0, time - 0.35),
    d = 2.4;
  if (t >= d) return speed * (t - d / 4);
  const u = t / d;
  return speed * d * (u - (1 - (1 - u) ** 4) / 4);
}
export function strengthAt(time) {
  const x = Math.max(0, Math.min(1, (time - 0.2) / 1.8));
  return x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2;
}
export function frame(time, input) {
  const o = normalize(input);
  return {
    offset: o.offset + travel(time, o.speed),
    strength: o.strength * strengthAt(time),
  };
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import fitCurve from "fit-curve";
import { points2 } from "../core.mjs";
export function fit(samples, { error = 2 } = {}) {
  points2(
    samples.map((s) => [s.x, s.y]),
    2,
  );
  if (
    samples.some(
      (s, i) => !Number.isFinite(s.t) || (i && s.t < samples[i - 1].t),
    )
  )
    throw new Error("Nondecreasing finite sample times required");
  const curves = fitCurve(
    samples.map((s) => [s.x, s.y]),
    error,
  );
  return {
    v: 1,
    raw: samples.map((s) => ({ ...s })),
    curves,
    start: samples[0].t,
    end: samples.at(-1).t,
  };
}
export function create() {
  return fit(
    Array.from({ length: 32 }, (_, i) => ({
      t: i / 30,
      x: Math.cos((i / 31) * Math.PI),
      y: Math.sin((i / 31) * Math.PI),
    })),
    { error: 0.01 },
  );
}

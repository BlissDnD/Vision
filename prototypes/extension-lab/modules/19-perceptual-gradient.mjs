/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { interpolate, formatHex, clampRgb } from "culori";
import { bounded } from "../core.mjs";
export function gradient(colors, { steps = 8, space = "oklch" } = {}) {
  bounded(steps, 2, 256, "steps");
  if (colors.length < 2) throw new Error("Two colors required");
  const mix = interpolate(colors, space);
  return Array.from({ length: steps }, (_, i) =>
    formatHex(clampRgb(mix(i / (steps - 1)))),
  );
}
export function create() {
  return gradient(["#ff3355", "#2277ff"]);
}

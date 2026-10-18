/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import chroma from "chroma-js";
export function scale(colors, { steps = 8, mode = "lch" } = {}) {
  if (steps < 2 || steps > 256) throw new RangeError("steps 2..256");
  return chroma.scale(colors).mode(mode).colors(steps);
}
export function contrast(a, b) {
  return chroma.contrast(a, b);
}
export function create() {
  return {
    colors: scale(["#122244", "#ffccaa"]),
    contrast: contrast("#ffffff", "#111111"),
  };
}

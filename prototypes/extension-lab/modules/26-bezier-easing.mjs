/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import BezierEasing from "bezier-easing";
export function curve([x1, y1, x2, y2] = [0.25, 0.1, 0.25, 1]) {
  if (![x1, y1, x2, y2].every(Number.isFinite))
    throw new TypeError("Finite control points required");
  return BezierEasing(x1, y1, x2, y2);
}
export function create() {
  const fn = curve();
  return Array.from({ length: 21 }, (_, i) => [i / 20, fn(i / 20)]);
}

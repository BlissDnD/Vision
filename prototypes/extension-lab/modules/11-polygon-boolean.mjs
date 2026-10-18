/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import clipping from "polygon-clipping";
import { points2 } from "../core.mjs";
export function combine(a, b, operation = "difference") {
  points2(a);
  points2(b);
  if (!["union", "intersection", "difference", "xor"].includes(operation))
    throw new Error("Unsupported operation");
  return clipping[operation]([a], [b]);
}
export function create() {
  return combine(
    [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ],
    [
      [1, -1],
      [3, -1],
      [3, 1],
      [1, 1],
    ],
  );
}

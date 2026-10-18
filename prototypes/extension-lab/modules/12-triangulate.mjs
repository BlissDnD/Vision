/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import earcut from "earcut";
import { points2 } from "../core.mjs";
export function triangulate(outer, holes = []) {
  points2(outer);
  holes.forEach((h) => points2(h));
  const rings = [outer, ...holes],
    vertices = rings.flat(2),
    indices = [];
  let count = outer.length;
  for (const h of holes) {
    indices.push(count);
    count += h.length;
  }
  return { vertices, indices: earcut(vertices, indices, 2) };
}
export function create() {
  return triangulate(
    [
      [0, 0],
      [3, 0],
      [3, 3],
      [0, 3],
    ],
    [
      [
        [1, 1],
        [1, 2],
        [2, 2],
        [2, 1],
      ],
    ],
  );
}

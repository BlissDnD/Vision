/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Delaunay } from "d3-delaunay";
import { seeded, bounded } from "../core.mjs";
export function cells({ count = 20, seed = 1, width = 1, height = 1 } = {}) {
  bounded(count, 2, 1000, "count");
  const rng = seeded(seed),
    points = Array.from({ length: count }, () => [
      rng() * width,
      rng() * height,
    ]);
  const d = Delaunay.from(points),
    v = d.voronoi([0, 0, width, height]);
  return points.map((point, i) => ({
    point,
    polygon: v.cellPolygon(i)?.map((p) => Array.from(p)) || [],
    neighbors: Array.from(d.neighbors(i)),
  }));
}
export const create = cells;

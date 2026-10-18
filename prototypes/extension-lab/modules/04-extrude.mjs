/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Shape, ExtrudeGeometry, Mesh, MeshStandardMaterial } from "three";
import { points2, bounded } from "../core.mjs";
export function extrude(points, { depth = 0.3, bevel = 0.04 } = {}) {
  points2(points);
  bounded(depth, 0.001, 10, "depth");
  bounded(bevel, 0, 1, "bevel");
  const s = new Shape();
  s.moveTo(...points[0]);
  for (const p of points.slice(1)) s.lineTo(...p);
  s.closePath();
  return new ExtrudeGeometry(s, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    steps: 1,
  });
}
export function create(options = {}) {
  return new Mesh(
    extrude(
      [
        [-0.8, -0.5],
        [0.8, -0.5],
        [0.4, 0.5],
        [0, 0.1],
        [-0.4, 0.5],
      ],
      options,
    ),
    new MeshStandardMaterial({
      color: 0xaaffbb,
      metalness: 0.5,
      roughness: 0.3,
    }),
  );
}

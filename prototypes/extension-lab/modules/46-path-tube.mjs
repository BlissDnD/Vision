/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  CatmullRomCurve3,
  Vector3,
  TubeGeometry,
  Mesh,
  MeshStandardMaterial,
} from "three";
export function tube(
  points,
  { radius = 0.06, segments = 96, closed = false } = {},
) {
  if (points.length < 2 || radius <= 0 || segments > 512)
    throw new Error("Invalid tube settings");
  const path = new CatmullRomCurve3(
    points.map((p) => new Vector3(...p)),
    closed,
  );
  return new TubeGeometry(path, segments, radius, 8, closed);
}
export function create() {
  return new Mesh(
    tube([
      [-1, -0.5, 0],
      [-0.5, 0.7, 0.3],
      [0.5, -0.7, -0.3],
      [1, 0.5, 0],
    ]),
    new MeshStandardMaterial({
      color: 0xffbb66,
      metalness: 0.6,
      roughness: 0.2,
    }),
  );
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  CatmullRomCurve3,
  Vector3,
} from "three";
import { Flow } from "three/addons/modifiers/CurveModifier.js";
export function bend(mesh, points) {
  const flow = new Flow(mesh);
  flow.updateCurve(
    0,
    new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
  );
  let previous = 0;
  return {
    object: flow.object3D,
    seek(t) {
      const u = ((t % 1) + 1) % 1;
      flow.moveAlongCurve(u - previous);
      previous = u;
    },
    dispose() {
      flow.object3D.traverse((o) => o.geometry?.dispose());
    },
  };
}
export function create() {
  const input = new Mesh(
    new BoxGeometry(1, 0.2, 0.2, 32, 1, 1),
    new MeshStandardMaterial({ color: 0xffaacc }),
  );
  const f = bend(input, [
    [-2, 0, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [2, 0, 0],
  ]);
  input.geometry.dispose();
  f.object.userData.seek = (t) => f.seek(t * 0.15);
  return f.object;
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  InstancedMesh,
  IcosahedronGeometry,
  MeshStandardMaterial,
  Object3D,
} from "three";
import { seeded, bounded } from "../core.mjs";
export function create({ count = 400, seed = 1 } = {}) {
  bounded(count, 1, 10000, "count");
  const mesh = new InstancedMesh(
      new IcosahedronGeometry(0.06, 0),
      new MeshStandardMaterial({ color: 0x99ffcc }),
      count,
    ),
    o = new Object3D(),
    rng = seeded(seed);
  for (let i = 0; i < count; i++) {
    o.position.set((rng() - 0.5) * 4, (rng() - 0.5) * 4, (rng() - 0.5) * 4);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
  return mesh;
}

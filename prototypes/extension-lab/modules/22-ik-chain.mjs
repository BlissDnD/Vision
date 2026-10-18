/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  Bone,
  Skeleton,
  SkinnedMesh,
  CylinderGeometry,
  MeshStandardMaterial,
  Uint16BufferAttribute,
  Float32BufferAttribute,
  Vector3,
} from "three";
import { CCDIKSolver } from "three/addons/animation/CCDIKSolver.js";
export function create() {
  const geometry = new CylinderGeometry(0.12, 0.12, 2, 8, 8);
  geometry.translate(0, 1, 0);
  const ids = [],
    weights = [];
  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const y = geometry.attributes.position.getY(i);
    ids.push(y < 1 ? 0 : 1, 0, 0, 0);
    weights.push(1, 0, 0, 0);
  }
  geometry.setAttribute("skinIndex", new Uint16BufferAttribute(ids, 4));
  geometry.setAttribute("skinWeight", new Float32BufferAttribute(weights, 4));
  const root = new Bone(),
    mid = new Bone(),
    tip = new Bone(),
    target = new Bone();
  mid.position.y = 1;
  tip.position.y = 1;
  root.add(mid);
  mid.add(tip);
  target.position.set(1, 1.5, 0);
  const mesh = new SkinnedMesh(
    geometry,
    new MeshStandardMaterial({ color: 0x88ffaa }),
  );
  mesh.add(root, target);
  mesh.bind(new Skeleton([root, mid, tip, target]));
  const solver = new CCDIKSolver(mesh, [
    {
      target: 3,
      effector: 2,
      links: [{ index: 1 }, { index: 0 }],
      iteration: 12,
    },
  ]);
  mesh.userData.seek = (t) => {
    root.quaternion.identity();
    mid.quaternion.identity();
    tip.quaternion.identity();
    target.position.set(Math.sin(t), 1.4, Math.cos(t) * 0.5);
    mesh.updateMatrixWorld(true);
    solver.update();
  };
  mesh.userData.seek(0);
  return mesh;
}

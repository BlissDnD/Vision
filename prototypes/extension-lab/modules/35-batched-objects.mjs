/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  BatchedMesh,
  BoxGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  Matrix4,
} from "three";
export function create() {
  const box = new BoxGeometry(0.3, 0.3, 0.3),
    sphere = new SphereGeometry(0.2, 12, 8),
    mesh = new BatchedMesh(
      100,
      5000,
      15000,
      new MeshStandardMaterial({ color: 0xffcc88 }),
    );
  const ids = [mesh.addGeometry(box), mesh.addGeometry(sphere)];
  for (let i = 0; i < 50; i++) {
    const instance = mesh.addInstance(ids[i % 2]);
    mesh.setMatrixAt(
      instance,
      new Matrix4().makeTranslation(
        ((i % 10) - 4.5) * 0.4,
        (Math.floor(i / 10) - 2) * 0.4,
        0,
      ),
    );
  }
  box.dispose();
  sphere.dispose();
  return mesh;
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Group, Mesh, BoxGeometry, MeshStandardMaterial } from "three";
import { seeded, bounded } from "../core.mjs";
export function layout({ count = 25, seed = 1 } = {}) {
  bounded(count, 1, 400, "count");
  const rng = seeded(seed),
    side = Math.ceil(Math.sqrt(count));
  return Array.from({ length: count }, (_, i) => ({
    position: [
      ((i % side) - side / 2) * 0.4,
      0,
      (Math.floor(i / side) - side / 2) * 0.4,
    ],
    height: 0.2 + rng() * 0.7,
    rotation: (Math.floor(rng() * 4) * Math.PI) / 2,
  }));
}
export function create(options = {}) {
  const group = new Group(),
    geometry = new BoxGeometry(0.3, 1, 0.3),
    material = new MeshStandardMaterial({ color: 0xaaccdd });
  for (const b of layout(options)) {
    const mesh = new Mesh(geometry, material);
    mesh.position.fromArray(b.position);
    mesh.position.y = b.height / 2;
    mesh.scale.y = b.height;
    mesh.rotation.y = b.rotation;
    group.add(mesh);
  }
  return group;
}
export const requirements =
  "Own placeholder buildings included; replace using user-downloaded Kenney CC0 models after GLB intake";

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  SphereGeometry,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  InstancedMesh,
  Object3D,
  Vector3,
  Group,
} from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { seeded, bounded } from "../core.mjs";
export function sampleSurface(mesh, count = 100, seed = 1) {
  bounded(count, 0, 10000, "count");
  const sampler = new MeshSurfaceSampler(mesh)
    .setRandomGenerator(seeded(seed))
    .build();
  const p = new Vector3(),
    n = new Vector3();
  return Array.from({ length: Math.floor(count) }, () => {
    sampler.sample(p, n);
    return { position: p.toArray(), normal: n.toArray() };
  });
}
export function create({ count = 200, seed = 1 } = {}) {
  const base = new Mesh(
      new SphereGeometry(1, 24, 16),
      new MeshStandardMaterial({ color: 0x334455 }),
    ),
    dots = new InstancedMesh(
      new IcosahedronGeometry(0.025, 0),
      new MeshStandardMaterial({ color: 0xaaffaa }),
      count,
    );
  const m = new Object3D();
  sampleSurface(base, count, seed).forEach((v, i) => {
    m.position.fromArray(v.position);
    m.updateMatrix();
    dots.setMatrixAt(i, m.matrix);
  });
  const group = new Group();
  group.add(base, dots);
  return group;
}

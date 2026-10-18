/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { MeshBVH } from "three-mesh-bvh";
import {
  SphereGeometry,
  Mesh,
  MeshStandardMaterial,
  Ray,
  Vector3,
  DoubleSide,
} from "three";
export function accelerate(geometry) {
  const tree = new MeshBVH(geometry);
  return {
    raycast: (ray) => tree.raycastFirst(ray, DoubleSide),
    tree,
    dispose() {
      /* BVH uses JS typed arrays; release this adapter reference. */
    },
  };
}
export function create() {
  const geometry = new SphereGeometry(1, 32, 24),
    bvh = accelerate(geometry);
  const hit = bvh.raycast(new Ray(new Vector3(0, 0, 3), new Vector3(0, 0, -1)));
  geometry.dispose();
  return hit ? { distance: hit.distance, point: hit.point.toArray() } : null;
}

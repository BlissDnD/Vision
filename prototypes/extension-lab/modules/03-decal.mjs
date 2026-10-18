/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Vector3,
  Euler,
  Group,
} from "three";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
export function stamp(
  mesh,
  {
    position = [0, 0, 0.51],
    rotation = [0, 0, 0],
    size = [0.7, 0.4, 1],
    texture = null,
  } = {},
) {
  mesh.updateMatrixWorld(true);
  return new Mesh(
    new DecalGeometry(
      mesh,
      new Vector3(...position),
      new Euler(...rotation),
      new Vector3(...size),
    ),
    new MeshBasicMaterial({
      color: 0xff8855,
      map: texture,
      transparent: !!texture,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    }),
  );
}
export function create() {
  const g = new Group(),
    base = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: 0x7799bb }),
    );
  g.add(base);
  g.add(stamp(base));
  return g;
}

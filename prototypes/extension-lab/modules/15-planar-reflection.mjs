/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Reflector } from "three/addons/objects/Reflector.js";
import { PlaneGeometry } from "three";
export function create({ resolution = 512 } = {}) {
  const mesh = new Reflector(new PlaneGeometry(4, 4), {
    color: 0x889999,
    textureWidth: resolution,
    textureHeight: resolution,
  });
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -1;
  return mesh;
}

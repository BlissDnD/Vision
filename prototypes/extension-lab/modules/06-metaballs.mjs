/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { MeshStandardMaterial } from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
export function create({ resolution = 28 } = {}) {
  if (resolution < 12 || resolution > 48)
    throw new RangeError("resolution 12..48");
  const mesh = new MarchingCubes(
    Math.floor(resolution),
    new MeshStandardMaterial({
      color: 0xccaaff,
      metalness: 0.5,
      roughness: 0.25,
    }),
    false,
    false,
    30000,
  );
  mesh.scale.setScalar(2);
  mesh.userData.seek = (t) => {
    mesh.reset();
    for (let i = 0; i < 4; i++) {
      const a = t + (i * Math.PI) / 2;
      mesh.addBall(
        0.5 + 0.18 * Math.cos(a),
        0.5 + 0.18 * Math.sin(a * 1.3),
        0.5 + 0.1 * Math.sin(a),
        0.5,
        12,
      );
    }
    mesh.update();
  };
  mesh.userData.seek(0);
  return mesh;
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  PlaneGeometry,
  DataTexture,
  RGBAFormat,
  RepeatWrapping,
  Vector3,
} from "three";
import { Water } from "../vendor/Water.mjs";
export function create() {
  const data = new Uint8Array([128, 128, 255, 255]);
  const normal = new DataTexture(data, 1, 1, RGBAFormat);
  normal.wrapS = normal.wrapT = RepeatWrapping;
  normal.needsUpdate = true;
  const water = new Water(new PlaneGeometry(4, 4), {
    textureWidth: 256,
    textureHeight: 256,
    waterNormals: normal,
    sunDirection: new Vector3(0.5, 1, 0.3),
    sunColor: 0xffffff,
    waterColor: 0x226688,
    distortionScale: 0.5,
  });
  water.rotation.x = -Math.PI / 2;
  water.userData.seek = (t) => {
    water.material.uniforms.time.value = t;
  };
  water.userData.disposeExtra = () => normal.dispose();
  return water;
}
export const requirements =
  "Procedural flat normal placeholder; caller can replace with a licensed normal map for richer waves";

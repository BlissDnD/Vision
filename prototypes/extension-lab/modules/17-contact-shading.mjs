/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
export function createPass(
  scene,
  camera,
  { width = 512, height = 512, radius = 8 } = {},
) {
  const pass = new SSAOPass(scene, camera, width, height);
  pass.kernelRadius = radius;
  pass.minDistance = 0.005;
  pass.maxDistance = 0.1;
  return pass;
}
export const requirements =
  "A Three.js scene, camera and EffectComposer; depth applies only within this scene";

/** Isolated usage example for 53-procedural-noise; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/53-procedural-noise.mjs";
export async function run(host) {
  return { object: host.shaderPlane(m.noiseGLSL) };
}

/** Isolated usage example for 32-gltf-optimize; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/32-gltf-optimize.mjs";
export async function run(host) {
  const original = await host.exampleGLB();
  const optimized = await m.optimize(original);
  return {
    data: { originalBytes: original.length, optimizedBytes: optimized.length },
  };
}

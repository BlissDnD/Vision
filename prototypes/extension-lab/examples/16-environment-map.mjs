/** Isolated usage example for 16-environment-map; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/16-environment-map.mjs";
export async function run(host) {
  const prepared = m.prepareEnvironment(host.renderer, host.environment);
  const reset = m.applyEnvironment(host.scene, prepared);
  return {
    data: { environment: "procedural test panorama" },
    dispose() {
      reset();
      prepared.dispose();
    },
  };
}

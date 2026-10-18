/** Isolated usage example for 18-lut-import; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/18-lut-import.mjs";
export async function run(host) {
  const result = m.parseLUT(m.sampleIdentity());
  return {
    data: { size: result.size, texture3D: !!result.texture3D },
    dispose() {
      result.texture3D?.dispose();
    },
  };
}

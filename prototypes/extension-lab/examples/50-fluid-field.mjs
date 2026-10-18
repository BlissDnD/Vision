/** Isolated usage example for 50-fluid-field; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/50-fluid-field.mjs";
export async function run(host) {
  const fluid = m.create(host.renderer);
  const object = host.texturePlane(fluid.texture);
  return {
    object,
    seek(t) {
      object.material.map = fluid.seek(t);
    },
    dispose: () => fluid.dispose(),
  };
}

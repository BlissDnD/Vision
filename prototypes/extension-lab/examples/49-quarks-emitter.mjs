/** Isolated usage example for 49-quarks-emitter; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/49-quarks-emitter.mjs";
export async function run(host) {
  const fx = m.create();
  host.scene.add(fx.emitter);
  return {
    object: fx.object,
    step: (dt) => fx.step(dt),
    dispose() {
      fx.emitter.removeFromParent();
      fx.dispose();
    },
  };
}

/** Isolated usage example for 24-rigid-bodies; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/24-rigid-bodies.mjs";
export async function run(host) {
  const replay = m.createSimulation();
  const object = host.ball();
  return {
    object,
    seek(t) {
      object.position.copy(replay.seek(t).body.position);
    },
    dispose: () => replay.dispose(),
  };
}

/** Isolated usage example for 55-rapier-physics; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/55-rapier-physics.mjs";
export async function run(host) {
  const replay = await m.createSimulation();
  const object = host.ball();
  return {
    object,
    seek(t) {
      const p = replay.seek(t).body.translation();
      object.position.set(p.x, p.y, p.z);
    },
    dispose: () => replay.dispose(),
  };
}

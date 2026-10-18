/** Isolated usage example for 23-nebula-particles; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/23-nebula-particles.mjs";
export async function run(host) {
  const replay = m.createSimulation({ seed: 7 });
  let view;
  return {
    seek(t) {
      const sim = replay.seek(t);
      const particles = sim.system.emitters.flatMap((e) => e.particles);
      if (view) host.disposeObject(view);
      view = host.pointCloud(
        particles.map((p) => [p.position.x, p.position.y, p.position.z]),
      );
      host.scene.add(view);
    },
    dispose() {
      if (view) {
        host.disposeObject(view);
      }
      replay.dispose();
    },
  };
}

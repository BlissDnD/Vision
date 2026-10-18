/** Isolated usage example for 54-postprocessing; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/54-postprocessing.mjs";
export async function run(host) {
  const pipeline = m.createPipeline(host.renderer, host.scene, host.camera);
  return {
    render: () => pipeline.render(1 / 60),
    dispose: () => pipeline.dispose(),
  };
}

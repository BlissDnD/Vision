/** Isolated usage example for 17-contact-shading; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/17-contact-shading.mjs";
export async function run(host) {
  const pass = m.createPass(host.scene, host.camera);
  host.composer.addPass(pass);
  return {
    render: () => host.composer.render(),
    dispose() {
      host.composer.removePass(pass);
      pass.dispose();
    },
  };
}

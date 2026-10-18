/** Isolated usage example for 60-transform-gizmo; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/60-transform-gizmo.mjs";
export async function run(host) {
  const ui = m.mount(host.scene, host.camera, host.canvas, host.reference, {
    onCommit: (value) => host.show(value),
  });
  return { dispose: () => ui.dispose() };
}

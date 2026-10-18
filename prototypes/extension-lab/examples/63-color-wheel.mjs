/** Isolated usage example for 63-color-wheel; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/63-color-wheel.mjs";
export async function run(host) {
  const ui = m.mount(host.panel, {
    onChange: (value) => host.reference.material.color.set(value),
  });
  return { dispose: () => ui.dispose() };
}

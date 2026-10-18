/** Isolated usage example for 57-color-picker; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/57-color-picker.mjs";
export async function run(host) {
  const ui = m.mount(host.panel, {
    onInput: (value) => host.reference.material.color.set(value),
    onCommit: (value) => host.show({ committed: value }),
  });
  return { dispose: () => ui.dispose() };
}

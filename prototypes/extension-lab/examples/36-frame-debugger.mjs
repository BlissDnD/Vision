/** Isolated usage example for 36-frame-debugger; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/36-frame-debugger.mjs";
export async function run(host) {
  const debuggerUI = await m.mount(host.canvas);
  host.button("Képkocka rögzítése", () => {
    debuggerUI.capture();
    debuggerUI.show();
  });
  return { dispose: () => debuggerUI.dispose() };
}

/** Isolated usage example for 39-split-panels; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/39-split-panels.mjs";
export async function run(host) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;width:100%;height:150px";
  const parts = ["Könyvtár", "Vászon", "Részletek"].map((label) => {
    const el = document.createElement("div");
    el.textContent = label;
    el.style.cssText = "overflow:hidden;background:#253448";
    wrap.append(el);
    return el;
  });
  host.panel.append(wrap);
  const split = m.mount(parts);
  return { dispose: () => split.dispose() };
}

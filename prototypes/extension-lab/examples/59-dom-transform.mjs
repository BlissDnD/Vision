/** Isolated usage example for 59-dom-transform; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/59-dom-transform.mjs";
export async function run(host) {
  const proxy = document.createElement("div");
  proxy.textContent = "Fogj meg";
  proxy.style.cssText =
    "width:100px;height:60px;background:#357;position:relative;margin:40px;";
  host.panel.append(proxy);
  const ui = m.mount(host.panel, proxy, {
    onChange: (event) => {
      if (event.kind === "move")
        proxy.style.transform = `translate(${event.translate[0]}px,${event.translate[1]}px)`;
      else if (event.kind === "resize") {
        proxy.style.width = event.width + "px";
        proxy.style.height = event.height + "px";
      } else proxy.style.transform = `rotate(${event.rotation}deg)`;
    },
  });
  return { dispose: () => ui.dispose() };
}

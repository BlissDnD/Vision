/** Isolated usage example for 38-sortable-toolbar; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/38-sortable-toolbar.mjs";
export async function run(host) {
  const row = document.createElement("div");
  for (const [i, label] of ["Mozgatás", "Szín", "Animálás"].entries()) {
    const b = document.createElement("button");
    b.dataset.id = String(i);
    b.textContent = label;
    row.append(b);
  }
  host.panel.append(row);
  const ui = m.mount(row, { onChange: (order) => host.show({ order }) });
  return { dispose: () => ui.dispose() };
}

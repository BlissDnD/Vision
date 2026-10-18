/** Isolated usage example for 48-glass-material; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/48-glass-material.mjs";
export async function run(host) {
  host.glassBuffer();
  const object = m.create({ buffer: host.backgroundTarget.texture });
  return { object, render: () => host.renderGlass(object) };
}

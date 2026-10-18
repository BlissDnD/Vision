/** Isolated usage example for 21-camera-framing; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/21-camera-framing.mjs";
export async function run(host) {
  const adapter = m.attach(host.camera, host.canvas);
  await adapter.frame(host.reference);
  return {
    data: {
      hint: "Egérrel körbejárás; exportálható mozdulathoz külön kamerakulcsok kellenek.",
    },
    seek: () => adapter.update(1 / 60),
    dispose: () => adapter.dispose(),
  };
}

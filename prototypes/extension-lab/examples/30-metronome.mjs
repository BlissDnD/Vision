/** Isolated usage example for 30-metronome; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/30-metronome.mjs";
export async function run(host) {
  let audio;
  host.button("Metronóm indítása", async () => {
    audio ??= await m.mount({ bpm: 120 });
    audio.start();
  });
  host.button("Leállítás", () => audio?.stop());
  return { dispose: () => audio?.dispose() };
}

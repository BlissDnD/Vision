/** Isolated usage example for 56-streaming-export; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/56-streaming-export.mjs";
export async function run(host) {
  let abort;
  host.button("2 mp MP4 mentése", async () => {
    if (!window.showSaveFilePicker)
      throw new Error("Ehhez a próbához File System Access szükséges.");
    const handle = await window.showSaveFilePicker({
      suggestedName: "vel-lab.mp4",
    });
    const writable = await handle.createWritable();
    abort = new AbortController();
    host.setExporting(true);
    try {
      await m.exportFrames(host.canvas, writable, {
        duration: 2,
        fps: 30,
        signal: abort.signal,
        renderFrame: (t) => {
          host.reference.rotation.y = t;
          host.renderer.render(host.scene, host.camera);
        },
      });
    } finally {
      host.setExporting(false);
    }
  });
  host.button("Megszakítás", () => abort?.abort());
  return { dispose: () => abort?.abort() };
}

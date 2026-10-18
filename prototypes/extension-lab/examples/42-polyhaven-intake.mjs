/** Isolated usage example for 42-polyhaven-intake; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/42-polyhaven-intake.mjs";
export async function run(host) {
  host.filePicker({
    accept: "image/png,image/jpeg",
    onFiles: async (files) => {
      const record = await m.importTexture(files[0], "user_download");
      host.show({
        name: record.name,
        source: record.source,
        embeddedBytes: record.data.length,
      });
    },
  });
  return {
    data: {
      hint: "Helyi Poly Haven kép beágyazása. HDR-dekódolás külön exportált függvény.",
    },
  };
}

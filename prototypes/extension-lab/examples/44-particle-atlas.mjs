/** Isolated usage example for 44-particle-atlas; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/44-particle-atlas.mjs";
export async function run(host) {
  host.filePicker({
    accept: "image/png",
    multiple: true,
    onFiles: async (files) => {
      const atlas = await m.importFiles(files);
      host.replaceAsset(atlas);
      host.show({ entries: atlas.entries, source: atlas.source });
    },
  });
  return { data: { hint: "Helyi részecskeképekből textúraatlasz." } };
}

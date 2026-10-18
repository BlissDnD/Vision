/** Isolated usage example for 40-foliage-assets; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/40-foliage-assets.mjs";
export async function run(host) {
  host.filePicker({
    accept: "image/png",
    multiple: true,
    onFiles: async (files) => {
      const atlas = await m.importFiles(files);
      host.replaceAsset(atlas);
      host.show(atlas.toRecord());
    },
  });
  return { data: { hint: "Válassz letöltött Kenney növényképeket." } };
}

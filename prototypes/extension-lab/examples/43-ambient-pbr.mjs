/** Isolated usage example for 43-ambient-pbr; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/43-ambient-pbr.mjs";
export async function run(host) {
  host.filePicker({
    accept: "image/png,image/jpeg",
    onFiles: async (files) => {
      const record = await m.importMaps({ map: files[0] }, "local_material");
      const asset = await m.materialFromRecord(record);
      host.replaceAsset(asset);
      host.reference.material = asset.material;
      host.show({ source: record.source, maps: Object.keys(record.maps) });
    },
  });
  return {
    data: {
      hint: "Alapszín betöltése; normal/roughness további térképként programból adható.",
    },
  };
}

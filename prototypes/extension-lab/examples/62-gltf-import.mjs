/** Isolated usage example for 62-gltf-import; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/62-gltf-import.mjs";
export async function run(host) {
  host.filePicker({
    accept: ".glb",
    onFiles: async (files) => {
      const result = await m.parseGLB(await files[0].arrayBuffer());
      host.replaceObject(result.scene);
      host.show({ animations: result.animations.map((a) => a.name) });
    },
  });
  return { data: { hint: "Helyi önálló GLB; külső erőforrásokat elutasít." } };
}

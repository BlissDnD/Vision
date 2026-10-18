/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { MeshStandardMaterial } from "three";
import { portableImage, loadMaterialMaps } from "../shared/assets.mjs";
export async function importMaps(files, assetId) {
  const source = {
      url: "https://ambientcg.com",
      id: assetId,
      license: "CC0-1.0",
    },
    records = {};
  const allowed = ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap"];
  for (const [key, file] of Object.entries(files)) {
    if (!allowed.includes(key)) throw new Error("Unknown PBR map");
    records[key] = await portableImage(file, source);
  }
  return { v: 1, kind: "pbr", source, maps: records };
}
export async function materialFromRecord(record) {
  const loaded = await loadMaterialMaps(record.maps);
  const material = new MeshStandardMaterial({
    ...loaded.textures,
    roughness: 0.7,
  });
  return {
    material,
    dispose() {
      material.dispose();
      loaded.dispose();
    },
  };
}

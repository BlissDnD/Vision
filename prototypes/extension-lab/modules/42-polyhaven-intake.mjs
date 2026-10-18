/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { portableImage } from "../shared/assets.mjs";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
export const source = { url: "https://polyhaven.com", license: "CC0-1.0" };
export async function importTexture(file, assetId) {
  if (!/^[a-z0-9_]+$/.test(assetId)) throw new Error("Invalid asset id");
  return portableImage(file, { ...source, id: assetId });
}
export function decodeHDR(buffer) {
  return new HDRLoader().parse(buffer);
}
export const requirements =
  "Import a user-downloaded texture/HDR; HDR decoding yields raw data for DataTexture creation, not a PBR renderer";

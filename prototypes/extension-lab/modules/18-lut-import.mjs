/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { LUT3dlLoader } from "three/addons/loaders/LUT3dlLoader.js";
export function parseLUT(text) {
  if (typeof text !== "string" || text.length > 16000000)
    throw new Error("LUT maximum 16 MB");
  return new LUT3dlLoader().parse(text);
}
export function sampleIdentity() {
  return "# identity 2x2x2\n0 1023\n0 0 0\n0 0 4095\n0 4095 0\n0 4095 4095\n4095 0 0\n4095 0 4095\n4095 4095 0\n4095 4095 4095";
}
export const requirements =
  "Use parsed texture3D in a LUT shader pass; dispose the returned texture3D";

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { MeshTransmissionMaterial } from "@pmndrs/vanilla/materials/MeshTransmissionMaterial.js";
import { Mesh, TorusKnotGeometry } from "three";
/** Requires a background color buffer from the caller. */
export function create({ buffer = null } = {}) {
  const material = new MeshTransmissionMaterial({ samples: 6 });
  material.transmission = 1;
  material.thickness = 0.5;
  material.roughness = 0.1;
  material.ior = 1.4;
  material.buffer = buffer;
  return new Mesh(new TorusKnotGeometry(0.6, 0.2, 96, 12), material);
}
export const requirements =
  "Render the background without the glass into a target first; pass that texture as buffer. No automatic capture here.";

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
/** Standalone GLB only; caller must provide decoders for compressed variants. */
export async function parseGLB(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength < 20 || view.getUint32(0, true) !== 0x46546c67)
    throw new Error("GLB v2 required");
  if (
    view.getUint32(4, true) !== 2 ||
    view.getUint32(8, true) !== buffer.byteLength
  )
    throw new Error("Invalid GLB header");
  const jsonLength = view.getUint32(12, true),
    jsonType = view.getUint32(16, true);
  if (jsonType !== 0x4e4f534a || 20 + jsonLength > buffer.byteLength)
    throw new Error("Invalid GLB JSON chunk");
  const json = JSON.parse(
    new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength)),
  );
  for (const resource of [...(json.buffers || []), ...(json.images || [])])
    if (resource.uri && !resource.uri.startsWith("data:"))
      throw new Error("External GLB resources not allowed");
  return new GLTFLoader().parseAsync(buffer, "");
}

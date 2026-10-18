/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { WebIO } from "@gltf-transform/core";
import { dedup, prune, weld } from "@gltf-transform/functions";
export async function optimize(bytes) {
  const io = new WebIO();
  const document = await io.readBinary(bytes);
  await document.transform(dedup(), weld(), prune());
  return io.writeBinary(document);
}
export const requirements =
  "Uncompressed self-contained GLB; register decoders explicitly for compressed inputs. This adapter does not fetch external files.";

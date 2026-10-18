/** Isolated usage example for 33-mesh-simplify; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/33-mesh-simplify.mjs";
export async function run(host) {
  const geometry = host.sphereGeometry();
  const result = await m.simplify(
    geometry.index.array,
    geometry.attributes.position.array,
    { ratio: 0.5, error: 0.1 },
  );
  const before = geometry.index.count;
  geometry.setIndex(Array.from(result.indices));
  return {
    object: host.mesh(geometry),
    data: { before, after: result.indices.length, error: result.error },
  };
}

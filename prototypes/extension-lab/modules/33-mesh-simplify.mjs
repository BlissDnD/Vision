/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { MeshoptSimplifier } from "meshoptimizer";
export async function simplify(
  indices,
  positions,
  { ratio = 0.5, error = 0.01 } = {},
) {
  if (ratio <= 0 || ratio > 1) throw new RangeError("ratio 0..1");
  await MeshoptSimplifier.ready;
  const target = Math.max(3, Math.floor((indices.length * ratio) / 3) * 3);
  const [result, actualError] = MeshoptSimplifier.simplify(
    new Uint32Array(indices),
    new Float32Array(positions),
    3,
    target,
    error,
  );
  return { indices: result, error: actualError };
}

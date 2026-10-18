/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { BoxGeometry, SphereGeometry, MeshStandardMaterial } from "three";
import {
  Brush,
  Evaluator,
  SUBTRACTION,
  ADDITION,
  INTERSECTION,
} from "three-bvh-csg";
export function create({ operation = "subtract", radius = 0.68 } = {}) {
  const material = new MeshStandardMaterial({
    color: 0x79bfff,
    roughness: 0.3,
  });
  const a = new Brush(new BoxGeometry(1, 1, 1), material),
    b = new Brush(new SphereGeometry(radius, 24, 16), material);
  b.position.set(0.4, 0.2, 0);
  a.updateMatrixWorld();
  b.updateMatrixWorld();
  const operations = {
    subtract: SUBTRACTION,
    union: ADDITION,
    intersect: INTERSECTION,
  };
  if (!(operation in operations)) throw new Error("Unknown CSG operation");
  const evaluator = new Evaluator();
  const result = evaluator.evaluate(a, b, operations[operation]);
  a.geometry.dispose();
  b.geometry.dispose();
  return result;
}

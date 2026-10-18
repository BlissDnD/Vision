/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { IcosahedronGeometry, Mesh, MeshStandardMaterial } from "three";
import { LoopSubdivision } from "three-subdivide";
import { bounded } from "../core.mjs";
export function subdivide(geometry, iterations = 1) {
  bounded(iterations, 0, 3, "iterations");
  return LoopSubdivision.modify(geometry, Math.floor(iterations));
}
export function create({ iterations = 1 } = {}) {
  const input = new IcosahedronGeometry(1, 0);
  const geometry = subdivide(input, iterations);
  input.dispose();
  return new Mesh(
    geometry,
    new MeshStandardMaterial({ color: 0xffaa88, roughness: 0.4 }),
  );
}

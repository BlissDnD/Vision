/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Mesh } from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
export function create() {
  const geometry = new MeshLineGeometry();
  const points = Array.from({ length: 80 }, (_, i) => {
    const a = (i / 79) * Math.PI * 4;
    return [Math.cos(a), Math.sin(a), i / 79 - 0.5];
  });
  geometry.setPoints(points, (p) => 0.1 + Math.sin(p * Math.PI));
  const material = new MeshLineMaterial({ color: 0xffaacc, lineWidth: 0.08 });
  return new Mesh(geometry, material);
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Group, Mesh, MeshBasicMaterial, ShapeGeometry } from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
export function parseSVG(text) {
  if (typeof text !== "string" || text.length > 1000000)
    throw new Error("SVG maximum 1 MB");
  if (
    /<!DOCTYPE|<!ENTITY|<script|<foreignObject|(?:href|src)\s*=\s*["']?(?:https?:|data:|javascript:)/i.test(
      text,
    )
  )
    throw new Error("Only local static SVG paths are supported");
  const group = new Group();
  const data = new SVGLoader().parse(text);
  for (const path of data.paths) {
    for (const shape of SVGLoader.createShapes(path))
      group.add(
        new Mesh(
          new ShapeGeometry(shape),
          new MeshBasicMaterial({
            color: path.color,
            side: 2,
            depthWrite: false,
          }),
        ),
      );
  }
  group.scale.y = -1;
  return group;
}
export function create() {
  return parseSVG(
    '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#88aaff" d="M0 0 L2 0 L1 2 Z"/></svg>',
  );
}

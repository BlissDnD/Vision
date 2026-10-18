/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import paper from "paper";
export function smoothPath(points, { closed = false } = {}) {
  const scope = new paper.PaperScope();
  scope.setup(new scope.Size(256, 256));
  try {
    const path = new scope.Path({ segments: points, closed });
    path.smooth({ type: "catmull-rom", factor: 0.5 });
    return path.segments.map((s) => ({
      point: [s.point.x, s.point.y],
      in: [s.handleIn.x, s.handleIn.y],
      out: [s.handleOut.x, s.handleOut.y],
    }));
  } finally {
    scope.project.remove();
  }
}
export function create() {
  return smoothPath([
    [0, 0],
    [1, 1],
    [2, -1],
    [3, 0],
  ]);
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import Moveable from "moveable";
export function mount(container, target, { onChange = () => {} } = {}) {
  const moveable = new Moveable(container, {
    target,
    draggable: true,
    resizable: true,
    rotatable: true,
    origin: true,
  });
  moveable.on("drag", (e) =>
    onChange({ kind: "move", translate: e.beforeTranslate }),
  );
  moveable.on("resize", (e) =>
    onChange({
      kind: "resize",
      width: e.width,
      height: e.height,
      translate: e.drag.beforeTranslate,
    }),
  );
  moveable.on("rotate", (e) =>
    onChange({ kind: "rotate", rotation: e.beforeRotate }),
  );
  return { controls: moveable, dispose: () => moveable.destroy() };
}
export const requirements =
  "DOM overlay/proxy only: host maps events to model and commits once per completed gesture";

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import * as THREE from "three";
import CameraControls from "camera-controls";
CameraControls.install({ THREE });
export function attach(camera, element) {
  const controls = new CameraControls(camera, element);
  return {
    controls,
    frame: (object) => controls.fitToBox(object, false),
    update: (dt) => controls.update(dt),
    dispose: () => controls.dispose(),
  };
}
/** Pure camera path: no damping or wall-clock state, suitable for explicit seek. */
export function sampleShot(from, to, t) {
  const u = Math.max(0, Math.min(1, t)),
    s = u * u * (3 - 2 * u);
  return from.map((v, i) => THREE.MathUtils.lerp(v, to[i], s));
}
export const requirements = "DOM element + perspective/orthographic camera";

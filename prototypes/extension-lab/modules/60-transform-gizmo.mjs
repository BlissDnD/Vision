/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { TransformControls } from "three/addons/controls/TransformControls.js";
export function mount(
  scene,
  camera,
  element,
  target,
  { onCommit = () => {} } = {},
) {
  const controls = new TransformControls(camera, element);
  controls.attach(target);
  const helper = controls.getHelper();
  scene.add(helper);
  const done = () =>
    onCommit({
      position: target.position.toArray(),
      quaternion: target.quaternion.toArray(),
      scale: target.scale.toArray(),
    });
  controls.addEventListener("mouseUp", done);
  return {
    controls,
    dispose() {
      controls.removeEventListener("mouseUp", done);
      controls.detach();
      helper.removeFromParent();
      controls.dispose();
    },
  };
}

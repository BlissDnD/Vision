/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import {
  AnimationMixer,
  LoopOnce,
  NumberKeyframeTrack,
  AnimationClip,
  Object3D,
} from "three";
export function animate(object, clip) {
  const mixer = new AnimationMixer(object),
    action = mixer.clipAction(clip);
  action.setLoop(LoopOnce, 1);
  action.clampWhenFinished = true;
  action.play();
  return {
    seek(seconds) {
      action.enabled = true;
      action.paused = false;
      mixer.setTime(Math.max(0, Math.min(clip.duration, seconds)));
    },
    dispose() {
      mixer.stopAllAction();
      mixer.uncacheRoot(object);
    },
  };
}
export function create() {
  const object = new Object3D(),
    clip = new AnimationClip("Lab slide", 1, [
      new NumberKeyframeTrack(".position[x]", [0, 1], [0, 1]),
    ]),
    player = animate(object, clip);
  player.seek(0.5);
  const x = object.position.x;
  player.dispose();
  return { sampledX: x };
}

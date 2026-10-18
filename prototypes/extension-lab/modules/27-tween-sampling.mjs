/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Tween, Easing, Group } from "@tweenjs/tween.js";
/** Build from scratch per seek: backward seeking must not retain a completed tween. */
export function sample(from, to, time, { duration = 1 } = {}) {
  if (duration <= 0) throw new RangeError("Positive duration required");
  const state = { ...from },
    group = new Group();
  const tween = new Tween(state, group)
    .to(to, duration * 1000)
    .easing(Easing.Cubic.InOut)
    .start(0);
  group.update(Math.max(0, Math.min(duration, time)) * 1000);
  group.remove(tween);
  return state;
}
export function create() {
  return sample({ x: 0 }, { x: 10 }, 0.5);
}

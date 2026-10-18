/** Isolated usage example for 27-tween-sampling; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/27-tween-sampling.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

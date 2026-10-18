/** Isolated usage example for 19-perceptual-gradient; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/19-perceptual-gradient.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

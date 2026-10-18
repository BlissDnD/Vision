/** Isolated usage example for 26-bezier-easing; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/26-bezier-easing.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

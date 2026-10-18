/** Isolated usage example for 29-audio-features; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/29-audio-features.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

/** Isolated usage example for 51-water-surface; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/51-water-surface.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

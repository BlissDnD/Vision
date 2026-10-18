/** Isolated usage example for 15-planar-reflection; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/15-planar-reflection.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

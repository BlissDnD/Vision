/** Isolated usage example for 01-csg; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/01-csg.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

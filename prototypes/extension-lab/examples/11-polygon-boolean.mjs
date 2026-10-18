/** Isolated usage example for 11-polygon-boolean; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/11-polygon-boolean.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

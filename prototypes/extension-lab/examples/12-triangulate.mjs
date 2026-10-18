/** Isolated usage example for 12-triangulate; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/12-triangulate.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

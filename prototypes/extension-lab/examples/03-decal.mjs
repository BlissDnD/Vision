/** Isolated usage example for 03-decal; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/03-decal.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

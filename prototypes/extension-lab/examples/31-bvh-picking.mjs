/** Isolated usage example for 31-bvh-picking; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/31-bvh-picking.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

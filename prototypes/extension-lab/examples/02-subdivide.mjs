/** Isolated usage example for 02-subdivide; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/02-subdivide.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

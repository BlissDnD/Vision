/** Isolated usage example for 35-batched-objects; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/35-batched-objects.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

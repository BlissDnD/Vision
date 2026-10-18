/** Isolated usage example for 34-instanced-copies; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/34-instanced-copies.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

/** Isolated usage example for 05-curve-flow; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/05-curve-flow.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

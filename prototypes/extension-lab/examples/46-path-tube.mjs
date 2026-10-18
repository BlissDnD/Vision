/** Isolated usage example for 46-path-tube; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/46-path-tube.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

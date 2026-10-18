/** Isolated usage example for 08-svg-import; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/08-svg-import.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

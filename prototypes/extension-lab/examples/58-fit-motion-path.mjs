/** Isolated usage example for 58-fit-motion-path; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/58-fit-motion-path.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

/** Isolated usage example for 06-metaballs; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/06-metaballs.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

/** Isolated usage example for 07-surface-scatter; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/07-surface-scatter.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

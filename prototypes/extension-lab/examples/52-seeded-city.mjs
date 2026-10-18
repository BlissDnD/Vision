/** Isolated usage example for 52-seeded-city; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/52-seeded-city.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

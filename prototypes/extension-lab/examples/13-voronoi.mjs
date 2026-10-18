/** Isolated usage example for 13-voronoi; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/13-voronoi.mjs";
export async function run(host) {
  const value = await m.create();
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

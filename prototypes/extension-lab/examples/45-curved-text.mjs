/** Isolated usage example for 45-curved-text; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/45-curved-text.mjs";
export async function run(host) {
  const value = await m.create({
    fontURL: new URL("./fixtures/lab-vector-font.otf", document.baseURI).href,
  });
  return value?.isObject3D
    ? { object: value, seek: value.userData.seek }
    : { data: value };
}

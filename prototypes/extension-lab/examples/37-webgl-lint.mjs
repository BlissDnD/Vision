/** Isolated usage example for 37-webgl-lint; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/37-webgl-lint.mjs";
export async function run(host) {
  host.button("WebGL Lint indítása új lapon", () =>
    window.open("./lint.html", "_blank", "noopener"),
  );
  return {
    data: {
      hint: "A diagnosztika külön lapon, a kontextus létrehozása előtt indul.",
    },
  };
}

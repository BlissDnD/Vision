/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { createLocalAtlas } from "../shared/assets.mjs";
export const source = {
  url: "https://kenney.nl/assets/particle-pack",
  license: "CC0-1.0",
  kind: "particle",
};
export function importFiles(files, options = {}) {
  return createLocalAtlas(files, { ...options, source });
}

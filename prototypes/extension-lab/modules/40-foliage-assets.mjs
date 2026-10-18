/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { createLocalAtlas } from "../shared/assets.mjs";
export const source = {
  url: "https://kenney.nl/assets/foliage-sprites",
  license: "CC0-1.0",
  kind: "foliage",
};
export function importFiles(files, options = {}) {
  return createLocalAtlas(files, { ...options, source });
}
export const requirements =
  "User supplies downloaded PNG files; no bundled Kenney artwork or scraped URLs";

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { Text } from "troika-three-text";
export function create({ text = "VEL", fontURL = null, radius = -2 } = {}) {
  if (!fontURL)
    throw new Error("Local fontURL required; see the isolated example");
  const mesh = new Text();
  mesh.text = text;
  mesh.fontSize = 0.18;
  mesh.maxWidth = 3;
  mesh.anchorX = "center";
  mesh.anchorY = "middle";
  mesh.color = 0xaaffcc;
  mesh.curveRadius = radius;
  if (fontURL) mesh.font = fontURL;
  mesh.sync();
  return mesh;
}
export const requirements =
  "Browser worker + font asset. Pass a local fontURL for offline use; remote fallback glyph lookup must be reviewed before shipping.";

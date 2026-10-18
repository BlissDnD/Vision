/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import opentype from "opentype.js";
export function fontFromBuffer(buffer) {
  return opentype.parse(buffer);
}
export function outline(font, text, { size = 72 } = {}) {
  if (!font?.getPath) throw new TypeError("Parsed font required");
  const path = font.getPath(text, 0, 0, size);
  return {
    text,
    size,
    commands: path.commands.map((c) => ({ ...c })),
    svg: path.toPathData(3),
    bounds: path.getBoundingBox(),
  };
}
export function create() {
  const p = new opentype.Path();
  p.moveTo(0, 0);
  p.lineTo(0, 700);
  p.lineTo(500, 0);
  p.close();
  const font = new opentype.Font({
    familyName: "Lab Demo",
    styleName: "Regular",
    unitsPerEm: 1000,
    ascender: 800,
    descender: -200,
    glyphs: [
      new opentype.Glyph({
        name: ".notdef",
        advanceWidth: 600,
        path: new opentype.Path(),
      }),
      new opentype.Glyph({
        name: "A",
        unicode: 65,
        advanceWidth: 600,
        path: p,
      }),
    ],
  });
  font.kerningPairs = {};
  return outline(font, "AAA");
}

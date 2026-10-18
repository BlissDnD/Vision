/** Original tiny V/E/L test font; no third-party artwork or font data. */
import opentype from "opentype.js";
import { writeFile } from "node:fs/promises";
const shapes = {
  V: [
    [0, 700],
    [100, 700],
    [250, 100],
    [400, 700],
    [500, 700],
    [300, 0],
    [200, 0],
  ],
  E: [
    [0, 0],
    [0, 700],
    [450, 700],
    [450, 600],
    [100, 600],
    [100, 400],
    [350, 400],
    [350, 300],
    [100, 300],
    [100, 100],
    [450, 100],
    [450, 0],
  ],
  L: [
    [0, 700],
    [100, 700],
    [100, 100],
    [450, 100],
    [450, 0],
    [0, 0],
  ],
};
const glyphs = [
  new opentype.Glyph({
    name: ".notdef",
    advanceWidth: 600,
    path: new opentype.Path(),
  }),
  new opentype.Glyph({
    name: "space",
    unicode: 32,
    advanceWidth: 300,
    path: new opentype.Path(),
  }),
];
for (const [letter, points] of Object.entries(shapes)) {
  const path = new opentype.Path();
  path.moveTo(...points[0]);
  for (const point of points.slice(1)) path.lineTo(...point);
  path.close();
  glyphs.push(
    new opentype.Glyph({
      name: letter,
      unicode: letter.codePointAt(0),
      advanceWidth: 600,
      path,
    }),
  );
}
const font = new opentype.Font({
  familyName: "Vel Lab Original",
  styleName: "Regular",
  unitsPerEm: 1000,
  ascender: 800,
  descender: -200,
  glyphs,
});
font.kerningPairs = {};
await writeFile(
  "fixtures/lab-vector-font.otf",
  Buffer.from(font.toArrayBuffer()),
);

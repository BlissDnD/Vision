/** Local PNG/JPEG asset intake, portable records and explicit GPU ownership. */
import { CanvasTexture, SRGBColorSpace, TextureLoader } from "three";
export function validateFiles(
  files,
  { maxBytes = 32 * 1024 * 1024, maxFiles = 128 } = {},
) {
  const list = Array.from(files);
  if (!list.length || list.length > maxFiles)
    throw new RangeError("Invalid asset count");
  if (list.reduce((n, f) => n + f.size, 0) > maxBytes)
    throw new RangeError("Asset budget exceeded");
  for (const f of list)
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type))
      throw new TypeError("PNG/JPEG/WebP only");
  return list;
}
export async function createLocalAtlas(
  files,
  { cellSize = 128, source = { license: "user-supplied" } } = {},
) {
  const list = validateFiles(files);
  if (![64, 128, 256].includes(cellSize))
    throw new RangeError("cellSize 64/128/256");
  const columns = Math.ceil(Math.sqrt(list.length)),
    rows = Math.ceil(list.length / columns),
    canvas = document.createElement("canvas");
  canvas.width = columns * cellSize;
  canvas.height = rows * cellSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const entries = [];
  for (let i = 0; i < list.length; i++) {
    const image = await createImageBitmap(list[i]);
    try {
      if (image.width * image.height > 16_777_216)
        throw new RangeError("Image pixel budget exceeded");
      const s = Math.min(cellSize / image.width, cellSize / image.height),
        w = image.width * s,
        h = image.height * s,
        x = (i % columns) * cellSize,
        y = Math.floor(i / columns) * cellSize;
      ctx.drawImage(
        image,
        x + (cellSize - w) / 2,
        y + (cellSize - h) / 2,
        w,
        h,
      );
      entries.push({
        name: list[i].name,
        uv: [
          x / canvas.width,
          1 - (y + cellSize) / canvas.height,
          cellSize / canvas.width,
          cellSize / canvas.height,
        ],
      });
    } finally {
      image.close();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return {
    texture,
    entries,
    source: { ...source },
    toRecord: () => ({
      v: 1,
      kind: "atlas",
      source,
      entries,
      image: canvas.toDataURL("image/png"),
    }),
    dispose: () => texture.dispose(),
  };
}
export async function dataURL(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192)
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return `data:${file.type};base64,${btoa(binary)}`;
}
export async function portableImage(file, source) {
  validateFiles([file]);
  return {
    v: 1,
    kind: "image",
    name: file.name,
    mime: file.type,
    source: { ...source },
    data: await dataURL(file),
  };
}
export async function loadMaterialMaps(records) {
  const textures = {},
    loader = new TextureLoader();
  try {
    for (const [key, record] of Object.entries(records)) {
      textures[key] = await loader.loadAsync(record.data);
      if (key === "map") textures[key].colorSpace = SRGBColorSpace;
    }
    return {
      textures,
      dispose() {
        Object.values(textures).forEach((t) => t.dispose());
      },
    };
  } catch (error) {
    Object.values(textures).forEach((t) => t.dispose());
    throw error;
  }
}

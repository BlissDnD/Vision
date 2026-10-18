/** Targeted real-WebGL and browser-media checks; loaded only by the headless test. */
import * as T from "three";
import { Input, BufferSource, ALL_FORMATS } from "mediabunny";
import { create as createFluid } from "../modules/50-fluid-field.mjs";
import { createLocalAtlas } from "../shared/assets.mjs";
import { exportFrames } from "../modules/56-streaming-export.mjs";
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
export async function runChecks() {
  const results = [];
  const check = async (name, fn) => {
    try {
      const data = await fn();
      results.push({ name, ok: true, ...data });
    } catch (e) {
      results.push({ name, ok: false, error: e.message });
    }
  };
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const renderer = new T.WebGLRenderer({ canvas, preserveDrawingBuffer: true });
  renderer.setSize(64, 64, false);
  const scene = new T.Scene(),
    camera = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 2;
  await check(
    "Fluid dye is visible and identical after backward seek",
    async () => {
      const fluid = createFluid(renderer, { size: 32 }),
        geometry = new T.PlaneGeometry(2, 2),
        material = new T.MeshBasicMaterial({ map: fluid.texture }),
        plane = new T.Mesh(geometry, material);
      scene.add(plane);
      function pixels(t) {
        material.map = fluid.seek(t);
        renderer.render(scene, camera);
        const data = new Uint8Array(64 * 64 * 4);
        renderer
          .getContext()
          .readPixels(
            0,
            0,
            64,
            64,
            renderer.getContext().RGBA,
            renderer.getContext().UNSIGNED_BYTE,
            data,
          );
        return data;
      }
      try {
        const a = pixels(0.5);
        pixels(0.1);
        const b = pixels(0.5);
        assert(
          a.every((v, i) => v === b[i]),
          "Fluid rewind changed pixels",
        );
        assert(
          a.some((v, i) => i % 4 !== 3 && v > 20),
          "No visible dye",
        );
        return { pixelsCompared: a.length };
      } finally {
        plane.removeFromParent();
        geometry.dispose();
        material.dispose();
        fluid.dispose();
      }
    },
  );
  await check("Local atlas embeds pixels and bounded UVs", async () => {
    const source = document.createElement("canvas");
    source.width = 8;
    source.height = 8;
    const ctx = source.getContext("2d");
    ctx.fillStyle = "#ff8844";
    ctx.fillRect(0, 0, 8, 8);
    const blob = await new Promise((resolve) =>
      source.toBlob(resolve, "image/png"),
    );
    const file = new File([blob], "original-test.png", { type: "image/png" }),
      atlas = await createLocalAtlas([file], { cellSize: 64 });
    try {
      const record = JSON.parse(JSON.stringify(atlas.toRecord()));
      assert(record.entries.length === 1, "Atlas item missing");
      assert(record.image.startsWith("data:image/png"), "Atlas not portable");
      assert(
        record.entries[0].uv.every((x) => x >= 0 && x <= 1),
        "Invalid atlas UV",
      );
      return { size: atlas.texture.image.width };
    } finally {
      atlas.dispose();
    }
  });
  await check(
    "MP4 stream can be reopened with correct video dimensions",
    async () => {
      if (typeof VideoEncoder === "undefined")
        return { skipped: true, reason: "VideoEncoder unavailable" };
      const support = await VideoEncoder.isConfigSupported({
        codec: "avc1.42001f",
        width: 64,
        height: 64,
        bitrate: 1000000,
        framerate: 10,
      });
      if (!support.supported)
        return { skipped: true, reason: "AVC encoder unsupported" };
      const chunks = [];
      const writable = new WritableStream({
        write: (chunk) => chunks.push(chunk),
      });
      await exportFrames(canvas, writable, {
        fps: 10,
        duration: 0.3,
        renderFrame: (t) => {
          renderer.setClearColor(new T.Color(t, 0.2, 0.5));
          renderer.render(new T.Scene(), camera);
        },
      });
      const size = Math.max(...chunks.map((c) => c.position + c.data.length)),
        bytes = new Uint8Array(size);
      for (const c of chunks) bytes.set(c.data, c.position);
      const input = new Input({
        source: new BufferSource(bytes),
        formats: ALL_FORMATS,
      });
      try {
        const track = await input.getPrimaryVideoTrack();
        assert(track?.displayWidth === 64, "Video width mismatch");
        const duration = await input.computeDuration();
        assert(Math.abs(duration - 0.3) < 0.05, "Video duration mismatch");
        return { bytes: size, duration };
      } finally {
        input.dispose();
      }
    },
  );
  await check("MP4 cancellation aborts the positional writer", async () => {
    if (typeof VideoEncoder === "undefined")
      return { skipped: true, reason: "VideoEncoder unavailable" };
    const controller = new AbortController();
    controller.abort();
    let aborted = false;
    const writable = new WritableStream({
      write() {},
      abort() {
        aborted = true;
      },
    });
    let rejected = false;
    try {
      await exportFrames(canvas, writable, {
        fps: 10,
        duration: 1,
        renderFrame() {},
        signal: controller.signal,
      });
    } catch {
      rejected = true;
    }
    assert(rejected, "Aborted export resolved successfully");
    assert(aborted, "Destination writer was not aborted");
    return { writerAborted: aborted };
  });
  renderer.dispose();
  renderer.forceContextLoss();
  return results;
}

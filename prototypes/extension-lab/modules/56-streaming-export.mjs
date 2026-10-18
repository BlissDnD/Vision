/** Video-only MP4 streaming with cancellation that aborts the destination writer. */
import {
  Output,
  Mp4OutputFormat,
  StreamTarget,
  CanvasSource,
} from "mediabunny";
export async function exportFrames(
  canvas,
  writable,
  { fps = 30, duration = 2, renderFrame, signal, onProgress = () => {} },
) {
  if (
    !renderFrame ||
    ![fps, duration].every(Number.isFinite) ||
    fps <= 0 ||
    fps > 240 ||
    duration <= 0 ||
    duration > 600
  )
    throw new Error(
      "Frame callback and bounded positive fps/duration required",
    );
  const writer = writable.getWriter();
  let failure = null,
    finished = false;
  const bridge = new WritableStream({
    write: (chunk) => writer.write(chunk),
    close() {
      finished = true;
      return failure ? writer.abort(failure) : writer.close();
    },
    abort(reason) {
      finished = true;
      return writer.abort(reason);
    },
  });
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: "fragmented" }),
    target: new StreamTarget(bridge),
  });
  const video = new CanvasSource(canvas, { codec: "avc", bitrate: 8_000_000 });
  output.addVideoTrack(video, { frameRate: fps });
  try {
    signal?.throwIfAborted();
    await output.start();
    const frames = Math.ceil(fps * duration);
    for (let i = 0; i < frames; i++) {
      signal?.throwIfAborted();
      await renderFrame(i / fps);
      signal?.throwIfAborted();
      await video.add(i / fps, Math.min(1 / fps, duration - i / fps));
      onProgress((i + 1) / frames);
    }
    signal?.throwIfAborted();
    video.close();
    await output.finalize();
  } catch (error) {
    failure = error;
    try {
      await output.cancel();
    } catch {}
    if (!finished) {
      try {
        await writer.abort(error);
      } catch {}
      finished = true;
    }
    throw error;
  } finally {
    writer.releaseLock();
  }
}
export const requirements =
  "WebCodecs + a positional writable stream; video only. Caller must not write concurrently. File cancellation semantics depend on the destination implementation.";

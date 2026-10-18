/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import Meyda from "meyda";
export function analyze(samples, { sampleRate = 44100, frameSize = 512 } = {}) {
  if ((frameSize & (frameSize - 1)) !== 0)
    throw new Error("frameSize must be a power of two");
  const oldSize = Meyda.bufferSize,
    oldRate = Meyda.sampleRate;
  Meyda.bufferSize = frameSize;
  Meyda.sampleRate = sampleRate;
  try {
    const frames = [];
    for (
      let start = 0;
      start + frameSize <= samples.length;
      start += frameSize
    ) {
      const f = Meyda.extract(
        ["rms", "spectralCentroid", "zcr"],
        samples.slice(start, start + frameSize),
      );
      frames.push({ time: start / sampleRate, ...f });
    }
    return frames;
  } finally {
    Meyda.bufferSize = oldSize;
    Meyda.sampleRate = oldRate;
  }
}
export function create() {
  return analyze(
    Float32Array.from({ length: 1024 }, (_, i) => Math.sin(i * 0.2)),
  );
}

/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import WaveSurfer from "wavesurfer.js";
export function mount(container, { peaks, duration, onSeek = () => {} }) {
  if (!Array.isArray(peaks) || !(duration > 0))
    throw new Error("Precomputed peaks and positive duration required");
  const wave = WaveSurfer.create({
    container,
    peaks,
    duration,
    waveColor: "#7d9fcf",
    progressColor: "#ffad77",
    height: 80,
    interact: true,
  });
  const off = wave.on("interaction", onSeek);
  return {
    setTime: (t) => wave.setTime(t),
    dispose() {
      off();
      wave.destroy();
    },
  };
}
export function peakEnvelope(samples, bins = 256) {
  if (!samples.length || bins < 1)
    throw new Error("Samples and positive bins required");
  return Array.from({ length: bins }, (_, i) => {
    let max = 0;
    const end = Math.min(
      samples.length,
      Math.ceil(((i + 1) * samples.length) / bins),
    );
    for (let j = Math.floor((i * samples.length) / bins); j < end; j++)
      max = Math.max(max, Math.abs(samples[j]));
    return max;
  });
}

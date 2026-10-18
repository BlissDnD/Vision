/** Isolated usage example for 28-waveform; host contract: ../shared/gallery-host.mjs. */
import * as m from "../modules/28-waveform.mjs";
export async function run(host) {
  const peaks = m.peakEnvelope(
    Float32Array.from(
      { length: 4096 },
      (_, i) => Math.sin(i * 0.09) * (1 - i / 4096),
    ),
    256,
  );
  const wave = m.mount(host.panel, {
    peaks: [peaks],
    duration: 4,
    onSeek: (t) => host.setTime(t),
  });
  return { seek: (t) => wave.setTime(t), dispose: () => wave.dispose() };
}

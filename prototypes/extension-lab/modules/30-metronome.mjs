/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import * as Tone from "tone";
export async function mount({ bpm = 120, onBeat = () => {} } = {}) {
  await Tone.start();
  const synth = new Tone.MembraneSynth({ volume: -18 }).toDestination();
  let timer = null,
    next = 0,
    index = 0;
  return {
    start() {
      if (timer) return;
      next = Tone.now() + 0.05;
      timer = setInterval(() => {
        const until = Tone.now() + 0.1;
        while (next < until) {
          synth.triggerAttackRelease(
            index % 4 === 0 ? "C3" : "C2",
            "32n",
            next,
          );
          onBeat({ index, time: next });
          index++;
          next += 60 / bpm;
        }
      }, 25);
    },
    stop() {
      clearInterval(timer);
      timer = null;
    },
    dispose() {
      clearInterval(timer);
      timer = null;
      synth.dispose();
    },
  };
}
export const requirements =
  "Call mount only after an explicit user audio gesture; never use this metronome as Vel scene clock";

/* Scene time rules (pure; shared by playback, seek, export and audio).
 * - The project range is [0, st.dur]. Loop on: the range repeats. Loop off: the clock runs on past the range
 *   ("továbbfutás"); timed clips hold their end state, continuous generators keep running.
 * - Export length is independent of the range (EXP.dur), so a 10 s intro can be exported as 15 s. */
import { st } from './state';
export const loopOn = () => !!st.loop && st.dur > 0;
/** Map an unbounded clock (seconds from the export/playback start) to scene time. */
export function sceneT(clock: number): number { if (loopOn()) { const d = st.dur; return ((clock % d) + d) % d; } return Math.max(0, clock); }
/** Seconds the playhead is past the range end while Loop is off (0 otherwise). */
export function overrun(t: number): number { return !loopOn() && t > st.dur ? t - st.dur : 0; }
/** Audio sample index for a scene time, or -1 for silence (past the end of the file, no wrap without Loop). */
export function audioIndex(t: number, sr: number, len: number): number { const i = Math.floor(t * sr + 1e-6); return i >= 0 && i < len ? i : -1; }

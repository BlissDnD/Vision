// Önálló időmintavételi minta, nem Vel-integráció és nem TalkingHead-kód.
// A fonéma/szájforma-időpontokat a hang elemzése vagy a felhasználó adja meg.
const smooth = (x) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

export function sampleVisemes(cues, sceneTime, { attack = 0.08, release = 0.12 } = {}) {
  if (!Number.isFinite(sceneTime) || attack < 0 || release < 0) throw new Error('Érvénytelen idő vagy átmenet');
  const weights = {};
  for (const cue of cues) {
    if (!cue.id || !Number.isFinite(cue.at) || !Number.isFinite(cue.duration) || cue.duration <= 0) {
      throw new Error('Érvénytelen szájforma-jelzés');
    }
    const start = cue.at;
    const end = start + cue.duration;
    if (sceneTime < start - attack || sceneTime > end + release) continue;
    const rise = attack === 0 ? 1 : smooth((sceneTime - start + attack) / attack);
    const fall = release === 0 ? 1 : 1 - smooth((sceneTime - end) / release);
    const weight = Math.max(0, Math.min(1, cue.strength ?? 1)) * Math.min(rise, fall);
    weights[cue.id] = Math.max(weights[cue.id] ?? 0, weight);
  }
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (total > 1) for (const id of Object.keys(weights)) weights[id] /= total;
  return weights;
}

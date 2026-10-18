/** Q1: the user's Random taste. "Ronda" / "Tetszik" votes per scene ingredient (e.g. 'dist:kaleido', 'foc:planet'),
 * turned into pickW weight multipliers. Kept in localStorage and also carried in the project file (top-level `taste`);
 * opening a project merges it (per-key max of votes, so merging twice changes nothing). */
export interface Taste { k: Record<string, [number, number]>; log: { id: string; t: number; v: number; keys: string[]; score?: number; sym?: string[] }[] }
const KEY = 'latomas2.rndTaste';
export const TASTE: Taste = (() => { try { const o = JSON.parse(localStorage.getItem(KEY) || 'null'); if (o && o.k) return { k: o.k, log: Array.isArray(o.log) ? o.log : [] }; } catch (_) {} return { k: {}, log: [] }; })();
export function saveTaste() { try { localStorage.setItem(KEY, JSON.stringify(TASTE)); } catch (_) {} }
/** Weight multiplier of one ingredient: 1.15 per like, 0.8 per dislike, kept in 0.3–2. */
export function tasteMul(key: string) { const c = TASTE.k[key]; if (!c) return 1; return Math.min(2, Math.max(.3, Math.pow(1.15, c[0]) * Math.pow(.8, c[1]))); }
/** Record a vote (+1 like, -1 dislike) for all ingredients of a scene. */
export function tasteVote(keys: string[], v: 1 | -1, info: { score?: number; sym?: string[] } = {}) {
  for (const k of keys) { const c = TASTE.k[k] || (TASTE.k[k] = [0, 0]); c[v > 0 ? 0 : 1]++; }
  TASTE.log.push({ id: Math.random().toString(36).slice(2, 10), t: Date.now(), v, keys: [...keys], ...info }); if (TASTE.log.length > 200) TASTE.log.splice(0, TASTE.log.length - 200);
  saveTaste(); }
export const tasteCount = () => TASTE.log.length;
export function tasteClear() { TASTE.k = {}; TASTE.log = []; saveTaste(); }
/** What the project file carries (null when there is nothing to carry). */
export const tasteExport = () => Object.keys(TASTE.k).length ? { k: TASTE.k, log: TASTE.log } : null;
/** Merge a taste from a project file into the local one. Unknown shapes are ignored. */
export function tasteMerge(o: any) {
  if (!o || typeof o !== 'object' || !o.k || typeof o.k !== 'object') return false;
  for (const k in o.k) { const c = o.k[k]; if (!Array.isArray(c)) continue; const u = Math.max(0, +c[0] || 0), d = Math.max(0, +c[1] || 0), m = TASTE.k[k] || (TASTE.k[k] = [0, 0]); m[0] = Math.max(m[0], u); m[1] = Math.max(m[1], d); }
  if (Array.isArray(o.log)) { const ids = new Set(TASTE.log.map(x => x.id)); for (const x of o.log) if (x && x.id && !ids.has(x.id)) TASTE.log.push(x); TASTE.log.sort((a, b) => a.t - b.t); if (TASTE.log.length > 200) TASTE.log.splice(0, TASTE.log.length - 200); }
  saveTaste(); return true; }

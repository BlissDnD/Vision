/* Project file / autosave migration. Every load path (file, autosave, tests) goes through here, so an old
 * project never loses layers silently: anything that cannot be kept is listed in `dropped`.
 * Versions:  v1/v2 = Látomás Stúdió (app:'latomas', ≤ v13) · v3 = Vel (app:'vel', shared scene clock)
 *            · v4 = + Közös alap / Változat (state.bases, group.variant) and Kapcsolat (state.links); older files: none. */
import { EFFECTS } from './effects/index';

export const PROJECT_VER = 4;
export interface Migrated { state: any; assets: Record<string, any>; from: number; dropped: string[] }

export function migrateProject(obj: any): Migrated {
  if (!obj || typeof obj !== 'object') throw new Error('Ez nem Vel / Látomás projekt.');
  const raw = obj.state && Array.isArray(obj.state.layers) ? obj.state : Array.isArray(obj.layers) ? obj : null;
  if (!raw) throw new Error('Ez nem Vel / Látomás projekt.');
  const from = +obj.v || (obj.app ? 2 : 1);
  if (from > PROJECT_VER) console.warn(`Projekt v${from}, ez a program v${PROJECT_VER}-ig ismeri.`);
  const state = JSON.parse(JSON.stringify(raw));
  const dropped: string[] = [];
  const keepFx = (list: any[]) => (list || []).filter(f => { const ok = f && EFFECTS[f.type]; if (!ok) dropped.push(`${f && f.name || '?'} (${f && f.type})`); return ok; });
  const keep = (L: any, depth: number): any => {
    if (!L || typeof L !== 'object') return null;
    if (L.type === 'group') {
      if (depth > 0) { // the renderer supports one group level: flatten deeper groups instead of dropping them
        return (L.children || []).map((c: any) => keep(c, depth)).flat().filter(Boolean);
      }
      L.children = (L.children || []).map((c: any) => keep(c, depth + 1)).flat().filter(Boolean);
      L.fx = keepFx(L.fx);
      return L;
    }
    if (!EFFECTS[L.type]) { dropped.push(`${L.name || '?'} (${L.type})`); return null; }
    L.fx = keepFx(L.fx);
    return L;
  };
  state.layers = state.layers.map((L: any) => keep(L, 0)).flat().filter(Boolean);
  // S1 scenes: the same rules for every saved scene (missing = none)
  if (Array.isArray(state.scenes)) for (const s of state.scenes) if (s && Array.isArray(s.layers)) s.layers = s.layers.map((L: any) => keep(L, 0)).flat().filter(Boolean);
  // v1/v2 had no explicit loop flag in very early files: missing = loop on (old default)
  if (state.loop === undefined) state.loop = true;
  state.ver = PROJECT_VER;
  return { state, assets: obj.assets || {}, from, dropped };
}

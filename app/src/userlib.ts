/** P1: the user's own, durable library (presets, shaders, later anything else).
 *  One generic item shape: {id, kind, cat, name, created, data, thumb}. Kept in memory (ULIB) so shelves read it
 *  synchronously; IndexedDB ('vel-userlib') is the durable copy. Every storage failure degrades to "memory only".
 *  The whole library exports to one .json file and imports back; a project file carries the items it uses. */
import { R } from './runtime';
import { st, walk } from './state';

export interface UItem { id: string; kind: string; cat: string; name: string; created: number; data: any; thumb?: string | null; v?: number }
export const ULIB_VER = 1;
export const ULIB: UItem[] = [];
R.ulibOk = false; // true once IndexedDB answered (false = this browser keeps the library only for this session)

let dbp: Promise<IDBDatabase | null> | null = null;
function db(): Promise<IDBDatabase | null> {
  if (!dbp) dbp = new Promise(res => {
    try {
      const r = indexedDB.open('vel-userlib', 1);
      r.onupgradeneeded = () => { try { r.result.createObjectStore('items', { keyPath: 'id' }); } catch (_) { /* exists */ } };
      r.onsuccess = () => res(r.result); r.onerror = () => res(null); r.onblocked = () => res(null);
    } catch (_) { res(null); }
  });
  return dbp;
}
const tx = async (mode: IDBTransactionMode, fn: (s: IDBObjectStore) => void): Promise<boolean> => {
  const d = await db(); if (!d) return false;
  return new Promise(res => { try { const t = d.transaction('items', mode); fn(t.objectStore('items')); t.oncomplete = () => res(true); t.onerror = () => res(false); t.onabort = () => res(false); } catch (_) { res(false); } });
};

export const ulibId = () => 'U' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
/** Normalised copy of an item, or null when it is not one (unknown fields are kept, so later kinds survive). */
export function ulibValid(x: any): UItem | null {
  if (!x || typeof x !== 'object' || typeof x.id !== 'string' || !x.id || x.data == null) return null;
  return { ...x, kind: String(x.kind || 'preset'), cat: String(x.cat || 'recipes'), name: String(x.name || 'Unnamed').slice(0, 60), created: +x.created || Date.now(), thumb: typeof x.thumb === 'string' ? x.thumb : null, v: ULIB_VER };
}
export const ulibGet = (id: string) => ULIB.find(x => x.id === id) || null;
export const ulibBy = (pred: (x: UItem) => boolean) => ULIB.filter(pred);

/** Load the durable copy into memory (merging with anything added before it answered). */
export async function ulibLoad(): Promise<number> {
  const d = await db(); if (!d) return ULIB.length;
  const all: any[] = await new Promise(res => { try { const q = d.transaction('items', 'readonly').objectStore('items').getAll(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); } catch (_) { res([]); } });
  R.ulibOk = true;
  for (const raw of all) { const x = ulibValid(raw); if (x && !ulibGet(x.id)) ULIB.push(x); }
  ULIB.sort((a, b) => a.created - b.created);
  changed();
  return ULIB.length;
}
function changed() { if (R.onUlib) try { R.onUlib(); } catch (e) { console.warn(e); } }
export async function ulibPut(item: any): Promise<UItem | null> {
  const x = ulibValid(item); if (!x) return null;
  const i = ULIB.findIndex(y => y.id === x.id); if (i >= 0) ULIB[i] = x; else ULIB.push(x);
  changed(); await tx('readwrite', s => s.put(x)); return x;
}
export async function ulibDel(id: string): Promise<void> {
  const i = ULIB.findIndex(y => y.id === id); if (i < 0) return; ULIB.splice(i, 1);
  changed(); await tx('readwrite', s => s.delete(id));
}
export async function ulibRename(id: string, name: string): Promise<void> {
  const x = ulibGet(id); if (!x || !name.trim()) return; await ulibPut({ ...x, name: name.trim() });
}
/** Add items that are not here yet (by id). Existing items are never overwritten. Returns how many were added. */
export async function ulibMerge(list: any[]): Promise<number> {
  let n = 0;
  for (const raw of Array.isArray(list) ? list : []) { const x = ulibValid(raw); if (!x || ulibGet(x.id)) continue; ULIB.push(x); n++; await tx('readwrite', s => s.put(x)); }
  if (n) changed(); return n;
}
/** The whole library as one file. */
export const ulibExport = () => JSON.stringify({ app: 'vel', kind: 'userlib', v: ULIB_VER, items: ULIB }, null, 1);
/** Import a library file (or a single item / an array). Throws a readable message when it is not one. */
export async function ulibImport(text: string): Promise<number> {
  let o: any; try { o = JSON.parse(text); } catch (_) { throw new Error('This is not a JSON file.'); }
  const list = Array.isArray(o) ? o : o && Array.isArray(o.items) ? o.items : o && o.id ? [o] : null;
  if (!list) throw new Error('This is not a Vel library file.');
  return ulibMerge(list);
}
/** Library items used by the project (layers tagged with `ulib`), without thumbnails, for the project file. */
export function ulibUsed(): UItem[] {
  const ids = new Set<string>(); const tag = (L: any) => { if (L && L.ulib) ids.add(L.ulib); };
  walk(st.layers, tag); for (const s of st.scenes || []) walk(s.layers || [], tag);
  return [...ids].map(ulibGet).filter(Boolean).map((x: any) => ({ ...x, thumb: null }));
}

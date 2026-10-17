/** Persistent shelf-thumbnail cache (IndexedDB). Keyed by build id + shelf + item name, so a new build
 *  re-renders once and later loads draw instantly. Every failure degrades to "not cached". */
declare const __BUILD__: string;
const BUILD = typeof __BUILD__ !== 'undefined' ? __BUILD__ : 'dev';
let dbp: Promise<IDBDatabase | null> | null = null;
function db(): Promise<IDBDatabase | null> {
  if (!dbp) dbp = new Promise(res => {
    try {
      const r = indexedDB.open('latomas-thumbs', 1);
      r.onupgradeneeded = () => { try { r.result.createObjectStore('t'); } catch (_) { /* exists */ } };
      r.onsuccess = () => res(r.result); r.onerror = () => res(null); r.onblocked = () => res(null);
    } catch (_) { res(null); }
  });
  return dbp;
}
const k = (cat: string, name: string) => `${BUILD}|${cat}|${name}`;
export async function thumbGet(cat: string, name: string): Promise<ImageBitmap | null> {
  const d = await db(); if (!d) return null;
  const blob: Blob | null = await new Promise(res => {
    try { const q = d.transaction('t', 'readonly').objectStore('t').get(k(cat, name)); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); } catch (_) { res(null); }
  });
  if (!blob) return null;
  try { return await createImageBitmap(blob); } catch (_) { return null; }
}
export async function thumbPut(cat: string, name: string, canvas: HTMLCanvasElement): Promise<void> {
  const d = await db(); if (!d) return;
  const blob: Blob | null = await new Promise(res => { try { canvas.toBlob(b => res(b), 'image/webp', 0.86); } catch (_) { res(null); } });
  if (!blob) return;
  try { d.transaction('t', 'readwrite').objectStore('t').put(blob, k(cat, name)); } catch (_) { /* quota or private mode */ }
}
/** Drop thumbnails of older builds (called once at boot, idle). */
export async function thumbPrune(): Promise<void> {
  const d = await db(); if (!d) return;
  try {
    const st = d.transaction('t', 'readwrite').objectStore('t'); const q = st.openCursor();
    q.onsuccess = () => { const c = q.result; if (!c) return; if (!String(c.key).startsWith(BUILD + '|')) c.delete(); c.continue(); };
  } catch (_) { /* ignore */ }
}

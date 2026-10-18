/** Durable project autosave. IndexedDB keeps small embedded vector assets out of localStorage quota. */
const DB = 'vel-autosave-v1', STORE = 'projects', KEY = 'current', LEGACY = 'latomas2.auto';
function dbOpen(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('IndexedDB unavailable')); return; }
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function readAuto(): Promise<string | null> {
  // If IndexedDB writes later fail, the complete localStorage fallback is the newest record.
  try { const fallback = localStorage.getItem(LEGACY); if (fallback) return fallback; } catch (_) {}
  try {
    const db = await dbOpen();
    const data = await new Promise<string | null>((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(typeof req.result === 'string' ? req.result : null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (data) return data;
  } catch (_) { /* Old/local-only browsers keep their existing autosave. */ }
  return null;
}
let writeQueue: Promise<boolean> = Promise.resolve(true);
async function writeAuto(data: string): Promise<boolean> {
  try {
    const db = await dbOpen();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(data, KEY);
      tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
    db.close();
    try { localStorage.removeItem(LEGACY); } catch (_) {}
    return true;
  } catch (_) {
    try { localStorage.setItem(LEGACY, data); return true; } catch (_) { return false; }
  }
}
export function saveAuto(data: string): Promise<boolean> {
  const next = writeQueue.then(() => writeAuto(data));
  writeQueue = next.catch(() => false);
  return next;
}

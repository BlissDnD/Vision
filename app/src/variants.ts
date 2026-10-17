/* Közös alap (shared base) / Változat (variant) / Kapcsolat (link).
 *
 * Három külön fogalom, semmi rejtett frissülés (terv 0.4):
 *  - Csoport: plain `type:'group'` layer, as before.
 *  - Közös alap: content stored once in `st.bases[id] = {id, name, children}`. It is not rendered by itself.
 *  - Változat: a group with `variant: {base}` whose children are a *materialised copy* of the base, ids `<variant>.<baseChild>`
 *    and `bid` = base child id. Edits in a variant stay local. The local difference is never tracked by the UI: it is
 *    derived on demand (localDiff = variant vs. base), so every existing editor keeps working unchanged.
 *    Base changes reach other variants only through an explicit „Átadás” (transfer); their own local values win.
 *  - Kapcsolat: `st.links = [{id, from:{id,g,k}, to:{id,g,k}, mode, amt, on}]`: one element's parameter drives another's.
 *    Evaluated in ev() through a non-enumerable `_lk` hook on the target NParam (never saved, never diffed).
 */
import { BASE, EFFECTS } from './effects/index';
import { findItem, normalize, st, uid, walk } from './state';

export interface Base { id: string; name: string; children: any[] }
export interface DiffEntry { bid: string; path: string[]; val: any; json?: string }
export interface LocalDiff { values: DiffEntry[]; added: any[]; removed: string[] }
export interface Link { id: string; from: { id: string; g: 'n' | 'p'; k: string }; to: { id: string; g: 'n' | 'p'; k: string }; mode: 'add' | 'set'; amt: number; on: boolean }

const SKIP = new Set(['id', 'bid', 'open']);
const noIds = (v: any) => JSON.stringify(v, (k, x) => (k === 'id' || k === 'bid' ? undefined : x));
const clone = (v: any) => JSON.parse(JSON.stringify(v));

/** path → JSON leaf. Plain objects recurse; arrays (keys, fx chain, prims) are compared whole, ids ignored. */
export function flatten(o: any, pre: string[] = [], out: Map<string, { path: string[]; json: string }> = new Map()) {
  for (const k of Object.keys(o)) {
    if (SKIP.has(k)) continue;
    const v = o[k], path = [...pre, k];
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, path, out);
    else out.set(path.join('\u0001'), { path, json: Array.isArray(v) ? noIds(v) : JSON.stringify(v) });
  }
  return out;
}
function setPath(o: any, path: string[], json: string) {
  let c = o; for (let i = 0; i < path.length - 1; i++) { if (!c[path[i]] || typeof c[path[i]] !== 'object') c[path[i]] = {}; c = c[path[i]]; }
  const v = json === undefined ? undefined : JSON.parse(json);
  if (v === undefined) delete c[path[path.length - 1]]; else c[path[path.length - 1]] = v;
}

export const isVariant = (L: any) => !!(L && L.type === 'group' && L.variant && st.bases && st.bases[L.variant.base]);
export const variantsOf = (baseId: string) => { const r: any[] = []; walk(st.layers, (it: any) => { if (it.type === 'group' && it.variant && it.variant.base === baseId) r.push(it); }); return r; };

/** Rebuild one child from its base child + local values, with stable ids. */
function materialChild(variantId: string, bc: any, values: DiffEntry[]) {
  const c = clone(bc); c.bid = bc.id; c.id = variantId + '.' + bc.id;
  (c.fx || []).forEach((f: any, i: number) => { f.id = c.id + '.fx' + i; });
  for (const e of values) if (e.bid === bc.id) setPath(c, e.path, e.json ?? JSON.stringify(e.val));
  (c.fx || []).forEach((f: any, i: number) => { f.id = c.id + '.fx' + i; }); // fx arrays may have been replaced by a local value
  return normalize(c);
}

/** What this variant does differently from its base. */
export function localDiff(V: any): LocalDiff {
  const B = st.bases[V.variant.base], out: LocalDiff = { values: [], added: [], removed: [] };
  const byId = new Map(B.children.map((c: any) => [c.id, c]));
  const seen = new Set<string>();
  for (const c of V.children || []) {
    const bc = c.bid && byId.get(c.bid);
    if (!bc) { out.added.push(c); continue; }
    seen.add(c.bid);
    const mine = flatten(c), base = flatten(bc);
    for (const [key, e] of mine) { const b = base.get(key); if (!b || b.json !== e.json) out.values.push({ bid: c.bid, path: e.path, val: JSON.parse(e.json), json: e.json } as any); }
    for (const [key, b] of base) if (!mine.has(key)) out.values.push({ bid: c.bid, path: b.path, val: undefined, json: undefined } as any);
  }
  for (const bc of B.children) if (!seen.has(bc.id)) out.removed.push(bc.id);
  return out;
}
export const diffCount = (V: any) => { if (!isVariant(V)) return 0; const d = localDiff(V); return d.values.length + d.added.length + d.removed.length; };

/** Re-create the variant's children from base + diff, keeping the variant's own child order. */
export function rematerialize(V: any, d: LocalDiff) {
  const B = st.bases[V.variant.base], byBid = new Map(B.children.map((c: any) => [c.id, c]));
  const order = (V.children || []).map((c: any) => (c.bid && byBid.has(c.bid) ? 'b:' + c.bid : c));
  const used = new Set<string>(), kids: any[] = [];
  for (const o of order) {
    if (typeof o === 'string') { const bid = o.slice(2); if (d.removed.includes(bid)) continue; used.add(bid); kids.push(materialChild(V.id, byBid.get(bid), d.values)); }
    else if (d.added.includes(o)) kids.push(o);
  }
  for (const bc of B.children) if (!used.has(bc.id) && !d.removed.includes(bc.id)) kids.push(materialChild(V.id, bc, d.values)); // new in base
  for (const a of d.added) if (!kids.includes(a)) kids.push(a);
  V.children = kids;
}

/** Turn a plain group into the first Változat of a new Közös alap. */
export function makeBase(groupId: string) {
  const r = findItem(groupId); if (!r || r.it.type !== 'group' || r.it.variant) return null;
  const G = r.it, id = 'B' + uid().slice(1);
  if (!st.bases) st.bases = {};
  st.bases[id] = { id, name: G.name, children: clone(G.children).map((c: any) => { delete c.bid; c.id = uid(); (c.fx || []).forEach((f: any) => { f.id = uid(); }); return c; }) };
  G.variant = { base: id };
  rematerialize(G, { values: [], added: [], removed: [] });
  return id;
}

/** Duplicate a variant: same base, same local differences (a new poster from the same family). */
export function newVariant(variantId: string, name?: string) {
  const r = findItem(variantId); if (!r || !isVariant(r.it)) return null;
  const V = r.it, d = localDiff(V);
  const N: any = { ...clone({ ...V, children: [] }), id: uid(), name: name || nextName(V.name), children: [] };
  N.children = V.children.map((c: any) => (c.bid ? { bid: c.bid } : null)).filter(Boolean);
  const added = d.added.map((a: any) => { const c = clone(a); c.id = uid(); (c.fx || []).forEach((f: any) => { f.id = uid(); }); return c; });
  rematerialize(N, { values: d.values, added, removed: d.removed });
  r.list.splice(r.i + 1, 0, N);
  V.vis = false; N.vis = true; // one canvas: show the new poster, hide its source (eye icon switches)
  return N.id;
}
const nextName = (n: string) => { const m = /^(.*?)(\d+)$/.exec(n); return m ? m[1] + (+m[2] + 1) : n + ' 2'; };

/** „Átadás”: send this variant's local values (optionally only for one child) to the base or to chosen variants.
 *  Targets keep their own local values for paths they changed themselves, except the paths being transferred. */
export function transfer(srcId: string, to: 'base' | string[], onlyBid?: string) {
  const r = findItem(srcId); if (!r || !isVariant(r.it)) return 0;
  const S = r.it, baseId = S.variant.base, B = st.bases[baseId];
  const sd = localDiff(S), send = sd.values.filter(e => !onlyBid || e.bid === onlyBid);
  if (!send.length) return 0;
  const keyOf = (e: DiffEntry) => e.bid + '\u0001' + e.path.join('\u0001');
  const sendKeys = new Set(send.map(keyOf));
  if (to === 'base') {
    const all = variantsOf(baseId).map(V => [V, localDiff(V)] as const);       // 1) diffs before the base changes
    for (const e of send) { const bc = B.children.find((c: any) => c.id === e.bid); if (bc) setPath(bc, e.path, (e as any).json); } // 2) base
    for (const [V, d] of all) {                                                   // 3) everyone re-built; own values win, except the source
      const vals = V === S ? d.values.filter(e => !sendKeys.has(keyOf(e))) : d.values;
      rematerialize(V, { ...d, values: vals });
    }
  } else {
    for (const id of to) {
      const t = findItem(id); if (!t || !isVariant(t.it) || t.it.variant.base !== baseId || t.it === S) continue;
      const d = localDiff(t.it), vals = d.values.filter(e => !sendKeys.has(keyOf(e))).concat(send);
      rematerialize(t.it, { ...d, values: vals });
    }
  }
  return send.length;
}

/** „Leválasztás”: the variant becomes an ordinary group (keeps its look). The base stays for the others. */
export function detach(variantId: string) {
  const r = findItem(variantId); if (!r || !r.it.variant) return false;
  const V = r.it; delete V.variant; for (const c of V.children || []) delete c.bid;
  gcBases(); return true;
}
export function gcBases() { if (!st.bases) return; for (const id of Object.keys(st.bases)) if (!variantsOf(id).length) delete st.bases[id]; }

/* ---------------- Kapcsolat ---------------- */
const BASED = Object.fromEntries(BASE.map((b: any) => [b.k, b]));
export function paramDef(L: any, g: 'n' | 'p', k: string) { return g === 'n' ? BASED[k] : EFFECTS[L.type] && EFFECTS[L.type].params.find((d: any) => d.k === k); }
let depth = 0;
/** (Re)attach all link hooks. Called after every commit/restore/load; cheap. */
export function attachLinks(evFn: (n: any, d: any, t: number) => number) {
  walk(st.layers, (L: any) => { for (const g of ['n', 'p']) for (const k in L[g] || {}) if (L[g][k] && L[g][k]._lk) delete L[g][k]._lk; });
  for (const lk of st.links || []) {
    if (!lk.on) continue;
    const a = findItem(lk.from.id), b = findItem(lk.to.id); if (!a || !b) continue;
    const sn = a.it[lk.from.g] && a.it[lk.from.g][lk.from.k], tn = b.it[lk.to.g] && b.it[lk.to.g][lk.to.k];
    const sd = paramDef(a.it, lk.from.g, lk.from.k), td = paramDef(b.it, lk.to.g, lk.to.k);
    if (!sn || !tn || !sd || !td || sn === tn) continue;
    const prev = tn._lk && tn._lk.f;
    const f = (t: number, v: number) => {
      if (prev) v = prev(t, v);
      if (depth > 4) return v; depth++;
      try { const s = (evFn(sn, sd, t) - sd.min) / ((sd.max - sd.min) || 1), span = (td.max - td.min) || 1;
        return lk.mode === 'set' ? td.min + lk.amt * s * span : v + lk.amt * (s - 0.5) * span; }
      finally { depth--; }
    };
    Object.defineProperty(tn, '_lk', { value: { f }, enumerable: false, configurable: true, writable: true });
  }
}
export function addLink(from: Link['from'], to: Link['to'], mode: Link['mode'] = 'add', amt = 1) {
  if (!st.links) st.links = [];
  const lk: Link = { id: 'K' + uid().slice(1), from, to, mode, amt, on: true }; st.links.push(lk); return lk;
}
export function removeLink(id: string) { st.links = (st.links || []).filter((l: Link) => l.id !== id); }
/** Links touching an element (inside, outgoing, incoming), for the Kapcsolatok list. */
export const linksOf = (id: string) => (st.links || []).filter((l: Link) => l.from.id === id || l.to.id === id || l.from.id.startsWith(id + '.') || l.to.id.startsWith(id + '.'));


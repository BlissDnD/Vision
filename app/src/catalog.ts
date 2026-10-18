// CAT-01: library metadata — stable item id, four roles (Források/Formák/Megjelenések/Mozgás) and a synonym-aware,
// accent-free search over names, descriptions and effect keys. Pure index over LIB; no UI, no state writes.
import { CATS, LIB } from './library';
import { EFFECTS } from './effects/index';
import { MO } from './motion';

export const fold = (s: any) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slug = (s: string) => fold(s).replace(/ /g, '-');

/** The four roles of the library (plan §5 / CAT-01). Receptek belong to every role filter only under „Mind”. */
export const ROLES: [string, string][] = [['src', 'Források'], ['form', 'Formák'], ['look', 'Megjelenések'], ['mo', 'Mozgás']];
const CAT_ROLE: Record<string, string | null> = { recipes: null, gen: 'src', world: 'src', particles: 'src', media: 'src', shapes: 'form', '3d': 'form', fx: 'look', motion: 'mo' };
export const roleOf = (cat: string, it: any) => (it && it.mo ? 'mo' : CAT_ROLE[cat] ?? null);

/** Stable id of a library entry: survives reordering of the shelf (name-based), own items keep their own id. */
export const catId = (cat: string, i: number) => { const it = LIB[cat][i]; return it.own ? 'own:' + it.own : `${cat}:${slug(it.name)}`; };

/** Synonym groups: a query word matching any member also searches the others (Hungarian + common English, accent-free). */
const SYN = [
  'fust smoke para kod gomoly felho cloud',
  'tuz lang fire flame izzas parazs lava',
  'viz water folyadek fluid tinta ink csepp hullam wave tenger ocean',
  'krom chrome fem metal tukros tukor fenyes mirror reflect csillogo arany gold ezust',
  'uveg glass atlatszo liquid prizma',
  'szoveg text felirat betu cim title tipografia font szo',
  'gomb gomb golyo labda sphere ball bolygo planet hold',
  'henger cylinder cso tube szalag ribbon',
  'reszecske particle szikra spark por dust csillag star hopehely ho snow',
  'fizika physics esik zuhan pattan gravitacio test merev',
  'lebeg float sodrod', 'forog forgas spin porog', 'pulzal pulse lukt', 'rezeg remeg shake', 'rugo rugalmas spring', 'kering orbit palya',
  'fenyes glow ragyogas neon fenycsik light feny vilagitas',
  'elmosas blur homalyos lagy',
  'retro crt monitor kepernyo vhs glitch jelhiba zaj noise',
  'kamera camera lencse lens fokusz',
  'virag flower szirom ornament mandala',
  'taj terep terrain hegy domb mountain tajkep vilag world eg sky nap sun',
  'kep image foto photo textura texture media',
  'vonal line utvonal path gorbe curve rajz',
  'forma shape alakzat kor negyzet haromszog sokszog',
  '3d terbeli mely extrud kihuzott',
  'hologram rajzolt sketch toll ceruza kezi',
].map(s => s.split(' '));
const expand = (w: string) => { const out = new Set([w]); for (const g of SYN) if (g.some(x => x.startsWith(w) || (w.length > 3 && w.startsWith(x)))) g.forEach(x => out.add(x)); return [...out]; };

const effKeysIn = (it: any): string[] => {
  const ks = new Set<string>(); if (it.mo) ks.add('mo:' + it.mo);
  for (const k in EFFECTS) if ((EFFECTS as any)[k].name === it.name) ks.add(k);
  try { const src = String(it.make || ''); for (const m of src.matchAll(/['"]([a-zA-Z0-9]+)['"]/g)) if ((EFFECTS as any)[m[1]]) ks.add(m[1]); } catch (_) { /* ignore */ }
  return [...ks];
};
let IDX: any[] | null = null;
/** Lazily built once per library change (own items invalidate via resetCatalog). */
export function catalogIndex() {
  if (IDX) return IDX; IDX = []; const seen = new Set<string>();
  for (const [c, cl] of CATS) LIB[c].forEach((it: any, i: number) => {
    if (it.head) return;
    const descs = effKeysIn(it).map(k => k.startsWith('mo:') ? (MO[k.slice(3)] || {}).desc || '' : `${(EFFECTS as any)[k].name} ${(EFFECTS as any)[k].desc || ''} ${k}`);
    let id = catId(c, i); while (seen.has(id)) id += '~'; seen.add(id);
    // hay: everything incl. the shelf label (direct words); own: the entry's own words only (synonym matches, so „lebeg” ≠ every motion)
    const own = fold(`${it.name} ${it.desc || ''} ${descs.join(' ')} ${(it.tags || []).join(' ')}`).split(' ');
    IDX!.push({ cat: c, i, id, role: roleOf(c, it), name: fold(it.name), own, hay: [...own, ...fold(cl).split(' ')] });
  });
  return IDX;
}
export const resetCatalog = () => { IDX = null; };

/** Search: every query word (or one of its synonyms) must prefix-match a word of the entry. Name hits rank first. */
export function catSearch(q: string, role: string | null = null): [string, number][] {
  const f = fold(q); if (!f) return []; const words = f.split(' ');
  const hits: { r: any; s: number }[] = [];
  for (const r of catalogIndex()) {
    if (role && r.role !== role) continue;
    let s = 0, ok = true;
    for (const w of words) {
      const nameHit = r.name.split(' ').some((x: string) => x.startsWith(w));
      if (nameHit) { s += 100; continue; }
      if (r.hay.some((x: string) => x.startsWith(w))) { s += 40; continue; }
      const syn = expand(w).filter(x => x !== w);
      if (syn.some(y => r.name.split(' ').some((x: string) => x.startsWith(y)))) { s += 60; continue; }
      if (syn.some(y => r.own.some((x: string) => x.startsWith(y)))) { s += 15; continue; }
      ok = false; break;
    }
    if (!ok) continue;
    if (r.name === f) s += 500; else if (r.name.startsWith(f)) s += 200;
    hits.push({ r, s });
  }
  hits.sort((a, b) => b.s - a.s || a.r.name.localeCompare(b.r.name, 'hu'));
  return hits.map(x => [x.r.cat, x.r.i]);
}
/** Count of hits per role (for the chips). */
export function catRoleCounts(q: string) { const o: Record<string, number> = {}; for (const [k] of ROLES) o[k] = catSearch(q, k).length; return o; }

/** CAT-01 2nd slice: theme collections across shelves. An entry belongs to a theme when one of its own words
 *  (name, description, effect key) starts with one of the theme's words; the same entry can be in several themes. */
export const TOPICS: [string, string, string][] = [
  ['fluid', 'Folyadék', 'folyad fluid tinta viz csepp hullam lava liquid ink olvad metaball'],
  ['light', 'Fény és anyag', 'feny glow ragyog neon kroma krom fem uveg glass tukor anyag hologram rajzolt csillan bloom lencse flare lens'],
  ['text', 'Szöveg', 'szoveg text betu felirat cim tipogra font'],
  ['nature', 'Természet', 'felho fust tuz lang terep taj hegy eg nap hold bolygo viz virag level ho csillag aurora kod para'],
  ['space', 'Tér / 3D', '3d terbeli gomb henger test kamera terep obj3d sdf mesh extrud kihuz bolygo'],
  ['retro', 'Retró', 'crt vhs glitch jelhiba pixel ascii halftone raszter film szemcse retro'],
  ['motion', 'Mozgás-alapok', 'lebeg forog pulzal rezeg rugo kering beuszas fizika utvonal ritmus'],
  ['layout', 'Layout', 'bento racs grid magazin galeria kartya layout keret'],
];
export function topicItems(topic: string): [string, number][] {
  const T = TOPICS.find(t => t[0] === topic); if (!T) return []; const ws = T[2].split(' ');
  return catalogIndex().filter(r => r.own.some((x: string) => ws.some(w => x.startsWith(w)))).map(r => [r.cat, r.i] as [string, number]);
}

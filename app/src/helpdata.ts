/* Contextual help: reviewed Hungarian topics and explicit links. No project or DOM dependencies. */
export type HelpPart = string | { term: string; label?: string };
export interface HelpTopic { parts?: HelpPart[]; id: string; title: string; summary: string; steps: string[]; relatedIds: string[]; sourceRefs: string[]; }
const topic = (id: string, title: string, summary: string, steps: string[], relatedIds: string[], sourceRefs: string[]): HelpTopic => ({ id, title, summary, steps, relatedIds, sourceRefs });
export const HELP_TOPICS: HelpTopic[] = [
  topic('help', 'Súgó mód', 'Mutass egy vezérlőre, és olvasd el a hozzá tartozó magyarázatot. A fogalmakra kattintva tovább léphetsz.', ['A Rögzítés gombbal vagy F1-gyel tartsd nyitva a kártyát.', 'Érintőképernyőn, bekapcsolt Súgó módban érints meg egy vezérlőt a magyarázatához.'], ['library', 'animation'], ['workspace.ts', 'help.ts']),
  topic('library', 'Könyvtár és keresés', 'A könyvtárból forrásokat, formákat, megjelenéseket, mozgásokat és kész recepteket választhatsz.', ['Írj a keresőbe; a szerep szerinti szűrőkkel szűkítheted a találatokat.', 'A könyvtár elemének szokásos beillesztési gesztusát használd; a súgólink csak magyarázatot nyit.'], ['source', 'appearance', 'motion', 'recipe'], ['catalog.ts:catSearch', 'shelf.ts']),
  topic('source', 'Forrás és forma', 'A forrás hozza létre a képet vagy látványt; a forma az alakzatot adja, amivel kompozíciót építhetsz.', ['Válassz elemet a megfelelő könyvtári polcról, majd a réteg beállításain finomíts.'], ['layer', 'appearance'], ['library.ts', 'catalog.ts:ROLES']),
  topic('appearance', 'Megjelenés', 'Egy rétegre húzott Megjelenés annak a rétegnek a látványát alakítja.', ['Húzz egy Megjelenést a könyvtárból a kívánt rétegre.', 'Több effekt esetén figyelj a sorrendre: a későbbi hatás a korábbi eredményét is átalakíthatja.'], ['blur', 'layer', 'library'], ['shelf.ts', 'inspector.ts']),
  topic('blur', 'Elmosás', 'Lágy Gauss-elmosás. Alakzatra húzva puha szélű maszkot kapsz.', ['Húzd az Elmosás Megjelenést egy rétegre, majd az Erősség paraméterrel állítsd a mértékét.'], ['appearance', 'layer'], ['effects/filters.ts:blur']),
  topic('motion', 'Mozgás', 'A ráhelyezett mozgás a réteg mozgását számítja az időből. A beállításai a réteg Mozgás fülén találhatók.', ['Válassz mozgást a könyvtárból, majd finomítsd a réteg Mozgás fülén.'], ['animation', 'keyframe', 'loop'], ['motion.ts', 'moui.ts']),
  topic('recipe', 'Recept', 'A recept több, együtt működő elemből összeállított kiindulás az alkotáshoz.', ['Illessz be egy receptet, és bontsd ki a rétegeit, ha egy részletet szeretnél módosítani.'], ['layer', 'source', 'appearance'], ['recipes.ts', 'modals.ts']),
  topic('layer', 'Réteg', 'A kompozíció elemeit a réteglistában választod ki; a kijelölt elem beállításai a jobb oldali panelen jelennek meg.', ['Jelölj ki egy réteget. A vásznon húzással mozgathatod, a fogantyúkkal alakíthatod.'], ['animation', 'appearance', 'keyframe'], ['layers.ts', 'stage.ts', 'inspector.ts']),
  topic('animation', 'Animálás mód', 'Bekapcsolva a módosított, animálható értékhez az aktuális időpontban kulcsképkocka készül.', ['Az A billentyűvel vagy az Animálás gombbal válts módot.', 'Állíts időpontot, majd változtasd meg a kívánt értéket.'], ['keyframe', 'motion', 'timeline'], ['animate.ts', 'keyboard.ts']),
  topic('keyframe', 'Kulcsképkocka', 'Egy paraméter adott időponthoz mentett értéke. Több kulcs között a Vel kiszámítja a köztes változást.', ['Az idővonalon válassz időpontot, majd Animálás módban módosíts egy animálható paramétert.'], ['animation', 'timeline'], ['evaluation.ts:setKey', 'animate.ts']),
  topic('timeline', 'Sávok és idővonal', 'Az idővonalon megkeresheted azt a pillanatot, amelyet beállítanál; a Sávok nézetben rétegek és kulcsok is látszanak.', ['A Sávok gombbal nyisd meg a részletes idővonalat.', 'Kattints vagy húzz az idővonalon az időpont váltásához.'], ['keyframe', 'loop', 'playback'], ['timeline.ts', 'transport.ts']),
  topic('loop', 'Ismétlés és Körbeér', 'A jelenet ismétlése a lejátszást újrakezdi a beállított hossz végén. Ez önmagában nem tesz minden mozgást varratmentessé.', ['Az Ismétlés gombbal váltsd a jelenet ismétlését.', 'Ahol elérhető, a mozgás Körbeér beállításával igazíthatod a periódust a loophoz.'], ['motion', 'timeline'], ['transport.ts', 'motion.ts:syncKLoop']),
  topic('playback', 'Lejátszás', 'Elindítja vagy megállítja a jelenet idejét.', ['Nyomd meg a Szóközt, vagy kattints a Lejátszás gombra.', 'Szövegmező szerkesztése közben a szóköz a szövegbe kerül.'], ['timeline', 'loop'], ['keyboard.ts', 'transport.ts:setPlay']),
  topic('project', 'Projekt mentése', 'A projekt az újraszerkeszthető alkotás. Az elkészült kép vagy videó exportja külön művelet.', ['A Projekt menüben keresd a mentési és megnyitási lehetőségeket.', 'A projektfájlt tartsd meg, ha később folytatnád a szerkesztést.'], ['export', 'recipe'], ['modals.ts:projModal', 'history.ts:projectJSON']),
  topic('export', 'Exportálás', 'Az alkotásból képet, videót vagy önálló HTML-t készíthetsz a felkínált exportmódokkal.', ['Nyisd meg az Exportálás ablakot, válassz formátumot és beállításokat.', 'Az újraszerkesztéshez a projektet is mentsd el.'], ['project', 'loop'], ['output.ts', 'index.html:exportBtn']),
  topic('shortcuts', 'Gyorsbillentyűk', 'A külön gyorsbillentyű-panel munka közben is nyitva tartható.', ['Kattints a billentyűzet ikonra, vagy nyomd meg a ? billentyűt.'], ['help', 'playback'], ['workspace.ts:SHORTCUTS', 'keyboard.ts']),
];
// Explicit inline terms: text is never parsed as HTML or matched by translated words.
HELP_TOPICS.find(t => t.id === 'appearance')!.parts = [
  'Egy rétegre húzott Megjelenés annak a látványát alakítja. Például az ',
  { term: 'blur', label: 'Elmosás' }, ' lágyítja a képet.'
];
HELP_TOPICS.find(t => t.id === 'animation')!.parts = [
  'Bekapcsolva a módosított, animálható értékhez az aktuális időpontban ',
  { term: 'keyframe', label: 'kulcsképkocka' }, ' készül.'
];
export const helpTopic = (id: string) => HELP_TOPICS.find(t => t.id === id);
export const HELP_BINDINGS: Record<string, string> = { helpModeBtn: 'help', helpBtn: 'help', keysBtn: 'shortcuts', libSearch: 'library', playBtn: 'playback', projBtn: 'project', exportBtn: 'export', animBtn: 'animation', tlxBtn: 'timeline', loopBtn: 'loop' };
export function validateHelpTopics(): string[] {
  const errors: string[] = [], ids = new Set<string>();
  for (const t of HELP_TOPICS) { if (ids.has(t.id)) errors.push('duplicate: ' + t.id); ids.add(t.id); }
  for (const t of HELP_TOPICS) for (const id of [...t.relatedIds, ...(t.parts || []).filter(p => typeof p !== 'string').map(p => (p as { term: string }).term)]) if (!ids.has(id)) errors.push(t.id + ' -> ' + id);
  for (const id of Object.values(HELP_BINDINGS)) if (!ids.has(id)) errors.push('binding: ' + id);
  return errors;
}

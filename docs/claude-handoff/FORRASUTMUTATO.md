# Forrásútmutató – csak a szükséges részt olvasd

A linkek a repóban lévő élő fájlokra mutatnak. A snapshot hash-ei a `data/source-index.json` alatt ellenőrizhetők. ZIP-ben az eredeti repoútvonalakon mellékelt másolatok referenciaanyagok; az aktuális repo elsőbbséget élvez.

| Kérdés | Forrás / célzott szakasz |
|---|---|
| Hol tart a termék? | [HANDOFF](../../HANDOFF.md), [funkcióleltár](../../FUNKCIO-LELTAR.md), [kódtérkép](../../app/CODEMAP.md) feladattábla |
| Kötelező folyamat | [CLAUDE](../../CLAUDE.md), [teljes követelmény](../spec/VEL-TELJES-FUNKCIO-ES-MERFOLDKO-ATADAS-CLAUDE-NAK.md) 13. fejezet |
| Az összes mai elem és új ötlet | [teljes elemleltár](../spec/VEL-TELJES-ELEMLELTAR-ES-FEJLESZTESI-OTLETTAR-2026-10-18.md): 2 Bolygó;3 típusok;4 receptek;5 polcok;7 addonok;8–10 ötletek/láncok |
| A–G és kockázati kapuk | [fejlesztési terv](../spec/vel-fejlesztesi-terv-jovahagyasra.md), 7. fejezet; nem a régi archív log |
| Intuitív mozgás, kapcsolat, kreatív gesztus | [UX-előzmény](../spec/vel-intuitiv-mozgas-es-kapcsolatok.md), 3–7. és 9. fejezet |
| U5 színhierarchia/action bar | [UI-visszajelzés](../spec/vel-ui-visszajelzes-2026-10-18.md), az érintett második rész |
| T2 gömbi domborzat | [Terep-javaslat](../javaslatok/3D-TEREP-JAVASLAT.md), T2 szakasz; [terrain3d.ts](../../app/src/terrain3d.ts), [worlds.ts](../../app/src/effects/worlds.ts) planet |
| A 63 addon tényleges API-ja | [lab CATALOG](../../prototypes/extension-lab/CATALOG.md), kiválasztott modules/NN és examples/NN; [átadó](../../prototypes/extension-lab/CLAUDE-HANDOFF.md) |
| Melyik próba mit igazolt? | [VALIDATION](../../prototypes/extension-lab/VALIDATION.md), [layout-átadó](../../prototypes/extension-lab/layouts/README.md) |
| Forrásfeltétel | [THIRD-PARTY](../../prototypes/extension-lab/THIRD-PARTY.md), kiválasztott license/NOTICE; CodePen portok [jegyzete](../../presets/egyedi/EREDETI-PORTOK.md) |
| Új referenciák, R1b/R2/útvonal/karakter | [referenciaterv](../spec/VEL-UJ-REFERENCIAK-KODTERV-2026-10-18.md), csak saját témához tartozó sor |
| Közös útvonal kísérlet | [útvonalmag](../spec/vel-utvonal-mag-prototipus.mjs) + [teszt](../spec/vel-utvonal-mag-prototipus.test.mjs), még nincs beépítve |
| Beszéd időmintája | [beszéd-prototípus](../spec/vel-beszed-ido-prototipus.mjs) + [teszt](../spec/vel-beszed-ido-prototipus.test.mjs), nem rig/morph renderer |
| Média előkészítés | [importbrief](../spec/VEL-KULSO-MEDIAK-IMPORT-ELŐKÉSZÍTÉS-2026-10-18.md); a Lottie/PH1 rész régebbi tervét az aktuális HANDOFF felülírja |
| Média időindex mintája | [médiamag](../spec/vel-media-import-core-prototipus.mjs) + [teszt](../spec/vel-media-import-core-prototipus.test.mjs); nem teljes GIF/videódekóder |
| Több videó | [videóterv](../spec/VEL-TOBBVIDEOS-TIMELINE-TELJESITMENY.md), először egy klip / időmapping / proxy kapuk |
| Fizika/részecske/folyadék cél | [teljesítménymelléklet](../spec/vel-reszecske-fizika-folyadek-teljesitmeny.md), saját alfejezet |
| Nyitott adatvesztés/export/kapcsolat | [BUGS](../../BUGS.md); a kódaudit tételeinél nézd a bizonyítás státuszát |

## Kereshető, kisebb adatok

`data/current-library.json`: 259 forrássor,229 javasolt egyedi rekord. `data/backlog.json`:26 task scope/dependency. `data/legacy-coverage.json`: a régi funkcióleltár minden sorának új taskkapcsolata, a két külön28-as sor megőrzésével. `data/source-index.json`: fájlok, hash, dirty/tracked státusz. `data/idea-routing.json`: mind a96 új irány/recept/Megjelenés/lánc hozzárendelése a fejlesztési családokhoz.

A teljes leltárban R01–R54 a jelenlegi recept, Ö01–Ö20 a korábbi20 irány, ÚR01–ÚR32 az új receptcsalád. Ezek referenciaazonosítók, nem a projektbe bevezetett runtime ID-k.

## Ütköző információk sorrendje

Emberi aktuális utasítás → érvényes AGENTS/CLAUDE folyamat → mai kód és bizonyíték → aktuális HANDOFF/funkcióleltár → e csomag terve → régi brief/referenciatanulmány. A hiányzó bizonyítékot ne töltsd ki feltételezett kész státusszal. A forráslicencet verzióspecifikus eredeti fájl/aktuális feltétel alapján ellenőrizd; egy régi táblázat címkéje nem elég.

## Két új későbbi irány

[Jövőbeli 3D jelenet és AI-vázlat](JOVO-3D-SCENE-ES-AI-VAZLAT.md): SCENE-01 és AI-PREVIZ-01. Részletes cél/UX/szeletek; gépi útvonal: `data/future-directions.json`. Nem a korábbi96 elem átírása, hanem két új munkafolyamat.

# Összehangolt fejlesztési terv

## Döntés: kis közös alapok, látható eredmények

A 63 addonból nem 63 főprojekt és nem egyetlen mindent megelőző új engine készül. A UX, a katalógus és a közös adatszerződés a jelenlegi funkciókon már javítható. A renderkockázatos újdonságok külön, konkrét céllal következnek. Minden család feladatkártyája első szeletet ír; nem a teljes család egyszerre fejlesztését kéri.

## Függőségi hullámok

| Hullám | A nagy feladata | B kis feladata | C segítő feladata | Mitől zárható? |
|---|---|---|---|---|
| 0 | TRIAGE-01: aktuális állapot és első szerződés | Mai elemek/aliasok ellenőrzése | Mentés/export gyanúk minimál reprodukciója | Valós baseline + egy rövid közös javaslat |
| 1 | CAT-01 első szelet: stabil ID, metaadat, keresés, négy szerep | Külön besorolási/szinonimaadat a rögzített rekordformátumba | Legacy drag/sajátpreset és keresés fixture | Semmi régi nem vész el; gyors megtalálás; nincs új render |
| 2a | A legsúlyosabb reprodukált STAB-01 vagy BASE-01 szelet | Tiszta assetreferencia-collector/fixture | Clean reopen + projektcsere + cancel bizonyíték | Új addonhoz elégséges tartós média és lifecycle |
| 2b | UX-01 vagy COLOR-01 egy szelete | Capability/színmag külön modul | Preview+undo+fókusz / színhierarchia próba | Láthatóan egyszerűbb interakció, nem több panel |
| 3 | Választott nagy ág: WORLD-01 T2 **vagy** MAT-01 **vagy** LAYOUT-01 | A nagy ág tiszta adat-/shader-/layoutdarabja | Baseline, seed/seek/mentés és látványösszevetés | Egy új, ténylegesen használható funkció |
| 4 | PART-01 **vagy** PHYS-01 **vagy** VIDEO-01 első szelet | Atlasz/életgörbe/collider/időindex | Replay/async/cancel/memória teszt | Egy motor/egy adatút és egy tiszta felhasználói folyamat |
| 5 | FLUID-01 vagy további nagy ág, már bizonyított alapra | Sűk számítási modul | Export/GPU/bővebb jelenet próba | Mérhető minőség és hordozhatóság |
| Tartalom közben | RECIPE-01 kis kurált csomag, ha szabad writer van | Receptadat külön fájlban | Három képarány + hosszú szöveg | Csak valóban elérhető elemekből készült preset |

A 2a/2b jelölés nem két egyidejű közösfájl-írót jelent. A választott első implementációs prioritást az aktuális hibák és a felhasználó jóváhagyása dönti el. A reprodukált adatvesztési hiba megelőzi a kozmetikát. Az export memória/cancel feladat korán, a nagy médiabővítések előtt indulhat.

## Független kisebb ágak

PATH-01, MOT-01 organikus változat, TEXT-01 közvetlen sorhúzás és UI-01 preferencia javítás nem vár egy általános Three-host elkészültére. Csak akkor menjenek a nagy ág mellett, ha a write-setjük és integrációs pontjuk nem ütközik; különben tiszta mag/prototípus vagy teszt készülhet.

LINK-01 a közös Nap/szél/holdkövetés előfeltétele, de a T2 gömbi domborzat első kísérlete tőle független. A naprendszer művészi rétegrecept már a mai elemekből készíthető; valódi térbeli pályahierarchiát csak közös scene/host bizonyítása után ígérjünk.

MAT-01 anyagcsatlakozójának első szelete nem ugyanaz, mint a színpicker. COLOR-01 az effektív színforrásról és megjelenítésről dönt; ezek után az anyag ugyanazon érthető rendbe csatlakozik. R1b fényfogantyú a meglévő filterútban kis, külön engedélyezhető szeletként korábbi is lehet.

LAYOUT-01 két ága különválik: a WIDE eredeti forrás hiánya nem blokkolja az Unwoven renderbemenet-kísérletét. A saját WIDE-tanulmány nem minősíthető az eredeti port kész állapotának.

MEDIA-01 tiszta SVG-/fontadat-szelete nem vár általános renderbridge-re; BASE-02 itt csak új mesh/renderút esetén kapu. CHARACTER-01-hez viszont tényleges tartós GLB + a modellhez szükséges rig/morph adapter kell, nem pusztán a MEDIA-01 címkéjű feladat lezárása.

MEDIA-01 import, VIDEO-01 proxy/seek és EXPORT-01 kódolás külön kezelhető, de közös tartós média-/időszerződéssel. A jelenlegi vektoros Lottie és PH1 2D import működését nem kell újra megcsinálni.

## Feladatok katalógusa

A géppel olvasható függőségek és scope: [data/backlog.json](data/backlog.json). Minden családnak külön rövid taskkártyája van a `tasks/` alatt. A dependency a szükséges első eredményre utal, nem egy teljes, még soha nem lezárható engine-fejezetre.

## Kapcsolat a régi A–G tervvel

| Szakasz | Új munkacsomagok | Megőrzendő cél |
|---|---|---|
| A – stabil idő, adat, változat | STAB/BASE-01/EXPORT/QA | Tekerés, hordozhatóság, régi projektek |
| B – intuitív szerkesztés/motion | CAT/UX/COLOR/UI/TEXT/PATH/MOT/LINK | Kevés UI, közvetlen kontroll, könnyű időzítés |
| C – forma, anyag és fény | BASE-02/PATH/MAT/MEDIA/WORLD | Jó 3D kép, szerkeszthető forma, megőrzött minőség |
| D – források és részecske | WORLD/PART/MEDIA/CHARACTER | Külön emitter, felismerhető forráskarakter |
| E – fizika és mezők | PHYS/LINK/PART | Gravitáció alapból ki, determinista hatások |
| F – folyadék és költség | FLUID/PERF/EXPORT | Előnézet/export kontroll, mért keretek |
| G – receptek és alkotói random | RECIPE/LAYOUT/CAT | Értelmes kombináció, seed/zárak, képarány |

A csomag nem állítja késznek egyik A–G termékszakaszt sem. Az A–G célokat nem kell egy új párhuzamos roadmapben újra feltalálni; az itt lévő kártyák a végrehajtást szervezik.

## Első közös mérföldkő-javaslat mintája

**Mit tud majd Miksa?** A jelenlegi elemeket a négy érthető szerep és magyar/angol szinonimák alapján megtalálja; a mai presetjei és húzásai megmaradnak.
**Mi készül?** Stabil katalógusazonosító és legacy mapping; egységes metaadat, determinisztikus kereső; a mai könyvtár felületi átvezetése. B adatot, C tesztet ad.
**Határ:** nincs új fizikafolyadék/renderer; változatcsaládok és kontextusajánló a következő szelet.
**Próba:** 1. Bolygó és üveg keresése; 2. elem/drop és mozgás alkalmazása; 3. régi saját preset újranyitása; 4. undo és keresőhely megőrzése.
**Mérés:** minden jelenlegi polcsor leképezve; a UX-specben megadott keresési esetek és célidők a tényleges mérőgépen ellenőrizve, még nem mért eredményként.
**Lista változása:** CAT-01 első rész demonstrálható, a 63 addon és A–G állapota ettől nem lesz kész.

A jóváhagyott szelet rutindöntéseit az agent önállóan hozza; ne kérjen vissza minden szinonimára vagy segédfüggvényre.

## Későbbi fő alkotói irány: gyors 3D jelenet és AI-vázlat

A [külön terv](JOVO-3D-SCENE-ES-AI-VAZLAT.md) rögzíti Miksa új fő célját: pár kattintással szép, artisztikus táj, néhány behúzott assettel és automatikus, kézzel finomítható világítással. SCENE-01 egy közös 3D tér/camera/fény első használható szeletére épül. AI-PREVIZ-01 ugyanebből a jelenetből filmes felvételkártyát, kompozíciós referenciát és később animatikot exportál.

Mindkettő későbbi nagy fejlesztés. A 2D/2,5D shot-PNG első szelet nem vár a teljes 3D rendszerre; valódi 3D blockout, depth/normal/object mask csak bizonyított renderadat után. A mai CAT/UX/média/útvonal fejlesztést a későbbi újrahasználat figyelembevételével tervezzük, de ne építsünk mindent előre át. A backlog így28 család, ebből az új kettő `deferred`.

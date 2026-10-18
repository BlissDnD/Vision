# Állapot és határok

## Ellenőrzött kiindulás – 2026-10-18

- App: `0.36.0-g1`; TypeScript + saját WebGL2, esbuild, önálló HTML. A package neve még latomas-studio; ez nem a régi alkalmazás fejlesztését jelenti.
- 72 regisztrált elemtípus, 54 recept, 259 polcbejegyzés, 6 ráhúzható mozgás, 18 paletta, 6 végső Look. Több polcon ugyanaz a recept is szerepel; 259 nem ennyi önálló motor.
- Gerincfelület és 3D Terep valódi háló; obj3d/sdfscene főként shaderes/SDF térbeli út. Nincs általános Three.js-host vagy szabad mesh-anyagkapcsoló.
- T1: hatféle 3D Terep, öt stílus, vízszint, közös fény és minőségprofil. Bolygóra vagy bármely formára húzható domborzat még nincs.
- G1/Mozgás v1/v1.1: közös időből értékelt mozgás, ritmus, paramétersávok, gesztusnyíl, kulcsokká alakítás. Nem kell újabb animációs órát beépíteni.
- P1: saját könyvtár, preset JSON, saját shader/névvel ellátott vezérlők. A saját, általános ráhúzható GLSL Megjelenés még hiányzik.
- L1: helyi vektoros Lottie; nincs teljes képes/fontos/expression import. PH1: 12 elemű, 2D Poly Haven képimport; nem teljes online PBR-katalógus.
- Q1: képi tünetmérés, újradobás, Ronda/Tetszik. Tanult minőségküszöb és hatos előnézetrács még ötlet.
- Kapcsolatok, közös alapok/változatok, 2,5D kamera és jelenetsor részben működnek; nem teljes, általános scene graph.

## Külön labor

`../../prototypes/extension-lab`: 63 modul + példák + függőségek + eredeti licencek. Commit `b23edbc`.

- Első kör: 45 Node-teszt; 63 böngészős bootstrap és 4 célzott próba = 67. Nem 67 teljes termékfunkcióteszt.
- Layout-bővítés után: 48 Node-teszt és külön 7 layout-próba. Commit `dafd5a5`.
- Unwoven: eredeti szalaggeometria/shader, saját explicit idő, képcsere és vezérlők; nincs Vel-integráció.
- WIDE: öt saját elrendezéstanulmány. Az eredeti forrás hiányzik; hű portnak vagy azonos minőségű helyettesítésnek nem nevezhető.
- A labor képei/fontjai/importmintái nem automatikusan a termékbe csomagolható médiakönyvtárak. Forrás és feltételek elemenként.
- A 48 és 67/7 szám korábbi futásból származó bizonyíték, nem e csomag készítésekor újrafuttatott teljes teszt.

## Friss dokumentáció

`bcf77db`: teljes elemleltár; minden jelenlegi elem + 20 fejlesztési irány + 32 új recept/világ + 24 Megjelenés-/viselkedésötlet + 20 lánc. A felhasználó böngészős saját presetkönyvtára export hiányában nincs benne.

## Meglévő nyitott munkák megőrzése

U5: színösszesítő, színhierarchia, gradiens, action bar. U2: közvetlen sormozgatás, alakfelismerés, körbeérő mozgás. T2: Bolygó domborzata. R1b: fényfogantyú/spektrum, CRT-recept. R2: WIDE/Unwoven. Többvideós idővonal és memória külön terv. Az új csomag ezeket összerendezi, nem törli vagy nevezi újra késznek.

## Korlátok / induláskori ellenőrzés

- `BUGS.md`: mentett jelenet/közös alap assetjei kimaradhatnak a projektből; hanghordozhatóság/projektcsere; exportablak bezárása nem feltétlen megszakítás. Ezek auditgyanúk, futási reprodukció külön kell, ahol még nem történt meg.
- Kapcsolat forrásparamétere félreérthető; árva kapcsolat; a jelenetsorban Kapcsolatok korlátozottak.
- CodePen-láng csíkhibája és a Random sötét sávja nyitott. A forráslicencek egyes portoknál külön ellenőrzendők.
- A 60 Hz/3 mp-es `sim.ts` előmelegítés a mostani feedback/blob szerződés; nem bizonyítja, hogy egy hosszú fizikát 3 mp után el lehet felejteni.
- Más munkamenet dirty fájljai vannak. Induláskor felmérni és nem saját commitba emelni.

## Engedély és állapotjelölés

Ez a csomag és az előkészítő mintakód engedélyezett. A jövőbeli termékszeletek a projekt mérföldkő-jóváhagyási szabálya szerint indulnak. Ugyanazt az engedélyt ne kérd újra, ha az aktuális beszélgetésben már megvan; de a „minden ötlet jó” nem bizonyít minden renderer-/fizikarendszerre konkrét implementációs szerződést.

Állapotok a taskokban: `prepared`, `ready-for-proposal`, `waiting-for-dependency`, `approved`, `in-progress`, `demonstrated`, `user-tested`, `deferred`. Előkészítő teszt ≠ termékdemonstráció ≠ felhasználói próba. A meglévő FUNKCIO-LELTAR T/R/D/K állapotai megmaradnak.

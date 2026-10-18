# Közös architektúra – javasolt határok

**Terv, nem már létező API.** A legkisebb működő szelet implementáljon belőle annyit, amennyi kell. Az egész rendszert előre átírni nem cél.

## 1. Katalógus és projekt külön

A katalógus megmondja, mit lehet keresni/beilleszteni/rétegre tenni; a projekt a konkrét példányt és értékeit menti. A `layer.type`, shaderkulcsok, receptek és régi kategóriaazonosítók első körben ne változzanak meg. A négy új főcsoport megjelenítési metaadat legyen.

Javasolt katalógusrekord: `id`, `title`, `role` (recipe/element/appearance/motion), `familyId`, `variantId?`, `topics[]`, `keywords[]`, `origin`, `availability`, `applyAction`, `accepts[]`, `requires[]`, `sourceRef`, `previewRef?`.

A technikai `tool`, `internal`, `asset` szerepek nem azonosak új felhasználói főfülekkel. Az importált asset az Elemek médiarészében vagy importválasztóban jelenhet meg; egy hálóoptimalizáló a műveleti eszközök között. Fizika a felhasználónak viselkedés, anyag a Megjelenésekben; belül külön pipeline.

- Az ID tartós legyen; név- vagy sorrendváltozás ne írja át. A csomag hash-alapú `proposedId`-i előkészítő azonosítók, nem migráció nélkül bevezethető publikus azonosítók.
- Több gyűjtemény ugyanarra a katalógus-ID-ra mutasson. Kedvenc/legutóbbi/keresés az ID-t követi, nem csempemássolatot.
- A család egy belépési kártya, a változat szerkeszthető kiindulópont. Bolygó ≠ az összes bolygós recept.
- Saját könyvtári elemek `ULIB`-azonosítói és adatai megmaradnak; metaadatuk hiányát importkor normalizálni kell, nem törölni a régi elemet.

## 2. Kompatibilitás műveletenként

A célképesség nem puszta `type === ...` vizsgálat. Első körben vékony adapter legyen a meglévő `fxFits` és motion út fölött, ne új széles pluginrendszer.

Példa: `canApply(entry,target) -> {ok,reason,action}`. Anyaghoz mesh/SDF-hosttámogatás, ködhöz mélység, pdisphez rétegbemenet, Lufihoz jelenleg Felhő kell. Egy elem megjelenési kompatibilitása nem jelenti automatikusan fizikai/motion kompatibilitását.

`canApply` és keresési/preview-lekérdezés ne változtasson projektet. Nem támogatott elem nem dobható el csendben; a teljes kínálatban rövid ok és – ha van – valódi alternatíva jelenjen meg.

## 3. Előnézet és parancs

`preview` ideiglenes, nem ír undo/autosave/variant-diff állapotot. `accept` a meglévő `insertItem/attachFx/attachMo/setVal/commit` utakra fordul. `cancel` visszaállít, fájl-/shader-/hálózati hibánál is. Egy húzás/egy elfogadás egy undo.

Aszinkron előnézet kapjon kérésazonosítót vagy megszakítást. Régi texture/load eredmény nem írhatja felül az új kijelölést. Fókuszvesztéskor a pontos érvényes viselkedést a UX-spec határozza meg. A hover soha ne indítson tartós importot vagy szimulációs változtatást.

## 4. Tartós média – létező tárolás bővítése

Most `assets`, `vectorAssets`, projektbeágyazás és IndexedDB saját könyvtár is van. Ezek fölé közös gyűjtés/azonosság/metaadat kell, nem kötelezően teljes új tárolómotor.

Javasolt assetleírás: `id`, `kind`, `mime`, `bytes`, `source`, `author?`, `license?`, `dependencies[]`, `embeddedData/storageRef`, `contentHash?`.

Gyűjtés: aktuális rétegek + mentett jelenetek + közös alapok + valóban használt presetfüggőségek. Betöltés: referencia-feloldás, függőséghiba jelzése, előző projekt futásidejének takarítása. Objektum-URL, GPU texture, decoder, audio node nem projektadat. A távoli URL forrásmetaadat, nem megbízható egyetlen exportbemenet.

## 5. Renderhatár és általános 3D

Három külön út létezik: 2D shader/compositor, shaderes SDF-testek, saját valódi mesh (Gerincfelület/Terep). A labor Three.js objektumai negyedik, külön környezetben élnek.

Választási sorrend: tiszta adat/algoritmus → célzott natív port; csak új Three-funkcióból szükséges csomag → mért adapterkísérlet; nagy motor → külön döntés. Nem szabad minden 2D mozgást egy általános Three-host elkészültéhez kötni.

Bridge-kísérlet feltétele: ugyanaz a fény és kamera értelmezett legyen; kép/alpha/színtér és erőforrás-tulajdon tiszta. Külön WebGL-context texture objektuma nem adható közvetlenül a másik contextnek. Canvasmásolás használható kísérletben, de feltöltési/4K költsége mérendő. Szín- és alfaeltérés, takarás és depth-sharing külön teszt.

Javasolt életciklus: `create/resize/evaluateAt/render/dispose` és opcionális `reset/advance/checkpoint` az állapotos moduloknak. Ez szerződésvázlat, nem minden motorra erőltetett új osztályhierarchia. Csak ahol ténylegesen új host kell, ott vezessük be.

## 6. Idő, véletlen és szimuláció

- Tiszta mozgás: `evaluateAt(t, params, seed)`. Ne legyen második rAF/GSAP/engine-clock a jelenetóra mellett.
- Fizika/emitter/fluid: rögzített lépés, explicit kezdőállapot; hátrafelé tekerésnél replay vagy checkpoint, paraméterváltozáskor érvénytelenítés. Live közelítés látható; export pontos út.
- A jelenlegi `sim.ts` feedback/blob előmelegítés nem elégséges egy lassan felépült fizikai világ helyreállításához. A motoronkénti állapotszerződés külön döntés.
- Seed szerepek szerint: `sceneSeed -> terrainSeed/planetSeed/particleSeed`; egy komponens újradobása a többieket ne változtassa.
- Jelenetsor lokális ideje, loop, késleltetés és exportkezdet ugyanazon mintavételi szabályt kövesse.

## 7. Közös útvonal és domborzat – két jó újrahasznosítás

`PATH-01`: pont/tangens, nyílt/zárt, koordinátatér, mintavétel és hossz, időzítés külön; használhatja a mozgatás, rajzolás, szöveg és cső. A már felvett gesztus eredeti időmintája megmarad. A külön `vel-utvonal-mag-prototipus.mjs` bizonyíték/kiindulás, nem beépített kész API.

`WORLD-01`: közös height/noise mag a sík terephez és gömbhöz; paraméterek, szín/biom, seed. Gömbön varratmentes 3D mintavétel, megfelelő normál és horizontsziluett. Tetszőleges meshre domborzat új minőségi/adatfüggőség, nem a T2 automatikus mellékhatása. Felhő/légkör/gyűrű megőrzése kötelező.

## 8. Bővítés a saját típusokba

Új mező = normalizálás és régi-projekt próba. Futásidejű cache maradjon nem sorosított. `main.ts` importsorrend, az R-hookok és az undo/Animálás-út megőrzendő. A séma/registry és beépítés gazdája az integrátor; a worker tiszta modulját adapter kapcsolja hozzá.

A javasolt szerződéstől el lehet térni jobb, kisebb megoldással: dokumentáld a döntést és a megtartott invariánsokat. Ne hozz létre absztrakciót egyetlen feltételezett, még ki sem választott addon kedvéért.

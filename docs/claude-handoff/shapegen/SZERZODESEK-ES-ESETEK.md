# Adat-, cél-, előnézet- és mentésszerződés

**Tervezett interfészek, nem létező API-k.** A kódoló agent a mai Velhez igazítsa a legkisebb szükséges bővítést. Külön tároló/engine/framework létrehozása nem cél.

## 1. Egy szerkeszthető dokumentum és több származtatott kimenet

Javasolt szerkeszthető tartalom, JSON-ban:

```json
{
  "app": "vel",
  "kind": "shapegen-document",
  "version": 1,
  "generator": {"type": "pattern", "version": 1},
  "seed": 42,
  "size": {"width": 1080, "height": 1080},
  "params": {},
  "palette": {},
  "motion": {"character": "continuous", "intensity": 1, "cycle": 4, "rhythm": {}, "phase": 0},
  "dependencies": [],
  "vectorDocument": null,
  "repetitionDocument": null,
  "lottieEdits": null,
  "interaction": {"mode": "none", "frozenState": null}
}
```

Ez csak mezőszintű szerződésminta; a valódi összes paramétert az eredeti forrásból kell definiálni és verziózni. Az ismeretlen mező nem csendben eldobandó alkotás. Hiányzó generatorverziónál migráció vagy konkrét hiba, nem random alapállapot.

- **Kanonikus:** paraméteres generátordokumentum, Bézier-kontúrok/lyukak, ismétlési műveletsor, importált függőségek és nem destruktív Lottie-edit patch.
- **Származtatott:** preview thumbnail, WebGL texture, mintavételezett polyline, PNG, SVG (ha ténylegesen vektoros), exportframe. Cache törlése nem törli a kanonikus rajzot.
- **Futásidejű:** célhoz kötés, preview-session, GPU-objektum, object URL, AbortController. Ezek nem Library-adatok és nem hordozható projektmezők.
- **Draft:** négy külön módállapot, rajz/ismétlés adatok és lokális undo/eredményelőzmény. Módváltás nem törli a másik módot; gépi „teljes ShapeGen-dokumentum” mentésből visszakapható mind.
- **Library-preset:** az aktuális szerkeszthető alkotás és szükséges függőségei, automatikus név/thumbnail. Nem kell minden inaktív kísérletet minden Library-elemmel együtt duplikálni.

A Vel `UItem` és `data.item` útja bővíthető `data.generator`/függőségmezőkkel; új `kind:'generator'` csak akkor vezethető be, ha az import, `syncLib`, export, thumbnail és saját elemkezelés is olvassa. Elsőként meglévő preset-tároló + natív rétegadat/forrásref egyszerűbb lehet. A végső döntést a kódoló rögzítse, de az Edit in ShapeGen forrása nem veszhet el.

## 2. Típusos generátorkimenet és fogadó mező

A fogadó réteg/recept inputja deklarálja a támogatott eredményt, nem pusztán egy „SVG” feliratból találgatunk.

Lehetséges kimenetek: `vectorShape`, `svgDocument`, `stillImage`, `proceduralLayer`, `patternSource`, `animatedTexture`, `lottieDocument`. Ugyanaz a generátor csak a ténylegesen implementált képességeit hirdeti. PNG és SVG nem szinonima; a Pattern élő mezője nem ugyanaz, mint egy exportált tile.

Javasolt slotrekord: `slotId`, `label`, `accepts[]`, `alphaPolicy`, `fitPolicy`, `viewBox/sizePolicy`, `animationPolicy`, `applyAdapter`, `previewAdapter`, `libraryFilter`. Minden konkrét befogadóhoz adapter kell. A meglévő Vel recipe makró nem általános dinamikus SVG-slot.

A szerkeszthető vektoradathoz több zárt/nyitott kontúr, Bézier-handle, sarok és fill-rule/hole kapcsolat kell. A mai P2 Catmull–Rom-lista használható közös útvonalműveletekre, de önmagában nem képes minden FORM-rajzot veszteség nélkül tárolni. Konverzió megtarthat számolt P2-pontokat, ha az eredeti Bézier-dokumentum is megmarad és a képi eltérés ellenőrzött.

## 3. Célhoz kötött session

Nyitáskor rögzítendő:

`sessionId`, `projectIdentity`, `sceneIdentity`, `recipeInstanceId?`, `itemId`, `slotId`, `expectedValueRevision/hash`, `acceptedOutputKinds`, `originalValueRef`, `sceneTime`, `draftId`.

A projekt/jelenet azonosságát a Velben ténylegesen biztosítani kell: új runtime-token is lehet, nem szükséges rögtön minden régi projektformátumba kötelező azonosítót migrálni. A session nem az éppen kijelölt elemhez, hanem az eredeti befogadóhoz kötött.

**Alkalmazás előtt:** cél még létezik és ugyanabban a projektben van; a slot támogatott; a mezőt más művelet nem módosította; a függőségek készen vannak. Konfliktuskor a draft megmarad, explicit választás kell: új cél, új példány vagy mentés Libraryba. Nem írjuk felül csendben a frissebb adatot.

## 4. Preview-tranzakció

Állapotok: `standalone/bound → preparing → previewing → applying → applied`; megszakítás/hiba/conflict külön ág. A preview régi aszinkron shader-/image-/Lottie-eredményét session+revision ellenőrzés nélkül nem szabad kirajzolni.

A render számára ideiglenes **értékfeloldás** vagy klónozott inputpéldány készül, amely csak a megadott item+slot bemenetet cseréli a draft kimenetére. A scene-csoport/maszk/effekt/kamera/KO/LP1/LFO/kapcsolat helyes sorrendben tovább értékelődik. A render nem írhat a végleges `st`-be még akkor sem, ha egy mai normalizáló helper alapértéket inicializál.

A shader/context/cache kezelés az aktuális renderer adottságai szerint választható, de a tesztelhető invariáns ugyanaz: preview után a serializált projekt, a scene-undo és a Library byte-szinten vagy szemantikailag változatlan. Állapotos F1/F2/feedback és pointerreakció külön preview cache-t vagy visszaállítható állapotot kap. Nem elég egy új színuniform, ha közben a szimuláció előrébb lépett.

**Alkalmazás:** az adapter a meglévő parancs/commit/undo útban egy cserét hajt végre. Megmarad az eredeti elem azonosítója, elhelyezése, maszkja, effektlánca és kulcsai, kivéve amit a befogadó kifejezetten cserélendő tartalomként deklarált. A shape méretillesztése nem írja át rejtetten a kamerát.

**Mégse:** az ideiglenes feloldás és erőforrások megszűnnek; eredeti cél, playhead és lejátszásállapot visszaáll; a draft külön megtartható. A draftban végzett tíz változtatásból nem lett tíz scene-undo.

## 5. Kétféle undo és három mentési cél

- **Draft-undo:** csúszka/gesztus, random, variation, rajz és Lottie-edit a Shapegen-szerkesztésen belül. Húzásból egy lépés. A fókusz szerinti Cmd/Ctrl+Z itt ezt használja.
- **Scene-undo:** Alkalmazás/jelenethez adás egy lépés; visszavonás nem törli a függetlenül már elmentett Library-elemet.
- **Library-művelet:** mentés újként / eredeti frissítése külön, tartós eredménnyel; nem rejtett mellékhatása minden slidernek. A globális Library eredeti módosítása nem a scene-undo része.

Mentési célok: **Library**, **aktuális cél**, **gép**. A felület világosan különbözteti meg őket. Célhoz kötve az Alkalmazás önmagában is működik; a Library jelölő opcionális, nem kötelező fájlexport.

## 6. Tartósság és részleges siker

A mostani `ulibPut()` memóriában frissít, majd meghívja a tartós tx-et, de a tartósság eredményét a hívónak nem adja vissza külön receiptként. A gyors mentési UX-hez ellenőrizhető `durable / memory-only / failed` eredmény kell a közös tárolóút bővítésével. Ne másoljunk mellé másik IndexedDB-s FORM-könyvtárat.

A „Libraryba is” + scene-apply nem valódi egyetlen ACID-tranzakció: IndexedDB és scene-command külön rendszer. Javasolt sorrend: snapshot+validálás → függőségek előkészítése → célverzió ellenőrzése → opcionális Library mentési receipt → célverzió újraellenőrzése → egy scene-command.

| Eset | Elvárt eredmény |
|---|---|
| Nincs Library-jelölő | Egy scene-apply; szerkeszthető forrás a projektben, nem kötelező globális könyvtári másolat |
| Library és apply sikeres | Rövid „Alkalmazva · Libraryba mentve”; egy scene-undo |
| Library tartós mentés nem sikerül | Nincs hamis mentve üzenet; draft megmarad, retry/gépi mentés; Alkalmazás külön, explicit folytatható |
| Library sikeres, de a cél közben eltűnt/változott | A mentett könyvtári elem megmarad; a scene érintetlen; „Mentve, a cél nem alkalmazható” és célválasztás |
| Scene alkalmazás meghiúsul | Eredeti scene változatlan; mentett Library-példány nem törlődik rejtetten; retry |
| Fájlmentés megszakítva | Nincs sikerjelzés; nincs draft- vagy scene-vesztés |

A jelenetprojekt használt generátordokumentuma és függőségei hordozhatók legyenek az eredeti globális Library törlése után is. Az „assetref” nem csak egy másik böngésző IndexedDB-kulcsa. Aktuális rétegek, mentett jelenetek és közös alapok szükséges referenciáit is össze kell gyűjteni.

## 7. Példány és eredeti

Egy Library-elemet három helyre beillesztve alapból három szerkeszthető felhasználás/snapshot vagy verziózott ref+helyi eltérés van. Egy példány Edit in ShapeGen művelete csak azt módosítja. Az elem `libraryOriginId`-ja eredetjelzés, nem automatikus élő megosztás.

Közös eredeti frissítésekor új könyvtári revision és thumbnail készül. A többi scene-példány frissítése külön, kijelölt célokra szóló művelet lehet a Vel Közös alap/Változat/Átadás eszközeivel, de nem következik az egyszerű mentésből. Nem keverjük össze a Library-sablont a már létező közös alap élő kapcsolatával.

## 8. Assetek és export

- SVG: viewBox, fill/stroke/fill-rule/lyukak; importált aktív tartalom nem kerül futtatásra. A jelenlegi motívum textúraként és szerkeszthető kontúrként eltérő reprezentáció lehet.
- Lottie: eredeti JSON + stabil layer/precomp célú edit patch. Root/precomp láthatóság és statikus szín szerkesztés nem egyetlen, már átfestett canvas snapshotja. A rétegazonosítás ütközéseit forrásbaseline dönti el.
- dotLottie/ZIP: külön tömörített és kibontott méret-/darabszám-/útvonal-limit; részleges batch-hibák listája, a jó elemek elfogadhatók. A FORM 30MB/100MB kerete tervezett paritáscél, célgépes méréssel; nem csak a Vel `2_000_000` szám átírása.
- Ikonok/demók: helyi katalógusforrás és licenc/NOTICE megőrzése. A 8252 és a 3+6 demo az átadó állítása; a tényleges forrásban a manifest ellenőrizendő.
- PNG/PNG-sor: natív renderer, átlátszóság, rögzített idő; ZIP lezárás/cancel/memória. A FORM jelenlegi120frame/150milliópixel kerete legalább deklarált kompatibilitási viselkedés, nem korlátlan exportígéret.
- SVG nem shader-export. Szerkesztett Lottie-JSON nem újonnan generált Lottie, és a player elhelyezés/sebesség nem sül bele magától; az UI ezt elmondja.
- Aszinkron motívumframe/thumbnail cache méret/idő/hash alapján; nem újrabetöltés minden frame-en. Split csak szükséges felbontásban két render; rejtett nézetek nem folyamatosan dolgoznak.

## 9. Fontos elfogadási esetek

1. Önálló Blob→Library→app újranyitás→Edit: ugyanaz a seed, görbe, paletta és animáció.
2. Recept shape-mező→Gen→Solo/Scene/Split→Apply→Undo: egyetlen csere, eredeti maszk/effekt/idő megmarad.
3. Preview→Mégse/fókuszváltás/tab elhagyás: project/Library/undo változatlan, draft nem veszik el.
4. Cél törlése, új projekt, scene-csere vagy ugyanazon slot másik módosítása: nincs rossz célba írás.
5. Gyors kétmotívumos betöltés A→B, késve A eredmény: B marad; bezárt session nem fogad cache-eredményt.
6. Valódi SVG-slotban shader-BG: már a választáskor kizárt; nincs téves SVG-fájl.
7. Lyukas, nyitott és sarkos Bézier-rajz: import/simítás/Boolean/mentés/SVG után topológia és karakter megmarad.
8. Library-write hiba és abortált fileexport: pontos állapot és veszteségmentes retry.
9. Egy Library-elem három felhasználása: egyik szerkesztése nem módosítja a másik kettőt.
10. Random teljes aktív kreatív tér; Variations hat közeli rokon; visszalépésből megmarad a saját régi asset.
11. A→B→A időtekerés, LP1 és scene-lokális idő; pointerfagyasztás külön kontrollal reprodukálható.
12. Lottie szín/hide/reset/undo→edited JSON→újraimport: ugyanaz az eredmény; playertransform korlátja látható.
13. Minden FORM mód/recept/katalógus és régi geometria regressziós útja külön referenciával; v8 shaderkarakter nem egyszerűsített közelítés.
14. 1:1/4:5/9:16, keskeny ablak, világos/sötét téma és csak billentyűzetes főfolyamatok.
15. Nézetváltás és fülmegnyitás nem állítgatja automatikusan a kamera-, effekt- vagy exportminőséget.

Ez tervbeli ellenőrzési lista, nem most lefuttatott teszteredmény.

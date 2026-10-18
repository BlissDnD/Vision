# Elkészült előkészítő adatok és keresőmodell

Ez **külön előkészítő kód**, nem főapp-implementáció. Nincs új kész UI vagy Vel-funkció. Az első CAT-01 taskhoz ad ellenőrizhető kiindulást.

## Fájlok

- `../data/current-library.json`: a jelenlegi 259 könyvtári sor 229 összevont, javasolt metaadatrekordja. A szerepek, családok, címkék és szinonimák szerkeszthetők. Minden eredeti kategória/index visszakereshető a `sourceRows` mezőben.
- `catalog-model.mjs`: tiszta név-/alias-/téma-/leíráskereső, szerep-/témaszűrés és családcsoportosítás. Nincs DOM, hálózat, motor vagy állapotírás.
- `catalog-model.test.mjs`: 13 célzott előkészítő próba: lefedettség, ékezet, pontos találat, alias, feladatkifejezés, szerep, nem elérhető ötlet, közös ID, család, kompatibilitási határ és immutabilitás.
- `../scripts/export-catalog.mjs`: ismételhető deklaratív export a mai regiszterekből; a futásidejű evaluation importját hibát dobó stub helyettesíti. Így nem bootol UI-t. A Node `make` hívások saját ideiglenes folyamatban futnak, nem a nyitott Velben. Ez nem a tényleges hozzáadás/renderer tesztje.

## Futtatás a Vel gyökeréből

```sh
node docs/claude-handoff/scripts/export-catalog.mjs
node --test docs/claude-handoff/preparation/catalog-model.test.mjs
node docs/claude-handoff/scripts/validate-package.mjs
```

Az export a repóban már meglévő `app/node_modules/esbuild`-et használja. A modellteszt csak Node beépített modulokra épít, nem igényli a labor nagy függőségkészletét. A pillanatkép a jelenlegi neveket és saját metaadatot őrzi, nem a felhasználó böngészős Saját könyvtárát.

## Még szükséges CAT-01 előtt

A hash-alapú `proposedId` nem végleges migrációs ID; névváltozásra változna, ezért a production kulcsokat az integrátor egyszer rögzítse. A keresőmodellel ne helyettesítse csendben a működő `shelf.ts` viselkedést. A korábbi kategória/index payloadot explicit mappinggel kell tovább olvasni.

A `suggestedCompatibility` háromértékű: `true` = nem célhoz kötött tartalom beszúrása, `false` = kizáró ok, `null` = műveleti adapter döntése kell. Üres `accepts` nem univerzális kompatibilitás. A modell nem tudja eldönteni az összes host, anyag, geometria és szimuláció kölcsönhatását.

A téma-/aliaslista és családhatár **kurálandó kezdet**, nem kész teljes tartalomstratégia. A 13 teszt nem méri a 20 keresési feladat teljes minőségét, az UI sebességét, a GPU-t vagy a végfelhasználói intuíciót. A régi 259-as elvárt darabszám snapshot-alap; valódi katalógusváltozásnál a pillanatképet és a kapcsolódó várakozásokat együtt kell frissíteni.

## Csomag karbantartása

A repo valódi változásait előbb nézd át. A `scripts/refresh-source-index.mjs` csak a már kiválasztott kontextusfájlok hash-eit és dirty-státuszát frissíti; nem igazolja a változás helyességét. Az új fájlokat külön add a source-indexhez; a katalógushoz az exportot, a task/ötlet-lefedettséghez a saját adatot frissítsd. Ezután validálás és `python3 docs/claude-handoff/scripts/make-bundle.py` adja az új ZIP-et. A régi mérési számokat ne változtasd újrafuttatás nélkül.

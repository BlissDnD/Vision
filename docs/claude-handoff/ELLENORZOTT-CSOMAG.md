# Mit ellenőriztünk ténylegesen?

**2026-10-18 · előkészítő csomag, nincs új alkalmazásintegráció.**

- A külön keresőmodell **13/13 Node-tesztje zöld**: név/ékezet/alias, feladatkifejezés, szerepszűrés, el nem készült elem elrejtése, család/ID, kompatibilitási határ és adatok változatlansága.
- A csomagellenőrző **46 szerkezeti ellenőrzése zöld**: 26 egyedi task és ciklusmentes függőségek, 259 forrássor/229 javasolt rekord, 72 típus/54 recept/6 mozgás, 44 korábbi követelménysor, 65 addon/layout és 96 új ötlet létező taskhoz rendelése.
- A helyi Markdown-hivatkozások céljai léteznek. A számlálót és a végső eredményt a `data/package-validation.json` tartalmazza.
- **368 kontextusfájl** hash-e egyezik a készítéskori forrással. A dirty/untracked státusz külön mező; nem emeltük ezeket csendben a saját commitba.
- A ZIP-ben lévő forrásmásolatok hash-e ellenőrzött; az archívum CRC-próbája hibamentes. Nincs node_modules, .git, .venv vagy production dist.

## Amit ez nem igazol

Nem futott új teljes Vel-tesztkör, élő UI-próba vagy GPU-/4K-mérés. A négy új kategória, preview-tranzakció, közös adapter, asset-/fizikarendszer és új receptek nem kerültek az alkalmazásba. A UI/keresési teljesítmény célértékei tervezett kapuk, nem e futás mérési eredményei.

A labor 45→48 Node és67+7 böngészős eredménye korábbi mérés; a referenciákban a pontos lefedettség szerepel. A mostani13 teszt az előkészítő katalógusmodellé, nem az addonok termékintegrációjáé.

## Újrafuttatás

A repo Vel gyökeréből:

```sh
node --test docs/claude-handoff/preparation/catalog-model.test.mjs
node docs/claude-handoff/scripts/validate-package.mjs
python3 docs/claude-handoff/scripts/make-bundle.py
```

Forrásváltozásnál előbb vizsgáld át az eltérést, frissítsd a ténylegesen érintett adatot és szerződést; a hash-ek egyszerű újraszámolása nem helyettesíti ezt. A ZIP kontextusmásolat, nem az aktuális repo felülírására szolgáló patch.

**Független tervreview:** az engedély-, állapot- és writer-szabályokban nem talált lényegi ellentmondást. Két függőséget pontosítottunk: a tiszta SVG/fontimport nem vár kötelező bridge-re, a beszélő karakter pedig tényleges GLB/rig/morph képességet igényel, nem csak egy tetszőleges médiaszelet lezárását.

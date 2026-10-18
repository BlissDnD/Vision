# U5 javaslat: színek és felső gyorssáv (jóváhagyásra vár)

Forrás: `docs/spec/vel-ui-visszajelzes-2026-10-18.md` 4–5. fejezet, `FUNKCIO-LELTAR.md` 30. sor. Állapot: **tervezett**, kód még nincs.

**Javaslat: két szelet.** **U5a** = színösszesítő + színszabály + új színválasztó (csak felület, a projektformátum nem változik). **U5b** = saját színátmenet + felső gyorssáv (itt van az egyetlen formátumbővítés és a shader-módosítás). Így az U5a hamar kipróbálható, kockázat nélkül.

## Mi van most (kódban ellenőrizve)
- Minden rétegnek van **palettája** (`L.pal`, koszinuszpaletta, `palettes.ts`) és **Színeltolása** (`L.n.hue`); a Szín fülön `palettePicker` + csúszka.
- Egyes forrásoknak/formáknak **saját szín** paramétere van (`COL`, pl. Alakzat, Puha 3D, Szöveg), egy „Kitöltés: Szín / Paletta” választóval. A szerkesztő a böngésző natív színmezője (`ctlColor`).
- **Megjelenések**, amelyek átszíneznek: Színkorrekció, Pszichedelikus színezés, Neon körvonal stb. (sorrendjük a rétegeffekt-ikonsor sorrendje).
- **Kapcsolat**: paraméterkapcsolat (színt is írhat) és „Napfény hat” (`sunsky`). A **csoportnak** ma nincs saját színe.
- Felül a vásznon már van eszközsáv (`.hudbar`: Mozgatás, 3D forgatás, Animálás, Teljes képernyő); a számbillentyűk szabadok.

## (b) A színszabály: rögzített rétegrend, nem „az utolsó nyer”
**Döntés:** rögzített, látható rend, alulról felfelé:
1. **Paletta** (+ Színeltolás, ez a palettát forgatja),
2. **Saját szín** (ha a Kitöltés „Szín”, ez fedi a palettát),
3. **Csoport / Kapcsolat** (új csoportszín, ill. színt író Kapcsolat),
4. **Megjelenés** (az átszínező effektek, ikonsor-sorrendben; erősségük szerint keverednek).

**Miért nem „az utolsó nyer”:** az rejtett előzmény. Visszavonás, újranyitás, másolás vagy Változat után nem látszana, mi miért érvényes, és ütközne a „nincs rejtett frissülés” szabállyal. A rögzített rend mindig ugyanazt adja ugyanarra a projektre. **Az „utolsó” érzést a gesztus adja meg:** az összesítőben egy kattintással felülre hozhatsz egy forrást, ami valójában a fölötte lévőket kapcsolja ki/le (látható kapcsolók, egy commit, visszavonható, a toast kiírja, mit tett). Új rejtett mező nincs.

## A felhasználó ezt tudja majd
**U5a**
- Kijelöl egy réteget vagy csoportot → a Szín fül tetején a **Színösszesítő**: a 4 szint egymás alatt kis színmintával („Paletta: Napkorona”, „Saját szín #ee3b5c”, „Csoport: —”, „Megjelenés: Színkorrekció 60%”). Az **érvényes** sor kiemelve (felirat: „ez látszik”), a takartak halványak, mellettük hogy mi takarja őket.
- Csoportnál: a gyerekek összes színforrása rétegenként csoportosítva, összecsukva; bármelyik sor helyben szerkeszthető (paletta, szín, erősség).
- Egy sorra kattint: **„Ez legyen érvényes”** → a fölötte lévők kikapcsolnak (pl. Kitöltés „Paletta”-ra vált, a Színkorrekció kikapcsol).
- Bármelyik színmezőre kattint → **új színválasztó**: SV-négyzet + árnyalatcsík + hex mező; alatta a réteg **palettájából vett minták**, a **projektben használt színek**, az **utóbbi 8 szín**; **pipetta** gomb, amivel a vászonról (vagy a képernyőről) színt vesz.

**U5b**
- A Szín fülön „**Saját színátmenet**”: 2–5 húzható színpont egy csíkon (dupla kattintás: új pont, lehúzás: törlés); ez lesz a réteg palettája, így mindenhol működik, ahol ma paletta van (Pszichedelikus színezés, Színátmenet háttér, Paletta kitöltés). Elmenthető a palettasorba saját mintaként.
- **Csoportszín**: a csoportnak is lehet palettája/színe, ami a gyerekekre hat (3. szint); rétegenként „csoportszín figyelmen kívül” kapcsoló.
- **Felső gyorssáv** a meglévő eszközsáv mellett, ~10 üres hellyel: bármit ráhúzhatsz a könyvtárból, a rétegeffekt-ikonsorból, a mozgáscsipekből vagy egy színmintát. Onnan: **kattintás** = a kijelölt rétegre alkalmazza; **ráhúzás** egy rétegre a vásznon vagy a rétegsorban = oda alkalmazza; **1–9** billentyű = ugyanaz, mint a kattintás; lehúzás a sávról = eltávolítás. A sáv a munkatérhez tartozik (nem a projekthez, nincs commit).

## Pontosan megépítem
- **U5a:** `colorSources(L)` tiszta függvény (a 4 szint listája, érvényes jelölés; csoportra gyerekenként), összesítő szakasz az inspectorban, „Ez legyen érvényes” egyetlen commitként, közös színválasztó popover a `ctlColor` és a háttérszín helyett, utóbbi színek a munkatér tárolójában, pipetta: a böngésző `EyeDropper` API-ja, ha nincs, kattintás a vászonra `readPixels`-szel. Tesztek: `u5_colorsources.js` (sorrend, érvényes, csoport), `u5_picker.js` (hex/SV oda-vissza, legutóbbiak, nincs commit megnyitáskor).
- **U5b:** `L.grad` mező (alapból hiányzik → a régi projektek változatlanok; migrációs teszt), a közös `pal()` GLSL ágat kap a ≤5 pontos átmenethez (uniform tömb, nem textúra), csoportszín a gyerekek kiértékelésében, gyorssáv a meglévő húzási formátumokra építve (`text/x-latomas-lib`, `text/x-vel-fx`). Tesztek: `u5_grad.js` (mentés/újranyitás, export ugyanazt adja), `u5_quickbar.js` (húzás, alkalmazás, billentyű, nem írja a projektet).

## Ebben még nem
Paletta képből (ötlet, lásd lent), színkulcsok külön színidővonalon, OKLCH/sávos (nem lineáris) átmenetek, színharmónia-szabályok, a gyorssáv több oldala vagy szerkeszthető ikonjai, színforrás-összesítő a Kapcsolat másik végén (csak a cél oldalán látszik).

## Próba (2–4 lépés + mérés)
1. Alakzat egy csoportban, ráteszel Színkorrekciót → az összesítő 4 sort mutat, a Megjelenés az érvényes; „Paletta: Ez legyen érvényes” → a vásznon a palettaszín látszik, Ctrl+Z visszahozza.
2. Saját szín mezőre kattintasz → pipettával színt veszel a háttérből, a minta bekerül az utóbbiak közé.
3. (U5b) Háromszínű saját színátmenetet húzol, mentés + újranyitás + export: ugyanaz a kép.
4. (U5b) A Neon körvonalat felhúzod a gyorssávra, másik rétegen megnyomod az 1-et → ott is megjelenik.
**Mérés:** képkockaidő a színátmenettel ±0,1 ms-on belül marad (célgép, beépített panel), a teljes tesztkör zöld.

## Hátralévő lista változása
A 30. sorból U5a után: gradiens és gyorssáv marad; U5b után a 30. sor „demonstrálva”, ami nyitva marad: paletta képből, színkulcsok, a gyorssáv bővítései. Az U2 sorrendje nem változik.

## Két kreatív ötlet
- **A szín mint tárgy:** bármelyik színminta (összesítő, választó, pipetta eredménye) megfogható és ráejthető egy rétegre a vásznon; ejtéskor egy apró menü kérdez: „saját szín / palettába / csoportszín”. Ugyanez a gyorssávra is ráhúzható „festékként”.
- **Paletta egy képből (később):** ráejtesz egy képet a színátmenet-csíkra → 5 uralkodó színből átmenet lesz (kis k-közép a böngészőben).

**Jóváhagyod az U5a-t ebben a formában (és az U5b-t utána)?**

# UI-frissítés – feladatlista (innen dolgozunk)

Állapot: **0. (Web Awesome / WA1) megvalósítva az `claude/english-wa1-2419a5` ágon, felhasználói próba hátra; A. (angol) nagyrészt kész, lásd `ENGLISH-REMAINING.md`; 1–7. tervezett.** Létrehozva: 2026-10-18.
Minden feladat alatt ott van **a felhasználó eredeti szövege** szó szerint (idézet, az elírásokkal együtt). Ha egy feladat elkészül, ide kerül a jelölés (tervezett / részben / demonstrálva / kipróbálva), és a `FUNKCIO-LELTAR.md` megfelelő sora is frissül.

Sorrend (javaslat, jóváhagyás kell): **0 → A → 1 → 2 → …** A „0. Design system” az alap, mert minden más UI-feladat arra épül.

---

## 0. Design system: Web Awesome (a felhasználó döntése)

Döntés: **Web Awesome** a design system alapja (https://webawesome.com/), ahol kell, átalakítjuk a saját ízlésünkre (színek, ikonok, sűrűség). **Ez felülírja** a korábbi Material Design 3 döntést (`docs/spec/VEL-MATERIAL-DESIGN-SYSTEM.md`, `prototypes/material-ui/`) és az Apple-stílusú irányt.

Eredeti szöveg:
> a design systemet pedig web awesome t hasznaljunk, ahol kell atalkitod sajat ízünkre. ehhez létrekell hozni barmit, vagy eleg a link? tudsz itt is design systemet feltölteni elvielg.
> https://webawesome.com/ lehet telepíteni is asszem

Válasz a kérdésre: **nem kell semmit létrehoznod, a link elég.** A kódba telepítéssel kerül be (`npm install`, a Web Awesome csomagot a build beágyazza az egyetlen HTML-be), a saját ízünk pedig egy téma-fájl (színek, lekerekítés, sűrűség) lesz a repóban. Az első UI-szelet elején ellenőrizendő: a build mérete, a licenc (ingyenes/Pro rész), és hogy a komponensek szépen működnek-e az egyetlen HTML-fájlban.

Az eredeti UI-igény, amire a design systemnek ki kell szolgálnia (a felhasználó korábbi üzenete, képernyőképről átírva; a vége levágva látszott):
> ez amugy jó, de jegyezd fel UI updatek közé, hogy javítani kell .túl cluttered. nem intuitiv, apples. a mukodes amugy nemrossz, de jo lenne ezt a curve vagy keyframe részt könnyyebben lehetne használni, mint egy curve pl. vagy rajzolni bele és azt smooth curvé alakítja. A ritmusok lehetnek ikonok. a tempó és erő is, ráadásul ha ez egy squtch, lehetne switch a Uiban is.
> a színek fazsák elég ha a színek menu alatt van
> ez is nagyon cluttered, és ki kell javítni,, ikonok, job belrendezes stb .amit lehet vizualisan jelenitsunk meg, szoveg tooltipben ., de legyen egyerttelmu.
> az egyes csuszkak aszerint, h mit allitunk ,lehetnenek mas alaku vezerlok. pl a szél irány egy kör, amiben az iranyt allitom konkretan.  sokszor nem férnek ki feliratok.
> De az angol verzioban ez jobb lesz ugyis.  az egyes vezérlőknél tudom hvannak egyediek is, de lehet jobb lenne az ikon.Tempó pl elég általános , a szórás is stb biztos mindhez lenne jó ikon ami passzol.
> a toolbarban is kellene ikon inkbb. és valahogy talán színnel vagy cska ikon tipussal jelolni a kategoriakat pl az effekteknek a színe legyen mindenhol kék. és egy általánis ikon hozzá . stb .
> Ezek igazak lehetnek a egész UX UIra. lehet keszíteni kene egy design systemet  apple stylusban ami kiszolgalja ezeket

(A képernyőképről átírt szövegben van pár olvasási bizonytalanság, pl. „fazsák”; a lényeg: a színek elég, ha a Színek menü alatt vannak. Az „Apple stílus” a régi irány; az újabb döntés Web Awesome.)

Konkrét követelmények ebből (a design systemnek és a UI-átdolgozásnak):
- Kevesebb zsúfoltság: ikon + tooltip a hosszú felirat helyett, de egyértelműen.
- Kulcskocka/görbe szerkesztés: görbeszerkesztő, vagy szabadkézi rajz, amit sima görbévé alakít.
- Ritmus, Tempó, Erő: ikonok; a kétállapotú dolgok (pl. Tempó/Erő mód) lehetnek kapcsolók.
- Színek: csak a Színek menü alatt.
- Vezérlő alakja a paraméterhez igazodjon (pl. szélirány = körös irányválasztó).
- Minden vezérlőnek jó ikon (Tempó, Szórás stb.).
- Toolbar: ikonok; kategóriák színnel/ikontípussal jelölve (pl. az effektek mindenhol kék + közös ikon).

---

## A. Félbehagyott dolgok (az angol átállásból és a súgóból)

A felhasználó: „az angol frissítés félbe maradt”, „A félbehagyott dolgokat is (pl angol fordítás, tooltip feltöltés)”. Az eredeti terv: `docs/spec/VEL-ENGLISH-DEFAULT-LOCALIZATION.md` (ott a szabályok: stabil azonosítók, nem a megjelenített nevek az azonosítók).

Mi **kész** (a kódban): a felső sáv/ablakok, 300 könyvtári név, 82 effekt (700 paraméter) angol leírása, 8 mozgástípus és 42 paraméter, export, beállítások, presetek, jelenetek, idővonal egy része; 16 súgótéma és 128 statikus tooltip angolul (`app/src/helptooltips.ts`).

Mi **hiányzik** (a forráskód alapján, magyar betűs sorok száma fájlonként):
- **Receptek**: `recipes.ts` (~277 sor magyar), `library.ts` (~125). Ez a legnagyobb darab.
- **Mozgás és koreográfia**: `motion.ts` (44), `choreo.ts` (39), `xfer.ts` (28), `tap.ts`, `signals.ts`, `gesture.ts`, `moui.ts`.
- **Véletlen/Változatok**: `random.ts` (33), `rndq.ts`, `variantsui.ts` (30), `variants.ts`.
- **Egyéb panelek**: `polyhaven.ts`, `describe.ts`, `layouts.ts`, `linkcord.ts`, `pathedit.ts`, `lottieImport.ts`, `camui.ts`, `palettes.ts`, `lightui.ts`, `colorsum.ts`, `textbar.ts`, `layers.ts`, `state.ts`.
- **Tooltipek**: a 128 statikus tooltip kész, de a **dinamikus vezérlők** (amiket a `controls.ts`, `timeline.ts`, `moui.ts`, `scenes.ts`, `shelf.ts` hoz létre) még nem kaptak stabil súgó-azonosítót és leírást. Minden kezelőelemnek kell leírás, vagy kifejezett kivétel.
- **Záró kapu**: csak akkor állítjuk `lang="en"`-re a dokumentumot, ha a renderelt alapnyelvű UI-ban nincs magyar beépített szöveg (a lista és az elfogadási példák a localization-dokumentumban vannak). Eddig `lang="hu"` marad.
- **Tesztek**: a teljes teszt 51/60 volt zöld, a 9 bukó magyar felirat-szelektort frissítettem; azóta nincs újabb teljes futás.

Fontos: a UI-átdolgozás (Web Awesome) alatt a fordítást **nem újra kell csinálni**, hanem a szövegek a `locale.ts` kulcsain keresztül mennek tovább. Ezért érdemes az angolt a 0. szakasz előtt vagy vele együtt befejezni, különben kétszer írunk át mindent.

---

## 1. Megjelenés fül: kompozit-beállítások

Eredeti szöveg:
> A megjelenes fulon minden esetben lennie kellene blending mode belallitasoknak, color overlaynek, gradient overlaynek, maszkok ha vannak .

Értelmezés: minden rétegen a Megjelenés fülön legyen: Blending mode (keverési mód), Color overlay, Gradient overlay, és a maszkok (ha van) – mindig ugyanazon a helyen.

## 2. 3D anyag és 3D forma alapbeállítások

Eredeti szöveg:
> AMikor  egy anyagot beallitok egy 3d shape eseteben, az anyag részleteit is tudnom kéne finomhangolni. Szerintem valahogy magát az anyagot is kellene tudni szerkeszteni, vagy az importalt, meg kódolt általáunk igazabol?   a 3d shapek alap beallitasait at kell gondolni, mi az amit megkell ott jeleniteni, milyen egyeb dolgok hianyozhatnak. érdeség fémesség, ez a két csuszka nem tul hasznos, vagy nemtudom.

Értelmezés: az anyag részletei finomhangolhatók legyenek; maga az anyag szerkeszthető (az importált és a nálunk megírt is); a 3D forma alap-beállításai újragondolandók (az érdesség/fémesség két csúszka kevés vagy nem jó).

## 3. Külön Light mód a toolbaron

Eredeti szöveg:
> kellene egy kulon Light mode a toolbarra, amit bekapcoslva elojjonnek a fény controljai, beallitasok stb , ahol reszletesen lehet allitani konnyeden az egyes retegeken h hat e rajuk, hogyan hat rajjuk stb. így a jelentfény beállításai nem a réteg megjelenés menüjét tölti fel.

Értelmezés: a toolbaron egy Light mód; bekapcsolva megjelennek a fényvezérlők, rétegenként állítható, hat-e rá a fény és hogyan. A jelenetfény beállításai ne a réteg Megjelenés menüjét töltsék.

## 4. Rétegek átláthatósága

Eredeti szöveg:
> itt a rétegek nem atlathatoak.  valamiylen modon kategorizalni kell oket, es kompaktam UI kell

Értelmezés: a rétegek listája kategorizálva és kompakt legyen.

## 5. Maszkolási rendszer

Eredeti szöveg:
> Ki kell taláni egy intuitiv, konynu workflow-s maszkolasi rendszert.minel konnyebben gyorsabban tudjak maszkolni effekteből, layerekből barmibol. a megjelenes oldalon. Az effekteket az adott layeren is ott lehessen kulon maszkolni. shappel, mas layerrel, brushhal, stb. de ugy, hogy ez minel konnyedebben lehessen. és maszk lehet effekt, barmi lehet maszk ha behuzom igazabol.

Értelmezés: gyors, intuitív maszkolás a Megjelenés oldalon; az effekteket a rétegen belül külön is lehessen maszkolni (alakzattal, másik réteggel, ecsettel…); bármi lehet maszk, ha behúzom.

## 6. Könyvtár átszervezése

Eredeti szöveg (teljes, egy darabban, hogy a belső hivatkozások érthetők legyenek):
> A könyvtárat rendbe kell tenni.
> értem, jó hogy lehet nem cska kategoriara szurni, hanem tagekre, de ez így nagyon cluttered. És a receptek legyen egy kulon kiemelt dolog.  a recepteken belul rengeteg minden lesz, így oda kompaktul mehet valami tag vagy valami intuitiv gyors workflow- UI al, hogy konnyen megtallajam mindig mi kell . a 2d-3d formák mehetnének egy közös shapes be, azon belul kulon 3d 2d ful. a Szöveg és média külön legyen. a szöveg igazabol szinte receptek. olyan szovegek, amik mar megvannak csinalva, bevannak animalva, stb. egyeseknek külön vezérlője van, hogy az adott szöveg karakterisztikájának megfelelő beállítást végezzen rajta. azért rakjuk kulon, mert tul gyakran hasznalt a szoveg, es nem minden esetben darabokból all, lehet h valami egyedi szoveg asset. itt is amugy inkabb ikonokat kellene hasznalni szerintem, a kategoriakra. a megjelenések most tulajdonkéépen az effektek. ezen belul kellenek kulon shaderek, amiket a 3d-sekre lehet tenni. (tudnak ezek mukodni 2d-n is?) a 3d-s shapeknnek basic shapeknek kellene lennie, marmint. h most vannak ott olyanok, amik szinte receptek, van backgroundjuk meg ilyenek. tehat sima formak , gömb ,stb, amik most is vannakm ,meg mégplusz formák, és ugye lehet hozz á is adni. (jo lenne ha minden alap shape svg lenne 3d ben is) kulon kell valasztani a plain shapeket, az importalt 3d-ket, és azokat, amiken van vlaami egyedi dolog. pl már megeffektelt shape preset, vagy egyedi shape aminek egyedi beallitasai vannak.  az tetszik, h nem csak forgatni lehet őket meg ilyenek, hanem pl a fő beálíltásoknál van alap csuszka amivel kicsit lehet finomhangolni a kinezetuket stb. 3d import lehetoseg pl GTLf vagy mi  Az effekteknek egyertelmubb kép kell. de lehet itt is a sajat ikonjukat kene inkabb hasznalni. , a többinél jo a kis előnézet. scene, layer , gorup mentese presetbe gomb kel lvalhova

Pontokra bontva (mind a fenti szövegből):
- **6a. Kevesebb zsúfoltság:** tagek jók, de így cluttered. Ikonok a kategóriákra.
- **6b. Receptek** külön, kiemelt rész; azon belül kompakt tag-/gyors workflow-UI a kereséshez.
- **6c. Shapes**: a 2D és 3D formák egy közös „Shapes” alatt, azon belül külön 3D és 2D fül. Jó lenne, ha minden alap 2D (SVG) forma 3D-ben is létezne.
- **6d. Shapes szétválasztása**: sima (plain) formák / importált 3D / egyedi beállítású vagy már effektezett formák (preset) külön. A 3D alap formák legyenek tényleg alapformák (gömb stb.); ami most szinte recept (háttérrel stb.), az menjen máshová. Megmarad, hogy a fő beállításoknál van finomhangoló csúszka.
- **6e. 3D import** (pl. glTF/GLB).
- **6f. Szöveg és média külön**: a szöveg készre animált/beállított szövegek (szinte receptek), egyedi vezérlővel a szöveg karakteréhez; külön azért, mert nagyon gyakori és nem mindig darabokból áll (lehet egyedi szöveg-asset). Ikonok.
- **6g. Megjelenések = effektek**; ezen belül külön **shaderek**, amiket a 3D-s formákra lehet tenni. Kérdés a felhasználótól: *tudnak-e ezek 2D-n is működni?* (megválaszolandó a megvalósításkor)
- **6h. Effektek**: egyértelműbb kép; a saját ikonjuk legyen inkább; a többinél jó a kis előnézet.
- **6i. Mentés presetbe**: Scene / Layer / Group „mentés presetbe” gomb valahova.

## 7. Animációk, mozgás, library-koncepció

Eredeti szöveg:
> Az animacioknal nincs semmilyen elonezet.  jolenne az animacios rendszert kibogozni, mert pl most a motionben lévő transiitonöket nem tudom hasznalni loopolva. jo lenne ha live modban is lehetne hasznalni, h hany masodpercenkent all meg stb . szerintem amik az analogban vannak , kameralebegés, vetítő, lightleak, ezek inkabb A shaderekhez mehetnének.  de mondjuk a kameralebegés is lehetne egy lebegésből, srt monitorbol osszerakott recept igazabol. csak nem egyertelmu mi kerul a receptek koze, es mi mashova. lehet ugy kene, h receptek helyett a library van. ahol vannak az elmentett, importált dolgok. elmentett scenek, kedvenc effektek, stb stb. ésa többi dolgot meg elosztanánk a megfelelő heylére. valami teljesen egyedi shader például, de van ami meglévő eszközökből van összerakva láncként, mint egy recept. ez az adott itemtol fugg. amit lehet, azt láncból összerakni, de jobb eredmény érdekében lehet betenni egyedi dolgokat is - ezt magunknak mondom a fejlesztés során ha addolunk uj preseteet- ez majd jön nemsokára.   az animaciokhoz annyit, hogy jo lenne ha minden iylen vezerlonel itt az animacios ra kattintva nem cska szinuszok lennenek, hanem seamless loop option is

Pontokra bontva:
- **7a. Animáció-előnézet**: most nincs semmilyen.
- **7b. Animációs rendszer kibogozása**: a Mozgásban lévő átmeneteket (transition) nem lehet loopolva használni; élő (live) módban is menjen, pl. „x másodpercenként megáll”.
- **7c. Analog elemek** (kameralebegés, vetítő, light leak) inkább a **shaderek** közé; a kameralebegés lehet lebegésből + CRT-monitorból összerakott recept is. Nem egyértelmű, mi kerül a receptek közé és mi máshová.
- **7d. „Library” a „Receptek” helyett** (ötlet): a Library az elmentett és importált dolgok helye (mentett jelenetek, kedvenc effektek…), a többi a megfelelő helyre kerül. Egyedi shader vs. láncból összerakott recept: tételenként dől el; amit lehet, láncból, de jobb eredményért lehet egyedi is. *(Megjegyzés a felhasználótól magának: új presetek hozzáadásakor ezt kell figyelembe venni, hamarosan jön.)*
- **7e. Animációs vezérlők loop-opciója**: minden vezérlőnél az animálás gombra kattintva ne csak szinusz legyen, hanem **seamless loop** opció is.

(A 2026-10-18 „Körbeér” / LP1 szelet részben már ezt fedi a folyamatos mozgásokon: `tests/lp_loop.js`; a felhasználói próba még hátra van. A 7b–7e feladat ennél tágabb.)

---

## Mappaszabály (a felhasználó kérése)

Eredeti szöveg:
> kerlek egyszeru megnevezeseket hasznalj, amibol tudom mi micsoda, es mindig keruljon a megfelelo mappaba. pl legyen olyan mappa h future updates, ahova kerulnek a jegyzetek arrol, mit kellene csinalni majd. ott legyen egy final updates is, amibol dolgozunk altalaban. A meglevo fejlesztesi tervet atkell nezni, mert lehet mar felesleges is, cska bekell rakni a jegyzetek koze a hoanyzo dolgokat.  a bugs is jó, h oda jegyezni a hibakat pl.ezen felul ahogy neked jó, csak nem akarom, hogy keveredés legyen mert tul sok az agent, tul sok a fajl, csomo mindensokszor kimarad, felbemarad.  rendszerezd ezeket.

Megvalósítva: `docs/final-updates/` (ebből dolgozunk), `docs/future-updates/` (később), `BUGS.md` (hibák). Lásd `docs/README.md`.

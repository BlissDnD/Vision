# Vel – külső források célzott beépítése: átadó prompt Claude-nak

Ezt a fájlt add át Claude-nak a `HANDOFF.md` és a `CLAUDE.md` mellett. A jelenlegi Vel-kód és az elsődleges funkcióterv a mérvadó; ez a kiegészítés új felhasználói döntéseket rögzít. **A brief átadása nem jóváhagyás az összes mérföldkő azonnali megvalósítására.** A `CLAUDE.md` szerinti konkrét, 2–4 lépésben kipróbálható mérföldkőjavaslatot előbb írd le, majd várd meg Miksa kifejezett jóváhagyását. Jóváhagyás után a vállalt szeletet önállóan fejezd be, teszteld és dokumentáld; ne kérdezz rá minden belső műszaki döntésre.

## Termékcél és alapkorlát

A Vel szerkeszthető alkotói eszköz, nem Three.js-demók gyűjteménye. A felhasználó húzzon be egy elemet, kapjon azonnal jó alapképet, és néhány érthető vezérlővel alakítsa. Az eredmény rétegként működjön a Velben: a vásznon kijelölhető, Mozgással és Megjelenéssel kombinálható, időben determinisztikus, menthető, újranyitható és exportálható. A könyvtári besorolást a felhasználói művelet határozza meg, nem a technikai szó, hogy „shader”.

A Vel jelenleg saját WebGL2 renderert, rétegrendszert és közös jelenetidőt használ; a `sim.ts` rögzített lépést és pontos export-újraszámolást kínál. Three.js-függő kódot nem lehet közvetlenül a jelenlegi rendererbe másolni. Előbb azonosítsd az önálló algoritmust/GLSL-t/adatmodellt; készíts szűk adaptert vagy jól körülhatárolt portot. Ha a direkt integráció aránytalanul átrendezné a renderert, mutass be működő alternatívát és a kompromisszumot a mérföldkőjavaslatban. Ne legyen második, egymástól elszakadó óra vagy exportútvonal.

## 1. Seeddel újragenerálható városkép – saját Vel Forrás

Inspiráció: [Vectiler / Halfmaps](https://www.halfmaps.io/). **Nem kell földrajzi adatkeresés, valódi város letöltése, térképszolgáltatás, DXF/3MF export vagy a teljes külső szolgáltatás.** A cél vizuálisan erős, kitalált város egy egész számos seedből: ugyanaz a seed és beállítás ugyanazt az úthálózatot, tömböket és épületeket adja ugráskor, mentés után és exportban.

Elsődleges hely: **Források → Város** (önálló, 3D térbeli generátor). A **Receptek / Scapes vagy Motion grafika** közé külön összerakott városi kompozíció kerülhet. A felhasználó a vásznon a keretet és kameranézetet állítsa; az inspectorban kevés fő vezérlő legyen: Seed/Új változat, várossűrűség, horizont vagy közeli nézet, épületmagasság, úthálózat karaktere, stílus/paletta, napszak. A több szerkesztés később lenyitható: negyedek, utcaközök, magasházak aránya, tetőformák, ablakfények, köd. Legalább két valóban eltérő, kész alapstílust mutass be (például tiszta grafikus makett és éjszakai neon), ne csak ugyanazt a geometriát átszínezve. A véletlengenerálás kontrollált tartományon belül maradjon; legyen rögzíthető seed és megőrizhető kézi felülírás.

Az első szeletben eldöntendő: mesh/instancing vagy más Vel-kompatibilis 3D út, közös Jelenetfény, vetett/fogadott árnyék, kamera, LOD. A házak ténylegesen térbeli testek legyenek, ne egy lapos városfotó vagy teljes képes zajshader. Több ezer ház esetén aggregált rajzolás és távolságalapú részletcsökkentés szükséges; 4K exportnál magasabb képrészlet lehet, miközben a város szerkezete azonos marad. Tesztpélda: két azonos seedű jelenet teljesen ugyanaz; másik seed láthatóan más elrendezés; kamera elfordításakor a mélység és takarás helyes.

## 2. Procedural Terrains – szerkeszthető 3D Terep, később bolygóra illesztve

Forrás és kód: [ZyFou/ProceduralTerrains](https://github.com/ZyFou/ProceduralTerrains), magprojekt MIT. Ez teljes React/Three.js alkalmazás, ezért **ne emeld át az egész szerkesztőt**. Vizsgáld meg és ahol jó, portold a determinisztikus magasságfüggvényt, rétegzett zajt, biome-maszkolást, normálszámítást, csempézést/LOD-ot és minőségi profilokat. Az eredeti szerzői és licencinformáció maradjon a Velben. A külső Unity/Blender pluginek eltérő licence nem jogosít azok átemelésére.

Elsődleges hely: **Források → 3D Terep** (a jelenlegi 2D „Talaj” mellett, külön, érthető megnevezéssel); a létrejövő térbeli test a **3D Formák** keresésében is található lehet. A Terep önmagában hegyet, dűnét, szigetet, kanyont, fennsíkot és krátert tudjon, minőségi alapértékekkel. Fő vezérlők: Seed/Új változat, tereptípus, méret, domborzat erőssége, részletek léptéke, vízszint, biome/stílus. A haladó szerkesztés rétegezett zajt, maszkot, kopást/eróziót csak akkor tartalmazzon, ha a tényleges minőség és teljesítmény indokolja. A terep sziluettjét, normáljait, anyagát és fényreakcióját geometria/megvilágítás adja; ne csak képi shader legyen.

Külön következő lépés: **Terep → Bolygó felszínére illesztés**. A Bolygó maradjon egyetlen Forrás, a terep a felszínének szerkeszthető domborzati komponense legyen. Ugyanaz a seedelt terepfunkció képeződjön gömbkoordinátákra varratmentesen; ne egy sík terep képét csomagold textúraként a gömbre. A bolygó már meglévő légköre, felhői, gyűrűje és napfénye ne vesszen el. A művelet UI-ja lehet húzás a Bolygóra, ahol a Vel felajánlja: „Felszín domborzata” – ennek konkrét gesztusát mérföldkő-prototípussal döntsd el. Teszt: ugyanaz a terepmag külön bolygón/álló képen megismételhető; a gömb forgatásakor nincs látható hosszúsági varrat.

## 3. Three Fluid FX – közös folyadékmező, két felhasználói kimenettel

Forrás és kód: [artcodev/three-fluid-fx](https://github.com/artcodev/three-fluid-fx), MIT. A csomag WebGL2/GLSL Stable Fluids megoldást és külön WebGPU/TSL utat ad. A Vel WebGL2 útjához portolj/adaptálj; a `three`-hoz kötött `EffectComposer` passokat ne tedd változatlanul a meglévő láncba. Vizsgáld meg a solver-részt, a ping-pong textúrákat és a három minőségi profilt. Megfelelő attribúció és harmadik félre vonatkozó notice szükséges.

Egy közös, rétegenként vagy csoportonként birtokolt szimuláció adjon sebesség- és festéksűrűségmezőt, amelyből több **felhasználói eszköz** olvashat:

- **Források → Áramló tinta / folyadékmező**: önálló látható festék, szín, kibocsátó helyek, irány, örvénylés, lecsengés. Vásznon lehessen forráspontot húzni és gesztussal belekeverni.
- **Megjelenések → Folyadékos torzítás / folyadékos feltárás**: kompatibilis kép, videó vagy szöveg tényleges képi torzítása vagy maszkja a mező alapján; ráhúzható a célrétegre. A részecske Forrás később ugyanennek a sebességmezőnek a hatását is felhasználhatja, Kapcsolattal vagy célzott vezérlővel.

**Ez nem 3D víztérfogat:** nem a testből kifolyó, ütköző víz korábban kért teljes megoldása. A mező külön működik a rigid-body fizikától, de későbbi interakciós pontot hagyjon. A Vel közös 60 Hz-es jelenetideje hajtsa; ugrás, Loop, élő futás és 4K videóexport ugyanazt a szimulációs szabályt kövesse. Az előnézet alacsonyabb szimulációs felbontást és késleltetett pontos újraszámolást használhat, de az export legyen megismételhető. A 4K kép **nem jelenti**, hogy a sebességmezőt is 4K-ban kell számolni; a mező alacsonyabb felbontású maradhat, jó szűréssel. Teszt: ugyanarra az időpontra ugrás után azonos kép; szövegre húzva ténylegesen az érintett szöveg torzul, más réteg nem.

## 4. Anime.js – két mintamozgás a Vel Mozgás polcán

Forrás: [Anime.js](https://animejs.com/documentation/timeline/), [MIT-licenc](https://github.com/juliangarnier/anime/blob/master/LICENSE.md). A Vel meglévő idővonalát, Mozgásblokkjait és `sim.ts` óráját **ne cseréld le**. Az Anime.js interpolációs/kompozíciós képességeit egy tesztelhető adapterben használd; a Vel jelenetideje legyen az egyetlen mesteróra. Előbb kis prototípusban igazold, hogy a példány tetszőleges `t` időpontra seekelhető, és ugyanazt az értéket adja függetlenül a korábbi lejátszási sorrendtől; a callbackeken és DOM-módosításon alapuló viselkedést ne használd exporthoz.

Pontosan **két** felhasználói Mozgás-minta készüljön első körben:

1. **Rugalmas beúszás**: ráhúzható szövegre, formára vagy 3D rétegre; vásznon húzható érkezési irány/távolság, fő vezérlők: idő, karakter (lágy/ütés/rugó), eltolás a cél részei között. Több soros szövegnél a sorok/szavak lépcsőzetesen érkezhetnek. A végpozíció a felhasználó által beállított hely marad, és a blokk időtartama utólag a Velben nyújtható.
2. **Kamerás ráúszás és fókuszváltás**: a kamera egy kijelölt célra közelít/fordul, a célpont Kapcsolattal követhető; fő vezérlők: közelítés, ív, sebességkarakter, fókusz. Ugyanazon jelenet több egymás utáni, retime-olható Mozgásblokkjába illeszkedik.

Ezek a **Mozgás** polcra kerülnek, nem a Receptek közé; egy kész tipográfiai hirdetés, amely használja őket, külön Recept lehet. Teszt: eltolás/retime után az egész mozgás együtt marad; ugyanazon `t` képkocka frissítés, ugrás és export esetén ugyanaz; a Loop nélküli mód végén a folyamatos viselkedések nem állnak le indokolatlanul.

## 5. FreeStylized – néhány gondosan választott nagy felbontású skybox

Forrás: [FreeStylized](https://freestylized.com/), feltételek: [Disclaimer/licenc](https://freestylized.com/disclaimer/). A szerzői oldal kreatív művekben ingyenes használatot ír, de az önálló assetek újraterjesztését korlátozza; **ne csomagolj be letöltött skyboxokat automatikusan a Vel forrásába vagy alap HTML-jébe**. Először azonosíts konkrét 2–3 skyboxot és azok egyedi feltételeit, majd döntsd el, hogy az appba csomagolás megengedett-e. Ha nem, a felhasználó saját, jogszerűen letöltött skyboxát lehessen helyben importálni; a Vel csak előnézetet/miniatűrt vagy forráslinket adhat.

Elsődleges hely: **Források → Égbolt / Környezet**. A skyboxnak a 3D tárgyak hátterét és – ha kiválasztott – környezeti megvilágítását/tükröződését is adnia kell, nem csupán lapos háttérképként viselkednie. A jelenlegi procedurális Ég és Nap maradjon külön tárgy; a skybox velük kapcsolható, helyettesíthető vagy keverhető, egyértelmű elsőbbséggel. 4K/8K forrásnál a szerkesztőben kisebb GPU-textúra vagy mip/LOD, exportnál a megfelelő részlet; a projekt mentésekor a külső fájl elérhetősége és az offline hordozhatóság legyen világos.

## 6. Oimo.js – csak ha az Oimo is mostani feladatként jóváhagyott

Forrás: [lo-th/Oimo.js](https://github.com/lo-th/Oimo.js), MIT. A felhasználó „oimo, király. hagyjuk.” mondata értelmezhető úgy is, hogy az Oimo-t későbbre hagyja; **ezt az egy pontot tisztázni kell**, ne sorold be automatikusan a most elfogadott kivitelezésbe. Ha most kéri: az Oimo a **Fizika/Viselkedés** rendszer számítási motorja, nem shader, nem Forrás és nem Megjelenés. A ráhúzható „Fizikai test” felhasználói művelet alakot, tömeget, súrlódást, ütközési csoportot és rögzített/szabad állapotot állítson. A globális gravitáció alapból maradjon kikapcsolva; helyi gravitációs mezők külön Források/későbbi szabályok lehetnek. A Vel jelenetórájához rögzített lépés, reset, seek/checkpoint és determinisztikus export szükséges. A fizikai testek találkozása automatikusan létrejöhet, de a Kapcsolatok felülete mutassa az érintett interakciókat. Folyadék és puha test külön feladat.

## Kifejezetten kihagyott jelöltek

- **GSAP:** a [jelenlegi standard licenc](https://gsap.com/community/standard-license/) a Webflow-val versengő vizuális animációépítő eszközökbe való használatot előzetes engedély nélkül tiltja. A Vel közvetlen beépítését ne tervezd jogi tisztázás nélkül.
- **Real World Shader:** ezen a körön kívül hagyjuk; külön, konkrét hatásválasztás és az adott kód licencének ellenőrzése után lehet új mérföldkő.
- **Halfmaps/Vectiler forráskód és valódi térképadat:** csak a fiktív város-generátor inspirációja; nem az oldal vagy szolgáltatás átvétele.

## Mérföldkőjavaslat elvárt formája Claude-tól

Először leltározd, mi van már a Velben (pl. 2D Talaj, Bolygó, jelenetidő, Mozgás polc, 3D render); ne írd felül csendben. Írj **függőségi sorrendet** és minden külön szelethez: felhasználói gesztus + látható eredmény; konkrét kódforrás és adapterhatár; mi nem része; 2–4 lépéses alkotói próba; időbeli/mentési/4K ellenőrzés; várható teljesítmény és csomagméret; licenc/attribúció; állapot a `FUNKCIO-LELTAR.md`-ben. A mérföldkövek sorrendjét műszaki bizonyíték szerint módosíthatod, de a felsorolt felhasználói célokat ne hagyd el. Egy szelet csak akkor „kész”, ha a vásznon valóban használható, nem csupán GLSL-fordítás vagy szerkezeti teszt zöld.

# FORM — Motion Playground · Claude agent handoff

Átadás: 2026. október 18. • Aktuális kiadás: v8

## 1. Feladat és szemlélet

Folytasd a már elkészült generatív art tool fejlesztését. Először olvasd el a meglévő kódot, indítsd el az alkalmazást, járd végig a fő munkafolyamatokat, és csak ezután módosíts. Ne kezdj automatikusan új alkalmazást. Ez a dokumentum átadási összefoglaló, nem új funkciók végrehajtására adott külön felhasználói megrendelés.

A felhasználó gyors, kreatív, intuitív eszközt szeretne érdekes formák, sigilek, szimbólumok, geometriai jelek és minőségi motion graphics létrehozására. Vizuális alkotóeszköz, amely professzionális munkákhoz exportálható alapanyagokat készít. WebGL-alapú, több külön móddal. Kevés, jól kombinálható matematikai és fizikai viselkedésből lehessen sokféle eredményt létrehozni.

A döntések prioritása:
1. Jó vizuális eredmény és közvetlen alkotási élmény.
2. Kész termék benyomását keltő, kompakt, következetes UI; dark és light mód.
3. Kevés, érthető vezérlő, nagy kifejezőerővel; fokozatos feltárás.
4. Nem destruktív szerkesztés, undo/redo, megbízható mentés és export.
5. Teljesítmény és ténylegesen ellenőrzött működés.

## 2. Amit a felhasználó külön korrigált

- A Shape mód fő célja NEM pusztán alakzatok ismétlése. Szabadkézi rajzból állítható simítással, végpontjavítással és szép ívekkel lehessen formát készíteni.
- A blob legyen egyszerű: elsősorban kontúr és viselkedés. Ne halmozz rá pattern- és blobrétegeket.
- Pattern és Background esetén a minőség ne két réteg egymásra helyezéséből és ide-oda mozgatásából származzon. Hullámmező, fázis, ritmus, geometriai összefüggés és érzékeny reakció kell.
- A sok funkció önmagában nem érték. Korábban a zsúfolt, csúnya UX-et kifogásolta.
- A Random minden kreatív értéket változtasson. A jelenlegi v8 az aktív generátormód támogatott paramétereit és palettáját sorsolja, a dokumentumméretet megőrzi. Ez az értelmezés még felhasználói visszajelzésre vár.
- Sok betölthető, kereshető Lottie kell, szerkeszthető színekkel és elrejthető elemekkel. További ingyenes assetforrások is fontosak.
- Ne adj át díszgombokat, üres paneleket vagy működés nélküli ígéreteket.

## 3. Projektazonosság és hozzáférés

- Élő alkalmazás: https://shape-generator-studio.xmeditor.chatgpt.site
- Forráskönyvtár az eddigi fejlesztői környezetben: `/workspace/sites/shape-generator`
- Sites projekt: `appgprj_6ad3927561d08191906778b1b119c15e`
- Utolsó sikeresen publikált commit: `48788948352327a58691f6f29222884cfb54343b`
- Belépési oldal: `dist/index.html`
- Hosting konfiguráció: `.openai/hosting.json`, statikus gyökér: `dist`.
- A webhely tulajdonosi, privát hozzáférésű. A jogosultságot ne változtasd meg önkényesen.

Fontos: ez a Markdown nem tartalmazza a forráskódot. Másik Claude-környezetben a fenti helyi elérési út nem feltétlenül létezik. Ha nincs hozzáférésed a repóhoz, kérd el a forráscsomagot vagy a repó-hozzáférést. A publikált URL önmagában nem helyettesíti a forrást. Titkok, tokenek nem részei az átadásnak.

## 4. Technológia és fájltérkép

Build nélküli HTML/CSS/JavaScript, natív ES-modulok, közvetlen WebGL2/GLSL. Nincs szükség frontend framework migrációra. A függőségek helyben csomagolva vannak.

| Fájl | Szerep |
| --- | --- |
| `dist/index.html` | Fő alkalmazás váza, panelek, dialógusok |
| `dist/studio.js` | Állapot, UI, history, módváltás, lejátszás, export |
| `dist/studio-render.js` | WebGL2 renderer, GLSL, alapparaméterek |
| `dist/creative.js` | Karakterek, motívumok, 12 recept, állapotmigráció |
| `dist/random-all.js` | Aktív mód teljes kreatív randomizálása |
| `dist/studio.css`, `dist/product.css` | Korábbi alapstílus és v8 termékfelület |
| `dist/theme.js`, `dist/editor-theme.css` | Téma mentése, továbbítása és alszerkesztők megjelenése |
| `dist/draw.html`, `draw-app.js`, `draw-geometry.js`, `draw.css` | Szabadkézi és vektoros formaszerkesztő |
| `dist/generator.html`, `app.js`, `geometry.js`, `random.js`, `style.css` | Korábbi ismétlés/metaball/slicing labor |
| `dist/assets.js` | Lottie import, könyvtár, tárolás |
| `dist/lottie-edit.js` | Nem destruktív szín- és rétegmódosítás |
| `dist/icon-library.js`, `dist/icons/` | Helyi SVG katalógus |
| `dist/lottie/` | Importált animációk, manifest, licencek és források |
| `dist/vendor/` | lottie-web 5.13.0, fflate 0.8.2 és licencek |
| `tests/` | Geometriai, asset-, random- és shaderellenőrzések |

A README történeti napló is: a régebbi verziók leírásai helyenként már nem aktuálisak. Az aktuális kód és a v7/v8 szakasz elsőbbséget élvez a v5/v6 termékleírással szemben.

## 5. Jelenlegi módok

### Blob
Három kontúrcsalád: organikus, harmonikus, csepp. Méret, részletesség, szabálytalanság, feszesség; mozgás amplitúdója, periódus, reakció és ritmus. Harmonikus komponensek és közelítő területnormalizálás. A pointerreakció csillapított rugómodell. Ez nem folyadékszimuláció.

### Pattern
14 alapmotívum, 6 kiosztás, motívumkeverés, jitter; saját SVG/PNG, rajz vagy Lottie-képkocka motívumként. Közös mező vezérli az eltolást, elfordulást, méretet vagy mindhármat. Mezők: nyugalom, haladó, sugárirányú, örvény- és állóhullám. Nem garantált a tetszőleges kompozíció hézagmentes csempézhetősége.

### Background
Interferencia, áramlásfüggvény-kontúrok, mozgatott zajkontúrok, valamint a v8 harmonikus vonalmezője, a Signal study. Egy matematikai rendszerből épül fel, nem két kompozitrétegből.

### Gradient
Hét karakter, procedurális mozgás és textúra. Ugyanaz a lejátszási és exportmotor.

### Shape
Beágyazott önálló rajzszerkesztő. Szabadkézi vonalból Bézier-kontúr, állítható simítás, sarokmegtartás, végpontjavítás és geometriai igazítás. Nyitott/zárt görbék, primitívek, kijelölés, mozgatás, méretezés, forgatás, tükrözés, duplikálás, helyi formálás. Union/subtract/intersect, lyukakkal. Tükör- és radiális szimmetria, SVG/PNG export.

### Motion / Assets
Három saját minta: Orbit, Pulse, Bloom; hat importált airbnb/lottie-web MIT demo: Adrock, Bacon, Balloon banner, Dalek, Ronda, Bodymovin lettering. JSON/dotLottie/ZIP tömeges import, közvetlen URL import, keresés, kedvencek, helyi tárolás és könyvtár-ZIP mentés.

Statikus kitöltés-/körvonalszínek és solid layerek átszínezhetők, elrejthetők; root és precomp layerek kikapcsolhatók. Eredeti adat megmarad; reset, undo, projektmentés, szerkesztett JSON export és könyvtári másolat támogatott.

SVG katalógus: összesen 8 252 Lucide/Tabler ikon, helyi kereséssel és gyűjteményszűrővel. Ikonból Pattern motívum vagy letölthető SVG készül. Ez helyi katalógus, nem élő LottieFiles/Iconify API-kapcsolat.

### Megőrzött ismétléslabor
Külön `generator.html`: kör, ellipszis, lekerekíthető téglalap, sokszög, csillag, vonal, ív; sor/kör/rács/útvonal ismétlés; taper; kör/ellipszis metaball; slicing; egyedi példányeltérések; presetek; műveletsor; JSON és SVG. Nem a Shape rajzokra közvetlenül kapcsolható egységes módosítórendszer.

## 6. v8 felület és animáció

Sötét alaptéma, világos alternatíva, visszafogott lime kiemelés. Bal oldali módválasztó; középen vászon, idővonal és Randomize all / Explore 6; jobb oldalt Forma / Mozgás / Szín fülek. A kiindulópontok lenyithatók. A téma a rajz- és geometriai szerkesztőre is továbbítódik. A felület témája nem módosítja az alkotás színeit.

Új időzítések: folyamatos, lágy gyorsulás, lépés és kitartás, kettős impulzus. Radiális fáziskésés. A generátorok alapértelmezésben animálnak, reduced-motion beállítást figyelembe véve.

A random az aktív procedurális módra vonatkozik, nem a teljes alkalmazás összes módjára egyszerre; Shape és Motion más szerkesztési modellek. A saját Pattern-textúrát generált motívumra cseréli. A sorsolás egy undo-tranzakció.

## 7. Állapot és adatbiztonság

- Fő projekt: verziózott JSON, külön módállapotok, aktív Lottie és módosításai.
- Fő localStorage kulcs: `form-studio-v3`; Shape: `form-studio-draw-v2`; téma: `form-theme`.
- Lottie-könyvtár: IndexedDB, böngészőhelyi. Nincs cloud sync.
- A fő projekt nem csomagolja be az egész assetkönyvtárat vagy a külön Shape-projektet. Ezeknek saját mentése van.
- Render és procedurális PNG export ugyanazt a renderert használja.
- Interaktív pointerhatás átmeneti állapot; exportnál rögzül, nem felvett egérperformansz.
- Ne törd el a régi projektmigrációt és az egyedi példányok stabil azonosítóit.

## 8. Export és konkrét korlátok

- WebGL módok: PNG, PNG képsorozat ZIP. Nincs generált Lottie, MP4, WebM vagy GIF export.
- SVG export a Shape és ismétléslabor vektoros eredményeire érhető el; a shaderalapú képek nem általánosan vektorizáltak.
- Képsorozat: legfeljebb 120 frame és összesen 150 millió pixel.
- Lottie import: fájlonként 30 MB, kibontott archívum maximum 100 MB; közvetlen URL-hez CORS szükséges. Külső képhivatkozások és expressionök elutasítva.
- Lottie szerkesztő nem teljes timeline/keyframe-editor. Animált színek, gradient stopok és raszterképek színei nem szerkeszthetők ezzel a módszerrel.
- Lottie exportba a szín/rétegmódosítás bekerül; a lejátszó méret/pozíció/sebesség beállításai nem sülnek bele.
- Shape Boolean: közelítő, scanline-alapú kontúrképzés, tipikusan 1–2 px felbontás. Vektoros eredményt ad, de nem egzakt CAD-geometria.
- Rajzjavítás helyi geometriai eljárás, nem AI-objektumfelismerés vagy szemantikus kiegészítés.
- Szimmetriamásolatok önálló alakzatok, nem élő constraint rendszer.
- A korábbi rétegezés maradványparaméterei még megtalálhatók a kódban; a v7 migráció és renderer kikapcsolja őket. Ne aktiváld vissza véletlenül.

## 9. Referenciák és értelmezésük

Felhasználói referenciák:
- https://app.ruri.design/pixel — közvetlen alkotás és egyszerű eszközélmény.
- https://www.magicpattern.design/ — kombinálható generatív rendszerek.
- https://patterns.helloyes.dev/ — gyors mintakészítés.
- https://www.magicpattern.design/tools/iphone-13-gradient — célzott gradient eszköz.
- https://app.haikei.app/ — külön generátormódok és háttérkészítés.
- https://bgjar.com/ — többféle háttérkarakter.
- https://lottiefiles.com/platform?via=top_nav — animációs assetélmény.

A legutóbbi fejlesztéshez vizsgált motion referenciák:
- https://www.ordinaryfolk.co/play — radial delay, wave/grid rigek, Signals Patterns Waves, Cavalry Circles.
- https://www.simonholmedal.com/ — motion design irány.

Ordinary Folk két publikus videójából mintaképkockák ténylegesen meg lettek nézve. Saját implementáció készült; referenciafelvételek nem részei a terméknek. A fenti oldalak nem jelentik azt, hogy minden részletük már implementálva lett.

## 10. Tesztelt állapot és első teendő

A v8 publikálása sikeres. Az összes hét Node tesztfájl lefutott, a 12 recept tényleges GLSL ES shaderrel natív Mesa EGL alatt nem üres eredményt adott, GL-hiba nélkül. A 400 randomizált állapot ellenőrzése igazolta a tartományokat és az összes támogatott paraméter változását.

Futtatás a repó gyökeréből:
```bash
node --test tests/*.test.mjs
python tests/shaders.py
python tests/render-recipes.py /tmp/form-recipes.png
```
Python renderellenőrzéshez Pillow és elérhető EGL/GLES környezet szükséges. Ezek nem a böngészőteszt helyettesítői.

A kezelt böngészős előnézet a fejlesztői konténerben nem indult el:
`bwrap: Can't mount proc on /newroot/proc: Operation not permitted`
Emiatt a v8 vizuális elrendezése, pointerinterakciói és böngészős letöltései NINCSENEK end-to-end igazolva. Ezt ne kommunikáld teljes körűen tesztelt késztermékként. Más környezetben az ott engedélyezett módon szolgáld ki a `dist` mappát HTTP-n; file:// megnyitás nem megfelelő a modulokhoz.

Első prioritás valódi böngészőben:
1. Console hibák, indulás, minden mód és mindhárom inspector fül.
2. Sötét/világos téma, kis/nagy ablak, overflow, popupok, beágyazott Shape.
3. Random többször minden generátorban; undo pontos visszaállítása; Explore 6 kiválasztás.
4. Play/pause/scrub, ritmusok és loophatár vizuális ellenőrzése.
5. Szabadkézi rajz → simítás → javítás → SVG/PNG; geometrialabor alapfolyamata.
6. Lottie betöltés → színcsere → elrejtés → undo → szerkesztett JSON visszatöltés.
7. SVG ikon keresése → Pattern motívum → PNG; rajz és Lottie-frame motívum.
8. Főprojekt mentés/visszatöltés, külön Shape mentés, asset ZIP backup.
9. PNG és frame ZIP tényleges letöltése, átlátszóság, képméret és előnézet-egyezés.
10. Több tucat geometriai példány, sűrű Pattern és nagy felbontás teljesítménye.

Az eredeti geometriai regressziós útvonal: kör → körkiosztás → példányszám → méret-taper → alapméret növelés aránymegőrzéssel → egyedi eltérés → metaball → résvágás → undo/redo → mentés/visszatöltés → SVG/PNG.

## 11. Javasolt további fejlesztési sorrend

Ezek javaslatok, nem már elkészült funkciók:
1. A fenti böngészős hibák és UI-egyenetlenségek javítása.
2. A stíluslapok rendezése: a `product.css` jelenleg a régi stílusokat felülíró réteg. Konszolidáld megfontoltan, képernyőképes regresszióval.
3. Egységesebb projektmentési UX: legyen világos, mit tartalmaz a fájl és mi külön könyvtár.
4. Jobb, gondosan komponált defaultok és motion presetek, valódi mozgó előnézetekkel. Több kapcsoló helyett jobb tartományok és összefüggések.
5. A loopfolytonosság és különböző exportméretek automatizált ellenőrzése.
6. Felhasználói igény alapján animált Lottie-színek/gradiensek támogatása vagy videóexport; csak valós implementációval és korrekt formátumkorlátokkal.

Kommunikálj magyarul, röviden. A tényleges változást, kipróbálási módot és konkrét korlátot mondd el. A cél használható alkotóeszköz, nem újabb nagyszabású funkciólista.

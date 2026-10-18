# Vel – ingyenesen beépíthető WebGL/Three.js források

2026-10-18 · Codex · A 0.36.0-g1 audit kiegészítése.

## Eredmény és módszer

Hivatalos projektoldalak, dokumentációk és licencoldalak internetes ellenőrzése alapján összeállított lista. Nem történt letöltés, csomagtelepítés, kódátvétel vagy futási prototípus. A beépíthetőség és a ráfordítás mérnöki becslés; nincs kimért csomagméret, GPU-idő vagy garantált kompatibilitás. A repók aktuális ága kutatási forrás: fejlesztéskor konkrét verzió/commit rögzítendő.

A Vel saját WebGL2 renderelővel dolgozik (`app/src/gl.ts`), a termék nem Three.js-alapú. Ezért három út van: asset importálása a meglévő rendszerbe; GLSL/matematikai rész célzott átültetése; vagy külön Three.js renderút összekötése a Vel rétegkompozitorával. A harmadikhoz előbb prototípus kell. Nem javasolt a teljes alkalmazást átírni.

## 1. Látvány és alkotói funkciók – rangsorolt jelöltek

| # | Forrás, ellenőrzött licenc | Mit kapna a felhasználó? | Velbe illesztés, ráfordítás és korlát |
|---|---|---|---|
| 1 | [Poly Haven HDRI/PBR](https://polyhaven.com/license), CC0; konkrét kezdőasset: [Studio Small 09](https://polyhaven.com/a/studio_small_09) | Választható stúdiófény és környezet a krómhoz, üveghez, 3D tárgyakhoz; valódi felületi anyagok. | A meglévő PH1 csak 2D textúraimport. Új HDR-dekódolás, környezeti mintavétel és PBR-anyagcsatlakozó kell. Közepes–nagy. Első kör: egy stúdió HDRI, három anyag. Az asset CC0; a webes API és előnézetek használati feltétele külön téma. |
| 2 | [ambientCG](https://docs.ambientcg.com/license/), CC0; konkrét minta: [PavingStones036](https://ambientcg.com/a/PavingStones036) | Kő, fa, fém, beton és textil a terepen és tárgyakon. | Ugyanazt a PBR-csatlakozót használja, mint a Poly Haven. A szín/normal/roughness/metalness térképek és UV-skála kezelése szükséges. Közepes; a displacement külön geometriai költség. |
| 3 | [Kenney Particle Pack](https://kenney.nl/assets/particle-pack), CC0 | Részecskealak-készlet szikrához, porhoz és grafikus effektekhez. 80 darab 512×512-es fájl. | Ez kész képi asset, nem részecskemotor. Kis kurált atlasz saját emitterhez; a meglévő képalapú részecskeút is vizsgálható. Kicsi–közepes. A 80 fájlt nem érdemes mind beégetni a HTML-be. |
| 4 | [Troika Three Text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text), [MIT](https://github.com/protectwise/troika/blob/main/LICENSE) | Éles térbeli szöveg, körbehajlított/hengeres felirat. Van `curveRadius` paraméter. | Three.js-függő SDF-szövegút; a betűk alakja és a fontlicenc külön kezelendő. Közepes–nagy. Első próba: szerkeszthető magyar felirat hengeren; gömbi tetszőleges tördelést nem ad automatikusan. Offline működéshez a font és Unicode-fallback út is helyivé teendő. |
| 5 | [Three.js TubeGeometry](https://threejs.org/docs/pages/TubeGeometry.html) + [MeshLine](https://github.com/pmndrs/meshline), MIT | Rajzolt útvonalból térbeli cső vagy szalag; változó vastagságú vonal. | A közös útvonalmaghoz csatlakoztatható. TubeGeometry valódi csőgeometria, MeshLine kamerafelé forduló háromszögszalag: két külön felhasználás. Közepes. Statikus geometria előállítása átültethető a saját renderútra; a kész Three-anyag nem közvetlenül kompatibilis. |
| 6 | [drei-vanilla](https://github.com/pmndrs/drei-vanilla), MIT | Üvegszerű anyag, hullámzó/gumiszervű tárgy, tükröző padló, csillagok, fénycsóvák. | React nélkül használható Three.js-segédek. Első jelölt: `MeshTransmissionMaterial`, `MeshDistortMaterial`, `MeshWobbleMaterial`. Nagy integráció: geometriai anyagok, nem sima teljesképes Vel-filterek. A tükröződés és fénykausztika további passzokat igényel. |
| 7 | [three.quarks](https://github.com/Alchemist0823/three.quarks), MIT | Valódi emitter: pont/gömb/kúp/felület; élettartam, méret- és színváltozás, csóvák. | Three.js-függő renderer; van külön, függőségmentesként dokumentált `quarks.core`. Elsőként azt érdemes vizsgálni. Nagy: seed, fix időlépés, visszatekerés és exportadapter kell. Az engine licence nem igazolja automatikusan a külső editor minden effektassetjének licencét. |
| 8 | [PavelDoGreat WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation), [MIT](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/blob/master/LICENSE) | Egérrel festhető áramló tinta, füstös színkeverés, folyadékos torzítás. | Közvetlen WebGL-alap, jó vizsgálati alternatíva a tervben szereplő three-fluid-fx mellé. Nagy: solver átemelése saját órára és FBO-kezelésre, rögzített bemeneti események, determinisztikus újraszimulálás. Nem 3D víztérfogat vagy szabadfelszín-szimuláció. |
| 9 | [Three.js Water](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Water.js), [Three.js MIT](https://github.com/mrdoob/three.js/blob/dev/LICENSE) | Tükröződő, hullámzó vízfelület a 3D terephez. | A Three.js változat külön reflexiós renderelést használ. Közepes–nagy; saját renderútra portolni vagy a Three-útban használni. Nem helyettesíti a folyadékmezőt. A példában használt külső normal-textúra licencét külön ellenőrizni vagy saját/CC0 képre cserélni kell. |
| 10 | [Kenney City Kit – Suburban](https://kenney.nl/assets/city-kit-suburban), CC0 | Szerkeszthető makettváros kész házmodulokból; 40 fájl. | GLB/glTF importút vagy előfeldolgozás, instancing, seedelt elrendezés. Nagy; a modellcsomag önmagában nem városgenerátor. A tervezett Város egyik stílusához jó jelölt. |
| 11 | [Ashima WebGL Noise](https://github.com/ashima/webgl-noise), MIT | Új zajprofilok ködhöz, felszínhez, organikus deformációhoz. | Célzott GLSL-függvények a közös shaderkönyvtárba. Kicsi–közepes; meglévő zajokat csak mérés/látványelőny esetén cseréljünk. Több számolás nem szükségszerűen jobb vagy gyorsabb. |
| 12 | [pmndrs postprocessing](https://github.com/pmndrs/postprocessing), Zlib, eredeti Three.js részek MIT | Új utófeldolgozási lehetőségek és effektpasszok. | A Velnek már van effektlánca; teljes composer beépítése sok átfedést okozna. Csak kiválasztott shader/passz célzott portját javaslom. Közepes–nagy; a mélységet/normált igénylő effektekhez új bemenetek kellenek. |
| 13 | [Rapier](https://github.com/dimforge/rapier), Apache-2.0 | Ütköző, guruló, összeköthető 2D/3D testek. | Későbbi fizikaalternatíva az Oimo mellé, nem eldöntött csere. A JS-kötések a fő repo `typescript` mappájába költöztek. Nagy: WASM-csomagolás, állapotmentés/checkpoint és seek. A Vel teljes környezetének determinisztikusságát külön kell igazolni. |

**Vizuális sorrendi javaslat:** HDRI + PBR alap → részecskeassetek → útvonalas cső/szalag → térbeli szöveg → valódi emitter → folyadék. Ez becsült haszon és az aktuális hiánylista szerinti sorrend; a technikai alapok eltérő erőfeszítést igényelnek.

## 2. Az audit javításaihoz használható ingyenes eszközök

Ezek nem mind WebGL-csomagok, de konkrétan az auditban szereplő munkát segítik.

| Auditpont | Jelölt | Illeszkedés és korlát |
|---|---|---|
| T3, T6: nagy videóexport, CDN-függőség | [Mediabunny](https://github.com/Vanilagy/mediabunny), MPL-2.0; [StreamTarget dokumentáció](https://mediabunny.dev/guide/writing-media-files) | Beépíthető csomag, darabonkénti írás, böngészős médiafeldolgozás. A fájlírásnál a megadott byte-pozíciókat tiszteletben kell tartani; a chunkok vak összefűzése hibás lehet. A támogatott közvetlen fájlírásra épülő út és a fallback külön tervezendő. Közepes–nagy. Nem oldja meg magától a kép/audio assetmentést vagy az exportablak leállítását. |
| U5: színválasztó | [Coloris](https://github.com/mdbassit/Coloris), MIT | Függőségmentes színválasztó, alfa, színminták, sötét téma. Kicsi–közepes; a színhierarchia és a gradiens megállópontjai saját Vel-funkciók maradnak. Az akadálymentességét integrált állapotban is ellenőrizni kell. |
| U2: szabadkézi mozgás simítása | [fit-curve](https://github.com/soswow/fit-curve), [MIT](https://github.com/soswow/fit-curve/blob/master/LICENSE) | Pontsorból köbös Bézier-szakaszokat illeszt. Közepes: nem körfelismerő, nem kezeli magától a gesztus tempóját és az impactot. A geometriai út mellé meg kell őrizni az eredeti időbélyegeket. |
| Vászon: többes kijelölés, igazítás, forgáspont | [Moveable](https://github.com/daybrush/moveable), MIT | Kész 2D kijelölő/mozgató fogantyúk és snapping. Közepes–nagy: DOM/SVG felületre való, a Vel WebGL-rétegeihez proxy és koordinátaadapter kell. Első körben UX-minta, nem a `stage.ts` automatikus cseréje. |
| 3D vászonfogantyúk | [Three.js TransformControls](https://threejs.org/docs/pages/TransformControls.html), MIT | Three.js Object3D-k hely-, forgás- és méretfogantyúi. Csak új Three-renderútnál közvetlen jelölt; a jelenlegi Gerincfelület speciális pontszerkesztését nem váltja ki. |
| Importált modellanimáció | [Three.js AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html), MIT | Betöltött klip explicit időre állítható. A Vel órája vezérelje, ne külön `requestAnimationFrame`. Ez nem oldja meg a jelenetsor saját kamera-/Kapcsolat-mentését. |
| Nagy modellek/textúrák | [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader), MIT | Draco, KTX2 és Meshopt illesztési pontok. A dekóder/WASM és assetfájlok külön csomagolást, verzió- és licencrögzítést igényelnek. Közepes–nagy; a textúra- és bitmap-erőforrásokat explicit fel kell szabadítani. |

Másodlagos színválasztó-jelölt: [iro.js](https://github.com/jaames/iro.js), MPL-2.0. Többszínű kerék és harmóniák miatt érdekes, de a szerző szünetelteti a fejlesztést; első jelöltnek Colorist választanám.

## 3. Az audit minden területének lefedése

- **T1 képek, T2 hangmentés:** saját asset-regiszter és függőségbejárás kell. Új 3D-könyvtár hozzáadása ezt nem javítja. Az új assettípusok előtt szükséges.
- **T3 exportmemória:** Mediabunny érdemi jelölt.
- **T4 megszakítás:** saját exportfeladat-életciklus és közös megszakítás kell; a választott médiakönyvtár cancel műveletét ehhez kell kötni.
- **T5 erőforrások:** saját dispose-szerződés kell minden adapterhez. Three.js sem szabadít fel automatikusan minden GPU-erőforrást; a GLTFLoader dokumentációja az ImageBitmapekre is figyelmeztet.
- **T6 offline működés:** minden futási függőséget helyben kell csomagolni; assetet csak használatkor beágyazni. A külső fontok, dekóderek és zajtextúrák ne maradjanak rejtett hálózati függőségek.
- **T7 history/típusok:** belső adatmodell és mérések kérdése. Új Three-objektumokat nem szabad JSON-projektállapotként menteni; a leíró adat maradjon szerializálható, a GPU-objektum legyen futásidejű cache.
- **Kapcsolatok, módjelzés, loop-hatókör:** Vel-specifikus UX, saját javítás. Kész demók nem helyettesítik a forrás- és célparaméter világos megadását.
- **Szín:** Coloris a választóhoz; Poly Haven/ambientCG a felülethez. A tényleges színforrás és színtér-kezelés továbbra is közös Vel-szabály.
- **Gesztus, kis célpontok, panelek, dialógusok:** Moveable/TransformControls részben adhat mintát vagy komponenseket, de a meglévő felület fókuszkezelése és elrendezése külön munka.
- **Mentési állapot, projektellenőrző:** saját funkció, nincs hozzá indokolt Three.js-függőség.
- **Jelenetsor hűsége:** saját jelenetmodell bővítése; AnimationMixer az importált klipek mintavételét segítheti.
- **U2 mozgásminőség:** fit-curve segíthet; a kör/egyenes/ív felismerése és az időparaméterezés külön feladat.
- **LFO varratmentesség:** saját óra és egész ciklusszám; külső engine nem szükséges.
- **Random-rács:** saját előnézeti és seedrendszer; a kurált CC0 assetekből új receptcsaládok készülhetnek.
- **Videóimport/proxy:** Mediabunny vizsgálható, de az assetmentés és memória-élettartam előfeltétel.
- **3D anyag, fizika, folyadék:** a rangsorolt lista 1–2., 6., 8–9. és 13. elemei közvetlen jelöltek.

## 4. Javasolt első prototípusok és döntési kapuk

1. **HDRI/PBR próba:** egy meglévő 3D tárgy ugyanazzal a kamerával, egy Studio Small 09 környezet, egy szín/normal/roughness anyag. Ellenőrizni: 1080p és 4K költség, színtér, projektmentés, offline újranyitás. Ettől még nem kell Three.js-re áttérni.
2. **Three.js rétegadapter próbája:** egy cső vagy Troika-felirat → Vel kompozitor → ráhúzott Megjelenés → PNG/MP4. Összevetni a külön canvasból textúrázás költségét a közös kontextusos úttal. Utóbbi GL-state/FBO/VAO visszaállítást igényel. Döntés csak mérés után; a kész Three render target nem eleve Vel-textúra.
3. **Emitter próba:** egy emitter, seedelt indulás, egy sprite-atlasz. Azonos jelenetidőre élő lejátszásból és oda-vissza tekerésből is azonos kép kell. A függőségmentes core átültetése és a Three renderer összevetendő.
4. **Export próba:** ugyanaz a 10/60 mp-es jelenet a jelenlegi és a folyamatosan író kimenettel. Mérni: csúcsmemória, fájlhelyesség, hangszinkron, leállítás és újraindítás.

Ezek javaslatok, nem elindított fejlesztések. A CLAUDE.md szerinti szeletjavaslat és felhasználói jóváhagyás a megvalósítás előtt szükséges.

## 5. Beépítéskor rögzítendő minimum

Minden elfogadott tételhez: konkrét verzió/commit és forrás, eredeti licenc/NOTICE, importált asset neve és licence, buildméret-különbség, támogatott renderút, óra/seed viselkedés, mentés–újranyitás és export próba, dispose út. MIT/Zlib/Apache és MPL feltételeit ne mossuk össze; az MPL-es függőségeknél a terjesztett forrás és módosítások elérhetőségét a választott csomagolás szerint kell rendezni.

A Three.js motor MIT licence nem terjed ki automatikusan minden demó külső modelljére, fontjára vagy textúrájára. Ugyanígy egy ingyen megtekinthető CodePen/Shadertoy oldal nem jelent ellenőrzött beépítési engedélyt. Az ismeretlen licencű korábbi mintákat ez a lista nem minősíti át.

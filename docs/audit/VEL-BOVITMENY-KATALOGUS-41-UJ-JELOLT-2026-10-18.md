# Vel – további 41 ingyenes bővítési jelölt

2026-10-18 · Codex · Az előző WebGL/Three.js-forráslista kiegészítése.

## Hogyan olvasd?

41 további jelölt: külső könyvtárak, hivatalos Three.js-modulok és két új assetcsomag. Nem 41 telepített plugin: a Velhez illesztésük még nincs kipróbálva. A hivatalos oldalak/repozitóriumok és az ott jelzett licencek ellenőrizve; a konkrét kiadás teljes függőségi auditja és a futási prototípus hátra van. Nincs beépítés vagy csomagtelepítés.

Útvonaljelölés: **K** = saját renderer mellett is használható számítás/UI/asset; **T** = Three.js-rétegadapter vagy célzott port szükséges; **D** = fejlesztői eszköz. Nehézség: kicsi/közepes/nagy, relatív becslés. A K sem jelent automatikusan kész integrációt.

A Three.js saját forrásának licence [MIT](https://github.com/mrdoob/three.js/blob/dev/LICENSE); a példák külső modelljei, fontjai és textúrái ettől külön ellenőrzendők. A lista Vel-funkciói javasolt felhasználások, nem a könyvtárak által készen szállított Vel-felületek.

## A. Formák, modellezés, tárgyak

| # | Forrás · licenc | Konkrét Vel-funkció | Út, munka és korlát |
|---|---|---|---|
| 1 | [three-bvh-csg](https://github.com/gkjohnson/three-bvh-csg) · MIT | Térbeli formák összeolvasztása, kivonása, metszete: kivájt gömb, perforált tárgy. | T · nagy. A projekt kísérletiként jelöli magát; hibás/nem zárt bemenetek és bonyolult metszések próbája kell. Elsőként statikus, visszavonható művelet. |
| 2 | [three-subdivide](https://github.com/stevinz/three-subdivide) · MIT | „Simább forma” vezérlő importált vagy saját hálón. | T · közepes. Loop subdivision; gyorsan növeli a háromszögszámot. Beállítható felső korlát és előtte/utána összevetés kell. |
| 3 | [DecalGeometry](https://threejs.org/docs/pages/DecalGeometry.html) · MIT | Logó, felirat, matrica felhelyezése 3D tárgyra a vásznon. | T · közepes. Vetített geometria, éles sarkon torzulhat. Nem teljes UV-festő rendszer. |
| 4 | [ExtrudeGeometry](https://threejs.org/docs/pages/ExtrudeGeometry.html) · MIT | Saját sík formából vastag, lekerekített élű 3D embléma. | T · közepes. Előbb tiszta kontúr és lyukkezelés kell; a vastagság/bevel animálása geometriafrissítést jelenthet. |
| 5 | [Flow / CurveModifier](https://threejs.org/docs/pages/Flow.html) · MIT | Feliratot vagy tárgysort görbére hajlítani és végigfuttatni. | T · nagy. A közös útvonalrendszerhez jó jelölt. A WebGL-változatot kell választani, az időt a Vel adja. |
| 6 | [MarchingCubes](https://threejs.org/docs/pages/MarchingCubes.html) · MIT | Összeolvadó térbeli gömbök/metaballok, puha ornament. | T · közepes–nagy. Valódi háló, nem folyadékfizika. A rácsfelbontás és maximális poligonszám korlátozandó. |
| 7 | [MeshSurfaceSampler](https://threejs.org/docs/pages/MeshSurfaceSampler.html) · MIT | Pontok, apró tárgyak vagy részecskék szórása egy modell felületére. | T · közepes. Saját randomgenerátor állítható, így a seed beköthető. Szél és növekedés külön viselkedés. |
| 8 | [SVGLoader](https://threejs.org/docs/pages/SVGLoader.html) · MIT | Saját SVG-logó importálása, rétegezése, később térbelivé alakítása. | T · közepes–nagy. Első körben támogatott statikus SVG-részhalmaz. A parser nem teljes böngészős SVG-renderelő és nem általános animációimport. |

**Elsőként:** SVG → Extrude → Decal együtt valódi embléma- és poszterkészítési munkafolyamatot adhat. A CSG és a metaball későbbi formaeszköz legyen.

## B. Tipográfia, vektor és generatív grafika

| # | Forrás · licenc | Konkrét Vel-funkció | Út, munka és korlát |
|---|---|---|---|
| 9 | [OpenType.js](https://github.com/opentypejs/opentype.js) · MIT | Saját font beolvasása, szöveg kontúrrá alakítása, betűnkénti útvonal és deformáció. | K · közepes–nagy. Az eredeti szöveg maradjon meg szerkeszthető adatként. Fontbeágyazási licenc és összetett írásrendszerek külön ellenőrzendők. |
| 10 | [Paper.js](https://github.com/paperjs/paper.js), [licenc](https://github.com/paperjs/paper.js/blob/develop/LICENSE.txt) · MIT | Bézier-pontszerkesztés, kontúrok és vektorgrafikai műveletek alapja. | K · nagy. A geometriai részt érdemes használni; ne legyen a Vel mellett második teljes dokumentummodell. |
| 11 | [polygon-clipping](https://github.com/mfogel/polygon-clipping) · MIT | 2D alakzatok egyesítése, kivonása, metszete, kivágott betűformák. | K · közepes. Poligonokon működik; görbékhez tűrés szerinti mintavétel és későbbi kontúrkezelés kell. |
| 12 | [Earcut](https://github.com/mapbox/earcut) · ISC | Saját, akár lyukas kontúr WebGL-ben rajzolható háromszögekké alakítása. | K · közepes. Háttérmodul a kitöltött formához és extrudáláshoz, nem látható szerkesztő. Nem garantál minden hibás poligonra helyes eredményt. |
| 13 | [d3-delaunay](https://github.com/d3/d3-delaunay) · ISC | Voronoi-mozaik, sejtes felosztás, geometrikus hátterek és darabokra bontási minták. | K · közepes. 2D felosztás; a törésmozgás és a részek megőrzése külön Vel-funkció. |

**Új receptcsaládok:** kivágott tipográfia, dombornyomott embléma, mozaikos képfeltárás, betűkontúron futó díszítés. A kontúrra alakítás mindig visszavonható és az eredetit megőrző művelet legyen.

## C. Anyag, fény, szín

| # | Forrás · licenc | Konkrét Vel-funkció | Út, munka és korlát |
|---|---|---|---|
| 14 | [Custom Shader Material](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) · MIT | Saját deformáció/shader a 3D alapanyag megvilágításának megtartásával. | T · nagy. A későbbi saját 3D Megjelenések alapja lehet. Nem a mostani teljesképes `fx()`-szerződés közvetlen kiegészítése. |
| 15 | [Reflector](https://threejs.org/docs/pages/Reflector.html) · MIT | Tükröző padló vagy sík tükör tárgy mögött/alatt. | T · közepes–nagy. Extra renderpassz; nem általános tükröződés minden görbült felületen. |
| 16 | [PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html) · MIT | HDRI-környezetből anyagérdességhez illő tükröződés. | T · nagy. A korábban javasolt HDRI/PBR rendszer technikai alkotórésze, nem új assetkatalógus. |
| 17 | [SSAOPass](https://threejs.org/docs/pages/SSAOPass.html) · MIT | Térbeli érintkezések és mélyedések jobb olvashatósága. | T · nagy. Mélység/normál és azonos 3D tér kell; külön 2D rétegek közti fizikai érintkezést nem talál ki. |
| 18 | [LUT3dlLoader](https://threejs.org/docs/pages/LUT3dlLoader.html) · MIT | Saját `.3dl` színprofil betöltésének alapja. | T vagy port · közepes. A loader mellé LUT-alkalmazó passz kell. Maga a csomag nem ad szabadon terjeszthető filmes LUT-gyűjteményt. |
| 19 | [Culori](https://github.com/Evercoder/culori) · MIT | Érzékelésben egyenletesebb gradiens és színátmenet, színtérváltás. | K · közepes. U5-höz erős jelölt; a gamutkezelés és GPU-színút összehangolandó. |
| 20 | [Chroma.js](https://github.com/gka/chroma.js) · BSD | Palettákból színskálák, árnyalatvariációk és palettaeszközök. | K · kicsi–közepes. A Culori alternatívája/részleges átfedése, ne telepítsük automatikusan mindkettőt. Régi, 0.4 előtti kiadások licence eltérő. |

**Elsőként:** Culori az U5-höz, aztán HDRI/PMREM közös anyagcsatlakozóval. SSAO csak mélységet szolgáltató 3D út után.

## D. Kamera, mozgás, részecske, fizika

| # | Forrás · licenc | Konkrét Vel-funkció | Út, munka és korlát |
|---|---|---|---|
| 21 | [camera-controls](https://github.com/yomotsu/camera-controls) · MIT | „Mutasd ezt a tárgyat” kameraráközelítés, sima orbit és nézetváltás. | T · közepes–nagy. `fitToBox` hasznos. Az interaktív csillapítás nem magától exportálható kameraklip; a jóváhagyott mozdulatot a Vel időmodelljébe kell rögzíteni. |
| 22 | [CCDIKSolver](https://threejs.org/docs/pages/CCDIKSolver.html) · MIT | Rigelt kar/láb vagy csápszerű lánc végpontjának húzása. | T · nagy. Csontozott modell és korlátok kellenek; nem alakít tetszőleges képből animált karaktert. |
| 23 | [three-nebula](https://github.com/creativelifeform/three-nebula) · MIT | Sprite- és mesh-részecskék, JSON-ból felépíthető effektek. | T · nagy. A korábbi three.quarks alternatívája. A [kiadásjegyzetben](https://github.com/creativelifeform/three-nebula/releases) seedelés is szerepel; a Vel seek/export egyezését ettől még ellenőrizni kell. |
| 24 | [cannon-es](https://github.com/pmndrs/cannon-es) · MIT | Merevtestes ütközés, súly, összekötések; egyszerű guruló/pattanó tárgyak. | K · nagy. JavaScript-fizikaalternatíva Rapier/Oimo mellett. Egy motort kell kiválasztani mérés alapján; fix lépés és visszatekerés itt is saját adaptermunka. |
| 25 | [GPUComputationRenderer](https://threejs.org/docs/pages/GPUComputationRenderer.html) · MIT | Sok részecske pozíciójának/sebességének GPU-s frissítési alapja. | T vagy port · nagy. Nem kész fizikai/részecskeengine; ping-pong textúrák, seedelt inicializáció és checkpoint szükséges. |
| 26 | [bezier-easing](https://github.com/gre/bezier-easing) · MIT | Húzható Bézier-sebességgörbe számítási alapja. | K · kicsi–közepes. A Vel már számol görbéket: előbb összevetés, csak hiányzó képességhez. Nem útvonalillesztés. |
| 27 | [Tween.js](https://github.com/tweenjs/tween.js), [licenc](https://github.com/tweenjs/tween.js/blob/main/LICENSE) · MIT | Explicit idővel hajtott mozgásminták és új easingek forrása. | K · közepes. Az Anime.js és saját motion-rendszer mellett erős átfedés. Célzott matematika vagy elkülönített adapter, ne harmadik fő idővonal legyen. |

**Következő döntés:** emitterhez Quarks és Nebula egyetlen azonos jelenetes összevetése; fizikához Cannon/Rapier/Oimo közül egy választás. Ezek alternatívák, nem összeadandó pluginok.

## E. Hang és időzítés

| # | Forrás · licenc | Konkrét Vel-funkció | Út, munka és korlát |
|---|---|---|---|
| 28 | [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) · BSD-3-Clause | Nagyítható hanghullám és hangrégiók az időzítéshez. | K · közepes. A megjelenítést/gesztusokat kell a Vel órájához kötni; ne külön lejátszóóra irányítsa a projektet. Nagy hanghoz előszámolt csúcsadat vizsgálandó. |
| 29 | [Meyda](https://github.com/meyda/meyda) · MIT | Többféle hangjellemző mozgásvezérléshez. | K · közepes. A meglévő basszus/kick elemzés mellé célzott kiegészítés. Menthető, előre kiszámított jelgörbékkel az export is reprodukálható lehet. Nem hangszer/stem-szétválasztó. |
| 30 | [Tone.js](https://github.com/Tonejs/Tone.js) · MIT | Metronóm, szintetikus próbaritmus, hangos időzítési segítség. | K · közepes–nagy. A teljes zenei keretrendszer valószínűleg túl nagy igény a jelenlegi feladathoz; csak konkrét zenei funkció esetén indokolt. Nem kell a Vel óráját lecserélni. |

## F. Teljesítmény, import, karbantarthatóság

| # | Forrás · licenc | Konkrét Vel-funkció | Út, munka és korlát |
|---|---|---|---|
| 31 | [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) · MIT | Nagy 3D modellek gyors kijelölése, távolság- és felületvizsgálat. | T · közepes–nagy. Nem gyorsít automatikusan minden shadert vagy a Vel képpontos rétegválasztását. Geometriafrissítés után a BVH állapotát kezelni kell. |
| 32 | [glTF Transform](https://github.com/donmccurdy/glTF-Transform) · MIT | Importált modell tisztítása és optimalizálása a Velhez. | K · közepes–nagy. Elsőként előfeldolgozó eszköz; nem szükséges a teljes SDK-t a futó HTML-be tenni. |
| 33 | [meshoptimizer](https://github.com/zeux/meshoptimizer) · MIT | Hálók egyszerűsítése, hatékonyabb adatelrendezés és tömörítés. | K · közepes–nagy. A JS/WASM részt és feladatot konkrétan ki kell választani. Tömörítés nem jelent automatikusan kisebb GPU-textúramemóriát. |
| 34 | [InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html) · MIT | Sok azonos virág, levél vagy épület kevesebb rajzolási hívással. | T · közepes–nagy. Közös geometria/anyag; per-példány adatok és kijelölés külön tervezendők. Saját WebGL instancing is összevethető. |
| 35 | [BatchedMesh](https://threejs.org/docs/pages/BatchedMesh.html) · MIT | Több különböző, azonos anyagú tárgy közös rajzolási útja. | T · nagy. Főleg sokmodell-jelenetnél hasznos; a rétegenként eltérő képi effektek szétbonthatják a batch-et. |
| 36 | [Spector.js](https://github.com/BabylonJS/Spector.js) · MIT | Képkocka parancsainak és állapotainak vizsgálata hibás effekt vagy lassulás esetén. | D · kicsi–közepes. Fejlesztői környezetben, nem állandó alkotói panelként. A sötét sávos hibához reprodukálható seed után hasznos. |
| 37 | [WebGL Lint](https://github.com/greggman/webgl-lint) · MIT | Hibás uniformok, NaN értékek, framebuffer- és WebGL-használati hibák korábbi felismerése. | D · kicsi–közepes. Diagnosztikai buildbe; a többletterhelés miatt teljesítménymérést nélküle kell végezni. |

## G. Szerkesztési felület és kész assetek

| # | Forrás · licenc | Konkrét Vel-funkció | Út, munka és korlát |
|---|---|---|---|
| 38 | [SortableJS](https://github.com/SortableJS/Sortable) · MIT | Átrendezhető felső eszköztár és saját polcok/listák. | K · közepes. Az U5 testreszabható action barjához jelölt. Az állapot, undo és billentyűzetes alternatíva továbbra is saját munka. |
| 39 | [Split.js / Split Grid](https://github.com/nathancahill/split) · MIT | Állítható panelszélesség és idővonalmagasság. | K · kicsi–közepes. A meglévő elválasztó továbbfejlesztése is lehet olcsóbb. Minimum méretek, mentés és alaphelyzet kell. |
| 40 | [Kenney Foliage Sprites](https://kenney.nl/assets/foliage-sprites) · CC0 | Levelek/növényi elemek a terephez, szélhez, részecskékhez; 50 fájl. | K · kicsi–közepes az assethez. A növényi mozgás/emitter további munka. Kurált atlasz, ne minden fájl kerüljön az alapbuildbe. |
| 41 | [Kenney Smoke Particles](https://kenney.nl/assets/smoke-particles) · CC0 | Füstös/robbanásos sprite-effektek kiinduló képkészlete; 70 fájl. | K · kicsi–közepes az assethez. Nem térfogati füstszimuláció. Átlátszóság, átfedés és háttérszínek próbája kell. |

## Mit érdemes ezekből csomagként megépíteni?

### 1. Saját embléma és térbeli tipográfia
SVGLoader + OpenType.js + ExtrudeGeometry + DecalGeometry. Felhasználói eredmény: behozod a logódat vagy felírsz egy szót, vastagságot és anyagot adsz neki, feliratot helyezel rá. Szükséges alap: font- és vektorasset-mentés, közös 3D renderút.

### 2. Útvonalas ornament és szalag
Paper.js vagy kisebb célzott görbemodul + Flow + a korábbi TubeGeometry/MeshLine. Eredmény: rajzolsz egy útvonalat, azon fut egy szöveg/tárgy/szalag, a tempót a Vel vezérli. Ne egyszerre minden görbekönyvtár épüljön be.

### 3. Szél, levelek, por, füst
Egy kiválasztott emitterengine + Foliage/Smoke atlasz + MeshSurfaceSampler + instancing. Eredmény: terepre szórt növények, áramló levelek és por. A szélerő, a szimuláció és a képalkotás legyen külön vezérelhető; a sprite-füst nem helyettesíti a későbbi fluidot.

### 4. Kényelmesebb napi munka
Culori + Split + Sortable + wavesurfer megjelenítés. Eredmény: jobb gradiensek, állítható panelek, saját eszköztársorrend, jól olvasható hangidőzítés. Ezekhez a Three-adapter nem előfeltétel.

### 5. Nagyobb jelenetek megbízhatóan
glTF Transform + meshoptimizer előfeldolgozás, rendereroldalon BVH és megfelelő batch/instancing, fejlesztéskor Spector/Lint. Eredmény: kevesebb felesleges modelladat és jobban diagnosztizálható terhelés. Ez nem ígéret 4K valós idejű teljesítményre: mérés kell.

## Külön jelöltek, amelyeket most nem tennék az ingyenes WebGL-rövidlistára

- [LYGIA](https://github.com/patriciogonzalezvivo/lygia): széles shaderkönyvtár, de aktuális Prosperity/Patron kettős licenc; a kereskedelmi felhasználás nem kezelhető automatikusan korlátozásmentes ingyenes beépítésként.
- [Lamina](https://github.com/pmndrs/lamina): MIT, de archivált projekt. Anyagréteg-UX mintának hasznos, új alapfüggőségnek gyengébb választás.
- [three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer): MIT, viszont a jelenleg dokumentált út WebGPU-t igényel. Későbbi külön renderkísérlet lehet, nem a Vel WebGL2 útjára közvetlenül rátehető bővítés.
- OGL/regl: ingyenes WebGL-keretrendszerek, de a Vel meglévő rendererét megkettőznék. Egy-egy konkrét algoritmus lehet érdekes; pusztán a darabszám növeléséért nem javasolt új motort hozzáadni.

## Beépítési sorrend

**Kisebb, jól körülhatárolható előrelépések:** Culori; panelállítás; eszköztár-átrendezés; füst/levél assetpolc; fejlesztői WebGL-diagnosztika.

**Nagy alkotói nyereség, közös alapra építve:** SVG/font/3D embléma; görbére hajlítás; kamera-célzás; felületre szórás.

**Önálló nagy szelet:** emitter, merevtest-fizika, metaball, GPU-s részecskeszámítás.

A mentési audit hibái és az export memória-/leállításkezelése továbbra is alapfeladatok. Új funkció csak a saját assetjeinek mentésével, visszavonással, Vel-órához kötött működéssel és exportpróbával együtt értékelhető. A katalógus nem indít fejlesztési mérföldkövet.

# Addon-integrációs térkép — 63 modul + 2 layout

Állapotfelvétel: 2026-10-18. Ez **integrációs terv**, nem kész funkciólista és nem automatikus jóváhagyás az összes függőség beépítésére. A csomag átadója és pontos licencei: `prototypes/extension-lab/CLAUDE-HANDOFF.md`, `CATALOG.md`, `THIRD-PARTY.md`. A modulútvonalak a labor gyökeréhez képest értendők.

## 1. Mit bizonyít a jelenlegi labor?

- 63 modulhoz külön példa, 45 Node-teszt, sikeres build, 63 betöltési/alaprender-próba és 4 célzott böngészős ellenőrzés tartozik. A 67 ellenőrzés **nem 67 termékfunkcióteszt**.
- Célzottan igazolt: fluid visszatekerési képegyezés, helyi képatlasz beágyazhatósága, kis videó export/visszaolvasás, exportmegszakítás. A 64×64-es rövid MP4 nem igazol hosszú 4K-exportot.
- Layoutok: 48 Node-teszt és 7 külön böngészős próba; az Unwoven visszatekerése az adapteren belül pixelazonos. Az eredeti demóval teljes pixelazonosságot nem vizsgáltunk.
- Egyik laboradapter sem kész Vel-integráció: inspector, undo, migráció, projektbeágyazás, rétegkompozitálás, meglévő alkalmazás regressziói és hardveres teljesítmény nincs általánosan igazolva.
- A labor saját Three.js-hostot használ. Three `Texture`/`RenderTarget` nem adható át közvetlenül a Vel saját WebGL2-kompozitorának.

## 2. Közös munkacsomag-családok és kapuk

Az alábbi azonosítók **családok**, nem önmagukban kiosztható nagy feladatok. Az orchestrator egy családból legfeljebb egy szűk, elfogadási próbával lezárható szeletet osszon ki. A közös szerződés tulajdonosa a fő agent; a segéd agent ettől független tiszta algoritmust, fixture-t, presetet vagy célzott tesztet készíthet.

A teljes átadó konkrét workpackage-azonosítóihoz a megfeleltetés: `BASE` → `BASE-01` (asset) + `BASE-02` (render/capability); `VECTOR` → `PATH-01`; `MESH` → `BASE-02` és az adott `WORLD-01`/`MEDIA-01`; `LOOK` → `COLOR-01`/`MAT-01`; `MOTION` → `MOT-01`; `PARTICLE` → `PART-01`, a #50 külön `FLUID-01`; `PHYSICS` → `PHYS-01`; `MEDIA`/`AUDIO` → `MEDIA-01`; `UI` → `UI-01`/`UX-01`; `LAYOUT` → `LAYOUT-01`; `EXPORT`/`PERF` → `EXPORT-01`/`PERF-01`; `DEV` → `QA-01`/`STAB-01`. Az elemkönyvtári felület `CAT-01`, a belőlük összeállított kompozíciók `RECIPE-01` munkája. A táblázat családnevei nem vezetnek be második ütemtervet.

| Család | Közös előfeltétel / határ | Első használható eredmény |
|---|---|---|
| `BASE` | Verziózott JSON, assetreferencia, determinisztikus mintavétel és lifecycle; meglévő rendszerek bővítése | Egy adapter mentés–újranyitás–seek–dispose szerződése |
| `VECTOR` | Közös görbe/kontúr leírás, mértékegység, lyukak és fontasset | SVG → szerkeszthető forma vagy extrudált kontúr |
| `MESH` | Egy választott 3D renderút, meshadat és kamera/koordinátaszerződés | Egy natív meshmodifikátor vagy egy körülhatárolt Three-réteg |
| `LOOK` | Színtér, alpha, világítás, effektbemenetek és költségjelzés | Egy anyag vagy LUT a meglévő Megjelenés-útban |
| `MOTION` | Meglévő `motion.ts`, `evaluation.ts`, `gesture.ts` szerződése | Egy ráhúzható mozgás, saját óra nélkül |
| `PARTICLE` | Seed, emitter JSON, fix lépés/reset, atlasz és kapacitás | Egy részecskeforrás, több előre mentett változattal |
| `PHYSICS` | Egyetlen motor kiválasztása, collision és cache/invalidation | Gravitáció + talaj + visszatekerés néhány testen |
| `MEDIA` | Beágyazott/kezelt asset, metaadat, limit, tulajdonos és felszabadítás | Kép/atlasz/modell újranyitható projektben |
| `AUDIO` | Meglévő `signals.ts`, közös scene-time és előelemzett adatok | Egy hangjellemző → meglévő paraméter-Kapcsolat |
| `UI` | Meglévő kompakt workspace és gesztusok, egy undo/gesztus | Egy javított vezérlő, új állandó panel nélkül |
| `LAYOUT` | Képi és szöveges slotok, szerkeszthető csoport, exportálható render | Egy layoutrecept saját képekkel |
| `EXPORT` | Meglévő `output.ts`, frameAt, backpressure, abort | Memóriában korlátozott videóexport |
| `PERF` | Költségmérés, jelenetkészlet, vizuális eltérés határa | Egy indokolt optimalizálás méréssel |
| `DEV` | Csak fejlesztői build/teszteszköz | Célzott GL-profil, termékpolc nélkül |

## 3. A 63 modul konkrét beemelési térképe

Besorolás: **pure** = renderertől független adat/algoritmus; **native-port** = a Vel saját render-/effektútjára célzott port; **Three bridge** = közös Three-hostot igénylő jelölt; **UI** = felületi adapter; **asset-only** = tartalombehozatal, nem új engine; **internal** = infrastruktúra/fejlesztőeszköz. A jelölés javasolt célirány, nem azt állítja, hogy a jelenlegi modul már így működik. A `native-port` nem teljes külső könyvtár átírását jelenti.

| ID / modul | Mire használható a Velben? | Család / irány | Hiányzó előfeltétel | Következő konkrét lépés |
|---|---|---|---|---|
| 01 `csg` | Kivágás, egyesítés, metszet 3D formákon | MESH / Three bridge | Szerkeszthető mesh + művelettörténet | Két primitív → egy eredmény; csak geometriaszámításhoz is vizsgáld a Three-t, ne vezess be renderert pusztán ezért |
| 02 `subdivide` | Simább geometria | MESH / pure | Általános meshadat, csúcs-/memórialimit | Geometria-be/ki adapter és normal/UV-próba, mentett iterációszámmal |
| 03 `decal` | Matrica vagy felirat 3D felületen | MESH+MEDIA / Three bridge | UV/kamera/picking, tartós kép | Egy célmeshre mentett vetítő-transzformáció; újranyitás és áttetsző szél próba |
| 04 `extrude` | SVG/betű/síkforma térbelivé | VECTOR+MESH / pure | Kontúr és lyukak, UV/normál | Kontúr JSON → mesh buffer; mélység és élletörés két fő vezérlőként |
| 05 `curve-flow` | Szöveg/forma görbére hajlítása | MESH+MOTION / native-port | Közös görbe és deformációs határ | Statikus görbére hajlás előbb; utána időből számolt haladás, kötött hálófelbontással |
| 06 `metaballs` | Összeolvadó gömbök, szerves forrás | MESH / native-port | Meglévő SDF-képesség összevetése | Döntsd el, elég-e az `sdfscene`; csak valódi meshigényhez marching-cubes út |
| 07 `surface-scatter` | Növény, csillag, tárgy szórása felületre | MESH+PARTICLE / pure | Seedelt mintavétel, instance-séma | Pozíció/normál lista JSON-paraméterből; megosztott geometria és maximum példányszám |
| 08 `svg-import` | Saját vektoros formák | VECTOR+MEDIA / pure | SVG támogatási határ, külső hivatkozások kezelése | Kontúr-only importelőnézet; unsupported elemek felsorolása, lyukas fixture |
| 09 `font-outlines` | Betűkontúr, extrudált felirat | VECTOR+MEDIA / pure | Fontasset és shaping/ékezet/ligatúra döntés | Magyar ékezetes szövegkontúr teszt; a V/E/L demófont nem teljes fontmegoldás |
| 10 `vector-paths` | Szabadkézi kontúr simítása | VECTOR / pure | Közös görbeforma | Hasonlítsd össze #58-cal; csak a szükséges simítást emeld, ne teljes Paper UI-t |
| 11 `polygon-boolean` | Sík kivágás/összevonás | VECTOR / pure | Poligonkoordináták és lyukak | Két kontúr unió/különbség + undo; hibás önmetszések látható kezelése |
| 12 `triangulate` | Lyukas kontúrok kitöltése | VECTOR / internal | Egységes kontúr-bemenet | #08/#04 alatti segédként beemelni; ne legyen külön könyvtári csempe |
| 13 `voronoi` | Mozaik, sejtháló, törési maszk | VECTOR / pure | Seed és cella-reprezentáció | Egy seedelt forrás; cellaszám/szórás két fő vezérlő, később effektmaszk |
| 14 `custom-material` | Egyedi térbeli felület | LOOK / native-port | Egységes 3D anyagséma | Egy célzott shaderanyag; a Three-specifikus shaderpatch ne váljon általános Vel plugin API-vá |
| 15 `planar-reflection` | Sík tükör, talajreflexió | LOOK+MESH / Three bridge | Közös jelenetmélység/kamera, extra renderpass | Előbb egy sík egy tárggyal, felbontáskorlát és önvisszatükrözési kizárás |
| 16 `environment-map` | HDR környezeti világítás | LOOK+MEDIA / Three bridge | HDR asset, színtér, PBR-határ | #42-vel közös import; egy környezet több anyagnak, nem példányonkénti PMREM |
| 17 `contact-shading` | Térbeli mélyedés-/kontaktárnyék | LOOK / native-port | Normál/mélység input, rétegközi hatókör | Rögzítsd AO vagy valódi kontaktárnyék a cél; egy natív pass méréssel |
| 18 `lut-import` | Filmes színprofil | LOOK+MEDIA / native-port | LUT asset, színtér és szűrés | `.cube` támogatási határ → natív LUT textúra; identity + mintaszín teszt |
| 19 `perceptual-gradient` | Szebb átmenetek | LOOK+UI / pure | Közös gradiensmodell és U5 színszabály | Egy közös színinterpolátor; régi gradiensek látványát migráció nélkül ne módosítsd |
| 20 `palette-scales` | Palettavariáns, olvasható kontraszt | LOOK+UI / pure | Paletta/saját szín/Kapcsolat precedencia | #19-cel válassz minimális közös színmagot; kontrasztjelzés segítség, ne tiltás |
| 21 `camera-framing` | Tárgyra komponálás, körbejárás | MESH+MOTION / native-port | Kamera saját réteg/jelenet viszonya | `sampleShot` tiszta számítását illeszd `render.ts` kamerájához; damping csak interakciós előnézetben |
| 22 `ik-chain` | Csáp, lánc, követő elemek | MESH+MOTION / Three bridge | Rig/chain JSON, célpont-Kapcsolat | Két-három szegmenses teszt; fix iterációjú megoldás explicit időn |
| 23 `nebula-particles` | Emitter-alapú részecskeforrás | PARTICLE / Three bridge | Engineválasztás #49/#25 mellett | Ugyanazt a 3 jelenetet mérd #49-cel; csak a nyertes kap termékintegrációt |
| 24 `rigid-bodies` | Leesés, pattanás, ütközés | PHYSICS / pure | Motorválasztás #55/Oimo mellett, reset/cache | Azonos testjelenet, hidegindítás/visszatekerés/méretmérés; motornevet ne mutass a felületen |
| 25 `gpu-particle-state` | Nagy részecskeszám | PARTICLE / native-port | Float támogatás, ping-pong/reset, kapacitás | Meglévő `partfx.ts` mellé 1 GPU-állapotteszt; ne harmadik emitterengine legyen |
| 26 `bezier-easing` | Finom sebességgörbe | MOTION / pure | Meglévő `evaluation.ts` ease összevetés | Csak hiányzó pontosságot/API-t emelj; ne legyen párhuzamos görberendszer |
| 27 `tween-sampling` | Időből értékelt szakaszos animáció | MOTION / pure | Meglévő `motion.ts`/Anime.js határ | Egy lépcsőzetes érkezés mintája; új tweenengine helyett meglévő óra és evaluator elsőbbsége |
| 28 `waveform` | Hang hullámképe a Sávokon | AUDIO+UI / UI | Audioasset, peak-cache, timeline koordináták | Előbb `peakEnvelope` + natív sávrajzolás; teljes Wavesurfer lejátszót csak indokolt hiányra |
| 29 `audio-features` | Hangra méret/szín/mozgáserő | AUDIO / pure | Tartós előelemzés, `signals.ts` kapcsolat | Egy offline RMS/spektrumjel azonos live/seek/export értékekkel |
| 30 `metronome` | Hallható tempósegéd | AUDIO / UI | AudioContext-életciklus, közös óra | Meglévő Koppintás/Tempó mellé opt-in hang; Tone csak ha a natív rövid hang nem elég |
| 31 `bvh-picking` | Sűrű mesh gyors találata | PERF+MESH / internal | Valódi lassulásmérés, meshverzió | Meglévő pixelpontos `pick.ts` marad; BVH csak meshfogantyúhoz/célzott gyorsításhoz |
| 32 `gltf-optimize` | Kisebb importált GLB | MEDIA+PERF / internal | #62, anyag/animáció megőrzési határ | Import utáni opcionális optimalizálás; animáció/skinning/anyag roundtrip |
| 33 `mesh-simplify` | Kevesebb háromszög | MESH+PERF / pure | Meshadat és elfogadott vizuális veszteség | Előtte/utána próba; explicit optimalizáló művelet, eredeti visszaállítható |
| 34 `instanced-copies` | Sok azonos tárgy | MESH+PERF / native-port | Instanceadat, pick/undo azonosítók | Natív instancing vizsgálata #07/#52-höz; ne önálló látványelem legyen |
| 35 `batched-objects` | Eltérő kis tárgyak közös rajzolása | MESH+PERF / internal | Renderút és drawcall profil | Csak #34-től eltérő mért bottleneckre; ne két batchrendszer egyszerre |
| 36 `frame-debugger` | GPU-rajzolások elemzése | DEV / internal | Külön fejlesztői kapcsoló | Dev-only dinamikus betöltés; termékbuild és könyvtár nélkül |
| 37 `webgl-lint` | GL hibák gyors észlelése | DEV / internal | Fejlesztői GL-indítási pont | Célzott teszt/debug buildben bekapcsolni, méréskor kikapcsolni |
| 38 `sortable-toolbar` | Saját gyorseszköztár | UI / UI | Stabil action ID, billentyűs rendezés, prefstore | U5-be olvasztani; rendezési mód külön, normál kattintást ne rontsa |
| 39 `split-panels` | Könyvtár/rétegek méretállítása | UI / UI | Meglévő `workspace.ts` splitter összevetés | Hiányzó minméret/reset/billentyűs kezelés; ne cseréld pusztán könyvtárkedvéért |
| 40 `foliage-assets` | Levél-/növényváltozatok | MEDIA+PARTICLE / asset-only | Atlaszasset és emitter/instance host | #41/#44-gyel egy intake; saját vagy ellenőrzött CC0 csomag, pár kurált preset |
| 41 `smoke-assets` | Füst/tűz sprite-képsor | MEDIA+PARTICLE / asset-only | Atlasz, alpha, age→frame | Egy emitterből Füst-változat; képkockasorrend és export próba |
| 42 `polyhaven-intake` | HDR és anyaghoz képek | MEDIA+LOOK / asset-only | PH1 meglévő 2D út; HDR/PBR még hiányzik | A már létező 12 képes katalógust bővítsd, ne második Poly Haven-importot készíts |
| 43 `ambient-pbr` | Textúrázott térbeli anyagok | MEDIA+LOOK / asset-only | PBR mapséma és natív/Three anyaghatár | Albedo/normal/roughness/metallic színtér és hiányzó map default; #16-tal együtt |
| 44 `particle-atlas` | Szikra, por, konfetti | MEDIA+PARTICLE / asset-only | Közös #40/#41 intake és emitter | Egy atlasz, több mentett változat; variáció ne új engine legyen |
| 45 `curved-text` | Élő felirat hengeren | MESH+MEDIA / Three bridge | Fontasset, szövegszerkesztés és export | Egy szerkeszthető ékezetes cím, betűcsere és újranyitás; #09/#05 átfedést tisztázni |
| 46 `path-tube` | Cső, indaszerű forma | VECTOR+MESH / pure | Közös görbe, mesh buffer | Görbe → körkeresztmetszet; végzárás/radius/UV próba |
| 47 `tapered-line` | Változó vastagságú térbeli vonal | VECTOR+MESH / native-port | Szélesség pixel/világ értelme, kamera | Egy natív ribbon/line út; zoom és exportméret mellett helyes vastagság |
| 48 `glass-material` | Térbeli üveg | LOOK+MESH / Three bridge | Jelenetbemenet/refraction, színtér és mélység | Liquid Glass képeffektől külön anyagtípus; egy tárgy HDR háttérrel és alpha-próba |
| 49 `quarks-emitter` | Összetett sprite/mesh emitter | PARTICLE / Three bridge | #23-mal közös engineválasztás | Seed/reset/export/replay, atlasz és teljesítmény összehasonlító spike |
| 50 `fluid-field` | Áramló festék, később mező | PARTICLE / native-port | Fix lépés, eseménylista, checkpoint, memória | Saját solver GLSL célzott port; előbb látványforrás, mezőként kapcsolat csak külön szelet |
| 51 `water-surface` | Tükröződő víz | LOOK+MESH / Three bridge | Tükörpass, normálasset, kamera, lifecycle | #15-tel közös reflexiós szolgáltatás; a Terep jelenlegi vizét ne cseréld automatikusan |
| 52 `seeded-city` | Véletleníthető városrecept | MESH+MEDIA / native-port | Seed, instancehost, saját/CC0 épületek | `layout` adatmag átvehető; a mostani helyettesítő dobozokból ne állíts kész Kenney-várost |
| 53 `procedural-noise` | Domborzat, lebegés, anyagvariáció | LOOK+MOTION / native-port | Közös GLSL névtér, seed/scale/idő | Közös zajsegéd egy konkrét felhasználással; már meglévő zajokat ne cserélj látványtöréssel |
| 54 `postprocessing` | Glow, AO és filmes utóhatások | LOOK / native-port | Meglévő effektlánc, mélység/színtér | Hatásonként hiányvizsgálat; második teljes compositor helyett célzott pass |
| 55 `rapier-physics` | Stabil merevtest-szimuláció | PHYSICS / pure | #24/Oimo összevetés, WASM offline build | Azonos benchmark + WASM beágyazás/memória; csak kiválasztás után engineadapter |
| 56 `streaming-export` | Hosszabb, kisebb memóriaigényű MP4 | EXPORT / internal | `output.ts`, abort/backpressure, codec támogatás | Hosszú export memória-plafon teszt, megszakítás és fájllezárás; MPL feltételeket ellenőrizni |
| 57 `color-picker` | Kompakt színválasztó | UI / UI | U5, gradiensstop és undo, #63 választás | #63-mal rövid UX-prototípus; egy picker marad, meglévő paletta/eyedropper megtartásával |
| 58 `fit-motion-path` | Húzott mozdulatból sima pálya | MOTION+VECTOR / pure | `perform.ts`/`gesture.ts` egységes görbe | Meglévő Eljátszás mintapontokra illesztés; hibahatár és formafelismerés célzott próba |
| 59 `dom-transform` | DOM layout szerkesztőfogantyú | UI+LAYOUT / UI | Exportálható layoutmodell, vászonkoordináták | Csak DOM-szerkesztési spike; a Vel vászon gizmóját ne váltsa le |
| 60 `transform-gizmo` | Térbeli mozgatás/forgatás | UI+MESH / UI | Közös kamera és undo/animálás mód | Meglévő `spinegrips.ts`/gesztusok összevetése; csak Three-rétegen adapterezni |
| 61 `model-animation` | Modellbe mentett mozgás | MEDIA+MOTION / Three bridge | #62, klip JSON, mixer reset és explicit idő | Egy klip sebesség/loop/kezdőidő; 2→0→2 seek és mentés/újranyitás |
| 62 `gltf-import` | Saját térbeli modell | MEDIA+MESH / Three bridge | Beágyazott asset, decoderhatár, renderút | Korlátozott helyi GLB-import: támogatott anyag/skinning kimondva, erőforráskorlát és hibaelőnézet |
| 63 `color-wheel` | Kreatív színkerék | UI / UI | #57-tel egy választás, alpha/gradient és undo | Ugyanazon feladaton összevetni #57-tel; MPL feltételek és bundleméret is döntési szempont |

## 4. Két layout — külön státusz és út

| ID | Mi van ténylegesen? | Család / irány | Hiányzó előfeltétel | Következő konkrét lépés |
|---|---|---|---|---|
| L-U `Unwoven` | Eredeti MIT shader és szalaggeometria; 14 numerikus vezérlő, képcsere, menthető eltolás, explicit seek. Nincs eredeti lendületes elengedés. | LAYOUT+MESH / native-port első vizsgálat, Three bridge alternatíva | Tartós képasset, réteg-/textúraút, szerkeszthető képslotok. A snapshot hat fotójának külön képlicence nincs tisztázva. | Saját képekkel egy exportálható képszalag; őrizd az eredeti shader karakterét. A shader/attribútumok célzott portját mérd a közös bridge mellett. Külön későbbi feladat: általános ráhúzható szétbomlás. |
| L-W `WIDE study` | Saját DOM/CSS tanulmány öt képelrendezéssel; szerkeszthető szöveg/kép, időből számolt belépés. **Nem eredeti WIDE-port, vizuális minősége nem igazolt az eredetihez.** | LAYOUT / native-port a Vel csoport/réteg/recipe modelljére | Eredeti CodePen ZIP hiányzik; hosszú szöveg automatikus tördelése, saját képek, exportálható slotmodell | Döntsd el: saját magazinrecept továbbfejlesztése, vagy a tényleges WIDE-port az eredeti forrás megszerzése után. A DOM előnézetet ne nevezd videóexport-késznek. |

Unwoven adapterhatár: `createUnwoven(host, options, images?)` → `seek/setOptions/setImages/serialize/dispose/resize`. WIDE: `createWide(...)` → azonos fő műveletek `resize` nélkül. A mostani JSON csak beállításokat tárol; a fájlválasztós objektum-URL-ek nem tartósak. Ezt integráció előtt javítani kell. GSAP nincs a layoutadapterben, és **ne is kerüljön a Velbe**; az eredeti időfüggvény analitikus mintavétele megtartható.

## 5. Döntési mátrix: natív út vagy Three-host?

| Eset | Alapértelmezett választás | Mikor indokolt eltérni? | Bizonyíték a döntéshez |
|---|---|---|---|
| Számítás, görbe, seed, kontúr, szín | Pure adatmag, meglévő render használata | Külső algoritmushoz Three geometria kell: csak számítási adapter | Bemenet/kimenet fixture, bundlekülönbség, worker lehetőség |
| Képi GLSL-effekt, zaj, LUT, egyszerű deformáció | Célzott natív port | Túl sok Three belső shader-/scene-függőség | Azonos mintajelenet, alpha/színtér/seek és passköltség |
| GLB, skinned modell, Troika, komplex PBR | Körülhatárolt közös Three-host jelölt | Natív megoldás már létezik és lényegesen kisebb integráció | Importált modell, kamera, kompozitálás, minőség, memória és offline build |
| Reflexió/transmission/AO | Előbb renderadatok és hatókör tisztázása | Bridge saját belső jelenetén belül teljes értékű lehet | A Vel más rétegei látszanak-e a tükörben/törésben? Ezt előre közölni kell |
| DOM layout | Vel szöveg/kép/csoport recipe | DOM csak szerkesztősegédként | Végső PNG/MP4 ugyanazt mutatja-e? Font és sortörés újranyitás után |
| UI komponens | Meglévő rendszer javítása, kis adapter | Külső komponens megold konkrét hiányt kisebb költséggel | Billentyűzet, fókusz, drag, touch, egy undo/gesztus, clutter |

**Bridge-kapu:** előbb egyetlen kicsi kísérlet, ne minden addonhoz külön vászon/renderer. Döntendő: közös GL-context vagy külön offscreen canvas kompozitálása. Közös context esetén GL-state, target, viewport, texture unit és shaderállapot helyreállítása szükséges; külön context esetén képátadás, alpha, színtér, 4K-költség és contextlimit mérendő. A GPU-objektumok nem megoszthatók tetszőlegesen két context között. A laborhost egyik stratégiát sem igazolja a Velhez.

Nincs előre eldöntött teljes Three-migráció. A principal agent készítsen rövid döntésjegyzetet: vizuális nyereség, új támogatható elemek, offline HTML-méret, 4K-frameidő, memória, lifecycle, rétegek közti mélység/fény korlátja. A segéd agent közben a tiszta adatmagokon dolgozhat.

## 6. Kötelező integrációs szerződések

1. **Állapot és mentés:** serializálható, verziózott paraméterleírás; runtime mesh/material/world/AudioNode/worker soha nem projektadat. Migráció régi projektből; inspector megnyitása nem írhat defaultot vagy hamis helyi változatot.
2. **Média:** stabil asset ID, típus/méret/metaadat/provenance; a projektcsomag vagy a meglevő tartós tár tulajdonolja. Objektum-URL csak átmeneti; újranyitáskor elérhető byte-ok kellenek. Kép/HDR/LUT/font/model/atlasz ugyanazt az ownership modellt használja. A meglévő `usedAssets`/`usedVectorAssets`/autosave utat bővítsd célzottan.
3. **Idő:** `evaluate(t)` vagy `seek(t)`, scene-time az egyetlen exportigazság. Fizika/folyadék/emitter: fix lépés, seed, reset, előremelegítés és checkpoint érvényesítési kulcs (paraméter + asset + verzió). A checkpoint nem lehet a projekt kötelező tartalma; a kezdeti állapotból reprodukálható legyen.
4. **Determináltság:** seed és felhasználói eseménylista menthető; exportkor ne aktuális egérállapot vagy `Math.random()` döntsön. Backward seek után `t` képe azonos ugyanazon környezetben; eltérő GPU-k byteazonosságát ne ígérd mérés nélkül.
5. **Erőforrás-életciklus:** create/update/resize/seek/dispose; ugyanazon adatból ne keletkezzen texture minden frame-ben. Assetcsere, rétegtörlés, projektcsere és megszakított aszinkron import felszabadít. Cache referenciák/tulajdonosok világosak; context-loss helyreállítási határ megnevezve.
6. **UX:** egy fő értelmezhető gesztus, 2–4 elsődleges vezérlő, haladó beállítás kinyitható; a motor/dependency neve nem termékfogalom. Seed-újradobás és változatmentés gyors legyen. Minden eltérés eldobható előnézetből egy elfogadással/egy undo-val kerüljön a jelenetbe.
7. **Minőség:** saját jó minőségű alapváltozatok, a preset megjelenése ellenőrzött képpel; több kontroll ne gyengítse a gyári látványt. Animált előnézet csak látható/aktív kártyára. Export és szerkesztő közti eltérés feladat, nem dokumentációval elfedhető korlát.
8. **Célzott elfogadás:** hozzáadás → módosítás → undo/redo → mentés/újranyitás → visszatekerés → rövid export → törlés. Nem minden szelethez új teljes harness; meglévő tesztinfrastruktúrát bővítsd. Hardveres nagyfelbontású próba külön státusz, headless eredménnyel nem helyettesíthető.

## 7. Választások, amelyekkel munkát és tokeneket spórolunk

- **Cannon (#24) / Rapier (#55) / korábban felmerült Oimo:** egy közös physics-szerződés, egy összehasonlító spike, egy nyertes motor. A többi megmarad referencia, nem három termékfeature.
- **Nebula (#23) / Quarks (#49) / natív GPU (#25):** #23/#49 enginealternatívák; #25 egy lehetséges backend, nem kötelező harmadik rendszer. Meglévő `particles` és `pdisp` nem ugyanaz: az egyik forrás, a másik megjelenés. Előbb hatáskört dönteni.
- **Coloris (#57) / iro (#63):** egyetlen közös színválasztó-út. A gradient és paletta színszámításához (#19/#20) is csak indokolt átfedésű csomag maradjon.
- **Tween (#27) / Anime.js / meglévő evaluator:** a Velben már van tiszta időből számolt Mozgás. Nem kell új animációs engine minden presethez. GSAP kizárt a jelenlegi projektelőírás alapján.
- **Paper (#10) / fit-curve (#58):** közös görbeadat; Paper csak a ténylegesen hiányzó vektorművelethez. A pályasimítás ne legyen külön termékrendszer.
- **#15/#51 és #16/#42/#43/#48:** közös reflexiós, környezeti és anyagimport-alap. Ne minden termékfeature készítsen saját renderpass-kezelőt vagy HDR-feldolgozót.
- **#38/#39/#57/#63:** meglévő U5/workspace munka része. A mai splitter, gesztusok és színforrás-hierarchia felmérése megelőzi a könyvtárcserét.
- **#36/#37:** fejlesztőeszköz, nem új elem és nem felhasználói kategória. **#12/#31–35/#56:** jórészt infrastruktúra; nem kell mindből preset/csempe.

## 8. Kódtérkép a következő agentnek — csak célzottan olvasd

| Munka | Meglévő belépési pont |
|---|---|
| Új forrás/Megjelenés | `app/src/effects/*.ts`, `cost.ts`, `library.ts`, `render.ts` |
| Mozgás és gesztus | `motion.ts`, `moui.ts`, `gesture.ts`, `evaluation.ts`, `perform.ts`, `retime.ts` |
| Óra és stateful seek | `time.ts`, `sim.ts`, `transport.ts` |
| Saját média, projekt és undo | `state.ts`, `text.ts`, `history.ts`, `autosave.ts`, `lottie.ts`/`lottieCore.ts` mintaként |
| 3D, terep, részecske | `mesh3d.ts`, `terrain3d.ts`, `partfx.ts`, `cloud.ts`, `render.ts` |
| Könyvtár és UI | `library.ts`, `shelf.ts`, `presets.ts`, `userlib.ts`, `workspace.ts`, `inspector.ts` |
| Hang, export | `signals.ts`, `output.ts`, `sim.ts` |

Ne olvasd újra a teljes 63-as labort minden szelethez. Először ez a sor + a családszerződés, utána a választott `modules/NN-*.mjs`, annak `examples/NN-*.mjs` párja és a célzott próba. A lockfájlt/licencet csak a kiválasztott függőséghez vizsgáld, a teljes labor `package.json`-ját ne másold az appba.

Az itt javasolt műszaki irányok módosíthatók, ha jobb megoldás látható: az agent rögzítse röviden a döntést és annak következményét. A felhasználói eredmény, kreatív kontroll, vizuális minőség, alacsony felületi zaj és tiszta mentés/időkezelés a rögzített cél; a konkrét külső könyvtár nem.

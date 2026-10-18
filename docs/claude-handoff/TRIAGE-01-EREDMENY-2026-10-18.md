# TRIAGE-01 eredmény (2026-10-18)

Alap: master `ac05685` (0.43.0-merge), mind a párhuzamos ág beolvasztva, teljes tesztkör 51/51 zöld.
Csak dokumentáció; nem implementációs engedély. Státusz: **T** tervezett · **R** részben · **D** demonstrálva (headless) · **K** felhasználóval kipróbálva.
Felhasználói élő próba a mai szeletek egyikén sincs még (minden D, nem K).

## 1. Csomag-feladatkártyák vs. valós kód

| Kártya | Valós állapot | Ami már megvan (szelet) | Ami hiányzik |
|---|---|---|---|
| TRIAGE-01 | **kész** | ez a fájl | – |
| MOT-01 | D | G1 Gesztus, LP1 Körbeér, XF1 Átadás, KO1 Koreográfia, Mozgás v1/v1.1, Időzítés gyorsan | Mozgás árnyéka, „Itt legyen ekkor”, Átadás 2. rész |
| MAT-01 | D | MAT1 anyag-interfész (obj3d/sdfscene/Gerinc), Rajzolt toll, Hologram; FÉNY2 több fény | anyag a 3D Terepen, Felhőn, T6 szövegen; anyagkatalógus |
| FLUID-01 | D (2D) | F1 Áramló tinta + Folyadékos torzítás/feltárás | határ/üreg, testreakció, költségjelzés |
| PHYS-01 | D (2D) | F2 Fizikai test mozgásként | közös tér, mezők, kontaktus→jel |
| PART-01 | D | E1 Részecske Forrás (emitter, szél, örvény) | ütközés testekkel, 3D részecske |
| PATH-01 | R | P2 közös útvonal első szelet | forma-boole, üreg, 3D útvonal, maszk |
| TEXT-01 | R | T6 Szöveg 3D (henger/gömb/kihúzott/útvonal) | szöveg test belső felületén, gazdag tipográfia (8. sor) |
| MEDIA-01 | R | L1 Lottie, PH1 Poly Haven | hang a projektfájlban (BUGS), videóimport |
| LINK-01 | R | K1 zsinór | 3 állapot, panel/térkép; K1 forrásparaméter-hiba |
| UI-01 / COLOR-01 | R | U1/U3/U4 | **U5**: színösszesítő, gradiens, action bar |
| CAT-01 | R | könyvtár, polcok | elemleltár szerinti átsorolás |
| RECIPE-01 | R | Q1 Random minőségszűrő | receptcsalád képarány/szöveg-próbával |
| LAYOUT-01 | T (prototípus) | extension-lab WIDE/Unwoven | integráció (R2) |
| WORLD-01 | R | T1 3D Terep | Bolygó (T2), Város, Skybox |
| EXPORT-01 / PERF-01 | R | export-beállítás | 4K + hang, export-megszakítás (BUGS), M1 Max mérések |
| STAB-01 / BASE-01/02 | T | – | mentett jelenetkép, árva Kapcsolat (BUGS) |
| RELIGHT-01, CHARACTER-01, VIDEO-01, QA-01 | T | – | mind |
| SCENE-01, AI-PREVIZ-01 | T (későbbi) | – | mind |

Eltérés a csomag-pillanatképtől: a csomag (5a884ea) írásakor a MAT/FLUID/PHYS/PART/PATH/TEXT/MOT kártyák még üresnek látszottak; azóta ezek első szelete elkészült. Idegen változtatás nem veszett el (a Codex 3 hibája átvezetve a `BUGS.md`-be).

## 2. A kimaradt M6–M10 (C–G szakasz) a mai újítások fényében

| M | Szakasz | Mi volt a cél | Mi van már | Hogyan érdemes befejezni most |
|---|---|---|---|---|
| **M6** | **C Látványkapu** | 1. kép teljes lánca (forma–anyag–fény–padló), 6. kép minőségi kapu, anyag/render audit | Gerincfelület + Jelenetfény (M6), **FÉNY2** több fény + Tükör padló, **MAT1** anyagok, **P2** Cső | **M6b „1. kép összeáll”:** P2 Cső/Szalag útvonal → MAT1 króm/lakk anyag → FÉNY2 fényforma a tükröződésben → Tükör padló, egyetlen receptként. Plusz: MAT1 interfész kiterjesztése a 3D Terepre, Felhőre, T6 szövegre (Megjelenés-audit). Kapu: M1 Max frame-idő + állókép összevetés. |
| **M7** | **D Építőelemek** | Felhő/Lufi ✓, Füst, Virág, Bolygó, szöveg gömbön, 2D↔3D, Részecske Forrás, kapcsolatok | Felhő+Lufi (M7b), **E1** Részecske Forrás, **T6** szöveg gömbön/hengeren, **F1** füstcsík-változat, **T1** Terep | Maradt 3 kis szelet: **Füst** = F1 folyadék + E1 szélmező közös „szél” forrással (nem új szimuláció); **Virág** = P2 útvonal szirmai + MAT1 anyag (Ksenia-ref); **Bolygó** = T2 (Terep-domborzat gömbre). A „kapcsolatok érthetők” rész a LINK-01-be kerül (K1 hibával együtt). |
| **M8** | **E Közös fizikai tér** | merev testek, mezők, kontaktus→Glow, reprodukálható seek/export | **F2** 2D merevtest (csoportok, falak, determinisztikus seek, kulcsokká sütés), **E1** szél/örvény a részecskéken | **M8a „Mező”:** egy közös erőmező-objektum (szél, örvény, vonzás), amit F2 testek, E1 részecskék és F1 folyadék egyaránt olvas. **M8b „Érintés jelez”:** F2 kontaktus-esemény → K1 Kapcsolat forrása (pl. Glow felvillan). Részecske–test ütközés. A globális gravitáció nélküli lökés már megvan. |
| **M9** | **F Folyadék + összetett recept** | kiömlés, üreg/határ, testreakció, költség, jég–króm–láva | **F1** 2D Stable Fluids közös órán | **M9a:** határ/akadály rétegmaszkból (szöveg, forma), F2 testek tolják a folyadékot (és fordítva). **M9b:** jég–króm–láva recept (F1 + MAT1 + FÉNY2). Előnézeti költségjelzés. 3D folyadékot nem ígérünk. |
| **M10** | **G Receptcsalád** | 3/4/5/7/8/9 referencia-layoutok, 1:1/4:5/9:16, szövegcsere-próba, animált Random | **Q1** Random minőségszűrő, **KO1** Koreográfia, WIDE/Unwoven prototípus | Receptcsalád = layout (LAYOUT-01 WIDE/Unwoven integráció) + KO1 érkezés + Q1 szűrő; automatikus próba három képarányra és rövid/hosszú szövegre. Animált Random = Q1 + KO1 mozgásprofil. |

## 3. Döntési pontok a felhasználónak

1. **Sorrend:** javaslat: (a) U5 szín/UI — mindennapi használat; (b) M6b „1. kép összeáll” — a legtöbb kész alkatrészt hozza össze egy látható eredménnyé; (c) M8a Mező; (d) M7 maradék (Füst/Virág/Bolygó); (e) M9a; (f) M10.
2. **STAB előrevétele:** a három adatvesztési hiba (mentett jelenetkép, hang a projektben, árva Kapcsolat) kicsi, javasolt egy „STAB-01 mini” szelet az U5 előtt.
3. **Élő próba:** a mai 15+ szelet egyike sincs K státuszban. Javaslat: előbb a mozgás-csoport (G1/LP1/XF1/KO1/F2) próbája, mert ott volt kézi összefésülés.
4. A Mező (M8a) közös legyen-e F1/E1/F2 között már az első szeletben, vagy előbb csak F2+E1.

## 4. Következő konkrét szeletjavaslat

**STAB-01 mini** (3 hiba, kis kockázat) → utána **U5** vagy **M6b** a felhasználó választása szerint. Mindkettőhöz a 13. fejezet szerinti javaslat kell indulás előtt.

## 5. Szabály: átfedő addonok (a felhasználó döntése, 2026-10-18)

Ha egy extension-lab addon egy már natívan elkészült funkcióval fedésben van, **nem hagyjuk ki**: a forrását átnézve a natív változatot feljavítjuk vele, ahol segít (minőség, funkció, robusztusság). Párok: `fluid-field`↔F1, `rigid-bodies`/`rapier-physics`↔F2, `path-tube`/`tapered-line`/`vector-paths`↔P2, `curved-text`/`extrude`↔T6, `camera-framing`↔K3, `planar-reflection`/`glass-material`/`custom-material`↔FÉNY2/MAT1, `gpu-particle-state`/`quarks-emitter`↔E1, `polyhaven-intake`↔PH1. Minden érintett szeletjavaslat sorolja fel, mit javít az addon.

## 6. Fő ütemterv: a csomag hullámai a mai állapotra igazítva (a felhasználó döntése: a csomag a fő irány + M10)

A csomag hullámai (`FEJLESZTESI-TERV.md`) maradnak a gerinc; az M6–M10 bennük van (C→MAT/WORLD/PATH, D→PART/WORLD, E→PHYS/LINK, F→FLUID, **G=M10→RECIPE/LAYOUT/CAT**). Minden szelethez jóváhagyott javaslat kell; az addonok a szeletbe épülnek (5. pont szabálya szerint).

| Hullám | Nagy feladat (A) | Beépülő addonok | Régi M | Megjegyzés a mai állapothoz |
|---|---|---|---|---|
| 0 | TRIAGE-01 | – | – | **kész** |
| 1 | CAT-01: stabil ID, metaadat, keresés, 4 szerep | – | B | a mai sok új elem (E1, F1, F2, T6, MAT1…) miatt most sürgősebb |
| 2a | STAB-01 mini + BASE-01 (asset-gyűjtő, hang a projektben) | `streaming-export` | A | 3 adatvesztési hiba + export-megszakítás; minden későbbi addon tartós médiájának alapja |
| 2b | COLOR-01 / UI-01 = **U5** | `color-picker`, `color-wheel`, `perceptual-gradient`, `palette-scales`, `sortable-toolbar` | B | |
| 3 | **M6b** MAT-01 + „1. kép összeáll” | `contact-shading`, `environment-map`, `lut-import`; javítás: `glass-material`, `planar-reflection` | M6 / C | FÉNY2+MAT1+P2 már megvan |
| 3' | **M10 első szelet** LAYOUT-01 + RECIPE-01 | Unwoven, WIDE-tanulmány; `dom-transform` (csak szerkesztősegéd) | M10 / G | layoutrecept saját képpel/szöveggel, 1:1·4:5·9:16 próba, KO1 érkezés, Q1 szűrő; animált Random |
| 4 | PHYS-01 / PART-01: **M8 Mező** + „Érintés jelez” | javítás: `rapier-physics`, `rigid-bodies`, `quarks-emitter`, `gpu-particle-state`; `procedural-noise`, `surface-scatter` | M8 / E | F2 + E1 megvan; LINK-01 (K1 hiba) ide kapcsolódik |
| 4' | M7 maradék: Füst, Virág, Bolygó (WORLD-01 T2) | `smoke-assets`, `foliage-assets`, `particle-atlas` | M7 / D | |
| 5 | FLUID-01: **M9** határ/üreg, testreakció, jég–króm–láva | javítás: `fluid-field`; `water-surface` csak a Three-híd döntés után | M9 / F | |
| 6 | **M10 teljes** RECIPE-01 család + animált Random | – | M10 / G | a 3–5. hullám elemeiből; csak valóban elérhető elemekből |
| közben | PATH-01 (boole: `polygon-boolean`, `svg-import`, `font-outlines`, `voronoi`), MOT-01 (`bezier-easing`, `fit-motion-path`), TEXT-01, jelzések (`audio-features`, `waveform`, `metronome`) | | B | független kis ágak, ha nem ütközik a write-set |
| később | SCENE-01 + Three-híd döntés (`gltf-import`, `model-animation`, `ik-chain`, `decal`), VIDEO-01, CHARACTER-01, RELIGHT-01, AI-PREVIZ-01 | | – | külön javaslat; nagy 3D fájl: beágyazás vs. hivatkozás döntés |

Az M10 két helyen van: a 3'. hullámban egy korai, kipróbálható layoutrecept (hogy a minőséget valós munkán mérjük), a 6.-ban a teljes receptcsalád.

## 7. Döntés: beágyazás + teljesítmény (a felhasználó döntése, 2026-10-18)

Nagy médiát (3D modell, videó, hang, kép) **beágyazunk** a projektfájlba (hordozható, egy fájl). Feltétel: a program a lehető legoptimálisabban fusson. Minden addon/média szelet ezeket tartja:
1. **Lusta indítás:** nehéz kód (pl. glTF-betöltő, fizika-WASM) tömörítve a HTML-ben, első használatkor csomagolódik ki és indul; nélküle a megnyitás nem lassul.
2. **Asset egyszer:** tartalom-hash alapú azonosító, egy fájl egyszer van a projektben akárhány réteg/jelenet használja; törölt használat után takarítás mentéskor.
3. **Dekódolás egyszer, GPU-élettartam:** dekódolt textúra/mesh gyorsítótárban, nem használt erőforrás felszabadul (dispose); nincs per-frame újrafeltöltés.
4. **Előnézeti minőség vs. export:** nagy modell/textúra előnézetben csökkentett felbontás/LOD, exportban eredeti.
5. **Költségjelzés:** a `cost.ts`/inspector mutassa a nehéz réteget; méret- és memóriakorlát figyelmeztetéssel, nem csendes vágással.
6. **Mentés nem blokkol:** nagy projekt automatikus mentése nem akaszthatja meg a lejátszást (darabolt/háttér-szerializálás, ha mérés indokolja).

Mérés: a szelet végén M1 Max frame-idő és megnyitási idő a felhasználói próbán; headless csak funkcionális.

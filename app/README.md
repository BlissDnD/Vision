# Látomás Stúdió – forrás

Rétegalapú WebGL2 vizuális és motion editor. A forrás TypeScript modulokban van, a kimenet továbbra is **egyetlen HTML-fájl**. Ez közvetlenül publikálható artifactként, és helyben is megnyitható.

## Parancsok

| Parancs | Mit csinál |
|---|---|
| `npm install` | Telepíti a fejlesztői függőségeket: esbuild, typescript, vite. Az npm 11+ ezután kéri: `npm install-scripts approve esbuild`. Az audit-figyelmeztetések a dev-szervert érintik, a kész HTML-t nem; az `npm audit fix --force` ne fusson, mert főverziót vált. |
| `npm run build` | Éles build (esbuild, minifikált). Kimenet: `dist/latomas.html` (artifact-fragmens) és `dist/index.html` (önálló dokumentum). |
| `npm run build:dev` | Ugyanez minifikálás nélkül, inline sourcemappel. |
| `npm run dev` | Vite fejlesztői szerver (`index.html` + `src/main.ts`). |
| `npm run typecheck` | `tsc --noEmit`, 0 hibával fut. |
| `npm test` | Teszt-build (`dist/latomas.test.html`, minden modul exportja `window.__L`-en), majd az összes `tests/*.js` headless Chromiumban. |
| `npm run check` | Típusellenőrzés, build és teszt egymás után. Ez fut a CI-ban is: a `ci/github-ci.yml` fájlt másold a `.github/workflows/ci.yml` helyre (a rejtett mappát a távoli eszköz nem írhatta). |

A tesztekhez Python 3 és Playwright kell: `pip install playwright && python -m playwright install chromium`. Egyedi Chromium-útvonal a `LATOMAS_CHROME` környezeti változóval adható meg.

> A Vite-konfiguráció (`vite.config.ts`, `npm run dev`, `npm run build:vite`) a felhős munkamenetben nem volt kipróbálható, mert ott nem volt npm-hozzáférés. A kanonikus build az esbuild-es `scripts/build.mjs`, ez tesztelve van.

## Felépítés

```
index.html            jelölő (fejléc, panelek, idővonal) + <script type="module" src="/src/main.ts">
src/main.ts           belépési pont: a modulokat az eredeti sorrendben importálja
src/style.css         a teljes felület stílusa (tokenek: --bg, --fg, --accent …)
src/types.ts          adatmodell: Layer, NParam, Key, EffectDef, Project, Recipe …
src/runtime.ts        R – közös, változó futásidejű állapot (idő, kijelölés, lejátszás, húzás …)
src/effects/          effekt-könyvtár, csoportonként
  helpers.ts          S / SEL / COL paraméter-leírók, SKYLIB, CLOUDLIB, BENTO
  objects3d, shapes, generators, media, filters, worlds, worldBlocks, motionText, motionDesign, particles
  index.ts            EFFECTS = az összes csoport; DEFAULT_CODE, SDF-jelenet összeállítása, BASE
src/palettes.ts       paletták, EASE_NAMES
src/glsl.ts           közös GLSL fej (HEAD): zaj, fbm, pal() uniformokból, easeF, TXUV
src/gl.ts             WebGL-mag: programok, cache, render-targetek, compositor shaderek
src/state.ts          st (projekt), makeLayer, makeGroup, normalize, Kinézet (LOOKS)
src/macros.ts         recept-makrók
src/recipes.ts        RECIPES (világ-, motion-, 3D-receptek)
src/library.ts        polcok (LIB, CATS)
src/evaluation.ts     ev(): alapérték + kulcskocka + LFO + jel; kulcskocka-motor és görbeszerkesztő
src/text.ts           szöveg-textúra (többsoros, igazított), aux-textúra az animált szöveghez
src/blob.ts           blob-követés (CPU)
src/render.ts         renderelés: transzformok, 2,5D kamera, mélységélesség, bento, belépés/kilépés, részecskék, réteglánc, compositing, utófeldolgozás
src/thumbs.ts, thumbstore.ts   polc-bélyegképek (+ IndexedDB-cache)
src/shelf.ts, itemops.ts, layers.ts, controls.ts, inspector.ts   felület
src/history.ts        visszavonás, mentés (localStorage), projekt-JSON
src/stage.ts          vászon, gizmo, húzás
src/transport.ts, loop.ts, adaptive.ts   lejátszás, fő ciklus, adaptív felbontás
src/signals.ts        hangelemzés, ütem-jelek
src/timeline.ts       alsó idővonal + Sávok panel (nagyítás, többes kijelölés, kulcsmozgatás)
src/popovers.ts, output.ts, modals.ts   vászon / export (PNG, MP4, mozgási elmosás) / párbeszédek
src/random.ts         Véletlen generátor
src/describe.ts       Leírásból animáció (`sample` capability)
src/keyboard.ts, boot.ts
tests/                run.py (egy teszt), run_all.py (mind), *.js tesztek
tools/                a 2026-10-17-i egyfájlos → modul migráció szkriptjei (referenciának)
```

## Konvenciók

- **Közös, változó állapot az `R` objektumon** (`R.time`, `R.selId`, `R.playing`, `R.CAMON` …). A modulok a `const` és `function` exportokat importálják, de egy másik modul `let` változóját nem írhatják. Ezért van minden ilyen állapot egy helyen.
- **Betöltéskori sorrend:** a `main.ts` a régi egyfájlos sorrendben importál. Egy modul felső szintje (nem függvénybe zárt kód) csak a sorrendben **előtte** lévő modulokra hivatkozhat. A migrációs szkript ezt ellenőrizte. Ha egy effektnek futásidejű GL-függvény kell (például `setU`), azt a `render.ts` rendeli hozzá, nem az effekt-fájl.
- **Új effekt:**
  1. Kulcs a megfelelő `src/effects/*.ts` csoportba (`kind`, `name`, `desc`, `params`, `main`, `code` GLSL-ben `vec4 fx()`-szel, előszorzott RGBA kimenettel).
  2. `COST` érték a `src/cost.ts`-be.
  3. `LIB`-bejegyzés a `src/library.ts`-be.
  4. A paraméterek automatikusan `p_<kulcs>` uniformok lesznek, animálhatók, kulcskockázhatók és jelre köthetők.
- **Paletta a shaderben:** `pal(t)`. Négy uniformból (`uPA..uPD`) számol, a `setPal()` állítja be rétegenként.
- **Program-cache:** könyvtári effektnél típus szerint, Saját GLSL-nél típus és kód szerint.

## Optimalizálások ebben a verzióban

- A paletta 18 ágú elágazás helyett 4 uniformból számol, minden `pal()` hívásnál.
- A shader-program cache kulcsa nem a teljes GLSL-szöveg, így rétegenként és képkockánként nincs több KB-os stringhash.
- A Bento-rácsnál az üveg-elmosás csak dobozon belül számol.
- A polc-bélyegképek az IndexedDB-be kerülnek (`thumbstore.ts`), buildenként. A második betöltéstől nincs GPU-munka a polcnál.
- A minifikált build 290 KB JS + 26 KB CSS (eddig 371 KB forrásként egy fájlban).
- Mérés SwiftShaderrel (CPU), 480×270, ms/kép, előtte → utána:

  | Recept | Előtte | Utána |
  |---|---|---|
  | Portál | 356 | 313 |
  | Bento-bemutató | 589 | 430 |
  | Bliss-dombok | 243 | 202 |
  | Sarki fény | 208 | 192 |

  Valódi GPU-n az arányok mások, de az irány ugyanez.

## Újabb modulok (M1–M7b, 2026-10-17)

- `sim.ts`, `time.ts`: közös óra, 60 Hz-es rögzített lépés az állapottartó rétegeknek (feedback, blob), 3 mp előfuttatás ugráskor (`WARM`); `sceneT()` az exporthoz; Loop nélküli továbbfutás.
- `migrate.ts`: minden betöltés ezen megy át; régi `app:'latomas'` v1/v2 fájlok; az ismeretlen elemeket toast sorolja fel.
- `variants.ts`, `variantsui.ts`: Közös alap / Változat (a helyi eltérés számolt: `localDiff`), Kapcsolat `st.links` (`{from,to,mode:'add'|'set',amt,on}`), az `ev()` a nem mentett `_lk` horgonyon át értékeli.
- `pick.ts`: jobb klikkes találatlista a vásznon, Alt+klikk. `shelf.ts`/`library.ts`: kategóriák, ékezet nélküli keresés.
- `textlines.ts`: soronkénti fogantyúk és „Sorok” szekció (`text.lines[i]` = `{size,dx,gap,weight,italic}`, em-ben).
- `retime.ts`: mozgásblokk húzása/nyújtása (a belépés sebessége marad, Alt: a zárás lassul), J-jelzések (`st.cues`), horgonyok. `perform.ts`: x/y Eljátszás simítással (E), a nyers felvétel megmarad.
- `mesh3d.ts`: Gerincfelület (`surface3d`): Catmull–Rom gerinc → lap, MSAA, félfelbontású tükör, analitikus stúdió (`ENV`). `spinegrips.ts`: gerincpont-fogók, kamera-pásztázás/görgő, csillanás-húzás (`glintDrag`, CPU sugár–háromszög). Mesh-réteg: `EFFECTS[type].mesh` → `drawMesh`.
- Jelenetfény: `st.light` (`LIGHTP`/`normLight`, `state.ts`), `lightU` a `render.ts`-ben (`setU` az obj3d/sdfscene-en, uniformok `uLDir/uLEnv/uLCol/uLSoftK/uLSize/uLWrap`); alapértéken bitre a régi kép. UI és csillanás-húzás: `lightui.ts`.
- `partfx.ts`: Részecske Megjelenés `pdisp` (fx-ként futó részecske-shader, `runChain` `def.points` ág; nyugalomban másolás, közben `MIX` átúsztatás); események: kézi / `st.cues` / ismétlődés; `altText` = szövegváltás a szétesés csúcsán (külön textúra-gyorsítótár `id#alt`).
- `effects/soft3d.ts`, `cloud.ts`: Felhő (`cloud3d`): blob-unió + zaj, puha sűrűséghéj raymarch, önárnyék a fény felé vett SDF-különbségből; a blobok a `cloudBlobs`-ból (Alak + Változat, determinisztikus, a képbe illesztve). Lufi (`balloon`) **host-Megjelenés**: `EffectDef.host` = célrétegtípusok; a `runChain` kihagyja, a forrás `setU`-ja olvassa (`balloonVals`); `fxFits`/`fxHostNote` (`effects/index.ts`) szűri a ráhúzást (`attachFx`, `addFromLib`, lánc-lista).

## U1 (2026-10-18): Animálás, pálya, Sávok, fülek

- `evaluation.ts`: `setVal` = az animálható szerkesztés egyetlen kapuja (Eljátszás-hook `R.perfHook` → kulcs, ha kulcsos vagy `R.animMode`; kulcsos értéknél megállítja a lejátszást). Nem animálható vezérlő (`noAnim` csúszka, `scrubField` `keyed` nélkül) közvetlenül `obj.v`-t ír. `animKinds(n)` = 'k' kulcs, 'w' LFO, 's' jel, 'l' Kapcsolat; `ANIM_SYM`/`ANIM_TIP`. Új kulcs görbéje `DEF_EASE=0` (Lágy); a görbe nélküli régi kulcs továbbra is 5.
- `animate.ts`: Animálás mód (`setAnimMode`, A), mozgáspálya SVG (`updPath`, a `loop.ts` hívja), pont-húzás → `setKey` x+y.
- `timeline.ts`: `paramList(L)` (n, p és `f<i>.p/n` útvonalak), `objAt`, `layerKeyTimes/keysAt(L,t,path?)`; kijelölés `R.tlxSels=[{id,t,p?}]` (p nélkül = a réteg minden paramétere az adott időben); `selKeyRefs`, `retimeSel(f,copy)` (mozgatás/nyújtás egyben), `easeSel`, `keyMenu` (jobb klikk), `R.tlxOpenIds` (kinyitott sorok, nem mentett), `queueTL` (összevont újrarajzolás).
- `inspector.ts`: fülek (`ITABS`, `setITab`, `R.itab` a localStorage-ban `vel.itab`), `motionSummary` (Mozgás fül feje).
- `perform.ts`: általános, többösszetevős felvétel (`applyTakeN`, `smoothTakeN`); az M5 API (`applyTake`, `smoothTake`) megmaradt.

## U3 · K1 · S1 (2026-10-18)
- `workspace.ts`: bal oszlop elválasztó (`setShelfFrac`, `--shelfH`, localStorage `vel.shelfH`), egységes tooltip (minden `[title]` hoveren `data-tip`-pé válik, `tipNodes`: „(X)” → `<kbd>`), gyorsbillentyű-panel (`SHORTCUTS`, `setKeyHelp`, `?`). Csak UI, nem commitol.
- `layers.ts` `layerBadges(it)`: ◆ (animKinds k/w/s), ✦ fx, ⇢ `linksOf`, ⧉ `isVariant`; a sor `data-id`-t kap (K1 célzás).
- `linkcord.ts`: ⇢ pont a `#gizmo`-ban, zsinór SVG, `linkOptions(A,B)` / `applyOpt` / `paramChoices` / `driverOf`; kártya előnézettel (ideiglenes link + `attachLinks`, nincs commit), `openLinkCard` mini-kártya, `updCords` a loopból (`R.updCords`). Új Link-fajták a `variants.ts`-ben: `kind:'sunsky'` (a cél `p.sunx/sunh` a Nap korongjának helyét követi, `sunCanvas` = a GLSL `sunPos` képlete) és `kind:'follow'` (`n.x/n.y` + forrás elmozdulása `t-lag`-kor, `rx/ry` = nyugalmi hely). `describeLink` a variants-ban (az inspector is ezt használja). Projektformátum változatlan (v4), a régi link `kind` nélkül paraméter-link.
- `scenes.ts`: `st.scenes` [{id,name,dur,layers,trans:{dur,ease,pairs}}], `saveScene/loadScene/overwriteScene`, `matchLayers` (pairs › id › bid › típus+név; csak az előzőben lévők a régi alsó szomszéd fölé), `seqFrame(T)` → {items,t,i,e}; az átmenet `composeList`: párosítva statikus kevert értékek, kiúszó réteg `_toff` = előző jelenet hossza (a `renderList` rétegenként hozzáadja az időhöz), be-/kiúszás `scaled()` opacity/méret-node-dal. Jelenetsor: `R.seqPlay`, `st.dur` ideiglenesen az összeg (`snapshot` a mentett `R.seqDurSave`-et írja), `sim.frameAt(t)` adja a lejátszás/export elemeit. `setScenes` a `history.ts`-ben (undo, betöltés), migráció: a jelenetek rétegei is a `keep()`-en mennek át.

## P1 (2026-10-18)
- `userlib.ts`: általános saját könyvtár (memória `ULIB` + IndexedDB `vel-userlib`, minden hiba „csak memória”), `ulibPut/Del/Merge/Import/Export`, `ulibUsed()` → a projektfájl `ulib` mezője (`history.projectJSON`; `migrate.ts` alapértéke `[]`; `applyProject` összefésüli, nem ír felül). `R.onUlib` → `presets.syncLib()` újraépíti a polcok `own` bejegyzéseit (a beépítettek indexe nem változik; a kártyák kulcsa `shelf.ikey`).
- `presetfmt.ts` (tiszta, Node-ban is fut): `specBody`, `chatPrompt`, `shaderContract` (a `glsl.ts` HEAD-ből), `presetDoc` → a build írja a `docs/VEL-PRESET-FORMATUM.md`-t. A `describe.ts` `descPrompt` ugyanezt a törzset használja (saját shader nélkül).
- `describe.buildFromSpec(sp,{skip,single})`: `dropped` lista, `macros` (rétegindex → id), `custom` `code` + `sliders` → `L.cp`.
- `effects/index.ts` `paramsOf(L)` / `pdefOf(L,k)`: rétegenkénti paraméterdefiníció (custom + `L.cp`; WeakMap-cache, ezért a `L.cp` tömböt mindig cserélni kell, nem helyben módosítani). `gl.progKey` a csúszkák aláírását is tartalmazza.
- `presets.ts`: Mentés presetként, saját elem menü, Preset beillesztése (`checkPreset`, `measureCost` – vásznon `present` + `readPixels`, Plazmához viszonyítva; `L.cw` a `cost.itemCost`-ban), ChatGPT-utasítás, könyvtárfájl, `.json` ejtés, `cpEditor` (az inspector `R.cpEditor`-on át hívja).

## U4 (2026-10-18)
- `controls.ctlSlider`: egysoros elrendezés (`.top` = `.lab` [benne `.ics` ikonok] · `.rngw` · `.val`); `syncTwins(live)` a ugyanarra az `obj`-ra mutató többi csúszkát frissíti; `ctlSelect` `R.liveSel`-be regisztrál, ugyanígy szinkronizál (`renderInsp` üríti).
- `effects/index.ts` `animKeysOf(L)` (időzített effektek listája, máshol tempó-kulcsok), `mainDupOf(L)` (a Fő beállításokban is maradó mozgásparaméterek). Az inspector ezek alapján osztja szét a Tartalom és a Mozgás fül között (8 fölött „Mozgás finomhangolása”, csukva).
- `controls.fxListUI`: ikonsor (`.fxrow .fxic`, húzás `text/x-vel-fx`), kiválasztás `R.fxSel[L.id]`, lenyitás `R.fxBody[L.id]`, „+” ikonrács (`.fxgrid`). Ikonok: `fxicons.ts` `fxIcon(type,name)` (ismeretlen típus: monogram).
- `textbar.ts`: `#textbar` a `#wrap`-ban, `renderInsp` elején `R.updTextbar()`; a vászon-pointer/wheel/pick kezelők kihagyják a `.textbar`-t.
- `textbar.ts` `editTextInPlace(L)` / `closeTextEdit(keep)`: `.tedit` textarea a réteg vászonbeli helyén (kamera nélkül számolva); `#wrap` dblclick → `hitsAt` első szövegtalálata (vagy a kijelölt szöveg). Erősség-gyűrű: `.fxic` `--s` + `::after` conic-gradient maszk.

## T1 3D Terep (2026-10-18)
- `terrain3d.ts` (`terrain3d`, `terrain:true` → `render.ts` → `drawTerrain`): N×N rács [-1,1]², a VS kifelé ritkítja (|g|^1.8 → közel sűrű, távol ritka = távolsági LOD), és ott számolja a magasságot (`terrainH`), a normált és a görbületet középdifferenciával, valamint a vetett árnyékot (28 lépés a fény felé, 3 oktáv). A CPU-n nincs geometria-újraépítés.
- FS: stílus szerinti anyag (magasság, lejtő, nedvesség), finom normál analitikus deriváltas zajból, jelenetfény (`lightU` paraméterként, nincs körkörös import), ég-ambiens, pára. A víz egy sík: `terrainH` 3 oktávval → mélység, hab, Fresnel. Az égbolt teljes képernyős háromszög.
- Kamera: `mesh3d.ts` `camOf` és MSAA-cél (`targets`, most exportálva). `gridN`: 160/384/640 csúcs, ≥1800 px magas kimeneten ×2 és +1 oktáv (4K export).
- Licenc: a zajmag (hash12, vnoise, fbm, ridged, terrace, crater2, dune2, vnoised2) a ZyFou/ProceduralTerrains-ből származik (MIT, © 2026 ZyFou); a szöveg a fájl fejlécében van.

## F2 Fizikai test (2026-10-18)
- `src/physics.ts`: 2D impulzusos merevtest-megoldó (kör–kör, kör–doboz, doboz–doboz SAT, Coulomb-súrlódás, pattanás, vászonfalak, 8 iteráció, 60 Hz). A világ = a felső szintű, látható rétegek bekapcsolt `phys` mozgással; állapot t-ben = lépések 0-tól, 1 s-os ellenőrzőpontokkal, a fizikára ható adatok kulcsa (`keyOf`) érvényteleníti.
- `motion.ts`: új `phys` mozgás (Mozgás polc), `moEval` a `physAt(L,t)` eltolását adja hozzá; a Kulcsokká alakítás a fizikai pályát is kulcsokká süti. Rögzített test / Kezdés előtt: kinematikus, a saját animációját követi és tolja a többit.
- `moui.ts` `physRow`: ha a test a jelenet végéig kiesik (Vászon széle = Átengedi), felirat + Visszahozás. Teszt: `tests/f2_physics.js`.

## F1 Folyadékmező (2026-10-18)
- `src/fluid.ts`: Stable Fluids GPU-n, rétegenként saját FBO-párokkal a `ctx.fluid` térképben (sebesség, nyomás, festék RGBA16F; curl → örvényerősítés → divergencia → 20 Jacobi → gradiens → advekció). A rács csak a képaránytól és a Minőségtől függ (96/144/220 sor), nem a kimeneti mérettől.
- `effects/fluid.ts`: `fluid` (Forrás, Áramló tinta) és `fluidfx` (Megjelenés, Torzítás/Feltárás); a kijelző shader `uDye`/`uVel` textúrát kap (`setU` = `bindField`). Források: seedből számolt Lissajous-pályák a réteg x/y-ja körül (`emitters`, tiszta függvény); a réteg két lépés közti elmozdulása lökés (vásznon húzás).
- Közös óra: `sim.ts` állapotosnak veszi (`fluid:true`), `resetSim` → `resetFluid`; a `render.ts` csak `ctx.advance` mellett léptet (`fluidPrep`), a nem használt mezőket `fluidSweep` szabadítja fel. A modul a `gl.ts`-sel körkörös importban van, ezért a programok első használatkor linkelődnek.
- Teszt: `tests/f1_fluid.js`.

## L1 Lottie vektoranimáció (2026-10-18)
- `lottieCore.ts` ellenőrzi a helyi, csak vektoros JSON-t (méret/mélység/rétegtípus/expression) és a Vel jelenetidejéből számolja a képkockát; `lottie.ts` a MIT-licencű `lottie-web` light Canvas renderelőjét használja, méret- és képkockaérzékeny WebGL-textúra-gyorsítótárral.
- `lottieImport.ts` adja az előnézetet és a fájlválasztást, valamint külső hivatkozást a LottieFiles gyűjteményére; nincs online katalógus-integráció. A `presets.ts` globális JSON-ejtése Lottie esetén ide irányít. A `lottie` réteg ugyanazt a képútvonalat és Megjelenés-láncot használja, mint az `image`.
- `L.media` = `{start,speed,loop}`; ez külön van a kulcsanimáció `kloop`-jától. `timeline.ts` kompakt média-blokkot mutat; `history.ts` csak a használt `vectorAssets` rekordokat menti. `autosave.ts` a teljes projektet IndexedDB-ben tárolja, teljes localStorage-tartalékkal és hibajelzéssel.
- Integrációs próba: `tests/lottie_import.js`; kézi mintafájl: `tests/fixtures/vel-lottie-circle.json`. A képes/szöveges/fontos/expression Lottie ebben a szeletben tiltott. Függőség: `lottie-web` MIT, licence a buildelt HTML-be is beágyazva.

## PH1 Poly Haven textúraképek (2026-10-18)
- `polyhaven.ts`: 12 kurált Poly Haven CC0 textúra (hivatalos 2K diffuse JPG és bélyegkép); helyi keresés, kiválasztott kép CORS-letöltése, méret/MIME-ellenőrzés, képréteg és beágyazott asset.
- A `Layer.source` forrásadat a projekt-JSON-nal megmarad. Az API-t az app futás közben nem hívja (az előírt egyedi User-Agent böngészőből nem állítható); ez 2D képimport, nem PBR-adapter. Próba: `tests/polyhaven_import.js`.

## Q1 Random minőségszűrő (2026-10-18)
- `rndq.ts`: `measureImg` (nyers statisztika RGBA-ból), `SYMPTOMS` (bővíthető tünetlista: `{k,name,w,p(stats)}`), `judgeStats`/`scoreSym` (0–100, `qThreshold(strict)`), `capture`/`judgeScene` (saját `R.qCtx`, ≤640 px, `st.look` ideiglenesen cserélve), `fixCulprit` (gyanús effekt kihagyása → gyengítés/kivétel).
- `random.ts`: `pickScene(reroll)` (max. 6 próba / 700 ms), `runRandom(fresh, reroll?)`, `rndVote`, `#rndFb` sáv; `pickW(rng,list,ax,cat,keys)` ízlésszorzóval, `generateScene().keys` az összetevőkkel; receptszabályok az `X()` ráadásokban.
- `taste.ts`: `TASTE` (`latomas2.rndTaste`), szavazatszámok kulcsonként → `tasteMul` (1,15^tetszik · 0,8^ronda, 0,3–2); `projectJSON` felső szintű `taste`, `applyProject` → `tasteMerge` (kulcsonként max, idempotens).

## T6 Szöveg 3D (2026-10-18)
- `effects/text3d.ts`: `usesText` effektek (a `makeLayer`/`normalize` `L.text`-et ad, a `mediaFor` a `textTex`-et köti `uImage`-re, az inspector szövegmezője és a `textbar` is kezeli). `textwrap`: perspektivikus sugár, gömb/henger metszés **stabil képlettel** (legközelebbi pont, nem `b²−c`: SwiftShaderen kioltódott), u = szög × Ismétlés, v-sáv a szöveg arányából; két oldal (elöl/túloldal). `textextrude`: doboz-metszés + 64 lépéses menetelés a szöveg alfáján, 5 lépés finomítás, oldalnormál az alfa gradienséből.
- `textpath.ts`: betűatlasz (canvas, 96 px), betűnként négyszög ívhossz szerint (`glyphsAt`), útvonal nélkül saját ív (`ARC`); Körbe ér = periódus max(úthossz, szöveghossz).

## K3 Kamera-rendezés (2026-10-18)
- `camdir.ts` `camDir(t)` → `{dx,dy,droll,focus}`, a `render.camXf` adja hozzá a kulcsolt X/Y/Döntéshez (követő módban így eltolás). Képkockánként memoizált (`R.camFrame` a `renderScene` elején nő).
- Célpontok: `st.cam.shots=[{t,id}]`, aktív = utolsó `t ≤ idő`; átúszás quintic easinggel `trans` alatt; követés = 8 múltbeli minta lineáris súllyal (`lag`), a cél nyers helye a kamera nélkül (`placeAt`, `R.CAMON=false`). Útvonalon: `pathAt(st.cam.path, t, u)`, `pper`, `ploop`.
- Új `CAMP`: `shake`, `lag`, `trans`, `pper` (kulcsolhatók a Kamera soron). `normCam` csak meglévő K3-mezőt másol. UI: `camui.ts` (`R.camExtra` az `openCam`-ben).

## P2 Közös útvonal (2026-10-18)
- `paths.ts`: a közös görbemodell. `L.pts` (helyi egység) → `curve` (Catmull-Rom, zárt/nyitott, szögletes) → `toWorld` a réteg elhelyezésével (`placeAt`, ugyanaz, mint a `setXform`; óramutató szerinti forgatás, mint a `glsl.ts` `toUV`) → `arc`/`sampleArc`/`resample` ívhossz szerint. `simplify` = RDP a rajzhoz, `insertPt` a legközelebbi kontrollszakaszra. `R.pathAt(id,t,u)` a többi modulnak.
- `pathdraw.ts`: `pathshape` saját rajzolás (VAO, háromszögszalag: across/ív/mag-arány/félszélesség attribútum), a kinézet, Kirajzolás, szaggatás a fragment shaderben; zárt kitöltés `earClip`.
- `pathedit.ts`: fogantyúk (`.pgrips`, `R.updPathGrips` a `loop.ts`-ben), dupla kattintás a `.phit` vonalon, Alt+kattintás törlés, rajzpad (`armPathDraw`, a polc `drawPath` eleme élesíti), `R.pathPick` (Mozgás-kártya és emitter), `R.pathSection` (inspector).
- `motion.ts` `path` mozgás (`m.path` = rétegazonosító, `normMo` megőrzi): dx/dy = útvonalpont − alaphely, Irányba fordul = −szög. Emitter 6. alak: 128 egyenletes pont `uPath` uniformban.

## E1 Részecske Forrás (2026-10-18)
- `emitter.ts`: `emitter` effekt (`draw` hook a `render.renderList`-ben, GL pontok). Állapot nélküli: rekesz i születése `i/cap + k·W` (folyamatos), löketnél `j=i/M` csoport, `m ≡ j (mod B)` legutóbbi lökete; jelzésnél az utolsó 16 `st.cues`. A hash (cyc, i, seed) adja a sorsot.
- `placeAt(L,t)` = a `setXform` számítása (behav + kamera); 32 minta az utolsó Élettartamra (`uTr`), a Mennyiség is (`uTrR`, a kapacitás 1,25-ös lépcsőkre kerekítve, így az animált mennyiség nem keveri át a rekeszeket).
- Mozgás zárt képlettel: közegellenállás `fk/gk`, gravitáció és szél állandó erő, széllökés = közös 1D zaj különbsége (integrál), örvény = 3D zaj eltolás; padló legfeljebb 5 pattanás ballisztikusan. Alak 5: elutasító mintavétel az alatta lévő képből (alfa + háttérszíntől eltérés).
- Kinézetek a fragment shaderben (`vSh` = szög, flip/csíkhossz, méretarány). Teszt: `tests/e1_emitter.js`.
## Koreográfia (KO1, 2026-10-18)
- `choreo.ts`: `st.ko={prof,at,amt,sp,acc,ids,roles,w,d}` (mentés: `history.snapshot`, betöltés: `setShared` → `R.normKo`). `suggestRoles` (típus/méret/sorrend), `ordered` (szerep, majd olvasási sorrend).
- `koParts(K,id)` = a szerep mozgásai sima értékekként (`BT`: kezdés + lépcső szerepenként, `sp`-vel szorozva; az időtartam nem nyúlik). `R.koMos(L)` → `moEval` extra lista (cache: `WeakMap` a K-n, JSON-aláírással); Jelenetsorban nincs.
- Kártya (`koOpen`, `R.koPv` előnézet, `koAccept` egy commit), `R.koSection` a Mozgás fül tetején, `R.koRows` a Sávok Jelzések sora alatt, `koDetach` = Önálló mozgássá (`toMo` → `L.mo`).

## Mozgás átadása (XF1, 2026-10-18)
- Adat: forrásmozgás `m.xf={md,gap,ids}`, célmozgás `m.src={l,m}`, bármely mozgás `m.dl` (időeltolás, a `moEval` `t-dl`-lel számol). `effMo(m,L)` kiértékeléskor rakja össze a célt (`xfTakes`: Ritmus = idő/karakter mezők + ry/a/b/lp, Út = térmezők `n.s`-arányosan, Teljes = minden); `null` = nincs a sorban.
- `xfer.ts`: kártya + festés (capture-fázisú pointer a `#wrap`-on, geometriai találat `gizmoRadius`-szal), `R.xfPv` előnézet (`xfVirtual` virtuális célmozgás, a projekt nem változik), `xfAccept` egy `commit`, `R.updXf` sorszámjelvények, `xfSection` a Mozgás fülre (`moui` hívja `R.xfSection`-ön át).
- `timeline.ts` `spreadRow`: Terjedés blokk (jobb szél = `gap`), a célsor az effektív helyén, csíkozva, nem húzható. `gesture.ts` a célmozgásra nem ad fogantyút.

## Körbeér (LP1, 2026-10-18)
- `time.ts`: `loopLen()` (Loop be: `st.dur`; Jelenetsorban `R.seqLen`, a `seqFrame` írja; különben 0), `cyclesIn`, `snapRate`. A jelző `lp` (NParam: `mkN` őrzi; mozgás: `normMo` őrzi). Kiértékeléskor kerekít (`ev`, `moEval`), a tárolt `f`/`period` nem változik.
- `motion.ts`: `snapP`, `spinSnap` (egész fordulat a `speed·amt`-ra), periodikus `smoothNoise(x,seed,per)`. `moLoopInfo` = felirat. Az alapértelmezett `lp=1` csak felhasználói létrehozáskor kerül be (∿ megnyitása új hullámmal, `attachMo`), Loop be állapotban.
## FÉNY2 fények és tükrözés (2026-10-18)
- `state.ts`: `LIGHTP` + `shape` (SEL), `XLIGHT_K`, `makeXLight`, `normLight` → `more[]` (max 3). `render.ts`: `xLights`, `lightRGB`; `lightU` tölti a `uLShape`, `uLN`, `uXD/uXC/uXS[3]` uniformokat (Felhő/Terep nem deklarálja, ott hatástalan).
- obj3d-lib (a sdfscene is megkapja): `lShape` (fényforma a tükröződésben), `camRay` (Tükör padlónál emelt kamera), `tr2` (másodlagos sugár: szín + találat), `refrTrace` (belépés–kilépés, teljes belső visszaverődésnél egyenesen tovább). `shadePBR` a `gPrim/gP/gAlb/gRough` globálisokból tudja, hogy elsődleges találat-e.
- Fordítási idő: a `fx()` AA-ciklusa egyetlen `render()` hívási hely; nehéz függvényt (tr2) ne hívj több helyről, mert minden hívás beinline-olódik.
- `lightui.ts`: `R.lightSel`, `activeLight`, `addLight`, `removeLight`; `glint3` az aktív fényt írja.

## MAT1 3D anyag-interfész (2026-10-18)
- `effects/mat3d.ts` `MAT_GLSL`: uniformok `uMt` (0/1 toll/2 holo), `uMs` erősség, `uMsc` host-lépték (SDF 1, háló 0.12), `uMa/uMb` paramétercsomag, `uMc1/2` színek; `matHit` (találat), `matMiss` (SDF: sziluettkontúr, satírozott talajárnyék, papír), `matWarp` (holo glitch a sugáron), `MX()` keverés.
- SDF-hostok (obj3d, sdfscene): a találatnál semleges szürke `shadePBR` fényessége a tónus; `uMs≈1` esetén korai visszatérés (nincs plusz költség), különben minden `return` `MX()`-en át. A sdfscene a `head` szeletelés miatt automatikusan megkapja.
- Háló (surface3d): `MESH_FS` végén `matHit`, `MESH_VS`-ben holo glitch; aktív anyagnál (`matVals().s>0.5`) nincs tükörpadló/háttér, Rajzolt tollnál papírszínű törlés.
- Új host-Megjelenéshez: kulcs a `MAT_TYPES`-ba + ág a `matVals`/`matHit`-be.

## Gesztus-mozgás (2026-10-18)
- `gesture.ts`: egy `.moarrow` réteg (SVG pálya + `.mohit` húzható pálya, `.mohandle` vég, `.momid` ívfogó, `.motip` súgó, `.molab` címke, 8 `rect` szellemkép). `cur()` a Mozgás fülön kijelölt chipet követi (alapértelmezés: első chip, mint az inspectorban).
- Módváltáskor (⌘/⌥/semmi) újrahorgonyoz (`snap`), így minden mód a saját kezdőpontjához képest relatív; ⌘ tempó = `v·2^(dy/90)`, karakter 45 px-enként. Egy húzás = egy `commit()` elengedéskor.
- `motion.ts` spring: pálya `B(e)=u²S+2ue·C`, `C=S/2+n·bend·D` (bend 0 = régi egyenes; túllövés ugyanazon a görbén). Régi projekt `bend`=0-t kap a `normMo`/`makeMo` útján.
- Tekerés: `R.moScrub={id,t}` a `behav` elején felülírja a réteg idejét (csak húzás közben, nem mentett).

## Időzítés gyorsan (2026-10-18)
- `tap.ts`: nem mentett állapot `R.tapArm/tapBasket/tapIdx/tapS0`; `tapNow(t)` az első koppintáskor `snapshot()`-ot tesz el, `shiftBlock(L, t−entranceStart, false)` vagy `makeMo('spring',{at:t})`, `addCue`; commit csak a menet végén (egy undo), `tapEsc` = `restore(tapS0)`. Vászonkattintás `document` capture-ben (a `pick`/`stage` elé), listakattintás `R.tapToggle`, jelvény `R.tapBadge`, vászonszámok `R.updTap` (loop.ts).
- `retime.ts` `tempoItem(it,f)`: t → a+(t−a)/f a blokk elejéhez (`tempoPivot`, csoportnál közös), hosszak /f, period/ry.cyc /f, speed/rate/hullám-f ×f; `it.tpo` a chip-állapot (opcionális mező, hiánya = 1×).
- `evaluation.ts` `SMOOTH_E=14` „Sima (átmenő)”: Hermite a `keyVal`-ban, érintő Fritsch–Butland (`smTan`), 0 szélsőértéknél / nem sima szomszédnál / a végeken (C1 marad az eased szomszédokkal és a kulcs-Loop smoothstep-visszatérésével).

## R1 (2026-10-18): CRT-képernyő, Színes vetett fény
- `effects/filters.ts` `crt`: hordótorzítás `uv=0.5+0.5q(1+c·r²/4)/(1+c/4)` (élközép a helyén, sarok kívül), lekerekített-doboz SDF-perem; RGB-eltolás és sor-/maszkszám a vászonhoz relatív (felbontásfüggetlen); alfa = a három minta maximuma (mint `chroma`).
- `castlight` (`passes:2`): az 1. lépés 16 mintát vesz 1/256 lépésközzel (r = legjobb találat távolsága ×16, a = legjobb alfa), a 2. lépés 16-os lépésekkel 16-ot a köztes képen. A max·exp(-λk) szorzatos lecsengés miatt ez pontosan 256 minta maximuma. Az eredeti kép az `uPrev`-ből jön (a `runChain` a 2. lépésnek adja), a teljesen fedett képpont korán kilép.

## Mozgás v1.1 (2026-10-18)
- `motion.ts`: `m.ry = {k, cyc, pts[RY_N=10] 0..2, tgt 0 Tempó/1 Erő, rnd, seed}`; a pontok közt smoothstep, a fázis (`ryTau`) a görbe zárt alakú integrálja (Véletlennél a kihagyott ütemek megszámolva) → `moTime(m,t) = {tau, amp}`; a sáv `m.a`/`m.b` (hiányzó = 0 / nyitott), a végeken `RAMP` puha felfutás (ott Simpson-integrál). `bakeMo` mintavételez + RDP-egyszerűsít, lineáris kulcsok.
- `timeline.ts`: `paramList` a mozgásparamétereket is adja (`mo:<id>.p.<k>`, `objAt` kezeli) → kulcsmozgatás/nyújtás/kijelölés a meglévő úton; `renderTracks` mozgássorok (`.tlx-clip`, `clipDrag`), `R.tlxOpenIds` kulcsa a mozgássornál `L.id|m.id`.
- `moui.ts`: `rhythmUI` (chipek, `.rystrip`, élő pötty `R.updMoRy` a `loop.ts`-ből), „Kulcsokká alakítás”. `version.ts`: `__VERSION__`/`__BUILT__` (build.mjs, vite.config) a `.brand .ver` címkében.

## Mozgás v1 (2026-10-18)
- `motion.ts`: `MO` típusok, `makeMo`, `moEval(L,t,aud)` (op/dx/dy/sc/rot; a `render.behav` a `tm`-mel együtt adja, a `setXform` a rot-ot is), `charEase` = **Anime.js** (`spring`, `eases.outBack`; MIT, https://animejs.com) adapter: csak haladás→görbe, az óra a Velé. `syncKLoop(L)` a renderben (`_kl` nem mentett jelölés a kulcsos értékeken), `R.normMo` a `normalize`-ból.
- `evaluation.ts`: `klVal` (kulcs-Loop), `setVal`: Animálás mód nélkül kulcsos értéknél eltolás (`R.keyShift`).
- `moui.ts`: `motionsUI` (`R.moUI`, az inspector a régi `timingSection` helyett), `attachMo`/`R.dropMo` (polc, vászon, rétegsor), `R.moMain` (erősség a Fő beállításokban), `R.updMoArrow` (vászon-nyíl a loopból). Polc-előnézet: `shelf.setAudition` → `R.moAud` (saját órával, a loop addig renderel).
- Idővonal: `timeline.layerSegs` `mo`/`kloop` szakaszok, `segGet/segSet` (`mo:<id>`), `retime.timeFields` a beúszással.


### Teljes elemleltár és ötlettár

A `../docs/spec/VEL-TELJES-ELEMLELTAR-ES-FEJLESZTESI-OTLETTAR-2026-10-18.md` forrásalapú katalógus: elemtípusok, polcbejegyzések, receptek és prototípusok. A működő elemeket és fejlesztési terveket külön jelöli; nem új alkalmazásfunkció.

### Claude többagentes fejlesztési csomag

Belépés: `../docs/claude-handoff/00-START-HERE.md`. Rövid taskkártyák, UX- és adapterhatárok, forrásútvonalak, külön keresőmodell és csomagellenőrzők; nem új app-runtime vagy beépített addonrendszer.

Későbbi termékirányok: intuitív 3D scene/tájtervező és filmes AI-vázlatmód, közös adat-/kamerarendszerrel. Csak specifikáció: `../docs/claude-handoff/JOVO-3D-SCENE-ES-AI-VAZLAT.md`; nincs új futásidejű modul.

### ShapeGen tervezési átadó

A `../docs/claude-handoff/shapegen/00-START-HERE.md` a FORM v8 generátorainak és eszközeinek integrációs terve, a Vel 0.43 közös rendszereivel és célhoz kötött valódi jelenetpreview-val. Csak dokumentáció; nincs új runtime vagy build.
### STAB-01 mini (0.44.0-stab1)
- `history.ts` `usedAssets` bejárja a jeleneteket és Közös alapokat; `state.ts` `sameAsset(data)` azonos képet újrahasznál.
- Hang: `signals.ts` `R.audioExport`/`R.audioApply` (hookok, mert a history nem importálhatja a signals-t); az eredeti fájl data URL-ként egyszer készül importkor; `R.audioReady` promise a háttérdekódoláshoz.
- `modals.ts` `closeModal` futtatja az egyszeri `R.onModalClose` hookot (export-megszakítás); `variants.ts` `gcLinks` a `commit()`-ban és betöltéskor.

### CAT-01 (0.45.0-cat1)
- `catalog.ts`: `catalogIndex()` lustán épül LIB-ből (keresés nélkül `resetCatalog`), `catSearch(q, role)`, `catRoleCounts`, `catId`, `roleOf`. A típus az elem nevéből (EFFECTS) és a `make` forrás string-literáljaiból jön.
- Pontozás: névprefix 100, egyéb saját szó 40, szinonima a névben 60, szinonima a leírásban 15; a szinonima nem illeszt a polc nevére.
- `shelf.ts` `libSearch` → `catSearch`; `buildCats` keresés közben `.rolechip` gombokat rajzol (`R.libRole`).

### Help mód terve

`../docs/claude-handoff/help-mode/00-START-HERE.md`: a workspace tooltipútjára épülő rögzíthető fogalomkártyák terve, esemény/fókusz határokkal és külön súgóadatokkal. Nincs új futásidejű modul.

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

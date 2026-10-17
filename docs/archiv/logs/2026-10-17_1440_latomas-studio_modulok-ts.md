# Handoff — Látomás Stúdió — 2026-10-17 14:40
**Agent:** Claude (claude.ai, felhős munkamenet, Claude Code-alapú)
**Mérföldkő:** 0. fázis kész. Az egyfájlos alkalmazás TypeScript modulokra bontva, build-lánccal, tesztekkel és optimalizálással. Az összes korábbi funkció működik. A 10 headless teszt mind zöld, a `tsc` 0 hibával fut, és 23 recept középső pixele bitre azonos a v12-vel.

## Jelenlegi állapot
- **Forrás:** `muchdesigner/latomas-src/` (Node 22 + TypeScript + esbuild; Vite a fejlesztői szerverhez). Részletek: `latomas-src/README.md`.
- **Build-kimenet:**
  - `muchdesigner/latomas.html`: a v13 minifikált, egyfájlos build. Az artifact is ebből készül.
  - `muchdesigner/latomas.v12-egyfajlos.html`: az utolsó kézzel szerkesztett, egyfájlos változat (referencia, nem szerkesztendő tovább).
- **Élő verzió:** https://claude.ai/artifact/Pz6ZmknNeR6v9vYY82kDm5 (artifact 6. verziója = app v13). A `downloads` és `sample` capability megmaradt.
- **Szerkezet:**
  - 34 modul az eredeti szekciók mentén.
  - Az effekt-könyvtár 10 csoportfájlra bontva (`src/effects/`).
  - `types.ts`: Layer, NParam, Key, EffectDef, Project, Recipe.
  - `runtime.ts`: közös, változó állapot (`R`).
- **Parancsok:** `npm run build`, `npm run dev`, `npm run typecheck`, `npm test`, `npm run check`.
  - Az új CI-fájl a `latomas-src/ci/github-ci.yml`; ezt kell a `.github/workflows/ci.yml` helyre másolni. A távoli eszköz nem írhatta a rejtett mappát.
- **Optimalizálások:**
  - A paletta a shaderben 4 uniformból számol, nem 18 ágú elágazásból.
  - A program-cache kulcsa nem a teljes GLSL-szöveg.
  - A Bento-rácsnál az üveg-elmosás csak dobozon belül számol.
  - A polc-bélyegképek IndexedDB-be kerülnek, buildenként.
  - A JS minifikált. A méret 290 KB JS + 26 KB CSS (eddig 371 KB forrás).
  - Mérés SwiftShaderrel: −4 … −27% render-idő képkockánként (Portál −12%, Bento-bemutató −27%, Bliss −17%).

## Utolsó döntések (és miért)
- **Automatikus migráció, nem kézi átírás.** `tools/migrate-split.mjs` (acorn + eslint-scope):
  - a felső szintű `let` változókat `R.x`-re írta át,
  - minden modul exportja és importja generált,
  - ellenőrizte, hogy betöltéskor egy modul csak a már kiértékelt modulokra hivatkozik.
  Így a viselkedés nem változott, és ezt a tesztek és a pixel-összevetés is igazolják.
- **TS non-strict módban (`strict:false`), kevés `any`-vel.** Az adatmodell típusos (`types.ts`), az effekt-leírók `Record<string,EffectDef>`-ek. A szigorítás fokozatosan jöhet, modulonként.
- **Az esbuild a kanonikus build, a Vite csak dev-szerver.** A felhős környezetben és a Mac VM-ben is tiltva volt az npm registry, ezért a Vite-konfig nincs kipróbálva. Az esbuild-build tesztelt, és ez adja az artifact-fragmenst is.
- **A tesztek a `window.__L`-en keresztül érik el a modulokat.** Csak a teszt-buildben, élesben nincs.

## Nyitott kérdések / ismert hibák
- A Vite dev-szervert (`npm run dev`) helyben kell először kipróbálni (`npm install` után).
- A típusosság laza: `strict:false`, sok implicit `any`. Következő lépés a `noImplicitAny` modulonként, a tiszta modulokkal kezdve (palettes, evaluation, timeline-matek, camera).
- A `render.ts` és a `recipes.ts` még nagy (233 és 325 sor). Érdemes tovább bontani: kamera, bento, belépés/kilépés, részecskék külön fájlba; receptek kategóriánként.
- Előzőekből nyitott: a Leírásból élesben, a hangsávos MP4 élesben, a rugók érzete, a Sivatag és a Vihar receptek, a gizmo középpontja balra zárt szövegnél.

## Következő lépés
1. Helyben:
   ```
   cd muchdesigner/latomas-src
   npm install
   npm run check
   npm run dev
   ```
   Majd a `ci/github-ci.yml` áthelyezése és egy git repó létrehozása.
2. Felhasználói teszt a v13-on: minden úgy működik-e, mint a v12-ben, és gyorsabb-e valódi GPU-n.
3. Ezután új funkciók már a modulokban: „Módosítás leírással”, a render.ts és a recipes.ts bontása, `noImplicitAny`.

## Érintett fájlok
- **Új:** `muchdesigner/latomas-src/` (73 fájl: `src/`, `tests/`, `scripts/build.mjs`, `tools/`, `ci/`, `README.md`, `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`).
- **Módosítva:** `muchdesigner/latomas.html` (most build-kimenet).
- **Új:** `muchdesigner/latomas.v12-egyfajlos.html` (az utolsó egyfájlos forrás).
- **Szabály mostantól:** a `latomas.html`-t nem szerkesztjük kézzel. Minden változás a `latomas-src/`-be megy, és `npm run build` után a `dist/latomas.html` kerül a helyére.

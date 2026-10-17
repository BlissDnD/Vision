# Vel – fő fájl agenteknek (ezzel kezdj)

**Vel** (korábban Látomás Stúdió): böngészős, rétegalapú **WebGL2 vizuális és motion editor** TypeScriptben, egyetlen önálló HTML-fájlba fordul. Egy felhasználó (Miksa) alkotói eszköze.

- **Magyarul válaszolj, egyszerűen.** Kód, azonosítók, commit üzenetek angolul; a felület magyarul.
- A cél: a fejlesztések minél előbb bekerüljenek, jó minőségű rendereléssel (nem kell pixelpontos egyezés a referenciával). Kevés kézi teszt: mérföldkövenként 2–4 lépéses próba.
- Takarékos munka: dev-szerveren dolgozz, ne küldd a teljes HTML-t vagy kódot a chatbe; minden lezárt szelet után commit + dokumentumfrissítés.

## Kötelező munkamenet (a felhasználó döntése)
1. **Minden mérföldkő előtt** írd le magyarul a `docs/spec/VEL-TELJES-…` 13. fejezetének mintája szerint: mit tud majd a felhasználó (konkrét gesztusokkal), mit építesz pontosan, mit **nem**, hogyan próbáljuk ki (2–4 lépés + mérés), és hogyan változik a hátralévő lista.
2. **Várd meg a kifejezett jóváhagyást.** Utána a rutin műszaki döntéseket önállóan hozd meg; ha a vállalt funkció lényegesen változna, kérdezz újra.
3. Ne nevezz késznek egy A–G termékszakaszt egy M-szelet miatt. Állapotjelölés: **tervezett / részben / demonstrálva / felhasználóval kipróbálva** (`FUNKCIO-LELTAR.md`).
4. Jelzett hibát mindig a `BUGS.md`-be írj. Ha a javítás kérdéses vagy drága, és nem akadályozza a folytatást, ne javítsd azonnal, csak jegyezd fel.
5. Mérföldkő végén: rövid átadó (mi próbálható, 2–4 lépés, hány teszt ment át, korlát, build útvonala `app/dist/index.html`), majd `PROGRESS.md`, `FUNKCIO-LELTAR.md`, `HANDOFF.md` frissítése és commit.

## Olvasási sorrend
1. `HANDOFF.md`: **hol tartunk, mi a következő lépés**, mire vár jóváhagyás.
2. `BUGS.md`: nyitott hibák (érintett területen dolgozva nézd meg).
3. `FUNKCIO-LELTAR.md`: minden kért funkció tényleges állapota (a 18 soros hiánylista).
4. `docs/spec/VEL-TELJES-FUNKCIO-ES-MERFOLDKO-ATADAS-CLAUDE-NAK.md`: **elsődleges követelmény** (mit akar a felhasználó, próbák, 14. fejezet: linklista).
5. `docs/spec/vel-intuitiv-mozgas-es-kapcsolatok.md`: mozgás- és Kapcsolat-UX iránya (2026-10-18), a 4. kiegészítése.
6. `docs/spec/vel-fejlesztesi-terv-jovahagyasra.md`: A–G szakaszok (7. fejezet), termékszabályok.
7. Csak ha kell: `docs/spec/vel-reszecske-fizika-folyadek-teljesitmeny.md` (E/F, 4K), `docs/spec/vel-voros-felulet-webgl-prototipus-brief.md` (1. kép), `app/README.md` (kódfelépítés, modulok).

## Mappatérkép
```
vel/                     git repo (master, helyi, nincs remote)
  CLAUDE.md              ez a fájl: szabályok, térkép, parancsok, csapdák
  HANDOFF.md             aktuális állapot + következő lépés (minden szelet után frissül)
  PROGRESS.md            mérföldkőnapló, mérések, próbalisták (legújabb felül)
  FUNKCIO-LELTAR.md      funkciónkénti állapot a teljes átadó ellen
  BUGS.md                jelzett hibák állapottal (nem mind azonnal javítandó)
  app/                   a Vel forrása: src/, tests/, scripts/build.mjs, dist/index.html (build)
  docs/spec/             a felhasználó követelményei és terve (ELSŐDLEGES)
  docs/referenciak/      külső minták (CodePen stb.) + kepek/01–09.png referenciaképek
  docs/archiv/           régi átadók, döntésvázlat, naplók, felülírt leírások (csak visszakereséshez)
  prototypes/red-ribbon-webgl/   lezárt Three.js-prototípus (vörös felület), ne csiszold
  legacy/                régi egyfájlos HTML-ek (migrációs tesztfixture-ök forrása)
  .claude/launch.json    dev-szerverek: „vel” (5180), „ribbon” (5181)
../latomas-src/          a felhasználó RÉGI appja (5173-on futtatja): NE NYÚLJ HOZZÁ
../_archiv/              régi csomagok (tgz/zip), régi tesztszkript
```

## Parancsok (`cd app`)
```
npm install                     # ha nincs node_modules (npm 11+: npm install-scripts approve esbuild)
npm run typecheck               # 0 hiba kell
npm run build                   # → dist/index.html (önálló, dupla kattintással megnyitható)
node scripts/build.mjs --test --dev && .venv/bin/python tests/run_all.py   # összes teszt, ~3 perc
.venv/bin/python tests/run.py dist/latomas.test.html tests/<nev>.js       # egy teszt
```
- Dev szerver: `preview_start` „vel” (a `.claude/launch.json`-ból); ha az 5180 foglalt, más portot kap.
- `app/.venv`: Playwright + Chromium. Ha hiányzik: `python3 -m venv .venv && .venv/bin/pip install playwright && .venv/bin/python -m playwright install chromium`.
- A teszt-JS a `window.__L` kontextusában fut (minden modul exportja elérhető), a hibákat a `bad` listába teszi; minta: `tests/m6_mesh.js`. Képernyőkép: `SHOT=cv run.py html teszt.js "<JS-kód>"` → `shot0.png`.
- Headless = SwiftShader (CPU). Valódi GPU-mérés a beépített böngészőpanelben (M1 Max).

## Konvenciók
- Közös, változó állapot: `R` (`src/runtime.ts`). Projekt: `st` (`src/state.ts`). Minden változtatás után `commit()` (undo + automatikus mentés).
- `src/main.ts` importsorrendje számít: egy modul felső szintje csak az előtte importált modulokat használhatja. Futásidejű GL-függvényt az effektnek a `render.ts` rendel hozzá (`setU`).
- Új effekt: kulcs az `src/effects/*.ts`-ben (`kind`, `name`, `desc`, `params`, `main`, GLSL `vec4 fx()`), `COST` a `cost.ts`-ben, könyvtári bejegyzés a `library.ts`-ben. A paraméterek automatikusan animálható `p_<kulcs>` uniformok.
- Minden új viselkedéshez célzott teszt (`tests/mN_*.js`), nem a megvalósítás másolata. Verzió: `app/package.json` (`0.x.y-mNz`).

## Csapdák
- **Ne módosítsd csendben a projektet** (nincs rejtett frissítés): az inspector ne írjon a rétegbe megnyitáskor.
- A Változat helyi eltérése **számolt** (`localDiff`): ha az UI megnyitáskor alapértéket ír egy új mezőbe, hamis helyi eltérés lesz.
- Átmeneti, nem mentett mezők `enumerable:false`-szal (`_lk`, `_pv`).
- Projektformátum v4: `state.bases/links/cues/exp/light`, `layer.variant/spine`, `text.lines`, fx-en `alts`. Régi fájlok a `migrate.ts`-en át nyílnak meg; új mezőhöz alapérték + régi-projekt teszt.
- Vite dev oldalon az `await import('/src/x.ts')` HMR után **másik modulpéldányt** adhat (üres `st`). Élő ellenőrzéshez a felületet használd.
- A háttérben lévő böngészőpanel nem futtat rAF-ot (a lejátszás nem halad); szinkron mérés kis N-nel.
- Szinkron GPU-időméréshez `present()` + `readPixels` a vásznon (egy offscreen FBO `readPixels` nem szinkronizál megbízhatóan).
- A Mindspace (`~/Documents/claudecoding`) a felhasználó MÁSIK projektje; ott ne dolgozz.

## Külső referenciák: mikor melyiket nézd meg
Teljes lista indoklással: `docs/referenciak/VEL-ALTALAD-KULDOTT-KULSO-FORRASOK.md` (és a spec 14. fejezete). **Mérföldkő tervezésekor nézd meg a témához tartozót**, mintaként, nem másolandó kódként (licenc!).

| Téma | Referencia |
|---|---|
| Tükröződő anyag, króm/lakk/üveg | Dynamic cubemap (webglsamples), Glass Designer (sabosugi/YPWPoRJ), Liquid Glass (shingidad/jEPxMgW) |
| Térbeliség, extrudált forma | Glass Designer (sabosugi/YPWPoRJ) |
| Füst/tűz + szél | Flame in the wind (osublake/pqNXoq) |
| Virág/ornament | Ksenia WebGL flowers (ksenia-k/poOMpzx) |
| Karakter (szellem) | Spooky Spectral Ghost (filipz/GgpMOEq) |
| Útvonalforma, csövek, egérpálya | Tubes Cursor (soju22/qEbdVjK) |
| Részecske Forrás + szél, levelek | Falling autumn leaves (ceramicSoda/xxQJqVv) |
| Rövid ritmusos motion | Loader concept (robin-dela/qxzzzd) |
| Szöveg hengerpaláston (élő szöveggel!) | loficodes/ZEayGVg |
| Kameramozgás | ycw/wvPeWWR |
| Morfing | Morphing Ball (daniel-hult/QWqvxvp) |
| Metaball + layout | Metaballs Hero (filipz/ogjXgBP) |
| Fekete lyuk | MisterPrada/singularity |
| Render/textúra minőség | Ksenia laptop (ksenia-k/gOEgyaj) |
| Layout, tipográfia, ritmus | landonorris.com, activetheory.net |
| Víz/csepp | freefrontend.com/webgl |

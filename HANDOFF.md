# Vel – átadás a következő agentnek (frissítve: 2026-10-17)

Rövid, pontos folytatási kontextus. Előbb ezt olvasd el, aztán a `PROGRESS.md`-t (kész/hiányzó/mérés). A terv: `docs/vel-fejlesztesi-terv-jovahagyasra.md`; az eredeti átadás: `VEL-CLAUDE-ATADAS.md`.

## A felhasználó kérése (prioritás)
- **A Vel szoftver fejlesztései minél előbb kerüljenek be.** A vörös felület látványpróbája (`prototypes/red-ribbon-webgl/`) **félretéve, nem prioritás**; az M6-ban tér vissza (pontminta, öntükrözés, SDF vagy mesh összevetés).
- Kevés kézi tesztet kér: mérföldkövenként egy rövid próbát, 2–4 lépésben. Magyarul, egyszerűen kommunikálj.
- Tokenkerettel takarékosan dolgozz: minden lezárt szelet után commit, és frissítsd ezt a fájlt.

## Sorrend (mérföldkövek)
| # | Mi | Próba a végén |
|---|---|---|
| ✅ M1 | Közös idő, Loop nélküli futás, migráció, export a projektben | kész (`52207ea`) |
| **M2** | Típusos **Csoport / Közös alap / Változat / Kapcsolat** + mentés | 3 posztváltozatból egyben átírt cím csak ott változik; az „Átadás” működik |
| M3 | Könyvtár és rétegek UX (új kategóriák, kattintás alatti találatlista, csoportkijelölés, tömör effektlánc) | takart rétegek gyors kiválasztása |
| M4 | Tipográfia: soronkénti fogantyúk, vegyes stílus, soronkénti/szavas/betűnkénti animáció | 4. kép ihlette szerkeszthető poszt |
| M5 | Mozgásblokkok és retime, Eljátszás simítással, kézi Jelzések sáv | 10 perces 9:16 reel próba, exporttal |
| M6 | Látványkapu: render/anyag audit, a vörös felület folytatása | mért kép a célgépen, hiánylista |
| M7–M10 | Építőelemek és részecskék → fizika → folyadék (előbb kutatás) → receptek, Random, polírozás | lásd a terv 7. fejezetét |

## Környezet (Mac, helyben)
- Repo: `~/Desktop/melo/CLAUDE/muchdesigner/vel` (git, `main`). Az app az `app/` mappában van.
- `cd app && npm install`, `npm run typecheck`, `npm run build` (→ `dist/index.html`). Tesztek: `node scripts/build.mjs --test --dev && .venv/bin/python tests/run_all.py`. A `.venv`-ben Playwright és Chromium van; kb. 2 perc; jelenleg 15/15 zöld.
- Dev szerver: a Code fül `preview_start` „vel” konfigja (port 5180) és „ribbon” konfigja (5181). Ezek a **Mindspace** projekt `.claude/launch.json` fájljában vannak (`~/Documents/claudecoding`), ott commitolatlanul. A 5173-on a régi `latomas-src` fut, ahhoz ne nyúlj.
- Tesztírás: `tests/*.js` a `window.__L` (minden modul exportja) kontextusában fut; a minta a `tests/m1_close.js`. Hibát a `bad` listába tegyél.

## M2 állapota
(lásd lent, minden szelet után frissítve)

- [x] Adatmodell + diff/propagáció + v4 migráció + teszt (`src/variants.ts`, `tests/m2_variants.js`, 15/15 zöld)
- [x] Kapcsolat (Link) kiértékelés + teszt (`ev()` → `n._lk`, nem mentődik; `attachLinks` minden commit/restore/betöltéskor)
  - Működés: a Változat gyerekei az alap másolatai (`id = <változat>.<alapgyerek>`, `bid` = alapgyerek). A helyi eltérést a `localDiff()` számolja (változat vs. alap), a felületnek nem kell nyilvántartania. Az alapváltozás csak `transfer()` („Átadás”) útján jut el máshova, és a célok saját értékei nyernek.
  - Javítva: az inspector időzítés-szekciója a megnyitáskor nem ír többé `tm`-et a rétegbe (hamis helyi eltérést okozott volna).
- [x] UI (`src/variantsui.ts`): csoport inspector → „Közös alap és változatok” / „Változat · <alap>” (helyi eltérések olvasható listája, Új változat, Átadás a közös alapnak, Átadás a kijelölteknek, Leválasztás); gyerekelemen „Csak ezt: a közös alapnak”; minden elemen „Kapcsolatok” (lista be/ki/törlés + új kapcsolat: forrás elem/param → ennek a paramétere, mód hozzáad/vezérli). Rétegfa: `◇ <alap> · N helyi` jel. Az új változat a forrást elrejti (egy vászon, szem ikonnal váltás).
- [x] Böngészőben kipróbálva (5180): valódi csúszka → „1 helyi”, Átadás csak a kijelölt változatnak; konzolhiba nincs. 15/15 teszt zöld, verzió 0.15.0-m2.
- **M2 KÉSZ.** Ismert korlát: Átadás előtti „előnézet a vásznon” még nincs (csak név szerinti lista); a Kapcsolat erőssége a listában még nem állítható (alapból 1); hozzáadott/törölt gyerek nem adható át, csak értékek.

## M3 állapota
- [ ] (következő)

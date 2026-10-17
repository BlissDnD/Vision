# Vel — PROGRESS

Rövid folytatási kontextus. A teljes terv: `docs/vel-fejlesztesi-terv-jovahagyasra.md`, az átadás: `VEL-CLAUDE-ATADAS.md`.

## Állapot: 2026-10-17 este — M2 (Csoport / Közös alap / Változat / Kapcsolat) KÉSZ

Verzió 0.15.0-m2, projektformátum v4 (`state.bases`, `group.variant`, `state.links`; régi fájlok: üres). Részletek: `HANDOFF.md` „M2 állapota”. Teszt: `tests/m2_variants.js` (3 változat; egyben átírt cím csak ott; Átadás az alapra és kijelölteknek; helyi törlés túléli az alapváltozást; Kapcsolat kiértékelés; mentés→újranyitás bitre azonos; visszavonás; leválasztás; árva alap törlődik). 15/15 zöld.
**Felhasználói próba (2 perc):** jelölj ki egy csoportot → Közös alap és változatok → „Közös alappá alakítás” → „Új változat” kétszer → egy változatban írd át a címet → a rétegfában „1 helyi” látszik, a többi nem változik → „Átadás a kijelölteknek”.

## (félretett, M6-ban folytatódik) Vörös gerincfelület látványpróba: vörös gerincfelület látványpróba KÉSZ, kreatív értékelésre vár

Hely: `prototypes/red-ribbon-webgl/` (önálló, a Vel apphoz nem nyúl). Részletek, mérés és hiánylista: annak `README.md`-je.
- Three.js r170 (indoklás a README-ben), szerkeszthető 9 pontos gerinc = felső él, erről lelógó lekerekített lap; 8 fő vezérlő + Továbbiak; gerincpont-húzás gizmóval; geometriai padló-összeolvadás (exp-leülés) + analitikus kontaktárnyék; PMREM-környezet a fényekből, csíkmozgatásra újraépül; valódi síktükör padló.
- Ellenőrizve a beépített böngészőben (M1 Max): konzolhiba nincs, mind a 23 csúszka hat (geometriaiak a normálokkal együtt), alapállapot-visszaállítás bitre azonos, pontszerkesztés működik; build `dist/index.html` file://-ról fut.
- Mérés 2048×1536, MSAA 4×: élő 117–120 fps; szinkron 9,4–14,3 ms/kép; legdrágább a glow (3,5–6 ms), majd a tükör (1–3 ms).
- Képek: `prototypes/red-ribbon-webgl/shots/01-referencia-nezet.jpg`, `02-masik-nezet.jpg`, `03-gerincpont-szerkesztes.jpg`.
- Fő hiány: perforált pontminta, öntükrözés (dinamikus cubemap), távolságfüggő padlótükör, mérés más gépeken/4K-n.

## Állapot: 2026-10-17 este — M1 („Alapok: közös idő, régi projekt”) LEZÁRVA, Macen ellenőrizve

Verzió: `app/package.json` 0.14.0-m1. Helyi gépen futott: `npm install`, `npm run typecheck` (0 hiba), `npm run build` (294 KB JS), `npm test`: **14/14 zöld** (Playwright Chromium, kb. 2 perc). Dev szerver: `npm run dev` (Vite) működik, http://localhost:5180 (`.claude/launch.json` „vel”, a régi `latomas-src` a 5173-on fut, azt nem érintettük).

### Az M1 lezárásához most elkészült
- **Export-beállítás a projektben**: `state.exp` = hossz, kezdés (0 / lejátszófej), fps, felbontás, mozgási elmosás, zárszög. Mentés, automatikus mentés és újranyitás után visszajön; régi vagy hiányos fájlnál alapérték, hibás érték nem megy át (`applyExp`). A formátum v3 marad (új, opcionális mező).
- **Blob-követés a közös órán**: állapottartó rétegnek számít (`sim.ts` `stateful`). Csak rácslépésnél követ, a csak-összeállító képkocka (szünet, pontos export) újrarajzolja a meglévő követést. Ugrás/reset törli az előzményt (`resetBlobs`). A remegés/villogás/betűkeverés `Math.random` helyett lépésenkénti hash, így determinisztikus. A fő előnézet követése szünetben nem törlődik (gc csak más kontextusokra).
  - Mérés (`tests/m1_close.js`, t = 2,5 mp): ismételt ugrás 0, 30 vs 24 fps export 0, export vs ugrás 0, szünet stabil 0.
- **Mozgási elmosás teszt**: álló tartalom változatlan (0), mozgó tartalom elmosódik (3,2/255), ismételt render 0 eltérés; Visszhanggal a részképek nem léptetik vissza az órát, az export ismételhető (0).
- **Loop gomb**: a tooltip kimondja az állapotot és a következményt („Ismétlés: ki · a jelenet a tartomány után is fut tovább …”).

### Ismert korlát (M1 után is)
- Valódi GPU-n FPS-mérés nincs (a felhasználó a kézi próbát kihagyta, fejlesztés mehet tovább).
- WARM = 3 mp: a blob-követés és a nagyon lassan lecsengő Visszhang 3 mp-nél későbbi ugrásnál az exporttól eltérhet (a követés azonosítói másképp számozódnak). Állapot-ellenőrzőpontok a fizikánál jönnek.
- Teszteléshez Macen: `app/.venv` (Playwright), `.venv/bin/python tests/run_all.py`, vagy `npm test` olyan python3-mal, amiben van playwright.

## Előző ellenőrzőpont: 2026-10-17 18:30 — M1 („Alapok: közös idő, régi projekt”) ellenőrzőpont, NEM lezárt mérföldkő

Verzió: `app/package.json` 0.14.0-m1.wip. Git: a projektmappa gyökerében (`.git`), két commit: alap pillanatkép + M1 ellenőrzőpont.

### Kész és tesztelt (automatikusan, headless Chromium/SwiftShader)
- **Közös óra rögzített lépésű állapottal** (`src/sim.ts`). Az állapottartó rétegek (feedback/„Visszhang”) 60 Hz-es rácson lépnek, nem képkockánként. Ugrás után 3 mp előfuttatás (`WARM`). Pontos mód: export, állókép, szüneteltetett ugrás/szerkesztés 200 ms tétlenség után. Élő előnézet: legfeljebb 2 pótlépés képkockánként (`ctx.approx` jelzi, ha ez kevés). Szünetben az újrarajzolás nem lépteti tovább az állapotot.
  - Mérés (`tests/time.js`, 480×270, decay 0,9, t = 4 mp): ugrás vs. 30 fps export eltérés 0; 30 vs. 24 fps export 0; egyenetlen előnézet vs. export 0,01/255 átlag; ismételt ugrás 0. Korábban a feedback a képkockaszámtól függött (60/120 Hz-es kijelzőn és 24/30 fps exportban más lett).
- **Loop nélküli továbbfutás** (`src/time.ts`): az óra a tartomány vége után megy tovább, az időzített elem a végállapotban marad (mért eltérés 0), a generátor fut (eltérés 70/255). Az idővonalon „+N mp” továbbfutás-jelvény és szaggatott lejátszófej; a jelvényre kattintva vissza a 0-ra. A Loop kapcsolása toastban mondja el a működést, bekapcsoláskor a tartományon kívüli fej visszakerül.
- **Hang**: Loop nélkül a hang nem ismétlődik modulóval (előnézet és export); a fájl vége után csend, a hangjelek 0-ra esnek. Loopnál az export hangja a jelenetidőt követi.
- **Export**: a jelenetidőt (`sceneT`) használja; új „Kezdés” választó (0 mp alapból / lejátszófejtől), új 15 mp hossz. Korábban a nem idővonal-hosszú export a lejátszófejtől indult.
- **Projektmigráció** (`src/migrate.ts`): minden betöltés (fájl, beillesztett JSON, automatikus mentés) ezen megy át. Új mentés: `{app:'vel', v:3}`. A régi v1/v2 (`app:'latomas'`) fájlok megnyílnak. Ismeretlen elem nem tűnik el csendben: a toast felsorolja. A mélyebb beágyazott csoportokat kilapítja, nem törli. A `mkN` most idempotens, így mentés→újranyitás bitre azonos.
  - Fixture-ök: `tests/fixtures/` (v8 és v12 egyfájlos verzióból generálva: `tools/make-legacy-fixtures.py`). 8/8 megnyílik, rétegszám egyezik, a Loop-állapot megmarad, GL-hiba nincs.
- Mind a 13 teszt zöld (`npm test`, kb. 1,5 perc): a régi 11 + `time` + `migrate`. `npm run typecheck` 0 hiba, `npm run build` rendben (293 KB JS).

### Nincs még kész / nem ellenőrzött
- **Felhasználói próba és valódi GPU-mérés nincs.** Kipróbálandó Macen: 10 mp intro → Loop ki → háttér fut tovább, a jelvény számol; régi projekt megnyitása; 15 mp-es export Loop nélkül.
- A „blob” követő (CPU-állapot) még nincs a közös órán; ugráskor nem determinisztikus.
- A WARM = 3 mp előfuttatás nagyon lassan lecsengő feedbacknél (decay ≈ 0,99) közelítés, nem pontos.
- A mozgási elmosás részképei a pontos módban léptetik az állapotot (helyes sorrendben); külön tesztje még nincs.
- Az A szakasz többi része nincs elkezdve: típusos Csoport/Közös alap/Változat/Kapcsolat adatmodell, export hosszának projektbe mentése.
- Vite dev szerver kipróbálatlan (a felhőben nincs npm-registry). A kanonikus build az esbuild.

### Környezet (felhős munkamenet)
- Az npm-registry tiltott volt. Az `app/node_modules` szimlinkekkel készült a gépen lévő esbuild 0.28 / TypeScript 6.0 csomagokra. Macen helyben `npm install` a rendes út (package.json: esbuild ^0.24, typescript ^5.6).
- A tesztekhez Python 3 + Playwright + Chromium kell (`LATOMAS_CHROME` env, alapértelmezés `/opt/pw-browsers/chromium`). Macen: `pip install playwright && python -m playwright install chromium`, majd `LATOMAS_CHROME` beállítása nélkül a Playwright saját Chromiumja fut. Ha a run.py útvonala nem létezik, `None`-ra esik vissza.

### Döntések
- A feedback-állapot rácsidőhöz kötése (60 Hz) és a „kijelzett kép nem léptet” szabály ugyanaz a szerződés, amire később a fizika/részecske/folyadék épül: rögzített lépés, reset + előfuttatás, determinisztikus export. Ellenőrzőpontokat (állapotmentés) a fizikánál kell hozzáadni, ha a 3 mp-es ablak kevés.
- Az `R.time` továbbra is a jelenetidő (Loopnál a frame() tekeri vissza). Az export az `sceneT()`-n keresztül képez le. Így a meglévő effektkód érintetlen.

## Következő lépés
Sorrend és mérföldkövek: `HANDOFF.md`. Most: **M3** (könyvtár és rétegek UX), utána M4 tipográfia, M5 mozgásblokkok. A vörös felület (pontminta, öntükrözés, SDF-összevetés) az M6-ban.

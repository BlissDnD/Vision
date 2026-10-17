# Vel — PROGRESS

Rövid folytatási kontextus. A teljes terv: `docs/vel-fejlesztesi-terv-jovahagyasra.md`, az átadás: `VEL-CLAUDE-ATADAS.md`.

## Állapot: 2026-10-17 18:30 — M1 („Alapok: közös idő, régi projekt”) ellenőrzőpont, NEM lezárt mérföldkő

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
1. Felhasználói próba a fenti 3 ponton, `app/dist/index.html` megnyitásával.
2. M1 lezárása: export hossza/kezdete a projektben; a blob-követő a közös órán; MB-teszt; rövid UI-szöveg a Loop-gombon.
3. Utána M2: a vörös gerincfelület prototípusa (`docs/vel-voros-felulet-webgl-prototipus-brief.md`), külön mappában (`prototypes/red-ribbon-webgl/`), mért összevetéssel az SDF-úttal.

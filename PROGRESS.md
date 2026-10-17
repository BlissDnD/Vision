# Vel — PROGRESS

Rövid folytatási kontextus. A teljes terv: `docs/vel-fejlesztesi-terv-jovahagyasra.md`, az átadás: `VEL-CLAUDE-ATADAS.md`.

## Állapot: 2026-10-17 este — M7 (D szakasz) első szelet: 0.21.0-m7a „részecskés szöveg visszaáll”

- Új ráhúzható Megjelenés: **Részecskékre bontás** (`pdisp`, `src/partfx.ts`). Bármely rétegre (szöveg, forma, kép) a Megjelenés-láncban; a réteg pontokra esik szét, majd visszaáll. Indítás: Kézi csúszka / **Jelzésekre** (J) / Ismétlődve. Vezérlők: Szórás, Szétesés ideje, Szétszórva marad, Összeállás ideje, Örvény szétszóráskor, pontméret/sűrűség/szín.
- Nyugalomban az **eredeti, éles réteg** látszik (bitre azonos), a szétesés elején átúszik pontokba (`MIX` pass), összeálláskor vissza.
- Szövegrétegnél **Új szövegek összeálláskor** (soronként egy, `F.alts`): a szétesés csúcsán a következő szöveg jön, körbe; a réteg saját szövege közben szerkeszthető marad (`altText`, külön textúra-gyorsítótár `id#alt`).
- Tisztán időfüggvény: ugrás, ismételt render és export azonos (mérve 0).
- Könyvtár: Részecskék → „Szétrobbanó és visszaálló felirat” (3 mp-enként, két új szöveggel), „Részecskékre bontás (Megjelenés)”; Megjelenések → Részecskékre bontás.
- Teszt: `tests/m7_partfx.js` (nyugalom = eredeti 0; szétesés 8,3; összeállás után az új szöveg 0 eltérés; szövegsorrend; burkoló; ugrás-ismételhetőség; ismétlődés 1,4,7; kézi mód; újranyitás; könyvtári elem). 23/23 zöld. Élőben ellenőrizve.
- **Felhasználói próba (1 perc):** könyvtár: „felirat” → „Szétrobbanó és visszaálló felirat” → lejátszás: 3 mp-enként szétesik és új szövegként áll össze → a Megjelenés lenyitásával írj új szövegeket, vagy állítsd „Jelzésekre”, és lejátszás közben nyomd a J-t.
- Korlát: a pontok a teljes képkocka rácsából jönnek (sűrűség-választó); 3D-s szétszórás a meglévő részecske-shaderrel, ütközés/fizika nincs (E szakasz).

## Állapot: 2026-10-17 este — M6 technikai szelet kész (a C szakasz részben teljesül, lásd FUNKCIO-LELTAR.md): 0.20.0-m6

- 0.20.0-m6: **Jelenetfény** a 3D tárgyakon és 3D jeleneteken (`obj3d`, `sdfscene`): egy közös, animálható fény (`st.light`, projektben mentve; régi projektnél alapérték). Inspector „Jelenetfény” szekció: globális kapcsoló, rétegenkénti „Jelenetfény hat rá”, közvetlen vezérlők elöl: Lágyabb árnyék (árnyékél + körbeforduló fény), Nagyobb csillanás, Melegebb↔hidegebb, Erősség, majd Irány/Magasság. „Csillanás húzása a vásznon”: a tárgyra kattintva a fény úgy fordul, hogy a csúcsfény az egér alatt legyen (gömbközelítés: L = 2(n·v)n − v). A stúdió-környezet fő csillanása a fénnyel együtt fordul.
- Alapértéken a kép **bitre azonos** a korábbival (mérve), így a régi projektek nem változnak. A Gerincfelületnek saját stúdiófénye marad (Fény csoport + saját csillanás-húzás).
- Teszt: `tests/m6_light.js` (alap = régi 0 eltérés; irány 11,6; lágyság 0,69; melegség R−B 13→56; rétegenként ki; csillanás-húzás után a pont 0→765; 3D jelenet 32,7; újranyitás kulcskockával; régi projekt). 22/22 zöld. Élőben (Irizáló gömb) a csillanás a kattintás helyére ugrott.
- **Felhasználói próba (1 perc):** könyvtár: „gömb” → Irizáló gömb → Jelenetfény szekció → „Csillanás húzása a vásznon” → kattints/húzz a gömbön → próbáld a Lágyabb / Nagyobb csillanás / Melegebb csúszkát.
- Hiánylista a referenciához (1. kép): tükröződő padló és csíkos stúdió csak a Gerincfelületen van; obj3d/sdfscene üvegtörése továbbra is környezetminta; több fény / fényformák még nincsenek.

## M6 korábbi szeletei: 0.19.2-m6c

- 0.19.0-m6a: mesh-alapú 3D réteg „Gerincfelület” (MSAA, tükröző padló, analitikus stúdió). Döntés és mérés: `prototypes/red-ribbon-webgl/README.md`.
- 0.19.1-m6b: **a gerinc a vásznon szerkeszthető** (`src/spinegrips.ts`). A gerincpontok a réteg saját 3D kamerájával vetített fogók, szaggatott vonallal. Húzás: a pont a kamerával szemközti síkban mozog és az egér alatt marad; Shift: vízszintesen (a magasság marad). Üres helyen húzva a kamera célpontja mozog, görgővel a kamera távolsága. A 2D gizmó és az „Elhelyezés” ennél a rétegnél rejtve (a 2D x/y/s egy valódi 3D rétegnél értelmetlen volt). Inspector: „Gerinc” szekció (új pont utána, pont törlése, alapgerinc).
- Teszt: `tests/m6_spine.js` (vetítés↔egér eltérés < 0,2 px, Shift-sík, pásztázás, görgő, gizmó rejtve, szekció gombjai, újranyitás). 21/21 zöld. Élőben kipróbálva a beépített böngészőben, konzolhiba nincs.
- 0.19.2-m6c: **csillanás-húzás**: a „Gerinc” szekcióban „Csillanás húzása a vásznon” kapcsoló; bekapcsolva a felületen húzva a mennyezeti fénycsík oda áll, hogy a csillanás az egér alatt legyen (CPU sugár–háromszög találat a gyorsítótárazott hálón, tükörirány → mennyezet metszése; a 3 csík közül a jelenlegihez legközelebbi). Lefelé néző résznél toast mondja el, miért nem megy. Teszt: a kattintott pont fényereje +119 (m6_spine).
- Lencsehiba (Kinézet „chroma”): HDR-csillanásnál nincs színszél (a fényes pontból nem lesz cián/vörös pötty); normál tartományban a kép bitre azonos (mérve).
- **4K mérés (M1 Max, valódi GPU, böngészőpanel):** csak Gerincfelület, render + kinézet: 1080p 2,8 ms, 4K 6,3 ms/kép; animált formával (háló újraépítés kockánként) 1080p 5,7, 4K 9 ms. Üres jelenet 4K-n 2,4 ms. Egy 10 mp-es 30 fps-es 4K export renderelése ≈ 2–3 mp + kódolás.
- **Felhasználói próba (1 perc):** könyvtár keresőjébe „gerinc” → kattints → húzd a kék pontokat (Shifttel vízszintesen) → üres helyen húzva és görgetve a kamera mozog → Ctrl/Cmd+Z visszavon → „Csillanás húzása a vásznon”, majd húzz a felület bal, felfelé néző részén.
- Korlát: a gerinc nem kulcskockázható (statikus forma; a kamera és a formaparaméterek animálhatók). A vásznon kívül eső pontok nem látszanak.

## Állapot: 2026-10-17 este — M5 (mozgásblokkok, retime, jelzések, eljátszás) KÉSZ

Verzió 0.18.0-m5, 19/19 teszt zöld. Részletek: `HANDOFF.md` „M5 állapota”.
**Felhasználói próba (3 perc):** nyisd meg a Sávok panelt (az idővonal bal oldali ikonja) → a rétegsáv tetején lévő csíkot húzd: az egész mozgás tolódik; a végén lévő fogót húzd: a közép nyúlik (Alttal a zárás lassul) → lejátszás közben nyomd a J-t ütemre: jelzések → E (Eljátszás) → húzd a réteget lejátszás közben → csúszkával simíts.

## Állapot: 2026-10-17 este — M4 (soronkénti tipográfia) KÉSZ

Verzió 0.17.0-m4, 17/17 teszt zöld. Részletek és korlátok: `HANDOFF.md` „M4 állapota”.
**Felhasználói próba (1 perc):** Projekt → Új, üres vászon → írd be a könyvtár keresőjébe: „címlap” → kattints rá → tekerj 3 mp-re → a sorok elején lévő kék fogókat húzd (Shift: méret), vagy írd át a szöveget.

## Állapot: 2026-10-17 este — M3 (könyvtár és rétegek UX) KÉSZ

Verzió 0.16.0-m3, 16/16 teszt zöld. Részletek és maradék: `HANDOFF.md` „M3 állapota”.
**Felhasználói próba (1 perc):** jobb gomb a vásznon egy pontra → lista a pont alatti rétegekről, előnézettel → kattints egyre. Alt+kattintás: a legfelső. A könyvtár fölött írd be: „felho”.

## Állapot: 2026-10-17 este — M2 (Csoport / Közös alap / Változat / Kapcsolat) KÉSZ

Verzió 0.15.0-m2, projektformátum v4 (`state.bases`, `group.variant`, `state.links`; régi fájlok: üres). Részletek: `HANDOFF.md` „M2 állapota”. Teszt: `tests/m2_variants.js` (3 változat; egyben átírt cím csak ott; Átadás az alapra és kijelölteknek; helyi törlés túléli az alapváltozást; Kapcsolat kiértékelés; mentés→újranyitás bitre azonos; visszavonás; leválasztás; árva alap törlődik). 15/15 zöld.
**Felhasználói próba (2 perc):** jelölj ki egy csoportot → Közös alap és változatok → „Közös alappá alakítás” → „Új változat” kétszer → egy változatban írd át a címet → a rétegfában „1 helyi” látszik, a többi nem változik → „Átadás a kijelölteknek”.

## Vörös gerincfelület látványpróba: KÉSZ, félretéve (az M6-ban folytatódik)

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
Sorrend és mérföldkövek: `HANDOFF.md`. Most: **M6** látványkapu (render/anyag audit, a vörös felület folytatása), lásd `HANDOFF.md`. A vörös felület (pontminta, öntükrözés, SDF-összevetés) az M6-ban.

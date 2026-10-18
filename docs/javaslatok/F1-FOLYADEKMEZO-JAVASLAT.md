# Mérföldkő-javaslat: F1 Folyadékmező

Állapot: **előre jóváhagyva** (a felhasználó 2026-10-18-án sorban jóváhagyta: Részecske emitter, Közös útvonal, Kamera, Folyadék, Fizika, Szöveg 3D). Forrás: `docs/spec/VEL-KULSO-FORRASOK-INTEGRACIO-CLAUDE-PROMPT.md` 3. pont, `FUNKCIO-LELTAR.md` 33. sor. Minta: artcodev/three-fluid-fx (Stable Fluids, MIT) – a Three.js-kódot nem másolom, saját WebGL2-solver készül.

**Ami már megvan:** `sim.ts` közös óra (fix 60 Hz-es lépés, ugrás = újraszimulálás 3 s előfutással), állapotos rétegek (Visszhang, Blob), Folyékony márvány / Lávalámpa (csak látvány-shaderek, nincs bennük áramlás).

## A felhasználó ezt tudja majd
- **Források → Áramló tinta:** behúzva azonnal színes tinta kavarog a vásznon: 1–6 vándorló forrás fújja a festéket, a paletta színeivel. Csúszkák: **Források száma, Szórás, Erő, Folt mérete, Örvénylés, Lecsengés, Tempó, Szél + Irány, Lüktetés, Fényerő, Minőség** (Gyors/Normál/Finom), **Seed**.
- **A réteget a vásznon húzva** a források vele mennek; lejátszás közben a húzás belefúj a folyadékba (gesztussal belekeverés). Animálás módban a húzásból kulcs lesz, így exportban is ugyanúgy fúj.
- **Megjelenések → Folyadékos torzítás:** képre, szövegre, bármely rétegre húzva a folyadék sebessége elmozdítja a réteg képét – csak azt a réteget, a többit nem. Mód: **Torzítás** vagy **Feltárás** (a réteg csak ott látszik, ahol a tinta jár, mint egy füstből előbukkanó kép). Külön ajánlat a polcon: *Folyadékos feltárás*.
- 3 kész változat: *füstcsík* (felfelé szél, egy forrás), *örvények* (sok forrás, erős örvénylés), *tintacsepp* (lüktetve fúj).
- Ugrás, Loop, export: ugyanarra az időpontra ugyanaz a kép (mint a Visszhangnál).

## Pontosan megépítem
- **`src/fluid.ts` (új modul):** Stable Fluids GPU-n, rétegenként saját FBO-párokkal (sebesség RGBA16F, nyomás, festék 2× felbontáson): erő- és festékbefúvás → örvény (curl) → örvényerősítés → divergencia → nyomás-Jacobi (20 iteráció, előző nyomásból indulva) → gradiens kivonása → sebesség és festék advekciója lecsengéssel. A rács mérete csak a képaránytól és a Minőségtől függ (Gyors 96, Normál 144, Finom 220 sor), **nem a kimeneti felbontástól**: a 4K export ugyanazt a mezőt számolja, lineáris szűréssel nagyítva.
- Források: seedből determinisztikus Lissajous-pályák a réteg pozíciója körül; a lökés a pálya érintője + szél. A réteg két rácslépés közti elmozdulása is lökés (vásznon húzás).
- Közös óra: az `sim.ts` állapotosnak ismeri (`fluid:true`), seek/loop/export = reset + WARM újraszimulálás; a renderelésben csak `ctx.advance` mellett lép (mint a Visszhang). Nem használt mezők felszabadulnak.
- `effects/fluid.ts`: `fluid` (Forrás) és `fluidfx` (Megjelenés) definíció; COST; könyvtári bejegyzések; bélyegkép előfutással.
- Teszt: `tests/f1_fluid.js` (GL-hiba nélkül, idővel változik, seek = ugyanaz a kép, a torzítás tényleg elmozdítja a réteget, más réteget nem, mentés–újranyitás).

## Ebben még nincs
3D víztérfogat, ütköző test, akadály a mezőben, egér-„ecset” réteg nélkül, több réteg közös mezője (csoportszintű birtoklás), Kapcsolat a részecske Forráshoz, festék színe képből, WebGPU-út. A sebességmező-megosztás a részecskékkel későbbi szelet.

## Próba (2–4 lépés)
1. Források → Áramló tinta behúzása, Lejátszás → kavargó, színes tinta; Örvénylés fel → több örvény.
2. Lejátszás közben húzd a réteget a vásznon → a tinta a húzás irányába csóvázik.
3. Tegyél be egy Szöveget, húzd rá a Folyadékos torzítást → a betűk hullámzanak, a többi réteg nem; Mód = Feltárás → a szöveg a tintából bukkan elő.
4. Tekerj előre-hátra ugyanarra az időre → ugyanaz a kép; exportálj 2 s-ot.

**Mérés:** M1 Max-on Normál minőségen a lépés ≤ 1 ms (cél); seek 3 s előfutással < 0,3 s.

**Licenc:** a minta three-fluid-fx (MIT, © artcodev) és a klasszikus Stable Fluids (Stam 1999). Saját kód; a `fluid.ts` fejlécében hivatkozás és MIT-megjegyzés.

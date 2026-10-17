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
| ✅ M2 | Típusos **Csoport / Közös alap / Változat / Kapcsolat** + mentés | 3 posztváltozatból egyben átírt cím csak ott változik; az „Átadás” működik |
| ✅ M3 | Könyvtár és rétegek UX (új kategóriák, kattintás alatti találatlista, csoportkijelölés, tömör effektlánc) | takart rétegek gyors kiválasztása |
| ✅ M4 | Tipográfia: soronkénti fogantyúk, vegyes stílus, soronkénti/szavas/betűnkénti animáció | 4. kép ihlette szerkeszthető poszt |
| ✅ M5 | Mozgásblokkok és retime, Eljátszás simítással, kézi Jelzések sáv | 10 perces 9:16 reel próba, exporttal |
| M6 | Látványkapu: render/anyag audit, a vörös felület folytatása | mért kép a célgépen, hiánylista |
| M7–M10 | Építőelemek és részecskék → fizika → folyadék (előbb kutatás) → receptek, Random, polírozás | lásd a terv 7. fejezetét |

## Környezet (Mac, helyben)
- Repo: `~/Desktop/melo/CLAUDE/muchdesigner/vel` (git, `main`). Az app az `app/` mappában van.
- `cd app && npm install`, `npm run typecheck`, `npm run build` (→ `dist/index.html`). Tesztek: `node scripts/build.mjs --test --dev && .venv/bin/python tests/run_all.py`. A `.venv`-ben Playwright és Chromium van; kb. 2 perc; jelenleg 19/19 zöld.
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

## M3 állapota — KÉSZ (0.16.0-m3), 16/16 teszt zöld
- [x] **Kattintás alatti találatlista** (`src/pick.ts`): jobb gomb a vásznon → a pont alatti rétegek, felülről lefelé, apró előnézettel, kattintásra kijelöl. Alt+kattintás: a legfelső azonnal; kijelölés nélkül sima kattintás is. A kijelölés ragadós marad (a következő húzás a kiválasztottat mozgatja). Pixelpontos: minden jelölt külön renderelődik 192 px széles kontextusba, fekete ÉS fehér háttéren (3×3 pont). Ha a pontban nincs rajz, a látható rész befoglaló kerete is találat („a kerete alatt”, pl. gyűrű lyuka). Csukott csoport = egy egység, nyitottnál a gyerekek. 7 elemnél kb. 0,1–0,2 s.
- [x] **Könyvtár**: kategóriák a terv szerint (Receptek, Források, 2D Formák, 3D Formák, Megjelenések, Mozgás, Részecskék, Világok, Szöveg és kép; a kulcsok nem változtak), ékezetfüggetlen keresés minden polcon (`libSearch`).
- [x] **Effektlánc**: sorszám, ▲/▼ átrendezés, „Megjelenés hozzáadása…”.
- Teszt: `tests/m3_ux.js`. Böngészőben kipróbálva (5180), konzolhiba nincs.
- Nem készült el (M3-maradék, később): a csoport határa és a forgáspont vásznon húzható fogantyúja; a jobb gombos helyi menü a rétegen, klipen és beállításon (most csak a vásznon van találatlista); a maszkolás célzónája ráhúzáskor; a könyvtári kártyák mozgó előnézete; a csak maszkként működő réteg nem kattintható a vásznon (csak a rétegfában).

## M4 állapota — KÉSZ (0.17.0-m4), 17/17 teszt zöld
- [x] **Soronkénti tipográfia**: `TextSpec.lines[i] = {size, dx, gap, weight, font, italic}` (a `size` szorzó, a `dx` behúzás és a `gap` előtte lévő térköz, az utóbbi kettő em-ben). A `src/text.ts` `textTex` soronként mér és rajzol. Soronkénti adat nélkül az elrendezés bitre a régi (teszt).
- [x] **Változó sormagasság az animációban**: az `mtext` aux-textúra utolsó sora egy sortábla (soronként 16 bites felső és alsó határ). A shader (`effects/motionText.ts`) ebből keresi a sort, így a soronkénti maszk/felcsúszás változó méretnél is a jó sort fogja.
- [x] **Vászonfogantyúk** (`src/textlines.ts`): minden sor elején egy fogó; vízszintesen behúzás, függőlegesen térköz, Shifttel méret. A `loop.ts` hívja (`updLineHandles`). A kamera bekapcsolásakor rejtve vannak.
- [x] **Inspector „Sorok” szekció**: soronként méret, behúzás, térköz, vastagság, dőlt, plusz „Soronkénti beállítások törlése”. Az üres értékeket a `tidyLines` kiszedi.
- [x] Recept: **„Szerkesztői címlap (soronként)”** (Mozgás polc; keresés: „címlap”), a 4. kép ihlette, soronként maszkolva csúszik be.
- Teszt: `tests/m4_type.js`. Böngészőben kipróbálva: a fogantyú-húzás behúz és térközt ad, konzolhiba nincs.
- Nem készült el / korlát: vegyes stílus egy soron belül (szavanként) még nincs, csak soronként; a sorfogantyú forgatott rétegen nincs külön ellenőrizve; betűtípus soronként csak az adatmodellben van (`font`), az inspectorban még nincs választó; a változó sormagasságú soranimáció pixelre nincs mérve (csak GL-hiba nélküli render, és a sortábla adatai).

## M5 állapota — KÉSZ (0.18.0-m5), 19/19 teszt zöld
- [x] **Mozgásblokk** (`src/retime.ts`): egy réteg minden időzített eleme egy blokk (a `tm` be/ki, az `mtext` start/outAt, a `bento` start/morphAt/outAt, a `reveal` at/outAt és az összes kulcskocka). Fázisai: beúszás, rugalmas közép, zárás.
  - `shiftBlock`: minden együtt tolódik. `stretchBlock(...,'hold')`: a közép nyúlik, a beúszás érintetlen, a zárás azonos sebességgel későbbre kerül. `'close'`: zárás lassítása (a `tm.outDur` és a záró kulcsok nyúlnak).
- [x] **UI a Sávok panelen** (`timeline.ts` `blockDrag`): a sáv tetején vékony blokkcsík (húzva tol), a végén teljes magasságú fogó (nyújt, Alttal a zárást lassítja). Shift+kattintással több blokk jelölhető ki, és a művelet mindegyikre hat. Illeszt a kulcsokra, a lejátszófejre és a jelzésekre. Ha nincs mit nyújtani, megmondja, mit tegyél. A szakaszok (fázisok) alatta külön is húzhatók maradtak.
- [x] **Jelzések** (`st.cues`, mentve): lejátszás közben **J** = koppintás az ütemre; a Sávok panel „Jelzések” sorában dupla kattintás = új jelzés, Alt+kattintás = törlés, kattintás = ugrás. A jelzésen álló kulcskocka **horgony**: retime-kor helyben marad, és az üzenet megmondja, hány maradt (Shift-húzás: horgony nélkül).
- Teszt: `tests/m5_retime.js`. Böngészőben: a blokkcsík húzása eltolja a szöveg-animációt.
- [x] **Eljátszás simítással** (`src/perform.ts`): a vászon feletti sávon „Eljátszás” gomb (E billentyű). Bekapcsolva a kijelölt réteg húzása elindítja a lejátszást, és a mozdulatot felveszi. Elengedéskor Gauss-simítás (a végeken szűkülő ablakkal) és RDP-ritkítás jön, majd lineáris kulcskockák az x és y paraméterre, csak a felvétel idősávjában. A „Simítás” csúszka a nyers felvételből utólag újraépíti a kulcsokat. Élő előnézet: nem mentett `_pv` felülírás az `ev()`-ben. Teszt: `tests/m5_perform.js` (121 minta → 17 kulcs, legnagyobb eltérés 0,032).
  - **Nem ellenőrizve valódi húzással:** a Code fül böngészőpaneljében háttérben nincs rAF, így ott a lejátszási idő nem halad. Macen élőben kell kipróbálni.
- [ ] M5-maradék (később): több kijelölt *kulcs* együtt nyújtása (most blokkonként megy); a jelzés mint jel (pl. Glow-impulzus a jelzéseknél); az eljátszás más paraméterekre is (most csak elhelyezés).

## Az M5 kiindulópontja (eredeti leírás)
Terv §5 „Idővonal”: egy Mozgás = szerkeszthető blokk fázisokkal (beúszás, rugalmas közép, zárás). Középről húzva minden együtt tolódik; a jobb széle a középső részt nyújtja (a beúszás sebessége marad); „Zárás lassítása”; több réteg vagy kulcs együtt nyújtható; Eljátszás simítással; kézi Jelzések sáv (ütemre koppintás), a hangjelzéshez kötött időhorgonyok ne csússzanak. Kiindulás: `src/timeline.ts` (idővonal és Sávok, többes kijelölés, kulcsmozgatás), `Timing` (`tm`: in/inAt/inDur/out/outAt/outDur) és a `mtext` start/dur/stagger. Próba: 10 perces 9:16 reel exporttal.

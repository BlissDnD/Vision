# Vel – TELJES ÁTADÁS új agentnek (2026-10-17 este)

Neked nincs előzményed. Ez a fájl mindent tartalmaz, ami a folytatáshoz kell. Olvasd végig, mielőtt bármit csinálsz.

## 1. Mi ez a projekt
- **Vel** (korábbi neve Látomás Stúdió): böngészős, rétegalapú **WebGL2 vizuális és motion editor**, TypeScriptben. Egyetlen HTML-fájlba fordul.
- Felhasználó: magyarul beszél, **magyarul válaszolj, egyszerűen**. A kód, az azonosítók és a commit üzenetek angolul, a felület magyarul.
- A felhasználó célja: **a szoftver fejlesztései minél előbb bekerüljenek**. Kevés kézi tesztet szeretne, mérföldkövenként egy rövid, 2–4 lépéses próbát. Kerüld a hosszú csiszolást; „nem kell, hogy pixelpontosan azonos legyen a referenciával, jó minőségű renderelés a cél”.
- Takarékosan dolgozz: minden lezárt szelet után commit, és frissítsd ezt a fájlt. A felhasználó szól, ha fogy a keret; ilyenkor tiszta ponton állj meg.

## 2. Hol van minden (Mac)
- Repo: `~/Desktop/melo/CLAUDE/muchdesigner/vel` (git, `master` ág, helyi; nincs remote).
- `app/`: a Vel forrása (`app/src`), tesztek (`app/tests`), build (`app/dist/index.html` = önálló, dupla kattintással megnyitható).
- `docs/vel-fejlesztesi-terv-jovahagyasra.md`: **a felhasználó terve** (A–G szakaszok, 7. fejezet). Ez az elsődleges irány.
- `docs/` többi: referenciák, részecske- és folyadékjegyzetek, a vörös felület briefje. `images/01–09.png`: referenciaképek.
- `PROGRESS.md`: mérföldkövenkénti állapot, mérések, felhasználói próbalisták. `VEL-CLAUDE-ATADAS.md`: az eredeti átadás és munkaszabályok (olvasd el).
- `prototypes/red-ribbon-webgl/`: önálló Three.js-prototípus (vörös gerincfelület). Lezárva, a végén döntési jegyzet van a README-ben. **Ne csiszold tovább.**
- A felhasználó gépén a `latomas-src/` régi mappa (5173-as port): **ne nyúlj hozzá**.

## 3. Indítás és ellenőrzés
```
cd ~/Desktop/melo/CLAUDE/muchdesigner/vel/app
npm install            # ha hiányzik a node_modules
npm run typecheck      # 0 hiba kell
npm run build          # → dist/index.html
node scripts/build.mjs --test --dev && .venv/bin/python tests/run_all.py   # összes teszt, ~2-3 perc
npm run dev -- --port 5180 --strictPort   # Vite dev szerver
```
- Az `app/.venv` Python-környezet Playwrightot és Chromiumot tartalmaz. Ha hiányzik: `python3 -m venv .venv && .venv/bin/pip install playwright && .venv/bin/python -m playwright install chromium`.
- Egy teszt: `.venv/bin/python tests/run.py dist/latomas.test.html tests/<nev>.js`. A teszt-JS a `window.__L` kontextusában fut (minden modul exportja elérhető); a hibákat a `bad` listába teszi. Minta: `tests/m6_mesh.js`. Képernyőkép: `SHOT=cv run.py html teszt.js "<JS-kód>"` (a 3. paraméter **kód**, nem fájlnév) → `shot0.png`.
- Ha a Claude Code desktopban dolgozol: a böngészőpanel a háttérben nem futtat rAF-ot, ezért ott a lejátszási idő nem halad. Szinkron méréseknél kis N-nel dolgozz, mert az eszköznek időkorlátja van.
- Konvenciók: a közös, változó állapot az `R`-en van (`src/runtime.ts`); a projekt a `st` (`src/state.ts`); minden változtatás után `commit()` (undo + automatikus mentés); `main.ts` importsorrend számít (modul felső szintje csak előtte importált modult használhat). Részletek: `app/README.md`.

## 4. Sorrend: a terv A–G szakaszai, az én M-számaim (a felhasználó jóváhagyta, maradhat)
| M | Terv | Állapot |
|---|---|---|
| M1 | A | ✅ közös idő (rögzített lépésű állapot, `sim.ts`, `time.ts`), Loop nélküli továbbfutás, régi projektek migrációja (`migrate.ts`), export-beállítás a projektben |
| M2 | A | ✅ Csoport / Közös alap / Változat / Kapcsolat (`variants.ts`, `variantsui.ts`), projektformátum v4 |
| M3 | B | ✅ jobb gombos találatlista a vásznon (`pick.ts`), Alt+katt; könyvtári kategóriák és keresés (`shelf.ts`, `library.ts`); effektlánc-átrendezés |
| M4 | B | ✅ soronkénti tipográfia (`text.ts` `lines[]`, `textlines.ts` fogantyúk és „Sorok” szekció, sortábla az `mtext` shaderben), „Szerkesztői címlap” recept |
| M5 | B | ✅ mozgásblokk + retime (`retime.ts`, Sávok panel `blockDrag`), kézi Jelzések (J), horgonyok, Eljátszás simítással (`perform.ts`, E) |
| M6 | C | ✅ Gerincfelület (mesh), vásznon szerkeszthető gerinc, csillanás-húzás, Jelenetfény az obj3d/sdfscene-en |
| **M7** | **D** | **következik**: építőelemek (Bolygó/Felhő/Füst/Virág), 2D↔3D, szöveg–forma kapcsolatok, első Részecske Forrás/Megjelenés |
| M8 | E | fizika, mezők, reprodukálható seek/export |
| M9 | F | folyadék: előbb mért kutatási prototípus |
| M10 | G | receptcsalád, Random hatókörök, polírozás |

Minden M-hez van teszt az `app/tests/`-ben (`m1_close`, `m2_variants`, `m3_ux`, `m4_type`, `m5_retime`, `m5_perform`, `m6_mesh`, `m6_spine`, `m6_light`), plusz a régiek. Az egyes M-ek részletes korlátai a `PROGRESS.md`-ben vannak.

## 5. Ahol tartunk: M6 (C szakasz, látványkapu)
- **Döntés (mérve, `prototypes/red-ribbon-webgl/README.md` vége):** a jó minőségű 3D a Velben **mesh-alapú** legyen. Ugyanaz a forma SDF raymarchinggal 183 ms, mesh-ként 3–5 ms 2048×1536-on, M1 Maxon; az SDF ráadásul csíkos. Az SDF csak a meglévő procedurális formákra marad.
- **Kész (0.19.0-m6a):** új réteg `surface3d` = „**Gerincfelület**” (3D Formák polc, kereső: „gerinc”).
  - `src/mesh3d.ts`: geometria a szerkeszthető gerincből (`L.spine`, centripetális Catmull–Rom), lelógó lap lekerekített éllel, keresztirányú hajlítás, csavarodás, padlóba simulás (exp-leülés); pontminta; ezüst perem.
  - Renderelés: tükörkép fél felbontáson (mipmap = elmosás) → fő kép 4× MSAA + mélység (stúdió-háttér, tükröző padló kontaktárnyékkal, mesh) → átmásolás a réteg textúrájába. Ezután a Vel szokásos lánca jön (réteg-fx, keverés, kinézet, tónus).
  - Analitikus stúdiókörnyezet (`ENV` GLSL): ég, hátsó fény, fénycsíkok és csíkos padló sugár–sík metszéssel, az érdesség szerint szélesítve. A mennyezeti csíkok csak a felületeken csillannak (`gStrip`).
  - Paraméterek (`effects/objects3d.ts` `surface3d`): Fő, Forma, Anyag, Fény, Padló és háttér, Kamera csoport. Mind animálható; a kamera (ry/rx/dist/fov/cél) is. A 3D forgatás eszköz (O) működik.
  - Bekötve: `render.ts` (`EFFECTS[type].mesh` → `drawMesh`), `state.ts` (`d.spine` alapérték), `stage.ts` (orbit), `library.ts`, `cost.ts`.
  - Teszt: `tests/m6_mesh.js` (GL-hiba nélkül, vörös pixelek, a szélesség hat, gyorsítótár, animált kamera, gerinc mentése).
  - Ellenőrizve valódi GPU-n (5180; ha foglalt, a launch.json „vel” más portra kerül, pl. 5182): „Filmes” és „Tiszta” kinézettel is jó. Az alapértékeket úgy hangoltam, hogy „Filmes” alatt ne égjen ki (sky 0,95, backI 0,8, expo 0,72, a hátsó fény glóriája 0,18).
- **Kész (0.19.1-m6b):** `src/spinegrips.ts`: gerincpont-fogók a vásznon (a réteg kamerájával vetítve; húzás a kamerával szemközti síkban, Shift: vízszintes sík), üres húzás = kamera cél pásztázása, görgő = kamera távolság (`stage.ts` `pan` mód). A 2D gizmó rejtve mesh-rétegnél (`isSurf`), az inspectorban „Gerinc” szekció (`spineSection`, a `d.groups` ágban). Nem mentett kijelölt pont: `R.spSel`. Teszt: `tests/m6_spine.js`. 21/21 zöld.
- **Kész (0.19.2-m6c):** csillanás-húzás (`glintDrag`, `hitSurface` a `spinegrips.ts`-ben; `R.glint` kapcsoló, `stage.ts` `glint` mód; a `meshFor` a CPU-n tartja a `V`/`idx`-et). Lencsehiba HDR-csillanáson kikapcsol (`gl.ts` POST). 4K mérés: 6,3 ms/kép (animált formával 9 ms), részletek `PROGRESS.md`.
- **Kész (0.20.0-m6, M6 LEZÁRVA):** Jelenetfény (`st.light`, `LIGHTP`/`normLight` a `state.ts`-ben, `lightU`/`lightVals` a `render.ts`-ben mint `setU` az obj3d-n és sdfscene-en; shader uniformok `uLDir/uLEnv/uLCol/uLSoftK/uLSize/uLWrap` az `obj3d` kód elején). UI: `src/lightui.ts` (`lightSection`, `glint3`, `lightFromGlint`), `stage.ts` `glint3` mód. Alapértéken bitre a régi kép. Teszt: `m6_light`.
  - Nyitott (később): a cián pont javítását headlessben nem lehetett előidézni, felhasználói próbán nézd; több fény/fényforma; padlótükör más 3D típusokra.
- Ezután M7 (D szakasz).

## 6. Fontos tudnivalók, csapdák
- **Ne módosíts csendben a projekten** (terv 0.4: „semmi rejtett frissülés”). Például az inspector ne írjon a rétegbe megnyitáskor; ezt egyszer már javítottam (`timingSection`).
- A Változat helyi eltérése mindig **számolt** (`localDiff`), nem nyilvántartott. Ha új mezőt adsz a rétegekhez, és az UI megnyitáskor alapértéket ír, az hamis helyi eltérés lesz.
- Nem mentett, átmeneti mezők `Object.defineProperty(..., {enumerable:false})`-szel: `_lk` (Kapcsolat-horog), `_pv` (eljátszás-előnézet). Az `ev()` (`evaluation.ts`) használja őket.
- A projektfájl v4: `state.bases`, `state.links`, `state.cues`, `state.exp`, `layer.variant`, `text.lines`, `layer.spine`. Régi fájlok megnyílnak (`migrate.ts` + `setShared`).
- A Mindspace nevű MÁSIK projekt (`~/Documents/claudecoding`) `.claude/launch.json`-jában van két indítókonfig („vel” az 5180-as, „ribbon” az 5181-es porton), commitolatlanul. Ez a felhasználó másik projektje, abban ne dolgozz.

## 7. Átadó formája a felhasználónak (mérföldkőnél)
Néhány rövid bekezdés: mi lett kipróbálható; 2–4 lépéses próba; milyen teszt ment át (szám); mi a korlát; a build útvonala (`app/dist/index.html`). Utána frissítsd a `PROGRESS.md`-t és ezt a fájlt, majd commit.

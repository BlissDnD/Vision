# Handoff — Látomás Stúdió — 2026-10-17 12:50
**Agent:** Claude (claude.ai, felhős munkamenet, Claude Code-alapú)
**Mérföldkő:** A feature-lista 2. mérföldköve kész. Mind headless Chromiumban tesztelve: shaderek, receptek, polcok, inspektor, mentés és betöltés, kulcskocka-motor.
- Kulcskockák görbeszerkesztővel (C7)
- 3D láthatóság (B1)
- Többsoros, igazított szöveg
- Új átmenetek (C8)
- Bolygó rétegekre bontása (A4)

## Jelenlegi állapot
- **Élő verzió:** https://claude.ai/artifact/Pz6ZmknNeR6v9vYY82kDm5 (artifact 3. verzió = app v10, `downloads` capability, contract 0.2.84).
- **Forrás:** `muchdesigner/latomas.html`, kb. 3100 sor. Előző állapotok: `latomas.v8.html` (eredeti), a v9 állapot csak az artifact előzményeiben van meg.

### Kulcskockák (C7)
- **Adatmodell:** bármely csúszka-paraméter (`L.p.*`, `L.n.*`) kaphat `k:[{t,v,e,z?,w?,bz?}]` tömböt. Az `e` a kulcsból induló szakasz görbéje: a `KEY_EASES` 0–11 elemei az `EASE_NAMES`, 12 = egyedi rugó (`z` csillapítás, `w` merevség), 13 = egyedi Bézier (`bz`).
- **Kiértékelés:** `ev()` → `keyVal()`, így kulcs, LFO és jel összeadódik. A selectek és a színek nem kulcsozhatók.
- **Segédfüggvények:** `hasK`, `keyIdx`, `setKey`, `delKey`, `setVal` (kulcsos paraméternél az aktuális időpontra ír kulcsot, egyébként a `.v`-t), `curV`, `toggleKey`, `seekTo`.
- **UI:**
  - ◆ gomb minden animálható csúszkán és az Elhelyezés mezőin.
  - Görbe-gomb a kulcsozott csúszkán. A `keyEditor` grafikont, kulcslistát, idő és érték mezőt, görbeválasztót, rugó-csúszkákat és Bézier-padot ad (fogantyúk + előbeállítások).
  - Az Elhelyezésben X/Y/Méret/Szög görbe-csipek vannak.
  - Az idővonalon gyémántok jelölik a kulcsokat.
  - Billentyűk: K = elhelyezés-kulcs (x, y, s, r), `,` és `.` = előző és következő kulcs.
  - A vásznon húzás, a görgetés és az orbit kulcsozott paraméteren kulcsot ír.
- `mkN` megőrzi a `k`-t, `isIdentity` figyeli a kulcsokat (csoport-transzform).

### 3D láthatóság (B1)
- A 3D polc „Szerkeszthető jelenet” blokkal kezdődik: üres jelenet, SDF-szobor, Kristálytorony, Hóember, CSG-kocka. Utána jönnek a kész testek.
- Az `sdfObjectsSection` tetején 4 lépéses tipbox áll.
- 3D réteg kijelölésekor az O eszköz gombja kiemelődik (`.hint3d`).

### Többsoros, igazított szöveg
- A `text` és az `mtext` is többsoros lett: Enter a feliratban, vagy automatikus tördelés (`T.wrap` karakter/sor).
- `T.align`: left/center/right. A réteg horgonya a bal szél, a közép vagy a jobb szél.
- `T.lh`: sortávolság.
- Működés: a textúra soronként 2 aux-sort kap. A `uAux2` = (sorok száma, felső margó/h, sorsáv/h, blokk-magasság sorokban). A GLSL `TXUV()` a HEAD-ben van.
- Új Animált szöveg egység: „Sor” (`unit` 2).
- Az Alsó harmad recept balra zárt lett.

### Átmenetek (C8)
- Az Átmenet réteg új módjai (7–11):
  - 7: Forma-morph (kör → lekerekített doboz → teljes kép, fényes peremmel)
  - 8: Átrepülés (zoom-through)
  - 9: Betolás rugóval (sebességarányos elmosással)
  - 10: Átlós seprés
  - 11: Panelek nyílása
- A rugós túllövés megmarad (`eo`).

### Bolygó szétbontása (A4)
- A `planet` új „Réteg” paramétere (`part`):
  - 0: teljes
  - 1: felszín
  - 2: felhőhéj
  - 3: légkör
  - 4: gyűrű hátsó fele
  - 5: gyűrű első fele
- Recept: „Bolygó rétegekből” (`PLA` közös paraméterkészlet).

### Új recept
- „Kulcskockás repülés”: kártya kulcsokkal (rugó, Bézier), soronként rugós felirat.

## Utolsó döntések (és miért)
- **A kulcsok a paraméterobjektumban élnek** (`n.k`), nem külön sávban. Így a meglévő mentés, visszavonás, klónozás és recept-rendszer változtatás nélkül viszi őket, és minden paraméter automatikusan kulcsozható.
- **A görbe a kulcsból induló szakaszhoz tartozik** (AE-szerű). Az egyedi rugó és a Bézier kulcsonként tárolódik.
- **A többsoros szöveghez soronkénti aux-sorok** kellettek, nem 2D-s térkép. Az oszlop-alapú betűazonosítás megmaradt, csak soronként.
- **A bolygó szétbontása egy paraméter, nem öt új effekt.** Egy shader, egy közös paraméterkészlet, és a rétegek egymás fölé rakva pontosan a teljes bolygót adják ki.

## Nyitott kérdések / ismert hibák
- Valódi GPU-n, valódi betűtípusokkal és valódi egérhasználattal nem teszteltük (a Bézier-pad és a görbeszerkesztő kattintásai csak szintetikus eseményekkel futottak).
- A kulcsok idejét csak a görbeszerkesztőben lehet állítani; az idővonalon a gyémánt nem húzható. Következő lépés: húzható gyémántok és réteg-sávok az idővonalon.
- A gizmo középpontja balra vagy jobbra zárt szövegnél a horgonyon van, nem a szöveg közepén.
- Előző handoffból még nyitott: a hangsávos MP4 élesben, a rugók érzete, a Sivatag és a Vihar receptek finomhangolása, és a nem reprodukálható `Shader: particles` figyelmeztetés.

## Következő lépés
1. Felhasználói teszt a v10-en: kulcskockák (◆, K, görbeszerkesztő), 3D polc, új átmenetek.
2. Idővonal 2.0: rétegsávok, húzható kulcsgyémántok, kulcsok másolása és beillesztése, több kulcs kijelölése.
3. 2,5D kamera mélységélességgel (C9), utána a 0. fázis (Vite + TS, `run2.py` CI).

## Érintett fájlok
- `muchdesigner/latomas.html` (módosítva). Új jelölők és függvények:
  - `/* ----- keyframes … */` a Text & media szekció előtt,
  - `textLines`, az új `textTex`,
  - `TXUV` és `uAux2` a GLSL HEAD-ben,
  - `PLA` és az új receptek a `RECIPES` végén,
  - a 3D polc fejlécei,
  - a CSS-ben `.kb`, `.ked`, `.kgraph`, `.bez*`, `.tl-key`, `.tipbox`, `.hint3d`.
- `muchdesigner/latomas-feature-lista.md`: a 2. mérföldkő pontjai kész.

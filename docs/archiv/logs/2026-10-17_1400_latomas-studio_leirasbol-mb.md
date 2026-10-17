# Handoff — Látomás Stúdió — 2026-10-17 14:00
**Agent:** Claude (claude.ai, felhős munkamenet, Claude Code-alapú)
**Mérföldkő:** Elkészült a nagyítható, többes kijelölésű Sávok panel, a mozgási elmosás az exportban és a „Leírásból animáció” (`sample` capability). A headless tesztek rendben, konzolhiba nincs. Az élő Claude-hívás nem tesztelhető headless módban.

## Jelenlegi állapot
- **Élő verzió:** https://claude.ai/artifact/Pz6ZmknNeR6v9vYY82kDm5 (artifact 5. verziója = app v12). Capabilities: `downloads`, `sample`. Contract 0.2.84.
- **Forrás:** `muchdesigner/latomas.html`.

### Sávok panel
- **Időbeli nagyítás:**
  - −, + és ↔ (teljes hossz) gombok az időskála fejlécében.
  - Ctrl/⌘ + görgetés a kurzor körül nagyít.
  - Shift + görgetés vagy vízszintes görgetés pásztáz.
  - Nagyított állapotban görgetősáv jelenik meg alul.
- **Többes kijelölés:**
  - Shift + kattintás a gyémántokon.
  - Keretes kijelölés: húzás üres sávterületen, több soron át is. Shift-tel hozzáad.
  - Ctrl/⌘ + A kijelöli a kijelölt réteg (vagy az összes) kulcsait.
  - Esc törli a kijelölést.
- **Műveletek a kijelöléssel:**
  - Húzás: az összes kijelölt időpontot együtt tolja, rétegeken át. Alt + húzás másol.
  - Delete törli a kijelölt kulcsokat.
  - Ctrl+C / Ctrl+V relatív időkkel működik. Egy rétegről másolva a kijelölt rétegre illeszt, több rétegről másolva az eredeti rétegekre (azonosító szerint), a lejátszófejtől.
- **Kód:** `tlxSels` (tömb), `tlxView`, `viewAB`, `setView`, `zoomView`, `laneT`, `laneDown` (keretes kijelölés vagy ugrás), `deleteSelKeys`, `itemById`, `isSelK`. Az egyszeres `tlxSel` megszűnt.

### Mozgási elmosás (export)
- Az Exportálás popoverben új „Mozgási elmosás” (nincs, 8, 16 vagy 32 részkép) és „Zárszög” (90°, 180°, 270°, 360°) választó van. Az `EXP.mb` és az `EXP.sh` tárolja.
- Működés: a `renderMB(ctx, t, fps, N, zárszög)` N részképet renderel a zár-intervallumban, és float célba átlagolja (CONSTANT_ALPHA blend, 1/N súly). Ezt használja a videó és a PNG export is.
- A feedback (Visszhang) rétegek részképenként lépnek, ezért a csóvák rövidebbek. Ezt a UI jelzi.

### Leírásból animáció
- Fejléc-gomb: **Leírásból**. Csak akkor látszik, ha a `claude.use('sample')` nem `null`.
- A modalban megadható a leírás, a hossz és a cél (hozzáadás a jelenethez vagy csere). Van Leállítás gomb, élő státusz, és magyar hibaüzenetek kódonként.
- **Prompt:** `descPrompt()`, kb. 13 KB. Tartalmazza:
  - a JSON-sémát,
  - a koordinátarendszert,
  - a maszkolást,
  - az easing-, mozdulat- és paletta-indexeket,
  - a recept-neveket,
  - a teljes effekt-katalógust paramétertartományokkal (`descCatalog()`).
- A `sample.json` hívás `cache:false`, alapértelmezett modell-szinttel.
- **Építés:** a `buildFromSpec(spec)` mindent ellenőriz és szűr (ismeretlen effekt kimarad, értékek a tartományba vágva, kulcsok és selectek kerekítve). Egy csoport készül, opcionálisan alá kerül egy alap recept, a kamera beállítódik, és az `st.dur` is. Az eredmény egyetlen ⌘Z-vel visszavonható.
- Kihagyott effektek: `DESC_SKIP` (custom, blob, sky, obj3d, gyroid, ascii).

## Utolsó döntések (és miért)
- **JSON-specifikáció tool-hívások helyett.** Egy kör, olcsóbb és gyorsabb. A validálás a lapon történik, így hibás válaszból sem lesz törött projekt.
- **A katalógus a promptba kerül.** Így a modell csak létező kulcsokat és tartományokat használ. Mérete bőven a 256 KB-os limit alatt van.
- **A mozgási elmosás akkumulációs**, nem sebességvektoros. Pontos és minden effekttel (shader, részecskék, kamera) működik; az ára a renderidő.

## Nyitott kérdések / ismert hibák
- A „Leírásból” élesben még nincs kipróbálva (a headless környezetben nincs `sample`). Visszajelzés kell a minőségről; a prompt (`descPrompt`) finomhangolható.
- Mozgási elmosásnál a determinisztikus, időfüggő effektek pontosak, a blob-követés és a feedback viszont állapotfüggő.
- Előzőekből nyitott: a hangsávos MP4 élesben, a rugók érzete, a Sivatag és a Vihar receptek, a gizmo középpontja balra zárt szövegnél, a mélységkompenzált méret.

## Következő lépés
1. Felhasználói teszt: Leírásból (2–3 különböző leírással), mozgási elmosásos export, Sávok nagyítás és keretes kijelölés.
2. Ha a Leírásból bevált: „Módosítás leírással” a kijelölt csoportra (a meglévő spec visszaküldése a promptban).
3. 0. fázis: Vite + TS, `run2.py` CI. A kód mostanra kb. 3400 sor egy fájlban, ideje szétbontani.

## Érintett fájlok
- `muchdesigner/latomas.html` (módosítva). Új blokkok:
  - a `tracks2` kód a „tracks panel” helyén,
  - `renderMB` és `EXP.mb`/`sh` az Output szekcióban,
  - `/* ================= Leírásból animáció … */` a Keyboard előtt,
  - HTML: `#descBtn`,
  - CSS: `.tlx-zb`, `.tlx-marq`, `.tlx-scroll`.

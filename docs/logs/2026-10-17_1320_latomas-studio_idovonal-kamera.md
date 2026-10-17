# Handoff — Látomás Stúdió — 2026-10-17 13:20
**Agent:** Claude (claude.ai, felhős munkamenet, Claude Code-alapú)
**Mérföldkő:** Sávos idővonal (Idővonal 2.0) és 2,5D kamera (C9) kész. Headless tesztek rendben: kulcsmozgatás, másolás, beillesztés, kamera, mentés és betöltés, visszavonás, regresszió. Konzolhiba nincs.

## Jelenlegi állapot
- **Élő verzió:** https://claude.ai/artifact/Pz6ZmknNeR6v9vYY82kDm5 (artifact 4. verziója = app v11).
- **Forrás:** `muchdesigner/latomas.html`.

### Sávos idővonal
- Az idővonal-sáv bal szélén van a **Sávok** gomb. Kattintásra a vászon fölött panel nyílik: minden rétegnek saját sávja van, a nyitott csoportoké behúzva, fölötte időskála, rajta a lejátszófej. A nyitott/zárt állapotot a `localStorage` `latomas2.tlx` kulcsa őrzi.
- A sávon látszanak az időzítés-szakaszok (belépés, kilépés, `mtext`, bento belépés/átrendeződés/bezáródás, átmenet) és a kulcsgyémántok (rétegenként időpont szerint összevonva).
- **Interakciók:**
  - Gyémánt húzása: a réteg összes kulcsát áthelyezi abban az időpontban. Alt + húzás másol.
  - Szakasz húzása: eltolja a hozzá tartozó időzítés-mezőt (`start`, `outAt`, `morphAt`, `at`, `tm.inAt`/`outAt`).
  - Igazítás (snap): lejátszófej, 0, vég, más kulcsok, ütemek (ha van hang), különben 1/30 mp. Shift = szabad.
  - Kattintás a sávon: ugrás az időpontra. A névre kattintva kijelöli a réteget.
  - A kijelölt gyémántra: Delete törli a kulcsokat, Ctrl+C másolja, Ctrl+V a lejátszófejhez illeszti be a kijelölt rétegre (útvonal szerint, pl. `n.x`, `p.size`).
- **Kód:** `layerSegs`, `layerKeyTimes`, `keysAt`, `moveKeys`, `copyKeys`/`pasteKeys` (`keyClip`), `renderTracks`, `trackRows`, `snapT`, `keyDrag`, `segDrag`, `tlxSel`. A `renderTimeline` ugyanezt a `layerSegs`-et használja az alsó sávhoz.

### 2,5D kamera (C9)
- Minden rétegnek új BASE paramétere a **Mélység (Z)** (`n.z`, -1,5…8). Kulcsozható, az Elhelyezésben van.
- **Kamera gomb** az idővonal-sávon (`openCam` popover). Paraméterek (kulcsozhatók): X, Y, Zoom, Fókusztáv, Élességi sík, Blende, Döntés.
- `st.cam` (`mkCam`/`normCam`). Benne van a snapshotban, a visszavonásban, a projekt-JSON-ban és a bootban.
- **Matematika:** k = f/(f+z), képernyő = ((pos − kamera)·k·zoom), ehhez jön a döntés. A réteg a kamera mögé kerül, ha f+z ≤ 0,05; ilyenkor rejtett.
- **Mélységélesség:** a blende arányában, |z − fókusz|·k szerint automatikus Gauss-elmosás a réteg kimenetén (`dofLayer`, cache-elt blur réteg).
- **Hatókör:** minden nem-szűrő levélrétegre hat, csoportokon belül is. A csoport saját transzformja nem kap kamerát (dupla parallaxis ellen). A bélyegképekre nem hat (`ctx.noCam`). A gizmo és a vásznon húzás figyelembe veszi.
- **Recept-szintű kamera:** az `R.cam` (és opcionálisan `R.dur`) a recept hozzáadásakor beállítódik (`addFromLib`). Új recept: „Parallax-repülés” (Mozgás polc).
- **Sávok:** bekapcsolt kameránál a Sávok panel első sora a Kamera, a kulcsai ott húzhatók.

### Javítás
- A boot „shader-melegítő” kihagyja a kód nélküli (points) effekteket. Ez okozta a korábbi `Shader: particles` figyelmeztetést.

## Utolsó döntések (és miért)
- **A kamera egy globális 2,5D transzform, nem valódi 3D.** Illeszkedik a rétegalapú 2D compositinghez, olcsó (JS-ben számolt uOff/uScale), és minden meglévő effekttel működik. A rétegek sorrendje továbbra is a rétegfa sorrendje (nincs automatikus mélység-rendezés), mert a vágómaszkok a sorrendre épülnek.
- **A mélységélesség a meglévő blur effektet használja** a réteg láncának végén. Nincs új shader, és exportban determinisztikus.
- **A kulcsgyémánt a sávon időpont szerint összevont.** A húzás a réteg összes paraméterét viszi együtt, mint az AE „összes kulcs” sávja. Paraméterenkénti kulcsok a görbeszerkesztőben állíthatók.

## Nyitott kérdések / ismert hibák
- Valódi egérrel és GPU-n nem teszteltük.
- A mélységélesség nagy blendénél több réteggel drága lehet: rétegenként +2 blur menet.
- A Sávok panelen nincs nagyítás vagy görgetés az időben (mindig a teljes hossz látszik), és nincs több kulcs egyszerre kijelölése.
- A teljes képet adó forrásrétegek (gradient, space) mélyre téve kisebbnek látszanak. Ilyenkor a Méretet kell növelni (a receptben `s:3`). Lehetne egy „mélységkompenzált méret” kapcsoló.
- Előzőekből nyitott: a hangsávos MP4 élesben, a rugók érzete, a Sivatag és a Vihar receptek, a gizmo középpontja balra zárt szövegnél.

## Következő lépés
1. Felhasználói teszt: Sávok (húzás, Alt-másolás, Ctrl+C/V), Kamera popover, Parallax-repülés.
2. Lehetséges következő kör:
   - időbeli nagyítás és többes kijelölés a Sávokon,
   - „mélységkompenzált méret”,
   - mozgási elmosás az exportban (8–16 részkép),
   - üvegkártya UI-elem,
   - „Leírásból animáció” (`sample` capability).
3. Ezután a 0. fázis (Vite + TS, `run2.py` CI).

## Érintett fájlok
- `muchdesigner/latomas.html` (módosítva). Új jelölők és függvények:
  - `/* ----- 2.5D camera … */` a Rendering szekcióban (`CAMP`, `mkCam`, `normCam`, `camXf`, `camApply`, `dofLayer`, `openCam`, globális `CAMON`),
  - a timeline-blokk (`layerSegs` … `segDrag`) a régi `renderTimeline` helyén,
  - HTML: `#tlx` panel, `#tlxBtn`, `#camBtn`,
  - CSS: `.tlx*`.

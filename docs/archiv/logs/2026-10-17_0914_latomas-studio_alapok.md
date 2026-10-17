# Handoff — Látomás Stúdió — 2026-10-17 09:14
**Agent:** Claude (claude.ai, felhős munkamenet, Claude Code-alapú)
**Mérföldkő:** A fejlesztési terv mind a négy irányának alapja kész, publikálva, headless Chromiumban tesztelve (minden shader fordul, minden recept renderel).

## Jelenlegi állapot
- **Élő verzió:** https://claude.ai/artifact/QM96xf5H6BxrPTy9r5B1u3 (8. verzió). Egyetlen HTML-fájl, kb. 2650 sor, WebGL2, nincs build-lépés. Forrás a projektben: `latomas/latomas.html`.
- **Fejlesztési terv (a "miért"):** Claude Docs dokumentum „Látomás Stúdió – fejlesztési terv”, https://claude.ai/code/artifact/405b3bff-e2f3-4619-b469-135bc68a06b1. Négy modul egy közös magon, ütemterv 0–4. fázissal és kapukkal.
- **Ami már korábban is kész volt:** rétegfa csoportokkal és vágómaszkkal, ~50 effekt (források, szűrők, Blob-követés), receptek makró-vezérlőkkel, Kinézet (ACES/AgX, bloom, halation, szemcse), Véletlen generátor (20 hangulat × 10 tengely, seed), terhelésjelző, automatikus előnézeti felbontás, 4K PNG, képkockánkénti MP4 (WebCodecs + mp4-muxer 5.2.2 a jsDelivr-ről), PBR 3D (`obj3d`).
- **Ebben a mérföldkőben elkészült alapok:**
  - **Világ-csomagok:** `planet` (7 típus, légkör, felhők, városfények, gyűrű árnyékkal, seed), `sky` (Bliss: napszak, 4 felhőtípus, dombok, pára, sugarak), `space` (csillagszínek, Tejút porsávokkal, köd, tüskés csillagok), `bokeh`. A seed-csúszkák mellett kocka-gomb van. Új „Világok” polc, 7 új recept (Szaturnusz napnyugtakor, Óceánbolygó holddal, Jégvilág, Lávabolygó, Csillagközi tájkép, Bliss-dombok, Arany naplemente).
  - **Jelek (TouchDesigner-irány):** a „Hang” gomb hangfájlt vagy stem-eket tölt be. Elemzés OfflineAudioContext-szűrőkkel 100 Hz-es burkolókra: hangerő, kick, pergő, hihat, basszus, közép, magas. BPM- és fáziskeresés autokorrelációval (szintetikus 120 BPM-es teszten pontos). Ütem-jelek (ütem, fél ütem, ütem/4, fázis) hang nélkül is működnek. Jelet csúszkára húzással vagy a hullám-ikon paneljén lehet kötni (`n.s` kulcs, `n.sa` erősség), és az `ev()` minden paraméternél figyelembe veszi. A lejátszás az AudioContext órájához szinkronizál. Az MP4-be AAC kerül (Opus tartalékkal).
  - **Részecskék:** `particles` réteg GL_POINTS-szal (65–262 ezer pont). Az alatta lévő képből vagy saját képből mintavételez, a fényességből mélység lesz. Szétszóródás, áramlás, hullám, remegés, 3D dőlés és forgás. Állapotmentes (determinisztikus az exporthoz). Polc: „Részecskék”.
  - **Mozgás:** idővonal-sáv a vászon alján (ugrás, hossz, ismétlés, ütemvonalak). Rétegenkénti „Időzítés” (belépés/kilépés 8 mozdulattal, 5 görbével; `L.tm`). `mtext` animált szöveg betűnként vagy szavanként (karakter-térkép textúra `uAux`-ban): 7 mozdulat, 4 sorrend, színátmenet, fényes sáv vagy kiolvasás. `reveal` átmenet-szűrő 7 típussal (be, ki, be és ki). Polc: „Mozgás”. Receptek: Cinematic cím, Kiolvasó felirat, Belépő világ. Export opció: „Idővonal” hossz.
  - **3D:** `sdfscene` szerkeszthető jelenet. Legfeljebb 8 alapforma (gömb, doboz, tórusz, henger, kapszula, oktaéder) hozzáad/kivon/metsz művelettel, olvadással és palettaszínnel. Vásznon húzás mozgat, a fogantyúk méreteznek és forgatnak (vetítés JS-ben: `sdfProj`, `primDrag`). Az O eszközzel a kamera kering. Receptek: SDF-szobor, Kristálytorony.
- **Mentés:** projektállapot `localStorage`-ban (`latomas2.auto`, `latomas2.saved`) és JSON-fájlban. A hangfájl NEM kerül a projektbe (méret miatt), újra be kell tölteni.

## Utolsó döntések (és miért)
- **Maradt egyetlen HTML.** A Vite + TypeScript modulokra bontás (terv 0. fázis) a következő agent dolga. Most gyorsabb volt az alapokat a meglévő magra tenni és élesben tesztelni.
- **A jelek „mintavételezett burkolók”, nem élő FFT.** Determinisztikus, ezért a képkockánkénti export pontosan szinkronban van a zenével. Élő mikrofon és MIDI az artifact-sandboxban nem érhető el.
- **A forrásszétválasztás (Demucs) helyett stem-ek.** A felhasználó Abletonnel dolgozik, onnan pontosabb és ingyen van.
- **A részecskék állapotmentesek** (pozíció = f(kezdőpont, idő, jelek)). Nincs ping-pong szimuláció, ezért nincs valódi fizika (rugó, ütközés), viszont exportban determinisztikus.
- **A 3D SDF-alapú, nem háromszögháló.** Illik a raymarch motorhoz, és nem lehet „elrontani” a topológiát. Max. 8 objektum uniform-tömbben.
- **Az `mtext` pixelenként a saját oszlopának betűjét mintavételezi.** Gyors és egyszerű, de vízszintesen elmozduló betűk levágódnak (lásd ismert korlátok).

## Nyitott kérdések / ismert hibák
- Valódi GPU-n nem teszteltük: a teszt SwiftShaderrel futott. Valódi Chrome-ban ellenőrizni kell a teljesítményt (`sdfscene` + 4× élsimítás, `particles` 262k, `planet` nagy méretben).
- A WebCodecs-exportot (VideoEncoder, AudioEncoder, mp4-muxer) a teszt nem tudta lefuttatni: a set_content oldal nem biztonságos környezet, és a CDN nem volt elérhető. A kód az előző, működő exportra épül, de **a hangsávos MP4-et élesben ki kell próbálni**, főleg AAC vs. Opus tartalék Linuxon.
- `mtext`: egysoros. Vízszintes elmozdulás (szétszóródás) csak függőlegesen működik, a pattanás túllövése a betű oszlopán túl levágódik. Elmosásnál a szomszéd betű képpontjai is beszivároghatnak.
- Stem-ek esetén, ha fő mix is van, csak a fő mix szól (szándékos, hogy ne duplázódjon).
- A `reveal` „Be” módban a kezdés előtt fekete a kép. Ez szándékos, de egy „átlátszó” mód hasznos lenne réteg-szintű átmenethez.
- Az idővonal ismétlésekor a feedback-hurkok törlődnek (szándékos), az LFO-k nem loopolnak varrat nélkül.
- A projekt JSON nem tartalmazza a hangot. Megoldás: IndexedDB vagy az `assets` capability.
- A 3D jelenet objektumait nem lehet animálni (csak a kamerát és a paramétereket).

## Következő lépés
1. **0. fázis – közös mag:** a HTML szétbontása Vite + TS modulokra a fenti szekciók mentén (lásd lent). Meglévő viselkedés megtartása, a `t/run2.py`-hoz hasonló automata teszt átvétele CI-be. Kapu: minden mostani funkció fut az új magon.
2. **Jelek bővítése:** jel-modulátor beállítások (sima/ütés, görbe, felfutás/lecsengés), „Kapcsolatok” nézet (mi mire van kötve), hang-hullámforma az idővonalon, hang mentése IndexedDB-be.
3. **Mozgás:** valódi kulcskocka-szerkesztő bármely paraméterre (az `n` objektumok mellé `k:[{t,v,ease}]`), többsoros és tördelt `mtext` betűnkénti quaddal (instancing, MSDF-atlasz), mozgási elmosás az exportban (8–16 részkép), üvegkártya UI-elem, jelenetek (shot-ok) közti átmenetek, „Leírásból animáció” a `sample` capability-vel.
4. **Világ-csomagok mélyítése:** térfogati felhők (raymarch) az égbolthoz, fizikai lencsefény-labor, víz/óceán és terep csomag, csomagonként 5–10 recept.
5. **3D:** glTF import three.js-szel (külön kontextus, textúraként be a rétegrendszerbe, mélységgel), SDF → háló export (marching cubes → GLB), Z-mélységű kompozitálás közös kamerával (2,5D rétegek), objektum-animáció. Egyeztetni kell a hub 3D modellezőjével (közös motor).
6. Döntendő kérdések a terv-dokumentum végén.

## Érintett fájlok
- `latomas/latomas.html` — a teljes alkalmazás. Szekciók (`/* ================= … */` jelölők sorrendben): Palettes, GLSL (HEAD + `easeF`), Effect library (`EFFECTS`: minden effekt `params`, `main`, `code`, opcionális `lib`, `setU`, `points`, `groups`), WebGL core (COMP/SHOW/COPY/XFORM, `sdfscene` kód-összeállítás az `obj3d` kódjából), State (`makeLayer`, `normalize`, `st`), Macros, Recipes (`RECIPES`), Library (`LIB`, `CATS`), Evaluation (`ev`, `wave`), Text & media (`textTex` + `auxTex`), Blob tracking, Cost estimate, Rendering (`setXform`, `behav`, `drawPoints`, `renderList`, `present` utófeldolgozással), Thumbnails, Shelf UI, Item ops, Layers UI, Inspector (`timingSection`, `sdfObjectsSection`), History & persistence, Stage (gizmo, `sdfProj`, `primDrag`), Transport, Signals (`AUD`, `sigVal`, `loadAudioFile`, `openAudio`), Timeline, Adaptive resolution, Main loop, Popovers, Output (`snapPNG`, `renderVideo` hanggal), Random generator, Modals, Keyboard, Boot.
- Bővítési szabály: új effekt = új kulcs az `EFFECTS`-ben (`fx()`, előszorzott RGBA kimenet), + `LIB` bejegyzés, + `COST` érték, + opcionálisan recept. A paraméterek automatikusan uniformok lesznek (`p_<kulcs>`), és automatikusan animálhatók, illetve jelre köthetők.
- Teszt: `latomas/tools/run2.py` (Playwright + `/opt/pw-browsers/chromium`, `--use-angle=swiftshader`). Használat: `python3 run2.py latomas.html teszt.js [képernyőkép-js…]`, ahol a teszt.js egy kiértékelt kifejezés (pl. végig az `EFFECTS`-en `getProg()`-gal, `RECIPES` renderelése `renderScene`-nel, `renderThumb` minden `LIB` elemre).

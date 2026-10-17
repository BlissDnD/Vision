# Vel – átadó a folytatáshoz (2026-10-17 késő este)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.21.0-m7a**, a teljes tesztkör (23 teszt) zöld, minden commitolva. A felhasználó egyetlen mérföldkövet sem próbált még ki. Az M7 (D szakasz) első szelete kész. **A következő szelet jóváhagyásra vár.**

## Mire vár jóváhagyás (ne kezdd el nélküle)
A felhasználónak ezt javasoltam, válasz még nincs:

> **M7b / D – Felhő + Lufi.** A felhasználó behúz egy önálló, puha, megvilágított **Felhő** Forrást (nem egész égbolt): mozgatja/méretezi, állítja az alakot (gomoly/lapos/tornyos), sűrűséget/puhaságot, részletességet, gomolygást (ki/be), látványbeli szelet. Ráhúzza a **Lufi** Megjelenést: a „Felfújtság” csúszkával a felhő felfújt, fényes, gumiszerű testté válik; szín, fényesség; a Jelenetfény csillanása rajta, csillanás-húzással; a gomolygást kikapcsolva álló lufi-asset lesz.
> **Megépítem:** Felhő Forrás valódi 3D alakkal (a felhő és a lufi ugyanabból az alakból), Lufi Megjelenés célkompatibilitás-jelzéssel, Jelenetfény + csillanás-húzás rajta, undo/mentés/export-egyezés.
> **Nem:** térfogati szimuláció, fizikai szél (E), Füst (következő szelet, közös motorral), Lufi szövegre/2D formára (Térbeliség kell), padlótükör. Kockázat: a raymarching ára; mérem.
> **Próba:** „felhő” → Felhő; Megjelenések → Lufi a rétegre; Felfújtság fel, mozgás ki; csillanás húzása. Előtte/utána kép, frame-idő 1080p/4K, mentés/újranyitás, export = ugrás.

Nyitott kérdés is van: a **könyvtár áthelyezése balra, a rétegek fölé, húzható elválasztóval** (B szakasz, kis szelet) jöjjön-e előbb, külön.

## Mi történt legutóbb
- Funkcióleltár készült a teljes átadó ellen (`FUNKCIO-LELTAR.md`). Kiderült: sok kért funkció hiányzik vagy csak részben van meg; a korábbi „M6 lezárva” túlzás volt (a C szakasz csak részben teljesül).
- A mappák rendezve (`CLAUDE.md` mappatérkép). A `muchdesigner/` gyökeréből a duplikátumok a Kukába kerültek (`~/.Trash/muchdesigner-duplikatumok-2026-10-17`), az új leírások a `docs/spec`, `docs/referenciak`, `docs/archiv` mappákba.
- A Vel saját `.claude/launch.json`-t kapott („vel” 5180, „ribbon” 5181).

## M-szeletek és az A–G terv (technikai szeletek, nem kész termékszakaszok)
| M | Terv | Technikai tartalom | Termékszakasz |
|---|---|---|---|
| M1 | A | közös óra (`sim.ts`, `time.ts`), Loop nélküli továbbfutás, migráció (`migrate.ts`), export-beállítás | A részben (UX-próba hiányzik) |
| M2 | A | Csoport / Közös alap / Változat / paraméter-Kapcsolat (`variants.ts`, `variantsui.ts`) | Kapcsolatok csak részben |
| M3 | B | jobb klikkes találatlista (`pick.ts`), könyvtárkeresés (`shelf.ts`, `library.ts`), effektsorrend | könyvtár rossz helyen |
| M4 | B | soronkénti tipográfia (`textlines.ts`, `text.ts`) | gazdag tipográfia hiányzik |
| M5 | B | mozgásblokk-retime (`retime.ts`), J-jelzések, x/y Eljátszás (`perform.ts`) | jelzés-hozzárendelés, paraméter-felvétel hiányzik |
| M6 | C | Gerincfelület (`mesh3d.ts`, `spinegrips.ts`), Jelenetfény (`lightui.ts`, `render.ts` `lightU`) | anyagkatalógus, több fény hiányzik |
| M7a | D | Részecske Megjelenés `pdisp` (`partfx.ts`) | a D többi része hátra |
| M8–M10 | E/F/G | fizika és mezők; folyadék; receptcsalád, Random | nincs elkezdve |

A modulonkénti technikai jegyzetek: `app/README.md` („Újabb modulok” szakasz). Mérések és próbalisták: `PROGRESS.md`.

## Hátralévő D-lista (M7)
Felhő + Lufi (javasolva) → Füst → Virág/ornament → a Bolygó feljavítása → szöveg gömbön/hengeren (élő szöveg) → Térbeliség első próba → Részecske Forrás saját emitterrel → érthető kapcsolatok (javaslat, panel). A teljes, nem D-hez tartozó hiánylista: `FUNKCIO-LELTAR.md`.

## Ismert apróság
- A „Filmes” lencsehiba okozta cián pontot (fényes csillanáson) headlessben nem lehetett előidézni; a javítás után a felhasználói próbán érdemes megnézni.

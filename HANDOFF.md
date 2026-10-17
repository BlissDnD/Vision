# Vel – átadó a folytatáshoz (2026-10-18)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.23.0-u1**, a teljes tesztkör (25 teszt) zöld, minden commitolva. Az **U1 (Animálás és jobb panel)** kész, headless tesztekkel demonstrálva; **a felhasználó maga végzi az élő próbát** (próbalista: `PROGRESS.md` legfelül). A felhasználó kérése: élő böngészős ellenőrzést ne futtass, csak szólj, ha kész.

## Mire vár jóváhagyás (ne kezdd el nélküle)
**Sorrend:** U1 ~~kész~~ → **U2** → U3 (UI-frissítés a teljes munkatéren) → S1 (Jelenetek + átmenetek + komponensek, külön javaslat) → videóexport memóriabiztonsága → D-lista (Füst …) → E.

> **U2 / B – Szövegsor és Eljátszás-alakfelismerés (javaslat, még részletezendő a 13. fejezet mintájára, mielőtt indul).**
> **A felhasználó ezt tudja majd:** a szöveg egy sorát magát fogja meg és húzza (nincs külön fogantyú); Cmd+húzással a sor külön mozog; a sorok nem takarják ki egymást (a betűk egyszerűen egymás fölé/mögé kerülnek az eredeti sorrend szerint). Eljátszásnál a rajzolt körből tiszta kör, egyenesből egyenes, ívből ív lesz (alakfelismerés), máskor kevés pontú sima görbe. LFO-hullám körbeérése a projekt hosszára (varratmentes loop).
> **Ebben még nem:** Jelenetek (S1), munkatér-átrendezés (U3).

## Mi történt legutóbb
- U1: Animálás mód (A), mozgáspálya húzható pontokkal, Sávok paramétersorokkal / nyújtással / görbe-gyorsmenüvel, ◆ ∿ ♪ ⇢ ▭ jelek, jobb panel ikonfülekkel, Eljátszás első mozdulatra indul bármely paraméterrel; 8 kulcskocka-hiba javítva (lista: `PROGRESS.md`). Technikai jegyzet: `app/README.md` „U1”.

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
| M7b | D | Felhő Forrás `cloud3d` + Lufi host-Megjelenés `balloon` (`soft3d.ts`, `cloud.ts`) | a D többi része hátra |
| U1 | B | Animálás mód, pálya (`animate.ts`), Sávok paramétersorok (`timeline.ts` `paramList`/`retimeSel`), fülek (`inspector.ts`), általános Eljátszás (`perform.ts`) | B részben (felhasználói próba hiányzik) |
| M8–M10 | E/F/G | fizika és mezők; folyadék; receptcsalád, Random | nincs elkezdve |

A modulonkénti technikai jegyzetek: `app/README.md` („Újabb modulok” szakasz). Mérések és próbalisták: `PROGRESS.md`.

## Hátralévő D-lista (M7)
~~Felhő + Lufi~~ (kész, M7b) → Füst (javasolva) → Virág/ornament → a Bolygó feljavítása → szöveg gömbön/hengeren (élő szöveg) → Térbeliség első próba → Részecske Forrás saját emitterrel → érthető kapcsolatok (javaslat, panel). A teljes, nem D-hez tartozó hiánylista: `FUNKCIO-LELTAR.md`.

## Ismert apróság
- A „Filmes” lencsehiba okozta cián pontot (fényes csillanáson) headlessben nem lehetett előidézni; a javítás után a felhasználói próbán érdemes megnézni.

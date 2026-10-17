# Vel – átadó a folytatáshoz (2026-10-18)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.23.0-u1**, a teljes tesztkör (25 teszt) zöld, minden commitolva. Az **U1 (Animálás és jobb panel)** kész, headless tesztekkel demonstrálva; **a felhasználó maga végzi az élő próbát** (próbalista: `PROGRESS.md` legfelül). A felhasználó kérése: élő böngészős ellenőrzést ne futtass, csak szólj, ha kész.

## Mire vár jóváhagyás (ne kezdd el nélküle)
**Új termékirány (2026-10-18):** `docs/spec/vel-intuitiv-mozgas-es-kapcsolatok.md` (Kapcsolat-zsinór, Mozgás árnyéka, Mozgás átadása + Festés, szerepérzékeny jelenetmozgás). Leltárban: 24–28. sor. Nem jóváhagyás; minden szelethez külön javaslat kell.
**A felhasználó prioritása (2026-10-18):** UI-frissítés, Kapcsolat-zsinór, jelenetátmenetek. **Sorrend:** U3 → K1 → S1, utána U2 (szövegsor, alakfelismerés, körbeérő LFO; terve lent), videóexport memória, K2 Mozgás árnyéka, K3/K4, D-lista, E.
**Token-takarékos munkarend (a felhasználó kérése):** minden szelet új beszélgetésben indul a HANDOFF-ból; több szelet egyszerre jóváhagyható; élő böngészős próba nincs (a felhasználó végzi); a teljes tesztkör csak a szelet végén; hosszú anyagot a felhasználó fájlként tesz a `docs/spec/`-be; rövid javaslatok és rövid dokumentációfrissítés.

> **U3 – UI-frissítés a teljes munkatéren.** **Tudod majd:** a könyvtár bal oldalra kerül a rétegek fölé, húzható elválasztóval (a vászon alatti sáv felszabadul, a vászon nagyobb). A rétegsorokon kis jelvények: ◆ animált, ✦ Megjelenés, ⇢ Kapcsolat, ⧉ Változat; rámutatva magyarázat. A könyvtárkártyán látszik, mire húzható (pl. „csak Felhő”). Az eszköztár és az idővonal gombjai egységes ikonokat és magyarázó tooltipet kapnak; egy kapcsolható súgó röviden kiírja a gyorsbillentyűket. **Nem:** új funkció, téma vagy színváltás. **Próba:** 1) Húzd az elválasztót, keress a könyvtárban, húzz egy elemet a vászonra. 2) Animált és effektes rétegen nézd a jelvényeket. 3) Kapcsold be a súgót.
> **K1 – Kapcsolat-zsinór + Nap→Ég (spec 2–3., leltár 24.).** **Tudod majd:** a kijelölt elem mellett egy kis ⇢ pont. Ezt húzva vékony zsinór követi az egeret, és csak azok az elemek emelődnek ki, amelyekre értelmesen hathat. Elengedéskor emberi nyelvű választás előnézettel (pl. „Napfény hat az Égre”, „Kövesse”, „Vezérelje: [paraméter]”), egy kattintás az elfogadás. Utána mindkét elemen jelvény; kijelölve csak a saját zsinórja látszik; a jelvényre kattintva mini-kártya (ki/be, erősség, részletek, törlés). A mai paraméter-Kapcsolatok ugyanebben a listában maradnak. Első új hatások: Nap→Ég (szín/fény), „Kövesse” (pozíció késéssel). **Nem:** fizika/kontaktus, Festés, Mozgás átadása, automatikus szabályok. **Próba:** 1) Nap + Ég, zsinór a Napról az Égre, elfogadás, mozgasd a Napot. 2) Szöveg kövesse egy formát. 3) Undo, mentés→újranyitás.
> **S1 – Jelenetek + átmenetek (első változat, leltár 19.).** **Tudod majd:** a kész kompozíciót „Jelenetként mentés”-sel elmented; egy Jelenetek sávban egymás után rakod őket és állítod a hosszukat. Két jelenet között az átmenet rétegenként számol: ami mindkettőben szerepel (ugyanaz a könyvtári elem, Közös alap vagy azonos nevű réteg), az odamozog és átalakul (hely, méret, szín, paraméterek), ami csak az egyikben van, be- vagy kiúszik. Az átmenet hossza és görbéje állítható, a párosítás felülírható. **Nem:** szerepenkénti átmenet-láncok, komponenskönyvtár teljes kezelése, alakmorfolás eltérő típusok között. **Próba:** 1) Két jelenet ugyanazzal a címmel más helyen, átmenet: a cím odacsúszik. 2) Új elem a második jelenetben: beúszik. 3) Export a két jelenetről.

> **U2 (későbbre):** szövegsor megfogása és Cmd-mozgatás, sorok nem takarják egymást; Eljátszásnál kör/egyenes/ív felismerés; LFO „Körbeér”. Részletes magyarázat a 2026-10-18-i beszélgetésben volt; indításkor röviden újra jóváhagyatandó.

## Későbbi fejlesztésre feljegyezve (nem ütemezett, körbejárandó)
- **Szabály- és eseményvezérelt viselkedés** (`FUNKCIO-LELTAR.md` 23. sor): „kövesse ezt”, „lebegjen e körül”, „reagáljon a szélre”, „erősödjön a Glow érintkezéskor”. Nincs előre beírt kulcssoruk, szabály vagy esemény vezérli őket, és a Loop kikapcsolása után is élnek. Mielőtt bármi épül, külön végig kell gondolni a felhasználóval (kulcsokkal való viszony, jelölés, export, kapcsolat a Kapcsolatokkal és az E szakasszal).

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

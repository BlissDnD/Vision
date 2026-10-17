# Vel – átadó a folytatáshoz (2026-10-18)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.23.0-u1**, a teljes tesztkör (25 teszt) zöld, minden commitolva. Az **U1 (Animálás és jobb panel)** kész, headless tesztekkel demonstrálva; **a felhasználó maga végzi az élő próbát** (próbalista: `PROGRESS.md` legfelül). A felhasználó kérése: élő böngészős ellenőrzést ne futtass, csak szólj, ha kész.

## Mire vár jóváhagyás (ne kezdd el nélküle)
**Új termékirány (2026-10-18):** `docs/spec/vel-intuitiv-mozgas-es-kapcsolatok.md` (Kapcsolat-zsinór, Mozgás árnyéka, Mozgás átadása + Festés, szerepérzékeny jelenetmozgás). Leltárban: 24–28. sor. Nem jóváhagyás; minden szelethez külön javaslat kell.
**Javasolt sorrend (jóváhagyásra vár):** U1 ~~kész~~ → **U2** (szövegsor, alakfelismerés, körbeérő LFO) → **K1** Kapcsolat-zsinór + Nap→Ég (24.) → **U3** UI-frissítés, már a Kapcsolat-jelvénnyel → **K2** Mozgás árnyéka (25., az U1 pályája ide olvad) → **S1** Jelenetek + átmenetek → **K3** Mozgás átadása + Festés (26.) → **K4** szerepérzékeny jelenetmozgás (27., S1 és K1–K3 után) → videóexport memória → D-lista → E (fizika; a 10. D próba ekkor).

> **U2 / B – Szövegsor, Eljátszás-alakfelismerés, varratmentes LFO.**
> **A felhasználó ezt tudja majd:** a kijelölt szövegen a sort magát fogja meg a vásznon (a sor fölé víve kiemelődik): húzás = a sor behúzása és térköze, Shift = a sor mérete, **Cmd+húzás = a sor szabadon, külön mozog** (x/y eltolás, kulcsozható). Ha egy sor rácsúszik egy másikra, nem vág ki belőle és nem takarja el, a betűk egyszerűen egymásra kerülnek (az eredetileg lejjebb lévő sor kerül fölülre, mint egy rétegben). Eljátszásnál a rajzolt kör tiszta kör, az egyenes egyenes, az ív ív lesz; ha nem ismerhető fel, kevés pontú sima görbe. A felismert alak a felvétel után egy csipen látszik (Kör / Egyenes / Ív / Szabad), egy kattintással visszaválthatsz a szabadra; a mozdulat tempója (lassítás, megállás) megmarad. A hullám (LFO) egy „Körbeér” kapcsolóval a projekt hosszára igazodik: a vége pontosan az elejébe ér, a loop export varratmentes.
> **Pontosan megépítem:** sorfogás a sor teljes területén (a mostani bal szélső fogantyú helyett), Cmd-mozgatás új soronkénti `ox/oy` mezővel (régi projekt változatlan, migrációs teszt); a sorok egymásra rajzolása kivágás nélkül, rögzített sorrendben; alakfelismerés a pozíciós felvételre (legkisebb négyzetes egyenes- és körillesztés, az ív = körív szögtartománnyal; tűréshatár a mozdulat méretéhez viszonyítva), a felismert alakból egyenletes, ritka kulcsok a gesztus saját időzítésével; az alapsimítás erősebb (a „túl pontosan követi a kezet” visszajelzés miatt); LFO „Körbeér”: a tempót a legközelebbi egész körszámra kerekíti a projekt hosszán (új hullámnál alapból be, a meglévő projektek nem változnak csendben), a csúszka mellett „3 kör / 10 mp” kiírás.
> **Ebben még nem:** alakfelismerés 1D paraméterekre (csak pozíció), csillag/téglalap alakok, szó- vagy karakterszintű fogás, szabályvezérelt viselkedés (23. sor), Jelenetek (S1), munkatér-átrendezés (U3).
> **Próba:** 1) Kétsoros szöveg → a második sort fogd meg és húzd jobbra, majd Cmd+húzással told az első fölé: mindkét sor teljesen látszik. 2) E → rajzolj kört a réteggel → lejátszva tiszta kör, csipen „Kör”; „Szabad”-ra váltva a kézi út. 3) Egy csúszkára hullám → Körbeér be → Ismétléssel lejátszva a vágásnál nincs ugrás. Mérés: a kör illesztési hibája (a kép magasságához mérve) és a kulcsszám; az LFO első/utolsó képkockájának eltérése 0; tesztek mentés→újranyitásra és régi projektre.

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

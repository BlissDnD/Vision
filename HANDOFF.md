# Vel – átadó a folytatáshoz (2026-10-17 éjjel)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.22.0-m7b**, a teljes tesztkör (24 teszt) zöld, minden commitolva. Az M7b (Felhő + Lufi) kész és élőben ellenőrizve, a felhasználó még nem próbálta ki (próbalista: `PROGRESS.md` legfelül). **A következő szelet jóváhagyásra vár.**

## Mire vár jóváhagyás (ne kezdd el nélküle)
Két lehetőség, a felhasználó választ:

> **M7c / D – Füst** (a hátralévő D-lista következő eleme). A felhasználó behúz egy **Füst** Forrást: felszálló, gomolygó, áttetsző füstcsík egy forráspontból (mozgatható), állítja a sűrűséget, emelkedési tempót, szétterülést, színt (fehér gőz / szürke füst / színes), a látványbeli szelet (elhajlik), és a Jelenetfény átvilágítja. Ugyanaz a puha sűrűség-raymarch motor, mint a Felhőé (`soft3d.ts`), időben folyamatos áramlással.
> **Nem:** fizikai szimuláció / ütközés (E), tűz (külön), füst szövegből. Kockázat: a raymarching ára 4K-n (a Felhő 29 ms); mérem, kell-e félfelbontású pass.
> **Próba:** „füst” → Füst; lejátszás: felszáll és gomolyog; Szél jobbra → elhajlik; Jelenetfény iránya → átvilágítás; ugrás/export azonos.

> **B – Könyvtár balra**, a rétegek fölé, húzható elválasztóval (kis szelet, külön).

## Mi történt legutóbb
- M7b: Felhő (3 alak, gomolygás, látványbeli szél, Jelenetfény) és ráhúzható Lufi (Felfújtság, szín, fényesség, csillanás), célkompatibilitás-jelzéssel. Mérés és próbalista: `PROGRESS.md`.
- Az új „host” Megjelenés-típus (`EffectDef.host`, `fxFits` az `effects/index.ts`-ben) a későbbi anyag-Megjelenésekhez (Chrome, lakk, Üveg) is használható.

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
| M8–M10 | E/F/G | fizika és mezők; folyadék; receptcsalád, Random | nincs elkezdve |

A modulonkénti technikai jegyzetek: `app/README.md` („Újabb modulok” szakasz). Mérések és próbalisták: `PROGRESS.md`.

## Hátralévő D-lista (M7)
~~Felhő + Lufi~~ (kész, M7b) → Füst (javasolva) → Virág/ornament → a Bolygó feljavítása → szöveg gömbön/hengeren (élő szöveg) → Térbeliség első próba → Részecske Forrás saját emitterrel → érthető kapcsolatok (javaslat, panel). A teljes, nem D-hez tartozó hiánylista: `FUNKCIO-LELTAR.md`.

## Ismert apróság
- A „Filmes” lencsehiba okozta cián pontot (fényes csillanáson) headlessben nem lehetett előidézni; a javítás után a felhasználói próbán érdemes megnézni.

# Vel – átadó a folytatáshoz (2026-10-17 éjjel)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.22.0-m7b**, a teljes tesztkör (24 teszt) zöld, minden commitolva. Az M7b (Felhő + Lufi) kész és élőben ellenőrizve, a felhasználó még nem próbálta ki (próbalista: `PROGRESS.md` legfelül). **A következő szelet (U1) jóváhagyásra vár.**

## Mire vár jóváhagyás (ne kezdd el nélküle)
A felhasználó 2026-10-17 éjjel kipróbált részeket, és új sorrendet kért (visszajelzés: `FUNKCIO-LELTAR.md` 8., 10., 19–22. sor). **Új sorrend:**
1. **U1 / B – Animálás és jobb panel** (javasolva, lent).
2. **U2 / B – Szövegsor és Eljátszás-alakfelismerés:** a sort magát fogod meg, Cmd+húzással külön mozog, nem takarja ki a többit; az Eljátszásnál alakfelismerés (kör/egyenes/ív); LFO hibátlan körbeérés a projekt hosszára.
3. **S1 – Jelenetek + átmenetek + komponensek** (új termékszakasz, a Közös alap/Változat alapjaira; külön, részletes javaslat kell).
4. Kicsik közben: könyvtár balra a rétegek fölé; videóexport memóriabiztonsága.
5. A D-lista folytatása (Füst → anyag-Megjelenések + több fény → útvonal-prototípus → Térbeliség / szöveg 3D-n), majd az E (fizika).

> **U1 / B – Animálás és jobb panel.**
> **A felhasználó ezt tudja majd:** lerak egy szöveget, megnyomja az **Animálás** gombot (A), 0 mp-nél balra húzza, 2 mp-nél jobbra: két kulcs lesz kattintgatás nélkül, és a vásznon látszik a **mozgáspálya** húzható pontokkal. Az idővonalon (Sávok) a réteg kinyitható az animált paraméterekre; **húzással több kulcsot kijelöl**, együtt mozgatja, Alt-tal nyújtja, Delete-tel törli, jobb klikkre görbét választ (Lineáris, Lágy, Rugós, Pattanó…). Minden paraméternél egyértelmű jel mutatja, mi animált és hogyan: ◆ kulcs, ∿ hullám, ♪ hang/jel, ▭ mozgásblokk. **Eljátszás:** bekapcsolva a lejátszás megáll; amikor megmozdítasz valamit (vásznon húzás vagy bármelyik animálható csúszka/szám), onnan indul a lejátszás és a felvétel, elengedéskor leáll, és a lejátszófej visszaugrik a felvétel elejére. Bármely animálható paraméterrel működik, nem csak a pozícióval; a felvételből simított, kevés kulcs lesz, a nyers felvétel megmarad. A jobb panel tetején **ikonfülek** (Tartalom, Szín és megjelenés, Mozgás, Effektek, Elhelyezés), tömörebb sorokkal, a ritka beállítások lenyitva.
> **Pontosan megépítem:** a kulcskocka-hibák feltárása és javítása (célzott tesztekkel); Animálás mód (bekapcsolva csúszka, szám és vászonhúzás is kulcsot ír; ha még nincs kulcs, a korábbi érték a 0 mp-re kerül); mozgáspálya-rajz a pozíciókulcsokból, húzható pontokkal; Sávok panel: kinyitható paramétersorok, téglalapos kijelölés, csoportos mozgatás/nyújtás/törlés/másolás, görbe-gyorsmenü; animáció-jelzések a paramétereknél; Eljátszás új indítása (élesítéskor megáll, első mozdulatra indul) és kiterjesztése minden animálható paraméterre (csúszka, szám, vászonhúzás: pozíció, méret, forgatás), a meglévő simítás + pontritkítás 1D-s változatával; jobb panel átrendezése ikonfülekre.
> **Ebben még nem:** Jelenetek (S1), Bezier-kezelők a pályán (csak pontok, sima görbével), új görbeszerkesztő (a meglévő marad), szövegsor-javítás és az Eljátszás alakfelismerése (U2), könyvtár balra.
> **Próba:** 1) Szöveg → Animálás (A) → 0 mp-nél húzd balra, 2 mp-nél jobbra → lejátszás; a pálya egy pontját húzd el. 2) Eljátszás be → semmi nem mozog → húzz meg egy csúszkát (pl. Rajzolás) → elindul és felveszi; elengedés után lejátszva ugyanazt adja. 3) Sávok: húzással jelölj ki kulcsokat, told el, jobb klikk → Rugós. 4) Jobb panel: a Mozgás fülön látszik, mi animált. Mérés: kattintásszám egy kétkulcsos mozgáshoz előtte/utána; tesztek a kulcsműveletekre, visszavonásra, mentés→újranyitásra.

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

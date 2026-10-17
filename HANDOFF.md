# Vel – átadó a folytatáshoz (2026-10-18, P1 után)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.27.0-p1**, a teljes tesztkör (29 teszt) zöld, minden commitolva. A **P1** (presetek kívülről ChatGPT-vel, tartós saját könyvtár, saját shader elnevezett csúszkákkal) kész, headless tesztekkel demonstrálva. **Az élő próbát a felhasználó végzi** (próbalista: `PROGRESS.md` legfelül). Élő böngészős ellenőrzést ne futtass, csak szólj, ha kész.

## Mire vár jóváhagyás (ne kezdd el nélküle)
**Következő: U2** – rövid javaslat és újbóli jóváhagyás kell indítás előtt (lásd lent).

**P1 nyitott korlátai / következő szeletre:** ráhúzható saját Megjelenés (fx-típusú saját shader, ami egy rétegre húzva csak arra hat) még nincs, a saját shader most önálló réteg (`IN(uv)`-vel az alatta lévőt szűrheti); a gépigény-mérés egyszeri, kis felbontású próbarender; a könyvtár más elemfajtái (paletta, mozgás) tárolhatók, de még nincs polcuk. Formátum: `docs/VEL-PRESET-FORMATUM.md` (a build generálja).

**U2 tartalma:** (szövegsor megfogása és Cmd-mozgatás, sorok nem takarják egymást; Eljátszásnál kör/egyenes/ív felismerés; LFO „Körbeér”). Indítás előtt rövid javaslat és jóváhagyás kell. Utána: videóexport memória, K2 Mozgás árnyéka, K3/K4, D-lista, E.
**Új, külön jóváhagyandó médiamérföldkő (a felhasználó tette be, 2026-10-18):** sokrétegű videó és reszponzív idővonal: `docs/spec/VEL-TOBBVIDEOS-TIMELINE-TELJESITMENY.md` (a terv 7. fejezetében hivatkozva). Még nincs ütemezve.
**Token-takarékos munkarend (a felhasználó kérése):** minden szelet új beszélgetésben indul a HANDOFF-ból; több szelet egyszerre jóváhagyható; élő böngészős próba nincs (a felhasználó végzi); a teljes tesztkör csak a szelet végén; hosszú anyagot a felhasználó fájlként tesz a `docs/spec/`-be; rövid javaslatok és rövid dokumentációfrissítés.

**Az U3/K1/S1 nyitott korlátai** (ha a próba után kérik): a zsinór csak a gizmóról indul (Mozgásblokkról / Megjelenésről / paraméterpontból még nem); a Nap gizmója a réteg középén van, nem a korongon; a jelenetsorban a Kapcsolatok nem hatnak, a kamera a vászoné; nincs alakmorfolás eltérő típusok közt.

## Későbbi fejlesztésre feljegyezve (nem ütemezett, körbejárandó)
- **Mozgás polc, rétegenkénti Loop, Időzítés helyett ráhúzható animációk** (`FUNKCIO-LELTAR.md` 29. sor, kategóriák: `docs/spec/vel-mozgas-polc-kategoriak.md`, a felhasználó 2026-10-18-i kérése): a Mozgás polcon rárakható animációk legyenek (folytonosak is), a beállításuk a réteg Mozgás fülén jelenjen meg a régi Belépés/Kilépés helyett; Loop-gomb rétegenként, ami a réteg kulcsanimációját varratmentesen ismétli a saját idejére, élő módban is, a többitől függetlenül; élő módban mozgatás ne írjon kulcsot, csak Animálás módban. Az U2 javaslatánál vedd figyelembe (az U2 „LFO Körbeér” pontja ide kapcsolódik).
- **Szabály- és eseményvezérelt viselkedés** (`FUNKCIO-LELTAR.md` 23. sor): „kövesse ezt”, „lebegjen e körül”, „reagáljon a szélre”, „erősödjön a Glow érintkezéskor”. Nincs előre beírt kulcssoruk, szabály vagy esemény vezérli őket, és a Loop kikapcsolása után is élnek. Mielőtt bármi épül, külön végig kell gondolni a felhasználóval (kulcsokkal való viszony, jelölés, export, kapcsolat a Kapcsolatokkal és az E szakasszal).

## Mi történt legutóbb
- P1: saját könyvtár + polcok, Mentés presetként (☆), Projekt → Utasítás ChatGPT-nek / Preset beillesztése, vezérlők a formátumban, saját shader elnevezett csúszkákkal. Technikai jegyzet: `app/README.md` „P1”.
- U3: könyvtár balra a rétegek fölé, húzható elválasztó, rétegjelvények, kártyacímkék, egységes tooltip, gyorsbillentyű-panel (`workspace.ts`).
- K1: Kapcsolat-zsinór ⇢ pontból, előnézetes választókártya, Napfény→Ég, Kövesse, mini-kártya (`linkcord.ts`, `variants.ts`).
- S1: Jelenetek sáv, Jelenetsor-lejátszás/export, rétegenkénti átmenet párosítással (`scenes.ts`). Technikai jegyzet: `app/README.md` „U3 · K1 · S1”.

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
| U3 | B | bal oszlop, jelvények, tooltip, gyorsbillentyűk (`workspace.ts`) | B részben (felhasználói próba hiányzik) |
| K1 | A/B | Kapcsolat-zsinór, Napfény→Ég, Kövesse (`linkcord.ts`) | Kapcsolatok részben |
| S1 | B | Jelenetek + átmenetek (`scenes.ts`, `frameAt`, `_toff`) | jelenetek első változat |
| P1 | B/G | saját könyvtár (`userlib.ts`), polcok, ChatGPT-utasítás és beillesztés (`presets.ts`, `presetfmt.ts`), saját shader csúszkái (`paramsOf`) | presetek első változat |
| M8–M10 | E/F/G | fizika és mezők; folyadék; receptcsalád, Random | nincs elkezdve |

A modulonkénti technikai jegyzetek: `app/README.md` („Újabb modulok” szakasz). Mérések és próbalisták: `PROGRESS.md`.

## Hátralévő D-lista (M7)
~~Felhő + Lufi~~ (kész, M7b) → Füst (javasolva) → Virág/ornament → a Bolygó feljavítása → szöveg gömbön/hengeren (élő szöveg) → Térbeliség első próba → Részecske Forrás saját emitterrel → érthető kapcsolatok (javaslat, panel). A teljes, nem D-hez tartozó hiánylista: `FUNKCIO-LELTAR.md`.

## Ismert hibák
Lásd **`BUGS.md`** (minden jelzett hiba ott van, állapottal).

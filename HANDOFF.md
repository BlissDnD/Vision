# Vel – átadó a folytatáshoz (2026-10-18, U3+K1+S1 után)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
Verzió **0.26.0-s1**, a teljes tesztkör (28 teszt) zöld, minden commitolva. A felhasználó 2026-10-18-án **egyben jóváhagyta az U3 → K1 → S1 sort**; mindhárom kész, headless tesztekkel demonstrálva. **Az élő próbát a felhasználó végzi** (próbalista: `PROGRESS.md` legfelül). Élő böngészős ellenőrzést ne futtass, csak szólj, ha kész.

## Mire vár jóváhagyás (ne kezdd el nélküle)
**JÓVÁHAGYVA (2026-10-18), ezt csináld most: P1 – Presetek kívülről (ChatGPT) + saját shader.** Utána jön az U2.
> **Tudod majd:** Projekt menü → „Utasítás ChatGPT-nek”: a teljes formátumleírás a vágólapra (a meglévő `descPrompt`/`descCatalog` alapján, `src/describe.ts`; a mostani effektlistából és vászonméretből generálva). A ChatGPT csak JSON-t ad; „Preset beillesztése” mező (és .json fájl húzása): ellenőrzés (ismeretlen effekt/paraméter kimarad, a Vel megmondja, mi), előnézet, visszavonható beépítés a meglévő `buildFromSpec`-kel. „Mentés presetként” polcválasztással (Receptek, Világok, Mozgás …): a beépítettek mellett „saját” jellel, kattintható/húzható/kereshető, bélyegképpel; csak a saját törölhető/átnevezhető; böngészőben tárolva, fájlba ki/be, a projektfájlba a használt presetek is bekerülnek. A preset megadhat 2–4 nagy vezérlőt (csoport-makró, mint a gyári recepteknél). **Saját shader:** a formátum engedi a `custom` réteget `code`-dal (most `DESC_SKIP`-ben van); a leírás tartalmazza a shader-szerződést (`vec4 fx()`, `P()`, idő, paletta, zaj/SDF segédek, `IN(uv)`, `p_…`), a kódból generálva; **rétegenkénti elnevezett csúszkák** (név, tartomány, alapérték, szín), animálhatók mint a gyáriak; beillesztéskor fordítás (hiba megmutatva, visszamásolható a ChatGPT-nek) és próbarender gépigény-méréssel (túl nehéz shader jelzése). Ha belefér: ráhúzható Megjelenés-változat (saját fx-típus), különben a következő szelet. `docs/VEL-PRESET-FORMATUM.md` a buildből generálva.
> **Nem:** új beépített effekt, ChatGPT-hívás az appból, preset-megosztás online.
> **Próba:** 1) Utasítás másolása → ChatGPT-ben preset kérése → beillesztés → a vásznon van, undo. 2) Mentés presetként a Receptek polcra → megjelenik „saját” jellel, húzható; fájlba ki, vissza. 3) Saját shaderes preset elnevezett csúszkákkal; egy szándékosan hibás kód → érthető hiba.

**Utána a sorban: U2** (szövegsor megfogása és Cmd-mozgatás, sorok nem takarják egymást; Eljátszásnál kör/egyenes/ív felismerés; LFO „Körbeér”). Indítás előtt rövid javaslat és jóváhagyás kell. Utána: videóexport memória, K2 Mozgás árnyéka, K3/K4, D-lista, E.
**Új, külön jóváhagyandó médiamérföldkő (a felhasználó tette be, 2026-10-18):** sokrétegű videó és reszponzív idővonal: `docs/spec/VEL-TOBBVIDEOS-TIMELINE-TELJESITMENY.md` (a terv 7. fejezetében hivatkozva). Még nincs ütemezve.
**Token-takarékos munkarend (a felhasználó kérése):** minden szelet új beszélgetésben indul a HANDOFF-ból; több szelet egyszerre jóváhagyható; élő böngészős próba nincs (a felhasználó végzi); a teljes tesztkör csak a szelet végén; hosszú anyagot a felhasználó fájlként tesz a `docs/spec/`-be; rövid javaslatok és rövid dokumentációfrissítés.

**Az U3/K1/S1 nyitott korlátai** (ha a próba után kérik): a zsinór csak a gizmóról indul (Mozgásblokkról / Megjelenésről / paraméterpontból még nem); a Nap gizmója a réteg középén van, nem a korongon; a jelenetsorban a Kapcsolatok nem hatnak, a kamera a vászoné; nincs alakmorfolás eltérő típusok közt.

## Későbbi fejlesztésre feljegyezve (nem ütemezett, körbejárandó)
- **Szabály- és eseményvezérelt viselkedés** (`FUNKCIO-LELTAR.md` 23. sor): „kövesse ezt”, „lebegjen e körül”, „reagáljon a szélre”, „erősödjön a Glow érintkezéskor”. Nincs előre beírt kulcssoruk, szabály vagy esemény vezérli őket, és a Loop kikapcsolása után is élnek. Mielőtt bármi épül, külön végig kell gondolni a felhasználóval (kulcsokkal való viszony, jelölés, export, kapcsolat a Kapcsolatokkal és az E szakasszal).

## Mi történt legutóbb
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
| M8–M10 | E/F/G | fizika és mezők; folyadék; receptcsalád, Random | nincs elkezdve |

A modulonkénti technikai jegyzetek: `app/README.md` („Újabb modulok” szakasz). Mérések és próbalisták: `PROGRESS.md`.

## Hátralévő D-lista (M7)
~~Felhő + Lufi~~ (kész, M7b) → Füst (javasolva) → Virág/ornament → a Bolygó feljavítása → szöveg gömbön/hengeren (élő szöveg) → Térbeliség első próba → Részecske Forrás saját emitterrel → érthető kapcsolatok (javaslat, panel). A teljes, nem D-hez tartozó hiánylista: `FUNKCIO-LELTAR.md`.

## Ismert apróság
- A „Filmes” lencsehiba okozta cián pontot (fényes csillanáson) headlessben nem lehetett előidézni; a javítás után a felhasználói próbán érdemes megnézni.

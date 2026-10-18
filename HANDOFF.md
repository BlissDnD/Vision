# Vel – átadó a folytatáshoz (2026-10-18, L1 Lottie után)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

## Állapot egy mondatban
**LP1 Körbeér (0.37.0-lp1, 2026-10-18, mozgás-sáv, `claude/happy-feynman-192ba3` ág):** Körbeér kapcsoló az LFO-n és a folyamatos mozgásokon: egész számú kör a loopban, varratmentes loop-export. Headless teszttel demonstrálva (`tests/lp_loop.js`), teljes kör 41/41; felhasználói próba hátra (`PROGRESS.md`). Következő ebben a sávban: XF1 Mozgás átadása + Sorrend festése, majd KO1 Koreográfia gomb (javaslatok: `docs/javaslatok/MOZGAS-SAV-JAVASLATOK.md`, a felhasználó kérésére önjóváhagyással).

**G1 Gesztus-mozgás (0.36.0-g1, 2026-10-18):** a mozgást a vásznon mutatod meg: módosítós nyíl (⌘ tempó/karakter, ⌥ ív, ⇧ 15°), szellemképek húzás közben, címke csak módosítóval, saját fogantyú az öt folyamatos mozgásnak, pályahúzás = előnézeti tekerés. Headless teszttel demonstrálva (`tests/g1_gesture.js`), felhasználói próba hátra (`PROGRESS.md` legfelül).

**PH1 Poly Haven képek (0.35.0-ph1, 2026-10-18):** Szöveg és média → Poly Haven textúrák: 12 elemes, kereshető, kurált CC0-katalógus; kiválasztáskor hivatalos 2K JPG-ből beágyazott képréteg és forrásmetaadat. Célzott teszt zöld (`tests/polyhaven_import.js`); teljes kör első futás 37/39, a két tesztfeltétel javítása után mindkettő külön zöld (`PROGRESS.md`). A valódi hálózatos felhasználói próba hátra. Ez 2D képimport, nem 3D PBR-anyag vagy teljes online katalógus. Következőhöz külön javaslat kell: PBR-anyagcsatlakozó vagy új médiakatalógus.

**L1 Lottie (0.34.0-l1, 2026-10-18):** helyi, csak vektoros `.json` import előnézettel, saját réteg és Sávok-blokk, média-Kezdet/Sebesség/Loop, Megjelenések, jelenetidőből rajzolt kép, a projektbe ágyazott vektorasset és teljes automatikus mentés. Az importablakból a LottieFiles gyűjtemény külön lapon megnyitható; a JSON-t onnan le kell tölteni. Célzott teszt és teljes kör **38/38 zöld**; felhasználói próba hátra (`PROGRESS.md`, minta: `app/tests/fixtures/vel-lottie-circle.json`). Build: `app/dist/index.html`. Képes/szöveges/fontos/expression Lottie, online kereső és videóimport továbbra is későbbi szelet. Jóváhagyott javaslat: `docs/javaslatok/LOTTIE-MEDIA-IMPORT-ELSO-SZELET-JAVASLAT.md`; 8 pontos ellenőrzés: `docs/javaslatok/LOTTIE-ELSO-SZELET-ELLENORZES.md`.

**Q1 Random minőségszűrő (2026-10-18):** a Random lemér minden dobást (10 tünet, `src/rndq.ts`), a gyengét újradobja vagy csak a hibás effektet gyengíti/veszi ki; Ronda/Tetszik ízlés (`src/taste.ts`, a projektfájl is viszi). Headless teszttel demonstrálva (`tests/rnd_quality.js`), felhasználói próba hátra (`PROGRESS.md`). Következő ebből (javaslat kell): küszöbök tanulása a jelzésekből, „Hatos rács”.

**T1 3D Terep (0.33.0-terep1, 2026-10-18):** Források → 3D Terep: valódi táj-háló seedből (6 típus, 5 stílus, vízszint, vetett árnyék, jelenetfény, égbolt). Húzás = körbeforgatás, görgő = távolság. Headless teszttel demonstrálva (`tests/t1_terrain3d.js`); M1 Max frame-idő és felhasználói próba hátra. **Következő ehhez:** T2 Bolygó domborzata (vázlat: `docs/javaslatok/3D-TEREP-JAVASLAT.md`, prototípus + jóváhagyás kell).

**Időzítés gyorsan (0.32.0-t1, 2026-10-18):** Koppintás kosárral (T, J), Tempó-chip (½×/1×/2× + csúszka), Sima (átmenő) kulcsgörbe az Eljátszásnak; headless teszttel demonstrálva (`tests/tap_timing.js`), felhasználói próba hátra (`PROGRESS.md` legfelül). Következő a sorban: Gesztus-szelet (jóváhagyva).

**R1 (0.31.0-r1, 2026-10-18):** két új Megjelenés, a CRT-képernyő és a Színes vetett fény, headless teszttel demonstrálva (`tests/r1_crt_light.js`). Az új referenciák ütemterve a `FUNKCIO-LELTAR.md` 37–42. sorában van (forrás: `docs/spec/VEL-UJ-REFERENCIAK-KODTERV-2026-10-18.md`). Következő ebből: R1b (fényfogantyú, spektrum, CRT+Jelhiba recept), majd R2 (WIDE + Unwoven). Mindkettő előtt javaslat kell. Az eredeti forráskódok nincsenek letöltve.

Verzió **0.30.0-mo11** (bal felül a név mellett látszik a verzió és a build ideje). **Mozgás v1.1** kész és headless teszttel demonstrálva (`tests/mo_rhythm.js`): Ritmus a folytonos mozgásokon (chipek, ritmus-szalag, Tempó/Erő), mozgássávok a Sávokon (réteg ▸ mozgás ▸ paraméter ▸ kulcs), Kulcsokká alakítás; felhasználói próba hátra (`PROGRESS.md` legfelül). Korábban kész és headless tesztekkel demonstrálva: **P1** (presetek ChatGPT-vel, saját könyvtár, saját shader csúszkákkal) **Mozgás v1** (ráhúzható mozgások, rétegenkénti kulcs-Loop, kulcs csak Animálás módban, Rugalmas beúszás) és **U4** (tömörebb jobb panel, felső szövegsáv, effekt-ikonsor; `docs/spec/vel-ui-visszajelzes-2026-10-18.md` első fele). **Az élő próbát a felhasználó végzi** (próbalista: `PROGRESS.md` legfelül). Élő böngészős ellenőrzést ne futtass, csak szólj, ha kész.

**CodePen-könyvtári integráció (2026-10-18):** a Liquid Glass a Megjelenések között ráhúzható effekt; a Szélben lobogó láng a Források között van. Két új szerkeszthető recept is készült. A shaderfordítás, könyvtári beillesztés, rétegre húzás és mentés–újranyitás célzott böngészős tesztje zöld; a felhasználói látványpróba még hátra van. Az eredeti portfájlok megmaradtak. A láng műterméke és a licenc kérdése nyitott.

**CodePen-port kiegészítés (2026-10-18):** a két megnyitható Vel-mintaprojekt és a forrás/korlátjegyzet a `presets/egyedi/` mappában van (`EREDETI-PORTOK.md`). A Liquid Glass eredeti képlete és fotója működik; a láng eredeti zajtextúráját a saját shader `asset` → `uImage` útja használja, de vékony függőleges műtermék maradt (`BUGS.md`). Ez nem zárja le a nagyobb Megjelenés-/shader-katalógus fejlesztést. A CodePen-kódok jogi eredete és a 4K-teljesítmény nyitott ellenőrzés.

**Betöltési UX-javítás (2026-10-18):** a Preset beillesztése ablakba adott teljes Vel-projektet a felület felismeri, és külön „Projekt megnyitása (a jelenlegit lecseréli)” gombot ad; a célzott P1 böngészős teszt zöld. A vászonra ejtett projektfájl is erre az útvonalra jut. A felhasználónál a friss `app/dist/index.html` újratöltése után próbálandó.

## Mire vár jóváhagyás (ne kezdd el nélküle)
**Következő: U5** (a UI-visszajelzés második fele: színösszesítő + színforrás-szabály, gradiens/színválasztó, testreszabható felső action bar) vagy **U2**. Mindkettőhöz rövid javaslat és jóváhagyás kell. Az U5 színszabály-javaslata (a felhasználónak már leírva): alul a paletta, rá a réteg saját színe, rá a csoport/Kapcsolat, legfelül a Megjelenés; az összesítő mutatja, melyik érvényes, és egy kattintással felülre tehető egy másik.

**P1 nyitott korlátai / következő szeletre:** ráhúzható saját Megjelenés (fx-típusú saját shader, ami egy rétegre húzva csak arra hat) még nincs, a saját shader most önálló réteg (`IN(uv)`-vel az alatta lévőt szűrheti); a gépigény-mérés egyszeri, kis felbontású próbarender; a könyvtár más elemfajtái (paletta, mozgás) tárolhatók, de még nincs polcuk. Formátum: `docs/VEL-PRESET-FORMATUM.md` (a build generálja).

**U2 tartalma:** (szövegsor megfogása és Cmd-mozgatás, sorok nem takarják egymást; Eljátszásnál kör/egyenes/ív felismerés; LFO „Körbeér”). Indítás előtt rövid javaslat és jóváhagyás kell. Utána: videóexport memória, K2 Mozgás árnyéka, K3/K4, D-lista, E.
**Új, külön jóváhagyandó médiamérföldkő (a felhasználó tette be, 2026-10-18):** sokrétegű videó és reszponzív idővonal: `docs/spec/VEL-TOBBVIDEOS-TIMELINE-TELJESITMENY.md` (a terv 7. fejezetében hivatkozva). Még nincs ütemezve.
**Token-takarékos munkarend (a felhasználó kérése):** minden szelet új beszélgetésben indul a HANDOFF-ból; több szelet egyszerre jóváhagyható; élő böngészős próba nincs (a felhasználó végzi); a teljes tesztkör csak a szelet végén; hosszú anyagot a felhasználó fájlként tesz a `docs/spec/`-be; rövid javaslatok és rövid dokumentációfrissítés.

**Az U3/K1/S1 nyitott korlátai** (ha a próba után kérik): a zsinór csak a gizmóról indul (Mozgásblokkról / Megjelenésről / paraméterpontból még nem); a Nap gizmója a réteg középén van, nem a korongon; a jelenetsorban a Kapcsolatok nem hatnak, a kamera a vászoné; nincs alakmorfolás eltérő típusok közt.

## Későbbi fejlesztésre feljegyezve (nem ütemezett, körbejárandó)
- **Koreográfia gomb** (a felhasználónak tetszik, 2026-10-18; a 27. sor szerepérzékeny jelenetmozgásának első lépése): kijelölt elemekre a Vel javasol érkezési sorrendet és lépcsőzést (háttér → főcím → kisebb szöveg → formák), rámutatva előnézet, kattintásra elfogadás, egy undo.
- **Lépcsőzés egy húzással** a Sávokon (⌘ + húzás több kijelölt blokkon): javasolva, még nincs jóváhagyva.
- **Külső források célzott beépítése** (a felhasználó briefje, 2026-10-18): `docs/spec/VEL-KULSO-FORRASOK-INTEGRACIO-CLAUDE-PROMPT.md` – Város, 3D Terep → Bolygó, Folyadékmező, Anime.js mintamozgások, Skybox, Oimo fizika (`FUNKCIO-LELTAR.md` 31–36.). A brief nem jóváhagyás: mindegyik szelet előtt javaslat (függőség, adapterhatár, próba, 4K/mentés, méret, licenc). Megjegyzés: a GSAP licence (Webflow-versenytárs tilalom) miatt nem építhető be; a Real World Shader és a Halfmaps-kód nincs a körben.
- **UI-visszajelzés (2026-10-18):** tömörebb felület, felső szövegeszköztár, jobb panel átrendezése (Részletek feljebb, animációk az Animáció fülre szinkron fő vezérlőkkel), gradiens/színválasztó, színforrás-hierarchia (nyitott kérdés, javaslat kell) és színösszesítő, rétegeffekt-ikonsor, testreszabható felső action bar. Részletek: `docs/spec/vel-ui-visszajelzes-2026-10-18.md`, `FUNKCIO-LELTAR.md` 30. sor. Az U2 vagy egy külön UI-szelet javaslatánál vedd elő.
- **Mozgás polc, rétegenkénti Loop, Időzítés helyett ráhúzható animációk** (`FUNKCIO-LELTAR.md` 29. sor, kategóriák: `docs/spec/vel-mozgas-polc-kategoriak.md`, a felhasználó 2026-10-18-i kérése): a Mozgás polcon rárakható animációk legyenek (folytonosak is), a beállításuk a réteg Mozgás fülén jelenjen meg a régi Belépés/Kilépés helyett; Loop-gomb rétegenként, ami a réteg kulcsanimációját varratmentesen ismétli a saját idejére, élő módban is, a többitől függetlenül; élő módban mozgatás ne írjon kulcsot, csak Animálás módban. Az U2 javaslatánál vedd figyelembe (az U2 „LFO Körbeér” pontja ide kapcsolódik).
- **Szabály- és eseményvezérelt viselkedés** (`FUNKCIO-LELTAR.md` 23. sor): „kövesse ezt”, „lebegjen e körül”, „reagáljon a szélre”, „erősödjön a Glow érintkezéskor”. Nincs előre beírt kulcssoruk, szabály vagy esemény vezérli őket, és a Loop kikapcsolása után is élnek. Mielőtt bármi épül, külön végig kell gondolni a felhasználóval (kulcsokkal való viszony, jelölés, export, kapcsolat a Kapcsolatokkal és az E szakasszal).

## Mi történt legutóbb
- G1 Gesztus-mozgás: új `gesture.ts` (nyíl + fogantyúk, szellemképek, címke, súgó, `R.moScrub` tekerés), `motion.ts` `bend` paraméter (kvadratikus Bézier-pálya), `render.ts` `behav` tekerés-felülírás; a nyíl kódja a `moui.ts`-ből átkerült. Jegyzet: `app/README.md` „Gesztus-mozgás”.
- Időzítés gyorsan: `tap.ts` (kosár, `tapNow`, `tapEsc`, sáv, jelvények; `R.tap*`), `retime.ts` `tempoItem`/`tempoPivot`, `inspector.ts` `tempoRow`, `evaluation.ts` `SMOOTH_E` (14, `smTan`), `perform.ts` (sima kulcsok). Jegyzet: `app/README.md` „Időzítés gyorsan”.
- Mozgás v1.1: `motion.ts` (`m.ry`, `ryTau`, `moTime`, `moClip`, `bakeMo`), `timeline.ts` (mozgássorok, `clipDrag`, `paramList` `mo:` utak), `moui.ts` (`rhythmUI`), `version.ts`. Jegyzet: `app/README.md` „Mozgás v1.1”.
- Mozgás v1: `motion.ts` (L.mo, moEval, Anime.js-adapter, syncKLoop), `moui.ts` (Mozgások szekció, ráhúzás, nyíl), `evaluation.ts` (klVal, setVal eltolás). Technikai jegyzet: `app/README.md` „Mozgás v1”.
- U4: egysoros csúszkák, Részletek a Fő beállítások alatt, mozgásparaméterek a Mozgás fülön (szinkron fő vezérlőkkel), effekt-ikonsor + ikonrács (`fxicons.ts`), felső szövegsáv (`textbar.ts`). Technikai jegyzet: `app/README.md` „U4”.
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
| U4 | B | kompakt jobb panel, `animKeysOf`/`mainDupOf`, `syncTwins`, effekt-ikonsor (`fxicons.ts`), szövegsáv (`textbar.ts`) | UI-visszajelzés első fele |
| P1 | B/G | saját könyvtár (`userlib.ts`), polcok, ChatGPT-utasítás és beillesztés (`presets.ts`, `presetfmt.ts`), saját shader csúszkái (`paramsOf`) | presetek első változat |
| M8–M10 | E/F/G | fizika és mezők; folyadék; receptcsalád, Random | nincs elkezdve |

A modulonkénti technikai jegyzetek: `app/README.md` („Újabb modulok” szakasz). Mérések és próbalisták: `PROGRESS.md`.

## Hátralévő D-lista (M7)
~~Felhő + Lufi~~ (kész, M7b) → Füst (javasolva) → Virág/ornament → a Bolygó feljavítása → szöveg gömbön/hengeren (élő szöveg) → Térbeliség első próba → Részecske Forrás saját emitterrel → érthető kapcsolatok (javaslat, panel). A teljes, nem D-hez tartozó hiánylista: `FUNKCIO-LELTAR.md`.

## Ismert hibák
Lásd **`BUGS.md`** (minden jelzett hiba ott van, állapottal).

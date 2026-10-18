# Vel – átadó a folytatáshoz (2026-10-18, L1 Lottie után)

Előbb a `CLAUDE.md`-t olvasd el (szabályok, térkép, parancsok). Ez a fájl csak azt mondja meg, **hol tartunk és mi a következő lépés**.

**Új, közös Claude-előkészítő csomag:** `docs/claude-handoff/00-START-HERE.md` – az addonok, új elemkönyvtár, intuitív/cluttermentes UX és a többagentes fejlesztés együtt tervezve. 28 feladatcsalád, függőségek, egy nagy implementáló + kis segítő munkarend, 65 addon/layout és 96 ötlet útvonala; külön tesztelt keresőmodell. Ez előkészítés, nem a termékszeletek automatikus implementációs engedélye. A kötelező mérföldkő-szabály marad.

**Közös addon/preset checklist:** [CSOMAG-CHECKLIST.md](docs/claude-handoff/CSOMAG-CHECKLIST.md). 65 addon/layout + 96 ötlet mind tervbe véve; csak a checklistben jelölt szeletek demonstráltak. Minden érintett agent frissítse.

## Állapot egy mondatban
**1. nagy menet (0.48.0-m10a, 2026-10-18):** U5 Szín+UI (picker, saját átmenet, Színek sor, action bar), CAT-01 témák, M10 korai (Magazinrács, Szövött galéria); célzott tesztek zöldek, felhasználói próba hátra (`PROGRESS.md`). M6b szalag-recept a felhasználó kérésére kimaradt. **Következő (javaslat kell, egy nagy menetben):** M8 Mező + Érintés jelez, M7 maradék (Füst, Virág, Bolygó), M9 folyadékhatár, M10 teljes.

**CAT-01 első szelet (0.45.0-cat1, 2026-10-18):** szinonimatűrő kereső, szerep-chipek keresés közben, stabil elem-id (`src/catalog.ts`); `tests/cat1_search.js` 20/20, felhasználói próba hátra. **Következő (javaslat kell):** 2b U5 szín/UI a színaddonokkal, vagy CAT-01 2. szelet (témagyűjtemények). Ütemterv: `docs/claude-handoff/TRIAGE-01-EREDMENY-2026-10-18.md` 6. pont.

**STAB-01 mini (0.44.0-stab1, 2026-10-18):** jelenet-képek és hang a projektfájlban, azonos kép egyszer, export-bezárás = megszakítás, árva Kapcsolat takarítás; `tests/stab1_persist.js` zöld, felhasználói próba hátra (`PROGRESS.md`). Következő: CAT-01 (jóváhagyva).

**TRIAGE-01 kész (2026-10-18):** csomagkártyák vs. valós kód és a kimaradt M6–M10 (C–G) befejezési terve a mai újításokkal: `docs/claude-handoff/TRIAGE-01-EREDMENY-2026-10-18.md`. Javasolt következő: STAB-01 mini (3 adatvesztési hiba), majd U5 vagy M6b „1. kép összeáll”; jóváhagyásra vár.

**Önálló sorozat (2026-10-18, a felhasználó előre jóváhagyta):** Részecske emitter → Közös útvonal → Kamera → Folyadék → Fizika → Szöveg 3D; a szabályvezérelt viselkedés kimarad. Javaslatok: `docs/javaslatok/E1-…`, stb. Ezen az ágon (`claude/possible-features-af7e04`) kész: E1, P2, K3, T6 (teljes kör 44/44). A Folyadék (F1) és a Fizika (F2) a párhuzamos munkamenet ágán készült (`claude/vel-fluid-797dca`), a felhasználó kérésére ide összefésülve (0.41.0-merge).

**T6 Szöveg 3D (0.40.0-t6, 2026-10-18):** Térbeli szöveg polc: Szöveg hengeren/gömbön/Szalaggyűrű, Kihúzott 3D szöveg, Szöveg útvonalon; élő, átírható. Headless teszttel demonstrálva (`tests/t6_text3d.js`), felhasználói próba hátra.

**K3 Kamera (0.39.0-k3, 2026-10-18):** Kamera ablak → Mód: Célpontok (célváltás átúszással, követés késéssel, Élesség a célon) / Útvonalon; Kézikamera. Headless teszttel demonstrálva (`tests/k3_camera.js`), felhasználói próba hátra.

**P2 Közös útvonal, első szelet (0.38.0-p2, 2026-10-18):** 2D Formák → Útvonal (rajzolj) + 7 kész változat; pontszerkesztés a vásznon; Vonal/Cső/Szalag/Neon/Gyöngysor, Kirajzolás, szaggatás, kitöltés; ugyanaz az útvonal a Mozgás → Útvonalon és a Részecske Forrás alakja. Headless teszttel demonstrálva (`tests/p2_path.js`), felhasználói próba hátra.

**E1 Részecske Forrás (0.37.0-e1, 2026-10-18):** Részecskék → Részecske Forrás + 8 kész változat; saját emitter (pont/vonal/gyűrű/korong/téglalap/képalak), gravitáció, szél, örvény, pattogó padló, löket/jelzés, mozgatva csóva. Headless teszttel demonstrálva (`tests/e1_emitter.js`), felhasználói próba hátra (`PROGRESS.md` legfelül).
**F2 Fizikai test (0.38.0-f2):** Mozgás polc → Fizikai test, saját 2D merevtest-megoldó a közös órán; headless teszttel demonstrálva (`tests/f2_physics.js`), próba: `PROGRESS.md`.
**F1 Folyadékmező (0.37.0-f1):** Áramló tinta Forrás + Folyadékos torzítás/feltárás Megjelenés, közös órán; headless teszttel demonstrálva (`tests/f1_fluid.js`), próba: `PROGRESS.md`.
**KO1 Koreográfia (0.39.0-ko1, 2026-10-18, mozgás-sáv):** ✦ gomb a Rétegek fejlécében: javasolt szerepek, Editorial érkezés jelenetmozgás előnézettel (Mérték/Ritmus/Hangsúly, szerepsúlyok), egy Jelenetmozgás blokk a Sávokon, réteg szerepe a Mozgás fülön, Önálló mozgássá. Headless teszttel demonstrálva (`tests/ko_choreo.js`); felhasználói próba hátra. Új modul: `choreo.ts`, új projektmező `st.ko`. **A mozgás-sáv három szelete (LP1, XF1, KO1) a `claude/happy-feynman-192ba3` ágon van, merge-re vár.** Következő javaslat (még nem kezdve): KO2 = második profil (Szétesik → visszaáll) + a cím érkezése → háttér fényimpulzus belső Kapcsolatként.

**XF1 Mozgás átadása + Sorrend festése (0.38.0-xf1, 2026-10-18, mozgás-sáv):** a Mozgáskártyáról festéssel átadható a mozgás más rétegekre (Ritmus/Út/Teljes, Késés), előnézettel, követő kapcsolattal, terjedési blokkal a Sávokon. Headless teszttel demonstrálva (`tests/xf_transfer.js`); felhasználói próba hátra (`PROGRESS.md`). Új modul: `xfer.ts`.

**LP1 Körbeér (0.37.0-lp1, 2026-10-18, mozgás-sáv, `claude/happy-feynman-192ba3` ág):** Körbeér kapcsoló az LFO-n és a folyamatos mozgásokon: egész számú kör a loopban, varratmentes loop-export. Headless teszttel demonstrálva (`tests/lp_loop.js`), teljes kör 41/41; felhasználói próba hátra (`PROGRESS.md`). Következő ebben a sávban: XF1 Mozgás átadása + Sorrend festése, majd KO1 Koreográfia gomb (javaslatok: `docs/javaslatok/MOZGAS-SAV-JAVASLATOK.md`, a felhasználó kérésére önjóváhagyással).
**FÉNY2 (0.38.0-feny2, 2026-10-18, 3D lane):** több fény (Fő + 3) aktív-fény csipekkel, fényformák a tükröződésben, valódi tükrözés/törés és padlótükör az obj3d/3D jeleneten. Headless teszttel demonstrálva (`tests/feny2_lights.js`), felhasználói próba hátra. **Következő a 3D lane-ben: 35. sor Skybox/Környezet — újratervezendő** az addon-csomag (`docs/claude-handoff/`, #16 environment-map, #42 Poly Haven HDR, BASE-01 asset-tulajdon) fényében; jóváhagyás kell.

**MAT1 3D anyagok (0.37.0-mat1, 2026-10-18, 3D lane, ág `claude/happy-thompson-41c815`):** közös anyag-interfész a 3D úton (obj3d, sdfscene, Gerincfelület) és két ráhúzható Megjelenés: **Rajzolt toll** (satírozott tollrajz) és **Hologram**. Headless teszttel demonstrálva (`tests/mat1_materials.js`), felhasználói próba hátra (`PROGRESS.md` legfelül). **Következő a 3D lane-ben:** 4. sor (több fény, fényformák, tükrözés/törés, padlótükör), majd 35. sor (Skybox / Környezet); mindkettő előtt javaslat.

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
- **Koreográfia gomb** (KO1-ben első változat kész, 0.39.0-ko1; a felhasználónak tetszik, 2026-10-18; a 27. sor szerepérzékeny jelenetmozgásának első lépése): kijelölt elemekre a Vel javasol érkezési sorrendet és lépcsőzést (háttér → főcím → kisebb szöveg → formák), rámutatva előnézet, kattintásra elfogadás, egy undo.
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

## Külön layout-prototípusok (2026-10-18, Codex)

A `prototypes/extension-lab/layouts/README.md` az átadó: Unwoven eredeti shader/geometria, állítható paraméterek és visszatekerhető idő; WIDE saját ötkompozíciós tanulmány. A WIDE eredeti kódja továbbra is hiányzik, teljes vizuális egyezés nincs igazolva. 48 Node + 7 célzott headless próba zöld. A főalkalmazás nem változott; R2 integráció továbbra is külön jóváhagyandó.

## Közös elemleltár és ötlettár (2026-10-18, Codex)

Elkészült: `docs/spec/VEL-TELJES-ELEMLELTAR-ES-FEJLESZTESI-OTLETTAR-2026-10-18.md`. Forrásalapú leltár: 72 típus, 54 recept, 259 polcbejegyzés; 63 külön modul + 2 layout; 20 fejlesztési irány, 32 új recept/világ, 24 Megjelenés-/viselkedésötlet és 20 effektlánc. Minden elemnél működés és fejlesztési lehetőség, a beépített/prototípus/ötlet állapot elkülönítve. A Bolygó/Terep/hold/légkör külön részletes fejezet. Csak dokumentáció változott; nincs új integráció. A böngészőben tárolt Saját könyvtár tartalmához export kell, az nincs a leltárban.

## Későbbi fő irányok (2026-10-18)

`docs/claude-handoff/JOVO-3D-SCENE-ES-AI-VAZLAT.md`: SCENE-01 – intuitív, pár kattintásos artisztikus 3D tájépítés, assetbehúzás/elhelyezés, auto lighting; AI-PREVIZ-01 – filmes kompozíciós vázlat, felvételkártya, storyboard/kezdő-zárókép/animatik AI-generátorok számára. Közös scene/asset/kamera alap, cluttermentes közvetlen interakció; mindkettő későbbi terv, nem megkezdett implementáció.

## FORM / ShapeGen beépítés – terv (2026-10-18)

`docs/claude-handoff/shapegen/00-START-HERE.md`: új alkalmazáson belüli ShapeGen fül, Blob/Pattern/BG/Gradient + rajz/geometry/Lottie/ikon eszközök megtartása. Önálló/célhoz kötött Add from Gen/Library; Solo/Scene/Split valódi Vel-preview; Alkalmazás egy undo + opcionális Library-mentés; szerkeszthető forrás és Edit in ShapeGen; teljes random és hat közeli Variations, példányhatókör. 89 funkciótétel, 8 SG task, a mai 0.43.0-merge alapokra illesztve. A FORM v8 Markdown forráskódot nem tartalmaz; source gate a kódoló agentnél. Csak terv, nincs appimplementáció; a korábbi önálló FORM-fejlesztési utasításokat nem hajtjuk végre.

## Help mód — előkészített terv (2026-10-18)

`docs/claude-handoff/help-mode/00-START-HERE.md`: kapcsolható bővebb hover, rögzíthető kártya, explicit fogalom-/effektlinkek, Vissza/Escape, legfeljebb két látható kártya, billentyűzet és érintéses Mi ez?. A meglévő workspace-tooltipra építendő, jelenetmódosítás nélkül. Négy fejlesztési szelet és tartalom-/runtime-agenthatárok; csak terv, implementáció nem kezdődött.

## Help mód — commitra előkészítve (2026-10-18)

`docs/claude-handoff/help-mode/CLAUDE-REVIEW-AND-COMMIT.md`: a felhasználó kérésére működő Help-alap és 16 témás kezdő fogalomtár készült; rögzítés, kapcsolódó kártyák, Escape/F1, egyszeri Mi ez?, keskeny és modalnézet. Nem teljes paraméterkézikönyv. Szándékosan nincs commit, Claude ellenőrizze és commitolja; tesztek: Help 27/27 két ablakméretben, teljes kör 57/57, typecheck/build zöld (`CHECK-RESULTS.md`).

## English-default localization — 2026-10-18 (Codex)

Fast follow-up: `output.ts`, `popovers.ts`, `presets.ts`, `scenes.ts`, `moui.ts` and `timeline.ts` now have English UI literals and interpolated messages; all six are free of Hungarian accent-bearing string/template literals. Typecheck/build and nine targeted browser tests pass. Do not claim the whole editor is English yet; built-in recipe content and other modules remain. Do not switch document language yet.

Follow-up: Library (300 entries), chrome/dialogs and Appearance (82 effect types) have English display adapters in commits `1ed82fa` and `79e21f8`. Motion now has a separate English adapter for 8 types and 42 parameters, including timeline labels. The full 60-test run found 9 obsolete Hungarian-label assertions; those 9 checks were updated and each passed on rerun (the other 51 passed in the full run). Typecheck and production build pass. This is still a partial migration: recipe descriptions, most Motion/timeline commands, export, preset and several other panels remain Hungarian. Keep `lang="hu"` until the rendered English-default quality gate passes; see `docs/spec/VEL-ENGLISH-DEFAULT-LOCALIZATION.md`.

The user's latest instruction applies English default language to the **entire Vel app**, not only Help. `docs/spec/VEL-ENGLISH-DEFAULT-LOCALIZATION.md` is the implementation handoff and compatibility rule. The 16 Help topics and 128 static tooltip descriptions have English copy with stable IDs and old Hungarian title aliases. The remainder of the editor remains Hungarian, so localization is **in progress**, not complete; do not switch document `lang` yet. Next: inventory/migrate all app text and catalog display names without changing persisted identifiers, then validate old projects and every major UI path. Targeted Help test: 28/28; full browser suite: 57/57; typecheck and build pass.

## Új UI/UX-visszajelzés — 2026-10-18 (Codex)

A felhasználó a működést alapvetően jónak, a színeket jónak tartja, de a teljes UI túl zsúfolt. Rögzítve: `docs/spec/vel-ui-visszajelzes-2026-10-18.md` 6. fejezet, hét tartós képi referenciával. Közvetlen görbeszerkesztés és rajz → sima görbe, ritmusikonok, Tempó/Erő kapcsoló, színek csak a Színek alatt, paraméterhez illő vezérlők (szél: iránykör), levágásjavítás, ikonos toolbar és következetes kategóriaszínek; egész appra Apple-jellegű design system javasolt. Hiba a `BUGS.md`-ben is. Csak dokumentálva; következő lépés konkrét design system/UI-javaslat, implementáció külön jóváhagyással.

## Prioritások — 2026-10-18

Két prioritás: (1) UI-frissítés (`docs/final-updates/UI-UPDATE.md`, angol lezárása → WA1 → …), (2) addon-/presetcsomag (`docs/claude-handoff/CSOMAG-CHECKLIST.md`). Sorrendjük egymáshoz képest döntésre vár. Részletek: `docs/final-updates/README.md`.

## UI-alap: Web Awesome (WA1), nem Material 3 — 2026-10-18

**FELÜLÍRVA (2026-10-18, felhasználói döntés): a UI-alap nem Material 3, hanem Web Awesome** (WA1: `docs/final-updates/MILESTONE-WA1.md`, `claude/project-organization-ui-update-746ad1` ág). A Material-anyag csak történeti hivatkozás.

Jelenleg: WA1 (ikonos toolbar, új téma, közös vezérlők a Mozgás kártyán) fut a `claude/project-organization-ui-update-746ad1` ágon, párhuzamosan az angol lokalizációval. A `prototypes/material-ui/` nem a követendő irány.

## (Elavult) Material Design 3 választás — 2026-10-18 (Codex)

A felhasználó Material Design alapot választott. Ez felülírja a korábbi Apple/shadcn alapirányt. Kutatás, Vel-komponensmegfeleltetés, tervezett közös CSS/TS-fájlok és bevezetési sorrend: `docs/spec/VEL-MATERIAL-DESIGN-SYSTEM.md`. Csak terv; következő: konkrét komponensbemutató-szelet javaslata. A Material Web maintenance státusz miatt a Material-spec és a kész csomag kiválasztása külön döntés.

## (Elavult) Material 3 agent-alapcsomag — 2026-10-18 (Codex)

A felhasználó kérésére elkészült a Claude-ban véglegesítendő alap: `prototypes/material-ui/AGENTS.md` és `README.md`. Közös tokenek, CSS, típusos natív DOM-vezérlők, 11 hivatalos Material Symbols + licenc; offline `index.html`, Mozgás/Színek/Részletek példák. Görberajz/simítás/reset és iránykör működik prototípusként; Vel undo/mentés/renderer nincs bekötve. Strict typecheck/build és 19/19 célzott headless próba zöld, 320–1280 px túlcsordulás nélkül. Következő: felhasználói próba és Claude-véglegesítés, majd külön panelintegráció. Nem a teljes kész design system.

## English migration: stable catalog display keys — 2026-10-18 (Codex)

`app/src/catalogcopy.ts` now holds English display labels for all 300 built-in Library entries, keyed by catalog IDs. `catalog.ts` keeps legacy Hungarian `name` values for saved data and bilingual search; three duplicate IDs received explicit unique keys and quickbar aliases. Shelf categories, section headings, role/theme chips and preview copy are English. The rest of the app remains in migration. Targeted `catalog_english.js` and `cat1_search.js` pass; full suite and final code audit pending.

## English migration: chrome, project, effects — 2026-10-18 (Codex)

English source catalogs now cover the static top bar, shortcut guide, project/help dialogs, 82 effect names/descriptions, 700 effect parameter instances, 415 option instances, and Inspector/Appearance controls. The translation adapter is display-only; model keys and old project data remain unchanged. Targeted Help, preset, effect, and Inspector tests pass. Motion metadata, recipes, timelines and many secondary panels are still Hungarian. Full-suite and final language audit remain pending.

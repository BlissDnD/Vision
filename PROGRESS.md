## 2026-10-18 — English motion metadata and timeline labels
- Eight persisted motion types and 42 parameters now have display-only English names, descriptions, and select options keyed by motion type and parameter key.
- The Motion Inspector and timeline use those labels without rewriting saved motion data; targeted browser check passes.
- Source audit still finds Hungarian built-in copy across multiple workflows. Whole-app English default remains incomplete; document language is unchanged.
- Full 60-test run: 51 passed and 9 failed on obsolete Hungarian UI selectors; all 9 were updated to the English labels and passed individually. Typecheck and production build pass.

## 2026-10-18 — English chrome and effects
- English static chrome, shortcut guide and project/help dialogs; stable `locale.ts` message keys.
- Display-only `effectcopy.ts`: 82 effect descriptions, 700 parameter instances, 415 option instances; Inspector and Appearance controls use it.
- Targeted Help, preset, effect and Inspector checks pass. Motion, recipes, timeline and other panels still pending.

## 2026-10-18 — English migration: Library identity and labels
- 300 built-in Library labels now have English display copy under catalog IDs; legacy names remain for saved projects.
- English and Hungarian Library search both work; three duplicate IDs made unique with quickbar aliases.
- Targeted Library/search checks pass. Other UI surfaces and final validation remain pending.

## 2026-10-18 — English-default localization foundation

## 2026-10-18 — Material 3 starter Claude-nak (Codex)
- `prototypes/material-ui/`: közös tokenek/CSS/TS-vezérlők, 11 hivatalos offline SVG, három mintapanel, AGENTS/README.
- Rajzolható/simítható görbe és iránykör prototípus; Vel runtime/undo/mentés nincs bekötve.
- Strict typecheck/build zöld, célzott Playwright 19/19; 320/390/768/1280 px elrendezés ellenőrizve, képek és eredmények a csomagban.
- Felhasználói próba és Claude-ban véglegesítés hátra; a főapp nem változott.

## 2026-10-18 — UI/UX-próba visszajelzésének rögzítése (Codex)
- A UI-spec 6. fejezete: egész appra Apple-jellegű design system, görberajzolás/simítás, ikonok, kapcsolók, iránykör, színek elhelyezése, toolbar és kategóriaszínek.
- Hét felhasználói képkivágás tartós referenciaként elmentve; feliratlevágás és zsúfoltság a BUGS-ban is.
- HANDOFF és funkcióleltár frissítve; csak dokumentáció, appváltozás és tesztfuttatás nincs.
- Scope clarified by user: the entire Vel interface must become English by default, not just Help.
- Added whole-app migration/compatibility handoff; English Help topics and 128 static tooltip descriptions use stable IDs.
- The remaining Hungarian UI/catalog copy is pending. No claim of completed English locale or `lang=en` yet.
- Targeted Help checks 28/28; full browser suite 57/57; typecheck and build pass.

# Vel — PROGRESS

Mérföldkövenkénti napló (legújabb felül). Belépési pont: `CLAUDE.md`; aktuális állapot: `HANDOFF.md`; funkcióállapot: `FUNKCIO-LELTAR.md`.

## 2026-10-18 — közös addon/preset checklist (Codex)

- Új `docs/claude-handoff/CSOMAG-CHECKLIST.md`: 65 addon/layout + 96 ötlet teljes tervbeli lefedettsége, demonstrált szeletek, natív átfedések és hátralévők külön.
- Bekötve a CLAUDE/HANDOFF/START-HERE belépőkbe; STATUS elavult „nem indult” állítása javítva.
- Csak dokumentáció; alkalmazás és teszteredmény nem változott. A részletes listák továbbra is teljes terjedelmükben irányadók.

## Állapot: 2026-10-18 — 1. nagy menet: U5 Szín+UI, CAT-01 témák, M10 korai layoutok (0.48.0-m10a)

A felhasználó kérésére a szalagos stúdió-recept (M6b) kimaradt.
- **U5** (0.46.0-u5): közös színválasztó (`colorpick.ts`: SV, árnyalat, opcionális alfa, hex, pipetta, projekt- és palettaszínek, húzható minták) minden színmezőn, szövegsávban, háttérszínnél; **saját átmenet** (`gradui.ts`, `L.grad`): állomások a sávon, OKLCH/RGB, harmóniák, saját paletták (böngészőben) — a shaderek `pal()` függvényét cseréli, így minden palettás elemen hat; **Színek sor** (`colorsum.ts`) forrásokkal, Kapcsolat-jellel, kontraszt-figyelmeztetés + „Olvashatóvá”; szín ráhúzása rétegre; **felső action bar** (`abar.ts`) + munkatér-elrendezések (Alaphelyzet, 2 mentett). Teszt: `u5_color.js`.
- **CAT-01 témák** (0.47.0-cat2): 8 polcokon átívelő téma chipként (`TOPICS`, `topicItems`). Teszt: `cat2_topics.js`.
- **M10 korai** (0.48.0-m10a, `layouts.ts`): Receptek → **Magazinrács** (saját tanulmány a WIDE után: 3 keretezett kép + élő cím/alcím, 5 kompozíció, képarány-chipek 1:1·4:5·9:16·16:9, a cím mérete a hosszához igazodik, lépcsőzött érkezés) és **Szövött galéria** (Unwoven eredeti shaderei + szalaggeometria natív WebGL2-portja, visszatekerhető). A Kép réteg új **Keret** paraméterei: kivágás téglalapba, sarok. Teszt: `m10_layout.js`.
- Próba: (1) Alakzat → Színek sor pötty → picker, húzás közben élő, ⌘Z egy lépés; (2) Színátmenet → Szín fül → ✎ Saját átmenet → állomás hozzáadása, Triád; (3) húzz egy Megjelenést a felső sávra, jelölj ki réteget, kattints; (4) Téma: Folyadék; (5) Magazinrács → Layout: 9:16 → cím átírása hosszúra; (6) Szövött galéria lejátszás + tekerés.
- Korlát: a saját átmenet a CPU-oldali palettát használó elemeken (pl. Blob, Áramló tinta színe) még nem hat; Magazinrács képcsere a meglévő képbetöltéssel; Unwoven-nél nincs húzásos görgetés (Eltolás paraméter van).

## Állapot: 2026-10-18 — CAT-01 első szelet: mindent gyorsan megtalálsz (0.45.0-cat1)

- Új `src/catalog.ts`: stabil elem-azonosító (`polc:név`, saját elemnél `own:`), négy szerep (Források · Formák · Megjelenések · Mozgás), ékezet- és szinonimatűrő kereső a név, leírás és effektkulcs alapján (22 szinonimacsoport).
- Keresés közben a polcsor szerep-chipekké vált (Mind + szerepek találatszámmal); a keresés törlésekor visszaáll. Régi húzás/thumbnail kulcsok (`ikey`) változatlanok.
- Teszt: `tests/cat1_search.js` — 20/20 keresési eset (pl. „fust”, „csillogó fém”, „szöveg gömbön”), 298/298 elem indexelve, egyedi id.
- Próba: írd be „fust”, „króm”, „szöveg gömbön” → a várt elem az első háromban; „lebeg” → Mozgás chip → csak a Lebegés; töröld a keresést → a polcok visszajönnek.

## Állapot: 2026-10-18 — STAB-01 mini: semmi nem vész el (0.44.0-stab1)

- Mentés: a csak mentett Jelenetben használt kép is a projektfájlba kerül (`usedAssets` jelenetek + Közös alapok); azonos kép egyszer tárolódik (`sameAsset`, kép- és Poly Haven-import).
- Hang: az eredeti hangfájl és a stemek beágyazva (`audio`), újranyitáskor háttérben dekódolva és újraelemezve; projektcserénél a régi hang törlődik.
- Videóexport: az ablak bármilyen bezárása (Escape, háttér, gomb) megszakítja (`R.onModalClose`), a hangkódolás közben is.
- Árva Kapcsolat (mindkét vége sehol) betöltéskor és minden módosításkor törlődik (`gcLinks`).
- Teszt: `tests/stab1_persist.js` zöld. Próba: Jelenet A-ba kép → Jelenet B → mentés fájlba → új projekt → megnyitás: kép megvan; hang + 2 Jelzés → mentés → másik projekt → vissza: hang megvan; export közben Escape: leáll.
- Mellékjavítás: a véletlenül commitolt `app/.venv` symlink kikerült a repóból; a fő mappa tesztkörnyezete újraépítve.

## Állapot: 2026-10-18 — Összefésülés: F1 Folyadék + F2 Fizika ide (0.41.0-merge)

- A `claude/vel-fluid-797dca` ág (F1 Folyadékmező, F2 Fizikai test) összefésülve az E1/P2/K3/T6 ággal. Ütközések: `cost.ts`, `effects/index.ts`, `render.ts` (rajzolóhook + folyadék-előkészítés), `motion.ts`/`moui.ts` (Útvonalon + Fizikai test együtt: a Mozgás polcon 8 mozgás), verzió, doksik.
- Teljes kör az összefésült állapotra: **46/46 zöld**, typecheck 0 hiba, build `app/dist/index.html`.

## Állapot: 2026-10-18 — T6 Szöveg 3D (0.40.0-t6)

- Szöveg és média → **Térbeli szöveg**: Szöveg hengeren / gömbön / Szalaggyűrű (forgás, dőlés, ismétlés, túloldal áttetszik, Tömör test), **Kihúzott 3D szöveg** (mélység, homlok- és oldalszín, fény, csillanás, billegés), **Szöveg útvonalon** (P2 Útvonal vagy saját ív, Eltolás, Úszás, Betűköz, az úttal fordul / egyenesen áll). Mind élő szöveg: a felső szövegsávban vagy a Tartalom fülön írod át.
- Teljes kör az E1+P2+K3+T6 állapotra: **44/44 zöld**. Célzott teszt `tests/t6_text3d.js` zöld (renderel, átírás látszik, forog és seek-determinisztikus, tömör test, túloldal, mélység + oldalszín, betűk az úton és úsznak, újranyitás, 6 könyvtári elem).
- Próba: 1) Szöveg hengeren, írd át; 2) Kihúzott 3D szöveg: Mélység, Fordulat; 3) Útvonal + Szöveg útvonalon (Útvonal választó a Tartalom fülön), Úszás; 4) mentés → újranyitás.
- Korlát: nincs szöveg alakú kivágás, a 3D szöveg nem háromszögháló (nem árnyékol más tárgyra), a gömb sarkain a betűk torzulnak.

## Állapot: 2026-10-18 — K3 Kamera: célzás, követés, útvonal (0.39.0-k3)

- Kamera ablak → **Mód**: Kézi / **Célpontok** („Kijelölt réteg mostantól”; több célpont = célváltás lágy átúszással; mozgó cél követése „Követés késése” szerint; **Élesség a célon** = fókuszváltás) / **Útvonalon** (Útvonal réteg, Bejárás ideje, Körbe/Oda-vissza/Egyszer). **Kézikamera** csúszka minden módban. Követő módban a kulcsolt X/Y eltolás.
- Célzott teszt `tests/k3_camera.js` zöld (középre áll, célváltás átúszik és előtte nem mozdul, késleltetett követés, fókusz a célon, útvonal, determinisztikus remegés, újranyitás, régi kamera változatlan).
- Próba: 1) Kamera be, Mód: Célpontok, 0 mp-nél A réteg, 3 mp-nél B → lejátszás; 2) A-ra Lebegés, Követés késése 0,6; Élesség a célon + blende; 3) Mód: Útvonalon; Kézikamera 0,3; 4) mentés → újranyitás.
- Korlát: 2,5D kamera (nincs valódi 3D nézőpont), a célpontok nem húzható blokkok a Sávokon, nincs kamerafogantyú a vásznon.

## Állapot: 2026-10-18 — P2 Közös útvonal, első szelet (0.38.0-p2)

- **2D Formák → Útvonal (rajzolj)**: egy húzással rajzolod (simított, kevés pont), utána a pontokat húzod, dupla kattintás a szaggatott vonalon = új pont, Alt+kattintás = törlés; inspector: Újrarajzolás, pont törlése, irány megfordítása. 7 kész változat (Neon vonal, Cső, Csavart szalag, Gyöngysor, Kirajzolódó vonal, Zárt forma, Élő hullám).
- Kinézet: Vonal / Cső (3D árnyalás, csillanás) / Csavart szalag / Neon / Gyöngysor; vastagság elején/végén, Színátmenet/Paletta, Kirajzolás (eleje/vége/eltolás), szaggatás, zárt kitöltés (maszknak is), élő hullámzás.
- Ugyanaz az útvonal: **Mozgás → Útvonalon** (Körbe/Oda-vissza/Egyszer, Irányba fordul; az útvonal átszerkesztését/mozgatását követi), **Részecske Forrás → Alak: Útvonal**.
- Célzott teszt `tests/p2_path.js` zöld (görbe, egyenletes mintavétel, egyszerűsítés, háromszögelés, 5 kinézet, kirajzolás, szaggatás, kitöltés, hullám, mozgás a vonalon + követés + Egyszer, emitter a vonalon, újranyitás, 8 könyvtári elem). A `regression` a saját rajzolójú effekteket kihagyja a shaderfordításból; a `polyhaven_import` tesztet stabilabbra javítottam.
- Próba: 1) 2D Formák → Útvonal (rajzolj), húzz egy vonalat; Kinézet: Cső, majd Neon; 2) húzz egy pontot, dupla kattintással adj hozzá; 3) Szöveg + Mozgás → Útvonalon; 4) Részecske Forrás, Alak: Útvonal; mentés → újranyitás.
- Korlát: nincs tangensfogantyú, boole/üreg/kontúreltolás, 3D útvonal és szövegút; éles kanyarban a vastag vonal széle megtörhet.

## Állapot: 2026-10-18 — E1 Részecske Forrás (0.37.0-e1)

- **Részecskék → Részecske Forrás** + 8 kész változat (Szikraeső, Konfetti, Hulló levelek szélben, Hóesés, Füst, Tűzijáték-löket, Pattogó golyók, Szövegből szálló por). Alak: Pont/Vonal/Gyűrű/Korong/Téglalap/Alatta lévő kép alakja; Mennyiség, Élettartam, Irány, Szórás, Sebesség, Gravitáció, Szél + lökések, Örvény, Közegellenállás, pattogó Padló; 7 kinézet (pötty, kör, szikra, csík, konfetti, levél, füstfolt).
- Ütemezés: Folyamatos / Löketek / Jelzésekre (J). A réteget mozgatva (húzás, kulcs, Mozgás) csóvát húz. Állapot nélküli: tekerés = export = újranyitás.
- Célzott teszt `tests/e1_emitter.js` zöld (seek, mennyiség, gravitáció, szél, padló, löket, jelzés, előmelegítés, csóva, képalak, 7 kinézet, 5 alak, 9 könyvtári elem, újranyitás). Typecheck 0 hiba.
- Próba: 1) Részecskék → Szikraeső, lejátszás közben húzd a réteget; 2) Gravitáció 0, Szél jobbra, Padló: Pattog; 3) Ütemezés: Jelzésekre, lejátszás közben J; 4) tekerj vissza, mentés → újranyitás.
- Korlát: nincs útvonal-emitter (következő szelet), nincs ütközés más rétegekkel, nem valódi lépésenkénti szimuláció; M1 Max frame-idő mérése hátra.
## Állapot: 2026-10-18 — F2 Fizikai test (0.38.0-f2, `claude/vel-fluid-797dca` ág)

- **Mozgás polc → Fizikai test:** bármely rétegre húzva merev test lesz: Alak (Automatikus/Kör/Doboz), Gravitáció + irány (alapból 0), Tömeg, Pattanás, Súrlódás, Kezdő lökés + irány, Pörgetés, Ütközés (Mindennel/Csak a csoportjával/Semmivel), Csoport, Rögzített, Vászon széle (Fal/Átengedi), Kezdés.
- A vászon széle alapból fal; a rögzített, kulcsokkal mozgatott réteg tolja a többit; kiesett testnél felirat + Visszahozás; Kulcsokká alakítás a fizikai pályát kulcsokká süti.
- Saját kód (`src/physics.ts`, Oimo.js/Box2D-lite elv), függőség nincs. Ugrás = ugyanaz a helyzet (t = 0-tól, 1 s-os ellenőrzőpontok).
- Célzott teszt: `tests/f2_physics.js` zöld (esés + megállás a falon, gravitáció alapból ki, ütközés + visszapattanás, Semmivel/Csoport-szűrés, rögzített doboz megtartja, két doboz egymáson, seek, kiesés + Visszahozás, renderelt kép, Kulcsokká alakítás, mentés–újranyitás). Teljes kör 41/42; a bukó `mo_motion` csak a polc elemszámát (6) várta, 7-re frissítve külön zöld. Typecheck 0 hiba.
- Próba: 1) 3 alakzat, mindre Fizikai test, Gravitáció 1 → leesnek, pattannak; 2) az egyik Rögzített, kulcsokkal oldalra mozgatva meglöki a többit; 3) Vászon széle = Átengedi → kiesik → Visszahozás; 4) tekerj előre-hátra → ugyanaz.
- Korlát: 2D (a 3D réteg is lapos testként ütközik), csak felső szintű rétegek, nincs csukló/rugó, helyi gravitációs mező, ütközés-esemény, a Kapcsolatok felületén ütközéslista; hosszú jelenetben az első ugrás a végére t = 0-tól számol (≈ 60 lépés/mp, néhány testnél gyors).

## Állapot: 2026-10-18 — F1 Folyadékmező (0.37.0-f1, `claude/vel-fluid-797dca` ág)

- **Források → Áramló tinta** (+ füstcsík, örvények, tintacsepp): valódi GPU-folyadékszimuláció, 1–6 seedelt vándorló forrás palettaszínű tintát fúj; Örvénylés, Lecsengés, Szél + irány, Lüktetés, Minőség. A réteget lejátszás közben húzva belefújsz.
- **Megjelenések → Folyadékos torzítás / Folyadékos feltárás:** a sebességmező csak a célréteg képét mozdítja el; Feltárás módban a réteg csak a tinta nyomában látszik (Perem fény).
- Közös óra: ugrás = újraszimulálás 3 s előfutással, export megismételhető; a mező felbontása a kimenettől független (4K = ugyanaz a mező).
- Célzott teszt: `tests/f1_fluid.js` zöld (idővel változik, seek = azonos kép, Örvénylés hat, 3 minőség, torzítás csak a saját rétegen, Feltárás maszkol, bélyegkép, mentés–újranyitás). Teljes kör 40/41, a bukó `polyhaven_import` az ismert ingadozó teszt (`BUGS.md`). Typecheck 0 hiba.
- Próba: 1) Áramló tinta behúzása, Lejátszás, Örvénylés fel; 2) lejátszás közben húzd a réteget; 3) Szövegre húzd a Folyadékos torzítást, Mód = Feltárás; 4) tekerj vissza ugyanarra az időre → ugyanaz a kép.
- Korlát: megállított ugrás után az első képkocka egy lépés, a pontos kép ~0,2 s múlva finomodik (mint a Visszhangnál); a vászon-kattintás csak a források közelében választja ki a réteget; akadály, közös mező több réteg közt, részecske-kapcsolat még nincs; a húzásból fújás csak kulcsozva kerül exportba.
## Állapot: 2026-10-18 — KO1 Koreográfia (0.39.0-ko1)

- **✦ Koreográfia** gomb a Rétegek fejlécében: a Vel szerepet javasol minden látható rétegnek (Háttér, Főcím, Kísérő szöveg, Fő forma, Díszítő forma, Kép/Videó, Részecske; típus, méret, sorrend alapján), és egy **Editorial érkezés** jelenetmozgást mutat előnézetben a 0. mp-től. A projekt az Elfogadásig nem változik.
- A szerepek eltérően mozognak: a háttér nagyításból puhán ül be, majd lebeg; a főcím alulról becsapódik nagyobb méretből; a kísérő szöveg kicsit és később emelkedik; a fő forma rugózva nő; a díszítők különböző irányokból ívesen érkeznek.
- A kártyán **Mérték / Ritmus (térköz; a belépések sebessége marad) / Hangsúly** állítható, a lenyitható Szerepekben szerepváltás és részvétel, valamint szerepenként súly és késés. Az Elfogadás egy undo-lépés.
- A Sávokon egyetlen **Jelenetmozgás** blokk jelenik meg: húzva eltolja az egészet, a jobb széle a ritmust nyújtja, a › gombbal szerepsorok nyílnak, dupla kattintásra megnyílnak a beállítások.
- A réteg Mozgás fülén: „Szerep ebben a jelenetben”, „Részt vesz”, **Önálló mozgássá** (ugyanaz a mozgás valódi Rugalmas beúszás / Lebegés lesz, és kilép a blokkból).
- Célzott teszt: `tests/ko_choreo.js` zöld (9:16 jelenet: háttér, cím, két szöveg, két forma); teljes kör **43/43 zöld**, typecheck 0 hiba.
- Próba: 1) 9:16, Színátmenet + nagy cím + két kisebb szöveg + két alakzat; 2) ✦ → nézd az előnézetet, húzd a Mértéket és a Hangsúlyt, Elfogadás; 3) a Sávokon told és nyújtsd a blokkot, egy formánál kapcsold ki a Részt vesz kapcsolót; 4) mentés → újranyitás, ⌘Z.
- Korlát: egy profil; nincs Kamera/Fény szerep és belső Kapcsolat (cím → háttér ragyogás); nincs szó-/betűszintű bontás; Jelenetsor-lejátszásban a blokk nem fut; a gomb rámutatásra nem ad előnézetet (a kártya ad).

## Állapot: 2026-10-18 — XF1 Mozgás átadása + Sorrend festése (0.38.0-xf1)

- Mozgáskártya → **⇢ Átadás / Sorrend festése**: végighúzol (vagy rákattintasz) a vásznon a többi elemen. Az érintés sorrendje lesz a lépcső sorrendje, a számjelvények (1, 2, 3) ezt mutatják. A kártyán **Ritmus** (alap: a forrás időzítése és karaktere, saját irány és távolság) / **Út** (a forrás iránya, távolsága és íve, méretarányosan) / **Teljes** választható, plusz **Késés** (mp / cél).
- Elfogadásig csak előnézet (a projekt nem változik), az Elfogadás egy undo-lépés. Esc vagy Mégse esetén nem marad nyom.
- A cél Mozgás fülén ez áll: „Ritmust kap ettől: Címszó”. Csak a saját mezői szerkeszthetők, a forrás javítását követi; a **Leválasztás** önálló mozgássá alakítja ugyanazzal a mozgással (`m.dl` késéssel).
- A Sávokon a forrás alatt egy **Terjedés · N cél** blokk jelenik meg (sorszámjelekkel). A jobb széle nyújtja a késést, kattintásra a sorrend újrafesthető. A célsorok csíkozva látszanak. A forráslistából a × egy célt kivesz; a hiányzó (törölt) célt a blokk jelzi, nem törli.
- Célzott teszt: `tests/xf_transfer.js` zöld; teljes kör **42/42 zöld**, typecheck 0 hiba.
- Próba: 1) három-négy szövegréteg, az elsőn Rugalmas beúszás; 2) Mozgás fül → Átadás, fesd végig a többit, Elfogadás: mind a saját helyére érkezik lépcsőzve; 3) a Sávokon húzd a Terjedés blokk jobb szélét; az első mozgás Időtartamát átírva a többi követi; 4) mentés → újranyitás, ⌘Z.
- Korlát: csak ráhúzott Mozgások adhatók át (kulcsanimáció és Megjelenés-reakció nem); a célok rétegek (egy szövegrétegen belüli szavak nem); a célok a felső szintű rétegek; Jelenetsorban a forrás a szerkesztett jelenetből jön.

## Állapot: 2026-10-18 — LP1 Körbeér (0.37.0-lp1)

- **Körbeér** kapcsoló az LFO-panelen (∿) és az öt folyamatos mozgás kártyáján. Bekapcsolt Loopnál az új hullámokon és mozgásokon alapból be van kapcsolva. A tempó egész számú körre igazodik a projekt (Jelenetsorban a jelenet) hosszában, a felirat mutatja („4 kör / 10 mp”). A tárolt Ütem nem íródik át.
- A Forgás egész fordulatra áll, a Remegés zaja periodikus. Loop nélkül nincs igazítás; Ritmus-tempónál és vágott mozgásnál csak közelítő (a felirat jelzi).
- Célzott teszt: `tests/lp_loop.js` zöld (t=0 és t=dur egyezik minden hullámformára és mozgásra, mentés, régi projekt). Teljes kör **41/41 zöld**, typecheck 0 hiba.
- Próba: 1) 10 mp, Loop be, egy csúszkán ∿, Ütem 0,37: a felirat „4 kör / 10 mp”, a 10→0 váltásnál nincs ugrás; 2) projekthossz 7 mp: a körszám magától változik; 3) Lebegés, Ütem 3 mp: „3 kör / 10 mp”; 4) mentés → újranyitás.
- A javaslatot a felhasználó kérésére Claude hagyta jóvá: `docs/javaslatok/MOZGAS-SAV-JAVASLATOK.md`.
## Állapot: 2026-10-18 — FÉNY2 több fény, fényformák, valódi tükrözés, padlótükör (0.38.0-feny2)

- **Fénycsipek** a Jelenetfény szekcióban: Fő + legfeljebb 3 további fény (+ Fény: ellenfény → hideg kitöltő → meleg felső). Az aktív csip kiemelt (színpötty = fényszín); a csúszkák és a csillanás-húzás az aktív fényt mozgatják. További fény: be/ki, törlés, árnyék nélkül.
- **Fényformák** (Kör, Csík, Négyzet, Gyűrű): a fényes felületen tükörképként és csillanásként látszanak; a fő fénynél is választható (Kör = régi kép).
- **obj3d / 3D jelenet:** Tükröződés: Valódi (jelenet) = második sugár, a tárgy önmagát tükrözi; Üveg + Valódi = belépő–kilépő törés. Padló: Tükör = tükörkép a padlón (erő, távolodva halványul), ekkor a kamera kissé felülről néz. A Vel többi rétege nem látszik a tükörben.
- Shader-fordítás: az élsimítás egy hívási helyre került (headless első kép 135 → 9 mp), a kép pixelre azonos.
- Új kész testek: Tükrös tóruszcsomó, Üvegkristály tükörpadlón. Mentés: `st.light.more`, `st.light.p.shape`, `reflM/floorM/mirror` alapértékkel, régi projekt változatlan.
- Célzott teszt: `tests/feny2_lights.js` zöld, `tests/mat1_materials.js` zöld; typecheck 0; teljes kör 42/42 zöld. Javaslat: `docs/javaslatok/FENY2-FENYEK-TUKROZES-JAVASLAT.md` (önjóváhagyva).
- Próba: 1) Krómkocka, + Fény, a 2. fény formája Csík; 2) csipet váltva húzd a csillanást; 3) Tükrös tóruszcsomó; 4) mentés → újranyitás.
- Korlát: a tükörkép nem homályosodik érdesség szerint; az üveg sötét környezetben (Stúdió) sötét marad; a Gerincfelület/Felhő/Terep csak a fő fényt látja; fényjelölő a vásznon nincs; M1 Max frame-idő nincs mérve.

## Állapot: 2026-10-18 — MAT1 3D anyagok: Rajzolt toll + Hologram (0.37.0-mat1)

- **Anyag-interfész a 3D úton:** közös GLSL-blokk (`effects/mat3d.ts`) és uniform-beállító (`material3d.ts`) a 3D objektumhoz, 3D jelenethez és Gerincfelülethez; a host-Megjelenés felülírja a tárgy Anyagát, az Erősség fokozatosan keveri.
- **Rajzolt toll** (Megjelenések): tárgytérbeli satírozás tónusszintekkel (ritka → kereszt → sűrű), papírszemcse, tintakihagyás, rezgő kontúr, satírozott talajárnyék; tollszín, papír, sűrűség, vastagság, nyomás, kontúr, élő vonal, eredeti szín, papír háttér.
- **Hologram** (Megjelenések): áttetsző, világító perem, pásztázó csíkok, fénysáv, villódzás, elcsúszás (glitch). Gerincfelületen a stúdió és a tükörpadló kimarad alóla.
- 3D polc új blokkja „Rajzolt és hologram”: Rajzolt tóruszcsomó, Rajzolt hóember, Hologram-fej, Hologram-szalag. Mentési formátum nem változott (az anyag a meglévő `fx` listában), migráció nincs.
- Célzott teszt: `tests/mat1_materials.js` zöld; typecheck 0 hiba; teljes kör 41/41 zöld. Javaslat: `docs/javaslatok/MAT1-ANYAGOK-JAVASLAT.md` (a felhasználó távollétében önjóváhagyva).
- Próba: 1) 3D → Rajzolt tóruszcsomó: satírozott rajz, a sötét oldalon sűrűbb; 2) Hologram húzása a Gerincfelületre; 3) Erősség 0→1 kulcsozva; 4) mentés → újranyitás.
- Korlát: a kontúr perem + sziluett (nem geometriai él); a hologram hátlapjai nem látszanak; Terep/Felhő/2D nem célpont; M1 Max frame-idő nincs mérve.

## Állapot: 2026-10-18 — G1 Gesztus-mozgás (0.36.0-g1)

- **Rugalmas beúszás nyila:** vég húzása = irány + távolság; ⌘ + fel/le = tempó (fel = rövidebb), ⌘ + oldalra = karakter (Lágy/Ütés/Rugó); ⌥ vagy a nyíl közepe = ív (a réteg valóban az íven érkezik, `bend` paraméter); ⇧ = 15°-os szögek.
- Húzás közben 8 halvány szellemkép a pályán egyenlő időközönként (sűrűség = sebesség, a rugó túllövése látszik), elengedéskor elhalványul; címke csak módosítóval; súgó a nyílvégen rámutatásra.
- Beúszás/Kiúszás chip: nyíl, húzás = irány (Balról/Jobbról/Emelkedés/Süllyedés), ⌘ = tempó + görbe. Öt folyamatos mozgás saját fogantyúja: Lebegés kettős nyíl, Keringés kör (⌥ irány), Forgás ív, Lüktetés két gyűrű, Remegés cikcakk (⌘ = tempó). A pályát magát húzva előnézeti tekerés.
- Célzott teszt: `tests/g1_gesture.js` zöld; teljes kör 39/40, a bukó `polyhaven_import` önállóan zöld (ingadozó, `BUGS.md`). Typecheck 0 hiba.
- Próba: 1) Rugalmas beúszás, Mozgás fül: ⌘-mal húzd a nyílvéget fel és oldalra; 2) ⌥-ral húzd oldalra a nyíl közepét, játszd le; 3) Lebegés/Keringés chipnél húzd a fogantyút; 4) mentés → újranyitás.
- Korlát: a szellemkép a réteg körvonala (téglalap/kör), nem a valódi kép; a nyíl a réteg alaphelyéből indul (kamerát nem követi); a fogantyúk a kulcsozott paraméter .v értékét írják.

## Állapot: 2026-10-18 — PH1 Poly Haven képek (0.35.0-ph1)

- **Szöveg és média → Poly Haven textúrák:** 12 elemes, kereshető CC0-válogatás; a kártyára kattintva csak a választott hivatalos 2K JPG töltődik le, saját képréteg lesz belőle.
- A kép és az eredet (Poly Haven assetazonosító, forráslink, CC0) a projektben marad; az import egy lépésben visszavonható. A katalóguslista helyi, a letöltéshez internet kell.
- Célzott teszt: `tests/polyhaven_import.js` (polc, keresés, réteg, forrás, offline projekt, undo/redo, hibás válasz) zöld. A teljes kör első futásán 37/39 zöld; a másik két próba tesztfeltételét javítottam (aszinchron Lottie fájlejtés, új nem projekt JSON-minták), majd külön mindkettő zöld. Typecheck és production build zöld. A valódi hálózatos betöltést a felhasználó próbálja ki; WebGL-kép és 4K minőség próba hátra.
- Próba: 1) Szöveg és média → Poly Haven textúrák; 2) keress „márvány”-ra és kattints; 3) mentsd a projektet, nyisd újra internet nélkül. 2D képet kapsz; PBR-anyag, 3D célra húzás és teljes online katalógus még nincs.

## Állapot: 2026-10-18 — L1 Lottie vektoranimáció (0.34.0-l1)

- **Források → Vektoranimáció (Lottie)** vagy Projekt → Vektoranimáció importálása: helyi, tisztán vektoros `.json` előnézete és hozzáadása; a fájl ablakra ejtése is ide jut, a Vel-projekt/preset továbbra is saját importútján marad. Az importablak a LottieFiles gyűjteményét külön lapon nyitja meg; onnan a JSON-fájlt le kell tölteni, beépített online kereső nincs.
- A réteg Megjelenéseket fogad; saját média-Kezdet/Sebesség/Loop értékei vannak (a kulcs-Loop külön), a Sávokon húzható média-blokkal. Visszatekeréskor a Vel idejéből számított képkockát rajzolja; 4K kimenetnél nagyobb felbontású textúrát kér.
- A projekt a használt Lottie-JSON-t magával viszi; az automatikus mentés IndexedDB-be írja a teljes projektet, sikertelenségnél teljes localStorage-mentést próbál, végső hibát láthatóan jelzi. Régi projekt tovább nyílik; hiányzó Lottie-assetet betöltéskor jelzi.
- Célzott teszt: `tests/lottie_import.js` (import, vektoros rajz, undo/redo, idő/Loop, seek, projekt/automatikus mentés, régi/hiányzó és hibás fájl) zöld; teljes kör **38/38 zöld**. Typecheck és production build zöld. JS-bundle 1049 KB (korábbi 891 KB-os viszonyítás: +158 KB); egyetlen HTML 1,15 MB.
- Próba: 1) Importáld az `app/tests/fixtures/vel-lottie-circle.json` mintát; 2) a Sávokon húzd a média-blokkot, állítsd a Sebességet és a média Loopját; 3) mentsd, nyisd újra, majd hasonlíts össze egy kiválasztott MP4-képkockát a vászonnal.
- Korlát: képes/szöveges/fontos/expression Lottie nincs; nagy videóimport, LottieFiles kereső és általános médiatároló későbbi szelet. Valódi GPU-n 4K/10 réteg teljesítménye és az MP4 képkocka-egyezés felhasználói próbája hátra van.

## Állapot: 2026-10-18 — Q1 Random minőségszűrő

- **Ronda dobások kiszűrése:** minden Random dobást kicsiben (≤640 px, két időpontban) lerenderel és lemér; 10 tünet: túl sötét, beégett, sáros, lapos, zajos (elszigetelt pöttyök, RGB-pöttyök is), zsúfolt, nincs fókusz, túl tarka, kemény egyenes vágás, pixeles (tört periódusú blokkhatárok is). Pontszám 0–100, küszöb a Szigorúság csúszkán (alap 60). A gyengét újradobja (max. 6 próba / ~0,7 mp, a legjobb nyer); a felirat írja, mit dobott el és miért.
- **Hibás effekt keresése:** zaj / pixelesség / vágás esetén a gyanús effekteket (film, textúra, glitch, chroma, ASCII, raszter, pixel art, feedback, tükör, kaleidoszkóp, CRT, Kinézet-szemcse) egyenként kihagyva újramér; csak a bűnöst gyengíti (átlátszóság) vagy veszi ki (a torzítókat mindig kiveszi).
- **Receptszabályok:** erős fókusz mellé legfeljebb 1 torzítás; kaleidoszkóphoz nincs színcsúszás/sugár, izzó fókuszhoz nincs külön glow; legfeljebb 3 ráadás-effekt.
- **Ronda / Tetszik** sáv minden dobás után (Ronda = ritkábban + új dobás); az ízlés a böngészőben és a projektfájlban (`taste`) is megmarad, megnyitáskor összefésül (kétszer megnyitva sem dupláz). Panel: Random → Minőségszűrő (kapcsoló, Szigorúság, Ízlés törlése).
- Teszt: `tests/rnd_quality.js` zöld; teljes kör: 37/37 zöld. Mérés: headless (CPU) egy dobás szűréssel ~3 s, valódi GPU-n nincs mérve. Verzió: nem emeltem (a párhuzamos T1 a `package.json`-t épp szerkeszti).
- Próba: 1) 20× R a kedvenc hangulatokkal: hány ronda? 2) Random → Minőségszűrő → Szigorúság max; 3) 3× Ronda kaleidoszkópos jelenetre: ritkábban jön? 4) mentés → újranyitás másik böngészőben/fájlból: megvan az ízlés (Ízlés: N jelzés).

## Állapot: 2026-10-18 — T1 3D Terep: 0.33.0-terep1

- **Források → 3D Terep** (és Világok → 3D Terep: hegyvidék, dűnék, sziget, kanyon, fennsík, kráteres): valódi magasságmező-háló saját kamerával, jelenetfénnyel, vetett árnyékkal, vízzel, égbolttal és távoli párával.
- Fő vezérlők: Tereptípus (6), Mag (kockával új változat), Stílus (Mérsékelt, Sivatag, Havas, Vulkáni, Idegen), Méret, Domborzat, Részletek, Vízszint; Kép: Háttér, Pára, Expozíció, Minőség (Vázlat/Normál/Részletes). Minden animálható.
- A vásznon húzás = körbeforgatás (nem kell az O eszköz), görgő = távolság; a Jelenetfény szakasz az inspectorban.
- Magasságfüggvény: ZyFou/ProceduralTerrains (MIT) zajmagja portolva (`terrain3d.ts`, licenc a fejlécben).
- Teszt: `tests/t1_terrain3d.js` zöld (seed ugyanaz/más, 6 típus eltér, víz, fényirány, seek, Domborzat-animáció, újranyitás). Frame-idő M1 Max-on még nincs mérve (élő próba).
- Próba: 1) Források → 3D Terep, kocka 3×, Mag vissza; 2) Kanyon → Sziget, Vízszint fel, húzással körbe; 3) Jelenetfény iránya; Domborzat 0→1 kulcsokkal; 4) mentés → újranyitás, 4K PNG.

## Állapot: 2026-10-18 — Időzítés gyorsan: 0.32.0-t1

- **Koppintás kosárral** (T vagy a ✋ gomb az idővonal sávján): rétegekre kattintva (vásznon/listában) kosárba, számozott jelvény a soron és a vásznon, újrakattintás kivesz, jelvény/chip húzással átrendez; élesítéskor a kijelölt csoport gyerekei vagy a kijelölt kulcsok rétegei bekerülnek. Szóköz + **J** minden ütemre: a következő réteg belépése oda tolódik (nincs belépés → Rugalmas beúszás), a koppintás J-jelzés is. Egy undo; Esc visszavonja a menetet, újabb Esc kilép.
- **Tempó-chip** (½× · 1× · 2× + finom csúszka ¼–4×) a Mozgás fül Animáció összesítőjében, rétegen és csoporton: valódi átidőzítés (kulcsok, beúszás/kiúszás, mozgások üteme/sebessége, ritmusciklus, hullám), egy undo.
- **Sima (átmenő) kulcsgörbe** (monoton Hermite): az Eljátszás kulcsai ezt kapják → nincs csúcsos pálya, nem áll meg kulcsoknál; a görbemenüben is. BUGS: javítva.
- Teszt: `tests/tap_timing.js` zöld. Próba: 1) 3 réteg, T, kattints rájuk sorban; 2) Szóköz, J-J-J ütemre; 3) ⌘Z / Esc; 4) Tempó ½× egy mozgó rétegen; 5) Eljátszás egy körrel → sima-e.

## Állapot: 2026-10-18 — R1 CRT-képernyő + Színes vetett fény: 0.31.0-r1

- **Megjelenések → CRT-képernyő** (`crt`): domborúság, lekerekített sarok (kívül átlátszó), RGB-elcsúszás, képsorok (szám a vászonhoz kötve, 1080p és 4K azonos), RGB-maszk, zaj/villódzás a jelenetidőhöz kötve, vignetta. A meglévő Glitch/Kromatikus aberráció/Film mellé, nem helyettük.
- **Megjelenések → Színes vetett fény** (`castlight`): a réteg alfájából hosszú csóva, Irány/Hossz/Erősség/Lecsengés, közeli és távoli szín. Két lépcső × 16 minta = 256 lépés, így a költség nem nő a hosszal; a réteg keretén túl is látszik, a háttér átlátszó marad.
- Új referencialista: `FUNKCIO-LELTAR.md` 37–42. sor (forrás: `docs/spec/VEL-UJ-REFERENCIAK-KODTERV-2026-10-18.md`).
- Teszt: `tests/r1_crt_light.js` zöld (irány, túloldal/sarok üres, irányváltás, mozgatás, CRT-ugrás azonos, csoport, újranyitás, könyvtár). SwiftShader 960×540: szöveg 39 ms, +CRT 61 ms, +vetett fény 138 ms (CPU, csak arány). Valódi GPU/4K nincs mérve.
- Felhasználói próba: 1) Megjelenések → Színes vetett fény egy szövegre, Irány és Hossz csúszka; 2) Megjelenések → CRT-képernyő egy fotóra vagy csoportra (sarkok, színes perem?); 3) idővonalon ugrálás: a CRT-zaj ugyanaz; 4) 4K export.

## Állapot: 2026-10-18 — Mozgás v1.1: 0.30.0-mo11

- **Ritmus** a folytonos mozgásokon (Lebegés, Forgás, Lüktetés, Keringés, Remegés): chipek (Folyamatos · Megáll időnként · Lassul–gyorsul · Elcsendesedik · Véletlen szünetek), szerkeszthető együtemes **ritmus-szalag** (pont le = lassabb/megáll, fel = gyorsabb, jobb szél = ütemhossz, élő pötty), **Tempó** (ott áll meg, ahol van) / **Erő** (nyugalomba tér). Projekt-Looptól független, ugrás = export = élő (analitikus fázisintegrál).
- **Mozgássávok** a Sávokon: réteg ▸ mozgás (húzható sáv, kezdés/vége, puha felfutás; vég a jelenet végéig húzva = nyitott) ▸ paraméterek ▸ kulcsok. A mozgáscsúszkákon ◆ és ∿. **Kulcsokká alakítás**: a mozgásból valódi X/Y/Méret/Szög/Átlátszóság kulcsok (egy ⌘Z).
- **Verziócímke** bal felül a név mellett (`v0.30.0-mo11 · hó.nap óra:perc`), rámutatva a teljes build-idő.
- Teszt: `tests/mo_rhythm.js` zöld; teljes kör: lásd HANDOFF. Felhasználói próba: 1) Lebegés egy körre → Ritmus: Megáll időnként; 2) a szalagon egy pontot húzz le/fel lejátszás közben; 3) Sávok → réteg ▸ → a mozgássáv végét húzd be; 4) Rugalmas beúszás → Kulcsokká alakítás.

## 2026-10-18 — CodePen-portok a könyvtárban

- Liquid Glass a Megjelenésekben: ráhúzható rétegre, elmozdítható lencse, eredeti 9×9 mintavétel vagy valóban olcsóbb Gyors mód. Szélben lobogó láng a Forrásokban, beágyazott zajtextúrával. Két új recept: Liquid Glass · fénykép és Láng · szélben.
- Typecheck és build sikeres. Célzott böngészős könyvtárteszt és a meglévő P1 teszt `bad: []`. Valós GPU-s 4K-teljesítmény és a láng vizuális egyezése nem igazolt; a láng korábbi műterméke nyitott.
- Felhasználói próba: 1) Könyvtár → Receptek → Liquid Glass · fénykép; 2) Megjelenések → Liquid Glass egy saját képre húzva; 3) Források → Szélben lobogó láng. A beállítások a kijelölt elemnél módosíthatók.

## 2026-10-18 — projektfájl a presetablakban

- A Preset beillesztése ablak felismeri a teljes Vel-projektet, és külön, a jelenlegi projekt cseréjét kimondó megnyitógombot ad. A vászonra ejtett `.vel.json` ugyanoda jut. Ez a két CodePen-mintaprojekt beillesztésekor jelentkező félrevezető `layers` hibát javítja.
- Typecheck és célzott böngészős P1 teszt sikeres (`bad: []`), benne a teljes projekt presetablakból való megnyitásával.

## 2026-10-18 — CodePen-effektek eredeti képleteinek portpróbája

- `presets/egyedi/liquid-glass-eredeti-demo.vel.json`: a Liquid Glass eredeti képleteivel és Pexels-fotójával kész, közvetlenül megnyitható Vel-projekt. Külön importálható shader: `liquid-glass-eredeti-port.json`. A 9×9 mintavétel 4K-sebessége még nincs mérve.
- `presets/egyedi/lang-eredeti-demo.vel.json`: a CodePenben használt zajtextúrát a projektbe ágyazva futtatja az eredeti lángképlet portját. A saját shader képbemenetéhez `mediaFor()` most elfogad `asset` mezőt. A lángban még látszik egy függőleges műtermék; az eredeti Shadertoy-kód licence sem tisztázott. Részletek: `presets/egyedi/EREDETI-PORTOK.md` és `BUGS.md`.
- Ellenőrzés: TypeScript typecheck és production build sikeres; mindkét projektnél böngészős shaderfordítás és betöltési próba hibamentes. Felhasználói, valós GPU-s összevetés még nincs.

## Állapot: 2026-10-18 — Mozgás v1: 0.29.0-mo1

- **Mozgás polc → Ráhúzható mozgások:** Lebegés, Forgás, Lüktetés, Keringés, Remegés, Rugalmas beúszás (ikonos kártya, „rétegre” címke). Rámutatva a **kijelölt rétegen élő előnézet** (saját órával, állított lejátszásnál is); kattintás = a kijelölt rétegre, húzás = a vásznon a mutató alatti rétegre vagy a rétegsorra. Ráhúzás után a Mozgás fül nyílik, a lejátszás indul (ha állt), ⌘Z visszavonja.
- **Mozgás fül → Mozgások:** ikonsor (mint az effekteknél, erősség-gyűrűvel), „+” ikonrács, kiválasztott mozgás beállításai, be/ki, törlés. A régi Belépés/Kilépés ugyanitt **Beúszás/Kiúszás** chipként (az adat változatlan, régi projektek ugyanúgy mozognak); a régi Időzítés szekció megszűnt. Képkocka-ütem itt egy sor. A mozgások erőssége a Fő beállításokban is (szinkron).
- **Folyamatos mozgások** tiszta időfüggvények: a projekt Loopjától függetlenül, Loop nélkül is futnak, varrat nélkül.
- **Rugalmas beúszás:** Anime.js-görbe (spring / outBack, ~6 KB, MIT) szűk adapteren át, a Vel órája a mester (prototípus: tetszőleges sorrendű ugrás ugyanazt adja). Kezdés a lejátszófejnél; karakter Lágy / Ütés / Rugó, távolság, irány, beúszó áttetszőség, kezdő méret. **Vásznon szaggatott nyíl**, a végét húzva állítod, honnan érkezik. Idővonalon narancs szakasz, retime/nyújtás érti.
- **⟲ Kulcsanimáció ismétlése (rétegenként):** a réteg utolsó kulcsa után állítható idő alatt simán visszatér az elsőre és ismétel, a többi rétegtől függetlenül; az idővonalon csíkozott jelölés.
- **Kulcs csak Animálás módban:** A nélkül egy kulcsolt érték állítása nem ír kulcsot, hanem az egész animációt eltolja, és a lejátszás nem áll meg. Animálás módban a régi viselkedés.
- **Késői kulcsok jelzése** (BUGS.md): ha Loopnál a projekt hossza után is van kulcs, a Mozgás fül szól, egy gombbal kiterjeszti a hosszt.
- Teszt: `tests/mo_motion.js` (polc, előnézet, kattintás + undo, periodikusság és Loop nélküli futás, vászonra ejtés, beúszás kezdete/vége/iránya, ugrás-determinizmus pixelre, ikonsor, régi Időzítés eltűnt, erősség két helyen, nyílhúzás, idővonal + retime, kulcs-Loop, eltolás vs. Animálás mód, késői kulcs jelzés, mentés → megnyitás, normalizálás). A `u1_anim` és `u4_ui` az új szabályhoz igazítva. **32/32 zöld.**
- **Felhasználói próba (4 perc):** 1) Jelölj ki egy formát, vidd az egeret a Lebegés kártya fölé (előnézet), húzd a Lüktetést egy szövegre; Loop ki: tovább mozognak. 2) Rugalmas beúszás egy feliratra; a vásznon a nyíl végével fordítsd balról érkezőre; az idővonalon nyújtsd. 3) A módban két kulcs egy formára → ⟲ ismétlés; A nélkül húzd arrébb: a pálya vele megy. 4) Régi projekt Belépés/Kilépéssel: Beúszás chipként látszik.
- Korlát: a mozgások paraméterei még nem kulcsolhatók; szavankénti/soronkénti lépcsőzés és kamerás ráúszás a Mozgás v2-ben; a kulcs-Loop a projekt Loop körbeérésénél (ha nem többszöröse) ugorhat.

## Állapot: 2026-10-18 — U4 „Tömörebb jobb panel, szövegsáv, effekt-ikonsor”: 0.28.0-u4

- **Egysoros csúszkák:** név (38%) · vékony sáv · érték egy sorban (16 px magas); az animálás/kulcs ikonjai rámutatáskor a név végén jelennek meg (animált/kulcsolt értéknél mindig). A csoportok nagy Vezérlői maradtak kétsorosak. Szorosabb szakaszok.
- **Jobb panel sorrendje:** Tartalom fül: Fő beállítások → közvetlenül alatta Részletek → a leírás alul.
- **Mozgás fül:** az animációs paraméterek (Animált szöveg: Mozdulat, Egység, Sorrend, Kezdés, Időtartam, Lépcsőzés, Kilépés, Görbe; Feltárás, Bento, Részecskés szétesés; máshol a tempó jellegűek: Sebesség, Pörgés, Szél …) a Mozgás fülre kerültek („Szövegmozgás” / „Mozgás beállításai”, a ritkábbak a „Mozgás finomhangolása” alatt). A fő mozgásvezérlők (pl. Mozdulat, Időtartam, Sebesség) a Fő beállításokban is megmaradnak, és a két vezérlő együtt mozog (`syncTwins`, `R.liveSel`). Besorolás: `effects/index.ts` `animKeysOf` / `mainDupOf`.
- **Rétegeffektek ikonsorként:** minden Megjelenés saját ikonnal (`src/fxicons.ts`), sorszámmal, kikapcsolva halványan, nem illő célon piros kerettel; kattintás = kiválasztás (alatta név, ◀ ▶, be/ki, törlés, a beállítások lenyitva), húzás = átrendezés (visszavonható); „+” = ikonrács a lenyíló lista helyett (a nem illők tiltva).
- **Felső szövegsáv** (`src/textbar.ts`): szöveg kijelölésekor a vászon tetején: betűtípus, **B**, szín (Animált szövegnél Szín 1, egyszínűre vált; Szövegnél a Szín fülre ugrik), balra/középre/jobbra, Méret · Sortáv · Betűköz húzható mezők, „↯ Mozdulat” chip a Mozgás fülre, ⋯ a többi szövegbeállításhoz.
- **Kiegészítés (a felhasználó jóváhagyta):** dupla kattintás egy szövegre a vásznon → helyben átírható (Enter: új sor, ⌘Enter vagy mellékattintás: kész, egy visszavonási lépés; Esc: mégse). Az effekt-ikonok körül **erősség-gyűrű** (a Megjelenés Erőssége 0–100%, élőben követi a csúszkát).
- **Mérés (animált szöveg, Tartalom fül magassága):** előtte 1015 px, most 686 px (a mozgásbeállítások a Mozgás fülön: 554 px, a ritkábbak csukva). Egy csúszka sora 16 px.
- Teszt: `tests/u4_ui.js` (sorrend, egysoros csúszka, magasság, Mozgás fül, kettőzött vezérlők szinkronja csúszkán és listán, Plazma sebesség két helyen, ikonsor, ikonrács + tiltás, hozzáadás, húzásos átrendezés + undo, szövegsáv: B, igazítás, betűtípus, szín, eltűnés). **31/31 zöld** (a másik munkamenet `codepen_library` tesztjével együtt).
- **Felhasználói próba (3 perc):** 1) Animált szöveg → felül a szövegsávban B, szín, középre, Méret húzása; a jobb panel Tartalom füle görgetés nélkül elfér. 2) Mozgás fül: Szövegmozgás → Időtartam; a Tartalom fülön ugyanaz az érték. 3) Húzz két Megjelenést egy rétegre → Effektek fül: ikonsor, húzd át a sorrendet, kattints az egyikre, vedd le az Erősséget (a gyűrű fogy); „+” ikonrács. 4) Dupla kattintás egy feliratra a vásznon → írd át → ⌘Enter.
- Korlát: a Belépés/Kilépés Időzítés szekció marad (a Mozgás polc váltja ki); a szövegsáv nem kezel soronkénti formázást (⋯ → Tartalom fül); az ikonok egyszerű saját jelek.

## Állapot: 2026-10-18 — P1 „Presetek kívülről (ChatGPT) + saját shader”: 0.27.0-p1

- **Saját könyvtár** (`src/userlib.ts`): általános, tartós tár (IndexedDB `vel-userlib`, memóriában is), elem: `{id, kind:'preset'|'shader'|…, cat, name, created, data, thumb}`; ismeretlen fajták megmaradnak (későbbi felhasználásra). Projekt menü: könyvtár mentése fájlba / betöltése (sosem ír felül, csak hozzáad); a projektfájl `ulib` mezője viszi a benne használt elemeket (v4 marad, régi fájl: nincs).
- **Polcok:** a saját elemek a választott polc elején („Saját”), „saját” jellel és bélyegképpel; kattintható, húzható, kereshető. Jobb klikk vagy ⋯: átnevezés, polc, törlés (csak a sajátnál). **Mentés presetként:** ☆ az inspector fejlécében (vagy Projekt menü) → név + polc.
- **ChatGPT-híd:** Projekt → „Utasítás ChatGPT-nek” a vágólapra teszi a teljes formátumot (aktuális vászon, hossz, effektlista, paletták, receptek, vezérlők, shader-szerződés a GLSL-fejlécből generálva). „Preset beillesztése…” (vagy .json fájl húzása a vászonra/ablakba): JSON kibontása a ```json blokkból, ellenőrzés (`buildFromSpec`: ismeretlen effekt / paraméter / csúszka / vezérlőcél kimarad és listázva), előnézet, gépigény-próbarender (Plazmához mérve, túl nehéznél figyelmeztet), beillesztés (⌘Z), Mentés a könyvtárba.
- **Vezérlők a formátumban:** `macros:[{l, v, t:[[rétegIndex,'p.kulcs'|'n.kulcs'|'a:p.kulcs',a,b]]}]`, mint a gyári recepteknél (Vezérlők az inspectorban).
- **Saját shader:** `custom` réteg `code` + `sliders` (név, tartomány, alap, szín; max 8) → `L.cp`; `paramsOf(L)` (effects/index) adja a rétegenkénti paraméterlistát a renderhez, inspectorhoz, Sávokhoz, makróhoz, Kapcsolathoz, jelenetátmenethez. Inspectorban csúszka-szerkesztő (+ Csúszka / + Szín). Fordítási hiba sorszámmal, „Hiba másolása ChatGPT-nek” gomb. A mért gépigény (`L.cw`) a terhelésjelzőbe kerül.
- `docs/VEL-PRESET-FORMATUM.md`: a `npm run build` generálja a kódból (`src/presetfmt.ts`).
- Teszt: `tests/p1_presets.js` (tár ki/be, polc, keresés, beillesztés → undo, kimaradt elemek, makrók és LFO-makró, saját shader csúszkái animálnak és mentés → megnyitás után is, hibás GLSL 3. sorral, mentés presetként → polcról beszúrás → projektfájl viszi → visszaáll, régi saját GLSL, utasítás tartalma). **29/29 zöld.**
- **Felhasználói próba (4 perc):** 1) Projekt → Utasítás ChatGPT-nek → ChatGPT-be beilleszt → kérj pl. „neon kapu két vezérlővel” → a választ Projekt → Preset beillesztése → Beillesztés → a vásznon, ⌘Z visszavonja. 2) Jelölj ki egy csoportot → ☆ → Receptek polc → megjelenik „saját” jellel, húzd a vászonra; Projekt → Könyvtár mentése fájlba, töröld (jobb klikk), Könyvtár betöltése → visszajön. 3) Kérj saját shaderes presetet elnevezett csúszkákkal; animáld az egyik csúszkát; írj a kódba szándékos hibát → érthető hibaüzenet, „Hiba másolása ChatGPT-nek”.
- Korlát: a saját shader rétegként működik (az alatta lévő kép az `IN(uv)`-vel szűrhető), ráhúzható saját Megjelenés még nincs; a gépigény-mérés egyszeri próbarender (kis felbontás); a könyvtár a böngészőprofilhoz kötött (fájlba mentve hordozható).

## Állapot: 2026-10-18 — U3 + K1 + S1 egyben (a felhasználó egyben hagyta jóvá): 0.26.0-s1

- **U3 – munkatér:** a könyvtár a bal oszlopba került a rétegek fölé, húzható elválasztóval (dupla kattintás = alaphelyzet, nyilakkal is), a vászon a teljes magasságot kapja. Kétoszlopos könyvtárkártyák; Megjelenés-kártyán címke: „csak Felhő” / „rétegre is”. Rétegsor-jelvények: ◆ animált (kulcs / hullám / jel), ✦ Megjelenés, ⇢ Kapcsolat (kattintható), ⧉ Változat; rámutatva magyarázat. Minden `title` ugyanazt a gyors, egységes tooltipet kapja, a „(V)” billentyűsapka lesz. Fejléc-gombok ikonnal; kapcsolható gyorsbillentyű-panel a vásznon (⌨ gomb vagy ?), a Súgó táblázata ugyanebből a listából. Kód: `src/workspace.ts`, `layers.ts` (`layerBadges`), `shelf.ts` (`dropTag`).
- **K1 – Kapcsolat-zsinór:** a kijelölt elem gizmója mellett ⇢ pont; húzáskor vékony zsinór, csak az értelmes célok emelődnek ki (elhelyezhető elem: gyűrű; teljes képes réteg, pl. Égszín: címke a vászon tetején; plusz a rétegsor). Üresre engedve semmi nem történik. Célra engedve kártya: „Napfény hat: …” (Nap → Égszín/Felhők/Pára/Talaj: a cél Napszak és Vízszintes értéke a Nap valódi helyét követi), „Kövesse” (a cél a forrás elmozdulását követi 0,25 mp késéssel), „Vezérelje: [érték]” (a forrás animált értéke vagy vízszintes helye); rámutatás = élő előnézet, kattintás = elfogadás (egy visszavonási lépés). ⇄ irányváltás. Kijelölve csak a saját zsinórok; a zsinór közepe vagy a ⇢ jelvény mini-kártyát nyit (ki/be, erősség, késés, Részletek, Törlés). A régi paraméter-Kapcsolatok ugyanabban a listában. Kód: `src/linkcord.ts`, `variants.ts` (`Link.kind`, `attachEffect`).
- **S1 – Jelenetek + átmenetek:** új Jelenetek sáv (idővonal-gomb). „+ Jelenetként mentés” a mostani vásznat a sor végére menti; jelenetkártya: név, hossz, Betöltés a vászonra, Felülírás a vászonnal, sorrend, törlés. Jelenetsor-gomb: az idővonal a teljes sor, a lejátszás és az export a jeleneteket adja (a vászon ilyenkor nem szerkeszthető, a projekt saját hossza nem változik). Átmenet a következő jelenet első 1 mp-ében (állítható 0–3 mp, görbe): rétegpárosítás kézi › azonos elem › Közös alap › típus+név; párosítva hely, méret, szín, paraméterek átmennek, ami csak az előzőben van, kiúszik (és közben tovább fut), ami csak az újban, beúszik. Párosítás felülírható az átmenet-kártyán. Kód: `src/scenes.ts`, `sim.ts` (`frameAt`), `render.ts` (rétegenkénti `_toff`).
- Teszt: `tests/u3_ui.js`, `tests/k1_cord.js`, `tests/s1_scenes.js` (+ a régiek). Élő böngészős próba: a felhasználó végzi.
- **Felhasználói próba (4 perc):** 1) U3: húzd az elválasztót, keress „felhő”-t, húzz egy elemet a vászonra; nézd a jelvényeket egy animált, effektes rétegen; ⌨ gomb. 2) K1: Világok → Égszín + Nap; jelöld ki a Napot, a ⇢ pontot húzd az „Égszín” címkére → „Napfény hat” → mozgasd a Napot lefelé: alkonyodik. Aztán Szöveg + Kör: Kör ⇢ a szövegre → Kövesse → mozgasd a kört. Undo. 3) S1: Jelenetek gomb → „+ Jelenetként mentés”; told a címet máshová, adj hozzá egy formát → mentsd újra; Jelenetsor ▶: a cím odacsúszik, a forma beúszik; a ⟷ chipen állítsd a hosszt. 4) Exportálás Jelenetsor módban: a videó a teljes sor.
- Korlát: K1 – a zsinór csak a vásznon a gizmóról indul (Mozgásblokkról, Megjelenésről, paraméterpontból még nem); a Nap gizmója a réteg középpontján van, nem a korongon. S1 – a jelenetsorban a Kapcsolatok nem hatnak és a kamera a vászoné; a „Betöltés” felülírja a vásznat (visszavonható); eltérő típusok közt nincs alakmorfolás.

---
Korábbi bejegyzések (U1, M7 … M1): `docs/archiv/PROGRESS-korabbi.md`.

### 2026-10-18 – külön layoutlabor (Codex)
- Unwoven: eredeti shader/geometria, 14 vezérlő, képcsere, determinisztikus idő, JSON-beállítás.
- WIDE: saját ötkompozíciós tanulmány; eredeti forrás/animáció átemelése nyitott.
- 48/48 Node, build sikeres, 7/7 layout headless próba. Átadó: `prototypes/extension-lab/layouts/README.md`.
- Főalkalmazás/build változatlan; felhasználói próba és R2-integráció nincs elvégezve.

### 2026-10-18 – teljes elemleltár és fejlesztési ötlettár (Codex)
- Egy fájlban 72 elemtípus, 54 recept és mind a 259 könyvtári bejegyzés; működés/vezérlők/jobbá tétel.
- Mind a 63 külön modul, két layout és az előző 20 ötlet; 32 új részletes recept/világ, 24 Megjelenésötlet, 20 lánc.
- Bolygó: jelenlegi funkciók pontosítva; hold-komponens, közös domborzat, légkör és háttérbe simulás terve.
- Lefedettség forráslistákkal ellenőrizve; alkalmazáskód/build és funkcióállapot nem változott.
- Fájl: `docs/spec/VEL-TELJES-ELEMLELTAR-ES-FEJLESZTESI-OTLETTAR-2026-10-18.md`.

### 2026-10-18 – teljes Claude multi-agent átadócsomag (Codex)
- `docs/claude-handoff/00-START-HERE.md`: intuitív, kreatív, cluttermentes UX minden új funkcióra.
- 26 taskkártya + DAG; egy nagy fejlesztő és kis izolált segítők, fájltulajdon és tokenfegyelem.
- 63 addon +2 layout,44 régi követelménysor és96 új ötlet útvonala;229 metaadatrekord őrzi a259 mai polcsort.
- Előkészítő keresőmodell:13 célzott Node-próba zöld; csomaglink/DAG/source-hash ellenőrzés külön.
- ZIP a mappa és releváns forrás-/licenc-/tervpillanatképek átadásához; nem teljes telepíthető app.
- Appkód/build változatlan; jövőbeli implementáció a meglévő mérföldkő-jóváhagyási szabállyal.

### 2026-10-18 – két későbbi alkotói munkafolyamat (Codex)
- SCENE-01: fő cél a gyors, szép artisztikus 3D táj, kevés assettel és kontrollálható automatikus világítással.
- AI-PREVIZ-01: ugyanabból a scene-ből filmes felvételkártya, kompozíciós referencia, később storyboard/animatik/passzcsomag.
- Külön brief/taskkártyák, feltételes függőségek;28 backlogcsalád, az új kettő deferred.
- A 2D/2,5D referencia-PNG korábban is készülhet; közös 3D/depth/mask capability nem feltételezett.
- Csak terv/átadó/ZIP frissül, appkód és build változatlan.

### 2026-10-18 – FORM → ShapeGen integrációs terv (Codex)
- `docs/claude-handoff/shapegen/00-START-HERE.md`: csak terv, mai 0.43-as Velhez.
- Négy generátor és az összes átadóban leírt segédeszköz: 89 funkció/UX tétel, 8 task.
- Két belépés, Solo/Scene/Split, típusos célmező, ideiglenes preview és egy apply/undo.
- Szerkeszthető Library + Edit, gyors mentés, gépi hordozhatóság, példányhatókör, Random/Variations.
- A csatolt átadó másolata/provenance megőrizve; FORM-forrás és futási/vizuális paritás nem ellenőrzött.
- Appkód/build változatlan; külön terv-ZIP, nem a régi snapshot csendes átírása.

### 2026-10-18 — Help mód előkészítés (Codex)
- `docs/claude-handoff/help-mode/00-START-HERE.md`: forrásra illesztett Help mód terv a 0.45.0-cat1 alapnál.
- Rögzítés, fogalomlánc, fókusz/modal/érintés szabályok, tartalomszerződés, négy szelet és elfogadási esetek.
- Csak dokumentáció; appkód/build nem változott, UI-próba nem futott.

### 2026-10-18 — Help mód implementáció-előkészítés (Codex)
- A felhasználó külön kérte: működő előkészítés, Claude ellenőriz és commitol. Nincs saját commit/stage.
- `help.ts`, `helpdata.ts`, workspace/stílus bekötés; 16 téma, 11 cél, generikus rövidszöveg-fallback.
- Rögzített/fogalomkártyák, Escape/F1/fókusz, Mi ez?, keskeny és modalnézet; projektírás nélkül.
- Typecheck + normál build zöld; Help 27/27 széles és keskeny nézetben; teljes kör 57/57 zöld.
- Ellenőrzések és határok: `docs/claude-handoff/help-mode/CHECK-RESULTS.md`. Felhasználói látványpróba hátra.

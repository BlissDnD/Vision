# Vel — PROGRESS

Mérföldkövenkénti napló (legújabb felül). Belépési pont: `CLAUDE.md`; aktuális állapot: `HANDOFF.md`; funkcióállapot: `FUNKCIO-LELTAR.md`.

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

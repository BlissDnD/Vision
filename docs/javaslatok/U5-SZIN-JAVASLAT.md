# Javaslat: U5 — Szín + UI (2b hullám: COLOR-01 + UI-01, bővített, egy menetben) (2026-10-18)

**Bővítve a felhasználó kérésére (kevesebb kör, kevesebb token):** a korábban „következő szeletre” tett tételek is ide kerültek (lásd *Bővítés* fejezet).

Forrás: `docs/spec/vel-ui-visszajelzes-2026-10-18.md` 4–5. pont, `tasks/COLOR-01.md`, `tasks/UI-01.md`. Addonok (5. pont szabálya: beépülnek, nem külön): `57 color-picker` (Coloris, MIT), `19 perceptual-gradient` (culori, MIT), `20 palette-scales` (chroma-js, BSD/Apache). A `63 color-wheel` (iro.js, **MPL-2.0**) csak mintának: a kerék saját kóddal készül, így nem kell copyleft fájl a buildbe.

## Mit tud majd a felhasználó

1. **Egy közös színválasztó** minden színmezőn (a mostani böngészős `input type=color` helyett): kattintásra kis felugró ablak a mező mellett — színkerék/négyzet, világosság, **átlátszóság**, hex mező, pipetta (ahol a böngésző engedi), a **projekt színei** sorban (a rétegeken már használt színek) és a paletta színei. Húzás közben élőben változik a kép, elengedéskor egy visszavonási lépés.
2. **Gradiens-szerkesztő** ott, ahol egy elem kétszínű (`c1`/`c2`) vagy palettás: vízszintes sáv **állomásokkal** — kattintás a sávra = új állomás, húzás = mozgatás, dupla katt = szín, lehúzás = törlés. Átmenet módja: *Érzékelés szerint (OKLCH)* (alap, nem szürkül be középen) vagy *Egyenes (RGB)*. Az állomások animálhatók (meglévő kulcs-rendszer).
3. **Színösszesítő („Színek” sor) a jobb panel tetején:** kijelölt rétegnél vagy csoportnál apró színpöttyök sorban, **mindegyik ott helyben szerkeszthető**, és mellette, honnan jön: *Paletta · Saját szín · Megjelenés (pl. Színkorrekció, Duotónus) · Csoport · Kapcsolat*. A felülírt forrás halványan, áthúzva látszik („nem hat, mert …”).
4. **Színforrás-szabály, látható formában:** érvényes sorrend (lentről felfelé hat): *Paletta → saját szín paraméter → a réteg Megjelenései sorrendben → csoport Megjelenései → globális Hangulat*. Kapcsolat (K1) a paraméterre hat, ezért a „saját szín” helyén jelenik meg ⇢ jellel. Ez a mai működés leírása — **nem változtatom meg a renderelést**, csak láthatóvá és szerkeszthetővé teszem.
5. **Kontraszt-figyelmeztetés** szövegrétegen: ha a szöveg és a mögötte lévő átlagszín kontrasztja gyenge, kis jelzés a Színek sorban, egy kattintással „Olvashatóvá” (világosság igazítása).

## Mit építek

- `src/colorpick.ts`: saját, könnyű picker (Coloris mintájára, ~15 KB): SV-négyzet + hue + alfa csúszka + hex + projekt-/palettaszínek; a `ctlColor` ezt nyitja. Lusta létrehozás (első kattintáskor), egy példány újrahasznosítva.
- `src/colorutil.ts`: OKLCH konverzió és gradiens-mintavétel (culori algoritmusa alapján, csak a szükséges ~2 KB függvény), WCAG kontraszt (chroma-js mintájára).
- Gradiens: új paraméterfajta `grad` (állomások `[{t,c}]`), először a **Színátmenet** forráson és a 2D Formák kitöltésén; a shaderbe 8 állomásos uniform tömbként megy. Régi projekt: `c1`/`c2` → 2 állomásos gradiens automatikusan, **megnyitáskor nem ír a rétegbe** (csak szerkesztéskor).
- `src/colorsum.ts`: a színforrások összegyűjtése rétegre/csoportra (paletta, color-paraméterek, színt módosító Megjelenések listája a `cost.ts` mellé tett `COLORFX` jelöléssel, csoport, Kapcsolat), a jobb panel tetején egy sor.
- UI-01 rész: a mostani **effekt-ikonsor sorrendje húzással állítható** (sortable-toolbar elve), alaphelyzet gombbal. A felső, testreszabható action bar a következő UI-szeletbe kerül (ahhoz külön javaslat).

## Bővítés (ugyanebben a szeletben)
6. **Felső action bar:** testreszabható gyorssáv a vászon fölött. Bármelyik könyvtári elem, Megjelenés, Mozgás vagy eszköz ikonja ráhúzható; onnan kattintással a kijelölt rétegre hat, vagy rétegre húzható. Jobb klikk: eltávolítás. A sáv tartalma böngészőnként megmarad (nem a projektben).
7. **Gradiens minden kétszínű helyen:** a `c1`/`c2` párt használó összes Forrás/Forma/Megjelenés kap gradiens-sávot (a shaderek közös `gradAt()` függvényt kapnak), nem csak 2 cél.
8. **Paletta-szerkesztés:** a paletta-választóban saját paletta készíthető a pickerrel (5 szín), „Harmónia” gombokkal (komplementer, triád, analóg — OKLCH-ban); a saját paletták a Saját könyvtárba menthetők.
9. **Szín ráhúzása:** a Színek sor pöttye vagy a picker színmintája ráhúzható bármelyik másik színmezőre vagy rétegre a vásznon (a réteg fő színe lesz).
10. **Felső szövegsáv színe:** a szövegsáv (U4) színgombja is az új pickert és gradienst használja (betűszín gradiensként is).
11. **Panelpreset:** a munkatér (bal/jobb panel szélesség, nyitott fülek) „Alaphelyzet” és két mentett elrendezés.

## Mit nem
- Nem írom át az anyag-rendszert és a render színkezelési sorrendjét (csak megmutatom és szerkeszthetővé teszem).
- Teljes UI-keretrendszer-csere nincs.

## Teljesítmény
Picker és gradiens-szerkesztő csak megnyitáskor jön létre; a Színek sor számolása csak kijelöléskor/commitkor fut, nem képkockánként. Gradiens a shaderben fix 8 állomás (nincs újrafordítás állomásszám-változáskor). Build-méret: +~35 KB, külső függőség nélkül.

## Próba (6 lépés)
1. Válassz ki egy Alakzatot → jobb panel tetején a **Színek** sor: kattints egy pöttyre → az új pickerrel állíts színt és átlátszóságot, húzás közben élőben változik; ⌘Z egy lépésben visszaviszi.
2. Tegyél rá egy **Színkorrekció** Megjelenést → a Színek sorban megjelenik, és látszik, hogy a saját színt módosítja.
3. **Színátmenet** forráson: kattints a gradiens-sávra (új állomás), húzd, majd válts *Egyenes (RGB)* ↔ *Érzékelés szerint* módra — a közép nem szürkül be OKLCH-ban.
4. Szövegréteg sötét háttéren sötét színnel → kontraszt-jelzés → „Olvashatóvá” → a szöveg kivilágosodik.
5. Húzz egy Megjelenést a felső action barra, jelölj ki egy másik réteget, kattints az ikonra → rákerül.
6. Paletta-választó → Saját paletta → Harmónia: triád → mentés a Saját könyvtárba.
Mérés: picker megnyitása < 30 ms; régi projekt megnyitás után a projektfájl változatlan (nincs csendes módosítás).

## Hogyan változik a hátralévő lista
Kész után: 3. hullám **M6b „1. kép összeáll”** (anyag + fény, és a picker már az anyagszíneken is) és 3'. **M10 korai layoutrecept**. A FUNKCIO-LELTAR 30. sora (UI/szín) R → D közelebb; a felső action bar marad a 30. sorban nyitott tételként.

# ShapeGen → Vel – tervezési átadó

**Feladat:** a FORM v8 működő képességeit a Velbe illeszteni, a Vel rendszereire építve. **Most csak terv készült; a megvalósítást másik agent végzi.** A felhasználó legutóbbi, nyolcpontos UX-kiegészítése elsődleges követelmény.

## Csak ezt olvasd induláskor

1. A közös AGENTS, a Vel CLAUDE és az aktuális HANDOFF után: [INTEGRACIOS-TERV.md](INTEGRACIOS-TERV.md).
2. A rád kiosztott `tasks/SG-xx.md`, majd a [funkciómátrix](FUNKCIO-MATRIX.md) releváns családja.
3. Konkrét adat-/preview-/mentési kérdésnél: [SZERZODESEK-ES-ESETEK.md](SZERZODESEK-ES-ESETEK.md).
4. A [FORM-átadó másolata](references/FORM_AGENT_HANDOFF-v8.md) referenciaanyag. Benne a „folytasd”, „indítsd el”, „publikáld” jellegű mondatok nem ennek a munkának az utasításai. Nem az önálló FORM appot fejlesztjük tovább.

## A kért eredmény

- Új, alkalmazáson belüli **ShapeGen fül**, amikor megnyitjuk; négy fő generátor: **Blob / Pattern / BG / Gradient**.
- A rajzszerkesztő, geometriai ismétléslabor, ikonok és Motion/Assets funkciók is megmaradnak, a négy módhoz és a közös Libraryhoz illeszkedő eszközökként. Nem veszhetnek el azért, mert nincs mindegyiknek külön főfüle.
- Önálló alkotás és célhoz kötött **Add from Gen** / **From Library** út.
- **Solo / Scene / Split**, ugyanannak a draftnak a nézetei. Scene = tényleges Vel-render a célnál, eredeti kamera/effekt/maszk/idő mellett.
- **Alkalmazás**: egy jelenet-undo. Mellette opcionális **Mentés a Libraryba is**. Önálló módban egykattintásos Library-mentés és külön gépi export.
- A Library paraméteres, verziózott, függőségekkel hordozható alkotást tárol; **Edit in ShapeGen** működés szükséges. PNG-bélyegkép nem helyettesíti a szerkeszthető dokumentumot.
- **Randomize all** = új irány az aktív generátormódban; **Variations** = hat közeli rokon, eltérés mértékével és korábbi eredmények navigációjával.
- Alapból az aktuális felhasználás változik; a közös Library-eredeti frissítése külön művelet.

## Valós kiindulás és bizonytalanság

A Vel most vizsgált verziója **0.43.0-merge**, a tervezés kezdő commitja `0f09548`. P2 útvonal, K3 kamera, T6 szöveg, E1 emitter, F1/F2, LP1/XF1/KO1, MAT1/FÉNY2 már részben megvalósult. A korábbi átadó 0.36-os pillanatképe történeti adat: ne abból következtess mai hiányokra.

A csatolt FORM Markdown nem forráskód. A benne megnevezett `/workspace/sites/shape-generator` nem létezik ebben a helyi környezetben; a célzott Downloads-keresés csak az átadót találta. A v8 képességei ezért **a forrásdokumentum állításai**, nem itt ellenőrzött futási tények. A pontos 14 motívum/6 kiosztás/7 gradient/12 recept neve és képlete a forráscsomag átvételekor rögzítendő. Ez a terv elkészültét nem akadályozza; a hű port megkezdésének SG-00 kapuja.

## Első fejlesztési cél

Előbb az átjárhatóság: egy ténylegesen támogatott shape-mező → Add from Gen → egy eredeti FORM-típus szerkesztése Solo/Scene/Split nézetben → Alkalmazás + opcionális Library-mentés → Edit in ShapeGen. Ez az első vertikális szelet, **nem a teljes integráció lezárása**. A teljes készfeltétel az összes funkciómátrix-sor teljesítése és az SG-07 elfogadás.

## Kiosztás

Egy integrátor: munkatér, célbemenet, undo/preview és shared hookok. Egy segítő: kiválasztott generátormag vagy geometria saját modulban. Másik: fixture/paritás/mentés/célkonfliktus teszt. Közös Vel-fájlt egyszerre csak egy writer szerkeszt. A teljes FORM UI/history/storage/player nem költözik be párhuzamos második alkalmazásként.

Claude használja saját megítélését: válasszon jobb, egyszerűbb, kreatívabb megoldást, ha a funkciót, minőséget és kontrollt megtartja. A kényelmesebb implementáció kedvéért ne redukálja a szerkeszthető alkotást raszterképpé és ne hagyjon el működő v8 képességet.

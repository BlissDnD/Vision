# Vel — Material Design 3 alapú design system

Dátum: 2026-10-18. Felhasználói döntés: Material Design legyen az alap. Ez felülírja a korábbi Apple-jellegű alapirányt és a shadcn-ajánlást; a cluttermentes, intuitív kezelés követelménye megmarad.
Állapot: kutatás és terv; nincs új UI implementálva. A meglévő UI-visszajelzés 6. fejezete továbbra is követelményforrás.

## Komponensmegfeleltetés
| Vel-feladat | Material-alap | Vel-specifikus kiegészítés |
|---|---|---|
| Toolbar, rétegműveletek | Icon buttons, buttons, menus, tooltips | Kategóriaikon és szín; aktív eszköz |
| Inspectorfülek | Tabs | Tartalom, Színek/Megjelenés, Mozgás stb. |
| Loop és be/ki opciók | Switch | Valódi bináris értékhez |
| Tempó/Erő, minőség | Egymást kizáró gombcsoport | Nem be/ki kapcsoló: két megnevezett mód |
| Tempó, erősség, szórás | Slider + text field | Pontos számbevitel és reset; paraméterfüggő skála |
| Könyvtár, keresés, kategóriák | Search, chips, lists/cards | Szerepek, előnézet, húzás |
| Színek és színforrások | Surface, list, menu | Saját gradiens/paletta/picker a Színek alatt |
| Export és projektműveletek | Dialog, progress, snackbar | Megszakítás, állapot, hibavisszajelzés |
| Panelek és részletek | Material felületszerepek, elválasztók, hierarchia | Átméretezhető asztali panel, lenyitható részletek |
| Ritmus és kulcsgörbe | Material-stílus és interakciós állapotok | Saját minigörbék, görbeszerkesztés, rajz → simítás |
| Szélirány, útvonal, idővonal | Material-stílus és interakciós állapotok | Saját iránykör, vászonfogantyúk, sávok/kulcsok |

## Tervezett fájlok — még nem létező implementáció
- `app/src/ui/tokens.css`: szemantikus szín-, betű-, térköz-, forma-, magasság- és mozgásváltozók; sötét és világos téma.
- `app/src/ui/components.css`: közös komponensek megjelenése és állapotai.
- `app/src/ui/controls.ts`: újrahasználható vezérlők és közös eseménykezelési szerződés.
- `app/src/ui/icons.ts`: Material Symbols SVG-ikonok közös névtára, beágyazva az offline buildbe.
- `prototypes/material-ui/index.html`: önálló komponensbemutató és mintapanelek, implementációkor.
- Ez a dokumentum: szabályok, források, komponensleltár és migrációs állapot. A futó UI a kódbeli közös fájlokat használja; a bemutató is ezeket importálja, nem külön másolatot.

A meglévő `app/src/style.css` témaváltozóit először át kell térképezni a közös tokenekre, majd panelenként átvezetni. A kész alkalmazás továbbra is egyetlen önálló `app/dist/index.html` lehet; a forrásban több rendezett fájl dolgozik együtt.

## Létrehozási sorrend
1. Meglévő vezérlők és ismétlődő minták leltára; Material-komponenshez rendelés.
2. Közös tokenek, ikoncsalád, tipográfia, állapotok és asztali sűrűség meghatározása. Kategóriaszín nem lehet az egyetlen jelölés, és nem azonos a kijelölés színével.
3. Komponensbemutató: alapvezérlők és három mintapanel (Mozgás, Színek, Részletek). Keskeny panel, hosszú angol felirat, billentyűzet/fókusz, tooltip és kontraszt ellenőrzése.
4. Felhasználói látvány- és kezelési próba, majd a jóváhagyott minta fokozatos bevezetése; meglévő értékek, undo/mentés és animáció megőrzése.
5. Új funkció már a közös komponensekből épüljön; a migrált/nyitott felületek listája legyen explicit.

## Technikai döntési pont
A Vel natív TypeScript/DOM + CSS app, nem React. A Material Design szabályrendszerének használata nem igényel MUI/React átállást. A hivatalos `@material/web` Web Components készlet jelenleg maintenance mode állapotú; ezért nem alapozunk automatikusan a teljes csomagra. A konkrét csomaghasználat előtt célzott próba kell az offline builddel, témázással és paraméter-/animációkezeléssel. Javasolt alap: Material 3 szabályok, saját közös natív vezérlők és Material Symbols.

## Hivatalos források
- https://m3.material.io/components — komponenskatalógus (Material-spec, nem minden elem kész webkomponens).
- https://m3.material.io/foundations/ — alapelvek és tokenek.
- https://m3.material.io/styles/color/the-color-system — szemantikus színszerepek.
- https://developers.google.com/fonts/docs/material_symbols — ikonok, SVG és testreszabás.
- https://github.com/material-components/material-web — webkomponensek és maintenance státusz.

# CAT-01 — Egységes metaadat és található könyvtár

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Első szelet: stabil ID → négy szerep → keresés/szinonima → régi drag payload átvezetése. Második: családok és témagyűjtemények.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [UX-ES-KONYVTAR.md](../UX-ES-KONYVTAR.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)
- [preparation/README.md](../preparation/README.md)

**Kódban célzottan:** `app/src/library.ts`, `app/src/shelf.ts`, `app/src/itemops.ts`, `app/src/presets.ts`, `app/src/userlib.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: külön metaadat/alias modul. C: legacy payload és sajátpreset teszt; A kapcsolja be a UI-t.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Minden mai csempe elérhető; ugyanaz az ID több témában; régi saját kategóriák működnek; 20 keresési eset és drag-mapping; preview nem ment.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem LLM-kereső, nem új renderer; a négy kategória nem nevezi át a projekt layer.type értékét.

**Korábbi terv kapcsolata:** A/B/G; leltár1,16,21,28/29.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

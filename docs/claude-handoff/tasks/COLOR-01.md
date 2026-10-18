# COLOR-01 — U5: színhierarchia és szerkeszthető gradiens

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Egyértelmű effektív színforrás; réteg/csoport/base/effekt viszony; gradiensállomások és egy közös picker. Előbb egy céltípus, aztán bővítés.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [UX-ES-KONYVTAR.md](../UX-ES-KONYVTAR.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/controls.ts`, `app/src/palettes.ts`, `app/src/inspector.ts`, `app/src/textbar.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: tiszta gradiensmag P19/P20 és fixture. C: kontraszt/öröklés/saját eltérés tesztek.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

A felület mutatja, melyik szín érvényes; inspector megnyitása nem módosít; gradiensmentés/undo; régi paletták azonos képpel.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem három új színválasztó és nem minden anyagrendszer újraírása.

**Korábbi terv kapcsolata:** B/C; U5; leltár2,30.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

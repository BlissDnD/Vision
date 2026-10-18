# RELIGHT-01 — Kép újravilágítás mélységtérképpel

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Először saját mélység-/normálkép import és mozgatható fény; automatikus mélység csak külön minőségi/költség döntés.

## Előfeltétel

BASE-01, BASE-02, MAT-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/render.ts`, `app/src/lightui.ts`, `app/src/effects/filters.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: normál/depth preprocess kísérlet. C: peremhiba és árnyalat fixture.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Hiányzó vagy hibás depth javítható; fényirány gesztus; eredeti kép visszakapható; mentés és export.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem kész AI-mélységgenerálás; WebGPU referencia nem automatikus WebGL2 port.

**Korábbi terv kapcsolata:** C; leltár41.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

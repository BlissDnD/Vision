# PERF-01 — Mérési profilok és renderköltség

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Reprezentatív referenciajelenetek, külön CPU/GPU/feltöltés/memória/export mérés; új adapter hozzáadása előtt baseline.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ELLENORZES-ES-ATADAS.md](../ELLENORZES-ES-ATADAS.md)

**Kódban célzottan:** `app/src/cost.ts`, `app/src/adaptive.ts`, `app/src/output.ts`, `app/tests`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: minimál fixture/benchmark. C: mérési report és lifecycle ellenőrzés.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Headless és valódi GPU elkülönítve; felbontás/device/adatok rögzítve; abszolút és baseline-hoz viszonyított szám; eltérés oka és fallback.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem új drága debug UI az alkotói felületre; előzetes ms cél nem mérési eredmény.

**Korábbi terv kapcsolata:** C–G keresztmetszet.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

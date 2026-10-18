# FLUID-01 — Áramló festék és folyadékos torzítás

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Először külön2D mezőforrás, explicit injektor és idő/replay. Utána célrétegre torzítás/feltárás. A térbeli fizikai Liquid külön, későbbi szelet.

## Előfeltétel

BASE-02

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/sim.ts`, `app/src/render.ts`, `app/src/effects/generators.ts`, `app/src/effects/filters.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: solver tiszta modul vagy shaderkísérlet. C: pixelazonos replay és változó paraméter.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Nem üres, stabil mező; seek/reset/export egyezés; injektor vászongesztus; egy undo; minőség/memória; félbeszakítható előszámítás.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

P50 saját kísérlet nem az eredeti nagy solver; 3D fizikai folyadék nincs ígérve.

**Korábbi terv kapcsolata:** F; leltár15,33.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

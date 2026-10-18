# PART-01 — Egy részecskeemitter és három első preset

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Nebula/Quarks/GPU alapból egy út választása; pontemitter, életkor, szél, sprite, seed. Első három: por/szikra/hó. A képbontó régi út megmarad.

## Előfeltétel

BASE-01, BASE-02

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/partfx.ts`, `app/src/effects/particles.ts`, `app/src/sim.ts`, `app/src/render.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: sprite/életgörbe adat vagy replay-core. C: lifecycle+seek+mentés teszt.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Emitter életkor és időfüggvény; A→B→A, scene lokális idő, hordozható atlasz, dispose; előnézet/export, mennyiség/minőség; széllel közös gesztus.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem két emittermotor; nem minden ütközés és folyadék egyszerre.

**Korábbi terv kapcsolata:** D/E; leltár14,15.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

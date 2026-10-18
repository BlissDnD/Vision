# PHYS-01 — Egy fizikai motor, ráhúzható test és alapból kikapcsolt gravitáció

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

A régi Oimo-irányt és a Cannon/Rapier példákat célzott próbával összevetni; egy motor. Egy test/talaj, rögzítés, tömeg/súrlódás/rugalmasság, később mezők.

## Előfeltétel

BASE-02

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)
- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)

**Kódban célzottan:** `app/src/sim.ts`, `app/src/render.ts`, `app/src/state.ts`, `app/src/variants.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: collider+determinista replay kísérlet. C: hosszú seek és reset fixture.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Gravitáció alapból ki; test visszahozható; rögzített lépés/replay/checkpoint; projektcsere kitakarít; kontaktus érthető esemény; exportazonosság.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem teljes dinamika minden rétegtípuson, nem 3D folyadék.

**Korábbi terv kapcsolata:** E; leltár15,23,36.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

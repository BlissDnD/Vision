# BASE-02 — Capability és célzott renderadapter-döntés

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Egy kiválasztott célhoz hasonlítsd a natív algoritmus/mesh út és az opcionális Three bridge árát. Az eredmény lehet a meglévő render megtartása.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)
- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)

**Kódban célzottan:** `app/src/render.ts`, `app/src/gl.ts`, `app/src/mesh3d.ts`, `app/src/terrain3d.ts`, `app/src/effects/index.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: algoritmuskísérlet saját prototypeban. C: frame-összevetés és erőforrásteszt.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Egy reprezentatív frame alfa/színtér/resize/seek/dispose próbával; mért többletköltség és kódméret; rövid ADR, nincs általános bridge ígéret.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem kötelező általános Three-host minden feladat előtt; geometry-only importhoz nem kell bridge.

**Korábbi terv kapcsolata:** C; renderkapu.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

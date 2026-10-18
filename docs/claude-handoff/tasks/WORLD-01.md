# WORLD-01 — T2: bolygódomborzat és világkomponensek

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Először meglévő Bolygó + valódi gömbi domborzat miniprototípus; a T1 mag újrahasználata. Utána légköri háttérillesztés; holdkomponens LINK-kel külön.

## Előfeltétel

TRIAGE-01, BASE-02

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/terrain3d.ts`, `app/src/effects/worlds.ts`, `app/src/mesh3d.ts`, `app/src/render.ts`, `app/src/library.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: tiszta gömbi height/normal kísérlet. C:7 típus+part réteg összevetés.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Forgáskor nincs varrat; valódi horizontsziluett; felhő/légkör/gyűrű/városfény megmarad; seed/seek/mentés/export; visszaesési út a régi bolygóra.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem komplett naprendszer vagy tetszőleges háló displacement egy szeletben; közös3D tér nem automatikus.

**Korábbi terv kapcsolata:** C/D; T2; leltár13,32.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

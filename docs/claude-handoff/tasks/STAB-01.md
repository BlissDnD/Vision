# STAB-01 — Mentés/export/kapcsolat hibák célzott stabilizálása

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

A BUGS érintett adatvesztési/export hibáit reprodukálni; igazoltnál szűk javítás. Jelenet/base média, projektcsere hang, abort és kapcsolatparaméter.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ELLENORZES-ES-ATADAS.md](../ELLENORZES-ES-ATADAS.md)
- [ALLAPOT-ES-HATAROK.md](../ALLAPOT-ES-HATAROK.md)

**Kódban célzottan:** `app/src/history.ts`, `app/src/output.ts`, `app/src/signals.ts`, `app/src/linkcord.ts`, `app/src/variants.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: minimál fixture. C: regressziós próba. A egy hibát vigyen végig, nem mindent egyszerre.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Tiszta környezetű újranyitás és két projekt váltása; cancel tényleg megszakít és felszabadít; reprodukció nélkül nincs hamis javítva státusz.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem általános refaktor; a vizsgálatból nem szabad feltételezett hibát bizonyítottnak nevezni.

**Korábbi terv kapcsolata:** A/B; BUGS audit T1/T2/T4.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

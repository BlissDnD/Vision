# MOT-01 — Új mozgások és átadás kis szeletekben

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Elsőnek organikus Lebegés-változat vagy több réteg lépcsőzése; meglévő hat mozgás bővítése. Útvonalos változat PATH után; célkövetés LINK után.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [UX-ES-KONYVTAR.md](../UX-ES-KONYVTAR.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/motion.ts`, `app/src/moui.ts`, `app/src/gesture.ts`, `app/src/evaluation.ts`, `app/src/timeline.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: tiszta evaluator/görbe és teszt. C: régi6 motion+retime regresszió.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

A→B→A azonos; G1 fogantyú megmarad; kulcs csak Animálás módban; Loop nélkül folytatódik; átadáskor Ritmus/Út/Teljes hatókör világos.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem második tween/GSAP óra; a fizikai ütközés PHYS-01.

**Korábbi terv kapcsolata:** B; U2; leltár9,10,22,25–29,34.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

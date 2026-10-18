# RECIPE-01 — Kurált receptek, családok és szerepalapú random

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Először3 csomag a beépített elemekből: CRT-adás, nyomdai plakát, egyszerű űrtáj. Új motoros család csak saját feltételei után.

## Előfeltétel

CAT-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [UX-ES-KONYVTAR.md](../UX-ES-KONYVTAR.md)
- [FORRASUTMUTATO.md](../FORRASUTMUTATO.md)

**Kódban célzottan:** `app/src/recipes.ts`, `app/src/random.ts`, `app/src/rndq.ts`, `app/src/taste.ts`, `app/src/macros.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: izolált receptadat saját fájlban. C: képarány/szöveg/random baseline screenshot.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Kibontva szerkeszthető;3–6 érthető makró; rövid/hosszú szöveg és3 képarány; seed/locks; random nem ígér hiányzó hostot vagy szereprendszert.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Naprendszer látványmakett és teljes3D keringés külön; nem minden32 ötlet egyszerre.

**Korábbi terv kapcsolata:** G; leltár16,27,43.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

# BASE-01 — Médiafüggőségek és újranyithatóság

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

A meglévő asset/vector/ULIB út egységes referenciagyűjtése és forrásmetaadata; új modellekhez/fontokhoz szerződés. STAB reprodukált javítása beemelhető.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/history.ts`, `app/src/state.ts`, `app/src/migrate.ts`, `app/src/userlib.ts`, `app/src/autosave.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: tiszta ref-collector/teszt. C: hiányzó média és régi projekt fixture.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Aktuális+mentett jelenet+base használt médiája újranyílik; árva/hiányzó asset érthető; ideiglenes URL nincs a projektben; régi projektek megmaradnak.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem teljes tárolómotorcsere; nagyvideó-proxy VIDEO-01.

**Korábbi terv kapcsolata:** A; P1/L1/PH1; leltár18,28.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

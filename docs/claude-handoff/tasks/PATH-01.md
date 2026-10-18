# PATH-01 — Közös útvonal első használható szelete

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Egységes görbeadat és hossz szerinti mintavétel; először egy meglévő mozgáspályához adapter. Később szöveg/cső/SVG.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/animate.ts`, `app/src/perform.ts`, `app/src/mesh3d.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: tiszta görbemag P10/P58 és vel-utvonal prototípus alapján. C: geometriai/időzítési tesztek.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Nyílt/zárt pálya; időminták megmaradnak; egyenletes mintavétel; mentés és régi gesztus kompatibilis; egy látható útvonalgesztus.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem komplett vektoreditor és nem minden geometry-motor egyszerre.

**Korábbi terv kapcsolata:** B/C; U2; leltár6,10,39.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

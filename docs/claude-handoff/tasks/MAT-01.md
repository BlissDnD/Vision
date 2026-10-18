# MAT-01 — Ráhúzható anyagok és fénycsaládok

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Egy hoston egy demonstrált anyagcsere; kompatibilitás, közös fény, később PBR/HDR. R1b fényfogantyú kis külön szeletként korábban is készülhet.

## Előfeltétel

BASE-02, COLOR-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/effects/objects3d.ts`, `app/src/effects/soft3d.ts`, `app/src/lightui.ts`, `app/src/render.ts`, `app/src/effects/filters.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: tiszta anyagparaméter/kurált preset. C: célonkénti shader/látványteszt.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Azonos forma/kamera mellett anyagcsere; régi vizuális karakter; hostfüggő világos ok; fényfogantyú nem ütközik mozgatással; 4K-kapu mérve.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem globális fizikai fény/tükrözés minden rétegre automatikusan.

**Korábbi terv kapcsolata:** C; R1b; leltár2–4,35,37,40.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

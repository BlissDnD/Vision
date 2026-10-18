# LAYOUT-01 — Unwoven rétegbemenet és WIDE szerkeszthető recept

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Két külön szelet: Unwoven képfájl helyett rétegbemenet+idő; WIDE eredeti forrás tisztázása és layoutrecipé. A meglévő Bento/címlap alapra építs.

## Előfeltétel

CAT-01, BASE-01, BASE-02

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [UX-ES-KONYVTAR.md](../UX-ES-KONYVTAR.md)
- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)

**Kódban célzottan:** `app/src/recipes.ts`, `app/src/effects/motionDesign.ts`, `app/src/render.ts`, `app/src/textlines.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: layoutadat/fókuszpontok. C: hosszuszöveg/képarány fixture és eredeti-új összevetés.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Szalag finomság megmarad; kép/text csere;1:1/4:5/9:16; hosszú magyar szöveg; save/seek/export; WIDE hűséget csak bizonyítékkal állítani.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

WIDE-forrás hiányában az eredeti port ága vár; Unwoven függetlenül haladhat.

**Korábbi terv kapcsolata:** G; R2; leltár16,38.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

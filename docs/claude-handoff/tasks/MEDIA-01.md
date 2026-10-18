# MEDIA-01 — Importált forma, font, modell és Lottie célzott bővítése

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Válassz egy inputot: SVG vagy GLB vagy font; a meglévő L1/PH1 korlátai láthatók. Tartós asset, forrásadat, normalizálás és időbeli klip ha van.

## Előfeltétel

BASE-01

**Feltételes kapu:** BASE-02 csak GLB/mesh vagy új 3D renderút esetén szükséges. Tiszta SVG-/fontadat-import nem vár bridge-vizsgálatra.

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/state.ts`, `app/src/modals.ts`, `app/src/lottieCore.ts`, `app/src/lottie.ts`, `app/src/history.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: import parser/limit adapter és fixture. C: hibás fájl és hordozhatóság.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Érvényes/hibás/hiányzó függőséges import; nincs félig betett réteg; régi project újranyílik; modellclip A→B→A.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem internetes assetáruház, nem teljes video/GIPHY integráció.

**Korábbi terv kapcsolata:** A/C; leltár7,18.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

# TEXT-01 — U2 és gazdag szerkeszthető tipográfia

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Először sor megfogása/Cmd-mozgatás és takarási szabály; utána karakter-/szóstílus és váltakozó szöveg. PATH után görbült szöveg.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [UX-ES-KONYVTAR.md](../UX-ES-KONYVTAR.md)
- [FORRASUTMUTATO.md](../FORRASUTMUTATO.md)

**Kódban célzottan:** `app/src/text.ts`, `app/src/textlines.ts`, `app/src/textbar.ts`, `app/src/stage.ts`, `app/src/effects/motionText.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: sorlayout/fixture. C: szöveg/maszk/kijelölés regresszió.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Hosszú magyar szöveg, sorok nem fedik ki egymást; normál és Cmd-gesztus; fontcsere után időzítés; undo;9:16.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem kell teljes szövegengine-csere az első javításhoz.

**Korábbi terv kapcsolata:** B/C; U2; leltár7,8.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

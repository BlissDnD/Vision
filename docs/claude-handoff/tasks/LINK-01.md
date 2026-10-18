# LINK-01 — Kapcsolatok, közös vezérlők és események

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Először a forrásparaméter és célhatás egyértelmű választása, árva kapcsolat; utána közös szél/Nap/célkövetés. Jelenetsor hatókör külön.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)
- [UX-ES-KONYVTAR.md](../UX-ES-KONYVTAR.md)

**Kódban célzottan:** `app/src/linkcord.ts`, `app/src/variants.ts`, `app/src/variantsui.ts`, `app/src/evaluation.ts`, `app/src/scenes.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: tiszta dependency/cycle ellenőrző. C: két jelenet és hiányzó cél fixture.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Nincs találgatott paraméter; forrás→cél név látható; ciklus/prioritás dokumentált; egy undo; scene lokális idő; régi kapcsolatok kompatibilisek.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem külön hang/fizika kapcsolatmotor; célállapot Itt legyen ekkor külön döntés.

**Korábbi terv kapcsolata:** B/E; K1/K2–K4; leltár5,19,23–27.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

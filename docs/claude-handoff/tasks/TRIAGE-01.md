# TRIAGE-01 — Aktuális állapot és szerződések rögzítése

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Forrásverzió, dirty fájlok, meglévő funkciók és jóváhagyott scope ellenőrzése; 3–5 döntési pont. A reprodukált adatvesztési hibát előrevenni.

## Előfeltétel

Nincs korábbi csomagfüggőség; induláskori állapotellenőrzés.

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ALLAPOT-ES-HATAROK.md](../ALLAPOT-ES-HATAROK.md)
- [AGENT-MUNKAREND.md](../AGENT-MUNKAREND.md)

**Kódban célzottan:** `HANDOFF.md`, `app/CODEMAP.md`, `BUGS.md`, `FUNKCIO-LELTAR.md`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: név/ID/besorolás ellenőrzés. C: mentési gyanuhoz reprodukcióterv.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Snapshot és valós kód eltérései megnevezve; nincs elveszett idegen változtatás; egy konkrét következő szeletjavaslat.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem új repoaudit minden fájlra; nem implementációengedély.

**Korábbi terv kapcsolata:** A–G teljes terv.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

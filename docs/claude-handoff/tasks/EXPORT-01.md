# EXPORT-01 — Memóriakorlátos és megszakítható export

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

A meglévő hangos WebCodecs út értékeinek megőrzése; stream/célíró és abort, kódolók lifecycle, újranyitható output.

## Előfeltétel

TRIAGE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ELLENORZES-ES-ATADAS.md](../ELLENORZES-ES-ATADAS.md)
- [ADDON-INTEGRACIOS-TERKEP.md](../ADDON-INTEGRACIOS-TERKEP.md)

**Kódban célzottan:** `app/src/output.ts`, `app/src/popovers.ts`, `app/src/history.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: MediaBunny célíró adapter kísérlet. C: abort/error/hangszinkron fixture.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

1080p és célgépes4K memória/frameidő; hangszinkron; cancel a hangciklusban is; decode roundtrip; hibánál takarítás; nem csak kis video-only demo.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem vár a teljes videóimport/fizika elkészültére; támogatott böngésző/fájlíró fallback szükséges.

**Korábbi terv kapcsolata:** A/F/G; leltár17.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

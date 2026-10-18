# VIDEO-01 — Többvideós média és reszponzív idővonal

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

A meglévő külön videótervet lépcsőzd: egy klip → időmapping/trim/split → seek → aszinkron cache/proxy → több klip.

## Előfeltétel

BASE-01

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ELLENORZES-ES-ATADAS.md](../ELLENORZES-ES-ATADAS.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/timeline.ts`, `app/src/render.ts`, `app/src/output.ts`, `app/src/history.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: időindex/dekódoló adapter fixture. C: késő érkező képkocka/projektcsere/cancel próbák.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Változó képkockaidő és forrásméret; lejátszás/seek/export ugyanaz; proxy nem végleges asset; nagy jelenet memória; loading nem fagyasztja az UI-t.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

A mostani időkiválasztó prototype nem GIF/MP4 dekóder; online GIF kereső később.

**Korábbi terv kapcsolata:** A/B; külön többvideós terv; leltár18.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

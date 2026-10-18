# CHARACTER-01 — Beszélő karakter determinisztikus klippel

**Állapot:** előkészítve; termékimplementáció nincs elindítva. **Alapgazda:** A integrátor. A családot a konkrét jóváhagyott szeletre kell szűkíteni.

## Felhasználói eredmény és első szelet

Importált rig/morph és előre időzített viseme; kis lokalizált mozgás és hangkapcsolat.

## Előfeltétel

MEDIA-01, BASE-01

**Konkrét képességkapu:** bizonyított tartós GLB-import és a modellhez szükséges rig/skinning és/vagy morph renderadapter; viseme-hez tényleges morph-csatornák. A MEDIA-01 SVG-/fontimport-szeletének lezárása önmagában nem teljesíti ezt.

A dependency az első szelethez szükséges szerződés/eredmény, nem az egész család minden jövőbeli funkciójának elkészülte. Új altéma saját függőségekkel indul.

## Csak ezt olvasd a közös belépő után

- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

**Kódban célzottan:** `app/src/render.ts`, `app/src/signals.ts`, `app/src/output.ts`. A CODEMAP-ből keresd a releváns függvényt; a teljes fájlt csak indokkal.

## Írási határ és segítők

B: meglévő viseme-idő prototype adapter. C: egyszerű arcfixture.

A közös fájlokba csak A vagy az általa kijelölt egyetlen writer ír; a segítő új modul/fixture/teszt write-setjét előre rögzíteni kell.

## Készfeltétel és ellenőrzés

Morph/rig hiány érthető; audioidő és szájframe egyezik seek/export alatt; tartós GLB/audio.

Minden látható funkciónál: közvetlen gesztus és numerikus/billentyűs alternatíva; egyszerű alapnézet; nincs rejtett projektmódosítás; megőrzött vizuális minőség. A teljes ellenőrzést a szelet kockázata szerint, nem mechanikusan minden lehetséges formátumra végezd.

## Határ

Nem élő TTS/mikrofon vagy karakterkészítő első szeletben.

**Korábbi terv kapcsolata:** D/G; leltár42.

## Átadás

Röviden: változás, érintett fájl/commit, teszt és bizonyított határa, nyitott kérdés, következő integrációs lépés. A demonstrálva és felhasználóval kipróbálva státusz külön.

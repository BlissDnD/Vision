# E1 · Részecske Forrás saját emitterrel – javaslat

Állapot: **előre jóváhagyva** (a felhasználó 2026-10-18-án előre jóváhagyta a hat nagy terület sorozatát; ez az első). Leltár: 14. sor.

## Mit tud majd a felhasználó
- Részecskék polc → **Részecske Forrás** (és kész változatok: Szikraeső, Konfetti, Hulló levelek szélben, Hóesés, Füst, Tűzijáték-löket, Pattogó golyók, Szövegből szálló por). Kattintás vagy vászonra húzás.
- A vásznon a réteget húzva az **emitter mozog**; ha a pozíciója kulcsolt vagy Mozgás van rajta, a már kibocsátott részecskék ott maradnak, ahol születtek → **csóva** (üstökös, csillagszóró).
- Fő beállítások: **Alak** (Pont / Vonal / Gyűrű / Korong / Téglalap / Alatta lévő kép alakja), **Mennyiség** (db/mp), **Élettartam**, **Irány** és **Szórás** (°), **Sebesség**, **Gravitáció**, **Szél** + **Széllökések**, **Örvény**, **Közegellenállás**.
- **Ütemezés**: Folyamatos / Löketek (X mp-enként N db) / Jelzésekre (J).
- **Padló**: a részecskék pattognak egy vízszintes vonalon (rugalmasság).
- **Kinézet**: Lágy pötty, Éles kör, Szikra, Csík (mozgásirányú), Konfetti (forgó lap), Levél (billegő), Füstfolt; méret a születéskor és a végén, elhalványulás; szín: Paletta (véletlen / életkor szerint), Saját szín, Forráskép színe; keverés: Fény / Normál.
- **Előmelegítés**: Igen (a jelenet már tele van) / Nem (0-tól indul).
- Minden csúszka animálható (◆, LFO, hangjel), a Mennyiség hangjelre is lüktethet.

## Mit építek
- Új `emitter` effekt (Forrás, GL pontok), új `src/emitter.ts`: **állapot nélküli**, analitikus szimuláció. Minden részecske „rekesz” születési ideje, kora és sorsa az időből és egy hash-ből számolódik → seek = export = élő, újranyitás után ugyanaz a kép (a Vel „egy közös idő” szabálya).
- Az emitter helye, forgása, mérete és a Mennyiség a múltbeli időpontokra 32 mintából olvasva (csóva, változó mennyiség ugrás nélkül).
- Padlóütközés zárt képlettel (legfeljebb 4 pattanás), széllökés egy közös, sima zaj integráljával.
- Könyvtári bejegyzések, `COST`, célzott teszt `tests/e1_emitter.js`.

## Mit nem (most)
- Útvonal-emitter (a Közös útvonal szelet hozza), 3D emitter/kamera, ütközés más rétegekkel vagy tetszőleges alakkal (Fizika szelet), részecskék közti kölcsönhatás, folyadék (Folyadék szelet), részecske → réteg kapcsolat (pl. érintésre Glow).
- Nincs valódi, lépésenkénti szimuláció: az örvény és a szél „hihető”, nem fizikailag pontos.

## Próba (2–4 lépés)
1. Részecskék → Szikraeső. Húzd a réteget a vásznon lejátszás közben: csóvát húz.
2. Gravitáció 0 → felfelé szállnak; Szél jobbra → elsodródnak; Padló: Pattog → a földön pattognak.
3. Ütemezés: Jelzésekre, lejátszás közben J: minden J-re egy löket.
4. Tekerés oda-vissza és mentés–újranyitás: ugyanaz a kép.
Mérés: 60 ezer részecske frame-ideje M1 Max-on (headless: futás hibamentes).

## Hátralévő lista változása
A D-listában a „Részecske Forrás saját emitterrel” → demonstrálva. Következő: Közös útvonal (útvonal-emitterrel bővíti ezt).

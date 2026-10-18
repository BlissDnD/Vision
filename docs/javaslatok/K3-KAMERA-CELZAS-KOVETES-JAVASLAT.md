# K3 · Kamera: célzás, követés, útvonal – javaslat

Állapot: **előre jóváhagyva** (2026-10-18-i sorozat, 3. elem). Leltár: 11. sor (és a 34. sor „Kamerás ráúszás + fókuszváltás” része). Referencia-elv: ycw/wvPeWWR (könnyű kameramozgás), Curve Gallery (kamera útvonalon) – saját kód.

## Mit tud majd a felhasználó
- Kamera ablak (a felső Kamera gomb vagy a Sávokon a Kamera sor) új **Mód** választóval:
  - **Kézi (kulcsok)**: mint eddig.
  - **Célpontok**: „Kijelölt réteg mostantól” gombbal a kamera a kijelölt rétegre áll az aktuális időponttól. Több célpont = **célváltások** (A-ról B-re lágy átúszás, „Célváltás ideje”); a kamera **követi** a mozgó célt („Követés késése”: lágy utánhúzás). A célpontok listában időpont átírható, törölhető.
  - **Útvonalon**: a kamera egy Útvonal rétegen halad végig (P2), „Bejárás ideje”, Körbe/Oda-vissza/Egyszer.
- **Élesség a célon**: a mélységélesség síkja automatikusan a célréteg mélységére áll (fókuszváltás célváltáskor).
- **Kézikamera** csúszka: lágy, determinisztikus remegés (pozíció + kis döntés) bármely módban.
- Kulcsolt X/Y a követő módokban **eltolásként** hat (a cél kicsit a kép szélére tehető).

## Mit építek
- `camdir.ts`: a kameraközéppont/fókusz/remegés számítása az időből (állapot nélkül: a követés késése a múltbeli célpozíciók súlyozott átlaga), `render.camXf` egy hookon át használja. Új `CAMP` csúszkák: Kézikamera, Követés késése, Célváltás ideje, Útvonal bejárása. `st.cam.mode/shots/path/ploop/focusT` a projektben, `normCam` régi projektre alapértéket ad.
- Kamera ablak bővítése (mód, célpontlista, útvonalválasztó, kapcsoló). Teszt `tests/k3_camera.js`.

## Mit nem (most)
- Valódi 3D kamera (a Vel kamerája 2,5D), kamera-szellemkép/pálya a vásznon, célpontok a Sávokon húzható blokkokként, automatikus „rendezd meg”.

## Próba
1. Kapcsold be a Kamerát, Mód: Célpontok. Jelölj ki egy réteget 0 mp-nél → „Kijelölt réteg mostantól”; 3 mp-nél egy másikat. Lejátszás: átúszik.
2. Adj a célrétegre Lebegés mozgást: a kamera lágyan követi. Élesség a célon + blende: a másik réteg elmosódik.
3. Mód: Útvonalon, válassz Útvonalat. Kézikamera 0,3.
4. Mentés → újranyitás: ugyanaz.

## Hátralévő lista
Kamera: célzás/követés/útvonal demonstrálva; valódi 3D kamera és vászonfogantyú hátra. Következő: Szöveg 3D (a Folyadék és Fizika a párhuzamos munkamenetben).

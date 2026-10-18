# P2 · Közös útvonal (első szelet) – javaslat

Állapot: **előre jóváhagyva** (2026-10-18-i sorozat, 2. elem). Leltár: 6. és 39. sor. Alap: `docs/spec/vel-utvonal-mag-prototipus.mjs` (Catmull-Rom, ívhossz szerinti mintavétel); a Tubes és a Curve Gallery kódját licenc miatt nem másolom, csak az elvet.

## Mit tud majd a felhasználó
- **2D Formák → Útvonal (rajzolj)**: a vásznon egy húzással megrajzolod a vonalat (a kézmozdulatot simítja, a pontok száma kevés marad). Kész változatok: Neon vonal, Cső, Csavart szalag, Gyöngysor, Kirajzolódó vonal, Zárt forma.
- **Szerkesztés a vásznon** (kijelölt Útvonal rétegen): a pontokat húzod; dupla kattintás a vonal mellett = új pont; Alt+kattintás a ponton = törlés. Inspector: Újrarajzolás, Nyitott/Zárt, pont törlése.
- **Megjelenés**: Vonal / Cső (3D árnyalás, csillanás) / Csavart szalag / Neon / Gyöngysor; Vastagság az elején és a végén (elvékonyodás), Színátmenet vagy Paletta, kitöltés zárt alaknál, szaggatás, **Kirajzolás** (Eleje/Vége/Eltolás, animálható → „rajzolódó vonal”), élő hullámzás.
- **Ugyanaz az útvonal máshol**:
  - **Mozgás → Útvonalon**: bármely réteg végigmegy a kiválasztott útvonalon (kör ideje, Körbe/Oda-vissza/Egyszer, Irányba fordul).
  - **Részecske Forrás → Alak: Útvonal**: a vonal mentén születnek a részecskék (pl. szikrázó vonal).
  - **Maszk**: az Útvonal réteg sima rétegként maszkolhat (zárt kitöltéssel), a meglévő vágómaszkkal.
- Ha az útvonalat átszerkeszted, minden, ami használja, követi (egy adat, több felhasználás).

## Mit építek
- `paths.ts`: közös görbemodell (Catmull-Rom, ívhossz-tábla, `pathAt(u)`, `pathTable`, világkoordináta a réteg elhelyezésével), RDP-egyszerűsítés a rajzhoz.
- `pathshape` réteg saját rajzolással (háromszögszalag + fragment-árnyalás, ear-clipping kitöltés), `pathedit.ts` vászonfogantyúk és rajzolás, inspector-szekció.
- `path` Mozgás a `motion.ts`-ben (útvonal-hivatkozással), emitter 6. alak.
- Teszt: `tests/p2_path.js`.

## Mit nem (most)
- Forma-boole, üreg, kontúreltolás, tangensfogantyúk (csak automatikus simítás), 3D útvonal és 3D cső-geometria, szöveg az útvonalon (a Szöveg 3D szelethez kerül), kamera útvonalon (a Kamera szelet ezt az útvonalat használja majd).

## Próba
1. 2D Formák → Útvonal (rajzolj): húzz egy hullámos vonalat. Válts Cső, majd Neon kinézetre.
2. Húzz egy pontot, dupla kattintással adj hozzá egyet.
3. Tegyél egy Szöveget, Mozgás → Útvonalon: lejátszáskor végigmegy rajta.
4. Részecske Forrás, Alak: Útvonal → szikrázik a vonal. Mentés → újranyitás.

## Hátralévő lista
Közös útvonal: első szelet demonstrálva; a 2D/maszk/mozgás/részecske megvan, 3D/szövegút/boole hátra. Következő: Kamera (célzás, követés, útvonal menti kamera).

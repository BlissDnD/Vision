# T6 · Szöveg 3D-ben – javaslat

Állapot: **előre jóváhagyva** (2026-10-18-i sorozat, 6. elem). Leltár: 7. sor; a P2-ből ide került a szövegút. Referencia-elv: loficodes/ZEayGVg (szöveg hengerpaláston), 3D Text Circle (MIT) – saját kód, **élő szöveggel** (nem PNG).

## Mit tud majd a felhasználó
- Szöveg és média → **Térbeli szöveg** polc:
  - **Szöveg hengeren / gömbön / Szalaggyűrű**: a felirat a forgó test felületén fut; Ismétlés körben, Betűméret, Forgás, Dőlés, fel/le hely; a túloldali betűk halványan átlátszanak (állítható), vagy **Tömör** testen színes felület.
  - **Kihúzott 3D szöveg**: a felirat valódi mélységgel, külön homlok- és oldalszín, fény iránya, csillanás, forgatás/dőlés, billegés.
  - **Szöveg útvonalon**: a betűk egy Útvonal réteg (P2) mentén állnak és úszhatnak (Eltolás, Úszás, Betűköz, az úttal fordul / egyenesen áll); útvonal nélkül saját ív.
- Mindhárom **átírható**: a Tartalom fülön vagy a felső szövegsávban (betűtípus, vastagság is).

## Mit építek
- `effects/text3d.ts`: `textwrap` (sugárkövetés gömbre/hengerre, a szövegtextúra a felületen), `textextrude` (a szöveg alfájából kihúzott test sugármeneteléssel, oldalfal-normál a gradiensből); `textpath.ts`: betűatlasz + betűnkénti négyszögek az útvonalon. A szöveg a réteg `L.text`-je (`textTex`), a `mediaFor` és a szövegsáv/inspector az új típusokat is kezeli.
- Teszt `tests/t6_text3d.js`.

## Mit nem (most)
- Szöveg alakú kivágás más formából (boole), valódi háromszöghálós 3D szöveg exporthoz, tetszőleges 3D test felülete, szöveg a Gerincfelületen.

## Próba
1. Szöveg és média → Szöveg hengeren; írd át a felső sávban. Forgás, Dőlés, Tömör test.
2. Kihúzott 3D szöveg: Mélység, Fordulat; Billegés.
3. Rajzolj egy Útvonalat, Szöveg útvonalon → válaszd ki, Úszás 0,1.
4. Mentés → újranyitás.

## Hátralévő lista
Élő szöveg 3D felületen: első változat demonstrálva (gömb, henger, kihúzás, útvonal); kivágás és tetszőleges 3D test hátra.

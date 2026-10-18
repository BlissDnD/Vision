# Mérföldkő-javaslat: F2 Fizikai test

Állapot: **előre jóváhagyva** (a felhasználó 2026-10-18-án sorban jóváhagyta a hat nagy területet; a Fizika az ötödik). Forrás: `docs/spec/VEL-KULSO-FORRASOK-INTEGRACIO-CLAUDE-PROMPT.md` 6. pont, `FUNKCIO-LELTAR.md` 36. sor. Minta: lo-th/Oimo.js (MIT) elve és a Box2D-lite (Erin Catto) impulzusos megoldója. **Függőség nincs:** saját, kicsi 2D merevtest-kód, mert a Vel rétegei 2D-ben kompozitálódnak, és az Oimo 3D-s motorja (≈ 300 KB) itt túlméretes lenne.

## A felhasználó ezt tudja majd
- **Mozgás polc → Fizikai test:** bármely rétegre (alakzat, szöveg, kép, 3D tárgy) ráhúzva a réteg merev testté válik. A vászon széle alapból fal; a testek egymásról lepattannak, gurulnak, forognak.
- Beállítások a réteg Mozgás fülén: **Alak** (Automatikus · Kör · Doboz), **Tömeg**, **Súrlódás**, **Pattanás**, **Gravitáció** + **iránya** (alapból 0 = kikapcsolva), **Kezdő lökés** + **iránya**, **Pörgetés**, **Ütközés** (Mindennel · Csak a csoportjával · Semmivel), **Csoport** (1–4), **Rögzített** (a test nem mozdul, de a többi nekiütközik; ha kulcsokkal mozgatod, tolja a többit), **Vászon széle** (Fal · Átengedi).
- Egy rögzített, kulcsokkal mozgó réteg (pl. „ütő”) meglöki a szabad testeket.
- **Kiesett test visszahozása:** ha a Vászon széle = Átengedi, és a test kiesik, a Mozgás fülön „A test a vásznon kívül van (t = … mp-től)” felirat és **Visszahozás** gomb (a Vászon szélét Falra állítja); a réteglistában is jelzés.
- Ugrás, Loop, export: ugyanarra az időre ugyanaz a kép. A szimuláció t = 0-tól fut rögzített 60 Hz-es lépéssel, 1 mp-es ellenőrzőpontokkal, így a tekerés gyors.

## Pontosan megépítem
- **`src/physics.ts` (új modul):** 2D impulzusos merevtest-megoldó: kör–kör, kör–doboz, doboz–doboz (SAT, legfeljebb 2 érintkezési pont), Coulomb-súrlódás, restitúció, 8 iteráció, rögzített 60 Hz-es lépés. A világ: a felső szintű, látható rétegek bekapcsolt Fizikai test mozgással. A kimenet rétegenként `{dx, dy, rot}` eltolás, amely a többi mozgáshoz hasonlóan a `moEval`-on át adódik a rétegre.
- Determinizmus: a világ állapota t-ben = lépések 0-tól t-ig; ellenőrzőpont-gyorsítótár másodpercenként, amelyet a fizikára ható adatok kulcsa (paraméterek, kiinduló helyzetek, kulcsok) érvénytelenít. Nincs véletlen, nincs valós idő.
- `motion.ts`: új `phys` mozgás (ikon, paraméterek), a moui automatikusan mutatja; Visszahozás-sor.
- Teszt: `tests/f2_physics.js` (gravitációval esik és a falon megáll, két test ütközik és szétpattan, a Csoport/Semmivel kikapcsolja, rögzített test nem mozdul, seek = ugyanaz a helyzet, kiesés-jelzés + Visszahozás, mentés–újranyitás).

## Ebben még nincs
Valódi 3D merevtest (mélység szerinti ütközés), csuklók/rugók, puha test, folyadék–test kölcsönhatás, helyi gravitációs mező Forrásként, csoporton belüli rétegek, a Kapcsolatok felületén megjelenő ütközés-lista, ütközésből induló esemény (pl. „villanjon”). Ezek külön szeletek.

## Próba (2–4 lépés)
1. Tegyél be 3 alakzatot, mindegyikre húzd rá a Fizikai testet, állítsd a Gravitációt 1-re → leesnek, pattannak, egymásra borulnak.
2. Az egyiket állítsd Rögzítettre, és kulcsokkal mozgasd oldalra → meglöki a többit.
3. Az egyiknél Vászon széle = Átengedi → kiesik; Visszahozás → újra a vásznon.
4. Tekerj előre-hátra → ugyanaz a helyzet; exportálj 3 s-ot.

**Licenc:** saját kód; elv: Oimo.js (MIT, © lo-th), Box2D-lite (zlib, © Erin Catto) – a fejlécben hivatkozás.

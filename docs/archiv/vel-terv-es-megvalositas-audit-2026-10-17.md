# Vel — mai egyeztetés, terv és megvalósítás összevetése

2026-10-17. Forrás: a mai felhasználói egyeztetés, `vel/docs/vel-fejlesztesi-terv-jovahagyasra.md`, `vel/HANDOFF.md`, `vel/PROGRESS.md`, valamint a helyi kód egyes kapcsolódó részei. Ez dokumentumaudit, nem teljes vizuális QA. A `vel/` élő munkamappáját ez a jegyzet nem módosítja.

## Fő megállapítás

Az A–G terv több, mint az M1–M10 felosztás összege: egy-egy M-szelet lezárása nem bizonyítja automatikusan az egész A/B/C szakasz termékcélját. **C különösen csak részben teljesült**, még ha a HANDOFF M6-ot „lezártnak” nevezi is. A Gerincfelület és a közös Jelenetfény valós előrelépés; a meglévő anyagok tételes auditja, minőségi javítása és a bármire ráhúzható Megjelenések első újrahasználható készlete nincs igazolva.

## Státusz a tervhez képest

| Terület | Mai döntés / terv | Jelenleg látható állapot | Rés / pontosítás |
|---|---|---|---|
| A. Közös idő és projekt | Loop nélküli továbbfutás, stabil seek/export, régi projektek, Csoport/Közös alap/Változat/Kapcsolat | M1–M2 késznek jelölve, célzott tesztekkel | Felhasználói UX-próba és hosszú állapottartó jelenet még kell; 3 mp előfuttatási korlát ismert. |
| B. Könyvtár és rétegek | Könyvtár oldalsávban a rétegek fölött; kompakt Megjelenéslánc, tooltip; gyors választás | Kategóriák/keresés, jobb kattos találatlista, effektlánc ▲/▼ kész | A könyvtár **ma a vászon alatt van**, nem a terv szerinti oldalsávban; az effektek sorrendje nyilakkal, nem közvetlen húzással változik. |
| B. Szöveg | Gazdag szövegszerkesztés, közvetlen sormozgatás, sor/szó/karakter animáció, képek 3–5 mintái | Soronkénti méret, behúzás, előtte térköz, vastagság 300–900, dőlt; címlap-recept | Soronkénti szín/font és szavanként vegyes formázás nincs igazolva; a vizuális referenciák teljes tipográfiai/motion minősége nincs mérve. |
| B. Mozgás és jelzés | Mozgásblokk, retime, kézi timingok, Eljátszás simítással | Blokk mozgatás/nyújtás, jelzés-időhorgony, x/y gesztusfelvétel kész | A Jelzés jelenleg nem általános trigger, amelyhez a felhasználó mozgást rendel; csak odatapasztott kulcs időhorgonya. Az Eljátszás x/y mozgást vesz fel, nem tetszőleges tulajdonságot. |
| C. Render és Megjelenések | 1./6. kép minőségi kapu, meglévő anyagok auditja, több formán használható króm/lakk/üveg/jég/hologram/gyöngyház/plazma stb., közvetlen fény | Gerincfelület mesh réteg, saját stúdióanyag/fény/padló, csillanás-húzás; közös Jelenetfény `obj3d`/`sdfscene` típusokra | A közös fény alapértéken **bitre ugyanazt a régi képet adja**; ez kompatibilitás, nem anyagminőség-javulás. Nincs tételes shader/anyag-audit vagy újrahasználható anyagkatalógus; a vörös lakk a Gerincfelület része, nem bizonyítottan bármire ráhúzható Megjelenés. A 6. kép későbbi kapu. A C ezért nem tekinthető a fő terv szerint lezártnak. |
| D. Források, 2D↔3D, részecskék | Bolygó/Felhő/Füst/Virág, szerkeszthető forma, szöveg 3D felületen, részecske Forrás + ráhúzott Megjelenés | M7 most kezdődik; a munkamappában már van nem commitolt részecskés fejlesztés | Késznek még semmi új M7-et nem állítunk. Az eredeti tervből a karakter-könyvtár, fekete lyuk, hengeres élő szöveg és a kapcsolatok későbbi szeletekben követendők. |
| E–F. Fizika és Liquid | Interaktív merevtest, mezők, kontaktus, valódi folyadék fokozatosan | M8/M9 jövőbeli | A külön mellékletben részletesen tervezett, nem implementált. |
| G. Receptek/Random/finiselés | Több képreferencia szerinti layout, szemantikus Random, UI polírozás | M10 jövőbeli | Nem hagyható puszta „majd polírozás” cím alatt; konkrét recept/próbalista kell. |
| 4K és teljesítmény | 4K vászon/videó, sima szerkesztés, stabil export | Gerincfelületre van célgépes 4K időmérés a PROGRESS-ben | A 4K teljes program és hosszú videó exportja, fizikával és sok réteggel, még külön kapu. |

## Amit a következő agentnek egyértelműsíteni kell

1. A `HANDOFF.md`-ben **M6 technikai szelet lezárva**, de **C termékszakasz részleges** státusz szerepeljen. Az M7 elkezdhető párhuzamosan, de C hiánya ne tűnjön el.
2. C-hez tételes audit kell a meglévő anyagokról/effektekről: aktuális látvány, hiba, kívánt alapérték, célkompatibilitás, referencia és mérési próba. Legalább néhány közös anyag (króm, lakk, üveg/jég, hologram vagy plazma) több különböző formán legyen ténylegesen ráhúzható és láthatóan jobb; a pontos első készletet mérés és költség alapján lehet szűkíteni, de a többi sorsa legyen megnevezve.
3. A jelenlegi B funkciókat ne nevezze az összes eredeti UX-cél teljesítésének. A Jelzés→mozgás tényleges hozzárendelés, szélesebb Eljátszás, gazdag szöveg és könyvtár-áthelyezés konkrét hátralévő tételek legyenek.
4. A napi tervből nem hiányzik a teljes fizika, folyadék, karakter vagy 4K export; ezek **tervezettek, még nem implementáltak**. A későbbi M7–M10 bontásban kapjanak elfogadási próbát, ne csak címkét.
5. Claude munkamappájában jelenleg nem commitolt M7-es változtatások vannak. A felhasználói jegyzet/átadás ne írjon bele ezekbe váratlanul; az agent tiszta ellenőrzőponttal folytassa.

## Javasolt rövid állapotjelölés

**A: technikai alap kész, felhasználói próba hátra. B: első működő szerkesztési szelet kész, teljes UX-cél részleges. C: vörös renderpróba + jelenetfény kész, általános Megjelenés-minőség és katalógus hátra. D: folyamatban. E–G: még nem kezdődött.**

## Tételes lefedettség a mai egyeztetéshez

Az alábbi „rögzítve” a tervben való szereplést jelenti, **nem működő funkciót**. A tényleges megvalósítást csak a fenti státusz és a `PROGRESS.md` igazolja. A mai beszélgetés minden fő termékdöntését tematikusan összevetettem a fő tervvel, a döntésvázlattal, a részecske/fizika/4K melléklettel, a referenciajegyzékkel és a HANDOFF-fal; ez továbbra sem soronkénti teljes kód- vagy vizuális teszt.

| Mai döntés / igény | Tervbeli hely | Megvalósítási állapot / rés |
|---|---|---|
| Alkotói kategóriák: Receptek, Források, 2D/3D Formák, Megjelenések, Mozgás, Részecskék; technikai „shader” helyett ráhúzható eszköz | 0., 1., 5., 6. fejezet | Kategóriás/kereshető könyvtár M3-ban; teljes célkompatibilitás, drag-and-drop és oldalsáv-elhelyezés nem igazolt. |
| Összetett, de egy Forrás: Bolygó; külön Csillagtér és Világűr; Felhő/Füst külön szándékvezérléssel; Virág, Kristály, Útvonalforma, Portál, Liquid | 2. fejezet | D/M7 és későbbi munka. A „Forrás” és „Recept” határ világos a tervben. |
| Kapcsolatok: automatikus fizika/fény, felajánlott Nap–Ég, kézi összekötés; jelvény/panel/opcionális térkép; csoporton belüli/külső élek | 0., 2., 3., 5. fejezet; döntésvázlat 268–282. sor | M2 adatmodell és kezdeti UI; a teljes javaslat/előnézet, szabály-felülírás, kapcsolatnézet, prioritás és visszacsatolás kezelése nem igazolt. |
| Csoport ≠ Közös alap/Változat ≠ jelenetbeli Kapcsolat; helyi szerkesztés, célzott Átadás, okos csoportméret/forgáspont | 0., 5. fejezet | M2 alapműködés kész; csoporthatár/forgáspont és összetett kapcsolati UX külön próba. |
| Szöveg formázása, sor közvetlen odahúzása, szó/sor/karakter mozgás; 4./5./7. kép külön esetei | 5–6. fejezet | M4 sorfogantyú és néhány sorstílus; szavankénti gazdag szerkesztés, váltakozó szöveg, duplikált/blur/villogó effekt és referenciaminőség nincs igazolva. |
| Időzített, folyamatos, reaktív mozgás közös órán; Loop csak ismétlés; könnyű retime; kézi J-jelzés, hangritmus, Eljátszás simítással | 0., 5., 7. fejezet; döntésvázlat 282–302. sor | M1/M5 részben kész. J horgony, nem általános jelzés→mozgás hozzárendelés; E jelenleg x/y gesztus; hangrészek automatikus bontása és szélesebb felvétel nem igazolt. |
| 2D↔3D Térbeliség, közös útvonal/kontúr, boole-műveletek, szöveg felületre vagy kivágásként, jég–króm–láva végpont | 2. fejezet | Gerincfelület M6-ban külön rétegként kész. Általános útvonalmotor, 2D formaépítés, extrudálás és szerkeszthető szöveg–test kapcsolat még nem igazolt. |
| Minőségi anyagok és fény: króm, lakk, üveg/jég, hologram, gyöngyház, plazma, később viasz/kerámia/olajfesték; 1./6. kép | 1. fejezet, 7. C | M6 vörös mesh és csillanás + közös fény. Meglévő anyagok teljes auditja és újrahasználható, célonként működő anyagkészlet hátra. |
| Részecske Forrás külön a bármire ráhúzható részecske Megjelenéstől; szöveg szétesése ráhúzható hatás | 4. fejezet és külön melléklet | D/M7 folyamatban; részletes emitter-UX, determinisztikus seek/export és minőségi próba hátra. |
| Fizika alapból gravitáció nélkül; két kompatibilis test automatikus interakciója; mezők, szél, kontaktus→Glow, kirepült test visszahozása | 3. fejezet és külön melléklet | E/M8 jövőbeli. |
| Valódi kiömlő folyadék mint Forrás, külön liquid Megjelenés; 2D→2,5D→mért 3D fokozatok | 3. fejezet és külön melléklet | F/M9 jövőbeli. |
| Poszt/reel/poszter Receptek és Karakter-könyvtár; 3/4/5/7/8/9 képek helyes besorolása | 6. fejezet és WebGL-referenciajegyzék | M4 egy címlap-recept; teljes család, karakter és képarány-/szöveghossz-álló layoutok hátra. |
| Random elem/csoport/jelenet szinten, rögzíthető részekkel és animált, determinisztikus seeddel | 6. fejezet | G/M10 jövőbeli. |
| Bal oldali könyvtár+rétegek, kompakt effektlánc, jobb kattintás, tooltip-részletes mód, kevesebb slider, könnyű rétegválasztás | 5. fejezet | M3 részmegoldás; teljes UI- és 10 perces felhasználói próba hátra. |
| Böngészős WebGL2 feltételesen megtartva; sima előnézet, moduláris kód, 4K vászon és hosszú videóexport | 0., 7. fejezet és külön melléklet | Egy vörös 4K frame mért; átfogó 4K export, memóriakorlát, hangszinkron, folyamatos fájlírás és célgépes terhelési kapuk hátra. |
| Külső WebGL példák: dynamic cubemap, üveg, virág, szellem, cső, levelek, hengeren futó szöveg, kamera, fekete lyuk, layout/motion | WebGL-referenciajegyzék | Referenciaként rögzítve; nem mindegyik kapott külön M-számot vagy elfogadási próbát a HANDOFF-ban. |

**Ami a tervben sincs még kész specifikációként:** tételes Megjelenés-katalógus és minden régi effekt minőségi leltára; konkrét képernyőtervek/tesztelt kapcsolati és réteg-UX; részletes import- és exportformátumok, médiakezelés; kész receptenkénti tartalom és reszponzív viselkedés. Ezt maga a terv „Hiányaudit” fejezete is nyitottként jelöli. A HANDOFF M1–M10 térképe ezekhez nem rendel maradéktalanul külön, számon kérhető feladatot.

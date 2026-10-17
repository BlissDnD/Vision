# Vel — átadás Claude-nak

Ez a csomag a Vel/Látomás Stúdió hosszú távú fejlesztésének kiindulópontja. A jelenlegi TypeScript/WebGL2 projekt nem kész termék; a mellékelt terv a felhasználóval egyeztetett célokat és még bizonyítandó technikai kérdéseket tartalmazza. **A feladat a működő program lépésenkénti továbbfejlesztése, nem puszta terv vagy látványos, de különálló demó.** A felhasználó közben ritkán, konkrét mérföldköveknél szeretne tesztelni; az átadás és az ismételt teljes kódfeltöltés tokenköltséges.

## Olvasási sorrend és első lépés

1. `README-ATADAS.md`: csomag tartalma és indítás.
2. `docs/vel-fejlesztesi-terv-jovahagyasra.md`: termékirány, korábbi döntések, ütemezés. A „jóváhagyásra” a dokumentum eredeti címe, nem jelenti, hogy minden műszaki részlet véglegesen jóváhagyott.
3. `docs/vel-uj-webgl-referenciak-2026-10-17.md`: friss látvány- és interakciós minták, ellenőrzési státusz.
4. `docs/vel-reszecske-fizika-folyadek-teljesitmeny.md`: dinamikus rendszerek és 4K kapuk.
5. `docs/vel-voros-felulet-webgl-prototipus-brief.md`: a vörös fényes felület látványkapuja.
6. `app/README.md`, majd az `app/src` kód, tesztek és naplók. A régi `vel-fejlesztesi-vazlat.md` részletes döntésnapló: vitás kérdésnél visszakereshető, a fő terv az elsődleges összefoglaló.

Először mérd fel, mi működik ténylegesen. Az appban `npm ci`, `npm run typecheck`, `npm run build`, majd ha a Playwright/Chromium elérhető, `npm test`. Jegyezd fel a hiányzó környezeti feltételeket. Készíts rövid eltéréslistát a tervhez képest, és kezdd az első **önállóan tesztelhető szeletet**. Ne tételezd fel, hogy a mai export, részecske vagy 3D funkció már teljesíti a tervet.

## Hogyan dolgozz kevés tokenből, mégis ellenőrizhetően

Egy tartós projektmappában dolgozz; a `app/src` legyen a kanonikus forrás. Fejlesztés közben a helyi dev-szervert használd, ne minden iterációnál generáld és posztold a teljes egyfájlos HTML-t. Amikor a felhasználó ténylegesen kipróbál egy mérföldkövet, egyetlen friss `dist/index.html` vagy más könnyen megnyitható átadó build készüljön, **pontos verzióval és rövid tesztlistával**. A módosított kódot ne másold be teljes egészében a chatbe; csak a változás, a próbálható viselkedés, a mérési eredmény és a build útvonala kell. Ha a felhasználó ugyanabban a tartós munkakörnyezetben folytatja, ne kérd a csomag újbóli feltöltését.

A nagy munkát néhány mérföldkőre bontsd, amelyek végén valódi alkotói próbát lehet csinálni. Nem kell minden kis commit után felhasználói teszt. Ugyanakkor ne haladj több teljes termékszakaszon keresztül kontroll nélkül: render- és interakciós kockázatnál legyen egy látható, kipróbálható kapu. Az automatikus ellenőrzést minden releváns változtatásnál futtasd helyben; új vagy módosult viselkedésnél célzott tesztet írj, ne csupán a megvalósítás másolatát. Minden mérföldkőhöz ments `PROGRESS.md`-be: kész/hiányzó, döntések, mérés, ismert korlát, következő lépés. Ez a folytatás rövid kontextusa; nem kell újra elmagyarázni a teljes tervet.

**Javasolt első kapuk:**

1. Projektállapot, stabil build, időkiértékelés és Loop nélküli folyamatos jelenet; régi projekt megnyitása. Ez az alap, amelyre a szimuláció és export épül.
2. Vörös gerincből épített felület minőségi prototípusa, először szűk, külön mérhető jelenetben, majd szerkeszthető eszközként integrálva. Forma, anyag, fény, padlókapcsolat és reflexió külön vezérelhető. A felhasználó említette, hogy egy másik agent már készített 3D próbát; ha azt rendelkezésre bocsátja, vizsgáld meg és használd tanulságként, de a csomagban nincs ilyen eredmény igazoltan jelen.
3. Könyvtár/réteg/motion/text első integrált szerkesztési szelete, majd Részecske Forrás/Megjelenés és közös idő.
4. Fizika, mezők, 4K exportkapuk, fokozatos Liquid-kutatás. A teljes 3D folyadékot csak mért prototípus után vállald.

Az eredeti A–G tervet őrizd meg irányként, de a pontos implementációs sorrendet függőségek és mérési eredmények szerint módosíthatod. Ha egy korai látványprototípushoz más renderer, mesh/SDF hibrid vagy külön könyvtár jobb, készíts összehasonlító mérésre épülő rövid döntési feljegyzést. **A felhasználói munkafolyamatokat, a szerkeszthetőséget és a referencia-minőségi próbákat ne cseréld le technikai könnyítés miatt.** Egy CodePen mintáját ne másold változtatás nélkül; a Vel saját objektumaihoz és jogilag tiszta forrásaihoz illeszd.

## Döntési szabadság és kérdezés

A dokumentumok a felhasználó célját és elfogadási próbáit rögzítik; nem parancsolnak konkrét shadert, könyvtárat vagy fizikai solvert. Válassz saját műszaki megoldást, ha jobb minőséget, sebességet vagy karbantarthatóságot bizonyít. Az eltérést röviden írd le `PROGRESS.md`-ben, és mutasd meg, hogy ugyanazt a kreatív műveletet hogyan lehet vele elvégezni. Ne tervezz meg mindent hónapokra előre úgy, hogy semmi nem próbálható. Ha valódi termékdöntéshez felhasználói preferencia kell, egyetlen összevont, konkrét kérdést tegyél fel működő opciókkal; a rutin implementációs döntéseket hozd meg önállóan.

Kiemelten őrizd meg: Forrás vs Recept, ráhúzható Megjelenés, külön Kapcsolat, Csoport/Közös alap/Változat, szerkeszthető 2D→3D, egy közös idő, Eljátszás simítással, könnyű retime, célgépen mért render, fokozatos 4K export. A Karakterek új könyvtári gyűjtemény: animált, szerkeszthető, újrahasználható csoportok; első példa a szellem.

A hengeres tipográfia referenciájánál fontos különbség: a CodePen egy kész PNG-t ismétel a henger palástján és a hengert forgatja. A Vel célja ugyanilyen látvány **élő szöveggel**, amely átírható, irányítható, ismételhető és a felülethez kapcsolva animálható. Ne kezeld a demó képet teljes szövegszerkesztési megoldásként.

## Átadó válasz formája mérföldkőnél

Legfeljebb néhány rövid bekezdés: **mi lett kipróbálható; hogyan próbálja ki a felhasználó 2–4 lépésben; milyen automatikus/mért ellenőrzés ment át; mi maradt korlát; a build pontos útvonala vagy linkje.** Csak ekkor kérj kreatív értékelést. Ha vizuális minőség a tét, adj egy állóképet vagy rövid videót a referenciával azonos kompozícióban, és nevezd meg az eltérést. A felhasználó idejét és tokenjeit a jól időzített próbák védik, nem a ritka kommunikáció önmagában.

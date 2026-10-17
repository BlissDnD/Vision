# Vel / Látomás Stúdió – kutatási alap és egyeztetési vázlat

2026. október 17. Állapot: előzetes kutatás, nem jóváhagyott fejlesztési terv.

## Cél

Gyors, közvetlenül kezelhető vizuális és motion design szerkesztő posztokhoz, poszterekhez, reel-ekhez, tipográfiai reklámokhoz és zenére reagáló lyric videókhoz. Kevés beállítással jó alapminőség; az összetevők tovább szerkeszthetők és kombinálhatók. A kész receptek ugyanazokból az eszközökből épüljenek, amelyekkel a felhasználó maga is dolgozik.

Technikai kérdés, még nem termékdöntés: szükséges-e elhagyni a böngészős futást a kívánt látványhoz, folyadékfizikához és 3D interakciókhoz? Rövid válasz: nem feltétlenül. A WebGL2 a böngészőben is használja a GPU-t; a renderminőséget és a szimulációt a megvalósítás és a teljesítménykeret határozza meg. A valódi folyadékszimulációhoz közös, időben léptetett állapot, akadálykezelés, visszatekerés és exportkezelés kell, nem önmagában asztali csomagolás. A böngésző technikai korlátai csak konkrét prototípus- és célgép-mérés után ítélhetők meg. Az önálló asztali alkalmazás későbbi termékforma-döntés lehet, de nem rögzített felhasználói követelmény.

## Bizonyíték és korlát

Forrás: /Users/miksa/Desktop/melo/CLAUDE/muchdesigner. A package.json szerint v0.13.0; a kanonikus forrás a latomas-src, a latomas.html buildkimenet. Átnézett területek: fejlesztési handoffok, README, könyvtár, generátorok, formák, 3D anyagok, részecskék, lejátszás, idővonal, paraméterkiértékelés, hangjelek, rétegek és renderelés releváns részei.

A naplók állításait nem tekintjük újonnan végrehajtott teszteknek. A böngésző biztonsági szabálya blokkolta a helyi HTML megnyitását; a helyi HTTP-szerver indítását a környezet nem engedte. Interaktív UX-próba, GPU-mérés és exportellenőrzés nem történt. A forráskód nem változott.

## Jelenlegi állapot – kódból igazolt

- Saját WebGL2 rétegkompozitor, TypeScript modulok. A formák matematikai távolságfüggvényekből rajzolódnak; ez nem általános Bézier/SVG vektorszerkesztő.
- A Források képi tartalmat generáló GLSL-programok. Például a tűz zajfüggvény és színezés, a folyékony márvány koordinátatorzítás: nem fizikai tűz- vagy folyadékszimuláció.
- A Receptek szerkeszthető összetételek. A könyvtár azonban kész összeállításokat, egyedi eszközöket és azok előbeállításait keveri; több kategóriában ismétlődnek elemek.
- A 3D raymarch/SDF alapú. Az obj3d anyagai a saját shaderében élnek; a szerkeszthető SDF-jelenet legfeljebb nyolc alapformát kombinál. A 2,5D kamera a kompozíciós rétegek transzformációja, nem közös teljes 3D világ.
- Van króm, hologram, üveg, toon, irizáló, agyag, gyöngyház és bársony megjelenés. A környezet procedurális; az üveg a környezetfüggvényből vesz mintát. Ez nem a jelenet összes objektumának pontos tükrözése/törése.
- Létezik lebegőpontos rendercél támogatás esetén, bloom, tónusleképezés és exportos mozgási elmosás. Előbb auditálni kell ezek helyességét, nem egyszerűen újra hozzáadni őket.
- A részecskék képmintákból képzett pontok, állapotmentes mozgással. Nincs általános kibocsátó–élettartam–erőtér–ütközés szimuláció.
- Az animáció alapértékből/kulcskockákból, LFO-ból és hangjelből áll össze. Az automatikus összeadás nem ad önmagában érthető prioritást vagy mozgáskoordinációt.
- A v13 idővonalában már van nagyítás, keretes és többes kijelölés, együtt mozgatás, másolás, ütemhez igazítás. A sáv gyémántjai időpont szerint összevonják a réteg paramétereinek kulcsait.
- Kikapcsolt loopnál a frame() tovább növeli az időt, nincs projektvégi megállás. Ez magyarázza a végtelen továbbfutást, de nem bizonyítja minden jelentett lejátszási probléma okát.
- A hangfájl a projekt hosszát beállítja. A kick/pergő/hihat jelek szűrt frekvenciasávokból számolt burkolók; valódi hangszer-szétválasztás nincs. Külön stemek importálhatók.
- Alap tooltipek már léteznek title attribútummal. Kereshető könyvtár, címkerendszer és részletes oktató tooltip külön fejlesztési feladat.

## Referenciák értelmezése

Állóképekből a látvány elemezhető, az eredeti technológia és mozgás nem állapítható meg biztosan.

A felhasználó eredeti csoportosítása az irányadó: az 1. és 6. kép a kívánt renderelési/látványminőség példája; a 2. kép toon shaderes példa; a 3., 4., 5., 7., 8. és 9. kép a könnyen készíthető posztok, reel-ek, poszterek, layoutok és motion grafika referenciája. Az alábbi részletek e csoportokon belüli vizuális megfigyelések.

| Kép | Lényeges vizuális összetevők | Fejlesztési következmény |
|---|---|---|
| 1 | Fényes vörös felület, nagy fehér fényformák, ívelt geometria, finom textúra | Anyag + stúdiófény + geometria + kontrollált expozíció együtt |
| 2 | Részletes dioráma, festett textúrák, stilizált fények | Egy toon shader nem pótolja a modelleket és textúrákat; modellimport külön kérdés |
| 3 | Kövér tipográfia, színeltolás, raszter, ragyogás | Jó szövegrajzolás és kombinálható effektlánc |
| 4 | Tipográfiai rács és szervezett pont/vonalmező | Ismétlő, elosztás, mezővezérlés; nem szükségképpen részecskefizika |
| 5 | Ismételt tipográfia, fókuszkülönbségek, fénylő színmező | Szövegismétlés, elmosás és szín/fény kompozíció |
| 6 | Organikus forma, finom redők, fényáteresztő hatás, szikla | Magasabb geometriai és anyagigény; a képen AI módosítás jelölés is látható |
| 7 | Egységes címsorozat változó absztrakt hátterekkel | Közös stílusvezérlésű receptcsalád és jelenetsor |
| 8 | Fémes objektumok, üvegkártyák, pontos rács | 3D + layout + tipográfia közös szerkesztése |
| 9 | Kép/videó keret, nagy üres terek, tipográfia | Tartalomhelyek és képarányhoz alkalmazkodó layout |

## Javasolt fogalmi rendszer – egyeztetendő

1. Receptek: kész szerkeszthető összeállítások, szöveg/kép cserélhető helyekkel és néhány közös vezérlővel. Lehet teljes layout vagy beilleszthető kisebb elem.
2. Építőelemek: szöveg, média, 2D forma, 3D objektum, generátor, layout, részecskerendszer.
3. Ráhelyezhető eszközök: képi effektek, 3D anyagok, mozgásviselkedések. A felhasználói művelet maradjon közvetlen ráhúzás a szövegre, képre, formára, 3D objektumra vagy csoportra. Ugyanaz a megjelenés a cél típusához alkalmazkodhat.
4. Vezérlők: hangjelek, ütem, útvonal, erőterek és más rétegekhez kötött kapcsolatok.

Egyeztetett döntés: a ráhúzott Megjelenés alapból ráépül a meglévőkre, látható, átrendezhető láncban. A csere külön, tudatos művelet legyen. A Megjelenés lehet összetett anyag-, fény- és képi effektbeállítás; azonnal jó alapminőséget kell adnia, részletesen is szerkeszthető módon.

A Forrás önálló, célzottan szerkeszthető tartalomgenerátor vagy összetett objektum is lehet. Például a bolygó felszínből, felhőhéjból, légkörből, gyűrűből és fényből állhat, mégis egyetlen Forrás marad, mert a felhasználó egy bolygót tesz a jelenetbe, és bolygóra szabott vezérlőkkel alakítja. A belső részek szükség esetén kibontva szerkeszthetők. A recept több önálló elemből felépített kompozíció vagy jelenet, közös vezérlőkkel. Egy Forrás saját változata lehet előbeállítás. A felhasználó választása a létrehozandó dolog és a kreatív szándék alapján történik, nem a megvalósítás rétegszáma alapján.

Egyeztetett példa: a Felhő és a Füst lehet közös generátormagra épülő két önálló, célzott bejárat. A Felhő pontosan egy, önállóan elhelyezhető felhőt hoz létre, és felhőkhöz hasznos vezérlőket mutat; a Füst füstként működik ugyanígy. A két eszköz közös mélyebb beállításokat is használhat. Elsődleges termékelv: gyors, látványos eredmény intuitív, a kreatív szándékhoz illő felhasználói vezérléssel.

Egyeztetett Világok-határ: az Ég önálló Forrás, a Nap önálló elem, a Felhő egyetlen felhő, az Eső külön állítható jelenség. Ha összekötik őket, reagálnak egymásra: a Nap helyzete és az Ég napszaka összhangba kerül; felhő és eső esetén az Ég beborulhat. A kapcsolat iránya, erőssége és a kézi felülírás UX-e még nyitott. Az Ég + Nap + Felhők + Eső kész kompozíciója recept. A jelenlegi világ-receptek és moduláris világdarabok ennek kiindulópontjai, de a kölcsönös kapcsolatot nem szabad pusztán azonos nevű paraméterekkel összekeverni.

Kapcsolatok UX-e: a felhasználó mind a helyzetfüggően felajánlott kapcsolatot (például Nap → Ég), mind a külön Kapcsolatok nézetben kézzel húzható kapcsolatot elképzelhetőnek tartja. A végső működést akkor döntjük el, amikor több különböző kapcsolattípust (világítás, időjárás, mozgás, fizika, hang) együtt látunk.

Egyeztetett kreatív munkafolyamat-példa: Felhő Forrás behúzása → méret beállítása → „Lufi” Megjelenés ráhúzása → felfújtság állítása → a Felhő alapmozgásának kikapcsolása → lufi kinézetű, térhatású asset. Ez azt igényli, hogy a Forrás alak- és mozgásparaméterei külön vezérelhetők legyenek a Megjelenéstől, a shader a Forrás alakjához alkalmazkodjon, és a végeredmény szükség esetén más Forrásokkal/3D tárgyakkal azonos fényrendszerben működjön. A valódi 3D forma és a térhatású 2D kép közti különbség a későbbi render/3D blokkban tisztázandó.

Nyitott, külön egyeztetendő: közös jelenetfények (például Nap, stúdiófény) hatása 3D objektumokra, térhatású 2D elemekre és Megjelenésekre; fénykapcsolatok automatikus ajánlása vagy kézi kötése. A Random generátor a megnövekedett elemkészletet ne puszta független véletlenszámokkal kombinálja. Javasolt kontrollok: érthető alkotói szándék/téma, kompatibilitási szabályok, korlátozott paramétertartományok, többféle véletlenfokozat (biztonságos → kísérleti), megtartható részek és újragenerálás seedből. A szokatlan eredmények kreatív értékek lehetnek, de a kiinduló eredménynek olvashatónak és használhatónak kell maradnia.

Random-bővítésként felmerült a kijelölt réteg külön véletlenítése (forma, Megjelenés, mozgás vagy részparaméterek), és a véletlenség animálása. Későbbi tervezéskor tisztázandó, hogy a véletlen időben folyamatosan változik vagy meghatározott ütemeknél új állapotot választ, és hogyan marad szerkeszthető, visszajátszható és az exportban azonos eredményű. Most nem kerül külön részletes blokkba; a Források tárgyalását folytatjuk.

Egyeztetett Virág/ornament irány: első körben szerkeszthető 2D szirmok és ornamentek; a ráhúzható megjelenés fénnyel, árnyékkal és domborítással adhat térhatást. Valódi 3D virágok későbbre kerülnek.

Keresztmetszeti UX igény: a 2D formák és 3D formák között könnyű átjárás. Egy 2D forma kapjon közvetlen „Térbelivé alakítás” műveletet, amelynek alapváltozatai lehetnek mélység/extrudálás, lekerekített él, forgástest, illetve felületre emelés. A forma eredeti körvonala és szerkeszthetősége lehetőség szerint maradjon meg, és a térhatás visszavehető legyen. A jelenlegi shape SDF és a 3D obj3d/sdfscene külön kódrendszerek, tehát ezt nem szabad puszta shadercsere-ként ígérni: adatmodell- és rendertervezés szükséges. Az alkalmazható műveleteket formafajtánként és a célgép teljesítményén kell ellenőrizni.

Új 2D↔3D kapcsolati irány: a szövegnek és 2D formának legyen önálló „Térbeliség” tulajdonsága (mélység, él/lekerekítés, anyag és fényreakció). Ez nem igényel másik 3D objektumot. A felhasználó a „shader” szót korábban tágabb értelemben, ráhúzható átalakításként használta; a felületen a művelet neve a szándékot közölje, a technikai implementációt ne kelljen ismernie.

Felhasználói pontosítás a geometriai kapcsolatokról: az elsődleges minta az Illustrator Type on a Path/Shape 3D kiterjesztése. Szöveg futhat gömb, kocka, téglatest stb. külső felületén, belső felületén, kijelölt körvonalán/útvonalán vagy a test belsejében egy megadott síkon. Az elhelyezkedés, irány, ismétlés, méret, mélység és olvashatóság szerkeszthető. A korábbi „gömbből felfújt betű” értelmezés nem fejezte ki ezt a szándékot. A szöveg 3D vastagsága külön állítható; a puszta felületi szöveg és a tényleges térbeli betűtest két mód.

UX-javaslat: szöveget 3D testre húzva a célon egyértelmű, kontextusfüggő műveletek jelenjenek meg: „Felületre”, „Útvonalra” és „Belsejébe”. A kapcsolati panelen az irányt, mélységet, igazítást és a geometriához viszonyított helyzetet közvetlenül lehessen állítani. A szöveg szerkesztése élőben frissítse a kapcsolatot. Egy 3D szövegtest egy másik testből kivonható „Üreg kivágása” művelettel, állítható réssel/távolsággal. Ez nem pusztán képi maszk: valódi térbeli üreget kell adnia, amelyre a fények, anyagok, ütközések és folyadékok megfelelően reagálnak. A kivágó szöveg duplikálható; a másolat látható anyagot kaphat. A kapcsolat és a kivágás legyen visszafordítható, rétegsorban értelmezhető és a már említett helyi rétegválasztóval kezelhető.

Kötelező végponttól végpontig próbamunkafolyamat: téglatest → szöveg a test belsejének közepére → szöveg kisebb méretre és 3D vastagsággal → jég Megjelenés a téglatestre → a vastagabb szöveg kivágja a jégből az üreget → szöveg duplikálása, másolaton kivágás és extra vastagság kikapcsolása → króm Megjelenés a látható feliratra → rés marad a króm felirat és jég között → Liquid/Láva generátor a résben áramlik. Sikerkritérium: a szöveg, méret, anyag, üreg és láva egymástól függetlenül finomítható, a fény és a fizika összhangban működik, a jelenet idővonalon visszatekerhető és exportban reprodukálható. A jelenlegi külön 2D/3D renderág és korlátozott SDF-jelenet ezt nem tudja változtatás nélkül; közös 3D geometriatér, szöveggeometria, kivonás, anyag- és ütközéskezelés fejlesztését igényli. Ez a példa az architektúra-választás tesztje, nem azonnali kész funkció.

Felhasználói döntés: a fenti jégkocka–króm felirat–láva jelenet kész, szerkeszthető recept/preset is legyen, hogy azonnal látszódjon, működik-e a rendszer. A Liquid/Láva generátor alapból 3D és fizikai résztvevő; a 3D testek is alapból fizikai kölcsönhatásra alkalmasak. A generátor a kivágott üregbe helyezve automatikusan vegye fel az üreg falait határként, látható, kézzel javítható listával. Az eredmény ne legyen puszta videós illúzió: a tárgyak és a folyadék közös térben reagáljanak.

Receptcímkék: téma (Scapes/űr/táj, tipográfia, absztrakt, organikus, energia), feladat (cím, háttér, átmenet, teljes layout), stílus (editorial, analóg, holografikus, fémes), formátum (poszt, poszter, reel), működés (statikus, loop, időzített, hangreaktív). Egy elem több címkét kaphat. A tűz és a lélek lehet Energia/Organikus; a kész 3D portál lehet Absztrakt + 3D + Háttér.

## Egyeztetési blokkok és tervezési javaslatok

### 1. Könyvtár és munkatér

Bal oldalt felül kereshető könyvtár, alatta rétegek; állítható elválasztó, összecsukható panelek. Jobbra kijelölésfüggő tulajdonságok, alul átméretezhető idővonal. A fele-fele arány kezdőérték legyen, ne merev szabály. Kártyákon látható típus, kompatibilitás és rövid előnézet. A gyakori funkcióknál ikon és rövid név együtt.

### 2. Anyagok, generátorok és renderminőség

Az anyag az objektum felszínét kezeli, a képi effekt a már renderelt képet. A hologram anyag, a glow képi effekt, az összeolvadás geometriai művelet, a fizikai kölcsönhatás szimuláció. Ezeket egységes ráhúzás kezelheti, de a rendszerben külön típusok kellenek.

Anyagötletek: csiszolt fém, irizáló fólia, tejüveg, gyöngyház, kerámia, áttetsző viasz, hologram, emisszív plazma. Az olajfesték lehet képi stilizálás vagy 3D felület: a két eredményt külön nevezzük.

Közös 3D tér szükséges ahhoz, hogy külön objektumok valóban összeolvadjanak vagy kölcsönösen ütközzenek. A jelenlegi külön képrétegek ezt nem adják automatikusan. Először referenciajeleneteken kell eldönteni, meddig érdemes a saját SDF-motort bővíteni és mikor indokolt hálóalapú renderág.

Egyeztetett fényviselkedés: globális jelenetfény legyen alapból bekapcsolva; alapból 3D objektumokra hasson, globálisan és objektumonként kikapcsolhatóan. A Megjelenések használhatják a jelenetfényt, de saját fénylő/megvilágító összetevőik is lehetnek. A 2D/térhatású 2D elemek fényreakciója külön döntés.

Felhasználói minőségi prioritás: először az anyagok hitelessége, utána a formák részletessége. A fény és a gondosan tervezett gradient erősen javíthatja a megjelenést, főleg stilizált grafikában, de nem helyettesíti a megfelelő formai részleteket, felületi normálokat, érdességet, tükröződő környezetet és átlátszó/törő anyagok kezelését. A fejlesztési tervben legalább két összehasonlítható referenciajelenet szükséges: fényes/fémes forma és organikus/áttetsző forma, a felhasználó 1. és 6. képe nyomán. A jelenlegi saját anyagshaderének és procedurális környezetfényének auditja előzi meg a renderirány kiválasztását.

Egyeztetett sorrend: az első render-minőségi prototípus az 1. kép fényes fém/üveg/íves forma iránya, utána a 6. kép organikus/áttetsző világa. A fénykezelésnek intuitívnak kell lennie. UX-javaslat további egyeztetésre: a jelenet jó alapfénnyel nyíljon; egy kiválasztott 3D tárgynál a vásznon közvetlenül mozgatható fényirány/fényfolt vezérlő legyen, élő előnézettel. A felhasználó a szándékot állítsa („fény innen”, „lágyabb”, „nagyobb csillanás”), és csak kibontva lássa a technikai paramétereket. Külön lámpák akkor jelenjenek meg, amikor valóban több fényforrást akar, látható hatókörrel és tárgyankénti kizárással. A tárgyon a globális fény külön ki-be kapcsolható; a Megjelenés saját fénylése ettől külön állítható.

Felhasználói döntés: az elsődleges fénybeállító mozdulat a tárgy felületén látható csillanás megfogása és húzása. A program ennek megfelelően módosítja a fény/megvilágítás paramétereit, élő előnézettel. Több fény vagy erősen tükröződő anyag esetén a szerkesztendő fényt egyértelműen azonosítani kell; a csillanás húzása nem feltétlenül egyetlen fényforrás szó szerinti térbeli mozgatása.

Új kiemelt UX probléma: egymást takaró rétegek kijelölése vásznon, zárolgatás nélkül. A jelenlegi stage.ts pointerdown eseménye a már kijelölt réteget mozgatja; nem látszik általános képpont-/objektum-alapú találatvizsgálat. Tervezési javaslat: alap kattintás a legfelső ténylegesen látható elemet jelölje; több találatnál a kurzornál megjelenő, névvel és apró előnézettel ellátott réteglista mutassa az adott pont alatti összes jelöltet. A választás után közvetlenül húzható legyen az elem. A találatvizsgálat figyeljen átlátszóságra, maszkra, csoportra, effektrétegre és 3D elemre. Választható ideiglenes „átnézés” mód segíthet, de ne legyen szükség tartós lockolásra. A pontos gesztus és a réteglistával való szinkron még egyeztetendő.

Egyeztetett gesztus: a rétegválasztó kattintáskor nyíljon, nem puszta rámutatáskor. Ha a felhasználó választott egy takarásban lévő elemet, a kijelölés elengedés után is maradjon aktív; ugyanazon átfedő területen újból megfogva azonnal azt mozgassa, új rétegválasztás nélkül. Javasolt tartósság: ne rövid időzítő döntsön, hanem explicit kijelölésváltás. A rétegválasztó újranyitásához legyen jól látható kis „rétegek itt” jelölő a kijelölés körül vagy a kattintás helyén. Más helyre kattintva a helyi találatok alapján új elem választható. A click/drag küszöb és a kijelölés utáni első húzás viselkedése prototípussal ellenőrizendő.

Új UI igény: a jobb egérgombbal helyzetfüggő műveletek jelenjenek meg a vásznon és a felület többi releváns részén is; a menük tartalmát és egységességét a későbbi UI blokkban egyeztetjük.

Csoportkijelölés tervezési irány: a réteglistában összecsukott csoport a vásznon elsőként egységként legyen könnyen kijelölhető és mozgatható. Kinyitott csoportnál a gyerekelemek közvetlen kiválasztása legyen előtérben; az egész csoport továbbra is kiválasztható a csoport sorából vagy a helyi rétegválasztóból. A réteglista kinyitása ne változtassa meg a már aktív kijelölést. A pontos kattintás/drag szabályt prototípussal kell ellenőrizni.

Új döntés: a csoport fejlődjön „okos csoporttá”, ne legyen mellette külön, kötelező Smart Object/Precomp fogalom. Alapállapotban a gyerekek ugyanabban a jelenetben, helyben szerkeszthetők; nincs külön megnyitás, kibontás vagy kézi mentés. A csoport mint egység kaphat megjelenést, mozgást, maszkot, térbeli transzformációt és kapcsolatot, miközben a belső elemek saját tulajdonságai megmaradnak. A vásznon és a rétegsorban egyértelmű jelzés mutatja, hogy a kijelölt művelet a csoportot vagy a gyereket érinti. A gyerekre duplakattintás vagy rétegsorbeli kinyitás helyben szerkeszt, morzsamenüvel lehet visszalépni; a csoport megnyitása nem vált külön kompozícióra.

A csoport természetes kerete a látható tartalom méretét követi, nem az egész vászonét. Felirat csoportba téve alapból a felirat körüli keretet és középpontot kapja. A középpont külön, közvetlenül húzható fogantyú; áthelyezése nem tolja el a tartalmat. Külön választható fix keret kell olyan esetekhez, mint vágás, layout vagy szándékos üres hely. Ha a gyerekek animációja miatt a határ változik, a pivot ne ugorjon képkockánként: az alaphelyzetben számolt vagy kézzel rögzített referenciaponthoz kötődjön. A csoporton belüli és kívüli koordináták átváltása szerkesztéskor ne mozdítsa el a gyerekeket.

Elnevezési szabály: **Csoport** = egymásba rendezett elemek egy egységként kezelve. **Közös alap** = egy csoport választható újrahasználási tulajdonsága, nem új rétegtípus és nem jelenetbeli kapcsolat. **Változat** = a Közös alapból létrehozott, a jelenetben elhelyezett csoport; saját helye és helyi tartalma lehet. **Kapcsolat** = jelenetbeli kölcsönhatás vagy függés két elem között (Nap–Ég, követés, fizika, vezérlés). A „kapcsolt példány” kifejezést nem használjuk, mert összekeveri a Közös alapot a Kapcsolatokkal. A felületen a csoport sorában külön ikon jelzi a Közös alapot/Változatot; a jelenetbeli Kapcsolatok saját, ettől eltérő ikont kapnak.

Az újrafelhasználás választható csoporttulajdonság: alapból egy duplikált csoport önálló; „Változat készítése” esetén a másolat ugyanazt a Közös alapot használja. A csoport sorában állandó „Változat” jelvény mutatja, melyik alaphoz tartozik és hány változat létezik. Egy változat szövegét közvetlenül átírva alapból csak az változik. A mező melletti „Átadás más változatoknak” művelet kiemeli a többi változatot a vásznon, egyenként vagy „Mind” gombbal választhatók; alkalmazás előtt előnézet látszik. Sok változat esetén kompakt, kereshető lista segít. A Közös alap szerkezetének/stílusának módosítása a közös részeket azonnal frissíti, kézi mentés nélkül. A helyi eltérések jól láthatók, visszaállíthatók vagy leválaszthatók. Az alap és helyi változtatás határát az adott tulajdonság mellett mindig jelölni kell.

Általános szabály minden változattulajdonságra: a változaton közvetlenül végzett módosítás alapból **csak ott** érvényes. Ez egyformán vonatkozik szövegre, mozgásra, időzítésre, megjelenésre, elrendezésre és bármely további helyben szerkeszthető paraméterre; nem kell tulajdonságonként újra eldönteni. Az „Átadás más változatoknak” ugyanazt a célválasztó és előnézeti mintát használja mindenhol. A Közös alap kifejezett szerkesztése külön művelet, jól látható hatókörrel; csak ott változik minden változat automatikusan. A helyi eltérések elsőbbséget élveznek, amíg a felhasználó az adott eltérést nem oldja fel. Ezt következetesen alkalmazni kell a későbbi funkciókra is.

A csoporthierarchia és a kapcsolatháló **külön rendszer, közös szabályokkal**. A Csoport azt mondja meg, mely elemek tartoznak együtt és hogyan öröklik a szülő transzformációját, láthatóságát és időeltolását; a Kapcsolat azt, hogy mely elemek milyen módon hatnak egymásra. Egy Kapcsolat áthaladhat csoporthatáron, de a csoporthatár önmagában nem hoz létre vagy töröl Kapcsolatot. Csoportkijelöléskor a Kapcsolatok panel három részt mutat: „Belső”, „Kifelé”, „Kívülről érkező”. A csoportsoron külön számjelvény jelzi a külső kapcsolatokat; rámutatva a konkrét cél és hatás világít fel. Csoport duplikálásakor a belső Kapcsolatok az új belső elemek között maradnak, míg a külsőket céljukkal együtt kell ellenőrizni: az automatikus jelenetszabályok újra érvényesülnek, az explicit külső linkek csak egyértelmű cél esetén vihetők át. A rendszer előnézetet ad és jelzi a hiányzó célokat. A Közös alap változatait a csoport saját „Változatok” felületén, a jelenetbeli függéseket kizárólag a „Kapcsolatok” felületen látjuk.

Az időben a csoportnak lehet közös mozgása, a gyerekeknek saját mozgása. A szülő mozgása ráadódik a gyerekekére, de a gyerek időzítését nem írja át. A csoport idővonalsora kinyitható; közös időeltolás vagy időnyújtás kifejezett művelet, nem a csoportba helyezés mellékhatása. A csoport végleges képi renderelése/cache-elése csak teljesítményopció, nem szükséges a szerkesztéshez; a cache invalidálása automatikus és látható, kézi „mentés” nélkül.

Változat készítésekor az animáció indulási ideje azonnal szerkeszthető: az új változat a vászonon elhelyezve az idővonalon külön csoportsávot kap, amelynek kezdete közvetlenül húzható. Húzás közben a Vel előnézetben mutatja az új változat belépését a többihez képest, és egyszerű „együtt / egymás után” igazítást ajánl. Az időeltolás helyi változattulajdonság; nem módosítja a Közös alap animációjának belső ritmusát vagy a többi változatot. A gyerekek relatív időzítése együtt tolódik, a részletek továbbra is lenyithatók.

### 3. Részecskék és szimuláció

Egy közös rendszer szerkeszthető moduljai: kibocsátó (pont/vonal/felület/szöveg), megjelenítés (pont/sprite/vonal/mesh), élettartam, sebesség, erőtér, vonzás/taszítás, ütköző, nyomvonal. Kész porfelhő/tűzijáték a receptekhez kerülhet. A pontmező/ismétlő hasznos önálló eszköz szimuláció nélkül is.

Felhasználói pontosítás: a Részecske Forrás önállóan kerül a jelenetbe és maga hoz létre részecskéket. Ettől külön van ráhúzható Részecske Megjelenés/shader, amely egy meglévő elemet alakít át. A szöveg/kép részecskékre bomlása a ráhúzható Megjelenés esete, nem a könyvtárban külön sablonként felsorolt részecske Forrás. A kettő közös részecskemotort használhat, de a felhasználói művelet és kiindulási állapot más. A kapcsolható Fizika és az időbeli vezérlés mindkettőre külön vizsgálandó.

Részecskerendszerrel kapcsolatban elfogadott követelmények: pont, vonal, rajzolt terület, 2D/3D formafelület és kép alapú kibocsátás; különböző részecskegeometriák, amelyek ráhúzható Megjelenésekkel (például Fény) alakíthatók; szóródás, áramlás, örvény, vonzás/taszítás, követés és összeállás; 2D/3D akadályokra reagáló ütközés, részecskék közötti ütközés külön bekapcsolható drágább módként; szöveg/kép szétesése és visszarendeződése, rajzolt irány; hanghoz/ütemhez köthető kibocsátás, erő, szín és összeállás; idővonalon szerkeszthető szakaszok; rögzített véletlenmag és egyező lejátszási/exporteredmény.

Egyeztetési módszer: a felhasználó elsődleges céljából egyértelműen következő képességeket ne bontsuk hosszú igen/nem kérdéssorrá. Az asszisztens vállaljon tervezési döntést és csak a munkafolyamatot vagy prioritást érdemben megváltoztató alternatívákra kérdezzen rá.

Folyadék: különválasztandó a látványt utánzó generátor, a mezőből képzett folyékony geometria és a valódi szimuláció. Utóbbinál időlépés, visszatekerés, gyorsítótár és exportismételhetőség is tervezendő.

Felhasználói pontosítás: a Liquidnél a valódi vízfizika kulcscél, nem csupán opcionális látványeffekt. A víz ömöljön ki testekből/tartályból, ütközzön más testekkel és reagáljon a mozgásukra. A Liquid Forrás adhat vizet és kibocsátási pontot; a tartály és akadályok a jelenet külön fizikai objektumai, amelyeket a közös szimuláció köt össze. A megjelenést (víz, festék, higany, zselé) ráhúzható anyagként is lehessen alakítani. A csepp/hullám/felület gyors kreatív módjai megmaradnak, de nem helyettesítik ezt a célt. Prototípus-kapu: egy edényből kiömlő folyadék találkozik mozgó akadállyal, majd visszatekerés és export azonos eredményt ad. A 2D/2,5D/3D szimuláció mélysége és teljesítménycél a Fizika blokkban eldöntendő.

Pontosított felhasználói modell: a kiömlő Liquid lehet önálló Folyadék-generátor, amely létrehozza és mozgatja a folyadékot; ettől külön legyen ráhúzható Folyadék Megjelenés/shader, amely a víz, festék, higany, zselé stb. kinézetét adja és más alkalmas formára is alkalmazható. A közös fizikával való kapcsolatot később definiáljuk. A felhasználói felületen a generátor létrehoz, a megjelenés átalakít.

### Összetett Források – ötlettár és minőségi cél

Ezek önállóan hozzáadható, céleszközként viselkedő Források. A felsorolás ötlettár, nem elfogadott teljes fejlesztési lista.

Egyeztetett tárgyalási sorrend: először Virág/ornament, Felhő, Füst, majd a további Források. A Liquid/Folyadékforma a Források között is szerepel; a valódi folyadékszimuláció és a tárgyakkal való fizikai kölcsönhatás a későbbi Fizika blokk témája. A két változat közötti különbséget akkor külön tisztázzuk.

| Forrás | Első jó eredmény | Elsődleges kreatív vezérlők |
|---|---|---|
| Bolygó | Anyaggal, légkörrel és fényiránnyal kész égitest | felszín, nappal/éjjel, felhőzet, légkör, gyűrű, fény |
| Felhő | Valószerű vagy stilizált, megvilágított felhőforma | alak, telítettség, rétegzés, szél, napirány, áttetszőség |
| Füst | Jól olvasható füstcsóva vagy fátyol | kibocsátás, örvénylés, szél, sűrűség, eloszlás, szín |
| Virág / ornament | Egyedi virágfej, indák vagy ismétlődő dísz | szirmok, szimmetria, növekedés, redőzés, ismétlés, organikusság |
| Kristály | Csiszolt, fénytörő vagy stilizált test | növekedés, élek, áttetszőség, belső mintázat, törés |
| Szalag / textil | Térben hajló szalag vagy puha felület | útvonal, szélesség, csavarás, redők, anyag, szél |
| Liquid / folyadék | Önálló csepp, hullám, folyó felület vagy fizikával szimulált, kiömlő víz | kibocsátás, mennyiség, sűrűség/viszkozitás, felszín, fény, ütközés |
| Portal / energiamag | Térbeli fókuszpont képi hatással | alak, perem, belső mélység, pulzus, kisugárzás |
| Csillagtér / fénymező | Jó mélységű, mozgó háttér | sűrűség, távolság, irány, sebesség, szín, csillanás |
| Topográfia / táj | Szerkeszthető terep vagy látóhatár | domborzat, rétegzés, napszak, atmoszféra, anyag |

Az 1. és 6. képhez kapcsolódó renderelési minőséget külön minőségi kapukon kell ellenőrizni: forma részletessége, felületi textúra, megvilágítás, fényáteresztés/tükröződés, szélek, tónustartomány és végső kompozíció. A bolygó jelenlegi vázlatos kinézete nem önmagában könyvtárszervezési kérdés; konkrét referenciajeleneten végzett renderaudit és iteráció kell.

Egyeztetett további Forrás-döntések:

- Bolygó: egyetlen objektumként szerkeszthető; felszín, felhőzet, légkör, gyűrű és fény a saját beállításai. A külön rétegekre bontás nem alapvető felhasználói igény.
- Kristály: egyedi alakítható kristálytest és kristálycsoport/növekedő szerkezet is kell.
- A „Szalag/textil” ötlet általánosabb, útvonal mentén épülő alakítható Forrássá bővül. Az útvonal menti forma lehet szalag, henger/cső, gömbökből álló lánc és további moduláris elemek; nem csak textil. Rajzolt útvonal és kézzel módosítható görbe kell. A szélre/testekre reagálás a külön Fizika blokk része.
- Portál/energiamag: önálló kész látványelem és ráhúzható Portál Megjelenés/shader is kell, amely más grafika arculatát alakítja át. Az „átjáró” mögötti kép torzítása/megjelenítése szintén cél.
- Csillagtér: csak csillagokat generáló önálló Forrás. A világűr háttere külön Forrás; a kettő és további elemek összeállítása recept lehet.
- Topográfia: egy szerkeszthető terepdarab és végtelennek ható táj mód is kell.
- Útvonalforma: a rajzolt út mentén az elemek összefüggő testté is olvadhatnak, vagy különálló, ismétlődő darabok maradhatnak.

Egyeztetett Füst irány: egyetlen Forrás több választható móddal. Kiinduló módok: pontból/objektumból kibocsátott csóva és önállóan elhelyezhető füsttömeg; további módok (például gyűrű vagy kúszó köd) később vizsgálandók. A forma, mozgás, sűrűség és eloszlás külön állítható. Ha a Füst Fizikát kap, reagáljon a jelenet szélmezejére és más releváns erőkre. A csatolt szél látható kapcsolat legyen, a kiértékelés pedig visszatekerhető/exportálható. A pontos szimulációs mód a Fizika blokkban döntendő el.

### Fizikai viselkedés – később részletesen egyeztetendő

A felhasználói művelet ráhúzható „Fizika” lehet. A célon viselkedést ad (például esés, rugalmasság, ütközés, vonzás), a találkozó, fizikával rendelkező tárgyak közös szabályok szerint reagálnak egymásra. Ennek a projektben kell közös tere, időlépése és kapcsolatrendszere: két egymástól független képi shader önmagában nem tud tartós, kétirányú ütközést vezetni. A tervben vizsgálandó a jelenet alapgravitációja és külön gravitációs/erőmezők, a 2D/2,5D/3D hatókör, az ütközési csoportok, a merev és puha testek, valamint a visszatekerhető, reprodukálható export. A kezelőfelületben a fizikai tárgyak és a rájuk ható mezők kapcsolatai legyenek láthatók. Ezek még nyitott architekturális és UX döntések.

Egyeztetett Fizika munkafolyamat: legyen Élő fizika mód, ahol a tárgyak azonnal mozognak és kézzel meglökhetők. Az animáció idővonalon látható, explicit átadási pontig vezetheti a tárgyat, utána a fizika veszi át (például beúszó golyó elengedés után pattog). A visszatekeréshez és exporthoz reprodukálható szimulációs állapot kell.

Kiemelt használhatósági követelmény: gravitáció/erő miatt vásznon kívül kerülő tárgy ne váljon elérhetetlenné. Tervezési javaslat: az élő állapot mellett mindig elérhető kezdőpozíció és „Visszahozás a vászonra” művelet; a rétegsorban kívülre került állapot jelzése; kijelöléskor képernyőszéli iránymutató és visszahúzható fogantyú. Opcionális jelenethatárok/ütközők, de a visszahozás ne függjön ezek bekapcsolásától. A helyreállítás ne törölje észrevétlenül a kulcskockákat.

A fizikai kölcsönhatások más eszközök számára is legyenek vezérlő jelek: érintkezés, ütközési erő, közelség, sebesség, nyomás stb. Példa: két világító 3D tárgy összeér, a Glow az érintkezési pontnál felerősödik, majd lecseng. Ezt kontextusfüggő, intuitív alapkapcsolatként lehessen felajánlani, látható intenzitással és hatókörrel; ne kelljen minden megjelenésnek külön fizikát implementálnia. A pontos jelkapcsolati UX a Kapcsolatok blokkban dől el.

Egyeztetett részvételi szabály: 2D elem csak ráhúzott Fizika esetén vesz részt a szimulációban. A Fizikával rendelkező 2D és 3D tárgyak a vásznon alapból automatikusan kapcsolatba kerülnek és reagálnak egymásra; ez az automatikus kölcsönhatás globálisan és szükség szerint elemenként/páronként kikapcsolható. A kapcsolatok láthatóan ellenőrizhetők és kézzel felülírhatók. A 2D elem térbeli ütköző alakja/mélysége még tisztázandó.

Gravitációs alapdöntés: a globális gravitáció alapból legyen kikapcsolva, hogy az újonnan hozzáadott elemek ne essenek ki rögtön a jelenetből. A fizikai kölcsönhatás és a gravitáció két külön dolog: a 3D objektum és a 3D Liquid generátor alapból rendelkezhet ütközési/fizikai tulajdonságokkal, miközben globális gravitáció nincs. A „szabadon mozgó test” olyan tárgy, amely lökésre, ütközésre vagy helyi erőmezőre is elmozdulhat; ehhez nem szükséges globális gravitáció. A felhasználói szándékhoz illő alapértelmezés: új 3D tárgy Fizikával kézzel meglökhető és más fizikai tárgyakkal reagál, de gravitáció híján nem kezd magától esni. Külön „Rögzítés” állapot tartja helyben, ha akadályként kell (például jégkocka). Az animáció külön vezetheti, majd explicit ponton átadhatja a Fizikának. A működés prototípusban ellenőrizendő.

Gravitációs mezők tervezési követelmény: mező önálló Forrásként behúzható, vagy egy objektumra ráhúzható viselkedésként kapcsolható hozzá. Alakja és helye lehet pont, vonal/útvonal vagy terület/térfogat. Állítható irány, erő, hatótáv, lecsengés, vonzás/taszítás, és hogy mely fizikai elemekre hasson. Tárgyhoz kötve a mező követheti a tárgyat; külön Forrásként önállóan mozgatható és animálható. A vásznon vizuális mező-előnézet kell, amely szerkesztés közben mutatja a hatókört és az erő irányát. A kapcsolatok és a globális gravitáció viszonya a Fizika blokk további döntése.

Automatikus kapcsolat egységes szabálya: a Nap–Ég példához hasonlóan az új gravitációs/erőmező automatikusan hat a hatókörébe kerülő, Fizikával rendelkező tárgyakra. A kapcsolat és intenzitás látható, kikapcsolható vagy szűkíthető. Ne kérdezzünk rá erre ismét külön minden új eszköznél; alapelve legyen az egész rendszernek.

### 4. Mozgásnyelv és tipográfia

Ráhelyezhető viselkedések: belépés/kilépés, követés, rugós ráfutás, útvonal, stagger, hullám, ismétlés, fókuszváltás, reveal, kapcsolt átrendeződés. Közös vezérlők: kezdés, hossz, intenzitás, irány, ritmus, karakter. Egy viselkedés idővonalklipként jelenjen meg; a részletes kulcsok megnyithatók.

Az egymásra reagálás legyen látható kapcsolat: például „kövesd ezt”, „indulj ennek beérkezésekor”, „tarts ekkora távolságot”. Az alapértelmezett rugó és easing legyen jó, de ne legyenek rejtett kötések. A szöveg újratördelésekor a kötött elemek és animációk is alkalmazkodjanak.

A tipográfia előfeltétel, nem utólag animált egysoros Text réteg. A szerkesztő kezeljen bekezdést, kézi és automatikus sortörést, soronként/szavanként/karakterenként eltérő méretet, súlyt, betűközt, sorközt, igazítást, alapvonalat, színt és Megjelenést. A vásznon közvetlenül lehessen a sort húzni, a szó méretét és helyét alakítani; a pontos tipográfiai értékek oldalsó panelen maradnak. A szöveg maradjon szöveg, ne kelljen vektorrá bontani a kreatív tördeléshez. Az elrendezés használhat rugalmas dobozt, kitöltési célt és biztonsági margót, hogy egy plakát felületét szándékosan sűrűn kitöltse. A kézi törések és hangsúlyok rögzíthetők; szövegcsere vagy képarányváltás esetén a rendszer újrarendezési javaslatot és túlcsordulás-jelzést ad, nem pusztán elrontja a kompozíciót.

Közvetlen szövegszerkesztési gesztus: egyetlen szövegdoboz több sorát külön fogantyúval lehet megfogni. Ha a felhasználó egy sort lejjebb húz, alapértelmezésben a sor előtti helyi sorköz nő, a következő sorok újrafolynak, a szöveg szerkeszthető szöveg marad. Az előző sor és a többi tipográfiai beállítás nem változik. Húzás közben a Vel mutatja a távolságot és a szövegdoboz új határát; dupla kattintás visszaállítja a helyi sorközt. Vízszintes húzás külön helyi sorbehúzás lehet, az egész blokk mozgatása pedig a blokk keretéről történik, így a három művelet nem keveredik. Ha a felhasználó szabad, egymástól független sorpozíciót akar, azt kifejezetten feloldhatja anélkül, hogy a szöveget kötelezően több rétegre bontaná.

A most egyeztetett közvetlen gesztus **egy sor arrébb húzása** ugyanazon szövegobjektumon belül; ezt nem kell egy szó sorból való kiemelésének vagy új objektum létrehozásának tekinteni. A belső modell tárolhat soronkénti pozíció-, sorköz-, behúzás-, méret- és animációs értékeket, de a felhasználó egyetlen szövegobjektumot lát, ír át és mozgat. A sor függőleges húzása a helyi sortávolságot/pozíciót állítja; a sor vízszintes húzása a helyi behúzást/eltolást. A technikai tárolási mód a prototípus feladata. A szavankénti animáció külön későbbi eszköz, nem feltétele ennek a sorszerkesztési gesztusnak. Nem kell az „eredeti szóhely üres maradjon-e” kérdést tovább tárgyalni.

Referencia 4: a szavak különböző méretben és megtört sorokban töltik ki a vásznat. Ez elsősorban **tipográfiai elrendezés**. Ráhúzható „Sorok csúszása” Mozgás esetén az egyes sorok/szavak eltérő irányba futnak. Ugyanaz a mozgás lehet **egyszeri** (belépés, végső állapot megtartása), **ismétlődő** (adott darabszám), vagy **folyamatos** (végtelen, varratmentes futás). Nem külön animációtípusokként kell duplikálni a könyvtárban: a mozgás kártyáján „Egyszer / Ismétlés / Folyamatos” időzítés választható, és az idővonal a különbséget sávvéggel, ismétlésjellel vagy végtelen jelzéssel mutatja. Folyamatosnál az ismétlési pont ne okozzon látható ugrást; oda-vissza mozgás vagy vásznon kívüli visszafordítás is választható. A szerkesztő mutatja a mozgás kezdeti/finalis állapotát és a kilógási határokat. A felhasználó egy-egy sor nyilát közvetlenül a vásznon forgathatja/húzhatja; az eltérő kezdésekhez egyszerű stagger vezérlő és idővonal-előnézet tartozik.

Referencia 5: a ragyogó, sokszorozott, eltolt, térben rétegzett és elmosott szöveg nem egyetlen szűrő. Ráhúzható **Mozgáskészletként** jelenjen meg, amely egy kiválasztott szövegből szerkeszthető vizuális másolatokat, eltolást, mélységet, blur/glow Megjelenést és villogási/időzítési viselkedést állít össze. A készlet egyetlen kompakt vezérlővel jó alaplátványt ad, de a részei lenyithatók, kikapcsolhatók és külön finomíthatók. A másolatok a forrásszöveget követik; nem kell többször ugyanazt a szöveget kézzel átírni. A felhasználó választhat, hogy csak egy szó, sor vagy teljes szöveg kapja a hatást. A villogás lehet ritmikus, véletlenszerűen variált vagy esemény/hang által indított, a közös animációs időkezelés szabályai szerint.

Az 5. kép alsó kis feliratainak mintájára külön **Váltakozó szöveg** viselkedés kell: a meglévő szöveg mellett/helyén szerkeszthető második, harmadik stb. szöveghely jelenik meg. A felhasználó a vásznon írja be a változatokat és ott látja a helyigényt. Egy mozgássáv vezérli a sorrendet, váltás módját (csere, csúszás, áttűnés, villanás, karakterenkénti átírás), ismétlésszámot és indító eseményt. A hosszabb változat ne vágódjon le és ne rántsa el véletlenül a környező layoutot: választható állandó keret vagy animált újratördelés. A szöveghelyek egyetlen szerkeszthető tipográfiai objektum részei maradnak.

Referencia 7: a képek hátterei és fényei főként Megjelenés/Forrás kutatási referenciák; nem kell minden ilyen látványt szöveg-animációnak nevezni. A rájuk helyezett szöveg viszont erős tördelési és pozicionálási példa. Általános szövegmozgások: szavak több irányból belépése, egymás után kiíródás, soronként épülés, kitakarásból előbukkanás, elcsúszás és rendeződés. A mozgás célpontja választható: teljes szöveg, sor, szó vagy karakter. A sorrend és az időeltolás vizuálisan, a szövegen is állítható, nem csak sok külön kulcskockával.

### 5. Idővonal, élő működés, hang

Szerkesztési idő: az idővonalnak van szerkesztési és exporttartománya, de a jelenet a tartomány után is tovább élhet. Loop bekapcsolva a tartomány ismétlődik; Loop kikapcsolva az időzített klipek egyszer lefutnak, a folyamatos generátorok és viselkedések megszakítás nélkül tovább működnek. Az Élő/Eljátszás a kézi beavatkozás és rögzítés külön kezelőállapota, nem külön animációs tartomány. A hangvezérlés mindkettőben használható, nem harmadik, kizáró mód.

Kell jól látható munkatartomány, klipszélek húzásával időtartam, csoportos mozgatás és időarányos nyújtás, lenyitható paramétersávok, jelenetmarkerek, hullámforma és jelburkolók. A snap a projekt képkockasebességéhez igazodjon (a jelenlegi kód több helyen 30 fps-t feltételez).

Kiemelt timeline-cél: a már betimolt animáció újraidőzítése legyen ugyanolyan közvetlen, mint az első időzítés. Ne kelljen csoportot/precompot készíteni pusztán lassításhoz vagy több réteg szinkron módosításához. Egy összetett Mozgás az idővonalon **egy mozgásblokk** marad, belül jól látható fázisokkal és kulcskockákkal. A blokk közepét húzva az egész animáció, a beúszás kulcsaival együtt, változatlan belső időzítéssel eltolódik. A blokk jobb szélét húzva az animáció vége módosul; a kész, korábbi bevezető fázisok sebessége alapból változatlan, az utánuk következő rugalmas szakaszok és a záró esemény időzítése alkalmazkodik. A Vel húzás közben előnézetben mutatja, mely fázis nyúlik és melyik marad változatlan. Egy konkrét fázis saját szélét húzva csak az a fázis lassul/gyorsul. A teljes animáció arányos időskálázása külön, kifejezett művelet. Több, akár külön rétegen lévő blokk/kulcs kijelölhető egyetlen időkeretbe; a keret közepe együtt mozgatja őket, a szélhúzás ugyanazokat a látható időzítési szabályokat alkalmazza. Egy művelet visszavonása az egész több réteges módosítást helyreállítja.

Az **időgörbe** a blokk saját tulajdonsága: közvetlenül a blokkon jelölhető, hol gyorsul, lassul, áll meg röviden vagy ismétel; belül az animáció minősége és képe megmarad. Külön „impact” vagy más rögzített pillanat több mozgásban közös időhorgony lehet: a horgony a helyén marad, az előtte/utána levő szakasz nyúlik. Zenei jelzéshez kötött eseménynél a kapcsolat alapból a jelzéshez tapad, így a szabad retime nem csúsztatja el észrevétlenül a szót/ütést; a felhasználó explicit dönthet a kapcsolat feloldásáról vagy áthelyezéséről. A többi, nem rögzített kulcs arányosan rendeződik a horgonyok között. A sebességváltás és a path térbeli alakítása két külön szerkesztés, hogy a lassítás ne torzítsa el a pályát.

Példa: egy felirat 0–1 másodperc között balról beúszik, utána remeg, végül darabokra törik és eltűnik a 4. másodpercnél. Ha a felhasználó a blokk jobb szélét a 6. másodpercre húzza, a beúszás továbbra is 0–1 között történik ugyanazzal a sebességgel; a remegés tovább tarthat, a záró szétesés később következik be, és a teljes animáció a 6. másodpercnél ér véget. Ha magát a szétesést akarja lassítani, a szétesés fázisának szélét húzza. Ha az egész blokkot két másodperccel későbbre teszi, minden kulcs két másodperccel tolódik, a beúszás is. Nincs nestelés, a szöveg továbbra is közvetlenül szerkeszthető. Teljesítmény vagy technikai okból később szükséges belső cache/csomagolás nem jelenhet meg kötelező felhasználói lépésként.

Egyeztetett alapművelet: a jobb szél húzásakor a remegés/folyamatos középső fázis tart tovább, a záró szétesés később, eredeti sebességgel történik. A blokk mellett/közvetlen időzítésvezérlőn látható „Zárás lassítása” kapcsolóval ugyanaz a szélhúzás a záró fázist is nyújtja; bekapcsoláskor a vásznon előnézet mutatja a különbséget. A fázis közvetlen szélhúzása továbbra is pontos szerkesztésre használható. Nem kérdezünk újra a két működésről más animációknál: az időzített bevezető és záró rész, valamint a rugalmas középső rész általános szerkesztési minta.

A hangos munkafolyamat elsődleges célja a **látványelemek zenére vezérlése**; a szövegmozgás ugyanígy ráilleszthető az ütemre. A vokál és dalszöveg automatikus felismerése nem előfeltétel. A **Ritmus felvétele** eszközben a zene és a jelenet lejátszása közben a felhasználó egy gombot/egérműveletet koppintva jelöli a fontos pillanatokat. A gyors koppintás egy időpontot, a nyomva tartás opcionálisan időtartamot jelöl; az alapélmény a könnyű, ismételhető koppintás. A rendszer a bevitel késését kezeli, és felvétel után külön, nem romboló simítást/ütemhez igazítást ajánl; a nyers időpontok megmaradnak. Hibás koppintás törölhető vagy újravehető anélkül, hogy az egész felvétel elveszne.

A koppintásokból általános **Jelzések** sáv keletkezik, nem kizárólag hanghoz kötött „beat track”. Ha szöveg van kijelölve, a Vel felajánlja, hogy a jelzések sorban a szavakhoz vagy sorokhoz rendelődjenek; ekkor a szöveg animációja (belépés, felvillanás, kiíródás stb.) a megfelelő jelzésnél indulhat. Ha nincs kijelölt szöveg, a jelzések szabad ritmus-/eseménypontok maradnak. Egy jelzéshez több layer vagy Mozgás kapcsolható; a jelzés későbbi mozgatása az összes hozzá kapcsolt reakciót együtt igazítja. A felhasználó a vásznon vagy az idővonalon egyaránt hozzárendelhet reakciót, és láthatja, hogy melyik jelzés mit indít. Ugyanez a gesztus használható narrációhoz, kézi előadáshoz, színpadi cue-khoz vagy néma videóhoz is. A jelzés fogalma a Kapcsolatok rendszerének **Időzítés/Vezérlés** típusa, de a Jelzések sávon egyszerű időpontokként szerkeszthető.

Szóhoz koppintva a jelzés szemantikai jelentése: **a szó elhangzásának kezdete**, és ekkor a szónak már olvashatónak kell lennie. Az animációtípus határozza meg, hogy a felkészülő/belépő rész előbb kezdődik-e, a szó a koppintásnál jelenik-e meg, vagy ekkor éri el a hangsúlyos csúcspontot. A mozgáskártya ezért láthatóan megmutatja, melyik eseménypontja igazodik a koppintáshoz, és a felhasználó átállíthatja ezt. A kézi koppintások korrekciója külön kezeli a bemeneti késést és a ritmus finom időzítési hibáit; nem mossa össze a szomszédos szavakat, nem helyezi át őket másik ütemre. A nyers jelzések megmaradnak, a javítás erőssége szabályozható és visszavonható.

Az automatikus hanganalízis (ütem, ütés, hangerő, magas/mély tartomány stb.) külön felajánlott jelzésforrás. Az automatikusan becsült és a kézzel koppintott jelzések eredete vizuálisan különbözik; mindkettő áthelyezhető és kombinálható. A hangból vezérelt megjelenések és mozgások előnézete és exportja ugyanazokat a rögzített/betöltött jelzéseket használja, hogy az időzítés ne változzon meg a visszatekerés vagy export során.

### 6. Rajzolt és felvett animáció

Két külön eszköz: útvonalrajzolás és időben felvett paramétermozgás. Útvonalnál geometriai simítás, felvételnél időbeli ritmuskorrekció is választható. Nyers felvétel megőrzése, simítás erőssége, előtte/utána, újrafelvétel. Az éles irányváltást vagy szándékos impactot ne törölje automatikusan a simítás.

### 7. Napi kezelhetőség

Kompakt effektlánc látható sorrenddel, bypass gombbal és hozzáadással. Tulajdonságoknál fő vezérlők, alattuk részletek. Maszkoláshoz ráhúzáskor egyértelmű célzóna és előnézet; puszta várakozás ne alakítsa át észrevétlenül a kapcsolatot. Rövid tooltip és választható bővített súgó példával, visszaállítással és kompatibilitási magyarázattal.

### 8. Tartalomminőség és fejlesztési ütemezés

Kis, gondosan elkészített referenciarecept-család: króm/üveg poszter, kinetikus cím, analóg tipográfia, hangreaktív pontmező, lyric jelenet. Mindegyik vizsgálva 1:1, 4:5 és 9:16 arányban, rövid/hosszú magyar szöveggel, eltérő palettával, előnézetben és exportban.

Előzetes függőségi sorrend: időkezelés és adatmodell → könyvtár és alapinterakciók → mozgásviselkedések és szövegalapok → referenciarecept-családok → anyag/fény fejlesztés → állapottartó szimuláció. Végleges prioritás az egyeztetések után.

## A végleges tervbe kerülő ellenőrzések

- Loop nélkül az időzített klipek egyszer futnak le, a folyamatos animációk és generátorok megszakítás nélkül tovább mennek; loopban a kijelölt tartomány ismétlődik. Keresés és export ugyanazt az állapotot adja azonos időpontban; az export vége külön beállítható.
- Több réteg kulcsai megőrzik relatív időzítésüket együtt mozgatva; visszavonás helyreállítja őket.
- Recept szöveg- és képcseréje nem teszi tönkre a layoutot; képarányváltás értelmes elrendezést ad.
- Viselkedések sorrendje, célpontja és kapcsolatai láthatók; konfliktusuk kezelése egyértelmű.
- Hangjelek elnevezése jelzi a becslést; importált stemek és fő mix nem szólnak duplán.
- Régi projektek migrációja, mentés és újranyitás megőrzi a megjelenést.
- Valódi GPU-n célgépen mért előnézet; teljes minőségű állókép- és hangsávos videóexport ellenőrzése.

## Kidolgozott döntés: kapcsolatok és mozgás (2026-10-17)

### Kapcsolatok: egy rendszer, három láthatósági szint

A vásznon végzett művelet az elsődleges. Ráhúzáskor a Vel csak az adott célon értelmes műveleteket mutatja rövid előnézettel: például „Megjelenésként”, „Felületre”, „Formához igazítva”, „Üreg kivágása”, „Kövesse”, „Jel vezérelje”. A felhasználó döntését a rétegen kis, kattintható kapcsolatjelvény mutatja. A jelvényből a kapcsolat célja, iránya, hatása, erőssége és kikapcsolása elérhető. A kijelölt elem Kapcsolatok panelje az összes rá ható és belőle induló kapcsolatot felsorolja. Összetett jelenethez külön, opcionális térkép mutatja az elemeket és a szűrhető kapcsolatvonalakat; a vonalak nem fedik állandóan a vásznat. A PlayStation Dreams közvetlen szerkesztése és igény szerint látható vezetékei az egyik UX-példa ehhez; a megoldást a Vel saját munkafolyamataira kell kialakítani, a többi kutatási példával együtt értékelve.

Három kapcsolati állapot van: **Automatikus**, **Felajánlott**, **Kézi**. Az automatikus kapcsolat a jelenet egyértelmű szabálya: a globális fény az érintett 3D elemekre, a mező a hatókörében levő fizikai testekre, két kompatibilis fizikai test egymásra hat. Ezeket a rendszer szabályként értékeli, nem rajzol sok száz külön vezetéket. Felajánlott kapcsolatnál a program értelmes párosítást és az eredmény rövid előnézetét mutatja, például Nap → Ég vagy fizikai érintkezés → Glow; a kapcsolat csak elfogadás után lép életbe. Kézi kapcsolat a vászonról, rétegsorból vagy Kapcsolatok panelből indítható. Minden automatikus kapcsolat helyben felülírható vagy kikapcsolható. A felülírás és az oka mindig látható.

A kapcsolatok felhasználói típusai: **Térbeli** (rögzítés, követés, felület/útvonal), **Forma** (illesztés, kivágás, metszet), **Környezeti** (fény, ég, szél, mező), **Kölcsönhatás** (ütközés, közelség), **Vezérlés** (egy esemény vagy érték paramétert hajt), **Időzítés** (egy mozgás másik után indul). Ezek azonos módon kijelölhetők és követhetők, de nem azonos számítások: például a chrome anyag, a szöveg által kivágott geometria és a fizikai ütközés külön belső működés. A „shader” keresőszó továbbra is megtalálhatja a ráhúzható Megjelenéseket.

Ha egy paraméterre több vezérlés érkezik, a panel mutassa a tényleges összeállítást: hozzáadás, keverés vagy felülírás, látható prioritással. A felhasználó döntése előzi az automatikus szabályt. Önmagába visszacsatoló vezérlést a Vel jelezzen; szándékos visszacsatoláshoz külön késleltetés szükséges. Kapcsolat törlése és duplikálása egy műveletként visszavonható; duplikáláskor a belső kapcsolatok az új csoportba mutatnak, a külsők csak akkor másolódnak, ha továbbra is értelmesek. Az effektek látható sorrendben futnak, míg a forma, fizika és vezérlőjel saját fázisban értékelődik. Ez megakadályozza, hogy a lánc puszta átrendezése véletlenül megváltoztassa az ütközést.

Próbajelenetek: (1) Nap–Ég–Felhő–Eső összekapcsolva, egyenként kiiktatható hatásokkal; (2) króm felirat a jégkocka kivágott üregében, körötte fizikai lávával; (3) két test ütközése az érintkezési pont Glow-ját hajtja; (4) szöveg gömb felületén/belsejében, külön állítható vastagsággal. Mindegyiknél a kapcsolat a vászonról felfedezhető, a panelben ellenőrizhető és a térképen követhető legyen.

### Mozgás: közös óra, eltérő mozgásfajták

Három mozgásfajta kell: **időzített** (van kezdete és vége: belépés, reveal, impact), **folyamatos** (lebegés, forgás, lélegzés, fizikai élet), **reaktív** (hangra, kontaktusra, kézi eseményre indul vagy változik). Ugyanazon rétegen együtt lehetnek. Minden ráhúzott Mozgásnak egyszerű, jó alapállapota van; idővonalon saját színes sávként jelenik meg, lenyitva a részletes paraméterekkel és kulcskockákkal. A függőségeket kapcsolatjelvények mutatják. A több mozgás összegzési módja látható: például belépés után folyamatos lebegés; nem rejthetjük el, ha két mozgás ugyanazt a pozíciót írná.

Az Idővonal mindig a jelenet része. **Nem kell két kizáró „Time” és „Live” lejátszási mód.** Egyetlen jelenetóra van: az időzített klipek a megadott helyen egyszer lefutnak; a folyamatos mozgás és a generátorok közben és utánuk is futnak. A Loop csak azt dönti el, hogy a kijelölt tartomány végén visszaugrunk-e az elejére. Kikapcsolt Loopnál nincs visszaugrás vagy kényszerű megállás; az időzített elemek végállapotukat tartják, amennyiben az adott klipnél ezt állítottuk, a folyamatosak pedig zavartalanul működnek. A lejátszófej ekkor a kijelölt tartomány után is haladhat, ezt az idővonalon „továbbfutásként” kell jelezni. **Eljátszás/Felvétel** külön gombbal aktiválja a kézi előadást és annak rögzítését, de nem kapcsolja ki az időzített klipeket. A Time/Live elnevezést csak akkor érdemes megtartani, ha későbbi UX-próbákban világosabbnak bizonyul; jelenleg félreérthető.

Az idővonal szerkesztési tartománya és az export vége külön döntés. Például egy 10 másodperces intro után a csillagtér örökké mozoghat a vásznon, miközben az export 15 másodpercnél véget ér. A 10. másodpercnél nincs újraindítás vagy vizuális törés. Újraindítás csak a Loop bekapcsolásakor történik. A jelenlegi programban a Loop nélküli továbbfutás már létezik; a felhasználó által jelzett probléma az, hogy ilyenkor az idővonalon levő animációk nem játszódnak le megbízhatóan. A javaslat ezt a működést megőrzi, és a kétféle animációt közös időkezelésbe helyezi.

Egyeztetett alapértelmezés: az időzített mozgás végén a tárgy megőrzi a végső állapotát; a folyamatos mozgások és kölcsönhatások onnan működnek tovább. Az ettől eltérő viselkedés (például visszaállás, eltűnés vagy ismétlés) külön választható.

Az Élő **Felvétel** a vásznon húzott mozgást és paraméterváltozást rögzíti; egy felvétel idővonalklippé alakítható, újravehető és pontosítható. A program **alapból azonnal simítja** az ügyetlen kézmozgásból eredő zajt, jó időzítést és easinget ad, ezért az első visszajátszás már használható. A simítás nem lehet puszta, mindent elmosó átlagolás: külön kezeli a pálya alakját, a sebességingadozást, a megállást és a hangsúlyos becsapódást; a szándékos éles fordulat megmarad. A nyers gesztus megőrződik, a korrekció erőssége utólag állítható vagy kikapcsolható, és az eredmény előtte/utána összevethető. Rajzolt útvonalat a felhasználó időbeli előadás nélkül is létrehozhat, majd ráhúzhat mozgást. A PlayStation Dreams Action Recorder és a Procreate Dreams Perform két külön példa a gesztusfelvételre; a Vel megoldását ezek és a pontos idővonalszerkesztés igénye együtt formálják.

Az időkezelésben külön szerepel a projekt ideje, az élő előadás kezdete óta eltelt idő, az egyes mozgások helyi ideje és a hangsáv ideje. Egyetlen közös kiértékelő motor számolja a megjelenést; a szimulációhoz rögzített lépés és visszatekerhető állapot kell. Szerkesztéskor a klip teljes hossza, belépés/kilépés szakasza, ismétlése, sebessége és eseményindítása egyértelműen látszik. A felhasználó egyszerre mozgathat több klipet és kulcskockát; snap, markerek és hangsáv hullámforma támogatják a ritmust.

Kritikus idővonal-szabály: a lejátszófej tetszőleges időpontra ugrása nem módosítja az animációt, és ugyanazt a képet adja, mint a normál lejátszás azonos pillanata. Az időzített animációt az abszolút projektidőből kell kiértékelni, nem az előző képkockák futására támaszkodva. A fizika/folyadék és más állapottartó rendszerek előre rögzített eseményekből és köztes állapotmentésekből számolhatók újra; amíg ez tart, a Vel egyértelmű számítási állapotot mutat, nem egy téves képkockát. Élő eljátszásból idővonalra váltáskor a pillanatnyi élő állapot ne írja felül a jelenet alapállapotát vagy a felvételt. Felvett előadás esetén a gesztusok időbélyeggel rögzülnek, hogy később ugyanarra a pillanatra visszaugorva ugyanaz az eredmény jelenjen meg. Élőben nem rögzített, véletlen vagy külső input nem ígérhető utólag visszatekerhetőnek; ezt láthatóan külön kell jelezni és szükség esetén rögzíteni.

Elfogadási példák: 10 másodperces intro után a csillagtér Loop nélkül, megszakítás nélkül tovább mozog, miközben az intro idővonalklipjei rendesen lefutottak; ugyanennek 15 másodperces exportja a 15. másodpercig tart. A 3 másodperces belépés után a szöveg folyamatosan finoman mozog; élőben megmozdított elem felvétele visszatekerhető és reprodukálható; érintkezésre fellobbanó Glow ugyanarra az eseményre azonos választ ad exportnál. A mostani hibát, ahol Loop kikapcsolásakor a lejátszás tovább fut, de az idővonal eseményei elmaradnak, a közös időkiértékelés oldja meg.

Kutatási támpontok: [PlayStation Dreams – Gadgets és vezetékek](https://docs.indreams.me/en-US/create/resources/edit-mode-guide/assembly/gadgets), [PlayStation Dreams – vezetékek megjelenítése](https://docs.indreams.me/en/create/resources/edit-mode-guide/coat/show-hide), [PlayStation Dreams – animáció és Action Recorder](https://docs.indreams.me/en-US/create/resources/edit-mode-guide/assembly/animate), [Apple Motion – behaviors és keyframes](https://support.apple.com/guide/motion/behaviors-versus-keyframes-motnf425e02f/6.3/mac/15.6), [TouchDesigner – Timer CHOP](https://docs.derivative.ca/Timer_CHOP), [Procreate Dreams – Perform](https://help.procreate.com/dreams/handbook/1.0/keyframes-and-performing/performing). Az utóbbi külön termék a PlayStation Dreamshez képest.

## Külső kutatási támpontok

- Apple Motion: objektumra húzható, kombinálható behaviors. https://support.apple.com/guide/motion/intro-to-behaviors-motn13748883/mac
- Three.js MeshPhysicalMaterial: átviteli, irizáló, bevonat- és más anyagparaméterek; a magasabb minőség számítási költséggel jár. A jelenlegi Vel motor nem Three.js. https://threejs.org/docs/pages/MeshPhysicalMaterial.html
- TouchDesigner Particle SOP: kibocsátás, erők és vonzás elkülönülő vezérlése. https://derivative.ca/UserGuide/Particle_SOP

Ezek tervezési precedensek, nem bizonyítják a Vel jelenlegi teljesítményét vagy az adott referenciaképek elkészítési módját.

# Vel — konkrét alkotói funkciók és ellenőrizhető munkafolyamatok

2026-10-17. A felhasználó mai egyeztetéséből készült pontosítás a `vel/docs/vel-fejlesztesi-terv-jovahagyasra.md` mellé. Ez **nem állítja, hogy a funkciók már elkészültek**, és nem helyettesíti a fő tervet. A `vel/HANDOFF.md` M-számai technikai szeletek; az ottani „kész” nem bizonyítja automatikusan az itt leírt alkotói munkafolyamatot. A Claude által jelenleg használt `vel/` munkamappát ez a dokumentum nem módosítja.

**Olvasási szabály Claude-nak:** az alábbi „Elvárt” a felhasználó által kért viselkedés. A „Próba” termék-elfogadási példa, nem kötelező implementációs módszer. A „Nyitott” kérdést saját UX-/technikai prototípussal eldöntheted; ne egyszerűsítsd el úgy, hogy az elvárt munkafolyamat eltűnjön. Ahol több fokozat kell, a hiányt nevezz meg és ne jelölj teljes termékszakaszt késznek.

## 1. Fogalmak és könyvtár

**Elvárt:** a könyvtár elsődleges helyei Receptek, Források, 2D Formák, 3D Formák, Megjelenések, Mozgás és Részecskék. Karakterek jól látható gyűjteményként kereshetők a Receptek és Formák felől. Egy elem több keresztcímkét viselhet, de legyen világos, mi az elsődleges helye. A könyvtár a bal oldalsávban, a rétegek fölött legyen; az elválasztóval a kettő magassága állítható. A kártyán rövid vizuális/motion előnézet, alkalmazhatóság és fő vezérlők jelenjenek meg. Keressen ékezet nélkül is.

**Forrás:** önálló alkotói tárgy vagy jelenség akkor is, ha belül több renderelt összetevője van. A Bolygó ezért egy tárgyként húzható be, felszínnel/felhővel/légkörrel/gyűrűvel; ezek szükség szerint lenyithatók, nem tömik meg alapból a rétegsort. A Csillagtér kizárólag csillagokat generál; a Világűr háttér külön Forrás. Ég, Nap, Felhő és Eső külön Forrás; együtt, összekapcsolva már receptet adhatnak.

**Recept:** több szerkeszthető Forrás, Megjelenés, Mozgás, szöveg és layout kész összeállítása. Családok: Scapes (világűr/ég/táj), Tipográfia, Motion grafika, Energia/organikus, Poszt/Reel/Poszter; formátum, téma, hangulat, feladat és mozgástípus szerinti címkékkel. A recept behelyezés után nem lapos kép: a szöveg, kép, szín, ritmus, formátum és összetevők módosíthatók.

**Megjelenés:** bármely kompatibilis célra ráhúzható felületi/képi/stílusbeli változtatás. A közös gesztus nem jelenti, hogy minden mögötte shader. Chrome/Jég/Hologram lehet összetett anyag; Glow képi effekt; vastagság és kivágás geometriai művelet; ütközés fizika. A felületen ugyanúgy könnyen felvehetők, de a kártya mutassa, mire hatnak és a láncban vagy más rendszerben hol futnak. A „shader” keresőszó találjon rá a köznyelvben így nevezett Megjelenésekre.

**Próba:** húzz be Bolygót, állítsd a belső légkört, majd Ég és Nap külön tárgyát; a Felhő nem válik automatikusan egy teljes „Ég felhővel” jelenetté. A könyvtár és rétegek egyszerre áttekinthetők a bal oldalon.

## 2. Anyag, fény és renderminőség — nem csak a Gerincfelület

**Elvárt univerzális művelet:** egy 2D/3D formára, szövegre vagy más alkalmas tárgyra ráhúzom a Megjelenést, és az adott célnál értelmes eredményt kapok. Ha térbeli geometria szükséges, a Vel ajánlja a Térbeliség bekapcsolását; nem állítja, hogy ugyanaz az anyag egy sík képen és egy 3D testen azonos számítással dolgozik. A megjelenés-láncban az elem ki/bekapcsolható, átrendezhető, más célra másolható, belső részei lenyithatók. Ne legyen egyetlen, réteghez kötött demó a teljes „anyagkatalógus” helyett.

**Első minőségi család:** Chrome/csiszolt fém, lakkozott szín, Üveg/Jég, Hologram, gyöngyház, Plazma/emisszió. Későbbi jelöltek: kerámia, viasz, olajfesték, lufi/felfújt, Liquid Glass, portál/energiamag. Ezekhez nem elég név és színezés: forma- és fényreakció, érdesség, környezeti tükröződés vagy törés, megvilágított él, hátteret ténylegesen torzító részek, jó alapérték és célonként értelmes vezérlő kell. A meglévő effektek mindegyikén látvány-audit szükséges: jelenlegi eredmény, hiba, javított alapérték, kompatibilis cél, teljesítmény és referenciapróba. Metaball-összeolvadás, morfing és fizikai viselkedés külön funkciók, akkor is, ha a felhasználó ráhúzza őket.

**Jelenetfény:** alapból a 3D tárgyakat érinti; globálisan és tárgyanként letiltható. Egy anyag emissziója ettől külön. A tárgyon látható csillanást megfogva a felhasználó azt helyezi át, amit lát; a program a releváns fényt állítja. Több fénynél az aktív fény legyen egyértelmű. A fény/szín/roughness és a padló tükörképe együtt változzon. A gerincfelülethez készített vörös lakkozott látvány legyen más formán is alkalmazható Megjelenés; az egész 1. képes kompozíció külön Recept.

**1. kép próba:** útvonal/gerinc rajzolása → szélesség, vastagság, taper, csavarás és keresztmetszet közvetlen állítása → vörös lakkozott/fémes Megjelenés → padló és választható csatlakozás/összeolvadás → valódi tükörkép → hosszú fénycsík és hátulról jövő fény húzása → utómunka. A padlóba simulás geometriája és a tükörkép két külön állítás. A referencia mércéje a világos stúdió, vékony elegáns ív, mély vörös fény, finom textúra és mozgás közbeni stabil minőség, nem pusztán egy vörös felület megléte. A 6. kép organikus/áttetsző anyaga külön kapu. A 2. kép festett/toon diorámája eltérő geometria- és tartalomigény, nem tekinthető a fényes anyagok változatának.

**Nyitott technika:** mesh/SDF/hibrid, tükröződés/törés részletfokozatai, több fény ára. A műszaki döntést célgépes képi és időmérés támassza alá; a WebGL2 futást puszta feltételezés miatt nem kell elvetni.

## 3. Konkrét Források és kreatív átalakításuk

- **Felhő:** alapból felhőszerű, jó minőségű puha alak és fény. Alak, méret, sűrűség, mozgás, szélreakció állítható. Húzhatok rá például Lufi Megjelenést, beállíthatom a felfújtságot, kikapcsolhatom a felhő alapmozgását, és kaphatok világítható lufi-jellegű assetet. A Felhő nem azonos az Ég Forrással.
- **Füst:** saját, füsthöz hangolt alapérték; több működésmód (például gomolygás/kibocsátás/örvény), sűrűség és irány, opcionális szélmezőre reagálás. A Felhővel közös belső motor megengedett, de a két alkotói eszköz ne legyen ugyanaz más néven.
- **Virág/ornament:** 2D/2,5D, szirmok, szimmetria, ismétlés és növekedés; Megjelenés ráhúzásával látványos felület. A valódi 3D virág kifejezetten későbbi.
- **Bolygó:** egy tárgy; szerkeszthető felszín, felhő, légkör, gyűrű, megvilágítás. A mai vázlatos bolygó helyett hitelesebb felület és fény legyen a cél.
- **Kristály:** egyetlen csiszolható test és növekedő kristálycsoport is. **Útvonalforma:** egy kézzel rajzolt pálya mentén szalag, cső, hengeres vagy gömbláncos profil, vastagság/taper/csavarás; szélben hajlás későbbi fizikával. **Portál/energiamag:** önálló tárgy és hasonló látványt más tárgyra ráhúzó Megjelenés; tényleges háttértorzítás/átjáró is választható.
- **Csillagtér:** csak csillagok, szám, szín, sebesség, mozgásirány, mélység; a teljes Világűr háttér külön. **Ég/Nap/Eső:** külön tárgyak, amelyek összekötve reagálhatnak a napszakra, fényre és borultságra.
- **Fekete lyuk:** összetett, de egyként szerkeszthető Forrás: akkréciós korong, lencsézés, ragyogás, a mögöttes csillagtér tényleges torzítása. Teljes fekete lyukas jelenet Recept.

**Próba:** a Napot az Éghez közelítve a Vel javasoljon érthető kapcsolatot; elfogadás után a Nap pozíciója/fénye változtassa az Ég színét. Felhő+Eső külön összekötve borítsa az Eget. A kapcsolatok egyenként letilthatók; a felhasználó lássa, mi miért változott.

## 4. Kapcsolatok, csoportok és változatok

**Három külön fogalom:** (1) Csoport = együtt rendezett rétegek, lenyitva a gyerek közvetlenül szerkeszthető; a határ és forgáspont a tartalomhoz igazodik. (2) Közös alap és Változat = több példány közös eredete, helyi eltérésekkel; egy példány szövegének átírása nem írja át a többit. A „Más változatoknak átadás” a célváltozatokat láthatóan kiválasztva küldi tovább a konkrét változást. (3) Kapcsolat = jelenetbeli két tárgy, érték vagy esemény közötti hatás; nem jelenti azt, hogy azonos változatok.

**Kapcsolat felvétele:** ráhúzáskor a Vel csak értelmes célműveleteket ajánljon (például „felületre”, „formához igazítva”, „üreg kivágása”, „kövesse”, „jel vezérelje”), rövid előnézettel. A választás látható jelvényt kap az érintett rétegen. A Kapcsolatok panel mutassa az irányt, célt, hatást, erősséget és kikapcsolást; nagy jelenethez opcionális szűrhető térkép. A kapcsolati vonalak ne fedjék állandóan a vásznat.

**Automatikus:** globális fény 3D-re, kompatibilis fizikai testek találkozása, mező a hatókörben. **Felajánlott:** Nap→Ég, Eső/Felhő→Ég, kontaktus→Glow. **Kézi:** a felhasználó maga köti össze. Az automatikus szabály helyben felülírható/tiltható. Több paramétervezérlőnél látható legyen, mi adódik, keveredik vagy ír felül; a felhasználói döntés előzze az automatikusat. Csoportduplikáláskor a belső kapcsolatok az új csoporton belülre mutassanak, a külsők csak értelmes esetben maradjanak. A konkrét UI elrendezés prototípussal dönthető el; a fenti átláthatóság nem opcionális.

## 5. Formaszerkesztés és 2D↔3D

**Elvárt közös alap:** szerkeszthető 2D kontúr/útvonal legyen a maszk, mozgáspálya, szövegút és 3D gerinc közös kiindulása. Rajzoláskor simítás segít, az eredeti kézmozdulat megmarad. Pontok, tangensek, nyitott/zárt szakasz, pont hozzáadása/törlése és sarokkerekítés közvetlenül módosítható. Egyesítés, kivonás, metszet, lyuk, kontúreltolás és változó vastagság visszaszerkeszthető művelet maradjon.

**Térbeliség:** 2D formára és szerkeszthető szövegre adható tulajdonság: vásznon húzható mélység/vastagság, élkerekítés, anyag és fényreakció. A 2D, 2,5D és valódi ütköző 3D státuszt külön jelezze. Kihúzás, útvonal menti felület és forgatott profil első fő módok; loft/felfújás később. A közös útvonal módosítását kövesse a forma, Megjelenés, Mozgás, Kapcsolat és fizikai alak. A szándékolatlan önmetszést/vékony falat a Vel jelezze.

**Élő szöveg és forma két iránya:** ha a szöveget 3D testre teszem, szerkeszthető szövegként a külső/belső felületén, útvonalán vagy belső síkján fut; hengerpaláston hosszában/kerület mentén, ismételve is. A CodePen hengerén egy PNG forog; a Velben a **betűknek átírhatónak kell maradniuk**. Ha a 3D formát illesztem a szöveghez, a szöveg alakja geometriát formálhat vagy kivághat. A célzóna és a művelet előnézete egyértelműsítse az irányt; a pontos gesztust UX-próba döntse el.

**Rendszerpróba:** készíts jégkockát; a közepén egy átírható szöveg alakja vágjon nagyobb üreget. A szöveg másolata kisebb/vékonyabb króm 3D betűként üljön az üregben, így rés marad körülötte. Ebbe a résbe kerülő fizikai láva az üreg falát határként érzékelje. Ez későbbi szerkeszthető Recept; a geometriai/fény változat és a valódi fizikai láva állapotát külön kell jelölni.

## 6. Mozgás, idővonal, hang és Eljátszás

**Egy jelenetóra:** időzített mozgás egyszer lefut és alapból tartja a végállapotot; közben és utána a folyamatos mozgás, generátor és fizika élhet. Reaktív mozgást hang, kézi jelzés, kontaktus vagy más esemény indíthat. A Loop csak a kijelölt tartomány ismétlését kapcsolja, nem egy külön „Live/Time mód”. Loop nélkül a lejátszófej a tartomány után is halad; az idővonal animációi ugyanúgy lejátszódnak. Exporthossz külön állítható. Ugrás/újrajátszás/export azonos pillanatban azonos állapotot adjon, a szimulációs közelítés látható jelzésével.

**Mozgás ráhúzása:** egy belépés, lebegés, remegés, szétesés vagy szavankénti reveal külön szerkeszthető Mozgás lehet; több Mozgás összeállása látható, ne írják észrevétlenül egymás helyzetét. A konkrét példában a felirat balról beúszik, remeg, darabokra hull és eltűnik. A blokk közepének húzása az egészet a kulcsaival együtt tolja. A jobb szél nyújtása alapból a rugalmas részt nyújtja: a belépés eredeti sebessége marad, a záró esemény későbbre kerül. Külön kapcsolóval a zárás lassítható. Több blokk/kulcs együttes mozgatása és skálázása legyen közvetlen, felesleges nestelés nélkül.

**Kézi ritmusjelzés:** lejátszás közben szavaknál/ütéseknél koppintok; a Jelzések sávon időpontok keletkeznek. Egy jelzéshez szót, réteget vagy Mozgást rendelhetek, és láthatom a kapcsolatot. A lenyomás pillanatában megjelenő szóhoz a belépés időzítését a rendszer automatikusan igazíthatja, később finomhangolhatóan. A jelzések zene nélkül is használhatók. Hangnál legyen hullámforma; ahol megbízható, külön kick/hi-hat/ritmus jelek ajánlhatók, de a kézi koppintás az alkotó biztos kontrollja. A jelenlegi J-jelzés időhorgony önmagában még **nem** ez a teljes hozzárendelési rendszer.

**Eljátszás/Felvétel:** E/egy látható gomb után mozgatom a réteget vagy módosítok rajta; a rendszer a gesztust időbélyegekkel veszi fel és szerkeszthető blokká teszi. Az első visszajátszás alapból simított/easingelt, de az impact, szándékos hirtelen fordulat és megállás maradjon; a nyers mozdulatot is őrizze. Simítás erőssége állítható/kikapcsolható, újrafelvehető. A ma megvalósult x/y réteghúzás a szélesebb, paraméterekre is kiterjedő cél első szelete.

**Szövegmozgás-referenciák:** 4. kép: sorok/szavak külön irányokba csúsznak egy szerkeszthető címlapon. 5. kép: a szöveg több eltolódott másolatként villog, térben rétegződik és elmosódik; kis szövegekhez két szövegváltozat ritmusra váltakozik. 7. kép: stilizált háttér, pozicionált szavak, irányokból érkező vagy egymás után kiíródó betűk. A Recept, Megjelenés és Mozgás szerepe külön látszódjon; ezek nem mind ugyanaz az előre renderelt animáció.

## 7. Szövegszerkesztés és réteg-UX

**Szöveg:** egy szövegdobozban maradok; ha közvetlenül arrébb húzom az egyik sort, a sor saját behúzása/sorköze/mérete állítódik, a többi sor nem szakad szét láthatatlan külön rétegekre. Pontos sor-, szó- és karakterstílus, vegyes méret/súly/szín/betűtípus, tördelés és vásznat kitöltő kompozíció kell. Szövegcsere után az animáció és layout lehetőleg megmarad, szükség esetén a Vel újratördelést ajánl. A M4 soronkénti méret, behúzás, előtte térköz, vastagság és dőlt alap; nem teljes gazdag szövegszerkesztő.

**Rétegválasztás:** egymást fedő tárgyaknál a kattintás alatt elérhető elemek gyors listája/előnézete segítsen; a kijelölt elem következő megfogáskor rögtön mozgatható marad, ne kelljen folyton lockolni a többit. Jobb kattintás a vásznon, rétegen, klipen és beállításon helyi műveleteket nyisson. Nyitott Csoportnál a gyereket, csukottnál a csoportot lehessen megfogni. Maszkra húzáskor célzóna és előnézet kell; a hosszan fölötte tartás önmagában ne változtasson csendben viselkedést.

**Tulajdonságok:** a rétegnél kompakt ikon+név Megjelenés/effekt sáv, sorrenddel, hozzáadással, tiltással és közvetlen átrendezéssel. A legfontosabb 3–5 vezérlő látszik, ritkábbak lenyithatók; ahol természetes, vászonfogantyú helyettesít csúszkát. Rövid tooltipek és kapcsolható részletes súgó: mi történik, mely rétegen/módon hat, minipélda. A korlátozott kompatibilitást világosan jelezze.

## 8. Részecske, fizika, folyadék

**Részecske három szerep:** önálló Részecske Forrás (szikra, por, eső stb. saját emitterrel), meglévő tárgyra húzott Részecske Megjelenés (például szerkeszthető szöveg szétesik/összeáll), és több elemből álló részecskés Recept. A Forrásnál vásznon állítható kibocsátási pont/útvonal/felület, irány, szóráskúp; fontos vezérlők Mennyiség, Méret, Élettartam, Irány, Szórás, Ritmus. Szél, örvény, célpont, anyag és ütközés mélyebb opció. A ráhúzott szöveg szétesésénél az átírás új részecskeeloszlást készít, az eredeti szöveg szerkeszthető marad. Egy közös motor megengedett, de a két belépési pont nem olvadhat össze.

**Fizika:** a 3D test részt vehet a közös térben; 2D elem csak Fizika viselkedéssel. Globális gravitáció alapból **ki**. Kompatibilis testek alapból ütköznek, páronként vagy csoportonként kizárhatók. Rögzített/Mozgó/animációval vezetett szerep; tömeg, rugalmasság, súrlódás, egyszerű ütköző alak. Pont/vonal/terület/térfogat Gravitáció-, Szél-, Vonzás/Taszítás- vagy Örvénymező önálló Forrásként vagy tárgyhoz kapcsolva. A mezők hatóköre látható. Időzített mozgás egy jelölt pontnál átadhatja a testet a fizikának, kezdősebességgel. Kirepült test képernyőszéli jelből vagy rétegsorból visszahúzható a kulcsok elvesztése nélkül. Kontaktus/közelség/nyomás/sebesség vezérelheti másik rendszer paraméterét; két Glow-os test érintkezési pontján az erősödés helyi és lecsengő legyen. A szél a Füstnek/Felhőnek/részecskéknek eltérő, saját válaszát váltja ki.

**Folyadék:** gyors, jól kontrollált Liquid Forrás (víz/láva látvány) külön a **valóban kiömlő**, edényre, akadályra és üregre reagáló fizikai folyadéktól. Ugyanettől külön a bármire ráhúzható liquid/liquid-glass Megjelenés. Fizikai módban kiömlési pont, kibocsátás, viszkozitás, felületi feszültség, falak, mezőhatás állítható; ha túl keskeny az üreg a felbontáshoz, a Vel mondja ki. 2D prototípus → korlátozott 2,5D → csak mért siker után 3D. Seek/export reprodukálhatóság nélkül ne legyen „kész” fizikai mód.

**Részletes műveletek és teljesítmény:** `vel/docs/vel-reszecske-fizika-folyadek-teljesitmeny.md` az elsődleges melléklet. A fenti példák mellett CPU/GPU költség, seed, rögzített időlépés, cache és megjelenített minőségfokozat az elfogadás része.

## 9. Receptek, karakterek, randomitás, kimenet

**Képreferenciák pontosan:** 1 = vörös fényes ívelt 3D jelenet; 2 = külön toon/festett 3D dioráma; 3 = glow/raszter tipográfia; 4 = editorial, egész vásznat kitöltő szöveg és csúszó sorok; 5 = rétegezett villogó, blur-os szöveg és váltakozó kis felirat; 6 = organikus/áttetsző render; 7 = moduláris háttér és több kártyás cím/motion; 8 = fém/üveg 3D elemek és rácsos poszt; 9 = levegős kép–szöveg poszt. A 3/4/5/7/8/9 képek poszt/reel/poszter Recept-kiindulók, nem bizonyítékok egyetlen shaderre. Minden referencia-receptből valódi szöveg/kép/canvas arány cserélhető verzió kell.

**Karakter:** az első szellem szerkeszthető Csoport/Közös alap, helyi Változatként beszúrva; arc, test, anyag, mozgás külön állítható. Lehet alapból animált, de a mozgás ki/be kapcsolható, cserélhető, retime-olható. A karakter lehet könyvtári Recept/gyűjtemény, nem lapos 3D shape vagy kész videó. A szellemes CodePen csak referenciaminta.

**Random:** hatókör kiválasztott paraméter/elem, Csoport/Recept vagy teljes jelenet. A felhasználó rögzítheti a szöveget, kompozíciót vagy színt; a többi értelmesen variálható. Józan alapmód és merész Kísérleti mód. Az animált random seedje rögzített, a változás sebessége/tartománya/simítása állítható; megállítható és pillanatképként menthető. Ugrás vagy export nem dobhat új, véletlen állapotot.

**Kimenet:** könnyű poszt/reel/lyric videó, 1:1/4:5/9:16 és később 4K vászon/videó. A 4K vászon nem jelenti, hogy az élő szerkesztőnek végig teljes 4K-ban kell rajzolnia. A 4K állókép, 10 s 4K/30 fps videó, majd réteg+fizika+hang export külön mérési kapu. Hang és kép közös órán, videó nem halmozhat korlátlan adatot a memóriában. A jelenlegi egyetlen 4K Gerincfelület-frame mérése nem igazolja a teljes 4K exportot. A konkrét kép/video/audio/font/3D import és exportformátum még nyitott specifikációs feladat; ne hallgassuk el.

## 10. Mit kell Claude-nak státuszként vezetnie

Minden fenti munkafolyamathoz külön jelölje: **tervezett / részben működik / demonstrálva / felhasználóval kipróbálva**. A „teszt zöld” csak az általa ellenőrzött viselkedést bizonyítja. Ne nevezzen késznek egész A–G termékszakaszt azért, mert az ahhoz rendelt M-szelet lezárult. A következő tesztkapunál a felhasználó legfeljebb 2–4 lépést kapjon és egy képet/videót, ha látvány a tét; a teljes HTML-t ne küldje minden apró változtatás után. A technikai megoldásban szabadon dönthet, a fenti alkotói műveleteket és referenciapróbákat viszont őrizze meg.

**Mostani rövid státusz (a 2026-10-17-i HANDOFF/PROGRESS alapján):** M1–M6 technikai szeletek lezárva; B több UX-célja részleges; C vörös Gerincfelület + Jelenetfény kész, univerzális Megjelenés-katalógus/minőségi audit hátra; M7 folyamatban; fizika, folyadék, teljes receptcsalád, teljes 4K videóexport hátra. A státusz a Claude munkája közben változhat, ezért mindig friss kód és `PROGRESS.md` alapján ellenőrizendő.

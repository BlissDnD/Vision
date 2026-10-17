# Vel — teljes alkotói funkcióátadás és mérföldkő-szerződés Claude-nak

2026-10-17. Ezt az egy fájlt a felhasználó új, **elsődleges funkció- és munkafolyamat-átadóként** adja át. A mai teljes egyeztetés, a fő terv, a részletes döntésvázlat, a részecske/fizika/folyadék/4K melléklet és a referenciajegyzék összevetése alapján készült. A kód aktuális állapotát ettől még a `vel/` projektben kell ellenőrizni. Ez **nem állítja, hogy a funkciók már elkészültek**. A `vel/HANDOFF.md` M-számai technikai szeletek; az ottani „kész” nem bizonyítja automatikusan az itt leírt alkotói munkafolyamatot. A Claude által jelenleg használt `vel/` munkamappát ez a dokumentum nem módosítja.

## Kötelező munkamenet — új felhasználói döntés

**Minden mérföldkő megkezdése előtt**, beleértve a jelenleg futó M7 további érdemi szeleteit is, írd le magyarul, konkrétan:

1. Mi készült el ténylegesen az előző mérföldkőből; mi csak technikai alap, mit próbáltál ki vizuálisan/felhasználóként, és mi maradt ki.
2. A következő mérföldkőben pontosan **mely funkciókat, vászonműveleteket, vezérlőket és kapcsolódásokat** valósítod meg. Használj konkrét példát: „Felhőre Lufi Megjelenést húzok, felfújtságot állítok, mozgást kikapcsolok”, ne csak azt, hogy „Források fejlesztése”.
3. Mit **nem** valósítasz meg ebben a mérföldkőben, hol lesz csupán prototípus, milyen függőség és teljesítménykockázat marad.
4. Hogyan ellenőrzöd: egy rövid, 2–4 lépéses felhasználói próba; szükséges automatikus vagy célgépes/vizuális mérés; a fő referenciaképpel való összevetés, ha látvány a cél.
5. Hogyan változik a hátralévő funkciólista: egyetlen követelmény se tűnjön el azért, mert az M-szám lezárult.

**Ezután várd meg a felhasználó kifejezett jóváhagyását, mielőtt a mérföldkő új funkcióin dolgozol.** A most folyamatban lévő M7 állapotát előbb rögzítsd, és a következő érdemi M7-szeletre is kérj jóváhagyást. A jóváhagyás nem jelent mikromenedzsmentet: utána önállóan dönthetsz a kód, könyvtár, renderer, adatmodell és belső algoritmus részleteiről, ha a vállalt felhasználói működés és minőségi próba megmarad. Ha megvalósítás közben a vállalt funkcióterjedelem vagy az alkotói viselkedés lényegesen módosulna, a változást ismertesd és kérj új jóváhagyást. A hibajavítást, helyi ellenőrzést és az előző szelet tiszta lezárását ne alakítsd ismételt engedélykéréssé.

**Először leltár, aztán folytatás:** nézd át a jelenlegi `vel/` kódot, `HANDOFF.md`-t és `PROGRESS.md`-t e fájl minden pontja ellen. Jelöld: kész és kipróbált / részben kész / csak terv / nem szerepel a jelenlegi M1–M10 bontásban. Ne tekintsd automatikusan teljesnek B-t, C-t vagy D-t a M3–M7 címek alapján. Az M-számokat megtarthatod, de a felhasználónak mindig mondd el az A–G tervhez való kapcsolatot és a ténylegesen elkészült alkotói munkafolyamatot.

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

**Mostani rövid státusz (a 2026-10-17-i HANDOFF/PROGRESS alapján):** M1–M6 technikai szeletek lezárva; B több UX-célja részleges; C vörös Gerincfelület + Jelenetfény kész, univerzális Megjelenés-katalógus/minőségi audit hátra; M7 első, ráhúzható részecske-Megjelenés szelete (`0.21.0-m7a`) elkészült, a további M7-részek hátra; fizika, folyadék, teljes receptcsalád, teljes 4K videóexport hátra. A státusz a Claude munkája közben változhat, ezért mindig friss kód és `PROGRESS.md` alapján ellenőrizendő.

## 11. Az előző rövid funkcióleírásból könnyen elvesző részletek

Ez a szakasz a fő tervhez és a beszélgetéshez képest **különösen fontos pontosítás**. Ezek nem véletlen technikai mellékmondatok: többjük éppen azt határozza meg, hogy a Vel miért lenne intuitív és kreatív. Amelyik jelenleg nem működik, maradjon nyitott funkció a fejlesztési leltárban.

### 11.1 Megjelenések: konkrét családok, célok, egymásra hatás

- A felhasználó **bármire szeretne Megjelenést ráhúzni**, amire annak értelmes hatása lehet. A „shader technikai megvalósítás, nem jó felhasználói kategória” megállapítás **nem** jelenti a ráhúzás vagy a sokféle shader elvetését. Éppen a meglévő shaderek bővítését és látványosabbá tételét kéri.
- A listában ne csak a króm/üveg szerepeljen: Hologram, plazmaportál, morfing, metaball/összeolvadás, metal/chrome, olajfestett megjelenés, Liquid Glass, Jég, Lufi, fényből álló/fényfoltot létrehozó Megjelenés és fizikai reakcióhoz köthető látható effektek is termékötletek. A morfing a formát módosíthatja, a metaball geometriát egyesít, a fizika viselkedés; a közös ráhúzás mögött megfelelő külön rendszerek dolgozzanak.
- A megvilágítható 3D anyagokra és a 2D utóeffektekre külön minőségi teszt kell. A **Glow érintkezésnél helyileg erősödjön**, ne csak az egész réteg fényereje ugorjon. A portál és Liquid Glass a mögöttes kép torzítását is képes legyen használni, ha ez az adott mód célja. A „fény shader” ráhúzása adhat önálló fényfoltot, amelynek fényhatása a 3D tárgyakon értelmesen viselkedik.
- A Gerincfelület jelenleg saját renderrel szép lehet, de a felhasználó a többi meglévő tárgyon/Forráson is **modern anyagminőséget** akar. Az anyagauditban tényleges tárgyon, változó környezetben, mozgásban vizsgáld: forma/normálok; roughness; dinamikus környezettükrözés; valódi jelenet mögötti törés; fényforma és padlóreflexió; HDR/tónus/gamma; átlátszó peremek/premultiplied alpha; bloom és túlcsillanás; finom anyagtextúra. A régi eredmény változatlanul hagyása kompatibilitás, nem minőségi feljavítás.
- A 1. kép vörös felületét nem pixelpontos lemásolásként kell kezelni. A cél egy **szerkeszthető összekötött látványlánc**: gerinc→felület→anyag→fény/környezet→padlóval való geometriai kapcsolat és reflexió→utómunka. A lánc részei egymásra reagálnak. A 6. kép organikus, áttetsző növényes/térbeli látványa külön magas minőségi kapu.

### 11.2 Közös útvonal, térbeliség, kapcsolat iránya

- Egy felület térbeliségét **nem pusztán egy vizuális shader** adja: lehet domborítás, 2,5D látvány vagy tényleges vastagság/üreg/ütköző test. A felhasználónak egyetlen könnyű Térbeliség-belépési pont kell, de a Vel jelezze a tényleges eredményt.
- A jégkockás példa precíz szabálya: **Szöveg → 3D test** esetén a szöveg a test felületén/belsejében fut, lényegében élő felületi tartalomként. **3D test → Szöveg** vagy explicit Forma-művelet esetén a 3D alak a szöveg formáját veszi fel, illetve a szöveg kivághatja. A vászon célzónái vagy előnézete tegyék egyértelművé ezt az irányt. A szöveg lehet kívül, belül, középen, eltérő thickness-szel és ismétléssel.
- A kör/henger hosszában futó betűk, egy változó vastagságú útvonal menti felület és a gerinc mind a **közös szerkeszthető útvonalrendszer** próbái. A jelenlegi 3D Gerincfelület önmagában nem igazolja, hogy ugyanaz az útvonal használható 2D vektorhoz, maszkoláshoz, szövegúthoz, mozgáspályához és 3D felülethez.
- Ne automatikusan alkalmazz minden közel lévő tárgy között geometriát módosító smooth-uniont. A padlóhoz közelítés ajánlhat kapcsolatot; a felhasználó lássa, elfogadja és szabályozza. A térbeli összeolvadás és tükröződés külön marad.

### 11.3 Közvetlen szöveg és motion — a pontos gesztusok

- A szöveg legyen **egyetlen szerkeszthető objektum**, bekezdéssel, kézi/automatikus sortöréssel, sor/szó/karakter méret, súly, betűköz, sorköz, igazítás, alapvonal, szín és Megjelenés szintű formázással. A 4. képhez rugalmas szövegdoboz, kitöltési cél és biztonsági margó segítheti a szándékosan sűrű tördelést.
- Egy sor lejjebb húzása **csak a sort helyezi arrébb** a közös szövegobjektumon belül. A belső adatmodell lehet más; nem kell a sort külön látható layerre bontani. A függőleges húzás helyi sorközt/pozíciót, a vízszintes behúzást/eltolást állít; a blokk kerete az egész dobozt mozgatja. Mutass távolságot és új határt, a helyi eltérés legyen visszaállítható. Ha a felhasználó egy sort tényleg teljesen szabadon akar pozicionálni, erre legyen kifejezett mód.
- A 4. kép „Sorok csúszása” Mozgásának ugyanazon kártyán **Egyszer / Ismétlés / Folyamatos** időmódjai lehetnek. Folyamatos mód varratmentes, a kezdő/finalis hely és a kilógás követhető; vásznon forgatható nyíl és egyszerű stagger segíti az eltérő irányú sorokat. Nem kell három azonos könyvtári preset eltérő néven.
- Az 5. kép sokszorosított, eltolódott, blur-os, villogó tipográfiája lehet **kompakt Mozgáskészlet**, amelynek másolatai a forrásszöveget követik. Szó/sor/teljes szöveg célzás, másolatok mélysége, eltolás, blur, glow, ritmikus/véletlen/eseményre induló villogás külön állítható. Egyetlen glow slider nem teljesíti ezt.
- A kis feliratokhoz **Váltakozó szöveg**: egy objektum több szerkeszthető szöveghelye; a vásznon írható változatok; váltás csere/csúszás/áttűnés/villanás/karakterenkénti átírás; ismétlés és indító esemény. Hosszabb változatnál állandó keret vagy animált újratördelés, ne véletlen levágás.
- A Jelzés egy időpont/később opcionális időtartam, amelyhez **több réteg vagy Mozgás reakciója rendelhető**. Egy jelzés arrébb húzásakor mindegyik hozzárendelt reakció együtt követi. A kézi koppintás nyers ideje megmarad, késéskorrekció/ütemhez igazítás nem romboló és állítható. Ha a szó elhangzásakor koppintok, a szó **akkor már olvasható**; a Mozgás kártyáján látszódjon, melyik fázispont (megjelenés, csúcspont stb.) igazodik a jelzéshez. Ez több, mint a ma működő időhorgony.
- Automatikus hanganalízis (ütés, ritmus, hangerő, frekvenciasávok) felajánlott jelzésforrás lehet, **nem feltétele a vokál vagy dalszöveg automatikus felismerése**. A kézi és automatikus jelzés eredete külön látszik. Hang nélkül ugyanaz a kézi jelzés használható narrációhoz, néma videóhoz vagy más eseményhez.
- Az Eljátszás simítása ne csak pozíció-adatok átlagolása legyen: pálya-alak, sebességzaj, megállás és impact külön kezelés; nyers verzió és korrigált verzió összevethető. Rajzolt útvonal előadás nélkül is létrehozható. A kézi felvétel idővel paraméterváltozásra is terjedjen ki, ne álljon meg x/y-nál.

### 11.4 Kamera, kezelés, fizikai részletek

- A kamera **alkotói kapcsolatot** is tudjon: egy tárgyat célba venni, követni vagy útvonal mentén mozogni; a fókuszpont és pálya közvetlenül fogható, az idővonalon könnyen retime-olható. A megadott `codepen.io/ycw/pen/wvPeWWR` inspiráció, de a konkrét programbeli gesztust prototípus dönti el. A Gerincfelület saját orbit kamerája nem azonos az egész jelenet könnyű kameramozgás-rendszerével.
- Az egymásra halmozott rétegek kiválasztása, rövid kijelölési „memória”, utána azonnali mozgatás és az intelligens kinyitott/csukott csoportkezelés külön UX-próba. A jobb kattintás ne csak a vásznon működjön. Az effektlánc kompakt ikonbar, tooltip-részletes mód, maszk célzóna, kevesebb panel és slider szintén konkrét UI-igény; a jelenlegi nyilas effekt-sorrend csak részmegoldás.
- Részecskéknél kép alapú kibocsátás és formafelület, különböző részecskegeometriák, rajzolt szóródási irány, követés/vonzás/összeállás, hanggal vezérelt kibocsátás/erő/szín is kell. Részecskék egymás közti ütközése külön drágább kapcsoló; ne legyen alapértelmezett. Részecskék és 3D tárgyak közös szél/mező/ütközés-jelenete külön minőségi teszt (őszi levelek referencia).
- Fizikánál a „szabadon mozgó” test **nem azt jelenti**, hogy gravitáció hat rá. A globális gravitáció kikapcsolt marad alapból; helyi mező, lökés, ütközés működhet. Ha a test kirepül, a rétegből és képernyőszéli jelzésből visszahozható; a visszahozás új szerkesztett esemény, nem törli a kulcsokat. Rögzített test is lehet akadály. A csoporttal mozgó mező hatását ne korlátozd észrevétlenül csak a csoport tagjaira.
- A valódi Liquid nem csak „hullámzó shader”: edényből kifolyik, az akadályokat megkerüli, üreg falát érzékeli, a jelenet idővonalán visszatekerhető és exportálható. A gyors látványforrás és a Liquid Glass Megjelenés továbbra is külön hasznos eszközök.

### 11.5 Referenciák és teljesítmény a valódi elfogadáshoz

- A képek számozása a felhasználó első üzenetének sorrendje. **1 és 6** render-minőség; **2** toon dioráma; **3/4/5/7/8/9** grafika/layout/tipográfia/motion külön minták. Ne sorold át őket egyetlen „shader” vagy „3D” cél alá. A `vel/images/01–09.png` képeit nézd meg; a konkrét képrészleteket ne csak szövegből képzeld el.
- A felhasználó küldött külső példákat: dinamikus cubemap (változó tükrözés), szerkeszthető üveg/3D, tűz a szélben, mozgó virág, szellem-karakter, egérpályás csövek, levelek 3D/particle/fizika, rövid ritmusos motion, hengerpaláston ismételt grafika, kameramozgás, morphing, vízcsepp, Liquid Glass, metaball-layout, fekete lyuk forráskód, összetett interaktív oldal és mozgalmas layout. Az egyes URL-ek, ellenőrzési korlátok és a Velbeli próbák: `vel/docs/vel-uj-webgl-referenciak-2026-10-17.md`. Inspirációként kezeld őket, ne automatikusan másolandó kódként vagy jogilag szabad assetként.
- A teljesítménykövetelmény nem „legyen gyors” címke: valódi célgépen előnézeti válaszidő és GPU/CPU/memória; 4K dokumentum mellett olcsóbb interaktív nézet; előnézet és export külön minőségprofil, de azonos kompozíció/idő; változott részek újraszámítása; cache- és render-target élettartam; állapottartó részecske/fizika/liquid rögzített lépés/seed/checkpoint; videókódoló és folyamatos fájlírás; felbontás/codec/GPU-limit ellenőrzése; hang-szinkron. A 4K/60 későbbi kapu. A jelenlegi 4K állókép-idő nem elegendő bizonyíték 4K videoszerkesztésre és exportra.

## 12. Külön hiánylista az eddigi M1–M10 átadó ellenőrzéséhez

Claude, mielőtt a következő mérföldkövet javaslod, jelöld minden alábbi sorban a tényleges kódbeli és felhasználói állapotot. Ha egy funkció egy másik M-számba kerül, nevezd meg ott, elfogadási próbával. **Ne húzd át pusztán azért, mert egy hasonló technikai alap már létezik.**

| Funkció / rés | Miért nem fedhető le egy általános M-címmel |
|---|---|
| Bal oldali könyvtár a rétegek fölött, húzható elválasztó | A jelenlegi kereshető könyvtár helye a felhasználó szerint nem megfelelő. |
| Teljes Megjelenés-/régi effekt-audit és ráhúzható anyagok több 3D célon | M6 Gerincfelület saját anyaga és globális, kompatibilis Jelenetfény nem általános anyagkészlet. |
| 1. kép teljes forma–anyag–fény–padló kapcsolat, 6. kép külön minőségi kapu | Egy szép 3D réteg és csillanás-húzás csak részpróba. |
| Több fény/fényforma, helyes jelenet-tükrözés/törés és padlótükör más objektumokon | A HANDOFF ezeket maga is nyitottként jelöli. |
| Kapcsolatok három állapota, javaslat-előnézet, panel/térkép, prioritás | M2 alapadat és UI nem azonos a teljes jelenetszintű összekapcsolással. |
| Szerkeszthető útvonal mint közös 2D/3D/text/motion alap, forma-boole és üreg | M6 egy gerincfelülete nem közös formaszerkesztő. |
| Élő szöveg test külső/belső felületén és fordított 3D szöveg-geometria | A hengeres PNG-minta nem szerkeszthető szöveg; az üreg külön geometria. |
| Gazdag tipográfia, 4./5./7. kép külön mozgásai és Váltakozó szöveg | M4 sorstílus/fogantyú nem teljes tipográfiai/motion rendszer. |
| Jelzés→szó/Mozgás/réteg tényleges hozzárendelés, hangjelzések | M5 J-horgony jelenleg szűkebb. |
| Paraméter-Eljátszás, nyers/korrigált gesztus és impact-megőrzés | M5 x/y rögzítés első részfeladat. |
| Kamera-célzás, tárgykövetés, pálya és könnyű retime | Egyetlen réteg 3D orbit kamerája nem teljes kameramozgás-UX. |
| Csoporthatár/forgáspont, rövid kijelölési memória, jobb kattintás minden fontos felületen | Kódteszt nélkül ne olvadjon össze a M2/M3 „UX kész” állítással. |
| Konkrét Források minőségi hangolása és semantikája; karakter/szellem | M7 címke túl széles; családonként és próbánként kell státusz. |
| Részecske Forrás saját emitterrel vs ráhúzott Megjelenés; szél/3D/ütközés | A friss M7a részecske-Megjelenés nem általános Részecske Forrás és nem fizikai részecske-rendszer. |
| Fizikai tér, erőmezők, kontaktus→helyi Glow, valódi Liquid | E/F jövőbeli, de részletes alkotói működéshez kötött. |
| Receptcsalád képarány- és szövegcsere-próbákkal, animált Random | Egy „Szerkesztői címlap” és néhány könyvtári elem nem teljes G. |
| Teljes 4K vászon és hangsávos videóexport nagy jelenettel | Egy frame sebessége nem hosszú export vagy memória-biztonság. |
| Import, hordozhatóság, pontos média- és exportformátumok | A fő terv maga is nyitott specifikációs hiányként tartja számon. |

## 13. Jó mérföldkő-javaslat formája

Használd ezt az **egyetlen rövid, konkrét mintát** minden mérföldkő előtt, majd várd meg a jóváhagyást:

> **Mérföldkő és cél:** M7 következő szelete / D — például Felhő + Lufi.
>
> **A felhasználó ezt tudja majd:** behúz egy Felhőt; ráhúzza a Lufi Megjelenést; a vásznon felfújja, a mozgást kikapcsolja; a jelenetfényre reagáló 3D/2,5D tárgyként szerkeszti.
>
> **Pontosan megépítem:** a Felhő minőségi alapját és fő vezérlőit, a Lufi Megjelenés célkompatibilitását, a mozgáskapcsolót, a fényreakciót, az Undo/mentés/export viselkedést.
>
> **Ebben még nem:** teljes volumetrikus felhőszimuláció, szélfizika és minden Forrás automatikus 3D-sítése; ezek a D/E későbbi sorain maradnak.
>
> **Próba:** 2–4 felhasználói lépés, egy előtte/utána kép, célgépes frame-idő, mentés/újranyitás és exportegyezés.
>
> **Hátralévő lista:** felsorolom, mely D-funkciók maradnak nyitva. **Jóváhagyod ezt a konkrét mérföldkövet?**

Ne kérj jóváhagyást egy puszta „M7-et folytatom” mondatra. Ha a felhasználó jóváhagyta a konkrét szeletet, azon belül ne kérdezz újra a rutin fejlesztői döntéseknél. A megvalósítás végén csak a kipróbálható eredményt, a korlátot és a következő mérföldkő **előzetes**, még nem elkezdett javaslatát add át.

## 14. A felhasználó által hozzáadott külső források — teljes linklista

Ezeket **ő választotta ki** mint vizuális, mozgás-, render- és interakciós példákat. A linkek itt vannak, hogy a fájl önmagában átadható legyen. A források nem automatikusan átemelhető kódok, assetek vagy bizonyítékok az eredeti megvalósítás módjára. Nézd meg az adott oldalt és, ahol hozzáférhető, a forráskódját; írd le, pontosan melyik tulajdonságot veszed át mint alkotói cél. Kód/asset tényleges átvétele előtt licenc- és függőségvizsgálat kell. Ha valamelyik oldal nem tölthető be, ezt jelezd, és a felhasználó leírását ne állítsd saját vizuális ellenőrzésnek. Részletes korábbi jegyzet: `vel/docs/vel-uj-webgl-referenciak-2026-10-17.md`.

| Felhasználói forrás | Miért került ide; a Velben milyen próba következik belőle |
|---|---|
| [Dynamic cubemap](https://webglsamples.org/dynamic-cubemap/dynamic-cubemap.html) | A más tárgyakat és a változó jelenetet is követő tükröződés lehetősége. Chrome/lakk/üveg tárgy elé új objektum kerül: a tükröződés reagáljon, mért költséggel. Nem elég a statikus HDRI. |
| [Mascot 3D / Glass Designer](https://codepen.io/sabosugi/pen/YPWPoRJ) | A felhasználónak tetsző üveges/fényes 3D anyag és render. Szerkeszthető vastagság, lekerekítés, törés, bevonat és fény; összevetés Vel Üveg/Lakk/Térbeliség eszközeivel. |
| [Flame in the wind](https://codepen.io/osublake/pen/pqNXoq) | A szélre reagáló tűz/füst mozgás mintája. A Szélmező ne csak pixelt toljon, hanem a kibocsátás irányára és alakjára hasson. |
| [Ksenia: laptop template](https://codepen.io/ksenia-k/pen/gOEgyaj) | Kedvelt 3D textúra-/renderminőség. Anyag, kamera, fény és kép 3D tárgyon; konkrét látványrészletet a megnyitott példából kell kiválasztani. |
| [Ksenia: WebGL flowers](https://codepen.io/ksenia-k/pen/poOMpzx) | Virág/ornament Forrás és rajzolásból vagy útvonalból kialakuló motívum; növekedő mozgás és ráhúzható Megjelenés. |
| [Spooky Spectral Ghost](https://codepen.io/filipz/pen/GgpMOEq) | Első Karakter-példa: szerkeszthető Csoport/Közös alap/Változat, szellemes áttetsző Megjelenés és ki/be kapcsolható animáció. Nem lezárt 3D shape vagy videó. |
| [Tubes Cursor](https://codepen.io/soju22/pen/qEbdVjK) | Rajzolt/egérrel előadott útvonalból látványos 3D cső/szalag. Közös útvonal, taper, anyag, interaktív gesztus és Eljátszás próbája. |
| [Falling autumn leaves](https://codepen.io/ceramicSoda/pen/xxQJqVv) | Részecske és 3D tárgy közös jelenete, mélység és szél/fizika. Sok egyedi levél példányosítása; néhány kijelölt akadállyal ütközés, nem minden levélen teljes merevtest. |
| [Loader concept](https://codepen.io/robin-dela/pen/qxzzzd) | Rövid, erős motion ritmus és átmenet. Mozgásblokk fázisai könnyen tologathatók és retime-olhatók, impact megmarad. |
| [Hengeren futó grafika](https://codepen.io/loficodes/pen/ZEayGVg) | A felhasználó külön elküldte a JavaScriptet: Three.js `CylinderGeometry`, ismételt PNG textúra (`repeat.set(1,7)`), 90° UV-forgatás, vízszintesen forgó henger. **A demó nem élő szöveg.** A Vel célja ugyanilyen látvány szerkeszthető betűkkel a henger hosszanti/kerületi irányában, ismétléssel, külső/belső felületen, külön tárgyforgással és szövegmozgással. |
| [Kamera-mozgás](https://codepen.io/ycw/pen/wvPeWWR) | Könnyen összeállítható kameramozgás. Tárgyhoz kötött fókusz, követés és útvonal, látható kamera-Kapcsolat és retime-olható Mozgás. A pontos oldalmechanikát vizsgálni kell. |
| [WebGL Morphing Ball](https://codepen.io/daniel-hult/pen/QWqvxvp) | Tetsző organikus/morphing mozgás; vizsgálat döntse el, mely része geometriai deformáció, anyag vagy részecske, és így hová kerül a Velben. |
| [FreeFrontend WebGL gyűjtemény](https://freefrontend.com/webgl/) | A felhasználó ott látott csepp/víz animációra utalt. A konkrét példát azonosítani kell; addig általános Liquid Forrás/Megjelenés mozgásreferencia. |
| [Liquid Glass](https://codepen.io/shingidad/pen/jEPxMgW) | Ráhúzható folyékony üveg Megjelenés, amely a mögöttes képet ténylegesen torzítja. Külön a fizikai folyadék Forrástól. |
| [Metaballs Hero](https://codepen.io/filipz/pen/ogjXgBP) | Összeolvadó fényes formák és kész hero-layout. Geometriai összeolvadás + anyag + szerkeszthető layout Recept; a demó beállítópanelje csak bemutatás. |
| [Active Theory](https://activetheory.net/) | Nagyobb, összetett interaktív WebGL élmény minőségi távlatként. Nem egyetlen eszköz vagy preset; konkrét megfigyelést külön azonosítani kell. |
| [Singularity black hole — forráskód](https://github.com/MisterPrada/singularity) | Fekete lyuk Forrás: lencsézés, akkréciós korong, fény és mögöttes csillagtér-torzítás. Itt tényleges repo is van; licenc, függőségek, WebGL/WebGPU út és újrahasználhatóság ellenőrizendő. |
| [Lando Norris oldal](https://landonorris.com/) | Szerkesztett képi ritmus, tipográfia, layout és kamera/scroll mozgás inspirációja poszt/reel és motion Receptekhez. Konkrét jeleneteket vizuálisan kell kiválasztani. |

**Ezeknek következménye legyen a leltárban:** a fenti linkek ne tűnjenek el puszta „inspirációk” gyűjtőcím alatt. Mindegyikhez jelöld, hogy milyen alkotói műveletet vagy minőségi próbát indokol; a megvalósítás idejét a mérföldkő-javaslatokban és a felhasználói jóváhagyásnál rögzítsd. A külső példák nem köteleznek azonos könyvtárra vagy technikára, de a felhasználó által kiemelt látványt és használhatóságot érdemben vizsgálni kell.

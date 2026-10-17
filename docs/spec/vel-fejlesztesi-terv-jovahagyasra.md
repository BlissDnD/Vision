# Vel – fejlesztési terv jóváhagyásra

**2026. október 17.** Ez a már egyeztetett döntések összefoglalása és néhány új javaslat, **még nem végleges, teljesen kidolgozott fejlesztési specifikáció**. A [kutatási és egyeztetési vázlat](vel-fejlesztesi-vazlat.md) döntéseire épül. A terv célja, hogy a Velben néhány mozdulattal erős vizuális alap szülessen, miközben minden rész szerkeszthető marad. A hiányokat a dokumentum végén külön audit sorolja fel; a korábban rögzített döntéseket nem kell újra jóváhagyni.

## 0. Közös termékszabályok

1. **Az alkotói szándék szerinti eszköznevek.** A felhasználó Felhőt, Füstöt, Chrome Megjelenést, Üreg kivágását vagy Mozgást választ; nem kell tudnia, melyik shader, geometria vagy szimuláció. A ráhúzás közös gesztus, a háttérben eltérő rendszerek dolgozhatnak.
2. **Jó első eredmény, mély szerkeszthetőség.** Minden új Forrás, Megjelenés és Mozgás egyből jól néz ki, három–öt fontos vezérlőt mutat, a részletek lenyithatók. A finomhangolás nem feltétele a használhatóságnak.
3. **A közvetlen vászonművelet elsőbbséget élvez.** Fényfoltot a tárgyon húzunk, sort a szövegben helyezünk arrébb, időt a klip szélén nyújtunk. A pontos számok a panelben vannak.
4. **Semmi rejtett frissülés.** Csoport, Közös alap/Változat és jelenetbeli Kapcsolat három külön fogalom. A változaton végzett módosítás helyi; más változatoknak kifejezett „Átadás” művelettel küldhető. A Kapcsolatok külön láthatók.
5. **Egy közös idő.** Az időzített mozgás lefut, majd a végállapotában marad; a generátorok és folyamatos mozgások tovább élnek. Loop csak ismétlés. Az Eljátszás/Felvétel a kézi mozdulatot szerkeszthető idővonalmunkává alakítja. Ugrás és export ugyanazt a jelenetet számolja ki.
6. **Minőség és teljesítmény látható kompromisszum.** Az előnézet csökkentheti a részletet, az export jobb lehet, de az alkotó lássa, miért tér el. A WebGL2-es böngészős futást mérés nélkül nem kell elvetni; a szükséges tartalék renderút csak próba után dönthető el.

## 1. Megjelenések és renderminőség

### Felhasználói cél

Egy egyszerű formából vagy szövegből is lehessen fényes, modern, hiteles anyagú kompozíciót építeni. A minőségi referencia először az **1. kép** vörös, tükröződő, ívelt világa; utána a **6. kép** organikus, áttetsző, részletes világa. A **2. kép** toon/festett stílusa külön művészeti ág, nem bizonyíték arra, hogy az 1. vagy 6. kép ugyanazzal a módszerrel készül.

### Javasolt működés

- A **Megjelenések** ráhúzható láncba kerülnek, látható sorrenddel, ki/bekapcsolással és rövid előnézettel. A kártya mutatja, hogy az adott célon anyagként, képi effektként vagy térhatásként fog működni. Összetett Megjelenés, például Hologram vagy Jég, egy fő kártya lehet, lenyitható belső részekkel.
- A 3D anyagok első gondosan megépített készlete: **csiszolt fém/króm, lakkozott szín, üveg/jég, hologram, gyöngyház, plazma/emisszió**, majd viasz/kerámia/olajfestett stílus. A képi effektek (Glow, blur, színeltolás, raszter stb.) külön maradnak. A „metaball” összeolvadás geometriai művelet, az ütközés fizika; mindkettő ugyanúgy ráhúzható, de nem anyagként jelenik meg.
- A **globális jelenetfény** alapból a 3D objektumokra hat, globálisan és objektumonként kikapcsolható. Egy anyag saját emissziója külön állítható. A kiválasztott tárgy csillanását közvetlenül a vásznon húzva a Vel a releváns világítást módosítja. Több fény esetén az aktív fény egyértelműen jelölt; „lágyabb”, „nagyobb csillanás”, „melegebb” közvetlen vezérlők előzik a technikai fényparamétereket.
- A jelenlegi `obj3d` anyagshader, procedurális környezet, bloom, tónuskezelés és áttetsző kompozit **auditja** az első munka. Külön vizsgálni kell a csúcsfények kiégését, a sötét tónusok részletét, a gamma/színtér következetességét, a premultiplied alpha és glow szélkezelését, a felületi normálok stabilitását, a roughness-választ, az árnyékot és az üveg/jég mögötti tartalom viselkedését. A jelenlegi üveg anyag környezetmintája nem helyettesíti a jelenet tárgyainak általános, pontos törését; ezt minőségi szintenként kell megtervezni.
- Az 1. képhez **kontrollált stúdiófény-profilt** és néhány nagy felületű, szerkeszthető fényformát javaslok. A forma részletességét, anyagot és fényt együtt kell értékelni, nem csak a shader önálló gömb-előnézetét. A magas minőségű állókép és a valós idejű mozgás lehet eltérő költségű, de ugyanazt a kompozíciót kell adnia.

### Ellenőrzés és határ

Két kötelező referenciajelenet: vörös fényes/üveges ívelt kompozíció (1. kép), illetve organikus/áttetsző kompozíció (6. kép). Minden új anyagot forma-, szöveg- és jelenetfény-variációval vizsgálni kell. Az első kapun a cél nem fotórealizmus ígérete, hanem kontrollálhatóan magasabb minőség és a referenciához mért hiánylista. Ha a jelenlegi SDF-út nem bírja az elvárt formát/tükröződést, kis mesh/hibrid prototípus következik; a renderarchitektúrát ez a mérés dönti el. A 6. képhez hasonló komplex organikus forma és részlet külön, későbbi kapu.

Az 1. képből küldött új kivágás pontosítja az első prototípust: széles, vékony, ívelt, mélyvörös fényes felület; világos stúdiókörnyezet; nagy, hosszú csillanások; padlóreflexió; erős hátulról átütő fény; finom felületi szemcsézettség. **Ilyen minőségű állókép WebGL2-ben elvileg készíthető**, ha a megfelelő geometria, anyag, tükröződő környezet, világítás, HDR/tónuskezelés és mintavételezés együtt megvan. A kép eredeti rendertechnikája nem ismert, és a jelenlegi Vel `obj3d` shaderében a procedurális környezet nem ad teljes, más objektumokat is tükröző 3D jelenetet; a jelenlegi rendszerrel a kép pontos újraalkotását nem állítjuk. Az első prototípusban a formát, anyagot, fényt és padlóreflexiót külön változtatható részként kell megépíteni, majd statikus és mozgó változatban, célgépen mérni. A felhasználónak később az ív, a fénycsík és a felületi csillanás közvetlenül szerkeszthető legyen, ne csak kész háttérként kapja meg.

Felhasználói formajavaslat az 1. képhez: **rajzolt 3D gerincvonal** vezesse a felületet. A gerinc mentén a Vel széles, vékony felületet épít; pontonként/kulcsszakaszonként állítható szélesség, vastagság, keresztmetszeti domborulat, csavarás és taper. A gerinc szerkesztése élőben alakítja a formát, miközben a fények és anyagok követik. Ez fontosabb első szerkesztési modell, mint egy előre megformált, merev 3D objektum. A padlónál külön „Csatlakozás/Összeolvadás” vezérlő kell: lágy átmenet, lekerekített csatlakozás vagy tényleges térbeli smooth-union próba, állítható sugárral. A „metaball” itt egy lehetséges geometriai módszer, nem bizonyított magyarázat a képre: a látott összefolyás egy része lehet puszta geometria, tükröződés és világítás. Az első prototípus több csatlakozási móddal mutassa meg, melyik őrzi meg legjobban a vékony elegáns élt és a padlóhoz simuló átmenetet. A padlóreflexió ettől külön tulajdonság, nem helyettesíthető összeolvadással.

### Az 1. képhez szükséges összekötött látványlánc

Az „effektek összekapcsolása” ne tetszőleges képi szűrők egymásra halmozását jelentse. A Vel az egyes eszközök **kimenetét és bemenetét** köti össze a megfelelő renderlépcsőben, a felhasználónak mégis közvetlen ráhúzásként látszik:

1. **Gerinc/forma → valódi felület.** A rajzolt ívből szélességprofillal, vastagsággal és taperrel felület készül. A felületnek helyes térbeli normálja, éle és anyagkoordinátája van; ezek nélkül a fényes anyag csak lapos színátmenetnek tűnik.
2. **Felület + Padló → térbeli csatlakozás.** A „Padlóba simulás” kapcsolat geometriát módosít, ha tényleges összeolvadás kell. A padló tükröződése ettől függetlenül, láthatóan kapcsolható. A rendszer felajánlja a kapcsolatot, amikor a felület eléri a padlót; nem aktivál rejtett CSG-t minden közeli tárgyra.
3. **Felület → Vörös lakkozott/fémes Megjelenés.** Az anyag a forma normálját, éleit és fényviszonyait használja. Fő vezérlők: vörös tónus, fémesség/lakkréteg, érdesség, szemcse és élreflexió. A „vörös fényes” egy ráhúzható anyagbeállítás; más formán is használható, de önmagában nem adja az egész referenciaképet.
4. **Jelenetfények/környezet → anyag és padló.** A nagy, hosszúkás világos fényformák hozzák létre a szép fehér fénycsíkokat; a felhasználó a csillanást a felületen húzhatja. A padló ugyanazokat a fényeket és a vörös formát tükrözi. A háttér fehérsége és a nyíláson átütő fény külön szerkeszthető, közös expozícióval.
5. **Renderelt jelenet → finom képi utómunka.** HDR/tónuskezelés, szükség szerinti lágy bloom, élsimítás és visszafogott szemcsézettség csak a már koherens fény-anyag eredményt polírozza. A Glow nem helyettesítheti a valódi csillanást vagy padlóreflexiót.

Felhasználói műveletsor: **Útvonalforma behúzása/rajzolása → szélesség/taper húzása → vörös lakkozott Megjelenés ráhúzása → Padló hozzáadása → „Simuljon a padlóba” kapcsolat elfogadása/állítása → fénycsík megfogása és áthelyezése → finom Utómunka → kész jelenet Receptként mentése.** A Megjelenés újrahasználható; a teljes, több elemből álló látvány Recept. A Kapcsolatok panel külön sorban mutatja a felület–padló csatlakozást, fényhatást és tükröződést; az anyag a felület Megjelenésláncában látszik. A beállítások együtt reagálnak: gerinc húzásakor új normál/fénycsík/tükörkép számolódik, színváltáskor az anyag és a reflexió ugyanazt a színt mutatja, fény húzásakor a felület és a padló csillanása összhangban változik. Ha ez nem történik meg, a rendszer csak effektkollázs, nem összekapcsolt jelenet.

## 2. Források, formák és 2D↔3D átjárás

### Könyvtári szabály

**Forrás** egyetlen alkotói tárgy vagy jelenség, még ha belül több renderelt összetevőből áll is. **Recept** több önálló Forrásból, Megjelenésből, Mozgásból és layoutból álló kész jelenet. Ezért a Bolygó egy Forrás lehet felszínnel, felhővel, légkörrel és gyűrűvel; az Ég+Nap+Felhő+Eső már recept. A Csillagtér csak csillagokat generál; a Világűr háttér külön Forrás.

### Forráscsaládok és szándék szerinti vezérlők

| Család | Azonnali jó alap | Fő alkotói vezérlők |
|---|---|---|
| Bolygó | Egy világos nappal/éjjel oldallal, légkörrel szerkeszthető égitest | felszín, fényirány, felhő, légkör, gyűrű, részlet |
| Ég, Nap, Eső | Külön Források, egymásnak felajánlott kapcsolatokkal | napszak, fény, fedettség, csapadék, kölcsönhatás |
| Felhő és Füst | Közös technikai mag lehetséges, két önálló alkotói eszköz | felhőnél alak/puha fény; füstnél kibocsátás/örvény/sűrűség/szél |
| Virág/ornament | 2D/2,5D dísz vagy virágfej; valódi 3D virág később | szirmok, szimmetria, ismétlés, növekedés, térhatás |
| Kristály | Egy test vagy növekedő kristálycsoport | élek, csiszolás, csoport, áttetszőség, növekedés |
| Útvonalforma | Rajzolt pályán szalag, cső, gömblánc vagy összeolvadó forma | útvonal, profil, vastagság, csavarás, sűrűség |
| Portál/energiamag | Önálló látványelem; hozzá hasonló ráhúzható Megjelenés is | perem, belső tér, torzítás, átjáró, pulzus |
| Csillagtér, világűr, táj | Külön tartalmak és összekapcsolható világépítő elemek | sűrűség/mélység, atmoszféra, domborzat, horizont |
| Liquid | Önálló folyadék-/lávaforrás, később fizikai működéssel | kibocsátás, mennyiség, viszkozitás, határ, anyag |

Az első forrásminőségi feladat nem mindegyikből sok variáns gyártása: **Bolygó, Felhő, Füst, Virág** szűk, gondosan hangolt alapjai és az 1. blokk renderminőségével való összehangolása. A Füst szélre reagálása és a fizikai Liquid külön 3. blokkos fejlesztés, nem puszta mozgó textúra. A Források belső összetevői alapból nem terhelik a rétegsort; szükség esetén lenyithatók.

### 2D és 3D átjárás

A 2D forma és a szöveg kapjon **Térbeliség** tulajdonságot: mélység, élkerekítés, fényreakció és anyag, visszavehető módon. A sima 2D, fényből domborított 2,5D és tényleges, ütköző 3D test között a felület világosan különbséget tesz. A szöveg 3D tárgy külső/belső felületén, útvonalán vagy belső síkján futhat, külön vastagsággal. A térbeli szöveg kivághat üreget egy testből. Ez a jelenlegi 2D és 3D renderágak közös geometriai/anyag modelljét igényli; nem ígérhető meg egyszerű effektként.

### Formaszerkesztő alapja és első eszközei

Ehhez egy **közös, szerkeszthető kontúr/útvonal** kell, amelyből 2D forma, maszk, mozgáspálya, szövegút és 3D felületgerinc is készülhet. A ceruzával rajzolt vonalat a Vel alapból simítja, de az eredeti mozdulat megmarad; a pontok, fogantyúk, éles és lágy szakaszok közvetlenül húzhatók. Pont hozzáadása/törlése, zárt/nyitott út, illesztés és gyors görbesimítás az első változat része. A betűkből készült kontúr maradjon összekötve a szerkeszthető szöveggel, ameddig lehet; a kontúrrá alakítás következménye legyen világos.

A 2D formaépítésben egyesítés, kivonás, metszet, lyuk/összetett kontúr, kontúreltolás, változó vonalvastagság és sarokkerekítés kell. Ezek **visszaszerkeszthető forma-műveletek** legyenek: a bemeneti alakzat nem tűnik el, a művelet sorrendje látható. Ugyanez a kivonás térben valódi üreget képezhet, míg a lágy összeolvadás külön térbeli művelet; egyik sem a ráhúzott anyagshader feladata.

A Térbeliség első kézmozdulata a vásznon kihúzható **vastagság**, majd élkerekítés. A további módok: **kihúzás** (felirat, plakátforma), **útvonal menti felület** (gerinc, változó szélesség, vastagság, taper, keresztmetszet és csavarás; az 1. kép), **forgatott profil** (váza, gyűrű) és később **felfújás/loft** az organikus formákhoz. Egyetlen síkbeli kontúr továbbra is szerkeszthető marad a térbeli eredmény mögött; az elöl/lapoldalt/élen külön anyag állítható. A geometria helyes normáljai és anyagkoordinátái a fény és a textúra minőségéhez szükségesek.

A 3D szerkesztésben síkban rajzolás és egy fogantyúval mélységadás az alap, kamera-forgatás/oldalnézet és helyi tengely csak igény szerint jelenjen meg. A forgáspontot külön lehessen elhelyezni; az illesztés működjön felülethez, élhez, középponthoz és más objektumhoz. Egy meglévő útvonal vagy 3D test átírható maradjon úgy, hogy a Megjelenés, Mozgás, Kapcsolat és fizikai alak követi. A Vel jelezze az önmetsző vagy túl vékony formát, amely rossz geometriát, kivágást vagy ütközést adna; Undo és stabil visszajátszás kötelező.

**Fejlesztési sorrend:** először közös útvonal + közvetlen pontszerkesztés + kihúzás/élkerekítés + útvonal menti felület, az 1. kép szerinti vörös formán tesztelve. Ezután összetett kontúr és térbeli kivonás a feliratos jégkockához, valamint szöveg/tárgy felületre illesztése. Organikus szobrászat, loft és háló csúcspontonkénti szerkesztése későbbi bővítés; az első alkotói eszközkészletet nem kell teljes 3D modellezővé alakítani.

### Ellenőrzés

Felhő → Lufi Megjelenés → mozgás kikapcsolása → megvilágítható, esetleg térbeli asset. Nap–Ég–Felhő–Eső kapcsolat külön be- és kikapcsolható. Szöveg gömbön és kockán belül szerkeszthető marad. Nagy rendszerpróba: **jégkocka kivágott szövegüreggel, króm felirattal és a résben áramló lávával**. Ez legyen később kész szerkeszthető recept is, de a teljes folyadékfizika előtti mérföldkőben csak geometriai/fény-prototípusként szerepelhet, pontosan megjelölve, mi hiányzik.

## 3. Fizika, erőterek és valódi folyadék

### Közös szabály

A 3D test és 3D Liquid alapból a közös fizikai tér lehetséges résztvevője; 2D elem csak akkor, ha Fizika viselkedést kap. A globális gravitáció **alapból kikapcsolt**, hogy a frissen betett tárgyak ne essenek ki. A lökés, ütközés és helyi erőtér ettől függetlenül működhet. A fizikai testek automatikusan reagálnak egymásra, de jelenet-, csoport- és elempáronként kizárhatók. A „Rögzített” test állhat akadályként.

### Eszközök és UX

- **Fizika** ráhúzva: első körben rögzített, mozgó vagy animációval vezetett merev test; tömeg, rugalmasság, súrlódás, ütköző alak és kölcsönhatási csoport. Puha test későbbi, mérést igénylő fokozat. A fontos értékek vizuális fogantyúkkal, nem csak számsliderrel állíthatók.
- **Gravitáció/erőmező** önálló Forrásként vagy tárgyhoz kapcsolt viselkedésként; pont, vonal/útvonal, terület vagy térfogat, látható hatókörrel és iránnyal. A mező a hatókörébe kerülő kompatibilis testekre automatikusan hat, felülírható kapcsolatként.
- **Szélmező** ugyanilyen közös jel a Füstnek, Felhőnek, részecskéknek és később hajlékony formáknak; minden résztvevő saját fizikai válaszát adja, nem egyforma pixeleltolást.
- **Élő fizika** kézzel meglökhető tárgyakkal. Időzített mozgás explicit átadási ponton adhatja át a test irányítását a fizikának. Kívülre került tárgy a rétegsorból és képernyőszéli jelzésről visszahozható a vászonra; a művelet nem törli a mozgáskulcsokat.
- **Kölcsönhatási jelek:** kontaktus, erő, sebesség, közelség, nyomás. Ezek más rendszert vezérelhetnek. Példa: két Glow-os tárgy érintkezésénél a fény helyben felerősödik, majd lecseng. A kapcsolat és a lecsengés a Kapcsolatok panelben érthető.

### Liquid két szinten

Az első szint egy **látványos, kontrollált folyadékforma** hullámmal/cseppel/áramlással; ez gyorsan használható Forrás, de nem nevezhető valós folyadékfizikának. A második szint **állapottartó folyadékszimuláció**: kibocsátás, edényből kiömlés, testekre ütközés, üreg falai, viszkozitás, visszatekerés. A láva és a víz ugyanazon alaptechnika eltérő anyag- és viszkozitásprofilja lehet. Egy 2D „liquid shader” továbbra is külön Megjelenésként használható. A szimuláció méretét, részletét és előnézeti költségét a Vel láthatóan kezeli, nem ígér korlátlan pontosságot.

### Ellenőrzés és kockázat

Két meglökött test ütközik globális gravitáció nélkül; a kontaktus Glow-t vezérel. Egy szélmező a Füst irányát és sebességét változtatja. Víztartályból folyadék ömlik akadály körül, a jégkocka üregébe tett láva a falakat határként érzékeli. Ugyanaz a pillanat visszatekerve és exportálva azonos eredményt ad: ehhez rögzített szimulációs lépés, seed, bemeneti események és állapotmentések kellenek. A teljes, valós idejű 3D folyadék teljesítménye **külön kutatási kapu**; ha célgépen nem elég jó, csökkentett részletű élő előnézet és pontosabb export, vagy korlátozott 2,5D/3D tartomány a becsületes első kiadás.

## 4. Részecskék

### A három külön dolog

1. **Részecske Forrás:** saját kibocsátóval létrehozott, szerkeszthető részecsketér, például por, szikra, eső, csillagszemcsék vagy festékfröccsenés. A csillagos ég Forrás ettől még saját célzott Forrás maradhat.
2. **Részecske Megjelenés:** meglévő szöveget, formát vagy képet részecskékre bont, szétszór és újra összeállít. Az eredeti tartalom szerkeszthető marad. A részecskeszám, méret, szétesés és visszarendeződés a ráhúzott eszközben állítható.
3. **Részecskés recept:** előre elkészített, több elemet kombináló jelenet, például hangra reagáló tipográfiai szétrobbanás. Ez a Receptek között van, nem a Részecskék könyvtárában.

### Egy közös alkotói felület

A Részecske Forrás vezérlői négy egyszerű kérdésből indulnak: **Honnan?** (pont, felület, útvonal, másik tárgy); **Milyen?** (alak, anyag, méret, szín, élettartam); **Merre?** (kezdeti irány, szél, örvény, gravitáció, célpont); **Mikor?** (folyamatos, impulzus, jelzésre, hangra). A néhány gyakori alkotói profil (szikra, finom por, izzó törmelék, ködös pontok) jó alapból indul, de ugyanazt a rendszert szerkeszti. Az effektek és a globális fény a kompatibilis részecskékre is ráhúzhatók. Ütközés és per-részecske fizika választható minőségi fokozat, mert költséges; az alap nem ígéri automatikusan minden részecske teljes 3D fizikáját.

Az idővonalon az emitter életideje, a kibocsátási impulzus és a szétbomlás/összeállás szakasza külön látszik. A jelenet kapcsolatjelzései (ütközés, hang, kézi koppintás) indíthatják őket. A seed rögzül, így az újrajátszás és export reprodukálható. A mai képmintákból rajzolt pont-részecske megmaradhat gyors előnézeti vagy grafikai módként, de nem nevezhető azonosnak a teljes kibocsátó–élettartam–erőtér rendszerrel.

### Első tartalom és teszt

Kezdő készlet: 3D szikra/por Forrás, 2D tipográfiai szétesés–újraösszeállás Megjelenés, hangra pulzáló pontmező, szélre reagáló részecskék. Próba: egy szerkeszthető felirat az ütésnél részecskékre esik szét, majd a következő jelzésnél új szövegként áll össze; a felirat későbbi átírása nem teszi tönkre a mozgást. A részecskék tömeges jelenlétében a Vel mutasson becsült költséget és váltható előnézeti részletet.

## 5. A teljes szerkesztő UX-e

### Munkatér és könyvtár

Bal oldalon kereshető könyvtár, alatta rétegek, köztük húzható elválasztó; jobb oldalon kijelölésfüggő beállítások, alul átméretezhető idővonal. A könyvtár nem technikai `shader` címkékből indul, hanem **Receptek, Források, 2D Formák, 3D Formák, Megjelenések, Mozgás, Részecskék** címszavakból. A **Karakterek** kereshető gyűjtemény a Receptek és Formák felől is elérhető, szerkeszthető Csoportokat kínál. A Fizika, Térbeliség, Forma-műveletek és Kapcsolatok ráhúzható vagy kontextusfüggő eszközként is felfedezhetők. Az elemek több címkével kereshetők, de a saját elsődleges helyük világos. A kártya rövid mozgó előnézetet, célkompatibilitást és 1–2 fő beállítást mutat.

### Rétegek, csoportok, kapcsolatok

Egymást takaró rétegek kijelölésekor a kattintási pont alatti találatok listája legyen gyorsan elérhető, apró előnézettel. A kiválasztott tárgy a következő húzásnál is aktív marad; nem kell másodpercenként újra kijelölni vagy a többi réteget zárolni. Összecsukott Csoport alapból egységként, kinyitott csoport a belső elemeken keresztül kezelhető. A csoport határa a tartalmához igazodik; forgáspontja önállóan húzható és nem ugrál animáció közben.

**Csoport / Közös alap / Változat / Kapcsolat** külön neveket és jeleket kap. A Változat közvetlen változtatása helyi; „Átadás más változatoknak” a vásznon kiemelve és előnézettel céloz. A Kapcsolat ezzel szemben két jelenetelem egymásra hatása. Csoporton belüli, kifelé és kívülről érkező Kapcsolatok ellenőrizhetők; összetett jelenetben opcionális, szűrhető kapcsolatnézet nyílik. Jobb egérgomb a vásznon, rétegen, klipen és beállításon helyi, értelmes műveleteket kínál. A maszkoláshoz ráhúzáskor célzóna és előnézet kell; puszta várakozás nem változtat csendben jelentést.

### Tulajdonságok és segítség

A kijelölt réteg alatt kompakt, ikon+név effekt-/megjelenéslánc mutatja a sorrendet, hozzáadás, kiiktatás és átrendezés művelettel. A sok csúszka helyett a fontos beállítások röviden, a ritkák lenyitva jelennek meg; szín, irány, térbeli mélység és intenzitás ahol lehet vászonfogantyút kap. Rövid tooltip minden fontos ikonon; kapcsolható részletes súgó magyarázattal, előnézettel és kis példával. A segítség ne takarja a munkát, és jelezze, ha a ráhúzott eszköz a célon csak korlátozottan működik.

### Idővonal, szöveg, felvétel

A tipográfia egy szerkeszthető szövegobjektum marad: soronként külön fogantyúval állítható a sorköz és behúzás, vegyes mérettel/stílussal, pontos szövegszerkesztéssel. A szöveg animálható soronként/szavanként/karakterenként úgy, hogy a tartalom átírható marad. A 4. kép a vásznat kitöltő tipográfiai tördelés, az 5. kép a sokszorozott/blur-os/villogó szöveg és Váltakozó szöveg, a 7. kép a moduláris háttér és pozicionált címsor példája.

Egy Mozgás szerkeszthető blokk, belül fázisokkal és kulcsokkal. A blokk közepének húzása mindent együtt eltol; jobb szélének húzása alapból a rugalmas középső részt hosszabbítja, a beúszás sebességét nem módosítja, a záró eseményt későbbre teszi. „Zárás lassítása” a záró fázist nyújtja; az egyes fázisok közvetlenül is szerkeszthetők. Több réteg/kulcs együtt jelölhető, mozgatható és nyújtható. A hangjelzéshez kötött pillanatok külön időhorgonyok, nem csúsznak el észrevétlenül. Az eljátszott gesztus alapból ízléses simítást és easinget kap, a nyers mozgás megmarad. A kézi **Ritmus felvétele** koppintásokból általános Jelzések sávot hoz létre: szavakhoz, rétegekhez és mozgásokhoz rendelhető, zene nélkül is használható.

### UX-próba

Új felhasználó tíz perc alatt állítson össze egy 9:16 tipográfiai reel-t: szerkeszthető sorokat rendezzen, ráhúzható mozgást módosítson, egy-egy ütemre koppintson, több réteget együtt lassítson, majd exportáljon. A próbán mérendő: téves célra húzások, visszavonások, segítségkérések, a „hol változott?” bizonytalanság és a szükségtelen panelváltások száma. A prototípus vizsgálja a csoport és gyerek kiválasztását, a Változat és Kapcsolat megkülönböztetését, valamint az eljátszott mozgás javítását.

## 6. Receptek, layoutok és intelligens randomizálás

### Receptek

Egy Recept kész, de elemeiben szerkeszthető kompozíció vagy kisebb összeállítás. Kezdő családok: **Scapes** (világűr, ég, táj), **Tipográfia**, **Motion grafika**, **Energia/organikus**, **Poszt/Reel/Poszter layout**. Keresztcímkék: téma, formátum, hangulat, feladat, statikus/időzített/folyamatos/hangreaktív. A Recept kártyáján azonnal látszik, mi cserélhető: szöveg, kép, paletta, ritmus, formátum. A csere ne rontsa el a layoutot; a rendszer újratördelést ajánl, ha a szöveg hossza vagy a képarány változik.

Első referencia-receptek: az 1. kép ihlette vörös fényes absztrakt jelenet; a 3. kép tipográfiai glow/raszter; a 4. kép vásznat kitöltő editorial szöveg és csúszó sorok; az 5. kép rétegzett/villogó szöveg; a 7. kép többkártyás címcsalád; a 8. kép 3D/fém/üveg rács; a 9. kép levegős kép–szöveg poszt. A 2. kép toon stílusú 3D tartalomhoz külön, megfelelő geometria/textúra kell; nem soroljuk egyszerű tipográfiai layoutnak. A jégkocka–króm–láva jelenet végső rendszerpróba és későbbi Recept.

**Karakterek:** a könyvtárban kereshető Karakterek gyűjtemény legyen. Egy karakter szerkeszthető Csoport/Közös alap, opcionális animációval és helyi Változatokkal; nem lapos shape és nem renderelt videó. A szellemes karakter az első minőségi példa. Az animáció cserélhető/kikapcsolható; a célzott frissítés a Változatok korábbi szabályait követi. Részletes minták és ellenőrzési státusz: [új WebGL és motion referenciák](vel-uj-webgl-referenciak-2026-10-17.md).

### Random alkotótársként

Három hatókör: **kijelölt paraméter/elem**, **kijelölt Csoport/Recept**, **teljes jelenet**. A Random először biztonságos, olvasható javaslatot ad; „Kísérleti” fokozatban vad kombinációkat is. A felhasználó részeket rögzíthet (például szöveg, kompozíció, szín), és csak a többit regenerálhatja. A rendszer kompatibilitást, rétegrendet, kontrasztot és túlterhelést ellenőriz, nem független értékeket dobál. A jelenlegi hangulat/tengely alapú generátor jó kiindulás, de a kész jelenet szemantikus összefüggését és layoutját nem biztosítja.

**Animált randomitás:** rögzített seedből időben változó zaj vagy eseménypontoknál új variáns. Az alak, anyag, mozgás és szín egymástól függetlenül vagy összekötve variálható. A változás sebessége, tartománya és simítása látható; megállítható és konkrét állapotként elmenthető. A véletlen nem változhat meg pusztán azért, mert a felhasználó előreteker vagy exportál. Receptből generált variáció teljesen szerkeszthető, nem kész videó.

### Ellenőrzés

Ugyanabból a 4. kép ihlette receptből három 9:16 változat: rövid/hosszú magyar szöveg, eltérő paletta, eltérő ritmus. A hierarchia mindháromban olvasható marad; a felhasználó rögzítheti a tördelést és csak a színt randomizálja. Ugyanazzal a seeddel ugyanaz a variáns jön vissza. „Kísérleti” módban szokatlan, akár kaotikus eredmény elfogadható, de az állapot visszavonható.

## 7. Megvalósítás, mérföldkövek és döntési kapuk

Nem célszerű az egész terméket egyszerre újraépíteni. A látható eredményt és a technikai kockázatot külön mérföldkövekben kell kezelni:

| Szakasz | Mit kell elkészíteni | Jóváhagyási bizonyíték |
|---|---|---|
| **A. Alapok** | projektadatok migrációja, típusos Csoport/Közös alap/Változat/Kapcsolat, közös időkiértékelés, Loop nélküli timeline-hiba javítása, stabil mentés/export | régi projekt megnyílik; 10 mp intro után folyamatos háttér fut; ugrás/export azonos állapotot ad |
| **B. Alkotói mag** | könyvtár+réteg UX prototípus, tipográfiai sorfogantyúk, Mozgásblokkok és retime, Eljátszás simítással, kézi Jelzések sáv | 4./5. képből ihletett szerkeszthető motion poszt kevés lépéssel létrejön |
| **C. Látványkapu** | meglévő anyag/render audit, új fény- és anyagvezérlés, közvetlen csillanás-húzás, 1. képes referencia | célgépen mért jó minőségű mozgó és állókép; hiánylista a referenciához |
| **D. Építőelemek** | Bolygó/Felhő/Füst/Virág minőségi feljavítás, 2D↔3D próba, szöveg–forma kapcsolatok, első Részecske Forrás/Megjelenés | Felhő→Lufi és szöveg gömbön; részecskés szöveg visszaáll; kapcsolatok érthetők |
| **E. Közös fizikai tér** | merev testek, mezők, kölcsönhatási jelek, reprodukálható fizikai seek/export | globális gravitáció nélkül lökhető testek; kontaktus vezérel Glow-t |
| **F. Folyadék és összetett recept** | folyadék-kutatási prototípus, üreg/határ, előnézeti költség, jég–króm–láva végponttól végpontig | valódi kiömlés és testreakció, visszatekerhető/exportálható minőség a célgépen |
| **G. Receptcsalád és polírozás** | 3/4/5/7/8/9 referenciák szerinti kész layoutok, Random hatókörök, segítség, teljes UX-próbák | 1:1, 4:5, 9:16 jó eredmény; rövid/hosszú szöveg és képcsere nem rontja el |

Az A–C szakaszok részben párhuzamosítható kutatást igényelnek, de integrálni csak stabil közös idő- és adatszerződéssel szabad. A D–F egymásra épülő kockázat; a teljes 3D folyadékot nem ígérjük előre kis feladatként. A G receptcsalád első darabjai már B/C idején készülhetnek, hogy a minőséget valós munkafolyamaton mérjük. A célgépes GPU-próba és a videóexport tesztje minden szakaszban kötelező, nem csak a végén.

### Keresztmetszeti elfogadási próbák

- **Egyetlen mozdulat, egyértelmű hatókör:** a felhasználó mindig látja, melyik réteget, Csoportot, Változatot vagy Kapcsolatot szerkeszti; a módosítás visszavonható.
- **Idő:** egy összetett, beúszás→remegés→szétesés szövegmozgatás eltolható teljesen; jobb szél húzásakor a beúszás sebessége megmarad; kapcsolóval a szétesés lassítható. A zenejelzéshez kötött szó időpontja nem csúszik el észrevétlenül.
- **Folyamatos jelenet:** Loop nélkül az egyszeri intro lefut, a generátor és a folyamatos mozgás megszakítás nélkül megy tovább; az export hossza külön beállított.
- **Közös alap:** három posztváltozat közül egyben átírt cím csak ott változik; „Átadás” kijelölt változatoknak működik; közös stílus szerkesztése és helyi eltérés jól látszik.
- **Képi minőség:** ugyanaz a jelenet előnézetben és exportban kompozícióra, anyagra és színre nézve összevethető; eltérés csak jelzett minőségi fokozat miatt van.
- **Reprodukálhatóság:** szimuláció, véletlen, kézi jelzések és hangreakció tekeréskor, újranyitáskor és exportban azonos eseménysort adnak.

### Nyitott technikai döntések, amelyeket prototípus döntsön el

1. A jelenlegi SDF-út, egy kiegészítő mesh-út vagy hibrid render szolgálja-e jobban a 2D→3D formákat, kivágott szövegüreget és az 1./6. kép anyagminőségét.
2. Milyen részletű fizikát és folyadékot bír a tényleges célgép folyamatos előnézetben; mikor kell eltérő exportminőség vagy előreszámítás.
3. A böngészős WebGL2 futás és egy esetleges asztali csomagolás közül van-e valódi technikai különbség a mért célmunkafolyamatokban. A platformot nem választjuk puszta feltételezésből.
4. A közvetlen szöveg- és csoportfogantyúk melyik változata adja a legkevesebb félrekattintást és a legkevesebb rejtett állapotot felhasználói próbán.

## Kutatási támpontok és a terv státusza

A [részecske-, fizika-, folyadék- és 4K-melléklet](vel-reszecske-fizika-folyadek-teljesitmeny.md) a 3–4. blokk részletes tervezete; a benne szereplő teljesítménykapuk célok, nem a mai program képességei. A [friss WebGL-referenciajegyzék](vel-uj-webgl-referenciak-2026-10-17.md) a render-, mozgás-, karakter- és layoutpéldákat külön ellenőrzési státusszal tartalmazza. A jelenlegi állapotra vonatkozó állítások a helyi `latomas-src` kódból és a projekt naplóiból származnak; a futó alkalmazás vizuális/GPU-próbája még szükséges. Külső UX-precedensek: [Apple Motion – behaviors és keyframes](https://support.apple.com/guide/motion/behaviors-versus-keyframes-motnf425e02f/6.3/mac/15.6), [PlayStation Dreams – gadgets és vezetékek](https://docs.indreams.me/en-US/create/resources/edit-mode-guide/assembly/gadgets), [PlayStation Dreams – animáció](https://docs.indreams.me/en-US/create/resources/edit-mode-guide/assembly/animate), [Procreate Dreams – élő gesztusfelvétel és easing](https://help.procreate.com/dreams/handbook/keyframes-and-performing), [TouchDesigner – független időzítő](https://docs.derivative.ca/Timer_CHOP). A lebegőpontos WebGL rendercél technikai háttéréhez: [MDN – EXT_color_buffer_float](https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_float). Ezek minták és technikai keretek, nem bizonyítékok arra, hogy a Vel már teljesíti az elvárt minőséget vagy teljesítményt.

## Hiányaudit: mi nem új kérdés, és mi maradt ténylegesen nyitva?

**Már egyeztetett termékirányok, nem új jóváhagyási kérdések:** könyvtári fogalmak és elsődleges kategóriák; Forrás–Recept határ; ráhúzható Megjelenések lánca; Nap–Ég és fizikai kapcsolatok alapelve; Csoport/Közös alap/Változat/Kapcsolat szétválasztása; 2D↔3D szándék; globális fény és csillanás húzása; globális gravitáció alapból kikapcsolva; Részecske Forrás vs ráhúzható részecskehatás; Loop nélküli továbbfutás, végállapot megtartása, Eljátszás és simítás; könnyű újraidőzítés; kézi ritmuskoppintások; szöveg sorainak közvetlen mozgatása. Ezeket a tervnek megőriznie kell, nem újra megszavaztatnia.

**A tervben szerepelnek, de részben még kidolgozás vagy működő próba kell:**

1. **Konkrét Megjelenés-katalógus és minőségi audit.** Nem elég anyagneveket felsorolni. A jelenlegi effektek mindegyikéről látványteszt, hibajegyzék, új alapérték, célonkénti viselkedés és referencia kell. A Hologram, Jég, Króm, Plazma, Lufi, folyadékszerű és fizikai reakcióra érzékeny Megjelenésekhez konkrét szerkesztési forgatókönyv szükséges. Az 1./6. kép szerinti szintet prototípus mutassa, ne ígéret.
2. **2D vektorszerkesztő, 3D tárgyépítés és import.** A közös szerkeszthető útvonal, forma-műveletek, kihúzás és gerinc menti felület tervezete fent szerepel. A közvetlen 3D szerkesztés részletes képernyőterve, a külső SVG/3D modell import köre és a 2. képszerű részletes dioráma forrásigénye még nyitott. A 2D→3D átjárás UX-ét működő formán kell kipróbálni.
3. **Részecske- és fizikaeszközök részletes alkotói UX-e.** A vászonműveletek, szimulációs fokozatok és 4K kapuk most a [külön részletes mellékletben](vel-reszecske-fizika-folyadek-teljesitmeny.md) szerepelnek. Működő prototípus és célgépes mérés még nincs; a teljes 3D Liquid teljesítménye külön bizonyítandó.
4. **Randomitás és Recept-minőség.** A hatókör, seed és biztonságos/kísérleti fokozat adott; az animált random pontos viselkedése, értelmes kombinációk szabályai, illetve a kész poszt/reel-receptek tényleges tartalma és reszponzív layoutja még nincs megtervezve példánként.
5. **Teljes UI-terv és interakciós próba.** A könyvtár helye, a rétegválasztás és a kompakt effektlánc iránya megvan, de nincs kész képernyőterv vagy kipróbált prototípus a sűrű rétegekre, csoportokra, kapcsolatokra, idővonalra, jobb kattintásra és a bővített tooltipekre. Nem állítható még, hogy az egész együtt intuitív.
6. **Média és kimenet.** A poszt/reel/lyric cél ismert, de nincs pontosan meghatározva a kép-, videó-, hang-, betűtípus- és esetleges 3D import, a projekt hordozhatósága, valamint az állókép- és videóexport formátumainak/felbontásának UX-e. A tervben ezt nem szabad késznek tekinteni.

**Prototípussal/méréssel eldöntendő, nem pusztán ízléskérdés:** valódi 3D törés/tükröződés és 1./6. képes anyagminőség a célgépen; SDF/mesh/hibrid út; 2D/3D geometria és ütköző testek együttműködése; fizikai folyadék minősége és sebessége; tekerés és export determinisztikussága; a böngészős/asztali csomagolás szükségessége. A mai kód- és naplóolvasás ezeket nem bizonyítja.

**Következő tervezési munka:** a valóban nyitott témákhoz (megjelenéskatalógus, UI-képernyők és próbák, konkrét receptek, import/kimenet) további elemkatalógus és felhasználói próba kell. A már kidolgozott forma- és fizikai irányokhoz működő, mért prototípus szükséges. A végleges fejlesztési specifikáció ezek eredményeiből áll össze. A korábban egyeztetett alapelveket csak valódi ellentmondás vagy próbaeredmény esetén kell újranyitni.

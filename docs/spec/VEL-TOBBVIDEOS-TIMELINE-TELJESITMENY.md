# Vel — sokrétegű videó és reszponzív idővonal (tervezési követelmény)

**Státusz:** jövőbeli fejlesztés specifikációja, nem állítás a jelenlegi programról és nem jóváhagyott mérföldkő. A mai Vel nem importál vagy vág MP4-videót. A videóexport külön képesség.

## Alkotói cél

Lehessen importált videókat egymás fölé tenni, vágni, időben eltolni és effektekkel, szöveggel, 3D elemekkel együtt használni. Húzás, klipszél-mozgatás, kijelölés, nagyítás és időbeli tekerés közben az **idővonal kezelése maradjon azonnali**; egy lassú dekódolás ne akassza meg a teljes felületet. A lejátszás lehet csökkentett minőségű, de az időzítés maradjon helyes. A 4K projekt nem követeli meg, hogy az előnézet minden pillanatban 4K legyen. Az export a forrásokból teljes felbontásban, pontosan számoljon.

## A felhasználó számára látható működés

- Importkor a klip gyorsan megjelenik a timeline-on. A program háttérben készít hullámformát, áttekintő képkockákat és szükség esetén proxyt; ezek elkészültét diszkrét jel mutatja. A felhasználó közben tovább szerkeszthet.
- A felbontást az **előnézet megjelenített méretéhez és a gép aktuális terheléséhez** kell igazítani. Egy kis preview-ablakban a jó minőségű 1080p vagy 1440p proxy gyakran megfelelő; nagyításkor vagy megállás után a program az eredeti forrásból finomítja a képet. A proxy nem ad vissza elveszett részletet: ha a felhasználó 1:1-ben nézi a 4K képet, az éles ellenőrzéshez eredeti képkockát kell betölteni.
- A gyors minőségváltás ne legyen zavaró villogás. Lejátszáskor a képkocka-időket és a hangszinkront tartsa; terhelésnél előbb a drága vizuális részleteket és a megjelenített felbontást csökkentse, ne a klip időzítését változtassa meg. Jelezze röviden, ha az előnézet részletessége csökkent.
- Scrubnál azonnal adjon durva, de releváns képet a célidőről, majd rövid tétlenség után pontos képet. A régi keresésből késve érkező frame soha ne írja felül az új időpozíciót. A hang lejátszás alatt stabil maradjon; a scrub-hang külön kapcsolható.
- Az effekt- és 3D-rétegek terhelése ugyanabba a teljesítménykeretbe számítson. A háttérben nem látható, kitakart vagy időben inaktív réteget ne renderelje/dekódolja feleslegesen. A felhasználó egy klipre vagy az egész előnézetre választhat „Gyors”, „Kiegyensúlyozott”, „Minőségi” módot; az export ettől független.
- Alapműveletek: klip importja, trim, split, áthelyezés, több klip együttes mozgatása, sebesség és hang kezelése; ezek nem roncsolják a forrásfájlt. A későbbi proxycsere vagy újranyitás nem mozdíthatja el a vágásokat.

## Megvalósítási elvek

1. **Egy közös időalap:** a videó, hang, animáció, procedurális rendszerek és export ugyanarra a jelenetidőre hivatkozzanak. A klip saját forrásidejét pontos leképezés adja (start, in/out, sebesség). A hangsáv legyen az időzítés stabil viszonyítási pontja lejátszáskor; egy lassú vizuális frame ne tolja el a hangot.
2. **Aszinkron médiaút:** demux, dekódolás, proxykészítés és hullámforma-előállítás ne a felület fő szálán fusson, ahol a platform ezt engedi. A dekódolási sor legyen korlátos és prioritásos: látható időpont és közeli frame-ek előbb; távoli előtöltés később. Ugráskor a régi feladatok törölhetők.
3. **Proxy és cache:** megőrzött, visszakereshető eredeti forrás; több minőségi szint csak indokolt esetben. Proxyfelbontás a tényleges képernyőmérethez, tartalomhoz és géphez mérve; jó minőségű szűrés/felskálázás és helyes színtér. Korlátos CPU/GPU képkocka-cache, LRU/aktivitás szerinti eldobás, textúrák újrahasználata, dekódolt frame-ek gyors felszabadítása. A proxy cache törölhető és újraépíthető anélkül, hogy a projekt sérülne.
4. **Külön interakciós és renderköltség:** timeline pointer- és görgetési művelet nem várhat dekóderre vagy GPU-readbackre. A waveform és thumbnail virtuális, csak látható tartományt rajzol. A preview frissülhet később, miközben a fogantyú és az időjelző azonnal mozog.
5. **Export:** a proxy soha nem lehet észrevétlenül az export forrása. Képkockánkénti, memóriahatáros feldolgozás és folyamatos mentés; codec-, méret-, RAM/VRAM- és tárhelyellenőrzés. Hiányzó forrás vagy sikertelen dekódolás egyértelmű hiba, nem csendes fekete képkocka.
6. **Platformdöntés mérésből:** a WebGL/WebCodecs út alkalmasságát valós 4K forrásokkal és célgépeken kell mérni. Az, hogy a szerkesztő böngészőben fut vagy asztali csomagolást kap, önmagában nem oldja meg a dekódolás, memória és lemezelérés korlátait. Ha a mért sokrétegű cél nem teljesül, külön média/render backend lehet szükséges.

## Mérhető elfogadási próbák

Ezek **célpróbák**, nem jelenlegi teljesítményadatok. A célgépet és az elvárt határértékeket a mérföldkő előtt kell rögzíteni; átlag FPS mellett 95. percentilis inputkésés, kimaradt preview-frame-ek, hangcsúszás, seek-idő, RAM/VRAM-csúcs és 4K export teljesülése számít.

1. 4K forrásból 1, 3, 6 és 10 látható klip, különféle kezdési időkkel, 1080p kijelzőn; ugyanakkor szöveg, egy 3D réteg és több effekt. Lejátszás és folyamatos oda-vissza tekerés közben a timeline kezelése reszponzív marad. Az eredményt a forrás codec/profil/fps és gép adataival együtt kell közölni; a „10 réteg” nem általános valós idejű ígéret.
2. Hosszú jelenetben nagyítás, trim, split, több klip húzása és sok thumbnail: a kezelőfelület nem fagy, a preview késése láthatóan elkülönül a vezérlés késésétől.
3. Gyors seek A→B→C: a C-hez tartozó képet mutatja, késő A/B frame nem villan vissza. Megállás után eredeti felbontású éles kép ellenőrizhető.
4. Proxyval szerkesztett jelenet 4K exportja az eredeti forrásokból készül; képkocka, szín, vágás, effektsorrend és hangszinkron ellenőrzött. Hosszabb export közben a memória nem nő folyamatosan a videó hosszával.
5. Hiányzó média, sérült proxy, elégtelen szabad hely és GPU-context-vesztés esetén érthető helyreállítás vagy hiba; a projekt szerkesztése és mentése megmarad.

## Bevezetési sorrend

Először egyklipes import/trim/split/időleképezés és pontos export. Utána aszinkron thumbnail/hullámforma és gyors seek. Ezt követi a többklipes kompozíció, korlátos dekódolás és proxyváltás; végül a célgépes 4K stresszpróba, színhelyesség és hosszú export. Minden szelet előtt a Claude agent írja le pontosan a funkciókat, mérési környezetet, elfogadási próbát és a kimaradó részeket; a felhasználó jóváhagyása után kezdje a fejlesztést.

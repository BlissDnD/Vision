# Vel — intuitív mozgás és egységes Kapcsolatok

2026-10-18. **Felhasználói döntések és megvalósítandó UX-irány Claude-nak.** Ez a dokumentum a `VEL-TELJES-FUNKCIO-ES-MERFOLDKO-ATADAS-CLAUDE-NAK.md` kiegészítése, nem felhatalmazás arra, hogy a következő mérföldkövet jóváhagyás nélkül elkezdje. A részletes mérföldkőjavaslatot a felhasználónak előre meg kell mutatni és kifejezetten jóvá kell hagyatni. Az alábbiak a kívánt alkotói működést rögzítik; az adatmodell és renderer pontos megoldását Claude választhatja meg, ha a látható viselkedést és a teljesítménycélt megőrzi.

## 0. A termékcél egy mondatban

A felhasználó néhány közvetlen mozdulattal, **keyframe-ek egyenkénti szerkesztése nélkül** tudjon stílusos, egész jelenetre kiterjedő motion grafikát készíteni; a tárgyak, szöveg, háttér, kamera és effektek másként, a kompozícióban betöltött szerepük szerint mozogjanak, mégis egy áttekinthető idő- és Kapcsolat-rendszerben maradjanak. A finom szerkesztés ne vesszen el: a kész eredmény később blokk-, réteg-, komponens-, fázis- vagy keyframe-szinten állítható.

## 1. Mi a jelenlegi alap, amit tovább kell vinni

A jelenlegi Velben már van `st.links` alapú paraméter→paraméter Kapcsolat (forrás/cél `id,g,k`, hozzáadás/felülírás, erősség, be/ki), Kapcsolatok szekció az inspectorban, Jelzések, Mozgásblokkok és Eljátszás. Ezeket **nem szabad párhuzamos, össze nem függő új rendszerekkel lecserélni**. A mai Kapcsolat még szűk: paramétervezérlésre alkalmas, de a felhasználó ugyanott szeretné átlátni a Nap→Ég reakciót, a tárgykövetést, a kamera célpontját, a Jelzés→Mozgás indítást, a kontaktus→Glow hatást és a jelenetanimáció belső függőségeit.

Termékfogalmak: **Csoport** = együtt rendezett elemek; **Közös alap/Változat** = példányok és célzott változásátadás; **Kapcsolat** = egyik jelenetbeli forrás hat a másikra. A „Mozgásminta” vagy jelenetanimációs recept nem új Csoport- vagy Változat-szemantika. A felhasználó ezeket korábban kifejezetten szétválasztotta.

## 2. Egységes Kapcsolat-rendszer, többféle hatással

Minden kapcsolatnak ugyanaz a **felhasználói életciklusa** legyen: létrehozás → rövid előnézet → alkalmazás → jelvény/vékony összekötés → erősség/időzítés/mód állítása → ideiglenes tiltás vagy törlés → visszavonás. A rendszer a hatástípus szerint külön belső kiértékelőket használhat. Ne próbáljon minden kapcsolatot puszta számszerű paramétervezetéknek álcázni.

| Kapcsolatcsalád | Példa | Mit lát/szerkeszt a felhasználó |
|---|---|---|
| **Környezeti** | Nap→Ég; Felhő+Eső→Ég; Szél→Füst | Az Ég a Nap állásához/színéhez igazodik; az esőhöz borulhat; a füst elhajlik. Hatás erőssége és kapcsoló. |
| **Térbeli** | Felirat követi a kört; Kamera ránéz egy tárgyra | Távolság, késés, tengely/irány, simítás; a cél mozgása később is számít. |
| **Forma/felület** | Szöveg hengerre; alak padlóba simul; szöveg üreget vág | Irány, külső/belső felület, ismétlés vagy kivágás; a célzóna világos. Ez geometriát is érinthet. |
| **Kölcsönhatás** | Ütközés/közelség→helyi Glow, részecske-burst | Küszöb, erősség, maximum, lecsengés és az érintkezés helye. |
| **Vezérlés** | Hangereje→felfújtság; egyik tárgy forgása→másik szín | A jel forrása, leképezése, simítása; több jel sorrendje/összegzése. |
| **Időzítés** | J-koppintás→szó megjelenése; első szó érkezése→második indul | A jelzéshez igazított fázispont és késés; a jelzés mozgatása a reakciókat együtt viszi. |

**Automatikus, felajánlott, kézi:** az automatikus szabályok (például globális fény vagy kompatibilis fizikai testek kölcsönhatása) ne termeljenek száz látható vezetéket, de az érintett tárgynál látszódjon, hogy hatnak és felülírhatók. A felajánlott kapcsolatok (Nap→Ég, kontaktus→Glow) csak felhasználói elfogadás után aktiválódnak. A kézi kapcsolatot a vásznon, rétegsorból vagy Kapcsolatok panelből lehet létrehozni. Az egyes utak **ugyanabban a kapcsolati leltárban** jelenjenek meg, az eredetüket jelölve.

**Prioritás és konfliktus:** ha egy paramétert kézi animáció, környezeti kapcsolat és automatikus szabály is érint, a Vel mutassa, mi a végső eredmény forrása: hozzáad, kever vagy felülír. A felhasználói felülírás előzze az automatikust. Körkörös függést jelezzen, szándékos feedbackhez legyen explicit késleltetés; ne fagyjon vagy változzon véletlenszerűen a seek/export. A létrehozás és törlés egy művelettel visszavonható. Csoport duplikálásakor a belső célok az új csoport megfelelő tagjaira mutassanak; külső cél csak értelmes esetben másolódjon.

## 3. A vékony „zsinór” létrehozási gesztusa

### A legegyszerűbb út

Ha a felhasználó kijelöl egy tárgyat, a határán vagy a kis **Kapcsolat-jelvényen** megjelenik egy fogható pont. Erről húzva vékony, enyhén ívelt zsinór követi az egeret. Csak a **kompatibilis célok** kapnak diszkrét kiemelést. A kiemelés erősebb lesz, amikor a kurzor egy cél fölé ér; a cél röviden megmutatja az elérhető értelmes hatásokat, például „Kövesse”, „Világítsa meg”, „Igazodjon hozzá”, „Vezérelje a Glow-t”. Elengedéskor a Vel **előnézetet és egy rövid, emberi nyelvű választást** ad. Egy egyértelmű eset egy kattintással kész; többértelmű esetben legfeljebb néhány jól elnevezett lehetőség látszik.

Nem kell előbb panelt nyitni és két hosszú paraméterlistában keresni. A pontos paraméterek a létrejött kapcsolat jelvényéből később elérhetők. Ha üres vászonra engedik el a zsinórt, a művelet megszakad; ha nem látható célhoz akarnak kötni, a rétegsorban vagy keresővel választhatnak. A zsinór rajzolása önmagában **nem változtatja meg a jelenetet**; csak a választás elfogadása teszi aktívvá a felajánlott hatást. Escape/Undo megszakítja vagy visszavonja.

### Honnan indulhat a zsinór?

- Tárgy jelvényéről: „ez a tárgy hasson valamire”, például Nap→Ég vagy felirat→kamera.
- Konkrét Mozgásblokkról vagy Megjelenés kártyájáról: „ezt mi indítsa vagy vezérelje?”, például Jelzés→Szétesés vagy közelség→Glow.
- Paraméter melletti kis pontból, ha haladó felhasználó pontos értéket kötne: a mai `st.links` működés közvetlen, vizuális bejárata.
- Célra ejtés után fordított irány is választható, ha mindkét irány értelmes; a felület mondja ki, melyik tárgy vezérel melyiket.

### Mit mutasson utána?

A létrejött kapcsolat mindkét érintett elemnél kis jelvényt kap. Kijelölve **csak az érintett kapcsolat** vékony zsinórja látszik; más kapcsolatvonalak rejtve maradnak. A jelvényre kattintva mini-kártya: „Nap fénye → Ég színe”, ki/be, 2–3 fő vezérlő, „Részletek”. Összetett jelenethez külön szűrhető Kapcsolatok nézet lehet, de ne ez legyen a napi alapfelület. A kiemelés színnel *és* szöveggel/jellel különböztesse meg az aktív, ajánlott, tiltott vagy hibás kapcsolatot.

### Különleges, nehéz esetek

- Egymást takaró céloknál az aktuális rétegválasztó találatlista segít; nem kell rétegeket zárolni.
- Csoport csukva: a csoport célként jelenik meg; kinyitva választható a gyerek. A zsinór nem vált észrevétlenül célobjektumot.
- Ugyanarra a célra több értelmes kapcsolat esetén felajánlott műveletlista és rövid előnézet kell. A „ráhúztam a gömbre a szöveget” felületre helyezést vagy forma-kivágást is jelenthet; ne találgasson láthatatlanul.
- A nem kompatibilis cél tompa marad és rámutatva röviden megmondja, mi hiányzik (például „Térbeliség kell”). Ilyenkor a Vel felajánlhatja a szükséges lépést, de csak jóváhagyással alkalmazza.

## 4. Mozgás árnyéka — térbeli és időbeli fogantyú külön

A kiválasztott, animált tárgynál alapesetben legfeljebb **két halvány szellemkép** látszik: az előző és a következő fontos állapot, rövid időcímkével. A valódi tárgy kontrasztja egyértelműen erősebb. A szellemképet húzva annak a pillanatnak a helyét/alakját állítom; a közöttük húzható finom vonal a pályát alakítja. Az időtartamot a blokk szélén vagy az időcímke külön fogantyúján állítom. A térbeli közelítés önmagában nem jelenti „gyorsabb” mozgást: ugyanazon idő alatt rövidebb út lassabb. A Vel húzás közben mutassa a következményt és adhat külön **sebesség megtartása** opciót.

Az árnyék **nem csak kézzel keyframelt pályára** használható. Ráhúzott Beúszásnál, Eljátszásból készült felvételnél és Kapcsolatból számolt követésnél is ugyanaz a vizuális olvasási mód. A módosítás azonban jelezze, mit szerkeszt: a Beúszás kezdetét, a felvétel helyi korrekcióját, vagy a követési távolságot. A mögöttes forrás maradjon átlátható; ne módosítson rejtetten nyers felvételt vagy automatikus kapcsolatot. „Teljes pálya” csak kérésre, csoport gyerekei csak belépés után. Ez a clutter elleni alapelv.

## 5. Mozgás átadása — mit kapjon meg a másik elem?

Egy jó kézi vagy ráhúzott mozgás mintája más elemekre átadható **Ritmus / Út / Teljes mozgás** módokkal. Alapból **Ritmus**: a cél a saját helyére érkezik, de átveszi a gyorsulás, megállás és impact karakterét. **Út**: arányosított pályagörbét kap saját kezdő/végpont között. **Teljes**: idő és tér együtt másolódik, felülírható célponttal. A célon előnézet mutatja, mit kapna.

Több cél esetén látható **sorrend és stagger** vezérlő; egy kompozíció szavai a saját helyükre érkeznek ugyanazzal a mozgáskarakterrel. A forrás-mozgás későbbi javítása alapból követhető mintakapcsolat lehet, de a célnál helyi eltérés és leválasztás lehetséges. A mini-kártya világosan nevezze meg: „Ritmust kap ettől: Címszó”, ne keverje a réteg-Változat fogalmával. A Mozgásminta a Kapcsolatok rendszerében **Időzítés/Vezérlés + átadott profil**, nem párhuzamos rejtett másolómechanizmus.

## 6. Festés — meglévő mozgás terjedési térképe

Kiválasztok egy **már létező Mozgást vagy Megjelenés-reakciót** (Belépés, Glow, Részecskékre bontás, Sorok csúszása, anyagváltás), majd a **Sorrend festése** eszközzel végighúzok a szavakon, sorokon, formákon vagy csoporttagokon. Az ecsetvonás alapból **nem a tárgyak mozgáspályája**: azt jelöli, melyik célhoz milyen sorrendben és késéssel ér el ugyanaz a hatás. A vonal után csak néhány számozott érintési pont látszik; a terjedési idő és átfedés az első két vezérlő. A részletekben erősség elemenként, irány, szünet, véletlen variáció.

A festés egy idővonalon szerkeszthető, nyújtható terjedési blokkot és látható cél-Kapcsolatokat hoz létre. Az eredeti Mozgás kártyája megmarad; a célsorrend újrafesthető vagy egyetlen célból törölhető. Egy sor vagy szó átírása után a rendszer értelmesen újraköti a célokat; ha ez nem biztos, megjelöli a javítandó helyeket, nem törli csendben az animációt. Nagy számú részecskénél nem minden részecskéből lesz külön layer/Kapcsolat-zsinór: a terjedés egy mező/maszk és seed alapján értékelődik ki.

## 7. Szerepérzékeny, szinte kész jelenetanimáció

**Felhasználói pontosítás:** a „szétszórás és visszarendeződés” önmagában kevés. A Vel felismerheti a **jelenetben betöltött szerepeket**, és ugyanazon magas szintű animációs szándékból a hátteret, szöveget, formákat, képet, részecskéket és kamerát **másként, összehangolva** mozgatja. Ezért egy mozdulattal szinte kész motion grafika jöhet létre; a felhasználó utána minden részt módosíthat.

### Szerep megadása és felülírása

A Vel első körben a könyvtári elem, rétegtípus és csoportszerkezet alapján **javasolt szerepet** ad: Háttér, Főcím/Szöveg, Kísérő szöveg, Fő forma/Tárgy, Díszítő forma, Kép/Videó, Részecske/Akcentus, Kamera/Fény. Ez **nem végleges automatikus címke**: a kijelölt rétegen egy rövid „Szerep ebben a jelenetben” választóval bármikor átállítható. Egy adott jelenetanimációhoz a részvétel külön ki/be kapcsolható; például egy logó változatlan maradhat. A szerepek nem változtatják meg a Forrás/Recept/Megjelenés könyvtári fogalmait, és nem lesznek új kötelező rétegtípusok.

### Egy mozdulat, eltérő eredmények

Példa: egy tipográfiai poszterben kijelölöm a kompozíciót és választom a **„Szétesik → visszaáll”** jelenetmozgást. Egyetlen nagy vászonfogantyúval beállítom a szétesés mértékét, egy másikkal a ritmusát. Alapból:

- **Háttér:** nem darabokra robban; lassú parallax, árnyalat- vagy fényátmenet, esetleg enyhe torzulás ad mélységet.
- **Főcím:** sor-/szó-/betűcsoportokra bomlik, de az olvashatóság és a fő hangsúly irányított marad; visszaérkezésnél impact lehet.
- **Kísérő szöveg:** kisebb elmozdulás vagy rövid késleltetett fade; ne nyomja el a címet.
- **Fő forma/3D tárgy:** térben mozdul, fordul vagy kissé deformálódik, az anyaga/fénye vele együtt reagál.
- **Díszítő formák:** szétszóródnak vagy hullámban követik a címet.
- **Részecskék/akcentus:** a mozgást hangsúlyozzák, de költségplafonnal és seed-del.
- **Kamera/fény:** csak ha bekapcsolva: enyhe fókusz/ráközelítés és fény-impulzus a fő eseményre; nem állítódik át rejtetten.

Ez **meglévő Mozgások, Megjelenések, Kapcsolatok és időzítések összeállítása**, nem egyetlen átláthatatlan új shader vagy beégetett videó. A jelenetmozgás kártyáján az első három vezérlő lehet: **Mérték, Ritmus, Hangsúly**. A „Szerepek” lenyitásban külön súly és késés szerepenként; a rétegen saját helyi felülírás. A súly azt jelenti, mennyire vesz részt a mozgásban, nem feltétlenül ugyanannak az x/y eltolásnak a szorzója. A háttér nagyobb súlya például erősebb parallaxot, a címsoré nagyobb szétesést jelent. A Vel a különböző szerepekre **értelmes profilt** választ.

### Szerkezet, kontroll, szerkeszthetőség

Az idővonalon elsőre **egyetlen összecsukható jelenetmozgás-blokk** látszik. Kinyitva szerepcsoportok (Háttér, Cím, Forma stb.), majd a tényleges Mozgások/Megjelenések/Kapcsolatok. A jelenetmozgás eltolása minden alkotórészt együtt visz; a blokk nyújtása a belépés/impact ritmusát a már elfogadott retime-szabály szerint kezeli, nem rontja el a belépés sebességét észrevétlenül. Egy komponens önállóan szerkeszthető, kicserélhető vagy leválasztható. Ha a felhasználó közben átírja a címet vagy másik képet tesz be, a mozgás új célokat keres és előnézetet ad; a helyi finomításokat nem törli csendben.

**Nem minden tartalomra ugyanazt a kész koreográfiát:** a javasolt mozgásprofil a kompozíció elemzéséből és a felhasználó szándékából indul. Legyen néhány gondosan hangolt változat, például Editorial érkezés, Energia-kitörés, Lágy organikus, Anyagváltó reveal. A profil megmutatja, miből épül, és a háttér/text/shape külön szerepe miatt nem csak egy csoporton egyformán alkalmazott effekt. Váratlan, kaotikus kombináció később külön Kísérleti mód lehet; alapból olvasható és esztétikailag koherens maradjon.

### Kapcsolatok szerepe a jelenetmozgásban

A belső függőségek ugyanazon Kapcsolat-rendszerben látszanak, ha a felhasználó lenyitja őket: Főcím impactja→háttér fényimpulzus; cím szétesése→díszítő formák elindulása; kamera célpontja→fő forma; kézi Jelzés→jelenetmozgás csúcspontja. Alapnézetben ezek nem rajzolnak tucatnyi zsinórt. A jelenetmozgás kártyája a fontos ok-okozatot egy sorban összefoglalja, például „A cím érkezése indítja a háttér ragyogását”. Egy összekötés saját zsinórral kiválasztható és átállítható.

## 8. A „rendezd meg ezt a pillanatot” ötlet státusza

A felhasználó ezt **még nem értette pontosan és nem fogadta el végleges működésként**. Ne építs belőle önálló új módot. A szűk, érthető alternatíva lehet egy explicit **„Itt legyen ekkor”** célállapot: megállítom a lejátszást, kiválasztok egy elemet, ezzel a művelettel állapotot adok az adott pillanathoz, majd a Vel előnézetet ajánl a szomszédos állapotok közti mozgásra. Ezt külön prototípussal és felhasználói jóváhagyással kell eldönteni. A négy fő irány (Mozgás árnyéka, Kapcsolatok, Mozgás átadása, Festés) ettől függetlenül tervezhető.

## 9. Clutter elleni és magas kontrollt biztosító közös UX-szabályok

1. **Egy aktív szándék egyszerre:** kijelöléskor legfeljebb két Mozgás-árnyék; kapcsolat húzásakor csak kompatibilis célok; festés után csak néhány sorrendjel. A kapcsolati háló egészét ne fedje a vászonra.
2. **Következetes jelvények:** ugyanaz a kis Kapcsolat-jelvény adja a zsinórt a tárgynál, Mozgásnál, Megjelenésnél és paraméternél. A funkciók mások, a gesztus és a vizuális nyelv közös.
3. **Progresszív mélység:** első szinten 2–3 emberi nyelvű vezérlő; szerepenkénti súly, időzítési leképezés, keverés és keyframe-ek csak lenyitva. A pontosságot ne vedd el az egyszerűség kedvéért.
4. **Előnézet véglegesítés előtt:** a célra ráhúzott kapcsolat és a jelenetmozgás rövid, visszavonható előnézetet ad; a felhasználó látja, mit fog módosítani. A puszta rámutatás nem írja át a projektet.
5. **Eredet látható:** minden animált változásnál meg lehessen nézni: kézi kulcs, Eljátszás, ráhúzott Mozgás, jelenetmozgás belső eleme, Kapcsolat, fizika vagy hang okozza. Ez különösen fontos, ha több rendszer ugyanarra az értékre hat.
6. **Rétegválasztás és csoport:** takarásnál a meglévő találatlista segít, csukott csoport célként egység, nyitott csoportban gyermek választható. A kijelölt tárgy a következő húzásnál megfogható marad.
7. **Idő és determinisztikusság:** időzített, folyamatos és reaktív mozgások ugyanazon jelenetórán; Loop csak ismétlés. Ugrás, újranyitás és export ugyanazt az eredményt adja rögzített seed/események mellett. Kézi élő bemenet rögzítés nélkül nem visszatekerhető; ezt a Vel jelezze.
8. **Költség látható:** szerepérzékeny jelenetmozgás ne indítson észrevétlenül sok 4K passzt vagy minden részecskére külön fizikát. Előnézeti és exportminőség eltérhet, de a kompozíció egyezzen.

## 10. Próbajelenetek és elfogadási kritériumok

**A. Nap–Ég és animáció ugyanabban a Kapcsolat-rendszerben.** Két külön Forrást helyezek a vászonra. A Nap kapcsolatjelvényéből vékony zsinórt húzok az Éghez; az Ég kiemelődik, a „Napfény hat az Égre” opció előnézetet ad. Elfogadom, majd a Napot mozgatom: az Ég színe reagál. Ugyanennek a Napnak a megjelenése vagy egy felhő mozgása egy kézi Jelzéshez is köthető. A Kapcsolatok panel mindkettőt világosan, eltérő hatástípussal mutatja; egyenként kiiktathatók. Nem kell két külön „kapcsolat” fogalom.

**B. Egy mozdulatból szinte kész tipográfiai motion.** A 4./5. kép ihlette 9:16 kompozícióban van háttér, főcím, kisebb szöveg és formák. Ráhúzom az „Editorial érkezés” vagy „Szétesik → visszaáll” jelenetmozgást. A háttér, főcím, kísérő szöveg és formák **eltérő, összehangolt** mozgást kapnak; a cím marad olvasható. Egyetlen blokkal tolom az egészet, külön a háttér súlyát csökkentem, a cím impactját növelem, egy díszítő elemet kizárok. A jelenet továbbra is szerkeszthető, magyar hosszabb szövegre átírható.

**C. Mozgás árnyéka, átadás és festés.** Egy címszón beúszást állítok; kijelöléskor legfeljebb két halvány állapot és pálya látszik. A kezdő szellemképet arrébb húzom (hely változik), majd a blokk szélét nyújtom (idő változik). A ritmusát átadom három másik szónak: mind saját helyére érkezik. Végigfestem rajtuk a kívánt sorrendet; az idővonalon egy nyújtható, érthető blokk és lenyitható részletek jelennek meg, nem több tucat szétszórt keyframe.

**D. Összetett reakció.** Két fizikai tárgy érintkezik; az érintkezési jel helyi Glow-t erősít, a kézi J-jelzés elindít egy részecske-burstöt, a kamera a fő tárgyra néz. A három kapcsolat különböző belső motorokat használhat, de ugyanabból a kapcsolati jelvény/panel/térkép rendszerből vizsgálható és tiltható. Ez későbbi E/D függőségű teszt, nem első Kapcsolat-UI mérföldkő teljes ígérete.

Minden próbán ellenőrizendő: nem jön létre kapcsolat véletlenül; egyértelmű a hatás iránya és a cél; Undo/Redo, mentés/újranyitás és régi projekt működik; seek és export egyezik; a vászon nem válik túlzsúfolttá 10–20 elemnél; az alap eredmény vizuálisan használható finomhangolás nélkül.

## 11. Fejlesztési bontás Claude számára — csak javaslat, előzetes jóváhagyással

Az egészet **ne egyetlen „UX-polish” címkével** és ne egy mérföldkőben vállald. Javasolható, függőség szerinti sorrend:

1. **Kapcsolatok látható létrehozása:** zsinór, kompatibilis cél-kiemelés, előnézet, jelvény, mai paraméterkapcsolat teljes megtartása. Nap–Ég egyszerű környezeti kapcsolat mint első heterogén példa. Erre konkrét mérföldkőjavaslat és felhasználói jóváhagyás kell.
2. **Mozgás árnyéka:** a meglévő Beúszás/Mozgásblokk és Eljátszás pályájának olvasható, közvetlen szerkesztése; idő és tér külön. Két szellemkép maximummal kezdj; zsúfoltsági próbával.
3. **Mozgás átadása és Sorrend festése:** meglévő mozgás ritmusának átadása, több cél staggerje, egy hatás terjedési térképe; ne vezess be külön időmotort.
4. **Szerepérzékeny jelenetmozgás:** egy valóban jó 9:16 tipográfiai/forma/háttér jeleneten első összetett profil, nyitott belső alkotórészekkel és szerepsúlyokkal. Csak ezután több profil. A függő Forrás/Megjelenés képességeket és teljesítménykapukat előre sorold fel.
5. **Fizika/hang/kamera integráció:** a fenti Kapcsolat-UI fokozatos kiterjesztése a tényleges új motorokra; ahol egy motor még nincs, a UI ne ígérjen működő kapcsolatot.

Mielőtt M8-ra vagy más nagyobb szakaszra lépnél, az aktuális `FUNKCIO-LELTAR.md` minden nyitott sorát sorold be: most megoldandó, függőség miatt későbbi vagy külön felhasználói döntést igényel. **Egyik sem tűnhet el pusztán az M-szám lezárása miatt.** A felhasználó minden mérföldkő pontos tartalmát és próbáját előre jóváhagyja. Ez a dokumentum termékirány, nem automatikus jóváhagyás az implementáció elindítására.

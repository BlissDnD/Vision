# Későbbi nagy irányok – artisztikus 3D jelenet és AI-vázlatmód

**Felhasználói cél, 2026-10-18. Állapot: későbbi fejlesztési terv, nincs implementálva vagy elindítva.**

## 1. Fő cél: gyorsan szép, artisztikus 3D tájat készíteni

A felhasználó ezt nevezte fő célnak: pár kattintással látványos 3D scene; néhány asset behúzása, térbeli elhelyezése, automatikus világítás és gyors alkotás. A siker mércéje a jó kompozíció elkészítésének könnyedsége, nem az elérhető technikai paraméterek száma.

A 3D jelenettervező a Vel meglévő eszközeinek közös térbeli munkafolyamata legyen. Az első verzió célzott táj-/diorámaépítő, közvetlen kezeléssel és kurált stílusokkal; részletes modellező, rig-editor vagy korlátlan filmes renderfarm nem része az első szeletnek.

### Felhasználói út – javasolt

1. **Világalap választása:** hegyvidék, sivatag, sziget, idegen bolygófelszín, felhővilág vagy stúdiódioráma. Már a választás után értelmes talaj, horizont, kamera és fény látszik.
2. **Két-három asset behúzása:** szikla, növény, épület, jármű vagy egyszerű figura. Az elem a mutató alatti valódi felületre kerül, értelmes mérettel. Lebegő tárgyhoz explicit térbeli elhelyezés; talajhoz igazítás kapcsolható.
3. **Kompozíció a vásznon:** húzás a talajon mozgat; külön magasságfogantyú emel; forgatóív elfordít; skálafogantyú méretez. Számmező/billentyűs alternatíva mindig van. A kamera mozgatása és a tárgy húzása nem versenyez ugyanazért a gesztusért.
4. **Fényhangulat egy lépésben:** hajnal, aranyóra, borult ég, éjszaka vagy stúdió. Az ég, kulcsfény és pára együtt változik, a tárgyakat közös fény éri. Utána a Nap/fény fogható a vásznon.
5. **Finomítás:** egy rövid sorban Hangulat / Részlet / Köd / Változat; a mélyebb paraméterek csak kérésre. Például a kiválasztott sziklához saját domborzat/anyag, a tóhoz víz, a bolygóhoz légkör.
6. **Kamerakép mentése:** a felhasználó eltárol egy nézetet, kipróbál más szöget, majd visszatér. Állókép vagy rövid kameramozgás exportálható.

### Mitől lesz gyors és kreatív?

- **Kurált alapok:** előre összefényelt és komponált jelenetcsaládok; a seedet a tájra, assetelosztásra és színekre külön lehet újradobni.
- **Fókusztárgy kijelölése:** a javasolt kamera és automatikus világítás ehhez igazodik. Az eredmény elfogadás előtt megtekinthető; nem mozgatja csendben az összes tárgyat.
- **Automatikus világítás, kézi kontrollal:** induláskor hasznos alap; később külön „Új fényjavaslat” művelet. A már kézzel állított fény/kamera zárolható, egyszerű tárgymozgatás nem írja át automatikusan a világítást.
- **Gyors elosztás:** fű/kő/fa szórása egy kijelölt felületre; magasság/lejtés/sűrűség korlát, ecsetszerű kijelölés. Az első verzióban elég egy kis, jól kinéző készlet.
- **Környezeti egység:** talajárnyék, közös színhangulat, távolsági pára és finom háttérbe simulás. A kamera és rétegmélység következetes; egy bolygó ne kivágott matricaként üljön a tájra.
- **Egyszerű méretarány:** import után egységes mérték és helyes tengelyek; egy kattintásos talpra állítás. Az eredeti forrásadat megmarad.
- **Kevés UI:** a meglévő könyvtár, réteg-/tárgylista és tulajdonságpanel; kiválasztásfüggő térbeli fogantyúk. Az összes fény-, szórás- és kameraeszköz nem állandóan látható.

### Mi van már meg, és mi a valódi hiány?

**Alap:** 3D Terep, Gerincfelület, shaderes bolygó/testek, felhők, ég, egyes közös fényvezérlők, 2,5D kamera, receptek és külön GLB/anyag/szórás prototípusok.

**Hiány:** általános közös 3D jelenettér, több tárgy azonos kamerával/fénnyel/mélységgel, megbízható térbeli felületkijelölés és talajra helyezés, assethierarchia és importméret-normalizálás. A mai rétegenkénti saját 3D kamera és a sík rétegcsoport nem jelenti ezt. Külső GLB-k, anyagok, instancing és közös árnyék támogatása célzottan bizonyítandó.

### Javasolt szeletek

- **S0 – szűk közös tér kísérlet:** terep + három egyszerű valódi háló, egy kamera és fény; helyes takarás, mozgatás, mentés és undo. Még nincs nagy assetkatalógus vagy komplett új engine.
- **S1 – első használható tájépítő:** egy tájcsalád, kis kurált assetkészlet, talajra húzás, három fényhangulat, kameranézet mentése. Ez legyen az első érdemi felhasználói mérföldkő.
- **S2 – további családok:** növényszórás, víz, bolygó/horizont, atmoszféra, saját GLB és anyag; csak az elkészült adapterekkel.
- **S3 – mozgó jelenet:** közös kamerautak, szél és több felvétel; fizika csak indokolt opcionális viselkedés.

**Javasolt próbacél, még nem mért eredmény:** egy új felhasználó egy adott kurált készletből három assettel kb. öt percen belül segítség nélkül elkészít egy vállalható kompozíciót, kézzel fényértékek beállítása nélkül. Három nézetben helyes takarás, talajkapcsolat, újranyitás és export; a „szép” minőséget konkrét referenciaképek és Miksa próbája alapján ítéljük meg, nem csak automatikus mérőszámból.

## 2. AI-kép- és videógeneráláshoz filmes vázlatmód

Cél: a Velben gyorsan megadni a kompozíciót, kameranézetet, tárgyak helyét, léptékét, világítási szándékát és a mozgás ritmusát, majd ebből szerkeszthető referenciaanyagot kinyerni filmhez, animációhoz vagy generált jelenethez.

Ez ugyanannak a jelenetnek **vázlat-/felvételnézete**, nem második, külön adatformátumú szerkesztő. A szép táj és az egyszerű szürke vázlat között váltva a tárgyak és a kamera helye megmarad. Az első változat helyi export; konkrét AI-szolgáltatóhoz feltöltés vagy generálás külön későbbi adapter és döntés.

### Filmes munkafolyamat

1. **Felvételkártya:** képarány, jelenet-/snittnév és rövid szándék: például „totál, magányos figura a sziklán, lassú közelítés”.
2. **Gyors térbeli vázlat:** egyszerű helyettesítők – ember, autó, épülettömb, fa, kő. Első körben egy figura lehet sziluett/kapszula; pózolható rig külön fejlesztés. A cél a térbeli arány és a képkivágás, nem a végleges modell.
3. **Kamera és figyelem:** totál/közeli/alacsony nézet mint kiindulás; képen húzható célpont, horizont és egyszerű kompozíciós segédvonal. Pontos látószög csak a részletekben.
4. **Mozgás megmutatása:** kezdő- és végpozíció, útvonal, időtartam, mikor történjen az akció. Kameramozgás és szereplőmozgás külön sáv; a meglévő Vel-időből értékelve.
5. **Néhány felvétel:** ugyanabból a jelenetből több eltárolt kameraállás; kártyasorrend és rövid jegyzet. Különböző jelenetváltozatokat explicit kell menteni, a kameranézet mentése ne klónozza az egész világot.
6. **Referencia export:** egy tiszta kép, képsor/storyboard, kezdő-/zárókép vagy rövid vázlatvideó a rendelkezésre álló képességek szerint. A snittjegyzet és promptvázlat szerkeszthető marad.

### Hasznos kimenetek, képességenként

| Kimenet | Mire szolgál? | Feltétel / státusz |
|---|---|---|
| Tiszta referencia PNG | Kompozíció és fényhangulat | A jelenlegi PNG-export jó alap; felvételadat/UI új |
| Storyboard képrács + külön képek | Több snitt összehasonlítása | Felvételkártyák és exportösszeállító új |
| Kezdő-/zárókép | Mozgás végpontjainak megmutatása | Azonos scene-verzióból/időből renderelve; új csomagoló |
| Rövid MP4 / animatik | Kamera- és akcióritmus | Meglévő export + determinisztikus új kamera/tárgyadapter; nagy jelenetnél EXPORT-01 |
| Objektum-/sziluettmaszk | Elkülönített főtárgy és háttér | Külön object-ID/maszkpassz és helyes alfa kell; most nincs általánosan |
| Mélység / normál / éltérkép | Tér és forma további vezérlése | Közös 3D renderadat és passzexport kell; nem ígérhető minden régi sík rétegre |
| Felvételleírás és promptvázlat | Kamera, szereplő, mozgás, fény és stílus szándéka | Szerkeszthető sablon; nem garantálja egy generátor pontos követését |
| Projekt + exportmanifest | Ugyanaz a referencia újra elkészíthető | Scene-/shot-ID, időpont, seed, képarány, fájlnevek, ténylegesen elérhető passzok |

Az AI-modellek eltérően fogadnak referencia-, mélység-, első/utolsóképet és videót. Először szolgáltatófüggetlen fájlcsomag készüljön. Konkrét generátorkapcsolat csak friss, hivatalos dokumentáció ellenőrzése után tervezhető; e terv nem állít szolgáltatói támogatást. A generált eredmény ugyanazon kompozícióhoz később visszahozható összehasonlításra; a művelet nem írja felül a vázlatot.

### Tiszta UI és kontroll

- Egy munkafolyamat-váltó vagy munkatérpreset nyissa a vázlat-/felvételnézetet; ne új állandó fősávok és mindenhol AI-gombok jelenjenek meg.
- A vászon az elsődleges: helyettesítők húzása, kamerakép és mozgás megmutatása. A felvételkártyák csak ebben a nézetben láthatók.
- A kompozíciós segédvonal, objektumnév, pálya és fogantyú szerkesztési overlay; tiszta exportból alapból kimarad. Jegyzetes storyboard külön választható kimenet.
- Alapból néhány kontroll: képarány, kamera, hangulat, idő és export. A prompt nem óriási kötelező mező a vászon mellett.
- Stílus, világítás, kamera és geometria külön zárolható. Szürke vázlatra váltás nem törli a színeket vagy az anyagokat.
- Szemléletes mozgásnyilak képi jegyzetként vagy valódi pályaként egyértelműen eltérnek; az AI-nak szánt jelölést a felhasználó választja.

### Építési sorrend és próbák

- **P0 – egyszerű filmes kártyák:** meglévő rétegek/2,5D vagy szürke helyettesítők, mentett képkivágás és időpont, PNG + szerkeszthető jegyzet. Ez már a teljes új 3D tervező előtt is hasznos lehet.
- **P1 – közös 3D blockout:** SCENE-01 bizonyított közös kamerája és elhelyezése; három kameraállás, szereplő/camera út, kezdet/vég.
- **P2 – animatik és passzcsomag:** videó és külön renderpasszok, ahol a renderút ténylegesen támogatja. Következetes méret/fájlnév/frame és manifest.
- **P3 – opcionális generátoradapter:** szolgáltatóspecifikus export/feltöltés és eredmény-visszahozatal külön scope; nem az alapvázlatmód előfeltétele.

**Elfogadás:** ugyanaz a kompozíció színes és szürke módban; képkivágás nem ugrik a módváltástól; három snitt mentés/újranyitás után ugyanaz; kezdő-/zárókép a kijelölt időpontból; exportban nincs szerkesztő-overlay; ugyanabból a scene-verzióból minden passz azonos vetítéssel/idővel készül. Egyszerű animatiknál a kamera és akció ritmusa exportban is megmarad. Nincs előre ígért AI-generálási hűség.

## 3. Közös rendszer és a mostani fejlesztési terv

Közös assettár + scene-adat + transzformáció/hierarchia + kamera/felvétel + fény/környezet + anyag + idő + export. A meglévő könyvtári metaadat később jelölheti a blockout-helyettesítőket és scene-kompatibilitást; ehhez most nem kell egy teljes új mezőkészletet minden régi elembe beégetni.

- A négy fő könyvtári kategória megmarad. A 3D tájépítés és a vázlatolás munkatér/folyamat, nem új szerep minden elemhez.
- SCENE-01: BASE-02 konkrét közös 3D-döntés; BASE-01 tartós állapot; MEDIA-01 GLB csak akkor előfeltétel, ha külső modellek vannak a szeletben. Saját primitíves első prototípus korábban is készülhet.
- AI-PREVIZ-01: P0 nem vár a teljes 3D tájépítőre. P1 csak a tényleges közös kamera/scene bizonyítása után. Mélység/maszk/normal export képességkapu, nem automatikus ígéret.
- WORLD/MAT/PART/PATH/MOT/LINK/MEDIA/EXPORT első használható szeletei ebbe az irányba is adnak építőkövet; nem kell őket emiatt mind újrakezdeni.
- A jelenlegi CAT/UX és stabilitási munka folytatható. A későbbi fő cél segít elkerülni a zsákutcát, de nem indokol minden mai kis feladat előtt új 3D engine-t.

## 4. Multi-agent felosztás a későbbi hullámokhoz

A fő agent a közös 3D scene/camera/fény vagy a felvételadat/export egyetlen nagy szeletét implementálja. Egy segítő kurált, kis asset-/fénypreset-csomagot vagy shot-sablont készít külön adatfájlban; másik talajillesztés/takarás/újranyitás vagy exportkonzisztencia tesztet. A render/state/inspector közös fájloknak marad egyetlen írójuk.

Claude önállóan kereshet jobb, kisebb és kreatívabb megoldást, de a „pár kattintással szép táj” és a „generátornak gyors filmes vázlat” cél maradjon. Az első használható munkafolyamat előbb jöjjön, mint a teljes általános DCC-rendszer.

# FORM → Vel funkciómegőrzési és új UX-mátrix

**Minden sor kötelező tervezett integrációs tétel, nem kész Vel-funkció.** A FORM képességeit az átadó állítja; tényleges forrásvizsgálat még szükséges. A felhasználó mostani kéréséhez a rajz/ismétlés/asset funkciók is tartoznak, nem csak a négy fő generátor. A mátrix a dokumentumból ismert funkciókat fedi le; az SG-00 a forrásból előkerülő további tényleges képességekkel bővíti, nem szűkíti.

| ID | Család / képesség | Újrahasználható Vel-alap | Szükséges illesztés / megőrzendő határ | Feladat |
|---|---|---|---|---|
| SGF-001 | Blob – Organikus, harmonikus és csepp kontúrcsalád | EFFECTS és közös paraméterpanel | Az eredeti három képlet/karakter megőrzése, külön Vel Blob-követés típustól | SG-02 |
| SGF-002 | Blob – Méret, részletesség, szabálytalanság, feszesség | Animálható paraméterek és vászonfogantyú | Eredeti tartományok és közelítő területnormalizálás | SG-02 |
| SGF-003 | Blob – Harmonikus komponensek | Natív GLSL/adatmag | Nem egyszerű zajos körrel helyettesítendő | SG-02 |
| SGF-004 | Blob – Pointerreakció csillapított rugóval | Közös input és szimulációs életciklus | Freeze/replay és exportállapot; nem fluidmotor | SG-02 |
| SGF-005 | Blob – Amplitúdó, periódus, reakció és ritmus | Vel óra, LP1 és motion-paraméterek | Generátor belső mozgása a saját képlettel | SG-02 |
| SGF-006 | Pattern – 14 alapmotívum | Közös motívum-regiszter és selector | A pontos nevek és geometriák source-baseline-ban felsorolva | SG-02 |
| SGF-007 | Pattern – 6 kiosztás | Közös útvonal/elosztó, ahol egyenértékű | Mind a6 térbeli/mezőbeli elrendezés vizuális referenciával | SG-02 |
| SGF-008 | Pattern – Motívumkeverés és jitter | Seedelt paraméterek | Arányok és egyedi mintázat megtartása | SG-02 |
| SGF-009 | Pattern – Saját SVG vagy PNG motívum | Vel assets + importút | ViewBox/alpha/CORS és tartós függőség | SG-04 |
| SGF-010 | Pattern – Saját rajz motívumként | Közös vektordokumentum | Rajzeszközből közvetlen használat, export/import kerülő nélkül | SG-03 |
| SGF-011 | Pattern – Lottie-képkocka motívum | Meglévő Lottie Canvas→texture út | Frame-idő és az eredeti/editelt JSON eredet megőrzése | SG-04 |
| SGF-012 | Pattern – Közös mező az eltolásra, forgásra, méretre vagy mindháromra | Egy közös evaluator | Nem független véletlen animáció a mintapéldányokon | SG-02 |
| SGF-013 | Pattern – Nyugalom, haladó, sugárirányú, örvény- és állóhullám | Natív mezőshader és Vel-idő | Mind5 valódi hullám-/fázisműködés | SG-02 |
| SGF-014 | Pattern – Ismétlési és illeszkedési kontroll | Slot/capability és csempe-előnézet | Tetszőleges pattern seamless tulajdonsága nem garantált | SG-06 |
| SGF-015 | BG – Interferencia | Meglévő shaderút | FORM konkrét paraméteres interferencia, nem puszta moire névegyezés | SG-02 |
| SGF-016 | BG – Áramlásfüggvény-kontúrok | GLSL/effect regiszter | Egy matematikai rendszer, nem két háttérréteg | SG-02 |
| SGF-017 | BG – Mozgatott zajkontúrok | Zajmag és közös idő | Eredeti tér/idő skála és ritmus | SG-02 |
| SGF-018 | BG – Signal study harmonikus vonalmező | Natív render/evaluator | v8 eredeti vonalritmus és radiális késés | SG-02 |
| SGF-019 | Gradient – Hét karakter | Vel szín/GLSL/paraméterút | Mind7 karakter nevének/képletének/paraméterének forrásos rögzítése | SG-02 |
| SGF-020 | Gradient – Procedurális mozgás és textúra | Közös óra, shader és export | A paraméteres karakter ne váljon statikus PNG-vé | SG-02 |
| SGF-021 | Shape – Szabadkézi vonalból Bézier-kontúr | P2 input/simplify részben újrahasználható | Bézier, nyersrajz és fogantyú megőrzése | SG-03 |
| SGF-022 | Shape – Állítható simítás és sarokmegtartás | P2 és célzott geometria | Nyersből újraszámolható; ne kerekítsen el minden sarkot | SG-03 |
| SGF-023 | Shape – Végpontjavítás és geometriai igazítás | Közös snap/útvonaleszköz | Lokális geometriai javítás, nem AI szemantikus kiegészítés | SG-03 |
| SGF-024 | Shape – Nyitott/zárt görbék és primitívek | P2 forma és új vektordokumentum | Kontúronkénti állapot és végződések | SG-03 |
| SGF-025 | Shape – Kijelölés, mozgatás, méretezés, forgatás | Vel közös gesztus/undo | Draftkoordináták, nem scene-kamera módosítás | SG-03 |
| SGF-026 | Shape – Tükrözés és duplikálás | Közös műveleti eszközök | Stabil példányazonosítók és egy undo | SG-03 |
| SGF-027 | Shape – Helyi formálás | Célzott vektoralakító eszköz | Ne csak teljes alaktranszformáció legyen | SG-03 |
| SGF-028 | Shape – Union/subtract/intersect, lyukakkal | Közös Boolean-adapter; labor11 vizsgálható | Forrásbeli közelítés vizuális paritása, lyuk és fill-rule; nem CAD-pontosság ígérete | SG-03 |
| SGF-029 | Shape – Tükör- és radiális szimmetria | Közös példány-/transzformációadat | Másolatok önálló alakok, nem állítólagos élő constraint | SG-03 |
| SGF-030 | Shape – SVG és PNG export | Vel export és vektorszerializáló bővítés | Valódi vektor/raszter külön; alpha/viewBox/topológia | SG-07 |
| SGF-031 | Motion/Assets – Orbit, Pulse, Bloom saját minták | Vel motion és Lottie-asset út | Három eredeti minta, nem puszta név szerinti helyettesítés | SG-04 |
| SGF-032 | Motion/Assets – Hat airbnb/lottie-web MIT demo | Közös assetkönyvtár | Adrock, Bacon, Balloon banner, Dalek, Ronda, Bodymovin lettering; source/license baseline | SG-04 |
| SGF-033 | Motion/Assets – JSON/dotLottie/ZIP tömeges import | Vel Lottie-import és közös archiváló | Nem csak a mai2MB limit átírása; batch eredmény/limit és függőségek | SG-04 |
| SGF-034 | Motion/Assets – Közvetlen URL import | Közös importadapter | CORS, vektorprofil és forrásmetaadat; nem online katalogusnak nevezni | SG-04 |
| SGF-035 | Motion/Assets – Keresés, kedvencek és helyi tárolás | Vel Library/catalógus | Egy közös könyvtár, FORM saját IndexedDB nélkül | SG-04 |
| SGF-036 | Motion/Assets – Könyvtár ZIP backup | ULIB export és közös médiafüggőség | A használt editelt Lottie és importok új környezetben is helyreállnak | SG-05 |
| SGF-037 | Motion/Assets – Statikus fill/stroke és solid színcsere | Közös Lottie adapter és szín UI | Eredeti JSON + nem destruktív patch; animált szín/gradient nem támogatott v8-ban | SG-04 |
| SGF-038 | Motion/Assets – Root/precomp rétegek elrejtése | Közös Lottie adatmodell | Stabil, beágyazásban is egyértelmű rétegcímzés | SG-04 |
| SGF-039 | Motion/Assets – Reset, undo és projektmentés | Vel history + draft history | Eredeti adat megmarad; külön scope és tartós függőség | SG-05 |
| SGF-040 | Motion/Assets – Szerkesztett JSON export és Library-másolat | Közös serializer/ULIB | Player méret/pozíció/sebesség nem sül bele automatikusan | SG-07 |
| SGF-041 | Ikonok – 8252 Lucide/Tabler helyi ikon | Közös assetválasztó és lazy keresőindex | Pontos készlet/licenc source-ellenőrzés, nem 8252 azonnali renderer | SG-04 |
| SGF-042 | Ikonok – Keresés és gyűjteményszűrés | CAT keresőmetaadat | Helyi katalógus, nem LottieFiles/Iconify élő API | SG-04 |
| SGF-043 | Ikonok – Ikonból Pattern-motívum | Pattern bemeneti adapter | Közvetlen szerkesztő→motívum út | SG-04 |
| SGF-044 | Ikonok – SVG letöltés | Közös file-mentő | Eredeti viewBox és szerzői forrásadat | SG-07 |
| SGF-045 | Geometria – Kör, ellipszis, lekerekített téglalap, sokszög, csillag, vonal, ív | Vel forma és közös vektoradat | A7 geometriai alaptípus és tartománya fennmarad | SG-03 |
| SGF-046 | Geometria – Sor/kör/rács/útvonal ismétlés | P2 hossz szerinti mintavétel és instance-adat | Négy kiosztás, külön szerkeszthető elosztási paraméter | SG-03 |
| SGF-047 | Geometria – Taper és alapméret-arány megőrzése | Közös példányparaméterek | Az eredeti regressziós út arányait is tesztelni | SG-03 |
| SGF-048 | Geometria – Kör/ellipszis metaball | Célzott geometriai mag | Nem azonos a Vel 3D metagömbjével vagy Blob-követéssel | SG-03 |
| SGF-049 | Geometria – Slicing/résvágás | Közös kontúrművelet | Lyukak/élek és SVG eredmény megőrzése | SG-03 |
| SGF-050 | Geometria – Egyedi példányeltérések | Stabil ID/override adat | Alapméret/motívum változáskor ne vesszenek el | SG-03 |
| SGF-051 | Geometria – Presetek és műveletsor | ULIB + verziózott geometriai dokumentum | Nem lapított végeredmény; sorrend visszaállítható | SG-05 |
| SGF-052 | Geometria – JSON és SVG | Közös dokumentum/file út | Régi FORM formaállapot normalizálása és pontos exporthatár | SG-07 |
| SGF-053 | Közös v8 – 12 kreatív recept/kiindulópont | Vel recept- és makróút | Mind12 pontos receptlista source gate; szerkeszthető paraméteres csomag | SG-02 |
| SGF-054 | Közös v8 – Sötét/világos és alszerkesztő-téma | Vel közös téma/preferencia | Szerkesztőtéma nem ír alkotásszínt; FORM CSS nem külön appskin | SG-01 |
| SGF-055 | Közös v8 – Forma/Mozgás/Szín és lenyitható kiindulópontok | Vel inspector és részletek | Kompakt célzott panelek, nincs dupla transport vagy paraméter | SG-01 |
| SGF-056 | Közös v8 – Play/pause/scrub | Vel jelenetóra és transport | Solo és Scene időleképezése explicit | SG-01 |
| SGF-057 | Közös v8 – Folyamatos/lágy gyorsulás/lépés-kitartás/kettős impulzus | Vel időből értékelt generátormag | Mind 4 karakter megmarad; nem általános tweenhelyettesítés | SG-02 |
| SGF-058 | Közös v8 – Radiális fáziskésés | Seedelt/térbeli fázisadapter | Közös mező és exportazonosság | SG-02 |
| SGF-059 | Közös v8 – Alap animáció és reduced-motion | Vel preview/start preferencia | Csökkentett mozgás nem módosít mentett animációt | SG-01 |
| SGF-060 | Közös v8 – Randomize all aktív módra és palettára | Vel seed/draft undo; Q1 csak minőségvizsgálat | Minden támogatott kreatív mező, méret megmarad; nincs teljes scene-random | SG-02 |
| SGF-061 | Közös v8 – Random saját Pattern-motívumot generáltra cserél | Draft motívumref és előzmény | Átvett viselkedés világos scope-pal, eredeti asset nem törlődik | SG-02 |
| SGF-062 | Közös v8 – Explore 6 | Meglévő kurált thumbnail/seed út vizsgálható | Forrásbeli randomcsalád és az új közeli Variations külön | SG-02 |
| SGF-063 | Közös v8 – Verziózott projekt, külön módállapotok | Vel projekt/migráció + draftdokumentum | A négy mód állapota és importjai visszanyithatók | SG-05 |
| SGF-064 | Közös v8 – Külön Shape és Library mentés meglévő képességei | Egy Vel asset-/Library-rendszer | Hordozható teljes mentésben ne vesszenek el a korábban külön state-ek | SG-05 |
| SGF-065 | Közös v8 – Stabil példány-ID és régi migráció | Vel normalizálás és verziózott import | FORM oldalak és ismétlések ne kapjanak új azonosítót minden állításkor | SG-05 |
| SGF-066 | Közös v8 – PNG és PNG-képsor ZIP | Vel renderer/file/export | 120frame/150milliópixel source-keret; cancel és memória | SG-07 |
| SGF-067 | Közös v8 – Lottie30MB, archívum100MB; expression/külső képek tiltva | Közös validált import | Limitprofil és erőforrásmérés, nem korlátozás nélküli kibontás | SG-04 |
| SGF-068 | Közös v8 – Renderer és PNG azonos; pointer exportkor freeze | Vel exact frame/export és reakciósnapshot | Inputelőzmény/rugóállapot is kell a reprodukálhatósághoz | SG-07 |
| SGF-069 | Közös v8 – Régi két-rétegű maradványok kikapcsolva | Csak valódi v8 paraméterek portja | Régi v5/v6 maradványrétegek nem aktiválhatók vissza véletlenül | SG-00 |
| SGF-070 | Új UX – Két belépés: önálló és célhoz kötött | Egy fül/draft és input-session | Target projekt/jelenet/item/slot/revision rögzítve | SG-06 |
| SGF-071 | Új UX – Új ShapeGen fül bekapcsoláskor | Vel workspace bővítés | Appon belül, állapotőrzéssel; nem böngészőpopup | SG-01 |
| SGF-072 | Új UX – Négy fő mód és minden segédeszköz | Célzott nézet és közös Library | Rajz/Geometria/Assets minden funkció elérhető, clutter nélkül | SG-01 |
| SGF-073 | Új UX – Célfelirat és Alkalmazás/Mégse | Közös preview- és parancsút | A látható cél megegyezik a valós apply-céllal | SG-06 |
| SGF-074 | Új UX – Solo/Scene/Split | Ugyanaz a draft, Vel tényleges renderer | Kamera/effekt/maszk/idő változatlan; Split két nézete szinkron | SG-06 |
| SGF-075 | Új UX – Előnézet ideiglenes, apply egy undo | Runtime input override és commit | Mégse és késői async nem módosít projektet | SG-06 |
| SGF-076 | Új UX – From Library ugyanott, mint Add from Gen | Közös katalógus/filter/céladapter | Csak kompatibilis kimenetek; nem kötelező import-export kerülő | SG-06 |
| SGF-077 | Új UX – Library szerkeszthető alkotással és Edit in ShapeGen | ULIB + generatorforrás és függőségek | Seed/paletta/mozgás/assetref/verzió mind megmarad | SG-05 |
| SGF-078 | Új UX – Egykattintásos Library-mentés auto név/thumbnail | Közös tárolóreceipt és indexfrissítés | Átnevezés utólag; valódi tartósság vagy pontos memory-only jelzés | SG-05 |
| SGF-079 | Új UX – Alkalmazás + opcionális Library-mentés | Scene és Library eltérő tranzakció | Részleges siker és Undo határa egyértelmű | SG-06 |
| SGF-080 | Új UX – Kimenet a fogadó típusához igazítva | Slot capabilities | SVG/shape/pattern/BG/animált textúra eltérő indulás | SG-06 |
| SGF-081 | Új UX – Blob kontúr és feszesség vászoneszköz | Közös gesztus + valódi generátorparaméter | Numerikus fallback; karakter/paritás megmarad | SG-02 |
| SGF-082 | Új UX – Pattern távolság, irány, hullámközéppont | Közös mezőfogantyúk | Zoom és fizikai ismétlési skála külön | SG-02 |
| SGF-083 | Új UX – BG mezőközéppont, irány és frekvencia | Generátorhoz illesztett gesztus | Nem csak három változatlan csúszka átnevezése | SG-02 |
| SGF-084 | Új UX – Gradient színpontok, terjedés és keverés | Közös színeszköz + karakteradapter | Az eredeti7 karakter megőrzése vagy igazoltan jobb bővítés | SG-02 |
| SGF-085 | Új UX – Közös karakter/intenzitás/ciklushossz/ritmus/fázis | Vel óra és LP1 | Tekerés/mentés/export ugyanazt értékeli | SG-02 |
| SGF-086 | Új UX – Variations hat közeli rokonnal és eltérésvezérlővel | Seedelt draftváltozat és thumbnail-queue | Randomize teljes újirányát nem gyengíti | SG-02 |
| SGF-087 | Új UX – Korábbi generálások előző/következő útja | Draft history, snapshot és assetrefcount | Nem scene-undo navigáció és nincs elvesző import | SG-05 |
| SGF-088 | Új UX – Alapból csak aktuális felhasználás szerkesztése | Vel példány/eredet/verzió modell | Három használatból csak egy változik; közös eredeti külön | SG-05 |
| SGF-089 | Új UX – Tartós gépi szerkeszthető mentés | Verziózott generátordokumentum | Nem csak PNG és nem böngészőhelyi könyvtárkulcs | SG-05 |

## Paritás lezárása

Minden sorhoz a kódoló agent rendelje hozzá a tényleges forrásfüggvényt, az új Vel-adaptert és az elfogadási bizonyítékot. „Megvan hasonló a Velben” önmagában nem paritás. Az eredeti jó karakter/pontosság megőrzése és a közös rendszerbe való tényleges beilleszkedés együtt kell. A source-pending tételeket ne jelölje demonstráltnak.

A FORM-ban nem létező általános shader→SVG, generált Lottie-, MP4/WebM/GIF export, teljes timeline Lottie-editor, animált szín/gradient edit vagy élő constraint nem kerül kész v8 funkcióként a listába. A Vel saját videóexportja új integrációs lehetőség, nem forrásbeli képesség.

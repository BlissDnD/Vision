# Vel – teljes elemleltár és fejlesztési ötlettár

**Állapotfelvétel:** 2026-10-18; az alkalmazás forrásverziója: `0.36.0-g1`. **Cél:** egy helyen látni a meglévő könyvtárat, a külön prototípusokat, a fejlesztési lehetőségeket és az ezekből összeállítható recepteket. **Ez dokumentáció és ötlettár; nem új funkciók megvalósítása vagy beépítési ígéret.**

## Tartalom

1. [Állapotok és használat](#1-állapotok-és-használat)
2. [A Bolygó és a közös domborzat részletes terve](#2-a-bolygó-és-a-közös-domborzat-részletes-terve)
3. [Minden jelenlegi elemtípus](#3-minden-jelenlegi-elemtípus)
4. [Mind az 54 jelenlegi recept](#4-mind-az-54-jelenlegi-recept)
5. [A teljes könyvtár, polconként](#5-a-teljes-könyvtár-polconként)
6. [Paletták és végső képi stílusok](#6-paletták-és-végső-képi-stílusok)
7. [Mind a 63 külön bővítmény és a két layout](#7-mind-a-63-külön-bővítmény-és-a-két-layout)
8. [A korábban kért 20 fejlesztési irány](#8-a-korábban-kért-20-fejlesztési-irány)
9. [Új, részletes recept- és világötletek](#9-új-részletes-recept--és-világötletek)
10. [Megjelenésláncok és közös vezérlők](#10-megjelenésláncok-és-közös-vezérlők)
11. [Ajánlott építési sorrend és lefedettség](#11-ajánlott-építési-sorrend-és-lefedettség)

## 1. Állapotok és használat

**B = beépített:** benne van az alkalmazás jelenlegi forrásában/könyvtárában. Ez nem jelent minden elemre friss látványpróbát vagy hibamentességi igazolást. **P = külön prototípus:** van külön kód és példa, de még nincs a Velbe kötve. **Ö = ötlet:** új viselkedés vagy összetett recept terve. **R = részben:** valamely alap már van, a leírt egész még hiányzik.

A forrásból kiolvasott állapot: **72 elemtípus, 54 recept, 6 ráhúzható mozgás, 259 könyvtári bejegyzés, 18 paletta, 6 végső képi stílus**. A könyvtári szám polcbejegyzéseket jelent: például a világok receptként és a Világok polcon is szerepelnek. A 63 bővítmény és két layout ezen felül, külön laborban található.

**Hatókör:** a beépített katalógus és a fájlrendszerben elérhető saját minták. A felhasználó böngészőjének IndexedDB-jében mentett saját preseteket ez a forrásleltár nem látja; azok egy teljes Saját könyvtár-exporttal egészíthetők hozzá. Nem állítjuk, hogy azok is szerepelnek. A régi Látomás Stúdió archivált katalógusa nem a jelenlegi Vel leltára.

**Közös használat:** a Források és Formák új réteget adnak. A Receptek szerkeszthető rétegcsoportot állítanak össze, közös makrókkal. A Megjelenés rétegre húzva arra a rétegre hat, külön szűrőrétegként az alatta lévő képet módosíthatja. A Mozgások felső hat eleme ráhúzható mozgás; az alatta lévő Bento, szöveg és átmenet önálló tartalmi elem. A Részecskékre bontás Megjelenés, a képből képzett Részecskék külön forrás. A Lufi jelenleg csak Felhő rétegen hat.

**Közös vezérlés:** elhelyezés, méret, szög, átlátszóság, keverés; támogatott numerikus paraméterek kulcskockával, hullámmal és jelbemenettel mozgathatók. A kulcsírás Animálás módban történik. A folyamatos mozgások saját időfüggvényből futnak; a projekt Loopja és a réteg kulcs-Loopja külön fogalom. A kapcsolatok és jelenetsor együttes működésének korlátai továbbra is nyitottak.

**Forrásellenőrzés:** `app/src/library.ts`, `effects/*.ts`, `recipes.ts`, `motion.ts`, `state.ts`, `palettes.ts`, `FUNKCIO-LELTAR.md`, `HANDOFF.md`, `BUGS.md`; a labor `manifest.json`, `CATALOG.md`, `VALIDATION.md` és `layouts/README.md`. A felsorolást a deklaratív regiszterekből olvastuk ki; ez nem futási teszt. A működésleírás a kód és az átadók alapján készült; a marketingjellegű „valódi/fizikai” leírások alább pontosítva vannak.

## 2. A Bolygó és a közös domborzat részletes terve

### Bolygó – mit tud most? [B]

- Egy Bolygó-elem egy procedurálisan árnyalt bolygó képét rajzolja; hét típus: sziklás, óceán, gázóriás, jég, láva, sivatag, erdő. Magból új felszínváltozat készül.
- Méret, forgás, tengelyferdeség, napirány és napmagasság, kráter-/viharkarakter, felhőzet és felhőszél állítható.
- Van légköri peremderengés és annak saját színe, gyűrű a bolygó árnyékával, éjszakai városfény és palettás színezés. Ez látványshader, nem teljes fizikai légkörszimuláció.
- A felszín, felhőhéj, légkör, hátsó és első gyűrű külön is rajzolható. A „Bolygó rétegekből” már ezt használja.
- Második bolygóval most is készíthető hold: az „Óceánbolygó holddal” receptben már van. Önálló „Hold hozzáadása” komponens, a bolygóhoz kötött pálya és automatikus takarás még nincs. A Keringés mozgás jelenleg saját alaphely körül mozgat.
- A „Domborzat léptéke” a shader zajmintáját változtatja; nem emel valódi hegyeket a bolygó sziluettjébe. A 3D Terep valódi hálója már beépített, de Bolygóra vagy tetszőleges 3D tárgyra húzása még terv.

### Bolygó – hogyan lenne jobb? [Ö / a T2 irányával összhangban]

1. **Hold hozzáadása:** Bolygó kijelölése → „Hold” → méret, felszíntípus, távolság, pályasík és periódus. A hold követi a szülő mozgatását; külön forgás és keringés. Több hold egy közös vezérlőcsoportból. A látványos keringés és a gravitációszimuláció két külön választható működés legyen.
2. **Ráhúzható domborzat:** ugyanaz a seedelt magasságmező legyen alkalmazható sík Terepre, gömbre és később valódi hálóformákra. A gömbön 3D irányvektorból mintavételezés kell, hogy ne keletkezzen varrat a pólusokon/hosszúsági körön. Hegymagasság, finomság, gerincek, kráterek és óceánszint külön. A gázóriás alapból ne kapjon sziklás domborzatot.
3. **Közös felszínkomponens 3D formákon:** kőzetté tehető gömb, erodált kocka, sziklás betű vagy lebegő sziget. A shaderes SDF-test és a háromszögháló eltérő adaptert igényel; nem egyetlen univerzális kapcsolóval kész. Nagy deformációnál új normálok és önmetszés-kezelés szükséges.
4. **Szebb légkör:** nappali/éjszakai oldal külön erővel, naplementesáv, puha külső perem, állítható magasság és színgörbe. Jó minőségű, gyors művészi mód legyen előbb; összetettebb szórási modell opcionálisan.
5. **Háttérbe simulás:** a bolygó pereme részben vegye át a környező köd/ég színét; alul távolsági pára, finom kontraszt- és telítettségcsökkentés; választható ködréteg a bolygó elé. A háttérmintavétel és valódi mélység szerinti takarás új bemeneteket igényel. A teljes sziluett egyszerű elmosása ne legyen az alapmegoldás.
6. **Felszínszínek és gradiensek:** magasság-, lejtés- és biomfüggő színpontok. Tenger–part–erdő–szikla–hó; külön láva emisszió és jégfény. Palettaváltáskor a felszín szerkezete maradjon.
7. **Preset bolygók:** Földszerű; vörös sivatag; jeges hold; lila idegenvilág; türkiz óceán; gyűrűs pasztell gázóriás; sötét kéreg/láva; napfényes kopár hold. Ezek típus + beállítás + minőségi kompozíció csomagjai, minden érték tovább állítható.
8. **Közös csillagfény:** Nap kijelölése mint fényforrás; minden bolygó és hold abból számol nappalt és éjszakát. Fogyatkozás és egymásra vetett árnyék további lépcső.
9. **Ésszerű random:** külön újradobható felszín, színek, holdak és gyűrű; a kamera, főbolygó és szöveg zárolható. A napfény, légkör és háttér ne kapjon egymástól független, össze nem illő színt.

### Két kért receptcsalád

**Randomizálható naprendszer [Ö]:** csillagháttér → távoli köd/galaxis → központi csillag → 3–8 bolygó → holdak/gyűrűk → visszafogott fény és grade. Vezérlők: bolygószám, rendszerkiterjedés, pályasebesség, stílus, seed; bolygónként típus/méret/pálya. Első változat művészi, szerkeszthető elrendezés; tényleges térbeli pályák és kölcsönös árnyékok közös 3D jelenetet igényelnek.

**Űr-landscape [R alapok / Ö új recept]:** Űr → nagy háttérbolygó → távoli holdak → 3D Terep előtér → horizontpára → kő-/növényrészletek → főcím → közös színkorrekció. Makrók: napszak/fényirány, köd, bolygóméret, idegenség, seed. Már van „Csillagközi tájkép”, de a teljes terepes, összefényelt és randomizálható család új. A bolygók fényirányát kezdetben makró kapcsolhatja; fizikailag közös tér később.

## 3. Minden jelenlegi elemtípus

A következő 72 adatlap az összes regisztrált típus. A beállításlista a jelenlegi vezérlőket mutatja; a polcon szereplő konkrét változatokat az 5. fejezet sorolja. A paraméterek neve nem bizonyítja egy teljes fizikai modell meglétét.

### Gerincfelület — `surface3d` [B]

**Most / működés:** Valódi 3D felület egy szerkeszthető gerincgörbéből: széles, vékony, ívelt lap lekerekített éllel, fényes lakk/fém anyaggal, stúdiófénnyel, tükröző padlóval és a padlóba simulással. Háromszöghálóként renderelődik (gyors, élsimított), a kamera animálható; a 3D forgatás eszközzel (O) körbejárható.

**Jelenlegi vezérlők:** Ív (alap: 1); Szélesség (alap: 7); Vastagság (alap: 0.09); Szín (alap: #8e0c14); Érdesség (alap: 0.18); Fémesség (alap: 0.85); Lakkréteg (alap: 0.35); Padlóreflexió (alap: 0.9); Expozíció (réteg) (alap: 0.72); Elvékonyodás (alap: 0); Keresztirányú hajlítás (alap: 0.12); Lelógás eleje (alap: 0.9); Lelógás vége (alap: -1.2); Csavarodás (alap: 0); Padlóba simulás (alap: 0.35); Vörös tükröződés (alap: 0.92); Ezüst perem (alap: 0.9); Pontminta (alap: 0.8); Pontsűrűség (m) (alap: 0.035); Fénycsík helye (alap: 0.6); Fénycsík mérete (alap: 1); Fénycsík ereje (alap: 2.5); Hátsó fény (alap: 0.8); Stúdió fényereje (alap: 0.95); Padló [Nincs, Tükröző padló] (alap: Tükröző padló); Háttér [Átlátszó, Stúdió] (alap: Stúdió); Tükör elmosása (alap: 1); Kontaktárnyék (alap: 1); Kamera: körbe (°) (alap: -11); Kamera: magasság (°) (alap: -6); Kamera: távolság (alap: 8.4); Látószög (°) (alap: 62); Cél X (alap: 1); Cél Y (alap: 1.35); Cél Z (alap: -3).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Több szerkeszthető gerinc, vastagságprofil és sima végződés; saját anyagpresetek; ugyanazzal a felülettel szalag, fémlemez és textilsáv. Közös fényre és környezeti színre illesztés.

### 3D Terep — `terrain3d` [B]

**Most / működés:** Valódi 3D táj seedből: hegy, dűne, sziget, kanyon, fennsík vagy kráter, vízzel, égbolttal és vetett árnyékkal. A jelenetfényre reagál. A kockával új változatot dobsz; a vásznon húzva körbefordulsz, görgővel közelítesz. Magasságfüggvény: ZyFou/ProceduralTerrains (MIT) alapján.

**Jelenlegi vezérlők:** Tereptípus [Hegy, Dűne, Sziget, Kanyon, Fennsík, Kráter] (alap: Hegy); Mag (alap: 7); Stílus [Mérsékelt, Sivatag, Havas, Vulkáni, Idegen] (alap: Mérsékelt); Méret (mennyi táj) (alap: 0.9); Domborzat (alap: 1); Részletek (alap: 0.5); Vízszint (alap: 0.22); Háttér [Átlátszó, Égbolt] (alap: Égbolt); Pára a távolban (alap: 0.8); Expozíció (réteg) (alap: 1); Minőség [Vázlat, Normál, Részletes] (alap: Normál); Kamera: körbe (°) (alap: 32); Kamera: magasság (°) (alap: 26); Kamera: távolság (alap: 14); Látószög (°) (alap: 42); Cél X (alap: 0); Cél Y (alap: 0.6); Cél Z (alap: 0).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek.

### 3D objektum — `obj3d` [B]

**Most / működés:** Fizikai alapú (PBR) 3D test: környezeti fény, lágy árnyék, ambient occlusion, felületi textúra. A 3D forgatás eszközzel (O) húzva forgathatod.

**Pontosítás:** a kész testek itt shaderes/SDF-alapú térbeli renderből származnak; nem szabad összekeverni a Gerincfelület és a 3D Terep valódi háromszöghálójával. A „PBR” megnevezés anyagjellegű megvilágítást jelent, nem tetszőleges importált PBR-textúracsomag támogatását.

**Jelenlegi vezérlők:** Forma [Gömb, Tórusz, Kocka, Oktaéder, Merkaba, Giroid gömb, Tóruszcsomó, Dodekaéder, Ikozaéder, Metagömbök] (alap: Gömb); Anyag [Irizáló, Plazma, Bolygó, Hologram, Króm, Láva, Üveg, Normál-színek, Toon, Agyag, Gyöngyház, Bársony] (alap: Irizáló); Környezet [Stúdió, Naplemente, Kozmikus, Neon] (alap: Stúdió); Érdesség (alap: 0.4); Fémesség (alap: 0); Felületi textúra (alap: 0.15); Árnyék a talajon (alap: 0); Peremfény (alap: 0.6); Élsimítás [Gyors, 4× (lassabb)] (alap: Gyors); Torzítás (alap: 0.15); Forgás (alap: 0.3); Dőlés ° (alap: 20); Fordulat ° (alap: 0); Csavarás (alap: 0); Gyűrű (alap: 0); Anyag tempója (alap: 0.5); Jelenetfény hat rá [Nem, Igen] (alap: Igen).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell.

### Giroid-barlang — `gyroid` [B]

**Most / működés:** Végtelen 3D járat izzó membránfalakkal — beljebb repülsz.

**Jelenlegi vezérlők:** Sebesség (alap: 0.4); Sűrűség (alap: 2.2); Falvastagság (alap: 0.6); Gördülés (alap: 1); Fény (alap: 1.2).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Szerkeszthető repülési út, falanyag és rétegezett köd; elágazó járatok; lassú, nyugodt és gyors repülési preset. Villódzás és mintavételi zaj csökkentése.

### Alakzat — `shape` [B]

**Most / működés:** Vektoros forma. Maszkként is működik: a fölé tett rétegnél kapcsold be a „Vágás az alatta lévő rétegbe” opciót.

**Jelenlegi vezérlők:** Forma [Kör, Gyűrű, Téglalap, Sokszög, Csillag, Félhold, Vesica, Szív, Virág, Spirál, Szem, Kereszt, Végtelen, Dombvonal] (alap: Kör); Méret (alap: 0.3); Lágyság (alap: 0); Kitöltés [Szín, Paletta, Szivárvány] (alap: Paletta); Szín (alap: #ffffff); Arány (alap: 1); Lekerekítés (alap: 0.15); Oldalak / csúcsok (alap: 6); Belső arány (alap: 0.45); Gyűrű vastagsága (alap: 0.04); Körvonal (alap: 0); Színmozgás (alap: 0.3).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Szabadon szerkeszthető kontúr, animálható csúcspontok, valódi többszínű gradiens, külön kitöltés/körvonal. Formák összevonása, kivonása és varratmentes morfja.

### Plazma — `plasma` [B]

**Most / működés:** Hullámzó, lágy színmező.

**Jelenlegi vezérlők:** Sebesség (alap: 1); Nagyítás (alap: 1.5); Örvénylés (alap: 0.6); Sávok (alap: 1.2).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Lágy vagy éles karakter, több zajréteg, zajmag; paletta egyes színeinek zárolása. Hangra áramló háttér, amely nem vibrál túl.

### Tűz — `fire` [B]

**Most / működés:** Lobogó lángnyelvek alulról felfelé. A Palettás színezés a kiválasztott színekre hangolja.

**Jelenlegi vezérlők:** Magasság (alap: 0.75); Erő (alap: 1.1); Sebesség (alap: 1); Palettás színezés (alap: 0); Szélesség (alap: 0.55); Turbulencia (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Alul és oldalt elhelyezhető lángforrás, szélirány és színlépcsők; füst és parázs kapcsolása; lángcsóva formára vagy betűre illesztése.

### Sarki fény — `aurora` [B]

**Most / működés:** Hullámzó fényfüggönyök éjszakai égbolton.

**Jelenlegi vezérlők:** Sebesség (alap: 0.6); Magasság (alap: 0.5); Rétegtávolság (alap: 1); Fény (alap: 1.2); Csillagok (alap: 0.8).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Több különálló fényfüggöny, horizontmaszk és térmélység; szabályozható színátmenet; felhő és táj mögé illesztés, visszafogott csillagfény.

### Csillagköd — `nebula` [B]

**Most / működés:** Örvénylő ködfelhő pislákoló csillagokkal.

**Jelenlegi vezérlők:** Sebesség (alap: 0.5); Nagyítás (alap: 1.8); Örvénylés (alap: 3); Fényesség (alap: 1.1); Csillagok (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Külön köd-, por- és csillagréteg; komponensenkénti szín és mélység; bolygó mögötti ellenfény, kamerahelyzettel összehangolt parallax.

### Folyékony márvány — `liquid` [B]

**Most / működés:** Önmagába tekeredő, olajszerű áramlás.

**Jelenlegi vezérlők:** Sebesség (alap: 1); Nagyítás (alap: 3); Torzítás (alap: 1); Sávok (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Színfoltok és áramlási irány kézi elhelyezése; sebesség helyett örvénykarakter is állítható. Valódi festékmező külön módként, a jelenlegi shaderes márvány megtartásával.

### Féreglyuk — `tunnel` [B]

**Most / működés:** Végtelen téridő-alagút csavarodó gyűrűkkel.

**Jelenlegi vezérlők:** Sebesség (alap: 0.6); Csavarás (alap: 1); Gyűrűk (alap: 8); Szegmensek (alap: 8); Fény (alap: 1.2).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Saját keresztmetszet, kanyargó pálya és falanyag; belépési/kilépési szakasz; a kameramozgás és a textúrafolyás külön vezérlése.

### Szent geometria — `sacred` [B]

**Most / működés:** Életvirág, egymásba forduló háromszögek, pulzáló körök.

**Jelenlegi vezérlők:** Sebesség (alap: 0.4); Sugár (alap: 0.22); Sokszög oldalai (alap: 6); Körkoszorúk (alap: 2); Vonalvastagság (alap: 0.6); Fény (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Geometriai családok külön presetekkel, vonalrajzolási animáció, csomópontok díszítése; lépcsőzetes kibomlás és képarányhoz illeszkedő kompozíció.

### Fraktálvirág — `kali` [B]

**Most / működés:** Kaleidoszkopikus fraktál mélyülő indákkal.

**Jelenlegi vezérlők:** Sebesség (alap: 0.3); Nagyítás (alap: 1.2); Alak (alap: 0.75); Mélység (alap: 10); Élesség (alap: 4); Csavar (alap: 0); Fény (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Kedvenc nézetek, részletességi profil, palettazárolás; lassú, vágás nélkül körbeérő fraktálmorf. Finom vonalak stabil élsimítása.

### Julia-portál — `julia` [B]

**Most / működés:** Folyton átalakuló Julia-halmaz.

**Jelenlegi vezérlők:** Sebesség (alap: 0.4); Paraméter (alap: 0.7885); Iteráció (alap: 100); Színsávok (alap: 1.5); Mag fénye (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Menthető érdekes paraméterpárok, kézzel kijelölt nagyítási középpont, részletességhez kötött iteráció; visszatekerhető utazások a halmazon.

### Interferencia — `moire` [B]

**Most / működés:** Mozgó hullámforrások moaré-mintázata.

**Jelenlegi vezérlők:** Sebesség (alap: 0.6); Forrástávolság (alap: 0.25); Frekvencia (alap: 10); Kontraszt (alap: 0.8).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Külön mozgatható hullámforrások; interferencia több alakból; exportfelbontáshoz igazodó sűrűség, hogy ne legyen nem kívánt vibrálás.

### Hipertér — `hyper` [B]

**Most / működés:** Fénysebességű csillagcsíkok.

**Jelenlegi vezérlők:** Sebesség (alap: 1); Sűrűség (alap: 60); Csíkhossz (alap: 1); Fény (alap: 1.3).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Színes csillagosztályok, gyorsulás/fékezés és irányított ugrás; kamerarázás külön mozgásként; csíkhossz és fényerő biztonságos összekötése.

### Hologramrács — `grid` [B]

**Most / működés:** Végtelen sci-fi rácsmező csíkos nappal.

**Jelenlegi vezérlők:** Sebesség (alap: 1); Horizont (alap: 0.05); Rácssűrűség (alap: 1); Nap (alap: 1); Fény (alap: 1.2).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Szabad horizont, eltérő rácscellák, rácsra illesztett objektumok; nap és ég külön darabokként; perspektíva és kamera összehangolása.

### Eseményhorizont — `blackhole` [B]

**Most / működés:** Fekete lyuk akkréciós koronggal és fényelhajlással.

**Jelenlegi vezérlők:** Sebesség (alap: 0.5); Méret (alap: 1.2); Lencsehatás (alap: 1); Dőlés (alap: 0.25); Fény (alap: 1.2).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Külön akkréciós korong, por és háttérlencsézés; forgásirány, koronghőmérséklet és megfigyelési szög. Ne csak saját háttérképet, hanem kijelölt jelenetrétegeket is hajlítson.

### Színátmenet — `gradient` [B]

**Most / működés:** Lassan vándorló háttérszín a palettából.

**Jelenlegi vezérlők:** Típus [Lineáris, Sugaras] (alap: Sugaras); Terjedelem (alap: 0.8); Sebesség (alap: 0.2).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Színpontok közvetlen szerkesztése, lineáris/sugárirányú/konikus és hálós átmenet; érzékelésalapú színinterpoláció; sávosodást csökkentő finom dithering.

### Galaxis — `galaxy` [B]

**Most / működés:** Spirálkarú galaxis differenciális forgással és csillagporral (a three.js galaxis-generátor ihlette).

**Jelenlegi vezérlők:** Karok (alap: 3); Csavarodás (alap: 1.2); Sűrűség (alap: 1); Mag fénye (alap: 1); Forgás (alap: 0.25); Kiterjedés (alap: 0.8).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Spirál-, elliptikus és szabálytalan galaxis; külön csillag- és porkomponens; közelítéskor részletességváltás, felismerhető karokkal. A shaderes látvány mellé valódi részecskés változat.

### Részecskehullám — `waves` [B]

**Most / működés:** Perspektivikus pontmező, amely tengerként hullámzik (a three.js points/waves példa ihlette).

**Jelenlegi vezérlők:** Hullámzás (alap: 1); Sűrűség (alap: 1); Sebesség (alap: 1); Pontméret (alap: 0.6); Hullámhossz (alap: 1.2); Kameramagasság (alap: 1.2); Fény (alap: 1.2).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Kijelölt ponton hullámindítás, több hullámforrás, szélirány és csillapítás; valódi mélységi árnyalás; alak- és képalapú részecskehullám.

### Lávalámpa — `lava` [B]

**Most / működés:** Lassan összeolvadó, lebegő metaball-cseppek, átlátszó háttérrel.

**Jelenlegi vezérlők:** Cseppek (alap: 7); Méret (alap: 0.18); Sebesség (alap: 1); Lágyság (alap: 0.4); Peremfény (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Cseppek külön megfogása, vonzás/taszítás és alakba rendeződés; üvegpalack-maszk és anyagváltozatok. A 2D lávalámpa és a 3D metagömb maradjon megkülönböztethető.

### Sejtszövet — `cells` [B]

**Most / működés:** Élő Voronoi-sejtek izzó határokkal — organikus sci-fi textúra.

**Jelenlegi vezérlők:** Sejtméret (alap: 5); Sebesség (alap: 0.8); Határfény (alap: 1.2); Sejtkitöltés (alap: 0.8); Határvastagság (alap: 1); Színváltozatosság (alap: 0.6).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Sejtalakok szerkesztése, növekedés/osztódás; határvonalak külön színe; Voronoi-darabokra törő átmenet ugyanebből a mintából.

### Lencsefény — `flare` [B]

**Most / működés:** Fényforrás sugarakkal, anamorf csíkkal és szellemképekkel. Húzd a fényforrást oda, ahová szeretnéd.

**Jelenlegi vezérlők:** Fényerő (alap: 1); Sugarak (alap: 6); Anamorf csík (alap: 1); Szellemképek (alap: 1); Halo (alap: 0.6); Vibrálás (alap: 0.3).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Kapcsolás Naphoz vagy kijelölt fényhez, képszélen természetes halványulás; alakú apertúra és menthető objektívpreset; takarás figyelembevétele később.

### Szöveg — `text` [B]

**Most / működés:** Felirat palettás csillogással és ragyogással. Több sor is lehet (Enter), balra, középre vagy jobbra zárva.

**Jelenlegi vezérlők:** Színezés (alap: 0.7); Ragyogás (alap: 1); Színterjedés (alap: 0.6); Csillogás (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Gazdag soronkénti és betűnkénti tipográfia, saját font kezelése, útvonalas felirat. Árnyék/körvonal/gradiens közös szöveganyagként; 3D extrudálás és lufibetű külön fejlesztés.

### Kép — `image` [B]

**Most / működés:** Saját kép rétegként — fotó, logó, textúra.

**Jelenlegi vezérlők:** Fényerő (alap: 1); Telítettség (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Kivágás és fókuszpont a vásznon, képcsere a beállítások elvesztése nélkül, beágyazás/hiányzó média jelzése; maszk és mélységtérkép.

### Vektoranimáció — `lottie` [B]

**Most / működés:** Saját vektoros Lottie-animáció. A média kezdése, sebessége és Loopja külön állítható a kulcsanimációtól.

**Jelenlegi vezérlők:** Fényerő (alap: 1); Telítettség (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Kép-, szöveg- és fontfüggőségek ellenőrzött támogatása; animációszegmensek és színcsere; online gyűjtemény keresése csak külön importlépésként. A mostani korlátozott vektorimport maradjon kiszámítható.

### Saját GLSL — `custom` [B]

**Most / működés:** Saját shader élőben. IN(uv) az alatta lévő kép, így szűrőt is írhatsz.

**Jelenlegi vezérlők:** p_a (alap: 0.5); p_b (alap: 0.5); p_c (alap: 0.5); p_d (alap: 0.5).

**Használat:** Saját GLSL rétegként szerkeszthető; az IN(uv) az alatta lévő képet olvassa. A valódi, tetszőleges saját ráhúzható Megjelenés külön hiányzó funkció. A jelenlegi saját shaderhez legfeljebb 8 elnevezett numerikus vagy színvezérlő adható; ezek a beépített paraméterekhez hasonlóan animálhatók. Enélkül a p_a–p_d alapcsúszkák maradnak.

**Jobbá tétel [Ö]:** Tényleges ráhúzható saját Megjelenés, szín- és képvezérlők, shaderhiba érthető helye; előnézet és költségjelzés; saját shadercsomagok importja ellenőrzéssel.

### Elmosás — `blur` [B]

**Most / működés:** Lágy Gauss-elmosás. Alakzatra húzva puha szélű maszkot kapsz.

**Jelenlegi vezérlők:** Erősség (alap: 2).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Irányított, mélységalapú és mozgásból eredő elmosás külön módok; maszk peremének megtartása; előnézet/export azonos karakterrel.

### Ragyogás — `glow` [B]

**Most / működés:** Puha, kétlépcsős Gauss-ragyogás: a fényes részek szétsugároznak.

**Jelenlegi vezérlők:** Erősség (alap: 1); Sugár (alap: 1.5); Küszöb (alap: 0.35).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Fény színe és több mérettartomány, puha váll a csúcsfényeken; a részleteket megőrző bloom. Fényforráshoz kapcsolható erő, felbontástól független sugár.

### Téridő-görbület — `lens` [B]

**Most / működés:** Gravitációs lencse és téridő-hullámok a réteg középpontja körül. Húzd oda, ahol hajlítani akarsz.

**Jelenlegi vezérlők:** Tömeg (alap: 1); Gravitációs hullám (alap: 0.6); Fekete mag (alap: 0.8); Gyűrűfény (alap: 0.8); Hullámsűrűség (alap: 1); Sebesség (alap: 1).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Választható bemeneti réteg, több lencseközéppont, maszkból képzett lencse; előnézetben látható hatósugár és kontrollált szélkezelés.

### Kaleidoszkóp — `kaleido` [B]

**Most / működés:** Tükrös szeletekre bontja az alatta lévő képet.

**Jelenlegi vezérlők:** Szeletek (alap: 8); Pörgés (alap: 0.3); Nagyítás (alap: 1); Szög (alap: 0); Mintavételi eltolás (alap: 0.15).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Szeletközéppont fogantyú, többszintű szimmetria, varratkezelés; szimmetriaváltás sima átmenettel és megtartható főmotívummal.

### Visszhang — `feedback` [B]

**Most / működés:** Feedback-hurok: az előző képkocka nagyítva, forgatva visszaíródik — végtelen csóvák.

**Jelenlegi vezérlők:** Lecsengés (alap: 0.92); Zoom (alap: 1.2); Forgás (alap: 0.6); Színvándorlás (alap: 1); Remegés (alap: 0.3); Mód [Fényes, Keverés] (alap: Fényes).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Visszatekeréshez és exporthoz reprodukálható előmelegítés/állapot; csóvák színe és maszkja; lerakódás törlése egy kattintással. Különösen fontos: ez valóban előző képkockás állapotot használ.

### Örvény — `swirl` [B]

**Most / működés:** Spirálba csavarja a képet a középpont körül.

**Jelenlegi vezérlők:** Erősség (alap: 1.5); Hatósugár (alap: 0.5); Pörgés (alap: 0.4).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Több helyi örvény, vásznon állítható középpont és sugár; formakövető sodrás, nyugodt és robbanó karakter.

### Organikus torzítás — `warp` [B]

**Most / működés:** Zajjal hullámoztatja a képet. Maszkra húzva élő, lélegző széleket ad.

**Jelenlegi vezérlők:** Erősség (alap: 0.6); Lépték (alap: 1.2); Sebesség (alap: 0.4).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Ráhúzható deformációs tér: irány, skála, seed, időfázis; varratmentes loop. Közös zajforrás több réteghez.

### Hullámzás — `ripple` [B]

**Most / működés:** Koncentrikus vagy vízszerű hullámtorzítás.

**Jelenlegi vezérlők:** Típus [Sugaras, Vízfelszín] (alap: Sugaras); Erősség (alap: 1); Frekvencia (alap: 1); Sebesség (alap: 1).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Kattintással indítható hullámfrontok, pontból/vonalból/formából induló hullám, csillapítás és ütköző hullámok; külön víztükör és hőremegés preset.

### Fénysugarak — `radial` [B]

**Most / működés:** Isteni sugarak: a fények a középpontból sugároznak ki.

**Jelenlegi vezérlők:** Erősség (alap: 1); Hossz (alap: 1.2); Küszöb (alap: 0.3).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Kijelölt Naphoz kötés, fénysugarak takarásmaszkja és színe; sugárszám, puhaság és hossz külön, képkivágáson kívüli forrás kezelése.

### Neon körvonal — `edge` [B]

**Most / működés:** Izzó vonalat rajzol a formák szélére. Alakzatokon és szövegen különösen szép.

**Jelenlegi vezérlők:** Erősség (alap: 1.5); Vastagság (alap: 1.5); Csak a vonal (alap: 0); Színmozgás (alap: 0.5).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Belső/külső körvonal, többszínű perem, vonalon végigfutó fény; sarkok és vékony betűk stabil kezelése, anyagszerű neonüveg.

### Tükör — `mirror` [B]

**Most / működés:** Szimmetria: félbe, négybe vagy nyolcba tükrözve.

**Jelenlegi vezérlők:** Szimmetria [Bal-jobb, Fent-lent, Négyes, Nyolcas] (alap: Négyes).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Tengely fogantyúval, eltolt szimmetria, kaleidoszkóppal közös vezérlés; szabad tükrözési maszkrégió.

### Poláris tér — `polar` [B]

**Most / működés:** Az alsó képet körbe vagy alagútba hajlítja.

**Jelenlegi vezérlők:** Típus [Körbe, Alagút] (alap: Alagút); Nagyítás (alap: 1); Ismétlés (alap: 2); Sebesség (alap: 0.5); Pörgés (alap: 0).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Középpont, kezdőszög, varrat elrejtése; feliratból körpecsét és alagút; az eredeti arányok megtartásának kapcsolója.

### Kromatikus aberráció — `chroma` [B]

**Most / működés:** Szétcsúsztatott RGB-csatornák.

**Jelenlegi vezérlők:** Erősség (alap: 1); Lüktetés (alap: 0.3); Irány [Vízszintes, Sugaras] (alap: Sugaras).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Csak képszéleken vagy fényes részeken hasson; külön radiális és irányított csatornaeltolás; tipográfiához gyenge, olvasható preset.

### Pszichedelikus színezés — `psycolor` [B]

**Most / működés:** A fényerőt végigfuttatja a palettán.

**Jelenlegi vezérlők:** Erősség (alap: 0.8); Ciklusok (alap: 2); Sebesség (alap: 1).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Saját színlépcsők, bőrtónus/semleges színek védelme; maszkolható színcsere, átlátszóság megőrzése.

### Színkorrekció — `grade` [B]

**Most / működés:** Árnyalat, telítettség, kontraszt, fényerő.

**Jelenlegi vezérlők:** Telítettség (alap: 1.2); Kontraszt (alap: 1.1); Fényerő (alap: 1); Árnyalat (alap: 0); Invertálás (alap: 0).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Árnyék/középtónus/csúcsfény külön, fehéregyensúly és görbék; LUT-import; referenciához színhangolás kézi finomítással.

### Glitch — `glitch` [B]

**Most / működés:** Sávos elcsúszás, RGB-szakadás, pixelesítés.

**Jelenlegi vezérlők:** Erősség (alap: 0.6); Gyakoriság (alap: 1); Pixelméret (alap: 0); Sávméret (alap: 1).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Jelzésre induló rövid események, sáv- és csatornapresetek, seed és fagyasztás; a főcímet védő maszk, olvashatósági korlát.

### Film és szemcse — `film` [B]

**Most / működés:** Filmszemcse, képsorok, vignetta.

**Jelenlegi vezérlők:** Szemcse (alap: 0.5); Vignetta (alap: 0.8); Képsorok (alap: 0.3).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Felbontástól független szemcseméret, színes/fekete-fehér szemcse, árnyalatfüggő erő; finom papír- és filmanyag közös skálázással.

### CRT-képernyő — `crt` [B]

**Most / működés:** Régi tévé- vagy monitorképernyő: domború üveg, lekerekített sarkok, képsorok, RGB-maszk és enyhe villódzás. Szövegre, képre, csoportra vagy az egész jelenetre húzható.

**Jelenlegi vezérlők:** Domborúság (alap: 0.35); Képsorok (alap: 0.45); RGB-elcsúszás (alap: 1.5); Sorok száma (alap: 300); RGB-maszk (alap: 0.25); Zaj (alap: 0.08); Vignetta (alap: 0.4); Saroklekerekítés (alap: 0.08); Villódzás (alap: 0.15).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Képernyőarány, foszforpreset, üvegcsillanás és választható jelhiba; szöveghez olvasható finom mód. Külön kijelzőtest és kép torzítása a termékjelenetekhez.

### Színes vetett fény — `castlight` [B]

**Most / működés:** Hosszú, színes fénycsóva vagy árnyék a betűk és formák mögött; a körvonalat követi, a háttér átlátszó marad. Szövegre vagy alakra húzd.

**Jelenlegi vezérlők:** Irány (alap: 315); Hossz (alap: 0.18); Erősség (alap: 1); Lecsengés (alap: 0.5); Szín (közel) (alap: #ff4fb8); Szín (távol) (alap: #4f6bff).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Fényirány-fogantyú, több színállomás és spektrum, lágyulás a távolsággal; objektum mögötti takarás, külön árnyék/fénycsóva mód.

### Textúra — `texture` [B]

**Most / működés:** Anyagszerűség a képen: papír, vászon, por és karcok, kőzet vagy finom zaj. Ettől lesz a kép tapintható.

**Jelenlegi vezérlők:** Anyag [Papír, Vászon, Por és karcok, Kőzet, Finom zaj] (alap: Papír); Erősség (alap: 0.35); Lépték (alap: 1); Mozgás (alap: 0).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Saját textúra import, objektumhoz kötött skála, két anyagréteg és domborítás; a képsíkra tett szemcse és a valódi 3D anyag megkülönböztetése.

### Blob-követés — `blob` [B]

**Most / működés:** Megkeresi és követi a fényes, sötét, mozgó vagy színes foltokat az alatta lévő képen, és HUD-jelölőkkel, vonalakkal, feliratokkal rajzolja meg őket. Rétegre húzva csak azt az egy réteget követi.

**Jelenlegi vezérlők:** Mit kövessen [Fényesség, Sötétség, Mozgás, Színesség, Véletlen pontok] (alap: Fényesség); Észlelés [Foltok, Csúcspontok] (alap: Csúcspontok); Küszöb (alap: 0.55); Darabszám (alap: 14); Pontok távolsága (alap: 6); Min. foltméret (alap: 4); Észlelési felbontás (alap: 128); Simítás (alap: 0.6); Kitartás (képkocka) (alap: 8); Véletlen mozgás (alap: 1); Jelölő [Keret, Sarkok, Kör, Célkereszt, Pont, Rombusz, Nincs] (alap: Keret); Szín (alap: #ffffff); Színezés [Egyszínű, Paletta, Színváltó] (alap: Egyszínű); Méret [Folt szerint, Fix] (alap: Fix); Dobozméret (alap: 0.07); Méretszorzó (alap: 1.2); Vonalvastagság (alap: 1.5); Kitöltés (alap: 0); Vonal [Folytonos, Szaggatott] (alap: Folytonos); Vezetővonalak [Ki, Be] (alap: Ki); Remegés (alap: 0); Villogás (alap: 0); Összekötés [Nincs, Lánc, Legközelebbi, Hálózat, Középpontba] (alap: Legközelebbi); Szomszédok száma (alap: 1); Hálózat távolsága (alap: 0.3); Görbület (alap: 0); Vonalak erőssége (alap: 0.6); Felirat [Nincs, Azonosító, Koordináták, Pixel, Méret, Hex, Saját sablon, ID + koordináta] (alap: ID + koordináta); Betűméret (alap: 11); Betűtípus [Mono, Sans, Orbitron, Major Mono] (alap: Mono); Stílus [Szöveg, Címke] (alap: Szöveg); Karakterkeverés (alap: 0); Hatás [Nincs, Invertálás, Pixelesítés, Hőkamera, Színfordítás, Fekete-fehér, Kiemelés, Elmosás] (alap: Nincs); Erősség (alap: 1); Pixel / elmosás mérete (alap: 10).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Követési pontokból más rétegek vezérlése, kijelölhető célfolt és stabil azonosítók; kevesebb elvesző címke, hálózati sűrűségkorlát; szerkeszthető adatfelirat.

### ASCII — `ascii` [B]

**Most / működés:** Karakterekből rakja ki az alatta lévő képet (a three.js AsciiEffect ihlette).

**Jelenlegi vezérlők:** Karakterméret (alap: 10); Szín [Eredeti, Paletta, Mátrix-zöld, Fehér] (alap: Eredeti); Kontraszt (alap: 1.2); Irány [Normál, Fordított] (alap: Normál); Háttérkép (alap: 0).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Saját karakterkészlet/font, fényesség szerint kalibrált karakterek, külön előtér/háttér; Unicode és saját szimbólumok, időben stabil mintavétel.

### Féltónus — `halftone` [B]

**Most / működés:** Nyomdai raszterpöttyök — színes, RGB vagy újságpapír stílusban.

**Jelenlegi vezérlők:** Raszterméret (alap: 9); Stílus [Színes pöttyök, RGB-raszter, Újságpapír] (alap: Színes pöttyök); Szög (alap: 0.4); Pöttyméret (alap: 1).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Valódi CMYK jellegű raszter, nyomdai színek és papír; nézetfüggetlen pontméret, moaré elleni mintavétel; animálható nyomási hiba.

### Pixel art — `pixelart` [B]

**Most / működés:** Retró pixelgrafika színszint-csökkentéssel és Bayer-ditheringgel.

**Jelenlegi vezérlők:** Pixelméret (alap: 6); Színszintek (alap: 5); Dithering (alap: 0.6); Színek [Eredeti, Paletta] (alap: Eredeti).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Menthető korlátozott paletták, választható dithering, képpontokhoz igazított kamera; részletmegőrző méretezés, szöveg kivétele a pixelesítésből.

### Bolygó — `planet` [B]

**Most / működés:** Bolygó-stúdió: hét bolygótípus, valódi légköri derengés, forgó felhők, éjszakai városfények, gyűrű árnyékkal. A Mag (seed) mellett a kockával új bolygót dobsz.

**Pontosítás:** a felszín részletessége shaderes; valódi domborzatos sziluett, szülőhöz kötött holdpálya és automatikus közös napfény nincs. Lásd a 2. fejezetet.

**Jelenlegi vezérlők:** Típus [Sziklás, Óceán, Gázóriás, Jég, Láva, Sivatag, Erdő] (alap: Óceán); Mag (alap: 7); Méret (alap: 0.3); Nap iránya ° (alap: 35); Nap magassága (alap: 0.15); Légkör (alap: 1); Légkör színe (alap: #5aa8ff); Felhőzet (alap: 0.5); Felhők szele (alap: 0.6); Városfények (alap: 0); Gyűrű (alap: 0); Gyűrű dőlése ° (alap: 18); Forgás (alap: 0.2); Tengelyferdeség ° (alap: 15); Kráterek / viharok (alap: 0.5); Domborzat léptéke (alap: 1); Palettás színezés (alap: 0); Réteg [Teljes bolygó, Csak felszín, Csak felhőhéj, Csak légkör, Csak gyűrű – hátsó fele, Csak gyűrű – első fele] (alap: Teljes bolygó).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek.

### Égbolt — `sky` [B]

**Most / működés:** Égbolt-stúdió (Bliss): napszak szerinti égszín, felhőtípusok saját randomizálóval, dombos táj, pára és fénysugarak.

**Elérhetőség:** regisztrált típus, de a jelenlegi Világok polc inkább külön világdarabokat és recepteket kínál; nincs külön Égbolt-stúdió csempe a `library.ts`-ben.

**Jelenlegi vezérlők:** Felhők [Gomoly, Fátyol, Réteg, Vihar] (alap: Gomoly); Mag (alap: 3); Napszak (nap magassága) (alap: 0.55); Nap vízszintesen (alap: 0.35); Borítottság (alap: 0.45); Felhők mérete (alap: 1); Szél (alap: 0.3); Dombok (alap: 1); Horizont (alap: -0.18); Fű színe (alap: #3f8f2a); Pára (alap: 0.35); Fénysugarak (alap: 0.3).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** A monolitikus égbolt darabokra bontható receptté alakítása; közös napszak/szél/fényvezérlés, saját zenit- és horizontszínek. Új égboltvariánsok ugyanazon kompozíció megtartásával.

### Űr — `space` [B]

**Most / működés:** Csillagközi tájkép alapja: valós színű csillagok több mélységben, Tejút porsávokkal, csillagköd, diffrakciós tüskés fényes csillagok.

**Jelenlegi vezérlők:** Mag (alap: 11); Csillagok (alap: 1); Tejút (alap: 1); Tejút dőlése ° (alap: 25); Porsávok (alap: 0.8); Köd (alap: 0.6); Fényes csillagok (alap: 0.5); Pislákolás (alap: 0.3); Sodródás (alap: 0.1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Csillagok, Tejút, por és köd külön vezérelhető darabok; csillagszín/pontméret és mélység; kijelölt kompozíciós fókusz körül nyugodtabb háttér; nagyfelbontású stabil csillagok.

### Bokeh — `bokeh` [B]

**Most / működés:** Életlen fénykorongok sötét háttéren — mozi- és termékfilm-hangulat.

**Jelenlegi vezérlők:** Darabszám (alap: 24); Méret (alap: 1); Lágyság (alap: 0.6); Fényerő (alap: 1); Sodródás (alap: 0.4).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Objektívformák, fókusz- és mélységalapú korongméret, irányított sodródás; a főcím mögötti fények automatikus visszafogása és saját színpaletta.

### Égszín — `skygrad` [B]

**Most / működés:** Napszak szerinti égbolt-színátmenet: zenit, horizont, alkony, éjszaka. A Nap, a Felhőréteg, a Talaj és a Pára ugyanazt a Napszak és Horizont értéket használja, így egy makróval együtt mozognak.

**Jelenlegi vezérlők:** Napszak (nap magassága) (alap: 0.55); Nap vízszintesen (alap: 0.35); Horizont (alap: -0.18); Napközeli derengés (alap: 0.8); Telítettség (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Kézi zenit/horizont színpontok és saját napszakpresetek; több égboltréteg; a 3D terep és a felhők azonos fény-/napszakállapotot kapjanak.

### Nap — `sun` [B]

**Most / működés:** Fénygömb koronával. A Napszak és a Horizont ugyanaz, mint az Égszínnél, így együtt mozognak. Tedd fölé a Lencsefényt vagy a Fénysugarakat.

**Jelenlegi vezérlők:** Napszak (alap: 0.55); Vízszintesen (alap: 0.35); Horizont (alap: -0.18); Korong mérete (alap: 0.026); Korona (alap: 1); Fényerő (alap: 1); Szín [Napszakból, Saját] (alap: Napszakból); Saját szín (alap: #fff1d6); Horizont mögé bukik [Nem, Igen] (alap: Igen); Sugarak (alap: 0.35); Sugarak mintája (alap: 3).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** A korong, korona és sugárzás külön komponensek; napfoltok és protuberanciák külön csillagpresetként; közös fényforrás-hozzárendelés a bolygóknak és a tájnak.

### Felhőréteg — `clouds` [B]

**Most / működés:** Gomoly-, fátyol-, réteg- vagy viharfelhők a nap irányából megvilágítva. Perspektivikusan a horizont fölé, vagy laposan bárhová. A Mag melletti kockával új felhőket dobsz.

**Jelenlegi vezérlők:** Felhők [Gomoly, Fátyol, Réteg, Vihar] (alap: Gomoly); Mag (alap: 42); Borítottság (alap: 0.58); Nézet [Perspektivikus, Lapos] (alap: Perspektivikus); Felhők mérete (alap: 1); Napszak (alap: 0.55); Nap vízszintesen (alap: 0.35); Horizont (alap: -0.18); Szél (alap: 0.3); Fényesség (alap: 1); Puhaság (alap: 0.1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Felhőcsoportok elhelyezése, több magassági sáv és közös szél; nap előtti áthaladás, távolsági halványulás; 3D felhőréteggel cserélhető receptkomponens.

### Talaj — `terrain` [B]

**Most / működés:** Füves, száraz, homokos, sziklás vagy havas felület perspektívával. Tedd egy Dombvonal-alakzat fölé, és kapcsold be a vágást: a talaj csak a domb formájában látszik.

**Jelenlegi vezérlők:** Felület [Fű, Száraz fű, Homok, Szikla, Hó] (alap: Fű); Szín (alap: #3f8f2a); Napszak (alap: 0.55); Horizont (alap: -0.18); Részletesség (alap: 1); Domborzat (alap: 0.5); Mag (alap: 3); Szél a fűben (alap: 0.3).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Biomszínek, perspektívaskála és a dombvonalhoz igazított textúra; külön talajanyag a valódi 3D terep számára. Ne nevezzük a 2D maszkolt talajt térbeli tájnak.

### Pára — `haze` [B]

**Most / működés:** Légköri pára a horizont körül, és talajköd. Tedd a táj rétegei közé: ami alatta van, az távolabbinak látszik.

**Jelenlegi vezérlők:** Erősség (alap: 0.4); Horizont (alap: -0.18); Kiterjedés (alap: 0.15); Talajköd (alap: 0); Napszak (alap: 0.55); Nap vízszintesen (alap: 0.35); Szín [Égszínből, Saját] (alap: Égszínből); Saját szín (alap: #c9d6e6).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Háttérbe simulás közös effektként: ködszín a környezetből, magasság-/mélységfüggő erő; több ködréteg és peremlágyítás. A valódi mélységalapú köd új mélységbemenetet igényel.

### Animált szöveg — `mtext` [B]

**Most / működés:** Kinetikus tipográfia betűnként vagy szavanként: elmosásból élesedés, emelkedés, maszkolt felcsúszás, rugós pattanás, méret- és fókuszpop, kemény vágás, oldalról maszkolt beúszás. Boil (kézi remegés), megnyúlás mozgás közben és ütemre lüktetés bármelyik mozdulathoz.

**Jelenlegi vezérlők:** Mozdulat [Elmosásból élesedés, Emelkedés, Felcsúszás maszkolva, Pattanás, Gépelés, Szétszóródás, Hullám, Méret- és fókuszpop, Kemény vágás, Rugós ugrás, Beúszás oldalról (maszk), Kibontás középről (maszk)] (alap: Elmosásból élesedés); Egység [Betű, Szó, Sor] (alap: Betű); Sorrend [Balról, Jobbról, Középről, Véletlen] (alap: Balról); Kezdés (mp) (alap: 0.3); Időtartam (mp) (alap: 0.9); Késleltetés egységenként (0 = egyben) (alap: 0.06); Kilépés (mp, 0 = nincs) (alap: 0); Görbe [Lágy, Erős, Rugós (régi), Ki-be, Lineáris, Rugó – finom, Rugó – pattanós, Visszalendülés, Gumi (elastic), Pattogás, Expo ki-be, Lépcsős] (alap: Lágy); Erősség (alap: 1); Kitöltés [Egyszínű, Színátmenet, Paletta] (alap: Színátmenet); Szín 1 (alap: #a3a3ab); Szín 2 (alap: #f2a07b); Átmenet szöge ° (alap: 0); Fényhatás [Nincs, Fényes sáv, Kiolvasás] (alap: Nincs); Fényhatás tempója (alap: 1); Boil (kézi remegés) (alap: 0); Boil ütem (kocka/mp) (alap: 10); Megnyúlás mozgás közben (alap: 0); Lüktetés (köss rá ütem-jelet) (alap: 0).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat.

### Átmenet — `reveal` [B]

**Most / működés:** Időzített átmenet az alatta lévő teljes képre: átúszás, elmosásos zoom, folyékony feltárás, kör-maszk, fényvillanás, glitch, csíkok. Be, ki, vagy be és ki.

**Jelenlegi vezérlők:** Átmenet [Átúszás, Elmosásos zoom, Folyékony feltárás, Kör-maszk, Fényvillanás, Glitch-vágás, Csíkok, Forma-morph (kör → doboz → kép), Átrepülés (zoom-through), Betolás rugóval, Átlós seprés, Panelek nyílása] (alap: Átúszás); Irány [Be, Ki, Be és ki] (alap: Be); Kezdés (mp) (alap: 0); Időtartam (mp) (alap: 1.2); Kilépés (mp) (alap: 8); Görbe [Lágy, Erős, Rugós (régi), Ki-be, Lineáris, Rugó – finom, Rugó – pattanós, Visszalendülés, Gumi (elastic), Pattogás, Expo ki-be, Lépcsős] (alap: Ki-be); Lágyság (alap: 0.3).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf.

### Bento-rács — `bento` [B]

**Most / működés:** Lekerekített dobozok kész rács-elrendezésben, amelyek rugóval kinyílnak, becsúsznak, felpattannak, és egyik elrendezésből a másikba rendeződnek át. Maszkként is működik: a fölötte lévő rétegnél kapcsold be a „Vágás az alatta lévő rétegbe” opciót, és a szöveg a dobozokon belül úszik be.

**Jelenlegi vezérlők:** Elrendezés [2 × 2, Hős + 2, Hős + 3, 3 oszlop, Oldalsáv + 2, Mozaik (5), Mozaik (7), Kártyasor (4), Egy doboz, Sáv + címke, 3 × 3] (alap: Hős + 3); Belépés [Kinyílás, Felpattanás, Becsúszás alulról, Becsúszás balról, Kibontás balról, Kibontás alulról, Átúszás, Nincs] (alap: Felpattanás); Sorrend [Sorban, Középről, Véletlen, Egyszerre, Méret szerint] (alap: Sorban); Kezdés (mp) (alap: 0.2); Időtartam (mp) (alap: 0.9); Késleltetés dobozonként (alap: 0.09); Görbe [Lágy, Erős, Rugós (régi), Ki-be, Lineáris, Rugó – finom, Rugó – pattanós, Visszalendülés, Gumi (elastic), Pattogás, Expo ki-be, Lépcsős] (alap: Rugó – finom); Átrendeződés erre [Nincs, 2 × 2, Hős + 2, Hős + 3, 3 oszlop, Oldalsáv + 2, Mozaik (5), Mozaik (7), Kártyasor (4), Egy doboz, Sáv + címke, 3 × 3] (alap: Nincs); Átrendeződés ideje (mp) (alap: 3); Átrendeződés hossza (mp) (alap: 1); Bezáródás (mp, 0 = nincs) (alap: 0); Kitöltés [Szín, Üveg, Paletta, Csak körvonal] (alap: Szín); Szín (alap: #17171d); Kiemelés színe (alap: #f2a07b); Kiemelt doboz (0 = nincs) (alap: 0); Szélesség (alap: 1.5); Magasság (alap: 0.84); Hézag (alap: 0.024); Lekerekítés (alap: 0.03); Körvonal (alap: 0.0015); Árnyék (alap: 0.5); Üveg elmosása (alap: 0.6); Fényél (alap: 0.35).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Cellánként cserélhető kép és szöveg, vásznon húzható osztók; automatikus tördelés több képarányra; képek fókuszpontjai átrendezés közben is megmaradjanak.

### Vetítő — `projector` [B]

**Most / működés:** Analóg filmvetítés az alatta lévő képre: por és karcok szaggatott tempóban, fényszivárgás (light leak), vibráló expozíció, filmkocka-ugrálás, kameralebegés, színszél és szemcse. A Képkocka-ütem adja a mozis darabosságot.

**Jelenlegi vezérlők:** Por és karcok (alap: 0.5); Fényszivárgás (alap: 0.35); Vibrálás (alap: 0.3); Filmkocka-ugrálás (alap: 0.3); Kameralebegés (alap: 0.25); Tónus [Eredeti, Szépia, Fekete-fehér, Fakó szín] (alap: Eredeti); Színszél (alap: 0.25); Szemcse (alap: 0.35); Vignetta (alap: 0.45); Képkocka-ütem (kocka/mp) (alap: 12).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Menthető filmanyag-/objektívpresetek, hitelesebb por/karc időminták, külön kamera- és képanyagmozgás; loop és export állapotának egyezése.

### Részecskékre bontás — `pdisp` [B]

**Most / működés:** Ráhúzható Megjelenés: a réteg (szöveg, forma, kép) pontokra esik szét, majd visszaáll. Jelzésre (J), ismétlődve vagy kézzel. Szövegnél megadhatsz új szövegeket: az összeálláskor a következő szó jön, a felirat közben szerkeszthető marad.

**Jelenlegi vezérlők:** Szétesés [Kézi (csúszka), Jelzésekre, Ismétlődve] (alap: Jelzésekre); Szórás (alap: 1.2); Szétesés ideje (mp) (alap: 0.5); Szétszórva marad (mp) (alap: 0.3); Összeállás ideje (mp) (alap: 1.1); Ismétlődés (mp) (alap: 3); Szétesés (kézi) (alap: 0); Örvény szétszóráskor (alap: 0.5); Sűrűség [65 ezer, 147 ezer, 262 ezer] (alap: 147 ezer); Pontméret (alap: 1.6); Mélység a fényességből (alap: 0.1); Áramlás nyugalomban (alap: 0); Hullám (alap: 0); Remegés (alap: 0); Tempó (alap: 1); Szín [Eredeti, Paletta] (alap: Eredeti); Fényerő (alap: 1); Pontok keverése [Fény (összeadó), Normál] (alap: Normál).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Szóródás forma/szél/útvonal szerint, nem csak pontként: csillag, papír, szikra; betűből képpé összeállás; szöveg olvashatóságának megőrzése és tiszta visszatérési szakasz.

### Részecskék — `particles` [B]

**Most / működés:** Bármely kép vagy az alatta lévő rétegek pixeleiből 65–262 ezer részecske lesz. A fényességből mélység, a jelekre (kick, ütem) szétszóródás, áramlás, hullám.

**Pontosítás:** képpontokból képzett pontmező; a leírásban szereplő darabszám felbontás-/sűrűségfüggő, nem független emitteres fizikai rendszer.

**Jelenlegi vezérlők:** Forrás [Alatta lévő kép, Saját kép] (alap: Alatta lévő kép); Sűrűség [65 ezer, 147 ezer, 262 ezer] (alap: 65 ezer); Pontméret (alap: 2); Küszöb (sötét pontok elhagyása) (alap: 0.06); Mélység a fényességből (alap: 0.35); Szétszóródás (alap: 0); Áramlás (alap: 0.25); Hullám (alap: 0); Remegés (alap: 0); Dőlés ° (alap: 0); Fordulat ° (alap: 0); Forgás (alap: 0); Tempó (alap: 1); Szín [Eredeti, Paletta] (alap: Eredeti); Fényerő (alap: 1); Forrás elrejtése [Nem, Igen] (alap: Igen); Pontok keverése [Fény (összeadó), Normál] (alap: Fény (összeadó)).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Saját pont/vonal/felület/térfogat kibocsátó; életkor, szín-/méretgörbe és fizikai mezők; sprite-atlasz, ütközés, közös szél. A jelenlegi pixelfelbontástól ez külön részecskeforrás.

### 3D jelenet — `sdfscene` [B]

**Most / működés:** Szerkeszthető 3D: legfeljebb 8 alapforma (gömb, doboz, tórusz, henger, kapszula, oktaéder), amelyeket hozzáadsz, kivonsz vagy metszel, és agyagszerűen összeolvasztasz.

**Jelenlegi vezérlők:** Anyag [Paletta, Agyag, Króm, Irizáló, Normál-színek] (alap: Agyag); Környezet [Stúdió, Naplemente, Kozmikus, Neon] (alap: Stúdió); Érdesség (alap: 0.5); Fémesség (alap: 0); Árnyék a talajon (alap: 0.6); Peremfény (alap: 0.4); Élsimítás [Gyors, 4× (lassabb)] (alap: Gyors); Forgás (alap: 0.15); Dőlés ° (alap: 15); Fordulat ° (alap: 0); Jelenetfény hat rá [Nem, Igen] (alap: Igen).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Több és könnyebben csoportosítható alapforma, vásznon műveleti előnézet; tárgyanként anyag; térhálóvá alakítás későbbi lépcsőben. Importált mesh nem válik automatikusan SDF-műveletté.

### Felhő — `cloud3d` [B]

**Most / működés:** Önálló, puha, megvilágított felhő (nem égbolt): mozgatható, méretezhető, forgatható (O). Alak, sűrűség, puhaság, részletesség, gomolygás és látványbeli szél. A Jelenetfény hat rá. Húzd rá a Lufi Megjelenést: felfújt, fényes gumitest lesz ugyanabból az alakból.

**Jelenlegi vezérlők:** Alak [Gomoly, Lapos, Tornyos] (alap: Gomoly); Sűrűség (alap: 1.6); Puhaság (alap: 0.08); Részletesség (alap: 0.6); Gomolygás [Ki (álló), Be] (alap: Be); Gomolygás tempója (alap: 0.35); Szél (látvány) (alap: 0); Változat (alap: 3); Szín (fényes oldal) (alap: #ffffff); Árnyékszín (alap: #6c7c9c); Ezüst perem (alap: 0.8); Dőlés ° (alap: 0); Fordulat ° (alap: 0); Jelenetfény hat rá [Nem, Igen] (alap: Igen).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** Közös szél és térbeli elosztás, több felhőcsomó szerkesztése, háttérbe simuló vékony perem; füst-/ködanyag külön presetként, valós szimuláció ígérete nélkül.

### Lufi — `balloon` [B]

**Most / működés:** Ráhúzható Megjelenés a Felhőre: a „Felfújtság” csúszkával a felhő felfújt, fényes, gumiszerű testté válik, ugyanabból az alakból. A Jelenetfény csillanása rajta; a gomolygást kikapcsolva álló lufi. (Szövegre és 2D formára később, a Térbeliséggel.)

**Jelenlegi vezérlők:** Felfújtság (alap: 0.85); Szín (alap: #ee3b5c); Fényesség (alap: 0.75); Csillanás ereje (alap: 1.2).

**Használat:** Kizárólag Felhő rétegre húzd; más rétegtípusra most nem általános térbeliségi effekt.

**Jobbá tétel [Ö]:** Szövegre és 2D alakra is alkalmazható felfújás külön térbeliségi adapterrel; gumiság, varrat és áttetszőség; fizikai imbolygás és kötél később. Most csak Felhőn működik.

### Liquid Glass — `liquidglass` [B]

**Most / működés:** A kép egy mozgatható, fénytörő üveglencsén át látszik. Rétegre húzható; a réteg pozíciójával a lencsét helyezed el.

**Jelenlegi vezérlők:** Méret (alap: 1); Elmosás (alap: 1); Minőség [Gyors, Eredeti] (alap: Eredeti).

**Használat:** Megjelenésként rétegre húzható, vagy szűrőrétegként az alatta lévő képre hathat; a sorrendje megváltoztatja az eredményt.

**Jobbá tétel [Ö]:** Szabad lencseforma, vastagság, fénytörés és perem; több mozgatható lencse; saját háttérrel stabil mintavétel, fagyasztott és animált változat.

### Szélben lobogó láng — `windflame` [B]

**Most / működés:** Textúra alapú, időben mozgó láng. A szélesség, sebesség és fény külön állítható.

**Jelenlegi vezérlők:** Sebesség (alap: 1); Szélesség (alap: 1); Fény (alap: 1).

**Használat:** Könyvtárból hozzáadva teljes képet/önálló tartalmat rajzol; elhelyezésével és időparamétereivel komponálható.

**Jobbá tétel [Ö]:** A dokumentált függőleges csík javítása és referencia-összevetés; utána irányítható szél, szín és füst/parázs; állóképes minőségi preset is.

### A hat ráhúzható Mozgás [B]

#### Lebegés — `float`

**Most:** Lassú, puha fel-le (vagy tetszőleges irányú) ringás. **Használat:** rétegre húzva az alap elhelyezéséhez ad mozgást; az erősség állítható, a támogatott paraméterek animálhatók.

**Vezérlők:** Kitérés, Ütem (mp / kör), Irány °, Fáziseltolás. Folyamatos, a projekt Loopjától független.

**Jobbá tétel [Ö]:** Organikus zajos sodródás, ellipszis és tengelyenként eltérő karakter; több elem fázisának lépcsőzése.

#### Forgás — `spin`

**Most:** Folyamatos forgás a réteg középpontja körül. **Használat:** rétegre húzva az alap elhelyezéséhez ad mozgást; az erősség állítható, a támogatott paraméterek animálhatók.

**Vezérlők:** Sebesség °/mp. Folyamatos, a projekt Loopjától független.

**Jobbá tétel [Ö]:** Szabad forgáspont, gyorsulás/fékezés és ütemenkénti léptetés; 3D tengelyek csak alkalmas hoston.

#### Lüktetés — `pulse`

**Most:** Ritmikus nagyobbodás és kisebbedés. **Használat:** rétegre húzva az alap elhelyezéséhez ad mozgást; az erősség állítható, a támogatott paraméterek animálhatók.

**Vezérlők:** Erő, Ütem (mp / kör), Fáziseltolás. Folyamatos, a projekt Loopjától független.

**Jobbá tétel [Ö]:** Belégzés/kilégzés eltérő ideje, hangreaktív burkoló és rugalmas lecsengés.

#### Keringés — `orbit`

**Most:** Körpályán kering a saját helye körül. **Használat:** rétegre húzva az alap elhelyezéséhez ad mozgást; az erősség állítható, a támogatott paraméterek animálhatók.

**Vezérlők:** Sugár, Kör ideje (mp), Irány, Fáziseltolás. Folyamatos, a projekt Loopjától független.

**Jobbá tétel [Ö]:** Kijelölt központ körüli kapcsolt pálya, ellipszis/pályasík és takarás; a mai saját hely körüli körözés bővítése.

#### Remegés — `shake`

**Most:** Ideges, véletlenszerű remegés (mindig ugyanaz a minta). **Használat:** rétegre húzva az alap elhelyezéséhez ad mozgást; az erősség állítható, a támogatott paraméterek animálhatók.

**Vezérlők:** Erő, Gyorsaság (Hz), Billegés °, Minta. Folyamatos, a projekt Loopjától független.

**Jobbá tétel [Ö]:** Trauma/lecsengés, ritka impulzusok, külön pozíció/forgás, kamera- és kézi karakter.

#### Rugalmas beúszás — `spring`

**Most:** Megadott irányból rugalmasan érkezik a helyére. Az irányt a vásznon a nyíllal fogod meg. **Használat:** rétegre húzva az alap elhelyezéséhez ad mozgást; az erősség állítható, a támogatott paraméterek animálhatók.

**Vezérlők:** Kezdés (mp), Időtartam (mp), Karakter, Távolság, Érkezés iránya °, Beúszó áttetszőség, Kezdő méret, Ív. Időzített, megadott kezdéssel és időtartammal.

**Jobbá tétel [Ö]:** Kijelölt útvonal, finomabban állítható rugókarakter, lépcsőzés és egységes be-/kilépési mozgáscsalád.

## 4. Mind az 54 jelenlegi recept

Minden recept rétegcsoport; kibontva a darabok tovább szerkeszthetők. A réteglista **alulról felfelé** értendő. A beágyazott Megjelenéseket külön zárójelben jelölöm. Azonos nevű Forrás és Recept nem ugyanaz az elem.

### R01. Liquid Glass · fénykép [B]

**Most / működés:** A CodePen referencia üveglencséje egy teljes képes fotón. A Megjelenést az alapképre húzva bármely saját fotóval is használhatod.

**Összeállítás:** Háttérfotó · cserélhető (`image`) + Liquid Glass.

**Közös vezérlők:** Nincs külön makró; a rétegek saját vezérlőivel szerkeszthető..

**Jobbá tétel [Ö]:** Képcsere a lencse beállításainak megtartásával; több lencse és betűforma; letisztult termékfotós változat.

### R02. Láng · szélben [B]

**Most / működés:** Textúrával rajzolt lángforrás és visszafogott ragyogás; az elemek külön szerkeszthetők.

**Összeállítás:** Szélben lobogó láng (`windflame`) + Ragyogás.

**Közös vezérlők:** Sebesség, Szélesség.

**Jobbá tétel [Ö]:** Előbb a csíkhiba javítása; utána parázs, füst és szélmakró, amely mindhárom komponenst ugyanabba az irányba vezérli.

### R03. Portál [B]

**Most / működés:** Csavarodó téridő-alagút egy körmaszkban, szent geometriával és lencsehatással.

**Összeállítás:** Portál-maszk (`shape`) [maszk] → Alagút (`tunnel`) [előző alaprétegbe vágva] → Geometria (`sacred`) [előző alaprétegbe vágva] → Peremfény (`shape`) + Ragyogás → Téridő-görbület (`lens`).

**Közös vezérlők:** Méret, Energia, Örvény, Sebesség.

**Jobbá tétel [Ö]:** Nyitás–stabil állapot–bezárás időszakasz; választható belső jelenet és peremanyag; a portál mögötti háttér is hajoljon.

### R04. Lélek [B]

**Most / működés:** Lüktető, aranyló fénymag aurával és visszhangzó glóriával.

**Összeállítás:** Lélekmag (`shape`) [maszk] → Belső fény (`plasma`) [előző alaprétegbe vágva] → Rezgés (`moire`) [előző alaprétegbe vágva] → Aura (`shape`) → Glória (`feedback`) → Ragyogás (`glow`).

**Közös vezérlők:** Méret, Fény, Pulzálás, Áramlás.

**Jobbá tétel [Ö]:** Fényből részecske, majd visszaállás; saját embléma a magban, légzési ritmus és egységes arany/pasztell presetek.

### R05. Tűz [B]

**Most / működés:** Lobogó lángok hőremegéssel és izzással.

**Összeállítás:** Lángok (`fire`) → Hőremegés (`ripple`) → Izzás (`glow`) → Film (`film`).

**Közös vezérlők:** Magasság, Erő, Sebesség, Hőremegés.

**Jobbá tétel [Ö]:** Hőremegés csak a láng fölött; külön füst/parázs, égő szövegmaszk és szélre közös reakció.

### R06. Plazmamandala [B]

**Most / működés:** Áramló plazma kaleidoszkópba hajtogatva.

**Összeállítás:** Plazma (`plasma`) → Kaleidoszkóp (`kaleido`) → Ragyogás (`glow`) → Színciklus (`psycolor`).

**Közös vezérlők:** Áramlás, Sávok, Szimmetria, Fény.

**Jobbá tétel [Ö]:** Szimmetriát és színeket megtartó random; ütemenként finom szirmozás; a főcím mögött nyugodtabb középpont.

### R07. Fekete lyuk [B]

**Most / működés:** Eseményhorizont akkréciós koronggal és fényelhajlással.

**Összeállítás:** Fekete lyuk (`blackhole`) → Aberráció (`chroma`) → Ragyogás (`glow`) → Film (`film`).

**Közös vezérlők:** Méret, Lencse, Dőlés, Ragyogás.

**Jobbá tétel [Ö]:** A térkép hátterének valódi torzítása, külön porgyűrű és kamera-közelítés; árnyékos bolygó előtérként.

### R08. Mandala-sodródás [B]

**Most / működés:** Folyékony márvány tükrözve, visszhangzó csóvákkal.

**Összeállítás:** Márvány (`liquid`) → Szirmok (`kaleido`) → Visszhang (`feedback`) → Színek (`grade`).

**Közös vezérlők:** Szirmok, Visszhang, Áramlás, Szín.

**Jobbá tétel [Ö]:** Visszhang reprodukálható előmelegítése, varratmentes loop; szirmok helyett saját képmotívum.

### R09. Sarki fény [B]

**Most / működés:** Hullámzó fényfüggöny csillagos ég alatt.

**Összeállítás:** Éjszaka (`gradient`) → Fényfüggöny (`aurora`) → Ragyogás (`glow`).

**Közös vezérlők:** Magasság, Fény, Sebesség.

**Jobbá tétel [Ö]:** A háttér leírása csillagokat említ, de a réteglista csak gradient + aurora + glow: külön space csillagháttérrel tehető egyértelművé. Havas terep és hold kapcsolható hozzá.

### R10. Kristály [B]

**Most / működés:** Irizáló oktaéder szivárványos fénytöréssel.

**Összeállítás:** Háttér (`gradient`) → Kristály (`obj3d`) → Fénytörés (`chroma`) → Ragyogás (`glow`).

**Közös vezérlők:** Méret, Forgás, Szivárvány, Torzítás.

**Jobbá tétel [Ö]:** Üveg/irizáló anyagváltozatok, forgatható közös fény, kevesebb általános RGB-eltolás; termékbemutató kamerakör.

### R11. Merkaba [B]

**Most / működés:** Hologramos csillagtetraéder szent geometriai háttérrel.

**Összeállítás:** Geometria (`sacred`) → Merkaba (`obj3d`) → Ragyogás (`glow`).

**Közös vezérlők:** Méret, Forgás, Geometria, Fény.

**Jobbá tétel [Ö]:** Vonalanként felépülő háttér, megőrzött szimmetriájú morf és csillagszerű részecskeperem.

### R12. Hipertér-ugrás [B]

**Most / működés:** Csillagcsíkok, giroid-járat és örvénylő tér.

**Összeállítás:** Csillagcsíkok (`hyper`) → Járat (`gyroid`) → Örvény (`swirl`) → Aberráció (`chroma`).

**Közös vezérlők:** Sebesség, Örvény, Járat.

**Jobbá tétel [Ö]:** Indulás, gyorsulás, ugrás, fékezés közös időzítéssel; átrepülés egy másik világba a végén.

### R13. Neon horizont [B]

**Most / működés:** Retro-futurisztikus rácsmező köd fölött.

**Összeállítás:** Köd (`nebula`) → Rács (`grid`) → Glitch (`glitch`) → Ragyogás (`glow`).

**Közös vezérlők:** Sebesség, Horizont, Glitch.

**Jobbá tétel [Ö]:** Neonváros-makett és nedves útfelület; horizontot és ködöt közösen állító kamera/ég vezérlő.

### R14. Blob-követés [B]

**Most / működés:** Lebegő lávacseppek fekete-fehérben, követő keretekkel, azonosítókkal és invertált belsővel.

**Összeállítás:** Cseppek (`lava`) → Fekete-fehér (`grade`) → Követés (`blob`) → Film (`film`).

**Közös vezérlők:** Darabszám, Küszöb, Vonalak, Remegés.

**Jobbá tétel [Ö]:** Stabil ID-k, kézi célkijelölés és valódi címkeadatok; a követett pontok külön formákat húzhassanak magukkal.

### R15. Csillagtérkép [B]

**Most / működés:** Forgó galaxis, amelynek legfényesebb csillagait célkeresztek és hálózat követi.

**Összeállítás:** Galaxis (`galaxy`) → Csillagkövetés (`blob`).

**Közös vezérlők:** Pontok, Hálózat, Küszöb, Forgás.

**Jobbá tétel [Ö]:** Kijelölt csillagok neve, csillagképvonalak kézi szerkesztése, galaxis térmélysége és lassú kameramozgás.

### R16. Galaxis [B]

**Most / működés:** Spirálkarú galaxis csillagköd előtt.

**Összeállítás:** Köd (`nebula`) → Galaxis (`galaxy`) → Ragyogás (`glow`).

**Közös vezérlők:** Karok, Csavarodás, Forgás, Mag.

**Jobbá tétel [Ö]:** Külön por-/csillag-/magkomponens; spirálalak megőrzése randomkor; bolygó fölött látszó galaxis változat.

### R17. Részecskehullám [B]

**Most / működés:** Végtelen hullámzó pontmező az éjszakában.

**Összeállítás:** Ég (`gradient`) → Pontok (`waves`) → Ragyogás (`glow`) → Film (`film`).

**Közös vezérlők:** Hullámzás, Sűrűség, Sebesség, Fény.

**Jobbá tétel [Ö]:** Képből vagy logóból képzett pontmező; kattintásra induló hullámfront és zene amplitúdójához kapcsolt kitérés.

### R18. Lávalámpa [B]

**Most / működés:** Lassan összeolvadó meleg színű cseppek.

**Összeállítás:** Háttér (`gradient`) → Láva (`lava`) → Ragyogás (`glow`) → Színek (`grade`).

**Közös vezérlők:** Cseppek, Méret, Áramlás, Lágyság.

**Jobbá tétel [Ö]:** Palackmaszk, üvegperem és háttérbokeh; választható cseppanyag; lassú, vágásmentes loop.

### R19. Metagömbök [B]

**Most / működés:** Egymásba olvadó irizáló gömbök — a three.js marching cubes példa nyomán.

**Összeállítás:** Háttér (`gradient`) → Metagömbök (`obj3d`) → Ragyogás (`glow`).

**Közös vezérlők:** Méret, Tempó, Fény, Torzítás.

**Jobbá tétel [Ö]:** Cseppek összeállása felirat vagy embléma köré; tárgyankénti szín, térbeli részecskeváltozat és anyagcsere.

### R20. Tóruszcsomó [B]

**Most / működés:** A klasszikus three.js tóruszcsomó csiszolt krómból, stúdiófényben, árnyékkal.

**Összeállítás:** Háttér (`gradient`) → Tóruszcsomó (`obj3d`) → Ragyogás (`glow`).

**Közös vezérlők:** Méret, Forgás, Csavarás, Fény.

**Jobbá tétel [Ö]:** Saját görbéből csomó, anyag-/kamera-/fény preset; több összefonódó cső és címkompozíció.

### R21. ASCII-látomás [B]

**Most / működés:** Féreglyuk karakterekből kirakva, mátrixzöldben.

**Összeállítás:** Alagút (`tunnel`) → ASCII (`ascii`) → Film (`film`).

**Közös vezérlők:** Karakterméret, Kontraszt, Sebesség.

**Jobbá tétel [Ö]:** Saját karakterkészlet, tisztább főcím; forráscsere videóra csak későbbi videóimporttal; finom terminal preset.

### R22. Lencsefény [B]

**Most / működés:** Erős fényforrás sugarakkal és szellemképekkel csillagköd előtt.

**Összeállítás:** Köd (`nebula`) → Fényforrás (`flare`) → Aberráció (`chroma`).

**Közös vezérlők:** Fényerő, Sugarak, Szellemképek.

**Jobbá tétel [Ö]:** A fényforrás helye közös legyen az űrbeli csillaggal; takarás és képszéli lecsengés; kisebb, természetesebb csillanások.

### R23. Féltónus-pop [B]

**Most / működés:** Folyékony márvány nyomdai raszterpöttyökben.

**Összeállítás:** Márvány (`liquid`) → Raszter (`halftone`).

**Közös vezérlők:** Pöttyméret, Szög, Áramlás.

**Jobbá tétel [Ö]:** Papíranyag, CMYK és rétegelt nyomdahiba; fotóval és nagy szerkeszthető címmel használható plakátvariáns.

### R24. Sejtszövet [B]

**Most / működés:** Élő, izzó Voronoi-sejtek.

**Összeállítás:** Sejtek (`cells`) → Ragyogás (`glow`).

**Közös vezérlők:** Sejtméret, Sebesség, Határfény.

**Jobbá tétel [Ö]:** Növekvő sejtek, csomópontokon pontfény; sejthatárra tapadó címkék, bővíthető biológiai és sci-fi stílus.

### R25. Pixelvilág [B]

**Most / működés:** Fraktálvirág retró pixel artként, ditheringgel.

**Összeállítás:** Fraktál (`kali`) → Pixel art (`pixelart`).

**Közös vezérlők:** Pixelméret, Színszintek, Dithering.

**Jobbá tétel [Ö]:** Egységes korlátozott paletta minden rétegen; pixelhez illesztett tipográfia és kamera; exportban stabil pixelméret.

### R26. Stúdió-szobor [B]

**Most / működés:** Agyag merkaba stúdiófényben, puha árnyékkal — modern termékfotó-hangulat.

**Összeállítás:** Háttér (`gradient`) → Szobor (`obj3d`).

**Közös vezérlők:** Méret, Forgás, Textúra, Árnyék.

**Jobbá tétel [Ö]:** Több tárgy, közös talaj és fény, anyagvariációk; címsor és termékadatok megőrzött kompozícióval.

### R27. Gyöngy [B]

**Most / működés:** Gyöngyházfényű gömb neonfényben, finom felületi textúrával.

**Összeállítás:** Háttér (`gradient`) → Gyöngy (`obj3d`) → Szemcse (`texture`).

**Közös vezérlők:** Méret, Érdesség, Torzítás.

**Jobbá tétel [Ö]:** Finomabb környezeti tükröződés és gyöngyház; láncba rendezett gyöngyök, kontaktárnyék és közelkép.

### R28. Szaturnusz napnyugtakor [B]

**Most / működés:** Gyűrűs gázóriás oldalról megvilágítva, csillagos ég előtt.

**Összeállítás:** Ég (`space`) → Gázóriás (`planet`).

**Közös vezérlők:** Méret, Gyűrű, Nap iránya, Légkör.

**Jobbá tétel [Ö]:** Holdak, keskenyebb és színátmenetes gyűrűk, bolygóhoz kötött árnyék; háttérszínből vett légkör és lassú körbejárás.

### R29. Óceánbolygó holddal [B]

**Most / működés:** Felhős óceánvilág és egy kráteres hold.

**Összeállítás:** Ég (`space`) → Óceánbolygó (`planet`) → Hold (`planet`).

**Közös vezérlők:** Méret, Felhőzet, Nap iránya, Városfények.

**Jobbá tétel [Ö]:** Holdak száma, mérete és pályasugara egy vezérlőcsoportban; közös Nap, forgás/keringés külön; valódi terep és partvonal később.

### R30. Jégvilág [B]

**Most / működés:** Kékes jégbolygó hideg ködben.

**Összeállítás:** Köd (`space`) → Jégvilág (`planet`).

**Közös vezérlők:** Méret, Köd, Nap iránya.

**Jobbá tétel [Ö]:** Repedezett felszín, fehér/kék/rózsaszín gradiens, vékony légkör és apró jéghold; finom csillám külön részecskékkel.

### R31. Lávabolygó [B]

**Most / működés:** Izzó repedésekkel borított világ vörös ködben.

**Összeállítás:** Köd (`space`) → Lávabolygó (`planet`) → Ragyogás (`glow`).

**Közös vezérlők:** Méret, Izzás, Nap iránya.

**Jobbá tétel [Ö]:** Domborzatos kéreg, lávatavak és közös emisszió/glow; hamufelhő és fekete előtérkőzetek.

### R32. Csillagközi tájkép [B]

**Most / működés:** Óriásbolygó a horizonton, távoli hold és fényforrás a Tejút alatt.

**Összeállítás:** Tejút (`space`) → Horizont-bolygó (`planet`) → Hold (`planet`) → Csillag (`flare`).

**Közös vezérlők:** Tejút, Bolygó mérete, Fény.

**Jobbá tétel [Ö]:** Valódi előtérterep, mélységi köd és több egymás mögötti bolygó; közös fény, szín és horizont; ebből lehet teljes űr-landscape család.

### R33. Cinematic cím [B]

**Most / működés:** Betűnként élesedő, meleg színátmenetes cím bokeh-háttéren, fénygömbbel.

**Összeállítás:** Bokeh (`bokeh`) → Fénygömb (`shape`) → Cím (`mtext`) → Felcím (`mtext`).

**Közös vezérlők:** Kezdés, Tempó, Késleltetés, Bokeh.

**Jobbá tétel [Ö]:** Automatikus sortörés, fókuszpont és cserélhető háttér; olvashatóságot védő bokeh/fény; széles és álló képarányvariáns.

### R34. Kiolvasó felirat [B]

**Most / működés:** Világos, visszafogott szöveg, amin végigsöpör a kiolvasás.

**Összeállítás:** Háttér (`gradient`) → Felirat (`mtext`).

**Közös vezérlők:** Kiolvasás tempója, Méret.

**Jobbá tétel [Ö]:** Szerkeszthető fényseprés és szavankénti hangsúly; kézi vagy jelzésre indítás, visszafogott és neon stílus.

### R35. Belépő világ [B]

**Most / működés:** Elmosásos zoommal belépő bolygó, majd felcsúszó cím.

**Összeállítás:** Ég (`space`) → Bolygó (`planet`) → Belépés (`reveal`) → Cím (`mtext`).

**Közös vezérlők:** Átmenet hossza, Cím kezdése, Bolygó mérete.

**Jobbá tétel [Ö]:** Világcsere megtartott címmel; a belépés és a kameraút összehangolása; történethez kapcsolt kijárat.

### R36. Részecske-lélek [B]

**Most / működés:** Felirat, amely lebegő részecskékre bomlik.

**Összeállítás:** Szöveg (`text`) → Részecskék (`particles`) → Ragyogás (`glow`).

**Közös vezérlők:** Áramlás, Szétszóródás, Pontméret, Fény.

**Jobbá tétel [Ö]:** A betűk nyugalomban tiszták maradjanak; szétbomlás/lebegés/visszaállás makró, több csereszöveg és saját pontforma.

### R37. Ütemre robbanó mag [B]

**Most / működés:** Fénygömb részecskékből, amely minden ütemre szétrobban. Tölts be zenét a Hang gombbal.

**Összeállítás:** Mag (`shape`) → Részecskék (`particles`) → Ragyogás (`glow`).

**Közös vezérlők:** Méret, Áramlás, Fény.

**Jobbá tétel [Ö]:** Lábdob és pergő külön reakció; automatikus erőkorlát, színváltás és közös részecskeszél. A hangprojekt hordozhatósága javítandó.

### R38. SDF-szobor [B]

**Most / működés:** Szerkeszthető 3D jelenet: olvasztott gömb és tórusz kivájt üreggel, agyagból. Nyisd ki, és formáld az objektumokat.

**Összeállítás:** Háttér (`gradient`) → Szobor (`sdfscene`).

**Közös vezérlők:** Méret, Forgás, Érdesség, Árnyék.

**Jobbá tétel [Ö]:** Műveletenként ki/be kapcsolás, anyagváltozatok és szerkeszthető több tárgy; a kivágás előnézete és világosabb fogantyúk.

### R39. Kristálytorony [B]

**Most / működés:** Egymásra olvasztott oktaéderek irizáló anyagból, kozmikus fényben.

**Összeállítás:** Ég (`space`) → Torony (`sdfscene`).

**Közös vezérlők:** Méret, Forgás, Köd.

**Jobbá tétel [Ö]:** Darabszám/magasság/ritmus makró, színlépcső és felépülési animáció; csoportos alapformák ismétlése.

### R40. Bliss-dombok [B]

**Most / működés:** Égszín, nap, gomolyfelhők és két dombvonal füves talajjal, köztük légköri párával. A Napszak makró minden darabot együtt mozgat.

**Összeállítás:** Égszín (`skygrad`) → Nap (`sun`) → Felhők (`clouds`) → Távoli dombvonal (`shape`) [maszk] → Távoli talaj (`terrain`) [előző alaprétegbe vágva] → Pára (`haze`) → Közeli dombvonal (`shape`) [maszk] → Közeli talaj (`terrain`) [előző alaprétegbe vágva].

**Közös vezérlők:** Napszak, Nap helye, Felhők, Szél, Dombok, Pára.

**Jobbá tétel [Ö]:** Több elülső/hátsó dombsáv és közös páravezérlés; váltható 3D terep; az ég, növények és felhők ugyanazt a szelet kapják.

### R41. Arany naplemente [B]

**Most / működés:** Alacsony nap fátyolfelhőkkel, fénysugarakkal és lencsefénnyel, száraz füves dombok fölött. A Napszak makró a sugarakat és a lencsefényt is a naphoz igazítja.

**Összeállítás:** Égszín (`skygrad`) → Nap (`sun`) → Fátyolfelhők (`clouds`) → Fénysugarak (`radial`) → Távoli dombvonal (`shape`) [maszk] → Távoli talaj (`terrain`) [előző alaprétegbe vágva] → Pára (`haze`) → Közeli dombvonal (`shape`) [maszk] → Közeli talaj (`terrain`) [előző alaprétegbe vágva] → Lencsefény (`flare`).

**Közös vezérlők:** Napszak, Sugarak, Felhők, Lencsefény.

**Jobbá tétel [Ö]:** A Naphoz kötött sugarak takarása, víztükör és közös melegedő színvilág; teljes naplemente-időjárás ív.

### R42. Viharos ég [B]

**Most / működés:** Sötét viharfelhők és gyors réteges felhők sziklás hegyek fölött, szürke párával.

**Összeállítás:** Égszín (`skygrad`) → Viharfelhők (`clouds`) → Réteges felhők (`clouds`) → Hegyvonal (`shape`) [maszk] → Szikla (`terrain`) [előző alaprétegbe vágva] → Pára (`haze`) → Közeli dombvonal (`shape`) [maszk] → Közeli talaj (`terrain`) [előző alaprétegbe vágva] → Színek (`grade`).

**Közös vezérlők:** Vihar, Szél, Pára, Napszak.

**Jobbá tétel [Ö]:** Villám külön forrásból, eső részecskékkel, közös széllökések; fényvillanás minden tájréteget érintsen, ne csak a hátteret.

### R43. Éjszakai égbolt [B]

**Most / működés:** Tejút, hold és holdfényes fátyolfelhők sötét domb-sziluettek fölött.

**Összeállítás:** Égszín (`skygrad`) → Csillagok (`space`) → Hold (`planet`) → Fátyolfelhők (`clouds`) → Távoli dombvonal (`shape`) [maszk] → Távoli talaj (`terrain`) [előző alaprétegbe vágva] → Pára (`haze`) → Közeli dombvonal (`shape`) [maszk] → Közeli talaj (`terrain`) [előző alaprétegbe vágva].

**Közös vezérlők:** Csillagok, Tejút, Hold mérete, Felhők.

**Jobbá tétel [Ö]:** Holdfázis és kapcsolt holdfény, több mélységű csillagok, horizontköd; lassú éjszakából hajnalba átmenet.

### R44. Sivatag délben [B]

**Most / működés:** Homokdűnék vakító napfényben, forró párával a horizonton.

**Összeállítás:** Égszín (`skygrad`) → Nap (`sun`) → Fátyolfelhők (`clouds`) → Távoli dűnék (`shape`) [maszk] → Távoli homok (`terrain`) [előző alaprétegbe vágva] → Hőpára (`haze`) → Közeli dűnék (`shape`) [maszk] → Közeli homok (`terrain`) [előző alaprétegbe vágva].

**Közös vezérlők:** Napszak, Dűnék, Hőpára.

**Jobbá tétel [Ö]:** Valódi 3D dűnék, szélhordta homok, dűnegerinc és távoli hőremegés; fix horizontú kamerautak.

### R45. Havas csúcsok [B]

**Most / működés:** Éles, havas hegycsúcsok réteges felhőkkel és párás völggyel.

**Összeállítás:** Égszín (`skygrad`) → Nap (`sun`) → Réteges felhők (`clouds`) → Csúcsok (`shape`) [maszk] → Hó (`terrain`) [előző alaprétegbe vágva] → Pára (`haze`) → Közeli gerinc (`shape`) [maszk] → Szikla (`terrain`) [előző alaprétegbe vágva].

**Közös vezérlők:** Napszak, Csúcsok, Pára, Felhők.

**Jobbá tétel [Ö]:** 3D hegyek, magasság/lejtés alapú hóhatár, hópelyhek és közös hideg fény; felhőárnyék és völgyköd.

### R46. Bento-bemutató [B]

**Most / működés:** Üveg Bento-rács rugóval felpattanó dobozokkal, a nagy dobozban maszkolva felcsúszó címmel, alul rugós feliratokkal.

**Összeállítás:** Háttér (`gradient`) → Fények (`bokeh`) → Bento-rács (`bento`) → Cím (`mtext`) → Címke 1 (`mtext`) → Címke 2 (`mtext`) → Címke 3 (`mtext`).

**Közös vezérlők:** Tempó, Késleltetés, Lekerekítés, Hézag.

**Jobbá tétel [Ö]:** Cellánként valódi média és cím, megtartott fókuszpontok; szövegcsere után is jó tördelés, mobil layout.

### R47. Bento-átrendeződés [B]

**Most / működés:** Palettás mozaik, amely középről kinyílik, majd rugóval három oszlopba rendeződik át.

**Összeállítás:** Háttér (`gradient`) → Bento-rács (`bento`).

**Közös vezérlők:** Átrendeződés ideje, Lekerekítés, Hézag, Tempó.

**Jobbá tétel [Ö]:** Elemek egyedi azonosítóval mozogjanak új cellába; képtartalom ne ugorjon; sorrend- és ritmusvezérlés.

### R48. Szerkesztői címlap (soronként) [B]

**Most / működés:** Vásznat kitöltő, vegyes méretű tipográfia (4. kép ihlette): minden sor külön méretű, behúzású és térközű, soronként maszkolva csúszik be. A sorok elején lévő fogantyúkkal a vásznon igazíthatod. A szöveg átírható.

**Összeállítás:** Háttér (`gradient`) → Címlap (`mtext`).

**Közös vezérlők:** Nincs külön makró; a rétegek saját vezérlőivel szerkeszthető..

**Jobbá tétel [Ö]:** Szövegsorok közvetlen húzása, ütközésjelzés, automatikus képarányváltozat; WIDE-jellegű képrács saját szöveggel.

### R49. The End (vintage) [B]

**Most / működés:** Filmhíradós zárókép: a felirat méret- és fókuszpoppal ugrik be, kézzel rajzoltan remeg 12 kocka/mp-vel, szépia vetítő porral, karcokkal és fényszivárgással.

**Összeállítás:** Papír (`gradient`) → The End (`mtext`) → Alcím (`mtext`) → Vetítő (`projector`).

**Közös vezérlők:** Por és karcok, Fényszivárgás, Kézi remegés, Vibrálás.

**Jobbá tétel [Ö]:** Saját filmanyag- és papírpreset, az eltérő 10/12 fps szándékos közös vezérlése; egyszerű cserefelirat és opcionális zárás.

### R50. Rugós cím [B]

**Most / működés:** Betűnként rugóval beugró cím, amely mozgás közben megnyúlik, és egy balról kibomló aláhúzás.

**Összeállítás:** Háttér (`gradient`) → Aláhúzás (`bento`) → Cím (`mtext`).

**Közös vezérlők:** Megnyúlás, Késleltetés, Kezdés.

**Jobbá tétel [Ö]:** Betűnkénti kiemelés, állítható rugó és aláhúzás-követés; hosszú szövegre automatikus méretezés.

### R51. Alsó harmad [B]

**Most / működés:** Névfelirat (lower third): kiemelő sáv és panel balról kibomlik, a név maszkolva felcsúszik, a beosztás oldalról beúszik, majd az egész bezáródik.

**Összeállítás:** Háttér (`gradient`) → Fények (`bokeh`) → Panel (`bento`) → Név (`mtext`) [előző alaprétegbe vágva] → Beosztás (`mtext`) [előző alaprétegbe vágva].

**Közös vezérlők:** Megjelenés, Eltűnés, Lekerekítés.

**Jobbá tétel [Ö]:** Név/beosztás egyetlen űrlapon, címhosszhoz nyúló panel, biztonságos képszél; közös belépés/kilépés és logóhely.

### R52. Bolygó rétegekből [B]

**Most / működés:** Gyűrűs óceánbolygó szétszedve: hátsó gyűrű, felszín, külön forgó felhőhéj, légkör és első gyűrű. Mindegyik réteg külön állítható, színezhető, effektezhető.

**Összeállítás:** Ég (`space`) → Gyűrű (hátsó) (`planet`) → Felszín (`planet`) → Felhőhéj (`planet`) → Légkör (`planet`) → Gyűrű (első) (`planet`).

**Közös vezérlők:** Nap iránya, Méret, Felhők, Légkör, Gyűrű.

**Jobbá tétel [Ö]:** Felszín/felhő/légkör/gyűrű paraméterei közös alapból származzanak, ne essenek szét külön méretezéskor; hold és valódi domborzat opcionális komponens.

### R53. Kulcskockás repülés [B]

**Most / működés:** Kártya, amely rugóval berepül és forog, megáll, majd félreáll a felirat elől: kulcskockák a helyen, a szögön és a méreten, egyedi görbékkel. Nyisd ki a Kártya rétegét, és az Elhelyezés szekcióban szerkeszd a görbéket.

**Összeállítás:** Háttér (`gradient`) → Kártya (`shape`) → Felirat (`mtext`).

**Közös vezérlők:** Felirat kezdése, Lekerekítés.

**Jobbá tétel [Ö]:** Pályafogantyúk, időzítés-sablon és csereobjektum; hosszváltoztatáskor arányosan retime-olt kulcsok, külön mozgásként mentés.

### R54. Parallax-repülés [B]

**Most / működés:** 2,5D kamerarepülés: a rétegek különböző mélységben állnak, a kamera oldalra úszik és ráközelít. A távoli rétegek lassabban mozognak, az élességi síktól távoliak elmosódnak. A kamera a Kamera gombbal és a Sávok panelen szerkeszthető.

**Összeállítás:** Csillagok (`space`) → Bolygó (`planet`) → Köd (`clouds`) → Cím (`mtext`) → Előtér-fények (`bokeh`).

**Közös vezérlők:** Előtér, Köd.

**Jobbá tétel [Ö]:** Mélységi rétegek áttekintése, kameraképek és fókuszkövetés; álló formátumra újrakomponálás, hátterek széleinek védelme.

## 5. A teljes könyvtár, polconként

Minden jelenlegi csempe név szerint szerepel. A „Most / működés” a tényleges típus és a változat eltérő beállításai; a típus teljes működése és minden vezérlője a 3. fejezetben olvasható. A receptcsempékhez a részletes adatlap a 4. fejezetben van. Az alábbi lista nem állít külön megvalósítást az ugyanazon típust használó változatok mögé.

### Receptek — 54 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Liquid Glass · fénykép | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R01. | Képcsere a lencse beállításainak megtartásával; több lencse és betűforma; letisztult termékfotós változat. |
| Láng · szélben | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R02. | Előbb a csíkhiba javítása; utána parázs, füst és szélmakró, amely mindhárom komponenst ugyanabba az irányba vezérli. |
| Portál | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R03. | Nyitás–stabil állapot–bezárás időszakasz; választható belső jelenet és peremanyag; a portál mögötti háttér is hajoljon. |
| Lélek | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R04. | Fényből részecske, majd visszaállás; saját embléma a magban, légzési ritmus és egységes arany/pasztell presetek. |
| Tűz | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R05. | Hőremegés csak a láng fölött; külön füst/parázs, égő szövegmaszk és szélre közös reakció. |
| Plazmamandala | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R06. | Szimmetriát és színeket megtartó random; ütemenként finom szirmozás; a főcím mögött nyugodtabb középpont. |
| Fekete lyuk | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R07. | A térkép hátterének valódi torzítása, külön porgyűrű és kamera-közelítés; árnyékos bolygó előtérként. |
| Mandala-sodródás | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R08. | Visszhang reprodukálható előmelegítése, varratmentes loop; szirmok helyett saját képmotívum. |
| Sarki fény | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R09. | A háttér leírása csillagokat említ, de a réteglista csak gradient + aurora + glow: külön space csillagháttérrel tehető egyértelművé. Havas terep és hold kapcsolható hozzá. |
| Kristály | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R10. | Üveg/irizáló anyagváltozatok, forgatható közös fény, kevesebb általános RGB-eltolás; termékbemutató kamerakör. |
| Merkaba | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R11. | Vonalanként felépülő háttér, megőrzött szimmetriájú morf és csillagszerű részecskeperem. |
| Hipertér-ugrás | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R12. | Indulás, gyorsulás, ugrás, fékezés közös időzítéssel; átrepülés egy másik világba a végén. |
| Neon horizont | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R13. | Neonváros-makett és nedves útfelület; horizontot és ködöt közösen állító kamera/ég vezérlő. |
| Blob-követés | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R14. | Stabil ID-k, kézi célkijelölés és valódi címkeadatok; a követett pontok külön formákat húzhassanak magukkal. |
| Csillagtérkép | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R15. | Kijelölt csillagok neve, csillagképvonalak kézi szerkesztése, galaxis térmélysége és lassú kameramozgás. |
| Galaxis | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R16. | Külön por-/csillag-/magkomponens; spirálalak megőrzése randomkor; bolygó fölött látszó galaxis változat. |
| Részecskehullám | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R17. | Képből vagy logóból képzett pontmező; kattintásra induló hullámfront és zene amplitúdójához kapcsolt kitérés. |
| Lávalámpa | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R18. | Palackmaszk, üvegperem és háttérbokeh; választható cseppanyag; lassú, vágásmentes loop. |
| Metagömbök | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R19. | Cseppek összeállása felirat vagy embléma köré; tárgyankénti szín, térbeli részecskeváltozat és anyagcsere. |
| Tóruszcsomó | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R20. | Saját görbéből csomó, anyag-/kamera-/fény preset; több összefonódó cső és címkompozíció. |
| ASCII-látomás | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R21. | Saját karakterkészlet, tisztább főcím; forráscsere videóra csak későbbi videóimporttal; finom terminal preset. |
| Lencsefény | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R22. | A fényforrás helye közös legyen az űrbeli csillaggal; takarás és képszéli lecsengés; kisebb, természetesebb csillanások. |
| Féltónus-pop | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R23. | Papíranyag, CMYK és rétegelt nyomdahiba; fotóval és nagy szerkeszthető címmel használható plakátvariáns. |
| Sejtszövet | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R24. | Növekvő sejtek, csomópontokon pontfény; sejthatárra tapadó címkék, bővíthető biológiai és sci-fi stílus. |
| Pixelvilág | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R25. | Egységes korlátozott paletta minden rétegen; pixelhez illesztett tipográfia és kamera; exportban stabil pixelméret. |
| Stúdió-szobor | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R26. | Több tárgy, közös talaj és fény, anyagvariációk; címsor és termékadatok megőrzött kompozícióval. |
| Gyöngy | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R27. | Finomabb környezeti tükröződés és gyöngyház; láncba rendezett gyöngyök, kontaktárnyék és közelkép. |
| Szaturnusz napnyugtakor | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R28. | Holdak, keskenyebb és színátmenetes gyűrűk, bolygóhoz kötött árnyék; háttérszínből vett légkör és lassú körbejárás. |
| Óceánbolygó holddal | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R29. | Holdak száma, mérete és pályasugara egy vezérlőcsoportban; közös Nap, forgás/keringés külön; valódi terep és partvonal később. |
| Jégvilág | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R30. | Repedezett felszín, fehér/kék/rózsaszín gradiens, vékony légkör és apró jéghold; finom csillám külön részecskékkel. |
| Lávabolygó | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R31. | Domborzatos kéreg, lávatavak és közös emisszió/glow; hamufelhő és fekete előtérkőzetek. |
| Csillagközi tájkép | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R32. | Valódi előtérterep, mélységi köd és több egymás mögötti bolygó; közös fény, szín és horizont; ebből lehet teljes űr-landscape család. |
| Cinematic cím | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R33. | Automatikus sortörés, fókuszpont és cserélhető háttér; olvashatóságot védő bokeh/fény; széles és álló képarányvariáns. |
| Kiolvasó felirat | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R34. | Szerkeszthető fényseprés és szavankénti hangsúly; kézi vagy jelzésre indítás, visszafogott és neon stílus. |
| Belépő világ | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R35. | Világcsere megtartott címmel; a belépés és a kameraút összehangolása; történethez kapcsolt kijárat. |
| Részecske-lélek | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R36. | A betűk nyugalomban tiszták maradjanak; szétbomlás/lebegés/visszaállás makró, több csereszöveg és saját pontforma. |
| Ütemre robbanó mag | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R37. | Lábdob és pergő külön reakció; automatikus erőkorlát, színváltás és közös részecskeszél. A hangprojekt hordozhatósága javítandó. |
| SDF-szobor | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R38. | Műveletenként ki/be kapcsolás, anyagváltozatok és szerkeszthető több tárgy; a kivágás előnézete és világosabb fogantyúk. |
| Kristálytorony | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R39. | Darabszám/magasság/ritmus makró, színlépcső és felépülési animáció; csoportos alapformák ismétlése. |
| Bliss-dombok | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R40. | Több elülső/hátsó dombsáv és közös páravezérlés; váltható 3D terep; az ég, növények és felhők ugyanazt a szelet kapják. |
| Arany naplemente | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R41. | A Naphoz kötött sugarak takarása, víztükör és közös melegedő színvilág; teljes naplemente-időjárás ív. |
| Viharos ég | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R42. | Villám külön forrásból, eső részecskékkel, közös széllökések; fényvillanás minden tájréteget érintsen, ne csak a hátteret. |
| Éjszakai égbolt | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R43. | Holdfázis és kapcsolt holdfény, több mélységű csillagok, horizontköd; lassú éjszakából hajnalba átmenet. |
| Sivatag délben | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R44. | Valódi 3D dűnék, szélhordta homok, dűnegerinc és távoli hőremegés; fix horizontú kamerautak. |
| Havas csúcsok | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R45. | 3D hegyek, magasság/lejtés alapú hóhatár, hópelyhek és közös hideg fény; felhőárnyék és völgyköd. |
| Bento-bemutató | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R46. | Cellánként valódi média és cím, megtartott fókuszpontok; szövegcsere után is jó tördelés, mobil layout. |
| Bento-átrendeződés | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R47. | Elemek egyedi azonosítóval mozogjanak új cellába; képtartalom ne ugorjon; sorrend- és ritmusvezérlés. |
| Szerkesztői címlap (soronként) | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R48. | Szövegsorok közvetlen húzása, ütközésjelzés, automatikus képarányváltozat; WIDE-jellegű képrács saját szöveggel. |
| The End (vintage) | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R49. | Saját filmanyag- és papírpreset, az eltérő 10/12 fps szándékos közös vezérlése; egyszerű cserefelirat és opcionális zárás. |
| Rugós cím | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R50. | Betűnkénti kiemelés, állítható rugó és aláhúzás-követés; hosszú szövegre automatikus méretezés. |
| Alsó harmad | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R51. | Név/beosztás egyetlen űrlapon, címhosszhoz nyúló panel, biztonságos képszél; közös belépés/kilépés és logóhely. |
| Bolygó rétegekből | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R52. | Felszín/felhő/légkör/gyűrű paraméterei közös alapból származzanak, ne essenek szét külön méretezéskor; hold és valódi domborzat opcionális komponens. |
| Kulcskockás repülés | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R53. | Pályafogantyúk, időzítés-sablon és csereobjektum; hosszváltoztatáskor arányosan retime-olt kulcsok, külön mozgásként mentés. |
| Parallax-repülés | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R54. | Mélységi rétegek áttekintése, kameraképek és fókuszkövetés; álló formátumra újrakomponálás, hátterek széleinek védelme. |

### Források — 21 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| 3D Terep | 3D Terep (`terrain3d`). Az elemtípus alapbeállításai. | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| Plazma | Plazma (`plasma`). Az elemtípus alapbeállításai. | Lágy vagy éles karakter, több zajréteg, zajmag; paletta egyes színeinek zárolása. Hangra áramló háttér, amely nem vibrál túl. |
| Tűz | Tűz (`fire`). Az elemtípus alapbeállításai. | Alul és oldalt elhelyezhető lángforrás, szélirány és színlépcsők; füst és parázs kapcsolása; lángcsóva formára vagy betűre illesztése. |
| Szélben lobogó láng | Szélben lobogó láng (`windflame`). Az elemtípus alapbeállításai. | A dokumentált függőleges csík javítása és referencia-összevetés; utána irányítható szél, szín és füst/parázs; állóképes minőségi preset is. |
| Sarki fény | Sarki fény (`aurora`). Az elemtípus alapbeállításai. | Több különálló fényfüggöny, horizontmaszk és térmélység; szabályozható színátmenet; felhő és táj mögé illesztés, visszafogott csillagfény. |
| Galaxis | Galaxis (`galaxy`). Az elemtípus alapbeállításai. | Spirál-, elliptikus és szabálytalan galaxis; külön csillag- és porkomponens; közelítéskor részletességváltás, felismerhető karokkal. A shaderes látvány mellé valódi részecskés változat. |
| Részecskehullám | Részecskehullám (`waves`). Az elemtípus alapbeállításai. | Kijelölt ponton hullámindítás, több hullámforrás, szélirány és csillapítás; valódi mélységi árnyalás; alak- és képalapú részecskehullám. |
| Lávalámpa | Lávalámpa (`lava`). Az elemtípus alapbeállításai. | Cseppek külön megfogása, vonzás/taszítás és alakba rendeződés; üvegpalack-maszk és anyagváltozatok. A 2D lávalámpa és a 3D metagömb maradjon megkülönböztethető. |
| Sejtszövet | Sejtszövet (`cells`). Az elemtípus alapbeállításai. | Sejtalakok szerkesztése, növekedés/osztódás; határvonalak külön színe; Voronoi-darabokra törő átmenet ugyanebből a mintából. |
| Csillagköd | Csillagköd (`nebula`). Az elemtípus alapbeállításai. | Külön köd-, por- és csillagréteg; komponensenkénti szín és mélység; bolygó mögötti ellenfény, kamerahelyzettel összehangolt parallax. |
| Folyékony márvány | Folyékony márvány (`liquid`). Az elemtípus alapbeállításai. | Színfoltok és áramlási irány kézi elhelyezése; sebesség helyett örvénykarakter is állítható. Valódi festékmező külön módként, a jelenlegi shaderes márvány megtartásával. |
| Féreglyuk | Féreglyuk (`tunnel`). Az elemtípus alapbeállításai. | Saját keresztmetszet, kanyargó pálya és falanyag; belépési/kilépési szakasz; a kameramozgás és a textúrafolyás külön vezérlése. |
| Szent geometria | Szent geometria (`sacred`). Az elemtípus alapbeállításai. | Geometriai családok külön presetekkel, vonalrajzolási animáció, csomópontok díszítése; lépcsőzetes kibomlás és képarányhoz illeszkedő kompozíció. |
| Fraktálvirág | Fraktálvirág (`kali`). Az elemtípus alapbeállításai. | Kedvenc nézetek, részletességi profil, palettazárolás; lassú, vágás nélkül körbeérő fraktálmorf. Finom vonalak stabil élsimítása. |
| Julia-portál | Julia-portál (`julia`). Az elemtípus alapbeállításai. | Menthető érdekes paraméterpárok, kézzel kijelölt nagyítási középpont, részletességhez kötött iteráció; visszatekerhető utazások a halmazon. |
| Interferencia | Interferencia (`moire`). Az elemtípus alapbeállításai. | Külön mozgatható hullámforrások; interferencia több alakból; exportfelbontáshoz igazodó sűrűség, hogy ne legyen nem kívánt vibrálás. |
| Hipertér | Hipertér (`hyper`). Az elemtípus alapbeállításai. | Színes csillagosztályok, gyorsulás/fékezés és irányított ugrás; kamerarázás külön mozgásként; csíkhossz és fényerő biztonságos összekötése. |
| Hologramrács | Hologramrács (`grid`). Az elemtípus alapbeállításai. | Szabad horizont, eltérő rácscellák, rácsra illesztett objektumok; nap és ég külön darabokként; perspektíva és kamera összehangolása. |
| Eseményhorizont | Eseményhorizont (`blackhole`). Az elemtípus alapbeállításai. | Külön akkréciós korong, por és háttérlencsézés; forgásirány, koronghőmérséklet és megfigyelési szög. Ne csak saját háttérképet, hanem kijelölt jelenetrétegeket is hajlítson. |
| Színátmenet | Színátmenet (`gradient`). Az elemtípus alapbeállításai. | Színpontok közvetlen szerkesztése, lineáris/sugárirányú/konikus és hálós átmenet; érzékelésalapú színinterpoláció; sávosodást csökkentő finom dithering. |
| Lencsefény | Lencsefény (`flare`). Az elemtípus alapbeállításai. | Kapcsolás Naphoz vagy kijelölt fényhez, képszélen természetes halványulás; alakú apertúra és menthető objektívpreset; takarás figyelembevétele később. |

### 2D Formák — 15 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Kör | Alakzat (`shape`). Az elemtípus alapbeállításai. | Szabad középpont, pontból felépülés és körpecsét-variáns. |
| Gyűrű | Alakzat (`shape`). Forma = Gyűrű | Rés és nyitási szög, körön futó fény; útvonalhoz vagy bolygóhoz csatolás. |
| Lekerekített négyzet | Alakzat (`shape`). Forma = Téglalap; Lekerekítés = 0.3 | Sarkonként eltérő sugár, reszponzív kártya és saját képkivágás. |
| Háromszög | Alakzat (`shape`). Forma = Sokszög; Oldalak / csúcsok = 3 | Csúcsok kézi mozgatása, sarokkerekítés és vonalrajzolás. |
| Hatszög | Alakzat (`shape`). Forma = Sokszög | Méretarányos hatszögrács, cellánként szín és lépcsőzés. |
| Csillag | Alakzat (`shape`). Forma = Csillag; Oldalak / csúcsok = 5 | Csúcsszám és csúcsélesség fogantyú; csillagszikra és logóvariáns. |
| Félhold | Alakzat (`shape`). Forma = Félhold; Belső arány = 0.35 | Fázis és megvilágítás közös vezérlése, holdfázis-sablon. |
| Vesica | Alakzat (`shape`). Forma = Vesica; Belső arány = 0.5 | Két kör átfedésének közvetlen húzása, geometriai nyitóanimáció. |
| Szív | Alakzat (`shape`). Forma = Szív | Szimmetria és ívek finomhangolása, szívverés és részecskés összeállás. |
| Virág | Alakzat (`shape`). Forma = Virág; Belső arány = 0.6 | Sziromalak, rétegek és középpont; szélben mozgó és nyíló változat. |
| Spirál | Alakzat (`shape`). Forma = Spirál; Belső arány = 0.3; Gyűrű vastagsága = 0.02 | Menetszám, menetköz és rajzolási előrehaladás; pályaként is menthető legyen. |
| Szem | Alakzat (`shape`). Forma = Szem; Gyűrű vastagsága = 0.02 | Szemhéj/írisz/pupilla komponensek, pislogás és célkövetés. |
| Kereszt | Alakzat (`shape`). Forma = Kereszt; Belső arány = 0.2 | Szárak külön aránya és végződése, plusz/célkereszt/piktogram preset. |
| Végtelen | Alakzat (`shape`). Forma = Végtelen; Gyűrű vastagsága = 0.02 | A hurkok és derék aránya, végigfutó fény és pályakövetés. |
| Fénykör | Alakzat (`shape`). Lágyság = 0.8 | Középpont/perem gradiens, világító aura és háttérszínhez illesztés. |

### 3D Formák — 28 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Szerkeszthető 3D jelenet | 3D jelenet (`sdfscene`). Az elemtípus alapbeállításai. | Több és könnyebben csoportosítható alapforma, vásznon műveleti előnézet; tárgyanként anyag; térhálóvá alakítás későbbi lépcsőben. Importált mesh nem válik automatikusan SDF-műveletté. |
| Gerincfelület (vörös stúdió) | Gerincfelület (`surface3d`). Az elemtípus alapbeállításai. | Több szerkeszthető gerinc, vastagságprofil és sima végződés; saját anyagpresetek; ugyanazzal a felülettel szalag, fémlemez és textilsáv. Közös fényre és környezeti színre illesztés. |
| 3D Terep | 3D Terep (`terrain3d`). Az elemtípus alapbeállításai. | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| Felhő | Felhő (`cloud3d`). Az elemtípus alapbeállításai. | Közös szél és térbeli elosztás, több felhőcsomó szerkesztése, háttérbe simuló vékony perem; füst-/ködanyag külön presetként, valós szimuláció ígérete nélkül. |
| Lapos felhő | Felhő (`cloud3d`). Alak = Lapos; Változat = 5 | Közös szél és térbeli elosztás, több felhőcsomó szerkesztése, háttérbe simuló vékony perem; füst-/ködanyag külön presetként, valós szimuláció ígérete nélkül. |
| Tornyos felhő | Felhő (`cloud3d`). Alak = Tornyos; Változat = 8 | Közös szél és térbeli elosztás, több felhőcsomó szerkesztése, háttérbe simuló vékony perem; füst-/ködanyag külön presetként, valós szimuláció ígérete nélkül. |
| Lufi-felhő | Felhő (`cloud3d`). Gomolygás = Ki (álló) Hozzárendelt Megjelenés: Lufi. | Közös szél és térbeli elosztás, több felhőcsomó szerkesztése, háttérbe simuló vékony perem; füst-/ködanyag külön presetként, valós szimuláció ígérete nélkül. |
| SDF-szobor | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R38. | Műveletenként ki/be kapcsolás, anyagváltozatok és szerkeszthető több tárgy; a kivágás előnézete és világosabb fogantyúk. |
| Kristálytorony | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R39. | Darabszám/magasság/ritmus makró, színlépcső és felépülési animáció; csoportos alapformák ismétlése. |
| Hóember | 3D jelenet (`sdfscene`). Árnyék a talajon = 0.7 | Részenként színezés és fogantyú, arc/kiegészítők; ne csak egy közös anyag. |
| CSG-kocka | 3D jelenet (`sdfscene`). Anyag = Irizáló; Érdesség = 0.25; Forgás = 0.2; Dőlés ° = 25; Fordulat ° = 35 | Műveleti lépések kapcsolása és kivágó test közvetlen mozgatása. |
| Irizáló gömb | 3D objektum (`obj3d`). Árnyék a talajon = 0.5 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Plazmatórusz | 3D objektum (`obj3d`). Forma = Tórusz; Anyag = Plazma; Dőlés ° = 55 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Krómkocka | 3D objektum (`obj3d`). Forma = Kocka; Anyag = Króm; Dőlés ° = 25; Fordulat ° = 35 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Hologram-oktaéder | 3D objektum (`obj3d`). Forma = Oktaéder; Anyag = Hologram | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Merkaba | 3D objektum (`obj3d`). Forma = Merkaba | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Giroid gömb | 3D objektum (`obj3d`). Forma = Giroid gömb; Anyag = Plazma | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Lávagömb | 3D objektum (`obj3d`). Anyag = Láva; Torzítás = 0.5 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Tóruszcsomó | 3D objektum (`obj3d`). Forma = Tóruszcsomó; Anyag = Normál-színek; Forgás = 0.4; Dőlés ° = 30 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Toon dodekaéder | 3D objektum (`obj3d`). Forma = Dodekaéder; Anyag = Toon | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Üveg ikozaéder | 3D objektum (`obj3d`). Forma = Ikozaéder; Anyag = Üveg; Dőlés ° = 15 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Metagömbök | 3D objektum (`obj3d`). Forma = Metagömbök | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Normál-tórusz | 3D objektum (`obj3d`). Forma = Tórusz; Anyag = Normál-színek; Dőlés ° = 60 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Agyagszobor | 3D objektum (`obj3d`). Forma = Dodekaéder; Anyag = Agyag; Érdesség = 0.8; Felületi textúra = 0.4; Árnyék a talajon = 0.7 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Gyöngy | 3D objektum (`obj3d`). Anyag = Gyöngyház; Környezet = Neon; Árnyék a talajon = 0.5 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Bársonytórusz | 3D objektum (`obj3d`). Forma = Tórusz; Anyag = Bársony; Árnyék a talajon = 0.5; Dőlés ° = 55 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Krómcsomó | 3D objektum (`obj3d`). Forma = Tóruszcsomó; Anyag = Króm; Érdesség = 0.15; Árnyék a talajon = 0.6 | Külön választható forma, anyag és domborzat; importált GLB; valódi közös tér és egymásra vetett árnyék. A shaderes testekhez nem csatlakoztatható közvetlenül a Three.js háló: adapter vagy külön mesh-út kell. |
| Giroid-barlang | Giroid-barlang (`gyroid`). Az elemtípus alapbeállításai. | Szerkeszthető repülési út, falanyag és rétegezett köd; elágazó járatok; lassú, nyugodt és gyors repülési preset. Villódzás és mintavételi zaj csökkentése. |

### Megjelenések — 27 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Liquid Glass | Liquid Glass (`liquidglass`). Az elemtípus alapbeállításai. | Szabad lencseforma, vastagság, fénytörés és perem; több mozgatható lencse; saját háttérrel stabil mintavétel, fagyasztott és animált változat. |
| Blob-követés | Blob-követés (`blob`). Az elemtípus alapbeállításai. | Követési pontokból más rétegek vezérlése, kijelölhető célfolt és stabil azonosítók; kevesebb elvesző címke, hálózati sűrűségkorlát; szerkeszthető adatfelirat. |
| Textúra | Textúra (`texture`). Az elemtípus alapbeállításai. | Saját textúra import, objektumhoz kötött skála, két anyagréteg és domborítás; a képsíkra tett szemcse és a valódi 3D anyag megkülönböztetése. |
| Elmosás | Elmosás (`blur`). Az elemtípus alapbeállításai. | Irányított, mélységalapú és mozgásból eredő elmosás külön módok; maszk peremének megtartása; előnézet/export azonos karakterrel. |
| Ragyogás | Ragyogás (`glow`). Az elemtípus alapbeállításai. | Fény színe és több mérettartomány, puha váll a csúcsfényeken; a részleteket megőrző bloom. Fényforráshoz kapcsolható erő, felbontástól független sugár. |
| Téridő-görbület | Téridő-görbület (`lens`). Az elemtípus alapbeállításai. | Választható bemeneti réteg, több lencseközéppont, maszkból képzett lencse; előnézetben látható hatósugár és kontrollált szélkezelés. |
| Organikus torzítás | Organikus torzítás (`warp`). Az elemtípus alapbeállításai. | Ráhúzható deformációs tér: irány, skála, seed, időfázis; varratmentes loop. Közös zajforrás több réteghez. |
| Neon körvonal | Neon körvonal (`edge`). Az elemtípus alapbeállításai. | Belső/külső körvonal, többszínű perem, vonalon végigfutó fény; sarkok és vékony betűk stabil kezelése, anyagszerű neonüveg. |
| Fénysugarak | Fénysugarak (`radial`). Az elemtípus alapbeállításai. | Kijelölt Naphoz kötés, fénysugarak takarásmaszkja és színe; sugárszám, puhaság és hossz külön, képkivágáson kívüli forrás kezelése. |
| Kaleidoszkóp | Kaleidoszkóp (`kaleido`). Az elemtípus alapbeállításai. | Szeletközéppont fogantyú, többszintű szimmetria, varratkezelés; szimmetriaváltás sima átmenettel és megtartható főmotívummal. |
| Visszhang | Visszhang (`feedback`). Az elemtípus alapbeállításai. | Visszatekeréshez és exporthoz reprodukálható előmelegítés/állapot; csóvák színe és maszkja; lerakódás törlése egy kattintással. Különösen fontos: ez valóban előző képkockás állapotot használ. |
| Örvény | Örvény (`swirl`). Az elemtípus alapbeállításai. | Több helyi örvény, vásznon állítható középpont és sugár; formakövető sodrás, nyugodt és robbanó karakter. |
| Hullámzás | Hullámzás (`ripple`). Az elemtípus alapbeállításai. | Kattintással indítható hullámfrontok, pontból/vonalból/formából induló hullám, csillapítás és ütköző hullámok; külön víztükör és hőremegés preset. |
| ASCII | ASCII (`ascii`). Az elemtípus alapbeállításai. | Saját karakterkészlet/font, fényesség szerint kalibrált karakterek, külön előtér/háttér; Unicode és saját szimbólumok, időben stabil mintavétel. |
| Féltónus | Féltónus (`halftone`). Az elemtípus alapbeállításai. | Valódi CMYK jellegű raszter, nyomdai színek és papír; nézetfüggetlen pontméret, moaré elleni mintavétel; animálható nyomási hiba. |
| Pixel art | Pixel art (`pixelart`). Az elemtípus alapbeállításai. | Menthető korlátozott paletták, választható dithering, képpontokhoz igazított kamera; részletmegőrző méretezés, szöveg kivétele a pixelesítésből. |
| Tükör | Tükör (`mirror`). Az elemtípus alapbeállításai. | Tengely fogantyúval, eltolt szimmetria, kaleidoszkóppal közös vezérlés; szabad tükrözési maszkrégió. |
| Poláris tér | Poláris tér (`polar`). Az elemtípus alapbeállításai. | Középpont, kezdőszög, varrat elrejtése; feliratból körpecsét és alagút; az eredeti arányok megtartásának kapcsolója. |
| Kromatikus aberráció | Kromatikus aberráció (`chroma`). Az elemtípus alapbeállításai. | Csak képszéleken vagy fényes részeken hasson; külön radiális és irányított csatornaeltolás; tipográfiához gyenge, olvasható preset. |
| Pszichedelikus színezés | Pszichedelikus színezés (`psycolor`). Az elemtípus alapbeállításai. | Saját színlépcsők, bőrtónus/semleges színek védelme; maszkolható színcsere, átlátszóság megőrzése. |
| Színkorrekció | Színkorrekció (`grade`). Az elemtípus alapbeállításai. | Árnyék/középtónus/csúcsfény külön, fehéregyensúly és görbék; LUT-import; referenciához színhangolás kézi finomítással. |
| Glitch | Glitch (`glitch`). Az elemtípus alapbeállításai. | Jelzésre induló rövid események, sáv- és csatornapresetek, seed és fagyasztás; a főcímet védő maszk, olvashatósági korlát. |
| Film és szemcse | Film és szemcse (`film`). Az elemtípus alapbeállításai. | Felbontástól független szemcseméret, színes/fekete-fehér szemcse, árnyalatfüggő erő; finom papír- és filmanyag közös skálázással. |
| CRT-képernyő | CRT-képernyő (`crt`). Az elemtípus alapbeállításai. | Képernyőarány, foszforpreset, üvegcsillanás és választható jelhiba; szöveghez olvasható finom mód. Külön kijelzőtest és kép torzítása a termékjelenetekhez. |
| Színes vetett fény | Színes vetett fény (`castlight`). Az elemtípus alapbeállításai. | Fényirány-fogantyú, több színállomás és spektrum, lágyulás a távolsággal; objektum mögötti takarás, külön árnyék/fénycsóva mód. |
| Részecskékre bontás | Részecskékre bontás (`pdisp`). Az elemtípus alapbeállításai. | Szóródás forma/szél/útvonal szerint, nem csak pontként: csillag, papír, szikra; betűből képpé összeállás; szöveg olvashatóságának megőrzése és tiszta visszatérési szakasz. |
| Lufi | Lufi (`balloon`). Az elemtípus alapbeállításai. | Szövegre és 2D alakra is alkalmazható felfújás külön térbeliségi adapterrel; gumiság, varrat és áttetszőség; fizikai imbolygás és kötél később. Most csak Felhőn működik. |

### Mozgás — 55 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Lebegés | Ráhúzható mozgás: Lassú, puha fel-le (vagy tetszőleges irányú) ringás. | Organikus zajos sodródás, ellipszis és tengelyenként eltérő karakter; több elem fázisának lépcsőzése. |
| Forgás | Ráhúzható mozgás: Folyamatos forgás a réteg középpontja körül. | Szabad forgáspont, gyorsulás/fékezés és ütemenkénti léptetés; 3D tengelyek csak alkalmas hoston. |
| Lüktetés | Ráhúzható mozgás: Ritmikus nagyobbodás és kisebbedés. | Belégzés/kilégzés eltérő ideje, hangreaktív burkoló és rugalmas lecsengés. |
| Keringés | Ráhúzható mozgás: Körpályán kering a saját helye körül. | Kijelölt központ körüli kapcsolt pálya, ellipszis/pályasík és takarás; a mai saját hely körüli körözés bővítése. |
| Remegés | Ráhúzható mozgás: Ideges, véletlenszerű remegés (mindig ugyanaz a minta). | Trauma/lecsengés, ritka impulzusok, külön pozíció/forgás, kamera- és kézi karakter. |
| Rugalmas beúszás | Ráhúzható mozgás: Megadott irányból rugalmasan érkezik a helyére. Az irányt a vásznon a nyíllal fogod meg. | Kijelölt útvonal, finomabban állítható rugókarakter, lépcsőzés és egységes be-/kilépési mozgáscsalád. |
| Cinematic cím | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R33. | Automatikus sortörés, fókuszpont és cserélhető háttér; olvashatóságot védő bokeh/fény; széles és álló képarányvariáns. |
| Kiolvasó felirat | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R34. | Szerkeszthető fényseprés és szavankénti hangsúly; kézi vagy jelzésre indítás, visszafogott és neon stílus. |
| Belépő világ | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R35. | Világcsere megtartott címmel; a belépés és a kameraút összehangolása; történethez kapcsolt kijárat. |
| Részecske-lélek | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R36. | A betűk nyugalomban tiszták maradjanak; szétbomlás/lebegés/visszaállás makró, több csereszöveg és saját pontforma. |
| Ütemre robbanó mag | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R37. | Lábdob és pergő külön reakció; automatikus erőkorlát, színváltás és közös részecskeszél. A hangprojekt hordozhatósága javítandó. |
| Bento-bemutató | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R46. | Cellánként valódi média és cím, megtartott fókuszpontok; szövegcsere után is jó tördelés, mobil layout. |
| Bento-átrendeződés | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R47. | Elemek egyedi azonosítóval mozogjanak új cellába; képtartalom ne ugorjon; sorrend- és ritmusvezérlés. |
| Szerkesztői címlap (soronként) | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R48. | Szövegsorok közvetlen húzása, ütközésjelzés, automatikus képarányváltozat; WIDE-jellegű képrács saját szöveggel. |
| The End (vintage) | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R49. | Saját filmanyag- és papírpreset, az eltérő 10/12 fps szándékos közös vezérlése; egyszerű cserefelirat és opcionális zárás. |
| Rugós cím | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R50. | Betűnkénti kiemelés, állítható rugó és aláhúzás-követés; hosszú szövegre automatikus méretezés. |
| Alsó harmad | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R51. | Név/beosztás egyetlen űrlapon, címhosszhoz nyúló panel, biztonságos képszél; közös belépés/kilépés és logóhely. |
| Kulcskockás repülés | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R53. | Pályafogantyúk, időzítés-sablon és csereobjektum; hosszváltoztatáskor arányosan retime-olt kulcsok, külön mozgásként mentés. |
| Parallax-repülés | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R54. | Mélységi rétegek áttekintése, kameraképek és fókuszkövetés; álló formátumra újrakomponálás, hátterek széleinek védelme. |
| Bento · hős + 3 | Bento-rács (`bento`). Az elemtípus alapbeállításai. | Cellánként cserélhető kép és szöveg, vásznon húzható osztók; automatikus tördelés több képarányra; képek fókuszpontjai átrendezés közben is megmaradjanak. |
| Bento · 2 × 2 kinyílás | Bento-rács (`bento`). Elrendezés = 2 × 2; Belépés = Kinyílás; Sorrend = Középről | Cellánként cserélhető kép és szöveg, vásznon húzható osztók; automatikus tördelés több képarányra; képek fókuszpontjai átrendezés közben is megmaradjanak. |
| Bento · üveg kártyák | Bento-rács (`bento`). Elrendezés = Kártyasor (4); Belépés = Becsúszás alulról; Kitöltés = Üveg; Magasság = 0.6 | Cellánként cserélhető kép és szöveg, vásznon húzható osztók; automatikus tördelés több képarányra; képek fókuszpontjai átrendezés közben is megmaradjanak. |
| Bento · átrendeződés | Bento-rács (`bento`). Elrendezés = Mozaik (5); Sorrend = Véletlen; Átrendeződés erre = 3 oszlop; Átrendeződés ideje (mp) = 2; Kitöltés = Paletta | Cellánként cserélhető kép és szöveg, vásznon húzható osztók; automatikus tördelés több képarányra; képek fókuszpontjai átrendezés közben is megmaradjanak. |
| Bento · 3 × 3 körvonal | Bento-rács (`bento`). Elrendezés = 3 × 3; Sorrend = Középről; Kitöltés = Csak körvonal; Körvonal = 0.002; Árnyék = 0 | Cellánként cserélhető kép és szöveg, vásznon húzható osztók; automatikus tördelés több képarányra; képek fókuszpontjai átrendezés közben is megmaradjanak. |
| Alsó harmad sáv | Bento-rács (`bento`). Elrendezés = Sáv + címke; Belépés = Kibontás balról; Kiemelt doboz (0 = nincs) = 1; Szélesség = 0.95; Magasság = 0.17; Hézag = 0.012; Lekerekítés = 0.012 | Cellánként cserélhető kép és szöveg, vásznon húzható osztók; automatikus tördelés több képarányra; képek fókuszpontjai átrendezés közben is megmaradjanak. |
| Méret- és fókuszpop | Animált szöveg (`mtext`). Mozdulat = Méret- és fókuszpop; Időtartam (mp) = 0.5; Késleltetés egységenként (0 = egyben) = 0; Görbe = Rugó – pattanós; Kitöltés = Egyszínű; Szín 1 = #f4efe6 | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Kemény vágás | Animált szöveg (`mtext`). Mozdulat = Kemény vágás; Késleltetés egységenként (0 = egyben) = 0; Kitöltés = Egyszínű; Szín 1 = #ffffff | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Rugós ugrás | Animált szöveg (`mtext`). Mozdulat = Rugós ugrás; Késleltetés egységenként (0 = egyben) = 0.045; Görbe = Rugó – pattanós; Megnyúlás mozgás közben = 0.7 | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Beúszás oldalról | Animált szöveg (`mtext`). Mozdulat = Beúszás oldalról (maszk); Késleltetés egységenként (0 = egyben) = 0.04; Görbe = Rugó – finom; Kitöltés = Egyszínű; Szín 1 = #f4f1ee | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Kibontás középről | Animált szöveg (`mtext`). Mozdulat = Kibontás középről (maszk); Késleltetés egységenként (0 = egyben) = 0.03; Görbe = Erős | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Boil (kézzel rajzolt) | Animált szöveg (`mtext`). Kitöltés = Egyszínű; Szín 1 = #f4efe6; Boil (kézi remegés) = 0.8 | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Ütemre lüktető | Animált szöveg (`mtext`). Mozdulat = Pattanás; Görbe = Rugó – finom; Lüktetés (köss rá ütem-jelet) = 0; animált/jelvezérelt | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Elmosásból élesedés | Animált szöveg (`mtext`). Az elemtípus alapbeállításai. | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Emelkedő szavak | Animált szöveg (`mtext`). Mozdulat = Emelkedés; Egység = Szó; Késleltetés egységenként (0 = egyben) = 0.12; Kitöltés = Egyszínű; Szín 1 = #f4f1ee | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Felcsúszás maszkolva | Animált szöveg (`mtext`). Mozdulat = Felcsúszás maszkolva; Késleltetés egységenként (0 = egyben) = 0.04; Görbe = Rugó – finom; Kitöltés = Egyszínű; Szín 1 = #ffffff | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Pattanó betűk | Animált szöveg (`mtext`). Mozdulat = Pattanás; Késleltetés egységenként (0 = egyben) = 0.08; Görbe = Rugó – pattanós; Kitöltés = Paletta | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Gépelés | Animált szöveg (`mtext`). Mozdulat = Gépelés; Időtartam (mp) = 0.05; Késleltetés egységenként (0 = egyben) = 0.07; Kitöltés = Egyszínű; Szín 1 = #9fe8ff | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Kiolvasás (shimmer) | Animált szöveg (`mtext`). Erősség = 0.4; Kitöltés = Egyszínű; Szín 1 = #ede9e4; Fényhatás = Kiolvasás; Fényhatás tempója = 0.6 | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Hullámzó szöveg | Animált szöveg (`mtext`). Mozdulat = Hullám; Késleltetés egységenként (0 = egyben) = 0.05; Kitöltés = Paletta | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Átúszás | Átmenet (`reveal`). Az elemtípus alapbeállításai. | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Elmosásos zoom | Átmenet (`reveal`). Átmenet = Elmosásos zoom | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Folyékony feltárás | Átmenet (`reveal`). Átmenet = Folyékony feltárás; Időtartam (mp) = 1.8 | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Kör-maszk | Átmenet (`reveal`). Átmenet = Kör-maszk; Görbe = Rugó – finom | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Fényvillanás | Átmenet (`reveal`). Átmenet = Fényvillanás | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Glitch-vágás | Átmenet (`reveal`). Átmenet = Glitch-vágás; Időtartam (mp) = 0.6; Görbe = Lineáris | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Csíkok | Átmenet (`reveal`). Átmenet = Csíkok | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Forma-morph | Átmenet (`reveal`). Átmenet = Forma-morph (kör → doboz → kép); Időtartam (mp) = 1.8 | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Átrepülés | Átmenet (`reveal`). Átmenet = Átrepülés (zoom-through); Görbe = Erős | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Betolás rugóval | Átmenet (`reveal`). Átmenet = Betolás rugóval; Időtartam (mp) = 1; Görbe = Rugó – finom | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Átlós seprés | Átmenet (`reveal`). Átmenet = Átlós seprés; Időtartam (mp) = 1.1 | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Panelek nyílása | Átmenet (`reveal`). Átmenet = Panelek nyílása; Görbe = Rugó – finom | Két kijelölt jelenet/réteg közötti valódi átmenet, külön be- és kimeneti maszk; ütemhez igazítás, saját képmaszk, visszatekerhető állapot. A Forma-morph nevű átmenet nem általános kontúrmorf. |
| Vetítő · szépia | Vetítő (`projector`). Tónus = Szépia | Menthető filmanyag-/objektívpresetek, hitelesebb por/karc időminták, külön kamera- és képanyagmozgás; loop és export állapotának egyezése. |
| Vetítő · fekete-fehér | Vetítő (`projector`). Por és karcok = 0.7; Vibrálás = 0.5; Tónus = Fekete-fehér | Menthető filmanyag-/objektívpresetek, hitelesebb por/karc időminták, külön kamera- és képanyagmozgás; loop és export állapotának egyezése. |
| Fényszivárgás | Vetítő (`projector`). Por és karcok = 0; Fényszivárgás = 0.9; Vibrálás = 0.15; Filmkocka-ugrálás = 0; Kameralebegés = 0; Színszél = 0.1; Szemcse = 0.15; Vignetta = 0.2 | Menthető filmanyag-/objektívpresetek, hitelesebb por/karc időminták, külön kamera- és képanyagmozgás; loop és export állapotának egyezése. |
| Kameralebegés | Vetítő (`projector`). Por és karcok = 0; Fényszivárgás = 0; Vibrálás = 0; Filmkocka-ugrálás = 0.1; Kameralebegés = 0.7; Színszél = 0.15; Szemcse = 0; Vignetta = 0 | Menthető filmanyag-/objektívpresetek, hitelesebb por/karc időminták, külön kamera- és képanyagmozgás; loop és export állapotának egyezése. |

### Részecskék — 6 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Szétrobbanó és visszaálló felirat | Szöveg (`text`). Az elemtípus alapbeállításai. Hozzárendelt Megjelenés: Részecskékre bontás. | Csereszövegek listája közvetlenül; olvasható nyugalmi szakasz és külön szél/összeálláskarakter. |
| Részecskékre bontás (Megjelenés) | Részecskékre bontás (`pdisp`). Az elemtípus alapbeállításai. | Ráhúzható szétesés jelzésre; saját sprite és célalak a visszaálláshoz. |
| Részecskék (alatta lévő kép) | Részecskék (`particles`). Az elemtípus alapbeállításai. | Saját pont/vonal/felület/térfogat kibocsátó; életkor, szín-/méretgörbe és fizikai mezők; sprite-atlasz, ütközés, közös szél. A jelenlegi pixelfelbontástól ez külön részecskeforrás. |
| Részecskék saját képből | Részecskék (`particles`). Forrás = Saját kép; Mélység a fényességből = 0.5; Forrás elrejtése = Nem | Saját pont/vonal/felület/térfogat kibocsátó; életkor, szín-/méretgörbe és fizikai mezők; sprite-atlasz, ütközés, közös szél. A jelenlegi pixelfelbontástól ez külön részecskeforrás. |
| Ütemre robbanó | Részecskék (`particles`). Szétszóródás = 0; animált/jelvezérelt; Áramlás = 0.4; Szín = Paletta | Saját pont/vonal/felület/térfogat kibocsátó; életkor, szín-/méretgörbe és fizikai mezők; sprite-atlasz, ütközés, közös szél. A jelenlegi pixelfelbontástól ez külön részecskeforrás. |
| Lebegő porfelhő | Részecskék (`particles`). Pontméret = 1.5; Mélység a fényességből = 0.8; Áramlás = 1.2; Dőlés ° = -20; Forgás = 0.08 | Saját pont/vonal/felület/térfogat kibocsátó; életkor, szín-/méretgörbe és fizikai mezők; sprite-atlasz, ütközés, közös szél. A jelenlegi pixelfelbontástól ez külön részecskeforrás. |

### Világok — 47 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Szaturnusz napnyugtakor | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R28. | Holdak, keskenyebb és színátmenetes gyűrűk, bolygóhoz kötött árnyék; háttérszínből vett légkör és lassú körbejárás. |
| Óceánbolygó holddal | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R29. | Holdak száma, mérete és pályasugara egy vezérlőcsoportban; közös Nap, forgás/keringés külön; valódi terep és partvonal később. |
| Jégvilág | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R30. | Repedezett felszín, fehér/kék/rózsaszín gradiens, vékony légkör és apró jéghold; finom csillám külön részecskékkel. |
| Lávabolygó | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R31. | Domborzatos kéreg, lávatavak és közös emisszió/glow; hamufelhő és fekete előtérkőzetek. |
| Csillagközi tájkép | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R32. | Valódi előtérterep, mélységi köd és több egymás mögötti bolygó; közös fény, szín és horizont; ebből lehet teljes űr-landscape család. |
| Bliss-dombok | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R40. | Több elülső/hátsó dombsáv és közös páravezérlés; váltható 3D terep; az ég, növények és felhők ugyanazt a szelet kapják. |
| Arany naplemente | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R41. | A Naphoz kötött sugarak takarása, víztükör és közös melegedő színvilág; teljes naplemente-időjárás ív. |
| Viharos ég | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R42. | Villám külön forrásból, eső részecskékkel, közös széllökések; fényvillanás minden tájréteget érintsen, ne csak a hátteret. |
| Éjszakai égbolt | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R43. | Holdfázis és kapcsolt holdfény, több mélységű csillagok, horizontköd; lassú éjszakából hajnalba átmenet. |
| Sivatag délben | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R44. | Valódi 3D dűnék, szélhordta homok, dűnegerinc és távoli hőremegés; fix horizontú kamerautak. |
| Havas csúcsok | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R45. | 3D hegyek, magasság/lejtés alapú hóhatár, hópelyhek és közös hideg fény; felhőárnyék és völgyköd. |
| Bolygó rétegekből | Szerkeszthető receptcsoport; részletes rétegek és vezérlők: R52. | Felszín/felhő/légkör/gyűrű paraméterei közös alapból származzanak, ne essenek szét külön méretezéskor; hold és valódi domborzat opcionális komponens. |
| Égszín | Égszín (`skygrad`). Az elemtípus alapbeállításai. | Kézi zenit/horizont színpontok és saját napszakpresetek; több égboltréteg; a 3D terep és a felhők azonos fény-/napszakállapotot kapjanak. |
| Nap | Nap (`sun`). Az elemtípus alapbeállításai. | A korong, korona és sugárzás külön komponensek; napfoltok és protuberanciák külön csillagpresetként; közös fényforrás-hozzárendelés a bolygóknak és a tájnak. |
| Felhő (önálló tárgy) | Felhő (`cloud3d`). Az elemtípus alapbeállításai. | Közös szél és térbeli elosztás, több felhőcsomó szerkesztése, háttérbe simuló vékony perem; füst-/ködanyag külön presetként, valós szimuláció ígérete nélkül. |
| Gomolyfelhők | Felhőréteg (`clouds`). Az elemtípus alapbeállításai. | Felhőcsoportok elhelyezése, több magassági sáv és közös szél; nap előtti áthaladás, távolsági halványulás; 3D felhőréteggel cserélhető receptkomponens. |
| Fátyolfelhők | Felhőréteg (`clouds`). Felhők = Fátyol; Borítottság = 0.55 | Felhőcsoportok elhelyezése, több magassági sáv és közös szél; nap előtti áthaladás, távolsági halványulás; 3D felhőréteggel cserélhető receptkomponens. |
| Viharfelhők | Felhőréteg (`clouds`). Felhők = Vihar; Borítottság = 0.75; Napszak = 0.3 | Felhőcsoportok elhelyezése, több magassági sáv és közös szél; nap előtti áthaladás, távolsági halványulás; 3D felhőréteggel cserélhető receptkomponens. |
| Lapos felhők | Felhőréteg (`clouds`). Borítottság = 0.5; Nézet = Lapos | Felhőcsoportok elhelyezése, több magassági sáv és közös szél; nap előtti áthaladás, távolsági halványulás; 3D felhőréteggel cserélhető receptkomponens. |
| Dombvonal (maszk) | Alakzat (`shape`). Forma = Dombvonal; Méret = 0.14; Lekerekítés = 0; Belső arány = 0.3 | Szabadon szerkeszthető kontúr, animálható csúcspontok, valódi többszínű gradiens, külön kitöltés/körvonal. Formák összevonása, kivonása és varratmentes morfja. |
| Hegyvonal (maszk) | Alakzat (`shape`). Forma = Dombvonal; Méret = 0.22; Lekerekítés = 0.85; Oldalak / csúcsok = 7; Belső arány = 0.5 | Szabadon szerkeszthető kontúr, animálható csúcspontok, valódi többszínű gradiens, külön kitöltés/körvonal. Formák összevonása, kivonása és varratmentes morfja. |
| 3D Terep · hegyvidék | 3D Terep (`terrain3d`). Az elemtípus alapbeállításai. | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| 3D Terep · dűnék | 3D Terep (`terrain3d`). Tereptípus = Dűne; Stílus = Sivatag; Vízszint = 0 | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| 3D Terep · sziget | 3D Terep (`terrain3d`). Tereptípus = Sziget; Méret (mennyi táj) = 1; Vízszint = 0.3 | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| 3D Terep · kanyon | 3D Terep (`terrain3d`). Tereptípus = Kanyon; Stílus = Sivatag; Vízszint = 0.08 | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| 3D Terep · fennsík | 3D Terep (`terrain3d`). Tereptípus = Fennsík; Stílus = Sivatag; Vízszint = 0 | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| 3D Terep · kráteres | 3D Terep (`terrain3d`). Tereptípus = Kráter; Stílus = Vulkáni; Vízszint = 0.1 | A domborzatmag külön, ráhúzható komponens legyen; gömbre és később más valódi 3D hálóra is alkalmazható. Biomszínezés, rétegezett zaj, partvonal, folyó és erózió külön lépcsőkben. Növény- és kőszórás, tükröződő víz, menthető kameraképek. |
| Talaj · fű | Talaj (`terrain`). Az elemtípus alapbeállításai. | Biomszínek, perspektívaskála és a dombvonalhoz igazított textúra; külön talajanyag a valódi 3D terep számára. Ne nevezzük a 2D maszkolt talajt térbeli tájnak. |
| Talaj · száraz fű | Talaj (`terrain`). Felület = Száraz fű | Biomszínek, perspektívaskála és a dombvonalhoz igazított textúra; külön talajanyag a valódi 3D terep számára. Ne nevezzük a 2D maszkolt talajt térbeli tájnak. |
| Talaj · homok | Talaj (`terrain`). Felület = Homok | Biomszínek, perspektívaskála és a dombvonalhoz igazított textúra; külön talajanyag a valódi 3D terep számára. Ne nevezzük a 2D maszkolt talajt térbeli tájnak. |
| Talaj · szikla | Talaj (`terrain`). Felület = Szikla | Biomszínek, perspektívaskála és a dombvonalhoz igazított textúra; külön talajanyag a valódi 3D terep számára. Ne nevezzük a 2D maszkolt talajt térbeli tájnak. |
| Talaj · hó | Talaj (`terrain`). Felület = Hó | Biomszínek, perspektívaskála és a dombvonalhoz igazított textúra; külön talajanyag a valódi 3D terep számára. Ne nevezzük a 2D maszkolt talajt térbeli tájnak. |
| Pára | Pára (`haze`). Az elemtípus alapbeállításai. | Háttérbe simulás közös effektként: ködszín a környezetből, magasság-/mélységfüggő erő; több ködréteg és peremlágyítás. A valódi mélységalapú köd új mélységbemenetet igényel. |
| Talajköd | Pára (`haze`). Erősség = 0.15; Talajköd = 0.8 | Háttérbe simulás közös effektként: ködszín a környezetből, magasság-/mélységfüggő erő; több ködréteg és peremlágyítás. A valódi mélységalapú köd új mélységbemenetet igényel. |
| Fénysugarak | Fénysugarak (`radial`). Erősség = 0.9; Hossz = 1.4; Küszöb = 0.45 | Kijelölt Naphoz kötés, fénysugarak takarásmaszkja és színe; sugárszám, puhaság és hossz külön, képkivágáson kívüli forrás kezelése. |
| Lencsefény | Lencsefény (`flare`). Az elemtípus alapbeállításai. | Kapcsolás Naphoz vagy kijelölt fényhez, képszélen természetes halványulás; alakú apertúra és menthető objektívpreset; takarás figyelembevétele később. |
| Óceánbolygó | Bolygó (`planet`). Az elemtípus alapbeállításai. | Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek. |
| Gázóriás gyűrűvel | Bolygó (`planet`). Típus = Gázóriás; Mag = 21; Légkör színe = #ffcf9a; Felhőzet = 0; Gyűrű = 0.9 | Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek. |
| Jégvilág | Bolygó (`planet`). Típus = Jég; Mag = 5; Légkör színe = #bfe6ff; Felhőzet = 0.3 | Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek. |
| Lávabolygó | Bolygó (`planet`). Típus = Láva; Mag = 13; Nap iránya ° = 150; Légkör = 0.6; Légkör színe = #ff6a2a; Felhőzet = 0 | Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek. |
| Sziklás hold | Bolygó (`planet`). Típus = Sziklás; Mag = 3; Légkör = 0; Felhőzet = 0; Kráterek / viharok = 1 | Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek. |
| Sivatagbolygó | Bolygó (`planet`). Típus = Sivatag; Mag = 9; Légkör színe = #ffb27a; Felhőzet = 0.15 | Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek. |
| Erdőbolygó éjjel | Bolygó (`planet`). Típus = Erdő; Mag = 31; Nap iránya ° = 160; Városfények = 1.4 | Valódi felszíni domborzat a T2-ben, hold-komponens és kapcsolt pálya, közös Nap. Többrétegű légkör és háttérből átvett peremszín; biomszínek és saját színátmenetek; külön óceán-, jég-, gáz- és lávapresetek. |
| Tejút | Űr (`space`). Tejút = 1.6; Porsávok = 1; Köd = 0.2; Fényes csillagok = 0.4 | Csillagok, Tejút, por és köd külön vezérelhető darabok; csillagszín/pontméret és mélység; kijelölt kompozíciós fókusz körül nyugodtabb háttér; nagyfelbontású stabil csillagok. |
| Csillagköd-mező | Űr (`space`). Mag = 44; Tejút = 0.3; Köd = 1.6 | Csillagok, Tejút, por és köd külön vezérelhető darabok; csillagszín/pontméret és mélység; kijelölt kompozíciós fókusz körül nyugodtabb háttér; nagyfelbontású stabil csillagok. |
| Mély űr | Űr (`space`). Mag = 91; Csillagok = 1.4; Tejút = 0.5; Köd = 0.4 | Csillagok, Tejút, por és köd külön vezérelhető darabok; csillagszín/pontméret és mélység; kijelölt kompozíciós fókusz körül nyugodtabb háttér; nagyfelbontású stabil csillagok. |
| Bokeh | Bokeh (`bokeh`). Az elemtípus alapbeállításai. | Objektívformák, fókusz- és mélységalapú korongméret, irányított sodródás; a főcím mögötti fények automatikus visszafogása és saját színpaletta. |

### Szöveg és média — 6 bejegyzés

| Elem | Most / működés | Jobbá tétel [Ö] |
|---|---|---|
| Szöveg | Szöveg (`text`). Az elemtípus alapbeállításai. | Gazdag soronkénti és betűnkénti tipográfia, saját font kezelése, útvonalas felirat. Árnyék/körvonal/gradiens közös szöveganyagként; 3D extrudálás és lufibetű külön fejlesztés. |
| Animált szöveg | Animált szöveg (`mtext`). Az elemtípus alapbeállításai. | A mozdulatok külön ráhúzható mozgásként is használhatók legyenek; betű/szó/sor szerinti kijelölés, fontcsere után is megtartott időzítés; útvonal, kör és 3D változat. |
| Kép | Kép (`image`). Az elemtípus alapbeállításai. | Kivágás és fókuszpont a vásznon, képcsere a beállítások elvesztése nélkül, beágyazás/hiányzó média jelzése; maszk és mélységtérkép. |
| Poly Haven textúrák | Kép (`image`). Az elemtípus alapbeállításai. | A mostani 12 elemes 2D katalógus után külön PBR-térképcsomag, saját kedvencek és tartós média. |
| Vektoranimáció (Lottie) | Vektoranimáció (`lottie`). Az elemtípus alapbeállításai. | A vektoros import bővítése előbb ellenőrzött kép/fontfüggőségekkel, aztán szín- és szegmensvezérlés. |
| Saját GLSL | Saját GLSL (`custom`). Az elemtípus alapbeállításai. | Tényleges ráhúzható saját Megjelenés, szín- és képvezérlők, shaderhiba érthető helye; előnézet és költségjelzés; saját shadercsomagok importja ellenőrzéssel. |

## 6. Paletták és végső képi stílusok

### A 18 jelenlegi paletta [B]

A paletta most koszinuszos színfüggvény: a réteg mintája a függvény különböző pontjait veszi. Nem kézzel mozgatható, tetszőleges számú gradiensállomás. Minden paletta több elemhez is rendelhető; a támogatás típustól függ.

| Paletta | Jelenlegi jelleg / használat | Fejlesztési ötlet [Ö] |
|---|---|---|
| Spektrum | Teljes színtartomány. | Kijelölhető színsáv és visszafogott telítettségű párja. |
| Napkorona | Meleg, körbefutó színritmus. | Fekete–vörös–narancs–fehér hőmérsékleti gradiens. |
| Rózsakvarc | Rózsás árnyalatok. | Kristályhoz áttetsző, gyöngyházhoz lágy változat. |
| Citrus | Élénk citrusos tartomány. | Zöld/sárga/narancs arány, sötét kontrasztpont. |
| Borostyán | Meleg barnás/aranyló tartomány. | Méz/üveg/sivatag változatok saját színpontokkal. |
| Ultraviola | Erős lilás színritmus. | Neon és köd változat, túl világos részek védelme. |
| Korall-jáde | Korallos és zöldes tartomány. | Természetes táj és plakát verzió külön. |
| Mély űr | Sötét kozmikus paletta. | Csillag-, köd- és árnyékszínek szerepenként. |
| Aranyfény | Aranyló fénytartomány. | Fém csúcsfény és meleg aura külön színmenettel. |
| Jégkék | Kékes-fehéres színek. | Jeges felszín, légkör és árnyék összehangolt hármasa. |
| Teal és narancs | Kékeszöld/meleg kontraszt. | Bőrtónusvédelem és telítettségi korlát. |
| Éjfél-arany | Sötét/meleg kontraszt. | Főcím és háttér olvashatósági pár. |
| Ibolya alkony | Lilás alkonyi tartomány. | Napszakhoz interpolált ég/felhő/föld színcsalád. |
| Holografikus | Világos, irizáló tartomány. | Anyagfüggő színváltás, semleges háttérpár. |
| Mélytenger | Sötét kékeszöld. | Mélységfüggő szín, biolumineszcens kiemelés. |
| Parázs | Sötét vöröses/meleg fény. | Láva emisszió és hűlő kéreg külön kezelése. |
| Ezüst | Semleges, fémes szürke tartomány. | Környezeti színnel kevert króm/ezüst preset. |
| Pasztell köd | Világos, alacsonyabb kontrasztú színek. | Kontrasztos feliratpár és ködszín szerepek. |

### A hat végső képi stílus [B]

Ezek az egész jelenet utolsó képi feldolgozásának beállításai, nem új geometriai elemek. Expozíció, bloom, halation, szemcse, vignetta, kromatikus eltérés, kontraszt, telítettség, színhőmérséklet, fátyol és élesítés szerepelhet bennük.

- **Filmes:** jelenlegi értékek: tone=1, exposure=0, bloom=0.5, radius=0.6, thresh=0.8, hal=0.3, grain=0.25, vig=0.35, chroma=0.1, contrast=1.05, sat=0.95, temp=0.08, fade=0.03, sharpen=0.15. **Jobbá tétel:** Több filmanyag és finom váll a csúcsfényen; LUT-változatok.
- **Tiszta:** jelenlegi értékek: tone=2, exposure=0.1, bloom=0.35, radius=0.5, thresh=0.9, hal=0, grain=0.06, vig=0.15, chroma=0, contrast=1.04, sat=1.05, temp=0, fade=0, sharpen=0.25. **Jobbá tétel:** Színhelyes semleges alap és tipográfiabarát élesítés.
- **Álomszerű:** jelenlegi értékek: tone=2, exposure=0.15, bloom=0.9, radius=0.85, thresh=0.5, hal=0.2, grain=0.15, vig=0.3, chroma=0.05, contrast=0.95, sat=0.85, temp=0.05, fade=0.1, sharpen=0. **Jobbá tétel:** Bloom és fátyol külön, a főcím részleteinek védelme.
- **Analóg:** jelenlegi értékek: tone=1, exposure=0, bloom=0.4, radius=0.55, thresh=0.75, hal=0.55, grain=0.5, vig=0.5, chroma=0.3, contrast=1.1, sat=0.88, temp=0.15, fade=0.07, sharpen=0.05. **Jobbá tétel:** Felbontásfüggetlen szemcse, menthető filmes karakter.
- **Neon noir:** jelenlegi értékek: tone=1, exposure=0.2, bloom=1, radius=0.7, thresh=0.6, hal=0.15, grain=0.2, vig=0.45, chroma=0.15, contrast=1.15, sat=1.15, temp=-0.12, fade=0, sharpen=0.1. **Jobbá tétel:** A telített fények kiégésvédelme, feketeszint megtartása.
- **Nyers:** jelenlegi értékek: tone=0, exposure=0, bloom=0, radius=0.6, thresh=0.8, hal=0, grain=0, vig=0, chroma=0, contrast=1, sat=1, temp=0, fade=0, sharpen=0. **Jobbá tétel:** Kalibrált összehasonlító mód; egyértelműen semleges kiindulás.

### Saját fájlos minták [B / referenciaport]

- `presets/egyedi/liquid-glass-eredeti-port.json`: a fotós Liquid Glass preset leírása; a lencse és a kép külön szerkeszthető. Jobbá tétel: képcsere és lencsealak, a külső tartalmak forrásának megőrzésével.
- `presets/egyedi/liquid-glass-eredeti-demo.vel.json`: teljes mintaprojekt ugyanahhoz. Jobbá tétel: tiszta munkamenetes hordozhatósági próba, saját fotós változat.
- `presets/egyedi/lang-eredeti-demo.vel.json`: láng-mintaprojekt. Jobbá tétel: a jelzett függőleges műtermék javítása, utána széllökés/füst/parázs.
- A JPG háttér és a NOTICE forráskísérő fájl, nem új preset. A minták a már felsorolt Liquid Glass és Láng elemeket használják, ezért nem számoljuk új elemtípusnak.

## 7. Mind a 63 külön bővítmény és a két layout

**Állapot mind a 63 sornál: P, nincs integrálva.** A laborban tényleges modul és példa van. A 63 elem böngészős elindulási próbája nem jelenti mindegyik teljes vizuális vagy 4K-validálását. Néhány inkább belső eszköz, mint a könyvtárba való preset. Az importmodulok nem jelentik az egész külső assetgyűjtemény letöltését. A mostani Velben esetleg már létező hasonló funkciót külön jelöljük; a prototípus nem feltétlenül jobb annál.

| # / modul | Mit tud most a külön kód? | Helye a Velben | Jobbá tétel / felhasználás [Ö] |
|---|---|---|---|
| 01. Térbeli formaműveletek (`01-csg`) | Háromszöghálók geometriai hozzáadása/kivonása/metszése. | Formák / eszköz | Szabadon mozgatható kivágóformák és élminőség; a Vel SDF-jelenete mellett külön mesh-mód. |
| 02. Hálósimítás (`02-subdivide`) | Meglévő háló felosztása és simítása. | Forma művelet | Részletességi plafon és eredeti alakot védő kapcsoló; puha logó és terméktest. |
| 03. Matrica 3D tárgyon (`03-decal`) | Képmatrica rávetítése 3D tárgy felszínére. | Megjelenés / anyag | Felületen húzható logó, vetítési irány, átfedés és kopott festés. |
| 04. Kontúr térbelivé alakítása (`04-extrude`) | Sík kontúrból vastagsággal bíró 3D test. | Forma / szöveg | Betűk és SVG logók extrudálása; éllekerekítés, oldal- és homlokanyag külön. |
| 05. Görbére hajlítás (`05-curve-flow`) | Valódi háló görbére hajlítása. | Deformáció / Mozgás | Élő szöveg, hajló szalag, hajlítási előrehaladás; kézi útvonalas kontroll. |
| 06. Összeolvadó térbeli formák (`06-metaballs`) | Összeolvadó térbeli felület előállítása. | Forrás / Forma | Megfogható cseppek, alakba rendeződés, felületminőség és több anyag. |
| 07. Felületre szórás (`07-surface-scatter`) | Pontok determinisztikus szórása háló felszínére. | Elosztó / Részecske | Növények terepre, kristályok sziklára; meredekség/magasság/sűrűségmaszk. |
| 08. SVG import (`08-svg-import`) | SVG feldolgozása a támogatott vektoros tartományban. | Média / Forma | Szerkeszthető kontúrok, kitöltési hibák jelzése; extrudálás és vonalrajzolás. |
| 09. Font és betűkontúrok (`09-font-outlines`) | Fontfájlból betűkontúr lekérése. | Szöveg eszköz | Szöveg maradjon átírható; betűforma-morf, extrudálás és fonalrajz. |
| 10. Vektoros görbesimítás (`10-vector-paths`) | Vektoros görbe simítása és szerkeszthető görbeadat. | Útvonal eszköz | A vásznon fogott pontok és tangensek; közös forma-/mozgáspálya. |
| 11. Sík formaműveletek (`11-polygon-boolean`) | Sík sokszögek egyesítése/kivonása/metszése. | 2D Forma művelet | Interaktív összegyúrás, lyukak megőrzése; logóépítés és maszk. |
| 12. Kontúr háromszögelése (`12-triangulate`) | Kontúr háromszögekre bontása a renderhez. | Belső formaalap | Önmetsző kontúrok hibajelzése, lyukak tesztje; nem önálló látványcsempe. |
| 13. Voronoi mozaik (`13-voronoi`) | Voronoi-cellák generálása. | Forrás / Átmenet | Kijelölt gócpontok és darabokra törő kép; sejtes és ólomüveg-világ. |
| 14. Saját 3D shaderanyag (`14-custom-material`) | Saját shaderrel módosítható Three.js anyag. | Anyag / fejlesztői alap | Névvel ellátott vezérlők és paramétermentés; a saját WebGL2-hoston külön adapter. |
| 15. Sík tükör (`15-planar-reflection`) | Síkbeli tükröződés külön renderútból. | Megjelenés / világdarab | Nedves padló és víztükör; minőségi profil és elmosási kontroll. |
| 16. Környezeti fény előkészítése (`16-environment-map`) | Környezeti fénytérkép előkészítése és anyagra adása. | Világ / anyag | HDR-választó, fényforgatás és expozíció; a látható háttér és világítás külön. |
| 17. Térbeli mélyedésárnyék (`17-contact-shading`) | Térbeli mélyedések/érintkezések árnyalása renderpasszal. | Megjelenés | Tárgyak talajra ültetése, erő/távolság és zajmentes minőségi profil. |
| 18. LUT színprofil (`18-lut-import`) | LUT színprofil feldolgozása és mintavétele. | Megjelenés | Valódi LUT alkalmazópassz és összehasonlító csúszka; filmes stíluskönyvtár. |
| 19. Érzékelésalapú gradiens (`19-perceptual-gradient`) | Érzékelésalapú színterekben képzett átmenet. | Szín eszköz | Színpontok szerkesztése, sávosodás ellen finom zaj; palettaimport/export. |
| 20. Paletta és kontraszt (`20-palette-scales`) | Színskálák és kontraszt számítása. | Paletta / ellenőrzés | Szerepalapú háttér/főcím/kiemelés; olvashatósági visszajelzés, kézi felülírással. |
| 21. Kamera célzása (`21-camera-framing`) | Kamera célzása és időből számolható felvétel. | Kamera / Mozgás | Körbejárás, közelítés, fókuszváltás és kameraképek mentése. |
| 22. Csontlánc végpontja (`22-ik-chain`) | Csontlánc alakítása végpont alapján. | Mozgás / Forma | Kötél, csáp, szalagvégek; merevség/nyúláskorlát és kezelhető fogantyúk. |
| 23. Nebula részecskék (`23-nebula-particles`) | Nebula alapú részecskeszimuláció. | Részecske Forrás | Füst, szikra és por; emitter/életkor/seed, visszatekerhető állapot. A másik részecskemotorral választani kell. |
| 24. Merevtestek Cannon motorral (`24-rigid-bodies`) | Cannon merevtestek gravitációval/ütközéssel. | Fizika / Mozgás | Leesés, pattogás, gurulás; egy közös fizikai motor és determinisztikus visszajátszás. |
| 25. GPU részecskeállapot (`25-gpu-particle-state`) | GPU-textúrákban tárolt részecskeállapot technikai alapja. | Belső részecskealap | Nagy pontszám, erőterek és menthető induló seed; nem kész fizikai részecskerendszer. |
| 26. Bézier sebességgörbe (`26-bezier-easing`) | Bézier sebességgörbe számítása. | Mozgás / időzítés | Elnevezett karakterek, görbeszerkesztő; a Vel meglévő saját görbéivel egységesítve. |
| 27. Explicit idejű tween (`27-tween-sampling`) | Tween állapotának mintavétele megadott időpontban. | Mozgás alap | Lépcsőzés és mozgáscsaládok; ne adjon második órát a Vel mellé. |
| 28. Hanghullám (`28-waveform`) | Hanghullám megjelenítése és csúcskivonat. | Hang / idővonal | Jelzések a hullámon, kijelölhető szakaszok; hang és projekt közös hordozhatósága. |
| 29. Hangjellemzők (`29-audio-features`) | Hangból jellemzők, például amplitúdó számítása. | Jel / Kapcsolat | Lábdob/pergő/frekvenciasáv célzott vezérlés, simítás és erőkorlát; meglévő hangjelek mellé. |
| 30. Metronóm (`30-metronome`) | Metronómütem lejátszása. | Hang eszköz | Tempókoppintás és idővonalhoz igazítás; meglévő BPM-rendszerhez csatlakozzon. |
| 31. Gyors térbeli kijelölés (`31-bvh-picking`) | Gyorsított térbeli sugármetszés hálókon. | Kijelölő eszköz | Pontos 3D felületkijelölés matrica/elhelyezés számára; nem általános 2D kijelöléscsere. |
| 32. GLB optimalizálás (`32-gltf-optimize`) | GLB-adatok optimalizálása. | Import eszköz | Import előtti méretjelzés, animáció/anyagok megőrzése, visszaállítható eredeti. |
| 33. Háló egyszerűsítése (`33-mesh-simplify`) | Háromszögháló egyszerűsítése. | Import / minőség | Előnézeti és export-LOD, alakhiba-korlát; áttetsző és apró részletek védelme. |
| 34. Sok azonos tárgy (`34-instanced-copies`) | Sok azonos tárgy hatékony példányos rajzolása. | Elosztó / Forrás | Csillagok, kövek, növények és város; példányonként szín/méret/forgás és seed. |
| 35. Közös tárgyrajzolás (`35-batched-objects`) | Eltérő tárgyak közös rajzolási csoportba szervezése. | Belső renderalap | Nagy világok gyorsítása, dinamikus frissítés és anyagkompatibilitás ellenőrzése. |
| 36. WebGL képkockavizsgáló (`36-frame-debugger`) | WebGL képkocka műveleteinek vizsgálata. | Fejlesztői eszköz | Lassú elemek azonosítása, mérési profilok; ne kerüljön az alkotói presetpolcra. |
| 37. WebGL hibakereső (`37-webgl-lint`) | WebGL hibák részletesebb jelzése. | Fejlesztői eszköz | Érthető shader- és állapothibák fejlesztői módban; termékben kikapcsolható költség. |
| 38. Átrendezhető eszköztár (`38-sortable-toolbar`) | DOM-lista húzással átrendezése. | Felület | Saját felső eszköztár, kedvenc műveletek, tartós sorrend és billentyűzetes kezelés. |
| 39. Állítható panelek (`39-split-panels`) | Panelek közti osztók húzása. | Felület | Mentett munkatér, panelminimumok, összecsukás és visszaállítás. |
| 40. Növényi atlasz (`40-foliage-assets`) | Felhasználó által adott növényi sprite-atlasz importja. | Média / Részecske | Terepre szórt fű/levél; szél, talajillesztés és helyes áttetszőség. Nem letöltött teljes növénykönyvtár. |
| 41. Füstatlasz (`41-smoke-assets`) | Felhasználó által adott füstsprite-ok importja. | Média / Részecske | Kor szerinti képkockaváltás, szín és puha keverés; tényleges emitterrel összekötés. |
| 42. Poly Haven kép és HDR (`42-polyhaven-intake`) | Kép- és HDR-behozatal Poly Haven forrásokhoz. | Média / Világ | A főappban már van PH1 2D import; a labor további HDR/anyag-adapter alap, nem annak automatikus bővítése. |
| 43. PBR anyagimport (`43-ambient-pbr`) | PBR-textúratérképek anyaggá kapcsolása. | Anyag | Szín/normal/roughness skálázás, hiányzó térképek kezelése és tartós csomagolás. |
| 44. Részecskeatlasz (`44-particle-atlas`) | Felhasználó által adott részecskesprite-ok importja. | Média / Részecske | Szikra, csillag, papír és hó; méret/szín életkor szerint, atlaszlapok választása. |
| 45. Hengeres élő szöveg (`45-curved-text`) | Szerkeszthető szöveg hengeres/görbült térbeli megjelenítése. | Szöveg / Forrás | Szabad görbe, teljes kör, szalag; per-betű mozgás és fontfüggőségek mentése. |
| 46. Útvonalas cső (`46-path-tube`) | Görbe köré épített térbeli cső. | Forma / Forrás | Csőprofil, vastagságváltozás és növekedés; neoncső, kábel, szerves inda. |
| 47. Változó vastagságú vonal (`47-tapered-line`) | Változó vastagságú vonal. | Forma / rajzolás | Kézi nyomás, végződések és útvonalas fény; 2D/3D méret viszonyának tisztázása. |
| 48. Üveganyag (`48-glass-material`) | Three.js üveganyag. | Megjelenés / Anyag | Vastagság/fénytörés és környezeti tükröződés; közös térbeli háttér szükséges a hiteles eredményhez. |
| 49. Quarks részecskék (`49-quarks-emitter`) | Quarks részecskeemitter. | Részecske Forrás | Tűz, konfetti és füst családok; közös mezők és Vel-időhöz igazított replay. Ne tartsunk két teljes emitterrendszert szükség nélkül. |
| 50. Áramló festékmező (`50-fluid-field`) | Saját áramló festékmező-prototípus, nem az eredeti Pavel-kód portja. | Forrás / Megjelenés | Festékinjektorok, több szín és viszkozitás; felvett ecsetmozgás, stabil seek és export. |
| 51. Tükröződő víz (`51-water-surface`) | Tükröződő víz Three.js Water alapján. | Világdarab / Anyag | Tereppart, vízmélység és saját környezeti kép; visszatekerhető hullám és költségprofil. |
| 52. Seedelt makettváros (`52-seeded-city`) | Seedelt makettváros elrendezése. | Világ / Recept | Utcaháló, városrészek és importált épületkit; jelenleg nem teljes, kész Kenney-assetkönyvtár. |
| 53. Procedurális zaj (`53-procedural-noise`) | Procedurális zaj GLSL-függvényei. | Deformáció / Mozgás alap | Organikus lebegés, terep, szél és felületi torzítás közös seed/fázis mellett. |
| 54. Utófeldolgozás (`54-postprocessing`) | Three.js utófeldolgozási lánc. | Megjelenés / renderalap | Kiválasztott minőségi passzok; a Vel saját glow/grade rendszerét ne duplázza teljes második pipeline-nal. |
| 55. Merevtestek Rapier motorral (`55-rapier-physics`) | Rapier merevtestszimuláció. | Fizika / Mozgás | Gyorsabb összetett ütközések; Cannonhoz képest célzott választás, menthető induló állapot és visszatekerés. |
| 56. Folyamatos videóexport (`56-streaming-export`) | Képkockák folyamatos videókódolása. | Export eszköz | Kisebb csúcsmemória, megszakítás és állapottakarítás; hangszinkron és nagy jelenetek vizsgálata. |
| 57. Színválasztó (`57-color-picker`) | Beágyazható színválasztó. | Felület / Szín | Megbízható alpha/HEX, visszavonás, gradiensállomások és közös paletta. |
| 58. Mozgáspálya illesztése (`58-fit-motion-path`) | Felvett pontokra Bézier-mozgáspálya illesztése. | Mozgás eszköz | Megőrzött időzítés, szerkeszthető tangensek, pályán való fordulás és újrahasznosítás. |
| 59. DOM transzformáció (`59-dom-transform`) | DOM-elemek transzformációs fogantyúi. | Layout eszköz | WIDE-szerű szerkesztés, snap és billentyűzet; a WebGL-vászon külön koordinátaadaptert igényel. |
| 60. Térbeli fogantyú (`60-transform-gizmo`) | Three.js térbeli transzformációs fogantyú. | 3D eszköz | Mozgatás/forgatás/méretezés tengelyekkel; Vel undo és Animálás módhoz kötés. |
| 61. Modellanimáció mintavétele (`61-model-animation`) | Modellanimáció mintavétele adott időben. | Mozgás / Média | Klipválasztó, sebesség/irány, hurkolás és klipkeverés külön; nincs automatikus karakter-újracélzás. |
| 62. GLB import (`62-gltf-import`) | GLB-modell betöltése. | Média / 3D Forma | Animáció és anyagátvitel, méret/tengely korrekció, assetbeágyazás és hibajelzés. |
| 63. Színkerék (`63-color-wheel`) | Interaktív színkerék. | Felület / Szín | Színharmóniák és gradiens szerkesztése; a másik színválasztóval egységes felületet válasszunk. |

### Unwoven [P]

**Most:** az eredeti szalagos geometria és shader, 14 számbeli vezérlő, háttérszín, képcsere, eltolással húzható képsor, időből számolt mozgás és beállításmentés. Saját Three.js vásznon működik, a főapphoz nem csatlakozik.

**Használat:** külön Layoutműhely; képsor csúsztatása és idő tekerése. A JSON a beállításokat menti, a saját képfájlokat még nem.

**Jobbá tétel:** a szétbomlást külön ráhúzható be-/kilépési effektként is kiemelni, hogy ne csak galériára legyen használható; saját szöveget/logót is fogadjon rendertextúrából. Eredeti minőségű vékony szalagok és kifakulás maradjon. Saját képek tartós mentése, közvetlen vászonfogantyúk és életciklus-kezelés kell.

### WIDE [P tanulmány / eredeti port hiányzik]

**Most:** öt saját képelrendezés, főcím/alcím/szöveg, margó, térköz, címméret, képcsere és időből számolt beúszás DOM/CSS alapon. **Nem az eredeti WIDE forrásból készült**, az eredeti letöltése elakadt. Az eredeti animáció és minőség egyezése nincs igazolva.

**Jobbá tétel:** eredeti export beszerzése után hű kompozíció és mozgás; cellánként fókuszpont, képkivágás, direkt osztóhúzás; külön szövegpozíció az öt kompozícióhoz; tördelés; Vel-rétegekre bontás és exportálható render. A tanulmány nem kész videóexportos layoutpreset.

## 8. A korábban kért 20 fejlesztési irány

Az előző beszélgetés összes ötlete itt követhető. Az alapkód megléte nem jelenti az egész működés megvalósítását. Mindegyiknek az eredeti vizuális karaktert megtartó, közvetlenül állítható változata a cél.

### Ö01. Organikus lebegés

**Mostani alap:** R: Lebegés már van; zajfüggvény P53.

**Tervezett működés:** Nyugodt, nem ismétlődően hintázó sodródás; X/Y kitérés, simaság, tempó, seed. A szöveg alaphelye mindig visszanyerhető.

**Minőségi / fejlesztési szempont:** A szabálytalan időmintát a jelenetidőből számoljuk; több elem fázisa lépcsőzhető.

**Miből lehet recept:** Ködben úszó bolygócím, lebegő kártyák, víz alatti medúza.

### Ö02. Útvonal követése

**Mostani alap:** R: felvett mozgáspálya és kulcsok vannak; P58 illesztő.

**Tervezett működés:** Kijelölt forma követi a rajzolt utat; sebességprofil, indulás, irány, fordulás az út tangensére.

**Minőségi / fejlesztési szempont:** Pálya szerkesztése és cseréje a réteg áthelyezése nélkül; nyílt/zárt út és varratmentes ismétlés.

**Miből lehet recept:** Űrhajó, térképes utazás, vonalon haladó felirat.

### Ö03. Görbére hajlás

**Mostani alap:** P05; beépített Gerincfelület csak másféle, saját felület.

**Tervezett működés:** Az objektum ténylegesen meghajlik a görbére; hajlítás erő és szakasz, csavarás.

**Minőségi / fejlesztési szempont:** Ne csak az egész réteg pozícióját változtassa; valódi geometria vagy célzott shader szükséges.

**Miből lehet recept:** Hullámzó betűszalag, hajló fémlemez, fonalszerű logó.

### Ö04. Leesés/pattanás/gurulás

**Mostani alap:** P24/P55; általános beépített fizika nincs.

**Tervezett működés:** Tömeg, gravitáció, súrlódás, rugalmasság, talaj; indítóimpulzus és kézi elengedés.

**Minőségi / fejlesztési szempont:** Egy motor, rögzített időlépés és seek-visszajátszás. A stilizált Bounce mozgás egyszerűbb külön változat lehet.

**Miből lehet recept:** Lehulló betűk, asztalra guruló golyók, konfetti.

### Ö05. Lánc/csáp követés

**Mostani alap:** P22.

**Tervezett működés:** Egy fogott végpont után hajló elemlánc; szegmensszám, merevség, nyúlás, késés.

**Minőségi / fejlesztési szempont:** Először animált IK, később fizikai kötél; a kettő eltérő vezérlés.

**Miből lehet recept:** Lufi kötéllel, medúzacsáp, mozgó fénykábel.

### Ö06. Kameramozgások

**Mostani alap:** R: 2,5D kamera és egyedi 3D rétegkamerák; P21.

**Tervezett működés:** Körbejárás, közelítés, átrepülés, tárgykövetés; cél, távolság, idő, karakter.

**Minőségi / fejlesztési szempont:** Közös 3D jelenet nélkül a külön rétegkamerák nem alkotnak automatikusan egységes térbeli kamerát.

**Miből lehet recept:** Termék-körbejárás, bolygófelfedés, tájrepülés.

### Ö07. Hangra pulzálás

**Mostani alap:** R: beat/kick jel és paraméterkötés létezik; P29 új jellemzők.

**Tervezett működés:** Választható frekvenciasáv, küszöb, erő, fel-/lecsengés; méret/szín/glow/motion cél.

**Minőségi / fejlesztési szempont:** Ne nevezzük teljesen új hangrendszernek; a meglévő jeleket tegyük könnyebben hozzárendelhetővé.

**Miből lehet recept:** Többhangszeres zenei világ; dob a magot, magas hang a csillámot mozgatja.

### Ö08. Szalagos szétbomlás

**Mostani alap:** P Unwoven galéria; általános effekt Ö.

**Tervezett működés:** Réteg képe vízszintes szálakra bomlik és összeáll; erő, szálvastagság, irány, sodródás, idő.

**Minőségi / fejlesztési szempont:** Bármely támogatott réteg renderképét fogadja, ne csak a galéria saját képeit.

**Miből lehet recept:** Képcsere, széteső magazincím, idővonalra húzható átmenet.

### Ö09. Lépcsőzetes érkezés

**Mostani alap:** R: mtext/Bento már lépcsőzik; általános több kijelölt rétegre Ö.

**Tervezett működés:** Sorrend, közös kezdés, egységenként késés, irány, középről/kívülről/rács szerint.

**Minőségi / fejlesztési szempont:** A kijelölt rétegek sorrendje látható legyen; egy mozdulattal nyújtható teljes időtartam.

**Miből lehet recept:** Koreografált címlap, naprendszer felépülése, termékkártyák.

### Ö10. Modellanimáció

**Mostani alap:** P61/P62.

**Tervezett működés:** Importált klip kiválasztás, kezdés, sebesség, irány és loop.

**Minőségi / fejlesztési szempont:** Klipkeverés és karakterre újracélzás későbbi, külön munka; projektben tartós GLB.

**Miből lehet recept:** Forgó gépalkatrész, animált figura, mozgó szerves modell.

### Ö11. Részecske Források

**Mostani alap:** R: képfelbontás van; P23/P49 emitterek.

**Tervezett működés:** Pontból, vonalból, formából és felületről kibocsátás; életkor, sebesség, méret/színgörbe.

**Minőségi / fejlesztési szempont:** Egységes emitter- és erőtérkezelés; szél és seed, minőségskála.

**Miből lehet recept:** Hó, eső, levél, füst, szikra, csillámpor, konfetti.

### Ö12. Élő térbeli tipográfia

**Mostani alap:** R: sík szöveg/mtext; P04/P09/P45.

**Tervezett működés:** Átírható betűk görbén, körön, hengeren és extrudálva; font, mélység, anyag.

**Minőségi / fejlesztési szempont:** Fontfüggőségek megőrzése, betűnkénti animáció, valódi éllekerekítés külön.

**Miből lehet recept:** Krómcím, forgó szöveggyűrű, üvegbetű, sziklafelirat.

### Ö13. Generatív formák

**Mostani alap:** R: több shaderes forma létezik; P06/P13/P46/P47.

**Tervezett működés:** Metagömb, Voronoi, útvonalas cső és vonal saját vezérlőkkel.

**Minőségi / fejlesztési szempont:** Minden darab külön szerkeszthető, seed és geometriai részletesség menthető legyen.

**Miből lehet recept:** Sejtvilág, korall, neoncső, folyékony embléma.

### Ö14. Új anyagok

**Mostani alap:** R: 12 shaderes 3D anyag; P14–17/P43/P48.

**Tervezett működés:** Üveg, króm, gyöngyház, bársony, kő és nedves felület; roughness, metalness, térképek.

**Minőségi / fejlesztési szempont:** Közös anyagválasztó kompatibilitási jelzéssel; shaderes és hálóalapú host elkülönítése.

**Miből lehet recept:** Termékstúdió, nedves város, vulkán és üvegkert.

### Ö15. Színvilágok

**Mostani alap:** R: paletták, grade és Look; P18–20.

**Tervezett működés:** Saját gradiensállomások, LUT, szerepalapú színek és több rétegre közös palettaváltás.

**Minőségi / fejlesztési szempont:** Vizuális előnézet, színzárolás és kontrasztvédelem, kézi felülírással.

**Miből lehet recept:** Teljes recept stíluscseréje a geometria újradobása nélkül.

### Ö16. Folyadék és víz

**Mostani alap:** R: shaderes márvány, 3D terep egyszerű vize; P50/P51.

**Tervezett működés:** Áramló festékforrás és külön tükröződő vízanyag; szél, sebesség és szín.

**Minőségi / fejlesztési szempont:** Nem ugyanaz a szimuláció: a festékmező és a térbeli víztükör külön komponens.

**Miből lehet recept:** Festékplakát, tengerszem, neon-esővíz, óceánbolygó.

### Ö17. Magazinlayout

**Mostani alap:** R: Bento/címlap már van; P WIDE-tanulmány.

**Tervezett működés:** Cserélhető képrács, erős főcím, cellák és képkivágások, összehangolt animáció.

**Minőségi / fejlesztési szempont:** Eredeti WIDE-forrás nélkül hű port nem igazolt; hosszú szöveg és több képarány támogatása szükséges.

**Miből lehet recept:** Divatcímlap, portfólió, zenei esemény poszter.

### Ö18. Végtelen képszalag

**Mostani alap:** P Unwoven.

**Tervezett működés:** Képsor sebességgel/iránnyal, szalagos széteséssel, saját képekkel.

**Minőségi / fejlesztési szempont:** Tartós média, ismétlés rendje, képarányok és Vel-réteges render/export.

**Miből lehet recept:** Fotókiállítás, kreditsor, váltakozó albumképek.

### Ö19. Formaépítő eszközök

**Mostani alap:** R: SDF szerkesztés; P01/P03/P04/P08/P11.

**Tervezett működés:** SVG-ből saját forma, kivágás/egyesítés, extrudálás, 3D matrica.

**Minőségi / fejlesztési szempont:** Előnézet minden művelet előtt, egyértelmű mesh/SDF határ és visszavonás.

**Miből lehet recept:** Logóból térbeli embléma, vágott fémlap, saját maszk.

### Ö20. Személyre szabható felület

**Mostani alap:** R: panelrendszer és színkezelők; P38/P39/P57/P63.

**Tervezett működés:** Saját eszközsorrend, mentett panelméret, kedvenc színek és munkatér.

**Minőségi / fejlesztési szempont:** Alaphelyzet visszaállítható legyen; ne legyen két eltérő színválasztó ugyanarra a feladatra.

**Miből lehet recept:** Tipográfia-, világépítő- és motion-munkatér.

## 9. Új, részletes recept- és világötletek

**Mind az alábbi új csomagok Ö állapotúak.** A „ma összeállítható” megjelölés azt jelenti, hogy a felsorolt elemekből kézzel szerkeszthető alap készíthető; nem azt, hogy az új néven már van ilyen csempe. A hiányzó részeket külön felsorolom. A láncokban a rétegrend alulról felfelé halad; az adott objektumhoz tartozó Megjelenéseket rajta kell alkalmazni.

### ÚR01. Randomizálható naprendszer [Ö]

**Összeállítás:** Űr → távoli Csillagköd → Nap/csillag → 3–8 Bolygó → holdak és gyűrűk → finom Glow → Grade.

**Mit állít a felhasználó?** Bolygószám, pályák kiterjedése, csillagszín, rendszerseed, mozgástempó.

**Hogyan működne?** Típusokból és méretekből hierarchiát épít, a főbolygó helyét és a kameraállást zárolni lehet. A pályafázisok különbözzenek.

**Mi van meg / mi hiányzik?** B: bolygók, Nap, űr és körmozgás. Ö: szülőhöz kötött holdpálya, közös világítás/takarás, rendszergenerátor.

**Mitől lesz jó minőségű?** Nap, bolygók és holdak külön elemek maradnak; a csillagkorona ne ugyanannyi fényt kapjon, mint a felszín.

### ÚR02. Űr-landscape család [Ö]

**Összeállítás:** Űr → háttérbolygó → távoli hold → 3D Terep → középtéri pára → előtérsziklák → cím → Grade.

**Mit állít a felhasználó?** Bolygóméret, horizont, köd, terepmag, idegenség, színcsalád.

**Hogyan működne?** A bolygó mögötti köd világosabb, az előtér sötétebb; a kamera lassan közelít, miközben eltérő a mélységi mozgás.

**Mi van meg / mi hiányzik?** B: űr, bolygó, terep, pára, szöveg. Ö/P: sziklák felületre szórása, közös mélység és köd.

**Mitől lesz jó minőségű?** A bolygó a horizontba simuljon, ne egy kivágott körként üljön a tájon.

### ÚR03. Holdbázis [Ö]

**Összeállítás:** Mély űr → nagy Földszerű Bolygó → kráteres 3D Terep → épületmodellek → lámpák → finom por → HUD.

**Mit állít a felhasználó?** Bázissűrűség, hideg/meleg fényarány, porkitérés, kameraközelség.

**Hogyan működne?** A terephez igazodó talpak, sötét ég és erős napfénykontraszt; lassú oldalirányú repülés.

**Mi van meg / mi hiányzik?** B: űr/bolygó/terep/blob. P: GLB, elosztás, részecske. Ö: talajillesztő és közös tér.

**Mitől lesz jó minőségű?** A légkör nélküli holdon a por külön művészi kapcsoló; ne kapjon automatikusan földi ködöt.

### ÚR04. Gázóriás a felhők fölött [Ö]

**Összeállítás:** Égszín → hatalmas gyűrűs Bolygó → távoli felhőréteg → közeli Felhők → Pára → Lencsefény.

**Mit állít a felhasználó?** Óriásméret, gyűrűdőlés, felhőmagasság, ellenfény, sodródás.

**Hogyan működne?** A felhők elfedik az óriás alsó részét, a gyűrű távolabbi és közelebbi fele külön rétegen van.

**Mi van meg / mi hiányzik?** B: a legtöbb elem. Ö: kapcsolt bolygóperem-illesztés és hiteles rétegtakarás.

**Mitől lesz jó minőségű?** Puha, alacsony kontrasztú távoli bolygó és élesebb közeli felhők.

### ÚR05. Aszteroidamező [Ö]

**Összeállítás:** Űr → köd → deformált sziklagömb-példányok → főaszteroida → por → ellenfény.

**Mit állít a felhasználó?** Darabszám, méretszórás, mezőmélység, forgás, főobjektum helye.

**Hogyan működne?** Lassú sodródás és átrepülő kamera; rögzített seed tartja a kompozíciót.

**Mi van meg / mi hiányzik?** B: háttér. P: instancing/GLB/zaj. Ö: közös 3D jelenet, kőzet-domborzat és elosztási szabály.

**Mitől lesz jó minőségű?** A távolabbi kövek kisebbek és kontrasztszegényebbek, nem azonos méretű konfetti.

### ÚR06. Fogyatkozás [Ö]

**Összeállítás:** Űr → Nap/korona → sötét Hold → finom Lencsefény → halvány csillagok → Grade.

**Mit állít a felhasználó?** Takarás mértéke, holdpálya, koronafény, átmenet ideje.

**Hogyan működne?** A hold lassan a korong elé kerül; teljes takaráskor felerősödik a korona és változik a háttér expozíciója.

**Mi van meg / mi hiányzik?** B: látványrétegek. Ö: kézzel vagy paraméterből szinkronizált takarás/expozíció recept.

**Mitől lesz jó minőségű?** A fényváltozás folyamatos legyen; a csillagok ne hirtelen kapcsoljanak be.

### ÚR07. Lávavilág [Ö]

**Összeállítás:** Űr vagy Égszín → vulkáni Terep → lávató → hamu/Füst → parázs → Glow → Grade.

**Mit állít a felhasználó?** Kéreg/láva arány, hő, füstmagasság, szél, láthatóság.

**Hogyan működne?** A repedések és tavak világítanak, a hamu ugyanabba az irányba sodródik.

**Mi van meg / mi hiányzik?** B: vulkáni terep, tűz, glow. P: emitter/füstatlasz/festékmező. Ö: terephez illeszkedő lávamaszk és emisszió.

**Mitől lesz jó minőségű?** Csak a forró részek ragyogjanak; a teljes kép általános elmosása rontaná a kőzetet.

### ÚR08. Jeges idegenvilág [Ö]

**Összeállítás:** Űr → Jégbolygó → havas/idegen 3D Terep → kék köd → jégkristályok → apró hó → hideg Grade.

**Mit állít a felhasználó?** Hóhatár, kék/rózsaszín színarány, kristálysűrűség, köd.

**Hogyan működne?** A csúcsok világosak, a hasadékok mélyebbek; ritka csillám és lassú szél.

**Mi van meg / mi hiányzik?** B: bolygó/terep/pára. P: felületszórás és emitter. Ö: magasság/lejtés alapú jéganyag.

**Mitől lesz jó minőségű?** Kevés szikrázó pont, finom csúcsfény; ne égjen ki minden fehér.

### ÚR09. Lebegő szigetek [Ö]

**Összeállítás:** Égszín → távoli Felhők → szigettömbök → növények → vízeséscsíkok → előtérköd → Nap.

**Mit állít a felhasználó?** Szigetszám, magasság, szórás, növényzet, szél, napirány.

**Hogyan működne?** Több külön sziget különböző mélységben, enyhe organikus lebegéssel.

**Mi van meg / mi hiányzik?** B: ég/felhők. P: szórás, zaj, modellek. Ö: alul is zárt szigetháló, vízesés és közös mélység. A mai sík terep nem kész lebegő szigettömb.

**Mitől lesz jó minőségű?** A szigetek alja kapjon formát és árnyékot, ne levágott sík legyen.

### ÚR10. Viharos tenger [Ö]

**Összeállítás:** Ég → viharfelhők → tükröződő Víz → eső → pára → villámfény → Grade.

**Mit állít a felhasználó?** Szél, hullám, esősűrűség, viharerő, villámgyakoriság.

**Hogyan működne?** A széllökés együtt mozgatja a hullámot, esőt és felhőt; a villám ideiglenesen a vizet is fényesíti.

**Mi van meg / mi hiányzik?** B: ég/felhő/pára. P: víz/emitter. Ö: villámforrás, hullámközeli tajték és közös fényreakció.

**Mitől lesz jó minőségű?** Az eső ne fedje el teljesen a horizontot; a villám ne csak fehér overlay legyen.

### ÚR11. Sivatagi dűnevándorlás [Ö]

**Összeállítás:** Égszín → Nap → dűnés 3D Terep → távoli hőremegés → szélhordta homok → finom Film.

**Mit állít a felhasználó?** Napszak, dűnemag, homoksűrűség, remegés, kamerasebesség.

**Hogyan működne?** Alacsony kamera halad a dűnegerincek mentén; homokcsíkok ugyanazzal a széllel.

**Mi van meg / mi hiányzik?** B: táj és torzítás. P: emitter. Ö: gerincmaszk és hozzá igazodó kibocsátás.

**Mitől lesz jó minőségű?** A hőremegés a horizontnál erősebb, az előtérben gyengébb.

### ÚR12. Hegyi tengerszem [Ö]

**Összeállítás:** Égszín → hegyes 3D Terep → tükröződő tó → völgyköd → növények → Nap/Lencsefény.

**Mit állít a felhasználó?** Tószint, partvonal, páraréteg, szél, napszak.

**Hogyan működne?** Felszínhez illeszkedő tó és visszafogott hullámok; lassú kamerakör.

**Mi van meg / mi hiányzik?** B: terep/ég. P: víz/növényszórás. Ö: közös víz- és tereptér, partmenti szín.

**Mitől lesz jó minőségű?** A tükröződés és a látható ég színe egyezzen; a tó ne tükrözzön másik világot.

### ÚR13. Felhőóceán [Ö]

**Összeállítás:** Égszín → távoli Felhőréteg → külön Felhő-tárgyak → ellenfény → Pára → lassú kamera.

**Mit állít a felhasználó?** Rétegszám, felhőalak, sűrűség, fényirány, átúszás.

**Hogyan működne?** Külön mélységi síkok és eltérő sodródás; fény a felhők felső peremén.

**Mi van meg / mi hiányzik?** B: felhők és ég. Ö: felhőmező-generátor és közös térbeli köd.

**Mitől lesz jó minőségű?** Vastag középrészek és vékony peremek, egységes fény felől.

### ÚR14. Neonváros esőben [Ö]

**Összeállítás:** Sötét ég → makettváros → emissziós táblák → nedves padló → eső → köd → Neon noir.

**Mit állít a felhasználó?** Várossűrűség, táblaszínek, eső, köd, kameramagasság.

**Hogyan működne?** Ritka erős fényfoltok és sötét tömegek; fények tükröződnek a padlón.

**Mi van meg / mi hiányzik?** P: város/GLB/víz vagy síktükör/emitter. B: szöveg/glow/grade. Ö: komplett közös jelenet és nedves anyag.

**Mitől lesz jó minőségű?** A neon ne legyen mindenhol egyformán világos; a főpont és felirat olvasható maradjon.

### ÚR15. Papírmakett-város [Ö]

**Összeállítás:** Pasztell háttér → egyszerű épülettömbök → papíranyag → kontaktárnyék → kézi jellegű kamera → címsor.

**Mit állít a felhasználó?** Városmag, blokkméret, papírszín, árnyékpuhaság, lépcsőzés.

**Hogyan működne?** Épületek egymás után emelkednek fel, egységes tompa anyaggal.

**Mi van meg / mi hiányzik?** P: város/instancing/kontaktárnyék. B: paletta/film/mtext. Ö: felépülési koreográfia és papíranyag a mesh-hoston.

**Mitől lesz jó minőségű?** Méretarányos szemcse, tiszta élek és puha talajárnyék.

### ÚR16. Üvegbetű-stúdió [Ö]

**Összeállítás:** Semleges gradient → extrudált cím → üveganyag → környezeti fény → finom padlótükör → kísérőszöveg.

**Mit állít a felhasználó?** Szöveg, mélység, fénytörés, fényirány, kamera.

**Hogyan működne?** A főcím valódi testként fordul; a kísérőszöveg sík marad.

**Mi van meg / mi hiányzik?** P: fontkontúr/extrudálás/üveg/tükör. B: szöveg/gradient. Ö: élő szöveg-mesh lánc és tartós font.

**Mitől lesz jó minőségű?** A vastag betűk belseje és pereme olvasható, nem egyszerű áttetsző sík.

### ÚR17. Lufibetűk [Ö]

**Összeállítás:** Egyszínű háttér → felfújt szövegtestek → lágy árnyék → imbolygás → kötél vagy konfetti.

**Mit állít a felhasználó?** Szöveg, felfújtság, gumifény, térköz, lebegési erő.

**Hogyan működne?** Betűnként finom késés és súlyérzet, opcionális fizikai összekoccanás.

**Mi van meg / mi hiányzik?** B: Lufi csak Felhőn. P: kontúr/mesh/fizika. Ö: tényleges szöveg-felfújás és kötél; most nincs kész lufiszöveg.

**Mitől lesz jó minőségű?** A belső betűlyukak és a szó olvashatósága megmaradjon.

### ÚR18. Krómembléma [Ö]

**Összeállítás:** Saját SVG → extrudálás → krómanyag → stúdiófény → kontaktárnyék → halk kamerakör → cím.

**Mit állít a felhasználó?** Embléma, vastagság, lekerekítés, fénycsík, háttér.

**Hogyan működne?** Lassú fénypásztázás hangsúlyozza a formát; a kamerakör nem torzítja olvashatatlanná.

**Mi van meg / mi hiányzik?** P: SVG/extrudálás/mesh-anyag/kamera. B: saját shaderes krómtest csak analógia. Ö: összekapcsolt SVG-termékpreset.

**Mitől lesz jó minőségű?** A kontúr és lyukak pontosak; a fémhez valódi környezeti kontraszt kell.

### ÚR19. Folyékony embléma [Ö]

**Összeállítás:** Logómaszk → áramló festék vagy márvány → peremfény → színváltás → rövid részecskés zárás.

**Mit állít a felhasználó?** Logó, viszkozitásjelleg, örvény, színpontok, zárás ideje.

**Hogyan működne?** A folyadék a logó belsejében mozog; később a határ is finoman változhat.

**Mi van meg / mi hiányzik?** B: kép/maszk/márvány/pdisp. P: festékmező. Ö: SVG-célalak és a teljes effektlánc.

**Mitől lesz jó minőségű?** A márkajel nyugalomban felismerhető; az örvény nem törli a kontúrt.

### ÚR20. Sziklából épülő cím [Ö]

**Összeállítás:** Betűmesh → domborzatos kőanyag → felszínről szálló por → oldalvilágítás → lassú feltárás.

**Mit állít a felhasználó?** Szöveg, erózió, sziklarészlet, por, fényirány.

**Hogyan működne?** A betűk morzsákból összeállnak, majd a por elül.

**Mi van meg / mi hiányzik?** P: font/extrudálás/zaj/szórás/emitter. Ö: általános domborzatkomponens és célalakra rendeződés.

**Mitől lesz jó minőségű?** A kőzet ne tüntesse el a keskeny betűszárakat; a por a felületből induljon.

### ÚR21. Víz alatti biolumineszcencia [Ö]

**Összeállítás:** Mélytenger gradient → finom mélységi köd → szerves formák → csápok → világító por → lassú kamera.

**Mit állít a felhasználó?** Mélység, szerves forma, csáphossz, fény, sodrás.

**Hogyan működne?** Lassú hullámzó mozgás és a környezettel egyező kékeszöld fény; apró ellenpontok.

**Mi van meg / mi hiányzik?** B: gradient/glow/formák. P: IK/metaball/emitter. Ö: tengeri alakpreset és közös sodrás.

**Mitől lesz jó minőségű?** Kevés, jól elhelyezett világító pont; a sötét tér maradjon jelen.

### ÚR22. Kristálykert [Ö]

**Összeállítás:** Terep/sík → felületre szórt kristályok → környezeti fény → köd → apró csillám → kamera.

**Mit állít a felhasználó?** Kristálysűrűség, méretszórás, színcsalád, fény, mag.

**Hogyan működne?** Magasság és lejtés alapján nőnek a kristályok; virágszerűen lépcsőzhető megjelenés.

**Mi van meg / mi hiányzik?** B: kristályjellegű shaderes test. P: mesh/instancing/szórás. Ö: közös kristálymező-generátor.

**Mitől lesz jó minőségű?** Ne metsszék kaotikusan egymást; néhány nagy fókuszkristály és sok kicsi.

### ÚR23. Őszi levélvilág [Ö]

**Összeállítás:** Égszín → puha táj → növények → hulló levelek → szélpára → meleg Grade.

**Mit állít a felhasználó?** Levélmennyiség, szélirány, széllökés, mélység, őszi színek.

**Hogyan működne?** A levél forog és sodródik, nem csak lefelé mozog; háttérben kisebb és puhább.

**Mi van meg / mi hiányzik?** P: növényatlasz/emitter/fizika. B: táj/grade. Ö: levélanyag és szélmező.

**Mitől lesz jó minőségű?** Alfa szélek tiszták, kevés ismétlődő sprite, helyes mélységi rend.

### ÚR24. Hógömb [Ö]

**Összeállítás:** Üveggömb → belső minitáj → ház/forma → hóemitter → talp → stúdióháttér.

**Mit állít a felhasználó?** Hómennyiség, rázás, lecsengés, gömbméret, belső táj.

**Hogyan működne?** Rázáskor felkavarodó hó, majd ülepedés; a belső jelenet a gömbön belül marad.

**Mi van meg / mi hiányzik?** P: üveg/GLB/fizika/emitter. B: formák/terep. Ö: gömbtérfogat, ütközés és közös render.

**Mitől lesz jó minőségű?** Az üveg a belső tartalmat is torzítsa, a hó ne fusson át a burkon.

### ÚR25. Zenei részecskeuniverzum [Ö]

**Összeállítás:** Űr → központi mag → orbitáló részecskék → csóvák → felirat → színkorrekció.

**Mit állít a felhasználó?** Hangbemenet, sávonkénti erő, csillagsűrűség, csóvahossz, seed.

**Hogyan működne?** Lábdob a mag méretét, pergő a szóródást, magas hang a csillámot vezérli.

**Mi van meg / mi hiányzik?** B: audiojelek/pdisp/particles/space. P: emitter és új hangelemzés. Ö: többjelű közös vezérlő és hordozható hang.

**Mitől lesz jó minőségű?** Átlagos hangerő mellett is legyen nyugodt állapot; ne minden jelre teljes robbanás.

### ÚR26. CRT adáscsomag [Ö]

**Összeállítás:** Kép/szöveg → rövid Glitch-esemény → CRT → halk Film → opcionális színes fénycsóva.

**Mit állít a felhasználó?** Jelhiba erő, foszfor, domborúság, adásidő, képszöveg.

**Hogyan működne?** Hibák ritka impulzusokból indulnak; alapállapotban olvasható kép.

**Mi van meg / mi hiányzik?** B: minden fő vizuális alap. Ö: közös eseményvezérlő és kurált preset.

**Mitől lesz jó minőségű?** A CRT és Film képsorai ne erősítsék egymást zavaró moarévá.

### ÚR27. Nyomdai plakát [Ö]

**Összeállítás:** Fotó/forma → halftone → 2–4 színes paletta → papír → szerkeszthető címsor → rövid rétegelt beúszás.

**Mit állít a felhasználó?** Fotó, színszám, raszter, papír, illesztési hiba.

**Hogyan működne?** A kép raszteres, a cím tiszta vagy szándékosan nyomdai; képarányváltásra új tördelés.

**Mi van meg / mi hiányzik?** B: halftone/texture/text/mtext. P: palettaskála. Ö: CMYK szerű szétválasztás és automatikus layout.

**Mitől lesz jó minőségű?** Éles tipográfia, skálafüggetlen papír és raszter; ne mosódjon össze kicsiben.

### ÚR28. Szalagokra bomló magazin [Ö]

**Összeállítás:** Szerkesztői layout → képenként Unwoven-szétbomlás → főcím → oldalváltó átmenet.

**Mit állít a felhasználó?** Kompozíció, képsor, szalagszám, sebesség, cím, ritmus.

**Hogyan működne?** A képek a széleken bomlanak, a szöveg külön koreográfiát kap; közép olvasható marad.

**Mi van meg / mi hiányzik?** P: Unwoven és WIDE-tanulmány. B: mtext/Bento. Ö: rendertextúrás host, tartós képek, Vel-réteges integráció.

**Mitől lesz jó minőségű?** Az eredeti vékony szalagkarakter megtartása; a WIDE eredeti forrásának hiányát nem rejti el a recept.

### ÚR29. Generatív sejtvilág [Ö]

**Összeállítás:** Sejtszövet → szerves metagömbök → sejthatárfény → por → blob-címkék.

**Mit állít a felhasználó?** Sejtméret, növekedés, mag, határfény, címkesűrűség.

**Hogyan működne?** A gócpontok lassan vándorolnak; új sejtekből kinövő formák; kapcsolt adatfeliratok.

**Mi van meg / mi hiányzik?** B: cells/blob/glow. P: Voronoi/metaball. Ö: közös gócpontállapot és morf.

**Mitől lesz jó minőségű?** A 2D háttér és a 3D gömbök ugyanazokat a pontokat kövessék, ne két véletlen világ legyen.

### ÚR30. Portál egy másik világba [Ö]

**Összeállítás:** Alapvilág → portálmaszk → belső második világ → perem/fény → átlépő kamera → teljes képes új világ.

**Mit állít a felhasználó?** Kapuméret, belső világ, energia, belépés ideje, kameraút.

**Hogyan működne?** Nyitás után a kamera átlép a kapun; az új világ fokozatosan tölti ki a képet.

**Mi van meg / mi hiányzik?** B: Portál recept és maszk. Ö: két világ explicit renderbemenete, közös kamera és átmeneti út.

**Mitől lesz jó minőségű?** A belső világ ne csak ugyanaz az alagút maradjon; kapjon ténylegesen külön szerkeszthető tartalmat.

### ÚR31. Termékvilág három anyaggal [Ö]

**Összeállítás:** Saját GLB/logo → három anyagváltozat → közös stúdió → anyagonként fénykör → név/adatok → átmenet.

**Mit állít a felhasználó?** Termék, üveg/fém/agyag, kamera, fénycsík, szín.

**Hogyan működne?** Ugyanaz a forma és mozgás marad, csak az anyag és a környezet változik kontrolláltan.

**Mi van meg / mi hiányzik?** P: import/PBR/kamera. B: szöveg és végső Look. Ö: változatkapcsoló és közös 3D host.

**Mitől lesz jó minőségű?** A forma ne cserélődjön anyagváltáskor, a felirat és kompozíció maradjon zárolt.

### ÚR32. Életfa fénycsövekből [Ö]

**Összeállítás:** Útvonalas törzs/ágak → vastagságprofil → fém/üveg/neon → levelek → szikrák → sötét háttér.

**Mit állít a felhasználó?** Ágmag, elágazás, vastagság, növekedés, fény és levelek.

**Hogyan működne?** Az ágak időben sorban nőnek, a fény a gyökértől fut végig.

**Mi van meg / mi hiányzik?** P: cső/vonal/atlasz/emitter. Ö: ággenerátor, növekedési vezérlés és közös útvonalak.

**Mitől lesz jó minőségű?** Az ágak elágazásainál ne legyen nyitott rés, a vastagság csökkenése legyen természetes.

## 10. Megjelenésláncok és közös vezérlők

### Új ráhúzható Megjelenésötletek kategóriánként [Ö]

Ezek külön effektként vagy kompatibilis anyagkomponensként jelennének meg. A 3D-s, mélység- és normálfüggő ötletekhez a hostnak ilyen adatot is kell adnia; a kész sík RGBA-kép mindenhez nem elég.

- **Részecske → Életkor szerinti szín és méret:** Születéskor kicsi/forró, középen nagyobb, végén áttetsző; közvetlenül rajzolható görbék. Emitter-életkor kell hozzá, a mai képpontos mezőnek nincs ilyen életciklusa.
- **Részecske → Csóva:** A gyors részecske mögött szalag vagy rövid fényfarok. Hossz sebességből, szélesség/finomság külön; rendes részecskeelőzmény vagy analitikus pálya kell.
- **Részecske → Alakba rendezés:** Pontok egy szöveg, kép vagy térbeli felszín célpontjaihoz térnek. Összeállási erő és szél külön; nem azonos a jelenlegi eredeti képpontba visszaállással.
- **Részecske → Közös szél és örvénytér:** Több kibocsátó ugyanazt a szélmezőt olvassa; magasság, lökés és turbulencia. Ez viselkedés/erőtér, nem kizárólag színező Megjelenés.
- **Részecske → Mélységben lágy perem:** Füst vagy köd ne metsszen keményen a talajba; mélységhez közeli alfa-halványítás, csak mélységbemenettel.
- **Részecske → Anyagpreset:** Por, szikra, hó, papír, levél, parázs; mind eltérő sprite, keverés, forgás, méret és színprofil. A név mögött tényleges eltérő viselkedés legyen.
- **Világ → Környezeti beolvasztás:** Háttérszínből vett finom peremfény, köd, kontrasztcsökkentés. Bolygón, sziklán és felhőn közös, helyi erővel; nem általános Gaussian blur.
- **Világ → Magassági köd:** Völgyben vagy víz fölött sűrűbb pára, felfelé ritkul; világkoordináta/mélység szükséges a tényleges térbeli változathoz.
- **Világ → Távolsági légi perspektíva:** Távolabb halványabb és a köd színéhez közelebb kerülő tárgyak; mélységküszöb, görbe és szín. 2,5D-nél művészi réteg-Z alapú közelítés is lehet.
- **Világ → Felhőárnyék:** A felhők mintája végigvonul a terepen; közös felhőpozíció, szél és Nap irány. Árnyék nem festett, statikus folt.
- **Világ → Nedvesedés:** Talaj és tárgy sötétebb, simább, fényesebb; pocsolyamaszk, vízszint és eső együtt. Anyag- és tükröződési adat kell.
- **Világ → Por/hó felhalmozódás:** Felfelé néző felületeken több anyag, meredek részen kevesebb; szélirány és felszínnormál alapján. Először művészi statikus mód.
- **Forma / 3D → Ráhúzható domborzat:** Közös zaj-/magasságkomponens; hegyes gömb, csipkézett kő, erodált betű. Külön tesszellációs/minőségi határ és normálfrissítés.
- **Forma / 3D → Lekerekítés / puha él:** Anyagtól független geometriai él; sugár fogantyúval, apró részek összeomlásának jelzése. Nem egyszerű képelmosás.
- **Forma / 3D → Kontúr menti növekedés:** Cső, spirál, növény és logó fokozatos felrajzolása; útvonalhossz alapú állapot, szép végzárás.
- **Forma / 3D → Rétegelt anyag:** Alapanyag + lakk + por vagy fém + kopás. Lejtés/perem/maszk vezérelheti; a rétegrend közvetlenül látható.
- **Forma / 3D → Összenyomás és nyúlás:** Állítható squash/stretch a térfogat érzetének megőrzésével; mozgásirányra és gyorsulásra kapcsolható. Merev fémnél alapból kikapcsolt.
- **Forma / 3D → Szellemkép / mozgásnyom:** Korábbi időpontokból mintázott másolatok, halványuló sorban; ne függjön az előnézet lejátszási történetétől.
- **Szöveg / kép → Kontúr követő fény:** A betűn vagy logón végigfutó fény, sebesség/fej/csóva külön; útvonal- vagy távolságmező kell a szép követéshez.
- **Szöveg / kép → Szalagos felbontás:** Unwoven-karakterű szétesés bármely réteg renderképén; szalagok, szél, összeállás, kifakulás. A főcím tartalma közben szerkeszthető marad.
- **Szöveg / kép → Nyomdai rétegcsúszás:** Külön színlemezek enyhe eltolása, nyomáserő és papírtextúra; finom álló és eseményvezérelt hibák.
- **Szöveg / kép → Papírkivágás és rétegárnyék:** Vastag papírperem, egymás mögötti árnyékok és kis kiemelkedés. A sima Drop shadow helyett több réteg külön távolsággal.
- **Minden kompatibilis host → Fókuszvédő maszk:** A főcím vagy főtárgy területén kevesebb háttérrészlet, glow és részecske; látható, kézzel felülírható fókuszterület.
- **Minden kompatibilis host → Stíluscsere szerkezetzárral:** Paletta, anyag és fény cserélhető úgy, hogy a kamera, objektumszám és kompozíció megmarad. Nem véletlenszerű teljes jelenetcsere.

### Konkrét effektláncok [Ö új menthető csomag]

A sorrend szándékos. Az objektumra húzott lánc külön kezelhető a teljes jelenet utolsó Lookjától. **B-lánc:** a vizuális alapok beépítettek, de a megnevezett csomag még nincs elmentve. **Vegyes:** prototípus vagy új adatút is kell.

| Menthető lánc | Javasolt sorrend | Állítható közös vezérlők | Alap és hiány |
|---|---|---|---|
| Bolygó a háttérbe simulva | Bolygó → légköri perem → háttérszín-illesztés → elülső ködfátyol → közös Grade | Távolság, peremfény, köd, napszín | Vegyes: bolygó/pára B; háttérmintás perem és mélységadat Ö. |
| Kőzetes bolygó | Gömbfelszín → domborzat → biomgradiens → napfény → felhőhéj → légkör | Hegymagasság, óceánszint, részlet, biom, seed | Vegyes: T2 és közös felszínkomponens hiányzik. |
| Felhőből lufi | Felhő → Lufi → közös Jelenetfény → enyhe Lebegés → árnyék | Felfújás, szín, csillanás, lebegés | B alap: Lufi csak Felhőn; univerzális talajárnyék és kötél külön. |
| Szélben élő láng | Láng → helyi hőremegés → parázs/füst → Glow → Grade | Szél, hő, füst, szikra, fény | Vegyes: shaderláng B, emitter P, közös mező Ö; csíkhiba nyitott. |
| Neonfelirat | Szöveg → Neon körvonal → Glow → Castlight → finom Film | Csőfény, sugár, csóvahossz, színpár | B-lánc; valódi üveg-neoncső geometria új. |
| Részecskés felirat | Szöveg → pdisp → szórási szél → Glow → tiszta visszaállás | Szétesés, szórás, nyugalmi idő, visszatérés | Vegyes: pdisp B, közös szélmező és célalak-bővítés Ö. |
| Füstös alak | Forma-/felületemitter → füstatlasz → kor szerinti méret/szín → puha mélységi perem | Kibocsátás, gomolygás, életidő, szél | P emitter és atlasz; soft-particle mélységút Ö. |
| Havazás | Térfogatemitter → hósprite → sodrás/forgás → távolsági halványítás | Sűrűség, szél, pelyhméret, fókusz | Vegyes P/Ö; a mai képből részecske önmagában nem hóemitter. |
| Folyékony króm | Mesh/metagömb → zajdeformáció → krómanyag → környezeti fény → csekély Glow | Folyás, merevség, roughness, környezet | Vegyes P; SDF-fémtest B változata egyszerűbb kiindulás. |
| Üvegplakát | Kép → Liquid Glass → cím külön rétegen → visszafogott Grade | Lencsehely, méret, háttér, szín | B-lánc; szabad lencseforma és több lencse Ö. |
| Analóg videóérzet | Tartalom → ritka Glitch → CRT → finom Film | Jelhiba, sorok, üveg, szemcse | B-lánc; gondosan csökkentett duplázott sor-/zajhatás. |
| Papírszínház | Kivágott formák → papírtextúra → mélységi rétegárnyék → darabos mozgás | Papír, rétegtávolság, árnyék, fps | Textúra/forma B; térbeli rétegárnyék és automatikus csomag Ö. |
| Nyomdai pop | Fotó → Halftone → palettakorlát → papír → tiszta cím | Raszter, színek, nyomási hiba | Halftone/textúra B; valódi színlemezek és palettakorlát bővítés. |
| Színes árnyékos tipográfia | Szöveg → Castlight → finom Glow → Grain | Árnyékirány, hossz, két szín, puhaság | B-lánc; új többállomásos spektrum és fogantyú Ö. |
| Organikus maszk | Alakzat → Warp → enyhe Blur → ráklippelt Kép | Légzés, perem, lágyság, idő | B-lánc; ugyanazzal a maszkseed-del több réteg kapcsolható Ö. |
| Fraktálkelme | Kali/Julia → Kaleido → finom Texture → Grade | Szimmetria, szövetsűrűség, színek | B-lánc; fizikai textilredőzés nem része. |
| Világító sejt | Cells → Edge vagy saját határfény → Glow → finom zaj | Sejtméret, határfény, telítettség | B-lánc; valódi sejtosztódás Ö. |
| Élő hologram | Tárgy/szöveg → soros mintázat → Chroma → jelzésre Glitch → Glow | Sorok, jelstabilitás, szín, világosság | B alapokból művészi közelítés; normál-/mélységfüggő hologram P/Ö. |
| Képből csillagmező | Kép → Particles → mélység fényességből → sodródás → Glow | Pontméret, küszöb, mélység, erő | B-lánc; a pontok még a kép mintái, nem külön életciklusos csillagok. |
| Fénycsöves út | Útvonal → cső/vonal → emisszió → Glow → mentett növekedési mozgás | Vastagság, szín, felrajzolás, csóva | P46/P47; felrajzolás és Vel-útvonaladapter Ö. |

### Minden új elemhez közös kontrollszabályok [Ö követelmény]

1. **Erő és idő külön:** az effekt erőssége ne módosítsa váratlanul a tempót; a sebesség ne változtassa meg a seedelt kompozíciót.
2. **Közvetlen gesztus:** fényirány nyíllal, ködzóna fogantyúval, pálya pontokkal, lencse a vásznon. Pontos számmező maradjon.
3. **Közös alap + helyi eltérés:** több bolygó vagy részecskerendszer olvashat közös szelet/fényt/palettát, de a helyi különbség látható és visszaállítható.
4. **Stílus és szerkezet zárolása:** felület, fény és paletta külön újradobható; a kamera, objektumhely és címszöveg megtartható.
5. **Előnézet = tekerés = export:** a seed és a jelenetidő adja az állapotot. Fizikánál rögzített időlépés/replay, feedbacknél előmelegítés vagy állapotmentés kell.
6. **Újranyitható média:** kép, font, modell, hang és sprite függősége ne ideiglenes objektum-URL legyen a projektben. A részleges mentést a felület jelezze.
7. **Egységes renderadat:** a mélységre/normálra építő anyag csak akkor ajánlható, ha a host ténylegesen ad ilyen bemenetet; különben egyszerűbb 2D változatot kínáljon.
8. **Minőség védelme:** finom szálak, csillagok, papírszemcse és glowsugár maradjon méretarányos 1080p és 4K között; a csúcsfény ne égesse ki a részleteket.
9. **Kompozíciós védelem:** a főtárgyat és főcímet kerülő részecske-/háttérmaszk, kijelölt fókuszterület. Kikapcsolható, nem rejtett automatikus beavatkozás.
10. **Átlátható csomag:** recept kibontva értelmesen elnevezett rétegekből álljon; 3–6 közös vezérlő, a részletes elemek tovább szerkeszthetők.

### Recept-randomizálás, amely megtartja a minőséget [Ö]

- Előbb a **szerepeket** válassza: háttér, fókusztárgy, középtér, előtér, fény, cím; utána ezekhez kompatibilis elemeket. Ne véletlen shaderhalmozás legyen.
- Egy közös seedből származzanak külön részseedek a terephez, bolygókhoz, ködhöz és részecskékhez. Egy rész újradobása ne írja át a többieket.
- **Megtartás kapcsolók:** kamera, elrendezés, szöveg, színcsalád, napszak, bolygótípus. Külön „csak anyag”, „csak világítás”, „csak felszín”, „teljes változat”.
- Az összeillő értékeket közös vezérlő adja: napirány → bolygó/táj/felhő; szél → felhő/levél/füst; vízszint → part/szín/növényhatár.
- A már beépített Q1 minőségszűrő és Ronda/Tetszik jelzés lehet alap, de a szerepalapú receptgenerálás és az ízlésből tanult küszöbök még új fejlesztések.
- A képi mérés mellett szerkezeti ellenőrzés is kell: megfelelő rétegsorrend, hiányzó média nélkül, erőforráskerettel; ne egymást elfedő maszkokból álljon a recept.
- A felhasználó kapjon 4–6 **rögzített előnézetet**, és a kiválasztott változatot fogadja el. A „Hatos rács” jelenleg ötlet, nem kész funkció.

## 11. Ajánlott építési sorrend és lefedettség

Ez sorrendi javaslat, nem időbecslés. Az ötletek jóváhagyása dokumentálásra nem jelenti minden termékfejlesztési szelet automatikus elindítását.

1. **Közös komponensek:** seed, paletta/gradiens, napirány, szél, légköri beolvasztás; legyen egyértelmű, melyik réteg mit követ. Ez a legtöbb új receptet javítja.
2. **Bolygó + domborzat:** a T2 út prototípusa, meglévő felhő/légkör/gyűrű megtartásával; utána hold-komponens és közös csillagfény.
3. **Ráhúzható motion-csomag:** organikus lebegés, útvonal, lépcsőzés, egyszerű gravitációs karakter és könnyebben kapcsolható hangpulzus. Ne duplázzuk a már meglévő hat mozgást.
4. **Egy egységes részecskeemitter:** szikra/füst/hó/levél ugyanazon életkor-, szél- és sprite-rendszeren; a képből felbontás maradjon külön használat.
5. **Anyag és saját forma:** SVG/élő betű → mesh → anyag → fény; tartós modellek, fontok és képek.
6. **Összetett receptek:** először a már létező darabokból CRT-adás, nyomdai plakát, egyszerű űr-landscape és felhővilág; utána a több új adaptert igénylő naprendszer, neonváros és üvegbetű.
7. **Layout és szalagos effekt:** Unwoven általános rétegbemenettel; WIDE eredeti forrásának pótlása, direkt layoutkontroll és exportálhatóság.
8. **Kurált randomcsaládok:** a szerkezeteket már stabil, ellenőrzött alapokra generáljuk; a véletlen ne legyen az alapfunkciók pótléka.

### Ismert korlátok, amelyek több ötletet érintenek

- A `BUGS.md` szerint a jelenet- és közösalap-média mentési lefedettsége, a hang hordozhatósága, valamint az export megszakítása további ellenőrzést/javítást igényel. Ez érinti a komplex receptcsomagok megbízható újranyitását.
- A kapcsolatok forrásparaméterének kiválasztása és az árva kapcsolatok kezelése nyitott; a jelenetsorban a Kapcsolatok hatása korlátozott. Erre nem szabad ellenőrzés nélkül naprendszer-/szélrendszert építeni.
- A külön Three.js prototípusok textúrája, anyaga és geometriája nem használható közvetlenül a saját WebGL2-kompozitorban. Célzott port vagy explicit köztes renderbemenet kell.
- Az eredeti shaderes bolygó, SDF-test és a valódi terepháló nem ugyanaz a geometriai rendszer. A közös domborzatanyag irány, nem már kész kompatibilitás.
- A szélben lobogó láng műterméke és a random bolygós jelenet jelzett sötét sávja nyitott hibák. Ezek külön javítási tételek, nem újabb látványréteggel elfedendők.
- A külső képek/fontok/modellek származása, licence és tartós csomagolása elemenként ellenőrzendő; az Unwoven mintaképek külön jogtisztázása vagy cseréje is szerepel a labor átadójában.
- Az ötletekre nincs új 4K- vagy valódi GPU-mérés. Ebben a munkában nincs élő alkalmazásteszt és nincs főalkalmazás-módosítás.

### Lefedettségi ellenőrzés

| Leltárrész | Lefedett mennyiség | Ellenőrzés alapja |
|---|---:|---|
| Regisztrált elemtípus | 72 | EFFECTS kulcsok |
| Beépített recept | 54 | RECIPES nevek |
| Könyvtári bejegyzés | 259 | LIB polcok, fejlécsorok nélkül |
| Ráhúzható mozgás | 6 | MO regiszter |
| Paletta | 18 | PALS |
| Végső Look | 6 | LOOKS |
| Külön bővítmény | 63 | extension-lab manifest |
| Külön layout | 2 | Unwoven adapter + WIDE-tanulmány |
| Korábban felsorolt fejlesztési irány | 20 | Az előző válasz mind a 20 ötlete |
| Új részletes recept/világ | 32 | ÚR01–ÚR32 |
| Új Megjelenés-/viselkedésötlet | 24 | Kategóriánként felsorolva |
| Konkrét effektlánc | 20 | Meglévő és prototípus-alapok jelölve |

**Fenntartás:** új beépítés után az érintett sor „Most” része és a B/P/Ö állapot változzon, ne csak új ötlet kerüljön a fájl végére. A böngészős saját könyvtár exportját külön név-/ID-alapú kiegészítéssel lehet összevezetni; ismeretlen tartalmát nem találgatjuk.


**Dokumentumellenőrzés:** az elemtípusok és receptek nevei, a 259 polcsor, a hat mozgás, a 63 prototípus, a 20 korábbi irány és a 32 új recept száma a forráslistákkal összevetve egyezik. Ez lefedettségi és szerkezeti ellenőrzés; új működési tesztet nem futtattunk.

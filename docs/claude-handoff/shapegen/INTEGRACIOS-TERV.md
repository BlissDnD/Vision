# ShapeGen integráció a Velbe

## 1. Scope és prioritás

A felhasználó kérése a FORM beépítésének **terve**, minden jelenlegi funkció megtartásával, a Vel meglévő megoldásainak használatával. A FORM dokumentumban felsorolt további fejlesztési javaslatok nem válnak automatikusan vállalt új termékfunkcióvá. A most hozzáadott nyolc UX-pont viszont a kért integráció része.

Első az átjárhatóság és az alkotói élmény. Utána a teljes generátormélység és eszközkör. A szeletelés sorrend, nem engedély a maradék funkciók elhagyására. A teljes integrációt csak minden releváns funkciómátrix-sor teljesülésekor lehet késznek nevezni.

## 2. Fül és munkatér – egy Vel, két alkotási helyzet

A ShapeGen alkalmazáson belüli fülként nyílik, a Vel-jelenet mellett. Nem új böngészőablak és nem távoli weboldal beágyazása. Alapból egy újrahasznált ShapeGen-munkatér van, nem minden gombnyomásra új fül. Összetettebb többdraftos tabsor csak későbbi, igazolt igényre.

A fő fülek munkateret jelölnek, a könyvtár négy szerepe ettől független marad. A Shapegenen belül csak a kért négy mód állandó: **Blob, Pattern, BG, Gradient**. Rajzolás, Ismétlés/Geometria és Assetválasztás célzott alszerkesztő vagy eszköznézet, visszaúttal; nem tűnnek el, és nem zsúfolnak további állandó főfüleket a felületre.

### Önálló alkotás

ShapeGen megnyitása → módválasztás → alkotás → **Mentés a Libraryba** vagy **Export a gépre**. A Vel-jelenet változatlan. A **Jelenethez adás** külön művelet, ha a felhasználó ezt kéri. Nincs minden Library-mentés után kéretlen új réteg.

A módok saját állapota megmarad. Blobról Patternre váltás nem dobja el az előző blobot. A fül elhagyása sem tekintendő implicit alkalmazásnak; a draft helyreállítható marad. A bezáráskor nem mentett változásra csak indokolt, rövid Mentés / Megtartás piszkozatként / Elvetés választás jelenjen meg.

### Konkrét elemhez alkotás

Recept vagy elem támogatott SVG/shape/pattern/háttér/textúra mezője mellett: **Add from Gen** és **From Library**. Nem kerül minden rétegsorba mindkét gomb: az adott beviteli helyhez tartoznak, ikon+érthető névvel vagy összevont „Hozzáadás” választóból.

A célhoz kötött fül teteje például:

> **ShapeGen → Orbit recept / Shape**
> A változtatásokat élőben látod a jelenetben.
> **Alkalmazás** · Mégse
> ☐ Mentés a Libraryba is

Az „Orbit” itt a felhasználó példája, nem igazolt mai Vel-recept vagy automatikusan létező általános SVG-slot. Az ilyen célmezőket explicit bemeneti adapter regisztrálja; először egy valós támogatott helyen bizonyítsuk.

A cél a nyitáskori projekt/jelenet/receptpéldány/elem/mező. A másik elem kijelölése nem irányítja át csendben a mentést. Ha már szerkesztett önálló draft van nyitva, a célkérés előtt meg kell őrizni: „Ezt használom” / „Új ehhez”. A fül bezárása vagy Mégse csak a célhoz tartozó ideiglenes próbát törli, nem a korábban mentett Library-elemet.

### Edit in ShapeGen

Library-elem vagy jelenetpéldány → **Edit in ShapeGen** → forrásdokumentum megnyílik ugyanazokkal a paraméterekkel és függőségekkel. Jelenetből indítva alapból **Csak ezt a felhasználást** módosítja. Libraryból indítva a **Mentés újként** gyors és biztonságos alap; a **Könyvtári eredeti frissítése** külön művelet, más felhasználásokat nem módosít észrevétlenül.

## 3. Solo / Scene / Split

Mindhárom ugyanazt a draftot, időt és seedet mutatja. Nézetváltás nem módosít alkotást és nem undo-lépés.

| Nézet | Működés |
|---|---|
| Solo | Csak az aktuális kimenet; vector/shape esetén átlátszó háttér jelzése, pontos kontúr és közvetlen fogantyúk. A szerkesztő zoomja nem a tárgy mérete. |
| Scene | Az ideiglenesen behelyettesített cél a tényleges Vel-renderben: kamera, maszk/vágás, anyag/effektlánc, csoport és időzítés megmarad. |
| Split | Solo és ugyanaz a Scene egymás mellett, húzható elválasztóval. Egy draft, közös idő; nincs két eltérő generátorállapot. |

Önálló alkotásnál, ahol nincs cél, Scene/Split előtt választás kell: **Új rétegként próba** vagy konkrét bemeneti hely. A rendszer nem találgat, melyik formát kell lecserélni. A próbaréteg csak ideiglenes; nem mentődik el Alkalmazás nélkül.

Keskeny felületen a Split kapcsolható marad, de ne préseljen két használhatatlan kis vásznat egymás mellé: lehet egymás alatti panelezés vagy fókuszálható két nézet, ugyanazzal a drafttal. A külön nagyítás, teljesképernyő és elválasztóméret munkatérpreferencia.

**Nem elfogadható Scene-helyettesítő:** külön FORM-vászon a screenshotra rárajzolva; fix jelenetkép frissülő generátorral; exportált PNG-re váltás, ha a végleges elem élő; más kamera/effektek nélkül megmutatott külön demó.

A preview nem ír `st`, undo-, autosave-, Library- vagy közösalap-eltérést. A renderút a draftot ideiglenes bemenetként oldja fel. Állapotos effekt/szimuláció cache-e külön preview-kontextus vagy snapshot/replay révén elkülönül; nézetváltás nem futhatja előre a végleges jelenetet. Alkalmazás egy jelenettranzakció; Mégse eredeti cél, kijelölés és playhead visszaállítása.

## 4. A célmező vezérelje a generátort

| Kiindulás | Induló beállítás és kínálat | Kötelező határ |
|---|---|---|
| Valódi SVG/shape | Kontúr/kitöltés, átlátszóság; meglévő rajz vagy alak szerkesztése; csak előállítható vektoros kimenetek | Shaderes BG nem kerülhet SVG-ként ide. A Blob SVG-kimenete csak forrásból bizonyított kontúrképzéssel engedélyezhető. |
| Pattern | Aktív Pattern mód, a hely motívum-/csempeigényének megfelelő méret és ismétlés; illeszkedésvizsgáló nézet | A mező által elvárt seamless feltétel látható; tetszőleges mozgó pattern nem lesz automatikusan hézagmentes. |
| Háttér | Jelenet képaránya és teljes képfelület; meglévő színvilág javaslatként, BG/Gradient előtérben | Jelenetméret nem írja felül a többi mód önálló dokumentumméretét. Kép és élő procedurális forrás eltérő kimenet. |
| Animált textúra | Jelenetóra, célhossz/loop, fázis; procedurális animáció vagy kiválasztott Lottie-frame/klip szerint | Képkocka, animált Lottie és generált textúra külön típus; periodicitást ellenőrizni kell. |

A kompatibilitás a műveleti adapter feladata. A választó már a kimenettípusnál jelezze a korlátot, ne csak Alkalmazás után legyen hiba. Megjeleníthető explicit alternatíva: „Képként használom” – csak ha a cél támogatja és a felhasználó kéri. Nincs rejtett vektorizálás vagy raszteresítés.

## 5. A vásznon alakítasz, a panelen pontosítasz

- **Blob:** kontúr fogása/nyújtása, irány és feszesség közvetlen állítása; a fogantyú csak a támogatott eredeti kontúrparaméterre vagy szerkeszthető deformációra hasson. Az eredeti harmonikus karakter és közelítő területnormalizálás maradjon.
- **Pattern:** köz/távolság, irány, középpont és a hullámmező középpontja húzható. Szabályos rács és mezőtorzítás külön érték; a nagyítás ne változtassa meg a dokumentum ismétlési méretét.
- **BG:** mezőközéppont, áramlásirány, frekvencia/ritmus; a Signal study vonalrendszerét nem két elcsúsztatott háttérrel helyettesítjük.
- **Gradient:** a karakter által ténylegesen értelmezett szín-/mezőpontok helye, terjedés és keveredés. A hét eredeti karakter nem redukálható egyetlen általános kétpontos színátmenetre. Ha a shader új paraméterezést igényel, kísérlettel és referenciával vezessük be.

Pontos értékmező, reset és billentyűzetes alternatíva van; a módosítóbillentyű gyorsítás, nem kizárólagos kezelési út. Egyszerre csak a releváns kijelölt eszköz fogantyúja látszik. A Vel P2/G1/kamera-gesztusai és a ShapeGen-lokális vászoneszközök fókusz alapján különülnek el.

A meglévő Vel panelstruktúra és színvezérlő használható Forma / Mozgás / Szín célokra. Nincs kétszer megjelenített általános opacity, transport, palettaválasztó vagy minden módhoz új panelrendszer. A FORM sötét/világos témaképessége a Vel témájába illeszkedik; szerkesztőtéma nem írja át az alkotás színeit.

## 6. Library és gépi mentés

**Gyors Library-mentés:** egy kattintás, automatikus név + bélyegkép + paraméteres forrás + függőségek. Név/címke utólag szerkeszthető egy rövid értesítésből. A mentés nem nyit minden alkalommal kötelező nagy modált.

A Library-elem tartalma: generator kind/verzió, minden támogatott paraméter, seed, paletta, animáció, méret/viewBox, importált shape/texture/Lottie és módosításai, forrás-/licencmetaadat, auto preview. A thumbnail pótolható cache; nem maga az alkotás. A rajz és a régi geometrialabor saját dokumentuma is hordozható függőség, nem elvesző külön localStorage.

**Célhoz kötve:** Alkalmazás az elsődleges, „Mentés a Libraryba is” opció. A jelenet-undo csak a jelenetpéldány cseréjét vonja vissza; a közben külön, sikeresen elmentett könyvtári elem nem tűnik el váratlanul. Az összetett művelet részleges tárolási/célkonfliktusos eredményét pontosan jelezni kell – lásd a szerződésdokumentumot.

**Gépre:** szerkeszthető ShapeGen dokumentum/függőségcsomag; PNG; valódi vektoreredménynél SVG; PNG-képsor ZIP a FORM korlátainak megtartásával vagy dokumentált, mért új kerettel. Importált Lottie szerkesztett JSON export és könyvtárbackup megmarad. A Vel MP4-exportja a jelenetben is használható a natívra portolt elemekkel, de ez nem a FORM saját, már létező videóexportja.

## 7. Idő, pointerreakció, random és változatok

Minden generált elem a Vel jelenetidejéből értékelődik; a munkatér szerkesztőtransportja ennek kontrollja, nem szabadon futó második animációs motor. Solo időleképezése és a cél scene-lokális ideje explicit; Scene/Split ugyanazt a megadott időt használja.

Közös mozgásvezérlők: **karakter, intenzitás, ciklushossz, ritmus, fázis**; módonként a valódi v8 képletre fordítva. Folyamatos, lágy gyorsulás, lépés/kitartás, kettős impulzus és radiális fáziskésés mind megmarad. A meglévő LP1 periódusigazítás jó alap, de állapotos pointerrugóhoz önmagában nem elég.

Pointerreakció: a FORM szerint átmeneti rugóállapot, exportkor fagyasztva. Ezt meg kell őrizni érthető módon; a frozen állapot is menthető. Ugyanazon `t` mellett eltérő pointerelőzmény nem nevezhető determinisztikusnak. Pontos újrarenderhez rögzített reakcióállapot vagy determinisztikus replay szükséges; teljes új egérperformansz-felvevő külön, nem állítólagos v8 funkció.

**Randomize all:** az aktív generátormód teljes támogatott kreatív paraméterterét és palettáját változtatja, egy undo-val. A dokumentumméret/cél/nézet nem randomizálódik; nem az összes mód állapota változik. A v8 saját Pattern-motívum cseréjének viselkedése átvehető, de a UI mondja ki az érintett kört; az eredeti importált asset nem törlődik. Nem szabad „teljes randomnak” nevezni egy csak pár csúszkát változtató újrafestést.

**Variations:** az aktuális állapot hat közeli rokona; egy Eltérés mértéke vezérlő. A cél kimenettípusa és a kompozíció fő szerkezete marad; a motívum vagy színek zárolhatók, de ez a Variations választása, nem a Randomize all csendes gyengítése. A hat preview stabil seed-snapshot, választás után egy undo; nem hat állandó, teljes felbontású renderer.

**Explore 6** eredeti működését a forrásból tisztázni kell: ha hat független random találat, ezt az Új irányok nézet őrizze meg; a közeli Variations ettől külön képesség. Egy kis hatos választó két egyértelmű karakterrel, nem két külön állandó rács.

Előző/következő eredmény a generálási előzményben; nem lép a scene-undo helyére. A függő importot használó régi eredmények is visszanyithatók, hivatkozásuk nem szabadulhat fel a preview-cache törlésekor.

## 8. Újrahasználat a mai Velben

| Rendszer | Mai alap | Teendő / határ |
|---|---|---|
| Render | WebGL2, EFFECTS, rétegkompozitor, preview/export utak | A FORM generátorképleteit célzott natív portként beilleszteni; nem új Three-motor és nem iframe-export. Alpha/színtér/koordináták egyeztetése. |
| Útvonal | P2 `paths.ts`, `pathdraw.ts`, `pathedit.ts`; Catmull–Rom pontmodell | FORM Bézier, sarok és lyukas többkontúr nem azonos. Közös bővítés vagy veszteséget nem okozó adapter; ne lapítsuk visszafordíthatatlanul a rajzot P2-pontokra. |
| Mozgás | `motion.ts`, LP1, XF1, KO1, közös óra, `sim.ts` | Generátor belső mezőmozgása és külső rétegmozgás külön; eredeti FORM Orbit/Pulse/Bloom nem pusztán névegyezés miatt helyettesíthető. |
| Library | `ULIB`, `ulibPut`, `saveAsPreset`, `syncLib` | Egy tároló és saját csempeút; paraméteres forrásadat kiegészítés. `syncLib` ma csak preset/shader + data.item elemet mutat: új kind nem jelenik meg automatikusan. |
| Mentés | `history.ts`, `migrate.ts`, assets/vectorAssets, autosave | Draftkülönválasztás; használt összes függőség begyűjtése; main FORM vs külön Shape mentés széttagoltságának megszüntetése a Vel-csomagban. |
| Lottie | lottie-web 5.13.0 és helyi vektoros import | Verzió egyezik a FORM-pal, egyetlen lejátszóadapter. A Vel most 2 MB és szűk típuslista; FORM 30 MB + dotLottie/ZIP + statikus szín/layeredit célzott bővítés, nem egyszerű limitcsere. |
| Export | Vel PNG/MP4 és scene-idő; FORM SVG/PNG/frame ZIP képességek | Ugyanaz a natív render; vektor és shader külön. ZIP/frame keret, cancel és memória kezelése. |
| Téma/panelek | `workspace.ts`, `controls.ts`, `popovers.ts`, meglévő preferenciák | A Vel UI-rendszerébe illeszkedő új fül/nézet; a FORM teljes CSS/history/localStorage csomagját nem másoljuk be. |
| Assets | Képek, vectorAssets, saját könyvtár; labor SVG/boolean/fit algoritmusok | Egy közös helyi ikon/Lottie/texture selector; nincs második, párhuzamos FORManimáció-könyvtár. Licenc és számlálók source gate után. |

A meglévő `blob` típus a Velben **Blob-követés** Megjelenés. A FORM Blob generátor más funkció; kulcsot és mentett típust nem írhat felül. Javasolt névtér: `sg_blob`, `sg_pattern`, `sg_bg`, `sg_gradient` – végleges kulcsot az integrátor rögzít. A sok paraméter miatt a max.8 vezérlős saját GLSL-be csomagolás nem megfelelő teljes integrációs modell.

## 9. Implementációs sorrend és befejezés

[SG-00](tasks/SG-00.md) forrás/funkcióbaseline → [SG-01](tasks/SG-01.md) fül/draft → egy kis valódi generátoradapter [SG-02](tasks/SG-02.md) és a mentés [SG-05](tasks/SG-05.md) → [SG-06](tasks/SG-06.md) Add from Gen, három nézet, egy undo, Edit in ShapeGen. Ez az első hasznos átjárhatósági mérföldkő.

Utána a négy mód teljes mélysége SG-02; rajz/ismétlés SG-03; asset/Lottie/ikon SG-04; teljes file/export és migráció SG-05; záró paritás SG-07. A tiszta algoritmusok külön segítővel készülhetnek, de a render/history/Library/inspector közös kapcsolási pontoknak egyetlen writerük marad.

A munkát az aktuális CAT-01 + STAB-01 hullámhoz kell illeszteni. A stabil katalógus-ID/slotmetaadat hasznos közös alap; a Shapegen nem ok a már megvalósult P2/T6/E1 stb. újraépítésére. Ugyanakkor a meglévő rendszer bővítendő, ha nem tudja veszteség nélkül a FORM v8 képességét.

**A teljes készállapot:** valamennyi funkciómátrix-sor natívan vagy bizonyítottan egyenértékű közös megoldással működik; nincs eltűnt rajz/geometry/asset funkció; nincs csak dokumentált díszgomb; a Solo→Scene→Apply és a későbbi Edit kör újranyitás/export alatt is azonos alkotást ad. Emberi vizuális/UX-próba külön a headless eredménytől.

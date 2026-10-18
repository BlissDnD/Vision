# Vel — intuitív könyvtár és alkotói interakciók

**2026-10-18 · ÚJ FEJLESZTÉSI TERV, nem megvalósulási jelentés.** A konkrét adapterek, kompatibilitás és beépítési állapot más feladatlapból ellenőrzendő. Ez a dokumentum a felhasználói működés szerződése. A Claude-agent jobb megoldást is javasolhat: indokolja röviden az eltérést, őrizze meg a célt, a visszavonhatóságot és a vizuális minőséget. Ne másolja le vakon az itt szereplő elrendezést.

## 1. Ellenőrzött kiindulás és határok

Célzottan olvasott források: `app/src/library.ts` (`CATS`, `CAT_HINT`), `shelf.ts` (`libSearch`, `buildShelf`, `setAudition`, `ikey`), `itemops.ts` (`addFromLib`, `attachFx`), `presets.ts` (`syncLib`, `defaultCat`, `saveAsPreset`), `userlib.ts` (`UItem`). Irányadó előzmény: `docs/spec/vel-intuitiv-mozgas-es-kapcsolatok.md`.

- Ma kilenc polc van; a Mozgás és Világok polc többféle műveletet kever. A keresés ékezetfüggetlen névrészletet keres minden polcon; szinonima/feladatkeresés még nincs.
- A kártyák húzhatók, egérrel és fókuszra is van előnézet. A mozgás a kijelölt rétegen próbálható. Ezt kell továbbvinni, nem új, párhuzamos előnézeti rendszert építeni.
- A Megjelenés kattintása ma önálló szűrőréteget hozhat létre, rétegre húzása csak arra alkalmazza. A Mozgás kattintása a kijelölt réteget célozza. Az új felületben a hatókörnek látszania kell.
- Hosthoz kötött Megjelenés már létezik; az `fxFits`/`fxHostNote` a mai ellenőrzés alapja. Ettől még nincs általános addon-/kapcsolat-/geometria-kompatibilitási rendszer.
- A saját könyvtár generikus adatot tárolhat, de a polcra ma csak `preset` és `shader` kerül. Saját mozgás, paletta és ráhúzható saját shader nem tekinthető késznek.
- A beépített kártyák és drag payload ma kategória/index szerint működnek. A polcok átrendezése előtt stabil katalógusazonosító és régi saját kategóriák leképezése kell. Különben rossz elem, thumbnail vagy drop jelentkezhet.
- A külön extension-lab modul nem Vel-funkció. Az új Terep már létezik, a Bolygóra húzható domborzat, új holdrendszer vagy általános légkör csak terv, amíg adapterük nincs kész.

## 2. A könyvtár két tengelye

**Szerep = mit teszek? Téma = milyen világot keresek?** Egy katalógusrekord több nézetben jelenhet meg, saját másolat és eltérő kedvenc nélkül.

| Fő kategória | Művelet | Alcsoportok, csak szükség esetén kibontva |
|---|---|---|
| Receptek | Szerkeszthető összeállítást adok hozzá | Világ és táj; Szöveg; Layout; Absztrakt; Termék |
| Elemek | Új tartalmat adok a jelenethez | Forma; Szöveg és layout; Természet; Generatív háttér; Részecskeforrás; Média |
| Megjelenések | A célt vagy a kompozíciót alakítom | Anyag; Fény; Szín; Torzítás; Stilizálás; Szétesés |
| Mozgások | Időbeli viselkedést alkalmazok | Érkezés/távozás; Folytonos; Útvonal; Fizika; Hangreakció; Kamera |

A témagyűjtemények — Űr, Természet, Tipográfia, Folyadék, Retro, Stúdió, Absztrakt — opcionális gyorsutak. Ne legyen második állandó tabsor. Az Űr megnyitásakor az eredmények szerep szerint csoportosulnak: Bolygó elem, Naprendszer recept, Légkör Megjelenés, Keringés Mozgás. Csak ténylegesen elérhető elemek jelenjenek meg.

A 2D/3D, animált, saját, kompatibilis jellemző szűrő, nem fő kategória. Az extrudálás/egyesítés/hálóegyszerűsítés szerkesztési művelet: kijelölt elem eszköze vagy parancsa. Ne kerüljön minden művelet presetként a könyvtárba.

## 3. Kevés állandó UI, fokozatos feltárás

Alapnézet: kereső, négy fő kategória, egy rövid gyorsutas sor (Kedvencek / Legutóbbi / Saját), kártyák. A téma- és technikai szűrők egy „Szűrés” felületen nyílnak; az aktívak törölhető chipek. Ne legyen minden címke minden kártyára kiírva.

Kártya nyugalmi állapotban: előnézet, név, legfeljebb egy szükséges jelzés (például „csak Felhő”, „kísérleti”). A kategóriát a környezet jelöli; vegyes keresési listában külön szerepfelirat kell. Rövid leírás, kedvenc, további műveletek fókuszra/rámutatásra vagy részletkártyán; billentyűzettel is elérhetők. Kerülendő egymásba ágyazott gomb a teljes kártyagombon belül.

A változatcsalád egy fő kártya: például Bolygó → Óceán/Jég/Láva. A változatválasztó ne nyisson újabb nagy modált. A család eleve hasznos alapállapotot ad; pontosan feliratozott kis változatsor és legfeljebb 3–5 fő vezérlő követi. A teljes paraméterlista a Részletekben. A kiváló önálló preset megjelenhet külön ajánlásként is, ugyanarra a stabil rekordra hivatkozva.

A térbeli fogantyú a térbeli művelethez való; az időzítést időfogantyú állítja. Új gesztus ne vegye el a mai kijelölést, mozgatást, kameraorbitot vagy G1-mozgásfogantyút. Csak a kijelölt elem releváns fogantyúi és kapcsolatai látszanak. Módosítóbillentyű gyorsítás lehet, kizárólagos hozzáférés nem.

## 4. Nyolc konkrét használati folyamat

### F1 — Megtalálás név vagy alkotói szándék alapján

1. A keresőbe „háttérbe simulás” kerül. A kurált metaadat az érintett köd/pára/légkör elemeket adja, elérhetőségük szerint; ez kezdetben determinisztikus szinonimatábla, nem költséges AI-kereső.
2. Pontos név előre; utána szinonima, címke, rövid leírás. A felhasználó látja, melyik szerepből érkezett a találat.
3. Nyilakkal találatválasztás, Enter az adott, feliratozott elsődleges művelet. Escape először a próbát, majd a keresőt zárja. A keresés és görgetés visszatéréskor megmarad.

Gyorsbillentyű csak a meglévő kiosztás ütközésvizsgálata után: javaslat Cmd/Ctrl+K. Szövegmezőben és szövegszerkesztés közben ne lopja el a megszokott parancsokat. Mindig legyen látható keresőgomb.

### F2 — Új elem a vászonra

Kattintás/Enter → a látható vászon közepére, értelmes méretben; drag → az ejtési pontra. Előnézeten „Új elem” szerepel. Siker után az új elem kijelölt, a legfontosabb vezérlők elérhetők, a könyvtár helye megmarad. Egy undo törli a teljes hozzáadást. Médiaszűrő/fájlválasztó megszakítása ne hagyjon üres szemetet.

### F3 — Megjelenés a kijelölt elemre

Kijelölt Bolygó → Megjelenések → rövid próba → „Alkalmazás: Bolygó”. Drag a vászon tárgyára/rétegsorra ugyanide vezet. Teljes jelenetre alkalmazáshoz külön, egyértelmű „Kompozícióra” művelet tartozik, ha az adapter támogatja. Kijelölés nélkül a rendszer nem találgat: „Válassz célt”, vagy explicit „Új szűrőréteg”. Ez a mai kattintásszemantika tudatos migrációja, külön elfogadási próbával.

### F4 — Mozgás megmutatása és finomítása

Kijelölt elem → Lebegés kártya → próba a meglévő motion-audition útvonalán → kattintás alkalmaz. A meglévő G1-fogantyúval erő/irány, a mozgásblokkon időzítés szerkeszthető. Hangra pulzálásnál hiányzó hangforrás esetén célzott kérdés jelenik meg; hangtól független, félrevezető „működés” nem. Numerikus vezérlők a gesztus teljes fallbackjei. A hangkapcsolat és az új mozgás egy közös undo-tranzakció, ha egy műveletben jött létre.

### F5 — „Hozzáadás ehhez” a tárgy környezetében

Bolygó kijelölése → egyetlen „Hozzáadás ehhez” nyitó → legfeljebb öt releváns javaslat, majd „Összes keresése”. Például Hold, Gyűrű, Domborzat, Légkör, Keringés csak az adapterek elkészülése után. Az ajánlás alkalmazás előtt röviden jelzi: új gyerekelemet, Megjelenést vagy Kapcsolatot hoz létre. Ne kerüljön minden ajánlás lebegő gombként a vászonra. Billentyűzetes út: kijelölt elem műveletmenüje.

### F6 — Receptből saját világ

Naprendszer recept → külön előnézet → „Hozzáadás jelenethez”. Másik művelet: „Jelenet cseréje”, explicit következményjelzéssel. A recept fő vezérlői: változat/seed, színvilág és 2–3 karakterparaméter; részletezve az összes alkotóelem szerkeszthető. A kamera/időtartam megváltoztatása ne legyen rejtett mellékhatás: megőrzés alapértelmezés, „Recept kamerájával” opció, ha értelmes. Randomizálásnál a zárolt képek/szövegek/színek megmaradnak; egy undo az előző teljes állapotot adja.

### F7 — Saját változat megőrzése

Elem/csoport → Mentés sajátként → név és automatikusan javasolt szerep. Téma és egyéb címke opcionális Részletek. Visszakereshető a Saját nézetből és a normál keresőben; újratöltés után is ugyanaz az azonosító. Felülírás és „Új változat” külön művelet; az eredeti beépített elem sértetlen marad. Tárolási hiba esetén exportálható fájlajánlat, nem hamis sikerjelzés.

### F8 — Effektlánc értelmes próbája

„Álomszerű légkör” lánc → rövid felsorolás: Pára → Fényudvar → Szín. Próba az egész lánccal, alkalmazás egy művelet. Utána összecsukott, elnevezett blokk; kibontva sorrend, bypass és részletes vezérlés. Hiányzó függőség esetén nincs csendes kihagyás. Több kijelölt, eltérő típusú cél esetén „2/3 cél kompatibilis” és explicit célválasztás; nincs részleges, észrevétlen beillesztés. Láncok könyvtári támogatása külön adapterfeladat, nem jelenlegi képesség.

## 5. Előnézet, alkalmazás és visszavonás közös szabálya

Állapotok: `idle → preparing → previewing → applying → applied`; mellékágak: `cancelled`, `failed`, `unsupported`. A részletkártya megnyitása és a keresés nem módosítja a projektet.

- Rámutatás/fókusz statikus információt azonnal ad; automatikus mozgó próba rövid, javasolt 250 ms-os késleltetéssel indul, hogy átfutáskor ne villogjon. Csökkentett mozgásnál explicit „Próba” gomb, statikus thumbnail.
- Egyszerre legfeljebb egy aktív GPU-előnézet. Hover nem indít hálózati letöltést; a távoli csomagok explicit próbagombbal töltődnek. A kártyák képei késleltetetten, a látható tartományhoz készüljenek.
- Preview runtime-állapot, nem undo-bejegyzés, autosave, új assethivatkozás vagy lokális preseteltérés. Escape/blur/ablakbezárás/célváltás visszaadja a próba előtti állapotot, kijelölést és playheadet. A futó lejátszás állapotát is megőrzi.
- Jóváhagyás egy undo-bejegyzés; húzás közben sok frissítés után is egy. Hibás shader/asset nem hagy félig hozzáadott réteget. Régi, késve visszaérő async kérés nem írhatja felül az újabb próbát.
- A végleges render ugyanazt az időt/seedet/paramétert kapja, mint a próba. Szimuláció, fizika és fluid csak dokumentált seek/export megoldással válhat normál preseté; enélkül Kísérleti és explicit korlátjelzés.

## 6. Üres, hibás és nem kompatibilis állapotok

| Állapot | Felület és továbblépés |
|---|---|
| Nincs találat | Keresett szó és aktív szűrők látszanak; „Szűrők törlése”, rokon téma; nincs automatikus keresésátírás. |
| Üres Saját/Kedvencek | Egy mondat és valódi indító művelet; nincs dekoratív mintakártya működő elemnek álcázva. |
| Nincs kijelölés | Célhoz kötött művelet előtt „Jelölj ki egy elemet”; önálló demó csak külön próbamintán, egyértelmű jelzéssel. |
| Loading | A kártya mérete stabil, megszakítható; hosszabb töltésnél fázis neve. A többi könyvtár használható. |
| Offline/asset hiányzik | A már helyi elemek működnek; „Újrapróbálás”, helyi csere. Licenc-/forrásadatok a részletekben. |
| Nem kompatibilis | Rövid konkrét ok; működő alternatíva, ha van. A szűrt nézetben elrejthető, az Összes nézetben kereshető. |
| Hiányzó addon | Normál kínálatban nincs működőként listázva. A Kísérleti nézet megmutathatja az állapotot; nincs áltelepítés. |
| GPU/fordítási hiba | A projekt megmarad, a próba leáll, rövid hiba és másolható diagnosztika. Nem ismétlődik végtelenül. |
| Drága effekt | Előre jelzett becsült terhelés a részletekben; kisebb próba felajánlható. Ne csökkentse csendben a mentett minőséget. |

Kompatibilitás futtatható ellenőrzésből származzon, ne külön UI-kézi listából. Eredménye legalább: alkalmazható/nem/hiányzik-előfeltétel + magyar indok + szükséges választás. Újabb feature bevezetésekor ne ígérjen automatikus geometriakonverziót. Részleges támogatásnál mondja ki például: „csak 2D képként”, „térbeli anyagként még nem”.

## 7. Olcsón, párhuzamosan fejleszthető szeletek

1. **Alapmegállapodás, integrátor:** stabil azonosító, régi polc→új szerep leképezés, capability-válasz és preview-tranzakció interfész. UI és addon-agent előbb ezt fogadja el; közös fájlokat csak az integrátor szerkeszt.
2. **Kis agent A:** tiszta katalógusmetaadat, magyar szinonimák, családok és témák; nincs rendererfüggés. Tesztfixture legalább 30 valós mai elem és 10 jövőbeli, nem-elérhető rekord.
3. **Kis agent B:** kereső/rangsor/szűrés tiszta függvényei és tesztjei, rögzített interfészre. A UI-agent nem ír külön keresőt.
4. **Nagy agent:** polcfelület és preview/commit/drop bekötés, a meglévő shelf/itemops/motion utak megtartásával. Előbb jelenlegi beépített elemeken bizonyít, utána fogad addonokat.
5. **Segítő agent:** headless felhasználói folyamatpróbák, legacy sajátpreset-fixture, képernyőképek; nem szerkeszti a nagy agent UI-fájlját.
6. **Későbbi szeletek:** családválasztó → kontextusos ajánlás → láncok/receptek. Egyik sem előfeltétele a négy kategória és jó kereső első kiadásának.

A kereső ne igényeljen hálózatot vagy LLM-et. Az index egyszer épüljön; thumbnail és renderer ne kelljen keresésteszthez. Új addon saját leírórekorddal és capabilityval csatlakozzon, ne saját polccal/új vezérlőpanellel. A rendszerhatárok részletes implementációját a fő fejlesztési terv rögzítse, ez nem új csomagkezelő specifikáció.

## 8. Mérhető elfogadási kapuk

- Minden mai beépített kártyának stabil rekordja és legalább egy új főhelye van; nincs elveszett/hibásan célzott bejegyzés. Az átfedő gyűjtemény ugyanazt az ID-t adja. Régi sajátpreset kategóriái olvashatók maradnak.
- 1 000 metaadat-rekordnál a kereső tiszta kiértékelésének p95 ideje legfeljebb 50 ms a rögzített mérőgépen; az input→eredmény célszint 100 ms. A GPU-kártyagenerálás nem része az inputkritikus útnak.
- 20 előre rögzített magyar keresésből a várt elem legalább 18 esetben a top 5-ben; pontos név első. Tesztek: ékezet, angol szinonima, több aktív szűrő, üres eredmény, azonos nevű külön szerep.
- Az F1–F8 folyamat végrehajtható egérrel és csak billentyűzettel. Nincs kötelező drag/hover/jobbklikk/módosítóbillentyű; látható fókusz és feliratozott ikongombok vannak.
- Preview+Escape után projektadat, undo-hossz és assetreferenciák változatlanok. Apply+Undo helyreállítja a projektet, a kamerát és az időtartamot. Ezt hibával és késve érkező asynccal is mérni kell.
- 1 000 elem nem indít 1 000 renderert; egy aktív GPU-preview, megszakítható thumbnail-job. 30 gyors kártyaváltás után nincs növekvő renderer/textúra-szivárgás.
- 1280×800 és 1920×1080 nézetben nincs átfedő kontroll, horizontális könyvtárgörgetés vagy levágott művelet. 200%-os nagyításnál a lényegi könyvtárműveletek elérhetők. Az üres, loading és hibaállapot nem ugráltatja a fókuszt.
- A felhasználói próba 4 rövid feladat: Bolygó megtalálása; kompatibilis Megjelenés kipróbálása/visszavonása; Mozgás hozzáadása/állítása; saját változat visszakeresése. Cél: mindegyik segítség nélkül, legfeljebb egy téves kategóriaváltással. A headless siker önmagában nem jelent „felhasználóval kipróbálva” állapotot.
- Vizuális regressziópróba ugyanazzal a seed/idő/paraméterrel: az új könyvtár és az addonadapter nem egyszerűsítheti a jó preset karakterét. A csökkentett előnézeti minőség csak jelzett ideiglenes állapot; a végleges kép változatlan beállítást használ.

## 9. Tiltott rövidítések

Ne zsúfold tele a vásznat ajánlásokkal és kapcsolatvezetékekkel. Ne rejts funkciót kizárólag tooltipbe. Ne tegyél minden addonhoz új fő kategóriát. Ne készíts külön Kapcsolat-rendszert a hanghoz/fizikához. Ne alakítsd a receptet szerkeszthetetlen képpé a könnyebb integráció miatt. Ne nevezd a prototípust beépítettnek, és ne állítsd a teljes UX-et késznek egy kereső-refaktor alapján.

# HELP-01 — intuitív, egymásba nyitható Help mód

**Dátum:** 2026-10-18. **Állapot:** előkészített terv, nincs implementáció és nincs futási/vizuális ellenőrzés. A felhasználó most Claude számára kér leírást és előkészítést. A tényleges fejlesztés a Vel mérföldkő-jóváhagyási rendjében induljon.

## 1. Mit akarunk elérni?

A felhasználó alkotás közben, az adott vezérlő mellett érti meg, mire való és hogyan használja. Bekapcsolt Help módban a hover részletesebb magyarázatot ad. A leírásban jelölt szakszó vagy effekt neve újabb magyarázatot nyithat — a felhasználó Baldur’s Gate 3-hoz hasonlóan egymásba nyitható fogalommagyarázatot kér. Ez interakciós irány, nem ellenőrzött specifikáció a játék pontos működéséről.

**Vezérelv:** röviden megérted → rögzíted, ha tovább olvasnál → csak az érdekes fogalomba mélyedsz bele. A súgó olvasása soha nem módosítja a jelenetet.

## 2. Először ezt olvasd, Claude

1. A repo `CLAUDE.md`, `HANDOFF.md`, majd `app/CODEMAP.md` fájlját.
2. Ezt a dokumentumot. Első körben nincs szükség a teljes addoncsomag végigolvasására.
3. Célzottan a `workspace.ts`, `modals.ts`, az aktuális billentyűkezelő, `catalog.ts`, `shelf.ts`, `inspector.ts`, paraméterépítők és UI-stílusok érintett részeit.
4. ShapeGen-bekötéshez később a `../shapegen/00-START-HERE.md`-t; a Help alapjai ettől függetlenül épüljenek meg.

**Forrásmegfigyelés, 0.45.0-cat1:** a `workspace.ts` már átalakítja a `title` attribútumot `data-tip`-pé, 380 ms késéssel `.vtip` elemet mutat (`role=tooltip`), és pointerdown/wheel/keydown esetén elrejti. `tipNodes()` rövid zárójeles szöveget billentyűjelöléssé alakít. Gyorsbillentyű-panel és helyi UI-preferencia már létezik. Ez a meglévő alap nem alkalmas változtatás nélkül interaktív kártyára: a globális elrejtés a saját linkjére kattintást is megszakíthatja. A forrás az implementációig változhat, ellenőrizd újra.

A `catalog.ts` már ad kereshető katalógust és `catId()` azonosítót, de a beépített ID jelenleg névből képzett. Tartós súgóhivatkozást ne csak lefordított névhez vagy polcindexhez köss: használj stabil effekt-/paraméterkulcsot vagy explicit help ID-t, a katalógus felé adapterrel.

## 3. Bekapcsolás és alapélmény

- Egyetlen, feliratozható **? Súgó** kapcsoló a meglévő felső eszköztárban vagy súgómenüben. Aktív állapota visszafogottan, egyértelműen látszik. Ne kerüljön minden mező mellé állandó kérdőjel.
- Kikapcsolva maradjon a jelenlegi rövid tooltip. Bekapcsolva ugyanezen a helyen legyen bővebb, kontextushoz illő kártya; ne jelenjen meg két tooltip egymáson.
- Az üzemmód helyi felületpreferencia; nem a projekt része, nem undo, nem kerül az exportképre. Újratöltés után visszaállhat, de a nyitott kártyaláncot ne állítsa vissza.
- A rövid gyorsbillentyűlista maradjon külön elérhető. A Help mód nem helyettesíti azt.
- Első aktiváláskor egyszeri rövid mondat: „Mutass egy vezérlőre. Rögzítsd a leírást, ha tovább olvasnál.” Ne induljon kötelező túra.

## 4. Kártya és rögzítés

### Hover / fókusz

Kiinduló megjelenési késés 450 ms, távozási türelem 200 ms; finomítható kipróbálás után. A felhasználó át tudjon menni a célról a kártyára anélkül, hogy az eltűnne. A kártya nem követi folyamatosan a kurzort. Húzás, méretezés, színválasztás és vászongesztus közben ne pattanjon fel új súgó.

A hoverkártya első része legfeljebb 2–3 rövid mondat és egy használati gesztus. A fejlécben egy látható **Rögzítés** gomb legyen, teljes kattintási útvonallal. Billentyűalternatíva: fókuszált célon vagy látható kártyán **F1** rögzít; csak ebben a helyzetben fogható el. Ezt a meglévő gyorsbillentyűkkel és a támogatott böngészőkkel először ellenőrizni kell. A látható gomb akkor is teljes megoldás, ha az F1-et a környezet elfogja; nem követelmény újabb módosítóbillentyű megjegyzése.

### Rögzített kártya

Rögzítéskor a kártya maradjon a helyén, tartalma görgethető, szövege kijelölhető, linkjei és bezárása használható. Az egér elmozdítása önmagában nem cserélheti ki. A rögzítés ne indítson el semmilyen eredeti gombműveletet. A tooltipben lévő fogalomra kattintás egyben rögzítse a szülőt, majd nyissa a kapcsolódó fogalmat.

**Példa tartalomváz:**

> **Intenzitás**
> A kiválasztott hatás erősségét változtatja.
> Húzd a csúszkát, vagy írd be a pontos értéket.
> Ennél az effektváltozatnál a nagyobb érték … [az adott paraméter alapján kitöltve].
> Kapcsolódó: [paraméter animálása] · [kulcsképkocka]

Ez szövegsablon, nem állítás minden „Intenzitás” nevű paraméter működéséről. A tényleges hatást, mértékegységet, tartományt és billentyűt mindig a kódból igazold.

### Egymásból nyíló fogalmak

A hivatkozható szöveg finom aláhúzással felismerhető; a szín önmagában ne legyen a jelzés. Hoverre ne induljon automatikus végtelen kártyalánc. A kapcsolódó kártyát kattintás, Enter vagy Space nyitja.

Széles ablakban legfeljebb a szülő és az aktuális gyermek legyen egyszerre látható. További mélységnél a gyermekkártyán belül navigálunk: **Vissza**, rövid címmorzsa, a teljes cím elérhető. Ne nőjön végig a képernyőn egy popovererdő. Keskeny ablakban egyetlen alsó lap/panel ugyanezzel a navigációval. A–B–A hivatkozásnál a már nyitott fogalomhoz térjen vissza, ne szaporítsa a történetet.

**Escape:** a legfelső megnyitott gyermeket zárja vagy visszalép; utána a rögzített gyökérkártyát. A Help által kezelt Escape ugyanabban az eseményben ne zárjon projektmodalt és ne töröljön kijelölést. Fókusz vissza a megnyitó linkre/célra, ha még létezik. Külső kattintás zárhatja a láncot, de nem nyelheti el a cél eredeti normál kattintását; kivétel csak a kifejezetten aktivált „Mi ez?” mód.

## 5. Milyen magyarázat legyen benne?

Minden téma rövid, magyar, alkotói nyelven szóljon:

1. **Mi ez / mit látsz tőle?** Egy közérthető mondat.
2. **Hogyan használod?** Konkrét kattintás, húzás vagy beállítás.
3. **Mi változik, ha emeled/csökkented?** Csak ahol értelmes.
4. **Mivel függ össze?** Néhány kattintható fogalom, nem teljes szószedet.
5. **Miért nem látszik / miért inaktív?** Csak valós, ellenőrizhető feltételnél.
6. Mélyebben: mértékegység, tartomány, korlát és konkrét példa, ha segít.

Az első kártya ne legyen kézikönyv. A ritka részletek a „Részletesen” nézetbe kerüljenek ugyanazon a kártyán. A rokon effekt leírásának megnyitása ne adja hozzá az effektet. Egy külön **Megmutatás a felületen** művelet odanavigálhat és kiemelhet; ez se írjon projektet. Ne használj automatikus demo-t, renderelő bélyegképet vagy futásidejű AI-szöveggenerálást az első szeletben.

**Kezdő témakörök:** könyvtár és keresés, Forrás/Forma/Megjelenés/Mozgás/Recept különbsége, réteg és csoport, fő paraméterek, effektsorrend, Animálás mód, kulcsképkocka, folyamatos mozgás és Loop/Körbeér, Kapcsolat, színforrások, mentés/export. A későbbi ShapeGen ugyanahhoz a fogalomtárhoz adjon témákat, ne saját tooltiprendszert.

## 6. Technikai illesztés — tervezett szerződés

Új modulnevek javaslatok, nem létező API-k:

- `helpdata.ts`: típusos, ellenőrizhető témák és hivatkozások; DOM nélkül.
- `help.ts`: közös vezérlő és UI-életciklus, a meglévő `workspace.ts` tooltipútjához illesztve. Egy célhoz egy megjelenítő tartozzon.
- UI-kötés: `data-help-id`, szükség esetén `data-help-context`; stabil célazonosító. `aria-describedby` kapcsolat az egyszerű magyarázathoz. Ne használd a teljes magyar tooltipmondatot kulcsként.
- `HelpTopic`: `id`, `title`, `summary`, `steps`, `details`, `relatedIds`, opcionális `contextRules`, `availability`, `sourceRefs`.
- `sourceRefs`: repo relatív fájl + export/paraméterkulcs, opcionális ellenőrzött verzió. Így a tartalomellenőrző agent tudja, miből származik a leírás.
- A szöveg típusos szegmensekből épüljön (`text`, `termRef`, `shortcut`); explicit hivatkozásokkal, nem automatikus szófelismeréssel vagy nyers HTML-beszúrással. A szakszó és a hivatkozás célja külön adat.
- Témahiánynál a meglévő rövid magyarázat az alap; ne találj ki működést és ne állíts minden mezőhöz azonos általános súgót. Hiánylista készüljön, tervezett funkció látható jelöléssel.
- UI-állapot: `enabled`, `transientTarget`, `pinnedRoot`, `navigationHistory`, `focusReturnTarget`. Nem kerül a `st` projektbe; megnyitás/olvasás nem hív `commit()`-ot.
- Állapotút: idle → transient → pinned → child/history → pinned → idle. Cél törlése, panel újrarenderelése, modal nyitása vagy módváltás takarítsa el az érvénytelen horgonyt; a nyitott szószedet önálló maradhat csak ha kontextusfüggetlen.
- A kontextusolvasó csak olvas: ne írjon alapértéket rétegbe, ne töltsön assetet és ne indítson preview-renderert.
- Delegált eseménykezelés vagy közös komponenskötés; ne legyen külön MutationObserver/listener minden csúszkán. Timer, focus, scroll és resize takarítás kötelező; ne legyen folyamatos rAF vagy WebGL-munka.
- A meglévő globális pointerdown/wheel/keydown tooltip-elrejtést állapotfüggően át kell vezetni. A kártyán belüli scroll maradjon olvasási művelet; külső scroll után a horgony újrapozicionálható vagy a transient bezárható.
- Egyetlen kártyaréteg a meglévő panel/modal rétegrendben; aktív modal súgója ne kerülhessen a modal mögé vagy egy másik modal fölé. A `modals.ts` nem kényszeríthető minden kis kártya helyére, ha ezzel lecseréli az aktuális dialógust.

## 7. Billentyűzet, érintés, akadálymentesség

A nem interaktív rövid tooltip maradhat `role=tooltip`. Linket/gombot tartalmazó felület legyen megfelelően elnevezett nem modális popover/dialog; fókuszkezelését külön tervezd meg. Ne tegyél interaktív tartalmat egyszerű tooltip szerepbe. A Help ne változtassa minden mező fókuszát külön modális csapdává.

Billentyűzetes fókusz is előhívja a magyarázatot; a részletek rögzítés után Tab-bal bejárhatók. Képernyőolvasó esetén ne olvassa fel az egész fogalmi láncot minden mezőn, ne legyen élő régiós szövegáradat. Ikongombnak legyen neve, kapcsolónak aktív állapota.

Érintésnél a bekapcsolt Helpben elérhető külön **Mi ez?** művelet: egyszeri célválasztás, a következő érintés leírást nyit az eredeti művelet helyett, majd a célválasztás véget ér. Látható **Mégse**. Ez nem változtathatja meg tartósan a normál Help mód minden érintésének jelentését. Hosszú nyomás csak opcionális kiegészítés, ne az egyetlen út és ne ütközzön a húzással.

Sötét/világos témával, nagyított szöveggel, keskeny ablakkal és csökkentett mozgással is használható. A kártya illeszkedjen a látható ablakhoz, ne takarja el szükségtelenül a magyarázott vezérlőt.

## 8. Takarékos fejlesztési sorrend Claude-nak

| Szelet | Eredmény | Függőség / átadás |
|---|---|---|
| HELP-00 | Aktuális esemény/fókusz/billentyű és súgótartalom-leltár, 12 ellenőrzött példa | Csak célzott forrásolvasás; rögzített tartalomszerződés |
| HELP-01 | Kapcsoló, közös hover/fókusz, rögzítés, kattintható fogalmak, max. két kártya, vissza/Escape | HELP-00; 12 példával végig működő kis függőleges szelet |
| HELP-02 | Érintéses Mi ez?, keskeny panel, fókusz/modal/scroll ütközések teljes kezelése | HELP-01; hozzáférhetőségi és interakciós próba |
| HELP-03 | Súgótartalom bővítése és célpontlefedettség | Jóváhagyott schema; soronként forrásalapú tartalom, hiánylista |

**Agentmunkarend, ha több agent dolgozik:** egy fő agent birtokolja a runtime-ot és az eseménykezelést. Egy kisebb tartalomagent csak külön adatszeleteket ír a rögzített schema alapján; egy ellenőrző csak hiányzó/törött hivatkozásokat, valódi működést és próbákat vizsgál. `workspace.ts`, globális billentyűkezelő és stílusbeillesztés egyszerre egy tulajdonosnál legyen. A tartalomagent ne írjon át UI-infrastruktúrát. Nincs szükség a teljes forrás minden agentnek történő ismételt átadására; task + schema + releváns kód elegendő.

Claude használja saját megítélését és javasoljon egyszerűbb/jobb interakciót, ha megőrzi a fokozatos felfedezést, a közvetlen olvashatóságot és a cluttermentességet. A felhasználó BG3-hasonlata nem kötelező pixelpontos másolás. Új függőség csak akkor kell, ha a meglévő rendszerrel nem oldható meg jól.

## 9. Elfogadási és ellenőrzési esetek

- Help ki: a régi tooltip és minden normál vezérlő működik. Help be: nincs dupla tooltip; preferencia újratöltéskor megmarad, projekt változatlan.
- Cél → kártya egérút nem villog. Rögzítés után más célra mutatva nem vész el a szöveg.
- Fogalom megnyitása nem teszi be az effektet. Háromszintű fogalomút, Vissza, A–B–A ciklus és hiányzó hivatkozás kezelése; max. két látható kártya.
- Escape előbb a gyermeket, majd gyökeret kezeli; nem szivárog a szerkesztőhöz. Enter/Space/Tab működik; fókusz helyesen tér vissza.
- Nyitott modalon belüli súgó nem zárja le a modalt. A kártya scrollja nem változtatja az alatta lévő numerikus mezőt vagy vászonzoomot.
- Csúszka-/vászonhúzás közben nincs új popup, megszakított timer nem nyit vissza elavult kártyát. Törölt cél nem hagy árva panelt.
- Érintéses Mi ez? pontosan egy célválasztást fog el; Mégse visszaadja a normál működést.
- Nagyítás/keskeny ablak/témaváltás; olvasható, nem lóg ki. Képernyőolvasós elnevezések és interaktív szerepek ellenőrzése.
- Súgónyitás és fogalomolvasás előtt/után ugyanaz a projekt, undo-hossz és exporteredmény. Nincs új folyamatos renderciklus.
- Tartalomellenőrzés: egyedi ID, minden kapcsolódó ID létezik, minden bekötött cél feloldható, a rövid magyarázat nélküli célok listázhatók; nem kitalált paraméterhatás vagy gyorsbillentyű.

Csak a változáshoz indokolt célzott tesztek; a repo kötelező végső ellenőrzése a jóváhagyott implementáció végén. **Ez a terv nem állít futtatott UI-tesztet.**

**Felhasználói próba a megvalósítás után, 4 lépés:** (1) Súgó be, paraméter fölé mutatás és rögzítés. (2) Szakszó megnyitása, további fogalom, Vissza/Escape. (3) Ugyanez billentyűzettel és keskeny nézetben. (4) Súgó ki, normál húzás és mentés; a jelenet nem változott a súgó használatától.

## 10. Következő agentnek másolható feladat

Olvasd el a `docs/claude-handoff/help-mode/00-START-HERE.md` tervet és a Vel belépési fájljait. Térképezd fel a meglévő tooltip-, modal-, fókusz- és billentyűrendszert. Készíts rövid HELP-01 mérföldkő-javaslatot konkrét gesztusokkal és 12 valós súgópéldával, majd a repo szabálya szerint várj jóváhagyásra. Utána a meglévő tooltip alapra építs Help módot, rögzíthető kártyákkal és explicit fogalomlinkekkel; ne módosíts projektállapotot a súgó olvasásakor. A tartalmat a kódból igazold, a hiányt jelöld. Ha jobb interakciót látsz, indokold és alkalmazd a jóváhagyott keretben.

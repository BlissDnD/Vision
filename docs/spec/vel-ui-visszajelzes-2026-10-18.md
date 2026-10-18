# UI-visszajelzés a jobb panelről és a munkatérről (a felhasználó, 2026-10-18)

Állapot: **feljegyezve, nincs ütemezve.** Indítás előtt rövid javaslat és jóváhagyás kell (több szeletre bontható). Kapcsolódó: `FUNKCIO-LELTAR.md` 21. sor (UI rendezettség), 29. sor (Mozgás polc), `vel-mozgas-polc-kategoriak.md`.

Összkép: a UI „nem rossz, de nem teljesen megfelelő”. Sokkal kompaktabb lehetne; valahol túl sok a zsúfoltság, valahol túl kevés a lehetőség.

## 1. Tömörebb felület
- A csúszkák feleslegesen nagyok; összességében kompaktabb vezérlők kellenek.
- A zsúfolt részeket szét kell bontani.

## 2. Szövegszerkesztő eszköztár
- Ha egy elemen bármilyen szövegszerkesztés lehetséges, egy **külön sáv jelenjen meg fent**, mint egy HTML-szerkesztőben: félkövér, szín, igazítás, sortávolság stb.
- Intuitív, jó UX-szel; a bővebb finomhangolás ezeken belül (pl. lenyíló részletek).

## 3. Jobb panel szerkezete
- A **Tartalom** fülön a leírás ne legyen felül.
- A **Részletek (ritkább beállítások)** kerüljön feljebb, közvetlenül a Fő beállítások alá.
- **Animációk, szövegmozgások → Animáció fül.** A Fő beállításoknál maradjanak a fő vezérlők (pl. erősség, sebesség), de a részletes animációs finomhangolás az Animáció fülön legyen.
- Ha egy vezérlő mindkét helyen szerepel (Fő beállítások és Animáció fül), **ugyanaz az érték legyen**: az egyiket állítva a másik is frissül (közös „vezérlő”).

## 4. Szín és megjelenés
- A mostani irány jó („fasza”), de több opció kell: **gradiensek** állítása, **színválasztó** (color picker) stb.
- **Színforrások hierarchiája:** sokszor több helyről kap színt egy elem (paletta, Színeltolás, saját szín paraméter, Megjelenés, csoport, Kapcsolat…). Kell egy világos szabály, hogy melyik érvényes; lehetséges, hogy „az utolsó, amit rátettél, az érvényes”. **Nyitott kérdés, a felhasználó sem döntötte el:** javaslatot kell tenni.
- **Színösszesítő:** egy réteget vagy csoportot kijelölve látszódjon itt az összes színmeghatározó, amelytől az elem (vagy a csoport elemei) színt kaphatnak, és ott helyben szerkeszthető legyen.

## 5. Rétegeffektek mint ikonok, „action bar”
- A rétegeffekteket **ikonnal** kell látni, hogy melyik mi. Lehet, hogy nem lenyíló menü kell, hanem ikonsor a réteghez, mint egy „action bar” (WoW-szerű).
- **Külön, felső action bar:** bármelyik eszköz ikonját rá lehessen húzni, és onnan ráhúzni dolgokra vagy interakcióba lépni vele (testreszabható gyorssáv).

## 6. Újabb felhasználói próba: egységes, Apple-jellegű UI/UX (2026-10-18)

**Állapot: feljegyzett igény, nem implementált és nem ütemezett.** A működés alapvetően jó, a színkezelés tetszik; a fő probléma a zsúfoltság és a nehezen felfedezhető kezelés. Az U4/U5 eddigi szeletei ezt nem zárják le. Az irány az egész alkalmazásra érvényes, nem csak a csatolt képek paneljeire.

### Görbe, kulcsok és ritmus
- A mozgáskártya és a ritmus-/keyframe-rész túl zsúfolt, nem intuitív. Legyen könnyen, közvetlenül szerkeszthető görbe.
- Vizsgálandó gesztus: szabadkézzel belerajzolni a görbefelületbe, majd azt sima, tovább szerkeszthető görbévé alakítani. Ez új szerkesztési igény; nem azonos a meglévő Eljátszás utáni sima interpolációval.
- A ritmusváltozatokat szöveges chipek helyett felismerhető ikonok vagy minigörbék mutassák; a megnevezés és magyarázat tooltipben jelenjen meg.
- A Tempó/Erő választás kaphat ikont és egyértelmű kétállású kapcsolót. A tényleges kapcsolójellegű opciókat a felület is kapcsolóként mutassa.

### Színek és panelszerkezet
- A jelenlegi színek jók. A színösszesítő és a színforrások listája elég a Színek menü/panel alatt; ne terhelje állandóan a többi nézetet.
- A szín- és megjelenéspanelen is rendezettebb csoportosítás, kevesebb egyszerre látható magyarázó szöveg és következetes ikonhasználat kell.

### A paraméterhez illő vezérlő
- Ne legyen minden paraméter ugyanolyan csúszka: a vezérlő alakja segítse megérteni, mit állítunk.
- Konkrét példa: a szél irányát kör alakú irányválasztón, az irány közvetlen elfordításával lehessen állítani.
- Tempó, szórás és más visszatérő fogalmak kapjanak egységes, hozzájuk illő ikonokat, a meglévő egyedi vezérlőket is ebben a rendszerben kell felülvizsgálni.
- Hiba: a feliratok több helyen nem férnek ki, levágódnak, a sorok/animációgombok egymásra torlódnak. Az angol alapnyelv segíthet, de nem helyettesíti a rugalmas elrendezést.

### Toolbar és kategóriák
- A toolbarban is inkább felismerhető ikonok legyenek, a szöveges jelentés tooltipben.
- Kategóriánként következetes ikoncsalád és/vagy színjelölés szükséges minden érintett felületen. Felhasználói példa: az effektek mindenhol kék színt és közös kategóriaikont kapjanak; a végleges színkiosztás még tervezendő.
- Amit egyértelműen meg lehet mutatni vizuálisan, azt így jelenítsük meg. Az ikon önmagában ne váljon találgatássá: felismerhető jelentés, aktív állapot, tooltip és hozzáférhető név szükséges.

### Közös design system — javasolt következő tervezési feladat
- Apple-jellegű, letisztult és intuitív design system az egész Velhez: közös ikonnyelv, kategóriaszínek, tipográfia, térközök, panelhierarchia, vezérlőtípusok és állapotok.
- A tömörítés ne pusztán kisebb elemeket jelentsen: világos csoportok, elsődleges műveletek, szükség esetén megnyitható részletek és közvetlen vizuális szerkesztés csökkentse a zsúfoltságot.
- Először a ritmus-/görbekártyán, a színpanelen, a részletes paramétersorokon és a toolbaron érdemes ellenőrizni a rendszert. Az implementáció előtt külön konkrét javaslat kell.

**Képi referenciák:** `docs/referenciak/ui-feedback-2026-10-18/01.png`–`07.png`, a felhasználó hét képernyőkivágása a fenti problémákról (sorrendben: mozgás/ritmus, színösszesítő, színpanel, szélirány-csúszka, levágott felirat, zsúfolt részletek, toolbar).

## 7. Alapirány véglegesítése

A felhasználó a Material Design 3-at választotta az Apple-jellegű alap helyett. A fenti kezelhetőségi igények megmaradnak. Komponensmegfeleltetés és fájlterv: `VEL-MATERIAL-DESIGN-SYSTEM.md`. Még nincs implementálva.

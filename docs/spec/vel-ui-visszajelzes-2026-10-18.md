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

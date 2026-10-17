# Látomás Stúdió – fejlesztési feature-lista (2026-10-17)

A felhasználói visszajelzés alapján: a Világok legyenek darabokból összerakva (mint a receptek), a 3D legyen látható, és a motion design kapjon profi, kód-alapú mozgásnyelvet (rugó, stagger, Bento-rács, kinetikus tipográfia, analóg filmréteg).

Jelölés: **[1]** = most készül (1. mérföldkő), **[2]** = következő kör, **[3]** = később.

## A. Moduláris világok
- **[1] A1. Égbolt szétbontása önálló darabokra.** A mostani egyben lévő „Égbolt” helyett:
  - **Égszín** – napszak szerinti színátmenet (zenit, horizont, éjszaka).
  - **Nap** – fénygömb koronával, a lencsefénnyel és a fénysugarakkal kombinálható.
  - **Felhőréteg** – 4 felhőtípus, perspektivikus vagy lapos, saját mag (seed), a nap irányából megvilágítva.
  - **Domb / talaj** – textúrázott füves, homokos vagy sziklás felület, ami egy dombvonal-alakzatba van maszkolva.
  - **Pára** – horizont-köd, amit bármilyen réteg fölé tehetsz.
  - **Dombvonal** új alakzat a Formák között, maszknak.
- **[1] A2. A világok receptek lesznek.** A Bliss-dombok, az Arany naplemente, a Viharos ég és az Éjszakai ég rétegcsoportok lesznek közös makrókkal. A „Napszak” makró egyszerre mozgatja az égszínt, a nap helyét és a felhők megvilágítását.
- **[1] A3. Duplikációk megszüntetése.** A 3D polcon lévő „Bolygó” (az `obj3d` bolygó-anyaggal) és a régi „Bolygó” recept helyett a Világ-bolygó lesz. A Világok polcon a darabok és a világ-receptek külön blokkban jelennek meg.
- **[2] A4. Bolygó szétbontása:** felszín, felhőhéj, légkör-derengés és gyűrű külön rétegként, közös napiránnyal.
- **[3] A5.** Térfogati felhők (raymarch), víz/óceán és terep csomag, csomagonként 5–10 recept.

## B. 3D láthatóság
- **[2] B1.** A 3D polc élén a „Szerkeszthető 3D jelenet” áll, kijelöléskor első használati tippel. A 3D forgatás eszköz (O) kiemelve jelenik meg, a fogantyúk mindig láthatók.
- **[2] B2.** Objektum-animáció: a 3D objektumok pozíciója, forgatása és mérete is kulcskockázható.
- **[3] B3.** glTF import, SDF → GLB export, 2,5D rétegek közös kamerával.

## C. Motion design
- **[1] C1. Mozgásmotor (programozott easing).** Rugófizika (merevség, csillapítás, valódi túllövés és beállás), valamint back, elastic, bounce, expo és lépcsős görbék. Ugyanaz a függvény JS-ben és GLSL-ben fut, így a vásznon és az exportban is azonos az eredmény. Minden belépés, kilépés és szövegmozdulat választhatja.
- **[1] C2. Bento-rács réteg.** Legfeljebb 9 lekerekített doboz kész elrendezésekben (2×2, hős + 2, hős + 3, 3 oszlop, oldalsáv, mozaik).
  - Animációk: kinyílás, becsúszás, felpattanás, átméreteződés A-elrendezésből B-be rugóval, bezáródás. Mindegyikhez stagger és sorrend tartozik.
  - Kitöltés: szín, üveg (az alatta lévő kép elmosva), paletta vagy csak körvonal. Árnyék is választható.
  - **Maszkként is működik:** a fölötte lévő szöveg vagy kép a dobozokon belül úszik be, ugyanúgy, mint az alakzatoknál.
- **[1] C3. Kinetikus tipográfia bővítése** (Animált szöveg). Új mozdulatok:
  - **Méret- és fókuszpop:** a szöveg nagyobbról és elmosottan ugrik be.
  - **Kemény vágás:** a szöveg egy képkockán belül jelenik meg, filmhíradó-stílusban.
  - **Rugós pattanás:** valódi rugóval, túllövéssel.
  - **Maszkolt beúszás oldalról.**
  - **Boil / jitter:** kézzel rajzolt remegés 8–12 képkocka/mp-vel.
  - **Ütemre lüktetés** a jelekkel.
  - **Torzulás a sebességtől:** a betűk megnyúlnak mozgás közben (squash & stretch).
- **[1] C4. Vetítő (analóg filmréteg)** szűrő. Por és karcok szaggatott tempóban, fényszivárgás (light leaks), expozíció-vibrálás (flicker), filmkocka-ugrálás és kameralebegés (gate weave / camera shake), kromatikus szél és szemcse. Minden külön csúszkán állítható.
- **[1] C5. Képkocka-ütem (posterize time).** Rétegenként vagy az egész kompozícióra 6, 8, 12, 15 vagy 24 képkocka/mp „mozis” darabosság.
- **[1] C6. Motion receptek:** Bento-bemutató, „The End” vintage, rugós cím, alsó harmad (lower third).
- **[2] C7. Kulcskocka-szerkesztő** bármely paraméterre, görbeszerkesztővel (graph editor) és rugós vagy egyedi görbékkel.
- **[2] C8. Folyékony átmenetek:** forma-morph (alakzat → doboz → háttér), átrepülés (zoom-through), egybefüggő jelenetek a vágás helyett.
- **[2] C9. 2,5D kamera:** rétegek Z-mélységben, kameramozgás, mélységélesség (DoF).
- **[3] C10.** Többsoros, tördelt szöveg betűnkénti quadokkal (MSDF), mozgási elmosás az exportban, szövegútvonal.

## Sorrend
1. **1. mérföldkő:** C1 → C2 → C3 → C4 → C5 → A1 → A2 → A3 → C6. Utána tesztelés, publikálás és handoff.
2. **2. mérföldkő:** C7, C8, B1, A4.
3. Ezután a 0. fázis (Vite + TS szétbontás), hogy a mag stabil, már bővített állapotában kerüljön modulokra.

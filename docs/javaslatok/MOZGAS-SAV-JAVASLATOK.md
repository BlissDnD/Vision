# Mozgás-sáv: a 22., 26. és 27. sor szeletjavaslatai (2026-10-18)

A felhasználó 2026-10-18-án ezt írta: „oké de nem leszek itt, hagyd jóvá magad”. Ezért ebben a sávban a három szeletet Claude saját maga hagyta jóvá. A javaslatok itt vannak, hogy utólag visszanézhetők legyenek.

## 1. LP1 – LFO „Körbeér” (22. sor)

**Cél:** az LFO-hullám és a folyamatos mozgás pontosan körbeér a loopban.

**A felhasználó ezt tudja majd:**
- Az LFO-panelen (∿) és a folyamatos mozgások kártyáján egy **Körbeér** kapcsolót talál; ez bekapcsolt Loopnál az új hullámokon és mozgásokon alapból be van kapcsolva.
- Bekapcsolva az Ütem a legközelebbi olyan értékre áll, amelynél egész számú kör fér a projekt hosszába. A felirat mutatja, például „4 kör / 10 mp”.
- Ha a hossz változik, a hullám magától újraigazodik.

**Megépül:**
- Egy `lp` jelző az NParamon és a mozgáson. Az eredeti Ütem nem íródik át, a kerekítés kiértékeléskor történik (`ev`, `moEval`).
- A Forgás egész fordulatra áll, a Remegés zaja periodikus lesz.
- Jelenetsorban a jelenet saját hosszához igazodik.
- Régi projektben nem változik semmi.

**Nem:**
- A Ritmus-tempó és a vágott mozgás pontos körbeérése (a felirat jelzi, hogy ezeknél csak közelítő).
- A hangjel nem igazodik.
- Az exporthossz nincs a projekthossz többszörösére kényszerítve.

**Próba:**
1. 10 mp, Loop be. Ütem 0,37: a felirat „4 kör / 10 mp”, a 10→0 váltásnál nincs ugrás.
2. Hossz 7 mp: a körszám magától változik.
3. Mentés és újranyitás után a kapcsoló megmarad.

## 2. XF1 – Mozgás átadása + Sorrend festése (26. sor)

**Cél:** egy meglévő mozgás karaktere több elemre átadható, festett sorrenddel és lépcsőzéssel; az eredmény egy nyújtható terjedési blokk.

**A felhasználó ezt tudja majd:**
- Egy réteg mozgáskártyáján (például Rugalmas beúszás a címszón) az **Átadás / Sorrend festése** gombot nyomja meg, majd végighúz a vásznon a többi szón vagy formán.
- A megérintett elemeken kis számok (1, 2, 3 …) mutatják a sorrendet. A rövid kártyán a mód választható: **Ritmus** (alap) / **Út** / **Teljes**, valamint a **Késés** (lépcsőzés, mp).
- Amíg a kártya nyitva van, a lejátszás előnézetet ad, a projekt még nem változik. Az **Elfogadás** egyetlen undo-lépés, a **Mégse** nyom nélkül eltűnik.
- A célréteg Mozgás fülén ez áll: „Ritmust kap ettől: Címszó”. Ott a **Leválasztás** önálló mozgássá teszi.
- A forrás későbbi javítását a célok követik (a módhoz tartozó mezőkben). A cél többi mezője helyi beállítás marad.
- A Sávokon a forrás mozgássora alatt egy **terjedési blokk** látszik. A jobb széle húzva nyújtja a késést, a blokkra kattintva újrafesthető a sorrend. Egy cél a listából egyenként törölhető.
- Ha egy célréteg törlődött, a blokk ezt jelzi („1 cél hiányzik”), nem törli csendben.

**A módok jelentése:**
- **Ritmus:** idő és karakter (kezdés, időtartam, karakter, ütem, Ritmus-szalag), a cél a saját irányát és távolságát tartja.
- **Út:** irány, távolság, ív, kitérés és sugár, a cél méretéhez arányosítva.
- **Teljes:** minden mező.

**Megépül:**
- `m.xf` (forrás: mód, késés, célsorrend) és `m.src` (cél: forrás-hivatkozás). A cél effektív mozgása kiértékeléskor áll össze (`effMo`), nincs rejtett másolás.
- Festőgesztus a vásznon, sorszámjelvények, előnézet (`R.xfPv`), terjedési blokk a Sávokon, mentés és régi projekt.

**Nem (későbbi):**
- Kulcsanimáció (Eljátszás-blokk) és Megjelenés-reakció (Glow, részecske) átadása, csak a ráhúzott Mozgások.
- Szavankénti festés egy szövegrétegen belül (most rétegek a célok).
- Részecskemezős terjedés.
- Látható zsinórok minden célhoz (a kártya és a blokk mutatja a kapcsolatot).

**Próba:**
1. Három szövegréteg; az elsőn Rugalmas beúszás.
2. Átadás: a festés végigmegy a másik kettőn, majd Elfogadás. Mind a saját helyére érkezik, 0,12 mp-es lépcsőben.
3. A terjedési blokk jobb szélét húzva a késés nő; az első mozgás Időtartamát átírva a célok követik.
4. Mentés, újranyitás, ⌘Z.

## 3. KO1 – Koreográfia gomb + szerepérzékeny jelenetmozgás (27. sor első szelete)

**Cél:** egy gombnyomásra szinte kész, szerepenként eltérő, összehangolt érkezés egy tipográfiai jeleneten. Az első profil az **Editorial érkezés**.

**A felhasználó ezt tudja majd:**
- A Rétegek fejlécében megnyomja a **✦ Koreográfia** gombot.
- A Vel minden látható réteghez **javasolt szerepet** ad: Háttér, Főcím, Kísérő szöveg, Fő forma, Díszítő forma, Kép/Videó, Részecske. A szerep a rétegtípusból, a méretből és a sorrendből adódik.
- A kártya azonnal előnézetet játszik a 0. mp-től, a projekt még nem változik.
- A kártyán három vezérlő van: **Mérték** (mekkora a mozdulat), **Ritmus** (milyen sűrűn követik egymást, az egyes belépések sebessége nem változik), **Hangsúly** (a főcím becsapódása).
- A „Szerepek” lenyitásban rétegenként a szerep átállítható, a részvétel kikapcsolható (például a logó maradjon nyugton). Szerepenként súly és késés állítható.
- Az **Elfogadás** egyetlen undo-lépés.
- A Sávok tetején egyetlen **Jelenetmozgás** blokk jelenik meg. A közepét húzva eltolja az egészet, a jobb szélét húzva a ritmust nyújtja. Lenyitva szerepcsoportokat mutat.
- A rétegek Mozgás fülén: „Szerep ebben a jelenetben” választó, „Részt vesz” kapcsoló és **Önálló mozgássá** gomb. Ez utóbbi a réteg részét valódi, szerkeszthető Rugalmas beúszás(ok)ká alakítja, és kiveszi a blokkból.

**Hogyan mozognak a szerepek (Editorial érkezés):**
- Háttér: lassú, puha beúszás nagyításból, majd enyhe lebegés (parallax).
- Főcím: alulról, Ütés vagy (nagy Hangsúlynál) Rugó karakterrel, nagyobb kezdőméretből; több cím lépcsőzve.
- Kísérő szöveg: a cím után kicsi, puha emelkedés.
- Fő forma: kicsiből rugózva nő.
- Díszítők: különböző irányokból ívesen, sűrű lépcsőben.
- Kép: puha nagyításos beúszás.
- Részecske: a végén beúszik.

A blokk meglévő Mozgásokból (Rugalmas beúszás, Lebegés) áll össze, kiértékeléskor. Ugrás, export és újranyitás ugyanazt adja.

**Megépül:**
- `st.ko` (mentett, régi projektben hiányzik).
- `choreo.ts`: szerepjavaslat, profil, kártya, rétegszintű vezérlők.
- Virtuális mozgások a `moEval`-ban.
- Jelenetmozgás-sor a Sávokon.
- Célzott teszt egy 9:16 tipográfiai jeleneten (háttér, főcím, két kísérő szöveg, két forma).

**Nem (későbbi):**
- További profilok (Szétesik → visszaáll, Energia-kitörés, Lágy organikus, Anyagváltó).
- Kamera/Fény szerep, belső Kapcsolatok (cím érkezése → háttér ragyogása).
- Szó-/betűszintű bontás.
- Hosszabb szövegre átírás utáni újracélzás-előnézet.
- Jelenetsoronként külön blokk (a Jelenetsor-lejátszásban a blokk nem fut).
- A gomb rámutatásra adott előnézete (a kártya nyitása ad előnézetet).

**Próba:**
1. 9:16, háttér-Színátmenet, nagy cím, két kisebb szöveg, két alakzat.
2. ✦ Koreográfia: az előnézetben a háttér, a cím, a szövegek és a formák eltérően érkeznek. Elfogadás.
3. A Sávokon tolj és nyújts a blokkon; egy formánál kapcsold ki a részvételt.
4. Mentés, újranyitás, ⌘Z.

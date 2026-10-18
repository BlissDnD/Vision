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

## 3. KO1 – Koreográfia gomb + szerepek (27. sor első szelete)

A 2. szelet után írom meg ide, a tényleges kód ismeretében.

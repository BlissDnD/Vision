# Vel – hibalista

Minden jelzett hiba ide kerül (a felhasználótól vagy tesztből). **Nem kell mindent azonnal javítani:** ha a javítás kérdéses, sokba kerülne, és nem akadályozza a folytatást, csak ide írd, és a következő alkalmas szeletben vedd elő. Ami a munkát blokkolja vagy adatot ront, azt javítsd rögtön.

Állapot: **nyitott** / **javítva (verzió, commit)** / **elvetve (miért)**. A legújabb felül.

## Nyitott

- **[nyitott · 2026-10-18 · Animált szöveg]** Nagy betűköznél (track ≈ .12) az `mtext` réteg utolsó betűje(i) levágódnak (a szövegtextúra szélessége nem számol a betűközzel). Előfordult: Magazinrács alcím; ott a betűköz .05-re csökkentve. Javítás: a textúra-szélességbe a `track × betűszám` is kerüljön.

- **[javítva · 2026-10-18 · teszt]** (A teszt most legfeljebb 4 mp-ig várja a képréteget a fix 120 ms helyett.) A `tests/polyhaven_import.js` a teljes körben néha bukik („image not imported”), önállóan futtatva zöld. Valószínűleg időzítés (a kép betöltésére nem vár eléggé). Nem akadályoz; a tesztben a betöltésre várást érdemes biztosabbá tenni.
- **[nyitott · 2026-10-18 · Random]** Egy Random jelenetben (bolygó + gyűrűk + fénycsíkok) a bal oldalon kemény szélű, vízszintes, téglalap alakú sötét sáv látszik, a bolygó magasságában. Gyanú: egy réteg (talán a bolygó gyűrűje vagy egy torzító réteg) téglalap alakú határa levágja a képet. A seed nem ismert, ezért még nem sikerült előidézni; a Random minőségszűrő szelet „kemény vágás” mérőszáma segíthet megtalálni.
- **[nyitott · 2026-10-18 · CodePen-láng port]** Az eredeti zajtextúrával betöltött lángban keskeny függőleges csík jelenik meg a láng jobb oldalán. A shader lefordul és animálódik, de a CodePen-képhez való vizuális összevetés és az alfa/koordináta-út javítása még szükséges (`presets/egyedi/lang-eredeti-demo.vel.json`).
- **[nyitott · 2026-10-18 · K1]** **K1 zsinór „Vezérelje”:** a forrásparamétert észrevétlenül találgatja (az első animált értéket veszi): a felhasználó a Virág méretmozgását akarta a Szem méretére kötni, de a kapcsolat **Virág X → Szem méret** lett. A Virág látható lüktetése a forma `p.size`-án van (hullám), nem a réteg `n.s`-én. Javítás: létrehozás előtt egyértelműen mutassa: „Virág X → Szem méret”, és ott helyben lehessen cserélni (pl. „Virág forma-méret”); az animált/hullámos paraméter legyen az első javaslat.
- **[részben javítva · Mozgás v1]** (a Mozgás fül jelzi a késői kulcsokat, egy gombbal kiterjeszti a hosszt; a Sávokon még nincs jelölés) **Kulcsok a Loop tartományán kívül:** a projekt Loopja 20 mp-nél újraindít, a Virág pozíciókulcsai 22–99 mp-nél vannak, ezért Loop bekapcsolva ezek sosem játszódnak le (Loop nélkül igen, ezért másnak tűnik a mozgás). Jelezze láthatóan az idővonal/inspector a tartományon kívüli kulcsokat (vö. 29. sor: rétegenkénti Loop).
- **[nyitott · 2026-10-17 · utófeldolgozás]** A „Filmes” lencsehiba okozta cián pontot (fényes csillanáson) headlessben nem lehetett előidézni; a javítás után a felhasználói próbán érdemes megnézni.

## Javítva

- **[javítva 2026-10-18 STAB-01 mini (`tests/stab1_persist.js`) · korábban 2026-10-18 · Codex forrásaudit]** **Mentett jelenet képe kimaradhat a projektfájlból:** `history.ts:28` `usedAssets()` csak az aktuális `st.layers` rétegeit járja be, a mentett jelenetek és közös alapok képeit nem. Tiszta környezetes mentés–újranyitás reprodukció szükséges. Részletek: `docs/audit/VEL-AUDIT-2026-10-18.md` T1.
- **[javítva 2026-10-18 STAB-01 mini (`tests/stab1_persist.js`) · korábban 2026-10-18 · Codex forrásaudit]** **Hang hordozhatósága és projektcsere:** a `projectJSON()` nem menti az `AUD` hanganyagát/jeladatait; `applyProject()` nem állítja helyre és nem törli a korábbi hangot. Új munkamenetes és két projekt közti próbával ellenőrizendő. Audit T2.
- **[javítva 2026-10-18 STAB-01 mini (`tests/stab1_persist.js`) · korábban 2026-10-18 · Codex forrásaudit]** **Videóexport bezárása nem megszakítás:** Escape/háttérkattintás csak bezárja az ablakot, nem állítja az export `cancel` jelét; a hangkódolási ciklus sem vizsgálja azt. Hibánál nincs közös kódoló-felszabadítás. Futási reprodukció hátra. Audit T4.
- **[javítva 2026-10-18 STAB-01 mini (`tests/stab1_persist.js`) · korábban 2026-10-18 · Kapcsolatok]** **Árva kapcsolat:** a projektfájlban maradt egy régi Kapcsolat, amelynek mindkét eleme hiányzik. Nem hat a képre, de betöltéskor/törléskor takarítani kellene (`st.links`).

- **[javítva · 2026-10-18 · Időzítés gyorsan]** **Szögletes görbe Eljátszás után:** a felvett kulcsok az új „Sima (átmenő)” görbét kapják (monoton cubic Hermite a szomszéd kulcsokból, `evaluation.ts` `SMOOTH_E`), így a pálya nem csúcsos és a sebesség nem áll meg kulcsoknál; a Simítás továbbra is ritkít, a zárt mozdulat ismétlése varratmentes marad (`tests/tap_timing.js`).
- **[javítva · 2026-10-18 · projekt/preset betöltés]** A teljes `.vel.json` projektet a Preset beillesztése ablak korábban „A válaszban nincs rétegleírás (layers)” hibával utasította el. Most projektként felismeri, és külön „Projekt megnyitása (a jelenlegit lecseréli)” gombot mutat. A vászonra ejtett projektfájl is ebbe az egyértelmű nézetbe kerül.

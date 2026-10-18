# Vel – hibalista

Minden jelzett hiba ide kerül (a felhasználótól vagy tesztből). **Nem kell mindent azonnal javítani:** ha a javítás kérdéses, sokba kerülne, és nem akadályozza a folytatást, csak ide írd, és a következő alkalmas szeletben vedd elő. Ami a munkát blokkolja vagy adatot ront, azt javítsd rögtön.

Állapot: **nyitott** / **javítva (verzió, commit)** / **elvetve (miért)**. A legújabb felül.

## Nyitott

- **[nyitott · 2026-10-18 · Eljátszás]** **Szögletes görbe Eljátszás után:** a felvett mozdulatból sűrű kulcsok lesznek **lineáris** szakaszokkal (`perform.ts` `LIN = 4`, RDP-ritkítás után), ezért a pálya és a görbe csúcsos, „jaggy”, nem sima. (Ami tetszik a felhasználónak: a felvétel varrat nélkül ismétlődik.) Javítási terv: új „Sima (átmenő görbe)” kulcsgörbe (Catmull-Rom / monoton cubic Hermite a szomszéd kulcsokból a `keyVal`-ban), azt kapják a felvett kulcsok, így a sebesség sem áll meg kulcsoknál; a Simítás csúszka továbbra is ritkít. Kicsi, olcsó javítás.
- **[nyitott · 2026-10-18 · CodePen-láng port]** Az eredeti zajtextúrával betöltött lángban keskeny függőleges csík jelenik meg a láng jobb oldalán. A shader lefordul és animálódik, de a CodePen-képhez való vizuális összevetés és az alfa/koordináta-út javítása még szükséges (`presets/egyedi/lang-eredeti-demo.vel.json`).
- **[nyitott · 2026-10-18 · K1]** **K1 zsinór „Vezérelje”:** a forrásparamétert észrevétlenül találgatja (az első animált értéket veszi): a felhasználó a Virág méretmozgását akarta a Szem méretére kötni, de a kapcsolat **Virág X → Szem méret** lett. A Virág látható lüktetése a forma `p.size`-án van (hullám), nem a réteg `n.s`-én. Javítás: létrehozás előtt egyértelműen mutassa: „Virág X → Szem méret”, és ott helyben lehessen cserélni (pl. „Virág forma-méret”); az animált/hullámos paraméter legyen az első javaslat.
- **[részben javítva · Mozgás v1]** (a Mozgás fül jelzi a késői kulcsokat, egy gombbal kiterjeszti a hosszt; a Sávokon még nincs jelölés) **Kulcsok a Loop tartományán kívül:** a projekt Loopja 20 mp-nél újraindít, a Virág pozíciókulcsai 22–99 mp-nél vannak, ezért Loop bekapcsolva ezek sosem játszódnak le (Loop nélkül igen, ezért másnak tűnik a mozgás). Jelezze láthatóan az idővonal/inspector a tartományon kívüli kulcsokat (vö. 29. sor: rétegenkénti Loop).
- **[nyitott · 2026-10-18 · Kapcsolatok]** **Árva kapcsolat:** a projektfájlban maradt egy régi Kapcsolat, amelynek mindkét eleme hiányzik. Nem hat a képre, de betöltéskor/törléskor takarítani kellene (`st.links`).
- **[nyitott · 2026-10-17 · utófeldolgozás]** A „Filmes” lencsehiba okozta cián pontot (fényes csillanáson) headlessben nem lehetett előidézni; a javítás után a felhasználói próbán érdemes megnézni.

## Javítva

- **[javítva · 2026-10-18 · projekt/preset betöltés]** A teljes `.vel.json` projektet a Preset beillesztése ablak korábban „A válaszban nincs rétegleírás (layers)” hibával utasította el. Most projektként felismeri, és külön „Projekt megnyitása (a jelenlegit lecseréli)” gombot mutat. A vászonra ejtett projektfájl is ebbe az egyértelmű nézetbe kerül.

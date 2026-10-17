# Handoff — Látomás Stúdió — 2026-10-17 11:30
**Agent:** Claude (claude.ai, felhős munkamenet, Claude Code-alapú)
**Mérföldkő:** A feature-lista 1. mérföldköve kész. Elkészült a rugós mozgásmotor, a Bento-rács, a kinetikus tipográfia bővítése, a Vetítő-szűrő, a képkocka-ütem (posterize time), a moduláris világok és az új motion receptek. Mindez headless Chromiumban tesztelve: minden új shader lefordul, az új receptek renderelnek, a mentés és a betöltés működik.

## Jelenlegi állapot
- **Élő verzió (új link, v9):** https://claude.ai/artifact/Pz6ZmknNeR6v9vYY82kDm5 (`downloads` capability, contract 0.2.84).
  - A régi v8 artifact (https://claude.ai/artifact/QM96xf5H6BxrPTy9r5B1u3) változatlan maradt. Más szervezettől megosztott artifact volt, ezért új artifactként publikáltam.
- **Forrás:** `muchdesigner/latomas.html`, kb. 2870 sor. A v8 biztonsági másolata: `muchdesigner/latomas.v8.html`.
- **Feature-lista (a „miért” és a sorrend):** `muchdesigner/latomas-feature-lista.md`.

### Mozgásmotor
- `EASE_NAMES` / `EASE_FNS` (JS) és `easeF` (GLSL) azonos görbékkel, így a vásznon és az exportban ugyanaz az eredmény.
- A régi indexek (0–4) nem változtak. Új görbék:
  - 5: Rugó – finom
  - 6: Rugó – pattanós
  - 7: Visszalendülés
  - 8: Gumi (elastic)
  - 9: Pattogás
  - 10: Expo ki-be
  - 11: Lépcsős
- A rugó analitikus csillapított rugó: `easeSpring(x, ζ, ω)`.
- `easeJ(k, x)` a JS-oldali rövidítés.

### Bento-rács (`bento`, kind `shape`)
- Működik maszkként is.
- 11 elrendezés van a `BENTO` tömbben ([x, y, w, h] 0..1-ben).
- 8 belépés: `BENTO_ANIMS`.
- 5 sorrend: sorban, középről, véletlen, egyszerre, méret szerint.
- Átrendeződés a `layout2`-be rugóval: `morphAt`, `morphDur`.
- Bezáródás: `outAt`.
- Kitöltés: szín, üveg (az alatta lévő kép elmosva), paletta vagy csak körvonal. Kiemelt doboz, árnyék, fényél is állítható.
- A téglalapokat JS számolja (`bentoBoxes`, `bentoU`), és `uBR[9]`/`uBS[9]` uniform-tömbben adja át. Legfeljebb 9 doboz lehet.

### Kinetikus tipográfia (`mtext`)
- Új mozdulatok (7–11):
  - 7: Méret- és fókuszpop
  - 8: Kemény vágás
  - 9: Rugós ugrás
  - 10: Beúszás oldalról (maszk)
  - 11: Kibontás középről (maszk)
- Új csúszkák: `boil` és `boilfps` (kézi remegés), `stretch` (megnyúlás a sebességből), `pulse` (jelre köthető lüktetés).
- `stagger = 0` esetén „egyben” mód: az egész szöveg a közepe körül skálázódik, betű-oszlop vágás nélkül.
- Az aux-textúra mostantól 2 soros. A 2. sor a betűk bal és jobb szélét tárolja 16 biten, így a vízszintes mozdulatok a betű saját dobozára vannak maszkolva (részben javítja a korábbi „beszivárgás” hibát).

### Vetítő (`projector`, fx)
- Por és karcok, fényszivárgás (paletta), vibrálás, filmkocka-ugrálás, kameralebegés, színszél, szemcse, vignetta.
- Tónus: eredeti, szépia, fekete-fehér vagy fakó.
- Saját képkocka-ütem.

### Képkocka-ütem (posterize time)
- Rétegenként: `L.tm.fps` az Időzítés szekcióban.
- Az egész képre: `st.look.fps` a Kinézet popoverben.
- Megvalósítás: `postT()` a `renderList` és a `renderScene` elején.

### Moduláris világok
- Új darabok: `skygrad` (Égszín), `sun` (Nap, sugarakkal), `clouds` (Felhőréteg, perspektivikus vagy lapos), `terrain` (Talaj: fű, száraz fű, homok, szikla, hó), `haze` (Pára és talajköd, fx).
- Közös GLSL: `SKYLIB` (skyCol, sunTint, sunPos) és `CLOUDLIB`.
- Minden darab ugyanazt a `sunh`/`sunx`/`hz` paramétert használja, így egy makró együtt mozgatja őket.
- Új alakzat: **Dombvonal** (shape `kind 13`): `sides` = hullámok, `inner` = mag, `round` = csúcsosság.
- Világ-receptek (`cat:'world'`), mind dombvonal-maszk + `clip` talaj szerkezettel:
  - Bliss-dombok
  - Arany naplemente
  - Viharos ég
  - Éjszakai égbolt
  - Sivatag délben
  - Havas csúcsok
- A régi `sky` effekt megmaradt (régi projektek és a Véletlen generátor miatt), de a polcon már nem szerepel.
- Megszűnt a 3D polc „Bolygó” eleme és a régi „Bolygó” recept (duplikációk voltak).

### Polcok és receptek
- Polcok:
  - A Világok és a Mozgás polcon elöl állnak a hozzájuk tartozó receptek (a `RECIPES` `cat` mezője alapján), utánuk szakaszfejlécek (`{head:'…'}`, függőleges felirat) és a darabok.
  - Az `.items` sor flex lett.
- Új motion receptek:
  - Bento-bemutató
  - Bento-átrendeződés
  - The End (vintage)
  - Rugós cím
  - Alsó harmad
- Az idővonal a bento belépését, átrendeződését és bezáródását is mutatja.

## Utolsó döntések (és miért)
- **Továbbra is egy HTML.** A felhasználó kérésére a motion és a világ-bővítés megelőzte a Vite + TS szétbontást (0. fázis). A cél, hogy a már bővített mag kerüljön modulokra.
- **A világ darabjai paraméterrel osztoznak a napon** (`sunh`/`sunx`/`hz`), nem közös állapottal. Így minden darab önállóan is használható, a receptekben pedig a makró köti össze őket. A lencsefény és a fénysugarak a réteg x/y helyén vannak; a receptben a Napszak makró az `n.y`-t lineárisan a nap pályájához köti (y = hz + 0,05 + 0,55·sunh).
- **A Bento téglalapjai JS-ben számolódnak.** A rugó, a stagger és a morph logikája egyszerűbb és pontosabb így, a shader pedig csak SDF-et rajzol.
- **Az Animált szöveg indexei bővítve, nem átszámozva**, hogy a régi projektek ne változzanak.
- **A Vetítő szűrő, nem globális utófeldolgozás.** Bárhová tehető a rétegsorba, és a kameralebegés csak az alatta lévő képet mozgatja.

## Nyitott kérdések / ismert hibák
- Valódi GPU-n és valódi betűtípusokkal nem teszteltük. A headless teszt SwiftShaderrel, Google Fonts nélkül futott, ezért a képernyőképeken serif tartalék betű látszik.
- Felhasználói visszajelzés kell:
  - a Bento-rács és a rugógörbék „érzetéről” (merevség és csillapítás csak két előbeállításban van, nincs csúszka),
  - a világ-receptek kinézetéről.
- A Sivatag délben dűnéi kevéssé válnak el egymástól.
- A Viharos ég felső része egyszínű borult.
- Az `mtext` továbbra is egysoros. A betűnkénti nagyítás (Pattanás, Méret- és fókuszpop stagger > 0 esetén) az oszlopon túl levágódhat vagy szomszéd betűt hozhat be. Egyben módban (stagger = 0) ez nem fordul elő.
- A szöveg a dobozban középre igazított (nincs balra zárás). Az Alsó harmad emiatt középre rakja a nevet.
- Egyszer, nem reprodukálhatóan megjelent egy `Shader: particles` figyelmeztetés a konzolban (üres kódú particles program fordítása). Hatása nincs, de érdemes megnézni, ki hívja a `getProg`-ot `particles` rétegre.
- A hangsávos MP4-export továbbra sincs élesben kipróbálva (lásd az előző handoffot).

## Következő lépés
1. **Felhasználói teszt** a v9-en: Bento, rugós szöveg, Vetítő, világ-receptek. A visszajelzések alapján hangolás.
2. **2. mérföldkő** (lásd a feature-listát):
   - C7: kulcskocka- és görbeszerkesztő bármely paraméterre (rugóparaméter-csúszkákkal),
   - C8: forma-morph átmenetek és átrepülés,
   - B1: 3D láthatóság (a szerkeszthető 3D jelenet a polc élén, első használati tipp, kiemelt O eszköz),
   - A4: bolygó szétbontása,
   - balra zárt, többsoros szöveg.
3. Utána a 0. fázis: Vite + TS szétbontás, a `run2.py` CI-be.

## Érintett fájlok
- `muchdesigner/latomas.html` (módosítva). Új szekciók és jelölők:
  - `SKYLIB`, `CLOUDLIB`, `BENTO`, `BENTO_ANIMS` az `EFFECTS` előtt,
  - `/* ---------- world building blocks ---------- */`,
  - `/* ---------- motion design ---------- */`,
  - a Rendering szekcióban `/* ----- Bento grid … */` (`bentoRects`, `bentoBoxes`, `bentoU`),
  - `easeSpringJ`, `EASE_FNS`, `easeJ` az `EASES` helyén,
  - `postT`, `FPS_OPTS`, `fpsObj`.
- `muchdesigner/latomas.v8.html`: az előző verzió.
- `muchdesigner/latomas-feature-lista.md`: a teljes feature-lista és ütemezés.
- Teszt: `run2.py` változatlan. A vászonról készülő képernyőképhez a `run2.py`-ban a `pg.screenshot` helyett `(await pg.query_selector("#cv")).screenshot(...)` kell. Az összes shader egyszerre fordítása SwiftShaderrel több mint 5 percig tart, ezért a 3D effekteket (`obj3d`, `sdfscene`, `gyroid`) külön érdemes tesztelni.

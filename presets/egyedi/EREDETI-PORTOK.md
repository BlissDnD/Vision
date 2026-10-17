# Két CodePen-effekt átültetése a Velbe

## Liquid Glass — használható port

Forrás: https://codepen.io/shingidad/pen/jEPxMgW . A `liquid-glass-eredeti-port.json` az eredeti fragment shader kerekített doboz-maszkját, lencsekoordinátáját, 9×9-es mintavételét és fénygradiensét használja. A bemeneti `iChannel0` helyén a Velben az alatta lévő rétegek képe (`IN`) van; az egér helyén a réteg pozíciója. A „Méret” és az elmosás két hozzáadott Vel-vezérlő. Ez egy **szerkeszthető Vel-port**, nem az eredeti CodePen futtatókörnyezetének változtatás nélküli beágyazása.

**Azonnali próba:** Nyisd meg a Velben a `liquid-glass-eredeti-demo.vel.json` fájlt a Projekt → Mentés és megnyitás… menüből. A fotó már benne van a projektben. A shader önálló rétegként olvassa az alatta lévő képet; új fotót vagy videót is tehetsz alá. A sima `liquid-glass-eredeti-port.json` fájl külön presetként importálható.

A mintafotó: https://www.pexels.com/photo/tree-on-body-of-water-268533/ , a CodePenben használt Pexels-kép. Pexels-licenc: https://www.pexels.com/license/ .

**Teljesítmény:** az eredeti shader a lencsén belüli pixeleken 81 textúramintát vesz. A 4K, többvideós használat sebességét ez a próba **nem** igazolja; ehhez külön GPU-mérés és minőségi szintek kellenek. Az „Üveg elmosása” 0-ra állítva a 9×9 eredményt vizuálisan kikapcsolja, de a jelenlegi kódban a mintavétel költsége még megmarad.

## Flame in the wind — eredeti textúrával futó port

Forrás: https://codepen.io/osublake/pen/pqNXoq . A CodePen az eredeti shader szerzőjeként `@kuvkar` Shadertoy-munkáját jelöli: https://www.shadertoy.com/view/4tXXRn . A `lang-eredeti-demo.vel.json` megnyitható Vel-projektként. Beágyazva tartalmazza a CodePen 128×128-as zajképét, és a shader az eredeti három textúramintát használja. A korábbi saját utánzatokat eltávolítottam. A koordináta-, alfa- és utófeldolgozási különbségek miatt még **nem pixelazonos**, és a képen egy vékony függőleges műtermék látszik a lángban.

Ehhez a Vel `mediaFor()` függvénye most a saját shader `asset` mezőjét is a `uImage` bemenetre köti. Ez a projektfájlban működik; a külső preset-import még nem enged képbemenetet hozzárendelni, ezért itt a **teljes `.vel.json` projektet** kell megnyitni. A Shadertoy-eredetű shader felhasználási feltételeit továbbra is tisztázni kell; ezt ne tekintsd kereskedelmi felhasználásra jóváhagyott effektnek.

CodePen a nyilvános Penekre MIT-feltételeket ír, de a Penben felhasznált külső művek ettől eltérő jogokkal bírhatnak: https://blog.codepen.io/docs/pens/licensing/ . A Liquid Glass forrásának megjelölését a port shaderkódja is tartalmazza.

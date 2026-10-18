# Külön layoutműhely – Claude átadó

Állapot: **demonstrálva, főalkalmazásba nem integrált prototípus**. A korábbi 63 modul mellé került két külön adapter, nem új Vel-funkció.

Futtatás: a bővítménylaborban `npm run build`, majd `npm run preview`; a `/layouts.html` oldalt nyisd meg. A kezdőlapon is van hozzá link.

## Unwoven

- Forrás: [Clément Grellier / Unwoven](https://github.com/clementgrellier/unwoven), helyi snapshot `docs/referenciak/forras/unwoven`, commit `32c4bfc`.
- A `vendor/unwoven-original.mjs` shaderjei és szalaggeometriája változtatás nélkül az eredetiből származnak. MIT licenc és szerzőmegjelölés a szomszédos `LICENSE.md`-ben. A hat mintakép ugyanebből a repóból származik; külön képlicenc nincs a snapshotban, ezért termékbe emelés előtt saját képekre cserélendők vagy jogtisztázás szükséges.
- Megmaradt: eredeti szálankénti véletlen, flutter, árnyalás, csillanás, kifakulás, cover képkivágás és lekerekített sziluett. Alapértékek az eredeti CONFIG szerint; fehér háttér.
- Új vezérlés: 14 numerikus paraméter + háttér, képcsere, húzható képsor, beállítás-JSON mentés/betöltés, közvetlen `seek(seconds)` és `dispose()`.
- A GSAP kikerült: a beúszó sebesség analitikus integrálja és az eredeti ease képletei adnak képkockasorrendtől független állapotot. Nem használ saját animációs órát az adapter.
- Eltérések: nincs lendületes elengedés; a húzás menthető eltolást állít. Modern Three.js-t használ, az eredeti r128 helyett. A teljes eredeti demóval pixelpontos összehasonlítást nem végeztünk; a visszatekerés az adapteren belül pixelpontosan azonos.

## WIDE – őszinte státusz

Referencia: [BL/S® Studio – WIDE, Animated Fashion Magazine Grid Layout](https://codepen.io/editor/blacklead-studio/pen/01a0d773-dab5-744d-bc5e-3f11d4f2262e).

**Ez saját elrendezéstanulmány, nem az eredeti kód átemelése és nem az eredeti mozgás hű portja.** Az előnézetet megvizsgáltuk, de a forrás közvetlen lekérése 403-at adott, a CodePen ZIP-exportja sem adott letölthető fájlt. Az eredeti CSS/JS, fotók és Switzer font nincsenek beépítve. Az eredeti teljes látványának és átmeneteinek megőrzése ezért nyitott feladat; a CodePenből exportált ZIP birtokában folytatható.

A külön saját adapter öt képelrendezést, cserélhető képeket, főcímet, alcímet, szöveget, margót, térközt, címméretet és időből számolt beúszást ad. Hosszú szöveget és a kompozíciókhoz tartozó szöveghelyeket még kézzel kell tördelni; az öt képelrendezés ugyanazokat a szövegdobozokat használja. Nem állítjuk, hogy ez eléri az eredeti preset vizuális minőségét.

## Adapterhatár és korlátok

`createUnwoven(host, options, images?)` aszinkron; `createWide(host, options, images?)` szinkron. Visszatérés: `seek`, `setOptions`, `setImages`, `serialize`, `dispose`; Unwoven ezen felül `resize`.

- `normalize` korlátozza az importált numerikus értékeket. Nincsen új futtatott kód a JSON-ban. A szövegek `textContent`-tel kerülnek a felületre.
- A JSON **beállításokat** ment, képfájlokat nem. A fájlválasztó képei ideiglenes objektum-URL-ek; új munkamenetben újra ki kell választani őket. Vel-integrációhoz tartós médiatárolás kell.
- A műhely lejátszása csak a műhely órája. Velben a `seek`-et a Vel órája hívja.
- Az Unwoven külön Three.js vászon; a WIDE DOM/CSS. Vel WebGL2-render/export számára külön textúra-/rétegadapter szükséges. A DOM-oldal önmagában nem kész videóexport.
- Nincs 4K- vagy valódi GPU-teljesítménymérés. WebGL nélkül hibaüzenet jelenik meg, nincs automatikus CSS-fallback. A lejátszás alapból áll, ezért reduced-motion mellett sem indul magától.
- A fő alkalmazás forrása és buildje nem változott.

## Próba és ellenőrzés

1. Nyisd meg a Layoutműhelyt; tekerd előre-hátra az időt, állítsd a szétbomlást és a szalagszámot.
2. Válassz saját képeket, húzd a képsort; ments és tölts vissza beállítást.
3. Válts WIDE-tanulmányra; próbáld az öt kompozíciót és a szövegmezőket.

48/48 Node-teszt és sikeres build. A külön `tests/layout_smoke.py` 7/7 böngészős próbája: pixelazonos visszatekerés, geometria újraépítése, képcsere, JSON-visszatöltés, öt kompozíció, címszerkesztés, mobil nézet vízszintes túlcsordulás nélkül. Eredmény: `browser-report.json`; képek: `unwoven-preview.png`, `wide-study-preview.png`, `mobile-preview.png`.

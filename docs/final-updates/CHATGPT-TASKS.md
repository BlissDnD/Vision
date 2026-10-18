# Feladatok ChatGPT-nek (előkészítés, hogy Claude-nak kevesebb tokenje fogyjon)

Ezek **szöveges/kutatási** feladatok, kódot nem kell írni. Az eredményt egy `.md` fájlban add vissza, és tedd a `docs/final-updates/` mappába (a fájlnév a feladat címe legyen). Másold be a repóból a megadott fájlt a ChatGPT-nek.

## 1. Angol szövegek (recept- és panelszövegek)
- Bemenet: `app/src/recipes.ts` és `app/src/library.ts` magyar leírásai.
- Feladat: táblázat `régi magyar szöveg | angol szöveg`. Rövid, egyszerű UI-angol. Szószedet: `docs/spec/VEL-ENGLISH-DEFAULT-LOCALIZATION.md` „Terminology” táblája (Layer, Source, Appearance, Motion, Recipe…). Ne fordítsd az azonosítókat (kulcsokat), csak a megjelenő szöveget.
- Eredmény: `RECIPES-EN.md`. (Ugyanígy külön fájlban: `motion.ts`, `choreo.ts`, `xfer.ts`, `random.ts`, `variantsui.ts`.)

## 2. Tooltip-szövegek a dinamikus vezérlőkhöz
- Bemenet: az `app/src/controls.ts`, `timeline.ts`, `moui.ts`, `scenes.ts`, `shelf.ts` vezérlőfeliratai; minta: `app/src/helptooltips.ts`.
- Feladat: minden vezérlőhöz egy mondatos angol tooltip („mit csinál”). Formátum: `azonosító javaslat | cím | egy mondat`.
- Eredmény: `TOOLTIPS-NEW.md`.

## 3. Ikon-javaslatok
- Bemenet: `docs/final-updates/UI-UPDATE.md` (0. és 6. szakasz).
- Feladat: minden Vel-kategóriához és gyakori vezérlőhöz (Tempó, Erő, Szórás, Ritmus, Loop, Blend mode, Maszk, Fény, Shapes 2D/3D, Szöveg, Média, Effekt, Shader…) ikonjavaslat a **Web Awesome beépített ikonkészletéből** (Font Awesome nevek), kategóriaszínnel (pl. effektek = kék).
- Eredmény: `ICONS.md` (táblázat: név | ikon neve | szín).

## 4. Web Awesome ellenőrzés
- Feladat: https://webawesome.com/ alapján: mi ingyenes és mi Pro? Hogyan témázható (CSS változók)? Mekkora a csomag, ha egyetlen HTML-be ágyazzuk? Működik-e `file://` alól? Kiváló-e: görbeszerkesztő, kör alakú irányválasztó (van-e kész komponens)?
- Eredmény: `WEB-AWESOME-NOTES.md` (max 1 oldal, linkekkel).

## 5. Maszkolás és anyagszerkesztő minták
- Feladat: hogyan oldja meg a maszkolást és a blending/overlay beállítást a Figma, After Effects, Photoshop, Procreate, Blender (shader node) — 5-5 mondat, mi a legkönnyebben használható ötlet?
- Eredmény: `MASK-AND-MATERIAL-REFERENCES.md`.

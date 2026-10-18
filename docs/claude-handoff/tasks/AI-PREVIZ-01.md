# AI-PREVIZ-01 — Későbbi filmes vázlatmód AI-kép/videógenerátorhoz

**Állapot:** későbbi nagy fejlesztés; nincs elindítva vagy implementációra jóváhagyva. A felhasználói cél rögzítve.

## Első használható szelet

Felvételkártyák, egyszerű helyettesítők, kamera/időpont és jegyzet; tiszta PNG/storyboard/kezdet-vég csomag. Később közös 3D blockout, animatik és támogatott passzok.

## Olvasás

- [JOVO-3D-SCENE-ES-AI-VAZLAT.md](../JOVO-3D-SCENE-ES-AI-VAZLAT.md)
- [ELLENORZES-ES-ATADAS.md](../ELLENORZES-ES-ATADAS.md)

## Függőségek és képességkapuk

BASE-01.
- SCENE-01: Valódi közös 3D blockout/kameratér kell; a 2D/2,5D shot-PNG első szelet nélküle is készülhet.
- EXPORT-01: Nagy jelenetes videó/animatik memória vagy abort-kezelése indokolja.
- Depth/normal/object-ID export csak ha a kiválasztott renderút ezt ténylegesen adja.

## Kódban célzottan

`app/src/scenes.ts`, `app/src/state.ts`, `app/src/output.ts`, `app/src/timeline.ts`, `app/src/render.ts`.

## Agentek és írási határ

A a nagy implementációt viszi. B: shot-/prompt-/manifest sablon. C: frame, overlay és passzkonzisztencia teszt. A közös render/state/UI fájloknak egyetlen írójuk van.

## Készfeltétel

Ugyanaz a jelenet színes/szürke nézetben; shot mentés/újranyitás; exportban overlay nincs; kimenetek képmérete/vetítése/ideje egyezik; felvételjegyzet szerkeszthető.

## Határ

Nem automatikus AI-szolgáltatói integráció, nem garantált generálási hűség; elsőben nincs teljes karakterrig.

A kreatív közvetlen interakció, alacsony UI-zaj és vizuális minőség minden szeletre érvényes. Saját jobb megoldás megengedett a cél megőrzésével; előbb konkrét szeletjavaslat és jóváhagyás, majd implementáció.

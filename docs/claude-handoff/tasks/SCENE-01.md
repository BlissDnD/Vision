# SCENE-01 — Későbbi fő irány: intuitív artisztikus 3D tájtervező

**Állapot:** későbbi nagy fejlesztés; nincs elindítva vagy implementációra jóváhagyva. A felhasználói cél rögzítve.

## Első használható szelet

Egy közös térben terep és néhány asset; direkt felületre helyezés, egységes kamera/fény, kurált hangulat, kevés UI. Először kis primitíves térkísérlet, utána egy használható tájcsalád.

## Olvasás

- [JOVO-3D-SCENE-ES-AI-VAZLAT.md](../JOVO-3D-SCENE-ES-AI-VAZLAT.md)
- [ARCHITEKTURA-ES-SZERZODESEK.md](../ARCHITEKTURA-ES-SZERZODESEK.md)

## Függőségek és képességkapuk

BASE-01, BASE-02.
- MEDIA-01: Külső GLB assetes szeletnél tényleges tartós modellimport kell; primitíves kísérletnél nem.
- A közös 3D kamera/fény/mélység bizonyítása az assetelhelyezési mérföldkő előtt; külön rétegkamerák nem teljesítik.

## Kódban célzottan

`app/src/mesh3d.ts`, `app/src/terrain3d.ts`, `app/src/render.ts`, `app/src/lightui.ts`, `app/src/state.ts`.

## Agentek és írási határ

A a nagy implementációt viszi. B: kurált kis asset/fénypreset adat. C: talaj, mélység, kamera és újranyitás teszt. A közös render/state/UI fájloknak egyetlen írójuk van.

## Készfeltétel

Közös mélység/takarás és kamera; talajra húzás; kézi fény/kamera zárolható; egy undo, mentés, export; minőségi referencia és felhasználói építési próba.

## Határ

Nem teljes DCC/modellező és nem minden világcsalád egyszerre.

A kreatív közvetlen interakció, alacsony UI-zaj és vizuális minőség minden szeletre érvényes. Saját jobb megoldás megengedett a cél megőrzésével; előbb konkrét szeletjavaslat és jóváhagyás, majd implementáció.

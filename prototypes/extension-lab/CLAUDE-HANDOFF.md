# Claude – 63 elkülönített bővítmény átvétele

**Kérés:** Miksa mindkét kutatási listához külön kódot kért; a beépítendő elemeket később Claude választja ki. Ez a csomag ezt készíti elő, nem indít el főalkalmazás-integrációt.

## Mit nézz először?

1. `README.md`: futtatás, korlátok, a fő alkalmazástól való elkülönítés.
2. `CATALOG.md`: mind a 63 elem kódja, API-ja, külön példája, licence és függősége.
3. A kiválasztott `modules/NN-*.mjs` és `examples/NN-*.mjs` párosa.
4. `browser-report.json` és `tests/core.test.mjs`: mit ellenőriztünk ténylegesen.

A 01–41 számozás az új 41-es katalógust követi. A 42–63 az első gyűjtés további elemei. A Three.js-es részek jelenleg **saját, külön Three.js-hostban** futnak. Nem szabad azt feltételezni, hogy a labor Texture/RenderTarget objektuma közvetlenül használható a Vel saját WebGL2-kompozitorában.

## Beemelési szerződés

- A Vel szabályai szerint külön szeletjavaslat kell a termékbe emeléshez. A felhasználó most a külön kódot hagyta jóvá, a 63 elem automatikus termékbe emelését nem.
- Válassz egy modult; csak a szükséges függőségét emeld be. A teljes lab package.json másolása indokolatlan.
- A projektállapot maradjon tiszta JSON-leírás. Mesh, material, worker, audio node, engine world és texture csak futásidejű objektum legyen.
- Minden bekerülő assethez tulajdonos, tartós tárolás, fájlméret-/memóriakeret, újranyitás és `dispose()` út kell.
- A Vel órája vezéreljen. Saját rAF/AudioClock vagy damping nem kerülhet észrevétlenül a projektidő helyére.
- Az input/csúszka módosítása a meglévő undo/commit útba menjen, egy gesztus egy visszavonás legyen.
- Több fizikai motor vagy több emitterengine közül egyet válassz. A párhuzamos alternatívák nem egymástól függő funkciók.
- A `shared/gallery-host.mjs` csak bemutatóhost. A Velhez külön renderadapter, réteg- és effektút szükséges.

## Eltérések a kutatási forrásoktól

- Coloris az `@melloware/coloris` NPM-csomagból érkezik; a MIT upstreamhez külön NPM-csomagoló tartozik. Pontos verzió a lockban.
- Ashima 3D simplex forrás a `glsl-noise` csomagból célzottan bekerült a `vendor/` mappába, a licenc megőrizve.
- A Three.js Water forrás helyi változata csak explicit erőforrás-felszabadítást kapott; eredeti licenc megőrizve.
- A folyadéksolver saját, kisebb implementáció. Nem másoltuk be Pavel demójának teljes UI-ját/kódját.
- A város saját helyettesítő geometriával fut; nincs Kenney épület vagy egyéb külső artwork a repóban.
- A Poly Haven/ambientCG adapterek nem teljes online katalógusok, helyi kép-/PBR-intake példák.

## Ajánlott kiválasztási sorrend

Kisebb, független szelet: színátmenet (19), panelállítás (39), toolbar-rendezés (38), pályaillesztés (58), assetatlasz (40/41/44).

Közös 3D alap után: SVG/font/extrude (8/9/4), matrica (3), görbére hajlítás (5), kamera (21), felületre szórás (7), HDRI/üveg (16/42/48).

Külön nagy mérföldkő: fizika (24 vagy 55), részecskeengine (23 vagy 49), folyadék (50), stream export (56).

## Ellenőrzési státusz

A számszerű végső eredményeket lásd `VALIDATION.md`. A headless bootstrap csak a példák betöltését és alap időállítását ellenőrzi; nem minden gombot, fájlformátumot vagy eszköztípust. Külön célzott ellenőrzés van a fluid képi visszatekerésére, az atlasz hordozhatóságára és az MP4-re.

Főalkalmazás-tesztek nem futottak: a csomag nem módosítja az appot. A fő fejlesztésben meglévő idegen változásokat nem vettem át ebbe a csomagba.

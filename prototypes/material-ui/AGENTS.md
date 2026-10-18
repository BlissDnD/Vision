# Material UI starter — agent belépési pont

Előbb a Vel `CLAUDE.md` és `HANDOFF.md`, majd ez a fájl és `README.md` olvasandó. A felhasználó ezt alapcsomagnak kérte; a véglegesítést Claude-ban végzi. A fő appba integrálás nem történt meg.

## Elsőként ezt használd
- `src/tokens.css`: közös témaszerepek. Ne adj új hex színeket az egyedi komponensekhez; új szerepet itt vezess be.
- `src/components.css`: közös UI-megjelenés és állapotok.
- `src/controls.ts`: natív DOM-komponensek, típusos API. Ne másold őket az inspectorokba.
- `src/icons.ts`: hivatalos, beágyazott Material Symbols, stabil Vel-fogalomnevekkel. Ikoncsere itt történjen.
- `src/demo.ts`: működő összerakási példák. Kizárólag demo, ne importáld az appba.

## Állapotkezelési szerződés
`parameter`, `toggle`, `choice`, `direction`, `curve` visszatérési értéke `{element, setValue, setDisabled}`.
- `setValue` csak megjelenít, sem preview-, sem commit-callbacket nem hív. Inspector megnyitásakor nem módosít projektet.
- `onInput(value)` előnézeti érték, `onCommit(value)` gesztusvégi jelzés. A Vel-adapternek kell meghatároznia a valódi tranzakciót, undo-pillanatképet és mentést; a starter nem oldja ezt meg helyetted.
- Ne köss minden `onInput` eseményre automatikus mentést vagy új undo-bejegyzést.
- Eltávolított panel csomópontjai eldobhatók. `installTooltips` visszaadja a kötelezően hívandó cleanup függvényt; a felület teljes életciklusában egyszer telepítsd.
- A dial és a görbe pointercancelkor visszaállítja az adott gesztus előtti előnézetet.

## Határok
- Material 3 ihletésű saját asztali megvalósítás, nem a teljes hivatalos Material Web készlet.
- A görbe normalizált 0–1 mintapontokat ad. A Smooth szomszédos értékeket átlagol; a megjelenítés köbös szegmensekkel történik. Nincs Bézier-fogantyú, pontkijelölés vagy Vel-keyframe bekötés; teljes billentyűzetes pontszerkesztés hátra van.
- Az irány 0° = fent, 90° = jobbra, óramutató szerint. A Vel szélparaméterének egységét/irányát az adapter alakítsa át.
- A minigörbe-ritmusok jelképes demo-presetek, nem motion algoritmusok.
- Színforrás-sorrend, interpoláció, minőség és mozgásmód a demóban csak kiválasztás/callback; nem rendererfunkció.
- Az új komponenseknél be kell tartani a címkézés, fókusz, tiltott állapot, keskeny elrendezés és témaváltás mintáját. Ikon ne legyen az egyetlen jelentéshordozó.

## Munka közben
`node build.mjs` építi a megnyitható `index.html`-t a közös forrásokból. Ne szerkeszd kézzel a generált HTML-t.
Typecheck: `../../app/node_modules/.bin/tsc -p tsconfig.json`.
Célzott próba: `../../app/.venv/bin/python check.py` (Playwright Chromium szükséges).
A felhasználói látványpróbát a felhasználó végzi; ne minősítsd véglegesnek automatikus teszt alapján.

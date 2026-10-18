# Vel – külön bővítménylabor

**63 önálló prototípus és 63 külön használati példa**, mindkét korábbi katalógushoz. A Vel fő forrásától és buildjétől független csomag. Belépő Claude számára: **[CLAUDE-HANDOFF.md](CLAUDE-HANDOFF.md)**. Tételes kód/API/függőség/licenc: **[CATALOG.md](CATALOG.md)**.

## Kipróbálás

A csomag mappájában:

```sh
npm ci --ignore-scripts
npm run check
npm run preview
```

1. Nyisd meg a kiírt helyi címet, és válassz a 63 elem közül.
2. A jelenetidő csúszkájával próbáld az előre/hátra lépést; mozgó példánál indíts lejátszást.
3. A fájlos példáknál válassz helyi képet/GLB-t; az export és a metronóm külön gombbal indul.
4. Válts másik modulra vagy nyomj Újraindítást. A labor saját példajeleneteit használja.

A WebGL Lint külön próbafülön indul, mert a kontextus létrehozása előtt kell betölteni. Böngészős GPU-, hang- és fájlírási támogatás szükséges. Az MP4-próba közvetlen fájlírása File System Access-t igényel.

## Mappák

- `modules/01-…63-*.mjs`: önálló függvények és adapterek. Nincs import a Vel `app/` mappájából.
- `examples/`: modulonként külön futtatható példa, a kis laborhosttal.
- `shared/`: helyi assetbeágyazás, atlasz, böngészős inputok és külön Three.js-host.
- `manifest.json`, `registry.mjs`: a labor katalógusa és lusta betöltése; nem Vel-regisztráció.
- `tests/`: számítási, geometriai, fizikai és headless böngészős ellenőrzések.
- `vendor/`: két célzottan megőrzött külső forrás, eredeti licenccel.
- `fixtures/`: saját készítésű, minimális V/E/L tesztfont; nem teljes tipográfiai font.
- `licenses/`, `THIRD-PARTY.md`, `package-lock.json`: licencek és rögzített verziók.
- `dist/`: generált böngészős csomag; újraépíthető, gitben nincs tárolva.

## Mit jelent itt a kész kód?

A modulok tényleges könyvtárhívásokat vagy önálló algoritmust tartalmaznak. A geometriai, szín-, fizikai és fájlkezelési részek tesztelhetők; a 3D/DOM példák a laborban futnak. **Ez nem kész Vel-integráció.** Nincs hozzáadva fő import, könyvtári elem, inspector, projektmigráció vagy termékverzió.

Több tétel egy nagyobb funkció építőeleme: például a LUT loader mellé alkalmazó shader, az SSAO mellé közös 3D mélység, a modellszóráshoz emitter/viselkedés kell. Ezeket a katalógus és a modulok `requirements` mezői jelzik.

## Lényeges korlátok

- A 49-es Quarks példa előre futó rendszer; seedelt visszatekerés nincs megvalósítva. A Nebula, Cannon és Rapier példáknál újraszimulálás van.
- Az 50-es folyadék saját, kísérleti 2D solver. Nem Pavel teljes alkalmazásának portja, nem 3D folyadék. Bemeneti eseményekből fix lépésben újrajátssza a festékmezőt.
- Az 51-es víznél saját, egyszerű normal-textúra van; részletes hullámképhez másik licencelt textúra kell. A Three.js Water másolata egy `dispose()` kiegészítést kapott.
- A 40–44-es assetmodulok helyi fájlokat fogadnak; a Kenney/Poly Haven/ambientCG teljes katalógusát és képeit nem csomagoltuk be. Az 52-es városban saját dobozházak mutatják a seedelt elrendezést, a Kenney modellek később cserélhetők be.
- A 45-ös szöveg alapfontja csak V/E/L és szóköz karaktert tartalmaz. Más szöveghez saját, megfelelően licencelt fontURL kell; a Troika külső Unicode-fallbackját termékbe emelés előtt rendezni kell.
- Az 56-os export csak videó; hangmuxolás nincs. A stream byte-pozíciókat ír, nem egyszerűen összefűzi a darabokat. Megszakításkor a célírót abortálja.
- A Coloris globális picker-elemet is használ. A labor leválasztja a saját eseményeit, de több alkalmazásba ágyazva a közös picker élettartamát a hostnak kell kezelnie.
- A 2D DOM-fogantyúk nem a WebGL-réteg koordinátarendszerében működnek; a Velhez külön adapter kell.
- A tesztek nem igazolnak esztétikai minőséget, teljes akadálymentességet vagy valódi M1 Max/4K teljesítményt. Manuális látványpróba hátra van.

## Ellenőrzés

```sh
npm test
npm run build
# A meglévő Vel tesztkörnyezetével, a labor mappájából:
../../app/.venv/bin/python tests/browser_smoke.py
```

A headless próba csak ideiglenes helyi kiszolgálót és külön, láthatatlan Chromiumot használ. Nem nyúl a felhasználó böngészőjéhez. Eredmény: `browser-report.json`. A számítási teszt eredménye és a headless ellenőrzés pontos hatóköre az átadóban szerepel.

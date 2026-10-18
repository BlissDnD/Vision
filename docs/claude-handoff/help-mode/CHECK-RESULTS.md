# Help mód — ellenőrzési eredmények

2026-10-18, Codex. Alap: az ellenőrzéskor aktuális 0.48.0-m10a Vel; saját termékverzió-emelés nem történt.

| Ellenőrzés | Eredmény |
|---|---|
| TypeScript: `npm run typecheck` | Hibamentes |
| Test build: `node scripts/build.mjs --test --dev` | Sikeres |
| Normál build: `npm run build` | Sikeres; `app/dist/index.html` frissült, a generált CODEMAP 113 modult mutat |
| Célzott `tests/help_mode.js`, 1400 × 900 | 27/27 ellenőrzés zöld, üres `bad` lista |
| Célzott teszt, 600 × 800 | 27/27 ellenőrzés zöld, üres `bad` lista |
| Teljes regressziós kör: `tests/run_all.py` | 57/57 tesztfájl zöld; `all tests passed`, exit 0 |
| Diff formai ellenőrzés | `git diff --check` hibamentes |
| Kézi látvány-/érintőkijelző-/képernyőolvasó-próba | Nem történt; felhasználói próba hátra |

A célzott teszt valódi DOM-eseményekkel ellenőrzi a hover/rögzítés/fogalomút/ciklus/Escape/F1/fókusz állapotokat, modalelhelyezést, egyszeri érintéses pointer-start elnyomást, a normál kattintás visszaállását és a projekt JSON változatlanságát. Ez automatizált headless funkcionális próba, nem ember által igazolt látványminőség vagy valódi eszközös touch-ellenőrzés.

A keskeny teszt ugyanazt a `tests/run.py` futtatót és a `help_mode.js` fájlt használta, kizárólag a tesztböngésző ablakméretét cserélve 600 × 800-ra egy ideiglenes futtatópéldányban. A normál futtató forrása változatlan.

A sandbox először megakadályozta a Chromium helyi indulását; az engedélyezett elkülönített headless futtatás sikerült. A SwiftShader néhány ReadPixels teljesítményfigyelmeztetést adott; ez nem teszthiba. A felhasználó nyitott Vel-böngészőjét nem használtam.

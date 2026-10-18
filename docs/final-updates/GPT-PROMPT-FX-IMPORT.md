# Prompt a ChatGPT-nek: effektcsomag-import megírása

Másold be a lenti blokkot a ChatGPT-be (a GitHub-összekötővel, a `BlissDnD/Vision` repóval). Ha nem tud ágra írni, kérd, hogy a fájlokat egyenként, teljes tartalommal adja vissza.

```text
Feladat: írd meg a Vel nevű WebGL2 motion editorban az "effect pack import" funkciót. Repo: github.com/BlissDnD/Vision, ág: master. Válaszolj magyarul, egyszerűen; kód, azonosítók, kommentek, commit üzenetek angolul.

KONTEXTUS
- Az app: app/ mappa, TypeScript, esbuild, egyetlen HTML-be fordul. Olvasd: CLAUDE.md, HANDOFF.md, app/CODEMAP.md, docs/final-updates/MILESTONE-FX-IMPORT.md (EZ A TERV, a felhasználó jóváhagyta, ezt valósítsd meg, ne bővítsd), docs/final-updates/PRESET-KESZLET.md, docs/VEL-PRESET-FORMATUM.md.
- Minták a meglévő kódban: app/src/effects/index.ts (EFFECTS regisztráció, paramsOf, custom réteg L.cp), app/src/presetfmt.ts (shaderContract, specBody), app/src/presets.ts (checkPreset, extractJSON, shaderErrors, measureCost, pasteModal), app/src/userlib.ts (tartós tár, IndexedDB), app/src/cost.ts (COST), app/src/types.ts (EffectDef), app/src/migrate.ts + app/src/state.ts (projektformátum). Egy meglévő, egyszerű effekt példának: app/src/effects/filters.ts vagy generators.ts.

AMIT MEGÍRSZ
1. app/src/fxpack.ts: az `fxpack` formátum (lásd a tervet): validálás (egyedi kulcs `x_<csomag>_<kulcs>`, nem ütközhet beépítettel, paraméterlimit, kódméret ≤ CODE_MAX, GLSL fordítási próba a meglévő `getProg`/`shaderErrors` útján, költségbecslés), regisztráció futásidőben az EFFECTS + COST táblákba, az effekt tulajdonságai (kind, name, desc, params, code) a meglévő EffectDef alakban. CSAK adat és GLSL; soha JavaScript-futtatás a csomagból.
2. Tartósság: userlib.ts mintájára tár (`kind:'fxpack'`), a projektfájl `st.fxdefs` mezőbe menti a használt definíciókat, megnyitáskor regisztrálja (migrate.ts-ben alapérték, régi projektek érintetlenek).
3. UI: Project menü → "Import effect pack…" (fájl + ellenőrző jelentés: hány effekt/preset, shader OK, költség; hibánál semmi nem töltődik be és "Copy fix request for ChatGPT" gomb), "Export effect pack". A felület angol; a szövegek a meglévő locale/copy mintán mennek.
4. Prompt-generálás kódból (presetfmt.ts mintájára): az fxpack formátum + szabályzat + egy példa; a build írja docs/VEL-FXPACK-FORMATUM.md-be (nézd meg a scripts/build.mjs-ben, hogyan készül a VEL-PRESET-FORMATUM.md).
5. Egy példacsomag: docs/final-updates/examples/example.velfx.json (2 effekt: egy generátor, egy szűrő, saját csúszkákkal, helyes GLSL a shaderContract szerint).
6. Teszt: app/tests/fx_import.js a meglévő tesztek mintájára (window.__L kontextus, `bad` lista, minta: app/tests/p1_presets.js): érvényes csomag betölt; hibás shader elutasít; ütköző kulcs elutasít; mentés–újranyitás után megvan; régi projekt megnyílik. Futtatás: `cd app && npm run typecheck && node scripts/build.mjs --test --dev && .venv/bin/python tests/run.py dist/latomas.test.html tests/fx_import.js`.

SZABÁLYOK
- Új ágra dolgozz: `gpt/fx-import`, ne a masterre. Nyiss PR-t, ha tudsz; ha nem, add vissza a módosított/új fájlokat egyenként teljes tartalommal.
- Ne nyúlj olyan fájlhoz, ami nem kell hozzá. Kis, célzott módosítások a meglévő fájlokban (effects/index.ts, userlib.ts, state.ts, migrate.ts, main.ts, locale/copy, menü); a többi új fájl.
- Nem módosíthatsz csendben projektet, azonosítókat, mentett formátumot; régi projektek ugyanúgy nyíljanak.
- Importsorrend a main.ts-ben számít (a modul felső szintje csak az előtte importáltat használhatja).
- Ha nem tudsz tesztet futtatni, írd meg a tesztet, és jelezd, hogy futtatás nélkül adod át; ne állítsd, hogy lefutott.
- Ne bővítsd a hatókört (nincs JS-effekt, részecske, textúra, 3D, többmenetes render, effektbolt).

ÁTADÁS (csak ennyit írj vissza)
Ág/PR neve, érintett fájlok listája, mit futtattál és mi lett az eredmény (vagy: nem futtattam), ismert korlátok. A Claude futtatja a teljes tesztkört és fésüli a masterbe.
```

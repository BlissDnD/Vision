# FX-IMPORT: teljes értékű új effekt és shader importálása (mérföldkő-terv)

Állapot: **jóváhagyva a felhasználó által (2026-10-18, chat: „először az importokat csinálja meg")**, kód még nincs. Prioritás: sürgős, a WA2/WA3 (Könyvtár) előtt vagy azzal együtt.

## Mit tud majd a felhasználó
1. **Project → Import effect pack…**: kiválaszt egy `.velfx.json` fájlt (a ChatGPT írta). A Vel ellenőrzi, megmutatja: „3 effects, 2 presets, shader compiled OK, cost ≈ 2", és betölti.
2. Az új effekt **ugyanúgy viselkedik, mint a beépített**: megjelenik az Appearance (Megjelenés) alatt a saját nevével/leírásával/ikonjával, rétegként és hatásként is használható, a paraméterei animálhatók (kulcs, mozgás, Kapcsolat), van előnézete a Könyvtárban.
3. A csomag effektjei **a Könyvtárban maradnak** újraindítás után; a projektfájl **magával viszi** a használt effektdefiníciókat, így máshol is megnyílik.
4. Hibás csomag: nem tölt be semmit, pontosan megmondja, mi a baj (ismeretlen kulcs, shader fordítási hiba, túl nagy), és egy „másolás a ChatGPT-nek" gomb adja a javítási kérést.

## Mit építünk pontosan
- **Formátum** `{app:'vel', kind:'fxpack', v:1, name, effects:[{key, name, desc, kind:'fx'|'gen'|'shape', icon?, params:[{k,l,min,max,def}|{k,l,color:true,def}|{k,l,sel:[...]}], glsl:'vec4 fx(){…}', cost?}], presets:[<a meglévő preset-formátum>]}`. A `glsl` ugyanaz a szerződés, mint a `custom` rétegé (`presetfmt.ts` `shaderContract`).
- **Betöltő** (`src/fxpack.ts`): ellenőrzés (kulcs egyedi: `x_<csomag>_<kulcs>`, nem ütközik beépítettel; paraméter-limit; kódméret ≤ 20 000; fordítás próbával; költségbecslés), regisztráció futásidőben az `EFFECTS`-be (+ `COST`, könyvtári bejegyzés, `catalogcopy`-szerű angol név). **Csak adat és GLSL, JavaScript soha.**
- **Tartósság**: IndexedDB a `userlib.ts` mintájára (`kind:'fxpack'`), a projektfájl `st.fxdefs` mezőbe menti a használt definíciókat; megnyitáskor regisztrálja őket (régi projektek érintetlenek, migrate + régi-projekt teszt).
- **UI**: Project menü: Import effect pack…, Export effect pack (a saját `custom` shaderekből is lehet csomagot csinálni), Prompt for ChatGPT (effektcsomag-sablon, mint a presetnél: `docs/final-updates/PRESET-KESZLET.md`).
- **Prompt-generálás** a kódból (mint `presetfmt.ts`): az `fxpack` formátum leírása, shader-szerződés, szabályzat, példa csomag.
- Szövegek a `locale.ts`/angol kulcsokon át, a felület angol.

## Mit NEM építünk
Külön JavaScript-et futtató effekt, részecskerendszer, fizika, saját textúra/modellfájl, többmenetes (feedback) render, 3D geometria. Ezek kódolt beépített effektek maradnak. Online effektbolt/kereső nincs. A Könyvtár átszervezése (WA2) nem ennek a szelete.

## Próba (2–4 lépés + mérés)
1. Project → Import effect pack… → a mellékelt példacsomag (`docs/final-updates/examples/example.velfx.json`): 2 effekt látszik az Appearance alatt.
2. Rakd az egyiket egy rétegre; mozgasd a csúszkáit, kulcsold az egyiket, mentés → újranyitás: marad.
3. Töltsd be a csomagot egy hibás shaderrel: nem tölt be, érthető hibát ad.
- Mérés: typecheck 0 hiba; célzott teszt (`tests/fx_import.js`: érvényes csomag, hibás shader, ütköző kulcs, mentés–újranyitás, régi projekt megnyitása); teljes tesztkör egyszer a végén; build méretváltozás.

## Hátralévő lista változása
Kész lesz: effektcsomag-import/export és ChatGPT-sablon hozzá. Marad: WA2 Könyvtár + Rétegek · WA3 Megjelenés + Maszk · WA4 Light + 3D anyag · WA5 Animációk · angol maradék.

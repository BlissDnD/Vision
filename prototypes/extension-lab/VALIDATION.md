# Ellenőrzés – elkülönített bővítménylabor

Dátum: 2026-10-18. Környezet: Node 26.10.0; Chromium headless, SwiftShader. A pontos függőségek a `package-lock.json` fájlban vannak.

| Ellenőrzés | Eredmény | Mit igazol? |
|---|---|---|
| `npm test` | **45/45 zöld** | Geometria, poligonok, fontkontúr, görbék, szín, szórás, hangjellemző, GLB roundtrip/optimalizálás, modellanimáció, seed, fizikai visszatekerés. |
| `npm run build` | **63 modul + választóoldal lefordul** | A kiválasztott csomagok és exportok böngészős összecsomagolása. |
| Headless modulválasztás és 0,5 mp-es időállítás | **63/63 zöld** | A példák betöltése és alaprender, észlelt JavaScript-/shaderhiba nélkül. |
| Fluid képi visszatekerés | **zöld** | 0,5 → 0,1 → 0,5 mp után mind a 16 384 RGBA-byte egyezik, és nem üres a festékmező. |
| Helyi kép → atlasz → JSON | **zöld** | A képi adat beágyazható, az UV-k a tartományban vannak. |
| Folyamatos MP4 → visszaolvasás | **zöld** | 64×64-es, 0,3 mp-es tesztvideó; 1173 byte; megfelelő méret és hossz. |
| Export megszakítása | **zöld** | Az elutasított export abortálta a célírót. |

Összesen **67/67 böngészős ellenőrzés**, kihagyott célzott próbák nélkül. Részletek: `browser-report.json`. Ezek nem 67 teljes, végfelhasználói funkciótesztet jelentenek: 63 betöltési próba és 4 célzott ellenőrzés.

## Ami még nincs igazolva

- Manuális esztétikai/látványpróba, teljes billentyűzetes/akadálymentességi ellenőrzés.
- M1 Max hardveres GPU-idő, csúcsmemória, nagy jelenet, 4K és hosszú videó.
- Hangos MP4; a prototípus exportja videó-only.
- A metronóm tényleges hangélménye és az operációs rendszer fájlmentő párbeszédablaka.
- Minden lehetséges SVG/GLB/font/HDR/PBR fájl, tömörített glTF dekóderek.
- Kenney/Poly Haven/ambientCG online katalógus és teljes artworkcsomag; a próba saját/helyi fájlbemenetre épül.
- Különböző böngészők és mobil. A headless Chromium csak egy környezet.
- Vel-integráció, rétegeffektek, inspector, undo, saját projektformátum és a meglévő alkalmazás regressziótesztjei.

A függőségekből érkezik néhány deprecation figyelmeztetés (Three CJS, BVH-beállítás). A jelenlegi tesztkörben nem okoztak hibát; későbbi verzióváltáskor újra ellenőrizendők.

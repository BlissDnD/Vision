# Javaslat: 1. és 2a hullám — CAT-01 könyvtár + STAB-01 mini (2026-10-18)

A nagy csomag (`docs/claude-handoff/`) első két végrehajtási hulláma. Két külön szelet, külön commit, de egy jóváhagyással.
Szabályok: `TRIAGE-01-EREDMENY-2026-10-18.md` 5. (átfedő addon) és 7. (beágyazás + teljesítmény) pont.

---

## A) STAB-01 mini — „semmi nem vész el” (először ezt, mert adatvédelem)

**Mit tud majd a felhasználó**
- Egy mentett Jelenetben használt kép akkor is megmarad mentés + újranyitás után, ha az aktuális jelenetben nincs rajta.
- A betöltött hang és a Jelzései bekerülnek a projektfájlba; újranyitáskor és másik projektre váltáskor helyesen állnak vissza (a régi hang nem ragad be).
- Videóexport közben Escape / háttérkattintás / Mégse **tényleg leállítja** az exportot (eddig csak az ablak tűnt el).
- Az árva Kapcsolatok (mindkét elemük törölve) betöltéskor és törléskor eltűnnek, nem halmozódnak.

**Mit építek**
- `history.ts` `usedAssets()`: a jelenetek (`st.scenes`) rétegeit is bejárja; asset **tartalom-hash** szerint egyszer kerül a fájlba (7. pont 2.).
- `projectJSON()/applyProject()`: hanganyag + jeladat beágyazása és visszaállítása, projektcserénél az előző hang felszabadítása.
- Export: a bezárás a `cancel` jelet állítja; a `streaming-export` addon mintája alapján (labor igazolt megszakítás) memóriában korlátozott írás és tiszta leállás.
- Árva Kapcsolat takarítása betöltéskor és rétegtörléskor (látható változás nincs, nem módosítja csendben az élő képet).
- Régi projektek: migráció + régi-projekt teszt.

**Mit nem:** új hangszerkesztő, 4K-export gyorsítás, videóimport.

**Próba (2–4 lépés)**
1. Jelenet A-ba tegyél képet, válts Jelenet B-re, ahol nincs kép → Mentés fájlba → Új projekt → Megnyitás: Jelenet A képe ott van.
2. Tölts be hangot, tegyél 2 Jelzést → mentés → másik projekt megnyitása (nincs hang) → vissza az elsőre: hang és jelzések megvannak.
3. Indíts videóexportot, nyomj Escape-et: az export leáll, nincs letöltés, a program nem lassul.
Mérés: projektfájl mérete két rétegnyi azonos képpel ≈ egy kép mérete.

---

## B) CAT-01 első szelet — „mindent gyorsan megtalálsz”

**Mit tud majd a felhasználó**
- A könyvtár keresője megtalálja az elemeket **szinonimával és feladattal** is („füst”, „csillogó fém”, „szöveg körbe”, ékezet nélkül is).
- Négy egyértelmű szerep szerint szűrhetsz: **Források · Formák · Megjelenések · Mozgás** (a mai polcok megmaradnak).
- Ugyanaz az elem több témában is feltűnhet (pl. Áramló tinta: Források + Folyadék téma), de egy elem marad.
- Régi saját presetek, saját kategóriák és a régi húzások változatlanul működnek.

**Mit építek**
- Stabil, végleges elem-ID minden mai könyvtári sorra (az előkészített `data/current-library.json` 229 rekordjából, a hash-ID helyett rögzített kulcs).
- Külön metaadat/alias modul (`src/catalog.ts`) az előkészített `catalog-model.mjs` alapján; a `shelf.ts` keresője ezt használja.
- Szerep-szűrő chipek a könyvtár tetején (meglévő helyen, új panel nélkül).
- A mai újak (E1, F1, F2, T6, MAT1, FÉNY2, P2, K3, Lottie, Poly Haven) metaadattal felvéve.
- Teszt: 20 keresési eset + régi drag-payload és saját preset.

**Mit nem:** LLM-kereső, témagyűjtemények (2. szelet), réteg-típusok átnevezése, új renderelés.

**Próba (2–4 lépés)**
1. Írd be a keresőbe: „fust”, „króm”, „szöveg gömbön” → a megfelelő elem az első háromban van.
2. Kattints a „Mozgás” szerep-chipre → csak mozgások látszanak, a Fizikai test és a Körbeérős mozgások is.
3. Húzz rá egy régi saját presetet egy rétegre → ugyanúgy működik, mint eddig.

---

## Teljesítmény
Egyik szelet sem ad nehéz kódot. A keresés indexe megnyitáskor egyszer épül (< 5 ms cél), a hash-alapú asset-tárolás kisebb projektfájlt ad.

## Hogyan változik a hátralévő lista
Kész után: 2b **U5 szín/UI** (színaddonokkal) → 3 **M6b** és 3' **M10 korai layoutrecept** → 4 **M8 Mező** + M7 maradék → 5 **M9** → 6 **M10 teljes**. A `FUNKCIO-LELTAR.md` 18. (import/hordozhatóság) sora R→D közelebb, a CAT sor új.

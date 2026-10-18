# Help mód — ellenőrzésre és commitra előkészítve

**2026-10-18. Kérés:** a felhasználó a korábbi terv működő előkészítését kérte, hogy Claude ellenőrizze és commitolja. A jelen változtatások szándékosan **nincsenek commitolva vagy stage-elve**. Más agentek munkáját ne vond be.

## Elkészült működés

- `? Súgó` kapcsoló a meglévő súgó mellett; külön `Mi ez?` egyszeri célkiválasztás, Mégse lehetőséggel.
- A meglévő rövid tooltip Help nélkül megmarad. Help módban egyetlen bővebb kártya, 450 ms késés és távozási türelem; húzás közben nincs új popup.
- Rögzítés gombbal/F1-gyel; kattintható inline szakszavak és kapcsolódó fogalmak, legfeljebb két kártya, visszalépés és cikluskezelés. Keskeny ablakban egyetlen alsó kártya.
- Escape/fókusz-visszatérés, olvasás közbeni szerkesztő-gyorsbillentyűk leválasztása, egyszeri érintéses célkiválasztás az eredeti művelet elindítása nélkül.
- A modalból megnyitott súgó a modal dialógusában él, a más felülethez tartozó kártyát egy megnyíló modal bezárja.
- Helyi UI-preferencia; nincs projektírás, commit(), assetbetöltés, saját renderciklus vagy új függőség.
- 16 magyar témaleírás explicit fogalomlinkekkel és forrásreferenciákkal. 11 jelenleg létező felületcélhoz közvetlen kötés, a többi fogalom a kapcsolatokból érhető el.

## A tartalom határa

Ez a Help infrastruktúra működő változata és a kezdő fogalomtár, **nem minden effekt és paraméter teljes kézikönyve**. Egy még nem lefedett vezérlőn a meglévő title/data-tip/aria-label olvasható, kifejezett „még nincs részletes súgó” jelzéssel. Nem állítunk kitalált paraméterhatást. Az Elmosás külön valós effektpélda, az Erősség neve a `effects/filters.ts` kódjából származik.

Az új témák a `helpdata.ts` adataival és `data-help-id` UI-kötéssel bővíthetők; az új fogalmak explicit `relatedIds` hivatkozások. A mondaton belüli kattintható szavak a típusos `parts` szegmensekkel adhatók meg, például az Animálás leírásában a kulcsképkocka, a Megjelenés leírásában az Elmosás. A magyar szövegben lévő összes effektnevet a rendszer nem alakítja automatikusan linkké. Élő böngészős kézi/valódi érintőkijelzős és képernyőolvasós próba hátra van. A normál, korábbi rövid tooltipek hozzáférhetősége nem lett általánosan újraírva.

## Saját fájlok — ezeket vizsgáld és commitold

Új:
- `app/src/help.ts` — UI-életciklus és események.
- `app/src/helpdata.ts` — típusos fogalomtár és hivatkozásellenőrzés.
- `app/tests/help_mode.js` — célzott funkcionális regresszió.
- Ez az átadó és `CHECK-RESULTS.md`.

Módosult:
- `app/src/workspace.ts` — régi tooltip elnyomása Help módban + egyetlen inicializálás.
- `app/src/style.css` — kártyák és aktív kapcsoló.
- `app/CODEMAP.md` — a normál build által frissített modultérkép.
- `docs/claude-handoff/help-mode/00-START-HERE.md` — állapotmutató a működő átadóhoz.
- `HANDOFF.md`, `PROGRESS.md`, `FUNKCIO-LELTAR.md`, `app/README.md` — rövid állapotjegyzetek.

A `.DS_Store` fájlok nem tartoznak ide. A termékverziót nem változtattam meg. A közös repo közben 0.48.0-m10a alapra lépett; ne állítsd vissza a korábbi 0.45-ös verzióra. A build generált kimenete nem része ennek a forrásváltoztatásnak; kiadáshoz a meglévő buildfolyamatot használd.

## Claude ellenőrzési menete

1. Olvasd el a repo belépési szabályait, ezt az átadót és a `CHECK-RESULTS.md`-t; nézd át a diffet. Különösen: pointerdown vs. click elnyomás, Escape eseménysorrend, fókuszvisszatérés és modalon belüli elhelyezés. A forrás nem használ projektállapotot.
2. Futtasd az `app` mappából: `npm run typecheck`, `node scripts/build.mjs --test --dev`, majd `.venv/bin/python tests/run.py dist/latomas.test.html tests/help_mode.js`. A teljes kör eredménye a külön ellenőrzési lapban; új kódváltoztatás nélkül ne ismételd fölöslegesen.
3. Nézd át a 16 témaszöveget a `sourceRefs` alapján; a még nem lefedett helyeket ne nevezd kész részletes dokumentációnak. A tényleges vizuális/érintéses próbát a felhasználó végzi a repo rendje szerint.
4. Ha rendben van, kizárólag a felsorolt saját fájlokat stage-eld, futtasd a `git diff --cached --check` ellenőrzést, majd commitold angol üzenettel, például `Add contextual help mode with pinned linked glossary`. Ha eltérést találsz, javítsd és csak az érintett próbát ismételd.

Felhasználói próba: Súgó be → Lejátszás fölé mutatás → Rögzítés → Sávok → Kulcsképkocka → Vissza/Escape. Ezután Mi ez? → egy vezérlő; csak leírást nyisson. Súgó ki után a normál vezérlő működjön, a projekt maradjon változatlan.

# FÉNY2 – több fény, fényformák, valódi tükrözés/törés, padlótükör (javaslat)

Jóváhagyás: a felhasználó 2026-10-18-án távollétére a döntést átadta („hagyd jóvá magad”); ez a vállalt tartalom.

**Mérföldkő és cél:** a 3D lane 2. szelete, `FUNKCIO-LELTAR.md` 4. sor (C szakasz része).

**A felhasználó ezt tudja majd:** a 3D objektum / 3D jelenet Jelenetfény szekciójában fénycsipek: **Fő** + legfeljebb 3 további fény (**+ Fény**: elsőre ellenfény, aztán hideg kitöltő). Az **aktív fény** csipje kiemelt, a csúszkák és a vásznon a csillanás-húzás mindig az aktív fényt mozgatják; a csip színes pöttye a fény színét mutatja. Minden fénynek **formája** van (Kör, Csík, Négyzet, Gyűrű): ez a forma látszik a krómon/üvegen tükörképként, és a csillanás alakját adja. A tárgyon **Tükröződés: Valódi (jelenet)** → a tárgy önmagát is tükrözi (pl. a tóruszcsomó ágai egymásban), az Üveg anyag valóban átvezeti a sugarat (a mögötte lévő padló/környezet torzulva látszik). **Padló: Tükör** → a tárgy alatt fényes padló, benne a tárgy tükörképe, érdesség szerint elmosva, távolodva halványuló.

**Pontosan megépítem:**
- `st.light.more` (0–3 további fény: be/ki, irány, magasság, erősség, szín­hőmérséklet, méret, forma) + a fő fény `shape` mezője; `normLight` alapértékkel, régi projekt változatlan.
- `render.ts` `lightU`: további fények uniformtömbjei; obj3d/sdfscene `shadePBR`: a további fények fénye (árnyék csak a fő fénynél), `envMap`: fényformák a tükröződésben.
- obj3d/sdfscene új paraméterek: `reflM` (Környezet / Valódi), `floorM` (Árnyék / Tükör), `mirror` (padlótükör ereje). Valódi tükröződés = második sugárkövetés a tárgyon; Üveg + Valódi = belépés–kilépés törés.
- `lightui.ts`: csipsor, aktív fény, hozzáadás/törlés, a csillanás-húzás az aktív fényre.

**Ebben még nem:** árnyék a további fényektől; önálló fényfolt-Megjelenés; a Gerincfelület, Felhő és Terep csak a fő fényt látja (a Gerincfelületnek saját stúdiója és tükörpadlója van); fényjelölő a vásznon (csak a csipen).

**Mentés / migráció:** új mezők `st.light.more`, `st.light.p.shape`, rétegparaméterek `reflM/floorM/mirror`; mindegyik hiányzó értéke alapértékre áll, a régi projekt képe pixelre azonos (teszt).

**4K költség:** további fény ~+3% fényenként; Valódi tükröződés ~+50–80% a tárgy pixelein (alapból ki, a Króm/Üveg kész testeken be); padlótükör a padló pixelein egy második menet (~+40% ott). Mérés M1 Max-on hátra.

**Próba:** 1) Krómkocka → + Fény kétszer, a 2. fény formája Csík: a csík látszik a krómon; 2) csipet váltva húzd a csillanást: az aktív fény mozog; 3) Tóruszcsomó Króm anyaggal, Tükröződés: Valódi; Padló: Tükör; 4) mentés → újranyitás.

**Hátralévő lista a lane-ben:** 35. sor (Skybox / Környezet); utána csak jóváhagyással T2 Bolygó, 31. Város.

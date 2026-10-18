# Mérföldkő-javaslat: 3D Terep (T1), utána Bolygó domborzata (T2)

Állapot: **javaslat, jóváhagyásra vár** (2026-10-18). Forrás: `docs/spec/VEL-KULSO-FORRASOK-INTEGRACIO-CLAUDE-PROMPT.md` 2. pont, `FUNKCIO-LELTAR.md` 32. sor.

**Ami már megvan (nem írom felül):** 2D *Talaj* (`effects/worldBlocks.ts` `terrain`, képi shader, marad), *Bolygó* 7 típussal, légkörrel, felhővel, gyűrűvel (`effects/worlds.ts` `planet`), valódi hálóút saját kamerával (`mesh3d.ts`, Gerincfelület), Keringés eszköz a 3D rétegekhez (`stage.ts`), egy közös jelenetfény (`render.ts` `lightU`, `lightui.ts`), közös óra és export (`sim.ts`, `time.ts`, `output.ts`).

## T1 – 3D Terep

**A felhasználó ezt tudja majd:**
- **Források → 3D Terep** behúzása a vászonra: azonnal napsütötte hegyvidék, valódi sziluettel, árnyékkal, kék vízzel a völgyekben. (A *3D Formák* keresésben is megtalálható.)
- **Kocka gomb / Új változat:** új seed, ugyanaz a típus és stílus. A *Mag* szám kézzel is beírható, ugyanaz a mag mindig ugyanazt a tájat adja.
- **Tereptípus** ikonsor: Hegy · Dűne · Sziget · Kanyon · Fennsík · Kráter.
- Csúszkák: **Méret**, **Domborzat** (magasság), **Részletek** (zaj léptéke, finomság), **Vízszint**; **Stílus**: Mérsékelt · Sivatag · Havas · Vulkáni · Idegen (paletta).
- **Keringés** eszközzel a vásznon húzva forgatja/dönti a kamerát, görgővel közelít (mint a Gerincfelületnél). A jelenetfény irányát állítva a hegyek árnyéka és fénye együtt mozog.
- Minden csúszka animálható és Mozgással kombinálható (pl. a Vízszint lassan emelkedik, a Domborzat 0-ról „kinő”).

**Pontosan megépítem:**
- **Adapter (`src/terrain3d.ts`, új modul):** a ProceduralTerrains `terrainGLSL.js` / `noiseTypes.js` tiszta, Three.js-mentes részeinek szűk portja: Hoskins-hash (`hash12`, nincs `sin`, GPU-k között stabil), kvintikus érték-zaj, `fbm`, `ridgedFBM` (spektrális súlyozás), domain warp, `terrace`, a csúcsokat lágyító `smoothedStackHeight`, szigetes peremlecsengés, valamint a *crater* és a *dune* réteg. A hat tereptípus **egy rögzített receptre** fordul (nem teljes Noise Stack szerkesztő): Hegy = ridged lánc + warp; Dűne = szélirányos dűne; Sziget = korongos lecsengés + tenger; Kanyon = teraszok + bevágás; Fennsík = kevés, lapos terasz; Kráter = kráterréteg az fbm-en. A biome-maszkot egyszerűsítve portolom: magasság, lejtés és nedvesség (fbm4) súlyozza a stílus 4–5 anyagszínét (fű/szikla/homok/hó/vízpart).
- **Renderút: magasságmező-háló saját kamerával, a `mesh3d.ts` mintájára.** Egy N×N rács, a magasságot a **vertex shader** számolja (`heightAt(xz)`), a normálokat a fragment shader központi differenciával. Így semmi CPU-újraépítés, és a csúszkák animálása is olcsó. A `mesh3d.ts` kameráját (`camOf`, `persp`, `lookAt`), MSAA-célját és a feloldást közösen használom; a `render.ts` `mesh` ágát egy kis diszpécserré alakítom (spine | terrain). A raymarchot elvetettem: a sziluettje és a teljesítménye rosszabb ennél a mérettartománynál.
- **Közös jelenetfény:** a `lightU` uniformjai (`uLDir`, `uLCol`, `uLSoftK`, `uLWrap`); kikapcsolt fénynél stúdió-alapfény. **Árnyék:** rövid, rögzített lépésszámú vetett árnyék a magasságmezőn a fény irányába (`heightAt`-mintavétel, 24–48 lépés), lágyítva az `uLSoftK` szerint. Ez nem shadow map, determinisztikus. Hozzá égbolt-ambiens és enyhe légköri köd a távolsággal.
- **Víz:** sík a Vízszint magasságán, Fresnel + égboltszín + napcsillanás, sekélyben átlátszóbb. Tükröződő víz nincs.
- **LOD és minőségi profilok** (az eredeti GPU-szint/oktáv-csökkentés ötlete alapján, chunk-streaming nélkül): Vázlat 256² (5 oktáv), Normál 512² (6), Export 1024² (8 oktáv, közeli részletek). A távoli pontokon kevesebb oktáv fut a fragment shaderben. **4K export:** az `output.ts` `withScale` a rácssűrűséget és az oktávszámot is emeli, így 4K-n is van finom részlet, nem csak felnagyított kép.
- Mentés: `layer.type='terrain3d'` + sima paraméterek (régi projektre nincs hatás, migráció nem kell), `COST` 4, könyvtári bejegyzés, ikon. Célzott teszt: `tests/t1_terrain3d.js` (seed→ugyanaz a kép, más seed→más; seek = export képkocka; mentés→újranyitás; 6 típus fordul; vízszint megjelenik).

**Ebben még nincs:** rétegezett zajszerkesztő (Noise Stack UI), ecset/festés, erózió-szimuláció, folyók, kellékek, végtelen világ/chunkok, valódi földrajzi domborzat, mesh-export, tükröződő víz, sziklatextúrák. Erózió és rétegezés csak akkor jön, ha a minőség indokolja (külön szelet). **A Bolygóra illesztés a T2.**

**Próba (2–4 lépés):**
1. Húzd be a 3D Terepet → jó alapkép; kattints a kockára 3× → három eltérő táj; írd vissza az első Mag-számot → pontosan ugyanaz.
2. Válts Kanyonra, majd Szigetre; emeld a Vízszintet; Keringéssel fordulj körbe → valódi sziluett, a víz a völgyekben marad.
3. Forgasd a jelenetfényt → az árnyékok vándorolnak; animáld a Domborzatot 0→1 két másodperc alatt.
4. Mentés → újranyitás → ugyanaz a kép; 4K PNG-export.

**Mérés:** frame-idő a beépített panelben, M1 Max-on, 1080p-n (cél Normál profilon ≤ 6 ms, Vázlaton ≤ 3 ms); seek a t=1,5 s-ra = export ugyanazon képkockája (pixel-összevetés headless tesztben); 4K exportképkocka-idő (cél < 0,5 s).

**Várható méret:** +15–25 KB a `dist/index.html`-ben (GLSL + ~250 sor TS), külső függőség nincs.

**Licenc:** a ProceduralTerrains magja **MIT, © 2026 ZyFou** (a repó `LICENSE`-e). A `terrain3d.ts` fejlécében szerző, forrás URL és MIT-szöveg; az app *Névjegy / Külső források* listájába is bekerül. A Blender-kiegészítő (GPL-3.0) és a Unity-csomag nem kerül át, onnan nem portolok semmit.

**Kockázatok:** (1) Az 1024²-es export-háló VS-zaja SwiftShaderen lassú lehet → a tesztek Vázlat profilon futnak, a valódi mérés M1 Max-on. (2) Az árnyék-raymarch drága meredek fénynél → a lépésszámot a profil szabja meg. (3) A `render.ts` mesh-ágának átalakítása érinti a Gerincfelületet → a Gerincfelület meglévő tesztjei futnak regresszióként. **Alternatíva, ha a közvetlen port túl nehéz:** a magasságot egyszer egy 1024² float textúrába sütöm (csak paraméterváltáskor), a háló ezt mintavételezi. Ez gyorsabb animáláskor, de animált Domborzatnál képkockánként újrasütés kell, és a közeli részlet gyengébb.

## T2 – Bolygó domborzata (külön, következő szelet, rövid vázlat)

- Gesztus: a 3D Terepet ráhúzod a Bolygóra → a Vel felajánlja: **„Felszín domborzata”**. A Bolygó egy réteg marad, a terep a komponense lesz (Mag, típus, Domborzat, Vízszint = óceán).
- Ugyanaz a `heightAt` **3D zajként, gömbi irányvektoron** (a portolt függvény 3D változata, nem textúra-csomagolás, ezért nincs hosszúsági varrat). Kockagömb-rács, mint az eredeti `PlanetWorld` (6 lap, LOD a horizont szerint), vagy raymarcholt gömbfelszín a mostani shaderbe. Ezt egy kis prototípus dönti el.
- A meglévő légkör, felhőhéj, gyűrű, városfények és napfény megmarad; a „Réteg” választó (csak felszín / felhő…) tovább működik.
- Próba: ugyanaz a mag külön Terepen és bolygón felismerhető; forgatásnál nincs varrat; mentés/export egyezik.

## UX-ötletek (javaslat, nem része a vállalásnak, ha nem kéred)
1. **Típus-keverő a vásznon:** a tereptípus ikonsoron két ikon közé húzva keverék jön létre (pl. 70% Hegy + 30% Kanyon). Egyetlen gesztus, és sok új táj.
2. **„Ecset nélküli” formálás:** a vásznon a terepre kattintva és fel-le húzva ott emelsz dombot vagy mélyítesz völgyet. Ez egy Gauss-folt a paraméterek között (legfeljebb 8, mentve és animálható), nem festett textúra, így determinisztikus marad.

## Hátralévő lista változása
A 32. sor T1 után **részben** (3D Terep demonstrálva), T2 után **demonstrálva**; a „felhasználóval kipróbálva” a te próbád után. Új nyitott tételek: Noise Stack/erózió (opcionális), terep-mesh export, tükröződő víz. **Jóváhagyod a T1-et ebben a formában?**

# Vel — új referenciák: kód-előkészítés Claude-nak

Állapot: fejlesztési előkészítés, **nem kész Vel-funkció**. A felhasználó a Sketch Materialtól kezdve az összes alábbi példát szeretné a megfelelő helyen viszontlátni. A `CLAUDE.md` szerinti mérföldkő-javaslat és jóváhagyás az egyes implementációs szeletek előtt továbbra is érvényes. A már futó munka fájljait ez a dokumentum nem írja felül.

Kapcsolódó új médiaforrások (Lottie, Unsplash, Poly Haven, GIPHY): [`VEL-KULSO-MEDIAK-IMPORT-ELŐKÉSZÍTÉS-2026-10-18.md`](VEL-KULSO-MEDIAK-IMPORT-ELŐKÉSZÍTÉS-2026-10-18.md).

## Integrációs szabály

- A Vel az `app/src/effects/index.ts` `EFFECTS` nyilvántartásából, az `app/src/library.ts` polcaiból és a `vec4 fx()` GLSL-szerződésből építi a 2D effekteket. `kind:'fx'` esetén a `IN(uv)` az érintett réteg képe; a kimenet előszorzott RGBA. A jelenetidő `uTime`. A rétegparaméterek `p_<név>` uniformok, így animálhatók.
- A 3D anyagoknak külön renderút kell (`objects3d.ts`, `mesh3d.ts`). 2D képszűrővel nem lehet a felületi normálokat, mélységet és árnyékot hitelesen pótolni. A felületen mégis ugyanonnan, a **Megjelenések** polcról lehessen alkalmazni őket, célkompatibilitási jelzéssel.
- A látványos oldaldemókat Velben szerkeszthető, időalapú kompozícióként kell újraértelmezni. A görgetés és egérmozgás legyen opcionális élő bemenet; ugyanazt az animációt lehessen a Vel idővonalával és exportjával vezérelni.
- Minden beépítéshez: projekt mentése–újranyitása, visszavonás, tetszőleges időpontra ugrás, 4K export és GPU-költség ellenőrzése. Az előnézet minősége csökkenthető, az export eredménye legyen ismételhető.

## Referencia → Vel-funkció

| Referencia | Hely és első használható gesztus | Technikai határ / jog |
|---|---|---|
| [R3F Sketch Material](https://github.com/abhishekmill/R3FSketchMaterial) | **Megjelenések → Rajzolt toll**: 3D tárgyra húzás; fényhez kötött vonalkázás, kontúr, opcionális satírozott árnyék. Tollvastagság, sűrűség, szín, papír, látható kontúr. | MIT. A GLSL vonalkázás és a kontúr algoritmusa portolható; React Three Fiber/Three.js komponens nem tehető változatlanul a Vel rendererébe. 2D/text célokra külön adaptáció. |
| [Holographic](https://hologram-shader-thibautlfr.netlify.app/) | **Megjelenések → Hologram**: 3D tárgyra húzás, szín, áttetszőség, világító perem, mozgó pásztázás, villódzás. | A demó forrását/licencét nem azonosítottuk. Látványreferencia; közvetlen kódmásolás nélkül saját 3D anyag. |
| [WIDE](https://codepen.io/editor/blacklead-studio/pen/01a0d773-dab5-744d-bc5e-3f11d4f2262e) | **Receptek → Magazinrács**: képek és címsorok behúzása; szerkeszthető aszimmetrikus rács, óriáscím, kis képsorok és lapváltás. | A CodePen licencét külön ellenőrizni kell. A saját fotók és betűk maradjanak rétegek; a weboldal DOM-ját ne ágyazd be. |
| [Unwoven](https://github.com/clementgrellier/unwoven) | **Mozgás → Szálakra bomlás** képre húzva; külön **Recept → Szövött galéria** több képből. Szálak száma, szétesés helye, mértéke, ritmusa. | MIT. A szerző külön geometriai szalagokat használ, így a kép összeállva tömör, szétesve valódi rések látszanak. A Vel órájához és seedjéhez kötendő. |
| [Curve Gallery](https://github.com/gaspoorf/curve-gallery) | **Útvonal + Mozgás + Recept**: vásznon rajzolt 3D görbére képek, kamera követi; közeledő képek fókuszba nőnek. | Nyilvános kód, de a tárolóban nem láttunk licencet. Működési elv alapján saját kód; a demó Blender-útvonal importját a Vel saját útvonal-szerkesztése helyettesítse. |
| [Tubes Cursor](https://codepen.io/soju22/pen/qEbdVjK) | **Források → Útvonalas forma**: egérrel rajzolt/tárolt 3D cső, szalag, több szál; vastagság, taper, keresztmetszet; ráhúzható 3D Megjelenés. **Viselkedés → Kurzor követése** külön. | A Pen `CC BY-NC-SA 4.0`-t jelöl. A kész komponenst **ne másold** kereskedelmi Velbe; saját implementáció. |
| [CRT-like effect](https://codepen.io/fand/pen/YPXBwVd) | Két **Megjelenés**: **Jelhiba/RGB-glitch** egy rétegre és **CRT-képernyő** rétegre/csoportra/jelenetre; együtt külön Recept. | A Pen két shaderpasszt használ. A VFX-JS könyvtár MIT, de a Pen saját kódjának jogát külön ellenőrizd; az alábbi önálló indítókód nem a Pen másolata. |
| [3D Text Circle](https://github.com/davidfaure/3d-text-circle-animation-codrops) | **Szövegelrendezés → Körpályán**: szólista, sugár, döntés, mélység; külön **Mozgás → Körbefordulás** és sebességfüggő betűtorzítás. | MIT. Ez külön szavak körpályán, nem azonos azzal, amikor egyetlen szöveg gömb/henger felületén fut. A demó MSDF fontja helyett a Vel szövegstratégiája döntendő. |
| [VFX-JS text shadow](https://codepen.io/fand/pen/YzoWyqJ) | **Megjelenések → Színes vetett fény**: szövegre/alakra húzás, fénypontra mutató vászonfogantyú, hossz, szóródás, spektrum; a fényponthoz Kapcsolat vagy Mozgás rendelhető. | A demó 64 mintát vesz képpontonként. Előnézethez és 4K exporthoz ROI/maszkhatár és minőségi fokozat szükséges. Pen-jog tisztázandó; VFX-JS MIT. |
| [Relighting Images](https://github.com/DGFX/codrops-relightning-images) | **Megjelenések → Kép újravilágítása**: képhez mélységtérkép import/generálás, fény fogantyú, mélység-erősség, árnyék, finomítás; Kapcsolat a Jelenetfényhez. | MIT. Eredeti WebGPU/TSL, a Vel WebGL2-höz saját passz kell. Ez 2.5D, nem körbejárható 3D. Rossz mélységtérképhez javító UI kell. |
| [TalkingHead](https://github.com/met4citizen/TalkingHead) + [HeadAudio](https://github.com/met4citizen/HeadAudio) | **Karakter Forrás + Beszéd Mozgás**: arcmimikára alkalmas GLB, hang hozzárendelése, szájforma/szem/fej/gesztus szerkesztése, karakter-Recept. | Mindkét projekt MIT. TalkingHead Three.js külön renderer és valós idejű óra; a Velhez adapter, időzített viseme/blendshape görbék és determinisztikus export kell. Saját karakterhez rig és morph targetek; magyar beépített nyelvi modul nincs. A HeadAudio hangvezérelt becslése kevésbé pontos, ezért kézi korrekció kell. |

## Rövid, kipróbálható első szeletek — függőségi sorrend

1. **2D megjelenések:** CRT és Színes vetett fény. A meglévő Glitch/Jelhiba, Kromatikus aberráció és Film/szemcse effekteket előbb fel kell mérni, majd a referenciához szükséges irányba javítani; ne jöjjön létre ugyanannak három új neve. Ezek a meglévő `kind:'fx'` útvonalra illeszthetők. Egy közös tipográfiai Recept csak akkor következzen, ha az elemek külön-külön működnek. A két alábbi `fx()`-vázlat saját indítókód; paraméterek és UI/bibliotéka-bejegyzések még hiányoznak.
2. **Szerkeszthető kompozíciók:** WIDE mint réteges Recept, Unwoven képszál-Mozgás. Az előbbi a meglévő layout/csoport rendszerre épül; az utóbbi új geometriai passzt igényel.
3. **Közös útvonal:** Útvonalas forma, 3D Text Circle, Curve Gallery. Egyetlen szerkeszthető görbe/adatmodell szolgálja a forma- és kameraútvonalat, de az elhelyezés, kamera és text-görbe külön felhasználói művelet maradjon. A Tubes kódját licenc miatt ne másold.
4. **3D anyagok:** Sketch és Hologram a 3D renderút anyag/interfész-bővítése után. Ugyanaz a Megjelenések polc, kompatibilis célokon más renderpassz.
5. **Mélyebb média/karakter:** kép újravilágítása, majd beszélő karakter. Előbb mélységtérkép és GLB/morph import, aztán valós idejű és exportálható animáció. Az első TalkingHead-próba egy megfelelő GLB + előre időzített rövid hang; élő TTS és mikrofon későbbi szelet.

## Kipróbált, különálló kódminták

- [`vel-utvonal-mag-prototipus.mjs`](vel-utvonal-mag-prototipus.mjs): szerkeszthető görbe középvonala, egyenletes elosztás és kameramintavétel. Az **Útvonalas forma** erre építhet cső- vagy szalaggeometriát; a keresztmetszethez stabil, csavarodást kerülő helyi keret még szükséges. A **Körpályás szöveg** a szavakat/betűket helyezheti az útvonalra, de a tényleges betűformázás külön feladat. A **Curve Gallery** ugyanezen útvonalon mozgathatja a kamerát, a jelenetidőből számolva. Nem kell három külön görberendszer.
- [`vel-beszed-ido-prototipus.mjs`](vel-beszed-ido-prototipus.mjs): hanghoz időzített szájforma-jelzések tiszta mintavétele. A hang időzítését, a fonémák felismerését és a GLB morph targetek hozzárendelését **nem** végzi el. Az előre időzített jelzések ugyanazon `sceneTime`-nál azonos eredményt adnak, ezért alapja lehet a visszatekerhető beszédnek és exportnak. A jelzések kézzel javíthatók legyenek; a hang automatikus elemzése csak javaslatot adjon.
- Ellenőrzés: `node --test docs/spec/vel-utvonal-mag-prototipus.test.mjs docs/spec/vel-beszed-ido-prototipus.test.mjs`. Ezek önálló matematikai minták; **nem igazolják** a Velbe építést, a látványt vagy a 4K teljesítményt.

## Egyezés a mostani Vel-kóddal — Claude ezt ellenőrizze implementáláskor

| Meglévő rész | Következmény |
|---|---|
| `app/src/effects/filters.ts`: `glitch`, `chroma`, `film`, `radial`, `glow` | A CRT csomag ezekkel együtt rétegezhető legyen. Az RGB-eltolást, szemcsét és fényt előbb a meglévő effekteken kell értékelni; új effekt csak új önálló felhasználói művelethez kell. |
| `app/src/glsl.ts`: `IN(uv)` és előszorzott RGBA | A színek nem adhatnak világos téglalapot az átlátszó részekre. A színeltolás mintáinak alfáját külön kezeld; az alábbi vázlatok kompozitálását vizuálisan és GPU-n még ellenőrizni kell. |
| `app/src/effects/index.ts`: `EFFECTS`, `fxFits`, `paramsOf` | A Megjelenés célréteg-kompatibilitását egyértelműen jelezni kell. A saját shader csúszkái legfeljebb nyolcan vannak; új gyári effekt saját paraméterlistát kaphat. |
| `app/src/mesh3d.ts` és `app/src/effects/objects3d.ts` | Van 3D renderút, de a TalkingHeadhez szükséges GLB-rig, morph-target és viseme-lejátszó nincs igazolva. Az első karaktermérföldkő ezt külön import- és idővonal-próbával kezdje. |

**Elvárt első 2D vizuális próba:** a felhasználó saját, átlátszó szövegrétegére húzott Színes vetett fénynek a betűk körvonalát kell követnie; a fény fogantyúja a vásznon mozgatható; a háttér átlátszó marad; a szöveg időbeli mozgatásakor a fény vele megy. A CRT ugyanazon szövegen és egy fotócsoporton is működjön; a színeltolás, sorok és torzítás külön állíthatók. Mindkettőt nézd meg 1080p és 4K képen, valamint nem sorban felkeresett időpontokon.

**A shader-vázlatok határa:** a CRT most a három csatorna RGB-jét más-más mintából veszi, miközben a középső minta alfáját tartja meg. Ez erős színeltolásnál hibás lehet az átlátszó szélen. A vetett fény 24 mintát vesz minden képponton, és a forrásréteg renderkeretéből kilógó sugarak levágódhatnak. Ezeket még a beépítés előtt oldd meg az alfa, a kibővített határolókeret és a teljesítmény együttes vizsgálatával. A vázlatok önmagukban nem kész effektek.

## Indítókód A — 2D CRT Megjelenés (saját GLSL-vázlat)

Az alábbi shader-rész a Vel `vec4 fx()` effektkódjához készült. Paraméterek: `curve` 0–0.4, `scan` 0–0.5, `rgb` 0–5 pixel, `grain` 0–0.2. A konkrét `EffectDef`-et `S(...)` paraméterekkel és `kind:'fx'`-szel kell regisztrálni. **Még nincs a Velben futtatva vagy GPU-val ellenőrizve.**

```glsl
float crtHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec4 fx(){
  vec2 q=vUv*2.0-1.0;
  vec2 uv=vUv + q*dot(q,q)*p_curve*0.10;
  if(any(lessThan(uv,vec2(0.0)))||any(greaterThan(uv,vec2(1.0)))) return vec4(0.0);
  vec2 delta=vec2(p_rgb/max(uRes.x,1.0),0.0);
  vec4 c=IN(uv), r=IN(clamp(uv+delta,0.0,1.0)), b=IN(clamp(uv-delta,0.0,1.0));
  vec3 col=vec3(r.r,c.g,b.b);
  float lines=1.0-p_scan*(0.5+0.5*cos(uv.y*uRes.y*3.14159));
  float noise=(crtHash(floor(uv*uRes)+floor(uTime*24.0))-0.5)*p_grain;
  float vignette=1.0-0.25*dot(q,q);
  return vec4(max(vec3(0.0),(col*lines+noise*c.a)*vignette),c.a);
}
```

**Próba:** rétegre és csoportra húzás; ugyanazon t időpont ugyanaz a zajminta ugráskor/exportkor; négy sarok és átlátszóság; 4K renderidő. A Jelhiba külön effekt, ne olvadjon ebbe a definícióba.

## Indítókód B — vetett szöveg-/alakfény (saját GLSL-vázlat)

Paraméterek: `dx`, `dy` -1…1 (a vásznon állítható irány), `len` 0…0.5 képszélesség, `amount` 0…2, `soft` 0…1. Első körben egyszínű árnyék; spektrum, fényfogantyú és kapcsolat külön iteráció. A kód az `IN()` alfájából épül, így képen is csak annak tényleges alfamaszkját követi. **Még nincs a Velben futtatva vagy GPU-val ellenőrizve.**

```glsl
vec4 fx(){
  vec4 src=IN(vUv);
  vec2 dir=normalize(vec2(p_dx,p_dy)+vec2(0.0001));
  vec2 reach=dir*p_len;
  float occ=0.0;
  for(int i=1;i<=24;i++){
    float t=float(i)/24.0;
    vec2 uv=vUv-reach*t;
    float inside=step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0);
    float a=IN(clamp(uv,0.0,1.0)).a*inside;
    occ=max(occ,a*(1.0-t)*(1.0-p_soft*t));
  }
  float shadow=clamp(occ*p_amount,0.0,1.0)*(1.0-src.a);
  vec3 tint=vec3(0.95,0.32,0.72);
  return vec4(src.rgb+tint*shadow,clamp(src.a+shadow,0.0,1.0));
}
```

**Próba:** „Fény” fogantyú irányváltása, rétegen kívül is látható fény, nincs színes téglalap átlátszó fotó körül, 4K időmérés. Ha a sugár csak a réteg közeli tartományára korlátozható, ott rendereljen; ne fusson 24 mintával a teljes üres vásznon.

## Claude munkaszabály ehhez az átadóhoz

Először ellenőrizd a repo aktuális állapotát és a futó mérföldkövet. Ne kezdd el egyszerre a 11 referenciát. Az adott szelet előtt `CLAUDE.md` szerinti rövid, konkrét javaslatot adj és várd a felhasználó jóváhagyását. A fenti kódvázlatokat csak kiindulásnak tekintsd: shaderfordítás, valós GPU-látvány, célrétegen működés, időszeek, export, teljesítmény és jogi attribúció alapján alakítsd tovább. A referencia csak akkor kész, ha a felhasználó saját képével/szövegével/karakterével a Vel vásznán szerkeszthetően működik.

# Vörös gerincfelület – Vel M2 látványpróba

Önálló WebGL2-prototípus a `images/01.png` referenciához. A Vel appot nem módosítja. Ez látvány- és teljesítménykísérlet, nem integráció.

## Indítás

| | |
|---|---|
| Fejlesztés | `npm install`, majd `npm run dev` (Vite, http://localhost:5173, a Code fülön a „ribbon” konfig a 5181-es porton) |
| Egyfájlos build | `npm run build` → `dist/index.html`. Dupla kattintással, szerver nélkül is megnyílik. |
| Kezelés | Húzással forgat, görgővel közelít. A panelen 8 fő vezérlő van; a „Továbbiak” alatt: gerincpontok szerkesztése (kattints egy kék pontra, és húzd a nyilat), referencia- vagy másik nézet, alapállapot, mérés. |

## Döntés: Three.js (r170), nem saját WebGL2

A próba kérdése a forma, az anyag és a fény. A Three.js tesztelt PBR-láncot ad: lakkréteg (clearcoat), előszűrt környezet (PMREM), síktükör (Reflector), MSAA, Khronos Neutral, AgX és ACES tónusleképezés. Ezt saját motorban újraírni most csak lassítana. A Vel saját WebGL2/SDF ágába integrálás a második lépcső: ott dől el, hogy mesh, SDF vagy hibrid út legyen.

## Mi van a jelenetben (minden valódi 3D, nincs belesütött kép)

- **Forma** (`src/ribbon.js`): szerkeszthető Catmull–Rom gerinc (9 pont) = a felső él. Erről lóg le egy széles, vékony, lekerekített élű lap. A lelógás iránya a gerinc mentén változik: elöl a kamera felé, hátul az alagút felé. Állítható: ív, szélesség, taper, vastagság, keresztirányú hajlítás, csavarodás. Kb. 45 ezer háromszög; minden változtatásnál újraépül, a normálokkal együtt.
- **Padló-összeolvadás**: geometriai. A padló közelében a csúcsok magassága `y' = r·exp(y/r − 1)` szerint ül le (C1-folytonos), így a lap érintőlegesen fut ki a padlóra, nem metszi el. Az `r` sugár állítható. Mellé analitikus kontaktárnyék jön a padló shaderében, 64 felületi mintából.
- **Anyag**: MeshPhysicalMaterial (fémesség, érdesség, lakkréteg), ezüst felső perem (csúcsszín). Van egy „vörös tükröződés” vezérlő is: a tükörképet az alapszínnel festi, hogy a súroló szögben se fehéredjen ki a vörös. Ez **művészi, nem fizikai** beavatkozás; 0-ra állítva tiszta PBR.
- **Fény** (`src/studio.js`): fehér stúdió-ég, erős meleg hátsó fény, három mennyezeti, egy oldalsó és két kamera mögötti fénycsík. A környezet (az ég, a csíkok és a csíkos vörös padló) PMREM-be kerül, és a csíkok mozgatásakor újraépül (3–10 ms). A csíkokat a kamera alapból nem látja (stúdiós fogás, kapcsolható), a tükörképekben viszont benne vannak.
- **Padló** (`src/floor.js`): valódi síktükör, fél felbontáson. Saját shader: 16 mintás, pixelenként elforgatott elmosás, Fresnel-súly, vörös fémes tükrözés, kontaktárnyék, fénytócsa.
- **Utómunka**: HalfFloat, MSAA 4×, finom bloom (alapból 0,18), tónusleképezés és sRGB az OutputPassban.

## Mérés (2026-10-17)

Célgép: **Apple M1 Max**, Chrome-alapú beépített böngésző (ANGLE Metal). Előnézet: 1024×768 CSS, **2048×1536 belső felbontás** (DPR 2), MSAA 4×.

| | ms/kép |
|---|---|
| Élő képkocka (rAF, nem szinkron) | 8,3–8,6 ms (117–120 fps, a kijelző korlátja) |
| Szinkron mérés, teljes (`Mérés` gomb, 1 px-es visszaolvasással) | 9,4–14,3 |
| … glow nélkül | 5,9–8,5 |
| … tükröző padló nélkül | 7,1–11,5 |
| … szalag nélkül | 8,5–14,1 |
| Teljes, 50% felbontáson (1024×768) | ≈ 6,8 (itt már a szinkronizálás dominál) |

**A legdrágább elem a glow** (UnrealBloom, 5 mip-szint, teljes felbontásról indul): 3,5–6 ms. Utána a **tükröző padló** jön, mert a jelenetet még egyszer kirendereli: 1–3 ms. Maga a szalag 1 ms alatt van. Olcsó javítás: a bloom fél felbontásról induljon, a tükör 0,35-ös méretarányon fusson. 4K-n, Windows gépen és iPhone-on nem mértem.

## Őszintén: mi felel meg, mi közelítés, mi hiányzik

**Megfelel:** a kompozíció logikája megvan: fehér ég bal fent, balról felfutó és a padlóig leereszkedő gerinc, jobbra felfelé ívelő vörös boltív, középen hátul erős fény, vörös tükröző padló. A forma, a padló és a tükörkép forgatáskor valódi térként viselkedik. A geometriai vezérlők a normálokat, a csillanásokat és a tükörképet is követik.

**Közelítés:**
- A padló elmosása képtérbeli, és a kameratávolsággal nő. Nem függ attól, milyen messze van a tükrözött tárgy a padlótól, ezért a talppontnál élesebbnek kellene lennie.
- A kontaktárnyék analitikus becslés 64 mintából, nem valódi árnyék.
- A padló-összeolvadás „leülés”: a padló alá futó rész 1,2 cm-rel a padló fölött fekvő, lapos szoknya lesz. Nem valódi geometriai egyesítés (boolean vagy SDF smooth-union); ez az SDF-úttal lenne pontos.
- A „vörös tükröződés” és a kamera elől rejtett fénycsíkok művészi eszközök.
- A bal oldali ezüst perem keskenyebb a referenciánál, a jobb oldali boltív kevésbé hajlik a kamera fölé, és az alagútnyílás csak égi fényfolt, nincs formája.

**Hiányzik az azonos minőséghez:**
1. A finom perforált pontmintázat a vörös felületeken és a bal oldali padlórészen (normál- és érdességminta).
2. Öntükrözés: a szalag nem tükrözi saját magát. A környezet statikus stúdió, nem dinamikus cubemap. A referencián a boltív belseje a többi vörös részt is tükrözi.
3. Távolságfüggő (kontakt-éles) padlótükör.
4. Mérés valódi célgépeken, 4K-n és exportnál.

## Fájlok

`src/main.js` (jelenet, panel, mérés) · `src/ribbon.js` (gerinc → felület) · `src/studio.js` (ég, fények, környezet) · `src/floor.js` (tükröző padló) · `shots/` (referencia-nézet, másik nézet, pontszerkesztés).

Hibakereső kampó a konzolban: `__vel` (paraméterek, nézet, mérés).

## M6 kiegészítés (2026-10-17): pontminta, öntükrözés, mesh vagy SDF — DÖNTÉS

A cél nem a referencia pixelpontos másolása, hanem annak eldöntése, hogyan kap a Vel jó minőségű 3D renderelést.

- **Pontminta**: kész (perforált hatszögrács méterben, pixel alatti méretnél átlagszínbe olvad). `shots/04-pontminta-kozeli.jpg`.
- **Öntükrözés**: egyetlen pontból készülő kocka-kamera (`Öntükrözés` gomb, alapból ki). Egy frissítés 21 ms, csak változtatáskor fut. Ennél a formánál ellapítja a csillanásokat (parallaxishiba), `shots/05-ontukrozes-be.jpg`. Jó öntükrözéshez box-projected probe vagy képtérbeli tükrözés (SSR) kell.
- **Mesh vagy SDF, mérve** (M1 Max, ugyanaz a forma, a fény és az utómunka):

  | | 2048×1536 | 1024×768 |
  |---|---|---|
  | Mesh (háromszögháló) | 4–7 ms | 3,7 ms |
  | SDF (raymarching, 47 szakaszos söpört lap + tükrözési pattanás) | **183 ms** | – (a mérés a böngészőeszköz időkorlátján elakadt) |

  Az SDF kb. 25–45-ször lassabb, és szakaszos csíkhibákat ad súroló szögben (a gerinc egyenes darabokból áll). Előnye: valódi sima összeolvadás a padlóval.
  A Vel mostani SDF-ága legfeljebb 8 primitívet kezel, nincs benne valódi tükrözés, és ilyen formához új primitív kellene.

**Döntés:** a Vel jó minőségű 3D-je **mesh-alapú** legyen: PBR anyag, előszűrt környezet, síktükör, MSAA, tónusleképezés. Ez egy saját réteg, amely textúrába renderel, és a meglévő rétegláncba kerül. Az SDF megmarad a meglévő procedurális formákra és helyi „összeolvadás” hatásokra (hibrid). A prototípus kódja (`src/ribbon.js`, `studio.js`, `floor.js`) az integráció kiindulópontja.

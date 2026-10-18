# MAT1 – 3D anyag-interfész + Rajzolt toll + Hologram (javaslat)

Jóváhagyás: a felhasználó 2026-10-18-án távollétére a döntést átadta („hagyd jóvá magad”); ez a javaslat a vállalt tartalom.

**Mérföldkő és cél:** a 3D lane 1. szelete, `FUNKCIO-LELTAR.md` 40. sor (C szakasz része).

**A felhasználó ezt tudja majd:** behúz egy 3D objektumot, 3D jelenetet vagy Gerincfelületet; a Megjelenések polcról ráhúzza a **Rajzolt toll**at → a tárgy papíron golyóstollal satírozott rajz lesz (a sötétebb részeken sűrűbb, kereszt-satírozás, rezgő kontúr, a talajárnyék is satírozott). Csúszkák: tollszín, papír, sűrűség, vonalvastagság, nyomás, kontúr, „élő vonal” (rajzfilmes remegés), eredeti szín bekeverése, papír háttér ki/be. Vagy ráhúzza a **Hologram**ot → áttetsző, világító peremű, pásztázó csíkos, villódzó, időnként elcsúszó (glitch) test. Az Erősség csúszkával a két anyag fokozatosan beúszik; kulcsozható, mint minden paraméter.

**Pontosan megépítem:**
- `src/material3d.ts`: közös GLSL-anyagfelület (`matHit`, `matMiss`, `matWarp`) és egy `matU` uniform-beállító; ugyanazt használja az SDF út (obj3d, sdfscene) és a háló út (Gerincfelület).
- Két host-Megjelenés (`inksketch`, `hologram`, `host: obj3d/sdfscene/surface3d`), polcbejegyzés, ikon, COST, két kész tárgy a 3D polcon.
- Saját WebGL2 újraírás: tárgytérbeli háromirányú (triplanar) satírozás tónusszintekkel, papírszemcse, tintakihagyás; a kódot nem másolom (R3F Sketch Material, MIT: csak az elv).

**Ebben még nem:** 3D Terep és Felhő mint célpont, 2D/szöveg Rajzolt toll, valódi geometriai élkontúr (a kontúr itt perem + sziluett), a hologram mögötti hátlapok. Ezek később.

**Mentés / migráció:** új mező nincs, az anyag a réteg meglévő `fx` listájában él → nincs migráció; régi projektek változatlanok.

**4K költség:** a satírozás pixelenként néhány szinusz/zaj (a meglévő raymarch mellett ~5–10%); a hologram még kevesebb. A Megjelenés bekapcsolva a Gerincfelület tükrös padlóját és stúdióhátterét kihagyja, így ott inkább olcsóbb.

**Próba (2–4 lépés):** 1) 3D objektum + Rajzolt toll → satírozott rajz; sötét oldalon sűrűbb. 2) Hologram a Gerincfelületre → áttetsző, pásztázó. 3) Erősség 0→1 kulcsozva: fokozatos átmenet. 4) Mentés, újranyitás: megmarad.

**Hátralévő lista a lane-ben:** 4. sor (több fény, tükrözés/törés, padlótükör), 35. sor (Skybox / Környezet), utána csak jóváhagyással: T2 Bolygó, 31. Város.

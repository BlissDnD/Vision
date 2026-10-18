# Vel – közös élő próbalista (2026-10-18)

Egyben végigmehető, kb. 20 perc. Build: `app/dist/index.html` (dupla kattintással megnyitható). A bal felső sarokban látszik a verzió és a build ideje.
Pipáld ki, ami jó (`[x]`). Ami rossz vagy furcsa, írd mellé egy szóval, vagy szólj: a hibák a `BUGS.md`-be kerülnek, és nem mindet javítjuk azonnal.

## 1. Felület (U4) – 3 perc
- [ ] Animált szöveg: felül a **szövegsávban** B, szín, középre, a Méret húzása.
- [ ] A jobb panel Tartalom füle görgetés nélkül elfér; a Részletek a Fő beállítások alatt van.
- [ ] Mozgás fül → Szövegmozgás → Időtartam: a Tartalom fülön ugyanaz az érték mozog.
- [ ] Két Megjelenés egy rétegen → Effektek fül: **ikonsor**, húzással sorrend, Erősség le → a gyűrű fogy; „+” ikonrács.
- [ ] **Dupla kattintás** egy feliratra a vásznon → átírod → ⌘Enter. ⌘Z visszavonja.

## 2. Mozgás (v1 + v1.1) – 5 perc
- [ ] Jelölj ki egy formát, vidd az egeret a Mozgás polcon a **Lebegés** kártya fölé: előnézet a formán.
- [ ] Húzd a **Lüktetést** egy szövegre; kapcsold ki a projekt Loopját: tovább mozognak, nincs ugrás.
- [ ] **Rugalmas beúszás** egy feliratra; a vásznon a narancs nyíl végével fordítsd balról érkezőre; az idővonalon nyújtsd.
- [ ] Lebegés → **Ritmus: Megáll időnként**; a ritmus-szalagon egy pontot húzz le/fel lejátszás közben.
- [ ] Sávok → réteg ▸ → a mozgássáv végét húzd be; a Kitérésre tegyél két kulcsot.
- [ ] Rugalmas beúszás → **Kulcsokká alakítás**.
- [ ] Animálás módban (A) két kulcs egy formára → **⟲ ismétlés**; A nélkül húzd arrébb: az egész pálya vele megy, új kulcs nem lesz.

## 2b. Gesztus-mozgás (G1) – 3 perc
- [ ] Rugalmas beúszás nyila: **⌘ + fel/le** tempó, **⌘ + oldalra** karakter, **⌥** a nyíl közepén = ív (íven érkezik), **⇧** = 15°-os irány. Húzás közben halvány szellemképek, módosítóval kis címke.
- [ ] Lebegés / Keringés / Forgás / Lüktetés / Remegés chipjét kijelölve a vásznon saját fogantyú: húzd, és ⌘-del a tempót.
- [ ] A fogantyút a pálya mentén húzva a mozgás „tekerhető” (előnézet).

## 3. Időzítés gyorsan – 3 perc
- [ ] 3 réteg, **T**, kattints rájuk sorban (számozott jelvények), húzással cserélj sorrendet.
- [ ] Szóköz, majd **J-J-J** ütemre: sorban beérkeznek. ⌘Z / Esc.
- [ ] **Tempó ½×** egy mozgó rétegen.
- [ ] **Eljátszás** (E) egy körrel: a görbe sima-e (nem szögletes), és varrat nélkül ismétlődik-e.

## 4. Új források és Megjelenések – 4 perc
- [ ] Források → **3D Terep**: kocka 3× (új változat), Mag vissza; Kanyon → Sziget, Vízszint fel, húzással körbe; Jelenetfény iránya. Mennyire gyors (fps)?
- [ ] Megjelenések → **Színes vetett fény** egy szövegre (Irány, Hossz); **CRT-képernyő** egy fotóra.
- [ ] Receptek → **Liquid Glass · fénykép**; Források → **Szélben lobogó láng**.
- [ ] Szöveg és média → **Poly Haven textúrák**: keress „márvány”-ra, kattints (internet kell); mentés után internet nélkül újranyitva megvan.
- [ ] **Lottie**: importáld az `app/tests/fixtures/vel-lottie-circle.json` mintát; a Sávokon húzd a blokkját, állítsd a Sebességet és a Loopot.

## 5. Random és presetek – 4 perc
- [ ] 20× **R** a kedvenc hangulatokkal: hány ronda? Random → Minőségszűrő → Szigorúság max; 3× **Ronda** egy kaleidoszkópos jelenetre.
- [ ] Projekt → **Utasítás ChatGPT-nek** → ChatGPT-ben kérj presetet → Projekt → **Preset beillesztése** → Beillesztés; ⌘Z.
- [ ] Jelölj ki egy csoportot → **☆** → Receptek polc: „saját” jellel; Projekt → Könyvtár mentése fájlba; törlés (jobb klikk); Könyvtár betöltése → visszajön.
- [ ] Saját shaderes preset elnevezett csúszkákkal; egy szándékos kódhiba → érthető hiba, „Hiba másolása ChatGPT-nek”.

## 6. Régebbi, még ki nem próbált (ha marad idő)
- [ ] Világok → Égszín + Nap; a Nap ⇢ pontját húzd az Égszín címkére → „Napfény hat” → a Napot lefelé: alkonyodik.
- [ ] Jelenetek → „+ Jelenetként mentés” kétszer, közte változtass; Jelenetsor ▶: átmenet; exportálás Jelenetsor módban.
- [ ] Mentés → újranyitás egy projekttel, amelyben a fentiekből több is van; 4K PNG export.

## F1 Folyadékmező (0.37.0-f1) – 3 perc
- [ ] Források → **Áramló tinta** behúzása, Lejátszás → kavargó tinta; Örvénylés fel → több örvény; próbáld a füstcsík/örvények/tintacsepp változatot is.
- [ ] Lejátszás közben **húzd a réteget** a vásznon → a tinta a húzás irányába csóvázik.
- [ ] Szövegre húzd a **Folyadékos torzítás**t → csak a szöveg hullámzik; Mód = Feltárás (vagy a polcról a *Folyadékos feltárás*) → a szöveg a tintából bukkan elő.
- [ ] Tekerj előre-hátra ugyanarra az időre → ugyanaz a kép; exportálj 2 s-ot. Mérd a frame-időt (cél: Normál minőségen sima 60 fps).

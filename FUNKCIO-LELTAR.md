# Vel – funkcióleltár a teljes funkcióátadó ellen (2026-10-17, 0.21.0-m7a)

Forrás: `docs/spec/VEL-TELJES-FUNKCIO-ES-MERFOLDKO-ATADAS-CLAUDE-NAK.md` (elsődleges funkcióátadó). Ez a fájl a kódbeli tényállapot. Minden mérföldkő után frissítendő.

Jelölés: **T** = csak terv / nincs a kódban · **R** = részben működik · **D** = demonstrálva (automatikus teszt és/vagy élő böngészős ellenőrzés) · **K** = felhasználóval kipróbálva.
Jelenleg **egyetlen sor sem K**: a felhasználó egyik mérföldkövet sem próbálta ki (M1-nél kifejezetten kihagyta).

**Fontos:** az M1–M7a „kész” jelzései technikai szeletek. Egyetlen A–G termékszakasz sem teljes. Korábban a HANDOFF-ban „M6 LEZÁRVA” szerepelt; helyesen: *az M6 technikai szelet kész, a C szakasz részben teljesül*.

## A 12. fejezet hiánylistája soronként

| # | Funkció | Állapot | Mi van ténylegesen | Mi hiányzik |
|---|---|---|---|---|
| 1 | Könyvtár bal oldalt a rétegek fölött, húzható elválasztó | **T** | A könyvtár a vászon alatt van. Ékezet nélküli keresés és kategóriák működnek (M3, D). | Áthelyezés balra, elválasztó; kártyán alkalmazhatóság és fő vezérlők; Karakterek gyűjtemény; a „shader” keresőszó a Megjelenésekre. |
| 2 | Megjelenés-audit, ráhúzható anyagok több 3D célon | **T/R** | 22 régi 2D Megjelenés ráhúzható a láncba. Az obj3d 12 anyaga rétegen belüli választó, nem ráhúzható. | Anyag mint ráhúzható Megjelenés (Chrome, lakk, Üveg/Jég, Hologram, gyöngyház, Plazma); a régi effektek látványauditja; a vörös lakk más formán. |
| 3 | 1. kép teljes lánca; 6. kép kapu | **R / T** | Gerincfelület: vásznon húzható gerinc, szélesség/vastagság/taper/csavarás globálisan, lakk/fém anyag, stúdiófény, tükröző padló, padlóba simulás, csillanás-húzás, utómunka (D). | Pontonkénti szélesség/keresztmetszet; csatlakozási módok választása; a hátsó fény vásznon húzása; Receptként mentés; a vörös anyag mint Megjelenés. 6. kép: semmi. |
| 4 | Több fény/fényforma, tükrözés/törés, padlótükör más tárgyon | **T** (1 fény: **D**) | Egy közös, animálható Jelenetfény az obj3d/sdfscene-en, globális és tárgyankénti kapcsolóval, csillanás-húzással (M6, D). | Több fény, aktív fény jelölése, fényformák, önálló fényfolt-Megjelenés; valódi jelenet-tükrözés/törés; padlótükör az obj3d/sdfscene alatt. |
| 5 | Kapcsolatok három állapota, javaslat, panel/térkép, prioritás | **R** | M2: paraméter→paraméter Kapcsolat (hozzáad/felülír, erősség, ki/be) a rétegek inspectorában (D). | Automatikus / felajánlott / kézi állapot; javaslat ráhúzáskor előnézettel; jelvény a rétegen; Kapcsolatok panel és térkép; prioritás; Nap→Ég, Eső/Felhő→Ég. |
| 6 | Közös szerkeszthető útvonal (2D/maszk/szövegút/mozgáspálya/3D), forma-boole, üreg | **T** | Csak a Gerincfelület saját 3D gerince. | Az egész közös útvonalrendszer. |
| 7 | Élő szöveg 3D test felületén; 3D szöveg-geometria | **T** | – | Szöveg gömbön/hengeren (átírható), szöveg alakú kivágás/kihúzás. |
| 8 | Gazdag tipográfia, a 4./5./7. kép mozgásai, Váltakozó szöveg | **R** | M4: soronkénti méret/behúzás/térköz/vastagság/dőlt, sorfogantyúk (D). M7a: „új szövegek” a részecskés szétesésnél (D). | Szó/karakter szintű stílus, vegyes szín/betűtípus; kitöltési cél; Sorok csúszása (Egyszer/Ismétlés/Folyamatos); sokszorozott, villogó, blur-os készlet; önálló Váltakozó szöveg (csere/csúszás/áttűnés/villanás). |
| 9 | Jelzés → szó/Mozgás/réteg hozzárendelés, hangjelek | **R** | J-koppintás, jelzéssáv, horgonyok a retime-hoz (M5); hangjelek (ütem/kick) paraméterre köthetők; a részecskés szétesés „Jelzésekre” módja. | Több reakció hozzárendelése egy jelzéshez, együtt mozgatás; fázispont-igazítás („a szó akkor már olvasható”); késéskorrekció; kézi és automatikus eredet jelölése. |
| 10 | Paraméter-Eljátszás, nyers/korrigált gesztus, impact megőrzése | **R** | M5: x/y gesztus felvétele simítással, a nyers felvétel megmarad, újrasimítható (D). | Paraméterek felvétele; pályaalak/sebességzaj/megállás/impact külön kezelése; nyers és korrigált összevetése; rajzolt útvonal előadás nélkül. |
| 11 | Kamera célzás, követés, pálya, könnyű retime | **T** | Globális 2,5D kamera kulcskockákkal, a Gerincfelület saját orbit kamerája. | Tárgy célba vétele, követés, útvonal menti mozgás, fogható fókuszpont. |
| 12 | Csoporthatár/forgáspont, kijelölési memória, jobb klikk mindenhol | **R** | Jobb klikk a vásznon = találatlista előnézettel, Alt+klikk (M3, D). | Jobb klikk rétegen/klipen/beállításon; tartalomhoz igazodó csoporthatár és forgáspont; kijelölési memória; maszk célzóna. |
| 13 | Források hangolása; karakter/szellem | **R/T** | Bolygó (7 típus, légkör, felhő, gyűrű, régi minőség), Felhőréteg (égboltfelhő), Égbolt, Űr, Fekete lyuk (saját generátor), 2D „Virág” alakzat, Kristály-recept. | Önálló puha **Felhő** tárgy; **Füst**; **Eső**; csak-csillag **Csillagtér**; Virág/ornament szirmokkal, növekedéssel; a Bolygó feljavítása; a Fekete lyuk nem torzítja a mögötte lévő réteget; Portál mint Forrás + Megjelenés; **szellem karakter**. |
| 14 | Részecske Forrás saját emitterrel; szél/3D/ütközés | **T** | Régi kép-alapú pontfelhő-réteg; M7a ráhúzható részecske-Megjelenés (D). | Emitter (pont/útvonal/felület), Mennyiség/Élettartam/Irány/Szórás/Ritmus, szél, ütközés, hangvezérlés, részecskegeometriák. |
| 15 | Fizikai tér, mezők, kontaktus→helyi Glow, valódi Liquid | **T** | Csak látvány-shaderek (Folyékony márvány, Lávalámpa). | Az egész E/F szakasz. |
| 16 | Receptcsalád képarány- és szövegcsere-próbával; animált Random | **R** | Sok recept, „Szerkesztői címlap”; Random hangulatokkal és seeddel. | Receptcsaládok a 3/4/5/7/8/9 képekhez, 1:1/4:5/9:16 próba; Random hatókör, rögzítés, Kísérleti mód, animált random. |
| 17 | Teljes 4K vászon és hangsávos videóexport nagy jelenettel | **R** | MP4 export (WebCodecs) hanggal, 4K opció, mozgási elmosás; 4K frame-idő egy Gerincfelületre mérve. | A videó a memóriában gyűlik (nincs folyamatos fájlírás); nagy jelenet és 10 s 4K/30 mérése; memóriabiztonság. |
| 18 | Import, hordozhatóság, formátumok | **R** | Kép, hang, projekt-JSON import; PNG/MP4 export. | Videó/font/3D import; pontos formátumspecifikáció. |

## Ami az A–B szakaszból tényleg működik (D, nem K)
- Egy jelenetóra, Loop nélküli továbbfutás, determinisztikus ugrás/export, régi projektek megnyitása, export-beállítás a projektben (M1).
- Csoport / Közös alap / Változat / helyi eltérés / Átadás a kijelölteknek; paraméter-Kapcsolat (M2).
- Találatlista jobb klikkre, könyvtár keresés és kategóriák, effektlánc-átrendezés nyilakkal (M3).
- Soronkénti tipográfia sorfogantyúkkal (M4).
- Mozgásblokk-tolás és -nyújtás (a belépés sebessége marad, Alt: a zárás lassul), J-jelzések, x/y Eljátszás simítással (M5).
- Gerincfelület, Jelenetfény (M6); részecskés szétesés és visszaállás (M7a).

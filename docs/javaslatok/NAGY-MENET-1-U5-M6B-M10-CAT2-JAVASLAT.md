# Javaslat: 1. nagy menet — U5 + M6b + M10 korai + CAT-01 2. szelet (2026-10-18)

A felhasználó kérése: több hullám egyszerre, kevesebb jóváhagyási kör és token. Négy rész, mind a meglévő alapokra épül, egy jóváhagyás, egy teljes tesztkör a végén; részenként külön commit és rövid PROGRESS-bejegyzés. Sorrend: A → D → B → C (a B és C használja az A pickerét/gradiensét, a D-t gyors).

## A) U5 Szín + UI (bővített)
Teljes leírás: `U5-SZIN-JAVASLAT.md` (1–11. pont): közös picker, gradiens állomásokkal minden kétszínű elemen, Színek-összesítő + színforrás-sorrend, kontrasztjelzés, sorrendezhető ikonsor, felső action bar, saját paletta harmóniákkal, szín ráhúzása, szövegsáv gradiens, panelpreset.

## B) M6b „1. kép összeáll” (C-szakasz, 3. hullám)
**Mit tud majd:** Receptek → **„Vörös szalag stúdióban”** (és 2 változat: króm, lakk): P2 útvonalon futó Cső/Szalag, MAT1 anyag, FÉNY2 fényformák a tükröződésben, Tükör padló, kontakt-árnyék — egy kattintásra kész, minden része szerkeszthető (útvonalpontok húzása, anyag, fények).
**Építés:** recept a meglévő elemekből; **kontakt-árnyék** (`17 contact-shading` mintájára, saját shader) a 3D úton; **környezeti tükröződés** stúdió-környezettel (`16 environment-map` elve, beépített procedurális stúdió, nem letöltött HDR); a P2 Cső megkapja a MAT1 anyagot (eddig saját színezés). Átfedő addonokból javítás: `48 glass-material` (vastagság/szóródás az Üveg anyagba), `15 planar-reflection` (elmosott tükörpadló érdesség szerint).
**Nem:** pixelpontos egyezés az 1. képpel; külső HDR-fájlok.
**Próba:** recept beszúrása → útvonalpont húzása → anyag váltása krómra → padló érdessége. Mérés: M1 Max frame-idő a felhasználónál.

## C) M10 korai — layoutrecept (G-szakasz, 3'. hullám)
**Mit tud majd:** Receptek → **„Magazinrács”** (WIDE-tanulmány alapján, 5 kompozíció) és **„Szövött galéria”** (Unwoven, MIT): saját képek ráhúzásával cserélhetők, cím/alcím élő szöveg, KO1 Koreográfia-érkezés automatikusan; **Képarány-váltó** a recepten: 1:1 · 4:5 · 9:16 · 16:9, a slotok újrarendeződnek; rövid ↔ hosszú cím esetén a cím mérete igazodik.
**Építés:** WIDE: natív Vel-csoport (képrétegek + szöveg), elrendezés-függvény képarányonként; Unwoven: az eredeti shader + szalaggeometria natív portja a Vel 3D/mesh útjára (a labor adaptere alapján, időből számolt állapot, GSAP nélkül); Q1 minőségszűrő a layout Randomjára.
**Nem:** a WIDE eredeti mozgásának hű portja (forrás nem elérhető); animált Random (M10 teljes).
**Próba:** Magazinrács beszúrása → 3 kép ráhúzása → 9:16-ra váltás → hosszú cím beírása: nem lóg ki. Szövött galéria: tekerés oda-vissza azonos kép.

## D) CAT-01 2. szelet — témák
**Mit tud majd:** a kereső alatt **témagyűjtemények** chipként (Folyadék, Fény és anyag, Szöveg, Természet, Tér/3D, Retró, Mozgás-alapok, Layout): egy témára kattintva a hozzá tartozó elemek polcokon át; ugyanaz az elem több témában. Az A–C újdonságai is bekerülnek.
**Építés:** `catalog.ts` téma-táblája (id → témák), chip-sor üres keresésnél is, a mostani polcsor mellett.

## Teljesítmény (7. pont szabályai)
Picker/gradiens lusta; kontakt-árnyék és környezet egy extra olcsó passz, kikapcsolható; Unwoven csak beszúráskor fordít shadert; layout-elrendezés csak képarány- vagy szövegváltáskor számol.

## Ellenőrzés
Részenként célzott teszt (`u5_color.js`, `m6b_studio.js`, `m10_layout.js`, `cat2_topics.js`), a végén egy teljes kör. Régi projektek változatlanul nyílnak (régi-projekt teszt a gradiens-migrációra).

## Hogyan változik a hátralévő lista
Utána: 4. hullám **M8 Mező + Érintés jelez**, 4'. **M7 maradék (Füst, Virág, Bolygó)**, 5. **M9 folyadék-határ**, 6. **M10 teljes** — ezek is összevonhatók egy 2. nagy menetbe.

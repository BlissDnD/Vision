# Addon- és presetcsomag — közös checklist

**Frissítve: 2026-10-18 · ellenőrzött alap: 0.48.0-m10a.**
Ez a csomag rövid állapotkapuja a felhasználónak és minden agentnek. **Tervbe véve ≠ beépítve ≠ felhasználóval kipróbálva.**

## A teljes vállalt lista megvan

- [x] **63 addon + 2 layout** fejlesztési feladathoz rendelve: [mind a 65 tétel](ADDON-INTEGRACIOS-TERKEP.md#3-a-63-modul-konkrét-beemelési-térképe).
- [x] **96 új ötlet** feladathoz rendelve: 20 irány + 32 recept/világ + 24 Megjelenés/viselkedés + 20 effektlánc: [mind a 96 azonosító](IDEAK-ES-RECEPTEK-UTJA.md).
- [x] A készítéskor meglévő **72 elemtípus és 54 recept** külön leltározva: [teljes leltár](../spec/VEL-TELJES-ELEMLELTAR-ES-FEJLESZTESI-OTLETTAR-2026-10-18.md). Ezek nem újonnan vállalt presetek.

## Ami már bent van a csomag végrehajtásából

A pipa itt **kódban megvalósult, teszttel demonstrált szeletet** jelent; a felhasználói próba még hátra van. Nem zárja a teljes addon- vagy feladatcsaládot.

- [x] **CAT-01 első két szelet:** stabil ID, szinonimás keresés, négy szerepszűrő, nyolc téma.
- [x] **U5 / COLOR / UI első szelet:** közös színválasztó, saját OKLCH/RGB átmenet, harmóniák, saját paletták, színösszesítő, kontrasztsegéd, színráhúzás, saját gyorseszköztár és munkatér-elrendezések. A #19/#20/#38/#57/#63 addonok céljával átfedő natív megoldás; nem öt teljes külső addon integrációja. **Korlát:** CPU-palettás elemekre még nem hat a saját átmenet; külön színkerék nincs igazolt kész tételként.
- [x] **M10 korai / LAYOUT:** Magazinrács (WIDE utáni saját tanulmány, öt kompozíció, élő szöveg, képarányok) és Szövött galéria (Unwoven natív shader/geometria-port). **Korlát:** nem eredeti WIDE-port; Unwoven húzásos görgetés nincs.
- [x] **STAB-01 mini:** jelenetképek és hang beágyazása, képek egyszeri tárolása, exportbezáráskor megszakítás, árva Kapcsolatok takarítása. **Nem teljes BASE/EXPORT megvalósítás.**

Pontos viselkedés, tesztek és korlátok: [PROGRESS legfelső bejegyzései](../../PROGRESS.md); layoutkód: [layouts.ts](../../app/src/layouts.ts).

## Amihez már van natív alap, de az addoncsomag feladata még nyitott

- [ ] **Részecske / fizika / folyadék:** E1, F2, F1 működik; a kapcsolódó addonok feljavító integrációja, közös mezők, ütközésjelzés, folyadékhatárok és testreakciók nincsenek teljesítve.
- [ ] **Útvonal / szöveg / kamera / anyag / fény:** P2, T6, K3, MAT1, FÉNY2 működik; a kapcsolódó laboraddonok feldolgozása ettől még nem lezárt.
- [ ] **Média:** PH1 12 darab 2D textúrája és vektoros Lottie működik; HDR/PBR és általános modellimport még hátra van.

Párosítás és kötelező addon-feljavítás: [TRIAGE 5–6. pont](TRIAGE-01-EREDMENY-2026-10-18.md#5-szabály-átfedő-addonok-a-felhasználó-döntése-2026-10-18); funkciónkénti határok: [FUNKCIO-LELTAR](../../FUNKCIO-LELTAR.md).

## Ami még nincs teljesítve a csomagból

- [ ] **A 63 addon teljes feldolgozása és integrációja.** Minden #01–#63 tétel megmarad a [részletes térképen](ADDON-INTEGRACIOS-TERKEP.md); a fenti részeredmények nem törlik a maradékot. Fő nyitott csoportok: formaépítés/import, HDR/PBR/LUT, rig/IK/modellanimáció, atlaszok, hangsegédek, teljes export- és teljesítményfejlesztés.
- [ ] **A 96 ötlet teljes megvalósítása.** Mind a négy azonosítósorozat követendő: Ö01–20, ÚR01–32, MÖ01–24, LÁNC01–20. A meglévő hasonló alkatrész nem kész új recept. [Tételes útvonalak](IDEAK-ES-RECEPTEK-UTJA.md).
- [ ] **M7 maradék, M8 közös Mező + Érintés jelez, M9 folyadékhatárok, M10 teljes receptcsalád és animált Random.** [Aktualizált sorrend: TRIAGE 6. pont](TRIAGE-01-EREDMENY-2026-10-18.md#6-fő-ütemterv-a-csomag-hullámai-a-mai-állapotra-igazítva-a-felhasználó-döntése-a-csomag-a-fő-irány--m10).
- [ ] **M6b szalagos stúdiórecept:** a felhasználó kérésére kihagyva ebből a menetből; nem kész, nem automatikusan újraindítandó.
- [ ] **Felhasználói látványpróba és valódi GPU/4K-mérés** az elkészült szeletekre.

## Kötelező az agenteknek

1. Induláskor ezt és a [HANDOFF-ot](../../HANDOFF.md) olvasd. A backlog `prepared` mezői és a csomagellenőrzés a készítéskori tervet jelzik, nem élő implementációs állapotot.
2. Szelet végén ezt a checklistet is frissítsd: mi került be, mi maradt ki, részlet/teszt/korlát linkkel. Teljes családot csak a tételes követelmények teljesülésekor pipálj ki.
3. A 65 + 96 tételes listából semmi nem hagyható el csendben. Halasztást, helyettesítést vagy elvetést az adott azonosítónál, indokkal és felhasználói döntéssel rögzíts.
4. Natív átfedésnél ne állítsd beépítettnek a laboraddont bizonyíték nélkül; a forrás átnézését és az átvett javítást nevezd meg. A mérföldkő-jóváhagyás szabálya változatlan.

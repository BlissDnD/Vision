# Rövid élő csapatállapot

**2026-10-18:** a termékfejlesztés elindult; CAT-01, STAB-01 mini, U5 és M10 korai szeletek demonstrálva (0.48.0-m10a). A teljes csomag nincs kész. Élő lefedettség: [CSOMAG-CHECKLIST.md](CSOMAG-CHECKLIST.md); a régi előkészítési snapshotok nem implementációs státuszok.

| Hullám | Nagy task | Gazda | Függő segítő feladat | Státusz | Következő lépés |
|---|---|---|---|---|---|
| 2b+3' | U5 + CAT-01 témák + M10 korai | Claude | – | **demonstrálva (0.48.0-m10a)** | felhasználói próba; M6b kimaradt |
| 2a | STAB-01 mini | Claude | – | **demonstrálva (0.44.0-stab1)** | felhasználói próba |
| 1 | CAT-01 első szelet | Claude | – | **demonstrálva (0.45.0-cat1)** | felhasználói próba; 2. szelet: témák |
| 0 | TRIAGE-01 | Claude | – | **kész (2026-10-18)** | Eredmény: `TRIAGE-01-EREDMENY-2026-10-18.md`; következő: STAB-01 mini, majd U5 vagy M6b (felhasználói döntés) |

## Foglalások

Nincs termékkód-foglalás. A következő integrátor induláskor rögzítse a tényleges writer-listát, base commitot és szerződést. Worker nem találgatja, ki írhat közös fájlt.

## Rögzített irányok

- 4 fő szerep + témák/szűrők; stabil ID és régi payload olvasása.
- 1 nagy feladat + kis izolált hozzájárulások; közös hotspot egy író.
- Saját jobb megoldás megengedett a jóváhagyott cél és vizuális minőség megőrzésével.
- A teljes leltár referencia; a rövid taskkártya az elsődleges végrehajtási kontextus.

A backlog státuszát és ezt a táblát ugyanaz a koordinátor frissítse. Az aktuális projekt HANDOFF továbbra is az élő termékállapot elsődleges forrása.

## Későbbi, még nem kiosztott irányok

SCENE-01: pár kattintásos artisztikus 3D tájépítés, közös tér és automatikus fény. AI-PREVIZ-01: filmes/képi generátorokhoz referencia- és animatikmód. Mindkettő `deferred`, nincs aktív implementáció vagy külső generálás.

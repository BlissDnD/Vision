# final-updates – ebből dolgozunk

## Melyik verzió az érvényes?
**Érvényes változat (felhasználói döntés, 2026-10-18): a `claude/english-wa1-2419a5` ág.** Ebben van együtt az angol lokalizáció és a WA1 (Web Awesome). Az ág a WA1 két párhuzamos változatából egyesítette a jobbat. A `claude/project-organization-ui-update-746ad1` ág WA1 commitja (`048ca1d`) és a `claude/hogyan-folytatjuk-868702` ág félkész munkája **elavult**, ne ebből dolgozz.

## Prioritások (felhasználói döntés, 2026-10-18)
Mindkettő **prioritás**, a kettő egymáshoz képesti sorrendjét a felhasználó még nem mondta meg:
1. **UI-frissítés** (`UI-UPDATE.md`): angol fordítás lezárása → Web Awesome WA1 → Megjelenés fül, 3D anyag, Light mód, rétegek, maszkolás, Könyvtár, animációk.
2. **Addon- és presetcsomag** (`../claude-handoff/CSOMAG-CHECKLIST.md`): 63 addon + 2 layout, 96 ötlet, M7 maradék, M8, M9, M10, valódi GPU/4K-mérés. A checklist a kötelező állapotkapu.
Ami a checklistben nyitott, az nem kerül a `future-updates`-be: az prioritás, nem „majd egyszer".


- [CHATGPT-TASKS.md](CHATGPT-TASKS.md): előkészítő feladatok ChatGPT-nek (fordítás, tooltipek, ikonok, Web Awesome kutatás).
- [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md): a Vel design system tervezete (színek, vezérlők, elrendezés) – jóváhagyásra vár.
- [PRESET-KESZLET.md](PRESET-KESZLET.md): sablon + szabályzat új presetek kéréséhez a ChatGPT-től (webes ChatGPT-vel is).
- [UI-UPDATE.md](UI-UPDATE.md): a következő nagy menet feladatlistája (Web Awesome design system, Megjelenés fül, 3D anyag, Light mód, rétegek, maszkolás, könyvtár, animáció) + a félbehagyott angol fordítás és tooltipek. A felhasználó eredeti szövegével.

Szabály: minden feladat ide kerül, amikor aktuális lesz; ami kész, ott „demonstrálva/kipróbálva” jelölést kap. A hibák nem ide, hanem a `../../BUGS.md`-be mennek.

# docs – hol mi van (egyszerű térkép)

| Mappa / fájl | Mi ez | Mikor nyisd meg |
|---|---|---|
| **final-updates/** | Az aktuális munka: feladatlista, amiből dolgozunk | Mindig először ezt |
| **future-updates/** | Jegyzetek arról, mit kell majd csinálni | Ha új ötleted van, ide írd |
| `../BUGS.md` | Hibalista | Hibát itt jegyzünk |
| `../HANDOFF.md`, `../PROGRESS.md`, `../FUNKCIO-LELTAR.md` | Hol tartunk, napló, mi van ténylegesen kész | Agenteknek; ritkán kell kézzel |
| spec/ | Régi követelmények és tervek (referencia) | Csak ha kérdés van egy régi döntésről |
| claude-handoff/ | Régi többagentes csomag és feladatkártyák | Referencia |
| javaslatok/, audit/ | Egy-egy lezárt szelet javaslata/ellenőrzése | Referencia |
| referenciak/ | Külső minták, képek | Referencia |
| archiv/ | Elavult átadók | Nem kell |

Elv: **ami aktuális, az a final-updates-ben van; ami később, az a future-updates-ben; a többi referencia.** Egy dolognak egy helye van.

## A régi fejlesztési terv sorsa
`spec/vel-fejlesztesi-terv-jovahagyasra.md` és társai nem törlődtek (a kód és a tesztek hivatkozhatnak rájuk), de **nem vezetik** a munkát:
- Amit a terv már megvalósított, a `../FUNKCIO-LELTAR.md`-ben van jelölve.
- Ami hiányzik és még él, azt a `future-updates/FUTURE-IDEAS.md` gyűjti.
- Ami a UI-frissítéssel változik (könyvtár szerkezete, panelek), azt a `final-updates/UI-UPDATE.md` írja felül.
- **Felülírva:** `spec/VEL-MATERIAL-DESIGN-SYSTEM.md` (Material 3) → a design system Web Awesome.

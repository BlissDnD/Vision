# Előkészített javítások más agenteknek (2026-10-18)

Nincs beépítve a fő ágba. Aki a területen dolgozik, alkalmazza és futtassa a célzott tesztet.

## 1. `bugfix-orphan-link-polyhaven.patch` (`git apply`)
- **Árva kapcsolat (BUGS.md, Kapcsolatok):** `src/history.ts` `setShared` betöltéskor eldobja azt a Kapcsolatot, amelynek mindkét vége hiányzik (`linkEnd`: réteg/fx, `id.` előtag vagy Közös alapban lévő elem). Teszt: `tests/bug_orphan_link.js`.
- **Ingadozó Poly Haven teszt (BUGS.md, teszt):** a fix 120 ms helyett max. 3 mp-ig vár a képrétegre.
- Typecheck 0 hiba. A célzott tesztek kimenetét még ellenőrizni kell (`tests/run.py`).
- Alkalmazás után: BUGS.md két sorát „javítva”-ra.

## 2. K1 „Vezérelje” forrásparaméter (nem kódolt, terv)
Hely: `src/linkcord.ts` (a választókártya). Javaslat: létrehozás előtt a kártyán „Forrás → Cél” sor, a forrás legördülőben cserélhető; az első javaslat az a paraméter, amelyiknek kulcsa vagy hulláma/mozgása van (`p.size` hullám előbb, mint `n.x`).

## 3. Következő jóváhagyandók (HANDOFF szerint)
U5 (színösszesítő + színforrás-szabály, gradiens, action bar) vagy U2. Mindkettőhöz a spec 13. fejezete szerinti javaslat kell, a felhasználó jóváhagyásával.

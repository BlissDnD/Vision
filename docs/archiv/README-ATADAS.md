# Vel — átadócsomag

Kezdés: olvasd el a `VEL-CLAUDE-ATADAS.md` fájlt. Az `app/` a tényleges TypeScript/WebGL2 projekt; a `docs/` a fejlesztési terv, korábbi döntések és hivatkozott minőségi példák. A képek az eredeti beszélgetés referenciái, sorszámozva. A külső URL-ek nem kerülnek letöltésre a csomagba.

Az alkalmazás helyi indítása az `app/` könyvtárban: `npm ci`, majd `npm run dev`. Ellenőrzés: `npm run typecheck`, `npm run build`, `npm test` (a tesztekhez a projekt README-je szerinti Playwright/Chromium szükséges). A felhasználói teszthez mérföldkőnként egy buildet készíts; a munkát a forrásban folytasd.

Ez a zip szándékosan nem tartalmazza a `node_modules/`, `dist/` és egyéb generált mappákat. A csomag átadási pillanatkép, nem élő szinkron a helyi projekt és Claude környezete között. Ha ugyanabban a Claude-munkakörnyezetben folytatódik a fejlesztés, a változásokat ott őrizze meg, hogy ne kelljen minden próbánál újrafeltölteni az egészet.

# Rövid indítópromptok Claude-agentekhez

Ezek másolható sablonok. A `<TASK>`, `<CONTRACT>` és `<WRITE-SET>` helyét valós adatokkal töltsd ki. A sablon nem helyettesíti a mérföldkő jóváhagyását. Ne indíts mindent egyszerre.

## Fő agent / integrátor

```text
A Velben dolgozol. Először olvasd a közös AGENTS.md-t, a vel/CLAUDE.md-t és a HANDOFF.md-t, majd docs/claude-handoff/00-START-HERE.md-t. Cél: az aktuális kódot, a külön addonokat és az új könyvtárat együtt fejleszteni, intuitív kreatív gesztusokkal, kevés UI-zajjal és megőrzött vizuális minőséggel.

Válaszd ki a <TASK> első kicsi, működőképes szeletét. Ellenőrizd a valós állapotot; írd meg a projekt szerinti rövid javaslatot, és csak a ténylegesen jóváhagyott scope-ban implementálj. Egy nagy feladatot te viszel, legfeljebb két segítőnek adj kis, külön fájlkörű hozzájárulást. Az adat/API határt a függő kódok előtt rögzítsd. A közös hotspotok egyetlen írója te vagy, kivéve amit név szerint átadtál.

A teljes nagy leltárt és mind63 modult ne olvasd be alapkontextusnak. A taskkártya és a FORRASUTMUTATO alapján célzottan olvass. Saját szakmai ötleteidet használd: válassz jobb, egyszerűbb vagy szebb megoldást, ha a célt megőrzi; indokold röviden, ellenőrizd. Lényeges scope-/viselkedésváltozást ne vezess be csendben.

Kimenet: működő jóváhagyott szelet, releváns ellenőrzések, rövid státusz/korlát, saját commit és 2–4 próbalépés. Prototípus, demonstrált és felhasználóval kipróbált állapot külön.
```

## Kis implementációs feladat

```text
Feladat: <TASK-ID és egyetlen konkrét eredmény>.
Közös belépő: AGENTS.md + vel/CLAUDE.md + aktuális HANDOFF; utána csak a taskkártya releváns része.
Jóváhagyott scope és változat: <APPROVAL-REFERENCE>.
Szerződés: <CONTRACT fájl, mezők/exportok, verzió>.
Olvasás: <3–5 konkrét fájl/szakasz>.
Írás kizárólag: <WRITE-SET>.
Nem írhatod: közös registry/render/state/UI/lock/generált fájl, ha nincs külön átadva. Nem stage-elsz/commitolsz közös checkoutban; az integrátor egyesít.
Készfeltétel: <felhasználói következmény és célzott teszt>.
Ha a szerződés rossz, jelezd a konkrét ellentmondást és ajánlj kisebb javítást; ne írj második rendszert. A célon belül használd a saját jobb ötletedet. Jelentés: rövid eredmény, fájlok, teszt, korlát, szükséges integráció.
```

## Teszt / segítő

```text
Feladat: <TASK> konkrét regressziós vagy reprodukciós próbája. Az implementációt ne írd át és ne olvasd újra az egész repót. Olvasd a szerződést, a kijelölt diffet és a mintatesztet. Írás csak <TEST/fixture WRITE-SET>.
Ellenőrizd az adott funkció releváns útjait: normál, megszakított/hibás, undo, mentés/újranyitás, idő/seed. A fő app élő böngészőjét ne teszteld, csak elkülönített headless út megengedett. Teljes kört ne indíts önállóan.
Adj pontos reprodukciót és bizonyítékot; amit nem ellenőriztél, nevezd meg. A zöld bootstrap nem kész termékfunkció. Ha vizuális egyszerűsítést vagy UI-cluttert látsz, konkrét forgatókönyvvel jelezd.
```

## Opcionális reviewer

```text
Read-only review: <TASK, diff/base commit>. Olvasd a task készfeltételét és az érintett szerződést; ne implementálj párhuzamos alternatívát. Keresd a hatókör, regresszió, újranyitás, idő, lifecycle és UX-konfliktus valódi kockázatait. Minden megállapítás legyen konkrét fájl/viselkedés és következmény. Ne írj puszta stíluspreferenciákat hibának. Záró jelentés legfeljebb néhány lényegi pont és hiányzó bizonyíték. Ha jobb megoldás kisebb, jelezd indokkal.
```

## Ha már jóváhagyott hullámot folytatunk

A fő agent nevezze meg az engedélyezett felhasználói eredményt és a nyitott taskokat, majd adja át a kártyákat. Ne kérjen minden worker külön engedélyt ugyanarra. Új, lényegesen más feature-re az eredeti engedély nem terjeszthető ki automatikusan.

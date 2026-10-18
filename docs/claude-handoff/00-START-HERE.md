# Vel – Claude belépési pont

**Miksa kérése:** a meglévő Vel, a külön addonok és az új elemkatalógus együtt fejlődjenek. Az intuitív, kreatív interakció, a közvetlen kontroll, a magas vizuális minőség és a kevés UI-zaj minden feladatra kötelező. Egy fő agent dolgozzon egy nagyobb szeleten; a többiek kisebb, elkülönített feladatokkal vagy teszttel segítsék.

**Ez előkészítő csomag.** Nem állítja, hogy a benne tervezett képességek már működnek. Nem önálló Vel-forráscsomag: a repository gyökeréből használd. A hordozható ZIP mellékelt kontextusmásolatokat is tartalmazhat, de implementációhoz az aktuális repo szükséges.

## Első 5 perc

1. Először a közös `../../../../AGENTS.md`, utána a projekt `../../CLAUDE.md` és `../../HANDOFF.md`. A projekt saját szabályai irányadók.
2. Olvasd el az [állapotot](ALLAPOT-ES-HATAROK.md), a [munkarendet](AGENT-MUNKAREND.md) és a [fejlesztési sorrendet](FEJLESZTESI-TERV.md). Ne töltsd be az összes mellékletet.
3. Ellenőrizd az aktuális branch/verzió/dirty fájlok helyzetét; a pillanatképet vesd össze a valósággal. A másik munkamenet módosításait őrizd meg.
4. Válassz egy konkrét szeletet a [backlogból](data/backlog.json), olvasd csak a hozzá tartozó `tasks/<ID>.md` kártyát és célzott kódtérképrészt.
5. Írj rövid mérföldkyorső-javaslatot a projekt szabályai szerint. A mostani engedély az előkészítésre szól. Jövőbeli termékfejlesztést csak a korábban vagy most kifejezetten jóváhagyott hatókörben indíts; egy összefüggő hullám több kisebb feladata egyben jóváhagyható.

## Alapelvek

- **Ne építs mindent egyszerre.** Egy láthatóan használható függőleges szelethez csak a szükséges közös alapot készítsd el.
- **Ne add hozzá újra, ami már van.** Lebegés/Forgás/Lüktetés/Keringés/Remegés/Rugalmas beúszás, a vektoros Lottie és a 12 elemes Poly Haven 2D import már szerepel a forrásban.
- **Ne váljon újabb felületi réteggé minden funkció.** Meglévő vezérlő, közvetlen vászongesztus, kontextusos művelet vagy változatcsalád előnyben.
- **A kategória feladatot jelöljön:** Receptek / Elemek / Megjelenések / Mozgások. Űr/Természet/Tipográfia témagyűjtemény; 2D/3D/Saját szűrő; formaépítés eszköz, nem preset. Ez új UX-irány, a technikai típusazonosítókat nem nevezi át.
- **Gondolkodj önállóan.** Használd a saját szakmai megítélésedet. Ha egyszerűbb, szebb, érthetőbb, olcsóbban fenntartható megoldást látsz, javíts a terven a jóváhagyott célon belül. A választást röviden indokold és ellenőrizd. Lényeges felhasználói viselkedést, vizuális célt vagy scope-ot ne gyengíts és ne változtass meg csendben.
- **Megőrzendő:** egy jelenetóra, seedelt véletlen, mentés–újranyitás, egy gesztus/egy undo, a régi projektek, az önálló HTML-kimenet és az eredeti presetek jó vizuális karaktere.
- **Párhuzamosság:** 1 nagy implementáció + legfeljebb 2 kisebb segítő feladat; opcionális reviewer a szabad kapacitástól függően. Egy megosztott fájlnak egyszerre egy írója lehet. Ha csak két agent van, egy implementál, egy segít/ellenőriz.

## Téma szerint innen folytasd

| Feladat | Olvasd |
|---|---|
| Kategóriák, kereső, preview, kreatív gesztusok | [UX-ES-KONYVTAR.md](UX-ES-KONYVTAR.md) |
| Közös adatok és renderhatárok | [ARCHITEKTURA-ES-SZERZODESEK.md](ARCHITEKTURA-ES-SZERZODESEK.md) |
| Egy addon célzott kiválasztása | [ADDON-INTEGRACIOS-TERKEP.md](ADDON-INTEGRACIOS-TERKEP.md) |
| Az összes96 új ötlet fejlesztési útja | [IDEAK-ES-RECEPTEK-UTJA.md](IDEAK-ES-RECEPTEK-UTJA.md) |
| Régi követelmények és A–G kapcsolatok | [FORRASUTMUTATO.md](FORRASUTMUTATO.md) |
| Vizsgálat, vizuális minőség, release | [ELLENORZES-ES-ATADAS.md](ELLENORZES-ES-ATADAS.md) |
| Kész agentindító szövegek | [AGENT-INDITO-PROMPTOK.md](AGENT-INDITO-PROMPTOK.md) |
| Előkészített keresési modell és pillanatkép | [preparation/README.md](preparation/README.md) |
| Későbbi fő cél: gyors 3D táj és filmes AI-vázlatmód | [JOVO-3D-SCENE-ES-AI-VAZLAT.md](JOVO-3D-SCENE-ES-AI-VAZLAT.md) |
| Élő csapatállapot | [STATUS.md](STATUS.md) |

## Mit NE olvass be egyszerre?

A teljes elemleltár ~230 KB, a labor 63 modul és sok licenc; ezek referencia, nem minden agent alapkontextusa. A forrásútmutató és a feladatkártya megmondja, melyik rész kell. Az agent eredménye rövid összefoglaló + fájl/commit + teszt + korlát legyen, ne a teljes forrás visszamásolása.

**Első ajánlott implementációs javaslat:** CAT-01 első szelete: egységes katalógusmetaadat és visszafelé kompatibilis keresés/csoportosítás, az aktuális Velre építve. Segítők: név-/szinonimaadat és célzott teszt. A T2 bolygó-, fizika- és emittermunkák közben külön kísérletként előkészíthetők, de nem mind egyszerre a fő renderben.

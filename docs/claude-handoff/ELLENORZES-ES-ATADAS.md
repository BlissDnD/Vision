# Ellenőrzés, vizuális minőség és átadás

## A bizonyíték szintje

1. Tiszta modulteszt: az algoritmus/adat helyes az adott esetekre.
2. Adapter/headless: az adott termékút működik a tesztkörnyezetben.
3. Képi összevetés: a megadott nézet/seed/idő mellett megmaradt a vizuális karakter.
4. Célgépes mérés: tényleges GPU, felbontás, memória és frame/export-idő.
5. Felhasználói próba: Miksa a kívánt gesztust megérti és használja.

Egyik alsóbb szint sem igazolja automatikusan a fölötte lévőt. A headless SwiftShader nem M1 Max GPU-mérés. A csomag 13 keresőmodell-tesztje csak előkészítő bizonyíték.

## Mit tesztelj az adott szeletben?

| Változás | Kötelezően releváns próba |
|---|---|
| Katalógus/keresés | Minden régi bejegyzés mapping; azonos ID több témában; név/alias/feladat; saját preset; régi drag; fókusz |
| Preview/kontextus | Cancel/blur/célváltás után ugyanaz a projekt; async késés; egy apply/undo; loading/hibás shader |
| Új numerikus/motion adat | Régi projekt normalizálás; A→B→A; Loop nélkül; Paraméter-Eljátszás és Animálás mód |
| Asset/import | Hiányzó/hibás függőség; clean reopen; scene/base/saját függőségek; félbeszakítás; tartós saját kép/font/modell |
| Shader/mesh/anyag | Régi referenciák; alpha/színtér/rétegsorrend; felbontás/resize; fény; seek és erőforrás-felszabadítás |
| Emitter/fizika/fluid | Fixed-step/replay/checkpoint; hosszú seek; paraméter-érvénytelenítés; seed; local scene time; project reset |
| Layout/recept | 1:1, 4:5, 9:16; rövid/hosszú ékezetes szöveg; kép/fókuszpont csere; 3–6 érthető makró |
| Export/video | Hangszinkron, abort/error cleanup; időmapping; output visszaolvasás; csúcsmemória; támogatott fallback |

Csak a változáshoz szükséges sorokat alkalmazd. A célzott próba ne egyszerűen az implementáció kódját ismételje meg; felhasználói következményt ellenőrizzen.

## Parancsok – a Vel gyökeréből az appba lépve

```sh
cd app
npm run typecheck
node scripts/build.mjs --test --dev
.venv/bin/python tests/run.py dist/latomas.test.html tests/<target>.js
```

A szelet végén, a szükséges közös integráció után egyszer:

```sh
.venv/bin/python tests/run_all.py
npm run build
```

A production build a generált CODEMAP/preset-formátum/HTML fájlokat is érintheti. Ezeket az integrátor kezeli; ne írják kézzel a workerek. Dokumentáció-only módosítás miatt ne futtasd az egész appot, ha nincs erre külön indok.

A külön labor saját parancsai a README-jében vannak. A régi laberedmény nem helyettesíti a beépített új adapter saját tesztjét. Az élő Velböngészőt ne teszteld: a projekt szabálya szerint azt Miksa próbálja. Fej nélküli, elkülönített teszt megengedett.

## Vizuális alap és clutter-próba

Módosítás előtt/után ugyanazon seed/idő/méret/fény/paletta. Szalagoknál vékonyság és kifakulás; bolygónál horizont/légkör/felhő/gyűrű; anyagnál csúcsfény/érdesség; tipográfiánál olvashatóság és kerning. A látványt nem szabad egyszerűsíteni csak azért, hogy könnyebb legyen az adapter.

A fő feladatot négy konkrét jeleneten is érdemes kézzel átadni: bolygó a háttérben, erős tipográfiai poszter, részecskés jelenet, fotós/layoutos kompozíció. Csak ahol a szelet ténylegesen érinti őket.

Clutter-ellenőrzés: nyugalmi nézetben csak a releváns fogantyúk; legfeljebb egy nyitott kontextusfelület; Részletek összecsukható; nincs minden funkcióhoz új felső sor; billentyűzetes alternatíva és világos aktív cél. Az icon-only sűrítés nem helyettesíti az érthető feliratot/fókuszt.

## Teljesítménykapu – célok, nem mai eredmények

A UX-spec 1000 rekordos keresésére javasolt p95≤50 ms és input→eredmény≤100 ms tesztelendő cél a rögzített mérőgépen. A képi rendszerhez ne találj ki egyetlen mindenre érvényes ms-határt: baseline az adott eszközön, 1080p és releváns4K jelenet, CPU/GPU/feltöltés/export bontás, memória és többletcsomagméret. Új dependency költségét beemelés előtt mérd.

Kisebb ideiglenes előnézeti minőség jelzett; nem írhatja át csendben a mentett effektértékeket. A pontos export legyen reprodukálható. Ha csak statikus kép vagy csak egy host támogatott, az a kártyán/részletekben egyértelmű.

## Mikor kész egy szelet?

- A jóváhagyott felhasználói út működik, a releváns hibás és megszakított út is takarít.
- Régi működést nem veszítettünk; egy undo, mentés, idő és vizuális következmény ellenőrzött.
- Teszteredmény + pontos határ + ismert korlát rögzítve, nem egyetlen zöld „check” mindenre.
- `PROGRESS.md`, `FUNKCIO-LELTAR.md`, `HANDOFF.md`, szükség esetén `BUGS.md`, rövid app README és a task státusza frissül. Nem állít késznek teljes A–G szakaszt.
- Saját fájlokból commit, majd 2–4 egyszerű próbalépés Miksa számára; build: `app/dist/index.html`.

Lásd az átadósablont a `templates/RESULT.md` alatt.

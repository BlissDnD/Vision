# Lottie első szelet: ellenőrzés a mostani kóddal szemben (Claude, 2026-10-18)

Átnézve: `docs/spec/VEL-KULSO-MEDIAK-IMPORT-ELŐKÉSZÍTÉS-2026-10-18.md`, `docs/javaslatok/LOTTIE-MEDIA-IMPORT-ELSO-SZELET-JAVASLAT.md`, `docs/spec/vel-media-import-core-prototipus.mjs` (+ teszt). A prototípus 5/5 tesztje zöld (`node --test`). Kódot nem írtam.

**Összegzés:** az irány jó, így beépíthető. A javaslat megvalósítása előtt az alábbi 8 pontot kell pótolni vagy eldönteni; az 1–3. hiba nélkül a funkció félremegy.

## Kötelező javítások

1. **A vászonra/ablakra ejtett `.json` ma a preset-ablakba megy.** A `src/presets.ts` globális `drop` figyelője minden `.json`-t elkap (könyvtárfájl → import, projekt/preset → beillesztő ablak). A Lottie-felismerést **ide, a preset-ág elé** kell tenni: Lottie = van `v`, `fr`, `ip`, `op`, `w`, `h`, `layers` (és nincs `app:'vel'` / `state` / `kind`). Különben a felhasználó Lottie-ja hibát ad a preset-ablakban.
2. **Szövegréteg előkompozícióban átcsúszik.** A validátor csak a felső szintű `layers`-ben tiltja a `ty:5` (szöveg/font) réteget; az `assets[].layers` (precomp) belsejében lévőt nem (kipróbálva: elfogadja). Fontot kérne. Javítás: a bejárás minden `layers` tömbjében ellenőrizze a `ty:5`-öt (és a `ty:2` képréteget is, ami most kép-asset nélkül átmegy).
3. **Az automatikus mentés elveszítheti a Lottie-t.** A `history.ts` `scheduleSave` a `localStorage`-ba ment; ha a kvóta betelik, a tartalék ág `assets:{}`-szel ment újra. Egy vagy több 2 MB-os vektor-JSON ezt könnyen kiváltja, és a következő betöltéskor a réteg „hiányzó asset” lesz. Kell: a `vectorAssets` a tartalék ágban is maradjon meg (vagy IndexedDB, mint a `thumbstore.ts`-nél), és látható figyelmeztetés, ha nem fér el.

## Pontosítandó a javaslatban

4. **„Kezdet a Sávokon” nincs mihez kötni.** Nincs ma időalapú médiaréteg; a rétegenkénti `L.kloop` a **kulcsanimáció** ismétlése, nem a médiáé. Javaslat: a Lottie-réteg saját, automatikusan animálható paraméterei: `start` (mp), `speed`, `loop` (kapcsoló). Ezek mennek a `sampleLottieFrame`-be. Külön Sávok-blokk (húzható klip) csak akkor, ha a felhasználó kéri; az nagyobb munka (`timeline.ts`).
5. **Melyik lottie-web build.** Nincs még függőség (`package.json`). A teljes `lottie.min.js` tartalmazza az expression-motort (`eval`); a **`lottie-web/build/player/lottie_light_canvas`** build nem, és kisebb. Ezt használjuk, így a `runExpressions:false` csak második védvonal. Licenc: MIT (a fejlécben jelölni). Méret: a mostani build 891 KB; mérjük a növekedést.
6. **Felbontás és több nézet.** A Lottie-kép ugyanazt a rétegpályát használja, mint a `image` réteg (`mediaFor` → `uImage`, `uImgSize`). A vásznat ne fix 512 px-re rajzolja: a méret a réteg kijelzett méretéhez és a kimeneti felbontáshoz igazodjon (4K-nál élesebb, legfeljebb 4096 px). Ugyanazt a réteget a bélyegkép, a kijelölés (`pick.ts`), a Random minőségszűrő (`rndq.ts`) és a Jelenetek más időpontban is renderelik, ezért a gyorsítótár kulcsa legyen asset + képkocka + méret, és minden hívás előtt `goToAndStop` a kért frame-re.
7. **Export.** A WebCodecs MP4 (`output.ts`) képkockánként, jelenetidőből renderel: jó. A valós idejű MediaRecorder-ág is jelenetidőt ad, így a szinkron megmarad. Tisztán vektoros fájlnál a canvas-renderer szinkron, nem kell várni; ezt a tesztben ellenőrizni kell (renderelés közvetlenül `goToAndStop` után).
8. **Projektformátum.** A `vectorAssets` új, felső szintű mező a `projectJSON`-ban, csak a használt rétegek rekordjaival (mint a `usedAssets`). A `PROJECT_VER` (4) emelése nem kell, ha a hiánya = üres; régi projekt teszt kell. Az `applyProject` a `vectorAssets`-et **ne** adja a `loadAsset`-nek. Megjegyzés: a Q1 óta a fájlban van egy felső szintű `taste` mező is; ne írja felül.

## Ami jó, ahogy van

- A `parseVectorLottie` korlátai (2 MB, mélység, csomópontszám, méret, fps, `__proto__`/`constructor` kulcs, expression `x` szövegként, kép-asset, font-lista) működnek; a nagy, szám-tömbös fájl gyorsan átmegy, a sok kis objektumos elutasítva.
- `sampleLottieFrame`: csak a jelenetidőtől függ, seek-független, Loop-nál körbeér, a végén az utolsó képkockán áll, a kezdés előtt `null` (= nem rajzol). Ez illik a Vel `renderScene(…, t)` / `mediaFor(L, t)` szerződéséhez.
- A `texFromCanvas` egyenes (nem premultiplikált) alfát tölt fel, az `image` shader ezt várja, így az áttetsző Lottie helyes lesz.
- Az Imgur/GIF-segédfüggvények most nem kellenek; maradjanak a későbbi szeletre.

## Javasolt célzott teszt (a javaslat próbáin felül)

Egy kis beágyazott, csak vektoros Lottie (pl. egy mozgó kör) a tesztben: rétegként elhelyezve két időpontban más a pixel, ugyanabban azonos (seek oda-vissza); `start` előtt átlátszó; a Loop körbeér; mentés → `loadProject` → ugyanaz a kép; régi projekt `vectorAssets` nélkül megnyílik; szöveg precompban / kép / expression / 2 MB fölött elutasítva, és a `st.layers` nem változik; Lottie-fájl ejtése nem nyitja meg a preset-ablakot.

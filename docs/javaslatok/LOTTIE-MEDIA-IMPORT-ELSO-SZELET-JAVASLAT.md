# Javaslat Claude-nak — Lottie vektoranimáció első szelete

Állapot: **jóváhagyva és L1 első szeletként megvalósítva** (2026-10-18; élő felhasználói próba hátra). A felhasználó a „te csinálod” kéréssel bízta rám. A részletes technikai átadó: `docs/spec/VEL-KULSO-MEDIAK-IMPORT-ELŐKÉSZÍTÉS-2026-10-18.md`. A kódellenőrzés nyolc észrevétele: `docs/javaslatok/LOTTIE-ELSO-SZELET-ELLENORZES.md`.

## Mit tud majd a felhasználó

Egy saját, csak vektoros Lottie `.json`-t behúz vagy kiválaszt, előnézetben megnézi, és egy kattintással animált rétegként a vászonra helyezi. A Sávokon **külön, kompakt média-blokkját** mozgatva változtatja a kezdetét; a kiválasztott rétegen állítja a sebességet és a **média saját Loopját** (ez nem a kulcsanimáció `kloop` kapcsolója). Ráhúzhat meglévő Megjelenést. Visszatekerve és képkockánkénti MP4-exportban ugyanazt a képet kapja ugyanabban a pillanatban. A külön mentett projektfájl a kis vektor-JSON-t magával viszi.

## Pontosan mi épül

1. Biztonságos helyi JSON-ellenőrzés az előkészített `vel-media-import-core-prototipus.mjs` alapján: legfeljebb 2 MB, méret-/képkocka-/komplexitáskorlát, szöveg- és képréteg tiltása előkompozícióban is. A `.json` fájl ejtésekor a Lottie-felismerés a `presets.ts` globális preset-ága **elé** kerüljön; Vel-projekt/preset/könyvtár maradjon a régi útján. Hiba esetén nincs félig létrejött réteg.
2. A `lottie-web/build/player/lottie_light_canvas` build Canvas renderelője önálló óra és expression-motor nélkül, `runExpressions:false` beállítással is. Az előkészített `sampleLottieFrame` adja a frame-et a Vel jelenetidejéből. A WebGL-textúra csak az asset, a mintavételezett frame vagy a kért rajzméret változásakor frissül. Bélyegképnél, kijelölésnél, Jeleneteknél és exportnál is a hívás kért időpontja alapján rajzoljon; a 4K kimenethez megfelelő felbontású Canvas kell, legfeljebb a korlátig. Mérd a buildméret-növekedést is.
3. Külön `vectorAssets` a kicsi JSON-hoz. A külön letöltött projektfájl a használt vektor-JSON-t beágyazza; a böngésző automatikus mentése használjon tartós médiatárolót (például IndexedDB-t), ne csendben eldobott `vectorAssets`-et. Ha a tárhelyírás nem sikerül, látható figyelmeztetés kell. Betöltéskor hiányzó-asset jelzés; régi projekt és a kép-`assets` útvonal nem sérül, a felső szintű `taste` sem vész el.
4. Új Lottie-médiumréteg saját `start`, `speed`, `loop` beállítással és hozzá tartozó kompakt Sávok-blokkal. A blokk húzása a `start` értéket állítja. A kulcsanimáció Loopja külön marad. Meglévő Megjelenések alkalmazhatók, undo/redo működik. Nincs új általános assetkezelő felület ebben a szeletben.

## Ami ebbe a szeletbe nem fér bele

LottieFiles online kereső, külső képeket/fontokat tartalmazó Lottie, élő SVG-fallback, a betűk és alakzatok Vel-formákká bontása, összetett videószerkesztő-klip (vágás/proxy), Imgur/Unsplash/Poly Haven, nagy bináris médiák és ZIP-projektcsomag. Ezek következő, külön jóváhagyandó szeletek. A valós idejű MediaRecorder-felvétel nem ugyanaz, mint a képkockánként számolt MP4-export; a pontos egyezés próbáját az utóbbin végezd.

## Kipróbálás 3 lépésben

1. Húzz be egy áttetsző, csak vektoros Lottie ikont, tedd egy meglévő háttér fölé, változtasd a kezdetét és a sebességét.
2. Húzd a Lottie média-blokkját a Sávokon, ugorj az idővonalon oda-vissza két időpontra, kapcsold a média Loopját, majd mentsd és nyisd újra a projektet. A kép és a rétegbeállítás maradjon azonos; az automatikus mentés sem veszítheti el a médiát.
3. Exportálj rövid MP4-et; hasonlíts össze egy kiválasztott exportképkockát a vászonnal. Próbálj hibás/nagy/külső képes Lottie-t: érthető hiba, a projekt nem változik.

Mérés: 1080p és 4K előnézeti/export-frame idő, Canvas-rajzolás és GPU-feltöltés külön, egy és tíz animált réteggel. A teljes tesztkör csak a szelet végén fusson, az élő látványpróbát a felhasználó végzi.

## Hátralévő lista változása

A Lottie réteges import első változata „demonstrálva” állapotba kerülhet, ha a célzott és teljes tesztek sikeresek. A közösségi Lottie-k keresése, általános médiaimport és a nagy videó/PBR/fotó assetek továbbra is nyitottak. A felhasználói kipróbálás előtt ne jelöld „kész”-nek.
